import type { HorizontalAlignment } from '@js/common';
import type {
  ColumnHeaderFilter,
  ColumnHeaderFilterSearchConfig,
  FilterType,
  HeaderFilter,
  HeaderFilterTexts,
} from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataSourceLike, DataSourceOptionsStub } from '@js/data/data_source';
import type { ShowingEvent } from '@js/ui/popup';
import type { NormalizedDataSourceOptions, StoreLoadOptions } from '@ts/data/data_source/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { InternalGrid } from '@ts/grids/grid_core/types';

export type EmptyDateValue = '' | false;

export type DateIntervalFormat = (value: number) => string;

export type HeaderFilterColumn = Column & Required<Pick<Column, 'calculateCellValue'>>;

export type HeaderFilterGroupSelector = (data: unknown) => unknown;

export interface HeaderFilterGroupDescriptor {
  selector: string | HeaderFilterGroupSelector | undefined;
  groupInterval?: string | number;
  isExpanded?: boolean;
  compare?: (value1: unknown, value2: unknown) => number;
}

export type HeaderFilterGroupItem = HeaderFilterGroupDescriptor
  | (HeaderFilterGroupSelector & { selector?: never });

export type HeaderFilterGroup = HeaderFilterGroupSelector | HeaderFilterGroupItem[];

export interface HeaderFilterItem {
  key?: unknown;
  value?: unknown;
  text?: string;
  selected?: boolean;
  items?: HeaderFilterItem[];
}

export interface ProcessGroupItemsOptions {
  level: number;
  column: Column;
  headerFilterOptions?: HeaderFilter;
}

export interface NormalizeGroupItemOptions {
  column: Column;
  headerFilterOptions?: HeaderFilter;
  path: unknown[];
  valueSelector?: HeaderFilterGroupSelector;
  displaySelector?: HeaderFilterGroupSelector;
}

export interface HeaderFilterMenuOptions
  extends Pick<
    HeaderFilterViewOptions,
    'apply' | 'onHidden' | 'isFilterBuilder' | 'dataSource' | 'dataField'
  > {
  columnElement: dxElementWrapper;
  column?: HeaderFilterColumn;
  applyFilter?: boolean;
}

export interface HeaderFilterDataSourceOptions
  extends Omit<DataSourceOptionsStub, 'group' | 'store'> {
  group?: DataSourceOptionsStub['group'] | HeaderFilterGroup;
  store?: DataSourceOptionsStub['store'] | NormalizedDataSourceOptions['store'];
  useDefaultSearch?: boolean;
  load?: (loadOptions: StoreLoadOptions) => DeferredObj<unknown>;
}

export interface HeaderFilterDataSourceArgs {
  component: InternalGrid;
  dataSource?: HeaderFilterDataSourceOptions;
}

export type HeaderFilterValues = unknown[];

export type HeaderFilterOptions = HeaderFilter
  & ColumnHeaderFilter
  & {
    search: ColumnHeaderFilterSearchConfig;
    texts: HeaderFilterTexts;
  };

export interface HeaderFilterViewOptions {
  type: 'tree' | 'list';
  apply: () => void;
  alignment?: HorizontalAlignment;
  encodeHtml?: boolean;
  isFilterBuilder?: boolean;
  filterType?: FilterType;
  filterValues?: HeaderFilterValues | null;
  headerFilter?: Partial<HeaderFilterOptions>;
  dataSource?: DataSourceLike<unknown> | HeaderFilterDataSourceOptions;
  lookup?: Column['lookup'];
  dataField?: string;
  selector?: Column['selector'];
  remoteFiltering?: boolean;
  useDefaultSearchExpr?: boolean;
  hidePopupCallback?: () => void;
  onShowing?: (e: ShowingEvent) => void;
  onHidden?: () => void;
}
