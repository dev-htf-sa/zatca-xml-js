interface ComplianceAPIInterface {
    /**
     * Requests a new compliance certificate and secret.
     * @param csr String CSR
     * @param otp String Tax payer provided OTP from Fatoora portal
     * @returns issued_certificate: string, api_secret: string, or throws on error.
     */
    issueCertificate: (csr: string, otp: string) => Promise<{
        issued_certificate: string;
        api_secret: string;
        request_id: string;
    }>;
    /**
    * Checks compliance of a signed ZATCA XML.
    * @param signed_xml_string String.
    * @param invoice_hash String.
    * @param egs_uuid String.
    * @returns Any status.
    */
    checkInvoiceCompliance: (signed_xml_string: string, invoice_hash: string, egs_uuid: string) => Promise<any>;
}
interface ProductionAPIInterface {
    /**
     * Requests a new production certificate and secret.
     * @param compliance_request_id String compliance_request_id
     * @returns issued_certificate: string, api_secret: string, or throws on error.
     */
    issueCertificate: (compliance_request_id: string) => Promise<{
        issued_certificate: string;
        api_secret: string;
        request_id: string;
    }>;
    /**
    * Report signed ZATCA XML.
    * @param signed_xml_string String.
    * @param invoice_hash String.
    * @param egs_uuid String.
    * @returns Any status.
    */
    reportInvoice: (signed_xml_string: string, invoice_hash: string, egs_uuid: string) => Promise<any>;
}
declare class API {
    constructor();
    private getAuthHeaders;
    compliance(certificate?: string, secret?: string): ComplianceAPIInterface;
    production(certificate?: string, secret?: string): ProductionAPIInterface;
}
export default API;
//# sourceMappingURL=index.d.ts.map