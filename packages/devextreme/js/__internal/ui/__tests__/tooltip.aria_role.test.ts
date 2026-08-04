import {
  afterEach, beforeAll, describe, expect, it,
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
});
