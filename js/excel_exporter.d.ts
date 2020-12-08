import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import dxPivotGrid, { dxPivotGridPivotGridCell } from './ui/pivot_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

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

/**
* @docid ExcelExportBaseProps
* @namespace DevExpress.excelExporter
* @type object
* @hidden
*/
export interface ExcelExportBaseProps {
    /**
     * @docid ExcelExportBaseProps.worksheet
     * @type Object
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExcelExportBaseProps.topLeftCell
     * @type CellAddress|string
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid ExcelExportBaseProps.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExcelExportBaseProps.loadPanel
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
* @docid ExcelExportDataGridProps
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
    /**
     * @docid ExcelExportDataGridProps.component
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExcelExportDataGridProps.selectedRowsOnly
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExcelExportDataGridProps.autoFilterEnabled
     * @type boolean
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid ExcelExportDataGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => any);
}

/**
* @docid ExcelExportPivotGridProps
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
    /**
     * @docid ExcelExportPivotGridProps.component
     * @type dxPivotGrid
     * @default undefined
     * @public
     */
    component?: dxPivotGrid;
    /**
     * @docid ExcelExportPivotGridProps.customizeCell
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
 * @param1 options:ExcelExportDataGridProps
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @module excel_exporter
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function exportDataGrid(options: ExcelExportDataGridProps): Promise<CellRange> & JQueryPromise<CellRange>;

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @param1 options:ExcelExportPivotGridProps
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @module excel_exporter
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function exportPivotGrid(options: ExcelExportPivotGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
