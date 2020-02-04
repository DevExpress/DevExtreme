import dxDataGrid, { dxDataGridColumn } from '../../ui/data_grid';

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
     * @type Object
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

export interface CellAddress {
    /**
     * @docid CellAddress.row
     * @type number
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    row?: number;
    /**
     * @docid CellAddress.column
     * @type number
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    column?: number;
}

export interface CellsRange {
    /**
     * @docid CellsRange.from
     * @type CellAddress
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    from?: CellAddress;
    /**
     * @docid CellsRange.to
     * @type CellAddress
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    to?: CellAddress;
}

export interface ExportLoadPanel {
    /**
     * @docid ExportLoadPanel.enabled
     * @type boolean
     * @default true
     */
    enabled?: boolean;
    /**
     * @docid ExportLoadPanel.text
     * @type string
     * @default "Exporting..."
     */
    text?: string,
    /**
     * @docid ExportLoadPanel.width
     * @type number
     * @default 200
     */
    width?: number,
    /**
     * @docid ExportLoadPanel.height
     * @type number
     * @default 90
     */
    height?: number,
    /**
     * @docid ExportLoadPanel.showIndicator
     * @type boolean
     * @default true
     */
    showIndicator?: boolean,
    /**
     * @docid ExportLoadPanel.indicatorSrc
     * @type string
     * @default ""
     */
    indicatorSrc?: string,
    /**
     * @docid ExportLoadPanel.showPane
     * @type boolean
     * @default true
     */
    showPane?: boolean,
    /**
     * @docid ExportLoadPanel.shading
     * @type boolean
     * @default false
     */
    shading?: boolean,
    /**
     * @docid ExportLoadPanel.shadingColor
     * @type string
     * @default ''
     */
    shadingColor?: string
}

export interface ExportDataGridProps {
    /**
     * @docid ExportDataGridProps.component
     * @type dxDataGrid
     * @default undefined
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExportDataGridProps.worksheet
     * @type Object
     * @default undefined
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExportDataGridProps.topLeftCell
     * @type CellAddress
     * @default { row: 1, column: 1 }
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    topLeftCell?: CellAddress;
    /**
     * @docid ExportDataGridProps.selectedRowsOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExportDataGridProps.autoFilterEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid ExportDataGridProps.keepColumnWidths
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExportDataGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: object}) => any);
    /**
     * @docid ExportDataGridProps.loadPanel
     * @type ExportLoadPanel
     * @prevFileNamespace DevExpress.exporter
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options:ExportDataGridProps
 * @return Promise<CellsRange>
 * @namespace DevExpress.excelExporter
 * @module exceljs/excelExporter/exportDataGrid
 * @static
 * @prevFileNamespace DevExpress.exporter
 * @public
 */
export function exportDataGrid(options: DevExpress.exporter.ExportDataGridProps): Promise<DevExpress.exporter.CellsRange>;

