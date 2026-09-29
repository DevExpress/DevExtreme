import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [{ id: 1, value: 10 }, { id: 2, value: 20 }];

const loadAllSummary = async (
  options: DataGridProperties = {},
): Promise<unknown> => {
  const { instance } = await createDataGrid({ dataSource: DATA, ...options });
  const dataController = instance.getController('data');

  let resolvedSummary: unknown = null;
  dataController.loadAllItems().done((_items, summary) => {
    resolvedSummary = summary;
  });
  await flushAsync();

  return resolvedSummary;
};

describe('Summary data controller loadAllItems', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should resolve the total summary as the second argument', async () => {
    const summary = await loadAllSummary({
      summary: { totalItems: [{ column: 'value', summaryType: 'sum' }] },
    });

    expect(summary).toEqual([30]);
  });

  it('should resolve no second argument when no summary is configured', async () => {
    const summary = await loadAllSummary();

    expect(summary).toBeUndefined();
  });
});
