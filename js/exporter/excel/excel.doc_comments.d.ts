/**
 * @docid
 * @deprecated
 * @type object
 */
export interface ExcelFont {
    /**
     * @docid
     * @public
     */
    bold?: boolean;
    /**
     * @docid
     * @public
     */
    color?: string;
    /**
     * @docid
     * @public
     */
    italic?: boolean;
    /**
     * @docid
     * @public
     */
    name?: string;
    /**
     * @docid
     * @public
     */
    size?: number;
    /**
     * @docid
     * @type Enums.ExcelFontUnderlineType
     * @public
     */
    underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
}
