import { DxPromise } from '../../core/utils/deferred';
import dxPivotGrid from '../../ui/pivot_grid';
import dxDataGrid from '../../ui/data_grid';

import {
    CellRange,
    ExcelDataGridCell,
    ExcelExportBaseOptions,
    ExcelPivotGridCell,
} from '../../excel_exporter.types';

/**
 * @public
 * @namespace DevExpress.excelExporter
 */
export type DataGridCell = ExcelDataGridCell;

/**
 * @public
 * @namespace DevExpress.excelExporter
 */
export type PivotGridCell = ExcelPivotGridCell;

/**
 * @docid
 * @public
 * @namespace DevExpress.excelExporter
 * @inherits ExcelExportBaseOptions
 * @type object
 */
export interface ExcelExportDataGridOptions extends ExcelExportBaseOptions {
    /**
     * @docid
     * @default undefined
     * @public
     */
    component?: dxDataGrid | undefined;
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
 * @public
 * @namespace DevExpress.excelExporter
 * @inherits ExcelExportBaseOptions
 * @type object
 */
export interface ExcelExportPivotGridOptions extends ExcelExportBaseOptions {
    /**
     * @docid
     * @default undefined
     * @public
     */
    component?: dxPivotGrid | undefined;
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
export function exportDataGrid(options: ExcelExportDataGridOptions): DxPromise<CellRange>;

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.excelExporter
 * @static
 * @public
 */
export function exportPivotGrid(options: ExcelExportPivotGridOptions): DxPromise<CellRange>;
