import { DxPromise } from '../../core/utils/deferred';
import { PdfDataGridCell } from '../../pdf_exporter.types';
import dxDataGrid from '../../ui/data_grid';
import dxGantt, {
  GanttPdfExportMode,
  GanttPdfExportDateRange,
} from '../../ui/gantt';
import { ExportLoadPanel } from '../../exporter/export_load_panel';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.Export.pdf
 */
export type GanttExportFont = {
  /**
  * @docid
  * @default undefined
  * @public
  */
  fontObject: object | undefined;
  /**
  * @docid
  * @default undefined
  * @public
  */
  name: string | undefined;
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
  weight?: string | number | undefined;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.Export.pdf
 * @type object
 */
export type GanttExportOptions = {
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
  jsPDFDocument?: object | undefined;
  /**
   * @docid
   * @default undefined
   * @public
   */
  component?: dxGantt | undefined;
  /**
   * @docid
   * @default undefined
   * @public
   */
  format?: string | object | undefined;
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
  fileName?: string | undefined;
  /**
   * @docid
   * @default undefined
   * @public
   */
  margins?: object | undefined;
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
  font?: GanttExportFont;
};

/**
 * @docid PdfExportDataGridProps
 * @public
 * @namespace DevExpress.common.Export.pdf
 * @type object
 */
export type DataGridExportOptions = {
  /**
   * @docid PdfExportDataGridProps.jsPDFDocument
   * @default undefined
   * @public
   */
  jsPDFDocument?: object | undefined;
  /**
   * @docid PdfExportDataGridProps.component
   * @default undefined
   * @public
   */
  component?: dxDataGrid | undefined;
  /**
   * @docid PdfExportDataGridProps.topLeft
   * @public
   */
  topLeft?: {
    /**
     * @docid PdfExportDataGridProps.topLeft.x
     * @default 0
     * @public
     */
    x?: number;
    /**
     * @docid PdfExportDataGridProps.topLeft.y
     * @default 0
     * @public
     */
    y?: number;
  };
  /**
   * @docid PdfExportDataGridProps.columnWidths
   * @default undefined
   * @public
   */
  columnWidths?: Array<number> | undefined;
  /**
   * @docid PdfExportDataGridProps.indent
   * @default 0
   * @public
   */
  indent?: number;
  /**
   * @docid PdfExportDataGridProps.margin
   * @public
   */
  margin?: {
    /**
     * @docid PdfExportDataGridProps.margin.top
     * @public
     */
    top?: number;
    /**
     * @docid PdfExportDataGridProps.margin.left
     * @public
     */
    left?: number;
    /**
      * @docid PdfExportDataGridProps.margin.right
      * @public
      */
    right?: number;
    /**
      * @docid PdfExportDataGridProps.margin.bottom
      * @public
      */
    bottom?: number;
  };
  /**
   * @docid PdfExportDataGridProps.repeatHeaders
   * @default true
   * @public
   */
  repeatHeaders?: boolean;
  /**
   * @docid PdfExportDataGridProps.selectedRowsOnly
   * @default false
   * @public
   */
  selectedRowsOnly?: boolean;
  /**
    * @docid PdfExportDataGridProps.customDrawCell
    * @type_function_param1_field gridCell:PdfDataGridCell
    * @type_function_param1_field pdfCell:PdfCell
    * @type_function_param1_field doc:object
    * @public
    */
  customDrawCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell; doc?: any; rect?: { x: number; y: number; h: number; w: number }; cancel?: boolean }) => void);
  /**
   * @docid PdfExportDataGridProps.customizeCell
   * @type_function_param1_field gridCell:PdfDataGridCell
   * @type_function_param1_field pdfCell:PdfCell
   * @public
   */
  customizeCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell }) => void);
  /**
   * @docid PdfExportDataGridProps.onRowExporting
   * @type_function_param1_field rowCells:Array<PdfCell>
   * @public
   */
  onRowExporting?: ((options: { rowCells?: Array<Cell>; rowHeight?: number }) => void);
  /**
   * @docid PdfExportDataGridProps.loadPanel
   * @public
   */
  loadPanel?: ExportLoadPanel;
};

/**
 * @public
 * @namespace DevExpress.common.Export.pdf
 */
export type DataGridCell = PdfDataGridCell;

/**
 * @public
 * @docid PdfCell
 * @namespace DevExpress.common.Export.pdf
 */
export type Cell = {
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
};

/**
 * @docid pdfExporter.exportDataGrid
 * @publicName exportDataGrid(options)
 * @param1 options: PdfExportDataGridProps
 * @return Promise<void>
 * @namespace DevExpress.common.Export.pdf
 * @static
 * @public
 */
export function exportDataGrid(options: DataGridExportOptions): DxPromise<void>;

/**
 * @docid pdfExporter.exportGantt
 * @publicName exportGantt(options)
 * @return Promise<any>
 * @namespace DevExpress.common.Export.pdf
 * @static
 * @public
 */
export function exportGantt(options: GanttExportOptions): DxPromise<any>;
