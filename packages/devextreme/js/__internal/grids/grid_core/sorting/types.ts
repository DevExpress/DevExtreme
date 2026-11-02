import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';

import type { ColumnStateOptions, IndicatorOptions } from '../column_state_mixin/types';
import type { Column } from '../columns_controller/types';
import type { ModuleType } from '../types';
import type { ColumnsView } from '../views/columns_view';

export type MixinBase = ModuleType<ColumnsView>;

export interface SortingColumn extends Column {
  isGrouped?: boolean;
}

export interface SortingColumnStateOptions extends ColumnStateOptions {
  column: SortingColumn;
}

export interface RenderedIndicatorOptions extends IndicatorOptions {
  container: dxElementWrapper;
  indicator: dxElementWrapper;
}

export type AriaSortState = 'ascending' | 'descending';

export type HeaderActionEvent = DxEvent<MouseEvent | KeyboardEvent>;

export type SortKeyName = 'shift' | 'ctrl' | null;
