import { DxPromise } from './core/utils/deferred';
import dxDataGrid, { dxDataGridColumn } from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

/**
 * @docid
 * @namespace DevExpress.pdfExporter
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
       */
      name?: string,
      /**
       * @docid
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any }) => void);
    /**
     * @docid
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
 * @public
 */
export function exportDataGrid(options: PdfExportDataGridProps): DxPromise<void>;
