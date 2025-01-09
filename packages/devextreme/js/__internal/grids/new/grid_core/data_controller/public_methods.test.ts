/* eslint-disable spellcheck/spell-checker */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import ArrayStore from '@ts/data/m_array_store';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';
import { PublicMethods } from './public_methods';

const setup = (options: Options) => {
  const optionsController = new OptionsControllerMock(options);
  const dataController = new DataController(optionsController);
  // @ts-expect-error
  const gridCore = new (PublicMethods(class {
    protected dataController = dataController;
  }))();

  return {
    optionsController,
    dataController,
    gridCore,
  };
};

describe('PublicMethods', () => {
  describe('getDataSource', () => {
    it('should return current dataSource', () => {
      const data = [{ a: 1 }, { b: 2 }];
      const { gridCore, dataController } = setup({ dataSource: data });

      expect(
        gridCore.getDataSource(),
      ).toBe(
        dataController.dataSource.unreactive_get(),
      );
    });
  });
  describe('byKey', () => {
    it('should return item by key', async () => {
      const { gridCore } = setup({
        keyExpr: 'id',
        dataSource: [
          { id: 1, value: 'value 1' },
          { id: 2, value: 'value 2' },
        ],
      });

      expect(await gridCore.byKey(1)).toEqual({ id: 1, value: 'value 1' });
      expect(await gridCore.byKey(2)).toEqual({ id: 2, value: 'value 2' });
    });

    describe('when needed item is already loaded', () => {
      it('should return item by given key without request', async () => {
        const store = new ArrayStore({
          data: [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' },
          ],
          key: 'id',
        });

        jest.spyOn(store, 'byKey');

        const { gridCore, dataController } = setup({ dataSource: store });
        await dataController.waitLoaded();

        const item = await gridCore.byKey(1);
        expect(store.byKey).toBeCalledTimes(0);
        expect(item).toEqual({ id: 1, value: 'value 1' });
      });
    });
    describe('when needed item is not already loaded', () => {
      it('should make request to get item by given key', async () => {
        const store = new ArrayStore({
          data: [
            { id: 1, value: 'value 1' },
            { id: 2, value: 'value 2' },
            { id: 3, value: 'value 3' },
          ],
          key: 'id',
        });

        jest.spyOn(store, 'byKey');

        const { gridCore, dataController } = setup({
          dataSource: store,
          paging: { pageSize: 1 },
        });
        await dataController.waitLoaded();

        const item = await gridCore.byKey(2);
        expect(store.byKey).toBeCalledTimes(1);
        expect(item).toEqual({ id: 2, value: 'value 2' });
      });
    });
  });
  describe('getFilter', () => {
    // TODO: add test once some filter module (header filter, filter row etc) is implemented
    it.skip('should return filter applied to dataSource', () => {
    });
  });

  describe('keyOf', () => {
    it('should return key of given data object', () => {
      const { gridCore } = setup({ keyExpr: 'id', dataSource: [] });
      const dataObject = { value: 'my value', id: 'my id' };

      expect(gridCore.keyOf(dataObject)).toBe('my id');
    });
  });

  describe('pageCount', () => {
    it('should return current page count', () => {
      const { gridCore, dataController } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
        },
      });
      expect(gridCore.pageCount()).toBe(2);

      dataController.pageSize.update(4);
      expect(gridCore.pageCount()).toBe(1);
    });
  });

  describe('pageSize', () => {
    it('should return current page size', () => {
      const { gridCore, dataController } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
        },
      });
      expect(gridCore.pageSize()).toBe(2);

      dataController.pageSize.update(4);
      expect(gridCore.pageSize()).toBe(4);
    });
  });

  describe('pageIndex', () => {
    it('should return current page index', () => {
      const { gridCore, dataController } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
        },
      });
      expect(gridCore.pageIndex()).toBe(0);

      dataController.pageIndex.update(3);
      expect(gridCore.pageIndex()).toBe(3);
    });
  });

  describe('totalCount', () => {
    it('should return current total count', () => {
      const { gridCore } = setup({
        dataSource: [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }],
        paging: {
          pageSize: 2,
        },
      });
      expect(gridCore.totalCount()).toBe(4);
    });
  });
});
