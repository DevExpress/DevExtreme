import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import CustomStore from '@js/data/custom_store';
import PublicDataSource from '@js/data/data_source';
import { logger } from '@ts/core/utils/m_console';
import type { DataSource, StoreLoadOptions } from '@ts/data/data_source/types';

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
  // @ts-expect-error
  const store = new CustomStore({ load, totalCount });

  if (customLoadOptions.length) {
    // Declared before the DataSource is built: it reads them to decide which
    // options to carry in `loadOptions()`.
    (store as unknown as { _customLoadOptions: () => string[] })
      ._customLoadOptions = (): string[] => customLoadOptions;
  }

  const dataSource = new PublicDataSource({
    store,
    ...dataSourceOptions,
  }) as unknown as DataSource;

  const getLoadingTimeout = jest.fn(() => loadingTimeout);
  const customizeStoreLoadOptionsSpy = jest.fn(customizeStoreLoadOptions);
  const customizeLoadResultSpy = jest.fn(customizeLoadResult);

  const pipeline = new CustomLoader(
    dataSource,
    getLoadingTimeout,
    customizeStoreLoadOptionsSpy,
    customizeLoadResultSpy,
  );

  return {
    pipeline,
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
    const { pipeline, customizeStoreLoadOptions } = setup({
      dataSourceOptions: { langParams },
    });

    pipeline.load({ skip: 10, take: 5 });

    const operation = customizeStoreLoadOptions.mock.calls[0][0];
    expect(operation.storeLoadOptions).toMatchObject({ skip: 10, take: 5, langParams });
    expect(operation.isCustomLoading).toBe(true);
  });

  it('fills the store custom load options from the dataSource, without overwriting', () => {
    const { pipeline, customizeStoreLoadOptions } = setup({
      customLoadOptions: ['fromDataSource', 'fromOptions'],
      dataSourceOptions: { fromDataSource: 'ds', fromOptions: 'ds' },
    });

    pipeline.load({ fromOptions: 'own' });

    const { storeLoadOptions } = customizeStoreLoadOptions.mock.calls[0][0];
    expect(storeLoadOptions.fromDataSource).toBe('ds');
    expect(storeLoadOptions.fromOptions).toBe('own');
  });

  it('customizes the store load options before loading and the result after', () => {
    const order: string[] = [];
    const { pipeline } = setup({
      storeLoad: () => { order.push('load'); return Deferred().resolve([]); },
      customizeStoreLoadOptions: () => { order.push('customizeStoreLoadOptions'); },
      customizeLoadResult: () => { order.push('customizeLoadResult'); },
    });

    pipeline.load({});

    expect(order).toEqual(['customizeStoreLoadOptions', 'load', 'customizeLoadResult']);
  });

  it('resolves with the loaded data and extra', () => {
    const data = [{ id: 1 }];
    const { pipeline } = setup({
      storeLoad: () => Deferred().resolve(data, { totalCount: 42 }),
    });
    const done = jest.fn();

    pipeline.load({}).done(done);

    expect(done).toHaveBeenCalledWith(data, { totalCount: 42 });
  });

  it('skips the store when a customizeStoreLoadOptions handler supplies the data', () => {
    const data = [{ id: 1 }];
    const { pipeline, store } = setup({
      customizeStoreLoadOptions: (operation) => { operation.data = data; },
    });
    const done = jest.fn();

    pipeline.load({}).done(done);

    expect(store.load).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith(data, expect.anything());
  });

  it('resolves with the data a customizeLoadResult handler put on the operation', () => {
    const transformed = [{ id: 'transformed' }];
    const { pipeline } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      customizeLoadResult: (operation) => { operation.data = transformed; },
    });
    const done = jest.fn();

    pipeline.load({}).done(done);

    expect(done).toHaveBeenCalledWith(transformed, expect.anything());
  });

  it('rejects as canceled when the dataSource is disposed before the load runs', () => {
    let dispose = (): void => {};
    const { dataSource, pipeline, store } = setup({
      customizeStoreLoadOptions: () => { dispose(); },
    });
    const fail = jest.fn();

    dispose = (): void => dataSource.dispose();
    pipeline.load({}).fail(fail);

    expect(store.load).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalledWith('canceled');
  });

  it('asks the store for a total count when requireTotalCount is set and the store reported none', () => {
    const { pipeline, store } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      storeTotalCount: () => 17,
    });
    const done = jest.fn();

    pipeline.load({ requireTotalCount: true }).done(done);

    expect(store.totalCount).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith([{ id: 1 }], { totalCount: 17 });
  });

  it('keeps the total count the store already reported', () => {
    const { pipeline, store } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }], { totalCount: 3 }),
    });
    const done = jest.fn();

    pipeline.load({ requireTotalCount: true }).done(done);

    expect(store.totalCount).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith([{ id: 1 }], { totalCount: 3 });
  });

  it('resolves a deferred total count before resolving the load', () => {
    const totalCount = Deferred<number>();
    const { pipeline } = setup({
      storeLoad: () => Deferred().resolve([{ id: 1 }]),
      storeTotalCount: () => totalCount,
    });
    const done = jest.fn();

    const d = pipeline.load({ requireTotalCount: true }).done(done);
    expect(done).not.toHaveBeenCalled();

    totalCount.resolve(9);

    expect(d.state()).toBe('resolved');
    expect(done).toHaveBeenCalledWith([{ id: 1 }], { totalCount: 9 });
  });

  it('reports a store failure through the dataSource loadError event', () => {
    silenceStoreErrorLog();

    const error = new Error('load failed');
    const { pipeline, dataSource } = setup({
      storeLoad: () => Deferred().reject(error),
    });
    const loadError = jest.fn();
    const fail = jest.fn();

    dataSource.on('loadError', loadError);
    pipeline.load({}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
    expect(loadError).toHaveBeenCalledWith(error);
  });

  it('holds the dataSource in a loading state until the load settles', () => {
    const storeDeferred = Deferred();
    const { pipeline, dataSource } = setup({ storeLoad: () => storeDeferred });

    pipeline.load({});
    expect(dataSource.isLoading()).toBe(true);

    storeDeferred.resolve([]);
    expect(dataSource.isLoading()).toBe(false);
  });

  it('reads the loading timeout on every load', () => {
    const { pipeline, getLoadingTimeout } = setup();

    pipeline.load({});
    pipeline.load({});

    expect(getLoadingTimeout).toHaveBeenCalledTimes(2);
  });

  it('defers the store load by the loading timeout', () => {
    jest.useFakeTimers();
    try {
      const { pipeline, store } = setup({ loadingTimeout: 30 });

      pipeline.load({});
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
    const { pipeline } = setup();

    expect(pipeline.isLoading()).toBe(false);
  });

  it('is true while a load is pending and false once it settles', () => {
    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    pipeline.load({});
    expect(pipeline.isLoading()).toBe(true);

    storeDeferred.resolve([]);
    expect(pipeline.isLoading()).toBe(false);
  });

  it('is false once a failed load settles', () => {
    silenceStoreErrorLog();

    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    pipeline.load({});
    storeDeferred.reject(new Error('load failed'));

    expect(pipeline.isLoading()).toBe(false);
  });
});

