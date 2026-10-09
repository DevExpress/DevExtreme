import { createObjectWithChanges } from '@js/common/data/array_utils';
import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined, isFunction } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import errors from '@js/ui/widget/ui.errors';
import type Store from '@ts/data/abstract_store';
import type { DataSource } from '@ts/data/data_source/data_source';
import type { ChangingEvent, StoreLoadOptions } from '@ts/data/data_source/types';
import type { BeforePushEvent } from '@ts/data/types';
import DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import { createDataSourceAdapterProvider } from '@ts/grids/grid_core/data_source_adapter/provider';
import type { OperationTypes as BaseOperationTypes, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { RowKey } from '@ts/grids/grid_core/types';

import treeListCore from '../core';
import type {
  ConvertibleData,
  DataGetter,
  DataSetter,
  KeyExpr,
  LoadOperation,
  NodeByKey,
  NodeCallback,
  OperationTypes,
  TreeNode,
} from './types';
import { createIdFilter } from './utils/create_id_filter';
import type { LoadBranchesContext } from './utils/load_branches';
import { loadBranches } from './utils/load_branches';
import type { NodesContext } from './utils/nodes';
import {
  convertItemToNode, createNodesByItems, fillNodes, getVisibleNodes,
} from './utils/nodes';

const { queryByOptions } = storeHelper;

const DEFAULT_KEY_EXPRESSION = 'id';

const isFullBranchFilterMode = (adapter: DataSourceAdapterTreeList): boolean => adapter.option('filterMode') === 'fullBranch';

const getChildKeys = (adapter: DataSourceAdapterTreeList, keys: RowKey[]): RowKey[] => {
  const childKeys: RowKey[] = [];

  keys.forEach((key) => {
    const node = adapter.getNodeByKey(key);

    if (node) {
      node.children.forEach((child) => {
        childKeys.push(child.key);
      });
    }
  });

  return childKeys;
};

export class DataSourceAdapterTreeList extends DataSourceAdapter {
  private _keyGetter!: DataGetter;

  private _parentIdGetter!: DataGetter;

  private _hasItemsGetter?: DataGetter;

  private _itemsGetter?: DataGetter;

  private _keySetter?: DataSetter;

  private _parentIdSetter?: DataSetter;

  private _hasItemsSetter?: DataSetter;

  private _isChildrenLoaded!: Record<string, boolean>;

  private _nodeByKey!: NodeByKey;

  private _isReload?: boolean;

  private _rootNode?: TreeNode;

  public _isNodesInitializing = false;

  private _totalItemsCount!: number;

  private _lastExpandedRowKeys?: RowKey[];

  private _createKeyGetter(): DataGetter {
    const keyExpr = this.getKeyExpr();

    return compileGetter(keyExpr as string) as DataGetter;
  }

  private _createKeySetter(): DataSetter {
    const keyExpr = this.getKeyExpr();

    if (isFunction(keyExpr)) {
      return keyExpr;
    }

    return compileSetter(keyExpr as string) as DataSetter;
  }

  public createParentIdGetter(): DataGetter {
    return compileGetter(this.option('parentIdExpr')) as DataGetter;
  }

  public createParentIdSetter(): DataSetter {
    const parentIdExpr = this.option('parentIdExpr');

    if (isFunction(parentIdExpr)) {
      return parentIdExpr as DataSetter;
    }

    return compileSetter(parentIdExpr) as DataSetter;
  }

  private _createItemsGetter(): DataGetter {
    return compileGetter(this.option('itemsExpr')) as DataGetter;
  }

  private _createHasItemsGetter(): DataGetter | undefined {
    const hasItemsExpr = this.option('hasItemsExpr');

    return hasItemsExpr
      ? compileGetter(hasItemsExpr) as DataGetter
      : undefined;
  }

  private _createHasItemsSetter(): DataSetter | undefined {
    const hasItemsExpr = this.option('hasItemsExpr');

    if (isFunction(hasItemsExpr)) {
      return hasItemsExpr as DataSetter;
    }

    return hasItemsExpr
      ? compileSetter(hasItemsExpr) as DataSetter
      : undefined;
  }

  private _getNodesContext(): NodesContext {
    return {
      rootValue: this.option('rootValue'),
      isFullBranchFilterMode: isFullBranchFilterMode(this),
      keyGetter: this._keyGetter,
      parentIdGetter: this._parentIdGetter,
      hasItemsGetter: this._hasItemsGetter,
      isChildrenLoaded: this._isChildrenLoaded,
    };
  }

  private getLoadBranchesContext(): LoadBranchesContext {
    return {
      dataSource: this._dataSource,
      customLoader: this.customLoader,
      rootValue: this.option('rootValue'),
      maxFilterLengthInRequest: this.option('maxFilterLengthInRequest'),
      parentIdExpr: this.option('parentIdExpr'),
      keyExpr: this.getKeyExpr(),
      _parentIdGetter: this._parentIdGetter.bind(this),
      _keyGetter: this._keyGetter.bind(this),
      isRowExpanded: (key) => this.isRowExpanded(key),
      getCachedData: () => this._cachedStoreData,
      setCachedData: this.setCachedStoreData.bind(this),
      getLastOperationId: () => this._lastOperationId,
      getNodeByKey: this.getNodeByKey.bind(this),
    };
  }

  private _convertDataToPlainStructure(
    data: ConvertibleData,
    parentId?: RowKey,
    result?: ConvertibleData,
  ): ConvertibleData {
    const itemsGetter = this._itemsGetter;

    if (!itemsGetter || data.isConverted) {
      return data;
    }

    const resultData: ConvertibleData = result ?? [];

    for (const dataItem of data) {
      const item = createObjectWithChanges(dataItem) as RawItemData;

      let key = this._keyGetter(item);
      if (key === undefined) {
        key = resultData.length + 1;
        this._keySetter?.(item, key);
      }

      this._parentIdSetter?.(item, parentId === undefined ? this.option('rootValue') : parentId);

      resultData.push(item);

      const childItems = itemsGetter(item) as ConvertibleData | undefined;
      if (childItems && childItems.length) {
        this._convertDataToPlainStructure(childItems, key, resultData);

        const itemsExpr = this.option('itemsExpr');
        if (!isFunction(itemsExpr)) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- field name
          delete item[itemsExpr as string];
        }
      }
    }

    resultData.isConverted = true;

    return resultData;
  }

  protected override _calculateOperationTypes(
    loadOptions: StoreLoadOptions,
    lastLoadOptions: (StoreLoadOptions & { groupExpand?: boolean }) | undefined,
    isFullReload?: boolean,
  ): OperationTypes {
    const currentExpandedKeys = this.option('expandedRowKeys');

    return {
      ...super._calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload),
      nodeExpanding: !equalByValue(this._lastExpandedRowKeys, currentExpandedKeys),
    };
  }

  protected _customizeRemoteOperations(
    options: LoadOperation,
    operationTypes: BaseOperationTypes,
  ): void {
    super._customizeRemoteOperations(options, operationTypes);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- set before load
    const remoteOperations = options.remoteOperations!;
    remoteOperations.paging = false;

    let expandVisibleNodes = false;

    if (this.option('autoExpandAll')) {
      remoteOperations.sorting = false;
      remoteOperations.filtering = false;
      const isFilterReset = operationTypes.filtering && !options.storeLoadOptions.filter;
      if ((!this._lastLoadOptions || isFilterReset) && !options.isCustomLoading) {
        expandVisibleNodes = true;
      }
    }

    if (!options.isCustomLoading) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of flags
      this._isReload = this._isReload || operationTypes.reload;

      if (!options.cachedStoreData) {
        this._isChildrenLoaded = {};

        if (this._isReload) {
          this._nodeByKey = {};
        }
      }

      if (this.option('expandNodesOnFiltering')
        && (operationTypes.filtering || (this._isReload && options.storeLoadOptions.filter))) {
        if (options.storeLoadOptions.filter) {
          expandVisibleNodes = true;
        } else {
          options.collapseVisibleNodes = true;
        }
      }
    }

    options.expandVisibleNodes = expandVisibleNodes;
  }

  private _getParentIdsToLoad(parentIds: RowKey[]): RowKey[] {
    const parentIdsToLoad: RowKey[] = [];

    for (const parentId of parentIds) {
      const node = this.getNodeByKey(parentId);

      if (!node || (node.hasChildren && !node.children.length)) {
        parentIdsToLoad.push(parentId);
      }
    }

    return parentIdsToLoad;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected customizeStoreLoadOptionsHandler(options: LoadOperation): void {
    const rootValue: RowKey = this.option('rootValue');
    const parentIdExpr = this.option('parentIdExpr');
    let { parentIds } = options.storeLoadOptions;

    if (parentIds) {
      options.isCustomLoading = false;
    }

    super.customizeStoreLoadOptionsHandler(options);

    // @ts-expect-error remoteOperations is set before load
    if (options.remoteOperations.filtering && !options.isCustomLoading) {
      if ((isFullBranchFilterMode(this) && options.cachedStoreData)
        || !options.storeLoadOptions.filter) {
        const expandedRowKeys = options.collapseVisibleNodes ? [] : this.option('expandedRowKeys');
        parentIds = [rootValue].concat(expandedRowKeys).concat(parentIds ?? []);
        const parentIdsToLoad = options.data ? this._getParentIdsToLoad(parentIds) : parentIds;

        if (parentIdsToLoad.length) {
          options.cachedPagingData = undefined;
          options.data = undefined;
          options.mergeStoreLoadData = true;
          options.delay = this.option('loadingTimeout'); // T991320
        }

        options.storeLoadOptions.parentIds = parentIdsToLoad;
        options.storeLoadOptions.filter = createIdFilter(parentIdExpr, parentIdsToLoad);
      }
    }
  }

  private _updateHasItemsMap(options: LoadOperation): void {
    const { parentIds } = options.storeLoadOptions;

    if (parentIds) {
      for (const parentId of parentIds) {
        this._isChildrenLoaded[parentId as string] = true;
      }
    }
  }

  protected _getKeyInfo(): Store {
    return {
      key: () => 'key',
      keyOf: (data: { key: unknown }) => data.key,
    } as Store;
  }

  private _processChanges(changes: StoreChange[]): StoreChange[] {
    let processedChanges: StoreChange[] = [];

    changes.forEach((change) => {
      if (change.type === 'insert') {
        processedChanges = processedChanges.concat(this._applyInsert(change));
      } else if (change.type === 'remove') {
        processedChanges = processedChanges.concat(this._applyRemove(change));
      } else if (change.type === 'update') {
        processedChanges.push({ type: change.type, key: change.key, data: { data: change.data } });
      }
    });

    return processedChanges;
  }

  protected changingHandler(e: ChangingEvent): void {
    super.changingHandler(e);

    const processChanges = (changes: StoreChange[]): StoreChange[] => {
      const changesToProcess = changes.filter((item) => item.type === 'update');
      return this._processChanges(changesToProcess);
    };

    // @ts-expect-error need create treelist specific ChangingEvent type
    e.postProcessChanges = processChanges;
  }

  protected _applyBatch(changes: StoreChange[]): void {
    const processedChanges = this._processChanges(changes);

    super._applyBatch(processedChanges);
  }

  private _setHasItems(node: TreeNode, value: boolean): void {
    const hasItemsSetter = this._hasItemsSetter;
    node.hasChildren = value;
    if (hasItemsSetter && node.data) {
      hasItemsSetter(node.data, value);
    }
  }

  private _applyInsert(change: StoreChange): StoreChange[] {
    const baseChanges: StoreChange[] = [];
    const parentId = this.parentKeyOf(change.data);
    const parentNode = this.getNodeByKey(parentId);

    if (parentNode) {
      const node = convertItemToNode(change.data, this._nodeByKey, this._getNodesContext());

      node.hasChildren = false;
      // @ts-expect-error level is set on every node when the tree is built
      node.level = parentNode.level + 1;
      node.visible = true;

      parentNode.children.push(node);

      this._isChildrenLoaded[node.key as string] = true;

      this._setHasItems(parentNode, true);

      if ((!parentNode.parent || this.isRowExpanded(parentNode.key))
        && change.index !== undefined) {
        let index = this.items().indexOf(parentNode) + 1;

        index += change.index >= 0
          ? Math.min(change.index, parentNode.children.length)
          : parentNode.children.length;

        baseChanges.push({ type: change.type, data: node, index });
      }
    }

    return baseChanges;
  }

  protected _needToCopyDataObject(): boolean {
    return false;
  }

  private _applyRemove(change: StoreChange): StoreChange[] {
    let baseChanges: StoreChange[] = [];
    const node = this.getNodeByKey(change.key);
    const parentNode = node?.parent;

    if (parentNode && node) {
      const index = parentNode.children.indexOf(node);
      if (index >= 0) {
        parentNode.children.splice(index, 1);

        if (!parentNode.children.length) {
          this._setHasItems(parentNode, false);
        }

        baseChanges.push(change);
        baseChanges = baseChanges.concat(
          this.getChildNodeKeys(change.key).map((key) => ({ type: change.type, key })),
        );
      }
    }

    return baseChanges;
  }

  public customizeLoadResultHandler(options: LoadOperation): void {
    const data = this._convertDataToPlainStructure(options.data as ConvertibleData);
    options.data = data;
    // @ts-expect-error remoteOperations and loadOptions are set before load
    if (!options.remoteOperations.filtering && options.loadOptions.filter) {
      // @ts-expect-error query() is not generic, its rows are the loaded items
      options.fullData = queryByOptions(
        query(data),
        { sort: options.loadOptions?.sort },
      ).toArray();
    }
    this._updateHasItemsMap(options);
    super.customizeLoadResultHandler(options);

    if (!options.isCustomLoading) {
      this._lastExpandedRowKeys = this.option('expandedRowKeys')?.slice();
    }

    if (data.isConverted && this._cachedStoreData) {
      // @ts-expect-error isConverted flag stashed on the cached array
      this._cachedStoreData.isConverted = true;
    }
  }

  private _processTreeStructure(options: LoadOperation, visibleItems?: RawItemData[]): void {
    let data = options.data as RawItemData[];
    let visibleData = visibleItems;
    const { parentIds } = options.storeLoadOptions;

    if (parentIds?.length || this._isReload) {
      if (options.fullData) {
        data = options.fullData;
        visibleData ??= options.data as RawItemData[];
      }

      const nodesContext = this._getNodesContext();
      const { rootNode, nodeByKey } = createNodesByItems(data, visibleData, nodesContext);

      this._nodeByKey = nodeByKey;
      this._rootNode = rootNode;

      if (!this._rootNode) {
        // @ts-expect-error badly typed Deferred
        options.data = Deferred().reject(errors.Error('E1046', this.getKeyExpr()));
        return;
      }

      const expandedRowKeys = fillNodes(this._rootNode.children, options, nodesContext);

      this._isNodesInitializing = true;
      if (options.collapseVisibleNodes || expandedRowKeys.length) {
        this.option('expandedRowKeys', expandedRowKeys);
      }
      this._isReload = false;
      this.executeAction('onNodesInitialized', { root: this._rootNode });
      this._isNodesInitializing = false;
    }

    const resultData = getVisibleNodes(
      // @ts-expect-error the root node is created on the first load
      this._rootNode.children,
      (key) => this.isRowExpanded(key, options),
    );

    options.data = resultData;
    this._totalItemsCount = resultData.length;
  }

  protected customizeLoadResultHandlerCore(options: LoadOperation): void {
    const { data } = options;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- filter is any
    const filter = options.storeLoadOptions.filter || options.loadOptions?.filter;
    const filterMode = this.option('filterMode');
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned below
    let visibleItems: RawItemData[] | undefined;
    const { parentIds } = options.storeLoadOptions;
    const needLoadParents = filter && !parentIds?.length && filterMode !== 'standard';

    if (!options.isCustomLoading) {
      if (needLoadParents) {
        const d = Deferred();
        // @ts-expect-error data holds a Deferred until the branches are loaded
        options.data = d;

        if (filterMode === 'matchOnly') {
          visibleItems = data as RawItemData[];
        }

        const needLoadChildren = isFullBranchFilterMode(this);

        loadBranches(
          this.getLoadBranchesContext(),
          data as RawItemData[],
          options,
          needLoadChildren,
        )
          .done((loadedData) => {
            options.data = loadedData;
            this._processTreeStructure(options, visibleItems);
            super.customizeLoadResultHandlerCore.call(this, options);
            d.resolve(options.data);
          })
          .fail(d.reject as (...a: unknown[]) => void);

        return;
      }
      this._processTreeStructure(options);
    }

    super.customizeLoadResultHandlerCore(options);
  }

  protected pushHandler(e: BeforePushEvent): void {
    const reshapeOnPush = this._dataSource._reshapeOnPush;
    const isNeedReshape = reshapeOnPush && !!e.changes.length;

    if (isNeedReshape) {
      this._isReload = true;
    }
    e.changes.forEach((change) => { change.index ??= -1; });
    super.pushHandler(e);
  }

  public init(dataSource?: DataSource): void {
    super.init(dataSource);

    const dataStructure = this.option('dataStructure');

    this._keyGetter = this._createKeyGetter();
    this._parentIdGetter = this.createParentIdGetter();
    this._hasItemsGetter = this._createHasItemsGetter();
    this._hasItemsSetter = this._createHasItemsSetter();

    if (dataStructure === 'tree') {
      this._itemsGetter = this._createItemsGetter();
      this._keySetter = this._createKeySetter();
      this._parentIdSetter = this.createParentIdSetter();
    }

    this._nodeByKey = {};
    this._isChildrenLoaded = {};
    this._totalItemsCount = 0;
    this.createAction('onNodesInitialized');
  }

  public getKeyExpr(): KeyExpr {
    const store = this.store();
    const key = store?.key();
    const keyExpr = this.option('keyExpr');

    if (isDefined(key) && isDefined(keyExpr)) {
      if (!equalByValue(key, keyExpr)) {
        throw errors.Error('E1044');
      }
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
    return key || keyExpr || DEFAULT_KEY_EXPRESSION;
  }

  public keyOf(data: unknown): RowKey {
    return this._keyGetter?.(data);
  }

  public parentKeyOf(data: unknown): RowKey {
    return this._parentIdGetter?.(data);
  }

  public getRootNode(): TreeNode | undefined {
    return this._rootNode;
  }

  public totalItemsCount(): number {
    return this._totalItemsCount + this._totalCountCorrection;
  }

  public isRowExpanded(
    key: RowKey,
    cache?: Pick<LoadOperation, 'isExpandedByKey'>,
  ): boolean {
    if (cache) {
      let { isExpandedByKey } = cache;
      if (!isExpandedByKey) {
        const expandedRowKeys = this.option('expandedRowKeys') ?? [];
        const map: Record<string, boolean> = {};

        expandedRowKeys.forEach((expandedKey) => {
          map[expandedKey as string] = true;
        });

        isExpandedByKey = map;
        cache.isExpandedByKey = map;
      }
      return !!isExpandedByKey[key as string];
    }

    const indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, this.option('expandedRowKeys'), null);

    return indexExpandedNodeKey >= 0;
  }

  protected _changeRowExpandCore(key: RowKey): void {
    // @ts-expect-error expandedRowKeys defaults to []
    const expandedRowKeys: RowKey[] = this.option('expandedRowKeys').slice();
    const indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, expandedRowKeys, null);

    if (indexExpandedNodeKey < 0) {
      expandedRowKeys.push(key);
    } else {
      expandedRowKeys.splice(indexExpandedNodeKey, 1);
    }

    this.option('expandedRowKeys', expandedRowKeys);
  }

  public changeRowExpand(key: RowKey): DeferredObj<unknown> {
    this._changeRowExpandCore(key);
    return this._isNodesInitializing ? Deferred<unknown>().resolve() : this.load();
  }

  public getNodeByKey(key: RowKey): TreeNode | undefined {
    if (this._nodeByKey) {
      return this._nodeByKey[key as string];
    }

    return undefined;
  }

  private getNodeLeafKeys(): RowKey[] {
    const result: RowKey[] = [];
    const keys = this._rootNode ? [this._rootNode.key] : [];

    keys.forEach((key) => {
      const node = this.getNodeByKey(key);

      if (node) {
        treeListCore.foreachNodes([node], (childNode) => {
          if (!childNode.children.length) {
            result.push(childNode.key);
          }
        });
      }
    });

    return result;
  }

  public getChildNodeKeys(parentKey: RowKey): RowKey[] {
    const node = this.getNodeByKey(parentKey);
    const childrenKeys: RowKey[] = [];

    if (node) {
      treeListCore.foreachNodes(node.children, (childNode) => {
        childrenKeys.push(childNode.key);
      });
    }

    return childrenKeys;
  }

  public loadDescendants(keys?: RowKey | RowKey[], childrenOnly?: boolean): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const remoteOperations = this.remoteOperations();

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
    let keyList: RowKey[];
    if (!isDefined(keys)) {
      keyList = this.getNodeLeafKeys();
    } else if (Array.isArray(keys)) {
      keyList = keys;
    } else {
      keyList = [keys];
    }

    if (!remoteOperations.filtering || !keyList.length) {
      return d.resolve();
    }

    const loadOptions: LoadOperation['storeLoadOptions'] = this._dataSource._createStoreLoadOptions();
    loadOptions.parentIds = keyList;

    const resolve = d.resolve as (...a: unknown[]) => void;
    const reject = d.reject as (...a: unknown[]) => void;

    this.customLoader.load(loadOptions)
      .done(() => {
        if (!childrenOnly) {
          const childKeys = getChildKeys(this, keyList);

          if (childKeys.length) {
            this.loadDescendants(childKeys, childrenOnly).done(resolve).fail(reject);
            return;
          }
        }
        d.resolve();
      })
      .fail(reject);

    // @ts-expect-error promise() is typed as Promise but callers use done/fail
    return d.promise();
  }

  public forEachNode(callback: NodeCallback): void;

  public forEachNode(nodes: TreeNode | TreeNode[], callback: NodeCallback): void;

  public forEachNode(...args: [NodeCallback] | [TreeNode | TreeNode[], NodeCallback]): void {
    let nodes: TreeNode[] = [];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
    let callback: NodeCallback | undefined;

    if (args.length === 1) {
      [callback] = args;

      const rootNode = this.getRootNode();
      nodes = rootNode?.children ?? [];
    } else if (args.length === 2) {
      const [nodesArg, nodeCallback] = args;
      callback = nodeCallback;

      nodes = Array.isArray(nodesArg) ? nodesArg : [nodesArg];
    }

    treeListCore.foreachNodes(nodes, callback);
  }
}

export default createDataSourceAdapterProvider(DataSourceAdapterTreeList);
