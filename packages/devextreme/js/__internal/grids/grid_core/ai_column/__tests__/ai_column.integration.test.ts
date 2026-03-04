import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import $ from '@js/core/renderer';
import type { LoadOptions } from '@js/data';
import DataSource from '@js/data/data_source';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import ArrayStore from '@ts/data/m_array_store';

import {
  afterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
  GRID_CONTAINER_ID,
} from '../../__tests__/__mock__/helpers/utils';
import { CLASSES } from '../const';

const EMPTY_CELL_TEXT = '\u00A0';

const items = [
  { id: 1, name: 'Name 1', value: 10 },
  { id: 2, name: 'Name 2', value: 20 },
];

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

const beforeTest = (): void => {
  baseBeforeTest();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
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

      expect($(component.getDataCell(0, 3).getElement()).css('text-align')).toBe('left');
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

      expect($(component.getDataCell(0, 3).getElement()).css('text-align')).toBe('right');
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

      expect($(component.getDataCell(0, 3).getElement()).css('text-align')).toBe('center');
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

      expect($(component.getDataCell(0, 3).getElement()).hasClass('custom-class')).toBe(true);
      expect($(component.getDataCell(0, 3).getElement()).hasClass(CLASSES.aiColumn)).toBe(true);
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

      const headerCell = component.getAIHeaderCell(3);

      expect(headerCellTemplate).toHaveBeenCalledTimes(1);
      expect(headerCell.getElement()?.querySelectorAll('.template-class').length).toBe(1);
      expect(headerCell.getElement()?.textContent).toBe('Template');
      expect(headerCell.getHeaderContent()).toBeNull();
      expect(headerCell.getIcon()).toBeNull();
      expect(headerCell.getDropDownButton()).not.toBeNull();
    });
  });

  describe('when headerCellTemplate isn\'t set', () => {
    it('should render icon, text and button by default', async () => {
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

      const headerCell = component.getAIHeaderCell(3);

      expect(headerCell.getIcon()).not.toBeNull();
      expect(headerCell.getText()).toBe('AI Column');
      expect(headerCell.getDropDownButton()).not.toBeNull();
    });
  });

  describe('when headerCellTemplate is dynamically updated', () => {
    it('should replace default header template', async () => {
      const headerCellTemplate = jest.fn((container: HTMLElement) => {
        const span = document.createElement('span');

        span.className = 'my-template-class';
        span.textContent = 'Test';
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

      const headerCellUpdated = component.getAIHeaderCell(3);

      expect(headerCellTemplate).toHaveBeenCalledTimes(1);
      expect(headerCellUpdated.getElement()?.querySelector('.my-template-class')).not.toBeNull();
      expect(headerCellUpdated.getElement()?.textContent).toBe('Test');
      expect(headerCellUpdated.getHeaderContent()).toBeNull();
      expect(headerCellUpdated.getIcon()).toBeNull();
      expect(headerCellUpdated.getDropDownButton()).not.toBeNull();
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

      const dataCell = component.getDataCell(0, 3).getElement();

      expect(cellTemplate).toHaveBeenCalledTimes(1);
      expect(dataCell?.querySelectorAll('.template-class').length).toBe(1);
      expect(dataCell?.textContent).toBe('Template');
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

  describe('when column.ai.showHeaderMenu is set to false', () => {
    it('should not render header button', async () => {
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
            ai: {
              showHeaderMenu: false,
            },
          },
        ],
      });

      const headerCell = component.getAIHeaderCell(3);

      expect(headerCell.getHeaderContent()).not.toBeNull();
      expect(headerCell.getIcon()).not.toBeNull();
      expect(headerCell.getText()).toBe('AI Column');
      expect(headerCell.getDropDownButton().getElement()).toBeNull();
    });
  });

  describe('when noDataText is set', () => {
    it('should render this text (initial render)', async () => {
      const { component } = await createDataGrid({
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
            cssClass: 'custom-class',
            ai: {
              prompt: 'Initial Prompt',
              noDataText: 'Test - No Data',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });

    it('should render this text (runtime change)', async () => {
      const { component } = await createDataGrid({
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
            cssClass: 'custom-class',
            ai: {
              prompt: 'Initial Prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      component.apiColumnOption('myColumn', 'ai.noDataText', 'Test - No Data');

      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });
  });

  describe('when emptyText is set', () => {
    it('should render this text (initial render)', async () => {
      const { component } = await createDataGrid({
        keyExpr: 'id',
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
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
            ai: {
              emptyText: 'Test - Empty Data',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('Test - Empty Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - Empty Data');
    });

    it('should render this text (runtime change)', async () => {
      const { component } = await createDataGrid({
        keyExpr: 'id',
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
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
            ai: {
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      component.apiColumnOption('myColumn', 'ai.emptyText', 'Test - Empty Data');

      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - Empty Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - Empty Data');
    });
  });

  describe('when the noDataText is set and mode = "manual"', () => {
    it('should render this text (initial render)', async () => {
      const { component, instance } = await createDataGrid({
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
            cssClass: 'custom-class',
            ai: {
              prompt: 'Initial Prompt',
              noDataText: 'Test - No Data',
              mode: 'manual',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });

    it('should render this text (runtime change)', async () => {
      const { component, instance } = await createDataGrid({
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
            cssClass: 'custom-class',
            ai: {
              prompt: 'Initial Prompt',
              mode: 'manual',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      component.apiColumnOption('myColumn', 'ai.noDataText', 'Test - No Data');
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });
  });

  describe('when the emptyText is set and mode = "manual"', () => {
    it('should render this text (initial render)', async () => {
      const { component, instance } = await createDataGrid({
        keyExpr: 'id',
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
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
            ai: {
              emptyText: 'Test - Empty Data',
              noDataText: 'Test - No Data',
              mode: 'manual',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('Test - Empty Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - Empty Data');

      instance.columnOption('myColumn', 'ai.prompt', 'Updated Prompt');
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });

    it('should render this text (runtime change)', async () => {
      const { component, instance } = await createDataGrid({
        keyExpr: 'id',
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
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
            ai: {
              mode: 'manual',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"","2":""}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      instance.columnOption('myColumn', 'ai.emptyText', 'Test - Empty Data');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - Empty Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - Empty Data');

      instance.columnOption('myColumn', 'ai.prompt', 'Updated Prompt');
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      instance.columnOption('myColumn', 'ai.noDataText', 'Test - No Data');
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('Test - No Data');
      expect(component.getDataCell(1, 3).getText()).toBe('Test - No Data');
    });
  });

  describe('when the keyExpr is not set', () => {
    it('should throw E1042', async () => {
      const onDataErrorOccurredMock = jest.fn();
      const sendRequestMock = jest.fn((): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          resolve('{}');
        }),
        abort: (): void => {},
      }));

      await createDataGrid({
        keyExpr: undefined,
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
            ai: {
              prompt: 'Initial Prompt',
              aiIntegration: new AIIntegration({
                sendRequest: sendRequestMock,
              }),
            },
          },
        ],
        onDataErrorOccurred: onDataErrorOccurredMock,
      });

      expect(sendRequestMock).toHaveBeenCalledTimes(0);
      expect(onDataErrorOccurredMock).toHaveBeenCalledTimes(1);
      expect(errors.Error).toHaveBeenCalledWith('E1042', 'AI Column');
    });
  });

  describe('when the keyExpr is not set', () => {
    it('should throw E1042 when sending the request', async () => {
      const onDataErrorOccurredMock = jest.fn();
      const sendRequestMock = jest.fn((): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          resolve('{}');
        }),
        abort: (): void => {},
      }));

      const { instance } = await createDataGrid({
        keyExpr: undefined,
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
            name: 'aiColumn',
            ai: {
              aiIntegration: new AIIntegration({
                sendRequest: sendRequestMock,
              }),
            },
          },
        ],
        onDataErrorOccurred: onDataErrorOccurredMock,
      });

      expect(sendRequestMock).toHaveBeenCalledTimes(0);
      expect(onDataErrorOccurredMock).toHaveBeenCalledTimes(1);
      expect(errors.Error).toHaveBeenCalledWith('E1042', 'AI Column');

      instance.columnOption('aiColumn', 'ai.prompt', 'New Prompt');

      expect(sendRequestMock).toHaveBeenCalledTimes(0);
      expect(onDataErrorOccurredMock).toHaveBeenCalledTimes(2);
      expect(errors.Error).toHaveBeenCalledTimes(2);
      expect(errors.Error).toHaveBeenLastCalledWith('E1042', 'AI Column');
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

    expect($(component.getDataCell(0, 3).getElement()).hasClass('custom-class')).toBe(false);

    component.apiColumnOption('myColumn', 'cssClass', 'custom-class');

    expect($(component.getDataCell(0, 3).getElement()).hasClass('custom-class')).toBe(true);
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

    const headerCell = component.getAIHeaderCell(3);

    expect(headerCellTemplate).toHaveBeenCalledTimes(1);
    expect(headerCell.getElement()?.querySelectorAll('.template-class').length).toBe(1);
    expect(headerCell.getElement()?.textContent).toBe('Template');
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

    const dataCell = component.getDataCell(0, 3).getElement();

    expect(cellTemplate).toHaveBeenCalledTimes(1);
    expect(dataCell?.querySelectorAll('.template-class').length).toBe(1);
    expect(dataCell?.textContent).toBe('Template');
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

    expect($(component.getDataCell(0, 3).getElement()).css('text-align')).toBe('left');

    component.apiColumnOption('myColumn', 'alignment', 'right');

    expect($(component.getDataCell(0, 3).getElement()).css('text-align')).toBe('right');
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

  it('should apply encodeHtml to AI column', async () => {
    const aiIntegration = new AIIntegration({
      sendRequest(prompt): RequestResult {
        return {
          promise: new Promise<string>((resolve) => {
            const result = {};
            Object.entries(prompt.data?.data).forEach(([key]) => {
              result[key] = '<script>alert(\'XSS\')</script>';
            });
            resolve(JSON.stringify(result));
          }),
          abort: (): void => {},
        };
      },
    });
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration,
            prompt: 'Initial Prompt',
          },
        },
      ],
    });

    await Promise.resolve();
    expect(component.getDataCell(0, 1).getText()).toBe('<script>alert(\'XSS\')</script>');

    component.apiColumnOption('myColumn', 'encodeHtml', false);
    expect(component.getDataCell(0, 1).getText()).toBe('alert(\'XSS\')');
    expect(component.apiColumnOption('myColumn').encodeHtml).toBe(false);
  });

  it('should use calculateDisplayValue for AI column', async () => {
    const aiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        return {
          promise: new Promise<string>((resolve) => {
            resolve('{"1":"AI Value"}');
          }),
          abort: (): void => {},
        };
      },
    });
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration,
            prompt: 'Initial Prompt',
          },
          calculateDisplayValue: (): string => 'Calculated AI Value',
        },
      ],
    });

    await Promise.resolve();
    expect(component.getDataCell(0, 1).getText()).toBe('Calculated AI Value');
  });

  it('should use customizeText for AI column', async () => {
    const aiIntegration = new AIIntegration({
      sendRequest(): RequestResult {
        return {
          promise: new Promise<string>((resolve) => {
            resolve('{"1":"AI Value"}');
          }),
          abort: (): void => {},
        };
      },
    });
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration,
            prompt: 'Initial Prompt',
          },
          customizeText: (cellInfo): string => `Customized: ${cellInfo.valueText}`,
        },
      ],
    });

    await Promise.resolve();
    expect(component.getDataCell(0, 1).getText()).toBe('Customized: AI Value');
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

  it('should be able to switch column type to "ai" at runtime', async () => {
    const { component } = await createDataGrid({
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
      ],
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          caption: 'AI Column',
          name: 'myColumn',
        },
      ],
    });

    component.apiColumnOption('myColumn', 'type', 'ai');
    expect(component.apiColumnOption('myColumn').type).toBe('ai');
  });

  describe('when prompt is reset', () => {
    it('should clear AI column values', async () => {
      const { component, instance } = await createDataGrid({
        keyExpr: 'id',
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
            ai: {
              prompt: 'Initial Prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Value"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('AI Value');

      instance.columnOption('myColumn', 'ai.prompt', '');

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
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

  const rootAIIntegration = new AIIntegration({
    sendRequest(): RequestResult {
      rootSendRequestSpy();
      return aiIntegrationResult();
    },
  });

  const columnAIIntegration = new AIIntegration({
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
      aiIntegration: rootAIIntegration,
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
    instance.option('aiIntegration', rootAIIntegration);
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
      aiIntegration: rootAIIntegration,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myColumn',
          ai: {
            aiIntegration: columnAIIntegration,
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
    instance.columnOption('myColumn', 'ai', { aiIntegration: columnAIIntegration, prompt: 'Test prompt' });
    instance.option('aiIntegration', rootAIIntegration);
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

  const columnAIIntegration = new AIIntegration({
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
            aiIntegration: columnAIIntegration,
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
            aiIntegration: columnAIIntegration,
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

  const columnAIIntegration = new AIIntegration({
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
            aiIntegration: columnAIIntegration,
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
            aiIntegration: columnAIIntegration,
            prompt: 'Test prompt',
          },
        },
      ],
    });

    expect(columnSendRequestSpy).toBeCalledTimes(1);

    instance.option('paging.pageIndex', 2);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(2);

    instance.option('paging.pageIndex', 3);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(3);

    instance.option('filterValue', ['id', '>', 50]);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(4);

    instance.option('filterValue', undefined);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(5);

    instance.columnOption('name', 'groupIndex', 0);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(6);

    instance.clearGrouping();
    jest.runAllTimers();
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
            aiIntegration: columnAIIntegration,
            mode: 'manual',
          },
        },
      ],
    });

    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('paging.pageIndex', 2);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('paging.pageIndex', 3);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('filterValue', ['id', '>', 50]);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.option('filterValue', undefined);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.columnOption('name', 'groupIndex', 0);
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);

    instance.clearGrouping();
    jest.runAllTimers();
    expect(columnSendRequestSpy).toBeCalledTimes(0);
  });

  describe('when mode is manual', () => {
    it('should apply prompt change at runtime', async () => {
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
            ai: {
              aiIntegration: columnAIIntegration,
              mode: 'manual',
            },
          },
        ],
      });
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      expect(columnSendRequestSpy).toBeCalledTimes(0);

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);

      dropDownButton.getList()?.getItem(0)?.getElement()?.click(); // show AIPromptEditor

      const aiPromptEditor = component.getAIPromptEditor();

      expect(aiPromptEditor.isVisible()).toBe(true);

      aiPromptEditor.getTextArea().setValue('Updated prompt');
      aiPromptEditor.getApplyButton().getElement().click();

      expect(aiPromptEditor.getProgressBar().isVisible()).toBe(true);

      await Promise.resolve();

      expect(aiPromptEditor.getProgressBar().isVisible()).toBe(false);
      expect(columnSendRequestSpy).toBeCalledTimes(1);
    });
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

    const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
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

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
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

    it('should send a request after changing the prompt in auto mode (dynamic update)', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          columnSendRequestResolved();
          resolve('1');
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      instance.columnOption('myColumn', 'ai.prompt', 'Test prompt');

      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should not send a request if there are no data rows', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          columnSendRequestResolved();
          resolve('1');
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [],
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
    });

    it('should abort the previous request of the same column', async () => {
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

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(5000);
      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(2);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should not abort the previous request of other column', async () => {
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

      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const columnAIIntegration2 = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
          {
            type: 'ai',
            caption: 'AI Column2',
            name: 'myColumn2',
            ai: {
              aiIntegration: columnAIIntegration2,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(5000);
      instance.sendAIColumnRequest('myColumn2');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(2);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
    });

    it('should call a toast with error text if the request is rejected', async () => {
      const aiIntegrationResultWithError = (): RequestResult => ({
        promise: new Promise<string>((_resolve, reject) => {
          columnSendRequestStarted();
          // Timeouts are mocked and do not delay tests execution
          setTimeout(() => {
            reject(new Error('Test error'));
          }, 10000);
        }),
        abort: (): void => {
          abortSpy();
        },
      });
      const columnAIIntegrationWithError = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResultWithError();
        },
      });
      const { instance, component } = await createDataGrid({
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
              aiIntegration: columnAIIntegrationWithError,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      expect(component.getToast().getInstance()).toBeUndefined();
      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(abortSpy).toHaveBeenCalledTimes(0);
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      await Promise.resolve();
      await Promise.resolve();

      expect(abortSpy).toHaveBeenCalledTimes(1);
      const toastInstance = component.getToast().getInstance();
      expect(toastInstance).toBeDefined();
      expect(toastInstance.option('message')).toEqual('Test error');
      expect(toastInstance.option('type')).toEqual('error');
      expect(toastInstance.option('position.at')).toEqual('bottom');
      expect(toastInstance.option('position.my')).toEqual('bottom');
    });
  });

  describe('refreshAIColumn', () => {
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

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
            },
          },
        ],
      });

      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      instance.columnOption('myColumn', 'ai.prompt', 'Test prompt');
      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should not send a request if there are no data rows', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          columnSendRequestResolved();
          resolve('1');
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [],
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
    });

    it('should abort the previous request of the same column', async () => {
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

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(5000);
      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(2);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should not abort the previous request of other column', async () => {
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

      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const columnAIIntegration2 = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
          {
            type: 'ai',
            caption: 'AI Column2',
            name: 'myColumn2',
            ai: {
              aiIntegration: columnAIIntegration2,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.refreshAIColumn('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(5000);
      instance.refreshAIColumn('myColumn2');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(2);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('clearAIColumn', () => {
    it('should clear cell values', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      expect(component.getDataCell(0, 3).getText()).toBe('AI Response 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Response 2');

      dropDownButton.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);

      // click the 'Clear Data' button
      dropDownButton.getList().getItem(2).getElement()?.click();

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);
    });

    it('should abort the previous request of the same column', async () => {
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

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);

      // There is NOT enough time to resolve a promise
      jest.advanceTimersByTime(5000);
      instance.clearAIColumn('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear column cache', async () => {
      const aiIntegrationResult = (prompt: RequestParams): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          const result = {};
          Object.entries(prompt.data?.data).forEach(([key, value]) => {
            result[key] = `Response ${(value as any).name}`;
          });

          resolve(JSON.stringify(result));
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          return aiIntegrationResult(prompt);
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(instance.getAIColumnText('myColumn', 1)).toBe('Response Name 1');
      expect(instance.getAIColumnText('myColumn', 2)).toBe('Response Name 2');

      instance.clearAIColumn('myColumn');

      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
      expect(instance.getAIColumnText('myColumn', 2)).toBeUndefined();
    });
  });

  describe('getAIColumnText', () => {
    it('should return undefined if there is no value for the row', async () => {
      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return {
            promise: new Promise<string>(() => { }),
            abort: (): void => { },
          };
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });
      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
      expect(instance.getAIColumnText('myColumn', 2)).toBeUndefined();
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
      expect(instance.getAIColumnText('myColumn', 2)).toBeUndefined();
    });

    it('should support string keys', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          const result = {
            a1: 'Response Name A1',
            b2: 'Response Name B2',
          };
          resolve(JSON.stringify(result));
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
        sendRequest(): RequestResult {
          return aiIntegrationResult();
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 'a1', name: 'Name A1', value: 10 },
          { id: 'b2', name: 'Name B2', value: 20 },
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(instance.getAIColumnText('myColumn', 'a1')).toBe('Response Name A1');
      expect(instance.getAIColumnText('myColumn', 'b2')).toBe('Response Name B2');
    });

    it('should support number keys', async () => {
      const aiIntegrationResult = (): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          const result = {
            1: 'Response Name 1',
            2: 'Response Name 2',
          };
          resolve(JSON.stringify(result));
        }),
        abort: (): void => {
          abortSpy();
        },
      });

      const columnAIIntegration = new AIIntegration({
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(instance.getAIColumnText('myColumn', 1)).toBe('Response Name 1');
      expect(instance.getAIColumnText('myColumn', 2)).toBe('Response Name 2');
      expect(instance.getAIColumnText('myColumn', '1')).toBe('Response Name 1');
      expect(instance.getAIColumnText('myColumn', '2')).toBe('Response Name 2');
    });
  });
});

