import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { CustomLoader, CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { LoadOperation, TreeNode } from '../../types';
import type { LoadBranchesContext } from '../load_branches';
import { loadBranches } from '../load_branches';

const ROOT = 0;

const item = (id: number, parentId: number): RawItemData => ({ id, parentId });

const node = (id: number, parentId: number, children: TreeNode[] = []): TreeNode => ({
  key: id,
  data: item(id, parentId),
  children,
});

interface StoreCall {
  loadOptions: StoreLoadOptions;
  deferred: DeferredObj<CustomLoadResult>;
}

interface SetupOptions {
  cachedData?: RawItemData[];
  expandedKeys?: number[];
  nodes?: TreeNode[];
  maxFilterLengthInRequest?: number;
}

interface Setup {
  context: LoadBranchesContext;
  /** The adapter state the context reads lazily, so a test can change it mid-load. */
  state: {
    cachedData: RawItemData[] | undefined;
    lastOperationId: number | undefined;
  };
  storeCalls: StoreCall[];
  loadFromStore: jest.Mock<(loadOptions: StoreLoadOptions) => DeferredObj<CustomLoadResult>>;
  cancel: jest.Mock<(operationId: number) => void>;
  setCachedData: jest.Mock<(data: RawItemData[]) => void>;
}

const setup = ({
  cachedData = [],
  expandedKeys = [],
  nodes = [],
  maxFilterLengthInRequest = 1500,
}: SetupOptions = {}): Setup => {
  const state: {
    cachedData: RawItemData[] | undefined;
    lastOperationId: number | undefined;
  } = { cachedData, lastOperationId: 1 };

  const storeCalls: StoreCall[] = [];
  const loadFromStore = jest.fn((loadOptions: StoreLoadOptions) => {
    const deferred = Deferred<CustomLoadResult>();

    storeCalls.push({ loadOptions, deferred });

    return deferred;
  });

  const cancel = jest.fn();
  const setCachedData = jest.fn((data: RawItemData[]) => { state.cachedData = data; });

  const nodeByKey: Record<string, TreeNode> = {};
  nodes.forEach((treeNode) => { nodeByKey[treeNode.key as string] = treeNode; });

  const context: LoadBranchesContext = {
    dataSource: { cancel } as unknown as DataSource,
    customLoader: { loadFromStore } as unknown as CustomLoader,
    rootValue: ROOT,
    maxFilterLengthInRequest,
    parentIdExpr: 'parentId',
    keyExpr: 'id',
    _parentIdGetter: (data) => (data as { parentId: unknown }).parentId,
    _keyGetter: (data) => (data as { id: unknown }).id,
    isRowExpanded: (key) => expandedKeys.includes(key as number),
    getCachedData: () => state.cachedData,
    setCachedData,
    getLastOperationId: () => state.lastOperationId,
    getNodeByKey: (key) => nodeByKey[key as string],
  };

  return {
    context, state, storeCalls, loadFromStore, cancel, setCachedData,
  };
};

const createOptions = (overrides: Partial<LoadOperation> = {}): LoadOperation => ({
  operationId: 1,
  remoteOperations: { filtering: true },
  storeLoadOptions: { sort: 'id' },
  loadOptions: {},
  ...overrides,
} as unknown as LoadOperation);

interface Tracker {
  done: jest.Mock<(branchData: RawItemData[]) => void>;
  fail: jest.Mock<(error: unknown) => void>;
}

/** Deferred callbacks fire synchronously, so handlers attached after the fact still run. */
const track = (deferred: DeferredObj<RawItemData[]>): Tracker => {
  const done = jest.fn<(branchData: RawItemData[]) => void>();
  const fail = jest.fn<(error: unknown) => void>();

  deferred.done(done).fail(fail);

  return { done, fail };
};

describe('parents', () => {
  it('resolves with the passed data when every parent is already loaded', () => {
    const { context, loadFromStore } = setup();
    const data = [item(1, ROOT), item(2, 1)];

    const { done } = track(loadBranches(context, data, createOptions(), false));

    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith(data);
  });

  it('requests the missing parent and resolves with the sorted result', () => {
    const { context, storeCalls } = setup();

    const { done } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    expect(storeCalls).toHaveLength(1);
    expect(storeCalls[0].loadOptions.filter).toEqual(['id', '=', 1]);

    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1)]);
  });

  it('walks up the whole ancestor chain, one request per level', () => {
    const { context, storeCalls } = setup();

    const { done } = track(loadBranches(context, [item(3, 2)], createOptions(), false));

    expect(storeCalls[0].loadOptions.filter).toEqual(['id', '=', 2]);
    storeCalls[0].deferred.resolve({ data: [item(2, 1)] });

    expect(storeCalls).toHaveLength(2);
    expect(storeCalls[1].loadOptions.filter).toEqual(['id', '=', 1]);
    storeCalls[1].deferred.resolve({ data: [item(1, ROOT)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1), item(3, 2)]);
  });

  it('asks for each missing parent once and never for the root value', () => {
    const { context, storeCalls } = setup();
    const data = [item(3, 1), item(4, 1), item(5, ROOT)];

    track(loadBranches(context, data, createOptions(), false));

    expect(storeCalls).toHaveLength(1);
    expect(storeCalls[0].loadOptions.filter).toEqual(['id', '=', 1]);
  });

  it('combines several missing parents into one `or` filter', () => {
    const { context, storeCalls } = setup();

    track(loadBranches(context, [item(3, 1), item(4, 2)], createOptions(), false));

    expect(storeCalls[0].loadOptions.filter).toEqual([['id', '=', 1], 'or', ['id', '=', 2]]);
  });

  it('stops and keeps the data it has when the store returns nothing', () => {
    const { context, storeCalls } = setup();
    const data = [item(2, 1)];

    const { done } = track(loadBranches(context, data, createOptions(), false));

    storeCalls[0].deferred.resolve({ data: [] });

    expect(storeCalls).toHaveLength(1);
    expect(done).toHaveBeenCalledWith(data);
  });

  it('sorts by loadOptions.sort when storeLoadOptions has no sort', () => {
    const { context, storeCalls } = setup();
    const options = createOptions({
      storeLoadOptions: {},
      loadOptions: { sort: 'id' },
    });

    const { done } = track(loadBranches(context, [item(2, 1)], options, false));

    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1)]);
  });
});

