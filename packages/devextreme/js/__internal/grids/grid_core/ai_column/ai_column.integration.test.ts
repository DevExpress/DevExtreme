import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { RequestParams } from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

const SELECTORS = {
  gridContainer: '#gridContainer',
};

const GRID_CONTAINER_ID = 'gridContainer';

interface RequestResult {
  promise: Promise<string>;
  abort: () => void;
}

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

  const instance = new DataGrid($container.get(0) as HTMLDivElement, options);
  const component = new DataGridModel($container.get(0) as HTMLElement);

  jest.runOnlyPendingTimers();
  resolve({
    $container,
    component,
    instance,
  });
});

const beforeTest = (): void => {
  jest.useFakeTimers();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
};

const afterTest = (): void => {
  const $container = $(SELECTORS.gridContainer);
  const dataGrid = ($container as any).dxDataGrid('instance') as DataGrid;

  dataGrid.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
};

describe('Options', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when alignment is left', () => {
    it('should set text-align to the left', async () => {
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
            alignment: 'left',
          },
        ],
      });

      expect($(component.getCellElement(0, 3)).css('text-align')).toBe('left');
    });
  });

  describe('when alignment is right', () => {
    it('should set text-align to the right', async () => {
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
            alignment: 'right',
          },
        ],
      });

      expect($(component.getCellElement(0, 3)).css('text-align')).toBe('right');
    });
  });

  describe('when alignment is center', () => {
    it('should set text-align to the center', async () => {
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
            alignment: 'center',
          },
        ],
      });

      expect($(component.getCellElement(0, 3)).css('text-align')).toBe('center');
    });
  });

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

  describe('when the visibleIndex is set', () => {
    it('should have the correct order', async () => {
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
            visibleIndex: 1,
          },
        ],
      });
      const visibleColumns = component.apiGetVisibleColumns();

      expect(visibleColumns.map(({ caption }) => caption))
        .toEqual(['ID', 'AI Column', 'Name', 'Value']);
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

  it('should apply alignment', async () => {
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

    expect($(component.getCellElement(0, 3)).css('text-align')).toBe('left');

    component.apiColumnOption('myColumn', 'alignment', 'right');

    expect($(component.getCellElement(0, 3)).css('text-align')).toBe('right');
  });

  it('should apply visibleIndex to AI column', async () => {
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

    component.apiColumnOption('myColumn', 'visibleIndex', 1);

    const visibleColumns = component.apiGetVisibleColumns();

    expect(visibleColumns.map(({ caption }) => caption))
      .toEqual(['ID', 'AI Column', 'Name', 'Value']);
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

describe('aiIntegration', () => {
  const rootSendRequestSpy = jest.fn();
  const columnSendRequestSpy = jest.fn();

  beforeEach(() => {
    beforeTest();
    rootSendRequestSpy.mockClear();
    columnSendRequestSpy.mockClear();
  });

  afterEach(afterTest);

  const aiIntegrationResult = (): RequestResult => ({
    promise: new Promise<string>((resolve) => {
      resolve('1');
    }),
    abort: (): void => { },
  });

  const rootAiIntegration = new AIIntegration({
    sendRequest(): RequestResult {
      rootSendRequestSpy();
      return aiIntegrationResult();
    },
  });
  const columnAiIntegration = new AIIntegration({
    sendRequest(): RequestResult {
      columnSendRequestSpy();
      return aiIntegrationResult();
    },
  });

  it('should be taken from grid level if it set up (first load)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      keyExpr: 'id',
      aiIntegration: rootAiIntegration,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            prompt: 'Test prompt',
          },
        },
      ],
    });

    instance.sendAIColumnRequest('myColumn');
    expect(rootSendRequestSpy).toHaveBeenCalled();
    expect(columnSendRequestSpy).not.toHaveBeenCalled();
  });
  it('should be taken from grid level if it set up (dynamic update)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            prompt: 'Test prompt',
          },
        },
      ],
    });
    instance.option('aiIntegration', rootAiIntegration);
    instance.sendAIColumnRequest('myColumn');
    expect(rootSendRequestSpy).toHaveBeenCalled();
    expect(columnSendRequestSpy).not.toHaveBeenCalled();
  });
  it('should be taken from column level if it set up (first load)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      keyExpr: 'id',
      aiIntegration: rootAiIntegration,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
            prompt: 'Test prompt',
          },
        },
      ],
    });

    instance.sendAIColumnRequest('myColumn');
    expect(columnSendRequestSpy).toHaveBeenCalled();
    expect(rootSendRequestSpy).not.toHaveBeenCalled();
  });

  it('should be taken from column level if it set up (dynamic update)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            prompt: 'Test prompt',
          },
        },
      ],
    });
    instance.columnOption('myColumn', 'ai', { aiIntegration: columnAiIntegration, prompt: 'Test prompt' });
    instance.option('aiIntegration', rootAiIntegration);
    instance.sendAIColumnRequest('myColumn');
    expect(columnSendRequestSpy).toHaveBeenCalled();
    expect(rootSendRequestSpy).not.toHaveBeenCalled();
  });
});