describe('API Handlers', () => {
  const columnSendRequestStarted = jest.fn();
  const columnSendRequestResolved = jest.fn();
  const sendRequestPromptSpy = jest.fn();
  const sendRequestDataSpy = jest.fn();
  const abortSpy = jest.fn();

  beforeEach(() => {
    beforeTest();
    columnSendRequestStarted.mockClear();
    columnSendRequestResolved.mockClear();
    sendRequestPromptSpy.mockClear();
    sendRequestDataSpy.mockClear();
    abortSpy.mockClear();
  });

  afterEach(afterTest);

  describe('onAIColumnRequestCreating', () => {
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
    const columnAIIntegration = new AIIntegration({
      sendRequest({ prompt, data }): RequestResult {
        sendRequestPromptSpy(prompt);
        sendRequestDataSpy(data);
        return aiIntegrationResult();
      },
    });
    it('should be called by default', async () => {
      const onAIColumnRequestCreating = jest.fn();
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating,
      });

      instance.sendAIColumnRequest('myColumn');
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(onAIColumnRequestCreating).toHaveBeenCalledTimes(1);
      expect(onAIColumnRequestCreating).toHaveBeenCalledWith(
        expect.objectContaining({
          component: expect.objectContaining({ NAME: 'dxDataGrid' }),
          element: expect.objectContaining({ id: GRID_CONTAINER_ID }),
          column: expect.objectContaining({
            name: 'myColumn',
            ai: expect.objectContaining({
              mode: 'manual',
              prompt: 'Test prompt',
            }),
          }),
          data: expect.arrayContaining([
            { id: 1, name: 'Name 1', value: 10 },
            { id: 2, name: 'Name 2', value: 20 },
          ]),
          useCache: false,
          cancel: false,
          additionalInfo: {},
        }),
      );
      expect(abortSpy).toHaveBeenCalledTimes(0);
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
    });

    it('should cancel the request if e.cancel is true', async () => {
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating: (e) => { e.cancel = true; },
      });

      instance.sendAIColumnRequest('myColumn');
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(0);
      expect(abortSpy).toHaveBeenCalledTimes(0);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(0);
    });

    it('should take into account reduced row count', async () => {
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating: (e) => {
          const filtered = e.data.filter((item) => item.id === 2);
          e.data.splice(0, e.data.length, ...filtered);
        },
      });

      instance.sendAIColumnRequest('myColumn');
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      expect(sendRequestPromptSpy).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.stringContaining('Dataset: {"2":{"id":2,"name":"Name 2","value":20}}'),
      }));

      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should take into account reduced column count', async () => {
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating: (e) => {
          const reduced = e.data.map((item) => ({ id: item.id }));
          e.data.splice(0, e.data.length, ...reduced);
        },
      });

      instance.sendAIColumnRequest('myColumn');
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      expect(sendRequestPromptSpy).toHaveBeenCalledWith(expect.objectContaining({
        user: expect.stringContaining('Dataset: {"1":{"id":1},"2":{"id":2}}.'),
      }));

      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should pass additional info to the AI request', async () => {
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating: (e) => {
          e.additionalInfo = { customData: 'My custom data' };
        },
      });

      instance.sendAIColumnRequest('myColumn');
      // There is enough time to resolve a promise
      jest.advanceTimersByTime(10000);
      expect(columnSendRequestStarted).toHaveBeenCalledTimes(1);
      expect(columnSendRequestResolved).toHaveBeenCalledTimes(1);
      expect(sendRequestDataSpy).toHaveBeenCalledWith(expect.objectContaining({
        additionalInfo: { customData: 'My custom data' },
      }));

      await Promise.resolve();
      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should have useCache property set to true by default', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestDataSpy();

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        paging: {
          pageSize: 1,
        },
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
              aiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
      });

      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(1);

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(2);

      instance.option('paging.pageIndex', 0);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(2);
    });

    it('should not use cache when useCache property set to false', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestDataSpy();

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        paging: {
          pageSize: 1,
        },
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
              aiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
        onAIColumnRequestCreating: (e) => {
          e.useCache = false;
        },
      });

      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(1);

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(2);

      instance.option('paging.pageIndex', 0);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestDataSpy).toHaveBeenCalledTimes(3);
    });
  });
});

