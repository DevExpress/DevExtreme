import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export interface SummaryItem {
  /** Number as a column index or string as a column name, dataField, or caption. */
  column?: string | number | undefined;
  /** Number as a column index or string as a column name, dataField, or caption. */
  showInColumn?: string | number | undefined;
  showInGroupFooter?: boolean;
  alignByColumn?: boolean;
  summaryType?: string | undefined;
  valueFormat?: unknown;
  name?: string | undefined;
  skipEmptyValues?: boolean;
  alignment?: string | undefined;
  cssClass?: string | undefined;
  customizeText?: ((itemInfo: { value?: string | number | Date; valueText: string }) => string);
  displayFormat?: string | undefined;
}

export type ColumnMap = Map<string | number, Column>;

export interface CalculateSummaryCellsArgs {
  summaryItems: SummaryItem[];
  aggregates: unknown[];
  visibleColumns: Column[];
  calculateTargetColumnIndex: (summaryItem: SummaryItem, column) => number;
  isGroupRow?: boolean;
  columnMap?: ColumnMap;
}
