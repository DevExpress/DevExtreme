import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';

export interface ExcelDataGridCell {
    /**
     * @docid ExcelDataGridCell.column
     * @type dxDataGridColumn
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid ExcelDataGridCell.data
     * @type Object
     * @public
     */
    data?: any;
    /**
     * @docid ExcelDataGridCell.groupIndex
     * @type number
     * @public
     */
    groupIndex?: number;
    /**
     * @docid ExcelDataGridCell.groupSummaryItems
     * @type Array<Object>
     * @public
     */
    groupSummaryItems?: Array<{ name?: string, value?: any }>;
    /**
     * @docid ExcelDataGridCell.rowType
     * @type string
     * @public
     */
    rowType?: string;
    /**
     * @docid ExcelDataGridCell.totalSummaryItemName
     * @type string
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid ExcelDataGridCell.value
     * @type any
     * @public
     */
    value?: any;
}

export interface CellAddress {
    /**
     * @docid CellAddress.row
     * @type number
     * @public
     */
    row?: number;
    /**
     * @docid CellAddress.column
     * @type number
     * @public
     */
    column?: number;
}

export interface CellRange {
    /**
     * @docid CellRange.from
     * @type CellAddress
     * @public
     */
    from?: CellAddress;
    /**
     * @docid CellRange.to
     * @type CellAddress
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
    text?: string;
    /**
     * @docid ExportLoadPanel.width
     * @type number
     * @default 200
     */
    width?: number;
    /**
     * @docid ExportLoadPanel.height
     * @type number
     * @default 90
     */
    height?: number;
    /**
     * @docid ExportLoadPanel.showIndicator
     * @type boolean
     * @default true
     */
    showIndicator?: boolean;
    /**
     * @docid ExportLoadPanel.indicatorSrc
     * @type string
     * @default ""
     */
    indicatorSrc?: string;
    /**
     * @docid ExportLoadPanel.showPane
     * @type boolean
     * @default true
     */
    showPane?: boolean;
    /**
     * @docid ExportLoadPanel.shading
     * @type boolean
     * @default false
     */
    shading?: boolean;
    /**
     * @docid ExportLoadPanel.shadingColor
     * @type string
     * @default ''
     */
    shadingColor?: string;
}

export interface ExportDataGridProps {
    /**
     * @docid ExportDataGridProps.component
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExportDataGridProps.worksheet
     * @type Object
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExportDataGridProps.topLeftCell
     * @type CellAddress|string
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid ExportDataGridProps.selectedRowsOnly
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExportDataGridProps.autoFilterEnabled
     * @type boolean
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid ExportDataGridProps.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExportDataGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => any);
    /**
     * @docid ExportDataGridProps.loadPanel
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options:ExportDataGridProps
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @module excel_exporter
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function exportDataGrid(options: ExportDataGridProps): Promise<CellRange> & JQueryPromise<CellRange>;

