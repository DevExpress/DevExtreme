import { DxPromise } from '../../core/utils/deferred';
import dxPivotGrid from '../../ui/pivot_grid';
import dxDataGrid from '../../ui/data_grid';

import {
    CellRange,
    ExcelDataGridCell,
    ExcelExportBaseOptions,
    ExcelPivotGridCell,
} from '../../excel_exporter.types';

export type DataGridCell = ExcelDataGridCell;

export type PivotGridCell = ExcelPivotGridCell;

/**
 * Properties that can be passed to the exportDataGrid(options) method from the excelExporter module.
 */
export type DataGridExportOptions = ExcelExportBaseOptions & {
    /**
     * A DataGrid instance. This setting is required.
     */
    component?: dxDataGrid | undefined;
    /**
     * Specifies whether to export only selected rows.
     */
    selectedRowsOnly?: boolean;
    /**
     * Specifies whether to enable Excel filtering in the document.
     */
    autoFilterEnabled?: boolean;
    /**
     * Customizes an Excel cell after creation.
     */
    customizeCell?: ((options: { gridCell?: DataGridCell; excelCell?: any }) => void);
};

/**
 * Properties that can be passed to the exportPivotGrid(options) method from the excelExporter module.
 */
export type PivotGridExportOptions = ExcelExportBaseOptions & {
    /**
     * A PivotGrid instance. This setting is required.
     */
    component?: dxPivotGrid | undefined;
    /**
     * Specifies whether to merge neighbouring cells in the row field if they have the same values.
     */
    mergeRowFieldValues?: boolean;
    /**
     * Specifies whether to merge neighbouring cells in the column field if they have the same values.
     */
    mergeColumnFieldValues?: boolean;
    /**
     * Specifies whether to export headers of the filter fields on the field panel.
     */
    exportFilterFieldHeaders?: boolean;
    /**
     * Specifies whether to export headers of the data fields on the field panel.
     */
    exportDataFieldHeaders?: boolean;
    /**
     * Specifies whether to export headers of the column fields on the field panel.
     */
    exportColumnFieldHeaders?: boolean;
    /**
     * Specifies whether to export headers of the row fields on the field panel.
     */
    exportRowFieldHeaders?: boolean;
    /**
     * Customizes an Excel cell after creation.
     */
    customizeCell?: ((options: { pivotCell?: PivotGridCell; excelCell?: any }) => void);
};

/**
 * Exports grid data to Excel.
 */
export function exportDataGrid(options: DataGridExportOptions): DxPromise<CellRange>;

/**
 * Exports pivot grid data to Excel.
 */
export function exportPivotGrid(options: PivotGridExportOptions): DxPromise<CellRange>;
