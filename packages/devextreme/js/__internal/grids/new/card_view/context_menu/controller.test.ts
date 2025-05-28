import {
  describe, expect, it, jest,
} from '@jest/globals';
import dxContextMenu from '@js/ui/context_menu';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { ContextMenuController } from './controller';

const setup = (options: Options) => {
  const context = getContext(options);
  const controller = context.get(ContextMenuController);

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
