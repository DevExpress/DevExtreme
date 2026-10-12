import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { themeLength } from '@ts/core/utils/theme_length';

const PROPERTY = '--probe-length';

describe('themeLength', () => {
  let element: HTMLElement = document.createElement('div');
  let declared = '';

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    declared = '';

    jest.spyOn(window, 'getComputedStyle').mockImplementation((node) => ({
      fontSize: '16px',
      getPropertyValue: (name: string): string => (node === element && name === PROPERTY ? declared : ''),
    }) as unknown as CSSStyleDeclaration);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    element.remove();
  });

  it('reads a px length', () => {
    declared = '60px';

    expect(themeLength(element, PROPERTY)).toBe(60);
  });

  it('converts rem through the root font size', () => {
    declared = ' 3.75rem ';

    expect(themeLength(element, PROPERTY)).toBe(60);
  });

  it('reads a unitless zero', () => {
    declared = '0';

    expect(themeLength(element, PROPERTY)).toBe(0);
  });

  it('accepts a renderer wrapper', () => {
    declared = '1.5px';

    expect(themeLength($(element), PROPERTY)).toBe(1.5);
  });

  it('is undefined when the theme declares nothing', () => {
    expect(themeLength(element, PROPERTY)).toBeUndefined();
  });

  it('is undefined for a value that is not a length', () => {
    declared = 'auto';

    expect(themeLength(element, PROPERTY)).toBeUndefined();
  });

  it('is undefined for an empty selection', () => {
    expect(themeLength($(), PROPERTY)).toBeUndefined();
  });

  it('is undefined without an element', () => {
    expect(themeLength(undefined, PROPERTY)).toBeUndefined();
  });

  it('is undefined for a node that is not an element', () => {
    declared = '60px';

    expect(themeLength($(document), PROPERTY)).toBeUndefined();
    expect(themeLength($(document.createTextNode('x')) as never, PROPERTY)).toBeUndefined();
  });
});
