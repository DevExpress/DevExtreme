/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CLASSES, StickyPosition } from './const';

const addLeftStickyColumnClasses = ($cell, stickyColumn, stickyColumns): void => {
  const lastLeftStickyColumn = [...stickyColumns]
    .reverse()
    .find((col) => col.fixedPosition === StickyPosition.Left);

  $cell.addClass(CLASSES.leftStickyColumn);

  if (stickyColumn.index === lastLeftStickyColumn.index) {
    $cell.addClass(CLASSES.lastLeftStickyColumn);
  }
};

const addRightStickyColumnClasses = ($cell, stickyColumn, stickyColumns): void => {
  const firstRightStickyColumn = stickyColumns
    .find((col) => col.fixedPosition === StickyPosition.Right);

  $cell.addClass(CLASSES.rightStickyColumn);

  if (stickyColumn.index === firstRightStickyColumn.index) {
    $cell.addClass(CLASSES.firstRightStickyColumn);
  }
};

const addStickyColumnClasses = ($cell, stickyColumn, stickyColumns): void => {
  switch (stickyColumn.fixedPosition) {
    case StickyPosition.Right:
      addRightStickyColumnClasses($cell, stickyColumn, stickyColumns);
      break;
    default:
      addLeftStickyColumnClasses($cell, stickyColumn, stickyColumns);
  }
};

const toggleStickyColumnsClass = ($element, isStickyColumns): void => {
  $element.toggleClass(CLASSES.stickyColumns, isStickyColumns);
};

export const GridCoreStickyColumnsDom = {
  addStickyColumnClasses,
  toggleStickyColumnsClass,
};
