import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import dxPivotGrid, { dxPivotGridPivotGridCell } from './ui/pivot_grid';

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

/**
* @docid ExcelPivotGridCell
* @namespace DevExpress.excelExporter
* @type object
* @inherits dxPivotGridPivotGridCell
*/
export interface ExcelPivotGridCell extends dxPivotGridPivotGridCell {
    /**
     * @docid ExcelPivotGridCell.area
     * @type string
     * @public
     */
    area?: string;
    /**
     * @docid ExcelPivotGridCell.rowIndex
     * @type number
     * @public
     */
    rowIndex?: number;
    /**
     * @docid ExcelPivotGridCell.columnIndex
     * @type number
     * @public
     */
    columnIndex?: number;
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

/**
* @docid ExportBaseProps
* @namespace DevExpress.excelExporter
* @type object
* @hidden
*/
export interface ExportBaseProps {
    /**
     * @docid ExportBaseProps.worksheet
     * @type Object
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExportBaseProps.topLeftCell
     * @type CellAddress|string
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid ExportBaseProps.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExportBaseProps.loadPanel
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
* @docid ExportDataGridProps
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExportBaseProps
*/
export interface ExportDataGridProps extends ExportBaseProps {
    /**
     * @docid ExportDataGridProps.component
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
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
     * @docid ExportDataGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => any);
}

/**
* @docid ExportPivotGridProps
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExportBaseProps
*/
export interface ExportPivotGridProps extends ExportBaseProps {
    /**
     * @docid ExportPivotGridProps.component
     * @type dxPivotGrid
     * @default undefined
     * @public
     */
    component?: dxPivotGrid;
    /**
     * @docid ExportPivotGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 pivotCell:ExcelPivotGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { pivotCell?: ExcelPivotGridCell, excelCell?: any}) => any);
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

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @param1 options:ExportPivotGridProps
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @module excel_exporter
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function exportPivotGrid(options: ExportPivotGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
