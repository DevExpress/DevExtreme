import { TPromise } from './core/utils/deferred';
import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import dxPivotGrid, { dxPivotGridPivotGridCell } from './ui/pivot_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @prevFileNamespace DevExpress
 * @type object
 */
export interface ExcelDataGridCell {
    /**
     * @docid
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @public
     */
    groupSummaryItems?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress
       */
      name?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress
       */
      value?: any
    }>;
    /**
     * @docid
     * @public
     */
    rowType?: string;
    /**
     * @docid
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid
     * @public
     */
    value?: any;
}

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @inherits dxPivotGridPivotGridCell
 */
export interface ExcelPivotGridCell extends dxPivotGridPivotGridCell {
    /**
     * @docid
     * @public
     */
    area?: string;
    /**
     * @docid
     * @public
     */
    rowIndex?: number;
    /**
     * @docid
     * @public
     */
    columnIndex?: number;
}

/**
 * @docid
 * @prevFileNamespace DevExpress
 * @namespace DevExpress.excelExporter
 * @type object
 */
export interface CellAddress {
    /**
     * @docid
     * @public
     */
    row?: number;
    /**
     * @docid
     * @public
     */
    column?: number;
}

/**
 * @docid
 * @prevFileNamespace DevExpress
 * @namespace DevExpress.excelExporter
 * @type object
 */
export interface CellRange {
    /**
     * @docid
     * @public
     */
    from?: CellAddress;
    /**
     * @docid
     * @public
     */
    to?: CellAddress;
}

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @hidden
 */
export interface ExcelExportBaseProps {
    /**
     * @docid
     * @default undefined
     * @public
     */
    worksheet?: object;
    /**
     * @docid
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress | string;
    /**
     * @docid
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @inherits ExcelExportBaseProps
 */
export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
    /**
     * @docid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any}) => void);
}

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @inherits ExcelExportBaseProps
 */
export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
    /**
     * @docid
     * @default undefined
     * @public
     */
    component?: dxPivotGrid;
    /**
     * @docid
     * @default true
     * @public
     */
    mergeRowFieldValues?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    mergeColumnFieldValues?: boolean;
    /**
     * @docid
     * @type_function_param1 options:Object
     * @type_function_param1_field1 pivotCell:ExcelPivotGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: { pivotCell?: ExcelPivotGridCell, excelCell?: any}) => void);
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
export function exportDataGrid(options: ExcelExportDataGridProps): TPromise<CellRange>;

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
export function exportPivotGrid(options: ExcelExportPivotGridProps): TPromise<CellRange>;
