/* eslint-disable object-curly-newline */
import { describe, expect } from '@jest/globals';
import each from 'jest-each';

import {
  getLocalLoadOptions, getStoreLoadOptions, normalizeLocalOptions, normalizeRemoteOptions,
} from './utils';

describe('normalizeRemoteOption', () => {
  describe('with non-object arg', () => {
    each`
            remoteOperations | isLocalStore | isCustomStore | expectedOperationOptions
            ${'auto'}        | ${true}      | ${true}       | ${{ filtering: false, sorting: false, paging: false, summary: false }}
            ${'auto'}        | ${false}     | ${true}       | ${{ filtering: false, sorting: false, paging: false, summary: false }}
            ${'auto'}        | ${true}      | ${false}      | ${{ filtering: false, sorting: false, paging: false, summary: false }}
            ${false}         | ${false}     | ${false}      | ${{ filtering: false, sorting: false, paging: false, summary: false }}
            ${true}          | ${false}     | ${false}      | ${{ filtering: true, sorting: true, paging: true, summary: true }}
    `
      .it('should calculate the operation options', ({
        remoteOperations,
        isLocalStore,
        isCustomStore,

        expectedOperationOptions,
      }) => {
        const result = normalizeRemoteOptions(remoteOperations, isLocalStore, isCustomStore);
        expect(result).toEqual(expectedOperationOptions);
      });
  });
  describe('with object arg', () => {
    each`
            remoteOperations                                                      | isLocalStore | isCustomStore | expectedOperationOptions
            ${{ filtering: true, sorting: false, paging: false, summary: false }} | ${true}      | ${true}       | ${{ filtering: true, sorting: false, paging: false, summary: false }}
            ${{ filtering: false, sorting: true, paging: false, summary: false }} | ${true}      | ${true}       | ${{ filtering: false, sorting: true, paging: false, summary: false }}
            ${{ filtering: false, sorting: false, paging: true, summary: false }} | ${true}      | ${true}       | ${{ filtering: false, sorting: false, paging: true, summary: false }}
            ${{ filtering: false, sorting: false, paging: false, summary: true }} | ${true}      | ${true}       | ${{ filtering: false, sorting: false, paging: false, summary: true }}
    `
      .it('should leave the arg as is', ({
        remoteOperations,
        isLocalStore,
        isCustomStore,

        expectedOperationOptions,
      }) => {
        const result = normalizeRemoteOptions(remoteOperations, isLocalStore, isCustomStore);
        expect(result).toEqual(expectedOperationOptions);
      });
  });
});

describe('normalizeLocalOption', () => {
  each`
          remoteOperations                                                      | expectedOperationOptions
          ${{ filtering: true, sorting: false, paging: false, summary: false }} | ${{ filtering: false, sorting: true, paging: true, summary: true }}
          ${{ filtering: false, sorting: true, paging: false, summary: false }} | ${{ filtering: true, sorting: false, paging: true, summary: true }}
          ${{ filtering: false, sorting: false, paging: true, summary: false }} | ${{ filtering: true, sorting: true, paging: false, summary: true }}
          ${{ filtering: false, sorting: false, paging: false, summary: true }} | ${{ filtering: true, sorting: true, paging: true, summary: false }}

          ${{ filtering: true, sorting: true, paging: true, summary: true }}    | ${{ filtering: false, sorting: false, paging: false, summary: false }}
          ${{ filtering: false, sorting: false, paging: false, summary: false }}| ${{ filtering: true, sorting: true, paging: true, summary: true }}
  `
    .it('should invert remoteOperations', ({
      remoteOperations,
      expectedOperationOptions,
    }) => {
      const result = normalizeLocalOptions(remoteOperations);
      expect(result).toEqual(expectedOperationOptions);
    });
});

describe('getLocalLoadOptions', () => {
  each`
          originOptions                                                          | localOperations        | expectedLoadOptions 
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ filtering: true }} | ${{ filter: 'test' }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ sorting: true }}   | ${{ sort: 'asc' }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ paging: true }}    | ${{ skip: 0, take: 20 }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ summary: true }}   | ${{ summary: 'test' }}
  `
    .it('should convert local operation to load options', ({
      originOptions,
      localOperations,

      expectedLoadOptions,
    }) => {
      const result = getLocalLoadOptions(originOptions, localOperations);
      expect(result).toEqual(expectedLoadOptions);
    });
});

describe('getStoreLoadOptions', () => {
  each`
          originOptions                                                          | localOperations        | expectedLoadOptions 
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ filtering: true }} | ${{ sort: 'asc', skip: 0, take: 20, summary: 'test' }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ sorting: true }}   | ${{ filter: 'test', skip: 0, take: 20, summary: 'test' }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ paging: true }}    | ${{ filter: 'test', sort: 'asc', summary: 'test' }}
          ${{ filter: 'test', sort: 'asc', skip: 0, take: 20, summary: 'test' }} | ${{ summary: true }}   | ${{ filter: 'test', sort: 'asc', skip: 0, take: 20 }}
  `
    .it('should clear local operations from load options', ({
      originOptions,
      localOperations,

      expectedLoadOptions,
    }) => {
      const result = getStoreLoadOptions(originOptions, localOperations);
      expect(result).toEqual(expectedLoadOptions);
    });
});
