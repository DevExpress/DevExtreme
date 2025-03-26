/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering/filter_controller';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { SearchController } from '../search/controller';
import { SortingController } from '../sorting_controller/sorting_controller';
import { ToolbarController } from '../toolbar/controller';
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
  const toolbarController = new ToolbarController(optionsController);

  const selectionController = new SelectionController(
    optionsController,
    dataController,
    itemsController,
    toolbarController,
  );

  return {
    selectionController,
    itemsController,
    toolbarController,
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

    describe('allowSelectAll', () => {
      describe('when it is true and selection mode is \'multiple\'', () => {
        it('selection should not work', () => {
          const {
            toolbarController,
          } = setup({
            keyExpr: 'id',
            dataSource: [{ id: 1, value: 'test' }],
            selection: {
              mode: 'multiple',
              allowSelectAll: true,
            },
          });

          expect(toolbarController.items.unreactive_get()).toMatchSnapshot();
        });
      });

      describe('when it is false and selection mode is \'multiple\'', () => {
        it('selection should not work', () => {
          const {
            toolbarController,
          } = setup({
            keyExpr: 'id',
            dataSource: [{ id: 1, value: 'test' }],
            selection: {
              mode: 'multiple',
              allowSelectAll: false,
            },
          });

          expect(toolbarController.items.unreactive_get()).toMatchSnapshot();
        });
      });

      describe('when it is true and selection mode isn\'t \'multiple\'', () => {
        it('selection should not work', () => {
          const {
            toolbarController,
          } = setup({
            keyExpr: 'id',
            dataSource: [{ id: 1, value: 'test' }],
            selection: {
              mode: 'single',
              allowSelectAll: true,
            },
          });

          expect(toolbarController.items.unreactive_get()).toMatchSnapshot();
        });
      });
    });
  });
});
