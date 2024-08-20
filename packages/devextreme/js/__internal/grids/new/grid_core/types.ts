import type { DataSourceLike } from '@js/data/data_source';
import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

import type { ColumnProperties } from './columns_controller/types';
import type { Change } from './editing/types';
import type { DEFAULT_TOOLBAR_ITEMS } from './header_panel/defaults';

export interface ToolbarItem extends BaseToolbarItem {
  name?: string;
}

export type PredefinedToolbarItem = ToolbarItem & { name: typeof DEFAULT_TOOLBAR_ITEMS[number] };

interface Paging {
  pageSize?: number;

  pageIndex?: number;
}

export interface Properties {
  paging?: Paging;

  columns?: ColumnProperties[];

  filterPanelVisible?: boolean;

  noDataText?: string;

  dataSource?: DataSourceLike<unknown>;

  searchText?: string;

  editingChanges?: Change[];

  toolbarItems?: ToolbarItem[];
}

export type ToolbarConfiguration = ToolbarItem | string;
