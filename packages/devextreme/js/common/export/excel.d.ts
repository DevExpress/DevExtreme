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
 * @namespace DevExpress.common.Export.excel
 */
export type DataGridCell = ExcelDataGridCell;

/**
 * @public
 * @namespace DevExpress.common.Export.excel
 */
export type PivotGridCell = ExcelPivotGridCell;

/**
 * @docid ExcelExportDataGridProps
 * @public
 * @namespace DevExpress.common.Export.excel
 * @inherits ExcelExportBaseOptions
 * @type object
 */
export type DataGridExportOptions = ExcelExportBaseOptions & {
    /**
     * @docid ExcelExportDataGridProps.component
     * @default undefined
     * @public
     */
    component?: dxDataGrid | undefined;
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
     * @type_function_param1_field gridCell:ExcelDataGridCell
     * @type_function_param1_field excelCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: DataGridCell; excelCell?: any }) => void);
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.Export.excel
 * @inherits ExcelExportBaseOptions
 * @type object
 */
export type PivotGridExportOptions = ExcelExportBaseOptions & {
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
};

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options:ExcelExportDataGridProps
 * @return Promise<CellRange>
 * @namespace DevExpress.common.Export.excel
 * @static
 * @public
 */
export function exportDataGrid(options: DataGridExportOptions): DxPromise<CellRange>;

/**
 * @docid excelExporter.exportPivotGrid
 * @publicName exportPivotGrid(options)
 * @return Promise<CellRange>
 * @namespace DevExpress.common.Export.excel
 * @static
 * @public
 */
export function exportPivotGrid(options: PivotGridExportOptions): DxPromise<CellRange>;
