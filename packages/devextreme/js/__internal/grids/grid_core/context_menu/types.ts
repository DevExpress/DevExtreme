import type { ColumnKeyboardNavigationController } from '../keyboard_navigation/column_keyboard_navigation_core';
import type { ModuleType } from '../types';
import type { ColumnsView } from '../views/columns_view';
import type { ContextMenuItemsOptions, GridContextMenuItem } from '../views/types';

export type ContextMenuViewName = 'columnHeadersView' | 'rowsView' | 'footerView' | 'headerPanel';

export interface ContextMenuPreparingOptions extends ContextMenuItemsOptions {
  items?: GridContextMenuItem[];
}

export interface ColumnContextMenuMixinRequirements extends ColumnsView {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- optional view hook
  isColumnReorderingEnabled?(column: ContextMenuItemsOptions['column']): boolean | undefined;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- optional view hook
  getKeyboardNavigationController?(): ColumnKeyboardNavigationController;
}

export type MixinBase = ModuleType<ColumnContextMenuMixinRequirements>;
