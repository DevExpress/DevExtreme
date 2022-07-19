import { DxPromise } from './core/utils/deferred';
import dxDataGrid from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';
import dxGantt, {
  GanttPdfExportMode,
  GanttPdfExportDateRange,
} from './ui/gantt';
import {
  DataGridCell as ExcelCell,
} from './excel_exporter';

/**
 * @public
 * @namespace DevExpress.pdfExporter
 */
export type DataGridCell = PdfDataGridCell;

 /**
  * @namespace DevExpress.pdfExporter
  * @deprecated Use DataGridCell instead
  */
export interface PdfDataGridCell extends ExcelCell {}

/**
 * @public
 * @docid PdfCell
 * @namespace DevExpress.pdfExporter
 */
export interface Cell {
  /**
   * @docid PdfCell.backgroundColor
   * @default '#FFFFFF'
   * @public
   */
  backgroundColor?: string;
  /**
   * @docid PdfCell.borderColor
   * @default '#979797'
   * @public
   */
  borderColor?: string;
  /**
   * @docid PdfCell.borderWidth
   * @default 0.5
   * @public
   */
  borderWidth?: number;
  /**
   * @docid PdfCell.drawLeftBorder
   * @public
   */
  drawLeftBorder?: boolean;
  /**
   * @docid PdfCell.drawTopBorder
   * @public
   */
  drawTopBorder?: boolean;
  /**
   * @docid PdfCell.drawRightBorder
   * @public
   */
  drawRightBorder?: boolean;
  /**
   * @docid PdfCell.drawBottomBorder
   * @public
   */
  drawBottomBorder?: boolean;
  /**
   * @docid PdfCell.font
   * @public
   */
  font?: {
    /**
     * @docid PdfCell.font.size
     * @default 10
     * @public
     */
    size?: number;
    /**
     * @docid PdfCell.font.name
     * @public
     */
    name?: string;
    /**
     * @docid PdfCell.font.style
     * @default 'normal'
     * @public
     */
    style?: 'normal' | 'bold' | 'italic';
  };
  /**
   * @docid PdfCell.horizontalAlign
   * @public
   */
  horizontalAlign?: 'left' | 'center' | 'right';
  /**
   * @docid PdfCell.padding
   * @public
   */
  padding?: {
    /**
     * @docid PdfCell.padding.top
     * @public
     */
    top?: number;
    /**
     * @docid PdfCell.padding.left
     * @public
     */
    left?: number;
    /**
      * @docid PdfCell.padding.right
      * @public
      */
    right?: number;
    /**
      * @docid PdfCell.padding.bottom
      * @public
      */
    bottom?: number;
  };
  /**
   * @docid PdfCell.text
   * @public
   */
  text?: string;
  /**
   * @docid PdfCell.textColor
   * @default '#000000'
   * @public
   */
  textColor?: string;
  /**
   * @docid PdfCell.verticalAlign
   * @default 'middle'
   * @public
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * @docid PdfCell.wordWrapEnabled
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
       * @public
       */
      x?: number;
      /**
       * @docid
       * @default 0
       * @public
       */
      y?: number;
    };
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
       * @public
       */
      top?: number;
      /**
       * @docid
       * @public
       */
      left?: number;
      /**
        * @docid
        * @public
        */
      right?: number;
      /**
        * @docid
        * @public
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
      * @type_function_param1_field gridCell:PdfDataGridCell
      * @type_function_param1_field pdfCell:PdfCell
      * @type_function_param1_field doc:object
      * @public
      */
    customDrawCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell; doc?: any; rect?: { x: number; y: number; h: number; w: number }; cancel?: boolean }) => void);
    /**
     * @docid
     * @type_function_param1_field gridCell:PdfDataGridCell
     * @type_function_param1_field pdfCell:PdfCell
     * @public
     */
    customizeCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell }) => void);
    /**
     * @docid
     * @type_function_param1_field rowCells:Array<PdfCell>
     * @public
     */
    onRowExporting?: ((options: { rowCells?: Array<Cell>; rowHeight?: number }) => void);
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
   * @default 'all'
   * @public
   */
  exportMode?: GanttPdfExportMode;
  /**
   * @docid
   * @public
   */
  dateRange?: GanttPdfExportDateRange | object;
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
