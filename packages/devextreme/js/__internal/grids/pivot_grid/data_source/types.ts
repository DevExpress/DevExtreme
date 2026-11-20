import type { ScalarFilterValue } from '@js/common/grids';
import type { PivotGridArea, PivotGridDataSourceOptions } from '@js/ui/pivot_grid/data_source';
import type {
  PivotGridDescriptions,
  PivotGridField,
  PivotGridHeaderItem,
  PivotGridLoadOptions,
  PivotGridLoadResult,
  PivotGridStore,
} from '@ts/grids/pivot_grid/types';

export interface DataSourceHeaderItem extends PivotGridHeaderItem {
  text?: string;
  displayText?: string;
  key?: unknown;
  isEmpty?: boolean[];
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
  isEmptyGrandTotalRow?: boolean[];
  isEmptyGrandTotalColumn?: boolean[];
};

export type DataSourceOptions = PivotGridDataSourceOptions & {
  pageSize?: number;
  descriptions?: Partial<PivotGridDescriptions>;
  load?: unknown;
};

export type DataSourceStoreOption = Partial<PivotGridStore> & { type?: string };

export type DataSourceEventName = 'changed'
  | 'loadError'
  | 'loadingChanged'
  | 'progressChanged'
  | 'fieldsPrepared'
  | 'fieldChanged'
  | 'customizeStoreLoadOptions'
  | 'expandValueChanging';

export type DataSourceHeaderArea = Extract<PivotGridArea, 'row' | 'column'>;

export interface DataSourceState {
  fields: PivotGridField[];
  columnExpandedPaths: ScalarFilterValue[][];
  rowExpandedPaths: ScalarFilterValue[][];
}

export type DataSourceLoadOptions = Partial<PivotGridLoadOptions> & {
  fields?: PivotGridField[];
  area?: DataSourceHeaderArea;
  expanded?: boolean;
  needExpandData?: boolean;
  reload?: boolean;
  pageSize?: number;
};

export type DataSourceStoreLoadOptions = DataSourceLoadOptions & PivotGridLoadOptions;
