import { describe, expect, it } from '@jest/globals';
import ArrayStore from '@js/common/data/array_store';
import { CustomStore } from '@js/common/data/custom_store';
import type { Store } from '@js/data';

import { normalizeRemoteOperations } from '../remoteOperations';

const arrayStore = new ArrayStore([]);
const customStore = new CustomStore({ load: (): unknown[] => [] });
const remoteStore = {} as Store;

describe('normalizeRemoteOperations', () => {
  describe("'auto'", () => {
    it.each([
      { store: arrayStore, storeKind: 'local', expected: {} },
      { store: customStore, storeKind: 'custom', expected: {} },
      {
        store: remoteStore,
        storeKind: 'remote',
        expected: { filtering: true, sorting: true, paging: true },
      },
    ])('resolves against a $storeKind store', ({ store, expected }) => {
      expect(normalizeRemoteOperations('auto', store)).toEqual(expected);
    });
  });

  it('true enables every operation, including grouping and summary', () => {
    expect(normalizeRemoteOperations(true, remoteStore)).toEqual({
      filtering: true, sorting: true, paging: true, grouping: true, summary: true,
    });
  });

  it('an object is returned on false', () => {
    expect(normalizeRemoteOperations(false, remoteStore)).toEqual({});
  });

  it('an object is returned on undefined', () => {
    expect(normalizeRemoteOperations(undefined, remoteStore)).toEqual({});
  });

  it('an object without groupPaging is returned unchanged', () => {
    expect(normalizeRemoteOperations({ filtering: true, sorting: false }, remoteStore))
      .toEqual({ filtering: true, sorting: false });
  });

  it('an object with groupPaging is merged onto all enabled operations', () => {
    expect(normalizeRemoteOperations({ groupPaging: true }, remoteStore)).toEqual({
      filtering: true,
      sorting: true,
      paging: true,
      grouping: true,
      summary: true,
      groupPaging: true,
    });
  });

  it('groupPaging object overrides individual operation flags', () => {
    const result = normalizeRemoteOperations({ groupPaging: true, filtering: false }, remoteStore);

    expect(result).toEqual({
      filtering: false,
      sorting: true,
      paging: true,
      grouping: true,
      summary: true,
      groupPaging: true,
    });
  });
});
