import {
  afterAll, afterEach, beforeAll, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import { TooltipModel } from '@ts/ui/__tests__/__mock__/model/tooltip';

import Tooltip, { type TooltipProperties } from '../tooltip';

interface RoleScenario {
  scenario: string;
  options: Partial<TooltipProperties>;
  role: string;
}

const tooltips: TooltipModel[] = [];

const createTooltip = async (options: Partial<TooltipProperties>): Promise<TooltipModel> => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Tooltip($element, options);

  await instance.show();

  const model = new TooltipModel();
  tooltips.push(model);

  return model;
};

describe('Tooltip overlay content aria role', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    tooltips.forEach((model) => model.getInstance().dispose());
    tooltips.length = 0;
    document.body.innerHTML = '';
  });

  describe('derived from configuration', () => {
    const scenarios: RoleScenario[] = [
      { scenario: 'a default tooltip', options: {}, role: 'tooltip' },
      { scenario: 'toolbar items are specified', options: { toolbarItems: [{ text: 'OK' }] }, role: 'dialog' },
      {
        scenario: 'a title and a close button are shown',
        options: { showTitle: true, title: 'Title', showCloseButton: true },
        role: 'tooltip',
      },
    ];

    it.each(scenarios)('is "$role" when $scenario', async ({ options, role }) => {
      const model = await createTooltip(options);

      expect(model.getRole()).toBe(role);
    });
  });

  describe('on a shown tooltip with focusable toolbar elements', () => {
    const originalGetClientRects = Element.prototype.getClientRects;

    beforeAll(() => {
      // jsdom performs no layout, so without this stub nothing counts as visible
      // and the toolbar buttons are never tabbable.
      Element.prototype.getClientRects = () => [{}] as unknown as DOMRectList;
    });

    afterAll(() => {
      Element.prototype.getClientRects = originalGetClientRects;
    });

    it('sets the role on the overlay content, not on the toolbar button, when toolbar items with a button are added', async () => {
      const model = await createTooltip({});

      model.getInstance().option('toolbarItems', [{ widget: 'dxButton', options: { text: 'OK' } }]);

      expect(model.getRole()).toBe('dialog');
      expect(model.getToolbarButtons().map((button) => button.getAttribute('role'))).toEqual(['button']);
    });
  });
});
