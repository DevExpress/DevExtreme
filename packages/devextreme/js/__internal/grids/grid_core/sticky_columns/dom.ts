/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined } from '@js/core/utils/type';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import { CLASSES, StickyPosition } from './const';
import { getColumnFixedPosition, isFixedEdge } from './utils';

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

const isStickyCellPinnedToLeft = (
  $cell: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): boolean => {
  const isStickyCell = $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumn));

  if (!isStickyCell) {
    return false;
  }

  const cellLeft = parseFloat($cell[0].style.left);
  const cellRect = getBoundingRect($cell[0]);
  const containerRect = getBoundingRect($container[0]);
  const calculatedCellLeft = cellRect.left - containerRect.left;

  return Math.round(cellLeft) >= Math.round(calculatedCellLeft);
};

const isStickyCellPinnedToRight = (
  $cell: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): boolean => {
  const isStickyCell = $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumn));

  if (!isStickyCell) {
    return false;
  }

  const cellRight = parseFloat($cell[0].style.right);
  const cellRect = getBoundingRect($cell[0]);
  const containerRect = getBoundingRect($container[0]);
  const calculatedCellRight = containerRect.right - cellRect.right;

  return Math.round(cellRight) >= Math.round(calculatedCellRight);
};

const isFixedCellPinnedToRight = (
  $cell: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): boolean => $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnRight))
  || isStickyCellPinnedToRight($cell, $container, addWidgetPrefix);

const isLastLeftFixedCell = (
  $cell: dxElementWrapper,
  addWidgetPrefix,
): boolean => $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnLeft))
    && $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnBorderRight));

const isFirstRightFixedCell = (
  $cell: dxElementWrapper,
  addWidgetPrefix,
): boolean => $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnRight))
    && $cell.hasClass(addWidgetPrefix(CLASSES.stickyColumnBorderLeft));

const getLeftFixedCells = ($cells: dxElementWrapper, addWidgetPrefix): dxElementWrapper => $cells
  // @ts-expect-error
  .filter((_, cell: HTMLElement) => $(cell).hasClass(addWidgetPrefix(CLASSES.stickyColumnLeft)));

const getRightFixedCells = ($cells: dxElementWrapper, addWidgetPrefix): dxElementWrapper => $cells
  // @ts-expect-error
  .filter((_, cell: HTMLElement) => $(cell).hasClass(addWidgetPrefix(CLASSES.stickyColumnRight)));

const getNonFixedAndStickyCells = (
  $cells: dxElementWrapper,
  addWidgetPrefix,
): dxElementWrapper => $cells
  // @ts-expect-error
  .filter((_, cell: HTMLElement) => $(cell).hasClass(addWidgetPrefix(CLASSES.stickyColumn))
      || !isFixedCell($(cell), addWidgetPrefix));

const getLastLeftFixedCell = (
  $cells: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): dxElementWrapper => {
  // @ts-expect-error
  const rtlEnabled = $container.css('direction') === 'rtl';
  const processedCells = rtlEnabled ? $cells.toArray() : $cells.toArray().reverse();
  const lastLeftFixedCell = processedCells
    .find((cell) => isStickyCellPinnedToLeft($(cell), $container, addWidgetPrefix)
          || isLastLeftFixedCell($(cell), addWidgetPrefix));

  return $(lastLeftFixedCell ?? '');
};

const getFirstRightFixedCell = (
  $cells: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): dxElementWrapper => {
  // @ts-expect-error
  const rtlEnabled = $container.css('direction') === 'rtl';
  const processedCells = rtlEnabled ? $cells.toArray().reverse() : $cells.toArray();
  const firstRightFixedCell = processedCells
    .find((cell) => isStickyCellPinnedToRight($(cell), $container, addWidgetPrefix)
          || isFirstRightFixedCell($(cell), addWidgetPrefix));

  return $(firstRightFixedCell ?? '');
};

