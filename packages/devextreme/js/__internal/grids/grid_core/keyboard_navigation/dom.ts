/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ATTRIBUTES } from './const';

const isDragCell = ($cell) => $cell.attr(ATTRIBUTES.dragCell) !== undefined;

const getFocusableCellSelector = (columnIndex: number): string => [
  `[${ATTRIBUTES.ariaColIndex}="${columnIndex + 1}"]`,
  `:not([${ATTRIBUTES.dragCell}])`,
  ':not([aria-hidden=true])',
].join('');

const getCellToFocus = ($cellElements, columnIndex) => $cellElements
  .filter(getFocusableCellSelector(columnIndex))
  .first();

export const GridCoreKeyboardNavigationDom = {
  isDragCell,
  getCellToFocus,
};