describe('Popup', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should be visible when the ai.popup.visible is true (dynamic update)', async () => {
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

    expect(component.getAIDialog()).toBeNull();

    component.apiColumnOption('myColumn', 'ai.popup.visible', true);

    jest.runAllTimers();
    await Promise.resolve();
    expect(component.getAIDialog()).not.toBeNull();

    const popupInstance = component.getAIPromptEditor().getPopupInstance();
    expect(popupInstance.option('visible')).toBe(true);
  });

  it('should be invisible when the ai.popup.visible is false (dynamic update)', async () => {
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
          ai: {
            popup: {
              visible: true,
            },
          },
        },
      ],
    });

    expect(component.getAIDialog()).not.toBeNull();

    component.apiColumnOption('myColumn', 'ai.popup.visible', false);

    jest.runAllTimers();
    await Promise.resolve();
    expect(component.getAIDialog()).toBeNull();

    const popupInstance = component.getAIPromptEditor().getPopupInstance();
    expect(popupInstance.option('visible')).toBe(false);
  });

  it('should pass popup options to the AI column prompt editor popup (initial rendering)', async () => {
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
          ai: {
            popup: {
              visible: true,
              title: 'Custom Title',
              height: 400,
              animation: {
                show: {
                  type: 'fade',
                  duration: 300,
                },
                hide: {
                  type: 'fade',
                  duration: 300,
                },
              },
              toolbarItems: [
                {
                  widget: 'dxButton',
                  options: {
                    text: 'Custom Button',
                  },
                  location: 'after',
                },
              ],
              accessKey: 'h',
              hideOnOutsideClick: true,
              dragEnabled: true,
              enableBodyScroll: false,
              hint: 'Custom Hint',
              maxHeight: 2000,
              minHeight: 100,
              maxWidth: 800,
              minWidth: 200,
              onDisposing: jest.fn().mockReturnValue('onDisposing'),
              onHidden: jest.fn().mockReturnValue('onHidden'),
              onShowing: jest.fn().mockReturnValue('onShowing'),
              onShown: jest.fn().mockReturnValue('onShown'),
              onContentReady: jest.fn().mockReturnValue('onContentReady'),
              onResize: jest.fn().mockReturnValue('onResize'),
              onResizeEnd: jest.fn().mockReturnValue('onResizeEnd'),
              onResizeStart: jest.fn().mockReturnValue('onResizeStart'),
              onHiding: jest.fn().mockReturnValue('onHiding'),
              onTitleRendered: jest.fn().mockReturnValue('onTitleRendered'),
              onInitialized: jest.fn().mockReturnValue('onInitialized'),
              resizeEnabled: true,
              restorePosition: true,
              rtlEnabled: true,
              shading: false,
              showTitle: true,
            },
          },
        },
      ],
    });

    const popupInstance = component.getAIPromptEditor().getPopupInstance();
    expect(popupInstance.option('visible')).toBe(true);
    expect(popupInstance.option('title')).toBe('Custom Title');
    expect(popupInstance.option('width')).toBe(360); // default width
    expect(popupInstance.option('height')).toBe(400);
    expect(popupInstance.option('animation')).toEqual({
      show: {
        type: 'fade',
        duration: 300,
      },
      hide: {
        type: 'fade',
        duration: 300,
      },
    });
    const toolbarItems = popupInstance.option('toolbarItems');
    expect(toolbarItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          widget: 'dxButton',
          options: expect.objectContaining({
            text: 'Custom Button',
          }),
          location: 'after',
        }),
      ]),
    );
    expect(popupInstance.option('accessKey')).toBe('h');
    expect(popupInstance.option('hideOnOutsideClick')).toBe(true);
    expect(popupInstance.option('dragEnabled')).toBe(true);
    expect(popupInstance.option('enableBodyScroll')).toBe(false);
    expect(popupInstance.option('hint')).toBe('Custom Hint');
    expect(popupInstance.option('maxHeight')).toBe(2000);
    expect(popupInstance.option('minHeight')).toBe(100);
    expect(popupInstance.option('maxWidth')).toBe(800);
    expect(popupInstance.option('minWidth')).toBe(200);
    expect(popupInstance.option('onDisposing')?.({} as any)).toEqual('onDisposing');
    expect(popupInstance.option('onHidden')?.({} as any)).toEqual('onHidden');
    expect(popupInstance.option('onShowing')?.({} as any)).toEqual('onShowing');
    expect(popupInstance.option('onShown')?.({} as any)).toEqual('onShown');
    expect(popupInstance.option('onContentReady')?.({} as any)).toEqual('onContentReady');
    expect(popupInstance.option('onResize')?.({} as any)).toEqual('onResize');
    expect(popupInstance.option('onResizeEnd')?.({} as any)).toEqual('onResizeEnd');
    expect(popupInstance.option('onResizeStart')?.({} as any)).toEqual('onResizeStart');
    expect(popupInstance.option('onHiding')?.({} as any)).toEqual('onHiding');
    expect(popupInstance.option('onTitleRendered')?.({} as any)).toEqual('onTitleRendered');
    expect(popupInstance.option('onInitialized')?.({} as any)).toEqual('onInitialized');
    expect(popupInstance.option('resizeEnabled')).toBe(true);
    expect(popupInstance.option('restorePosition')).toBe(true);
    expect(popupInstance.option('rtlEnabled')).toBe(true);
    expect(popupInstance.option('shading')).toBe(false);
    expect(popupInstance.option('showTitle')).toBe(true);
  });

  it('should pass popup options to the AI column prompt editor popup (dynamic update)', async () => {
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

    component.apiColumnOption('myColumn', 'ai.popup', {
      visible: true,
      title: 'Custom Title',
      height: 400,
      animation: {
        show: {
          type: 'fade',
          duration: 300,
        },
        hide: {
          type: 'fade',
          duration: 300,
        },
      },
      toolbarItems: [
        {
          widget: 'dxButton',
          options: {
            text: 'Custom Button',
          },
          location: 'after',
        },
      ],
      accessKey: 'h',
      hideOnOutsideClick: true,
      dragEnabled: true,
      enableBodyScroll: false,
      hint: 'Custom Hint',
      maxHeight: 2000,
      minHeight: 100,
      maxWidth: 800,
      minWidth: 200,
      onDisposing: jest.fn().mockReturnValue('onDisposing'),
      onHidden: jest.fn().mockReturnValue('onHidden'),
      onShowing: jest.fn().mockReturnValue('onShowing'),
      onShown: jest.fn().mockReturnValue('onShown'),
      onContentReady: jest.fn().mockReturnValue('onContentReady'),
      onResize: jest.fn().mockReturnValue('onResize'),
      onResizeEnd: jest.fn().mockReturnValue('onResizeEnd'),
      onResizeStart: jest.fn().mockReturnValue('onResizeStart'),
      onHiding: jest.fn().mockReturnValue('onHiding'),
      onTitleRendered: jest.fn().mockReturnValue('onTitleRendered'),
      onInitialized: jest.fn().mockReturnValue('onInitialized'),
      resizeEnabled: true,
      restorePosition: true,
      rtlEnabled: true,
      shading: false,
      showTitle: true,
    });

    jest.runAllTimers();
    await Promise.resolve();

    const popupInstance = component.getAIPromptEditor().getPopupInstance();
    expect(popupInstance.option('visible')).toBe(true);
    expect(popupInstance.option('title')).toBe('Custom Title');
    expect(popupInstance.option('width')).toBe(360); // default width
    expect(popupInstance.option('height')).toBe(400);
    expect(popupInstance.option('animation')).toEqual({
      show: {
        type: 'fade',
        duration: 300,
      },
      hide: {
        type: 'fade',
        duration: 300,
      },
    });
    const toolbarItems = popupInstance.option('toolbarItems');
    expect(toolbarItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          widget: 'dxButton',
          options: expect.objectContaining({
            text: 'Custom Button',
          }),
          location: 'after',
        }),
      ]),
    );
    expect(popupInstance.option('accessKey')).toBe('h');
    expect(popupInstance.option('hideOnOutsideClick')).toBe(true);
    expect(popupInstance.option('dragEnabled')).toBe(true);
    expect(popupInstance.option('enableBodyScroll')).toBe(false);
    expect(popupInstance.option('hint')).toBe('Custom Hint');
    expect(popupInstance.option('maxHeight')).toBe(2000);
    expect(popupInstance.option('minHeight')).toBe(100);
    expect(popupInstance.option('maxWidth')).toBe(800);
    expect(popupInstance.option('minWidth')).toBe(200);
    expect(popupInstance.option('onDisposing')?.({} as any)).toEqual('onDisposing');
    expect(popupInstance.option('onHidden')?.({} as any)).toEqual('onHidden');
    expect(popupInstance.option('onShowing')?.({} as any)).toEqual('onShowing');
    expect(popupInstance.option('onShown')?.({} as any)).toEqual('onShown');
    expect(popupInstance.option('onContentReady')?.({} as any)).toEqual('onContentReady');
    expect(popupInstance.option('onResize')?.({} as any)).toEqual('onResize');
    expect(popupInstance.option('onResizeEnd')?.({} as any)).toEqual('onResizeEnd');
    expect(popupInstance.option('onResizeStart')?.({} as any)).toEqual('onResizeStart');
    expect(popupInstance.option('onHiding')?.({} as any)).toEqual('onHiding');
    expect(popupInstance.option('onTitleRendered')?.({} as any)).toEqual('onTitleRendered');
    expect(popupInstance.option('onInitialized')?.({} as any)).toEqual('onInitialized');
    expect(popupInstance.option('resizeEnabled')).toBe(true);
    expect(popupInstance.option('restorePosition')).toBe(true);
    expect(popupInstance.option('rtlEnabled')).toBe(true);
    expect(popupInstance.option('shading')).toBe(false);
    expect(popupInstance.option('showTitle')).toBe(true);
  });
});

