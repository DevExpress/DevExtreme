import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import type { LoadOptions } from '@js/data';
import DataSource from '@js/data/data_source';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import ArrayStore from '@ts/data/array_store';

import {
  afterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
  flushAsync,
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

  describe('when the key is compound', () => {
    it('should render each row\'s own AI value', async () => {
      let sentKeys: string[] = [];
      const aiIntegration = new AIIntegration({
        sendRequest(params: RequestParams): RequestResult {
          const dataset = params.data?.data as Record<string, { name: string }>;
          sentKeys = Object.keys(dataset);
          const result: Record<string, string> = {};
          Object.entries(dataset).forEach(([key, value]) => {
            result[key] = `AI ${value.name}`;
          });
          return {
            promise: Promise.resolve(JSON.stringify(result)),
            abort: (): void => {},
          };
        },
      });

      const { component } = await createDataGrid({
        keyExpr: ['id1', 'id2'],
        dataSource: [
          { id1: 1, id2: 'a', name: 'Name 1' },
          { id1: 1, id2: 'b', name: 'Name 2' },
        ],
        columns: [
          { dataField: 'id1' },
          { dataField: 'id2' },
          { dataField: 'name' },
          {
            type: 'ai',
            name: 'aiColumn',
            caption: 'AI Column',
            ai: { aiIntegration, prompt: 'Test prompt' },
          },
        ],
      });

      await flushAsync();

      expect(sentKeys).toHaveLength(2);
      expect(component.getDataCell(0, 3).getText()).toBe('AI Name 1');
      expect(component.getDataCell(1, 3).getText()).toBe('AI Name 2');
    });
  });
});
