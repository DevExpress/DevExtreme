import {
    exportDataGrid as exportDataGridToExcelValue,
    exportPivotGrid as exportPivotGridValue,
} from './excel';
import type * as ExcelTypes from './excel';
import {
    exportDataGrid as exportDataGridToPdfValue,
    exportGantt as exportGanttValue,
} from './pdf';
import type * as PdfTypes from './pdf';

export namespace Excel {
    export const exportDataGrid: typeof import('devextreme/common/export/excel').exportDataGrid =
        exportDataGridToExcelValue;
    export const exportPivotGrid: typeof import('devextreme/common/export/excel').exportPivotGrid =
        exportPivotGridValue;

    export type DataGridCell = ExcelTypes.DataGridCell;
    export type DataGridExportOptions = ExcelTypes.DataGridExportOptions;
    export type PivotGridCell = ExcelTypes.PivotGridCell;
    export type PivotGridExportOptions = ExcelTypes.PivotGridExportOptions;
}

export namespace Pdf {
    export const exportDataGrid: typeof import('devextreme/common/export/pdf').exportDataGrid =
        exportDataGridToPdfValue;
    export const exportGantt: typeof import('devextreme/common/export/pdf').exportGantt = exportGanttValue;

    export type Cell = PdfTypes.Cell;
    export type DataGridCell = PdfTypes.DataGridCell;
    export type DataGridExportOptions = PdfTypes.DataGridExportOptions;
    export type GanttExportFont = PdfTypes.GanttExportFont;
    export type GanttExportOptions = PdfTypes.GanttExportOptions;
}
