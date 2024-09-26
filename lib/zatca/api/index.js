"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const signing_1 = require("../signing");
const settings = {
    API_VERSION: "V2",
    SANDBOX_BASEURL: "https://gw-apic-gov.gazt.gov.sa/e-invoicing/developer-portal",
    SAIMULATION_BASEURL: "https://gw-apic-gov.gazt.gov.sa/e-invoicing/simulation",
    PRODUCTION_BASEURL: "https://gw-apic-gov.gazt.gov.sa/e-invoicing/core"
};
class API {
    apiurl = settings.SANDBOX_BASEURL;
    constructor() {
       if(process.env.ZATCA_MODE == 'simulation'){
        this.apiurl = settings.SAIMULATION_BASEURL;
       }

       if(process.env.ZATCA_MODE == 'developer'){
        this.apiurl = settings.SANDBOX_BASEURL;
       }

       if(process.env.ZATCA_MODE == 'production'){
        this.apiurl = settings.PRODUCTION_BASEURL;
       }
    }

    getAuthHeaders = (certificate, secret) => {
        if (certificate && secret) {
            const certificate_stripped = (0, signing_1.cleanUpCertificateString)(certificate);
            const basic = Buffer.from(`${Buffer.from(certificate_stripped).toString("base64")}:${secret}`).toString("base64");
            return {
                "Authorization": `Basic ${basic}`
            };
        }

        return {};
    };
    compliance(certificate, secret) {
        const auth_headers = this.getAuthHeaders(certificate, secret);
        const issueCertificate = async (csr, otp) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
                OTP: otp
            };
            const response = await axios_1.default.post(`${this.apiurl}/compliance`, { csr: Buffer.from(csr).toString("base64") }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error issuing a compliance certificate.");
            let issued_certificate = new Buffer(response.data.binarySecurityToken, "base64").toString();
            issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
            const api_secret = response.data.secret;
            return { issued_certificate, api_secret, request_id: response.data.requestID };
        };
        const checkInvoiceCompliance = async (signed_xml_string, invoice_hash, egs_uuid) => {
                     const headers = {
                "Accept-Version": settings.API_VERSION,
                "Accept-Language": "en",
            };
            const response = await axios_1.default.post(`${this.apiurl}/compliance/invoices`, {
                invoiceHash: invoice_hash,
                uuid: egs_uuid,
                invoice: Buffer.from(signed_xml_string).toString("base64")
            }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error in compliance check.");
            return response.data;
        };
        return {
            issueCertificate,
            checkInvoiceCompliance
        };
    }

    production(certificate, secret) {
        const auth_headers = this.getAuthHeaders(certificate, secret);
        const issueCertificate = async (compliance_request_id) => {
            const headers = {
                "Accept-Version": settings.API_VERSION
            };
            const response = await axios_1.default.post(`${this.apiurl}/production/csids`, { compliance_request_id: compliance_request_id }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error issuing a production certificate.");
            let issued_certificate = new Buffer(response.data.binarySecurityToken, "base64").toString();
            issued_certificate = `-----BEGIN CERTIFICATE-----\n${issued_certificate}\n-----END CERTIFICATE-----`;
            const api_secret = response.data.secret;
            return { issued_certificate, api_secret, request_id: response.data.requestID };
        };
        const reportInvoice = async (signed_xml_string, invoice_hash, egs_uuid) => {
            const headers = {
                "Accept-Version": settings.API_VERSION,
                "Accept-Language": "en",
                "Clearance-Status": "0"
            };
            const response = await axios_1.default.post(`${this.apiurl}/invoices/reporting/single`, {
                invoiceHash: invoice_hash,
                uuid: egs_uuid,
                invoice: Buffer.from(signed_xml_string).toString("base64")
            }, { headers: { ...auth_headers, ...headers } });
            if (response.status != 200)
                throw new Error("Error in reporting invoice.");
            return response.data;
        };
        return {
            issueCertificate,
            reportInvoice
        };
    }
}

exports.default = API;
