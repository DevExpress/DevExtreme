import { describe, expect, it } from '@jest/globals';
import { CustomStore } from '@js/common/data';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';

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

  describe('when totalCount is not specified', () => {
    it('works with CustomStore', async () => {
      try {
        const { dataController } = setup({
          dataSource: new CustomStore({
            load: () => generateData(10),
          }),
          paging: {
            pageSize: 3,
          },
        });

        await dataController.waitLoaded();

        expect(dataController.dataSource.value.totalCount()).toEqual(3);
      } catch (err) {
        expect(false).toBeTruthy();
      }
    });

    it('works with json url', async () => {
      try {
        const { dataController } = setup({
          dataSource: 'https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/data/customers.json',
          paging: {
            pageSize: 3,
          },
        });

        await dataController.waitLoaded();

        expect(dataController.dataSource.value.totalCount()).toEqual(3);
      } catch (err) {
        expect(false).toBeTruthy();
      }
    });
  });

  describe('regressions', () => {
    it('should work good with odata store', async () => {
      const { dataController } = setup({
        dataSource: {
          store: {
            type: 'odata',
            version: 2,
            url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
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

      const getCurrentItemIds = () => dataController.items.value.map((item) => item.Product_ID);

      await dataController.waitLoaded();

      expect(dataController.pageIndex.value).toBe(0);
      expect(getCurrentItemIds()).toEqual([1, 2, 4]);

      dataController.pageIndex.value = 1;
      await dataController.waitLoaded();

      expect(dataController.pageIndex.value).toBe(1);
      expect(getCurrentItemIds()).toEqual([5, 6, 7]);
    });
  });
});
