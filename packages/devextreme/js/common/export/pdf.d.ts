import { DxPromise } from '../../core/utils/deferred';
import { PdfDataGridCell } from '../../pdf_exporter.types';
import dxDataGrid from '../../ui/data_grid';
import dxGantt, {
  GanttPdfExportMode,
  GanttPdfExportDateRange,
} from '../../ui/gantt';
import { ExportLoadPanel } from '../../exporter/export_load_panel';

/**
 * Configures a custom font used for the Gantt data export.
 */
export type GanttExportFont = {
  /**
   * A custom font object.
   */
  fontObject: object | undefined;
  /**
   * The font name.
   */
  name: string | undefined;
  /**
   * The font style.
   */
  style?: string;
  /**
   * The font weight.
   */
  weight?: string | number | undefined;
};

/**
 * Properties that you can pass as a parameter to the exportGantt(options) method from the pdfExporter module.
 */
export type GanttExportOptions = {
  /**
   * A function that creates a PDF document.
   */
  createDocumentMethod?: ((options: any) => object);
  /**
   * A jsPDF instance. This setting is required.
   */
  jsPDFDocument?: object | undefined;
  /**
   * A Gantt instance. This setting is required.
   */
  component?: dxGantt | undefined;
  /**
   * Specifies the document size.
   */
  format?: string | object | undefined;
  /**
   * Specifies whether to use horizontal orientation for the document.
   */
  landscape?: boolean;
  /**
   * Specifies the file name.
   */
  fileName?: string | undefined;
  /**
   * Specifies the outer indents of the exported area.
   */
  margins?: object | undefined;
  /**
   * Specifies which part of the component to export (chart area, tree list area, or the entire component).
   */
  exportMode?: GanttPdfExportMode;
  /**
   * Specifies the date range for which to export tasks.
   */
  dateRange?: GanttPdfExportDateRange | object;
  /**
   * Specifies the font.
   */
  font?: GanttExportFont;
};

/**
 * Properties that can be passed as a parameter to the exportDataGrid(options) method from the pdfExporter module.
 */
export type DataGridExportOptions = {
  /**
   * A jsPDF instance. This setting is required.
   */
  jsPDFDocument?: object | undefined;
  /**
   * A DataGrid instance. This setting is required.
   */
  component?: dxDataGrid | undefined;
  /**
   * Specifies the top left position of the DataGrid in the exported PDF document. Contains x and y properties. You can locate this position only below the page margins.
   */
  topLeft?: {
    /**
     * Specifies the horizontal position of the exported DataGrid.
     */
    x?: number;
    /**
     * Specifies the vertical position of the exported DataGrid.
     */
    y?: number;
  };
  /**
   * Specifies a custom width for the exported DataGrid columns.
   */
  columnWidths?: Array<number> | undefined;
  /**
   * Specifies the width of the indent of data rows relative to their group header row.
   */
  indent?: number;
  /**
   * Specifies the margin for the top, bottom, left, and right sides of the exported Grid.
   */
  margin?: {
    /**
     * Specifies the margin at the top of the page.
     */
    top?: number;
    /**
     * Specifies the margin at the left side of the page.
     */
    left?: number;
    /**
     * Specifies the margin at the right side of the page.
     */
    right?: number;
    /**
     * Specifies the margin at the bottom of the page.
     */
    bottom?: number;
  };
  /**
   * Specifies whether to repeat the DataGrid column headers on each page.
   */
  repeatHeaders?: boolean;
  /**
   * Specifies whether or not to export only selected rows.
   */
  selectedRowsOnly?: boolean;
  /**
   * A function that allows you to draw cell content of the exported DataGrid. This function is executed before the cell is exported.
   */
  customDrawCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell; doc?: any; rect?: { x: number; y: number; h: number; w: number }; cancel?: boolean }) => void);
  /**
   * Customizes a cell in PDF after creation.
   */
  customizeCell?: ((options: { gridCell?: DataGridCell; pdfCell?: Cell }) => void);
  /**
   * A function that allows you to customize the height of the exported row. This function is executed before the row export.
   */
  onRowExporting?: ((options: { rowCells?: Array<Cell>; rowHeight?: number }) => void);
  /**
   * Configures the load panel.
   */
  loadPanel?: ExportLoadPanel;
};

export type DataGridCell = PdfDataGridCell;

/**
 * An object that configures export to PDF settings in a DataGrid cell.
 */
export type Cell = {
  /**
   * Specifies the background color of the cell.
   */
  backgroundColor?: string;
  /**
   * Specifies the color of the cell&apos;s outer borders.
   */
  borderColor?: string;
  /**
   * Specifies the width of the cell&apos;s borders.
   */
  borderWidth?: number;
  /**
   * Specifies whether to show cell&apos;s left border.
   */
  drawLeftBorder?: boolean;
  /**
   * Specifies whether to show cell&apos;s top border.
   */
  drawTopBorder?: boolean;
  /**
   * Specifies whether to show cell&apos;s right border.
   */
  drawRightBorder?: boolean;
  /**
   * Specifies whether to show cell&apos;s bottom border.
   */
  drawBottomBorder?: boolean;
  /**
   * An object that contains information about the font&apos;s size, name, and style.
   */
  font?: {
    /**
     * Specifies the font size.
     */
    size?: number;
    /**
     * Specifies the font name.
     */
    name?: string;
    /**
     * Specifies the font style.
     */
    style?: 'normal' | 'bold' | 'italic';
  };
  /**
   * Specifies the horizontal alignment for the text inside the exported cell.
   */
  horizontalAlign?: 'left' | 'center' | 'right';
  /**
   * Specifies the top, bottom, left, and right paddings of the DataGrid cell.
   */
  padding?: {
    /**
     * Specifies the top padding of the DataGrid cell.
     */
    top?: number;
    /**
     * Specifies the left padding of the DataGrid cell.
     */
    left?: number;
    /**
     * Specifies the right padding of the DataGrid cell.
     */
    right?: number;
    /**
     * Specifies the bottom padding of the DataGrid cell.
     */
    bottom?: number;
  };
  /**
   * The cell&apos;s text.
   */
  text?: string;
  /**
   * Specifies the text color for the cell.
   */
  textColor?: string;
  /**
   * Specifies the vertical alignment for the text inside the exported cell.
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * Specifies whether to enable word wrapping in the resulting PDF file.
   */
  wordWrapEnabled?: boolean;
};

/**
 * Exports grid data to a PDF file.
 */
export function exportDataGrid(options: DataGridExportOptions): DxPromise<void>;

/**
 * Exports Gantt data to a PDF file.
 */
export function exportGantt(options: GanttExportOptions): DxPromise<any>;
