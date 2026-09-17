import { describe, expect, it } from '@jest/globals';

import { isValidColor } from '../color';

describe('isValidColor', () => {
  it.each([
    '#a703ff',
    '#abc',
    '#a703ff80',
    'rebeccapurple',
    'rgb(167, 3, 255)',
    'rgb(167 3 255)',
    'hsl(280 100% 50%)',
    'oklch(0.6 0.15 250)',
    'color-mix(in oklab, red, blue)',
    'transparent',
  ])('takes %s, a color the browser parses', (value) => {
    expect(isValidColor(value)).toBe(true);
  });

  it.each([
    'foo',
    'rgb(167 3)',
    '',
    '   ',
  ])('refuses %s, which parses as no color at all', (value) => {
    expect(isValidColor(value)).toBe(false);
  });

  it.each([
    'currentColor',
    'inherit',
    'initial',
    'unset',
    'revert',
    'revert-layer',
  ])('refuses %s, which points at another color instead of naming one', (value) => {
    expect(isValidColor(value)).toBe(false);
  });

  it('reads the value the same however it is capitalized or spaced', () => {
    expect([
      isValidColor(' #A703FF '),
      isValidColor('INHERIT'),
    ]).toEqual([true, false]);
  });
});
