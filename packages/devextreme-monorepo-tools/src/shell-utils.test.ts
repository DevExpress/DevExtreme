import { mapOptions } from './shell-utils';

describe('shell utils', () => {

  test.each([
    { options: { a: 123 }, map: { a: 'x' }, expected: `x="123"` },
    { options: { a: 'def' }, map: { a: 'x' }, expected: `x="def"` },
    { options: { a: true }, map: { a: { kind: 'flag', alias: 'x' } }, expected: 'x' },
    { options: { a: false }, map: { a: { kind: 'flag', alias: 'x' } }, expected: '' },
    { options: { b: 123, a: true, c: 'def' }, map: { a: { kind: 'flag', alias: 'x' }, b: 'y', c: 'z' }, expected: `y="123" x z="def"` },
    { options: { b: 123, a: false, c: 'def' }, map: { a: { kind: 'flag', alias: 'x' }, b: 'y', c: 'z' }, expected: `y="123" z="def"` },
  ] as const)('mapOptions', ({ options, map, expected }) => {
    expect(mapOptions(options, map as any)).toBe(expected);
  });
});
