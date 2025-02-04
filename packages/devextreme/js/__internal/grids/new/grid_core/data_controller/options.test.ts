/* eslint-disable spellcheck/spell-checker */
import {
  afterAll,
  beforeAll,
  describe, expect, it, jest,
} from '@jest/globals';
import { CustomStore } from '@js/common/data';
import DataSource from '@js/data/data_source';
import { logger } from '@ts/core/utils/m_console';
import ArrayStore from '@ts/data/m_array_store';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';

beforeAll(() => {
  jest.spyOn(logger, 'error').mockImplementation(() => {});
});
afterAll(() => {
  jest.restoreAllMocks();
});

const setup = (options: Options) => {
  const optionsController = new OptionsControllerMock(options);
  const dataController = new DataController(optionsController);

  return {
    optionsController,
    dataController,
  };
};

describe('Options', () => {
  describe('cacheEnabled', () => {
    const setupForCacheEnabled = ({ cacheEnabled }) => {
      const store = new ArrayStore({
        data: [
          { id: 1, value: 'value 1' },
          { id: 2, value: 'value 2' },
          { id: 3, value: 'value 3' },
        ],
        key: 'id',
      });

      jest.spyOn(store, 'load');

      const { dataController } = setup({
        cacheEnabled,
        dataSource: store,
        paging: {
          pageSize: 1,
        },
      });

      return { store, dataController };
    };

    describe('when it is false', () => {
      it('should skip caching requests', () => {
        const { store, dataController } = setupForCacheEnabled({
          cacheEnabled: false,
        });
        expect(store.load).toBeCalledTimes(1);

        dataController.pageIndex.update(1);
        expect(store.load).toBeCalledTimes(2);

        dataController.pageIndex.update(0);
        expect(store.load).toBeCalledTimes(3);
      });
    });

    describe('when it is true', () => {
      it.skip('should cache previously loaded pages', () => {});
      it.skip('should clear cache if not only pageIndex changed', () => {});
    });
  });

  describe('dataSourse', () => {
    describe('when it is dataSource instance', () => {
      it('should pass dataSource as is', () => {
        const dataSource = new DataSource({
          store: [{ a: 1 }, { b: 2 }],
        });

        const { dataController } = setup({ dataSource });

        expect(dataController.dataSource.unreactive_get()).toBe(dataSource);
      });
    });
    describe('when it is array', () => {
      it('should normalize to DataSource with given items', () => {
        const data = [{ a: 1 }, { b: 2 }];
        const { dataController } = setup({ dataSource: data });

        const dataSource = dataController.dataSource.unreactive_get();

        expect(dataSource).toBeInstanceOf(DataSource);
        expect(dataSource.items()).toEqual(data);
      });
    });
    describe('when it is empty', () => {
      it('should should normalize to empty DataSource', () => {
        const { dataController } = setup({});

        const dataSource = dataController.dataSource.unreactive_get();

        expect(dataSource).toBeInstanceOf(DataSource);
        expect(dataSource.items()).toHaveLength(0);
      });
    });
  });

  describe('keyExpr', () => {
    describe('when dataSource is array', () => {
      it('should be passed as key to DataSource', () => {
        const { dataController } = setup({
          dataSource: [{ myKeyExpr: 1 }, { myKeyExpr: 2 }],
          keyExpr: 'myKeyExpr',
        });

        const dataSource = dataController.dataSource.unreactive_get();
        expect(dataSource.key()).toBe('myKeyExpr');
      });
    });
    describe('when dataSource is DataSource instance', () => {
      it('should be ignored', () => {
        const { dataController } = setup({
          dataSource: new ArrayStore({
            key: 'storeKeyExpr',
            data: [{ storeKeyExpr: 1 }, { storeKeyExpr: 2 }],
          }),
          keyExpr: 'myKeyExpr',
        });

        const dataSource = dataController.dataSource.unreactive_get();
        expect(dataSource.key()).toBe('storeKeyExpr');
      });
    });
  });

  describe('onDataErrorOccurred', () => {
    it('should be called when load error happens', async () => {
      const onDataErrorOccurred = jest.fn();

      const { dataController } = setup({
        dataSource: new CustomStore({
          load() {
            return Promise.reject(new Error('my error'));
          },
        }),
        onDataErrorOccurred,
      });

      await dataController.waitLoaded();

      expect(onDataErrorOccurred).toBeCalledTimes(1);
      expect(onDataErrorOccurred.mock.calls[0]).toMatchSnapshot([{
        component: expect.any(Object),
      }]);
    });
  });

  describe('paging.enabled', () => {
    describe('when it is true', () => {
      it('should turn on pagination', () => {
        const { dataController } = setup({
          dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
          paging: {
            enabled: true,
            pageSize: 2,
          },
        });

        const items = dataController.items.unreactive_get();
        expect(items).toHaveLength(2);
      });
    });
    describe('when it is false', () => {
      it('should turn on pagination', () => {
        const { dataController } = setup({
          dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
          paging: {
            enabled: false,
            pageSize: 2,
          },
        });

        const items = dataController.items.unreactive_get();
        expect(items).toHaveLength(4);
      });
    });
  });

  describe('paging.pageIndex', () => {
    it('should change current page', () => {
      const { dataController, optionsController } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
          pageIndex: 1,
        },
      });

      let items = dataController.items.unreactive_get();
      expect(items).toEqual([{ a: '3' }, { a: '4' }]);

      optionsController.option('paging.pageIndex', 0);
      items = dataController.items.unreactive_get();
      expect(items).toEqual([{ a: '1' }, { a: '2' }]);
    });
  });

  describe('paging.pageSize', () => {
    it('should change size of current page', () => {
      const { dataController, optionsController } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
        },
      });

      let items = dataController.items.unreactive_get();
      expect(items).toEqual([{ a: '1' }, { a: '2' }]);

      optionsController.option('paging.pageSize', 3);
      items = dataController.items.unreactive_get();
      expect(items).toEqual([{ a: '1' }, { a: '2' }, { a: '3' }]);
    });
  });

  describe('remoteOperations', () => {
    const setupForRemoteOperations = ({ remoteOperations }) => {
      const store = new CustomStore({
        key: 'id',
        load(loadOptions) {
          const data = [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' },
          ];

          const remotePaging = loadOptions.skip === 0 && !!loadOptions.take;
          if (remotePaging) {
            return Promise.resolve({
              data: [data[0]],
              totalCount: 1,
            });
          }

          return Promise.resolve({
            data,
            totalCount: data.length,
          });
        },
      });

      jest.spyOn(store, 'load');

      const { dataController } = setup({
        remoteOperations,
        dataSource: store,
        paging: {
          pageSize: 1,
          pageIndex: 0,
        },
      });

      return { store, dataController };
    };

    it('should exclude skip and take in the store load request by default for CustomStore', async () => {
      const { store, dataController } = setupForRemoteOperations({
        remoteOperations: 'auto',
      });

      await dataController.waitLoaded();

      const items = dataController.items.unreactive_get();
      expect(items).toHaveLength(1);

      // @ts-expect-error
      expect(store.load.mock.calls[0][0].skip).toBe(undefined);
      // @ts-expect-error
      expect(store.load.mock.calls[0][0].take).toBe(undefined);
    });

    it('should exclude skip and take in the store load request if remotePaging disabled', async () => {
      const { store, dataController } = setupForRemoteOperations({
        remoteOperations: { paging: false },
      });

      await dataController.waitLoaded();

      const items = dataController.items.unreactive_get();
      expect(items).toHaveLength(1);

      // @ts-expect-error
      expect(store.load.mock.calls[0][0].skip).toBe(undefined);
      // @ts-expect-error
      expect(store.load.mock.calls[0][0].take).toBe(undefined);
    });

    it('should include skip and take in the store load request if remotePaging enabled', async () => {
      const { store, dataController } = setupForRemoteOperations({
        remoteOperations: { paging: true },
      });

      await dataController.waitLoaded();

      const items = dataController.items.unreactive_get();
      expect(items).toHaveLength(1);

      // @ts-expect-error
      expect(store.load.mock.calls[0][0].skip).toBe(0);
      // @ts-expect-error
      expect(store.load.mock.calls[0][0].take).toBe(1);
    });
  });
});
