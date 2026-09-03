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

  it('should report a cell whose modified mark appeared without a new value', async () => {
    const change = await refreshRow(
      dataRow(),
      dataRow({ modified: true, modifiedValues: [undefined, 15] }),
    );

    expect(change.rowIndices).toEqual([0]);
    expect(change.columnIndices).toEqual([[1]]);
  });
});
