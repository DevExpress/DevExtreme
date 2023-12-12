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
    { baseVersion: '23.2.3', date: new Date(1234, 5, 6, 7, 8), expected: '23.2.3-build-34157-0708'},
    { baseVersion: '23.2.3', date: new Date(2234, 5, 6, 7, 8), expected: '23.2.3-build-34157-0708'},
    // TODO: fix case
    // { baseVersion: '23.2.3', date: new Date(2000, 2, 3, 4, 5), expected: '23.2.3-build-062-0405'},
  ])('formatVersion [%#]', ({ baseVersion, date, expected }) => {
    expect(makeTimestampVersion(baseVersion, date)).toBe(expected);
  })
});
