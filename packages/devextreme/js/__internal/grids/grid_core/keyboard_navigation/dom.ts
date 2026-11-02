import type { dxElementWrapper } from '@js/core/renderer';

import { ATTRIBUTES } from './const';

const isDragCell = (
  $cell: dxElementWrapper,
): boolean => $cell.attr(ATTRIBUTES.dragCell) !== undefined;

const getFocusableCellSelector = (columnIndex: number): string => [
  `[${ATTRIBUTES.ariaColIndex}="${columnIndex + 1}"]`,
  `:not([${ATTRIBUTES.dragCell}])`,
  ':not([aria-hidden=true])',
].join('');

const getCellToFocus = (
  $cellElements: dxElementWrapper,
  columnIndex: number,
): dxElementWrapper => $cellElements
  .filter(getFocusableCellSelector(columnIndex))
  .first();

export const GridCoreKeyboardNavigationDom = {
  isDragCell,
  getCellToFocus,
};
