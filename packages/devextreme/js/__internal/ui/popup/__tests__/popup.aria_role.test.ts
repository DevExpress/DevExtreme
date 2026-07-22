import {
  afterEach, beforeAll, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';

import Popup, { type PopupProperties } from '../popup';

interface RoleScenario {
  scenario: string;
  options: Partial<PopupProperties>;
}

const popups: PopupModel[] = [];

const createPopup = async (options: Partial<PopupProperties>): Promise<PopupModel> => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Popup($element, options);

  await instance.show();

  const model = new PopupModel();
  popups.push(model);

  return model;
};

describe('Popup overlay content aria role', () => {
  beforeAll(() => {
    fx.off = true;
  });

  afterEach(() => {
    popups.forEach((model) => model.getInstance().dispose());
    popups.length = 0;
    document.body.innerHTML = '';
  });

  describe('is always "dialog"', () => {
    const scenarios: RoleScenario[] = [
      { scenario: 'a default popup', options: {} },
      { scenario: 'a title is shown', options: { showTitle: true, title: 'Title' } },
      { scenario: 'no title is shown', options: { showTitle: false } },
      { scenario: 'toolbar items are specified', options: { toolbarItems: [{ text: 'OK' }] } },
    ];

    it.each(scenarios)('for $scenario', async ({ options }) => {
      const model = await createPopup(options);

      expect(model.getRole()).toBe('dialog');
    });
  });
});
