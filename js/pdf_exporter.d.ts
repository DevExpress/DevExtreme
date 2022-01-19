import { DxPromise } from './core/utils/deferred';
import dxDataGrid, { Column } from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';
import dxGantt from './ui/gantt';

/**
 * @docid
 * @namespace DevExpress.pdfExporter
 * @type object
 */
export interface PdfDataGridCell {
    /**
     * @docid
     * @public
     * @type dxDataGridColumn
     */
    column?: Column;
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
       */
      name?: string;
      /**
       * @docid
       */
      value?: any;
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
     * @type_function_param1_field2 pdfCell:Object
     * @public
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell; pdfCell?: any }) => void);
    /**
     * @docid
     * @public
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * @docid pdfExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @return Promise<void>
 * @namespace DevExpress.pdfExporter
 * @static
 * @public
 */
export function exportDataGrid(options: PdfExportDataGridProps): DxPromise<void>;

/**
 * @docid
 * @namespace DevExpress.pdfExporter
 */
 export interface PdfExportGanttProps {
  /**
   * @docid
   * @type_function_param1 options:object
   * @public
   */
  createDocumentMethod?: ((options: any) => object);
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
  component?: dxGantt;
  /**
   * @docid
   * @default undefined
   * @public
   */
  format?: string | object;
  /**
   * @docid
   * @default true
   * @public
   */
  landscape?: boolean;
  /**
   * @docid
   * @default undefined
   * @public
   */
  fileName?: string;
  /**
   * @docid
   * @default undefined
   * @public
   */
  margins?: object;
   /**
   * @docid
   * @type Enums.GanttPdfExportMode
   * @public
   */
  exportMode?: 'all' | 'treeList' | 'chart';
   /**
   * @docid
   * @type Enums.GanttPdfExportDateRange|object
   * @public
   */
  dateRange?: 'all' | 'visible' | object;
}

/**
 * @docid pdfExporter.exportGantt
 * @publicName exportGantt(options)
 * @return Promise<any>
 * @namespace DevExpress.pdfExporter
 * @static
 * @public
 */
 export function exportGantt(options: PdfExportGanttProps): DxPromise<any>;