describe('isLoadingAll', () => {
  it('is false for a load that is not loading all', () => {
    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    pipeline.load({});

    expect(pipeline.isLoadingAll()).toBe(false);
  });

  it('is true while a loading-all load is pending and false once it settles', () => {
    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    pipeline.load({ isLoadingAll: true });
    expect(pipeline.isLoadingAll()).toBe(true);

    storeDeferred.resolve([]);
    expect(pipeline.isLoadingAll()).toBe(false);
  });
});

describe('loadAll', () => {
  it('loads every item, keeping the dataSource load options', () => {
    const { pipeline, customizeStoreLoadOptions } = setup({
      dataSourceOptions: { filter: ['id', '>', 1], requireTotalCount: true },
    });

    pipeline.loadAll();

    const { storeLoadOptions } = customizeStoreLoadOptions.mock.calls[0][0];
    expect(storeLoadOptions.filter).toEqual(['id', '>', 1]);
    expect(storeLoadOptions.isLoadingAll).toBe(true);
    expect(storeLoadOptions.requireTotalCount).toBe(false);
  });

  it('marks the pipeline as loading all', () => {
    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    pipeline.loadAll();

    expect(pipeline.isLoadingAll()).toBe(true);
  });
});

describe('processLoadedData', () => {
  it('runs the data through the result stage without touching the store', () => {
    const data = [{ id: 1 }];
    const { pipeline, store, customizeLoadResult } = setup();
    const done = jest.fn();

    pipeline.processLoadedData(data, { sort: 'id' }).done(done);

    expect(store.load).not.toHaveBeenCalled();

    const operation = customizeLoadResult.mock.calls[0][0];
    expect(operation.data).toBe(data);
    expect(operation.isCustomLoading).toBe(true);
    expect(operation.storeLoadOptions).toEqual({ isLoadingAll: true });
    expect(operation.loadOptions).toEqual({ sort: 'id' });
    expect(done).toHaveBeenCalledWith(data, undefined);
  });

  it('resolves with the data and extra the result stage produced', () => {
    const transformed = [{ id: 'transformed' }];
    const summary = [10];
    const { pipeline } = setup({
      customizeLoadResult: (operation) => {
        operation.data = transformed;
        operation.extra = { summary };
      },
    });
    const done = jest.fn();

    pipeline.processLoadedData([{ id: 1 }], {}).done(done);

    expect(done).toHaveBeenCalledWith(transformed, { summary });
  });

  it('waits for data the result stage left deferred', () => {
    const deferredData = Deferred();
    const { pipeline } = setup({
      customizeLoadResult: (operation) => {
        operation.data = deferredData as DeferredObj<never>;
      },
    });
    const done = jest.fn();

    pipeline.processLoadedData([{ id: 1 }], {}).done(done);
    expect(done).not.toHaveBeenCalled();

    deferredData.resolve([{ id: 2 }]);
    expect(done).toHaveBeenCalledWith([{ id: 2 }], undefined);
  });

  it('rejects when the result stage rejects the data', () => {
    const error = new Error('E1037');
    const { pipeline } = setup({
      customizeLoadResult: (operation) => {
        operation.data = Deferred().reject(error) as DeferredObj<never>;
      },
    });
    const fail = jest.fn();

    pipeline.processLoadedData([{ id: 1 }], {}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
  });
});

describe('loadFromStore', () => {
  it('passes the load options to the store untouched', () => {
    const { pipeline, store } = setup();
    const loadOptions: StoreLoadOptions = { skip: 10, take: 5 };

    pipeline.loadFromStore(loadOptions);

    expect(store.load).toHaveBeenCalledTimes(1);
    expect(store.load).toHaveBeenCalledWith(loadOptions);
  });

  it('resolves with the data and extra the store reports', () => {
    const data = [{ id: 1 }];
    const extra = { totalCount: 42 };
    const { pipeline } = setup({ storeLoad: () => Deferred().resolve(data, extra) });
    const done = jest.fn();

    pipeline.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith(data, extra);
  });

  it('unwraps a single `{ data, totalCount }` object into a data/extra pair', () => {
    const result = { data: [{ id: 1 }], totalCount: 42 };
    const { pipeline } = setup({ storeLoad: () => Deferred().resolve(result) });
    const done = jest.fn();

    pipeline.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith(result.data, result);
  });

  it('leaves an array result alone even when it has a `data` property', () => {
    const data = Object.assign([{ id: 1 }], { data: [{ id: 2 }] });
    const { pipeline } = setup({ storeLoad: () => Deferred().resolve(data) });
    const done = jest.fn();

    pipeline.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith(data, undefined);
  });

  it('leaves an object whose `data` is not an array alone', () => {
    const result = { data: 'not an array' };
    const { pipeline } = setup({ storeLoad: () => Deferred().resolve(result) });
    const done = jest.fn();

    pipeline.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith(result, undefined);
  });

  it('resolves with no data when the store reports none', () => {
    const { pipeline } = setup({ storeLoad: () => Deferred().resolve(undefined, undefined) });
    const done = jest.fn();

    pipeline.loadFromStore({}).done(done);

    expect(done).toHaveBeenCalledWith(undefined, undefined);
  });

  it('rejects with the error the store failed with', () => {
    silenceStoreErrorLog();

    const error = new Error('load failed');
    const { pipeline } = setup({ storeLoad: () => Deferred().reject(error) });
    const fail = jest.fn();

    pipeline.loadFromStore({}).fail(fail);

    expect(fail).toHaveBeenCalledWith(error);
  });

  it('stays pending while the store load is pending', () => {
    const storeDeferred = Deferred();
    const { pipeline } = setup({ storeLoad: () => storeDeferred });

    const d = pipeline.loadFromStore({});
    expect(d.state()).toBe('pending');

    storeDeferred.resolve([{ id: 1 }]);
    expect(d.state()).toBe('resolved');
  });
});
