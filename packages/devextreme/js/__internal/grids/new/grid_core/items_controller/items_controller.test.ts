/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';
import { SearchController } from '@ts/grids/new/grid_core/search';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { SortingController } from '../sorting_controller';
import { ItemsController } from './items_controller';

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);
  const columnsController = new ColumnsController(options);
  const filterController = new FilterController(options);
  const sortingController = new SortingController(options, columnsController);
  const searchController = new SearchController(options);
  const dataController = new DataController(options, sortingController, filterController);
  const itemsController = new ItemsController(
    dataController,
    columnsController,
    searchController,
  );

  return {
    options,
    dataController,
    columnsController,
    itemsController,
  };
};

describe('ItemsController', () => {
  describe('createDataRow', () => {
    it('should process data object to data row using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataRow = itemsController.createDataRow(dataObject, columns, 0);
      expect(dataRow).toMatchSnapshot();
    });

    it('should process data object to data row using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataRow = itemsController.createDataRow(dataObject, columns, 0, [1]);
      expect(dataRow).toMatchSnapshot();
    });
  });

  describe('setSelectionState', () => {
    it('should update the select state of the item', () => {
      const { itemsController } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, a: 'my a value' }],
      });

      itemsController.setSelectionState([1]);

      expect(itemsController.items).toMatchSnapshot();
    });
  });
});
