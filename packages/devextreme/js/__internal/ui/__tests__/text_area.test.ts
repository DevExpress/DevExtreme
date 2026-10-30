import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/text_area';
import TextArea from '@js/ui/text_area';

import { TextAreaModel } from './__mock__/model/text_area';

const AUTO_RESIZE_CLASS = 'dx-texteditor-input-auto-resize';
const TEXTAREA_CLASS = 'dx-textarea';
const LONG_TEXT_HEIGHT = 300;
const SHORT_TEXT_HEIGHT = 50;
const CONTAINER_HEIGHT = 200;

type ComputedHeights = Partial<Record<'minHeight' | 'maxHeight' | 'height', string>>;

const instances: TextArea[] = [];

const createTextArea = (options: Properties): TextAreaModel => {
  const $container = $('<div>').appendTo(document.body);

  Object.defineProperty($container.get(0), 'offsetHeight', { value: CONTAINER_HEIGHT });

  const $element = $('<div>').appendTo($container);

  instances.push(new TextArea($element.get(0) as HTMLElement, options));

  return new TextAreaModel($element.get(0) as HTMLElement);
};

const mockScrollHeight = (height: number): void => {
  jest.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(height);
};

// jsdom does not resolve CSS values, so each test gives the values a browser computes
const mockComputedStyle = (getHeights: (element: Element) => ComputedHeights): void => {
  const getComputedStyle = window.getComputedStyle.bind(window);

  jest.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    const style = getComputedStyle(element, pseudoElement);
    const heights = getHeights(element);

    return new Proxy(style, {
      get: (target, property): unknown => {
        if (property in heights) {
          return heights[property as keyof ComputedHeights];
        }

        const value: unknown = Reflect.get(target, property);

        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  });
};

const mockRootStyle = (heights: ComputedHeights): void => {
  mockComputedStyle((element) => (element.classList.contains(TEXTAREA_CLASS) ? heights : {}));
};

describe('TextArea', () => {
  afterEach(() => {
    instances.forEach((instance) => instance.dispose());
    instances.length = 0;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  describe('maxHeight with autoResizeEnabled', () => {
    beforeEach(() => {
      mockScrollHeight(LONG_TEXT_HEIGHT);
    });

    it.each([
      { maxHeight: 160, computed: '160px', expected: '160px' },
      { maxHeight: '120px', computed: '120px', expected: '120px' },
      { maxHeight: '30vh', computed: '240px', expected: '240px' },
      { maxHeight: '10em', computed: '140px', expected: '140px' },
      { maxHeight: 'calc(100vh - 600px)', computed: '200px', expected: '200px' },
      { maxHeight: 'min(150px, 50vh)', computed: '150px', expected: '150px' },
      { maxHeight: 'inherit', computed: '180px', expected: '180px' },
      { maxHeight: '50%', computed: '50%', expected: '100px' },
    ])('should limit the input by maxHeight: $maxHeight', ({ maxHeight, computed, expected }) => {
      mockRootStyle({ maxHeight: computed });

      const input = createTextArea({ autoResizeEnabled: true, maxHeight }).getInputElement();

      expect(input.style.height).toBe(expected);
      expect(input.classList.contains(AUTO_RESIZE_CLASS)).toBe(false);
    });

    it.each([
      { maxHeight: 'none', computed: 'none' },
      { maxHeight: 'auto', computed: 'none' },
    ])('should not limit the input when maxHeight is $maxHeight', ({ maxHeight, computed }) => {
      mockRootStyle({ maxHeight: computed });

      const input = createTextArea({ autoResizeEnabled: true, maxHeight }).getInputElement();

      expect(input.style.height).toBe(`${LONG_TEXT_HEIGHT}px`);
      expect(input.classList.contains(AUTO_RESIZE_CLASS)).toBe(true);
    });

    it('should read a percentage inside a function against the container height', () => {
      const maxHeight = 'calc(100% - 20px)';

      mockComputedStyle((element) => {
        if (element.classList.contains(TEXTAREA_CLASS)) {
          return { maxHeight };
        }

        const { style, parentElement } = element as HTMLElement;

        return style.height === maxHeight
          ? { height: `${parseFloat(String(parentElement?.style.height)) - 20}px` }
          : {};
      });

      const model = createTextArea({ autoResizeEnabled: true, maxHeight });

      expect(model.getInputElement().style.height).toBe(`${CONTAINER_HEIGHT - 20}px`);
      expect(model.getElement().children).toHaveLength(1);
    });

    it('should not limit the input when the browser cannot resolve maxHeight', () => {
      mockRootStyle({ maxHeight: 'calc(100% - 20px)' });

      const input = createTextArea({
        autoResizeEnabled: true,
        maxHeight: 'calc(100% - 20px)',
      }).getInputElement();

      expect(input.style.height).toBe(`${LONG_TEXT_HEIGHT}px`);
    });
  });

  describe('minHeight', () => {
    beforeEach(() => {
      mockScrollHeight(SHORT_TEXT_HEIGHT);
    });

    it.each([
      { minHeight: '120px', computed: '120px', expected: '120px' },
      { minHeight: 'calc(100px + 1em)', computed: '114px', expected: '114px' },
      { minHeight: '10rem', computed: '160px', expected: '160px' },
      { minHeight: 'inherit', computed: '130px', expected: '130px' },
      { minHeight: 'auto', computed: '0px', expected: `${SHORT_TEXT_HEIGHT}px` },
    ].flatMap((testCase) => [true, false].map((autoResizeEnabled) => ({
      ...testCase, autoResizeEnabled,
    }))))('should give the input the height of minHeight: $minHeight, autoResizeEnabled: $autoResizeEnabled', ({
      minHeight, computed, expected, autoResizeEnabled,
    }) => {
      mockRootStyle({ minHeight: computed });

      const input = createTextArea({ autoResizeEnabled, minHeight }).getInputElement();

      expect(input.style.height).toBe(expected);
    });
  });
});
