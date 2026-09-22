import type { RowExpandingEvent } from '@js/ui/data_grid';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ExecuteActionArgs, RowKey } from '@ts/grids/grid_core/m_types';

export type ChangeRowExpandArgs = ExecuteActionArgs<RowExpandingEvent<unknown, RowKey>>
  & { expanded: boolean };

export interface GroupItemData {
  key: unknown;
  items: GroupItemData[] | null;
  isContinuation?: boolean;
  count?: number;
}

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

export interface ProcessGroupItemsOptions {
  data?: RawItemData;
  collectContinuationItems: boolean;
  resultItems: (RawItemData | GroupItem)[];
  path: unknown[];
  values: unknown[];
}
