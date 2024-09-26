/**
 * This module requires OpenSSL to be installed on the system.
 * Using an OpenSSL In order to generate secp256k1 key pairs, a CSR and sign it.
 * I was unable to find a working library that supports the named curve `secp256k1` and do not want to implement my own JS based crypto.
 * Any crypto expert contributions to move away from OpenSSL to JS will be appreciated.
 */
import { ZATCASimplifiedTaxInvoice } from "../ZATCASimplifiedTaxInvoice";
export interface EGSUnitLocation {
    city: string;
    city_subdivision: string;
    street: string;
    plot_identification: string;
    building: string;
    postal_zone: string;
}
export interface EGSUnitInfo {
    uuid: string;
    custom_id: string;
    model: string;
    CRN_number: string;
    VAT_name: string;
    VAT_number: string;
    branch_name: string;
    branch_industry: string;
    location: EGSUnitLocation;
    private_key?: string;
    csr?: string;
    compliance_certificate?: string;
    compliance_api_secret?: string;
    production_certificate?: string;
    production_api_secret?: string;
}
export declare class EGS {
    private egs_info;
    private api;
    constructor(egs_info: EGSUnitInfo);
    /**
     * @returns EGSUnitInfo
     */
    get(): EGSUnitInfo;
    /**
     * Sets/Updates an EGS info field.
     * @param egs_info Partial<EGSUnitInfo>
     */
    set(egs_info: Partial<EGSUnitInfo>): void;
    /**
     * Generates a new secp256k1 Public/Private key pair for the EGS.
     * Also generates and signs a new CSR.
     * `Note`: This functions uses OpenSSL thus requires it to be installed on whatever system the package is running in.
     * @param production Boolean CSR or Compliance CSR
     * @param solution_name String name of solution generating certs.
     * @returns Promise void on success, throws error on fail.
     */
    generateNewKeysAndCSR(production: boolean, solution_name: string): Promise<any>;
    /**
     * Generates a new compliance certificate through ZATCA API.
     * @param OTP String Tax payer provided from Fatoora portal to link to this EGS.
     * @returns Promise String compliance request id on success to be used in production CSID request, throws error on fail.
     */
    issueComplianceCertificate(OTP: string): Promise<string>;
    /**
     * Generates a new production certificate through ZATCA API.
     * @param compliance_request_id String compliance request ID generated from compliance CSID request.
     * @returns Promise String request id on success, throws error on fail.
     */
    issueProductionCertificate(compliance_request_id: string): Promise<string>;
    /**
     * Checks Invoice compliance with ZATCA API.
     * @param signed_invoice_string String.
     * @param invoice_hash String.
     * @returns Promise compliance data on success, throws error on fail.
     */
    checkInvoiceCompliance(signed_invoice_string: string, invoice_hash: string): Promise<any>;
    /**
     * Reports invoice with ZATCA API.
     * @param signed_invoice_string String.
     * @param invoice_hash String.
     * @returns Promise reporting data on success, throws error on fail.
     */
    reportInvoice(signed_invoice_string: string, invoice_hash: string): Promise<any>;
    /**
     * Signs a given invoice using the EGS certificate and keypairs.
     * @param invoice Invoice to sign
     * @param production Boolean production or compliance certificate.
     * @returns Promise void on success (signed_invoice_string: string, invoice_hash: string, qr: string), throws error on fail.
     */
    signInvoice(invoice: ZATCASimplifiedTaxInvoice, production?: boolean): {
        signed_invoice_string: string;
        invoice_hash: string;
        qr: string;
    };
}
//# sourceMappingURL=index.d.ts.map