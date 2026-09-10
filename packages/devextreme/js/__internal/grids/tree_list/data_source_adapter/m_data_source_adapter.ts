import { createObjectWithChanges } from '@js/common/data/array_utils';
import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined, isFunction } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import type Store from '@ts/data/abstract_store';
import type { ChangingEvent } from '@ts/data/data_source/types';
import type { BeforePushEvent } from '@ts/data/types';
import DataSourceAdapter from '@ts/grids/grid_core/data_source_adapter/m_data_source_adapter';
import { createDataSourceAdapterProvider } from '@ts/grids/grid_core/data_source_adapter/provider';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import treeListCore from '../m_core';
import type { LoadOperation, NodeByKey, TreeNode } from './types';
import { createIdFilter } from './utils/create_id_filter';
import type { LoadBranchesContext } from './utils/load_branches';
import { loadBranches } from './utils/load_branches';
import type { NodesContext } from './utils/nodes';
import {
  convertItemToNode, createNodesByItems, fillNodes, getVisibleNodes,
} from './utils/nodes';

const { queryByOptions } = storeHelper;

const DEFAULT_KEY_EXPRESSION = 'id';

const isFullBranchFilterMode = (that) => that.option('filterMode') === 'fullBranch';

const getChildKeys = function (that, keys) {
  const childKeys: any[] = [];

  keys.forEach((key) => {
    const node = that.getNodeByKey(key);

    node && node.children.forEach((child) => {
      childKeys.push(child.key);
    });
  });

  return childKeys;
};

export class DataSourceAdapterTreeList extends DataSourceAdapter {
  private _keyGetter: any;

  private _parentIdGetter: any;

  private _hasItemsGetter: any;

  private _itemsGetter: any;

  private _keySetter: any;

  private _parentIdSetter: any;

  private _hasItemsSetter: any;

  private _isChildrenLoaded: any;

  private _nodeByKey!: NodeByKey;

  private _isReload: any;

  private _rootNode?: TreeNode;

  public _isNodesInitializing = false;

  private _totalItemsCount: any;

  private _lastExpandedRowKeys: any;

  private _createKeyGetter() {
    const keyExpr = this.getKeyExpr();

    return compileGetter(keyExpr as string);
  }

  private _createKeySetter() {
    const keyExpr = this.getKeyExpr();

    if (isFunction(keyExpr)) {
      return keyExpr;
    }

    return compileSetter(keyExpr as string);
  }

  public createParentIdGetter(): (data: unknown) => unknown {
    return compileGetter(this.option('parentIdExpr')) as (data: unknown) => unknown;
  }

  public createParentIdSetter(): (data: unknown, value: unknown) => void {
    const parentIdExpr = this.option('parentIdExpr');

    if (isFunction(parentIdExpr)) {
      return parentIdExpr as (data: unknown, value: unknown) => void;
    }

    return compileSetter(parentIdExpr) as (data: unknown, value: unknown) => void;
  }

  private _createItemsGetter() {
    return compileGetter(this.option('itemsExpr'));
  }

  private _createHasItemsGetter() {
    const hasItemsExpr = this.option('hasItemsExpr');

    return hasItemsExpr && compileGetter(hasItemsExpr);
  }

