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

  describe('alignByColumn with virtual column rendering (T1324988)', () => {
    const COLUMN_COUNT = 100;

    const dynamicColumns = Array.from({ length: COLUMN_COUNT }, (_, i) => ({
      dataField: `field${i}`,
      width: 100,
    }));

    const columns = [
      {
        dataField: 'company', width: 100, fixed: true, fixedPosition: 'left' as const,
      },
      { dataField: 'state', width: 100, groupIndex: 0 },
      ...dynamicColumns,
    ];

    const groupItems = dynamicColumns.map((col) => ({
      column: col.dataField,
      summaryType: 'sum' as const,
      alignByColumn: true,
    }));

    const dataSource = [
      {
        id: 1,
        company: 'Company A',
        state: 'Arkansas',
        ...Object.fromEntries(dynamicColumns.map((col, i) => [col.dataField, i])),
      },
    ];

    it('group row cell colSpan should be 1 after horizontal scroll', async () => {
      const { component } = await createDataGrid({
        dataSource,
        keyExpr: 'id',
        width: 500,
        showBorders: true,
        columns,
        summary: { groupItems },
        scrolling: {
          columnRenderingMode: 'virtual',
        },
      });

      await flushAsync();

      const beforeScrollCell = component.getDataCell(1, 3);
      expect(beforeScrollCell.getText()).toBe('1');

      const scrollContainer = component.getScrollableContainer();
      scrollContainer.scrollLeft = 5000;
      scrollContainer.dispatchEvent(new Event('scroll'));
      await flushAsync();

      expect(scrollContainer.scrollLeft).toBe(5000);

      const afterScrollCell = component.getDataCell(1, 3);
      expect(afterScrollCell.getText()).toBe('48');

      const groupCells = component.getGroupRow(0).getCells();
      const colSpan = Number(groupCells[1].getAttribute('colSpan')) || 1;

      expect(colSpan).toBe(1);
    });
  });

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
