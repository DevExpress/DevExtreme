import {
  describe, expect, it,
} from '@jest/globals';
import { addOffsetToMaxHeight, addOffsetToMinHeight } from '@ts/core/utils/size';

type Container = Parameters<typeof addOffsetToMaxHeight>[2];

const container = { offsetHeight: 200 } as unknown as Container;
const vh = (count: number): number => (window.innerHeight / 100) * count;

const CALC_VALUES = [
  'calc(100vh - 20px)',
  'calc(100% - 20px)',
  'calc(10vh + 50px)',
  'max(100px, 50vh)',
];

describe('addOffsetToMaxHeight', () => {
  it.each([
    { value: 300, offset: 0, expected: 300 },
    { value: 300, offset: -100, expected: 200 },
    { value: 50, offset: -100, expected: 0 },
    { value: '300', offset: -100, expected: 200 },
    { value: '120px', offset: -20, expected: 100 },
    { value: '50%', offset: -20, expected: 80 },
    { value: '20vh', offset: -20, expected: vh(20) - 20 },
    { value: 'none', offset: -50, expected: 'none' },
    { value: 'none', offset: 0, expected: 'none' },
    { value: 'auto', offset: -50, expected: 'none' },
    { value: 'auto', offset: 0, expected: 'auto' },
    { value: null, offset: -50, expected: 'none' },
    { value: '10em', offset: -50, expected: 'calc(10em - 50px)' },
    { value: '10em', offset: 0, expected: 'calc(10em + 0px)' },
    { value: '10em', offset: 20, expected: 'calc(10em + 20px)' },
  ])('returns $expected for $value with the $offset offset', ({ value, offset, expected }) => {
    expect(addOffsetToMaxHeight(value, offset, container)).toBe(expected);
  });

  it.each(CALC_VALUES)('keeps %s in the generated calc()', (value) => {
    const maxHeight = addOffsetToMaxHeight(value, -51, container);

    expect(maxHeight).toBe(`calc(${value} - 51px)`);
    expect(maxHeight).not.toContain('NaN');
  });

  it.each(CALC_VALUES)('keeps %s in the generated calc() with a zero offset', (value) => {
    expect(addOffsetToMaxHeight(value, -0, container)).toBe(`calc(${value} + 0px)`);
  });
});

describe('addOffsetToMinHeight', () => {
  it.each([
    { value: 300, offset: 0, expected: 300 },
    { value: 300, offset: -100, expected: 200 },
    { value: 50, offset: -100, expected: 0 },
    { value: '300', offset: -100, expected: 200 },
    { value: '120px', offset: -20, expected: 100 },
    { value: '50%', offset: -20, expected: 80 },
    { value: '20vh', offset: -20, expected: vh(20) - 20 },
    { value: 'none', offset: -50, expected: 0 },
    { value: 'none', offset: 0, expected: 'none' },
    { value: 'auto', offset: -50, expected: 0 },
    { value: 'auto', offset: 0, expected: 'auto' },
    { value: null, offset: -50, expected: 0 },
    { value: '10em', offset: -50, expected: 'calc(10em - 50px)' },
    { value: '10em', offset: 0, expected: 'calc(10em + 0px)' },
    { value: '10em', offset: 20, expected: 'calc(10em + 20px)' },
  ])('returns $expected for $value with the $offset offset', ({ value, offset, expected }) => {
    expect(addOffsetToMinHeight(value, offset, container)).toBe(expected);
  });

  it.each(CALC_VALUES)('keeps %s in the generated calc()', (value) => {
    const minHeight = addOffsetToMinHeight(value, -51, container);

    expect(minHeight).toBe(`calc(${value} - 51px)`);
    expect(minHeight).not.toContain('NaN');
  });

  it.each(CALC_VALUES)('keeps %s in the generated calc() with a zero offset', (value) => {
    expect(addOffsetToMinHeight(value, -0, container)).toBe(`calc(${value} + 0px)`);
  });
});
