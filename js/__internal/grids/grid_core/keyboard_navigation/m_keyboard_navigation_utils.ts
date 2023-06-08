import devices from '@js/core/devices';
import { isDefined } from '@js/core/utils/type';

import { EDITOR_CELL_CLASS } from '../editing/const';
import {
  COMMAND_SELECT_CLASS, FREESPACE_ROW_CLASS, GROUP_ROW_CLASS, HEADER_ROW_CLASS,
  MASTER_DETAIL_ROW_CLASS, VIRTUAL_ROW_CLASS,
} from './const';

export function isGroupRow($row) {
  return $row && $row.hasClass(GROUP_ROW_CLASS);
}

export function isDetailRow($row) {
  return $row && $row.hasClass(MASTER_DETAIL_ROW_CLASS);
}

export function isDataRow($row) {
  return $row && !isGroupRow($row) && !isDetailRow($row);
}

export function isNotFocusedRow($row) {
  return !$row || $row.hasClass(FREESPACE_ROW_CLASS) || $row.hasClass(VIRTUAL_ROW_CLASS);
}

export function isEditorCell(that, $cell) {
  return !that._isRowEditMode() && $cell && !$cell.hasClass(COMMAND_SELECT_CLASS) && $cell.hasClass(EDITOR_CELL_CLASS);
}

export function isElementDefined($element) {
  return isDefined($element) && $element.length > 0;
}

export function isMobile() {
  return devices.current().deviceType !== 'desktop';
}

export function isCellInHeaderRow($cell) {
  return !!$cell.parent(`.${HEADER_ROW_CLASS}`).length;
}

export function isFixedColumnIndexOffsetRequired(that, column) {
  const rtlEnabled = that.option('rtlEnabled');

  if (rtlEnabled) {
    return !(column.fixedPosition === 'right' || (isDefined(column.command) && !isDefined(column.fixedPosition)));
  }
  return !(!isDefined(column.fixedPosition) || column.fixedPosition === 'left');
}

export function shouldPreventScroll(that) {
  const keyboardController = that.getController('keyboardNavigation');
  return keyboardController._isVirtualScrolling() ? that.option('focusedRowIndex') === keyboardController.getRowIndex() : false;
}
