interface CSRConfigProps {
    private_key_pass?: string;
    production?: boolean;
    egs_model: string;
    egs_serial_number: string;
    solution_name: string;
    vat_number: string;
    branch_location: string;
    branch_industry: string;
    branch_name: string;
    taxpayer_name: string;
    taxpayer_provided_id: string;
}
export default function populate(props: CSRConfigProps): string;
export {};
//# sourceMappingURL=csr_template.d.ts.map