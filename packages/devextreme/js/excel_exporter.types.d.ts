import { ExportLoadPanel } from './exporter/export_load_panel';
import { Cell } from './ui/pivot_grid';
import { Column } from './ui/data_grid';
import { CellAddress, CellRange } from './common/export/excel.types';

/**
 * @docid
 * @namespace DevExpress.excelExporter
 * @type object
 * @hidden
 */
export interface ExcelExportBaseOptions {
  /**
   * @docid
   * @default undefined
   * @public
   */
  worksheet?: object | undefined;
  /**
   * @docid
   * @default { row: 1, column: 1 }
   * @public
   */
  topLeftCell?: CellAddress | string;
  /**
   * @docid
   * @default true
   * @public
   */
  keepColumnWidths?: boolean;
  /**
   * @docid
   * @public
   */
  loadPanel?: ExportLoadPanel;
  /**
   * @docid
   * @default false
   * @public
   */
   encodeExecutableContent?: boolean;
}

/**
 * @namespace DevExpress.excelExporter
 * @deprecated Use PivotGridCell instead
 */
export interface ExcelPivotGridCell extends Cell {
  /**
   * @docid
   * @public
   */
  area?: 'column' | 'row' | 'data';
  /**
   * @docid
   * @public
   */
  rowIndex?: number;
  /**
   * @docid
   * @public
   */
  columnIndex?: number;
  /**
   * @docid
   * @public
   */
  headerType?: 'column' | 'row' | 'data' | 'filter';
}

/**
 * @namespace DevExpress.excelExporter
 * @deprecated Use DataGridCell instead
 */
export interface ExcelDataGridCell {
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

export {
  CellAddress,
  CellRange,
};
