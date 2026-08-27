import { describe, expect, it } from '@jest/globals';
import type { Store } from '@js/data';
import ArrayStore from '@js/data/array_store';
import CustomStore from '@js/data/custom_store';

import { isCustomStore, isLocalStore } from '../store';

const arrayStore = new ArrayStore({ data: [] });
const customStore = new CustomStore({ load: (): unknown[] => [] });
const remoteStore = {} as Store;

describe('isLocalStore', () => {
  it('is true only for an ArrayStore', () => {
    expect(isLocalStore(arrayStore)).toBe(true);
    expect(isLocalStore(customStore)).toBe(false);
    expect(isLocalStore(remoteStore)).toBe(false);
  });
});

describe('isCustomStore', () => {
  it('is true only for a CustomStore', () => {
    expect(isCustomStore(customStore)).toBe(true);
    expect(isCustomStore(arrayStore)).toBe(false);
    expect(isCustomStore(remoteStore)).toBe(false);
  });
});
