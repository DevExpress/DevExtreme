import {
  describe, expect, it, jest,
} from '@jest/globals';
import dxContextMenu from '@js/ui/context_menu';

import { ColumnsController } from '../../grid_core/columns_controller/index';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller.mock';
import { ContextMenuControllerMock } from './controller.mock';

const setup = (options: Options) => {
  const optionsController = new OptionsControllerMock(options);
  const columnsController = new ColumnsController(optionsController);
  const controller = new ContextMenuControllerMock(columnsController, optionsController);

  const container = document.createElement('div');
  // eslint-disable-next-line new-cap
  const contextMenu = new dxContextMenu(container, {
    onPositioning: controller.onPositioning,
  });

  // @ts-expect-error
  controller.contextMenuRef = { current: contextMenu };

  return { controller, contextMenu };
};

describe('ContextMenu', () => {
  describe('Controller', () => {
    it('onContextMenuPreparing is called on getItems()', () => {
      const onContextMenuPreparing = jest.fn();
      const { controller } = setup({
        onContextMenuPreparing,
      });

      controller.getItems('content', document.createElement('div'));

      expect(onContextMenuPreparing).toHaveBeenCalledTimes(1);
    });
  });
});
