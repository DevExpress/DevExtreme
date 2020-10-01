import dxDataGrid from './ui/data_grid';

/**
* @docid PdfExportBaseProps
* @namespace DevExpress.pdfExporter
* @type object
* @hidden
*/
export interface PdfExportBaseProps {
    /**
     * @docid PdfExportBaseProps.jsPDFDocument
     * @type Object
     * @default undefined
     * @public
     */
    jsPDFDocument?: object;
     /**
     * @docid PdfExportBaseProps.autoTableOptions
     * @type Object
     * @default undefined
     * @public
     */
    autoTableOptions?: object;
    /**
     * @docid PdfExportBaseProps.keepColumnWidths
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
}

/**
* @docid PdfExportDataGridProps
* @namespace DevExpress.pdfExporter
* @type object
* @inherits PdfExportBaseProps
*/
export interface PdfExportDataGridProps extends PdfExportBaseProps {
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
export function exportDataGrid(options: ExportDataGridProps): Promise<void> & JQueryPromise<void>;
