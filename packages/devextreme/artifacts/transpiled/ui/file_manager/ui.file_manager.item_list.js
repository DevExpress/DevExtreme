"use strict";

exports.default = void 0;
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _window = require("../../core/utils/window");
var _double_click = require("../../events/double_click");
var _index = require("../../events/utils/index");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _icon = require("../../core/utils/icon");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _custom_store = _interopRequireDefault(require("../../data/custom_store"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_FILES_VIEW_CLASS = 'dx-filemanager-files-view';
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = 'dxFileManager_open';
class FileManagerItemListBase extends _ui.default {
  _init() {
    this._initActions();
    this._lockFocusedItemProcessing = false;
    this._focusedItemKey = this.option('focusedItemKey');
    super._init();
  }
  _initMarkup() {
    this._needResetScrollPosition = false;
    this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
    const dblClickEventName = (0, _index.addNamespace)(_double_click.name, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
    _events_engine.default.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));
    super._initMarkup();
  }
  _initActions() {
    this._actions = {
      onError: this._createActionByOption('onError'),
      onSelectionChanged: this._createActionByOption('onSelectionChanged'),
      onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
      onSelectedItemOpened: this._createActionByOption('onSelectedItemOpened'),
      onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
      onItemListDataLoaded: this._createActionByOption('onItemListDataLoaded')
    };
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      selectionMode: 'single',
      selectedItemKeys: [],
      focusedItemKey: undefined,
      contextMenu: null,
      getItems: null,
      getItemThumbnail: null,
      onError: null,
      onSelectionChanged: null,
      onFocusedItemChanged: null,
      onSelectedItemOpened: null,
      onContextMenuShowing: null
    });
  }
  _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'selectionMode':
      case 'contextMenu':
      case 'getItems':
      case 'getItemThumbnail':
        this.repaint();
        break;
      case 'selectedItemKeys':
        this._setSelectedItemKeys(args.value);
        break;
      case 'focusedItemKey':
        if (!this._lockFocusedItemProcessing) {
          this._setFocusedItemKey(args.value);
        }
        break;
      case 'onError':
      case 'onSelectedItemOpened':
      case 'onSelectionChanged':
      case 'onFocusedItemChanged':
      case 'onContextMenuShowing':
      case 'onItemListDataLoaded':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _getItems() {
    return this._getItemsInternal().done(itemInfos => {
      this._itemCount = itemInfos.length;
      if (this._itemCount === 0) {
        this._resetFocus();
      }
      const parentDirectoryItem = this._findParentDirectoryItem(itemInfos);
      this._hasParentDirectoryItem = !!parentDirectoryItem;
      this._parentDirectoryItemKey = parentDirectoryItem ? parentDirectoryItem.fileItem.key : null;
    }).always(() => {
      this._onDataLoaded();
    });
  }
  _getItemsInternal() {
    const itemsGetter = this.option('getItems');
    const itemsResult = itemsGetter ? itemsGetter() : [];
    return (0, _deferred.when)(itemsResult);
  }
  _raiseOnError(error) {
    this._actions.onError({
      error
    });
  }
  _raiseSelectionChanged(args) {
    this._actions.onSelectionChanged(args);
  }
  _raiseFocusedItemChanged(args) {
    this._actions.onFocusedItemChanged(args);
  }
  _raiseSelectedItemOpened(fileItemInfo) {
    this._actions.onSelectedItemOpened({
      fileItemInfo
    });
  }
  _raiseContextMenuShowing(e) {
    this._actions.onContextMenuShowing(e);
  }
  _raiseItemListDataLoaded() {
    this._actions.onItemListDataLoaded();
  }
  _onDataLoaded() {
    var _this$_refreshDeferre;
    this._raiseItemListDataLoaded();
    (_this$_refreshDeferre = this._refreshDeferred) === null || _this$_refreshDeferre === void 0 || _this$_refreshDeferre.resolve();
  }
  _onContentReady() {
    if (this._needResetScrollPosition) {
      this._resetScrollTopPosition();
      this._needResetScrollPosition = false;
    }
  }
  _tryRaiseSelectionChanged(_ref) {
    let {
      selectedItemInfos,
      selectedItems,
      selectedItemKeys,
      currentSelectedItemKeys,
      currentDeselectedItemKeys
    } = _ref;
    const parentDirectoryItem = this._findParentDirectoryItem(this.getSelectedItems());
    if (parentDirectoryItem) {
      this._deselectItem(parentDirectoryItem);
    }
    let raiseEvent = !this._hasParentDirectoryItem;
    raiseEvent = raiseEvent || this._hasValidKeys(currentSelectedItemKeys) || this._hasValidKeys(currentDeselectedItemKeys);
    if (raiseEvent) {
      selectedItemInfos = this._filterOutItemByPredicate(selectedItemInfos, item => item.fileItem.key === this._parentDirectoryItemKey);
      selectedItems = this._filterOutParentDirectory(selectedItems);
      selectedItemKeys = this._filterOutParentDirectoryKey(selectedItemKeys, true);
      currentSelectedItemKeys = this._filterOutParentDirectoryKey(currentSelectedItemKeys, true);
      currentDeselectedItemKeys = this._filterOutParentDirectoryKey(currentDeselectedItemKeys, true);
      this._raiseSelectionChanged({
        selectedItemInfos,
        selectedItems,
        selectedItemKeys,
        currentSelectedItemKeys,
        currentDeselectedItemKeys
      });
    }
  }
  _onFocusedItemChanged(args) {
    if (this._focusedItemKey === args.itemKey) {
      return;
    }
    this._focusedItemKey = args.itemKey;
    this._lockFocusedItemProcessing = true;
    this.option('focusedItemKey', args.itemKey);
    this._lockFocusedItemProcessing = false;
    this._raiseFocusedItemChanged(args);
  }
  _resetFocus() {}
  _resetScrollTopPosition() {
    if (!(0, _window.hasWindow)()) {
      return;
    }
    setTimeout(() => {
      var _this$_getScrollable;
      return (_this$_getScrollable = this._getScrollable()) === null || _this$_getScrollable === void 0 ? void 0 : _this$_getScrollable.scrollTo(0);
    });
  }
  _getScrollable() {}
  _getItemThumbnail(fileInfo) {
    const itemThumbnailGetter = this.option('getItemThumbnail');
    return itemThumbnailGetter ? itemThumbnailGetter(fileInfo) : {
      thumbnail: ''
    };
  }
  _getItemThumbnailContainer(fileInfo) {
    const {
      thumbnail,
      cssClass
    } = this._getItemThumbnail(fileInfo);
    const $itemThumbnail = (0, _icon.getImageContainer)(thumbnail).addClass(this._getItemThumbnailCssClass());
    if (cssClass) {
      $itemThumbnail.addClass(cssClass);
    }
    return $itemThumbnail;
  }
  _getItemThumbnailCssClass() {
    return '';
  }
  _getItemSelector() {}
  _onItemDblClick(e) {}
  _isDesktop() {
    return _devices.default.real().deviceType === 'desktop';
  }
  _showContextMenu(items, element, event, target) {
    this._contextMenu.showAt(items, element, event, target);
  }
  get _contextMenu() {
    return this.option('contextMenu');
  }
  _findParentDirectoryItem(itemInfos) {
    for (let i = 0; i < itemInfos.length; i++) {
      const itemInfo = itemInfos[i];
      if (this._isParentDirectoryItem(itemInfo)) {
        return itemInfo;
      }
    }
    return null;
  }
  _getFileItemsForContextMenu(fileItem) {
    const result = this.getSelectedItems();
    if (this._isParentDirectoryItem(fileItem)) {
      result.push(fileItem);
    }
    return result;
  }
  _isParentDirectoryItem(itemInfo) {
    return itemInfo.fileItem.isParentFolder;
  }
  _hasValidKeys(keys) {
    return keys.length > 1 || keys.length === 1 && keys[0] !== this._parentDirectoryItemKey;
  }
  _filterOutParentDirectory(array, createNewArray) {
    return this._filterOutItemByPredicate(array, item => item.key === this._parentDirectoryItemKey, createNewArray);
  }
  _filterOutParentDirectoryKey(array, createNewArray) {
    return this._filterOutItemByPredicate(array, key => key === this._parentDirectoryItemKey, createNewArray);
  }
  _filterOutItemByPredicate(array, predicate, createNewArray) {
    let result = array;
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      if (createNewArray) {
        result = [...array];
      }
      result.splice(index, 1);
    }
    return result;
  }
  _isMultipleSelectionMode() {
    return this.option('selectionMode') === 'multiple';
  }
  _deselectItem(item) {}
  _setSelectedItemKeys(itemKeys) {}
  _setFocusedItemKey(itemKey) {}
  _createDataSource() {
    return {
      store: new _custom_store.default({
        key: 'fileItem.key',
        load: this._getItems.bind(this)
      })
    };
  }
  getSelectedItems() {}
  clearSelection() {}
  selectItem() {}
  refresh(options, operation) {}
}
var _default = exports.default = FileManagerItemListBase;
module.exports = exports.default;
module.exports.default = exports.default;