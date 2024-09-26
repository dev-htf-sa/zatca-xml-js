interface SignedPropertiesProps {
    sign_timestamp: string;
    certificate_hash: string;
    certificate_issuer: string;
    certificate_serial_number: string;
}
export declare function defaultUBLExtensionsSignedPropertiesForSigning({ sign_timestamp, certificate_hash, certificate_issuer, certificate_serial_number }: SignedPropertiesProps): string;
export default function populate({ sign_timestamp, certificate_hash, certificate_issuer, certificate_serial_number }: SignedPropertiesProps): string;
export {};
//# sourceMappingURL=ubl_extension_signed_properties_template.d.ts.map