import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import type {
  RawItemData, RemoteOperationsOptions,
} from '@ts/grids/grid_core/data_source_adapter/types';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataSourceController } from '../data_source_controller';

interface AdapterStub {
  _dataSource: DataSource;
  store: jest.Mock<() => Store | undefined>;
  key: jest.Mock<() => StoreKey | undefined>;
  remoteOperations: jest.Mock<() => RemoteOperationsOptions>;
  getDataIndexGetter: jest.Mock<() => (data: RawItemData) => number>;
  dispose: jest.Mock<() => void>;
}

const createAdapter = (marker: string): AdapterStub => ({
  _dataSource: { marker } as unknown as DataSource,
  store: jest.fn(() => ({ marker } as unknown as Store)),
  key: jest.fn(() => marker as StoreKey),
  remoteOperations: jest.fn(() => ({ filtering: true } as RemoteOperationsOptions)),
  getDataIndexGetter: jest.fn(() => (): number => 0),
  dispose: jest.fn(),
});

const asAdapter = (stub: AdapterStub): DataSourceAdapter => stub as unknown as DataSourceAdapter;

const createController = (): DataSourceController => {
  const component = {
    _optionCache: {},
    _controllers: {},
    option: jest.fn(),
  };

  return new DataSourceController(component as unknown as InternalGrid);
};

const withAdapter = (marker = 'first'): {
  controller: DataSourceController;
  adapter: AdapterStub;
} => {
  const controller = createController();
  const adapter = createAdapter(marker);

  controller.setAdapter(asAdapter(adapter));

  return { controller, adapter };
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
      const { controller, adapter: first } = withAdapter();
      const second = createAdapter('second');

      controller.setAdapter(asAdapter(second));

      expect(controller.getAdapter()).toBe(asAdapter(second));
      expect(controller.key()).toBe('second');
      expect(controller.getDataSource()).toBe(second._dataSource);
      expect(first.key).not.toHaveBeenCalled();
    });

    it('returns to the absent state after setAdapter(null)', () => {
      const { controller } = withAdapter();

      controller.setAdapter(null);

      expect(controller.hasAdapter()).toBe(false);
      expect(controller.getAdapter()).toBeNull();
      expect(controller.getDataSource()).toBeNull();
      expect(controller.store()).toBeUndefined();
      expect(controller.key()).toBeUndefined();
      expect(controller.getDataIndexGetter()).toBeUndefined();
      expect(controller.remoteOperations()).toEqual({});
    });

    it('does not dispose the adapter it lets go of', () => {
      const { controller, adapter } = withAdapter();

      controller.setAdapter(null);

      expect(adapter.dispose).not.toHaveBeenCalled();
    });
  });

  describe('layering', () => {
    it('reads no other controller', () => {
      const { controller, adapter } = withAdapter();
      const getController = jest.spyOn(controller, 'getController');

      controller.setAdapter(asAdapter(adapter));
      controller.hasAdapter();
      controller.getAdapter();
      controller.getDataSource();
      controller.store();
      controller.key();
      controller.remoteOperations();
      controller.getDataIndexGetter();
      controller.setAdapter(null);

      expect(getController).not.toHaveBeenCalled();
    });
  });
});
