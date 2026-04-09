import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

import type { Column } from '../columns_controller/types';
import { EDIT_ROW, EDITOR_CELL_CLASS } from '../editing/const';
import {
  ADAPTIVE_ITEM_TEXT_CLASS,
  COMMAND_SELECT_CLASS, DATA_ROW_CLASS,
  EDIT_FORM_CLASS,
  FREESPACE_ROW_CLASS,
  GROUP_ROW_CLASS,
  HEADER_ROW_CLASS,
  INTERACTIVE_ELEMENTS_SELECTOR,
  MASTER_DETAIL_ROW_CLASS,
  VIRTUAL_ROW_CLASS,
} from './const';
import type { KeyboardNavigationController } from './m_keyboard_navigation';
import type { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';
import type { NavigationDirection } from './types';

const DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';

// TODO remove undefined from types
export const isGroupRow = (
  $row: dxElementWrapper | undefined,
): boolean => !!$row?.hasClass(GROUP_ROW_CLASS);

export const isGroupFooterRow = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(DATAGRID_GROUP_FOOTER_CLASS);

export const isDetailRow = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(MASTER_DETAIL_ROW_CLASS);

export const isAdaptiveItem = (
  $element: dxElementWrapper,
): boolean => $element?.hasClass(ADAPTIVE_ITEM_TEXT_CLASS);

export const isEditRow = ($row: dxElementWrapper): boolean => $row?.hasClass(EDIT_ROW);

export const isEditForm = (
  $row: dxElementWrapper,
): boolean => $row?.hasClass(MASTER_DETAIL_ROW_CLASS) && $row.hasClass(EDIT_FORM_CLASS);

// TODO remove null and undefined from types
export const isDataRow = (
  $row: dxElementWrapper | undefined | null,
): boolean => !!$row?.hasClass(DATA_ROW_CLASS);

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

export const isCellInHeaderRow = ($cell: dxElementWrapper): boolean => !!$cell.parent(`.${HEADER_ROW_CLASS}`).length;

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
