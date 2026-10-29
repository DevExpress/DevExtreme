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

  describe('state restore', () => {
    it.each([
      { title: 'data row', focusedRowKey: 1 },
      { title: 'group row', focusedRowKey: ['A'] },
    ])('raises no error when the restored state drops runtime grouping and a $title is focused (T1337363)', async ({ focusedRowKey }) => {
      const errors: (string | undefined)[] = [];
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        columns: ['group', 'id', 'value'],
        grouping: { autoExpandAll: false },
        onDataErrorOccurred: ({ error }) => { errors.push(error?.message); },
      });
      instance.columnOption('group', 'groupIndex', 0);
      await flushAsync();
      instance.option('focusedRowKey', focusedRowKey);
      await flushAsync();

      instance.state({ ...instance.state(), columns: undefined });

      expect(errors).toEqual([]);
      expect(instance.getVisibleRows().some((row) => row.rowType === 'data' && row.key === undefined)).toBe(false);
    });

    it('keeps the focused data row when the restored state drops runtime grouping (T1337363)', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        columns: ['group', 'id', 'value'],
        grouping: { autoExpandAll: false },
      });
      instance.columnOption('group', 'groupIndex', 0);
      await flushAsync();
      instance.option('focusedRowKey', 1);
      await flushAsync();

      instance.state({ ...instance.state(), columns: undefined });
      await flushAsync();

      expect(instance.option('focusedRowKey')).toBe(1);
      expect(instance.getVisibleRows().every((row) => row.rowType === 'data')).toBe(true);
    });
  });

  describe('virtual scrolling', () => {
    it('drops the pending focus when the focused row is reset before the row is rendered', async () => {
      const rows = Array.from({ length: 100 }, (_, i) => ({ id: i, value: `row ${i}` }));
      const { instance } = await createDataGrid({
        dataSource: rows,
        height: 250,
        width: 200,
        columnWidth: 100,
        focusedRowEnabled: true,
        focusedRowIndex: 99,
        scrolling: { mode: 'virtual' },
      });

      // The last row is not rendered yet, so focusing it waits for the next contentReady.
      expect(instance.option('focusedRowKey')).toBe(99);
      expect(instance.getRowIndexByKey(99)).toBe(-1);

      instance.option({ focusedRowIndex: -1, dataSource: [...rows] });
      await flushAsync();

      expect(instance.option('focusedRowKey')).toBeNull();
      expect(instance.option('focusedRowIndex')).toBe(-1);
    });
  });
});
