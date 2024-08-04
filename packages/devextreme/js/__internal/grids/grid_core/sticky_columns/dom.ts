/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CLASSES, StickyPosition } from './const';

const getStickyColumnPosition = (
  { fixed, fixedPosition }: { fixed: boolean; fixedPosition: StickyPosition | undefined },
): StickyPosition | '' => {
  if (!fixed) {
    return '';
  }

  return fixedPosition || StickyPosition.Left;
};

const addLeftStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const lastLeftStickyColumn = [...stickyColumns]
    .reverse()
    .find((col) => getStickyColumnPosition(col) === StickyPosition.Left);

  $cell.addClass(addWidgetPrefix(CLASSES.leftStickyColumn));

  if (stickyColumn.index === lastLeftStickyColumn.index) {
    $cell.addClass(addWidgetPrefix(CLASSES.lastLeftStickyColumn));
  }
};

const addRightStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const firstRightStickyColumn = stickyColumns
    .find((col) => getStickyColumnPosition(col) === StickyPosition.Right);

  $cell.addClass(addWidgetPrefix(CLASSES.rightStickyColumn));

  if (stickyColumn.index === firstRightStickyColumn.index) {
    $cell.addClass(addWidgetPrefix(CLASSES.firstRightStickyColumn));
  }
};

const addStickyColumnClasses = ($cell, stickyColumn, stickyColumns, addWidgetPrefix): void => {
  const fixedPosition = getStickyColumnPosition(stickyColumn);

  switch (fixedPosition) {
    case StickyPosition.Right:
      addRightStickyColumnClasses($cell, stickyColumn, stickyColumns, addWidgetPrefix);
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
