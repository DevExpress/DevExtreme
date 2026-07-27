import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse } from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import {
  afterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
  GRID_CONTAINER_ID,
} from '../../__tests__/__mock__/helpers/utils';

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

const beforeTest = (): void => {
  baseBeforeTest();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
};
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

    it('should throw E1046 and not send the request when the handler removes the key field', async () => {
      const onDataErrorOccurred = jest.fn();
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
          const reduced = e.data.map((item) => ({ name: item.name, value: item.value }));
          e.data.splice(0, e.data.length, ...reduced);
        },
        onDataErrorOccurred,
      });

      instance.sendAIColumnRequest('myColumn');
      jest.advanceTimersByTime(10000);

      expect(columnSendRequestStarted).toHaveBeenCalledTimes(0);
      expect(onDataErrorOccurred).toHaveBeenCalledTimes(1);
      expect(errors.Error).toHaveBeenCalledWith('E1046', 'id');
    });
  });
});
