import { XMLDocument } from "../parser";
import { ZATCASimplifiedInvoiceLineItem, ZATCASimplifiedInvoiceProps, ZATCAInvoiceTypes, ZATCAPaymentMethods } from "./templates/simplified_tax_invoice_template";
declare global {
    interface Number {
        toFixedNoRounding: (n: number) => string;
    }
}
export { ZATCASimplifiedInvoiceLineItem, ZATCASimplifiedInvoiceProps, ZATCAInvoiceTypes, ZATCAPaymentMethods };
export declare class ZATCASimplifiedTaxInvoice {
    private invoice_xml;
    /**
     * Parses a ZATCA Simplified Tax Invoice XML string. Or creates a new one based on given props.
     * @param invoice_xml_str Invoice XML string to parse.
     * @param props ZATCASimplifiedInvoiceProps props to create a new unsigned invoice.
     */
    constructor({ invoice_xml_str, props }: {
        invoice_xml_str?: string;
        props?: ZATCASimplifiedInvoiceProps;
    });
    private constructLineItemTotals;
    private constructLineItem;
    private constructLegalMonetaryTotal;
    private constructTaxTotal;
    private parseLineItems;
    getXML(): XMLDocument;
    /**
     * Signs the invoice.
     * @param certificate_string String signed EC certificate.
     * @param private_key_string String ec-secp256k1 private key;
     * @returns String signed invoice xml, includes QR generation.
     */
    sign(certificate_string: string, private_key_string: string): {
        signed_invoice_string: string;
        invoice_hash: string;
        qr: string;
    };
}
//# sourceMappingURL=ZATCASimplifiedTaxInvoice.d.ts.map