import {
  afterAll, afterEach, beforeAll, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import { PopoverModel } from '@ts/ui/__tests__/__mock__/model/popover';

import Popover, { type PopoverProperties } from '../popover';

interface RoleScenario {
  scenario: string;
  options: Partial<PopoverProperties>;
  role: string;
}

const popovers: PopoverModel[] = [];

const createPopover = async (options: Partial<PopoverProperties>): Promise<PopoverModel> => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Popover($element, options);

  await instance.show();

  const model = new PopoverModel();
  popovers.push(model);

  return model;
};

describe('Popover overlay content aria role', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    popovers.forEach((model) => model.getInstance().dispose());
    popovers.length = 0;
    document.body.innerHTML = '';
  });

  describe('derived from configuration', () => {
    const scenarios: RoleScenario[] = [
      { scenario: 'a default popover', options: {}, role: 'tooltip' },
      { scenario: 'toolbar items are specified', options: { toolbarItems: [{ text: 'OK' }] }, role: 'dialog' },
      {
        scenario: 'a title and a close button are shown',
        options: { showTitle: true, title: 'Title', showCloseButton: true },
        role: 'dialog',
      },
      { scenario: 'only a title is shown', options: { showTitle: true, title: 'Title' }, role: 'tooltip' },
      { scenario: 'only a close button is shown', options: { showCloseButton: true }, role: 'tooltip' },
    ];

    it.each(scenarios)('is "$role" when $scenario', async ({ options, role }) => {
      const model = await createPopover(options);

      expect(model.getRole()).toBe(role);
    });
  });

  describe('forced through _popoverContentRole', () => {
    it('uses the forced role regardless of the configuration predicate', async () => {
      const model = await createPopover({ _popoverContentRole: 'dialog' });

      expect(model.getRole()).toBe('dialog');
    });
  });

  describe('updated when the configuration changes at runtime', () => {
    it('switches to "dialog" when toolbar items are added', async () => {
      const model = await createPopover({});
      expect(model.getRole()).toBe('tooltip');

      model.getInstance().option('toolbarItems', [{ text: 'OK' }]);

      expect(model.getRole()).toBe('dialog');
    });

    it('switches back to "tooltip" when toolbar items are cleared', async () => {
      const model = await createPopover({ toolbarItems: [{ text: 'OK' }] });
      expect(model.getRole()).toBe('dialog');

      model.getInstance().option('toolbarItems', []);

      expect(model.getRole()).toBe('tooltip');
    });
  });

  describe('on a shown popover with focusable toolbar elements', () => {
    const originalGetClientRects = Element.prototype.getClientRects;

    beforeAll(() => {
      // jsdom performs no layout, so without this stub nothing counts as visible
      // and the toolbar buttons are never tabbable.
      Element.prototype.getClientRects = () => [{}] as unknown as DOMRectList;
    });

    afterAll(() => {
      Element.prototype.getClientRects = originalGetClientRects;
    });

    it('sets the role on the overlay content, not on the close button, when a title and a close button are enabled', async () => {
      const model = await createPopover({});

      model.getInstance().option({ showTitle: true, title: 'Title', showCloseButton: true });

      expect(model.getRole()).toBe('dialog');
      expect(model.getCloseButton()?.getAttribute('role')).toBe('button');
    });

    it('switches back to "tooltip" when the close button is hidden again', async () => {
      const model = await createPopover({});
      model.getInstance().option({ showTitle: true, title: 'Title', showCloseButton: true });

      model.getInstance().option('showCloseButton', false);

      expect(model.getRole()).toBe('tooltip');
      expect(model.getCloseButton()).toBeNull();
    });

    it('sets the role on the overlay content, not on the toolbar button, when toolbar items with a button are added', async () => {
      const model = await createPopover({});

      model.getInstance().option('toolbarItems', [{ widget: 'dxButton', options: { text: 'OK' } }]);

      expect(model.getRole()).toBe('dialog');
      expect(model.getToolbarButtons().map((button) => button.getAttribute('role'))).toEqual(['button']);
    });

    it('applies a forced _popoverContentRole to the overlay content, not to the close button', async () => {
      const model = await createPopover({ showTitle: true, title: 'Title', showCloseButton: true });

      model.getInstance().option('_popoverContentRole', 'tooltip');

      expect(model.getRole()).toBe('tooltip');
      expect(model.getCloseButton()?.getAttribute('role')).toBe('button');

      model.getInstance().option('_popoverContentRole', undefined);

      expect(model.getRole()).toBe('dialog');
      expect(model.getCloseButton()?.getAttribute('role')).toBe('button');
    });

    it('toggles aria-disabled on the overlay content when disabled changes', async () => {
      const model = await createPopover({ showTitle: true, title: 'Title', showCloseButton: true });

      model.getInstance().option('disabled', true);

      expect(model.getOverlayContent().getAttribute('aria-disabled')).toBe('true');

      model.getInstance().option('disabled', false);

      expect(model.getOverlayContent().getAttribute('aria-disabled')).toBeNull();
    });
  });
});