describe('Editor', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should pass editor options to the AI column prompt editor (initial rendering)', async () => {
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
          ai: {
            popup: {
              visible: true,
            },
            prompt: 'Test prompt',
            editorOptions: {
              height: 200,
              placeholder: 'Custom placeholder',
              accessKey: 'h',
              activeStateEnabled: true,
              hint: 'Custom Hint',
              label: 'Custom Label',
              labelMode: 'floating',
              maxLength: 500,
              readOnly: false,
              spellcheck: true,
              onChange: jest.fn().mockReturnValue('onChange'),
              onCopy: jest.fn().mockReturnValue('onCopy'),
              onCut: jest.fn().mockReturnValue('onCut'),
              onEnterKey: jest.fn().mockReturnValue('onEnterKey'),
              onFocusIn: jest.fn().mockReturnValue('onFocusIn'),
              onFocusOut: jest.fn().mockReturnValue('onFocusOut'),
              onInput: jest.fn().mockReturnValue('onInput'),
              onKeyDown: jest.fn().mockReturnValue('onKeyDown'),
              onKeyUp: jest.fn().mockReturnValue('onKeyUp'),
              onPaste: jest.fn().mockReturnValue('onPaste'),
              onDisposing: jest.fn().mockReturnValue('onDisposing'),
              onInitialized: jest.fn().mockReturnValue('onInitialized'),
              rtlEnabled: true,
              stylingMode: 'underlined',
              tabIndex: 1,
              width: '100px',
            },
          },
        },
      ],
    });

    const textEditorInstance = component.getAIPromptEditor().getTextArea().getInstance();
    expect(textEditorInstance.option('height')).toBe(200);
    expect(textEditorInstance.option('placeholder')).toBe('Custom placeholder');
    expect(textEditorInstance.option('value')).toBe('Test prompt');
    expect(textEditorInstance.option('accessKey')).toBe('h');
    expect(textEditorInstance.option('activeStateEnabled')).toBe(true);
    expect(textEditorInstance.option('hint')).toBe('Custom Hint');
    expect(textEditorInstance.option('label')).toBe('Custom Label');
    expect(textEditorInstance.option('labelMode')).toBe('floating');
    expect(textEditorInstance.option('maxLength')).toBe(500);
    expect(textEditorInstance.option('readOnly')).toBe(false);
    expect(textEditorInstance.option('spellcheck')).toBe(true);
    expect((textEditorInstance.option('onChange') as any)()).toEqual('onChange');
    expect((textEditorInstance.option('onCopy') as any)()).toEqual('onCopy');
    expect((textEditorInstance.option('onCut') as any)()).toEqual('onCut');
    expect((textEditorInstance.option('onEnterKey') as any)()).toEqual('onEnterKey');
    expect((textEditorInstance.option('onFocusIn') as any)()).toEqual('onFocusIn');
    expect((textEditorInstance.option('onFocusOut') as any)()).toEqual('onFocusOut');
    expect((textEditorInstance.option('onInput') as any)()).toEqual('onInput');
    expect((textEditorInstance.option('onKeyDown') as any)()).toEqual('onKeyDown');
    expect((textEditorInstance.option('onKeyUp') as any)()).toEqual('onKeyUp');
    expect((textEditorInstance.option('onPaste') as any)()).toEqual('onPaste');
    expect((textEditorInstance.option('onDisposing') as any)()).toEqual('onDisposing');
    expect((textEditorInstance.option('onInitialized') as any)()).toEqual('onInitialized');
    expect(textEditorInstance.option('rtlEnabled')).toBe(true);
    expect(textEditorInstance.option('stylingMode')).toBe('underlined');
    expect(textEditorInstance.option('tabIndex')).toBe(1);
    expect(textEditorInstance.option('width')).toBe('100px');
  });

  it('should pass editor options to the AI column prompt editor (dynamic update)', async () => {
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
          ai: {
            popup: {
              visible: true,
            },
          },
        },
      ],
    });

    component.apiColumnOption('myColumn', 'ai.editorOptions', {
      height: 200,
      placeholder: 'Custom placeholder',
      accessKey: 'h',
      activeStateEnabled: true,
      hint: 'Custom Hint',
      label: 'Custom Label',
      labelMode: 'floating',
      maxLength: 500,
      readOnly: false,
      spellcheck: true,
      onChange: jest.fn().mockReturnValue('onChange'),
      onCopy: jest.fn().mockReturnValue('onCopy'),
      onCut: jest.fn().mockReturnValue('onCut'),
      onEnterKey: jest.fn().mockReturnValue('onEnterKey'),
      onFocusIn: jest.fn().mockReturnValue('onFocusIn'),
      onFocusOut: jest.fn().mockReturnValue('onFocusOut'),
      onInput: jest.fn().mockReturnValue('onInput'),
      onKeyDown: jest.fn().mockReturnValue('onKeyDown'),
      onKeyUp: jest.fn().mockReturnValue('onKeyUp'),
      onPaste: jest.fn().mockReturnValue('onPaste'),
      onDisposing: jest.fn().mockReturnValue('onDisposing'),
      onInitialized: jest.fn().mockReturnValue('onInitialized'),
      rtlEnabled: true,
      stylingMode: 'underlined',
      tabIndex: 1,
      width: '100px',
    });
    component.apiColumnOption('myColumn', 'ai.prompt', 'My test prompt');

    const textEditorInstance = component.getAIPromptEditor().getTextArea().getInstance();
    expect(textEditorInstance.option('height')).toBe(200);
    expect(textEditorInstance.option('placeholder')).toBe('Custom placeholder');
    expect(textEditorInstance.option('value')).toBe('My test prompt');
    expect(textEditorInstance.option('accessKey')).toBe('h');
    expect(textEditorInstance.option('activeStateEnabled')).toBe(true);
    expect(textEditorInstance.option('hint')).toBe('Custom Hint');
    expect(textEditorInstance.option('label')).toBe('Custom Label');
    expect(textEditorInstance.option('labelMode')).toBe('floating');
    expect(textEditorInstance.option('maxLength')).toBe(500);
    expect(textEditorInstance.option('readOnly')).toBe(false);
    expect(textEditorInstance.option('spellcheck')).toBe(true);
    expect((textEditorInstance.option('onChange') as any)()).toEqual('onChange');
    expect((textEditorInstance.option('onCopy') as any)()).toEqual('onCopy');
    expect((textEditorInstance.option('onCut') as any)()).toEqual('onCut');
    expect((textEditorInstance.option('onEnterKey') as any)()).toEqual('onEnterKey');
    expect((textEditorInstance.option('onFocusIn') as any)()).toEqual('onFocusIn');
    expect((textEditorInstance.option('onFocusOut') as any)()).toEqual('onFocusOut');
    expect((textEditorInstance.option('onInput') as any)()).toEqual('onInput');
    expect((textEditorInstance.option('onKeyDown') as any)()).toEqual('onKeyDown');
    expect((textEditorInstance.option('onKeyUp') as any)()).toEqual('onKeyUp');
    expect((textEditorInstance.option('onPaste') as any)()).toEqual('onPaste');
    expect((textEditorInstance.option('onDisposing') as any)()).toEqual('onDisposing');
    expect((textEditorInstance.option('onInitialized') as any)()).toEqual('onInitialized');
    expect(textEditorInstance.option('rtlEnabled')).toBe(true);
    expect(textEditorInstance.option('stylingMode')).toBe('underlined');
    expect(textEditorInstance.option('tabIndex')).toBe(1);
    expect(textEditorInstance.option('width')).toBe('100px');
  });

  it('should pass ai.prompt to the editor value', async () => {
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
          ai: {
            popup: {
              visible: true,
            },
            prompt: 'Initial prompt',
          },
        },
      ],
    });

    let textEditorInstance = component.getAIPromptEditor().getTextArea().getInstance();
    expect(textEditorInstance.option('value')).toBe('Initial prompt');

    component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');

    textEditorInstance = component.getAIPromptEditor().getTextArea().getInstance();
    expect(textEditorInstance.option('value')).toBe('Updated prompt');
  });
});

