import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { AI_COLUMN_NAME } from '../ai_column/const';
import gridCoreUtils from '../m_utils';

export const getCellText = (
  column: Column,
  displayValue: unknown,
): string => (
  !column.command || column.type === AI_COLUMN_NAME
    ? gridCoreUtils.formatValue(displayValue, column) as string
    : ''
);
