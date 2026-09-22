import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import CustomStore from '@js/data/custom_store';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { ERROR_MESSAGE_CLASS, ERROR_ROW_CLASS } from '../const';

const ERROR_ROW_SELECTOR = `.${ERROR_ROW_CLASS}`;
const ERROR_MESSAGE_SELECTOR = `.${ERROR_MESSAGE_CLASS}`;

const DATA = [
  { id: 1, name: 'test1' },
  { id: 2, name: 'test2' },
];

const LOAD_ERROR_TEXT = 'Load error';

interface FailingStore {
  store: CustomStore;
  failNextLoad: (shouldFail: boolean) => void;
}

const createFailingStore = (): FailingStore => {
  let shouldFail = false;

  const store = new CustomStore({
    key: 'id',
    load: () => (shouldFail
      ? Promise.reject(new Error(LOAD_ERROR_TEXT))
      : Promise.resolve([...DATA])),
  });

  return {
    store,
    failNextLoad: (value: boolean): void => {
      shouldFail = value;
    },
  };
};

const reload = async (instance: DataGridInstance): Promise<void> => {
  instance.refresh().catch(() => {});
  await flushAsync();
};

describe('DataGrid error handling', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('error row rendering on a data error', () => {
    it('should render an error row when a load fails', async () => {
      const { store, failNextLoad } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
      });
      await flushAsync();

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(0);

      failNextLoad(true);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);
      expect($container.find(ERROR_MESSAGE_SELECTOR).text()).toContain(LOAD_ERROR_TEXT);
    });

    it('should not render an error row when errorRowEnabled is false, but still raise onDataErrorOccurred', async () => {
      const onDataErrorOccurred = jest.fn();
      const { store, failNextLoad } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
        errorRowEnabled: false,
        onDataErrorOccurred,
      });
      await flushAsync();

      failNextLoad(true);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(0);
      expect(onDataErrorOccurred).toHaveBeenCalledTimes(1);
    });

    it('should render the error message into $popupContent instead of a grid row', async () => {
      const { store } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
      });
      await flushAsync();

      const $popupContent: dxElementWrapper = $('<div>');

      instance.getController('data').dataErrorOccurred.fire('Test error', $popupContent);

      expect($popupContent.find(ERROR_MESSAGE_SELECTOR).text()).toBe('Test error');
      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(0);
    });
  });

  describe('subscriber ordering on dataErrorOccurred', () => {
    it('should raise onDataErrorOccurred before the error row is rendered', async () => {
      let errorRowCountInsideHandler = -1;
      const { store, failNextLoad } = createFailingStore();

      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
        onDataErrorOccurred: () => {
          errorRowCountInsideHandler = $container.find(ERROR_ROW_SELECTOR).length;
        },
      });
      await flushAsync();

      failNextLoad(true);
      await reload(instance);

      expect(errorRowCountInsideHandler).toBe(0);
      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);
    });

    it('should suppress the error row when onDataErrorOccurred returns false', async () => {
      const onDataErrorOccurred = jest.fn(() => false);
      const { store, failNextLoad } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
        // The dataErrorOccurred callback is created with stopOnFalse, so a
        // handler returning false suppresses the subscribers after it.
        onDataErrorOccurred: onDataErrorOccurred as unknown as () => void,
      });
      await flushAsync();

      failNextLoad(true);
      await reload(instance);

      expect(onDataErrorOccurred).toHaveBeenCalledTimes(1);
      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(0);
    });
  });

  describe('error row from a failed row validation', () => {
    it('should render an error row under the row when onRowValidating rejects the change', async () => {
      const { $container, instance } = await createDataGrid({
        dataSource: [...DATA],
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        onRowValidating: (e) => {
          e.isValid = false;
          e.errorText = 'Row is invalid';
        },
      });
      await flushAsync();

      instance.cellValue(0, 'name', 'changed');
      await flushAsync();

      instance.saveEditData().catch(() => {});
      await flushAsync();

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);
      expect($container.find(ERROR_MESSAGE_SELECTOR).text()).toContain('Row is invalid');
    });
  });

  describe('error row removal on a data change', () => {
    it('should remove the error row after a successful load', async () => {
      const { store, failNextLoad } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
      });
      await flushAsync();

      failNextLoad(true);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);

      failNextLoad(false);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(0);
    });

    it('should keep the error row while editing has pending changes', async () => {
      const { store, failNextLoad } = createFailingStore();
      const { $container, instance } = await createDataGrid({
        dataSource: store,
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });
      await flushAsync();

      failNextLoad(true);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);

      jest.spyOn(instance.getController('editing'), 'hasChanges').mockReturnValue(true);

      failNextLoad(false);
      await reload(instance);

      expect($container.find(ERROR_ROW_SELECTOR).length).toBe(1);
    });
  });
});
