/// <reference types="node" />
import { XMLDocument } from "../../parser";
interface QRParams {
    invoice_xml: XMLDocument;
    digital_signature: string;
    public_key: Buffer;
    certificate_signature: Buffer;
}
/**
 * Generates QR for a given invoice. According to ZATCA BR-KSA-27
 * @param invoice_xml XMLDocument.
 * @param digital_signature String base64 encoded digital signature.
 * @param public_key Buffer certificate public key.
 * @param certificate_signature Buffer certificate signature.
 * @returns String base64 encoded QR data.
 */
export declare const generateQR: ({ invoice_xml, digital_signature, public_key, certificate_signature }: QRParams) => string;
/**
 * Generates a QR for phase one given an invoice.
 * This is a temporary function for backwards compatibility while phase two is not fully deployed.
 * @param invoice_xml XMLDocument.
 * @returns String base64 encoded QR data.
 */
export declare const generatePhaseOneQR: ({ invoice_xml }: {
    invoice_xml: XMLDocument;
}) => string;
export {};
//# sourceMappingURL=index.d.ts.map