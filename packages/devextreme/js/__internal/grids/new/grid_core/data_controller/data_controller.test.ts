import {
  describe, expect, it, jest,
} from '@jest/globals';
import { CustomStore } from '@js/common/data';
import ajax from '@js/core/utils/ajax';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';
import type { DataObject } from './types';

const setup = (options?: Options) => {
  const context = getContext(options ?? {});

  return {
    optionsController: context.get(OptionsControllerMock),
    dataController: context.get(DataController),
  };
};

const generateData = (length: number) => [...new Array(length)].map((_, index) => ({ field: `test_${index}` }));

describe('DataController', () => {
  describe('pageIndex', () => {
    it('does not change after pageSize increased and pageIndex < pageCount', async () => {
      const { optionsController, dataController } = setup({
        dataSource: generateData(20),
        paging: {
          pageIndex: 1,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 10);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(1);
    });

    it('set to last page after pageSize increased and pageIndex >= pageCount', async () => {
      const { optionsController, dataController } = setup({
        dataSource: generateData(20),
        paging: {
          pageIndex: 3,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 10);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(1);
    });

    it('set to last and only page after pageSize increased and pageIndex >= pageCount == 1', async () => {
      const { optionsController, dataController } = setup({
        dataSource: generateData(20),
        paging: {
          pageIndex: 1,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 20);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(0);
    });
  });

  describe('totalCount is not specified', () => {
    it('with CustomStore', async () => {
      const { dataController } = setup({
        dataSource: new CustomStore({
          load: () => generateData(10),
        }),
      });

      await dataController.waitLoaded();

      expect(dataController.dataSource.value.totalCount()).toEqual(10);
    });

    it('with CustomStore and filter is applied', async () => {
      const { dataController } = setup({
        dataSource: new CustomStore({
          load: () => generateData(10),
        }),
        columns: ['field'],
        filterValue: ['field', 'anyof', ['test_0', 'test_1']],
      });
      await dataController.waitLoaded();

      expect(dataController.dataSource.value.totalCount()).toEqual(2);
    });
  });

  describe('regressions', () => {
    it('should work good with odata store', async () => {
      const sendRequestSpy = jest.spyOn(ajax, 'sendRequest').mockImplementation((params: any) => {
        const isFirstPage = params.data.$skip === undefined || params.data.$skip === 0;
        const firstPageItems = [{ Product_ID: 1 }, { Product_ID: 2 }, { Product_ID: 4 }];
        const secondPageItems = [{ Product_ID: 5 }, { Product_ID: 6 }, { Product_ID: 7 }];

        const response = {
          d: {
            results: isFirstPage ? firstPageItems : secondPageItems,
            __count: 10,
          },
        };

        // @ts-expect-error
        const deferred = new Deferred();
        deferred.resolve(response, 'success');

        return deferred.promise() as DeferredObj<{ Product_ID: number }[]>;
      });

      const { dataController } = setup({
        dataSource: {
          store: {
            type: 'odata',
            version: 2,
            url: 'https://www.example.com/odata',
            key: 'Product_ID',
          },
          select: [
            'Product_ID',
            'Product_Name',
            'Product_Cost',
            'Product_Sale_Price',
            'Product_Retail_Price',
            'Product_Current_Inventory',
          ],
          filter: ['Product_Current_Inventory', '>', 0],
        },
        keyExpr: 'Product_ID',
        columns: ['Product_ID', 'Product_Name'],
        paging: {
          pageSize: 3,
        },
      });

      const getCurrentItemIds = (): number[] => (
        dataController.items.value as (DataObject & { Product_ID: number })[]
      ).map((item) => item.Product_ID);

      const expectedFilter = 'Product_Current_Inventory gt 0';
      const expectedSelect = 'Product_ID,Product_Name,Product_Cost,Product_Sale_Price,Product_Retail_Price,Product_Current_Inventory';

      await dataController.waitLoaded();

      expect(dataController.pageIndex.value).toBe(0);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          $top: 3,
          $filter: expectedFilter,
          $select: expectedSelect,
        }),
      }));
      expect(getCurrentItemIds()).toEqual([1, 2, 4]);

      dataController.pageIndex.value = 1;
      await dataController.waitLoaded();

      expect(dataController.pageIndex.value).toBe(1);
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenLastCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          $top: 3,
          $skip: 3,
          $filter: expectedFilter,
          $select: expectedSelect,
        }),
      }));
      expect(getCurrentItemIds()).toEqual([5, 6, 7]);

      sendRequestSpy.mockRestore();
    });
  });
});
