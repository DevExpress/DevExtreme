/**
 * @docid
 * @deprecated
 * @type object
 */
export interface ExcelFont {
    /**
     * @docid
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    bold?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    color?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    italic?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    name?: string;
    /**
     * @docid
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
