export interface ExcelFont {
    /**
     * @docid ExcelFont.bold
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    bold?: boolean;
    /**
     * @docid ExcelFont.color
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    color?: string;
    /**
     * @docid ExcelFont.italic
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    italic?: boolean;
    /**
     * @docid ExcelFont.name
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    name?: string;
    /**
     * @docid ExcelFont.size
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    size?: number;
    /**
     * @docid ExcelFont.underline
     * @type Enums.ExcelFontUnderlineType
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
}
