"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _icon = require("../../../core/utils/icon");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _support = require("../../../core/utils/support");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _double_click = require("../../../events/double_click");
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _consts = require("../../../renovation/ui/scroll_view/common/consts");
var _get_relative_offset = require("../../../renovation/ui/scroll_view/utils/get_relative_offset");
var _check_box = _interopRequireDefault(require("../../../ui/check_box"));
var _ui = _interopRequireDefault(require("../../../ui/hierarchical_collection/ui.hierarchical_collection_widget"));
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _ui2 = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// @ts-expect-error

const WIDGET_CLASS = 'dx-treeview';
const NODE_CLASS = `${WIDGET_CLASS}-node`;
const NODE_CONTAINER_CLASS = `${NODE_CLASS}-container`;
const NODE_LOAD_INDICATOR_CLASS = `${NODE_CLASS}-loadindicator`;
const OPENED_NODE_CONTAINER_CLASS = `${NODE_CLASS}-container-opened`;
const IS_LEAF = `${NODE_CLASS}-is-leaf`;
const ITEM_CLASS = `${WIDGET_CLASS}-item`;
const ITEM_WITH_CHECKBOX_CLASS = `${ITEM_CLASS}-with-checkbox`;
const ITEM_WITH_CUSTOM_EXPANDER_ICON_CLASS = `${ITEM_CLASS}-with-custom-expander-icon`;
const CUSTOM_EXPANDER_ICON_ITEM_CONTAINER_CLASS = `${WIDGET_CLASS}-custom-expander-icon-item-container`;
const ITEM_WITHOUT_CHECKBOX_CLASS = `${ITEM_CLASS}-without-checkbox`;
const ITEM_DATA_KEY = `${ITEM_CLASS}-data`;
const TOGGLE_ITEM_VISIBILITY_CLASS = `${WIDGET_CLASS}-toggle-item-visibility`;
const CUSTOM_COLLAPSE_ICON_CLASS = `${WIDGET_CLASS}-custom-collapse-icon`;
const CUSTOM_EXPAND_ICON_CLASS = `${WIDGET_CLASS}-custom-expand-icon`;
const LOAD_INDICATOR_CLASS = `${WIDGET_CLASS}-loadindicator`;
const LOAD_INDICATOR_WRAPPER_CLASS = `${WIDGET_CLASS}-loadindicator-wrapper`;
const TOGGLE_ITEM_VISIBILITY_OPENED_CLASS = `${WIDGET_CLASS}-toggle-item-visibility-opened`;
const SELECT_ALL_ITEM_CLASS = `${WIDGET_CLASS}-select-all-item`;
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const SELECTED_ITEM_CLASS = 'dx-state-selected';
const EXPAND_EVENT_NAMESPACE = 'dxTreeView_expand';
const DATA_ITEM_ID = 'data-item-id';
const ITEM_URL_CLASS = 'dx-item-url';
const CHECK_BOX_CLASS = 'dx-checkbox';
const CHECK_BOX_ICON_CLASS = 'dx-checkbox-icon';
const ROOT_NODE_CLASS = `${WIDGET_CLASS}-root-node`;
const EXPANDER_ICON_STUB_CLASS = `${WIDGET_CLASS}-expander-icon-stub`;
const TreeViewBase = _ui.default.inherit({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _supportedKeys(e) {
    const click = e => {
      const $itemElement = (0, _renderer.default)(this.option('focusedElement'));
      if (!$itemElement.length) {
        return;
      }
      e.target = $itemElement;
      e.currentTarget = $itemElement;
      this._itemClickHandler(e, $itemElement.children(`.${ITEM_CLASS}`));
      const expandEventName = this._getEventNameByOption(this.option('expandEvent'));
      const expandByClick = expandEventName === (0, _index.addNamespace)(_click.name, EXPAND_EVENT_NAMESPACE);
      if (expandByClick) {
        this._expandEventHandler(e);
      }
    };
    const select = e => {
      e.preventDefault();
      const $focusedElement = (0, _renderer.default)(this.option('focusedElement'));
      const checkboxInstance = this._getCheckBoxInstance($focusedElement);
      if (!checkboxInstance.option('disabled')) {
        const currentState = checkboxInstance.option('value');
        this._updateItemSelection(!currentState, $focusedElement.find(`.${ITEM_CLASS}`).get(0), true);
      }
    };
    const toggleExpandedNestedItems = function (state, e) {
      if (!this.option('expandAllEnabled')) {
        return;
      }
      e.preventDefault();
      const $rootElement = (0, _renderer.default)(this.option('focusedElement'));
      if (!$rootElement.length) {
        return;
      }
      const rootItem = this._getItemData($rootElement.find(`.${ITEM_CLASS}`));
      this._toggleExpandedNestedItems([rootItem], state);
    };
    return (0, _extend.extend)(this.callBase(), {
      enter: this._showCheckboxes() ? select : click,
      space: this._showCheckboxes() ? select : click,
      asterisk: toggleExpandedNestedItems.bind(this, true),
      minus: toggleExpandedNestedItems.bind(this, false)
    });
  },
  _toggleExpandedNestedItems(items, state) {
    if (!items) {
      return;
    }
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      const node = this._dataAdapter.getNodeByItem(item);
      this._toggleExpandedState(node, state);
      this._toggleExpandedNestedItems(item.items, state);
    }
  },
  _getNodeElement(node, cache) {
    const key = this._encodeString(node.internalFields.key);
    if (cache) {
      if (!cache.$nodeByKey) {
        cache.$nodeByKey = {};
        this.$element().find(`.${NODE_CLASS}`).each(function () {
          const $node = (0, _renderer.default)(this);
          const key = $node.attr(DATA_ITEM_ID);
          // @ts-expect-error
          cache.$nodeByKey[key] = $node;
        });
      }
      // @ts-expect-error
      return cache.$nodeByKey[key] || (0, _renderer.default)();
    }
    const element = this.$element().get(0).querySelector(`[${DATA_ITEM_ID}="${key}"]`);
    return (0, _renderer.default)(element);
  },
  _activeStateUnit: `.${ITEM_CLASS}`,
  _widgetClass() {
    return WIDGET_CLASS;
  },
  _getDefaultOptions() {
    const defaultOptions = (0, _extend.extend)(this.callBase(), {
      animationEnabled: true,
      dataStructure: 'tree',
      deferRendering: true,
      expandAllEnabled: false,
      hasItemsExpr: 'hasItems',
      selectNodesRecursive: true,
      expandNodesRecursive: true,
      showCheckBoxesMode: 'none',
      expandIcon: null,
      collapseIcon: null,
      selectAllText: _message.default.format('dxList-selectAll'),
      onItemSelectionChanged: null,
      onItemExpanded: null,
      onItemCollapsed: null,
      scrollDirection: 'vertical',
      useNativeScrolling: true,
      virtualModeEnabled: false,
      rootValue: 0,
      focusStateEnabled: false,
      selectionMode: 'multiple',
      expandEvent: 'dblclick',
      selectByClick: false,
      createChildren: null,
      onSelectAllValueChanged: null,
      _supportItemUrl: false
    });
    return (0, _extend.extend)(true, defaultOptions, {
      integrationOptions: {
        useDeferUpdateForTemplates: false
      }
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device() {
        return !_support.nativeScrolling;
      },
      options: {
        useNativeScrolling: false
      }
    }]);
  },
  // TODO: implement these functions
  _initSelectedItems: _common.noop,
  _syncSelectionOptions: _common.asyncNoop,
  _fireSelectionChanged() {
    const selectionChangePromise = this._selectionChangePromise;
    (0, _deferred.when)(selectionChangePromise).done(() => {
      this._createActionByOption('onSelectionChanged', {
        excludeValidators: ['disabled', 'readOnly']
      })();
    });
  },
  _createSelectAllValueChangedAction() {
    this._selectAllValueChangedAction = this._createActionByOption('onSelectAllValueChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _fireSelectAllValueChanged(value) {
    this._selectAllValueChangedAction({
      value
    });
  },
  _checkBoxModeChange(value, previousValue) {
    const searchEnabled = this.option('searchEnabled');
    const previousSelectAllEnabled = this._selectAllEnabled(previousValue);
    const previousItemsContainer = this._itemContainer(searchEnabled, previousSelectAllEnabled);
    this._detachClickEvent(previousItemsContainer);
    this._detachExpandEvent(previousItemsContainer);
    if (previousValue === 'none' || value === 'none') {
      return;
    }
    const selectAllExists = this._$selectAllItem && this._$selectAllItem.length;
    // eslint-disable-next-line default-case
    switch (value) {
      case 'selectAll':
        if (!selectAllExists) {
          this._createSelectAllValueChangedAction();
          this._renderSelectAllItem();
        }
        break;
      case 'normal':
        if (selectAllExists) {
          this._$selectAllItem.remove();
          delete this._$selectAllItem;
        }
        break;
    }
  },
  _removeSelection() {
    const that = this;
    (0, _iterator.each)(this._dataAdapter.getFullData(), (_, node) => {
      if (!that._hasChildren(node)) {
        return;
      }
      that._dataAdapter.toggleSelection(node.internalFields.key, false, true);
    });
  },
  _optionChanged(args) {
    const {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'selectAllText':
        if (this._$selectAllItem) {
          this._$selectAllItem.dxCheckBox('instance').option('text', value);
        }
        break;
      case 'showCheckBoxesMode':
        this._checkBoxModeChange(value, previousValue);
        this._invalidate();
        break;
      case 'scrollDirection':
        this.getScrollable().option('direction', value);
        break;
      case 'useNativeScrolling':
        this.getScrollable().option('useNative', value);
        break;
      case 'items':
        delete this._$selectAllItem;
        this.callBase(args);
        break;
      case 'dataSource':
        this.callBase(args);
        this._initDataAdapter();
        this._filter = {};
        break;
      case 'hasItemsExpr':
        this._initAccessors();
        this.repaint();
        break;
      case 'expandEvent':
        this._attachExpandEvent();
        break;
      case 'deferRendering':
      case 'dataStructure':
      case 'rootValue':
      case 'createChildren':
      case 'expandNodesRecursive':
      case 'onItemSelectionChanged':
      case 'onItemExpanded':
      case 'onItemCollapsed':
      case 'expandAllEnabled':
      case 'animationEnabled':
      case 'virtualModeEnabled':
      case 'selectByClick':
      case '_supportItemUrl':
        break;
      case 'selectionMode':
        this._initDataAdapter();
        this.callBase(args);
        break;
      case 'onSelectAllValueChanged':
        this._createSelectAllValueChangedAction();
        break;
      case 'selectNodesRecursive':
        this._dataAdapter.setOption('recursiveSelection', args.value);
        this.repaint();
        break;
      case 'expandIcon':
      case 'collapseIcon':
        this.repaint();
        break;
      default:
        this.callBase(args);
    }
  },
  _initDataSource() {
    if (this._useCustomChildrenLoader()) {
      this._loadChildrenByCustomLoader(null).done(newItems => {
        if (newItems && newItems.length) {
          this.option('items', newItems);
        }
      });
    } else {
      this.callBase();
      this._isVirtualMode() && this._initVirtualMode();
    }
  },
  _initVirtualMode() {
    const filter = this._filter;
    if (!filter.custom) {
      filter.custom = this._dataSource.filter();
    }
    if (!filter.internal) {
      filter.internal = [this.option('parentIdExpr'), this.option('rootValue')];
    }
  },
  _useCustomChildrenLoader() {
    return (0, _type.isFunction)(this.option('createChildren')) && this._isDataStructurePlain();
  },
  _loadChildrenByCustomLoader(parentNode) {
    const invocationResult = this.option('createChildren').call(this, parentNode);
    if (Array.isArray(invocationResult)) {
      return (0, _deferred.Deferred)().resolve(invocationResult).promise();
    }
    if (invocationResult && (0, _type.isFunction)(invocationResult.then)) {
      return (0, _deferred.fromPromise)(invocationResult);
    }
    return (0, _deferred.Deferred)().resolve([]).promise();
  },
  _combineFilter() {
    if (!this._filter.custom || !this._filter.custom.length) {
      return this._filter.internal;
    }
    return [this._filter.custom, this._filter.internal];
  },
  _dataSourceLoadErrorHandler() {
    this._renderEmptyMessage();
  },
  _init() {
    this._filter = {};
    this.callBase();
    this._initStoreChangeHandlers();
  },
  _dataSourceChangedHandler(newItems) {
    const items = this.option('items');
    if (this._initialized && this._isVirtualMode() && items.length) {
      return;
    }
    this.option('items', newItems);
  },
  _removeTreeViewLoadIndicator() {
    if (!this._treeViewLoadIndicator) return;
    this._treeViewLoadIndicator.remove();
    this._treeViewLoadIndicator = null;
  },
  _createTreeViewLoadIndicator() {
    this._treeViewLoadIndicator = (0, _renderer.default)('<div>').addClass(LOAD_INDICATOR_CLASS);
    this._createComponent(this._treeViewLoadIndicator, _load_indicator.default, {});
    return this._treeViewLoadIndicator;
  },
  _dataSourceLoadingChangedHandler(isLoading) {
    let resultFilter;
    if (this._isVirtualMode()) {
      resultFilter = this._combineFilter();
      this._dataSource.filter(resultFilter);
    }
    if (isLoading && !this._dataSource.isLoaded()) {
      this.option('items', []);
      const $wrapper = (0, _renderer.default)('<div>').addClass(LOAD_INDICATOR_WRAPPER_CLASS);
      this._createTreeViewLoadIndicator().appendTo($wrapper);
      this.itemsContainer().append($wrapper);
      if (this._isVirtualMode() && this._dataSource.filter() !== resultFilter) {
        this._dataSource.filter([]);
      }
    } else {
      this._removeTreeViewLoadIndicator();
    }
  },
  _initStoreChangeHandlers() {
    if (this.option('dataStructure') !== 'plain') {
      return;
    }
    this._dataSource && this._dataSource.store().on('inserted', newItem => {
      this.option().items = this.option('items').concat(newItem);
      this._dataAdapter.addItem(newItem);
      if (!this._dataAdapter.isFiltered(newItem)) {
        return;
      }
      this._updateLevel(this._parentIdGetter(newItem));
    }).on('removed', removedKey => {
      const node = this._dataAdapter.getNodeByKey(removedKey);
      if ((0, _type.isDefined)(node)) {
        this.option('items')[this._dataAdapter.getIndexByKey(node.internalFields.key)] = 0;
        this._markChildrenItemsToRemove(node);
        this._removeItems();
        this._dataAdapter.removeItem(removedKey);
        this._updateLevel(this._parentIdGetter(node));
      }
    });
  },
  _markChildrenItemsToRemove(node) {
    const keys = node.internalFields.childrenKeys;
    (0, _iterator.each)(keys, (_, key) => {
      this.option('items')[this._dataAdapter.getIndexByKey(key)] = 0;
      this._markChildrenItemsToRemove(this._dataAdapter.getNodeByKey(key));
    });
  },
  _removeItems() {
    const items = (0, _extend.extend)(true, [], this.option('items'));
    let counter = 0;
    (0, _iterator.each)(items, (index, item) => {
      if (!item) {
        // @ts-expect-error
        this.option('items').splice(index - counter, 1);
        counter++;
      }
    });
  },
  _updateLevel(parentId) {
    const $container = this._getContainerByParentKey(parentId);
    this._renderItems($container, this._dataAdapter.getChildrenNodes(parentId));
  },
  _getOldContainer($itemElement) {
    if ($itemElement.length) {
      return $itemElement.children(`.${NODE_CONTAINER_CLASS}`);
    }
    const scrollable = this.getScrollable();
    if (scrollable) {
      return (0, _renderer.default)(scrollable.content()).children();
    }
    // @ts-expect-error
    return (0, _renderer.default)();
  },
  _getContainerByParentKey(parentId) {
    const node = this._dataAdapter.getNodeByKey(parentId);
    const $itemElement = node ? this._getNodeElement(node) : [];
    this._getOldContainer($itemElement).remove();
    const $container = this._renderNodeContainer($itemElement);
    if (this._isRootLevel(parentId)) {
      const scrollable = this.getScrollable();
      if (!scrollable) {
        this._renderScrollableContainer();
      }
      (0, _renderer.default)(scrollable.content()).append($container);
    }
    return $container;
  },
  _isRootLevel(parentId) {
    return parentId === this.option('rootValue');
  },
  _getAccessors() {
    const accessors = this.callBase();
    accessors.push('hasItems');
    return accessors;
  },
  _getDataAdapterOptions() {
    var _this$_dataSource, _this$_dataSource$loa;
    return {
      rootValue: this.option('rootValue'),
      multipleSelection: !this._isSingleSelection(),
      recursiveSelection: this._isRecursiveSelection(),
      recursiveExpansion: this.option('expandNodesRecursive'),
      selectionRequired: this.option('selectionRequired'),
      dataType: this.option('dataStructure'),
      sort: this._dataSource && this._dataSource.sort(),
      langParams: (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 || (_this$_dataSource$loa = _this$_dataSource.loadOptions) === null || _this$_dataSource$loa === void 0 || (_this$_dataSource$loa = _this$_dataSource$loa.call(_this$_dataSource)) === null || _this$_dataSource$loa === void 0 ? void 0 : _this$_dataSource$loa.langParams
    };
  },
  _initMarkup() {
    this._renderScrollableContainer();
    this._renderEmptyMessage(this._dataAdapter.getRootNodes());
    this.callBase();
    this._setAriaRole();
  },
  _setAriaRole() {
    const {
      items
    } = this.option();
    if (items !== null && items !== void 0 && items.length) {
      this.setAria({
        role: 'tree'
      });
    }
  },
  _renderContentImpl() {
    const $nodeContainer = this._renderNodeContainer();
    (0, _renderer.default)(this.getScrollable().content()).append($nodeContainer);
    if (!this.option('items') || !this.option('items').length) {
      return;
    }
    this._renderItems($nodeContainer, this._dataAdapter.getRootNodes());
    this._attachExpandEvent();
    if (this._selectAllEnabled()) {
      this._createSelectAllValueChangedAction();
      this._renderSelectAllItem($nodeContainer);
    }
  },
  _isVirtualMode() {
    return this.option('virtualModeEnabled') && this._isDataStructurePlain() && !!this.option('dataSource');
  },
  _isDataStructurePlain() {
    return this.option('dataStructure') === 'plain';
  },
  _fireContentReadyAction() {
    const dataSource = this.getDataSource();
    const skipContentReadyAction = dataSource && !dataSource.isLoaded() || this._skipContentReadyAndItemExpanded;
    const scrollable = this.getScrollable();
    if (scrollable && (0, _window.hasWindow)()) {
      scrollable.update();
    }
    if (!skipContentReadyAction) {
      this.callBase();
    }
    if (scrollable && (0, _window.hasWindow)()) {
      scrollable.update();
    }
  },
  _renderScrollableContainer() {
    this._scrollable = this._createComponent((0, _renderer.default)('<div>').appendTo(this.$element()), _ui2.default, {
      useNative: this.option('useNativeScrolling'),
      direction: this.option('scrollDirection'),
      useKeyboard: false
    });
  },
  _renderNodeContainer($parent) {
    const $container = (0, _renderer.default)('<ul>').addClass(NODE_CONTAINER_CLASS);
    this.setAria('role', 'group', $container);
    if ($parent && $parent.length) {
      const itemData = this._getItemData($parent.children(`.${ITEM_CLASS}`));
      if (this._expandedGetter(itemData)) {
        $container.addClass(OPENED_NODE_CONTAINER_CLASS);
      }
      $container.appendTo($parent);
    }
    return $container;
  },
  _createDOMElement($nodeContainer, node) {
    var _node$internalFields;
    const $node = (0, _renderer.default)('<li>').addClass(NODE_CLASS).attr(DATA_ITEM_ID, this._encodeString(node.internalFields.key)).prependTo($nodeContainer);
    const attrs = {
      role: 'treeitem',
      label: this._displayGetter(node.internalFields.item) || '',
      level: this._getLevel($nodeContainer)
    };
    const hasChildNodes = !!(node !== null && node !== void 0 && (_node$internalFields = node.internalFields) !== null && _node$internalFields !== void 0 && (_node$internalFields = _node$internalFields.childrenKeys) !== null && _node$internalFields !== void 0 && _node$internalFields.length);
    if (hasChildNodes) {
      // @ts-expect-error
      attrs.expanded = node.internalFields.expanded || false;
    }
    this.setAria(attrs, $node);
    return $node;
  },
  _getLevel($nodeContainer) {
    const parent = $nodeContainer.parent();
    // eslint-disable-next-line radix
    return parent.hasClass('dx-scrollable-content') ? 1 : parseInt(parent.attr('aria-level')) + 1;
  },
  _showCheckboxes() {
    return this.option('showCheckBoxesMode') !== 'none';
  },
  _hasCustomExpanderIcons() {
    return this.option('expandIcon') || this.option('collapseIcon');
  },
  _selectAllEnabled(showCheckBoxesMode) {
    const mode = showCheckBoxesMode ?? this.option('showCheckBoxesMode');
    return mode === 'selectAll' && !this._isSingleSelection();
  },
  _renderItems($nodeContainer, nodes) {
    const length = nodes.length - 1;
    for (let i = length; i >= 0; i--) {
      this._renderItem(i, nodes[i], $nodeContainer);
    }
    this._renderedItemsCount += nodes.length;
  },
  _renderItem(nodeIndex, node, $nodeContainer) {
    const $node = this._createDOMElement($nodeContainer, node);
    const nodeData = node.internalFields;
    const showCheckBox = this._showCheckboxes();
    $node.addClass(showCheckBox ? ITEM_WITH_CHECKBOX_CLASS : ITEM_WITHOUT_CHECKBOX_CLASS);
    $node.toggleClass(INVISIBLE_STATE_CLASS, nodeData.item.visible === false);
    if (this._hasCustomExpanderIcons()) {
      $node.addClass(ITEM_WITH_CUSTOM_EXPANDER_ICON_CLASS);
      $nodeContainer.addClass(CUSTOM_EXPANDER_ICON_ITEM_CONTAINER_CLASS);
    }
    this.setAria('selected', nodeData.selected, $node);
    this._toggleSelectedClass($node, nodeData.selected);
    if (nodeData.disabled) {
      this.setAria('disabled', nodeData.disabled, $node);
    }
    this.callBase(this._renderedItemsCount + nodeIndex, nodeData.item, $node);
    const parent = this._getNode(node.internalFields.parentKey);
    if (!parent) {
      $node.addClass(ROOT_NODE_CLASS);
    }
    if (nodeData.item.visible !== false) {
      this._renderChildren($node, node);
    }
  },
  _setAriaSelectionAttribute: _common.noop,
  _renderChildren($node, node) {
    if (!this._hasChildren(node)) {
      this._addLeafClass($node);
      (0, _renderer.default)('<div>').addClass(EXPANDER_ICON_STUB_CLASS).appendTo(this._getItem($node));
      return;
    }
    if (this._hasCustomExpanderIcons()) {
      this._renderCustomExpanderIcons($node, node);
    } else {
      this._renderDefaultExpanderIcons($node, node);
    }
    if (this._shouldRenderSublevel(node.internalFields.expanded)) {
      this._loadSublevel(node).done(childNodes => {
        this._renderSublevel($node, this._getActualNode(node), childNodes);
      });
    }
  },
  _shouldRenderSublevel(expanded) {
    return expanded || !this.option('deferRendering');
  },
  _getActualNode(cachedNode) {
    return this._dataAdapter.getNodeByKey(cachedNode.internalFields.key);
  },
  _hasChildren(node) {
    if (this._isVirtualMode() || this._useCustomChildrenLoader()) {
      return this._hasItemsGetter(node.internalFields.item) !== false;
    }
    return this.callBase(node);
  },
  _loadSublevel(node) {
    const deferred = (0, _deferred.Deferred)();
    const childrenNodes = this._getChildNodes(node);
    if (childrenNodes.length) {
      deferred.resolve(childrenNodes);
    } else {
      this._loadNestedItems(node).done(items => {
        deferred.resolve(this._dataAdapter.getNodesByItems(items));
      });
    }
    return deferred.promise();
  },
  _getItemExtraPropNames() {
    return ['url', 'linkAttr'];
  },
  _addContent($container, itemData) {
    const {
      html,
      url
    } = itemData;
    if (this.option('_supportItemUrl') && url) {
      $container.html(html);
      const link = this._getLinkContainer(this._getIconContainer(itemData), this._getTextContainer(itemData), itemData);
      $container.append(link);
    } else {
      this.callBase($container, itemData);
    }
  },
  _postprocessRenderItem(args) {
    const {
      itemData,
      itemElement
    } = args;
    if (this._showCheckboxes()) {
      this._renderCheckBox(itemElement, this._getNode(itemData));
    }
    this.callBase(args);
  },
  _renderSublevel($node, node, childNodes) {
    const $nestedNodeContainer = this._renderNodeContainer($node, node);
    const childNodesByChildrenKeys = childNodes.filter(childNode => node.internalFields.childrenKeys.indexOf(childNode.internalFields.key) !== -1);
    this._renderItems($nestedNodeContainer, childNodesByChildrenKeys);
    if (childNodesByChildrenKeys.length && !node.internalFields.selected) {
      const firstChild = childNodesByChildrenKeys[0];
      this._updateParentsState(firstChild, this._getNodeElement(firstChild));
    }
    this._normalizeIconState($node, childNodesByChildrenKeys.length);
    if (node.internalFields.expanded) {
      $nestedNodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
    }
  },
  _executeItemRenderAction(itemIndex, itemData, itemElement) {
    const node = this._getNode(itemElement);
    this._getItemRenderAction()({
      itemElement,
      itemIndex,
      itemData,
      node: this._dataAdapter.getPublicNode(node)
    });
  },
  _addLeafClass($node) {
    $node.addClass(IS_LEAF);
  },
  _expandEventHandler(e) {
    const $nodeElement = (0, _renderer.default)(e.currentTarget.parentNode);
    if (!$nodeElement.hasClass(IS_LEAF)) {
      this._toggleExpandedState(e.currentTarget, undefined, e);
    }
  },
  _attachExpandEvent() {
    const expandedEventName = this._getEventNameByOption(this.option('expandEvent'));
    const $itemsContainer = this._itemContainer();
    this._detachExpandEvent($itemsContainer);
    _events_engine.default.on($itemsContainer, expandedEventName, this._itemSelector(), this._expandEventHandler.bind(this));
  },
  _detachExpandEvent(itemsContainer) {
    _events_engine.default.off(itemsContainer, `.${EXPAND_EVENT_NAMESPACE}`, this._itemSelector());
  },
  _getEventNameByOption(name) {
    const event = name === 'click' ? _click.name : _double_click.name;
    return (0, _index.addNamespace)(event, EXPAND_EVENT_NAMESPACE);
  },
  _getNode(identifier) {
    if (!(0, _type.isDefined)(identifier)) {
      return null;
    }
    if (identifier.internalFields) {
      return identifier;
    }
    if ((0, _type.isPrimitive)(identifier)) {
      return this._dataAdapter.getNodeByKey(identifier);
    }
    const itemElement = (0, _renderer.default)(identifier).get(0);
    if (!itemElement) {
      return null;
    }
    if (_dom_adapter.default.isElementNode(itemElement)) {
      return this._getNodeByElement(itemElement);
    }
    return this._dataAdapter.getNodeByItem(itemElement);
  },
  _getNodeByElement(itemElement) {
    const $node = (0, _renderer.default)(itemElement).closest(`.${NODE_CLASS}`);
    const key = this._decodeString($node.attr(DATA_ITEM_ID));
    return this._dataAdapter.getNodeByKey(key);
  },
  _toggleExpandedState(itemElement, state, e) {
    const node = this._getNode(itemElement);
    if (!node) {
      return (0, _deferred.Deferred)().reject().promise();
    }
    if (node.internalFields.disabled) {
      return (0, _deferred.Deferred)().reject().promise();
    }
    const currentState = node.internalFields.expanded;
    if (currentState === state) {
      return (0, _deferred.Deferred)().resolve().promise();
    }
    if (this._hasChildren(node)) {
      const $node = this._getNodeElement(node);
      if ($node.find(`.${NODE_LOAD_INDICATOR_CLASS}:not(.${INVISIBLE_STATE_CLASS})`).length) {
        return (0, _deferred.Deferred)().reject().promise();
      }
      if (!currentState && !this._nodeHasRenderedChildren($node)) {
        this._createLoadIndicator($node);
      }
    }
    if (!(0, _type.isDefined)(state)) {
      state = !currentState;
    }
    this._dataAdapter.toggleExpansion(node.internalFields.key, state);
    return this._updateExpandedItemsUI(node, state, e);
  },
  _nodeHasRenderedChildren($node) {
    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);
    return $nodeContainer.not(':empty').length;
  },
  _getItem($node) {
    return $node.children(`.${ITEM_CLASS}`).eq(0);
  },
  _createLoadIndicator($node) {
    const $treeviewItem = this._getItem($node);
    this._createComponent((0, _renderer.default)('<div>').addClass(NODE_LOAD_INDICATOR_CLASS), _load_indicator.default, {}).$element().appendTo($treeviewItem);
    const $icon = $treeviewItem.children(`.${TOGGLE_ITEM_VISIBILITY_CLASS},.${CUSTOM_EXPAND_ICON_CLASS}`);
    $icon.hide();
  },
  _renderExpanderIcon($node, node, $icon, iconClass) {
    $icon.appendTo(this._getItem($node));
    $icon.addClass(iconClass);
    if (node.internalFields.disabled) {
      $icon.addClass(DISABLED_STATE_CLASS);
    }
    this._renderToggleItemVisibilityIconClick($icon, node);
  },
  _renderDefaultExpanderIcons($node, node) {
    const $treeViewItem = this._getItem($node);
    const $icon = (0, _renderer.default)('<div>').addClass(TOGGLE_ITEM_VISIBILITY_CLASS).appendTo($treeViewItem);
    if (node.internalFields.expanded) {
      $icon.addClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS);
      $node.parent().addClass(OPENED_NODE_CONTAINER_CLASS);
    }
    if (node.internalFields.disabled) {
      $icon.addClass(DISABLED_STATE_CLASS);
    }
    this._renderToggleItemVisibilityIconClick($icon, node);
  },
  _renderCustomExpanderIcons($node, node) {
    const {
      expandIcon,
      collapseIcon
    } = this.option();
    const $expandIcon = (0, _icon.getImageContainer)(expandIcon ?? collapseIcon);
    const $collapseIcon = (0, _icon.getImageContainer)(collapseIcon ?? expandIcon);
    this._renderExpanderIcon($node, node, $expandIcon, CUSTOM_EXPAND_ICON_CLASS);
    this._renderExpanderIcon($node, node, $collapseIcon, CUSTOM_COLLAPSE_ICON_CLASS);
    const isNodeExpanded = node.internalFields.expanded;
    if (isNodeExpanded) {
      $node.parent().addClass(OPENED_NODE_CONTAINER_CLASS);
    }
    this._toggleCustomExpanderIcons($expandIcon, $collapseIcon, isNodeExpanded);
  },
  _renderToggleItemVisibilityIconClick($icon, node) {
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    _events_engine.default.off($icon, eventName);
    _events_engine.default.on($icon, eventName, e => {
      this._toggleExpandedState(node.internalFields.key, undefined, e);
      return false;
    });
  },
  _toggleCustomExpanderIcons($expandIcon, $collapseIcon, isNodeExpanded) {
    $collapseIcon.toggle(isNodeExpanded);
    $expandIcon.toggle(!isNodeExpanded);
  },
  _updateExpandedItemsUI(node, state, e) {
    const $node = this._getNodeElement(node);
    const isHiddenNode = !$node.length || state && $node.is(':hidden');
    if (this.option('expandNodesRecursive') && isHiddenNode) {
      const parentNode = this._getNode(node.internalFields.parentKey);
      if (parentNode) {
        this._updateExpandedItemsUI(parentNode, state, e);
      }
    }
    if (!this._hasCustomExpanderIcons()) {
      const $icon = this._getItem($node).children(`.${TOGGLE_ITEM_VISIBILITY_CLASS}`);
      $icon.toggleClass(TOGGLE_ITEM_VISIBILITY_OPENED_CLASS, state);
    } else if (this._nodeHasRenderedChildren($node)) {
      const $item = this._getItem($node);
      const $childExpandIcons = $item.children(`.${CUSTOM_EXPAND_ICON_CLASS}`);
      const $childCollapseIcons = $item.children(`.${CUSTOM_COLLAPSE_ICON_CLASS}`);
      this._toggleCustomExpanderIcons($childExpandIcons, $childCollapseIcons, state);
    }
    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);
    const nodeContainerExists = $nodeContainer.length > 0;
    const completionCallback = (0, _deferred.Deferred)();
    if (!state || nodeContainerExists && !$nodeContainer.is(':empty')) {
      this._animateNodeContainer(node, state, e, completionCallback);
      return completionCallback.promise();
    }
    if (node.internalFields.childrenKeys.length === 0 && (this._isVirtualMode() || this._useCustomChildrenLoader())) {
      this._loadNestedItemsWithUpdate(node, state, e, completionCallback);
      return completionCallback.promise();
    }
    this._renderSublevel($node, node, this._getChildNodes(node));
    this._fireContentReadyAction();
    this._animateNodeContainer(node, state, e, completionCallback);
    return completionCallback.promise();
  },
  _loadNestedItemsWithUpdate(node, state, e, completionCallback) {
    const $node = this._getNodeElement(node);
    this._loadNestedItems(node).done(items => {
      const actualNodeData = this._getActualNode(node);
      this._renderSublevel($node, actualNodeData, this._dataAdapter.getNodesByItems(items));
      if (!items || !items.length) {
        completionCallback.resolve();
        return;
      }
      this._fireContentReadyAction();
      this._animateNodeContainer(actualNodeData, state, e, completionCallback);
    });
  },
  _loadNestedItems(node) {
    if (this._useCustomChildrenLoader()) {
      const publicNode = this._dataAdapter.getPublicNode(node);
      return this._loadChildrenByCustomLoader(publicNode).done(newItems => {
        if (!this._areNodesExists(newItems)) {
          this._appendItems(newItems);
        }
      });
    }
    if (!this._isVirtualMode()) {
      return (0, _deferred.Deferred)().resolve([]).promise();
    }
    this._filter.internal = [this.option('parentIdExpr'), node.internalFields.key];
    this._dataSource.filter(this._combineFilter());
    return this._dataSource.load().done(newItems => {
      if (!this._areNodesExists(newItems)) {
        this._appendItems(newItems);
      }
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _areNodesExists(newItems, items) {
    const keyOfRootItem = this.keyOf(newItems[0]);
    const fullData = this._dataAdapter.getFullData();
    return !!this._dataAdapter.getNodeByKey(keyOfRootItem, fullData);
  },
  _appendItems(newItems) {
    this.option().items = this.option('items').concat(newItems);
    this._initDataAdapter();
  },
  _animateNodeContainer(node, state, e, completionCallback) {
    const $node = this._getNodeElement(node);
    const $nodeContainer = $node.children(`.${NODE_CONTAINER_CLASS}`);
    if (node && completionCallback && $nodeContainer.length === 0) {
      completionCallback.resolve();
    }
    // NOTE: The height of node container is should be used when the container is shown (T606878)
    $nodeContainer.addClass(OPENED_NODE_CONTAINER_CLASS);
    const nodeHeight = (0, _size.getHeight)($nodeContainer);
    _fx.default.stop($nodeContainer, true);
    _fx.default.animate($nodeContainer, {
      // @ts-expect-error
      type: 'custom',
      duration: this.option('animationEnabled') ? 400 : 0,
      from: {
        // @ts-expect-error
        maxHeight: state ? 0 : nodeHeight
      },
      to: {
        // @ts-expect-error
        maxHeight: state ? nodeHeight : 0
      },
      complete: function () {
        $nodeContainer.css('maxHeight', 'none');
        $nodeContainer.toggleClass(OPENED_NODE_CONTAINER_CLASS, state);
        this.setAria('expanded', state, $node);
        this.getScrollable().update();
        this._fireExpandedStateUpdatedEvent(state, node, e);
        if (completionCallback) {
          completionCallback.resolve();
        }
      }.bind(this)
    });
  },
  _fireExpandedStateUpdatedEvent(isExpanded, node, e) {
    if (!this._hasChildren(node) || this._skipContentReadyAndItemExpanded) {
      return;
    }
    const optionName = isExpanded ? 'onItemExpanded' : 'onItemCollapsed';
    if ((0, _type.isDefined)(e)) {
      this._itemDXEventHandler(e, optionName, {
        node: this._dataAdapter.getPublicNode(node)
      });
    } else {
      const target = this._getNodeElement(node);
      this._itemEventHandler(target, optionName, {
        event: e,
        node: this._dataAdapter.getPublicNode(node)
      });
    }
  },
  _normalizeIconState($node, hasNewItems) {
    const $loadIndicator = $node.find(`.${NODE_LOAD_INDICATOR_CLASS}`);
    if ($loadIndicator.length) {
      var _LoadIndicator$getIns;
      (_LoadIndicator$getIns = _load_indicator.default.getInstance($loadIndicator)) === null || _LoadIndicator$getIns === void 0 || _LoadIndicator$getIns.option('visible', false);
    }
    const $treeViewItem = this._getItem($node);
    const $toggleItem = $treeViewItem.children(`.${CUSTOM_COLLAPSE_ICON_CLASS},.${TOGGLE_ITEM_VISIBILITY_CLASS}`);
    if (hasNewItems) {
      $toggleItem.show();
      return;
    }
    $toggleItem.removeClass(TOGGLE_ITEM_VISIBILITY_CLASS);
    $node.addClass(IS_LEAF);
  },
  _emptyMessageContainer() {
    const scrollable = this.getScrollable();
    return scrollable ? (0, _renderer.default)(scrollable.content()) : this.callBase();
  },
  _renderContent() {
    const items = this.option('items');
    if (items && items.length) {
      this._contentAlreadyRendered = true;
    }
    this.callBase();
  },
  _renderSelectAllItem($container) {
    const {
      selectAllText,
      focusStateEnabled
    } = this.option();
    $container = $container || this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();
    this._$selectAllItem = (0, _renderer.default)('<div>').addClass(SELECT_ALL_ITEM_CLASS);
    const value = this._dataAdapter.isAllSelected();
    this._createComponent(this._$selectAllItem, _check_box.default, {
      value,
      elementAttr: {
        'aria-label': 'Select All'
      },
      text: selectAllText,
      focusStateEnabled,
      onValueChanged: this._onSelectAllCheckboxValueChanged.bind(this),
      onInitialized: _ref => {
        let {
          component
        } = _ref;
        component.registerKeyHandler('enter', () => {
          component.option('value', !component.option('value'));
        });
      }
    });
    this._toggleSelectedClass(this._$selectAllItem, value);
    $container.before(this._$selectAllItem);
  },
  _onSelectAllCheckboxValueChanged(args) {
    this._toggleSelectAll(args);
    this._fireSelectAllValueChanged(args.value);
  },
  _toggleSelectAll(args) {
    this._dataAdapter.toggleSelectAll(args.value);
    this._updateItemsUI();
    this._fireSelectionChanged();
  },
  _renderCheckBox($node, node) {
    const $checkbox = (0, _renderer.default)('<div>').appendTo($node);
    this._createComponent($checkbox, _check_box.default, {
      value: node.internalFields.selected,
      onValueChanged: this._changeCheckboxValue.bind(this),
      focusStateEnabled: false,
      elementAttr: {
        'aria-label': 'Check State'
      },
      disabled: this._disabledGetter(node)
    });
  },
  _toggleSelectedClass($node, value) {
    $node.toggleClass(SELECTED_ITEM_CLASS, !!value);
  },
  _toggleNodeDisabledState(node, state) {
    const $node = this._getNodeElement(node);
    const $item = $node.find(`.${ITEM_CLASS}`).eq(0);
    this._dataAdapter.toggleNodeDisabledState(node.internalFields.key, state);
    $item.toggleClass(DISABLED_STATE_CLASS, !!state);
    if (this._showCheckboxes()) {
      const checkbox = this._getCheckBoxInstance($node);
      checkbox.option('disabled', !!state);
    }
  },
  _itemOptionChanged(item, property, value) {
    const node = this._dataAdapter.getNodeByItem(item);
    if (property === this.option('disabledExpr')) {
      this._toggleNodeDisabledState(node, value);
    }
  },
  _changeCheckboxValue(e) {
    const $node = (0, _renderer.default)(e.element).closest(`.${NODE_CLASS}`);
    const $item = this._getItem($node);
    const item = this._getItemData($item);
    const node = this._getNodeByElement($item);
    const {
      value
    } = e;
    if (node && node.internalFields.selected === value) {
      return;
    }
    this._updateItemSelection(value, item, e.event);
  },
  _isSingleSelection() {
    return this.option('selectionMode') === 'single';
  },
  _isRecursiveSelection() {
    return this.option('selectNodesRecursive') && this.option('selectionMode') !== 'single';
  },
  _isLastSelectedBranch(publicNode, selectedNodesKeys, deep) {
    const keyIndex = selectedNodesKeys.indexOf(publicNode.key);
    if (keyIndex >= 0) {
      selectedNodesKeys.splice(keyIndex, 1);
    }
    if (deep) {
      (0, _iterator.each)(publicNode.children, (_, childNode) => {
        this._isLastSelectedBranch(childNode, selectedNodesKeys, true);
      });
    }
    if (publicNode.parent) {
      this._isLastSelectedBranch(publicNode.parent, selectedNodesKeys);
    }
    return selectedNodesKeys.length === 0;
  },
  _isLastRequired(node) {
    const selectionRequired = this.option('selectionRequired');
    const isSingleMode = this._isSingleSelection();
    const selectedNodesKeys = this.getSelectedNodeKeys();
    if (!selectionRequired) {
      return;
    }
    if (isSingleMode) {
      return selectedNodesKeys.length === 1;
    }
    return this._isLastSelectedBranch(node.internalFields.publicNode, selectedNodesKeys.slice(), true);
  },
  _updateItemSelection(value, itemElement, dxEvent) {
    const node = this._getNode(itemElement);
    if (!node || node.visible === false) {
      return false;
    }
    if (node.internalFields.selected === value) {
      return true;
    }
    if (!value && this._isLastRequired(node)) {
      if (this._showCheckboxes()) {
        const $node = this._getNodeElement(node);
        this._getCheckBoxInstance($node).option('value', true);
      }
      return false;
    }
    if (value && this._isSingleSelection()) {
      const selectedKeys = this.getSelectedNodeKeys();
      (0, _iterator.each)(selectedKeys, (index, key) => {
        this._dataAdapter.toggleSelection(key, false);
        this._updateItemsUI();
        this._fireItemSelectionChanged(this._getNode(key));
      });
    }
    this._dataAdapter.toggleSelection(node.internalFields.key, value);
    const isAllSelected = this._dataAdapter.isAllSelected();
    const needFireSelectAllChanged = this._selectAllEnabled() && this._$selectAllItem.dxCheckBox('instance').option('value') !== isAllSelected;
    this._updateItemsUI();
    this._fireItemSelectionChanged(node, dxEvent);
    this._fireSelectionChanged();
    if (needFireSelectAllChanged) {
      this._fireSelectAllValueChanged(isAllSelected);
    }
    return true;
  },
  _fireItemSelectionChanged(node, dxEvent) {
    const initiator = dxEvent || this._findItemElementByItem(node.internalFields.item);
    const handler = dxEvent ? this._itemDXEventHandler : this._itemEventHandler;
    handler.call(this, initiator, 'onItemSelectionChanged', {
      node: this._dataAdapter.getPublicNode(node),
      itemData: node.internalFields.item
    });
  },
  _getCheckBoxInstance($node) {
    const $treeViewItem = this._getItem($node);
    return $treeViewItem.children(`.${CHECK_BOX_CLASS}`).dxCheckBox('instance');
  },
  _updateItemsUI() {
    const cache = {};
    (0, _iterator.each)(this._dataAdapter.getData(), (_, node) => {
      const $node = this._getNodeElement(node, cache);
      const nodeSelection = node.internalFields.selected;
      if (!$node.length) {
        return;
      }
      this._toggleSelectedClass($node, nodeSelection);
      this.setAria('selected', nodeSelection, $node);
      if (this._showCheckboxes()) {
        this._getCheckBoxInstance($node).option('value', nodeSelection);
      }
    });
    if (this._selectAllEnabled()) {
      const selectAllCheckbox = this._$selectAllItem.dxCheckBox('instance');
      selectAllCheckbox.option('onValueChanged', undefined);
      selectAllCheckbox.option('value', this._dataAdapter.isAllSelected());
      selectAllCheckbox.option('onValueChanged', this._onSelectAllCheckboxValueChanged.bind(this));
    }
  },
  _updateParentsState(node, $node) {
    if (!$node) {
      return;
    }
    const parentNode = this._dataAdapter.getNodeByKey(node.internalFields.parentKey);
    const $parentNode = (0, _renderer.default)($node.parents(`.${NODE_CLASS}`)[0]);
    if (this._showCheckboxes()) {
      const parentValue = parentNode.internalFields.selected;
      this._getCheckBoxInstance($parentNode).option('value', parentValue);
      this._toggleSelectedClass($parentNode, parentValue);
    }
    if (parentNode.internalFields.parentKey !== this.option('rootValue')) {
      this._updateParentsState(parentNode, $parentNode);
    }
  },
  _itemEventHandlerImpl(initiator, action, actionArgs) {
    const $itemElement = (0, _renderer.default)(initiator).closest(`.${NODE_CLASS}`).children(`.${ITEM_CLASS}`);
    return action((0, _extend.extend)(this._extendActionArgs($itemElement), actionArgs));
  },
  _itemContextMenuHandler(e) {
    this._createEventHandler('onItemContextMenu', e);
  },
  _itemHoldHandler(e) {
    this._createEventHandler('onItemHold', e);
  },
  _createEventHandler(eventName, e) {
    const node = this._getNodeByElement(e.currentTarget);
    this._itemDXEventHandler(e, eventName, {
      node: this._dataAdapter.getPublicNode(node)
    });
  },
  _itemClass() {
    return ITEM_CLASS;
  },
  _itemDataKey() {
    return ITEM_DATA_KEY;
  },
  _attachClickEvent() {
    const $itemContainer = this._itemContainer();
    this._detachClickEvent($itemContainer);
    const {
      clickEventNamespace,
      itemSelector,
      pointerDownEventNamespace,
      nodeSelector
    } = this._getItemClickEventData();
    _events_engine.default.on($itemContainer, clickEventNamespace, itemSelector, e => {
      if ((0, _renderer.default)(e.target).hasClass(CHECK_BOX_ICON_CLASS) || (0, _renderer.default)(e.target).hasClass(CHECK_BOX_CLASS)) {
        return;
      }
      this._itemClickHandler(e, (0, _renderer.default)(e.currentTarget));
    });
    _events_engine.default.on($itemContainer, pointerDownEventNamespace, nodeSelector, e => {
      this._itemPointerDownHandler(e);
    });
  },
  _detachClickEvent(itemsContainer) {
    const {
      clickEventNamespace,
      itemSelector,
      pointerDownEventNamespace,
      nodeSelector
    } = this._getItemClickEventData();
    _events_engine.default.off(itemsContainer, clickEventNamespace, itemSelector);
    _events_engine.default.off(itemsContainer, pointerDownEventNamespace, nodeSelector);
  },
  _getItemClickEventData() {
    const itemSelector = `.${this._itemClass()}`;
    const nodeSelector = `.${NODE_CLASS}, .${SELECT_ALL_ITEM_CLASS}`;
    const clickEventNamespace = (0, _index.addNamespace)(_click.name, this.NAME);
    const pointerDownEventNamespace = (0, _index.addNamespace)(_pointer.default.down, this.NAME);
    return {
      clickEventNamespace,
      itemSelector,
      pointerDownEventNamespace,
      nodeSelector
    };
  },
  _itemClick(actionArgs) {
    const args = actionArgs.args[0];
    const target = args.event.target[0] || args.event.target;
    const link = target.getElementsByClassName(ITEM_URL_CLASS)[0];
    if (args.itemData.url && link) {
      link.click();
    }
  },
  _itemClickHandler(e, $item) {
    const itemData = this._getItemData($item);
    const node = this._getNodeByElement($item);
    this._itemDXEventHandler(e, 'onItemClick', {
      node: this._dataAdapter.getPublicNode(node)
    }, {
      beforeExecute: this._itemClick
    });
    if (this.option('selectByClick') && !e.isDefaultPrevented()) {
      this._updateItemSelection(!node.internalFields.selected, itemData, e);
    }
  },
  _updateSelectionToFirstItem($items, startIndex) {
    let itemIndex = startIndex;
    while (itemIndex >= 0) {
      const $item = (0, _renderer.default)($items[itemIndex]);
      this._updateItemSelection(true, $item.find(`.${ITEM_CLASS}`).get(0));
      itemIndex--;
    }
  },
  _updateSelectionToLastItem($items, startIndex) {
    const {
      length
    } = $items;
    let itemIndex = startIndex;
    while (itemIndex < length) {
      const $item = (0, _renderer.default)($items[itemIndex]);
      this._updateItemSelection(true, $item.find(`.${ITEM_CLASS}`).get(0));
      itemIndex++;
    }
  },
  focus() {
    if (this._selectAllEnabled()) {
      // @ts-expect-error
      _events_engine.default.trigger(this._$selectAllItem, 'focus');
      return;
    }
    this.callBase();
  },
  _focusInHandler(e) {
    this._updateFocusState(e, true);
    const isSelectAllItem = (0, _renderer.default)(e.target).hasClass(SELECT_ALL_ITEM_CLASS);
    if (isSelectAllItem || this.option('focusedElement')) {
      clearTimeout(this._setFocusedItemTimeout);
      this._setFocusedItemTimeout = setTimeout(() => {
        const element = isSelectAllItem ? (0, _element.getPublicElement)(this._$selectAllItem) : (0, _renderer.default)(this.option('focusedElement'));
        this._setFocusedItem(element);
      });
      return;
    }
    const $activeItem = this._getActiveItem();
    this.option('focusedElement', (0, _element.getPublicElement)($activeItem.closest(`.${NODE_CLASS}`)));
  },
  _itemPointerDownHandler(e) {
    if (!this.option('focusStateEnabled')) {
      return;
    }
    const $target = (0, _renderer.default)(e.target).closest(`.${NODE_CLASS}, .${SELECT_ALL_ITEM_CLASS}`);
    if (!$target.length) {
      return;
    }
    const itemElement = $target.hasClass(DISABLED_STATE_CLASS) ? null : $target;
    // @ts-expect-error
    this.option('focusedElement', (0, _element.getPublicElement)(itemElement));
  },
  _findNonDisabledNodes($nodes) {
    return $nodes.not(function () {
      return (0, _renderer.default)(this).children(`.${ITEM_CLASS}`).hasClass(DISABLED_STATE_CLASS);
    });
  },
  _moveFocus(location, e) {
    const FOCUS_UP = 'up';
    const FOCUS_DOWN = 'down';
    const FOCUS_FIRST = 'first';
    const FOCUS_LAST = 'last';
    const FOCUS_LEFT = this.option('rtlEnabled') ? 'right' : 'left';
    const FOCUS_RIGHT = this.option('rtlEnabled') ? 'left' : 'right';
    this.$element().find(`.${NODE_CONTAINER_CLASS}`).each(function () {
      _fx.default.stop(this, true);
    });
    const $items = this._nodeElements();
    if (!$items || !$items.length) {
      return;
    }
    switch (location) {
      case FOCUS_UP:
        {
          const $prevItem = this._prevItem($items);
          this.option('focusedElement', (0, _element.getPublicElement)($prevItem));
          const prevItemElement = this._getNodeItemElement($prevItem);
          this.getScrollable().scrollToElement(prevItemElement);
          if (e.shiftKey && this._showCheckboxes()) {
            this._updateItemSelection(true, prevItemElement);
          }
          break;
        }
      case FOCUS_DOWN:
        {
          const $nextItem = this._nextItem($items);
          this.option('focusedElement', (0, _element.getPublicElement)($nextItem));
          const nextItemElement = this._getNodeItemElement($nextItem);
          this.getScrollable().scrollToElement(nextItemElement);
          if (e.shiftKey && this._showCheckboxes()) {
            this._updateItemSelection(true, nextItemElement);
          }
          break;
        }
      case FOCUS_FIRST:
        {
          const $firstItem = $items.first();
          if (e.shiftKey && this._showCheckboxes()) {
            this._updateSelectionToFirstItem($items, $items.index(this._prevItem($items)));
          }
          this.option('focusedElement', (0, _element.getPublicElement)($firstItem));
          this.getScrollable().scrollToElement(this._getNodeItemElement($firstItem));
          break;
        }
      case FOCUS_LAST:
        {
          const $lastItem = $items.last();
          if (e.shiftKey && this._showCheckboxes()) {
            this._updateSelectionToLastItem($items, $items.index(this._nextItem($items)));
          }
          this.option('focusedElement', (0, _element.getPublicElement)($lastItem));
          this.getScrollable().scrollToElement(this._getNodeItemElement($lastItem));
          break;
        }
      case FOCUS_RIGHT:
        {
          this._expandFocusedContainer();
          break;
        }
      case FOCUS_LEFT:
        {
          this._collapseFocusedContainer();
          break;
        }
      default:
        this.callBase.apply(this, arguments);
    }
  },
  _getNodeItemElement($node) {
    return $node.find(`.${ITEM_CLASS}`).get(0);
  },
  _nodeElements() {
    return this.$element().find(`.${NODE_CLASS}`).not(':hidden');
  },
  _expandFocusedContainer() {
    const $focusedNode = (0, _renderer.default)(this.option('focusedElement'));
    if (!$focusedNode.length || $focusedNode.hasClass(IS_LEAF)) {
      return;
    }
    const $node = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);
    if ($node.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
      const $nextItem = this._nextItem(this._findNonDisabledNodes(this._nodeElements()));
      this.option('focusedElement', (0, _element.getPublicElement)($nextItem));
      this.getScrollable().scrollToElement(this._getNodeItemElement($nextItem));
      return;
    }
    const node = this._getNodeByElement(this._getItem($focusedNode));
    this._toggleExpandedState(node, true);
  },
  _getClosestNonDisabledNode($node) {
    do {
      $node = $node.parent().closest(`.${NODE_CLASS}`);
    } while ($node.children('.dx-treeview-item.dx-state-disabled').length);
    return $node;
  },
  _collapseFocusedContainer() {
    const $focusedNode = (0, _renderer.default)(this.option('focusedElement'));
    if (!$focusedNode.length) {
      return;
    }
    const nodeElement = $focusedNode.find(`.${NODE_CONTAINER_CLASS}`).eq(0);
    if (!$focusedNode.hasClass(IS_LEAF) && nodeElement.hasClass(OPENED_NODE_CONTAINER_CLASS)) {
      const node = this._getNodeByElement(this._getItem($focusedNode));
      this._toggleExpandedState(node, false);
    } else {
      const collapsedNode = this._getClosestNonDisabledNode($focusedNode);
      collapsedNode.length && this.option('focusedElement', (0, _element.getPublicElement)(collapsedNode));
      this.getScrollable().scrollToElement(this._getNodeItemElement(collapsedNode));
    }
  },
  _encodeString(value) {
    return (0, _type.isString)(value) ? encodeURI(value) : value;
  },
  _decodeString(value) {
    return (0, _type.isString)(value) ? decodeURI(value) : value;
  },
  getScrollable() {
    return this._scrollable;
  },
  updateDimensions() {
    const deferred = (0, _deferred.Deferred)();
    const scrollable = this.getScrollable();
    if (scrollable) {
      scrollable.update().done(() => {
        deferred.resolveWith(this);
      });
    } else {
      deferred.resolveWith(this);
    }
    return deferred.promise();
  },
  selectItem(itemElement) {
    return this._updateItemSelection(true, itemElement);
  },
  unselectItem(itemElement) {
    return this._updateItemSelection(false, itemElement);
  },
  expandItem(itemElement) {
    return this._toggleExpandedState(itemElement, true);
  },
  collapseItem(itemElement) {
    return this._toggleExpandedState(itemElement, false);
  },
  getNodes() {
    return this._dataAdapter.getTreeNodes();
  },
  getSelectedNodes() {
    return this.getSelectedNodeKeys().map(key => {
      const node = this._dataAdapter.getNodeByKey(key);
      return this._dataAdapter.getPublicNode(node);
    });
  },
  getSelectedNodeKeys() {
    return this._dataAdapter.getSelectedNodesKeys();
  },
  selectAll() {
    if (this._selectAllEnabled()) {
      this._$selectAllItem.dxCheckBox('instance').option('value', true);
    } else {
      this._toggleSelectAll({
        value: true
      });
    }
  },
  unselectAll() {
    if (this._selectAllEnabled()) {
      this._$selectAllItem.dxCheckBox('instance').option('value', false);
    } else {
      this._toggleSelectAll({
        value: false
      });
    }
  },
  _allItemsExpandedHandler() {
    this._skipContentReadyAndItemExpanded = false;
    this._fireContentReadyAction();
  },
  expandAll() {
    const nodes = this._dataAdapter.getData();
    const expandingPromises = [];
    this._skipContentReadyAndItemExpanded = true;
    // NOTE: This is needed to support animation on expandAll, but stop triggering multiple contentReady/itemExpanded events.
    // @ts-expect-error
    nodes.forEach(node => expandingPromises.push(this._toggleExpandedState(node.internalFields.key, true)));
    Promise.allSettled(expandingPromises).then(() => {
      var _this$_allItemsExpand;
      return (_this$_allItemsExpand = this._allItemsExpandedHandler) === null || _this$_allItemsExpand === void 0 ? void 0 : _this$_allItemsExpand.call(this);
    });
  },
  collapseAll() {
    (0, _iterator.each)(this._dataAdapter.getExpandedNodesKeys(), (_, key) => {
      this._toggleExpandedState(key, false);
    });
  },
  scrollToItem(keyOrItemOrElement) {
    const node = this._getNode(keyOrItemOrElement);
    if (!node) {
      return (0, _deferred.Deferred)().reject().promise();
    }
    const nodeKeysToExpand = [];
    let parentNode = node.internalFields.publicNode.parent;
    while (parentNode != null) {
      if (!parentNode.expanded) {
        // @ts-expect-error
        nodeKeysToExpand.push(parentNode.key);
      }
      parentNode = parentNode.parent;
    }
    const scrollCallback = (0, _deferred.Deferred)();
    this._expandNodes(nodeKeysToExpand.reverse()).always(() => {
      const $element = this._getNodeElement(node);
      if ($element && $element.length) {
        this.scrollToElementTopLeft($element.get(0));
        scrollCallback.resolve();
      } else {
        scrollCallback.reject();
      }
    });
    return scrollCallback.promise();
  },
  scrollToElementTopLeft(targetElement) {
    const scrollable = this.getScrollable();
    const {
      scrollDirection,
      rtlEnabled
    } = this.option();
    const targetLocation = {
      top: 0,
      left: 0
    };
    const relativeOffset = (0, _get_relative_offset.getRelativeOffset)(_consts.SCROLLABLE_CONTENT_CLASS, targetElement);
    if (scrollDirection !== _consts.DIRECTION_VERTICAL) {
      const containerElement = (0, _renderer.default)(scrollable.container()).get(0);
      targetLocation.left = rtlEnabled ? relativeOffset.left + targetElement.offsetWidth - containerElement.clientWidth : relativeOffset.left;
    }
    if (scrollDirection !== _consts.DIRECTION_HORIZONTAL) {
      targetLocation.top = relativeOffset.top;
    }
    scrollable.scrollTo(targetLocation);
  },
  _expandNodes(keysToExpand) {
    if (!keysToExpand || keysToExpand.length === 0) {
      return (0, _deferred.Deferred)().resolve().promise();
    }
    const resultCallback = (0, _deferred.Deferred)();
    const callbacksByNodes = keysToExpand.map(key => this.expandItem(key));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    _deferred.when.apply(_renderer.default, callbacksByNodes)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .done(() => resultCallback.resolve())
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .fail(() => resultCallback.reject());
    return resultCallback.promise();
  },
  _dispose() {
    this.callBase();
    clearTimeout(this._setFocusedItemTimeout);
    this._allItemsExpandedHandler = null;
  }
});
var _default = exports.default = TreeViewBase;