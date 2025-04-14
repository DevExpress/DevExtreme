import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { PositioningEvent } from '@js/ui/context_menu';
import dxContextMenu from '@js/ui/context_menu';

import { ContextMenuControllerMock } from './controller.mock';

const setup = () => {
  const controller = new ContextMenuControllerMock();

  const container = document.createElement('div');
  // eslint-disable-next-line new-cap
  const contextMenu = new dxContextMenu(container, {
    onPositioning: controller.onPositioning,
  });

  // @ts-expect-error
  controller.contextMenuRef = { current: contextMenu };

  return { controller, contextMenu };
};

describe('Core ContextMenu', () => {
  describe('Controller', () => {
    it('show()', () => {
      const { controller, contextMenu } = setup();

      jest.spyOn(controller, 'getItems').mockReturnValue([{ text: 'test1' }]);
      jest.spyOn(controller, 'onPositioning');

      const target = document.createElement('div');
      const event = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target,
      };

      const onShowing = jest.fn();
      contextMenu.option('onShowing', onShowing);

      controller.show(event as any, 'test view', { data: 'test' });

      expect(controller.getItems).toHaveBeenCalledTimes(1);
      expect(controller.getItems).toHaveBeenCalledWith('test view', target, { data: 'test' });

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      expect(onShowing).toHaveBeenCalledTimes(1);

      expect(contextMenu.option('items')).toEqual([{ text: 'test1' }]);
    });

    it('getItems() is called only once when show() is fired several times for the same event', () => {
      const { controller } = setup();

      jest.spyOn(controller, 'getItems').mockReturnValue([{ text: 'test1' }]);

      const target = document.createElement('div');
      const event = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        target,
      };

      controller.show(event as any, 'test view', { data: 'test' });
      controller.show(event as any, 'test view', { data: 'test' });

      expect(controller.getItems).toHaveBeenCalledTimes(1);
    });

    it('onPositioning() sets event to position.of', () => {
      const { controller } = setup();

      const event = {
        target: document.createElement('div'),
      };

      controller.show(event as any, 'test view');

      const e = { position: {} } as PositioningEvent;

      controller.onPositioning(e);

      expect(e.position.of).toBe(event);
    });
  });
});
