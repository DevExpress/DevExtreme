import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { GenerateGridColumnCommandResponse, RequestParams } from '@js/common/ai-integration';
import type { dxElementWrapper } from '@js/core/renderer';
import ArrayStore from '@js/data/array_store';
import DataSource from '@js/data/data_source';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import type { DataGridModel } from '../../../data_grid/__tests__/__mock__/model/data_grid';
import {
  afterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
  type DataGridInstance,
} from '../../__tests__/__mock__/helpers/utils';

interface RequestResult {
  promise: Promise<GenerateGridColumnCommandResponse>;
  abort: () => void;
}

const AI_COLUMN_INDEX = 2;

const initialItems = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
];

const nextItems = [
  { id: 2, value: 20 },
  { id: 3, value: 30 },
];

const beforeTest = (): void => {
  baseBeforeTest();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
  jest.spyOn(errors, 'Error').mockImplementation(() => ({}));
};

const getAdapter = (instance: DataGridInstance): { changed: unknown } => instance
  .getController('dataSource')
  .getAdapter() as unknown as { changed: unknown };

const hasAnyHandler = (callback: unknown): boolean => (
  callback as { has: (fn?: unknown) => boolean }
).has();

describe('Data source replacement', () => {
  const sendRequestSpy = jest.fn();

  const createAIIntegration = (): AIIntegration => new AIIntegration({
    sendRequest(prompt: RequestParams): RequestResult {
      sendRequestSpy(prompt.data?.data);

      return {
        promise: new Promise((resolve) => {
          const result = {};
          Object.entries(prompt.data?.data).forEach(([key, value]) => {
            result[key] = `Response with value=${(value as { value: number }).value}`;
          });
          resolve(JSON.stringify(result));
        }),
        abort: (): void => {},
      };
    },
  });

  const createGridWithAIColumn = async (
    options: DataGridProperties = {},
  ): Promise<{
    $container: dxElementWrapper;
    instance: DataGridInstance;
    component: DataGridModel;
  }> => {
    const { $container, instance, component } = await createDataGrid({
      ...options,
      dataSource: initialItems,
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAIColumn',
          ai: {
            aiIntegration: createAIIntegration(),
            prompt: 'Initial prompt',
          },
        },
      ],
    });

    return { $container, instance, component };
  };

  const replaceDataSource = async (instance: DataGridInstance): Promise<void> => {
    instance.option(
      'dataSource',
      new DataSource({ store: new ArrayStore({ data: nextItems, key: 'id' }) }),
    );
    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();
    await Promise.resolve();
  };

  beforeEach(() => {
    beforeTest();
    sendRequestSpy.mockClear();
  });

  afterEach(afterTest);

  it('should send a request for the rows of the new data source', async () => {
    const { instance, component } = await createGridWithAIColumn();

    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(instance.getAIColumnText('myAIColumn', 1)).toEqual('Response with value=10');

    await replaceDataSource(instance);

    expect(sendRequestSpy).toHaveBeenCalledTimes(2);
    expect(instance.getAIColumnText('myAIColumn', 3)).toEqual('Response with value=30');
    expect(component.getDataCell(1, AI_COLUMN_INDEX).getText()).toBe('Response with value=30');
  });

  it('should clear the cached text when a row is pushed through the new store', async () => {
    const { instance } = await createGridWithAIColumn();

    await replaceDataSource(instance);
    sendRequestSpy.mockClear();

    instance.getDataSource().store().push([{
      type: 'update',
      key: 3,
      data: { value: 300 },
    }]);
    jest.runAllTimers();
    await Promise.resolve();

    expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    expect(instance.getAIColumnText('myAIColumn', 3)).toEqual('Response with value=300');
  });

  it('should ignore a row pushed through the replaced store', async () => {
    const { instance } = await createGridWithAIColumn();
    const replacedStore = instance.getDataSource().store();

    await replaceDataSource(instance);
    sendRequestSpy.mockClear();

    // the row survives the replacement, so a stale handler is the only thing that can clear it
    expect(instance.getAIColumnText('myAIColumn', 2)).toEqual('Response with value=20');

    replacedStore.push([{
      type: 'update',
      key: 2,
      data: { value: 200 },
    }]);
    jest.runAllTimers();
    await Promise.resolve();

    expect(sendRequestSpy).not.toHaveBeenCalled();
    expect(instance.getAIColumnText('myAIColumn', 2)).toEqual('Response with value=20');
  });

  it('should report E1042 when the new store has no key', async () => {
    const onDataErrorOccurred = jest.fn();
    const { instance } = await createGridWithAIColumn({ onDataErrorOccurred });

    sendRequestSpy.mockClear();

    instance.option(
      'dataSource',
      new DataSource({ store: new ArrayStore({ data: nextItems }) }),
    );
    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();
    await Promise.resolve();

    expect(errors.Error).toHaveBeenCalledWith('E1042', 'AI Column');
    expect(sendRequestSpy).not.toHaveBeenCalled();
  });

  it('should leave no handler on the replaced adapter nor on the disposed one', async () => {
    const { $container, instance } = await createGridWithAIColumn();
    const replacedAdapter = getAdapter(instance);

    await replaceDataSource(instance);

    const currentAdapter = getAdapter(instance);

    expect(hasAnyHandler(replacedAdapter.changed)).toBe(false);

    instance.dispose();
    $container.remove();

    expect(hasAnyHandler(currentAdapter.changed)).toBe(false);
  });
});
