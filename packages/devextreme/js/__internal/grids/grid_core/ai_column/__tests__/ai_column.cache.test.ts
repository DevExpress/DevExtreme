import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import {
  afterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
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

    it.each([
      {
        keyType: 'single key',
        keyExpr: 'id1',
        firstRequest: { 1: { id1: 1, id2: 'a', name: 'Name 1' } },
        secondRequest: { 2: { id1: 2, id2: 'b', name: 'Name 2' } },
      },
      {
        keyType: 'compound key',
        keyExpr: ['id1', 'id2'],
        firstRequest: { '{"id1":1,"id2":"a"}': { id1: 1, id2: 'a', name: 'Name 1' } },
        secondRequest: { '{"id1":2,"id2":"b"}': { id1: 2, id2: 'b', name: 'Name 2' } },
      },
    ])('should use cache with pagination in auto mode ($keyType)', async ({
      keyExpr, firstRequest, secondRequest,
    }) => {
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
          { id1: 1, id2: 'a', name: 'Name 1' },
          { id1: 2, id2: 'b', name: 'Name 2' },
        ],
        keyExpr,
        paging: {
          pageSize: 1,
        },
        columns: [
          { dataField: 'id1', caption: 'ID' },
          { dataField: 'id2', caption: 'ID2' },
          { dataField: 'name', caption: 'Name' },
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
      expect(sendRequestSpy).toHaveBeenCalledWith(firstRequest);

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenCalledWith(secondRequest);

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

  describe('when a handler replaces the data array', () => {
    it('should look up the cache using the reassigned e.data, not the original page data', async () => {
      let replaceData = false;
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
        onAIColumnRequestCreating: (e) => {
          if (replaceData) {
            // Handlers may replace e.data with a brand-new array, not only mutate it.
            e.data = [
              { id: 1, name: 'Name 1', value: 10 },
              { id: 2, name: 'Name 2', value: 20 },
            ];
          }
        },
      });

      // Each page populates the cache for its single visible row.
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);

      instance.option('paging.pageIndex', 1);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);

      // The page now shows a single row, but the handler replaces e.data with the
      // full dataset whose keys are all cached. The lookup must key off e.data, so
      // no new request is sent.
      replaceData = true;
      instance.option('paging.pageIndex', 0);
      jest.runAllTimers();
      await Promise.resolve();
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
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

  describe('when a row is updated via Push API', () => {
    it.each([
      {
        keyType: 'single key',
        keyExpr: 'id1',
        row1Key: 1,
        row2Key: 2,
        expectedRequestKey: 1,
      },
      {
        keyType: 'compound key',
        keyExpr: ['id1', 'id2'],
        row1Key: { id1: 1, id2: 'a' },
        row2Key: { id1: 2, id2: 'b' },
        expectedRequestKey: '{"id1":1,"id2":"a"}',
      },
    ])('should clear cached data for the pushed row only and send a prompt request ($keyType)', async ({
      keyExpr, row1Key, row2Key, expectedRequestKey,
    }) => {
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
          { id1: 1, id2: 'a', value: 10 },
          { id1: 2, id2: 'b', value: 20 },
        ],
        keyExpr,
        columns: [
          { dataField: 'id1' },
          { dataField: 'id2' },
          { dataField: 'value' },
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
      expect(instance.getAIColumnText('myAIColumn', row1Key)).toEqual('Response with value=10');
      expect(instance.getAIColumnText('myAIColumn', row2Key)).toEqual('Response with value=20');

      instance.getDataSource().store().push([{
        type: 'update',
        key: row1Key,
        data: { value: 30 },
      }]);
      jest.runAllTimers();
      await Promise.resolve();

      // only the pushed row is re-requested; the other row stays cached
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenLastCalledWith({
        [expectedRequestKey]: { id1: 1, id2: 'a', value: 30 },
      });
      expect(instance.getAIColumnText('myAIColumn', row1Key)).toEqual('Response with value=30');
      expect(instance.getAIColumnText('myAIColumn', row2Key)).toEqual('Response with value=20');
    });
  });
});
