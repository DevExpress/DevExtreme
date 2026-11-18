import type { PivotGridDataSourceOptions } from '@js/ui/pivot_grid/data_source';
import type {
  PivotGridDescriptions,
  PivotGridHeaderItem,
  PivotGridLoadResult,
  PivotGridStore,
} from '@ts/grids/pivot_grid/types';

export interface HeaderItem extends PivotGridHeaderItem {
  text?: string;
  children?: HeaderItem[];
  collapsedChildren?: HeaderItem[];
}

/** updateCache() adds the items by joined path. */
export type HeaderItems = HeaderItem[] & {
  _cacheByPath?: Record<string, HeaderItem>;
};

/** Starts empty, so the grand total indexes come with the first load. */
export interface LoadedData extends Omit<
  PivotGridLoadResult,
  'rows' | 'columns' | 'grandTotalRowIndex' | 'grandTotalColumnIndex'
> {
  rows: HeaderItems;
  columns: HeaderItems;
  grandTotalRowIndex?: number;
  grandTotalColumnIndex?: number;
}

/** `load` marks data source options of a custom store. */
export type DataSourceOptions = PivotGridDataSourceOptions & {
  pageSize?: number;
  descriptions?: Partial<PivotGridDescriptions>;
  load?: unknown;
};

/** createStore() tells the store option apart by these members. */
export type StoreOption = Partial<PivotGridStore> & { type?: string };

export type ProgressHandler = (progress: number) => void;
