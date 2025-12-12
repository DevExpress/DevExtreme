/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  afterEach, beforeEach, describe, expect, jest, test,
} from '@jest/globals';
import { Deferred } from '@js/core/utils/deferred';
import type { Store } from '@js/data';
import CustomStore from '@js/data/custom_store';
import DataSource from '@js/data/data_source';

import { DataSourceAdapterTreeList } from './m_data_source_adapter';

describe('TreeList DataSourceAdapter - T1311885 Race Condition', () => {
  let dataSourceAdapter: DataSourceAdapterTreeList;
  let mockStore: Store;
  let loadCalls: { filter: any; deferred: any; type?: string }[];
  const parentData = [
    { Task_ID: 1, Task_Parent_ID: 0, Task_Subject: 'Parent 1' },
    { Task_ID: 2, Task_Parent_ID: 0, Task_Subject: 'Parent 2' },
  ];

  const childData = [
    { Task_ID: 10, Task_Parent_ID: 1, Task_Subject: 'Child 1' },
    { Task_ID: 20, Task_Parent_ID: 2, Task_Subject: 'Child 2' },
  ];

  const OPERATION_ID = {
    FIRST: 1,
    SECOND: 2,
  };

  beforeEach(() => {
    loadCalls = [];

    mockStore = new CustomStore({
      key: 'Task_ID',
      load: (options: any) => {
        // @ts-expect-error
        const deferred = new Deferred();
        loadCalls.push({ filter: options?.filter, deferred });
        return deferred.promise();
      },
      // byKey: jest.fn((key: any) => {
      //   // @ts-expect-error
      //   const deferred = new Deferred();
      //   const item = parentData.find((p) => p.Task_ID === key);
      //   deferred.resolve(item);
      //   return deferred.promise();
      // }),
    });

    const dataSource = new DataSource({
      store: mockStore,
      reshapeOnPush: true,
    });

    const mockComponent = {
      option: jest.fn((key: string) => {
        const options: any = {
          remoteOperations: { filtering: true, sorting: true },
          parentIdExpr: 'Task_Parent_ID',
          hasItemsExpr: 'Has_Items',
          filterMode: 'fullBranch',
          expandedRowKeys: [],
          dataStructure: 'plain',
          rootValue: 0,
        };
        return options[key];
      }),
      _createActionByOption: jest.fn(() => jest.fn()),
      on: jest.fn(() => mockComponent),
      off: jest.fn(() => mockComponent),
      _eventsStrategy: {
        on: jest.fn(),
        off: jest.fn(),
        fireEvent: jest.fn(),
        hasEvent: jest.fn(() => false),
      },
    } as any;

    dataSourceAdapter = new DataSourceAdapterTreeList(mockComponent);
    dataSourceAdapter.init(dataSource, { remoteOperations: { filtering: true } });

    (dataSourceAdapter as any)._loadDataSource = jest.fn((options: any) => {
      // @ts-expect-error
      const deferred = new Deferred();

      loadCalls.push({
        filter: options?.filter,
        deferred,
        type: 'dataSource',
      });

      return deferred.promise();
    });
  });

  afterEach(() => {
    // Cleanup mocks and spies
    jest.clearAllMocks();
    jest.restoreAllMocks();

    // Clear references to prevent memory leaks
    loadCalls = [];
    (dataSourceAdapter as any)._loadDataSource = undefined;
    (dataSourceAdapter as any).loadFromStore = undefined;
    mockStore = undefined as any;
    dataSourceAdapter = undefined as any;
  });

  test('T1311885 - _loadParentsOrChildren should NOT throw concat error when _cachedStoreData is cleared', async () => {
    let firstLoadDeferred: any = null;
    let errorMessage = '';

    const unhandledRejectionHandler = (reason: any) => {
      errorMessage = reason?.message || String(reason);
    };
    process.on('unhandledRejection', unhandledRejectionHandler);

    // Setup initial state
    (dataSourceAdapter as any)._cachedStoreData = parentData;
    (dataSourceAdapter as any)._dataSource = {
      store: jest.fn(() => mockStore),
    };
    (dataSourceAdapter as any)._lastOperationId = OPERATION_ID.FIRST;

    // Mock options
    const options = {
      remoteOperations: { filtering: true },
      storeLoadOptions: { sort: null },
      loadOptions: { sort: null },
      operationId: OPERATION_ID.FIRST,
    };

    // Spy on loadFromStore to capture and control the deferred

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (dataSourceAdapter as any).loadFromStore = jest.fn((loadOptions, store) => {
    // @ts-expect-error
      const deferred = new Deferred();

      // Save first deferred for later manipulation
      if (!firstLoadDeferred) {
        firstLoadDeferred = deferred;
      }

      return deferred.promise();
    });

    // STEP 1: Start first _loadParentsOrChildren call (parent lookup)
    (dataSourceAdapter as any)._loadParentsOrChildren(
      childData,
      options,
    );

    // Verify loadFromStore was called
    expect((dataSourceAdapter as any).loadFromStore).toHaveBeenCalledTimes(1);
    expect(firstLoadDeferred).toBeDefined();

    // STEP 2: Simulate reload() - clears _cachedStoreData
    (dataSourceAdapter as any)._cachedStoreData = undefined;
    (dataSourceAdapter as any)._lastOperationId = OPERATION_ID.SECOND;

    // STEP 3: Resolve OLD parent lookup
    firstLoadDeferred.resolve(parentData);
    await Promise.resolve();

    process.off('unhandledRejection', unhandledRejectionHandler);

    expect(errorMessage).toBe('');
    expect(errorMessage).not.toMatch(/concat|Cannot read properties of undefined/i);
  });
});
