import { describe, expect, it } from '@jest/globals';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering/filter_controller';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { SearchController } from '../search/controller';
import { SortingController } from '../sorting_controller/sorting_controller';
import { SelectionController } from './controller';

const setup = (config: Options = {}) => {
  const optionsController = new OptionsControllerMock({
    selection: {
      mode: 'single',
    },
    ...config,
  });

  const filterController = new FilterController(optionsController);
  const columnsController = new ColumnsController(optionsController);
  const sortingController = new SortingController(optionsController, columnsController);

  const dataController = new DataController(optionsController, sortingController, filterController);

  const searchController = new SearchController(optionsController);
  const itemsController = new ItemsController(dataController, columnsController, searchController);

  const selectionController = new SelectionController(
    optionsController,
    dataController,
    itemsController,
  );

  return {
    selectionController,
    itemsController,
  };
};

describe('Options', () => {
  describe('selectedCardKeys', () => {
    describe('when given', () => {
      it('should set the select state of the item', () => {
        const {
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selectedCardKeys: [1],
        });

        expect(itemsController.items).toMatchSnapshot();
      });
    });
  });

  describe('selection', () => {
    describe('mode', () => {
      describe('when it is \'none\'', () => {
        it('selection should not work', () => {
          const {
            itemsController,
            selectionController,
          } = setup({
            keyExpr: 'id',
            dataSource: [{ id: 1, value: 'test' }],
            selection: {
              mode: 'none',
            },
          });

          selectionController.selectCards([1]);
          expect(itemsController.items).toMatchSnapshot();
        });
      });
      describe('when it is \'none\' and the selectedCardKeys is specified', () => {
        it('selection should not apply', () => {
          const {
            itemsController,
          } = setup({
            keyExpr: 'id',
            dataSource: [{ id: 1, value: 'test' }],
            selectedCardKeys: [1],
            selection: {
              mode: 'none',
            },
          });

          expect(itemsController.items).toMatchSnapshot();
        });
      });
    });
  });
});
