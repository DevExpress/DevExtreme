import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { value as viewPort } from '@js/core/utils/view_port';

import type { PopupControllerProperties } from '../popup_position_controller';
import { PopupPositionController } from '../popup_position_controller';

const SWATCH_CLASS = 'dx-swatch-custom';
const MODE_CLASS = 'dx-theme-mode-dark';
const MODE_STYLES = '.mode-dark { --dx-theme-mode: dark; }';

describe('PopupPositionController drag and resize area', () => {
  let viewPortElement: HTMLElement = document.createElement('div');

  const appended = (markup = ''): HTMLElement => {
    const element = document.createElement('div');

    element.innerHTML = markup;
    document.body.appendChild(element);

    return element;
  };

  const owner = (): dxElementWrapper => $(
    appended('<div class="owner"></div>').querySelector('.owner') as Element,
  );

  const ownerInSwatch = (): dxElementWrapper => $(
    appended(`<div class="${SWATCH_CLASS}"><div class="owner"></div></div>`)
      .querySelector('.owner') as Element,
  );

  const ownerInMode = (): dxElementWrapper => $(
    appended('<div class="owner mode-dark"></div>').querySelector('.owner') as Element,
  );

  const controllerFor = (
    properties: Partial<PopupControllerProperties>,
    $root: dxElementWrapper = owner(),
  ): PopupPositionController => new PopupPositionController({
    properties,
    elements: { $root, $content: $('<div>') },
  });

  const areaFor = (
    properties: Partial<PopupControllerProperties>,
    $root?: dxElementWrapper,
  ): unknown => controllerFor(properties, $root).$dragResizeContainer?.get(0);

  beforeEach(() => {
    document.head.innerHTML = `<style>${MODE_STYLES}</style>`;
    viewPortElement = appended();
    viewPortElement.className = 'dx-viewport';
    viewPort(viewPortElement);
  });

  afterEach(() => {
    viewPort(null);
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('is the view port when the application declares one', () => {
    expect(areaFor({})).toBe(viewPortElement);
  });

  it('is the window when the application declares no view port', () => {
    viewPort(null);

    expect(areaFor({})).toBe(window);
  });

  it('is the container the popup was given', () => {
    const container = appended();

    expect(areaFor({ container })).toBe(container);
  });

  it('is the area the popup was given, over its container', () => {
    const container = appended();
    const dragAndResizeArea = appended();

    expect(areaFor({ container, dragAndResizeArea })).toBe(dragAndResizeArea);
  });

  it('is the window when the popup may be dragged outside its boundary', () => {
    expect(areaFor({ dragAndResizeArea: appended(), dragOutsideBoundary: true })).toBe(window);
  });

  describe.each([
    { scope: 'a swatch', owner: ownerInSwatch, containerClass: SWATCH_CLASS },
    { scope: 'a theme mode', owner: ownerInMode, containerClass: MODE_CLASS },
  ])('for an element inside $scope', ({ owner: ownerInScope, containerClass }) => {
    it('is the view port, not the container the markup goes into', () => {
      const controller = controllerFor({}, ownerInScope());

      expect(controller.$dragResizeContainer?.get(0)).toBe(viewPortElement);
      expect(controller.$container?.get(0)?.classList.contains(containerClass)).toBe(true);
    });

    it('is still the container the popup was given', () => {
      const container = appended();

      expect(areaFor({ container }, ownerInScope())).toBe(container);
    });
  });
});
