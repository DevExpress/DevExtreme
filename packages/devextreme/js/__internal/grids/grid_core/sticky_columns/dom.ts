/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';

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

const isLastLeftFixedCell = (
  cell: HTMLElement,
  addWidgetPrefix,
): boolean => {
  const $cell = $(cell);

  return $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnLeft))
    && $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnBorderRight));
};

const isFirstRightFixedCell = (
  cell: HTMLElement,
  addWidgetPrefix,
): boolean => {
  const $cell = $(cell);

  return $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnRight))
    && $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnBorderLeft));
};

const isFixedCell = (cell: HTMLElement, addWidgetPrefix): boolean => {
  const $cell = $(cell);

  return $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnLeft))
    || $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnRight))
    || $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumn));
};

const isStickyCellPinnedToLeft = (cell: HTMLElement, container, addWidgetPrefix): boolean => {
  const isStickyCell = $(cell).hasClass(addWidgetPrefix(CLASSES.stickyColumn));

  if (!isStickyCell) {
    return false;
  }

  const cellLeft = parseFloat(cell.style.left);
  const cellRect = getBoundingRect(cell);
  const containerRect = getBoundingRect(container);
  const calculatedCellLeft = cellRect.left - containerRect.left;

  return Math.round(cellLeft) >= Math.round(calculatedCellLeft);
};

const isStickyCellPinnedToRight = (cell: HTMLElement, container, addWidgetPrefix): boolean => {
  const isStickyCell = $(cell).hasClass(addWidgetPrefix(CLASSES.stickyColumn));

  if (!isStickyCell) {
    return false;
  }

  const cellRight = parseFloat(cell.style.right);
  const cellRect = getBoundingRect(cell);
  const containerRect = getBoundingRect(container);
  const calculatedCellRight = containerRect.right - cellRect.right;

  return Math.round(cellRight) >= Math.round(calculatedCellRight);
};

const isPointUnderFixedColumn = (
  {
    x,
    y,
    item,
  }: {
    x: number;
    y: number;
    item: HTMLElement;
  },
  container: HTMLElement,
  addWidgetPrefix,
): boolean => {
  const elementsFromPoint = domAdapter.elementsFromPoint(x, y, container);
  const firstElementFromPoint = elementsFromPoint[0];

  if (!$(firstElementFromPoint).closest($(container)).length) {
    return true;
  }

  return firstElementFromPoint !== item && isFixedCell(firstElementFromPoint, addWidgetPrefix);
};

const noNeedToCreatePoint = (
  point,
  container: HTMLElement,
  addWidgetPrefix,
): boolean => {
  const { item, isLeftBoundary, isRightBoundary }: {
    item: HTMLElement;
    isLeftBoundary: boolean | undefined;
    isRightBoundary: boolean | undefined;
  } = point;
  const isSplitPoint = isDefined(isLeftBoundary) || isDefined(isRightBoundary);

  if (!isSplitPoint
    && isFixedCell(item, addWidgetPrefix) !== isFixedCell($(item).prev()[0], addWidgetPrefix)) {
    return false;
  }

  if (isSplitPoint) {
    if (isLastLeftFixedCell(item, addWidgetPrefix)
      || isStickyCellPinnedToLeft(item, container, addWidgetPrefix)) {
      return isLeftBoundary as boolean;
    }

    if (isFirstRightFixedCell(item, addWidgetPrefix)
      || isStickyCellPinnedToRight(item, container, addWidgetPrefix)) {
      return isRightBoundary as boolean;
    }
  }

  return isPointUnderFixedColumn(point, container, addWidgetPrefix);
};

export const GridCoreStickyColumnsDom = {
  addFirstHeaderClass,
  addColumnNoBorderClass,
  addStickyColumnClass,
  addStickyColumnBorderLeftClass,
  addStickyColumnBorderRightClass,
  toggleStickyColumnsClass,
  noNeedToCreatePoint,
};
