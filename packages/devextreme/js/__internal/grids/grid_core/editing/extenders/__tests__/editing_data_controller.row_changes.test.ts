import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { refreshRow } from '@ts/grids/grid_core/__tests__/__mock__/helpers/row_changes';
import {
  afterTest,
  beforeTest,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

const dataRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => ({
  rowType: 'data',
  key: 1,
  data: { id: 1 },
  values: ['Alex', 15],
  ...partial,
});

const editFormRow = (partial: Partial<ProcessedItem> = {}): ProcessedItem => dataRow({
  rowType: 'detail',
  ...partial,
});

describe('Editing data controller row changes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should not report a row when no editing state changed', async () => {
    const change = await refreshRow(dataRow(), dataRow());

    expect(change.rowIndices).toEqual([]);
  });

  it.each(['modified', 'isNewRow', 'removed', 'isEditing'] as const)(
    'should report a row when %s changed',
    async (field) => {
      const change = await refreshRow(
        dataRow({ [field]: false }),
        dataRow({ [field]: true }),
      );

      expect(change.rowIndices).toEqual([0]);
      expect(change.changeTypes).toEqual(['update']);
    },
  );

  it('should repaint the whole edit form row instead of diffing its columns', async () => {
    const change = await refreshRow(
      editFormRow({ isEditing: true, values: ['Alex', 15] }),
      editFormRow({ isEditing: true, values: ['Bob', 15] }),
      { gridOptions: { editing: { mode: 'form' } }, isLiveUpdate: false },
    );

    expect(change.rowIndices).toEqual([0]);
    expect(change.columnIndices).toEqual([undefined]);
  });
});
