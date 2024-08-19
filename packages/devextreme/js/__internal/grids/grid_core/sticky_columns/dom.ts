/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CLASSES, StickyPosition } from './const';
import { getColumnFixedPosition } from './utils';

const addLeftStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const lastLeftStickyColumn = [...stickyColumns]
    .reverse()
    .find((col) => getColumnFixedPosition(col) === StickyPosition.Left);

  $cell.addClass(addWidgetPrefix(CLASSES.leftStickyColumn));

  if (stickyColumn.index === lastLeftStickyColumn.index) {
    $cell.addClass(addWidgetPrefix(CLASSES.lastLeftStickyColumn));
  }
};

const addRightStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const firstRightStickyColumn = stickyColumns
    .find((col) => getColumnFixedPosition(col) === StickyPosition.Right);

  $cell.addClass(addWidgetPrefix(CLASSES.rightStickyColumn));

  if (stickyColumn.index === firstRightStickyColumn.index) {
    $cell.addClass(addWidgetPrefix(CLASSES.firstRightStickyColumn));
  }
};

const addStickyColumnClass = ($cell, addWidgetPrefix): void => {
  $cell.addClass(addWidgetPrefix(CLASSES.stickyColumn));
};

const addStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const fixedPosition = getColumnFixedPosition(stickyColumn);

  switch (fixedPosition) {
    case StickyPosition.Right:
      addRightStickyColumnClasses($cell, stickyColumn, stickyColumns, addWidgetPrefix);
      break;
    case StickyPosition.Sticky:
      addStickyColumnClass($cell, addWidgetPrefix);
      break;
    default:
      addLeftStickyColumnClasses($cell, stickyColumn, stickyColumns, addWidgetPrefix);
  }
};

const toggleStickyColumnsClass = ($element, isStickyColumns, addWidgetPrefix): void => {
  $element.toggleClass(addWidgetPrefix(CLASSES.stickyColumns), isStickyColumns);
};

export const GridCoreStickyColumnsDom = {
  addStickyColumnClasses,
  toggleStickyColumnsClass,
};
