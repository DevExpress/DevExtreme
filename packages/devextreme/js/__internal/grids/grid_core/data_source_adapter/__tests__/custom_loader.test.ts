import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { logger } from '@ts/core/utils/m_console';
import CustomStore from '@ts/data/custom_store';
import { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';

import { CustomLoader } from '../custom_loader';
import type { LoadOperation } from '../types';

interface SetupOptions {
  storeLoad?: (loadOptions: StoreLoadOptions) => unknown;
  storeTotalCount?: (loadOptions: StoreLoadOptions) => unknown;
  /** Load option names the store declares as its own, as ODataStore does. */
  customLoadOptions?: string[];
  dataSourceOptions?: Record<string, unknown>;
  loadingTimeout?: number;
  customizeStoreLoadOptions?: (operation: LoadOperation) => void;
  customizeLoadResult?: (operation: LoadOperation) => void;
}

const setup = ({
  storeLoad = (): DeferredObj<unknown> => Deferred().resolve([]),
  storeTotalCount = (): number => 0,
  customLoadOptions = [],
  dataSourceOptions = {},
  loadingTimeout,
  customizeStoreLoadOptions = (): void => {},
  customizeLoadResult = (): void => {},
}: SetupOptions = {}) => {
  const load = jest.fn(storeLoad);
  const totalCount = jest.fn(storeTotalCount);
  const store = new CustomStore({ load, totalCount });

  if (customLoadOptions.length) {
    // Declared before the DataSource is built: it reads them to decide which
    // options to carry in `loadOptions()`.
    (store as unknown as { _customLoadOptions: () => string[] })
      ._customLoadOptions = (): string[] => customLoadOptions;
  }

  const dataSource = new DataSource({
    store,
    ...dataSourceOptions,
  });

  const getLoadingTimeout = jest.fn(() => loadingTimeout);
  const customizeStoreLoadOptionsSpy = jest.fn(customizeStoreLoadOptions);
  const customizeLoadResultSpy = jest.fn(customizeLoadResult);

  const customLoader = new CustomLoader(
    dataSource,
    getLoadingTimeout,
    customizeStoreLoadOptionsSpy,
    customizeLoadResultSpy,
  );

  return {
    customLoader,
    dataSource,
    store: { load, totalCount },
    getLoadingTimeout,
    customizeStoreLoadOptions: customizeStoreLoadOptionsSpy,
    customizeLoadResult: customizeLoadResultSpy,
  };
};

/** A rejected store load logs E4000 through the real store; keep it out of the test output. */
const silenceStoreErrorLog = (): void => {
  jest.spyOn(logger, 'error').mockImplementation(() => {});
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('load', () => {
  it('builds the store load options from the passed options and the dataSource langParams', () => {
    const langParams = { locale: 'en' };
    const { customLoader, customizeStoreLoadOptions } = setup({
      dataSourceOptions: { langParams },
    });

    customLoader.load({ skip: 10, take: 5 });

    const operation = customizeStoreLoadOptions.mock.calls[0][0];
    expect(operation.storeLoadOptions).toMatchObject({ skip: 10, take: 5, langParams });
    expect(operation.isCustomLoading).toBe(true);
  });

  it('drops load options the caller left undefined', () => {
    // Selection builds `filter`/`select` unconditionally, so the store must not
    // see them when there is nothing to send.
    const { customLoader, store } = setup();

    customLoader.load({ filter: ['id', '=', 1], select: undefined });

    expect(store.load).toHaveBeenCalledTimes(1);
    expect(store.load.mock.calls[0][0]).not.toHaveProperty('select');
  });

  it('fills the store custom load options from the dataSource, without overwriting', () => {
    const { customLoader, customizeStoreLoadOptions } = setup({
      customLoadOptions: ['fromDataSource', 'fromOptions'],
      dataSourceOptions: { fromDataSource: 'ds', fromOptions: 'ds' },
    });

    customLoader.load({ fromOptions: 'own' });

    const { storeLoadOptions } = customizeStoreLoadOptions.mock.calls[0][0];
    expect(storeLoadOptions.fromDataSource).toBe('ds');
    expect(storeLoadOptions.fromOptions).toBe('own');
  });

  it('customizes the store load options before loading and the result after', () => {
    const order: string[] = [];
    const { customLoader } = setup({
      storeLoad: () => { order.push('load'); return Deferred().resolve([]); },
      customizeStoreLoadOptions: () => { order.push('customizeStoreLoadOptions'); },
      customizeLoadResult: () => { order.push('customizeLoadResult'); },
    });

    customLoader.load({});

    expect(order).toEqual(['customizeStoreLoadOptions', 'load', 'customizeLoadResult']);
  });

  it('resolves with the loaded data and extra', () => {
    const data = [{ id: 1 }];
    const { customLoader } = setup({
      storeLoad: () => Deferred().resolve(data, { totalCount: 42 }),
    });
    const done = jest.fn();

    customLoader.load({}).done(done);

    expect(done).toHaveBeenCalledWith({ data, extra: { totalCount: 42 } });
  });

  it('skips the store when a customizeStoreLoadOptions handler supplies the data', () => {
    const data = [{ id: 1 }];
    const { customLoader, store } = setup({
      customizeStoreLoadOptions: (operation) => { operation.data = data; },
    });
    const done = jest.fn();

    customLoader.load({}).done(done);

    expect(store.load).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith({ data, extra: expect.anything() });
  });

  it('resolves with the data a customizeLoadResult handler put on the operation', () => {
    const transformed = [{ id: 'transformed' }];
    const { customLoader } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      customizeLoadResult: (operation) => { operation.data = transformed; },
    });
    const done = jest.fn();

    customLoader.load({}).done(done);

    expect(done).toHaveBeenCalledWith({ data: transformed, extra: expect.anything() });
  });

  it('rejects as canceled when the dataSource is disposed before the load runs', () => {
    let dispose = (): void => {};
    const { dataSource, customLoader, store } = setup({
      customizeStoreLoadOptions: () => { dispose(); },
    });
    const fail = jest.fn();

    dispose = (): void => dataSource.dispose();
    customLoader.load({}).fail(fail);

    expect(store.load).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalledWith('canceled');
  });

  it('asks the store for a total count when requireTotalCount is set and the store reported none', () => {
    const { customLoader, store } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      storeTotalCount: () => 17,
    });
    const done = jest.fn();

    customLoader.load({ requireTotalCount: true }).done(done);

    expect(store.totalCount).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith({ data: [{ id: 1 }], extra: { totalCount: 17 } });
  });

  it('keeps the total count the store already reported', () => {
    const { customLoader, store } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }], { totalCount: 3 }),
    });
    const done = jest.fn();

    customLoader.load({ requireTotalCount: true }).done(done);

    expect(store.totalCount).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith({ data: [{ id: 1 }], extra: { totalCount: 3 } });
  });

  it('resolves a deferred total count before resolving the load', () => {
    const totalCount = Deferred<number>();
    const { customLoader } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      storeTotalCount: () => totalCount,
    });
    const done = jest.fn();

    const d = customLoader.load({ requireTotalCount: true }).done(done);
    expect(done).not.toHaveBeenCalled();

    totalCount.resolve(9);

    expect(d.state()).toBe('resolved');
    expect(done).toHaveBeenCalledWith({ data: [{ id: 1 }], extra: { totalCount: 9 } });
  });

  it('reports a store failure through the dataSource loadError event', () => {
    silenceStoreErrorLog();

    const error = new Error('load failed');
    const { customLoader, dataSource } = setup({
      storeLoad: () => Deferred().reject(error),
    });
    const loadError = jest.fn();
    const fail = jest.fn();

    dataSource.on('loadError', loadError);
    customLoader.load({}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
    expect(loadError).toHaveBeenCalledWith(error);
  });

  it('holds the dataSource in a loading state until the load settles', () => {
    const storeDeferred = Deferred();
    const { customLoader, dataSource } = setup({ storeLoad: () => storeDeferred });

    customLoader.load({});
    expect(dataSource.isLoading()).toBe(true);

    storeDeferred.resolve([]);
    expect(dataSource.isLoading()).toBe(false);
  });

  it('reads the loading timeout on every load', () => {
    const { customLoader, getLoadingTimeout } = setup();

    customLoader.load({});
    customLoader.load({});

    expect(getLoadingTimeout).toHaveBeenCalledTimes(2);
  });

  it('defers the store load by the loading timeout', () => {
    jest.useFakeTimers();
    try {
      const { customLoader, store } = setup({ loadingTimeout: 30 });

      customLoader.load({});
      expect(store.load).not.toHaveBeenCalled();

      jest.advanceTimersByTime(30);
      expect(store.load).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('isCustomLoading', () => {
  it('is false before any load', () => {
    const { customLoader } = setup();

    expect(customLoader.isLoading()).toBe(false);
  });

  it('is true while a load is pending and false once it settles', () => {
    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    customLoader.load({});
    expect(customLoader.isLoading()).toBe(true);

    storeDeferred.resolve([]);
    expect(customLoader.isLoading()).toBe(false);
  });

  it('is false once a failed load settles', () => {
    silenceStoreErrorLog();

    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    customLoader.load({});
    storeDeferred.reject(new Error('load failed'));

    expect(customLoader.isLoading()).toBe(false);
  });
});

describe('isLoadingAll', () => {
  it('is false for a load that is not loading all', () => {
    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    customLoader.load({});

    expect(customLoader.isLoadingAll()).toBe(false);
  });

  it('is true while a loading-all load is pending and false once it settles', () => {
    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    customLoader.load({ isLoadingAll: true });
    expect(customLoader.isLoadingAll()).toBe(true);

    storeDeferred.resolve([]);
    expect(customLoader.isLoadingAll()).toBe(false);
  });
});

describe('loadAll', () => {
  it('loads every item, keeping the dataSource load options', () => {
    const { customLoader, customizeStoreLoadOptions } = setup({
      dataSourceOptions: { filter: ['id', '>', 1], requireTotalCount: true },
    });

    customLoader.loadAll();

    const { storeLoadOptions } = customizeStoreLoadOptions.mock.calls[0][0];
    expect(storeLoadOptions.filter).toEqual(['id', '>', 1]);
    expect(storeLoadOptions.isLoadingAll).toBe(true);
    expect(storeLoadOptions.requireTotalCount).toBe(false);
  });

  it('marks the customLoader as loading all', () => {
    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    customLoader.loadAll();

    expect(customLoader.isLoadingAll()).toBe(true);
  });
});

describe('processLoadedData', () => {
  it('runs the data through the result stage without touching the store', () => {
    const data = [{ id: 1 }];
    const { customLoader, store, customizeLoadResult } = setup();
    const done = jest.fn();

    customLoader.processLoadedData(data, { sort: 'id' }).done(done);

    expect(store.load).not.toHaveBeenCalled();

    const operation = customizeLoadResult.mock.calls[0][0];
    expect(operation.data).toBe(data);
    expect(operation.isCustomLoading).toBe(true);
    expect(operation.storeLoadOptions).toEqual({ isLoadingAll: true });
    expect(operation.loadOptions).toEqual({ sort: 'id' });
    expect(done).toHaveBeenCalledWith({ data, extra: undefined });
  });

  it('resolves with the data and extra the result stage produced', () => {
    const transformed = [{ id: 'transformed' }];
    const summary = [10];
    const { customLoader } = setup({
      customizeLoadResult: (operation) => {
        operation.data = transformed;
        operation.extra = { summary };
      },
    });
    const done = jest.fn();

    customLoader.processLoadedData([{ id: 1 }], {}).done(done);

    expect(done).toHaveBeenCalledWith({ data: transformed, extra: { summary } });
  });

  it('waits for data the result stage left deferred', () => {
    const deferredData = Deferred();
    const { customLoader } = setup({
      customizeLoadResult: (operation) => {
        operation.data = deferredData as DeferredObj<never>;
      },
    });
    const done = jest.fn();

    customLoader.processLoadedData([{ id: 1 }], {}).done(done);
    expect(done).not.toHaveBeenCalled();

    deferredData.resolve([{ id: 2 }]);
    expect(done).toHaveBeenCalledWith({ data: [{ id: 2 }], extra: undefined });
  });

  it('rejects when the result stage rejects the data', () => {
    const error = new Error('E1037');
    const { customLoader } = setup({
      customizeLoadResult: (operation) => {
        operation.data = Deferred().reject(error) as DeferredObj<never>;
      },
    });
    const fail = jest.fn();

    customLoader.processLoadedData([{ id: 1 }], {}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
  });
});

describe('loadFromStore', () => {
  it('passes the load options to the store untouched', () => {
    const { customLoader, store } = setup();
    const loadOptions: StoreLoadOptions = { skip: 10, take: 5 };

    customLoader.loadFromStore(loadOptions);

    expect(store.load).toHaveBeenCalledTimes(1);
    expect(store.load).toHaveBeenCalledWith(loadOptions);
  });

  it('resolves with the data and extra the store reports', () => {
    const data = [{ id: 1 }];
    const extra = { totalCount: 42 };
    const { customLoader } = setup({ storeLoad: () => Deferred().resolve(data, extra) });
    const done = jest.fn();

    customLoader.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith({ data, extra });
  });

  it('unwraps a single `{ data, totalCount }` object into the data/extra result', () => {
    const result = { data: [{ id: 1 }], totalCount: 42 };
    const { customLoader } = setup({ storeLoad: () => Deferred().resolve(result) });
    const done = jest.fn();

    customLoader.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith({ data: result.data, extra: result });
  });

  it('leaves an array result alone even when it has a `data` property', () => {
    const data = Object.assign([{ id: 1 }], { data: [{ id: 2 }] });
    const { customLoader } = setup({ storeLoad: () => Deferred().resolve(data) });
    const done = jest.fn();

    customLoader.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith({ data, extra: undefined });
  });

  it('leaves an object whose `data` is not an array alone', () => {
    const result = { data: 'not an array' };
    const { customLoader } = setup({ storeLoad: () => Deferred().resolve(result) });
    const done = jest.fn();

    customLoader.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith({ data: result, extra: undefined });
  });

  it('resolves with no data when the store reports none', () => {
    const { customLoader } = setup({ storeLoad: () => Deferred().resolve(undefined, undefined) });
    const done = jest.fn();

    customLoader.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith({ data: undefined, extra: undefined });
  });

  it('rejects with the error the store failed with', () => {
    silenceStoreErrorLog();

    const error = new Error('load failed');
    const { customLoader } = setup({ storeLoad: () => Deferred().reject(error) });
    const fail = jest.fn();

    customLoader.loadFromStore({}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
  });

  it('stays pending while the store load is pending', () => {
    const storeDeferred = Deferred();
    const { customLoader } = setup({ storeLoad: () => storeDeferred });

    const d = customLoader.loadFromStore({});
    expect(d.state()).toBe('pending');

    storeDeferred.resolve([{ id: 1 }]);
    expect(d.state()).toBe('resolved');
  });
});
