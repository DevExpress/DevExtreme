import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../../grid_core/__tests__/__mock__/helpers/utils';

describe('Summary', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('column lookup map performance optimization (T1316562)', () => {
    const SUMMARY_COUNT = 100;
    const GROUP_COUNT = 4;

    const dataSource = [
      {
        id: 1, name: 'Alice', value: 10, category: 'A', region: 'X',
      },
      {
        id: 2, name: 'Bob', value: 20, category: 'A', region: 'Y',
      },
      {
        id: 3, name: 'Carol', value: 30, category: 'B', region: 'X',
      },
      {
        id: 4, name: 'Dave', value: 40, category: 'B', region: 'Y',
      },
    ];

    const groupSummaryItems = Array.from(
      { length: SUMMARY_COUNT },
      (_, i) => ({
        column: i % 2 === 0 ? 'value' : 'id',
        summaryType: 'sum' as const,
        showInGroupFooter: false,
        name: `summary_${i}`,
      }),
    );

    it('should use columnMap optimization and avoid O(n*m) columnOption calls on refresh', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
          { dataField: 'region', groupIndex: 1 },
        ],
        summary: { groupItems: groupSummaryItems },
      });

      await flushAsync();

      const columnsController = instance.getController('columns');
      const spy = jest.spyOn(columnsController, 'columnOption');

      instance.refresh().catch(() => {});
      await flushAsync();

      const worstCaseMinCalls = SUMMARY_COUNT * GROUP_COUNT;

      expect(spy.mock.calls.length).toBeLessThan(worstCaseMinCalls);

      spy.mockRestore();
    });
  });
});
