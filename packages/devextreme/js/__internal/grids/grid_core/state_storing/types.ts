import type { PagerPageSize } from '@js/common/grids';

import type { USER_STATE_FIELD_NAMES } from '../columns_controller/const';
import type { Column } from '../columns_controller/types';
import type { UserState } from '../data_controller/types';
import type { InternalGridOptions } from '../m_types';

export type PersistentState = Record<string, unknown>;

export type ColumnUserState = Pick<Column, typeof USER_STATE_FIELD_NAMES[number]>;

/**
 * State persisted by DataGrid and TreeList.
 */
export interface GridState extends Partial<UserState> {
  columns?: ColumnUserState[];
  selectedRowKeys?: unknown[];
  selectionFilter?: InternalGridOptions['selectionFilter'];
  exportSelectionOnly?: boolean;
  allowedPageSizes?: (number | PagerPageSize)[];
  filterPanel?: { filterEnabled?: boolean };
  filterValue?: InternalGridOptions['filterValue'];
  focusedRowKey?: unknown;
}
