import type { dxElementWrapper } from '@js/core/renderer';
import { getOuterHeight } from '@js/core/utils/size';
import { isString } from '@js/core/utils/type';
import { columnHasValue } from '@ts/grids/grid_core/columns_controller/columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import gridCoreUtils from '../utils';

const INVISIBLE_CLASS = 'dx-state-invisible';

export const isPercentWidth = (width: unknown): width is `${string}%` => isString(width) && width.endsWith('%');

export const getCellText = (
  column: Column,
  displayValue: unknown,
): string => (
  columnHasValue(column)
    ? gridCoreUtils.formatValue(displayValue, column)
    : ''
);

export const getMaxHorizontalScrollOffset = (container: HTMLElement | undefined): number => (
  container ? Math.round(container.scrollWidth - container.clientWidth) : 0
);

// refresh() rebuilds the column objects, so they are compared by index and command,
// not by reference.
export const isSameColumnLayout = (
  renderedColumns: Column[],
  columns: Column[],
): boolean => renderedColumns.length === columns.length
  && renderedColumns.every((column, index) => (
    column.index === columns[index].index && column.command === columns[index].command
  ));

// Without jQuery the renderer hides rows with a class; with jQuery, with an inline style.
export const isRowElementVisible = (rowElement: HTMLElement): boolean => (
  rowElement.style.display !== 'none' && !rowElement.classList.contains(INVISIBLE_CLASS)
);

export const insertRowElement = (
  $newRow: dxElementWrapper,
  $rows: dxElementWrapper,
  rowIndex: number,
  $table: dxElementWrapper | null | undefined,
): void => {
  const $row = $rows.eq(rowIndex);

  if ($row.length) {
    $newRow.insertBefore($row);
  } else if ($rows.length) {
    $newRow.insertAfter($rows.last());
  } else if ($table) {
    $newRow.prependTo($newRow.is('tbody') ? $table : $table.children('tbody'));
  }
};

export const keepContentHeight = (
  $content: dxElementWrapper | undefined,
  callback: () => void,
): void => {
  if (!$content) {
    callback();

    return;
  }

  const { minHeight } = ($content.get(0) as HTMLElement).style;

  $content.css('minHeight', getOuterHeight($content));
  callback();
  $content.css('minHeight', minHeight);
};
