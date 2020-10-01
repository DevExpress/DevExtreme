import dxDataGrid from './ui/data_grid';

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
