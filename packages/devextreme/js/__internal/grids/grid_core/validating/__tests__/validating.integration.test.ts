import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridModel;
  instance: DataGrid;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const dataGridOptions: DataGridProperties = {
    keyExpr: 'id',
    ...options,
  };

  const instance = new DataGrid($container.get(0) as HTMLDivElement, dataGridOptions);
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('Bugs', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('T1308327 - DataGrid - Cell value is not restored after canceling changes in cell editing mode if repaintChangesOnly is enabled', () => {
    it('should restore cell value after canceling changes with validation error', async () => {
      const data = [
        { id: 1, name: 'Job 1', article: 'Article A' },
        { id: 2, name: 'Job 2', article: 'Article B' },
      ];

      const { instance, component } = await createDataGrid({
        dataSource: data,
        keyExpr: 'id',
        repaintChangesOnly: true,
        editing: {
          mode: 'cell',
          allowUpdating: true,
        },
        columns: [
          {
            dataField: 'name',
            showEditorAlways: true,
            validationRules: [
              { type: 'required', message: 'Required field' },
            ],
          },
          {
            dataField: 'article',
          },
        ],
      });

      const firstCell = component.getDataCell(0, 0);
      const firstEditor = firstCell.getEditor();

      firstEditor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(0, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      expect(instance.cellValue(0, 'name')).toBe('Job 1');
      expect(component.getDataCell(0, 0).isValidCell).toBe(true);

      const secondCell = component.getDataCell(1, 0);
      const secondEditor = secondCell.getEditor();

      secondEditor.setValue('');
      jest.runAllTimers();

      expect(component.getDataCell(1, 0).isValidCell).toBe(false);

      component.getRevertButton().click();
      jest.runAllTimers();

      expect(instance.cellValue(1, 'name')).toBe('Job 2');
      expect(component.getDataCell(1, 0).isValidCell).toBe(true);
    });
  });
});