describe('children', () => {
  it('is skipped entirely when children are not needed', () => {
    const { context, loadFromStore } = setup({ expandedKeys: [1] });
    const data = [item(1, ROOT), item(2, ROOT)];

    const { done } = track(loadBranches(context, data, createOptions(), false));

    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith(data);
  });

  it('requests the children of expanded rows only', () => {
    const { context, storeCalls } = setup({ expandedKeys: [1] });
    const data = [item(1, ROOT), item(2, ROOT)];

    const { done } = track(loadBranches(context, data, createOptions(), true));

    expect(storeCalls).toHaveLength(1);
    expect(storeCalls[0].loadOptions.filter).toEqual(['parentId', '=', 1]);

    storeCalls[0].deferred.resolve({ data: [item(10, 1)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, ROOT), item(10, 1)]);
  });

  it('loads the missing parents before the children', () => {
    const { context, storeCalls } = setup({ expandedKeys: [3] });

    const { done } = track(loadBranches(context, [item(3, 1)], createOptions(), true));

    expect(storeCalls[0].loadOptions.filter).toEqual(['id', '=', 1]);
    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });

    expect(storeCalls[1].loadOptions.filter).toEqual(['parentId', '=', 3]);
    storeCalls[1].deferred.resolve({ data: [item(30, 3)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(3, 1), item(30, 3)]);
  });
});

describe('already built nodes', () => {
  it('takes the missing parents from the nodes instead of the store', () => {
    const { context, loadFromStore } = setup({ nodes: [node(1, ROOT)] });

    const { done } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1)]);
  });

  it('goes to the store when the nodes cover only part of the missing keys', () => {
    const { context, storeCalls } = setup({ nodes: [node(1, ROOT)] });

    track(loadBranches(context, [item(3, 1), item(4, 2)], createOptions(), false));

    expect(storeCalls).toHaveLength(1);
    expect(storeCalls[0].loadOptions.filter).toEqual([['id', '=', 1], 'or', ['id', '=', 2]]);
  });

  it('takes the children from the nodes instead of the store', () => {
    const { context, loadFromStore } = setup({
      expandedKeys: [1],
      nodes: [node(1, ROOT, [node(10, 1)])],
    });

    const { done } = track(loadBranches(context, [item(1, ROOT)], createOptions(), true));

    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(10, 1)]);
  });

  // The node is fully cached, but has no children to contribute.
  it('goes to the store when a cached expanded row has no child nodes', () => {
    const { context, storeCalls } = setup({
      expandedKeys: [1],
      nodes: [node(1, ROOT)],
    });

    track(loadBranches(context, [item(1, ROOT)], createOptions(), true));

    expect(storeCalls).toHaveLength(1);
    expect(storeCalls[0].loadOptions.filter).toEqual(['parentId', '=', 1]);
  });
});

