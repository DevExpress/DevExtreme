import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import { createGridWithPendingTemplates, ROWS } from '../../__tests__/__mock__/helpers/pending_template';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';
import { COMMAND_SELECT_CLASS } from '../const';

const RESTORED_STATE = { selectedRowKeys: [1] };

// legacyMode isn't in the public type
const LEGACY_INFINITE_SCROLLING_OPTIONS = {
  scrolling: { mode: 'infinite', legacyMode: true },
} as DataGridProperties;

const getRowKeys = ($container: dxElementWrapper, selector: string): number[] => {
  const container = $container.get(0) as HTMLElement;

  return Array.from(
    container.querySelectorAll(`.dx-datagrid-rowsview ${selector}`),
    (element) => Number(
      element.closest('tr')?.querySelector(`td:not(.${COMMAND_SELECT_CLASS})`)?.textContent,
    ),
  );
};

describe('Selection while new rows wait for async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should highlight the rows selected by the restored state', async () => {
    const { $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      selection: { mode: 'multiple' },
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad: () => Promise.resolve(RESTORED_STATE),
      },
    });

    await flushAsync();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([1]);
    expect(getRowKeys($container, '.dx-checkbox-checked')).toEqual([1]);
  });

  it('should highlight the rows selected by the restored state when a column renders asynchronously', async () => {
    const { $container } = await createDataGrid({
      dataSource: ROWS,
      columns: [{ dataField: 'id', renderAsync: true }],
      templatesRenderAsynchronously: true,
      selection: { mode: 'multiple' },
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad: () => Promise.resolve(RESTORED_STATE),
      },
    } as DataGridProperties);

    await flushAsync();

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([1]);
  });

  it('should highlight the restored selected row whose checkbox is canceled in onEditorPreparing', async () => {
    const { $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      selection: { mode: 'multiple' },
      onEditorPreparing: (e) => {
        if (e.parentType === 'dataRow' && e.row?.key === 1) {
          e.cancel = true;
        }
      },
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad: () => Promise.resolve(RESTORED_STATE),
      },
    });

    await flushAsync();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([1]);
  });

  it('should highlight the rows selected with selectRows', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      selection: { mode: 'multiple' },
    });

    const selecting = instance.selectRows([2], false);
    jest.runAllTimers();
    renderPendingTemplates();
    await selecting;

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([2]);
  });

  it('should highlight the selected row at its new position when the rows are sorted', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      selection: { mode: 'multiple' },
    });

    const selecting = instance.selectRows([1], false);
    jest.runAllTimers();
    instance.columnOption('id', 'sortOrder', 'desc');
    jest.runAllTimers();
    renderPendingTemplates();
    await selecting;

    expect(getRowKeys($container, 'tr.dx-data-row')).toEqual([3, 2, 1]);
    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([1]);
  });

  it('should not highlight the rows of the page opened after the selection', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      dataSource: [...ROWS, { id: 4 }],
      paging: { pageSize: 2 },
      selection: { mode: 'multiple' },
    });

    const selecting = instance.selectRows([1], false);
    jest.runAllTimers();
    const paging = instance.pageIndex(1);
    jest.runAllTimers();
    renderPendingTemplates();
    await Promise.all([selecting, paging]);

    expect(getRowKeys($container, 'tr.dx-data-row')).toEqual([3, 4]);
    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([]);
  });

  it('should highlight only the selected row when a row is inserted with repaintChangesOnly', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      dataSource: {
        store: { type: 'array', key: 'id', data: ROWS.map((row) => ({ ...row })) },
        pushAggregationTimeout: 0,
      },
      keyExpr: undefined,
      repaintChangesOnly: true,
      selection: { mode: 'multiple' },
    });

    renderPendingTemplates();
    instance.getDataSource().store().push([{ type: 'insert', index: 0, data: { id: 10 } }]);
    jest.runAllTimers();

    const selecting = instance.selectRows([2], false);
    jest.runAllTimers();
    renderPendingTemplates();
    await selecting;

    expect(getRowKeys($container, 'tr.dx-data-row')).toEqual([10, 1, 2, 3]);
    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([2]);
  });

  it('should check the checkbox of the selected row updated after a row is inserted above it with repaintChangesOnly', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      dataSource: {
        store: {
          type: 'array',
          key: 'id',
          data: ROWS.map((row) => ({ ...row, name: 'name' })),
        },
        pushAggregationTimeout: 0,
      },
      keyExpr: undefined,
      columns: [{ dataField: 'id', cellTemplate: 'cellTemplate' }, 'name'],
      repaintChangesOnly: true,
      selection: { mode: 'multiple' },
    });
    const store = instance.getDataSource().store();

    renderPendingTemplates();
    store.push([{ type: 'insert', index: 0, data: { id: 10, name: 'name' } }]);
    jest.runAllTimers();

    const selecting = instance.selectRows([2], false);
    jest.runAllTimers();
    store.push([{ type: 'update', key: 2, data: { name: 'updated name' } }]);
    jest.runAllTimers();
    renderPendingTemplates();
    await selecting;

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([2]);
    expect(getRowKeys($container, '.dx-checkbox-checked')).toEqual([2]);
  });

  it('should highlight the appended rows selected with selectAll in the legacy infinite scrolling', async () => {
    const { instance, $container, renderPendingTemplates } = await createGridWithPendingTemplates({
      ...LEGACY_INFINITE_SCROLLING_OPTIONS,
      dataSource: [...ROWS, { id: 4 }],
      paging: { pageSize: 2 },
      selection: { mode: 'multiple' },
    });

    renderPendingTemplates();

    const paging = instance.pageIndex(1);
    jest.runAllTimers();
    const selecting = instance.selectAll();
    jest.runAllTimers();
    renderPendingTemplates();
    await Promise.all([paging, selecting]);

    expect(getRowKeys($container, 'tr.dx-data-row')).toEqual([1, 2, 3, 4]);
    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([1, 2, 3, 4]);
  });
});