describe('DropDownButton', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when prompt isn\'t set', () => {
    it('\'Regenerate\' and \'Clear Data\' should be disabled', async () => {
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
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(true);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(true);
    });
  });

  describe('when prompt is set', () => {
    it('\'Regenerate\' and \'Clear Data\' should be enabled', async () => {
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
            ai: {
              prompt: 'Initial prompt',
            },
          },
        ],
      });
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(false);
    });
  });

  describe('when prompt is updated via apiColumnOption', () => {
    it('\'Regenerate\' and \'Clear Data\' should be enabled', async () => {
      const { component, instance } = await createDataGrid({
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
      let dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(true);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(true);

      instance.columnOption('myColumn', 'ai.prompt', 'Updated prompt');

      dropDownButton = component.getAIHeaderCell(3).getDropDownButton();
      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(false);
    });
  });

  describe('when prompt is updated via AIPromptEditor', () => {
    it('\'Regenerate\' and \'Clear Data\' should be enabled', async () => {
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
      let dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(true);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(true);

      dropDownButton.getList()?.getItem(0)?.getElement()?.click(); // show AIPromptEditor

      const aiPromptEditor = component.getAIPromptEditor();

      expect(aiPromptEditor.isVisible()).toBe(true);

      aiPromptEditor.getTextArea().setValue('Updated prompt');
      aiPromptEditor.getApplyButton().getElement().click();

      dropDownButton = component.getAIHeaderCell(3).getDropDownButton();
      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);
      expect(dropDownButton.getList().getItem(0).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(1).isDisabled).toBe(false);
      expect(dropDownButton.getList().getItem(2).isDisabled).toBe(false);
    });
  });

  describe('when click the \'Autofill with AI\' button', () => {
    it('AIPromptEditor should appear', async () => {
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
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton?.isOpened()).toBe(true);

      dropDownButton?.getList()?.getItem(0)?.getElement()?.click();

      expect(component.getAIPromptEditor().isVisible()).toBe(true);
    });
  });

  describe('when click the \'Regenerate\' button', () => {
    it('request should be sent', async () => {
      const sendRequestSpy = jest.fn();
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
            ai: {
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  sendRequestSpy();

                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('123');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);

      sendRequestSpy.mockClear();
      dropDownButton.getList()?.getItem(1)?.getElement()?.click();

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when click the \'Clear Data\' button', () => {
    it('prompt should reset', async () => {
      const { component, instance } = await createDataGrid({
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
            ai: {
              prompt: 'Initial prompt',
            },
          },
        ],
      });
      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);

      dropDownButton.getList()?.getItem(2)?.getElement()?.click();

      expect(instance.columnOption('myColumn', 'ai.prompt')).toBe('');
    });

    it('should clear cached data', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { component, instance } = await createDataGrid({
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
              prompt: 'Initial prompt',
              aiIntegration,
            },
          },
        ],
      });

      jest.runAllTimers();
      await Promise.resolve();
      expect(instance.getAIColumnText('myColumn', 1)).toBe('Response Name 1');

      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();
      dropDownButton?.getButtonElement()?.click();
      expect(dropDownButton.isOpened()).toBe(true);

      dropDownButton.getList()?.getItem(2)?.getElement()?.click();
      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
    });
  });
});

