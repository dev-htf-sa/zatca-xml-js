"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLDocument = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = require("../logger");
;
class XMLDocument {
    xml_object;
    parser_options = {
        ignoreAttributes: false,
        ignoreDeclaration: false,
        ignorePiTags: false,
        parseTagValue: false
    };
    constructor(xml_str) {
        const parser = new fast_xml_parser_1.XMLParser(this.parser_options);
        if (xml_str) {
            this.xml_object = parser.parse(xml_str) ?? {};
        }
        else {
            this.xml_object = { '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' } };
        }
    }
    getElement(xml_object, path_query, parent_xml_object, last_tag) {
        if (path_query == "" || !xml_object)
            return { xml_object, parent_xml_object, last_tag };
        const current_path = path_query.split("/");
        const current_tag = current_path.splice(0, 1)[0];
        const new_query_path = current_path.join("/");
        return this.getElement(xml_object[current_tag], new_query_path, xml_object, current_tag);
    }
    filterByCondition(result, condition) {
        return lodash_1.default.filter(result, lodash_1.default.matches(condition));
    }
    /**
     * Queries the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Array of elements/element if found. undefined if no match found.
     */
    get(path_query, condition) {
        if (!this.xml_object)
            return;
        const { xml_object } = this.getElement(this.xml_object, path_query ?? "");
        let query_result = xml_object;
        if (query_result && !(query_result instanceof Array)) {
            query_result = [query_result];
        }
        if (condition) {
            query_result = this.filterByCondition(query_result, condition);
        }
        return lodash_1.default.isEmpty(query_result) ? undefined : query_result;
    }
    /**
     * Queries and deletes the XML for a specific element given its path in tags.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param condition Any condition. e.g: {"name": "example"}, "2022-03-13"
     * @returns Boolean true if deleted, false if no match.
     */
    delete(path_query, condition) {
        if (!this.xml_object)
            return false;
        const { xml_object, parent_xml_object, last_tag } = this.getElement(this.xml_object, path_query ?? "");
        let query_result = xml_object;
        if (query_result && !(query_result instanceof Array)) {
            query_result = [query_result];
        }
        if (condition) {
            query_result = this.filterByCondition(query_result, condition);
        }
        if (lodash_1.default.isEmpty(query_result))
            return false;
        if (parent_xml_object[last_tag] instanceof Array) {
            parent_xml_object[last_tag] = lodash_1.default.filter(parent_xml_object[last_tag], (element) => {
                return !lodash_1.default.matches(condition)(element);
            });
            if (lodash_1.default.isEmpty(parent_xml_object[last_tag]))
                delete parent_xml_object[last_tag];
        }
        else {
            delete parent_xml_object[last_tag];
        }
        return true;
    }
    /**
     * Sets (Adds if does not exist) an XMLObject to a specific element given its path in tags.
     * Requires the query path to be already in the XML. It does not create the path for you.
     * Accepts condition for filtering.
     * @param path_query String path of element tags. e.g: "Invoice/cac:Delivery/cbc:ActualDeliveryDate"
     * @param overwrite Boolean makes operation a set instead of an add.
     * @param set_xml XMLObject or String for other values to be set/added.
     * @returns Boolean true if set/add, false if unable to set/add.
     */
    set(path_query, overwrite, set_xml) {
        if (!this.xml_object)
            return false;
        const path_tags = path_query.split("/");
        const tag = path_tags.splice(path_tags.length - 1, 1)[0];
        path_query = path_tags.join("/");
        let { xml_object, parent_xml_object, last_tag } = this.getElement(this.xml_object, path_query ?? "");
        if (lodash_1.default.isEmpty(xml_object))
            return false;
        // Workaround for adding to root (since it has no key)
        if (!path_query) {
            parent_xml_object = { "root": this.xml_object };
            last_tag = "root";
        }
        try {
            if (parent_xml_object[last_tag][tag] instanceof Array) {
                parent_xml_object[last_tag][tag] = !overwrite ? [...parent_xml_object[last_tag][tag], set_xml] : set_xml;
            }
            else {
                if (parent_xml_object[last_tag][tag]) {
                    // Tag already exists but is not an Array. (Adding to it should turn it into an array)
                    parent_xml_object[last_tag][tag] = !overwrite ? [parent_xml_object[last_tag][tag], set_xml] : set_xml;
                }
                else {
                    // New tag
                    parent_xml_object[last_tag][tag] = set_xml;
                }
            }
            return true;
        }
        catch (error) {
            (0, logger_1.log)("Info", "Parser", error.message);
        }
        return false;
    }
    toString({ no_header }) {
        let builder_options = {
            ...this.parser_options,
            format: true,
            indentBy: "    "
        };
        const builder = new fast_xml_parser_1.XMLBuilder(builder_options);
        let xml_str = builder.build(this.xml_object);
        if (no_header)
            xml_str = xml_str.replace(`<?xml version="1.0" encoding="UTF-8"?>`, '');
        xml_str = xml_str.replace(/&apos;/g, "'");
        return xml_str;
    }
}
exports.XMLDocument = XMLDocument;
