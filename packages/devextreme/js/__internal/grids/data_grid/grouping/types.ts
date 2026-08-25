import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

export interface GroupItemData {
  key: unknown;
  items: GroupItemData[] | null;
  isContinuation?: boolean;
  count?: number;
}

export interface GroupItem {
  rowType: 'group';
  data: RawItemData;
  groupIndex: number;
  isExpanded?: boolean;
  key: unknown[];
  values: unknown[];
}

export type DataItem = GroupItemData | Record<string, unknown>;

export interface GroupInfoData {
  offset: number;
  count: number;
  path: unknown[];
  isExpanded: boolean;
  isPending?: boolean;
}

export interface ProcessGroupItemsOptions {
  data?: RawItemData;
  collectContinuationItems: boolean;
  resultItems: (RawItemData | GroupItem)[];
  path: unknown[];
  values: unknown[];
}
