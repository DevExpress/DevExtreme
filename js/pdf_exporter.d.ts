import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';

/**
* @docid
* @namespace DevExpress.pdfExporter
* @prevFileNamespace DevExpress
* @type object
*/
export interface PdfDataGridCell {
    /**
     * @docid
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid
     * @public
     */
    data?: any;
    /**
     * @docid
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @public
     */
    groupSummaryItems?: Array<{
      /**
      * @docid
      * @prevFileNamespace DevExpress
      */
      name?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress
      */
      value?: any
    }>;
    /**
     * @docid
     * @public
     */
    rowType?: string;
    /**
     * @docid
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid
     * @public
     */
    value?: any;
}

export interface PdfDataGridCellCoordinates {
    /**
     * @docid PdfDataGridCellCoordinates.x
     * @public
     */
    x?: number;
    /**
     * @docid PdfDataGridCellCoordinates.y
     * @public
     */
    y?: number;
    /**
     * @docid PdfDataGridCellCoordinates.width
     * @public
     */
    width?: number;
    /**
     * @docid PdfDataGridCellCoordinates.height
     * @public
     */
    height?: number;
}

/**
* @docid
* @namespace DevExpress.pdfExporter
*/
export interface PdfExportDataGridProps {
     /**
     * @docid
     * @default undefined
     * @public
     */
    jsPDFDocument?: object;
     /**
     * @docid
     * @default undefined
     * @public
     */
    autoTableOptions?: object;
    /**
     * @docid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:PdfDataGridCell
     * @type_function_param1_field2 pdfCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any}) => any);
    /**
     * @docid PdfExportDataGridProps.onCellRendered
     * @type_function_param1 options:Object
     * @type_function_param1_field1 jsPDFDocument:Object
     * @type_function_param1_field2 gridCell:PdfDataGridCell
     * @type_function_param1_field3 cellCoordinates:PdfDataGridCellCoordinates
     * @public
     */
    onCellRendered?: ((options: {jsPDFDocument?: any, gridCell?: PdfDataGridCell, cellCoordinates?: PdfDataGridCellCoordinates}) => any);
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
