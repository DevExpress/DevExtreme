/**
* @docid
* @deprecated
* @type object
*/
export interface ExcelFont {
    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    bold?: boolean;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    color?: string;
    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    italic?: boolean;
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    size?: number;
    /**
     * @docid
     * @type Enums.ExcelFontUnderlineType
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
}
