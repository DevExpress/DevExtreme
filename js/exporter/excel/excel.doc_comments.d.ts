import {
    dxDataGridColumn
} from '../../ui/data_grid';

export interface ExcelDataGridCell {
    /**
     * @docid ExcelDataGridCell.column
     * @type dxDataGridColumn
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid ExcelDataGridCell.data
     * @type object
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    data?: any;
    /**
     * @docid ExcelDataGridCell.groupIndex
     * @type number
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    groupIndex?: number;
    /**
     * @docid ExcelDataGridCell.groupSummaryItems
     * @type Array<Object>
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    groupSummaryItems?: Array<{ name?: string, value?: any }>;
    /**
     * @docid ExcelDataGridCell.rowType
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    rowType?: string;
    /**
     * @docid ExcelDataGridCell.totalSummaryItemName
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid ExcelDataGridCell.value
     * @type any
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    value?: any;
}

export interface ExcelFont {
    /**
     * @docid ExcelFont.bold
     * @type boolean
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    bold?: boolean;
    /**
     * @docid ExcelFont.color
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    color?: string;
    /**
     * @docid ExcelFont.italic
     * @type boolean
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    italic?: boolean;
    /**
     * @docid ExcelFont.name
     * @type string
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    name?: string;
    /**
     * @docid ExcelFont.size
     * @type number
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
