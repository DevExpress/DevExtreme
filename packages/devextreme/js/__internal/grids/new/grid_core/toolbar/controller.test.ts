import { describe, expect, it } from '@jest/globals';
import { signal } from '@ts/core/reactive/index';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from './controller';

const setup = (config?: Options) => {
  const context = getContext(config ?? {
    toolbar: {
      visible: true,
    },
  });

  return {
    toolbarController: context.get(ToolbarController),
    optionsController: context.get(OptionsControllerMock),
  };
};

describe('ToolbarController', () => {
  describe('items', () => {
    describe('when user items are specified', () => {
      it('should contain processed toolbar items', () => {
        const { toolbarController } = setup({
          toolbar: {
            items: [{ location: 'before' }],
          },
        });

        expect(toolbarController.items.peek()).toStrictEqual([{ location: 'before' }]);
      });
    });

    describe('when default items and user items are specified', () => {
      it('should contain processed toolbar items', () => {
        const { toolbarController } = setup({
          toolbar: {
            items: ['searchPanel', { location: 'before' }],
          },
        });

        toolbarController.addDefaultItem(signal({ name: 'searchPanel', location: 'after' }));

        expect(toolbarController.items.peek()).toStrictEqual([
          { name: 'searchPanel', location: 'after' },
          { location: 'before' },
        ]);
      });
    });
  });

  describe('addDefaultItem', () => {
    it('should add new default item to items', () => {
      const { toolbarController } = setup();

      toolbarController.addDefaultItem(signal({ name: 'searchPanel', location: 'after' }));

      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'searchPanel', location: 'after' },
      ]);
    });

    it('item should toggle default item when needUpdate changes', () => {
      const { toolbarController } = setup();
      const needRender = signal(true);

      toolbarController.addDefaultItem(signal({ name: 'searchPanel', location: 'after' }), needRender);

      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'searchPanel', location: 'after' },
      ]);

      needRender.value = false;
      expect(toolbarController.items.peek()).toStrictEqual([]);

      needRender.value = true;
      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'searchPanel', location: 'after' },
      ]);
    });

    it('should add item with order specified in consts', () => {
      const { toolbarController } = setup();
      const needRender = signal(true);

      toolbarController.addDefaultItem(signal({ name: 'addCardButton' }), needRender);
      toolbarController.addDefaultItem(signal({ name: 'searchPanel' }), signal(true));

      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'addCardButton' },
        { name: 'searchPanel' },
      ]);

      needRender.value = false;
      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'searchPanel' },
      ]);

      needRender.value = true;
      expect(toolbarController.items.peek()).toStrictEqual([
        { name: 'addCardButton' },
        { name: 'searchPanel' },
      ]);
    });
  });
});
