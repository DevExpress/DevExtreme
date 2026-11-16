import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';
import { triggerKeyDown } from '../../keyboard_navigation/__tests__/helpers/utils';
import type { FocusRowsView } from '../types';

const DATA = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Dan' },
];

const setup = async (options: DataGridProperties) => {
  const { instance } = await createDataGrid({
    keyExpr: 'id',
    focusedRowEnabled: true,
    ...options,
  });

  await flushAsync();

  return {
    columnsController: instance.getController('columns'),
    dataSourceController: instance.getController('dataSource'),
  };
};

describe('Focus columns extender', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('getSortDataSourceParameters', () => {
    it('sorts by key when requested even if focused rows are disabled', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        focusedRowEnabled: false,
        remoteOperations: true,
      });

      const result = columnsController.getSortDataSourceParameters(false, true);

      expect(result).toEqual([{ selector: 'id', desc: false }]);
    });

    it('sorts by the data index when every operation is local', async () => {
      const { columnsController, dataSourceController } = await setup({ dataSource: DATA });

      const result = columnsController.getSortDataSourceParameters();

      expect(result).toHaveLength(1);
      expect(result?.[0].selector).toBe(dataSourceController.getDataIndexGetter());
      expect(result?.[0].desc).toBe(false);
    });

    it('sorts by the key columns when operations are remote', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        remoteOperations: true,
      });

      const result = columnsController.getSortDataSourceParameters();

      expect(result).toEqual([{ selector: 'id', desc: false }]);
    });

    it('appends the key after the sorted columns', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        columns: ['id', { dataField: 'name', sortOrder: 'asc' }],
        remoteOperations: true,
      });

      expect(columnsController.getSortDataSourceParameters()).toEqual([
        { selector: 'name', desc: false },
        { selector: 'id', desc: false },
      ]);
    });

    it('adds nothing when the key column is already sorted', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        columns: [{ dataField: 'id', sortOrder: 'desc' }, 'name'],
      });

      expect(columnsController.getSortDataSourceParameters()).toEqual([
        { selector: 'id', desc: true },
      ]);
    });

    it('does not sort by key when autoNavigateToFocusedRow is off', async () => {
      const { columnsController } = await setup({
        dataSource: DATA,
        autoNavigateToFocusedRow: false,
        remoteOperations: true,
      });

      expect(columnsController.getSortDataSourceParameters()).toBeNull();
    });

    it('leaves the base sort parameters alone when there is no data source', async () => {
      const { columnsController, dataSourceController } = await setup({
        columns: [{ dataField: 'name', sortOrder: 'asc' }],
      });

      expect(dataSourceController.getAdapter()).toBeNull();
      expect(columnsController.getSortDataSourceParameters()).toEqual([
        { selector: 'name', desc: false },
      ]);
    });
  });
});

describe('FocusController', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('isRowFocused', () => {
    it('returns false when no row is focused', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
      });
      await flushAsync();

      expect(instance.isRowFocused(1)).toBe(false);
    });

    it('returns true only for the focused row key', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 2,
      });
      await flushAsync();

      expect(instance.isRowFocused(2)).toBe(true);
      expect(instance.isRowFocused(1)).toBe(false);
    });
  });

  describe('updateFocusedRow', () => {
    it('marks the row in every table and scrolls to the main table row', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
        // @ts-expect-error private option
        columnFixing: { legacyMode: true },
        customizeColumns: (columns): void => { columns[0].fixed = true; },
      });
      await flushAsync();
      const rowsView = instance.getView('rowsView') as FocusRowsView;
      const scrollToElementVertically = jest.spyOn(rowsView, 'scrollToElementVertically');
      const [mainRow, fixedRow] = $(rowsView.getRowElement(1)).toArray();

      instance.getController('focus').updateFocusedRow({ focusedRowKey: 2 });

      expect(rowsView.getTableElements()).toHaveLength(2);
      expect(rowsView.getTableElements().find('.dx-row-focused')).toHaveLength(2);
      expect($(mainRow).hasClass('dx-row-focused')).toBe(true);
      expect($(fixedRow).hasClass('dx-row-focused')).toBe(true);
      expect(scrollToElementVertically).toHaveBeenCalledTimes(1);
      expect(scrollToElementVertically.mock.calls[0][0].get(0)).toBe(mainRow);
    });

    it('marks the row without scrolling when preventScroll is set', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
      });
      await flushAsync();
      const rowsView = instance.getView('rowsView') as FocusRowsView;
      const scrollToElementVertically = jest.spyOn(rowsView, 'scrollToElementVertically');
      const [row] = $(rowsView.getRowElement(1)).toArray();

      instance.getController('focus').updateFocusedRow({ focusedRowKey: 2, preventScroll: true });

      expect(rowsView.getTableElements().find('.dx-row-focused')).toHaveLength(1);
      expect($(row).hasClass('dx-row-focused')).toBe(true);
      expect(scrollToElementVertically).not.toHaveBeenCalled();
    });

    it('marks a group row', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
        columns: ['id', { dataField: 'name', groupIndex: 0 }],
      });
      await flushAsync();
      const rowsView = instance.getView('rowsView') as FocusRowsView;
      const [groupRow] = $(rowsView.getRowElement(instance.getRowIndexByKey(['Dan']))).toArray();

      instance.getController('focus').updateFocusedRow({ focusedRowKey: ['Dan'] });

      expect($(groupRow).hasClass('dx-group-row')).toBe(true);
      expect($(groupRow).hasClass('dx-row-focused')).toBe(true);
    });

    it('marks nothing and does not scroll when the key has no row', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
      });
      await flushAsync();
      const rowsView = instance.getView('rowsView') as FocusRowsView;
      const scrollToElementVertically = jest.spyOn(rowsView, 'scrollToElementVertically');

      instance.getController('focus').updateFocusedRow({ focusedRowKey: 3 });

      expect(rowsView.getTableElements().find('.dx-row-focused')).toHaveLength(0);
      expect(scrollToElementVertically).not.toHaveBeenCalled();
    });
  });
});

describe('Focus rows view extender', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('an undefined focusedColumnIndex', () => {
    const THREE_COLUMN_DATA = [
      { id: 1, name: 'Alex', city: 'Rome' },
      { id: 2, name: 'Dan', city: 'Oslo' },
    ];

    const setupWithUndefinedColumn = async (setAt: 'creation' | 'runtime'): Promise<DataGridInstance> => {
      const { instance } = await createDataGrid({
        dataSource: THREE_COLUMN_DATA,
        keyExpr: 'id',
        focusedRowEnabled: true,
        focusedRowKey: 2,
        ...setAt === 'creation' ? { focusedColumnIndex: undefined } : {},
      });
      await flushAsync();

      if (setAt === 'runtime') {
        instance.option('focusedColumnIndex', undefined);
        const refreshed = instance.refresh();
        await flushAsync();
        await refreshed;
      }

      return instance;
    };

    it.each(['creation', 'runtime'] as const)('acts as -1 when the focused row is rendered, set at %s', async (setAt) => {
      const instance = await setupWithUndefinedColumn(setAt);

      expect(instance.option('focusedColumnIndex')).toBe(0);
    });

    it('lets Right Arrow on the focused row move to the second column', async () => {
      const instance = await setupWithUndefinedColumn('runtime');
      document.querySelector<HTMLElement>('.dx-row-focused')?.focus();
      await flushAsync();

      triggerKeyDown(instance, 'rightArrow', document.activeElement);
      await flushAsync();

      expect(instance.option('focusedColumnIndex')).toBe(1);
      expect(document.activeElement?.textContent).toBe('Dan');
    });
  });
});
