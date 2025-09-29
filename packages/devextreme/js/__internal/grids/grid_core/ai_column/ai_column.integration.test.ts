import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { DataGridComponentObject } from '@ts/grids/data_grid/test_component_object';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

const createDataGrid = async (
  options: DataGridProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: DataGridComponentObject;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', GRID_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);

  const contentReadyHandler = (): void => {
    resolve({
      $container,
      component: new DataGridComponentObject($container.get(0) as HTMLElement),
    });
    instance.off('contentReady', contentReadyHandler);
  };

  instance.on('contentReady', contentReadyHandler);
});

const beforeTest = (): void => {
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
};

describe('Options', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the cssClass is set', () => {
    it('should have class', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            cssClass: 'custom-class',
          },
        ],
      });

      expect($(component.getCellElement(0, 3)).hasClass('custom-class')).toBe(true);
    });
  });

  describe('when the name is not set', () => {
    it('should throw E1066', async () => {
      await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
          },
        ],
      });

      expect(errors.log).toHaveBeenCalledWith('E1066');
    });
  });

  describe('when the name specified is not unique', () => {
    it('should throw E1059', async () => {
      await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          {
            dataField: 'value',
            caption: 'Value',
            name: 'myColumn',
          },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });

      expect(errors.log).toHaveBeenCalledWith('E1059', '"myColumn"');
    });
  });

  describe('when headerCellTemplate is set', () => {
    it('should render this template', async () => {
      const headerCellTemplate = jest.fn((container: HTMLElement) => {
        const span = document.createElement('span');

        span.className = 'template-class';
        span.textContent = 'Template';

        container.append(span);
      });

      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            headerCellTemplate,
          },
        ],
      });

      const headerCell = component.getHeaderCell(3);

      expect(headerCellTemplate).toHaveBeenCalledTimes(1);
      expect(headerCell.querySelectorAll('.template-class').length).toBe(1);
      expect(headerCell.textContent).toBe('Template');
    });
  });

  describe('when cellTemplate is set', () => {
    it('should render this template', async () => {
      const cellTemplate = jest.fn((container: HTMLElement) => {
        const span = document.createElement('span');

        span.className = 'template-class';
        span.textContent = 'Template';

        container.append(span);
      });

      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            cellTemplate,
          },
        ],
      });

      const dataCell = component.getCellElement(0, 3);

      expect(cellTemplate).toHaveBeenCalledTimes(1);
      expect(dataCell.querySelectorAll('.template-class').length).toBe(1);
      expect(dataCell.textContent).toBe('Template');
    });
  });
});

describe('columnOption', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should return a column by name', async () => {
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
        },
      ],
    });

    const aiColumn = component.apiColumnOption('myColumn');

    expect(aiColumn.type).toBe('ai');
    expect(aiColumn.caption).toBe('AI Column');
    expect(aiColumn.index).toBe(3);
  });

  it('should apply cssClass to AI column', async () => {
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
        },
      ],
    });

    expect($(component.getCellElement(0, 3)).hasClass('custom-class')).toBe(false);

    component.apiColumnOption('myColumn', 'cssClass', 'custom-class');

    expect($(component.getCellElement(0, 3)).hasClass('custom-class')).toBe(true);
  });

  it('should apply headerCellTemplate to AI column', async () => {
    const headerCellTemplate = jest.fn((container: HTMLElement) => {
      const span = document.createElement('span');

      span.className = 'template-class';
      span.textContent = 'Template';

      container.append(span);
    });

    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
        },
      ],
    });

    component.apiColumnOption('myColumn', 'headerCellTemplate', headerCellTemplate);

    const headerCell = component.getHeaderCell(3);

    expect(headerCellTemplate).toHaveBeenCalledTimes(1);
    expect(headerCell.querySelectorAll('.template-class').length).toBe(1);
    expect(headerCell.textContent).toBe('Template');
  });

  it('should apply cellTemplate to AI column', async () => {
    const cellTemplate = jest.fn((container: HTMLElement) => {
      const span = document.createElement('span');

      span.className = 'template-class';
      span.textContent = 'Template';

      container.append(span);
    });

    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
        },
      ],
    });

    component.apiColumnOption('myColumn', 'cellTemplate', cellTemplate);

    const dataCell = component.getCellElement(0, 3);

    expect(cellTemplate).toHaveBeenCalledTimes(1);
    expect(dataCell.querySelectorAll('.template-class').length).toBe(1);
    expect(dataCell.textContent).toBe('Template');
  });

  describe('when the name is reset', () => {
    it('should throw E1066', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
          },
        ],
      });

      component.apiColumnOption('myColumn', 'name', '');

      expect(errors.log).toHaveBeenCalledWith('E1066');
    });
  });

  describe('when the name specified is not unique', () => {
    it('should throw E1059', async () => {
      const { component } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          {
            dataField: 'value',
            caption: 'Value',
            name: 'myColumn1',
          },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn2',
          },
        ],
      });

      component.apiColumnOption('myColumn2', 'name', 'myColumn1');

      expect(errors.log).toHaveBeenCalledWith('E1059', '"myColumn1"');
    });
  });
});
