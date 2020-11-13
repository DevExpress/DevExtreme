import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import dxPivotGrid, { dxPivotGridPivotGridCell } from './ui/pivot_grid';

export interface ExcelDataGridCell {
    /**
     * @docid ExcelDataGridCell.column
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
     * @docid ExcelDataGridCell.groupIndex
     * @public
     */
    groupIndex?: number;
    /**
     * @docid ExcelDataGridCell.groupSummaryItems
     * @public
     */
    groupSummaryItems?: Array<{ name?: string, value?: any }>;
    /**
     * @docid ExcelDataGridCell.rowType
     * @public
     */
    rowType?: string;
    /**
     * @docid ExcelDataGridCell.totalSummaryItemName
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid ExcelDataGridCell.value
     * @public
     */
    value?: any;
}

/**
* @docid ExcelPivotGridCell
* @type object
* @namespace DevExpress.excelExporter
* @inherits dxPivotGridPivotGridCell
*/
export interface ExcelPivotGridCell extends dxPivotGridPivotGridCell {
    /**
     * @docid ExcelPivotGridCell.area
     * @public
     */
    area?: string;
    /**
     * @docid ExcelPivotGridCell.rowIndex
     * @public
     */
    rowIndex?: number;
    /**
     * @docid ExcelPivotGridCell.columnIndex
     * @public
     */
    columnIndex?: number;
}

export interface CellAddress {
    /**
     * @docid CellAddress.row
     * @public
     */
    row?: number;
    /**
     * @docid CellAddress.column
     * @public
     */
    column?: number;
}

export interface CellRange {
    /**
     * @docid CellRange.from
     * @public
     */
    from?: CellAddress;
    /**
     * @docid CellRange.to
     * @public
     */
    to?: CellAddress;
}

export interface ExportLoadPanel {
    /**
     * @docid ExportLoadPanel.enabled
     * @default true
     */
    enabled?: boolean;
    /**
     * @docid ExportLoadPanel.text
     * @default "Exporting..."
     */
    text?: string;
    /**
     * @docid ExportLoadPanel.width
     * @default 200
     */
    width?: number;
    /**
     * @docid ExportLoadPanel.height
     * @default 90
     */
    height?: number;
    /**
     * @docid ExportLoadPanel.showIndicator
     * @default true
     */
    showIndicator?: boolean;
    /**
     * @docid ExportLoadPanel.indicatorSrc
     * @default ""
     */
    indicatorSrc?: string;
    /**
     * @docid ExportLoadPanel.showPane
     * @default true
     */
    showPane?: boolean;
    /**
     * @docid ExportLoadPanel.shading
     * @default false
     */
    shading?: boolean;
    /**
     * @docid ExportLoadPanel.shadingColor
     * @default ''
     */
    shadingColor?: string;
}

/**
* @docid
* @type object
* @namespace DevExpress.excelExporter
* @hidden
*/
export interface ExcelExportBaseProps {
    /**
     * @docid ExcelExportBaseProps.worksheet
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExcelExportBaseProps.topLeftCell
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid ExcelExportBaseProps.keepColumnWidths
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExcelExportBaseProps.loadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
* @docid ExcelExportDataGridProps
* @type object
* @namespace DevExpress.excelExporter
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
    /**
     * @docid ExcelExportDataGridProps.component
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExcelExportDataGridProps.selectedRowsOnly
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExcelExportDataGridProps.autoFilterEnabled
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid ExcelExportDataGridProps.customizeCell
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => any);
}

/**
* @docid
* @type object
* @namespace DevExpress.excelExporter
* @inherits ExcelExportBaseProps
*/
export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
    /**
     * @docid ExcelExportPivotGridProps.component
     * @default undefined
     * @public
     */
    component?: dxPivotGrid;
    /**
     * @docid ExcelExportPivotGridProps.customizeCell
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
