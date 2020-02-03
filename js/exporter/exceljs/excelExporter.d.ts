// import { dxDataGrid } from '../../ui/data_grid';
// import {
//     ExcelDataGridCell
// } from '../excel/excel.doc_comments';

// TODO: whe interfaces saved in DevExpress.exporter?
// TODO: why not need imports?
// TODO: How it will be look in documentation? clientExporter -> exportDataGrid -> options?
// TODO: are the Options and Props reserved words?
// TODO: What need add yet?

export interface CellAddress {
    /**
     * @docid CellAddress.row
     * @type number
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    row?: number;
    /**
     * @docid CellAddress.column
     * @type number
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    column?: number;
}

export interface CellsRange {
    /**
     * @docid CellsRange.from
     * @type CellAddress
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    from?: CellAddress;
    /**
     * @docid CellsRange.to
     * @type CellAddress
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    to?: CellAddress;
}

export interface ExportLoadPanel {
    /**
     * @docid ExportLoadPanel.enabled
     * @type boolean
     * @default true
     */
    enabled?: boolean;
    /**
     * @docid ExportLoadPanel.text
     * @type string
     * @default "Exporting..."
     */
    text?: string,
    /**
     * @docid ExportLoadPanel.width
     * @type number
     * @default 200
     */
    width?: number,
    /**
     * @docid ExportLoadPanel.height
     * @type number
     * @default 90
     */
    height?: number,
    /**
     * @docid ExportLoadPanel.showIndicator
     * @type boolean
     * @default true
     */
    showIndicator?: boolean,
    /**
     * @docid ExportLoadPanel.indicatorSrc
     * @type string
     * @default ""
     */
    indicatorSrc?: string,
    /**
     * @docid ExportLoadPanel.showPane
     * @type boolean
     * @default true
     */
    showPane?: boolean,
    /**
     * @docid ExportLoadPanel.shading
     * @type boolean
     * @default false
     */
    shading?: boolean,
    /**
     * @docid ExportLoadPanel.shadingColor
     * @type string
     * @default ''
     */
    shadingColor?: string
}

export interface ExportDataGridOpts {
    /**
     * @docid ExportDataGridOpts.component
     * @type dxDataGrid
     * @default undefined
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid ExportDataGridOpts.worksheet
     * @type Object
     * @default undefined
     * @prevFileNamespace DevExpress.excelExporter
     * @public
     */
    worksheet?: object;
    /**
     * @docid ExportDataGridOpts.topLeftCell
     * @type CellAddress
     * @default { row: 1, column: 1 }
     * @public
     */
    topLeftCell?: CellAddress;
    /**
     * @docid ExportDataGridOpts.selectedRowsOnly
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid ExportDataGridOpts.autoFilterEnabled
     * @type boolean
     * @default false
     * @public
     */
    autoFilterEnabled?: boolean;
    /**
     * @docid ExportDataGridOpts.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid ExportDataGridOpts.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:ExcelDataGridCell
     * @type_function_param1_field2 excelCell:Object
     * @public
     */
    customizeCell?: ((options: Object) => any);
    /**
     * @docid ExportDataGridOpts.loadPanel
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid excelExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options:ExportDataGridOpts
 * @return Promise<CellsRange>
 * @namespace DevExpress.excelExporter
 * @module exceljs/excelExporter/exportDataGrid
 * @static
 * @prevFileNamespace DevExpress.excelExporter
 * @public
 */
export function exportDataGrid(options: object): Promise<void>;

