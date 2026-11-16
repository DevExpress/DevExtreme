import type { DeferredObj } from '@js/core/utils/deferred';
import type { RowExpandingEvent } from '@js/ui/data_grid';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/data_source_adapter';
import type { LoadOperation, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ColumnKeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/column_keyboard_navigation_core';
import type { ExecuteActionArgs } from '@ts/grids/grid_core/modules/types';
import type { RowKey } from '@ts/grids/grid_core/types';

import type { GroupingHelper } from './grouping_core';

export interface GroupingDataSourceAdapterExtension {
  _grouping: GroupingHelper;
  isRowExpanded: (key: RowKey) => boolean;
  collapseAll: (groupIndex?: number) => boolean;
  expandAll: (groupIndex?: number) => boolean;
}

export type GroupingDataSourceAdapter = DataSourceAdapter & GroupingDataSourceAdapterExtension;

export type GroupingKeyboardNavigationController = ColumnKeyboardNavigationController & {
  groupColumn?: (column: Column, rowIndex: number) => void;
  ungroupColumn?: (column: Column, rowIndex: number) => void;
  ungroupAllColumns?: () => void;
};

export type ChangeRowExpandArgs = ExecuteActionArgs<RowExpandingEvent<unknown, RowKey>>
  & { expanded: boolean };

export interface GroupingDataControllerExtension {
  expandRow: (key: RowKey) => DeferredObj<unknown>;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  changeRowExpand(key: RowKey, isRowClick?: boolean): DeferredObj<unknown>;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  isRowExpanded(key: RowKey): boolean;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  changeRowExpandCore(key: RowKey): DeferredObj<unknown>;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  expandAll(groupIndex: number): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  collapseAll(groupIndex: number): void;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- fits RawItemData
export type GroupItemData = {
  key: unknown;
  items: GroupItemData[] | null;
  isContinuation?: boolean;
  isContinuationOnNextPage?: boolean;
  collapsedItems?: GroupItemData[] | null;
  count?: number;
};

export type GroupContinuationData = Pick<GroupItemData, 'isContinuation' | 'isContinuationOnNextPage'>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GroupItem = {
  rowType: 'group';
  data: RawItemData;
  groupIndex: number;
  isExpanded?: boolean;
  key: unknown[];
  values: unknown[];
};

export type DataItem = GroupItemData | Record<string, unknown>;

export interface GroupInfoData {
  offset: number;
  count: number;
  path: unknown[];
  isExpanded: boolean;
  isPending?: boolean;
  childrenTotalCount?: number;
  skipChildrenTotalCount?: number;
}

export interface ExpandedGroupsInfo {
  items: GroupItemData[];
  paths: unknown[][];
  count: number;
  lastCount: number;
  skip?: number;
  take?: number;
}

export type GroupPagingOptions = Pick<LoadOperation, 'skip' | 'take' | 'skips' | 'takes'>;

export type GroupPagingCallback = (groupInfo: GroupInfoData, totalOffset: number) => void;

export type GroupItemsLoadResult = CustomLoadResult | DeferredObj<CustomLoadResult>;

export interface GroupInfo {
  key: RowKey;
  offset: number;
  data: GroupInfoData;
  children: GroupInfoLevel;
}

export type GroupInfoLevel = GroupInfo[] & {
  hash?: Record<string, GroupInfo>;
};

export type ForeachGroupsResult = false | DeferredObj<unknown> | undefined;

export interface GroupItemsPosition {
  offset: number;
  take: number;
}

export interface GroupItemsProcessingState extends GroupItemsPosition {
  skipFirstItem: boolean | undefined;
  needRemoveFirstItem: boolean;
  removeLastItemsCount: number;
}

export interface GroupingLoadOperation extends LoadOperation {
  collapsedGroups?: GroupInfoData[];
  collapsedItemsCount?: number;
  skipFirstItem?: boolean;
  extra?: LoadOperation['extra'] & {
    _totalCountWasIncreasedByCollapsedItems?: boolean;
  };
}

export type ForeachGroupsCallback = (
  groupInfo: GroupInfoData,
  parents: GroupInfoData[],
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- may return nothing
) => ForeachGroupsResult | void;

export interface ProcessGroupItemsOptions {
  data?: RawItemData;
  collectContinuationItems: boolean;
  resultItems: (RawItemData | GroupItem)[];
  path: unknown[];
  values: unknown[];
}
