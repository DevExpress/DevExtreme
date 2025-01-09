/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/dot-notation */
import { describe, expect, it } from '@jest/globals';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from './controller';

const createToolbarController = (options?: Options): {
  toolbarController: ToolbarController;
  optionsController: OptionsControllerMock;
} => {
  const optionsController = new OptionsControllerMock(options ?? {
    toolbar: {
      visible: true,
    },
  });

  const toolbarController = new ToolbarController(optionsController);

  return {
    toolbarController,
    optionsController,
  };
};

describe('ToolbarController', () => {
  describe('items', () => {
    describe('when user items are specified', () => {
      it('should contain processed toolbar items', () => {
        const { toolbarController } = createToolbarController({
          toolbar: {
            items: [{ location: 'before' }],
          },
        });

        expect(toolbarController.items.unreactive_get()).toStrictEqual([{ location: 'before' }]);
      });
    });

    describe('when default items and user items are specified', () => {
      it('should contain processed toolbar items', () => {
        const { toolbarController } = createToolbarController({
          toolbar: {
            items: ['searchPanel', { location: 'before' }],
          },
        });

        toolbarController.addDefaultItem({ name: 'searchPanel', location: 'after' });

        expect(toolbarController.items.unreactive_get()).toStrictEqual([
          { name: 'searchPanel', location: 'after' },
          { location: 'before' },
        ]);
      });
    });
  });

  describe('addDefaultItem', () => {
    it('should add new default item to items', () => {
      const { toolbarController } = createToolbarController();

      toolbarController.addDefaultItem({ name: 'searchPanel', location: 'after' });

      expect(toolbarController.items.unreactive_get()).toStrictEqual([
        { name: 'searchPanel', location: 'after' },
      ]);
    });
  });

  describe('removeDefaultItem', () => {
    it('should remove given default item from items', () => {
      const { toolbarController } = createToolbarController();

      toolbarController.addDefaultItem({ name: 'searchPanel', location: 'after' });

      expect(toolbarController.items.unreactive_get()).toStrictEqual([
        { name: 'searchPanel', location: 'after' },
      ]);

      toolbarController.removeDefaultItem('searchPanel');

      expect(toolbarController.items.unreactive_get()).toStrictEqual([]);
    });
  });
});
