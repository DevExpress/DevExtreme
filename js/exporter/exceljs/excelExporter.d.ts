import dxDataGrid from '../../ui/data_grid';
// export interface ExportDataGridOptions {
//     // /**
//     //  * @docid ExportDataGridOptions.component
//     //  * @type Object
//     //  * @prevFileNamespace DevExpress.excelExporter
//     //  * @public
//     //  */
//     //  component?: dxDataGrid;
//     /**
//      * @docid ExportDataGridOptions.worksheet
//      * @type Object
//      * @prevFileNamespace DevExpress.excelExporter
//      * @public
//      */
//     worksheet?: Object;
//     // /**
//     //  * @docid ExportDataGridOptions.topLeftCell
//     //  * @type Object
//     //  * @default { row: 1, column: 1 }
//     //  * @public
//     //  */
//     // topLeftCell?: { row: number, column: number };
//     // /**
//     //  * @docid ExportDataGridOptions.selectedRowsOnly
//     //  * @type boolean
//     //  * @default false
//     //  * @public
//     //  */
//     // selectedRowsOnly?: boolean;
//     // /**
//     //  * @docid ExportDataGridOptions.autoFilterEnabled
//     //  * @type boolean
//     //  * @default false
//     //  * @public
//     //  */
//     // autoFilterEnabled?: boolean;
//     // /**
//     //  * @docid ExportDataGridOptions.keepColumnWidths
//     //  * @type boolean
//     //  * @default true
//     //  * @public
//     //  */
//     // keepColumnWidths?: boolean;
//     // /**
//     //  * @docid ExportDataGridOptions.customizeCell
//     //  * @type function(options)
//     //  * @type_function_param1 options:Object
//     //  * @type_function_param1_field1 gridCell:ExcelDataGridCell
//     //  * @type_function_param1_field2 excelCell:Object
//     //  * @public
//     //  */
//     // customizeCell?: ((options: Object) => any);
//     // /**
//     //  * @docid ExportDataGridOptions.loadPanel
//     //  * @type Object
//     //  * @public
//     //  */
//     // loadPanel?: {
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.enabled
//     //      * @type boolean
//     //      * @default true
//     //      */
//     //     enabled?: boolean,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.text
//     //      * @type string
//     //      * @default "Exporting..."
//     //      */
//     //     text?: string,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.width
//     //      * @type number
//     //      * @default 200
//     //      */
//     //     width?: number,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.height
//     //      * @type number
//     //      * @default 90
//     //      */
//     //     height?: number,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.showIndicator
//     //      * @type boolean
//     //      * @default true
//     //      */
//     //     showIndicator?: boolean,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.indicatorSrc
//     //      * @type string
//     //      * @default ""
//     //      */
//     //     indicatorSrc?: string,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.showPane
//     //      * @type boolean
//     //      * @default true
//     //      */
//     //     showPane?: boolean,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.shading
//     //      * @type boolean
//     //      * @default false
//     //      */
//     //     shading?: boolean,
//     //     /**
//     //      * @name ExportDataGridOptions.loadPanel.shadingColor
//     //      * @type string
//     //      * @default ''
//     //      */
//     //     shadingColor?: string
//     // }
// }

// TODO: try to use ExportDataGridOptions
// TODO: Promise(<{from: {}, to: {}}>)
// TODO: @field7 customizeCell:Object // TODO
// TODO: @field8 loadPanel:Object // TODO

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @type function(options)
 * @type_function_param1 options:Object
 * @type_function_param1_field1 component:dxDataGrid
 * @type_function_param1_field2 worksheet:Object
 * @type_function_param1_field3 topLeftCell:Object
 * @type_function_param1_field4 selectedRowsOnly:boolean
 * @type_function_param1_field5 autoFilterEnabled:boolean
 * @type_function_param1_field6 keepColumnWidths:boolean
 * @type_function_param1_field7 customizeCell:Object
 * @type_function_param1_field8 loadPanel:Object
 * @return Promise<Object>
 * @namespace DevExpress.excelExporter
 * @module exceljs/excelExporter/exportDataGrid
 * @static
 * @prevFileNamespace DevExpress.excelExporter
 * @public
 */
export function exportDataGrid(options: object): Promise<void>;

