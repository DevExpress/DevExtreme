import { ExportDataGridOptions, CellsRange } from "./exportDataGrid";

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @type function(options)
 * @param1 options:object
 * @namespace DevExpress.excelExporter
 * @module excelExporter
 * @export excelExporter.exportDataGrid
 * @static
 * @prevFileNamespace DevExpress.excelExporter
 * @public
 */
 export function exportDataGrid(options: ExportDataGridOptions): Promise<CellsRange>;
