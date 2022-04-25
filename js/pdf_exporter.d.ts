import { DxPromise } from './core/utils/deferred';
import dxDataGrid from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';
import dxGantt from './ui/gantt';
import {
  DataGridCell,
} from './excel_exporter';

/**
 * @docid
 * @namespace DevExpress.pdfExporter
 * @type object
 */
export interface PdfDataGridCell extends DataGridCell {}

/**
 * @docid
 * @namespace DevExpress.pdfExporter
 * @type object
 */
export interface PdfCell {
  /**
   * @docid
   * @default '#FFFFFF'
   * @public
   */
  backgroundColor?: string;
  /**
   * @docid
   * @public
   */
  font?: {
    /**
     * @docid
     * @default 10
     */
    size?: number;
    /**
     * @docid
     */
    name?: string;
    /**
     * @docid
     * @default 'normal'
     */
    style?: 'normal' | 'bold' | 'italic';
  };
  /**
   * @docid
   * @public
   */
  horizontalAlign?: 'left' | 'center' | 'right';
  /**
   * @docid
   * @public
   */
  padding?: {
    /**
     * @docid
     */
    top?: number;
    /**
     * @docid
     */
    left?: number;
    /**
      * @docid
      */
    right?: number;
    /**
      * @docid
      */
    bottom?: number;
  };
  /**
   * @docid
   * @public
   */
  text?: string;
  /**
   * @docid
   * @default '#000000'
   * @public
   */
  textColor?: string;
  /**
   * @docid
   * @default 'middle'
   * @public
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * @docid
   * @public
   */
  wordWrapEnabled?: boolean;
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
    component?: dxDataGrid;
    /**
     * @docid
     * @public
     */
    topLeft?: {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid
     * @default '#979797'
     * @public
     */
    borderColor?: string;
    /**
     * @docid
     * @default 0.5
     * @public
     */
    borderWidth?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    columnWidths?: Array<number>;
    /**
     * @docid
     * @default 0
     * @public
     */
    indent?: number;
    /**
     * @docid
     * @public
     */
    margin?: {
      /**
       * @docid
       */
      top?: number;
      /**
       * @docid
       */
      left?: number;
      /**
        * @docid
        */
      right?: number;
      /**
        * @docid
        */
      bottom?: number;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    repeatHeaders?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    selectedRowsOnly?: boolean;
    /**
      * @docid
      * @type_function_param1 options:Object
      * @type_function_param1_field1 gridCell:PdfDataGridCell
      * @type_function_param1_field2 pdfCell:PdfCell
      * @type_function_param1_field3 doc:object
      * @type_function_param1_field4 rect:object
      * @type_function_param1_field5 cancel:boolean
      * @public
      */
    customDrawCell?: ((options: { gridCell?: PdfDataGridCell; pdfCell?: PdfCell; doc?: any; rect?: { x: number; y: number; h: number; w: number }; cancel?: boolean }) => void);
    /**
     * @docid
     * @type_function_param1 options:Object
     * @type_function_param1_field1 gridCell:PdfDataGridCell
     * @type_function_param1_field2 pdfCell:PdfCell
     * @public
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell; pdfCell?: PdfCell }) => void);
    /**
     * @docid
     * @type_function_param1 options:Object
     * @type_function_param1_field1 rowCells:Array<PdfCell>
     * @type_function_param1_field2 rowHeight:number
     * @public
     */
    onRowExporting?: ((options: { rowCells?: Array<PdfCell>; rowHeight?: number }) => void);
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
   * @default 'all'
   * @public
   */
  exportMode?: 'all' | 'treeList' | 'chart';
  /**
   * @docid
   * @type Enums.GanttPdfExportDateRange|object
   * @public
   */
  dateRange?: 'all' | 'visible' | object;
  /**
  * @docid
  * @public
  */
  font?: PdfExportGanttFont;
}

export interface PdfExportGanttFont {
  /**
  * @docid
  * @default undefined
  * @public
  */
  fontObject: object;
  /**
  * @docid
  * @default undefined
  * @public
  */
  name: string;
  /**
  * @docid
  * @default 'normal'
  * @acceptValues "bold" | "normal" | "italic"
  * @public
  */
  style?: string;
  /**
  * @docid
  * @default undefined
  * @acceptValues  "normal" | "bold" | 400 | 700
  * @public
  */
  weight?: string | number;
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
