"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePhaseOneQR = exports.generateQR = void 0;
const moment_1 = __importDefault(require("moment"));
const signing_1 = require("../signing");
/**
 * Generates QR for a given invoice. According to ZATCA BR-KSA-27
 * @param invoice_xml XMLDocument.
 * @param digital_signature String base64 encoded digital signature.
 * @param public_key Buffer certificate public key.
 * @param certificate_signature Buffer certificate signature.
 * @returns String base64 encoded QR data.
 */
const generateQR = ({ invoice_xml, digital_signature, public_key, certificate_signature }) => {
    // Hash 
    const invoice_hash = (0, signing_1.getInvoiceHash)(invoice_xml);
    // Extract required tags
    const seller_name = invoice_xml.get("Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName")?.[0];
    const VAT_number = invoice_xml.get("Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID")?.[0].toString();
    const invoice_total = invoice_xml.get("Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")?.[0]["#text"].toString();
    const VAT_total = invoice_xml.get("Invoice/cac:TaxTotal")?.[0]["cbc:TaxAmount"]["#text"].toString();
    const issue_date = invoice_xml.get("Invoice/cbc:IssueDate")?.[0];
    const issue_time = invoice_xml.get("Invoice/cbc:IssueTime")?.[0];
    // Detect if simplified invoice or not (not used currently assuming all simplified tax invoice)
    const invoice_type = invoice_xml.get("Invoice/cbc:InvoiceTypeCode")?.[0]["@_name"].toString();
    const datetime = `${issue_date} ${issue_time}`;
    // const formatted_datetime = (0, moment_1.default)(datetime).format("YYYY-MM-DDTHH:mm:ss") + "Z";
    const formatted_datetime = (0, moment_1.default)(datetime).format("YYYY-MM-DDTHH:mm:ss");
    const qr_tlv = TLV([
        seller_name,
        VAT_number,
        formatted_datetime,
        invoice_total,
        VAT_total,
        invoice_hash,
        Buffer.from(digital_signature),
        public_key,
        certificate_signature
    ]);
    return qr_tlv.toString("base64");
};
exports.generateQR = generateQR;
/**
 * Generates a QR for phase one given an invoice.
 * This is a temporary function for backwards compatibility while phase two is not fully deployed.
 * @param invoice_xml XMLDocument.
 * @returns String base64 encoded QR data.
 */
const generatePhaseOneQR = ({ invoice_xml }) => {
    // Extract required tags
    const seller_name = invoice_xml.get("Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyLegalEntity/cbc:RegistrationName")?.[0];
    const VAT_number = invoice_xml.get("Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID")?.[0].toString();
    const invoice_total = invoice_xml.get("Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount")?.[0]["#text"].toString();
    const VAT_total = invoice_xml.get("Invoice/cac:TaxTotal")?.[0]["cbc:TaxAmount"]["#text"].toString();
    const issue_date = invoice_xml.get("Invoice/cbc:IssueDate")?.[0];
    const issue_time = invoice_xml.get("Invoice/cbc:IssueTime")?.[0];
    const datetime = `${issue_date} ${issue_time}`;
    const formatted_datetime = (0, moment_1.default)(datetime).format("YYYY-MM-DDTHH:mm:ss") + "Z";
    const qr_tlv = TLV([
        seller_name,
        VAT_number,
        formatted_datetime,
        invoice_total,
        VAT_total
    ]);
    return qr_tlv.toString("base64");
};
exports.generatePhaseOneQR = generatePhaseOneQR;
const TLV = (tags) => {
    const tlv_tags = [];
    tags.forEach((tag, i) => {
        const tagValueBuffer = Buffer.from(tag);
        const current_tlv_value = Buffer.from([i + 1, tagValueBuffer.byteLength, ...tagValueBuffer]);
        tlv_tags.push(current_tlv_value);
    });
    return Buffer.concat(tlv_tags);
};
