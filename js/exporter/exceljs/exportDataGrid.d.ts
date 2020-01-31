import dxDataGrid from '../../ui/data_grid';
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
    loadPanel?: {
        /**
         * @name ExportDataGridOptions.loadPanel.enabled
         * @type boolean
         * @default true
         */
        enabled?: boolean,
        /**
         * @name ExportDataGridOptions.loadPanel.text
         * @type string
         * @default "Exporting..."
         */
        text?: string,
        /**
         * @name ExportDataGridOptions.loadPanel.width
         * @type number
         * @default 200
         */
        width?: number,
        /**
         * @name ExportDataGridOptions.loadPanel.height
         * @type number
         * @default 90
         */
        height?: number,
        /**
         * @name ExportDataGridOptions.loadPanel.showIndicator
         * @type boolean
         * @default true
         */
        showIndicator?: boolean,
        /**
         * @name ExportDataGridOptions.loadPanel.indicatorSrc
         * @type string
         * @default ""
         */
        indicatorSrc?: string,
        /**
         * @name ExportDataGridOptions.loadPanel.showPane
         * @type boolean
         * @default true
         */
        showPane?: boolean,
        /**
         * @name ExportDataGridOptions.loadPanel.shading
         * @type boolean
         * @default false
         */
        shading?: boolean,
        /**
         * @name ExportDataGridOptions.loadPanel.shadingColor
         * @type string
         * @default ''
         */
        shadingColor?: string
    };
}