describe('Cache', () => {
  const sendRequestSpy = jest.fn();

  beforeEach(() => {
    beforeTest();
    sendRequestSpy.mockClear();
  });

  afterEach(afterTest);

  describe('when use public methods', () => {
    it('should not use cached data with sendAIColumnRequest', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy();

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });

              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
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
              aiIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(3);
    });

    it('should not use cached data with refreshAIColumn', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy();

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });

              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
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
              aiIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.refreshAIColumn('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);

      instance.refreshAIColumn('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);

      instance.refreshAIColumn('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('when update column options', () => {
    it('should clear cached data on ai.prompt change', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy();

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });

              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { component, instance } = await createDataGrid({
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
              aiIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myColumn', 1)).toEqual('Response Name 1');
      expect(instance.getAIColumnText('myColumn', 2)).toEqual('Response Name 2');

      component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
      expect(instance.getAIColumnText('myColumn', 2)).toBeUndefined();

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(instance.getAIColumnText('myColumn', 1)).toEqual('Response Name 1');
      expect(instance.getAIColumnText('myColumn', 2)).toEqual('Response Name 2');
    });

    it('should use cache with pagination in auto mode', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy(prompt.data?.data);

          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        keyExpr: 'id',
        paging: {
          pageSize: 1,
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
              aiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
      });

      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith({ 1: { id: 1, name: 'Name 1', value: 10 } });

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenCalledWith({ 2: { id: 2, name: 'Name 2', value: 20 } });

      instance.option('paging.pageIndex', 0);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
    });

    it('should use cache with filtering in auto mode', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy(prompt.data?.data);
          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });
              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
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
              aiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
        filterValue: ['id', '=', 1],
      });

      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith({ 1: { id: 1, name: 'Name 1', value: 10 } });

      instance.option('filterValue', undefined);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenCalledWith({ 2: { id: 2, name: 'Name 2', value: 20 } });
    });
  });

  describe('common behavior', () => {
    it('should not cache empty responses', async () => {
      const aiIntegrationResult = (prompt): RequestResult => ({
        promise: new Promise<string>((resolve) => {
          const result = {};
          Object.entries(prompt.data?.data).forEach(([key]) => {
            result[key] = '';
          });

          resolve(JSON.stringify(result));
        }),
        abort: (): void => {},
      });
      const columnAIIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          sendRequestSpy();
          return aiIntegrationResult(prompt);
        },
      });
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
              aiIntegration: columnAIIntegration,
              mode: 'manual',
              prompt: 'Test prompt',
            },
          },
        ],
      });

      expect(instance.getAIColumnText('myColumn', 1)).toBeUndefined();
      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myColumn', 1)).toBe('');

      instance.sendAIColumnRequest('myColumn');
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(instance.getAIColumnText('myColumn', 1)).toBe('');
    });
  });

  describe('when data is updated', () => {
    it('should clear cached data and send a prompt request', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt: RequestParams): RequestResult {
          sendRequestSpy(prompt.data?.data);

          return {
            promise: new Promise((resolve) => {
              resolve(`{"1":"Response with value=${prompt.data?.data[1].value}"}`);
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
            ai: {
              aiIntegration,
              prompt: 'Initial prompt',
            },
          },
        ],
      });

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=10');

      instance.cellValue(0, 'value', 20);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.saveEditData(); // This method returns a non-native Promise
      jest.runAllTimers();
      await Promise.resolve();

      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenLastCalledWith({ 1: { id: 1, name: 'Name 1', value: 20 } });
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=20');
    });
  });

  describe('when data is removed', () => {
    it('should clear cached data without sending a new prompt request', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt: RequestParams): RequestResult {
          sendRequestSpy(prompt.data?.data);

          return {
            promise: new Promise((resolve) => {
              resolve(`{"1":"Response with value=${prompt.data?.data[1].value}"}`);
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
            ai: {
              aiIntegration,
              prompt: 'Initial prompt',
            },
          },
        ],
      });

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=10');

      instance.deleteRow(0);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.saveEditData(); // This method returns a non-native Promise
      jest.runAllTimers();
      await Promise.resolve();

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual(undefined);
    });
  });

  describe('when data is added', () => {
    it('should send a prompt request', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt: RequestParams): RequestResult {
          sendRequestSpy(prompt.data?.data);

          return {
            promise: new Promise((resolve) => {
              const result = {};

              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response with value=${(value as any).value}`;
              });

              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
            ai: {
              aiIntegration,
              prompt: 'Initial prompt',
            },
          },
        ],
      });

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=10');

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.addRow(); // This method returns a non-native Promise
      jest.runAllTimers();
      await Promise.resolve();

      instance.cellValue(0, 'value', 20);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.saveEditData(); // This method returns a non-native Promise
      jest.runAllTimers();
      await Promise.resolve();

      const visibleRows = instance.getVisibleRows();
      expect(visibleRows[0].key).toEqual(1); // existing row
      expect(visibleRows[1].key).toBeDefined(); // new row
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenLastCalledWith({
        [visibleRows[1].key]: { id: visibleRows[1].key, value: 20 },
      });
      expect(instance.getAIColumnText('myAIColumn', visibleRows[1].key)).toEqual('Response with value=20');
    });
  });

  describe('when data is updated via Push API', () => {
    it('should clear cached data and send a prompt request', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt: RequestParams): RequestResult {
          sendRequestSpy(prompt.data?.data);

          return {
            promise: new Promise((resolve) => {
              resolve(`{"1":"Response with value=${prompt.data?.data[1].value}"}`);
            }),
            abort: (): void => {},
          };
        },
      });
      const { instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
        ],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
            ai: {
              aiIntegration,
              prompt: 'Initial prompt',
            },
          },
        ],
      });

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=10');

      instance.getDataSource().store().push([{
        type: 'update',
        key: 1,
        data: { value: 20 },
      }]);
      jest.runAllTimers();
      await Promise.resolve();

      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenLastCalledWith({ 1: { id: 1, name: 'Name 1', value: 20 } });
      expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=20');
    });
  });
});

describe('AI data', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const store = new ArrayStore(items);
  const loadMock = jest.fn((
    loadOptions: LoadOptions,
  ): Promise<any[]> => new Promise((resolve, reject) => {
    setTimeout(() => {
      store.load(loadOptions).done(resolve).fail(reject);
    }, 300);
  }));
  const totalCountMock = jest.fn((): Promise<number> => new Promise((resolve, reject) => {
    store.totalCount().done(resolve).fail(reject);
  }));

  const remoteDataSource = new DataSource({
    key: 'id',
    load: loadMock,
    totalCount: totalCountMock,
  });
  const compareCellNodes = (
    prevCells: (HTMLElement | null)[],
    currentCells: (HTMLElement | null)[],
  ): void => {
    prevCells.forEach((cell: HTMLElement | null, index: number) => {
      const currentCell = currentCells[index];

      if (cell === null || currentCell === null) {
        throw new Error('Cell is null');
      }

      if (cell.classList.contains(CLASSES.aiColumn)) {
        expect(cell).not.toBe(currentCell);
      } else {
        expect(cell).toBe(currentCell);
      }
    });
  };

  describe('when prompt is set', () => {
    it('should be rendered', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe('AI Response 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Response 2');
    });
  });

  describe('when prompt is set via column option', () => {
    it('should be rendered', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      component.apiColumnOption('myColumn', 'ai.prompt', 'Initial prompt');
      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('AI Response 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Response 2');
    });
  });

  describe('when prompt is set via AI prompt editor', () => {
    it('should be rendered', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              popup: {
                visible: true,
              },
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      component.getAIPromptEditor().getTextArea().setValue('Initial prompt');
      component.getAIPromptEditor().getApplyButton().getElement().click();

      await Promise.resolve();

      expect(component.getDataCell(0, 3).getText()).toBe('AI Response 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Response 2');
    });
  });

  describe('when prompt is set when there are multiple AI columns', () => {
    it('should be rendered in the correct column', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column 1',
            name: 'myColumn1',
            ai: {
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Column 1 - AI Response 1","2":"AI Column 1 - AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
          {
            type: 'ai',
            caption: 'AI Column 2',
            name: 'myColumn2',
            ai: {
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Column 2 - AI Response 1","2":"AI Column 2 - AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      // check data cells of the first AI column
      expect(component.getDataCell(0, 3).getText()).toBe(EMPTY_CELL_TEXT);
      expect(component.getDataCell(1, 3).getText()).toBe(EMPTY_CELL_TEXT);

      // check data cells of the second AI column
      expect(component.getDataCell(0, 4).getText()).toBe('AI Column 2 - AI Response 1');
      expect(component.getDataCell(1, 4).getText()).toBe('AI Column 2 - AI Response 2');
    });
  });

  describe('when refresh is called', () => {
    it('should be re-rendered', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      jest.useRealTimers();

      const aiCells = [
        component.getDataCell(0, 3).getElement(),
        component.getDataCell(1, 3).getElement(),
      ];

      await component.apiRefresh();

      compareCellNodes(
        aiCells,
        [
          component.getDataCell(0, 3).getElement(),
          component.getDataCell(1, 3).getElement(),
        ],
      );
    });
  });

  describe('when remoteOperations is enabled and refresh is called', () => {
    it('should be re-rendered', async () => {
      const { component } = await createDataGrid({
        dataSource: remoteDataSource,
        remoteOperations: true,
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myColumn',
            ai: {
              prompt: 'Initial prompt',
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      jest.useRealTimers();

      const aiCells = [
        component.getDataCell(0, 3).getElement(),
        component.getDataCell(1, 3).getElement(),
      ];

      expect(loadMock).toHaveBeenCalledTimes(1);

      await component.apiRefresh();

      expect(loadMock).toHaveBeenCalledTimes(2);
      compareCellNodes(
        aiCells,
        [
          component.getDataCell(0, 3).getElement(),
          component.getDataCell(1, 3).getElement(),
        ],
      );
    });
  });
});

describe('Load panel', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when requesting an API service', () => {
    it('should be displayed', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.runAllTimers(); // wait for request
      await Promise.resolve(); // wait for DataGrid to process the response
      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when an error occurs while requesting the AI service', () => {
    it('should be hidden', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve, reject) => {
                      setTimeout(() => {
                        reject(new Error('AI service error'));
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.runAllTimers(); // wait for request
      await Promise.resolve(); // wait for DataGrid to process the error
      await Promise.resolve(); // wait for DataGrid to process the error
      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when the request was aborted', () => {
    it('should be hidden', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      component.apiAbortAIColumnRequest('myColumn');

      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when there are several requests and one of them is aborted', () => {
    it('should be displayed', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column 1',
            name: 'myColumn1',
            ai: {
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
          {
            type: 'ai',
            caption: 'AI Column 2',
            name: 'myColumn2',
            ai: {
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 3","2":"AI Response 4"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn1', 'ai.prompt', 'Updated prompt 1');
      component.apiColumnOption('myColumn2', 'ai.prompt', 'Updated prompt 2');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      component.apiAbortAIColumnRequest('myColumn1');

      jest.runAllTimers();

      expect(component.getLoadPanel().isVisible()).toBe(true);

      await Promise.resolve(); // wait for DataGrid to process the response
      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when AI columns resolve at different times', () => {
    const createAIIntegration = (
      delay: number,
      response: string,
    ): AIIntegration => new AIIntegration({
      sendRequest(): RequestResult {
        return {
          promise: new Promise<string>((resolve) => {
            setTimeout(() => {
              resolve(response);
            }, delay);
          }),
          abort: (): void => {},
        };
      },
    });

    it('should remain visible until all responses are received', async () => {
      const firstRequestDelay = 100;
      const secondRequestDelay = 300;

      const { component, instance } = await createDataGrid({
        dataSource: items,
        keyExpr: 'id',
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column 1',
            name: 'myColumn1',
            ai: {
              aiIntegration: createAIIntegration(firstRequestDelay, '{"1":"AI Response 1","2":"AI Response 2"}'),
            },
          },
          {
            type: 'ai',
            caption: 'AI Column 2',
            name: 'myColumn2',
            ai: {
              aiIntegration: createAIIntegration(secondRequestDelay, '{"1":"AI Response 3","2":"AI Response 4"}'),
            },
          },
        ],
      });

      const dataController = (instance as any).getController('data');
      const endCustomLoadingSpy = jest.spyOn(dataController, 'endCustomLoading');

      component.apiColumnOption('myColumn1', 'ai.prompt', 'Updated prompt 1');
      component.apiColumnOption('myColumn2', 'ai.prompt', 'Updated prompt 2');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.advanceTimersByTime(firstRequestDelay);
      await Promise.resolve();

      expect(endCustomLoadingSpy).not.toHaveBeenCalled();
      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.advanceTimersByTime(secondRequestDelay - firstRequestDelay);
      await Promise.resolve();

      expect(endCustomLoadingSpy).toHaveBeenCalledTimes(1);
      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.runAllTimers();

      expect(endCustomLoadingSpy).toHaveBeenCalledTimes(1);
      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when paging changes during AI loading', () => {
    const createDelayedAIIntegration = (
      prefix: string,
      delay: number,
    ): AIIntegration => new AIIntegration({
      sendRequest(prompt: RequestParams): RequestResult {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const promise = new Promise<string>((resolve) => {
          const result: Record<string, string> = {};

          Object.entries(prompt.data?.data ?? {}).forEach(([key, value]) => {
            result[key] = `${prefix} ${(value as any).name}`;
          });

          timeoutId = setTimeout(() => {
            resolve(JSON.stringify(result));
          }, delay);
        });

        return {
          promise,
          abort: (): void => {
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
            }
          },
        };
      },
    });

    it('should hide loader after requests are canceled', async () => {
      const firstRequestDelay = 100;
      const secondRequestDelay = 200;
      const dataSource = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: `Name ${index + 1}`,
        value: index + 1,
      }));

      const { component, instance } = await createDataGrid({
        dataSource,
        paging: {
          pageSize: 10,
        },
        columns: [
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
          {
            type: 'ai',
            caption: 'AI Column 1',
            name: 'myColumn1',
            ai: {
              aiIntegration: createDelayedAIIntegration('AI Column 1', firstRequestDelay),
            },
          },
          {
            type: 'ai',
            caption: 'AI Column 2',
            name: 'myColumn2',
            ai: {
              aiIntegration: createDelayedAIIntegration('AI Column 2', secondRequestDelay),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn1', 'ai.prompt', 'Prompt 1');
      component.apiColumnOption('myColumn2', 'ai.prompt', 'Prompt 2');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      jest.advanceTimersByTime(secondRequestDelay);
      await Promise.resolve();
      jest.runAllTimers();

      expect(component.getLoadPanel().isVisible()).toBe(false);
      expect(instance.getAIColumnText('myColumn1', 1)).toContain('AI Column 1');
      expect(instance.getAIColumnText('myColumn2', 1)).toContain('AI Column 2');

      instance.option('paging.pageIndex', 1);
      await Promise.resolve();

      expect(component.getLoadPanel().isVisible()).toBe(true);

      instance.option('paging.pageIndex', 0);
      await Promise.resolve();

      jest.runAllTimers();
      await Promise.resolve();

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when a request is made using AIPromptEditor', () => {
    it('should be hidden', async () => {
      const { component } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      const dropDownButton = component.getAIHeaderCell(3).getDropDownButton();

      dropDownButton?.getButtonElement()?.click();

      expect(dropDownButton.isOpened()).toBe(true);

      dropDownButton.getList()?.getItem(0)?.getElement()?.click(); // show AIPromptEditor

      const aiPromptEditor = component.getAIPromptEditor();

      expect(aiPromptEditor.isVisible()).toBe(true);

      aiPromptEditor.getTextArea().setValue('Updated prompt');
      aiPromptEditor.getApplyButton().getElement().click();

      jest.runAllTimers(); // wait for request

      expect(component.getLoadPanel().isVisible()).toBe(false);
      expect(aiPromptEditor.getProgressBar().isVisible()).toBe(true);

      await Promise.resolve(); // wait for DataGrid to process the response
      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
      expect(aiPromptEditor.getProgressBar().isVisible()).toBe(false);
    });
  });

  describe('when AI column is cleared during request', () => {
    it('should be hidden', async () => {
      const { component, instance } = await createDataGrid({
        dataSource: items,
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
              aiIntegration: new AIIntegration({
                sendRequest(): RequestResult {
                  return {
                    promise: new Promise<string>((resolve) => {
                      setTimeout(() => {
                        resolve('{"1":"AI Response 1","2":"AI Response 2"}');
                      }, 300);
                    }),
                    abort: (): void => {},
                  };
                },
              }),
            },
          },
        ],
      });

      component.apiColumnOption('myColumn', 'ai.prompt', 'Updated prompt');

      expect(component.getLoadPanel().isVisible()).toBe(true);

      instance.clearAIColumn('myColumn');

      jest.runAllTimers(); // wait hidden load panel

      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });

  describe('when AI Column response is cached', () => {
    it('should be hidden', async () => {
      const aiIntegration = new AIIntegration({
        sendRequest(prompt): RequestResult {
          return {
            promise: new Promise<string>((resolve) => {
              const result = {};
              Object.entries(prompt.data?.data).forEach(([key, value]) => {
                result[key] = `Response ${(value as any).name}`;
              });

              resolve(JSON.stringify(result));
            }),
            abort: (): void => {},
          };
        },
      });
      const { component, instance } = await createDataGrid({
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
        ],
        paging: {
          pageSize: 1,
        },
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
              aiIntegration,
              prompt: 'Test prompt',
            },
          },
        ],
      });

      expect(instance.getAIColumnText('myColumn', 1)).toEqual('Response Name 1');

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();

      expect(component.getLoadPanel().isVisible()).toBe(true);

      await Promise.resolve();

      expect(instance.getAIColumnText('myColumn', 2)).toEqual('Response Name 2');

      instance.option('paging.pageIndex', 0);
      jest.runAllTimers();

      expect(component.getLoadPanel().isVisible()).toBe(false);

      await Promise.resolve();

      expect(instance.getAIColumnText('myColumn', 1)).toEqual('Response Name 1');
      expect(component.getLoadPanel().isVisible()).toBe(false);
    });
  });
});
