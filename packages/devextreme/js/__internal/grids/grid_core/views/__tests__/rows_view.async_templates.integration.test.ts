import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

interface TemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

const ROWS = [{ id: 1 }, { id: 2 }, { id: 3 }];
const RESTORED_STATE = { selectedRowKeys: [1] };

// legacyMode isn't in the public type
const LEGACY_INFINITE_SCROLLING_OPTIONS = {
  scrolling: { mode: 'infinite', legacyMode: true },
} as DataGridProperties;

const getRowKeys = ($container: dxElementWrapper, selector: string): number[] => {
  const container = $container.get(0) as HTMLElement;

  return Array.from(
    container.querySelectorAll(`.dx-datagrid-rowsview ${selector}`),
    (element) => Number(element.closest('tr')?.textContent),
  );
};

const createGrid = async (options: DataGridProperties): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
  renderPendingTemplates: () => void;
}> => {
  const pendingTemplates: (() => void)[] = [];
  const renderPendingTemplates = (): void => {
    while (pendingTemplates.length) {
      pendingTemplates.shift()?.();
      jest.runAllTimers();
    }
  };

  const grid = await createDataGrid({
    dataSource: ROWS,
    columns: [{ dataField: 'id', cellTemplate: 'cellTemplate' }],
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: {
        cellTemplate: {
          render({ model, container, onRendered }: TemplateArgs): void {
            pendingTemplates.push(() => {
              container.append(String(model.value));
              onRendered?.();
            });
          },
        },
      },
    },
    ...options,
  } as DataGridProperties);

  return { ...grid, renderPendingTemplates };
};

describe('RowsView updates while new rows wait for async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should highlight the rows selected by the restored state', async () => {
    const { $container, renderPendingTemplates } = await createGrid({
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

  it('should highlight the rows selected with selectRows', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
      selection: { mode: 'multiple' },
    });

    const selecting = instance.selectRows([2], false);
    jest.runAllTimers();
    renderPendingTemplates();
    await selecting;

    expect(getRowKeys($container, 'tr.dx-selection')).toEqual([2]);
  });

  it('should highlight the row focused with focusedRowKey', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
      focusedRowEnabled: true,
    });

    instance.option('focusedRowKey', 2);
    jest.runAllTimers();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([2]);
  });

  it('should highlight the focused row when a detail row is expanded above it', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
      focusedRowEnabled: true,
      masterDetail: {
        enabled: true,
        template: (container: HTMLElement): void => {
          container.append('detail');
        },
      },
    });

    instance.option('focusedRowKey', 2);
    jest.runAllTimers();
    const expanding = instance.expandRow(1);
    jest.runAllTimers();
    renderPendingTemplates();
    await expanding;

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([2]);
  });

  it('should not highlight the repainted row when the focused row key is reset', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
      focusedRowEnabled: true,
      focusedRowKey: 2,
    });

    renderPendingTemplates();
    instance.repaintRows([1]);
    jest.runAllTimers();
    instance.option('focusedRowKey', null);
    jest.runAllTimers();
    renderPendingTemplates();

    expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([]);
  });

  it('should highlight the selected row at its new position when the rows are sorted', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
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
    const { instance, $container, renderPendingTemplates } = await createGrid({
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
    const { instance, $container, renderPendingTemplates } = await createGrid({
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

  it('should highlight the appended rows selected with selectAll in the legacy infinite scrolling', async () => {
    const { instance, $container, renderPendingTemplates } = await createGrid({
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
