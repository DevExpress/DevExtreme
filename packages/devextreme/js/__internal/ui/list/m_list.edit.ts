import { isTouchEvent } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';

import { ListBase } from './m_list.base';
import EditProvider from './m_list.edit.provider';
import GroupedEditStrategy from './m_list.edit.strategy.grouped';

const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const LIST_ITEM_RESPONSE_WAIT_CLASS = 'dx-list-item-response-wait';

const ListEdit = ListBase.inherit({
  _supportedKeys() {
    const that = this;
    const parent = this.callBase();

    const deleteFocusedItem = (e) => {
      if (that.option('allowItemDeleting')) {
        e.preventDefault();
        that.deleteItem(that.option('focusedElement'));
      }
    };

    const moveFocusedItem = (e, moveUp?: boolean) => {
      const editStrategy = this._editStrategy;
      const focusedElement = this.option('focusedElement');
      const focusedItemIndex = editStrategy.getNormalizedIndex(focusedElement);
      const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();

      if (isLastIndexFocused && this._dataController.isLoading()) {
        return;
      }

      if (e.shiftKey && that.option('itemDragging.allowReordering')) {
        const nextItemIndex = focusedItemIndex + (moveUp ? -1 : 1);
        const $nextItem = editStrategy.getItemElement(nextItemIndex);

        this.reorderItem(focusedElement, $nextItem);
        this.scrollToItem(focusedElement);
        e.preventDefault();
      } else {
        const editProvider = this._editProvider;
        const isInternalMoving = editProvider.handleKeyboardEvents(focusedItemIndex, moveUp);

        if (!isInternalMoving) {
          moveUp ? parent.upArrow(e) : parent.downArrow(e);
        }
      }
    };

    const enter = function (e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.enter.apply(this, arguments);
      }
    };

    const space = function (e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.space.apply(this, arguments);
      }
    };

    return extend({}, parent, {
      del: deleteFocusedItem,
      upArrow: (e) => moveFocusedItem(e, true),
      downArrow: (e) => moveFocusedItem(e),
      enter,
      space,
    });
  },

  _updateSelection() {
    this._editProvider.afterItemsRendered();
    this.callBase();
  },

  _getLastItemIndex() {
    return this._itemElements().length - 1;
  },

  _refreshItemElements() {
    this.callBase();

    const excludedSelectors = this._editProvider.getExcludedItemSelectors();

    if (excludedSelectors.length) {
      this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
    }
  },

  _isItemStrictEquals(item1, item2) {
    const privateKey = item1 && item1.__dx_key__;
    if (privateKey && !this.key() && this._selection.isItemSelected(privateKey)) {
      return false;
    }

    return this.callBase(item1, item2);
  },

  _getDefaultOptions() {
    return extend(this.callBase(), {
      showSelectionControls: false,

      selectionMode: 'none',

      selectAllMode: 'page',

      onSelectAllValueChanged: null,

      selectAllText: localizationMessage.format('dxList-selectAll'),

      menuItems: [],

      menuMode: 'context',

      allowItemDeleting: false,

      itemDeleteMode: 'static',

      itemDragging: {},
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device: (device) => device.platform === 'ios',
        options: {
          menuMode: 'slide',

          itemDeleteMode: 'slideItem',
        },
      },
      {
        device: { platform: 'android' },
        options: {
          itemDeleteMode: 'swipe',
        },
      },
    ]);
  },

  _init() {
    this.callBase();
    this._initEditProvider();
  },

  _initDataSource() {
    this.callBase();

    if (!this._isPageSelectAll()) {
      this._dataSource && this._dataSource.requireTotalCount(true);
    }
  },

  _isPageSelectAll() {
    return this.option('selectAllMode') === 'page';
  },

  _initEditProvider() {
    this._editProvider = new EditProvider(this);
  },

  _disposeEditProvider() {
    if (this._editProvider) {
      this._editProvider.dispose();
    }
  },

  _refreshEditProvider() {
    this._disposeEditProvider();
    this._initEditProvider();
  },

  _initEditStrategy() {
    if (this.option('grouped')) {
      this._editStrategy = new GroupedEditStrategy(this);
    } else {
      this.callBase();
    }
  },

  _initMarkup() {
    this._refreshEditProvider();
    this.callBase();
  },

  _renderItems(...args) {
    this.callBase(...args);
    this._editProvider.afterItemsRendered();
  },

  _renderItem(index, itemData, $container, $itemToReplace) {
    const { showSelectionControls, selectionMode } = this.option();
    const $itemFrame = this.callBase(index, itemData, $container, $itemToReplace);

    if (showSelectionControls && selectionMode !== 'none') {
      this._updateItemAriaLabel($itemFrame, itemData);
    }

    return $itemFrame;
  },

  _updateItemAriaLabel($itemFrame, itemData) {
    const label = this._displayGetter?.(itemData) ?? itemData?.text ?? itemData;

    this.setAria('label', label, $itemFrame);
  },

  _selectedItemClass() {
    return LIST_ITEM_SELECTED_CLASS;
  },

  _itemResponseWaitClass() {
    return LIST_ITEM_RESPONSE_WAIT_CLASS;
  },

  _itemClickHandler(e) {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = this._editProvider.handleClick($itemElement, e);
    if (handledByEditProvider) {
      return;
    }
    this._saveSelectionChangeEvent(e);
    this.callBase(...arguments);
  },

  _shouldFireContextMenuEvent(...args) {
    return this.callBase(...args) || this._editProvider.contextMenuHandlerExists();
  },

  _itemHoldHandler(e) {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = isTouchEvent(e) && this._editProvider.handleContextMenu($itemElement, e);
    if (handledByEditProvider) {
      e.handledByEditProvider = true;
      return;
    }

    this.callBase(...arguments);
  },

  _getItemContainer(changeData) {
    if (this.option('grouped')) {
      const groupIndex = this._editStrategy.getIndexByItemData(changeData)?.group;
      return this._getGroupContainerByIndex(groupIndex);
    }
    return this.callBase(changeData);
  },

  _itemContextMenuHandler(e) {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = !e.handledByEditProvider && this._editProvider.handleContextMenu($itemElement, e);
    if (handledByEditProvider) {
      e.preventDefault();
      return;
    }

    this.callBase(...arguments);
  },

  _postprocessRenderItem(args) {
    this.callBase(...arguments);
    this._editProvider.modifyItemElement(args);
  },

  _clean() {
    this._disposeEditProvider();
    this.callBase();
  },

  focusListItem(index) {
    const $item = this._editStrategy.getItemElement(index);

    this.option('focusedElement', $item);
    this.focus();
    this.scrollToItem(this.option('focusedElement'));
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'selectAllMode':
        this._initDataSource();
        this._dataController.pageIndex(0);
        this._dataController.load();
        break;
      case 'grouped':
        this._clearSelectedItems();
        delete this._renderingGroupIndex;
        this._initEditStrategy();
        this.callBase(args);
        break;
      case 'showSelectionControls':
      case 'menuItems':
      case 'menuMode':
      case 'allowItemDeleting':
      case 'itemDeleteMode':
      case 'itemDragging':
      case 'selectAllText':
        this._invalidate();
        break;
      case 'onSelectAllValueChanged':
        break;
      default:
        this.callBase(args);
    }
  },

  selectAll() {
    return this._selection.selectAll(this._isPageSelectAll());
  },

  unselectAll() {
    return this._selection.deselectAll(this._isPageSelectAll());
  },

  isSelectAll() {
    return this._selection.getSelectAllState(this._isPageSelectAll());
  },

  getFlatIndexByItemElement(itemElement) {
    return this._itemElements().index(itemElement);
  },

  getItemElementByFlatIndex(flatIndex) {
    const $itemElements = this._itemElements();

    if (flatIndex < 0 || flatIndex >= $itemElements.length) {
      return $();
    }

    return $itemElements.eq(flatIndex);
  },

  getItemByIndex(index) {
    return this._editStrategy.getItemDataByIndex(index);
  },

  deleteItem(itemElement) {
    const editStrategy = this._editStrategy;
    const deletingElementIndex = editStrategy.getNormalizedIndex(itemElement);
    const focusedElement = this.option('focusedElement');
    const focusStateEnabled = this.option('focusStateEnabled');
    const focusedItemIndex = focusedElement ? editStrategy.getNormalizedIndex(focusedElement) : deletingElementIndex;
    const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();
    const nextFocusedItem = isLastIndexFocused || deletingElementIndex < focusedItemIndex
      ? focusedItemIndex - 1
      : focusedItemIndex;
    const promise = this.callBase(itemElement);

    return promise.done(function () {
      if (focusStateEnabled) {
        this.focusListItem(nextFocusedItem);
      }
    });
  },
});

export default ListEdit;
