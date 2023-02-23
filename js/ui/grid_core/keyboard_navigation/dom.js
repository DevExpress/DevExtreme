import { ATTRIBUTES } from './const';

const isDragCell = ($cell) => $cell.attr(ATTRIBUTES.dragCell) !== undefined;

const getCellToFocus = ($cellElements, columnIndex) => $cellElements
    .filter(`[${ATTRIBUTES.ariaColIndex}="${columnIndex + 1}"]:not([${ATTRIBUTES.dragCell}])`)
    .first();

export const GridCoreKeyboardNavigationDom = {
    isDragCell,
    getCellToFocus,
};
