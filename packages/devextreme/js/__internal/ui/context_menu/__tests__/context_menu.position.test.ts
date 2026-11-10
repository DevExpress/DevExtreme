import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import { createEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import ContextMenu from '@ts/ui/context_menu/context_menu';

const instances: ContextMenu[] = [];

const createContextMenu = (): ContextMenu => {
  const $element = $('<div>').appendTo(document.body);

  const contextMenu = new ContextMenu($element.get(0) as HTMLElement, {
    items: [{ text: 'A' }],
  });
  instances.push(contextMenu);

  return contextMenu;
};

describe('ContextMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fx.off = true;
  });

  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
    fx.off = false;
    jest.useRealTimers();
  });

  describe('position.of is an event and target is not set', () => {
    it('should not throw', () => {
      const contextMenu = createContextMenu();
      const event = createEvent(new MouseEvent('contextmenu'), {});

      expect(() => contextMenu.option('position', { of: event })).not.toThrow();
    });

    it('should be shown on a document context menu event', () => {
      const contextMenu = createContextMenu();
      contextMenu.option('position', { of: createEvent(new MouseEvent('contextmenu'), {}) });

      document.body.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      jest.runAllTimers();

      expect(contextMenu.option('visible')).toBe(true);
    });
  });
});
