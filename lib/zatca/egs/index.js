"use strict";
/**
 * This module requires OpenSSL to be installed on the system.
 * Using an OpenSSL In order to generate secp256k1 key pairs, a CSR and sign it.
 * I was unable to find a working library that supports the named curve `secp256k1` and do not want to implement my own JS based crypto.
 * Any crypto expert contributions to move away from OpenSSL to JS will be appreciated.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGS = void 0;
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const csr_template_1 = __importDefault(require("../templates/csr_template"));
const api_1 = __importDefault(require("../api"));

const OpenSSL = (cmd) => {
    return new Promise((resolve, reject) => {
        try {
            const command = (0, child_process_1.spawn)("openssl", cmd);
            let result = "";
            command.stdout.on("data", (data) => {
                result += data.toString();
            });
            command.on("close", (code) => {
                return resolve(result);
            });
            command.on("error", (error) => {
                return reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};
// Generate a secp256k1 key pair
// https://techdocs.akamai.com/iot-token-access-control/docs/generate-ecdsa-keys
// openssl ecparam -name secp256k1 -genkey -noout -out ec-secp256k1-priv-key.pem
const generateSecp256k1KeyPair = async () => {
    try {
        const result = await OpenSSL(["ecparam", "-name", "secp256k1", "-genkey"]);
        if (!result.includes("-----BEGIN EC PRIVATE KEY-----"))
            throw new Error("Error no private key found in OpenSSL output.");
        let private_key = `-----BEGIN EC PRIVATE KEY-----${result.split("-----BEGIN EC PRIVATE KEY-----")[1]}`.trim();
        return private_key;
    } catch (error) {
        throw error;
    }
};

// Generate a signed ecdsaWithSHA256 CSR
// 2.2.2 Profile specification of the Cryptographic Stamp identifiers. & CSR field contents / RDNs.
const generateCSR = async (egs_info, cnValue, solution_name) => { 
    if (!egs_info.private_key)
        throw new Error("EGS has no private key");
    // This creates a temporary private file, and csr config file to pass to OpenSSL in order to create and sign the CSR.
    // * In terms of security, this is very bad as /tmp can be accessed by all users. a simple watcher by unauthorized user can retrieve the keys.
    // Better change it to some protected dir.
    const private_key_file = `${process.env.TEMP_FOLDER ?? "/tmp/"}${(0, uuid_1.v4)()}.pem`;
    const csr_config_file = `${process.env.TEMP_FOLDER ?? "/tmp/"}${(0, uuid_1.v4)()}.cnf`;
    fs_1.default.writeFileSync(private_key_file, egs_info.private_key);
    fs_1.default.writeFileSync(csr_config_file, (0, csr_template_1.default)({
        egs_model: egs_info.model,
        egs_serial_number: egs_info.uuid,
        solution_name: solution_name,
        vat_number: egs_info.VAT_number,
        branch_location: `${egs_info.location.building} ${egs_info.location.street}, ${egs_info.location.city}`,
        branch_industry: egs_info.branch_industry,
        branch_name: egs_info.branch_name,
        taxpayer_name: egs_info.VAT_name,
        taxpayer_provided_id: egs_info.custom_id,
        cnValue: cnValue
    }));
    const cleanUp = () => {
        fs_1.default.unlink(private_key_file, () => { });
        fs_1.default.unlink(csr_config_file, () => { });
    };
    try {
        const result = await OpenSSL(["req", "-new", "-sha256", "-key", private_key_file, "-config", csr_config_file]);
        if (!result.includes("-----BEGIN CERTIFICATE REQUEST-----"))
            throw new Error("Error no CSR found in OpenSSL output.");
        let csr = `-----BEGIN CERTIFICATE REQUEST-----${result.split("-----BEGIN CERTIFICATE REQUEST-----")[1]}`.trim();
        cleanUp();
        return csr;
    } catch (error) {
        cleanUp();
        throw error;
    }
};

class EGS {
    egs_info;
    api;
    constructor(egs_info) {
        this.egs_info = egs_info;
        this.api = new api_1.default();
    }

    /**
     * @returns EGSUnitInfo
     */
    get() {
        return this.egs_info;
    }

    /**
     * Sets/Updates an EGS info field.
     * @param egs_info Partial<EGSUnitInfo>
     */
    set(egs_info) {
        this.egs_info = { ...this.egs_info, ...egs_info };
    }

    async setAlreadtGeneratedCertificates(compliance_certificate, compliance_api_secret, private_key, csr) {
        this.egs_info.compliance_certificate = compliance_certificate;
        this.egs_info.compliance_api_secret = compliance_api_secret;
        this.egs_info.private_key = private_key;
        this.egs_info.csr = csr;
        return true
    }

    /**
     * Generates a new secp256k1 Public/Private key pair for the EGS.
     * Also generates and signs a new CSR.
     * `Note`: This functions uses OpenSSL thus requires it to be installed on whatever system the package is running in.
     * @param solution_name String name of solution generating certs.
     * @returns Promise void on success, throws error on fail.
     */
    async generateNewKeysAndCSR(solution_name="") {
        try {
            let csrCNvalue = 'TSTZATCA-Code-Signing';
            if(process.env.ZATCA_MODE == 'simulation'){
                csrCNvalue = 'PREZATCA-Code-Signing';
            }

            if(process.env.ZATCA_MODE == 'production'){
                csrCNvalue = 'ZATCA-Code-Signing';
            }

            let solution = solution_name?solution_name:this.egs_info.branch_industry

            const new_private_key = await generateSecp256k1KeyPair();
            this.egs_info.private_key = new_private_key;
            const new_csr = await generateCSR(this.egs_info, csrCNvalue, solution);
            this.egs_info.csr = new_csr;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generates a new compliance certificate through ZATCA API.
     * @param OTP String Tax payer provided from Fatoora portal to link to this EGS.
     * @returns Promise String compliance request id on success to be used in production CSID request, throws error on fail.
     */
    async issueComplianceCertificate(OTP) {
        if (!this.egs_info.csr)
            throw new Error("EGS needs to generate a CSR first.");
        const issued_data = await this.api.compliance().issueCertificate(this.egs_info.csr, OTP);
        this.egs_info.compliance_certificate = issued_data.issued_certificate;
        this.egs_info.compliance_api_secret = issued_data.api_secret;
        return issued_data.request_id;
    }

    /**
     * Generates a new production certificate through ZATCA API.
     * @param compliance_request_id String compliance request ID generated from compliance CSID request.
     * @returns Promise String request id on success, throws error on fail.
     */
    async issueProductionCertificate(compliance_request_id) {
        if (!this.egs_info.compliance_certificate || !this.egs_info.compliance_api_secret)
            throw new Error("EGS is missing a certificate/private key/api secret to request a production certificate.");
        const issued_data = await this.api.production(this.egs_info.compliance_certificate, this.egs_info.compliance_api_secret).issueCertificate(compliance_request_id);
        this.egs_info.production_certificate = issued_data.issued_certificate;
        this.egs_info.production_api_secret = issued_data.api_secret;
        return issued_data.request_id;
    }

    /**
     * Checks Invoice compliance with ZATCA API.
     * @param signed_invoice_string String.
     * @param invoice_hash String.
     * @returns Promise compliance data on success, throws error on fail.
     */
    async checkInvoiceCompliance(signed_invoice_string, invoice_hash) {
        if (!this.egs_info.compliance_certificate || !this.egs_info.compliance_api_secret)
            throw new Error("EGS is missing a certificate/private key/api secret to check the invoice compliance.");
        return await this.api.compliance(this.egs_info.compliance_certificate, this.egs_info.compliance_api_secret).checkInvoiceCompliance(signed_invoice_string, invoice_hash, this.egs_info.uuid);
    }

    /**
     * Reports invoice with ZATCA API.
     * @param signed_invoice_string String.
     * @param invoice_hash String.
     * @returns Promise reporting data on success, throws error on fail.
     */
    async reportInvoice(signed_invoice_string, invoice_hash) {
        if (!this.egs_info.production_certificate || !this.egs_info.production_api_secret)
            throw new Error("EGS is missing a certificate/private key/api secret to report the invoice.");
        return await this.api.production(this.egs_info.production_certificate, this.egs_info.production_api_secret).reportInvoice(signed_invoice_string, invoice_hash, this.egs_info.uuid);
    }

    /**
     * Signs a given invoice using the EGS certificate and keypairs.
     * @param invoice Invoice to sign
     * @param production Boolean production or compliance certificate.
     * @returns Promise void on success (signed_invoice_string: string, invoice_hash: string, qr: string), throws error on fail.
     */
    signInvoice(invoice, production) {
        const certificate = production ? this.egs_info.production_certificate : this.egs_info.compliance_certificate;
        if (!certificate || !this.egs_info.private_key)
            throw new Error("EGS is missing a certificate/private key to sign the invoice.");
        return invoice.sign(certificate, this.egs_info.private_key);
    }
}

exports.EGS = EGS;
