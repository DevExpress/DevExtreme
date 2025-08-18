import {
  describe, expect, it,
} from '@jest/globals';

import { getArraysDiff, isNeedToAdd, isNeedToRemove } from './get_arrays_diff';

interface Obj { id: number; name: string }

const compare = (a: Obj, b: Obj): boolean => a.id === b.id && a.name === b.name;

const getOperations = <T>(items: ReturnType<typeof getArraysDiff<T>>): string => items
  .map((item) => {
    if (isNeedToAdd(item)) {
      return '+';
    }
    return isNeedToRemove(item) ? '-' : '=';
  })
  .join('');

describe('getArraysDiff', () => {
  it('should process both empty arrays', () => {
    const diff = getArraysDiff<Obj>([], [], compare);
    expect(diff).toEqual([]);
  });

  it('should no mark for no changes', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ];
    const b: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('===');
    expect(diff).toEqual([
      { item: a[0] },
      { item: a[1] },
      { item: a[2] },
    ]);
  });

  it('should mark insertion from empty to something', () => {
    const a: Obj[] = [];
    const b: Obj[] = [
      { id: 10, name: 'X' },
      { id: 11, name: 'Y' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('++');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: b[1], needToAdd: true },
    ]);
  });

  it('should removal from something to empty', () => {
    const a: Obj[] = [
      { id: 5, name: 'A' },
      { id: 6, name: 'B' },
    ];
    const b: Obj[] = [];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('--');
    expect(diff).toEqual([
      { item: a[0], needToRemove: true },
      { item: a[1], needToRemove: true },
    ]);
  });

  it('should mark remove and add for one object replacement', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 4, name: 'D' },
    ];
    const b: Obj[] = [
      { id: 1, name: 'A' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('=+-=');
    expect(diff).toEqual([
      { item: a[0] },
      { item: b[1], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: a[2] },
    ]);
  });

  it('should mark remove and add for changes inside object', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 4, name: 'D' },
    ];
    const b: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'C' },
      { id: 4, name: 'D' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('=+-=');
    expect(diff).toEqual([
      { item: a[0] },
      { item: b[1], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: a[2] },
    ]);
  });

  it('should choose optimum operations for reordering', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ];
    const b: Obj[] = [
      { id: 4, name: 'D' },
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('+===-');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: a[0] },
      { item: a[1] },
      { item: a[2] },
      { item: a[3], needToRemove: true },
    ]);
  });

  it('should choose optimum operations for reordering, insertion and removal', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ];
    const b: Obj[] = [
      { id: 4, name: 'D' },
      { id: 1, name: 'A' },
      { id: 5, name: 'E' },
      { id: 3, name: 'C' },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('+=+-=-');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: a[0] },
      { item: b[2], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: a[2] },
      { item: a[3], needToRemove: true },
    ]);
  });

  it('should save additional props in second object', () => {
    const a: Obj[] = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ];
    const b: (Obj & { extra: number })[] = [
      { id: 4, name: 'D', extra: 10 },
      { id: 1, name: 'A', extra: 20 },
      { id: 5, name: 'E', extra: 30 },
      { id: 3, name: 'C', extra: 40 },
    ];

    const diff = getArraysDiff(a, b, compare);

    expect(getOperations(diff)).toBe('+=+-=-');
    expect(diff).toEqual([
      { item: b[0], needToAdd: true },
      { item: b[1] },
      { item: b[2], needToAdd: true },
      { item: a[1], needToRemove: true },
      { item: b[3] },
      { item: a[3], needToRemove: true },
    ]);
  });
});
