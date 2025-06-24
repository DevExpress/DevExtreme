import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { DataSource } from '@js/common/data';
import { Deferred } from '@js/core/utils/deferred';
import { signal } from '@ts/core/reactive/index';
import type { InternalLoadOptions, OperationOptions } from '@ts/grids/new/grid_core/data_controller/types';

import { StoreLoadAdapter } from './store_load_adapter';
import type { LocalStoreFabric } from './types';

const setup = (localOperations: OperationOptions) => {
  const remoteStoreLoadFnMock = jest.fn()
    .mockImplementation(() => Deferred().resolve());
  const localStoreLoadFnMock = jest.fn()
    .mockImplementation(() => Deferred().resolve());

  const dataSourceMock = signal({
    store() {
      return {
        load: remoteStoreLoadFnMock,
      };
    },
  } as unknown as DataSource<unknown, unknown>);
  const localLoadOptionsMock = signal(localOperations);

  const arrayStoreMock = {
    load: localStoreLoadFnMock,
  };

  const storeLoadAdapter = new StoreLoadAdapter<unknown>(
    dataSourceMock,
    localLoadOptionsMock,
    (() => arrayStoreMock) as LocalStoreFabric<unknown, unknown>,
  );

  return {
    remoteStoreLoadFnMock,
    localStoreLoadFnMock,
    dataSourceMock,
    localLoadOptionsMock,
    storeLoadAdapter,
  };
};

describe('DataController', () => {
  describe('StoreLoadAdapter', () => {
    describe('load', () => {
      it.each<{
        caseName: string;
        localOperations: OperationOptions;
        originLoadOptions: InternalLoadOptions;
        expectedRemoteLoadOptions: InternalLoadOptions;
        expectedLocalLoadOptions: InternalLoadOptions;
      }>([
        {
          caseName: 'all operations local',
          localOperations: {
            paging: true,
            filtering: true,
            grouping: true,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {},
          expectedLocalLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
        },
        {
          caseName: 'only paging local',
          localOperations: {
            paging: true,
            filtering: false,
            grouping: false,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedLocalLoadOptions: {
            skip: 0,
            take: 20,
          },
        },
        {
          caseName: 'paging & filtering local',
          localOperations: {
            paging: true,
            filtering: true,
            grouping: false,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            group: 'GROUP_A_VALUE' as any,
          },
          expectedLocalLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
          },
        },
        {
          caseName: 'paging & grouping local',
          localOperations: {
            paging: true,
            filtering: false,
            grouping: true,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            filter: 'SOME_FILTER_VALUE' as any,
          },
          expectedLocalLoadOptions: {
            skip: 0,
            take: 20,
            group: 'GROUP_A_VALUE' as any,
          },
        },
        {
          caseName: 'only filtering local',
          localOperations: {
            paging: false,
            filtering: true,
            grouping: false,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            skip: 0,
            take: 20,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedLocalLoadOptions: {
            filter: 'SOME_FILTER_VALUE' as any,
          },
        },
        {
          caseName: 'filtering & grouping local',
          localOperations: {
            paging: false,
            filtering: true,
            grouping: true,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            skip: 0,
            take: 20,
          },
          expectedLocalLoadOptions: {
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
        },
        {
          caseName: 'only grouping local',
          localOperations: {
            paging: false,
            filtering: false,
            grouping: true,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
          },
          expectedLocalLoadOptions: {
            group: 'GROUP_A_VALUE' as any,
          },
        },
        {
          caseName: 'all operations remote',
          localOperations: {
            paging: false,
            filtering: false,
            grouping: false,
          },
          originLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedRemoteLoadOptions: {
            skip: 0,
            take: 20,
            filter: 'SOME_FILTER_VALUE' as any,
            group: 'GROUP_A_VALUE' as any,
          },
          expectedLocalLoadOptions: {},
        },
      ])('should split local and remote operations: $caseName', async ({
        localOperations,
        originLoadOptions,
        expectedLocalLoadOptions,
        expectedRemoteLoadOptions,
      }) => {
        const {
          storeLoadAdapter,
          remoteStoreLoadFnMock,
          localStoreLoadFnMock,
        } = setup(localOperations);

        await storeLoadAdapter.load(originLoadOptions);

        expect(remoteStoreLoadFnMock).toHaveBeenCalledTimes(1);
        expect(localStoreLoadFnMock).toHaveBeenCalledTimes(1);
        expect(remoteStoreLoadFnMock).toHaveBeenCalledWith(expectedRemoteLoadOptions);
        expect(localStoreLoadFnMock).toHaveBeenCalledWith(expectedLocalLoadOptions);
      });

      it('should return result from the local store load', async () => {
        const loadedData = [1, 2, 3];
        const expectedData = ['A', 'B', 'C'];
        const {
          storeLoadAdapter,
          remoteStoreLoadFnMock,
          localStoreLoadFnMock,
        } = setup({ paging: false, filtering: false, grouping: false });

        remoteStoreLoadFnMock
          .mockImplementation(() => Deferred().resolve(loadedData));
        localStoreLoadFnMock
          .mockImplementation(() => Deferred().resolve(expectedData));

        const loadResult = await storeLoadAdapter.load();

        expect(loadResult).toBe(expectedData);
      });

      it('should handle remote operations reject', async () => {
        const expectedData = ['A', 'B', 'C'];
        const {
          storeLoadAdapter,
          remoteStoreLoadFnMock,
          localStoreLoadFnMock,
        } = setup({ paging: false, filtering: false, grouping: false });

        remoteStoreLoadFnMock
          .mockImplementation(() => Deferred().reject('REMOTE_FAILED'));
        localStoreLoadFnMock
          .mockImplementation(() => Deferred().resolve(expectedData));

        const result = await storeLoadAdapter.load().catch((data) => data);

        expect(result).toEqual('REMOTE_FAILED');
      });

      it('should handle local operations reject', async () => {
        const loadedData = [1, 2, 3];
        const {
          storeLoadAdapter,
          remoteStoreLoadFnMock,
          localStoreLoadFnMock,
        } = setup({ paging: false, filtering: false, grouping: false });

        remoteStoreLoadFnMock
          .mockImplementation(() => Deferred().resolve(loadedData));
        localStoreLoadFnMock
          .mockImplementation(() => Deferred().reject('LOCAL_FAILED'));

        const result = await storeLoadAdapter.load().catch((data) => data);

        expect(result).toEqual('LOCAL_FAILED');
      });
    });

    describe('getLocalLoadOperations', () => {
      it('should return initial local operations', () => {
        const initialLocalOperations = { paging: false, filtering: false, grouping: false };
        const {
          storeLoadAdapter,
        } = setup(initialLocalOperations);

        const result = storeLoadAdapter.getLocalLoadOperations();

        expect(result).toEqual(initialLocalOperations);
      });

      it('should return actual local operations', () => {
        const initialLocalOperations = { paging: false, filtering: false, grouping: false };
        const updatedLocalOperations = { paging: true, filtering: true, grouping: true };
        const {
          storeLoadAdapter,
          localLoadOptionsMock,
        } = setup(initialLocalOperations);

        localLoadOptionsMock.value = updatedLocalOperations;

        const result = storeLoadAdapter.getLocalLoadOperations();

        expect(result).toEqual(updatedLocalOperations);
      });
    });
  });
});
