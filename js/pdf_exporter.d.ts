import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';

export interface PdfDataGridCell {
    /**
     * @docid PdfDataGridCell.column
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
     * @public
     */
    groupIndex?: number;
    /**
     * @docid PdfDataGridCell.groupSummaryItems
     * @public
     */
    groupSummaryItems?: Array<{ name?: string, value?: any }>;
    /**
     * @docid PdfDataGridCell.rowType
     * @public
     */
    rowType?: string;
    /**
     * @docid PdfDataGridCell.totalSummaryItemName
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid PdfDataGridCell.value
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
     * @default undefined
     * @public
     */
    jsPDFDocument?: object;
     /**
     * @docid PdfExportDataGridProps.autoTableOptions
     * @default undefined
     * @public
     */
    autoTableOptions?: object;
    /**
     * @docid PdfExportDataGridProps.component
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid PdfExportDataGridProps.selectedRowsOnly
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid PdfExportDataGridProps.keepColumnWidths
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid PdfExportDataGridProps.customizeCell
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:PdfDataGridCell
     * @type_function_param1_field2 pdfCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any}) => any);
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
