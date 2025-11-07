import { isTouchEvent } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { Item } from '@js/ui/list';
import { isNumeric, isObject } from '@ts/core/utils/m_type';
import type { OptionChanged } from '@ts/core/widget/types';
import { NOT_EXISTING_INDEX } from '@ts/ui/collection/m_collection_widget.edit';

import type { ListBaseProperties } from './m_list.base';
import { ListBase } from './m_list.base';
import EditProvider from './m_list.edit.provider';
import GroupedEditStrategy from './m_list.edit.strategy.grouped';

const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const LIST_ITEM_RESPONSE_WAIT_CLASS = 'dx-list-item-response-wait';

class ListEdit extends ListBase {
  _editProvider!: EditProvider;

  _supportedKeys(): Record<string, (e: KeyboardEvent, options?: Record<string, unknown>) => void> {
    const that = this;
    const parent = super._supportedKeys();

    const deleteFocusedItem = (e) => {
      if (that.option('allowItemDeleting')) {
        e.preventDefault();
        that.deleteItem(that.option('focusedElement'));
      }
    };

    const moveFocusedItem = (e, moveUp?: boolean) => {
      const editStrategy = this._editStrategy;
      const { focusedElement } = this.option();
      // @ts-expect-error ts-error
      const focusedItemIndex = editStrategy.getNormalizedIndex(focusedElement);
      const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();
      if (isLastIndexFocused && this._dataController.isLoading()) {
        return;
      }

      if (e.shiftKey && that.option('itemDragging.allowReordering')) {
        const nextItemIndex = focusedItemIndex + (moveUp ? -1 : 1);
        const $nextItem = editStrategy.getItemElement(nextItemIndex);

        const isMoveFromGroup = this.option('grouped')
          && $(focusedElement).parent().get(0) !== $nextItem.parent().get(0);
        if (!isMoveFromGroup) {
          this.reorderItem(focusedElement, $nextItem);
          this.scrollToItem(focusedElement);
        }
        e.preventDefault();
      } else {
        const editProvider = this._editProvider;
        const isInternalMoving = editProvider.handleKeyboardEvents(focusedItemIndex, moveUp);

        if (!isInternalMoving) {
          if (moveUp) {
            parent.upArrow(e);
          } else {
            parent.downArrow(e);
          }
        } else {
          e.preventDefault(); // to prevent extra scrolling
        }
      }
    };

    const enter = function (e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        // @ts-expect-error ts-error
        parent.enter.apply(this, arguments);
      }
    };

    const space = function (e) {
      if (!this._editProvider.handleEnterPressing(e)) {
        // @ts-expect-error ts-error
        parent.space.apply(this, arguments);
      }
    };

