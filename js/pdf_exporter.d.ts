import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';

/**
* @docid
* @namespace DevExpress.pdfExporter
* @type object
*/
export interface PdfDataGridCell {
    /**
     * @docid
     * @type dxDataGridColumn
     * @public
     */
    column?: dxDataGridColumn;
    /**
     * @docid
     * @type Object
     * @public
     */
    data?: any;
    /**
     * @docid
     * @type number
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @type Array<Object>
     * @public
     */
    groupSummaryItems?: Array<{
      /**
      * @docid
      */
      name?: string,
      /**
      * @docid
      */
      value?: any
    }>;
    /**
     * @docid
     * @type string
     * @public
     */
    rowType?: string;
    /**
     * @docid
     * @type string
     * @public
     */
    totalSummaryItemName?: string;
    /**
     * @docid
     * @type any
     * @public
     */
    value?: any;
}

/**
* @docid
* @namespace DevExpress.pdfExporter
* @type object
*/
export interface PdfExportDataGridProps {
     /**
     * @docid
     * @type Object
     * @default undefined
     * @public
     */
    jsPDFDocument?: object;
     /**
     * @docid
     * @type Object
     * @default undefined
     * @public
     */
    autoTableOptions?: object;
    /**
     * @docid
     * @type dxDataGrid
     * @default undefined
     * @public
     */
    component?: dxDataGrid;
    /**
     * @docid
     * @type boolean
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @public
     */
    keepColumnWidths?: boolean;
    /**
     * @docid
     * @type function(options)
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
