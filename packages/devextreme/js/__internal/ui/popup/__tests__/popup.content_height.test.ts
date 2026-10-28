import {
  afterEach, beforeAll, beforeEach, describe, expect, it,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $, { type dxElementWrapper } from '@js/core/renderer';
import { PopupModel } from '@ts/ui/__tests__/__mock__/model/popup';

import Popup, { type PopupProperties } from '../popup';

type HeightLimit = 'maxHeight' | 'minHeight';

interface HeightLimitScenario {
  option: HeightLimit;
  value: string;
}

const OVERLAY_CONTENT_PADDING = 10;
const OFFSET = 2 * OVERLAY_CONTENT_PADDING;

const popups: Popup[] = [];

const createPopup = async (options: Partial<PopupProperties>): Promise<PopupModel> => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance = new Popup($element, options);
  popups.push(instance);

  await instance.show();

  return new PopupModel();
};

const vh = (count: number): number => (window.innerHeight / 100) * count;

describe('Popup content height limits with auto height', () => {
  let $style: dxElementWrapper = $('<style>');

  beforeAll(() => {
    fx.off = true;
  });

  beforeEach(() => {
    $style = $('<style>')
      .text(`.dx-overlay-content { padding: ${OVERLAY_CONTENT_PADDING}px; }`)
      .appendTo(document.head);
  });

  afterEach(() => {
    popups.forEach((popup) => popup.dispose());
    popups.length = 0;
    document.body.innerHTML = '';
    $style.remove();
  });

  it.each<HeightLimitScenario>([
    { option: 'maxHeight', value: 'calc(100vh - 20px)' },
    { option: 'maxHeight', value: 'calc(100% - 20px)' },
    { option: 'minHeight', value: 'calc(10vh + 50px)' },
  ])('keeps $option: $value in the content limit', async ({ option, value }) => {
    const model = await createPopup({ height: 'auto', [option]: value });

    expect(model.getContent().style[option]).toBe(`calc(${value} - ${OFFSET}px)`);
  });

  it.each<HeightLimitScenario & { expected: number }>([
    { option: 'maxHeight', value: '80vh', expected: vh(80) - OFFSET },
    { option: 'minHeight', value: '20vh', expected: vh(20) - OFFSET },
  ])('converts $option: $value to pixels in the content limit', async ({ option, value, expected }) => {
    const model = await createPopup({ height: 'auto', [option]: value });

    expect(parseFloat(model.getContent().style[option])).toBeCloseTo(expected);
  });
});