    return {
      ...parent,
      del: deleteFocusedItem,
      upArrow: (e) => moveFocusedItem(e, true),
      downArrow: (e) => moveFocusedItem(e),
      enter,
      space,
    };
  }

  _updateSelection(): void {
    this._editProvider.afterItemsRendered();
    super._updateSelection();
  }

  _getLastItemIndex() {
    return this._itemElements().length - 1;
  }

  _refreshItemElements() {
    super._refreshItemElements();

    const excludedSelectors = this._editProvider.getExcludedItemSelectors();

    if (excludedSelectors.length) {
      this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
    }
  }

  _isItemStrictEquals(item1, item2) {
    const privateKey = item1?.__dx_key__;
    if (privateKey && !this.key() && this._selection.isItemSelected(privateKey)) {
      return false;
    }

    return super._isItemStrictEquals(item1, item2);
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
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
  }

  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([
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
  }

  _init() {
    super._init();
    this._initEditProvider();
  }

  _initDataSource(): void {
    // @ts-expect-error ts-error
    super._initDataSource();

    if (!this._isPageSelectAll()) {
      // @ts-expect-error ts-error
      this._dataSource?.requireTotalCount(true);
    }
  }

  _isPageSelectAll(): boolean {
    const { selectAllMode } = this.option();

    return selectAllMode === 'page';
  }

  _initEditProvider(): void {
    // @ts-expect-error ts-error
    this._editProvider = new EditProvider(this);
  }

  _disposeEditProvider(): void {
    if (this._editProvider) {
      this._editProvider.dispose();
    }
  }

  _refreshEditProvider(): void {
    this._disposeEditProvider();
    this._initEditProvider();
  }

  _initEditStrategy(): void {
    if (this.option('grouped')) {
      // @ts-expect-error ts-error
      this._editStrategy = new GroupedEditStrategy(this);
    } else {
      super._initEditStrategy();
    }
  }

  _initMarkup(): void {
    this._refreshEditProvider();
    super._initMarkup();
  }

  _renderItems(...args): void {
    // @ts-expect-error ts-error
    super._renderItems(...args);
    this._editProvider.afterItemsRendered();
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container?: dxElementWrapper | null,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper {
    const { showSelectionControls, selectionMode } = this.option();
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    if (showSelectionControls && selectionMode !== 'none') {
      this._updateItemAriaLabel($itemFrame, itemData);
    }

    return $itemFrame;
  }

  _updateItemAriaLabel($itemFrame: dxElementWrapper, itemData: Item): void {
    // @ts-expect-error ts-error
    const label = this._displayGetter?.(itemData) ?? itemData?.text ?? itemData;

    this.setAria(
      'label',
      isObject(label) ? localizationMessage.format('dxList-listAriaLabel-itemContent') : label,
      $itemFrame,
    );
  }

  _selectedItemClass() {
    return LIST_ITEM_SELECTED_CLASS;
  }

  _itemResponseWaitClass() {
    return LIST_ITEM_RESPONSE_WAIT_CLASS;
  }

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
    // @ts-expect-error ts-error
    super._itemClickHandler(...arguments);
  }

  _shouldFireContextMenuEvent(...args) {
    // @ts-expect-error ts-error
    return super._shouldFireContextMenuEvent(...args) || this._editProvider.contextMenuHandlerExists();
  }

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
    // @ts-expect-error ts-error
    super._itemHoldHandler(...arguments);
  }

  _itemContextMenuHandler(e): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = !e.handledByEditProvider && this._editProvider.handleContextMenu($itemElement, e);
    if (handledByEditProvider) {
      e.preventDefault();
      return;
    }
    // @ts-expect-error ts-error
    super._itemContextMenuHandler(...arguments);
  }

  _postprocessRenderItem(args): void {
    // @ts-expect-error ts-error
    super._postprocessRenderItem(...arguments);
    this._editProvider.modifyItemElement(args);
  }

  _clean(): void {
    this._disposeEditProvider();
    super._clean();
  }

  focusListItem(index): void {
    const $item = this._editStrategy.getItemElement(index);

    this.option('focusedElement', $item);
    this.focus();
    this.scrollToItem(this.option('focusedElement'));
  }

  _getFlatIndex(): number {
    const { selectedIndex = NOT_EXISTING_INDEX } = this.option();

    if (isNumeric(selectedIndex) || !selectedIndex) {
      return selectedIndex;
    }

    const $item = this._editStrategy.getItemElement(selectedIndex);
    const index = this.getFlatIndexByItemElement($item);

    return index;
  }

  _optionChanged(args: OptionChanged<ListBaseProperties>): void {
    switch (args.name) {
      case 'selectAllMode':
        this._initDataSource();
        this._dataController.pageIndex(0);
        this._dataController.load();
        break;
      case 'grouped':
        this._clearSelectedItems();
        this._initEditStrategy();
        super._optionChanged(args);
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
        super._optionChanged(args);
    }
  }

  selectAll() {
    return this._selection.selectAll(this._isPageSelectAll());
  }

  unselectAll() {
    return this._selection.deselectAll(this._isPageSelectAll());
  }

  isSelectAll() {
    return this._selection.getSelectAllState(this._isPageSelectAll());
  }

  getFlatIndexByItemElement(itemElement) {
    return this._itemElements().index(itemElement);
  }

  getItemElementByFlatIndex(flatIndex) {
    const $itemElements = this._itemElements();

    if (flatIndex < 0 || flatIndex >= $itemElements.length) {
      return $();
    }

    return $itemElements.eq(flatIndex);
  }

  getItemByIndex(index) {
    return this._editStrategy.getItemDataByIndex(index);
  }

  deleteItem(itemElement) {
    const editStrategy = this._editStrategy;
    const deletingElementIndex = editStrategy.getNormalizedIndex(itemElement);
    const { focusedElement, focusStateEnabled } = this.option();
    // @ts-expect-error ts-error
    const focusedItemIndex = focusedElement ? editStrategy.getNormalizedIndex(focusedElement) : deletingElementIndex;
    const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();
    const nextFocusedItem = isLastIndexFocused || deletingElementIndex < focusedItemIndex
      ? focusedItemIndex - 1
      : focusedItemIndex;
    const promise = super.deleteItem(itemElement);

    return promise.done(function () {
      if (focusStateEnabled) {
        this.focusListItem(nextFocusedItem);
      }
    });
  }
}

export default ListEdit;
