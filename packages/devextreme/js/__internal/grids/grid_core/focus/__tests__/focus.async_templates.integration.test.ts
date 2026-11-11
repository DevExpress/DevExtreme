import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

import { createPendingTemplate } from '../../__tests__/__mock__/helpers/pending_template';
import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const ROWS = [{ id: 1 }, { id: 2 }, { id: 3 }];

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
  const { template, renderPendingTemplates } = createPendingTemplate();

  const grid = await createDataGrid({
    dataSource: ROWS,
    columns: [{ dataField: 'id', cellTemplate: 'cellTemplate' }],
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: { cellTemplate: template },
    },
    ...options,
  } as DataGridProperties);

  return { ...grid, renderPendingTemplates };
};

describe('Focused row while new rows wait for async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

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
});
