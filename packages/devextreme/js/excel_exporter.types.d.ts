import { ExportLoadPanel } from './exporter/export_load_panel';
import { Cell } from './ui/pivot_grid';
import { Column } from './ui/data_grid';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ExcelExportBaseOptions {
  /**
   * An Excel worksheet to which the grid should be exported.
   */
  worksheet?: object | undefined;
  /**
   * A cell used as a start position for export.
   */
  topLeftCell?: CellAddress | string;
  /**
   * Specifies whether Excel columns should have the same width as their source UI component&apos;s columns.
   */
  keepColumnWidths?: boolean;
  /**
   * Configures the load panel.
   */
  loadPanel?: ExportLoadPanel;
  /**
    * Specifies if the CSV export routine saves potentially dangerous content as plain text data.
    */
   encodeExecutableContent?: boolean;
}

/**
 * @deprecated Use PivotGridCell instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ExcelPivotGridCell extends Cell {
  /**
   * The area to which the cell belongs.
   */
  area?: 'column' | 'row' | 'data';
  /**
   * A zero-based index that indicates the position of the cell&apos;s row.
   */
  rowIndex?: number;
  /**
   * A zero-based index that indicates the position of the cell&apos;s column.
   */
  columnIndex?: number;
  /**
   * The header type. Available if the cell belongs to the field panel.
   */
  headerType?: 'column' | 'row' | 'data' | 'filter';
}

/**
 * 
 */
export interface CellAddress {
  /**
   * The index of a row that contains the cell.
   */
  row?: number;
  /**
   * The index of a column that contains the cell.
   */
  column?: number;
}

/**
 * The coordinates of the exported DataGrid in the Excel file.
 */
export interface CellRange {
  /**
   * Coordinates of the top left cell.
   */
  from?: CellAddress;
  /**
   * Coordinates of the bottom right cell.
   */
  to?: CellAddress;
}

/**
 * @deprecated Use DataGridCell instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ExcelDataGridCell {
  /**
   * The configuration of the cell&apos;s column.
   */
  column?: Column;
  /**
   * The data object of the cell&apos;s row.
   */
  data?: any;
  /**
   * The group index of the cell&apos;s row. Available when the rowType is &apos;group&apos;.
   */
  groupIndex?: number;
  /**
   * Information about group summary items the cell represents.
   */
  groupSummaryItems?: Array<{
    /**
     * The group summary item&apos;s identifier.
     */
    name?: string;
    /**
     * The group summary item&apos;s raw value.
     */
    value?: any;
  }>;
  /**
   * The type of the cell&apos;s row.
   */
  rowType?: string;
  /**
   * The identifier of the total summary item that the cell represents.
   */
  totalSummaryItemName?: string;
  /**
   * The cell&apos;s raw value.
   */
  value?: any;
}
