import { describe, expect, it } from '@jest/globals';

import { getContext } from '../di.test_utils';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { ToolbarController } from '../toolbar/controller';
import { SelectionController } from './controller';

const setup = (config: Options = {}) => {
  const context = getContext({
    selection: {
      mode: 'single',
    },
    ...config,
  });

  return {
    selectionController: context.get(SelectionController),
    itemsController: context.get(ItemsController),
    toolbarController: context.get(ToolbarController),
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

          expect(toolbarController.items.peek()).toMatchSnapshot();
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

          expect(toolbarController.items.peek()).toMatchSnapshot();
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

          expect(toolbarController.items.peek()).toMatchSnapshot();
        });
      });
    });
  });
});
