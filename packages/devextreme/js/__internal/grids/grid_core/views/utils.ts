import { AI_COLUMN_NAME } from '../ai_column/const';
import type { Column } from '../columns_controller/m_columns_controller';
import gridCoreUtils from '../m_utils';

export const getCellText = (
  column: Column,
  displayValue: unknown,
): string => (
  !column.command || column.type === AI_COLUMN_NAME
    ? gridCoreUtils.formatValue(displayValue, column) as string
    : ''
);
