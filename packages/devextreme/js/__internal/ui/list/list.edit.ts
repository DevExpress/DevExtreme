import { isTouchEvent } from '@js/common/core/events/utils';
import localizationMessage from '@js/common/core/localization/message';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DxEvent } from '@js/events';
import type {
  Item,
} from '@js/ui/list';
import { isNumeric, isObject } from '@ts/core/utils/m_type';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import { NOT_EXISTING_INDEX } from '@ts/ui/collection/collection_widget.edit';
import type { CollectionItemIndex } from '@ts/ui/collection/collection_widget.edit.strategy';
import type PlainEditStrategy from '@ts/ui/collection/collection_widget.edit.strategy.plain';
import type { CachedItem } from '@ts/ui/collection/collection_widget.live_update';
import { PRIVATE_KEY_FIELD } from '@ts/ui/collection/collection_widget.live_update';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import { ListBase } from '@ts/ui/list/list.base';
import EditProvider from '@ts/ui/list/list.edit.provider';
import GroupedEditStrategy from '@ts/ui/list/list.edit.strategy.grouped';

const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const LIST_ITEM_RESPONSE_WAIT_CLASS = 'dx-list-item-response-wait';

type DxEventHandledByEditProvider = DxEvent & {
  handledByEditProvider?: boolean;
};

class ListEdit extends ListBase {
  _editStrategy!: PlainEditStrategy<Item> | GroupedEditStrategy;

  _editProvider!: EditProvider;

