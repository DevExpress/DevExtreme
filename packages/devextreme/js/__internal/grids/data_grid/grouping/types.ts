import type { DeferredObj } from '@js/core/utils/deferred';
import type { RowExpandingEvent } from '@js/ui/data_grid';
import type { LoadOperation, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ExecuteActionArgs } from '@ts/grids/grid_core/modules/types';
import type { RowKey } from '@ts/grids/grid_core/types';

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
}

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
