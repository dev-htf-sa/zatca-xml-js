"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUBLExtensionsSignedPropertiesForSigning = void 0;
const template = /* XML */ `<xades:SignedProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="xadesSignedProperties">
                                    <xades:SignedSignatureProperties>
                                        <xades:SigningTime>SET_SIGN_TIMESTAMP</xades:SigningTime>
                                        <xades:SigningCertificate>
                                            <xades:Cert>
                                                <xades:CertDigest>
                                                    <ds:DigestMethod xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                                                    <ds:DigestValue xmlns:ds="http://www.w3.org/2000/09/xmldsig#">SET_CERTIFICATE_HASH</ds:DigestValue>
                                                </xades:CertDigest>
                                                <xades:IssuerSerial>
                                                    <ds:X509IssuerName xmlns:ds="http://www.w3.org/2000/09/xmldsig#">SET_CERTIFICATE_ISSUER</ds:X509IssuerName>
                                                    <ds:X509SerialNumber xmlns:ds="http://www.w3.org/2000/09/xmldsig#">SET_CERTIFICATE_SERIAL_NUMBER</ds:X509SerialNumber>
                                                </xades:IssuerSerial>
                                            </xades:Cert>
                                        </xades:SigningCertificate>
                                    </xades:SignedSignatureProperties>
                                </xades:SignedProperties>`;
function defaultUBLExtensionsSignedPropertiesForSigning({ sign_timestamp, certificate_hash, certificate_issuer, certificate_serial_number }) {
    let populated_template = template;
    populated_template = populated_template.replace("SET_SIGN_TIMESTAMP", sign_timestamp);
    populated_template = populated_template.replace("SET_CERTIFICATE_HASH", certificate_hash);
    populated_template = populated_template.replace("SET_CERTIFICATE_ISSUER", certificate_issuer);
    populated_template = populated_template.replace("SET_CERTIFICATE_SERIAL_NUMBER", certificate_serial_number);
    return populated_template;
}
exports.defaultUBLExtensionsSignedPropertiesForSigning = defaultUBLExtensionsSignedPropertiesForSigning;
;
const template_after_signing = /* XML */ `<xades:SignedProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="xadesSignedProperties">
                                <xades:SignedSignatureProperties>
                                    <xades:SigningTime>SET_SIGN_TIMESTAMP</xades:SigningTime>
                                    <xades:SigningCertificate>
                                        <xades:Cert>
                                            <xades:CertDigest>
                                                <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"></ds:DigestMethod>
                                                <ds:DigestValue>SET_CERTIFICATE_HASH</ds:DigestValue>
                                            </xades:CertDigest>
                                            <xades:IssuerSerial>
                                                <ds:X509IssuerName>SET_CERTIFICATE_ISSUER</ds:X509IssuerName>
                                                <ds:X509SerialNumber>SET_CERTIFICATE_SERIAL_NUMBER</ds:X509SerialNumber>
                                            </xades:IssuerSerial>
                                        </xades:Cert>
                                    </xades:SigningCertificate>
                                </xades:SignedSignatureProperties>
                            </xades:SignedProperties>`;
function populate({ sign_timestamp, certificate_hash, certificate_issuer, certificate_serial_number }) {
    let populated_template = template_after_signing;
    populated_template = populated_template.replace("SET_SIGN_TIMESTAMP", sign_timestamp);
    populated_template = populated_template.replace("SET_CERTIFICATE_HASH", certificate_hash);
    populated_template = populated_template.replace("SET_CERTIFICATE_ISSUER", certificate_issuer);
    populated_template = populated_template.replace("SET_CERTIFICATE_SERIAL_NUMBER", certificate_serial_number);
    return populated_template;
}
exports.default = populate;
;