  _supportedKeys(): SupportedKeys {
    const parent = super._supportedKeys();

    const deleteFocusedItem = (e: KeyboardEvent): void => {
      const { allowItemDeleting, focusedElement } = this.option();
      if (allowItemDeleting && focusedElement) {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.deleteItem(focusedElement);
      }
    };

    const moveFocusedItem = (e: DxEvent<KeyboardEvent>, moveUp?: boolean): void => {
      const { focusedElement, itemDragging, grouped } = this.option();

      const editStrategy = this._editStrategy;
      // @ts-expect-error ts-error
      const focusedItemIndex = editStrategy.getNormalizedIndex(focusedElement);
      const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();
      if (isLastIndexFocused && this._dataController.isLoading()) {
        return;
      }

      if (e.shiftKey && itemDragging?.allowReordering) {
        if (focusedItemIndex === NOT_EXISTING_INDEX) {
          return;
        }

        const nextItemIndex = focusedItemIndex + (moveUp ? -1 : 1);

        if (nextItemIndex < 0) {
          return;
        }

        const $nextItem = editStrategy.getItemElement(nextItemIndex);

        if (!$nextItem?.length) {
          return;
        }

        const isMoveFromGroup = grouped
          && $(focusedElement).parent().get(0) !== $nextItem.parent().get(0);
        if (!isMoveFromGroup) {
          this.reorderItem($(focusedElement).get(0), $nextItem.get(0));
          this.scrollToItem($(focusedElement));
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

    const enter = (e: DxEvent<KeyboardEvent>): void => {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.enter.apply(this, [e]);
      }
    };

    const space = (e: DxEvent<KeyboardEvent>): void => {
      if (!this._editProvider.handleEnterPressing(e)) {
        parent.space.apply(this, [e]);
      }
    };

    return {
      ...parent,
      del: deleteFocusedItem,
      upArrow: (e: DxEvent<KeyboardEvent>): void => moveFocusedItem(e, true),
      downArrow: (e: DxEvent<KeyboardEvent>): void => moveFocusedItem(e),
      enter,
      space,
    };
  }

  _updateSelection(): void {
    this._editProvider.afterItemsRendered();
    super._updateSelection();
  }

  _getLastItemIndex(): number {
    return this._itemElements().length - 1;
  }

  _refreshItemElements(): void {
    super._refreshItemElements();

    const excludedSelectors = this._editProvider.getExcludedItemSelectors();

    if (excludedSelectors.length) {
      this._itemElementsCache = this._itemElementsCache.not(excludedSelectors);
    }
  }

  _isItemStrictEquals(item1: CachedItem<Item>, item2: CachedItem<Item>): boolean {
    const privateKey = item1?.[PRIVATE_KEY_FIELD];
    if (privateKey && !this.key() && this._selection.isItemSelected(privateKey)) {
      return false;
    }

    return super._isItemStrictEquals(item1, item2);
  }

  _getDefaultOptions(): ListBaseProperties {
    return {
      ...super._getDefaultOptions(),
      showSelectionControls: false,
      selectionMode: 'none',
      selectAllMode: 'page',
      // @ts-expect-error ts-error
      onSelectAllValueChanged: null,
      selectAllText: localizationMessage.format('dxList-selectAll'),
      menuItems: [],
      menuMode: 'context',
      allowItemDeleting: false,
      itemDeleteMode: 'static',
      itemDragging: {},
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<ListBaseProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device: (device): boolean => device.platform === 'ios',
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

  _init(): void {
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
    const { grouped } = this.option();

    if (grouped) {
      this._editStrategy = new GroupedEditStrategy(this);
    } else {
      super._initEditStrategy();
    }
  }

  _initMarkup(): void {
    this._refreshEditProvider();
    super._initMarkup();
  }

  _renderItems(items: Item[]): void {
    super._renderItems(items);
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
    const label = this._displayGetter?.(itemData) ?? itemData?.text ?? itemData;

    this.setAria(
      'label',
      isObject(label) ? localizationMessage.format('dxList-listAriaLabel-itemContent') : label,
      $itemFrame,
    );
  }

  _selectedItemClass(): string {
    return LIST_ITEM_SELECTED_CLASS;
  }

  _itemResponseWaitClass(): string {
    return LIST_ITEM_RESPONSE_WAIT_CLASS;
  }

  _itemClickHandler(
    e: DxEvent,
    args?: Record<string, unknown>,
    config?: ActionConfig,
  ): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = this._editProvider.handleClick($itemElement, e);
    if (handledByEditProvider) {
      return;
    }
    this._saveSelectionChangeEvent(e);
    super._itemClickHandler(e, args, config);
  }

  _shouldFireContextMenuEvent(): boolean {
    return super._shouldFireContextMenuEvent() || this._editProvider.contextMenuHandlerExists();
  }

  _itemHoldHandler(e: DxEventHandledByEditProvider): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = isTouchEvent(e)
      && this._editProvider.handleContextMenu($itemElement, e);
    if (handledByEditProvider) {
      e.handledByEditProvider = true;
      return;
    }
    super._itemHoldHandler(e);
  }

  _itemContextMenuHandler(e: DxEventHandledByEditProvider): void {
    const $itemElement = $(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    const handledByEditProvider = !e.handledByEditProvider
      && this._editProvider.handleContextMenu($itemElement, e);
    if (handledByEditProvider) {
      e.preventDefault();
      return;
    }
    super._itemContextMenuHandler(e);
  }

  _postprocessRenderItem(args: PostprocessRenderItemInfo<Item>): void {
    super._postprocessRenderItem(args);
    this._editProvider.modifyItemElement(args);
  }

  _clean(): void {
    this._disposeEditProvider();
    super._clean();
  }

  focusListItem(index: number): void {
    const $item = this._editStrategy.getItemElement(index);

    this.option('focusedElement', getPublicElement($item));
    this.focus();
    this.scrollToItem($item);
  }

  _getFlatIndex(): number {
    const { selectedIndex = NOT_EXISTING_INDEX } = this.option();

    if (isNumeric(selectedIndex) || !selectedIndex) {
      return selectedIndex;
    }

    const $item = this._editStrategy.getItemElement(selectedIndex);
    return this.getFlatIndexByItemElement($item);
  }

  _optionChanged(args: OptionChanged<ListBaseProperties>): void {
    const { name } = args;

    switch (name) {
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

  selectAll(): DeferredObj<unknown> {
    return this._selection.selectAll(this._isPageSelectAll());
  }

  unselectAll(): DeferredObj<unknown> {
    return this._selection.deselectAll(this._isPageSelectAll());
  }

  isSelectAll(): boolean | undefined {
    return this._selection.getSelectAllState(this._isPageSelectAll());
  }

  getFlatIndexByItemElement(itemElement: dxElementWrapper): number {
    return this._itemElements().index(itemElement);
  }

  getItemElementByFlatIndex(flatIndex: number): dxElementWrapper {
    const $itemElements = this._itemElements();

    if (flatIndex < 0 || flatIndex >= $itemElements.length) {
      return $();
    }

    return $itemElements.eq(flatIndex);
  }

  getItemByIndex(index: number): Item {
    return this._editStrategy.getItemDataByIndex(index);
  }

  deleteItem(itemElement: CollectionItemIndex | Element): Promise<unknown> {
    const editStrategy = this._editStrategy;
    const deletingElementIndex = editStrategy.getNormalizedIndex(itemElement);
    const { focusedElement, focusStateEnabled } = this.option();
    const focusedItemIndex = focusedElement
      ? editStrategy.getNormalizedIndex(focusedElement)
      : deletingElementIndex;
    const isLastIndexFocused = focusedItemIndex === this._getLastItemIndex();
    const nextFocusedItem = isLastIndexFocused || deletingElementIndex < focusedItemIndex
      ? focusedItemIndex - 1
      : focusedItemIndex;
    const promise = super.deleteItem(itemElement);

    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return promise.done(() => {
      if (focusStateEnabled) {
        this.focusListItem(nextFocusedItem);
      }
    });
  }
}

export default ListEdit;
