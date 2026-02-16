import { jest } from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';
import type { Controllers } from '@ts/grids/grid_core/m_types';

export interface DataGridInstance extends DataGrid {
  getController: <T extends keyof Controllers>(name: T) => Controllers[T];
}

export const SELECTORS = {
  gridContainer: '#gridContainer',
};

export const GRID_CONTAINER_ID = 'gridContainer';

export const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGridInstance;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const dataGridOptions: DataGridProperties = {
    keyExpr: 'id',
    ...options,
  };

  const instance = new DataGrid(
    $container.get(0) as HTMLDivElement,
    dataGridOptions,
  ) as DataGridInstance;
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

export const beforeTest = (): void => {
  fx.off = true;
  jest.useFakeTimers();
};

export const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid?.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
  fx.off = false;
};

export const flushAsync = async (): Promise<void> => {
  jest.runAllTimers();
  await Promise.resolve();
};
