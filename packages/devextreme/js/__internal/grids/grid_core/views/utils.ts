import { columnHasValue } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import gridCoreUtils from '../m_utils';

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
