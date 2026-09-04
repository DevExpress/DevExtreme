import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { DataSource as DataSourceClass } from '@js/common/data/data_source/data_source';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  DataSourceAdapterProvider, RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataSourceController } from '../data_source_controller';

interface AdapterStub {
  _dataSource: DataSource;
  store: jest.Mock<() => Store | undefined>;
  key: jest.Mock<() => StoreKey | undefined>;
  remoteOperations: jest.Mock<() => RemoteOperationsOptions>;
  getDataIndexGetter: jest.Mock<() => (data: RawItemData) => number>;
  dispose: jest.Mock<(isShared?: boolean) => void>;
  init: jest.Mock<(dataSource: DataSource) => void>;
}

interface ProviderStub {
  nextAdapter: AdapterStub;
  create: jest.Mock<(component: InternalGrid) => DataSourceAdapter>;
  extend: jest.Mock<() => void>;
}

const createAdapterStub = (marker: string): AdapterStub => ({
  _dataSource: { marker } as unknown as DataSource,
  store: jest.fn(() => ({ marker } as unknown as Store)),
  key: jest.fn(() => marker as StoreKey),
  remoteOperations: jest.fn(() => ({ filtering: true } as RemoteOperationsOptions)),
  getDataIndexGetter: jest.fn(() => (): number => 0),
  dispose: jest.fn(),
  init: jest.fn(),
});

const asAdapter = (stub: AdapterStub): DataSourceAdapter => stub as unknown as DataSourceAdapter;

class TestDataSourceController extends DataSourceController {
  public providerStub!: DataSourceAdapterProvider;

  protected getAdapterProvider(): DataSourceAdapterProvider {
    return this.providerStub;
  }

  public readSpecificDataSourceOption(): unknown {
    return this.getSpecificDataSourceOption();
  }
}

const createControllerWith = (): {
  controller: DataSourceController;
  component: InternalGrid;
} => {
  const component = {
    _optionCache: {},
    _controllers: {},
    option: jest.fn(),
  } as unknown as InternalGrid;

  return { controller: new DataSourceController(component), component };
};

const createController = (): DataSourceController => createControllerWith().controller;

const createProviderStub = (adapter: AdapterStub): ProviderStub => {
  const stub: ProviderStub = {
    nextAdapter: adapter,
    create: jest.fn(() => asAdapter(stub.nextAdapter)),
    extend: jest.fn(),
  };

  return stub;
};

const asProvider = (
  stub: ProviderStub,
): DataSourceAdapterProvider => stub as unknown as DataSourceAdapterProvider;

const SOURCE = { marker: 'source' } as unknown as DataSource;

const withProvider = (adapter: AdapterStub): {
  controller: TestDataSourceController;
  component: InternalGrid;
  provider: ProviderStub;
} => {
  const component = {
    _optionCache: {},
    _controllers: {},
    option: jest.fn(),
  } as unknown as InternalGrid;
  const controller = new TestDataSourceController(component);
  const provider = createProviderStub(adapter);

  controller.providerStub = asProvider(provider);

  return { controller, component, provider };
};

const withOptions = (options: Record<string, unknown>): TestDataSourceController => {
  const component = {
    _controllers: {},
    option: jest.fn((name?: string) => (name === undefined ? options : options[name])),
  } as unknown as InternalGrid;

  return new TestDataSourceController(component);
};

// isShared is private and read only by disposal, so that is where it becomes observable.
const flagHandedToAdapter = (
  controller: TestDataSourceController,
): boolean | undefined => {
  const probe = createAdapterStub('probe');

  controller.providerStub = asProvider(createProviderStub(probe));
  controller.createAdapter(SOURCE);
  controller.disposeAdapter();

  return probe.dispose.mock.calls[0]?.[0];
};

const withAdapter = (marker = 'first'): {
  controller: TestDataSourceController;
  adapter: AdapterStub;
  provider: ProviderStub;
} => {
  const adapter = createAdapterStub(marker);
  const { controller, provider } = withProvider(adapter);

  controller.createAdapter(SOURCE);

  return { controller, adapter, provider };
};

