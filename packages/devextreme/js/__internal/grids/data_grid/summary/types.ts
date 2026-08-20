import type {
  SummaryGroupItem,
  SummaryTotalItem, SummaryType,
} from '@js/ui/data_grid';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

export interface SummaryItem extends SummaryGroupItem, SummaryTotalItem { }

export interface SummaryCellItem extends SummaryItem {
  value?: unknown;
  columnCaption?: string;
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

export interface SortInfo {
  selector: (data: RawItemData) => unknown;
  desc: boolean;
}

// NOTE: indexed by groupIndex, so levels without sort info are left empty
export type SortByGroups = (SortInfo[] | undefined)[];

export interface CustomAggregator {
  seed: (groupIndex: number) => unknown;
  step: (totalValue: unknown, value: unknown) => unknown;
  finalize: (totalValue: unknown) => unknown;
}

export interface Aggregate {
  selector?: string | ((data: RawItemData) => unknown);
  aggregator?: string | Exclude<SummaryType, 'custom'> | CustomAggregator;
  skipEmptyValues?: boolean;
}

export interface SummaryOptions {
  groupAggregates: Aggregate[];
  totalAggregates: Aggregate[];
  sortByGroups: () => SortByGroups | undefined;
}
