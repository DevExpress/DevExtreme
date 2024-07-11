"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _array_utils = require("../../../../data/array_utils");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _store_helper = _interopRequireDefault(require("../../../../data/store_helper"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_data_source_adapter = _interopRequireDefault(require("../../../grids/grid_core/data_source_adapter/m_data_source_adapter"));
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  queryByOptions
} = _store_helper.default;
const DEFAULT_KEY_EXPRESSION = 'id';
const isFullBranchFilterMode = that => that.option('filterMode') === 'fullBranch';
const getChildKeys = function (that, keys) {
  const childKeys = [];
  keys.forEach(key => {
    const node = that.getNodeByKey(key);
    node && node.children.forEach(child => {
      childKeys.push(child.key);
    });
  });
  return childKeys;
};
const applySorting = (data, sort) => queryByOptions((0, _query.default)(data), {
  sort
}).toArray();
class DataSourceAdapterTreeList extends _m_data_source_adapter.default {
  _createKeyGetter() {
    const keyExpr = this.getKeyExpr();
    return (0, _data.compileGetter)(keyExpr);
  }
  _createKeySetter() {
    const keyExpr = this.getKeyExpr();
    if ((0, _type.isFunction)(keyExpr)) {
      return keyExpr;
    }
    return (0, _data.compileSetter)(keyExpr);
  }
  createParentIdGetter() {
    return (0, _data.compileGetter)(this.option('parentIdExpr'));
  }
  createParentIdSetter() {
    const parentIdExpr = this.option('parentIdExpr');
    if ((0, _type.isFunction)(parentIdExpr)) {
      return parentIdExpr;
    }
    return (0, _data.compileSetter)(parentIdExpr);
  }
  _createItemsGetter() {
    return (0, _data.compileGetter)(this.option('itemsExpr'));
  }
  _createHasItemsGetter() {
    const hasItemsExpr = this.option('hasItemsExpr');
    return hasItemsExpr && (0, _data.compileGetter)(hasItemsExpr);
  }
  _createHasItemsSetter() {
    const hasItemsExpr = this.option('hasItemsExpr');
    if ((0, _type.isFunction)(hasItemsExpr)) {
      return hasItemsExpr;
    }
    return hasItemsExpr && (0, _data.compileSetter)(hasItemsExpr);
  }
  _updateIndexByKeyObject(items) {
    const that = this;
    that._indexByKey = {};
    (0, _iterator.each)(items, (index, item) => {
      that._indexByKey[item.key] = index;
    });
  }
  _calculateHasItems(node, options) {
    const that = this;
    const {
      parentIds
    } = options.storeLoadOptions;
    let hasItems;
    const isFullBranch = isFullBranchFilterMode(that);
    if (that._hasItemsGetter && (parentIds || !options.storeLoadOptions.filter || isFullBranch)) {
      hasItems = that._hasItemsGetter(node.data);
    }
    if (hasItems === undefined) {
      if (!that._isChildrenLoaded[node.key] && options.remoteOperations.filtering && (parentIds || isFullBranch)) {
        hasItems = true;
      } else if (options.loadOptions.filter && !options.remoteOperations.filtering && isFullBranch) {
        hasItems = node.children.length;
      } else {
        hasItems = node.hasChildren;
      }
    }
    return !!hasItems;
  }
  _fillVisibleItemsByNodes(nodes, options, result) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].visible) {
        result.push(nodes[i]);
      }
      if ((this.isRowExpanded(nodes[i].key, options) || !nodes[i].visible) && nodes[i].hasChildren && nodes[i].children.length) {
        this._fillVisibleItemsByNodes(nodes[i].children, options, result);
      }
    }
  }
  _convertItemToNode(item, rootValue, nodeByKey) {
    const key = this._keyGetter(item);
    let parentId = this._parentIdGetter(item);
    parentId = (0, _type.isDefined)(parentId) ? parentId : rootValue;
    const parentNode = nodeByKey[parentId] = nodeByKey[parentId] || {
      key: parentId,
      children: []
    };
    const node = nodeByKey[key] = nodeByKey[key] || {
      key,
      children: []
    };
    node.data = item;
    node.parent = parentNode;
    return node;
  }
  _createNodesByItems(items, visibleItems) {
    const that = this;
    const rootValue = that.option('rootValue');
    const visibleByKey = {};
    const nodeByKey = that._nodeByKey = {};
    let i;
    if (visibleItems) {
      for (i = 0; i < visibleItems.length; i++) {
        visibleByKey[this._keyGetter(visibleItems[i])] = true;
      }
    }
    for (i = 0; i < items.length; i++) {
      const node = that._convertItemToNode(items[i], rootValue, nodeByKey);
      if (node.key === undefined) {
        return;
      }
      node.visible = !visibleItems || !!visibleByKey[node.key];
      if (node.parent) {
        node.parent.children.push(node);
      }
    }
    const rootNode = nodeByKey[rootValue] || {
      key: rootValue,
      children: []
    };
    rootNode.level = -1;
    return rootNode;
  }
  _convertDataToPlainStructure(data, parentId, result) {
    let key;
    if (this._itemsGetter && !data.isConverted) {
      result = result || [];
      for (let i = 0; i < data.length; i++) {
        const item = (0, _array_utils.createObjectWithChanges)(data[i]);
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
          if (!(0, _type.isFunction)(itemsExpr)) {
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
  _createIdFilter(field, keys) {
    const parentIdFilters = [];
    for (let i = 0; i < keys.length; i++) {
      parentIdFilters.push([field, '=', keys[i]]);
    }
    return _m_utils.default.combineFilters(parentIdFilters, 'or');
  }
  _customizeRemoteOperations(options, operationTypes) {
    super._customizeRemoteOperations.apply(this, arguments);
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
  _getParentIdsToLoad(parentIds) {
    const parentIdsToLoad = [];
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
  _handleCustomizeStoreLoadOptions(options) {
    const rootValue = this.option('rootValue');
    const parentIdExpr = this.option('parentIdExpr');
    let {
      parentIds
    } = options.storeLoadOptions;
    if (parentIds) {
      options.isCustomLoading = false;
    }
    super._handleCustomizeStoreLoadOptions.apply(this, arguments);
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
        options.storeLoadOptions.filter = this._createIdFilter(parentIdExpr, parentIdsToLoad);
      }
    }
  }
  _generateInfoToLoad(data, needChildren) {
    const that = this;
    let key;
    const keyMap = {};
    const resultKeyMap = {};
    const resultKeys = [];
    const rootValue = that.option('rootValue');
    let i;
    for (i = 0; i < data.length; i++) {
      key = needChildren ? that._parentIdGetter(data[i]) : that._keyGetter(data[i]);
      keyMap[key] = true;
    }
    for (i = 0; i < data.length; i++) {
      key = needChildren ? that._keyGetter(data[i]) : that._parentIdGetter(data[i]);
      const needToLoad = needChildren ? that.isRowExpanded(key) : key !== rootValue;
      if (!keyMap[key] && !resultKeyMap[key] && needToLoad) {
        resultKeyMap[key] = true;
        resultKeys.push(key);
      }
    }
    return {
      keyMap: resultKeyMap,
      keys: resultKeys
    };
  }
  _loadParentsOrChildren(data, options, needChildren) {
    var _options$storeLoadOpt, _options$loadOptions;
    let filter;
    let needLocalFiltering;
    const {
      keys,
      keyMap
    } = this._generateInfoToLoad(data, needChildren);
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const isRemoteFiltering = options.remoteOperations.filtering;
    const maxFilterLengthInRequest = this.option('maxFilterLengthInRequest');
    const sort = ((_options$storeLoadOpt = options.storeLoadOptions) === null || _options$storeLoadOpt === void 0 ? void 0 : _options$storeLoadOpt.sort) ?? ((_options$loadOptions = options.loadOptions) === null || _options$loadOptions === void 0 ? void 0 : _options$loadOptions.sort);
    let loadOptions = isRemoteFiltering ? options.storeLoadOptions : options.loadOptions;
    const concatLoadedData = loadedData => {
      if (isRemoteFiltering) {
        this._cachedStoreData = applySorting(this._cachedStoreData.concat(loadedData), sort);
      }
      return applySorting(data.concat(loadedData), sort);
    };
    if (!keys.length) {
      return d.resolve(data);
    }
    let cachedNodes = keys.map(id => this.getNodeByKey(id)).filter(node => node && node.data);
    if (cachedNodes.length === keys.length) {
      if (needChildren) {
        cachedNodes = cachedNodes.reduce((result, node) => result.concat(node.children), []);
      }
      if (cachedNodes.length) {
        return this._loadParentsOrChildren(concatLoadedData(cachedNodes.map(node => node.data)), options, needChildren);
      }
    }
    const keyExpr = needChildren ? this.option('parentIdExpr') : this.getKeyExpr();
    filter = this._createIdFilter(keyExpr, keys);
    const filterLength = encodeURI(JSON.stringify(filter)).length;
    if (filterLength > maxFilterLengthInRequest) {
      filter = itemData => keyMap[needChildren ? this._parentIdGetter(itemData) : this._keyGetter(itemData)];
      needLocalFiltering = isRemoteFiltering;
    }
    loadOptions = (0, _extend.extend)({}, loadOptions, {
      filter: !needLocalFiltering ? filter : null
    });
    const store = options.fullData ? new _array_store.default(options.fullData) : this._dataSource.store();
    this.loadFromStore(loadOptions, store).done(loadedData => {
      if (loadedData.length) {
        if (needLocalFiltering) {
          loadedData = (0, _query.default)(loadedData).filter(filter).toArray();
        }
        this._loadParentsOrChildren(concatLoadedData(loadedData), options, needChildren).done(d.resolve).fail(d.reject);
      } else {
        d.resolve(data);
      }
    }).fail(d.reject);
    return d;
  }
  _loadParents(data, options) {
    return this._loadParentsOrChildren(data, options);
  }
  _loadChildrenIfNeed(data, options) {
    if (isFullBranchFilterMode(this)) {
      return this._loadParentsOrChildren(data, options, true);
    }
    return (0, _deferred.when)(data);
  }
  _updateHasItemsMap(options) {
    const {
      parentIds
    } = options.storeLoadOptions;
    if (parentIds) {
      for (let i = 0; i < parentIds.length; i++) {
        this._isChildrenLoaded[parentIds[i]] = true;
      }
    }
  }
  _getKeyInfo() {
    return {
      key: () => 'key',
      keyOf: data => data.key
    };
  }
  _processChanges(changes) {
    let processedChanges = [];
    changes.forEach(change => {
      if (change.type === 'insert') {
        processedChanges = processedChanges.concat(this._applyInsert(change));
      } else if (change.type === 'remove') {
        processedChanges = processedChanges.concat(this._applyRemove(change));
      } else if (change.type === 'update') {
        processedChanges.push({
          type: change.type,
          key: change.key,
          data: {
            data: change.data
          }
        });
      }
    });
    return processedChanges;
  }
  _handleChanging(e) {
    super._handleChanging.apply(this, arguments);
    const processChanges = changes => {
      const changesToProcess = changes.filter(item => item.type === 'update');
      return this._processChanges(changesToProcess);
    };
    e.postProcessChanges = processChanges;
  }
  _applyBatch(changes) {
    const processedChanges = this._processChanges(changes);
    super._applyBatch(processedChanges);
  }
  _setHasItems(node, value) {
    const hasItemsSetter = this._hasItemsSetter;
    node.hasChildren = value;
    if (hasItemsSetter && node.data) {
      hasItemsSetter(node.data, value);
    }
  }
  _applyInsert(change) {
    const that = this;
    const baseChanges = [];
    const parentId = that.parentKeyOf(change.data);
    const parentNode = that.getNodeByKey(parentId);
    if (parentNode) {
      const rootValue = that.option('rootValue');
      const node = that._convertItemToNode(change.data, rootValue, that._nodeByKey);
      node.hasChildren = false;
      node.level = parentNode.level + 1;
      node.visible = true;
      parentNode.children.push(node);
      that._isChildrenLoaded[node.key] = true;
      that._setHasItems(parentNode, true);
      if ((!parentNode.parent || that.isRowExpanded(parentNode.key)) && change.index !== undefined) {
        let index = that.items().indexOf(parentNode) + 1;
        index += change.index >= 0 ? Math.min(change.index, parentNode.children.length) : parentNode.children.length;
        baseChanges.push({
          type: change.type,
          data: node,
          index
        });
      }
    }
    return baseChanges;
  }
  _needToCopyDataObject() {
    return false;
  }
  _applyRemove(change) {
    let baseChanges = [];
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
        baseChanges = baseChanges.concat(this.getChildNodeKeys(change.key).map(key => ({
          type: change.type,
          key
        })));
      }
    }
    return baseChanges;
  }
  _handleDataLoaded(options) {
    const data = options.data = this._convertDataToPlainStructure(options.data);
    if (!options.remoteOperations.filtering && options.loadOptions.filter) {
      options.fullData = queryByOptions((0, _query.default)(options.data), {
        sort: options.loadOptions && options.loadOptions.sort
      }).toArray();
    }
    this._updateHasItemsMap(options);
    super._handleDataLoaded(options);
    if (data.isConverted && this._cachedStoreData) {
      this._cachedStoreData.isConverted = true;
    }
  }
  _fillNodes(nodes, options, expandedRowKeys, level) {
    const isFullBranch = isFullBranchFilterMode(this);
    level = level || 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      let needToExpand = false;
      // node.hasChildren = false;
      this._fillNodes(nodes[i].children, options, expandedRowKeys, level + 1);
      node.level = level;
      node.hasChildren = this._calculateHasItems(node, options);
      if (node.visible && node.hasChildren) {
        if (isFullBranch) {
          if (node.children.filter(node => node.visible).length) {
            needToExpand = true;
          } else if (node.children.length) {
            _m_core.default.foreachNodes(node.children, node => {
              node.visible = true;
            });
          }
        } else {
          needToExpand = true;
        }
        if (options.expandVisibleNodes && needToExpand) {
          expandedRowKeys.push(node.key);
        }
      }
      if (node.visible || node.hasChildren) {
        node.parent.hasChildren = true;
      }
    }
  }
  _processTreeStructure(options, visibleItems) {
    let {
      data
    } = options;
    const {
      parentIds
    } = options.storeLoadOptions;
    const expandedRowKeys = [];
    if (parentIds && parentIds.length || this._isReload) {
      if (options.fullData && options.fullData.length > options.data.length) {
        data = options.fullData;
        visibleItems = visibleItems || options.data;
      }
      this._rootNode = this._createNodesByItems(data, visibleItems);
      if (!this._rootNode) {
        // @ts-expect-error
        options.data = new _deferred.Deferred().reject(_ui.default.Error('E1046', this.getKeyExpr()));
        return;
      }
      this._fillNodes(this._rootNode.children, options, expandedRowKeys);
      this._isNodesInitializing = true;
      if (options.collapseVisibleNodes || expandedRowKeys.length) {
        this.option('expandedRowKeys', expandedRowKeys);
      }
      this._isReload = false;
      this.executeAction('onNodesInitialized', {
        root: this._rootNode
      });
      this._isNodesInitializing = false;
    }
    const resultData = [];
    this._fillVisibleItemsByNodes(this._rootNode.children, options, resultData);
    options.data = resultData;
    this._totalItemsCount = resultData.length;
  }
  _handleDataLoadedCore(options) {
    const that = this;
    const {
      data
    } = options;
    const filter = options.storeLoadOptions.filter || options.loadOptions.filter;
    const filterMode = that.option('filterMode');
    let visibleItems;
    const {
      parentIds
    } = options.storeLoadOptions;
    const needLoadParents = filter && (!parentIds || !parentIds.length) && filterMode !== 'standard';
    if (!options.isCustomLoading) {
      if (needLoadParents) {
        // @ts-expect-error
        const d = options.data = new _deferred.Deferred();
        if (filterMode === 'matchOnly') {
          visibleItems = data;
        }
        return that._loadParents(data, options).done(data => {
          that._loadChildrenIfNeed(data, options).done(data => {
            options.data = data;
            that._processTreeStructure(options, visibleItems);
            super._handleDataLoadedCore.call(that, options);
            d.resolve(options.data);
          });
        }).fail(d.reject);
      }
      that._processTreeStructure(options);
    }
    super._handleDataLoadedCore(options);
  }
  _handlePush(_ref) {
    let {
      changes
    } = _ref;
    const reshapeOnPush = this._dataSource._reshapeOnPush;
    const isNeedReshape = reshapeOnPush && !!changes.length;
    if (isNeedReshape) {
      this._isReload = true;
    }
    changes.forEach(change => {
      change.index ?? (change.index = -1);
    });
    super._handlePush.apply(this, arguments);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(dataSource, remoteOperations) {
    super.init.apply(this, arguments);
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
  getKeyExpr() {
    const store = this.store();
    const key = store && store.key();
    const keyExpr = this.option('keyExpr');
    if ((0, _type.isDefined)(key) && (0, _type.isDefined)(keyExpr)) {
      if (!(0, _common.equalByValue)(key, keyExpr)) {
        throw _ui.default.Error('E1044');
      }
    }
    return key || keyExpr || DEFAULT_KEY_EXPRESSION;
  }
  keyOf(data) {
    return this._keyGetter && this._keyGetter(data);
  }
  parentKeyOf(data) {
    return this._parentIdGetter && this._parentIdGetter(data);
  }
  getRootNode() {
    return this._rootNode;
  }
  totalItemsCount() {
    return this._totalItemsCount + this._totalCountCorrection;
  }
  isRowExpanded(key, cache) {
    if (cache) {
      let {
        isExpandedByKey
      } = cache;
      if (!isExpandedByKey) {
        const expandedRowKeys = this.option('expandedRowKeys') ?? [];
        isExpandedByKey = cache.isExpandedByKey = {};
        expandedRowKeys.forEach(key => {
          isExpandedByKey[key] = true;
        });
      }
      return !!isExpandedByKey[key];
    }
    const indexExpandedNodeKey = _m_utils.default.getIndexByKey(key, this.option('expandedRowKeys'), null);
    return indexExpandedNodeKey >= 0;
  }
  _changeRowExpandCore(key) {
    const expandedRowKeys = this.option('expandedRowKeys').slice();
    const indexExpandedNodeKey = _m_utils.default.getIndexByKey(key, expandedRowKeys, null);
    if (indexExpandedNodeKey < 0) {
      expandedRowKeys.push(key);
    } else {
      expandedRowKeys.splice(indexExpandedNodeKey, 1);
    }
    this.option('expandedRowKeys', expandedRowKeys);
  }
  changeRowExpand(key) {
    this._changeRowExpandCore(key);
    // @ts-expect-error
    return this._isNodesInitializing ? new _deferred.Deferred().resolve() : this.load();
  }
  getNodeByKey(key) {
    if (this._nodeByKey) {
      return this._nodeByKey[key];
    }
  }
  getNodeLeafKeys() {
    const that = this;
    const result = [];
    const keys = that._rootNode ? [that._rootNode.key] : [];
    keys.forEach(key => {
      const node = that.getNodeByKey(key);
      node && _m_core.default.foreachNodes([node], childNode => {
        !childNode.children.length && result.push(childNode.key);
      });
    });
    return result;
  }
  getChildNodeKeys(parentKey) {
    const node = this.getNodeByKey(parentKey);
    const childrenKeys = [];
    node && _m_core.default.foreachNodes(node.children, childNode => {
      childrenKeys.push(childNode.key);
    });
    return childrenKeys;
  }
  loadDescendants(keys, childrenOnly) {
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const remoteOperations = that.remoteOperations();
    if ((0, _type.isDefined)(keys)) {
      keys = Array.isArray(keys) ? keys : [keys];
    } else {
      keys = that.getNodeLeafKeys();
    }
    if (!remoteOperations.filtering || !keys.length) {
      return d.resolve();
    }
    const loadOptions = that._dataSource._createStoreLoadOptions();
    loadOptions.parentIds = keys;
    that.load(loadOptions).done(() => {
      if (!childrenOnly) {
        const childKeys = getChildKeys(that, keys);
        if (childKeys.length) {
          that.loadDescendants(childKeys, childrenOnly).done(d.resolve).fail(d.reject);
          return;
        }
      }
      d.resolve();
    }).fail(d.reject);
    return d.promise();
  }
  forEachNode() {
    let nodes = [];
    let callback;
    if (arguments.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[0];
      const rootNode = this.getRootNode();
      nodes = rootNode && rootNode.children || [];
    } else if (arguments.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      callback = arguments[1];
      // eslint-disable-next-line prefer-destructuring
      nodes = arguments[0];
      nodes = Array.isArray(nodes) ? nodes : [nodes];
    }
    _m_core.default.foreachNodes(nodes, callback);
  }
}
let DataSourceAdapterTreeListType = DataSourceAdapterTreeList;
var _default = exports.default = {
  extend(extender) {
    DataSourceAdapterTreeListType = extender(DataSourceAdapterTreeListType);
  },
  create(component) {
    return new DataSourceAdapterTreeListType(component);
  }
};