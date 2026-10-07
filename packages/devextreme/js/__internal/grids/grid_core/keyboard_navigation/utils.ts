import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { CLASSES as COLUMN_HEADERS_CLASSES } from '@ts/grids/grid_core/column_headers/const';
import { CLASSES as MASTER_DETAIL_CLASSES } from '@ts/grids/grid_core/master_detail/const';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';

import type { Column } from '../columns_controller/types';
import { EDIT_ROW, EDITOR_CELL_CLASS } from '../editing/const';
import {
  ADAPTIVE_ITEM_TEXT_CLASS,
  COMMAND_SELECT_CLASS,
  EDIT_FORM_CLASS,
  FREESPACE_ROW_CLASS,
  INTERACTIVE_ELEMENTS_SELECTOR,
  VIRTUAL_ROW_CLASS,
} from './const';
import type { KeyboardNavigationController } from './m_keyboard_navigation';
import type { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';
import type { NavigationDirection } from './types';

const DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';

// TODO remove undefined from types
export const isGroupRow = (
  $row: dxElementWrapper | undefined,
): boolean => !!$row?.hasClass(VIEW_CLASSES.groupRow);

export const isGroupFooterRow = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(DATAGRID_GROUP_FOOTER_CLASS);

export const isDetailRow = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(MASTER_DETAIL_CLASSES.detailRow);

export const isAdaptiveItem = (
  $element: dxElementWrapper,
): boolean => $element?.hasClass(ADAPTIVE_ITEM_TEXT_CLASS);

export const isEditRow = ($row: dxElementWrapper): boolean => $row?.hasClass(EDIT_ROW);

export const isEditForm = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(MASTER_DETAIL_CLASSES.detailRow) && $row.hasClass(EDIT_FORM_CLASS);

// TODO remove null and undefined from types
export const isDataRow = (
  $row: dxElementWrapper | null | undefined,
): boolean => !!$row?.hasClass(VIEW_CLASSES.dataRow);

export const isNotFocusedRow = (
  $row: dxElementWrapper,
): boolean => !$row || $row.hasClass(FREESPACE_ROW_CLASS) || $row.hasClass(VIRTUAL_ROW_CLASS);

export const isEditorCell = (
  that: KeyboardNavigationController,
  $cell: dxElementWrapper,
): boolean => !that.isRowEditMode()
  && $cell && !$cell.hasClass(COMMAND_SELECT_CLASS)
  && $cell.hasClass(EDITOR_CELL_CLASS);

// TODO remove null and undefined from types
export const isElementDefined = (
  $element: dxElementWrapper | null | undefined,
): boolean => isDefined($element) && $element.length > 0;

export const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

export const isCellInHeaderRow = ($cell: dxElementWrapper): boolean => !!$cell.parent(`.${COLUMN_HEADERS_CLASSES.headerRow}`).length;

export const isFixedColumnIndexOffsetRequired = (
  that: KeyboardNavigationControllerCore,
  column: Column,
): boolean => {
  const rtlEnabled = that.option('rtlEnabled');

  if (rtlEnabled) {
    return !(column.fixedPosition === 'right' || (isDefined(column.command) && !isDefined(column.fixedPosition)));
  }
  return !(!isDefined(column.fixedPosition) || column.fixedPosition === 'left');
};

export const shouldPreventScroll = (
  that: KeyboardNavigationController,
): boolean => (that._isVirtualScrolling()
  ? that.option('focusedRowIndex') === that.getRowIndex()
  : false);

export const getInteractiveElements = ($cell: dxElementWrapper): dxElementWrapper => $cell
  .find(INTERACTIVE_ELEMENTS_SELECTOR)
  .filter(':visible');

export const getInteractiveElement = (
  $cell: dxElementWrapper,
  isLast: boolean,
): dxElementWrapper => {
  const $focusedElement = getInteractiveElements($cell);

  return isLast ? $focusedElement.last() : $focusedElement.first();
};

export const getNextColumnIndex = (
  direction: NavigationDirection,
  columnIndex: number,
): number => (direction === 'next' || direction === 'nextInRow'
  ? columnIndex + 1
  : columnIndex - 1);