describe('DataSourceController', () => {
  describe('with no adapter', () => {
    it('has no adapter right after construction, without init()', () => {
      const controller = createController();

      expect(controller.hasAdapter()).toBe(false);
      expect(controller.getAdapter()).toBeNull();
    });

    it('returns null from getDataSource', () => {
      expect(createController().getDataSource()).toBeNull();
    });

    it('returns undefined from store and key', () => {
      const controller = createController();

      expect(controller.store()).toBeUndefined();
      expect(controller.key()).toBeUndefined();
    });

    it('returns undefined from getDataIndexGetter', () => {
      expect(createController().getDataIndexGetter()).toBeUndefined();
    });

    it('returns an empty object from remoteOperations, so callers can enumerate it', () => {
      const controller = createController();

      expect(controller.remoteOperations()).toEqual({});
      expect(Object.keys(controller.remoteOperations())).toEqual([]);
    });
  });

  describe('with an adapter', () => {
    it('reports the adapter as present and hands back the same object', () => {
      const { controller, adapter } = withAdapter();

      expect(controller.hasAdapter()).toBe(true);
      expect(controller.getAdapter()).toBe(asAdapter(adapter));
    });

    it('delegates store to the adapter once per call', () => {
      const { controller, adapter } = withAdapter();

      expect(controller.store()).toBe(adapter.store.mock.results[0]?.value);
      expect(adapter.store).toHaveBeenCalledTimes(1);
    });

    it('delegates key to the adapter', () => {
      const { controller, adapter } = withAdapter();

      expect(controller.key()).toBe('first');
      expect(adapter.key).toHaveBeenCalledTimes(1);
    });

    it('returns the adapter remoteOperations object as-is', () => {
      const { controller, adapter } = withAdapter();

      expect(controller.remoteOperations()).toEqual({ filtering: true });
      expect(adapter.remoteOperations).toHaveBeenCalledTimes(1);
    });

    it('delegates getDataIndexGetter to the adapter', () => {
      const { controller, adapter } = withAdapter();
      const getter = controller.getDataIndexGetter();

      expect(getter).toBe(adapter.getDataIndexGetter.mock.results[0]?.value);
      expect(adapter.getDataIndexGetter).toHaveBeenCalledTimes(1);
    });

    it('returns the inner DataSource from getDataSource, not the adapter', () => {
      const { controller, adapter } = withAdapter();

      expect(controller.getDataSource()).toBe(adapter._dataSource);
      expect(controller.getDataSource()).not.toBe(asAdapter(adapter));
    });
  });

  describe('replacing the adapter', () => {
    it('follows the new adapter after a replacement', () => {
      const { controller, adapter: first, provider } = withAdapter();
      const second = createAdapterStub('second');

      provider.nextAdapter = second;
      controller.createAdapter(SOURCE);

      expect(controller.getAdapter()).toBe(asAdapter(second));
      expect(controller.key()).toBe('second');
      expect(controller.getDataSource()).toBe(second._dataSource);
      expect(first.key).not.toHaveBeenCalled();
    });

    it('returns to the absent state after disposeAdapter', () => {
      const { controller } = withAdapter();

      controller.disposeAdapter();

      expect(controller.hasAdapter()).toBe(false);
      expect(controller.getAdapter()).toBeNull();
      expect(controller.getDataSource()).toBeNull();
      expect(controller.store()).toBeUndefined();
      expect(controller.key()).toBeUndefined();
      expect(controller.getDataIndexGetter()).toBeUndefined();
      expect(controller.remoteOperations()).toEqual({});
    });
  });

  describe('layering', () => {
    it('reads no other controller', () => {
      const { controller } = withAdapter();
      const getController = jest.spyOn(controller, 'getController');

      controller.hasAdapter();
      controller.getAdapter();
      controller.getDataSource();
      controller.store();
      controller.key();
      controller.remoteOperations();
      controller.getDataIndexGetter();
      controller.disposeAdapter();

      expect(getController).not.toHaveBeenCalled();
    });
  });

  describe('createAdapter', () => {
    it('builds the adapter through the provider, passing the component', () => {
      const { controller, component, provider } = withProvider(createAdapterStub('built'));

      controller.createAdapter(SOURCE);

      expect(provider.create).toHaveBeenCalledTimes(1);
      expect(provider.create).toHaveBeenCalledWith(component);
    });

    it('initialises the adapter with the given data source', () => {
      const adapter = createAdapterStub('built');

      withProvider(adapter).controller.createAdapter(SOURCE);

      expect(adapter.init).toHaveBeenCalledTimes(1);
      expect(adapter.init).toHaveBeenCalledWith(SOURCE);
    });

    it('returns the adapter the provider produced', () => {
      const adapter = createAdapterStub('built');

      const result = withProvider(adapter).controller.createAdapter(SOURCE);

      expect(result).toBe(asAdapter(adapter));
    });

    it('stores the adapter it built', () => {
      const adapter = createAdapterStub('built');
      const { controller } = withProvider(adapter);

      controller.createAdapter(SOURCE);

      expect(controller.hasAdapter()).toBe(true);
      expect(controller.getAdapter()).toBe(asAdapter(adapter));
    });

    it('replaces a previously held adapter without disposing it', () => {
      const first = createAdapterStub('first');
      const { controller, provider } = withProvider(first);
      const second = createAdapterStub('second');

      controller.createAdapter(SOURCE);
      provider.nextAdapter = second;
      controller.createAdapter(SOURCE);

      expect(controller.getAdapter()).toBe(asAdapter(second));
      expect(first.dispose).not.toHaveBeenCalled();
    });

    it('throws on the base class, where no component has supplied a provider', () => {
      expect(() => createController().createAdapter(SOURCE)).toThrow('Method not implemented.');
    });
  });

  describe('getSpecificDataSourceOption', () => {
    it('wraps an array option into an array store, keyed by keyExpr', () => {
      const data = [{ id: 1 }];

      const result = withOptions({ dataSource: data, keyExpr: 'id' })
        .readSpecificDataSourceOption();

      expect(result).toEqual({ store: { type: 'array', data, key: 'id' } });
    });

    it('keeps the caller array by reference, leaving the copy to createDataSource', () => {
      const data = [{ id: 1 }];

      const result = withOptions({ dataSource: data, keyExpr: 'id' })
        .readSpecificDataSourceOption() as { store: { data: unknown } };

      expect(result.store.data).toBe(data);
    });

    it('passes a non-array option straight through', () => {
      const config = { store: { type: 'odata', url: 'x' } };

      const result = withOptions({ dataSource: config }).readSpecificDataSourceOption();

      expect(result).toBe(config);
    });

    it('returns the unset option as-is, so createDataSource can see it is absent', () => {
      expect(withOptions({}).readSpecificDataSourceOption()).toBeUndefined();
    });

    it('does not throw on the base class, unlike getAdapterProvider', () => {
      expect(() => withOptions({}).readSpecificDataSourceOption()).not.toThrow();
    });
  });

  describe('createDataSource', () => {
    it('returns undefined when the dataSource option is absent', () => {
      const controller = withOptions({});

      expect(controller.createDataSource()).toBeUndefined();
    });

    it('leaves the source not-shared when the dataSource option is absent', () => {
      const controller = withOptions({});

      controller.createDataSource();

      expect(flagHandedToAdapter(controller)).toBe(false);
    });

    it('builds a DataSource from a plain array', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });

      expect(controller.createDataSource()).toBeInstanceOf(DataSourceClass);
    });

    it('keys the built DataSource by keyExpr', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });

      expect(controller.createDataSource()?.key()).toBe('id');
    });

    it('marks what it built not-shared, so disposal may destroy it', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });

      controller.createDataSource();

      expect(flagHandedToAdapter(controller)).toBe(false);
    });

    it('builds a DataSource from a store config', () => {
      const controller = withOptions({ dataSource: { store: { type: 'array', data: [] } } });

      expect(controller.createDataSource()).toBeInstanceOf(DataSourceClass);
    });

    it('builds a fresh DataSource on every call', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });

      expect(controller.createDataSource()).not.toBe(controller.createDataSource());
    });

    it('hands back the very DataSource the caller passed, without rebuilding it', () => {
      const shared = new DataSourceClass({ store: [{ id: 1 }], key: 'id' });
      const controller = withOptions({ dataSource: shared });

      expect(controller.createDataSource()).toBe(shared);

      shared.dispose();
    });

    it('marks a caller-owned DataSource shared, so disposal spares it', () => {
      const shared = new DataSourceClass({ store: [{ id: 1 }], key: 'id' });
      const controller = withOptions({ dataSource: shared });

      controller.createDataSource();

      expect(flagHandedToAdapter(controller)).toBe(true);

      shared.dispose();
    });

    it('clears the shared flag when the option moves from a DataSource to an array', () => {
      const shared = new DataSourceClass({ store: [{ id: 1 }], key: 'id' });
      const options: Record<string, unknown> = { dataSource: shared, keyExpr: 'id' };
      const controller = withOptions(options);

      controller.createDataSource();
      options.dataSource = [{ id: 2 }];
      controller.createDataSource();

      expect(flagHandedToAdapter(controller)).toBe(false);

      shared.dispose();
    });

    it('starts out not-shared, before anything has been created', () => {
      expect(flagHandedToAdapter(withOptions({}))).toBe(false);
    });

    it('leaves the held adapter alone — creating a source is not creating an adapter', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });

      controller.createDataSource();

      expect(controller.hasAdapter()).toBe(false);
    });

    it('reads no other controller', () => {
      const controller = withOptions({ dataSource: [{ id: 1 }], keyExpr: 'id' });
      const getController = jest.spyOn(controller, 'getController');

      controller.createDataSource();
      controller.readSpecificDataSourceOption();

      expect(getController).not.toHaveBeenCalled();
    });
  });

  describe('disposeAdapter', () => {
    it('disposes the adapter it holds', () => {
      const { controller, adapter } = withAdapter();

      controller.disposeAdapter();

      expect(adapter.dispose).toHaveBeenCalledTimes(1);
    });

    it('does nothing when there is no adapter to dispose', () => {
      expect(() => createController().disposeAdapter()).not.toThrow();
    });

    it('disposes only once across repeated calls', () => {
      const { controller, adapter } = withAdapter();

      controller.disposeAdapter();
      controller.disposeAdapter();

      expect(adapter.dispose).toHaveBeenCalledTimes(1);
    });

    it('reads no other controller', () => {
      const { controller } = withAdapter();
      const getController = jest.spyOn(controller, 'getController');

      controller.disposeAdapter();

      expect(getController).not.toHaveBeenCalled();
    });
  });
});