describe('prompt', () => {
  const columnSendRequestSpy = jest.fn();
  const prompt = 'Test prompt';

  beforeEach(() => {
    beforeTest();
    columnSendRequestSpy.mockClear();
  });

  afterEach(afterTest);

  const aiIntegrationResult = (): RequestResult => ({
    promise: new Promise<string>((resolve) => {
      resolve('1');
    }),
    abort: (): void => { },
  });

  const columnAiIntegration = new AIIntegration({
    sendRequest(params: RequestParams): RequestResult {
      columnSendRequestSpy(params.prompt.user?.includes(prompt));
      return aiIntegrationResult();
    },
  });

  it('should be passed to aiIntegration.sendRequest (first load)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
            prompt,
          },
        },
      ],
    });

    instance.sendAIColumnRequest('myColumn');
    expect(columnSendRequestSpy).toHaveBeenCalledWith(true);
  });

  it('should be passed to aiIntegration.sendRequest (dynamic update)', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
          },
        },
      ],
    });
    instance.columnOption('myColumn', 'ai.prompt', prompt);
    instance.sendAIColumnRequest('myColumn');
    expect(columnSendRequestSpy).toHaveBeenCalledWith(true);
  });

  describe('when aiIntegration is not set', () => {
    it('should throw E1067', async () => {
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
            name: 'myColumn',
          },
        ],
      });
      expect(errors.log).toHaveBeenCalledWith('E1067', 'myColumn');
    });
  });
});

describe('aiMode', () => {
  const columnSendRequestSpy = jest.fn();

  beforeEach(() => {
    beforeTest();
    columnSendRequestSpy.mockClear();
  });

  afterEach(afterTest);

  const aiIntegrationResult = (): RequestResult => ({
    promise: new Promise<string>((resolve) => {
      resolve('1');
    }),
    abort: (): void => { },
  });

  const columnAiIntegration = new AIIntegration({
    sendRequest(): RequestResult {
      columnSendRequestSpy();
      return aiIntegrationResult();
    },
  });

  it('should be auto by default', async () => {
    const { instance } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
          },
        },
      ],
    });
    const aiMode = instance.columnOption('myColumn', 'ai.mode');
    expect(aiMode).toBe('auto');
  });
  it('should call aiIntegration.sendRequest with every visible rows change', async () => {
    const dataSource = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Name ${i + 1}`,
      value: (i + 1) * 10,
    }));
    const { instance } = await createDataGrid({
      dataSource,
      keyExpr: 'id',
      paging: {
        pageSize: 5,
      },
      pager: {
        visible: true,
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
            prompt: 'Test prompt',
          },
        },
      ],
    });

    expect(columnSendRequestSpy).toBeCalledTimes(1);

    instance.option('paging.pageIndex', 2);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(2);

    instance.option('paging.pageIndex', 3);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(3);

    instance.option('filterValue', ['id', '>', 50]);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(4);

    instance.option('filterValue', undefined);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(5);

    instance.columnOption('name', 'groupIndex', 0);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(6);

    instance.clearGrouping();
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(7);
  });

  it('should NOT call aiIntegration.sendRequest with manual mode', async () => {
    const dataSource = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Name ${i + 1}`,
      value: (i + 1) * 10,
    }));
    const { instance } = await createDataGrid({
      dataSource,
      keyExpr: 'id',
      paging: {
        pageSize: 5,
      },
      pager: {
        visible: true,
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAiIntegration,
            mode: 'manual',
          },
        },
      ],
    });

    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('paging.pageIndex', 2);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('paging.pageIndex', 3);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('filterValue', ['id', '>', 50]);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('filterValue', undefined);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.columnOption('name', 'groupIndex', 0);
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.clearGrouping();
    jest.runOnlyPendingTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);
  });
});

describe('API Methods', () => {
  const columnSendRequestStarted = jest.fn();
  const columnSendRequestResolved = jest.fn();
  const abortSpy = jest.fn();

  beforeEach(() => {
    beforeTest();
    columnSendRequestStarted.mockClear();
    columnSendRequestResolved.mockClear();
    abortSpy.mockClear();
  });

  afterEach(afterTest);

  describe('abortAIColumnRequest', () => {
    const aiIntegrationResult = (): RequestResult => ({
      promise: new Promise<string>((resolve) => {
        columnSendRequestStarted();
        // Timeouts are mocked and do not delay tests execution
        setTimeout(() => {
          columnSendRequestResolved();
          resolve('1');
        }, 10000);
      }),
      abort: (): void => {
        abortSpy();
      },
    });

    const columnAiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        return aiIntegrationResult();
      },
    });
    it('should have no effect after the promise is resolved', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
      });

      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);

      instance.abortAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });
    it('should interrupt a promise and call abortSpy', async () => {
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
      });

      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(1000);

      instance.abortAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendAIColumnRequest', () => {
    it('should send a request only if there is a prompt', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          columnSendRequestResolved();
          resolve('1');
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAiIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              aiIntegration: columnAiIntegration,
              mode: 'manual',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      instance.columnOption('myColumn', 'ai.prompt', 'Test prompt');
      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });
  });
});
