/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ATTRIBUTES } from './const';

const isDragCell = ($cell) => $cell.attr(ATTRIBUTES.dragCell) !== undefined;

const getCellToFocus = ($cellElements, columnIndex) => $cellElements
  .filter(`[${ATTRIBUTES.ariaColIndex}="${columnIndex + 1}"]:not([${ATTRIBUTES.dragCell}])`)
  .first();

export const GridCoreKeyboardNavigationDom = {
  isDragCell,
  getCellToFocus,
};
