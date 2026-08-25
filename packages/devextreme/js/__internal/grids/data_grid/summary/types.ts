import type {
  SummaryGroupItem as SummaryGroupItemOption,
  SummaryTotalItem as SummaryTotalItemOption, SummaryType,
} from '@js/ui/data_grid';
import type { Column } from '@ts/grids/data_grid/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { GroupItem } from '../grouping/types';

export interface SummaryItem extends SummaryGroupItemOption, SummaryTotalItemOption { }

export interface SummaryCellItem extends SummaryItem {
  value?: unknown;
  columnCaption?: string;
}

export interface SummaryGroupItem extends Omit<GroupItem, 'rowType'> {
  rowType: GroupItem['rowType'] | 'groupFooter';
  summaryCells?: SummaryCellItem[][];
}

export interface FooterItem {
  rowType: 'totalFooter';
  summaryCells: SummaryCellItem[][];
}

export type ColumnMap = Map<string | number, Column>;

export interface CalculateSummaryCellsArgs {
  summaryItems: SummaryItem[];
  aggregates: unknown[];
  visibleColumns: Column[];
  calculateTargetColumnIndex: (summaryItem: SummaryItem, column?: Column) => number;
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
  summaryType?: SummaryType | string | undefined;
  skipEmptyValues?: boolean;
}

export interface SummaryOptions {
  groupAggregates: Aggregate[];
  totalAggregates: Aggregate[];
  sortByGroups: () => SortByGroups | undefined;
}
