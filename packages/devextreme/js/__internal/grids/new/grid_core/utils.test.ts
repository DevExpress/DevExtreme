import { describe, expect, it } from '@jest/globals';

import type { Column } from './columns_controller/types';
import {
  parseBooleanValue,
  parseDateValue,
  parseNumberValue,
  parseValue,
} from './utils';

describe('parseNumberValue', () => {
  it('should parse numeric string without format', () => {
    expect(parseNumberValue('456')).toBe(456);
  });

  it('should return undefined for non-numeric string without format', () => {
    expect(parseNumberValue('abc')).toBeUndefined();
  });
});

describe('parseBooleanValue', () => {
  it('should return true for matching trueText', () => {
    expect(parseBooleanValue('yes', 'yes', 'no')).toBe(true);
  });

  it('should return false for matching falseText', () => {
    expect(parseBooleanValue('no', 'yes', 'no')).toBe(false);
  });

  it('should return undefined for unmatched text', () => {
    expect(parseBooleanValue('maybe', 'yes', 'no')).toBeUndefined();
  });
});

describe('parseDateValue', () => {
  it('should parse ISO date string without format', () => {
    const result = parseDateValue('2024-01-01');
    expect(result).toEqual(new Date('2024-01-01'));
  });

  it('should return null for invalid date without format', () => {
    expect(parseDateValue('invalid-date')).toBeNull();
  });
});

describe('parseValue', () => {
  it('should parse number based on column.dataType', () => {
    // @ts-expect-error
    const column: Column = { dataField: '', dataType: 'number' };
    expect(parseValue(column, '42')).toBe(42);
  });

  it('should parse boolean based on column.dataType', () => {
    // @ts-expect-error
    const columnTrue: Column = {
      dataField: '', dataType: 'boolean', trueText: 'yes', falseText: 'no',
    };
    expect(parseValue(columnTrue, 'yes')).toBe(true);
    expect(parseValue(columnTrue, 'no')).toBe(false);
  });

  it('should parse date based on dataType argument', () => {
    // @ts-expect-error
    const column: Column = { dataField: '' };
    expect(parseValue(column, '2024-01-01', 'date')).toEqual(new Date('2024-01-01'));
  });

  it('should return text for unknown dataType', () => {
    // @ts-expect-error
    const column: Column = { dataField: '' };
    expect(parseValue(column, 'hello', 'string')).toBe('hello');
  });
});
