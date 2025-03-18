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
    optionsController,
    selectionController,
    itemsController,
  };
};

describe('SelectionController', () => {
  describe('selectCards', () => {
    it('should select item', () => {
      const {
        selectionController,
        itemsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
      });

      selectionController.selectCards([1]);
      expect(itemsController.items).toMatchSnapshot();
    });
  });

  describe('changeCardSelection', () => {
    describe('when the control arg equal to false', () => {
      it('should update the select state of the item', () => {
        const {
          selectionController,
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
        });

        selectionController.changeCardSelection(0, { control: false });
        expect(itemsController.items).toMatchSnapshot();
      });
    });

    describe('when the control arg equal to true', () => {
      it('should update the select state of the item', () => {
        const {
          selectionController,
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selectedCardKeys: [1],
        });

        selectionController.changeCardSelection(0, { control: true });
        expect(itemsController.items).toMatchSnapshot();
      });
    });
  });

  describe('isCardSelected', () => {
    describe('when the selectedCardKeys is specified', () => {
      it('should return true', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selectedCardKeys: [1],
        });

        expect(selectionController.isCardSelected(1)).toBe(true);
      });
    });

    describe('when the selectedCardKeys isn\'t specified', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
        });

        expect(selectionController.isCardSelected(1)).toBe(false);
      });
    });
  });

  describe('getSelectedCardKeys', () => {
    it('should return the selected card keys', () => {
      const {
        selectionController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      expect(selectionController.getSelectedCardKeys()).toEqual([1]);
    });
  });

  describe('clearSelection', () => {
    it('should clear the selection', () => {
      const {
        selectionController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      selectionController.clearSelection();
      expect(selectionController.getSelectedCardKeys().length).toBe(0);
    });
  });
});
