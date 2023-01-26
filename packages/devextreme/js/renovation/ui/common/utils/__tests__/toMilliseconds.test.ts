import { toMilliseconds } from '../date';

describe('toMilliseconds', () => {
  test('milliseconds to milliseconds', () => {
    expect(toMilliseconds('millisecond')).toBe(1);
  });

  test('second to milliseconds', () => {
    expect(toMilliseconds('second')).toBe(1000);
  });

  test('minute to milliseconds', () => {
    expect(toMilliseconds('minute')).toBe(60000);
  });

  test('hour to milliseconds', () => {
    expect(toMilliseconds('hour')).toBe(3600000);
  });

  test('day to milliseconds', () => {
    expect(toMilliseconds('day')).toBe(86400000);
  });

  test('week to milliseconds', () => {
    expect(toMilliseconds('week')).toBe(604800000);
  });

  test('month to milliseconds', () => {
    expect(toMilliseconds('month')).toBe(2592000000);
  });

  test('quarter to milliseconds', () => {
    expect(toMilliseconds('quarter')).toBe(7776000000);
  });

  test('year to milliseconds', () => {
    expect(toMilliseconds('year')).toBe(31536000000);
  });
});
