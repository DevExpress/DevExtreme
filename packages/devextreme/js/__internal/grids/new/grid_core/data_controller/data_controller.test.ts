import { describe, expect, it } from '@jest/globals';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';

const setup = (options: Options) => {
  const context = getContext(options);

  return {
    optionsController: context.get(OptionsControllerMock),
    dataController: context.get(DataController),
  };
};

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
