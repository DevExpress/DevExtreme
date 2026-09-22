import { describe, expect, it } from '@jest/globals';
import { AI_COLUMN_NAME } from '@ts/grids/grid_core/ai_column/const';
import { columnHasValue } from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

const column = (partial: Partial<Column>): Column => partial as Column;

describe('columnHasValue', () => {
  it('should be true for a data column', () => {
    expect(columnHasValue(column({ dataField: 'name' }))).toBe(true);
  });

  it('should be false for a command column', () => {
    expect(columnHasValue(column({ command: 'select' }))).toBe(false);
  });

  it('should be true for the AI column even though it carries a command', () => {
    expect(columnHasValue(column({ command: AI_COLUMN_NAME, type: AI_COLUMN_NAME }))).toBe(true);
  });
});
