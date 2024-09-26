import { EGSUnitInfo } from "../egs";
export declare enum ZATCAPaymentMethods {
    CASH = "10",
    CREDIT = "30",
    BANK_ACCOUNT = "42",
    BANK_CARD = "48"
}
export declare enum ZATCAInvoiceTypes {
    INVOICE = "388",
    DEBIT_NOTE = "383",
    CREDIT_NOTE = "381"
}
export interface ZATCASimplifiedInvoiceLineItemDiscount {
    amount: number;
    reason: string;
}
export interface ZATCASimplifiedInvoiceLineItemTax {
    percent_amount: number;
}
export interface ZATCASimplifiedInvoiceLineItem {
    id: string;
    name: string;
    quantity: number;
    tax_exclusive_price: number;
    other_taxes?: ZATCASimplifiedInvoiceLineItemTax[];
    discounts?: ZATCASimplifiedInvoiceLineItemDiscount[];
    VAT_percent: number;
}
export interface ZATCASimplifiedInvoicCancelation {
    canceled_invoice_number: number;
    payment_method: ZATCAPaymentMethods;
    cancelation_type: ZATCAInvoiceTypes;
    reason: string;
}
export interface ZATCASimplifiedInvoiceProps {
    egs_info: EGSUnitInfo;
    invoice_counter_number: number;
    invoice_serial_number: string;
    issue_date: string;
    issue_time: string;
    previous_invoice_hash: string;
    line_items?: ZATCASimplifiedInvoiceLineItem[];
    cancelation?: ZATCASimplifiedInvoicCancelation;
}
export default function populate(props: ZATCASimplifiedInvoiceProps): string;
//# sourceMappingURL=simplified_tax_invoice_template.d.ts.map