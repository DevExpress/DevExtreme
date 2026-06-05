import {
  describe, expect, it, jest,
} from '@jest/globals';

import { DataController } from '../data_controller';
import { getContext } from '../di.test_utils';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { SelectionController } from './controller';

const setup = (config: Options = {}) => {
  const context = getContext({
    selection: {
      mode: 'single',
    },
    selectedCardKeys: [],
    ...config,
  });

  return {
    optionsController: context.get(OptionsControllerMock),
    selectionController: context.get(SelectionController),
    itemsController: context.get(ItemsController),
    dataController: context.get(DataController),
  };
};

describe('SelectionController', () => {
  // Public methods

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

    it('should only be called once when selectedCardKeys are updated', () => {
      const {
        selectionController,
        optionsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }, { id: 2, value: 'test2' }],
        selection: {
          mode: 'multiple',
        },
      });

      const selectCardsSpy = jest.spyOn(selectionController, 'selectCards');

      optionsController.option('selectedCardKeys', [1]);

      expect(selectCardsSpy).toHaveBeenCalledTimes(1);

      optionsController.option('selectedCardKeys', []);

      expect(selectCardsSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deselectCards', () => {
    it('should deselect item', () => {
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

  describe('selectCardsByIndexes', () => {
    it('should select item', () => {
      const {
        selectionController,
        itemsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
      });

      selectionController.selectCardsByIndexes([0]);
      expect(itemsController.items).toMatchSnapshot();
    });
  });

  describe('deselectCardsByIndexes', () => {
    it('should deselect item', () => {
      const {
        selectionController,
        itemsController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      selectionController.deselectCardsByIndexes([0]);
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

  describe('getSelectedCardsData', () => {
    it('should return the selected cards data', () => {
      const {
        selectionController,
        dataController,
      } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, value: 'test' }],
        selectedCardKeys: [1],
      });

      expect(selectionController.getSelectedCardsData())
        .toEqual(dataController.items.peek());
    });

    describe('when the selected cards are on different pages', () => {
      it('should return data for all selected cards', () => {
        const {
          selectionController,
          dataController,
        } = setup({
          keyExpr: 'id',
          dataSource: [
            { id: 1, value: 'test1' },
            { id: 2, value: 'test2' },
            { id: 3, value: 'test3' },
          ],
          selectedCardKeys: [1, 3],
          paging: {
            enabled: true,
            pageSize: 2,
          },
        });

        expect(dataController.items.peek())
          .toEqual([
            { id: 1, value: 'test1' },
            { id: 2, value: 'test2' },
          ]);
        expect(selectionController.getSelectedCardsData())
          .toEqual([
            { id: 1, value: 'test1' },
            { id: 3, value: 'test3' },
          ]);
      });
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(true);
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(false);
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
        expect(selectionController.isCheckBoxesRendered.peek()).toBe(true);
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(true);
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

  // Public properties
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

        expect(selectionController.isCheckBoxesRendered.peek()).toBe(false);
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

        expect(selectionController.isCheckBoxesRendered.peek()).toBe(true);
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

        expect(selectionController.isCheckBoxesRendered.peek()).toBe(true);
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

        expect(selectionController.isCheckBoxesRendered.peek()).toBe(false);
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

        expect(selectionController.isCheckBoxesVisible.peek()).toBe(false);
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(false);
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(true);
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
        expect(selectionController.isCheckBoxesVisible.peek()).toBe(false);
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

        expect(selectionController.needToHiddenCheckBoxes.peek()).toBe(true);
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

        expect(selectionController.needToHiddenCheckBoxes.peek()).toBe(false);
      });
    });
  });

  // Events

  describe('onSelectionChanging', () => {
    describe('when selecting a card', () => {
      it('should be called', () => {
        const selectionChangingMockFn = jest.fn();
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.selectCards([1]);

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel: false,
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1],
          selectedCardsData: [cardData],
        }]);
      });
    });

    describe('when deselecting a card', () => {
      it('should be called', () => {
        const selectionChangingMockFn = jest.fn();
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          selectedCardKeys: [1],
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.deselectCards([1]);

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel: false,
          currentDeselectedCardKeys: [1],
          currentSelectedCardKeys: [],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [],
          selectedCardsData: [],
        }]);
      });
    });

    describe('when selecting all cards', () => {
      it('should be called', () => {
        const selectionChangingMockFn = jest.fn();
        const data = [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }];
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: data,
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
          },
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.selectAll();

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel: false,
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1, 2],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1, 2],
          selectedCardsData: data,
        }]);
      });
    });

    describe('when deselecting all cards', () => {
      it('should be called', () => {
        const selectionChangingMockFn = jest.fn();
        const data = [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }];
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: data,
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
          },
          selectedCardKeys: [1, 2],
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.deselectAll();

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel: false,
          currentDeselectedCardKeys: [1, 2],
          currentSelectedCardKeys: [],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [],
          selectedCardsData: [],
        }]);
      });
    });

    describe('when a cancel arg is specified as true', () => {
      it('should be called', () => {
        const selectionChangingMockFn = jest.fn((e: any) => { e.cancel = true; });
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.selectCards([1]);

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel: true,
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1],
          selectedCardsData: [cardData],
        }]);
        expect(selectionController.getSelectedCardKeys()).toEqual([]);
      });
    });

    describe('when a cancel arg is specified as Promise', () => {
      it('should be called', () => {
        const cancel = Promise.resolve(true);
        const selectionChangingMockFn = jest.fn((e: any) => { e.cancel = cancel; });
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          onSelectionChanging: selectionChangingMockFn,
        });

        selectionController.selectCards([1]);

        expect(selectionChangingMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangingMockFn.mock.lastCall).toMatchObject([{
          cancel,
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1],
          selectedCardsData: [cardData],
        }]);
        expect(selectionController.getSelectedCardKeys()).toEqual([]);
      });
    });
  });

  describe('onSelectionChanged', () => {
    describe('when selecting a card', () => {
      it('should be called', () => {
        const selectionChangedMockFn = jest.fn();
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          onSelectionChanged: selectionChangedMockFn,
        });

        selectionController.selectCards([1]);

        expect(selectionChangedMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangedMockFn.mock.lastCall).toMatchObject([{
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1],
          selectedCardsData: [cardData],
        }]);
      });
    });

    describe('when deselecting a card', () => {
      it('should be called', () => {
        const selectionChangedMockFn = jest.fn();
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
          selectedCardKeys: [1],
          onSelectionChanged: selectionChangedMockFn,
        });

        selectionController.deselectCards([1]);

        expect(selectionChangedMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangedMockFn.mock.lastCall).toMatchObject([{
          currentDeselectedCardKeys: [1],
          currentSelectedCardKeys: [],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [],
          selectedCardsData: [],
        }]);
      });
    });

    describe('when selection changes via selectionChanged callback', () => {
      it('should update both selectionController and itemsController selection states when selecting single card', () => {
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
        });

        // Set up the spy before calling the method
        const setSelectionStateSpy = jest.spyOn(itemsController, 'setSelectionState');

        // Mock the selectionChanged private method call with test data
        const selectionChangedEvent = {
          addedItemKeys: [1],
          removedItemKeys: [],
          selectedItemKeys: [1],
          selectedItems: [cardData],
        };

        // Call the private method directly
        // @ts-expect-error - accessing private method
        selectionController.selectionChanged(selectionChangedEvent);

        // Verify that both controllers were updated
        expect(selectionController.getSelectedCardKeys()).toEqual([1]);

        // Check that the itemsController was updated with the same keys
        expect(setSelectionStateSpy).toHaveBeenCalledWith([1]);

        // Verify the UI would show correct selection state
        const items = itemsController.items.peek();
        expect(items[0].isSelected).toBe(true);
      });

      it('should update both selectionController and itemsController when selecting multiple cards', () => {
        const cardsData = [
          { id: 1, value: 'test1' },
          { id: 2, value: 'test2' },
          { id: 3, value: 'test3' },
        ];
        const {
          selectionController,
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: cardsData,
          selection: {
            mode: 'multiple',
          },
        });

        // Set up the spy before calling the method
        const setSelectionStateSpy = jest.spyOn(itemsController, 'setSelectionState');

        // Mock the selectionChanged private method call with test data
        const selectionChangedEvent = {
          addedItemKeys: [1, 3],
          removedItemKeys: [],
          selectedItemKeys: [1, 3],
          selectedItems: [cardsData[0], cardsData[2]],
        };

        // Call the private method directly
        // @ts-expect-error - accessing private method
        selectionController.selectionChanged(selectionChangedEvent);

        // Verify that both controllers were updated
        expect(selectionController.getSelectedCardKeys()).toEqual([1, 3]);

        // Check that the itemsController was updated with the same keys
        expect(setSelectionStateSpy).toHaveBeenCalledWith([1, 3]);

        // Verify the UI would show correct selection state
        const items = itemsController.items.peek();
        expect(items[0].isSelected).toBe(true);
        expect(items[1].isSelected).toBe(false);
        expect(items[2].isSelected).toBe(true);
      });

      it('should update both selectionController and itemsController when deselecting cards', () => {
        const cardsData = [
          { id: 1, value: 'test1' },
          { id: 2, value: 'test2' },
          { id: 3, value: 'test3' },
        ];
        const {
          selectionController,
          itemsController,
        } = setup({
          keyExpr: 'id',
          dataSource: cardsData,
          selection: {
            mode: 'multiple',
          },
          selectedCardKeys: [1, 2, 3],
        });

        // Initially all cards should be selected
        expect(itemsController.items.peek()[0].isSelected).toBe(true);
        expect(itemsController.items.peek()[1].isSelected).toBe(true);
        expect(itemsController.items.peek()[2].isSelected).toBe(true);

        // Set up the spy before calling the method
        const setSelectionStateSpy = jest.spyOn(itemsController, 'setSelectionState');

        // Mock the selectionChanged event when deselecting card #2
        const selectionChangedEvent = {
          addedItemKeys: [],
          removedItemKeys: [2],
          selectedItemKeys: [1, 3],
          selectedItems: [cardsData[0], cardsData[2]],
        };

        // Call the private method directly
        // @ts-expect-error - accessing private method
        selectionController.selectionChanged(selectionChangedEvent);

        // Verify that both controllers were updated
        expect(selectionController.getSelectedCardKeys()).toEqual([1, 3]);

        // Check that the itemsController was updated with the same keys
        expect(setSelectionStateSpy).toHaveBeenCalledWith([1, 3]);

        // Verify the UI would show correct selection state
        const items = itemsController.items.peek();
        expect(items[0].isSelected).toBe(true);
        expect(items[1].isSelected).toBe(false);
        expect(items[2].isSelected).toBe(true);
      });

      it('should throw error E1042 if keyExpr is missing and selectionChanged', () => {
        const cardData = { id: 1, value: 'test' };
        const {
          selectionController,
        } = setup({
          dataSource: [cardData],
          selection: {
            mode: 'multiple',
          },
        });

        // Mock the selectionChanged private method call with test data
        const selectionChangedEvent = {
          addedItemKeys: [1],
          removedItemKeys: [],
          selectedItemKeys: [1],
          selectedItems: [cardData],
        };

        expect(() => {
          // @ts-expect-error - accessing private method
          selectionController.selectionChanged(selectionChangedEvent);
        }).toThrowError('E1042');
      });
    });

    describe('when selecting all cards', () => {
      it('should be called', () => {
        const selectionChangedMockFn = jest.fn();
        const data = [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }];
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: data,
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
          },
          onSelectionChanged: selectionChangedMockFn,
        });

        selectionController.selectAll();

        expect(selectionChangedMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangedMockFn.mock.lastCall).toMatchObject([{
          currentDeselectedCardKeys: [],
          currentSelectedCardKeys: [1, 2],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [1, 2],
          selectedCardsData: data,
        }]);
      });
    });

    describe('when deselecting all cards', () => {
      it('should be called', () => {
        const selectionChangedMockFn = jest.fn();
        const data = [{ id: 1, value: 'test1' }, { id: 2, value: 'test2' }];
        const {
          selectionController,
        } = setup({
          keyExpr: 'id',
          dataSource: data,
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
          },
          selectedCardKeys: [1, 2],
          onSelectionChanged: selectionChangedMockFn,
        });

        selectionController.deselectAll();

        expect(selectionChangedMockFn.mock.calls).toHaveLength(1);
        expect(selectionChangedMockFn.mock.lastCall).toMatchObject([{
          currentDeselectedCardKeys: [1, 2],
          currentSelectedCardKeys: [],
          isDeselectAll: false,
          isSelectAll: false,
          selectedCardKeys: [],
          selectedCardsData: [],
        }]);
      });
    });
  });
});