describe('store data cache', () => {
  it('appends the loaded rows to the cached store data, sorted', () => {
    const { context, storeCalls, setCachedData } = setup({ cachedData: [item(5, ROOT)] });

    track(loadBranches(context, [item(2, 1)], createOptions(), false));
    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });

    expect(setCachedData).toHaveBeenCalledWith([item(1, ROOT), item(5, ROOT)]);
  });

  it('leaves the cache alone when filtering is local', () => {
    const { context, storeCalls, setCachedData } = setup({ cachedData: [item(5, ROOT)] });
    const options = createOptions({ remoteOperations: { filtering: false } });

    track(loadBranches(context, [item(2, 1)], options, false));
    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });

    expect(setCachedData).not.toHaveBeenCalled();
  });
});

describe('filter longer than maxFilterLengthInRequest', () => {
  it('loads unfiltered from a remote store and filters the result locally', () => {
    const { context, storeCalls } = setup({ maxFilterLengthInRequest: 0 });

    const { done } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    expect(storeCalls[0].loadOptions.filter).toBeNull();

    storeCalls[0].deferred.resolve({ data: [item(1, ROOT), item(99, ROOT)] });

    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1)]);
  });

  it('hands the predicate to a local store and keeps the cache untouched', () => {
    const { context, storeCalls, setCachedData } = setup({ maxFilterLengthInRequest: 0 });
    const options = createOptions({ remoteOperations: { filtering: false } });

    track(loadBranches(context, [item(2, 1)], options, false));

    const { filter } = storeCalls[0].loadOptions;

    expect(typeof filter).toBe('function');
    expect((filter as (data: RawItemData) => boolean)(item(1, ROOT))).toBe(true);
    expect((filter as (data: RawItemData) => boolean)(item(99, ROOT))).toBe(false);
    expect(setCachedData).not.toHaveBeenCalled();
  });
});

describe('fullData', () => {
  it('loads the branch from the passed data instead of the store', () => {
    const { context, loadFromStore } = setup();
    const options = createOptions({
      remoteOperations: { filtering: false },
      fullData: [item(1, ROOT), item(99, 5)],
    });

    const { done } = track(loadBranches(context, [item(2, 1)], options, false));

    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledWith([item(1, ROOT), item(2, 1)]);
  });
});

describe('outdated operation', () => {
  it('cancels the operation and rejects without loading', () => {
    const {
      context, state, loadFromStore, cancel,
    } = setup();

    state.lastOperationId = 2;

    const { done, fail } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    expect(cancel).toHaveBeenCalledWith(1);
    expect(loadFromStore).not.toHaveBeenCalled();
    expect(done).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
  });

  it('proceeds while no other operation has started', () => {
    const { context, state, storeCalls } = setup();

    state.lastOperationId = undefined;

    track(loadBranches(context, [item(2, 1)], createOptions(), false));

    expect(storeCalls).toHaveLength(1);
  });

  // T1311885: the guard has to run before the loaded rows are merged into the
  // cache, which a newer operation has already cleared.
  it('rejects and leaves the cache alone when the operation goes stale mid-load', () => {
    const {
      context, state, storeCalls, setCachedData,
    } = setup();

    const { done, fail } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    state.lastOperationId = 2;
    state.cachedData = undefined;

    expect(() => storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] })).not.toThrow();

    expect(setCachedData).not.toHaveBeenCalled();
    expect(done).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
  });
});

describe('store failure', () => {
  it('rejects with the store error', () => {
    const { context, storeCalls } = setup();
    const error = new Error('load failed');

    const { done, fail } = track(loadBranches(context, [item(2, 1)], createOptions(), false));

    // @ts-expect-error badly typed Deferred.reject
    storeCalls[0].deferred.reject(error);

    expect(done).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalledWith(error);
  });

  it('rejects when a child request fails after the parents were loaded', () => {
    const { context, storeCalls } = setup({ expandedKeys: [3] });
    const error = new Error('children failed');

    const { done, fail } = track(loadBranches(context, [item(3, 1)], createOptions(), true));

    storeCalls[0].deferred.resolve({ data: [item(1, ROOT)] });
    // @ts-expect-error badly typed Deferred.reject
    storeCalls[1].deferred.reject(error);

    expect(done).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalledWith(error);
  });
});
