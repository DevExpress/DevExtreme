const ATTRIBUTES = {
    ariaColIndex: 'aria-colindex',
    commandCell: 'dx-command-cell',
};

const isCommandCell = ($cell) => $cell.attr(ATTRIBUTES.commandCell) !== undefined;

const getCellToFocus = ($cellElements, columnIndex) => $cellElements
    .filter(`[${ATTRIBUTES.ariaColIndex}="${columnIndex + 1}"]:not([${ATTRIBUTES.commandCell}])`)
    .first();

export const GridCoreKeyboardNavigationDom = {
    isCommandCell,
    getCellToFocus,
};
