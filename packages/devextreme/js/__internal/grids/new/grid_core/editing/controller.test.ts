/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from '../toolbar/controller';
import { EditingController } from './controller';
import type { Options } from './options';

const setup = (options: Options) => {
  const optionsController = new OptionsControllerMock(options);
  const toolbarController = new ToolbarController(optionsController);
  const editingController = new EditingController(toolbarController, optionsController);

  return {
    optionsController,
    toolbarController,
    editingController,
  };
};

describe('EditingController', () => {
  describe('addButton', () => {
    it('should be added to toolbar', () => {
      const { toolbarController } = setup({});

      expect(
        toolbarController.items.unreactive_get(),
      ).toMatchSnapshot('should contain correct text, css class');
    });
  });
});
