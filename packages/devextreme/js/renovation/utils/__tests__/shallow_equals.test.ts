import { shallowEquals } from '../shallow_equals';

describe('shallowEquals', () => {
  const testObject = { value: 'test' };

  test('should return `true` of objects are shallow equals', () => {
    expect(shallowEquals(testObject, testObject)).toBe(true);
    expect(shallowEquals(testObject, { value: 'test' })).toBe(true);
    expect(shallowEquals({ }, { })).toBe(true);
  });

  test('should return `false` if objects have different keys length', () => {
    expect(shallowEquals(testObject, { })).toBe(false);
    expect(shallowEquals({ }, testObject)).toBe(false);
  });

  test('should return `false` if objects have at least one different value', () => {
    expect(shallowEquals(testObject, { value: 'wrongValue' })).toBe(false);
  });

  test('should return `false` if objects have at least one different field', () => {
    expect(shallowEquals(testObject, { anotherValue: 'value' })).toBe(false);
  });

  test('should check shallow equality', () => {
    expect(shallowEquals({ field: testObject }, { field: testObject })).toBe(true);
    expect(shallowEquals({ field: testObject }, { field: { value: 'test' } })).toBe(false);
  });
});
