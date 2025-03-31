import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { DataSource } from '@js/common/data';
import { Deferred } from '@js/core/utils/deferred';
import { state } from '@ts/core/reactive';
import { StoreLoadAdapter } from '@ts/grids/new/grid_core/data_controller/store_load_adapter/store_load_adapter';
import type { LocalStoreFabric } from '@ts/grids/new/grid_core/data_controller/store_load_adapter/types';
import type { InternalLoadOptions, OperationOptions } from '@ts/grids/new/grid_core/data_controller/types';

// @ts-expect-error bad deferred ctor type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDeferred = (): any => new Deferred();

const setup = (localOperations: OperationOptions) => {
  const remoteStoreLoadFnMock = jest.fn()
    .mockImplementation(() => createDeferred().resolve());
  const localStoreLoadFnMock = jest.fn()
    .mockImplementation(() => createDeferred().resolve());

  const dataSourceMock = state({
    store() {
      return {
        load: remoteStoreLoadFnMock,
      };
    },
  } as unknown as DataSource<unknown, unknown>);
  const localLoadOptionsMock = state(localOperations);

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
          caseName: 'local: all',
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
          caseName: 'local: paging',
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
          caseName: 'local: paging & filtering',
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
          caseName: 'local: paging & grouping',
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
          caseName: 'local: filtering',
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
          caseName: 'local: filtering & grouping',
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
          caseName: 'local: grouping',
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
          caseName: 'remote: all',
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
      ])('$caseName', async ({
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
          .mockImplementation(() => createDeferred().resolve(loadedData));
        localStoreLoadFnMock
          .mockImplementation(() => createDeferred().resolve(expectedData));

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
          .mockImplementation(() => createDeferred().reject('REMOTE_FAILED'));
        localStoreLoadFnMock
          .mockImplementation(() => createDeferred().resolve(expectedData));

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
          .mockImplementation(() => createDeferred().resolve(loadedData));
        localStoreLoadFnMock
          .mockImplementation(() => createDeferred().reject('LOCAL_FAILED'));

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

        localLoadOptionsMock.update(updatedLocalOperations);

        const result = storeLoadAdapter.getLocalLoadOperations();

        expect(result).toEqual(updatedLocalOperations);
      });
    });
  });
});
