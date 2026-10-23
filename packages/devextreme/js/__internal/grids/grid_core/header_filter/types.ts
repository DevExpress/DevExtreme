import type { HorizontalAlignment } from '@js/common';
import type {
  ColumnHeaderFilter,
  ColumnHeaderFilterSearchConfig,
  FilterType,
  HeaderFilter,
  HeaderFilterTexts,
} from '@js/common/grids';
import type { DataSourceLike } from '@js/data/data_source';
import type { ShowingEvent } from '@js/ui/popup';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export type EmptyDateValue = '' | false;

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
  dataSource?: DataSourceLike<unknown>;
  lookup?: Column['lookup'];
  dataField?: string;
  selector?: Column['selector'];
  remoteFiltering?: boolean;
  useDefaultSearchExpr?: boolean;
  hidePopupCallback?: () => void;
  onShowing?: (e: ShowingEvent) => void;
  onHidden?: () => void;
}
