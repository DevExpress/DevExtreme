import { DxPromise } from './core/utils/deferred';
import dxDataGrid, { Column } from './ui/data_grid';
import dxPivotGrid, { Cell } from './ui/pivot_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

/**
 * @public
 * @namespace DevExpress.excelExporter
 */
export type DataGridCell = ExcelDataGridCell;

/**
 * @namespace DevExpress.excelExporter
 * @deprecated Use DataGridCell instead
 */
export interface ExcelDataGridCell {
    /**
     * @docid
     * @public
     * @type dxDataGridColumn
     */
    column?: Column;
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
       */
      name?: string;
      /**
       * @docid
       */
      value?: any;
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
 * @public
 * @namespace DevExpress.excelExporter
 */
export type PivotGridCell = ExcelPivotGridCell;

/**
 * @namespace DevExpress.excelExporter
 * @deprecated Use PivotGridCell instead
 */
export interface ExcelPivotGridCell extends Cell {
    /**
     * @docid
     * @public
     */
    area?: 'column' | 'row' | 'data';
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
    /**
     * @docid
     * @public
     */
    headerType?: 'column' | 'row' | 'data' | 'filter';
}

/**
 * @docid
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
    /**
     * @docid
     * @default false
     * @public
     */
     encodeExecutableContent?: boolean;
}

/**
 * @docid
 * @public
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
     * @type_function_param1_field gridCell:ExcelDataGridCell
     * @type_function_param1_field excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: DataGridCell; excelCell?: any }) => void);
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
     * @default false
     * @public
     */
    exportFilterFieldHeaders?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    exportDataFieldHeaders?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    exportColumnFieldHeaders?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    exportRowFieldHeaders?: boolean;
    /**
     * @docid
     * @type_function_param1_field pivotCell:ExcelPivotGridCell
     * @type_function_param1_field excelCell:Object
     * @public
     */
    customizeCell?: ((options: { pivotCell?: PivotGridCell; excelCell?: any }) => void);
}

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @static
 * @public
 */
export function exportDataGrid(options: ExcelExportDataGridProps): DxPromise<CellRange>;

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @static
 * @public
 */
export function exportPivotGrid(options: ExcelExportPivotGridProps): DxPromise<CellRange>;
