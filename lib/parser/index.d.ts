export interface XMLObject {
    [tag: string]: any;
}
export declare type XMLQueryResult = XMLObject[] | undefined;
export declare class XMLDocument {
    private xml_object;
    private parser_options;
    constructor(xml_str?: string);
    private getElement;
    private filterByCondition;
    /**
     * Queries the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Array of elements/element if found. undefined if no match found.
     */
    get(path_query?: string, condition?: any): XMLQueryResult;
    /**
     * Queries and deletes the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Boolean true if deleted, false if no match.
     */
    delete(path_query?: string, condition?: any): boolean;
    /**
     * Sets (Adds if does not exist) an XMLObject to a specific element given its path in tags.
     * Requires the query path to be already in the XML. It does not create the path for you.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param overwrite Boolean makes operation a set instead of an add.
     * @param set_xml XMLObject or String for other values to be set/added.
     * @returns Boolean true if set/add, false if unable to set/add.
     */
    set(path_query: string, overwrite: boolean, set_xml: XMLObject | string): boolean;
    toString({ no_header }: {
        no_header?: boolean;
    }): string;
}
//# sourceMappingURL=index.d.ts.map