const getNonFixedAreaBoundingRect = (
  $cells: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): { left: number; right: number } => {
  const containerRect = getBoundingRect($container.get(0));
  const result = {
    left: containerRect.left,
    right: containerRect.right,
  };

  if ($cells?.length) {
    const $lastLeftFixedCell = getLastLeftFixedCell($cells, $container, addWidgetPrefix);
    const $firstRightFixedCell = getFirstRightFixedCell($cells, $container, addWidgetPrefix);

    if ($lastLeftFixedCell?.length) {
      result.left = Math.round(getBoundingRect($lastLeftFixedCell[0]).right);
    }

    if ($firstRightFixedCell?.length) {
      result.right = Math.round(getBoundingRect($firstRightFixedCell[0]).left);
    }
  }

  return result;
};

const noNeedToCreateResizingPoint = (
  that: ColumnHeadersView,
  {
    point,
    column,
    nextColumn,
  }: {
    point: {
      x: number;
      index: number;
      item: HTMLElement;
      isLeftBoundary: boolean | undefined;
      isRightBoundary: boolean | undefined;
    };
    column;
    nextColumn;
  },
  addWidgetPrefix,
): boolean => {
  const { item, isLeftBoundary, isRightBoundary } = point;
  const $item = $(item);
  const offsetX = Math.round(point.x);
  const rtlEnabled = that.option('rtlEnabled') as boolean;
  const isSplitPoint = isDefined(isLeftBoundary) || isDefined(isRightBoundary);
  const $cells = $(that.getColumnElements() ?? '');
  const $container = $(that.getContent());
  const isFixedPoint = column?.fixed && nextColumn?.fixed;
  const nonFixedAreaBoundingRect = getNonFixedAreaBoundingRect($cells, $container, addWidgetPrefix);

  if (isFixedPoint || isFixedEdge(point, column, nextColumn)) {
    return false;
  }

  if (isSplitPoint) {
    if (isLastLeftFixedCell($item, addWidgetPrefix)
      || isStickyCellPinnedToLeft($item, $container, addWidgetPrefix)) {
      return isLeftBoundary as boolean;
    }

    if (isFirstRightFixedCell($item, addWidgetPrefix)
      || isStickyCellPinnedToRight($item, $container, addWidgetPrefix)) {
      return isRightBoundary as boolean;
    }
  }

  const isOutsideVisibleArea = offsetX < nonFixedAreaBoundingRect.left
    || offsetX > nonFixedAreaBoundingRect.right;
  const isPointBoundary = offsetX === nonFixedAreaBoundingRect.left
    || offsetX === nonFixedAreaBoundingRect.right;
  const isLastOrFirstPoint = rtlEnabled ? point.index === 0 : point.index === $cells.length;

  return isOutsideVisibleArea || (!isLastOrFirstPoint && isPointBoundary);
};

const noNeedToCreateReorderingPoint = (
  point,
  $cells: dxElementWrapper,
  $container: dxElementWrapper,
  addWidgetPrefix,
): boolean => {
  const { item, isLeftBoundary, isRightBoundary }: {
    item: HTMLElement;
    isLeftBoundary: boolean | undefined;
    isRightBoundary: boolean | undefined;
  } = point;
  const $item = $(item);
  const isSplitPoint = isDefined(isLeftBoundary) || isDefined(isRightBoundary);
  const nonFixedAreaBoundingRect = getNonFixedAreaBoundingRect($cells, $container, addWidgetPrefix);

  if (isStickyCellPinnedToLeft($item, $container, addWidgetPrefix)) {
    return isSplitPoint && !isLeftBoundary;
  }

  if (isStickyCellPinnedToRight($item, $container, addWidgetPrefix)) {
    return isSplitPoint && !isRightBoundary;
  }

  return point.x < nonFixedAreaBoundingRect.left || point.x > nonFixedAreaBoundingRect.right;
};

export const GridCoreStickyColumnsDom = {
  addFirstHeaderClass,
  addColumnNoBorderClass,
  addStickyColumnClass,
  addStickyColumnBorderLeftClass,
  addStickyColumnBorderRightClass,
  toggleStickyColumnsClass,
  getLeftFixedCells,
  getRightFixedCells,
  getNonFixedAndStickyCells,
  noNeedToCreateResizingPoint,
  isFixedCellPinnedToRight,
  noNeedToCreateReorderingPoint,
};