  private _createHasItemsSetter() {
    const hasItemsExpr = this.option('hasItemsExpr');

    if (isFunction(hasItemsExpr)) {
      return hasItemsExpr;
    }

    return hasItemsExpr && compileSetter(hasItemsExpr);
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
      _parentIdGetter: this._parentIdGetter,
      _keyGetter: this._keyGetter,
      isRowExpanded: (key) => this.isRowExpanded(key),
      getCachedData: () => this._cachedStoreData,
      setCachedData: this.setCachedStoreData.bind(this),
      getLastOperationId: () => this._lastOperationId,
      getNodeByKey: this.getNodeByKey.bind(this),
    };
  }

  private _convertDataToPlainStructure(data, parentId?, result?) {
    let key;

    if (this._itemsGetter && !data.isConverted) {
      result = result || [];

      for (let i = 0; i < data.length; i++) {
        const item = createObjectWithChanges(data[i]);

        key = this._keyGetter(item);
        if (key === undefined) {
          key = result.length + 1;
          this._keySetter(item, key);
        }

        this._parentIdSetter(item, parentId === undefined ? this.option('rootValue') : parentId);

        result.push(item);

        const childItems = this._itemsGetter(item);
        if (childItems && childItems.length) {
          this._convertDataToPlainStructure(childItems, key, result);

          const itemsExpr = this.option('itemsExpr');
          if (!isFunction(itemsExpr)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete item[itemsExpr];
          }
        }
      }

      result.isConverted = true;

      return result;
    }

    return data;
  }

  protected override _calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload?: boolean) {
    const currentExpandedKeys = this.option('expandedRowKeys');

    return {
      ...super._calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload),
      nodeExpanding: !equalByValue(this._lastExpandedRowKeys, currentExpandedKeys),
    };
  }

  protected _customizeRemoteOperations(options, operationTypes) {
    super._customizeRemoteOperations.apply(this, arguments as any);

    options.remoteOperations.paging = false;

    let expandVisibleNodes = false;

    if (this.option('autoExpandAll')) {
      options.remoteOperations.sorting = false;
      options.remoteOperations.filtering = false;
      if ((!this._lastLoadOptions || operationTypes.filtering && !options.storeLoadOptions.filter) && !options.isCustomLoading) {
        expandVisibleNodes = true;
      }
    }

    if (!options.isCustomLoading) {
      this._isReload = this._isReload || operationTypes.reload;

      if (!options.cachedStoreData) {
        this._isChildrenLoaded = {};

        if (this._isReload) {
          this._nodeByKey = {};
        }
      }

      if (this.option('expandNodesOnFiltering') && (operationTypes.filtering || this._isReload && options.storeLoadOptions.filter)) {
        if (options.storeLoadOptions.filter) {
          expandVisibleNodes = true;
        } else {
          options.collapseVisibleNodes = true;
        }
      }
    }

    options.expandVisibleNodes = expandVisibleNodes;
  }

  private _getParentIdsToLoad(parentIds) {
    const parentIdsToLoad: any[] = [];

    for (let i = 0; i < parentIds.length; i++) {
      const node = this.getNodeByKey(parentIds[i]);

      if (!node || node.hasChildren && !node.children.length) {
        parentIdsToLoad.push(parentIds[i]);
      }
    }

    return parentIdsToLoad;
  }

  /**
   * @extended: TreeLists's data_source_adapter
   */
  protected customizeStoreLoadOptionsHandler(options) {
    const rootValue: any = this.option('rootValue');
    const parentIdExpr = this.option('parentIdExpr');
    let { parentIds } = options.storeLoadOptions;

    if (parentIds) {
      options.isCustomLoading = false;
    }

    super.customizeStoreLoadOptionsHandler.apply(this, arguments as any);

    if (options.remoteOperations.filtering && !options.isCustomLoading) {
      if (isFullBranchFilterMode(this) && options.cachedStoreData || !options.storeLoadOptions.filter) {
        const expandedRowKeys = options.collapseVisibleNodes ? [] : this.option('expandedRowKeys');
        parentIds = [rootValue].concat(expandedRowKeys).concat(parentIds || []);
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

  private _updateHasItemsMap(options) {
    const { parentIds } = options.storeLoadOptions;

    if (parentIds) {
      for (let i = 0; i < parentIds.length; i++) {
        this._isChildrenLoaded[parentIds[i]] = true;
      }
    }
  }

  protected _getKeyInfo() {
    return {
      key: () => 'key',
      keyOf: (data: { key: unknown }) => data.key,
    } as Store;
  }

  private _processChanges(changes) {
    let processedChanges: any[] = [];

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
    super.changingHandler.apply(this, arguments as any);

    const processChanges = (changes) => {
      const changesToProcess = changes.filter((item) => item.type === 'update');
      return this._processChanges(changesToProcess);
    };

    // @ts-expect-error need create treelist specific ChangingEvent type
    e.postProcessChanges = processChanges;
  }

  protected _applyBatch(changes) {
    const processedChanges = this._processChanges(changes);

    super._applyBatch(processedChanges);
  }

  private _setHasItems(node, value) {
    const hasItemsSetter = this._hasItemsSetter;
    node.hasChildren = value;
    if (hasItemsSetter && node.data) {
      hasItemsSetter(node.data, value);
    }
  }

  private _applyInsert(change) {
    const that = this;
    const baseChanges: any[] = [];
    const parentId = that.parentKeyOf(change.data);
    const parentNode = that.getNodeByKey(parentId);

    if (parentNode) {
      const node = convertItemToNode(change.data, that._nodeByKey, that._getNodesContext());

      node.hasChildren = false;
      node.level = parentNode.level! + 1;
      node.visible = true;

      parentNode.children.push(node);

      that._isChildrenLoaded[node.key as string] = true;

      that._setHasItems(parentNode, true);

      if ((!parentNode.parent || that.isRowExpanded(parentNode.key)) && change.index !== undefined) {
        // @ts-expect-error Badly typed items()
        let index = that.items().indexOf(parentNode) + 1;

        index += change.index >= 0 ? Math.min(change.index, parentNode.children.length) : parentNode.children.length;

        baseChanges.push({ type: change.type, data: node, index });
      }
    }

    return baseChanges;
  }

  protected _needToCopyDataObject() {
    return false;
  }

  private _applyRemove(change) {
    let baseChanges: any[] = [];
    const node = this.getNodeByKey(change.key);
    const parentNode = node && node.parent;

    if (parentNode) {
      const index = parentNode.children.indexOf(node);
      if (index >= 0) {
        parentNode.children.splice(index, 1);

        if (!parentNode.children.length) {
          this._setHasItems(parentNode, false);
        }

        baseChanges.push(change);
        baseChanges = baseChanges.concat(this.getChildNodeKeys(change.key).map((key) => ({ type: change.type, key })));
      }
    }

    return baseChanges;
  }

  public customizeLoadResultHandler(options) {
    const data = options.data = this._convertDataToPlainStructure(options.data);
    if (!options.remoteOperations.filtering && options.loadOptions.filter) {
      options.fullData = queryByOptions(query(options.data), { sort: options.loadOptions && options.loadOptions.sort }).toArray();
    }
    this._updateHasItemsMap(options);
    super.customizeLoadResultHandler(options);

    if (!options.isCustomLoading) {
      this._lastExpandedRowKeys = this.option('expandedRowKeys')?.slice();
    }

    if (data.isConverted && this._cachedStoreData) {
      // @ts-expect-error
      this._cachedStoreData.isConverted = true;
    }
  }

  private _processTreeStructure(options: LoadOperation, visibleItems?: RawItemData[]): void {
    let data = options.data as RawItemData[];
    const { parentIds } = options.storeLoadOptions;

    if (parentIds && parentIds.length || this._isReload) {
      if (options.fullData) {
        data = options.fullData;
        visibleItems ??= options.data as RawItemData[];
      }

      const nodesContext = this._getNodesContext();
      const { rootNode, nodeByKey } = createNodesByItems(data, visibleItems, nodesContext);

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
      this._rootNode!.children,
      (key) => this.isRowExpanded(key, options),
    );

    // @ts-expect-error From here on the rows are nodes, not the loaded items the base type describes.
    options.data = resultData;
    this._totalItemsCount = resultData.length;
  }

  protected customizeLoadResultHandlerCore(options: LoadOperation): void {
    const that = this;
    const { data } = options;
    const filter = options.storeLoadOptions.filter || options.loadOptions?.filter;
    const filterMode = that.option('filterMode');
    let visibleItems;
    const { parentIds } = options.storeLoadOptions;
    const needLoadParents = filter && (!parentIds || !parentIds.length) && filterMode !== 'standard';

    if (!options.isCustomLoading) {
      if (needLoadParents) {
        // @ts-expect-error
        const d = options.data = new Deferred();

        if (filterMode === 'matchOnly') {
          visibleItems = data;
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
            that._processTreeStructure(options, visibleItems);
            super.customizeLoadResultHandlerCore.call(that, options);
            d.resolve(options.data);
          })
          .fail(d.reject);

        return;
      }
      that._processTreeStructure(options);
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

  public init(dataSource) {
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

  public getKeyExpr() {
    const store = this.store();
    const key = store && store.key();
    const keyExpr = this.option('keyExpr');

    if (isDefined(key) && isDefined(keyExpr)) {
      if (!equalByValue(key, keyExpr)) {
        throw errors.Error('E1044');
      }
    }

    return key || keyExpr || DEFAULT_KEY_EXPRESSION;
  }

  public keyOf(data) {
    return this._keyGetter && this._keyGetter(data);
  }

  public parentKeyOf(data) {
    return this._parentIdGetter && this._parentIdGetter(data);
  }

  public getRootNode() {
    return this._rootNode;
  }

  public totalItemsCount() {
    return this._totalItemsCount + this._totalCountCorrection;
  }

  public isRowExpanded(key, cache?) {
    if (cache) {
      let { isExpandedByKey } = cache;
      if (!isExpandedByKey) {
        const expandedRowKeys = this.option('expandedRowKeys') ?? [];

        isExpandedByKey = cache.isExpandedByKey = {};

        expandedRowKeys.forEach((key) => {
          isExpandedByKey[key] = true;
        });
      }
      return !!isExpandedByKey[key];
    }

    const indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, this.option('expandedRowKeys'), null);

    return indexExpandedNodeKey >= 0;
  }

  protected _changeRowExpandCore(key) {
    const expandedRowKeys = (this.option('expandedRowKeys') as any[]).slice();
    const indexExpandedNodeKey = gridCoreUtils.getIndexByKey(key, expandedRowKeys, null);

    if (indexExpandedNodeKey < 0) {
      expandedRowKeys.push(key);
    } else {
      expandedRowKeys.splice(indexExpandedNodeKey, 1);
    }

    this.option('expandedRowKeys', expandedRowKeys);
  }

  public changeRowExpand(key) {
    this._changeRowExpandCore(key);
    // @ts-expect-error
    return this._isNodesInitializing ? new Deferred().resolve() : this.load();
  }

  public getNodeByKey(key): TreeNode | undefined {
    if (this._nodeByKey) {
      return this._nodeByKey[key];
    }

    return undefined;
  }

  private getNodeLeafKeys() {
    const that = this;
    const result: any[] = [];
    const keys = that._rootNode ? [that._rootNode.key] : [];

    keys.forEach((key) => {
      const node = that.getNodeByKey(key);

      node && treeListCore.foreachNodes([node], (childNode) => {
        !childNode.children.length && result.push(childNode.key);
      });
    });

    return result;
  }

  public getChildNodeKeys(parentKey) {
    const node = this.getNodeByKey(parentKey);
    const childrenKeys: any[] = [];

    node && treeListCore.foreachNodes(node.children, (childNode) => {
      childrenKeys.push(childNode.key);
    });

    return childrenKeys;
  }

  public loadDescendants(keys, childrenOnly) {
    const that = this;
    // @ts-expect-error
    const d = new Deferred();
    const remoteOperations = that.remoteOperations();

    if (isDefined(keys)) {
      keys = Array.isArray(keys) ? keys : [keys];
    } else {
      keys = that.getNodeLeafKeys();
    }

    if (!remoteOperations.filtering || !keys.length) {
      return d.resolve();
    }

    const loadOptions = that._dataSource._createStoreLoadOptions();
    loadOptions.parentIds = keys;

    that.customLoader.load(loadOptions)
      .done(() => {
        if (!childrenOnly) {
          const childKeys = getChildKeys(that, keys);

          if (childKeys.length) {
            that.loadDescendants(childKeys, childrenOnly).done(d.resolve).fail(d.reject);
            return;
          }
        }
        d.resolve();
      })
      .fail(d.reject);

    return d.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public forEachNode(nodeCallback?: (node: any) => void) {
    let nodes: TreeNode[] = [];
    let callback;

    if (arguments.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[0];

      const rootNode = this.getRootNode();
      nodes = rootNode?.children ?? [];
    } else if (arguments.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[1];

      // eslint-disable-next-line prefer-destructuring
      nodes = arguments[0];
      nodes = Array.isArray(nodes) ? nodes : [nodes];
    }

    treeListCore.foreachNodes(nodes, callback);
  }
}

export default createDataSourceAdapterProvider(DataSourceAdapterTreeList);
