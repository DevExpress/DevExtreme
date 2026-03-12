import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../../grid_core/__tests__/__mock__/helpers/utils';

describe('Summary', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('column lookup map performance optimization', () => {
    const dataSource = [
      {
        id: 1, name: 'Alice', value: 10, category: 'A',
      },
      {
        id: 2, name: 'Bob', value: 20, category: 'A',
      },
      {
        id: 3, name: 'Carol', value: 30, category: 'B',
      },
      {
        id: 4, name: 'Dave', value: 40, category: 'B',
      },
    ];

    it('should correctly calculate total summary', async () => {
      const { instance } = await createDataGrid({
        dataSource,
        columns: ['id', 'name', 'value', 'category'],
        summary: {
          totalItems: [
            { column: 'value', summaryType: 'sum' },
            { column: 'value', summaryType: 'avg' },
            { column: 'id', summaryType: 'count' },
          ],
        },
      });

      jest.runAllTimers();

      expect(instance.getTotalSummaryValue('sum_value')).toBe(100);
      expect(instance.getTotalSummaryValue('avg_value')).toBe(25);
      expect(instance.getTotalSummaryValue('count_id')).toBe(4);
    });

    it('should render total footer with summary items', async () => {
      const { component } = await createDataGrid({
        dataSource,
        columns: ['id', 'name', 'value', 'category'],
        summary: {
          totalItems: [
            { column: 'value', summaryType: 'sum' },
          ],
        },
      });

      jest.runAllTimers();

      const footerRow = component.getFooterRow() as HTMLElement;

      expect(footerRow).not.toBeNull();

      const summaryItems = component.getSummaryItems(footerRow);
      const summary = dataSource.reduce((acc, item) => acc + item.value, 0);

      expect(summaryItems.length).toBe(1);
      expect(summaryItems[0].textContent).toContain(summary.toString());
    });

    it('should calculate group summary with many groupItems', async () => {
      const { component } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
        ],
        summary: {
          groupItems: [
            { column: 'value', summaryType: 'sum', showInGroupFooter: false },
            { column: 'value', summaryType: 'avg', showInGroupFooter: false },
            { column: 'id', summaryType: 'count', showInGroupFooter: false },
          ],
        },
      });

      jest.runAllTimers();

      const groupRows = component.getGroupRows();

      expect(groupRows.length).toBe(2);

      // Group summary items with showInGroupFooter: false
      // are rendered inline in the group row cell text
      const firstGroupRowText = groupRows[0].textContent ?? '';

      expect(firstGroupRowText).toContain('Sum');
      expect(firstGroupRowText).toContain('Avg');
      expect(firstGroupRowText).toContain('Count');
    });

    it('should render group footer summary', async () => {
      const { component } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
        ],
        summary: {
          groupItems: [
            {
              column: 'value',
              summaryType: 'sum',
              showInGroupFooter: true,
            },
          ],
        },
      });

      jest.runAllTimers();

      const groupFooterRows = component.getGroupFooterRows();

      expect(groupFooterRows.length).toBe(2);

      const summaryItems = component.getSummaryItems(
        groupFooterRows[0],
      );

      expect(summaryItems.length).toBe(1);
      expect(summaryItems[0].textContent).toContain('30');
    });

    it('should correctly calculate summary with showInColumn option', async () => {
      const { component } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
        ],
        summary: {
          groupItems: [
            {
              column: 'value',
              summaryType: 'sum',
              showInColumn: 'name',
              showInGroupFooter: false,
            },
          ],
        },
      });

      jest.runAllTimers();

      const groupRows = component.getGroupRows();

      expect(groupRows.length).toBe(2);
    });

    it('should handle many summary items without errors', async () => {
      const groupItems = Array.from(
        { length: 50 },
        (_, i) => ({
          column: i % 2 === 0 ? 'value' : 'id',
          summaryType: 'sum' as const,
          showInGroupFooter: false,
          name: `summary_${i}`,
        }),
      );

      const { component } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
        ],
        summary: {
          groupItems,
        },
      });

      jest.runAllTimers();

      const groupRows = component.getGroupRows();

      expect(groupRows.length).toBe(2);
    });

    it('should handle combined total and group summary', async () => {
      const { instance, component } = await createDataGrid({
        dataSource,
        columns: [
          { dataField: 'id' },
          { dataField: 'name' },
          { dataField: 'value' },
          { dataField: 'category', groupIndex: 0 },
        ],
        summary: {
          totalItems: [
            { column: 'value', summaryType: 'sum' },
          ],
          groupItems: [
            {
              column: 'value',
              summaryType: 'sum',
              showInGroupFooter: false,
            },
          ],
        },
      });

      jest.runAllTimers();

      expect(instance.getTotalSummaryValue('sum_value')).toBe(100);

      const footerRow = component.getFooterRow();

      expect(footerRow).not.toBeNull();

      const groupRows = component.getGroupRows();

      expect(groupRows.length).toBe(2);
    });
  });
});
