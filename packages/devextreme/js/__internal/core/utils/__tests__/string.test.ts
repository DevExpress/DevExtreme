import { describe, expect, it } from '@jest/globals';
import { stringifyValue } from '@ts/core/utils/string';

describe('stringifyValue', () => {
  it('should return a string as is', () => {
    expect(stringifyValue('15°C (59°F)')).toBe('15°C (59°F)');
  });

  it('should return an empty string as is', () => {
    expect(stringifyValue('')).toBe('');
  });

  it('should format an object as indented JSON', () => {
    expect(stringifyValue({ country: 'UK', city: 'London' })).toBe(
      '{\n  "country": "UK",\n  "city": "London"\n}',
    );
  });

  it('should format an array as indented JSON', () => {
    expect(stringifyValue([1, 2])).toBe('[\n  1,\n  2\n]');
  });

  it('should format a nested object', () => {
    expect(stringifyValue({ a: { b: 1 } })).toBe('{\n  "a": {\n    "b": 1\n  }\n}');
  });

  it('should convert primitives to their JSON representation', () => {
    expect(stringifyValue(42)).toBe('42');
    expect(stringifyValue(true)).toBe('true');
    expect(stringifyValue(null)).toBe('null');
  });

  it('should fall back to String() when the value cannot be serialized', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(stringifyValue(circular)).toBe('[object Object]');
    expect(stringifyValue(BigInt(1))).toBe('1');
  });

  it('should fall back to String() when JSON.stringify returns undefined', () => {
    expect(stringifyValue(undefined)).toBe('undefined');
    expect(stringifyValue(() => 1)).toBe('() => 1');
  });
});
