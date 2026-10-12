import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  group: i < 6 ? 'A' : 'B',
  value: `row ${i + 1}`,
}));

describe('Focus — navigating to the focused row', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('flat data', () => {
    it('moves the page to the focused row', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        paging: { pageSize: 4 },
      });
      await flushAsync();

      instance.option('focusedRowKey', 10);
      await flushAsync();

      expect(instance.pageIndex()).toBe(2);
      expect(instance.option('focusedRowIndex')).toBe(1);
    });

    it('stays on the page that already holds the focused row', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        paging: { pageSize: 4 },
      });
      await flushAsync();

      instance.option('focusedRowKey', 2);
      await flushAsync();

      expect(instance.pageIndex()).toBe(0);
      expect(instance.option('focusedRowIndex')).toBe(1);
    });

    it('reports no focused row for a key that does not exist', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        paging: { pageSize: 4 },
      });
      await flushAsync();

      instance.option('focusedRowKey', 999);
      await flushAsync();

      expect(instance.option('focusedRowIndex')).toBe(-1);
    });

    it('places the focused row by the applied sort order, not by data order', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        columns: [{ dataField: 'id', sortOrder: 'desc' }, 'value'],
        paging: { pageSize: 4 },
      });
      await flushAsync();

      // Descending, id 10 is the third row overall, so it sits on the first page.
      instance.option('focusedRowKey', 10);
      await flushAsync();

      expect(instance.pageIndex()).toBe(0);
      expect(instance.option('focusedRowIndex')).toBe(2);
    });

    it('honours a composite key when building the row filter', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: ['group', 'id'],
        focusedRowEnabled: true,
        paging: { pageSize: 4 },
      });
      await flushAsync();

      instance.option('focusedRowKey', { group: 'B', id: 10 });
      await flushAsync();

      expect(instance.pageIndex()).toBe(2);
      expect(instance.option('focusedRowIndex')).toBe(1);
    });
  });

  describe('grouped data', () => {
    it('expands the group holding the focused row and moves to its page', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        columns: [{ dataField: 'group', groupIndex: 0 }, 'id', 'value'],
        grouping: { autoExpandAll: false },
        paging: { pageSize: 4 },
      });
      await flushAsync();

      instance.option('focusedRowKey', 10);
      await flushAsync();

      expect(instance.isRowExpanded(['B'])).toBe(true);
      expect(instance.getVisibleRows().some((row) => row.key === 10)).toBe(true);
    });
  });
});
