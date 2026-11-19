import type { PivotGridDataSourceOptions } from '@js/ui/pivot_grid/data_source';
import type {
  PivotGridDescriptions,
  PivotGridHeaderItem,
  PivotGridLoadResult,
  PivotGridStore,
} from '@ts/grids/pivot_grid/types';

export interface DataSourceHeaderItem extends PivotGridHeaderItem {
  text?: string;
  children?: DataSourceHeaderItem[];
  collapsedChildren?: DataSourceHeaderItem[];
}

export type DataSourceHeaderItemsByPath = Record<string, DataSourceHeaderItem>;

export type DataSourceHeaderItems = DataSourceHeaderItem[] & {
  _cacheByPath?: DataSourceHeaderItemsByPath;
};

export type DataSourceData = Omit<
  PivotGridLoadResult,
  'rows' | 'columns' | 'grandTotalRowIndex' | 'grandTotalColumnIndex'
> & {
  rows: DataSourceHeaderItems;
  columns: DataSourceHeaderItems;
  grandTotalRowIndex?: number;
  grandTotalColumnIndex?: number;
};

export type DataSourceOptions = PivotGridDataSourceOptions & {
  pageSize?: number;
  descriptions?: Partial<PivotGridDescriptions>;
  load?: unknown;
};

export type DataSourceStoreOption = Partial<PivotGridStore> & { type?: string };
