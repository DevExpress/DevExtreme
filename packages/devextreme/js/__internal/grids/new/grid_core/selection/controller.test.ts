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
import { SelectionController } from './controller';

const setup = (config: Options = {}) => {
  const optionsController = new OptionsControllerMock({
    selection: {
      mode: 'single',
    },
    selectedCardKeys: [],
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

  describe('deselectCards', () => {
    it('should select item', () => {
      const {
        selectionController,
        itemsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      selectionController.deselectCards([1]);
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

    describe('when item is selected and multiple selection enabled', () => {
      it('should update the select state of the item', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selectedCardKeys: [1],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
          },
        });

        selectionController.changeCardSelection(0);
        expect(selectionController.getSelectedCardKeys()).toEqual([]);
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

  describe('getSelectedCards', () => {
    it('should return the selected card keys', () => {
      const {
        selectionController,
        itemsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      expect(selectionController.getSelectedCards())
        .toEqual(itemsController.items.unreactive_get());
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

  describe('isCheckBoxesRendered', () => {
    describe('when the selection mode is equal to \'none\'', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'none',
          },
        });

        expect(selectionController.isCheckBoxesRendered.unreactive_get()).toBe(false);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'always\'', () => {
      it('should return true', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
          },
        });

        expect(selectionController.isCheckBoxesRendered.unreactive_get()).toBe(true);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onClick\'', () => {
      it('should return true', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        expect(selectionController.isCheckBoxesRendered.unreactive_get()).toBe(true);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onLongTap\'', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onLongTap',
          },
        });

        expect(selectionController.isCheckBoxesRendered.unreactive_get()).toBe(false);
      });
    });
  });

  describe('isCheckBoxesVisible', () => {
    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onClick\'', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(false);
      });
    });

    describe('when selecting one card', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }, { id: 3, value: 'test3' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        selectionController.selectCards([1]);
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(false);
      });
    });

    describe('when selecting two cards', () => {
      it('should return true', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }, { id: 3, value: 'test3' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        selectionController.selectCards([1, 2]);
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(true);
      });
    });

    describe('when deselecting all cards', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }, { id: 3, value: 'test3' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
          selectedCardKeys: [1, 2],
        });

        selectionController.deselectCards([1, 2]);
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(false);
      });
    });
  });

  describe('needToHiddenCheckBoxes', () => {
    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onClick\'', () => {
      it('should return true', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        expect(selectionController.needToHiddenCheckBoxes.unreactive_get()).toBe(true);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'always\'', () => {
      it('should return false', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
          },
        });

        expect(selectionController.needToHiddenCheckBoxes.unreactive_get()).toBe(false);
      });
    });
  });

  describe('updateSelectionCheckBoxesVisible', () => {
    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onClick\'', () => {
      it('should show the selection checkboxes', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        selectionController.updateSelectionCheckBoxesVisible(true);
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(true);
      });

      it('should hide the selection checkboxes', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        selectionController.updateSelectionCheckBoxesVisible(false);
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(false);
      });
    });
  });

  describe('processLongTap', () => {
    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onLongTap\'', () => {
      it('should render the selection checkbox', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onLongTap',
          },
        });

        // @ts-expect-error
        selectionController.processLongTap({ index: 0 });
        expect(selectionController.isCheckBoxesRendered.unreactive_get()).toBe(true);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'onClick\'', () => {
      it('should show the selection checkbox', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'onClick',
          },
        });

        // @ts-expect-error
        selectionController.processLongTap({ index: 0 });
        expect(selectionController.isCheckBoxesVisible.unreactive_get()).toBe(true);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'none\'', () => {
      it('should select a first item', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'none',
          },
        });

        // @ts-expect-error
        selectionController.processLongTap({ index: 0 });
        expect(selectionController.getSelectedCardKeys()).toEqual([1]);
      });
    });

    describe('when the selection mode is equal to \'multiple\' and the showCheckBoxesMode is equal to \'none\'', () => {
      it('should not select a first item', () => {
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [{ id: 1, value: 'test' }],
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
          },
        });

        // @ts-expect-error
        selectionController.processLongTap({ index: 0 });
        expect(selectionController.getSelectedCardKeys()).toEqual([]);
      });
    });
  });
});
