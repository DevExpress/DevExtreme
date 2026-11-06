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

  describe.each([false, true])('boolean sort column, remoteOperations: %s', (remoteOperations) => {
    // Ascending: 3, 2, 6, 1, 4, 5 (null < false < true). Descending: 1, 4, 5, 2, 6, 3.
    const BOOLEAN_DATA = [
      { id: 1, completed: true },
      { id: 2, completed: false },
      { id: 3, completed: null },
      { id: 4, completed: true },
      { id: 5, completed: true },
      { id: 6, completed: false },
    ];

    it.each<{
      sortOrder: 'asc' | 'desc';
      value: boolean | null;
      key: number;
      pageIndex: number;
      focusedRowIndex: number;
    }>([
      {
        sortOrder: 'asc', value: null, key: 3, pageIndex: 0, focusedRowIndex: 0,
      },
      {
        sortOrder: 'asc', value: false, key: 6, pageIndex: 1, focusedRowIndex: 0,
      },
      {
        sortOrder: 'asc', value: true, key: 5, pageIndex: 2, focusedRowIndex: 1,
      },
      {
        sortOrder: 'desc', value: true, key: 5, pageIndex: 1, focusedRowIndex: 0,
      },
      {
        sortOrder: 'desc', value: false, key: 6, pageIndex: 2, focusedRowIndex: 0,
      },
      {
        sortOrder: 'desc', value: null, key: 3, pageIndex: 2, focusedRowIndex: 1,
      },
    ])('moves the page to a focused $value row sorted $sortOrder', async ({
      sortOrder, key, pageIndex, focusedRowIndex,
    }) => {
      const { instance } = await createDataGrid({
        dataSource: BOOLEAN_DATA,
        remoteOperations,
        focusedRowEnabled: true,
        focusedRowKey: key,
        columns: ['id', { dataField: 'completed', dataType: 'boolean', sortOrder }],
        paging: { pageSize: 2 },
      });
      await flushAsync();

      expect(instance.pageIndex()).toBe(pageIndex);
      expect(instance.option('focusedRowIndex')).toBe(focusedRowIndex);
    });
  });

  describe.each([false, true])('nullable string sort column, remoteOperations: %s', (remoteOperations) => {
    // Ascending: 2, 5, 3, 1, 4, 6 (null first). Descending: 6, 4, 1, 3, 2, 5 (null last).
    const NULLABLE_DATA = [
      { id: 1, name: 'b' },
      { id: 2, name: null },
      { id: 3, name: 'a' },
      { id: 4, name: 'c' },
      { id: 5, name: null },
      { id: 6, name: 'd' },
    ];

    it.each<{
      sortOrder: 'asc' | 'desc';
      key: number;
      pageIndex: number;
      focusedRowIndex: number;
    }>([
      {
        sortOrder: 'asc', key: 5, pageIndex: 0, focusedRowIndex: 1,
      },
      {
        sortOrder: 'desc', key: 2, pageIndex: 2, focusedRowIndex: 0,
      },
      {
        sortOrder: 'desc', key: 5, pageIndex: 2, focusedRowIndex: 1,
      },
    ])('moves the page to focused row $key with a null value sorted $sortOrder', async ({
      sortOrder, key, pageIndex, focusedRowIndex,
    }) => {
      const { instance } = await createDataGrid({
        dataSource: NULLABLE_DATA,
        remoteOperations,
        focusedRowEnabled: true,
        focusedRowKey: key,
        columns: ['id', { dataField: 'name', dataType: 'string', sortOrder }],
        paging: { pageSize: 2 },
      });
      await flushAsync();

      expect(instance.pageIndex()).toBe(pageIndex);
      expect(instance.option('focusedRowIndex')).toBe(focusedRowIndex);
    });
  });

  describe.each([false, true])('composite key with a 0 part, remoteOperations: %s', (remoteOperations) => {
    // Store order differs from the grid order (by name: 2/5, 1/1, 3/3, 2/0, 0/1, 0/0), and each
    // 0-part key shares its other part with a row stored before it.
    const ZERO_KEY_DATA = [
      { a: 2, b: 5, name: 'A' },
      { a: 1, b: 1, name: 'B' },
      { a: 0, b: 1, name: 'E' },
      { a: 2, b: 0, name: 'D' },
      { a: 0, b: 0, name: 'F' },
      { a: 3, b: 3, name: 'C' },
    ];

    it.each([
      {
        title: 'the first part is 0', key: { a: 0, b: 1 }, pageIndex: 2, focusedRowIndex: 0,
      },
      {
        title: 'the second part is 0', key: { a: 2, b: 0 }, pageIndex: 1, focusedRowIndex: 1,
      },
      {
        title: 'every part is 0', key: { a: 0, b: 0 }, pageIndex: 2, focusedRowIndex: 1,
      },
    ])('moves the page to the focused row when $title', async ({ key, pageIndex, focusedRowIndex }) => {
      const { instance } = await createDataGrid({
        dataSource: ZERO_KEY_DATA,
        keyExpr: ['a', 'b'],
        remoteOperations,
        focusedRowEnabled: true,
        focusedRowKey: key,
        columns: ['a', 'b', { dataField: 'name', sortOrder: 'asc' }],
        paging: { pageSize: 2 },
      });
      await flushAsync();

      expect(instance.pageIndex()).toBe(pageIndex);
      expect(instance.option('focusedRowIndex')).toBe(focusedRowIndex);
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

    it('raises no error when the restored state drops runtime grouping and also changes selection (T1337363)', async () => {
      const errors: (string | undefined)[] = [];
      const { instance } = await createDataGrid({
        dataSource: DATA,
        focusedRowEnabled: true,
        selection: { mode: 'multiple' },
        columns: ['group', 'id', 'value'],
        grouping: { autoExpandAll: false },
        onDataErrorOccurred: ({ error }) => { errors.push(error?.message); },
      });
      instance.columnOption('group', 'groupIndex', 0);
      await flushAsync();
      instance.option('focusedRowKey', 1);
      await flushAsync();

      instance.state({ ...instance.state(), columns: undefined, selectedRowKeys: [2] });

      expect(errors).toEqual([]);
      expect(instance.option('selectedRowKeys')).toEqual([2]);
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
