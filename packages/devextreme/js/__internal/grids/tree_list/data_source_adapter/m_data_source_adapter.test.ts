import {
  describe, expect, it, jest,
} from '@jest/globals';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import CustomStore from '@js/data/custom_store';
import DataSource from '@js/data/data_source';
import type { CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import { DataSourceAdapterTreeList } from './m_data_source_adapter';
import type { TreeNode } from './types';
import type { LoadBranchesContext } from './utils/load_branches';

const ROOT = 0;

const DEFAULT_OPTIONS: Record<string, unknown> = {
  rootValue: ROOT,
  parentIdExpr: 'parentId',
  maxFilterLengthInRequest: 1500,
  expandedRowKeys: [],
  dataStructure: 'plain',
  hasItemsExpr: 'hasItems',
  filterMode: 'fullBranch',
  remoteOperations: { filtering: true },
};

interface AdapterState {
  _cachedStoreData: RawItemData[] | undefined;
  _lastOperationId: number | undefined;
  _nodeByKey: Record<string, TreeNode>;
}

interface Setup {
  adapter: DataSourceAdapterTreeList;
  state: AdapterState;
  dataSource: DataSource;
  getContext: () => LoadBranchesContext;
  options: Record<string, unknown>;
}

const setup = (optionOverrides: Record<string, unknown> = {}): Setup => {
  const options = { ...DEFAULT_OPTIONS, ...optionOverrides };

  const store = new CustomStore({
    key: 'id',
    load: (): DeferredObj<RawItemData[]> => Deferred<RawItemData[]>().resolve([]),
  });

  const dataSource = new DataSource({ store });

  const component = {
    option: jest.fn((name: string) => options[name]),
    _createActionByOption: jest.fn(() => jest.fn()),
    on: jest.fn(),
    off: jest.fn(),
    _eventsStrategy: {
      on: jest.fn(),
      off: jest.fn(),
      fireEvent: jest.fn(),
      hasEvent: jest.fn(() => false),
    },
  };

  const adapter = new DataSourceAdapterTreeList(component as never);

  adapter.init(dataSource);

  const getContext = (): LoadBranchesContext => (
    adapter as unknown as { getLoadBranchesContext: () => LoadBranchesContext }
  ).getLoadBranchesContext();

  return {
    adapter,
    state: adapter as unknown as AdapterState,
    dataSource,
    getContext,
    options,
  };
};

describe('getLoadBranchesContext', () => {
  describe('options', () => {
    it('forwards the branch loading options', () => {
      const { getContext } = setup();

      expect(getContext()).toMatchObject({
        rootValue: ROOT,
        parentIdExpr: 'parentId',
        maxFilterLengthInRequest: 1500,
      });
    });

    it('takes keyExpr from the store key', () => {
      const { getContext } = setup();

      expect(getContext().keyExpr).toBe('id');
    });
  });

  describe('live adapter state', () => {
    it('observes the store data cache being cleared after the context is built', () => {
      const { state, getContext } = setup();

      state._cachedStoreData = [{ id: 1, parentId: ROOT }];

      const context = getContext();

      expect(context.getCachedData()).toEqual([{ id: 1, parentId: ROOT }]);

      state._cachedStoreData = undefined;

      expect(context.getCachedData()).toBeUndefined();
    });

    it('observes a newer operation starting after the context is built', () => {
      const { state, getContext } = setup();

      state._lastOperationId = 1;

      const context = getContext();

      expect(context.getLastOperationId()).toBe(1);

      state._lastOperationId = 2;

      expect(context.getLastOperationId()).toBe(2);
    });

    it('observes rows being expanded after the context is built', () => {
      const { getContext, options } = setup();

      const context = getContext();

      expect(context.isRowExpanded(1)).toBe(false);

      options.expandedRowKeys = [1];

      expect(context.isRowExpanded(1)).toBe(true);
    });

    it('observes nodes appearing after the context is built', () => {
      const { state, getContext } = setup();

      const context = getContext();

      expect(context.getNodeByKey(1)).toBeUndefined();

      const node: TreeNode = { key: 1, data: { id: 1, parentId: ROOT }, children: [] };

      state._nodeByKey = { 1: node };

      expect(context.getNodeByKey(1)).toBe(node);
    });

    it('writes the sorted cache back to the adapter', () => {
      const { state, getContext } = setup();

      const sorted = [{ id: 1, parentId: ROOT }];

      getContext().setCachedData(sorted);

      expect(state._cachedStoreData).toBe(sorted);
    });
  });

  describe('data accessors', () => {
    it('reads the key and the parent id off a row', () => {
      const { getContext } = setup();
      const context = getContext();
      const row = { id: 7, parentId: 3 };

      expect(context._keyGetter(row)).toBe(7);
      expect(context._parentIdGetter(row)).toBe(3);
    });

    it('honours a custom parentIdExpr', () => {
      const { getContext } = setup({ parentIdExpr: 'Task_Parent_ID' });

      expect(getContext()._parentIdGetter({ Task_Parent_ID: 9 })).toBe(9);
    });
  });

  describe('delegation', () => {
    it('cancels the operation on the data source', () => {
      const { dataSource, getContext } = setup();
      const cancel = jest.spyOn(dataSource, 'cancel').mockReturnValue(true);

      getContext().dataSource.cancel(42);

      expect(cancel).toHaveBeenCalledWith(42);
    });

    it('loads through the custom loader', () => {
      const { adapter, getContext } = setup();
      const deferred = Deferred<CustomLoadResult>();
      const loadFromStore = jest
        .spyOn(adapter.customLoader, 'loadFromStore')
        .mockReturnValue(deferred);

      const result = getContext().customLoader.loadFromStore({ filter: ['id', '=', 1] });

      expect(loadFromStore).toHaveBeenCalledWith({ filter: ['id', '=', 1] });
      expect(result).toBe(deferred);
    });
  });
});
