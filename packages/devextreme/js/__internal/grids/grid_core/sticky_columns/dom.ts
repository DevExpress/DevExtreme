/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CLASSES, StickyPosition } from './const';
import { getColumnFixedPosition } from './utils';

const addStickyColumnBorderLeftClass = ($cell, addWidgetPrefix): void => {
  $cell.addClass(addWidgetPrefix(CLASSES.stickyColumnBorderLeft));
};

const addStickyColumnBorderRightClass = ($cell, addWidgetPrefix): void => {
  $cell.addClass(addWidgetPrefix(CLASSES.stickyColumnBorderRight));
};

const addStickyColumnClass = ($cell, stickyColumn, addWidgetPrefix): void => {
  const fixedPosition = getColumnFixedPosition(stickyColumn);

  switch (fixedPosition) {
    case StickyPosition.Right:
      $cell.addClass(addWidgetPrefix(CLASSES.stickyColumnRight));
      break;
    case StickyPosition.Sticky:
      $cell.addClass(addWidgetPrefix(CLASSES.stickyColumn));
      break;
    default:
      $cell.addClass(addWidgetPrefix(CLASSES.stickyColumnLeft));
  }
};

const addFirstHeaderClass = ($cell, addWidgetPrefix): void => {
  $cell.addClass(addWidgetPrefix(CLASSES.firstHeader));
};

const addColumnNoBorderClass = ($cell, addWidgetPrefix): void => {
  $cell.addClass(addWidgetPrefix(CLASSES.columnNoBorder));
};

const toggleStickyColumnsClass = ($element, isStickyColumns, addWidgetPrefix): void => {
  $element.toggleClass(addWidgetPrefix(CLASSES.stickyColumns), isStickyColumns);
};

export const GridCoreStickyColumnsDom = {
  addFirstHeaderClass,
  addColumnNoBorderClass,
  addStickyColumnClass,
  addStickyColumnBorderLeftClass,
  addStickyColumnBorderRightClass,
  toggleStickyColumnsClass,
};
