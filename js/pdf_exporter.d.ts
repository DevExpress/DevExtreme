import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

export interface PdfDataGridCell {
    /**
     * @docid PdfDataGridCell.column
     * @type dxDataGridColumn
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid PdfDataGridCell.data
     * @type Object
     * @public
     */
    data?: any;
    /**
     * @docid PdfDataGridCell.groupIndex
     * @type number
     * @public
     */
    groupIndex?: number;
    /**
     * @docid PdfDataGridCell.groupSummaryItems
     * @type Array<Object>
     * @public
     */
    groupSummaryItems?: Array<{ name?: string, value?: any }>;
    /**
     * @docid PdfDataGridCell.rowType
     * @type string
     * @public
     */
    rowType?: string;
    /**
     * @docid PdfDataGridCell.totalSummaryItemName
     * @type string
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid PdfDataGridCell.value
     * @type any
     * @public
     */
    value?: any;
}

/**
* @docid PdfExportDataGridProps
* @namespace DevExpress.pdfExporter
* @type object
*/
export interface PdfExportDataGridProps {
     /**
     * @docid PdfExportDataGridProps.jsPDFDocument
     * @type Object
     * @default undefined
     * @public
     */
    jsPDFDocument?: object;
     /**
     * @docid PdfExportDataGridProps.autoTableOptions
     * @type Object
     * @default undefined
     * @public
     */
    autoTableOptions?: object;
    /**
     * @docid PdfExportDataGridProps.component
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid PdfExportDataGridProps.selectedRowsOnly
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid PdfExportDataGridProps.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid PdfExportDataGridProps.customizeCell
     * @type function(options)
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:PdfDataGridCell
     * @type_function_param1_field2 pdfCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any}) => any);
     /**
     * @docid PdfExportDataGridProps.loadPanel
     * @type ExportLoadPanel
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid pdfExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options:PdfExportDataGridProps
 * @return Promise<void>
 * @namespace DevExpress.pdfExporter
 * @module pdf_exporter
 * @static
 * @prevFileNamespace DevExpress
 * @public
 */
export function exportDataGrid(options: PdfExportDataGridProps): Promise<void> & JQueryPromise<void>;
