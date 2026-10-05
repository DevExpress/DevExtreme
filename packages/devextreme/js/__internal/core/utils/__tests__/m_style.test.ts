import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import {
  normalizeStyleProp,
  parsePixelValue,
  setHeight,
  setStyle,
  setWidth,
} from '@ts/core/utils/m_style';

type StyleModule = typeof import('@ts/core/utils/m_style');

const loadStyleModule = (supportedProps: Record<string, string>): StyleModule => {
  jest.resetModules();

  const createElement = document.createElement.bind(document) as (tagName: string) => HTMLElement;
  jest.spyOn(document, 'createElement').mockImplementation(
    ((tagName: string) => (
      tagName === 'dx' ? { style: supportedProps } : createElement(tagName)
    )) as typeof document.createElement,
  );

  return jest.requireActual<StyleModule>('@ts/core/utils/m_style');
};

describe('Style utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('styleProp', () => {
    it('should return the name when the browser supports it', () => {
      const { styleProp } = loadStyleModule({ transition: '' });

      expect(styleProp('transition')).toBe('transition');
    });

    it('should return the vendor-prefixed name when only it is supported', () => {
      const { styleProp } = loadStyleModule({ webkitTransition: '' });

      expect(styleProp('transition')).toBe('webkitTransition');
    });

    it('should check the vendor prefixes in the webkit, moz, o, ms order', () => {
      const { styleProp } = loadStyleModule({ msTransition: '', mozTransition: '' });

      expect(styleProp('transition')).toBe('mozTransition');
    });

    it('should return the name as is when no variant is supported', () => {
      const { styleProp } = loadStyleModule({});

      expect(styleProp('transition')).toBe('transition');
    });
  });

  describe('stylePropPrefix', () => {
    it('should return an empty string for an unprefixed property', () => {
      const { stylePropPrefix } = loadStyleModule({ transition: '' });

      expect(stylePropPrefix('transition')).toBe('');
    });

    it('should return an empty string when the property is not supported', () => {
      const { stylePropPrefix } = loadStyleModule({});

      expect(stylePropPrefix('transition')).toBe('');
    });

    it('should return the css prefix of a vendor property in the lower camel case', () => {
      const { stylePropPrefix } = loadStyleModule({ webkitTransition: '' });

      expect(stylePropPrefix('transition')).toBe('-webkit-');
    });

    it('should return the css prefix of a vendor property in the upper camel case', () => {
      expect(loadStyleModule({ WebkitTransition: '' }).stylePropPrefix('transition')).toBe('-webkit-');
      expect(loadStyleModule({ MozTransition: '' }).stylePropPrefix('transition')).toBe('-moz-');
      expect(loadStyleModule({ OTransition: '' }).stylePropPrefix('transition')).toBe('-o-');
    });

    it('should accept a dashed property name', () => {
      expect(loadStyleModule({ userSelect: '' }).stylePropPrefix('user-select')).toBe('');
      expect(loadStyleModule({ webkitUserSelect: '' }).stylePropPrefix('user-select')).toBe('-webkit-');
    });
  });

  describe('parsePixelValue', () => {
    it('should return a number as is', () => {
      expect(parsePixelValue(10)).toBe(10);
      expect(parsePixelValue(0)).toBe(0);
      expect(parsePixelValue(-3)).toBe(-3);
    });

    it('should parse a value with the px unit', () => {
      expect(parsePixelValue('10px')).toBe(10);
      expect(parsePixelValue('12.5px')).toBe(12.5);
      expect(parsePixelValue('0px')).toBe(0);
    });

    it('should return NaN for a value that is not a length', () => {
      expect(parsePixelValue('abc')).toBeNaN();
      expect(parsePixelValue('50%')).toBeNaN();
      expect(parsePixelValue(null)).toBeNaN();
      expect(parsePixelValue(undefined)).toBeNaN();
      expect(parsePixelValue({})).toBeNaN();
      expect(parsePixelValue(true)).toBeNaN();
    });
  });

  describe('normalizeStyleProp', () => {
    it('should add the px unit to a number', () => {
      expect(normalizeStyleProp('width', 10)).toBe('10px');
      expect(normalizeStyleProp('width', 0)).toBe('0px');
      expect(normalizeStyleProp('width', 1.5)).toBe('1.5px');
    });

    it('should add the px unit to a numeric string', () => {
      expect(normalizeStyleProp('width', '10')).toBe('10px');
    });

    it('should keep a value that is not numeric', () => {
      expect(normalizeStyleProp('top', '5px')).toBe('5px');
      expect(normalizeStyleProp('width', 'auto')).toBe('auto');
      expect(normalizeStyleProp('width', null)).toBeNull();
      expect(normalizeStyleProp('width', undefined)).toBeUndefined();
    });

    [
      'fillOpacity',
      'columnCount',
      'flexGrow',
      'flexShrink',
      'fontWeight',
      'lineHeight',
      'opacity',
      'zIndex',
      'zoom',
    ].forEach((prop) => {
      it(`should keep a number of the unitless ${prop} property`, () => {
        expect(normalizeStyleProp(prop, 2)).toBe(2);
      });
    });
  });

  describe('setWidth and setHeight', () => {
    it('should set the px size of every element', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');

      setWidth([first, second], 10);
      setHeight([first, second], 20);

      expect([first.style.width, second.style.width]).toEqual(['10px', '10px']);
      expect([first.style.height, second.style.height]).toEqual(['20px', '20px']);
    });

    it('should set a string size as is', () => {
      const element = document.createElement('div');

      setWidth([element], '50%');
      setHeight([element], 'auto');

      expect(element.style.width).toBe('50%');
      expect(element.style.height).toBe('auto');
    });

    it('should accept a renderer', () => {
      const element = document.createElement('div');

      setWidth($(element), 15);

      expect(element.style.width).toBe('15px');
    });

    it('should do nothing without elements', () => {
      expect(() => setWidth(null, 10)).not.toThrow();
      expect(() => setHeight(undefined, 10)).not.toThrow();
      expect(() => setWidth([], 10)).not.toThrow();
    });
  });

  describe('setStyle', () => {
    const createElement = (): HTMLElement => {
      const element = document.createElement('div');
      element.style.cssText = 'margin-top: 1px; padding-top: 2px';

      return element;
    };

    it('should replace the inline style by default', () => {
      const element = createElement();

      setStyle(element, 'color: red; width: 10px');

      expect(element.style.color).toBe('red');
      expect(element.style.width).toBe('10px');
      expect(element.style.marginTop).toBe('');
      expect(element.style.paddingTop).toBe('');
    });

    it('should keep the inline style when the reset is turned off', () => {
      const element = createElement();

      setStyle(element, 'color: red', false);

      expect(element.style.color).toBe('red');
      expect(element.style.marginTop).toBe('1px');
      expect(element.style.paddingTop).toBe('2px');
    });

    it('should trim the names and the values', () => {
      const element = createElement();

      setStyle(element, '  color :  blue ');

      expect(element.style.color).toBe('blue');
    });

    it('should skip a declaration that is not a name-value pair', () => {
      const element = createElement();

      setStyle(element, 'color: red: blue; width: 5px; ;', true);

      expect(element.style.color).toBe('');
      expect(element.style.width).toBe('5px');
      expect(element.style.length).toBe(1);
    });
  });
});
