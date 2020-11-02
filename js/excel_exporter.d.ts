import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import dxPivotGrid, { dxPivotGridPivotGridCell } from './ui/pivot_grid';

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
*/
export interface ExcelDataGridCell {
    /**
     * @docid
     * @type dxDataGridColumn
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid
     * @type Object
     * @public
     */
    data?: any;
    /**
     * @docid
     * @type number
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @type Array<Object>
     * @public
     */
    groupSummaryItems?: Array<{
      /**
      * @docid
      */
      name?: string,
      /**
      * @docid
      */
      value?: any
    }>;
    /**
     * @docid
     * @type string
     * @public
     */
    rowType?: string;
    /**
     * @docid
     * @type string
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid
     * @type any
     * @public
     */
    value?: any;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
* @inherits dxPivotGridPivotGridCell
*/
export interface ExcelPivotGridCell extends dxPivotGridPivotGridCell {
    /**
     * @docid
     * @type string
     * @public
     */
    area?: string;
    /**
     * @docid
     * @type number
     * @public
     */
    rowIndex?: number;
    /**
     * @docid
     * @type number
     * @public
     */
    columnIndex?: number;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
*/
export interface CellAddress {
    /**
     * @docid
     * @type number
     * @public
     */
    row?: number;
    /**
     * @docid
     * @type number
     * @public
     */
    column?: number;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
*/
export interface CellRange {
    /**
     * @docid
     * @type CellAddress
     * @public
     */
    from?: CellAddress;
    /**
     * @docid
     * @type CellAddress
     * @public
     */
    to?: CellAddress;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
*/
export interface ExportLoadPanel {
    /**
     * @docid
     * @type boolean
     * @default true
     */
    enabled?: boolean;
    /**
     * @docid
     * @type string
     * @default "Exporting..."
     */
    text?: string;
    /**
     * @docid
     * @type number
     * @default 200
     */
    width?: number;
    /**
     * @docid
     * @type number
     * @default 90
     */
    height?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     */
    showIndicator?: boolean;
    /**
     * @docid
     * @type string
     * @default ""
     */
    indicatorSrc?: string;
    /**
     * @docid
     * @type boolean
     * @default true
     */
    showPane?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     */
    shading?: boolean;
    /**
     * @docid
     * @type string
     * @default ''
     */
    shadingColor?: string;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
* @hidden
*/
export interface ExcelExportBaseProps {
    /**
     * @docid
     * @type Object
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid
     * @type CellAddress|string
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
    /**
     * @docid
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => any);
}

/**
* @docid
* @namespace DevExpress.excelExporter
* @type object
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
    /**
     * @docid
     * @type dxPivotGrid
     * @default undefined
     * @public
     */
    component?: dxPivotGrid;
    /**
     * @docid
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
