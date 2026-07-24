import {
  afterEach, beforeAll, describe, expect, it,
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

  describe('forced through _overlayContentRole', () => {
    it('uses the forced role regardless of the configuration predicate', async () => {
      const model = await createPopover({ _overlayContentRole: 'dialog' });

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
});
