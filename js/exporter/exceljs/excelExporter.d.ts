import dxDataGrid, {
    GridBaseOptions
} from '../../ui/data_grid';
import {
    ExcelDataGridCell
} from '../excel/excel.doc_comments';

export type cellAddress = {
    row: number, column: number
};

export type CellsRange = {
    from: cellAddress,
    to: cellAddress
}

export interface ExportDataGridOptions {
    /**
     * @docid ExportDataGridOptions.component
     * @type object
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExportDataGridOptions.worksheet
     * @type object
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExportDataGridOptions.topLeftCell
     * @type object
     * @default { row: 1, column: 1 }
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    topLeftCell?: cellAddress;
    /**
     * @docid ExportDataGridOptions.selectedRowsOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExportDataGridOptions.autoFilterEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    autoFilterEnabled?: string;
    /**
     * @docid ExportDataGridOptions.keepColumnWidths
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExportDataGridOptions.customizeCell
     * @publicName exportDataGrid(options)
     * @type function(options)
     * @type_function_param1 options:object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:object
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    customizeCell?: ((options: object) => any);
    /**
     * @docid ExportDataGridOptions.loadPanel
     * @type object
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    loadPanel?: GridBaseOptions.loadPanel;
}

/**
     * @docid excelExporter.exportDataGrid
     * @publicName exportDataGrid(options)
     * @type function(options)
     * @param1 options:object
     
    * component:dxDataGrid
    * @param2 worksheet:object
    * @param3 options: // todo
    * @namespace DevExpress.excelExporter
    * @module excelExporter
    * @export excelExporter.exportDataGrid
    * @static // todo
    * @prevFileNamespace DevExpress.ui // todo понять для чего
    * @public
    */
   export function exportDataGrid(options: ExportDataGridOptions): Promise<CellsRange>;
