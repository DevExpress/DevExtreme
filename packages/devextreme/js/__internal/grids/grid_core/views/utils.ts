import { columnHasValue } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import gridCoreUtils from '../m_utils';

const INVISIBLE_CLASS = 'dx-state-invisible';

export const getCellText = (
  column: Column,
  displayValue: unknown,
): string => (
  columnHasValue(column)
    ? gridCoreUtils.formatValue(displayValue, column) as string
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
