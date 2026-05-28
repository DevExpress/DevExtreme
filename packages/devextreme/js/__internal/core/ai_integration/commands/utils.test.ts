import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { parseDates } from './utils';

describe('parseDates', () => {
  it('converts valid AIDate string to Date object', () => {
    const result = parseDates('key', 'AIDate(2024, 5, 10)');
    expect(result).toEqual(new Date(2024, 4, 10));
  });

  it('handles single-digit month and day', () => {
    const result = parseDates('key', 'AIDate(2024, 1, 1)');
    expect(result).toEqual(new Date(2024, 0, 1));
  });

  it('handles December 31', () => {
    const result = parseDates('key', 'AIDate(2024, 12, 31)');
    expect(result).toEqual(new Date(2024, 11, 31));
  });

  it('returns original string for invalid date (month 13)', () => {
    const result = parseDates('key', 'AIDate(2024, 13, 1)');
    expect(result).toBe('AIDate(2024, 13, 1)');
  });

  it('returns original string for invalid date (day 32)', () => {
    const result = parseDates('key', 'AIDate(2024, 1, 32)');
    expect(result).toBe('AIDate(2024, 1, 32)');
  });

  it('returns original string for February 30', () => {
    const result = parseDates('key', 'AIDate(2024, 2, 30)');
    expect(result).toBe('AIDate(2024, 2, 30)');
  });

  it('passes through non-AIDate strings unchanged', () => {
    expect(parseDates('key', 'hello')).toBe('hello');
    expect(parseDates('key', '2024-05-10')).toBe('2024-05-10');
  });

  it('passes through non-string values unchanged', () => {
    expect(parseDates('key', 42)).toBe(42);
    expect(parseDates('key', null)).toBe(null);
    expect(parseDates('key', true)).toBe(true);
  });

  it('works as JSON.parse reviver', () => {
    const json = '{"date":"AIDate(2024, 5, 10)","name":"test","count":5}';
    const result = JSON.parse(json, parseDates);
    expect(result).toEqual({
      date: new Date(2024, 4, 10),
      name: 'test',
      count: 5,
    });
  });

  it('handles AIDate without spaces after commas', () => {
    const result = parseDates('key', 'AIDate(2024,5,10)');
    expect(result).toEqual(new Date(2024, 4, 10));
  });
});
