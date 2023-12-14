import {
  formatVersion,
  makeTimestampVersion,
} from "./version-utils";

describe('version utils', () => {

  test.each([
    { value: undefined, expected: undefined },
    { value: '', expected: undefined },
    { value: '23.2.1', expected: '23.2.1' },
    { value: '23.2.1-', expected: '23.2.1' },
    { value: '23.2.1-abc', expected: '23.2.1' },
    { value: '23.2.1-abc-def', expected: '23.2.1' },
    { value: '23.2.1-abc-def-4', expected: '23.2.1' },
    { value: '23.2.1.10', expected: '23.2.1' },
  ])('formatVersion [%#]', ({ value, expected }) => {
    expect(formatVersion(value)).toBe(expected);
  })

  test.each([
    { baseVersion: '23.2.3', date: new Date(1234, 5, 16, 7, 18), expected: '23.2.3-build-34167-0718' },
    { baseVersion: '23.2.3', date: new Date(2234, 5, 16, 7, 18), expected: '23.2.3-build-34167-0718' },
    { baseVersion: '23.2.3', date: new Date(2000, 0, 1, 22, 33), expected: '23.2.3-build-00001-2233' },
    { baseVersion: '23.2.3', date: new Date(2000, 2, 30, 4, 15), expected: '23.2.3-build-00090-0415' },
    { baseVersion: '23.2.3', date: new Date(2001, 2, 30, 4, 15), expected: '23.2.3-build-01089-0415' },
    { baseVersion: '23.2.3', date: new Date(2023, 5, 10, 0, 10), expected: '23.2.3-build-23161-0010' },
    { baseVersion: '1234.5', date: new Date(2023, 5, 5, 12, 30), expected: '1234.5-build-23156-1230' },
    { baseVersion: '123456', date: new Date(2023, 5, 5, 12, 30), expected: '123456-build-23156-1230' },
    { baseVersion: 'abcdef', date: new Date(2023, 5, 5, 12, 30), expected: 'abcdef-build-23156-1230' },
  ])('makeTimestampVersion [%#]', ({ baseVersion, date, expected }) => {
    expect(makeTimestampVersion(baseVersion, date)).toBe(expected);
  })
});
