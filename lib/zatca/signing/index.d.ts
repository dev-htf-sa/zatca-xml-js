/// <reference types="node" />
import { XMLDocument } from "../../parser";
/**
 * Removes (UBLExtensions (Signing), Signature Envelope, and QR data) Elements. Then canonicalizes the XML to c14n.
 * In Order to prep for hashing.
 * @param invoice_xml XMLDocument.
 * @returns purified Invoice XML string.
 */
export declare const getPureInvoiceString: (invoice_xml: XMLDocument) => string;
/**
 * Hashes Invoice according to ZATCA.
 * https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Documents/20220624_ZATCA_Electronic_Invoice_Security_Features_Implementation_Standards.pdf
 * 2.3.3: Follows same method as PIH (Previous invoice hash BS: KSA-13).
 * @param invoice_xml XMLDocument.
 * @returns String invoice hash encoded in base64.
 */
export declare const getInvoiceHash: (invoice_xml: XMLDocument) => string;
/**
 * Hashes Certificate according to ZATCA.
 * https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Documents/20220624_ZATCA_Electronic_Invoice_Security_Features_Implementation_Standards.pdf
 * 1.6.2.1.1.2: used in reference to digital signing certificate.
 * @param certificate_string String base64 encoded certificate body.
 * @returns String certificate hash encoded in base64.
 */
export declare const getCertificateHash: (certificate_string: string) => string;
/**
 * Creates invoice digital signature according to ZATCA.
 * https://zatca.gov.sa/ar/E-Invoicing/SystemsDevelopers/Documents/20220624_ZATCA_Electronic_Invoice_Security_Features_Implementation_Standards.pdf
 * 1.4: Digital signature, part of the cryptographic stamp (invoice hash signed using private key) (BS: KSA-15).
 * @param invoice_hash String base64 encoded invoice hash.
 * @param private_key_string String base64 encoded ec-secp256k1 private key body.
 * @returns String base64 encoded digital signature.
 */
export declare const createInvoiceDigitalSignature: (invoice_hash: string, private_key_string: string) => string;
/**
 * Gets certificate hash, x509IssuerName, and X509SerialNumber and formats them according to ZATCA.
 * @param certificate_string String base64 encoded certificate body.
 * @returns {hash: string, issuer: string, serial_number: string, public_key: Buffer, signature: Buffer}.
 */
export declare const getCertificateInfo: (certificate_string: string) => {
    hash: string;
    issuer: string;
    serial_number: string;
    public_key: Buffer;
    signature: Buffer;
};
/**
 * Removes header and footer from certificate string.
 * @param certificate_string.
 * @returns String base64 encoded certificate body.
 */
export declare const cleanUpCertificateString: (certificate_string: string) => string;
/**
 * Removes header and footer from private key string.
 * @param privatek_key_string ec-secp256k1 private key string.
 * @returns String base64 encoded private key body.
 */
export declare const cleanUpPrivateKeyString: (certificate_string: string) => string;
interface generateSignatureXMLParams {
    invoice_xml: XMLDocument;
    certificate_string: string;
    private_key_string: string;
}
/**
 * Main signing function.
 * @param invoice_xml XMLDocument of invoice to be signed.
 * @param certificate_string String signed EC certificate.
 * @param private_key_string String ec-secp256k1 private key;
 * @returns signed_invoice_string: string, invoice_hash: string, qr: string
 */
export declare const generateSignedXMLString: ({ invoice_xml, certificate_string, private_key_string }: generateSignatureXMLParams) => {
    signed_invoice_string: string;
    invoice_hash: string;
    qr: string;
};
export {};
//# sourceMappingURL=index.d.ts.map