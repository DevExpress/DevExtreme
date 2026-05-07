// eslint-disable-next-line @stylistic/max-len
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars,max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import {
  addNamespace,
  isCommandKeyPressed,
} from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  getInnerHeight,
  getInnerWidth,
  getOuterHeight,
  getOuterWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import ScrollView from '@js/ui/scroll_view';
import type { CollectionWidgetEditProperties, SelectOption } from '@ts/ui/collection/collection_widget.edit';
import Selection from '@ts/ui/selection/selection';

const FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS = 'dx-filemanager-thumbnails-view-port';
const FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS = 'dx-filemanager-thumbnails-container';
const FILE_MANAGER_THUMBNAILS_ITEM_CLASS = 'dx-filemanager-thumbnails-item';
const FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS = 'dx-filemanager-thumbnails-item-name';
const FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS = 'dx-filemanager-thumbnails-item-spacer';

const FILE_MANAGER_THUMBNAILS_ITEM_DATA_KEY = 'dxFileManagerItemData';

const FILE_MANAGER_THUMBNAILS_LIST_BOX_NAMESPACE = 'dxFileManagerThumbnailsListBox';
const FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME = addNamespace(
  holdEvent.name,
  FILE_MANAGER_THUMBNAILS_LIST_BOX_NAMESPACE,
);

class ListBoxLayoutUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _layoutModel?: any;

  _scrollView: ScrollView;

  _$viewPort: dxElementWrapper;

  _$itemContainer: dxElementWrapper;

  _$item: dxElementWrapper;

  constructor(scrollView, $viewPort, $itemContainer, $item) {
    this._layoutModel = null;
    this._scrollView = scrollView;
    this._$viewPort = $viewPort;
    this._$itemContainer = $itemContainer;
    this._$item = $item;
  }

  updateItems($item): void {
    this._$item = $item;
  }

  reset(): void {
    this._layoutModel = null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getLayoutModel() {
    if (!this._layoutModel) {
      this._layoutModel = this._createLayoutModel();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._layoutModel;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createLayoutModel() {
    if (!this._$item) {
      return null;
    }

    const itemWidth = getOuterWidth(this._$item, true);
    if (itemWidth === 0) {
      return null;
    }

    const itemHeight = getOuterHeight(this._$item, true);

    const viewPortWidth = getInnerWidth(this._$itemContainer);
    const viewPortHeight = getInnerHeight(this._$viewPort);
    const viewPortScrollTop = this._scrollView.scrollTop();
    const viewPortScrollBottom = viewPortScrollTop + viewPortHeight;

    const itemPerRowCount = Math.floor(viewPortWidth / itemWidth);
    const rowPerPageRate = viewPortHeight / itemHeight;

    return {
      itemWidth,
      itemHeight,
      viewPortWidth,
      viewPortHeight,
      viewPortScrollTop,
      viewPortScrollBottom,
      itemPerRowCount,
      rowPerPageRate,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createItemLayoutModel(index) {
    const layout = this.getLayoutModel();
    if (!layout) {
      return null;
    }

    const itemRowIndex = Math.floor(index / layout.itemPerRowCount);
    const itemColumnIndex = index % layout.itemPerRowCount;
    const itemTop = itemRowIndex * layout.itemHeight;
    const itemBottom = itemTop + layout.itemHeight;

    return {
      itemRowIndex,
      itemColumnIndex,
      itemTop,
      itemBottom,
    };
  }

  scrollToItem(index): void {
    const layout = this.getLayoutModel();
    if (!layout) {
      return;
    }

    const itemRowIndex = Math.floor(index / layout.itemPerRowCount);
    const itemTop = itemRowIndex * layout.itemHeight;
    const itemBottom = itemTop + layout.itemHeight;

    let newScrollTop = layout.viewPortScrollTop;

    if (itemTop < layout.viewPortScrollTop) {
      newScrollTop = itemTop;
    } else if (itemBottom > layout.viewPortScrollBottom) {
      newScrollTop = itemBottom - layout.viewPortHeight;
    }

    this._scrollView.scrollTo(newScrollTop);
  }
}

interface FileManagerThumbnailListBoxOptions extends
  CollectionWidgetEditProperties<FileManagerThumbnailListBox> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemThumbnailTemplate?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTooltipText?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemEnterKeyPressed?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocusedItemChanged?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focusedItemKey?: any;
}

class FileManagerThumbnailListBox extends CollectionWidget<FileManagerThumbnailListBoxOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _actions!: any;

  _lockFocusedItemProcessing?: boolean;

  onFocusedItemChanged?: () => void;

  _layoutUtils?: ListBoxLayoutUtils;

  _scrollView?: ScrollView;

  _$scrollView!: dxElementWrapper;

  _$itemContainer!: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _itemThumbnailTemplate?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getTooltipText?: any;

  _isPreserveSelectionMode?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _syncFocusedItemKeyDeferred?: DeferredObj<any> | null;

  _initMarkup(): void {
    this._initActions();

    this._lockFocusedItemProcessing = false;

    this.$element().addClass(FILE_MANAGER_THUMBNAILS_VIEW_PORT_CLASS);

    this._renderScrollView();
    this._renderItemsContainer();

    this._createScrollViewControl();

    super._initMarkup();

    this.onFocusedItemChanged = this._onFocusedItemChanged.bind(this);
    this._layoutUtils = new ListBoxLayoutUtils(
      this._scrollView,
      this.$element(),
      this._$itemContainer,
      this.itemElements().first(),
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._syncFocusedItemKey();
  }

  _initActions(): void {
    this._actions = {
      onItemEnterKeyPressed: this._createActionByOption(
        'onItemEnterKeyPressed',
      ),
      onFocusedItemChanged: this._createActionByOption('onFocusedItemChanged'),
    };
  }

  _initTemplates(): void {
    super._initTemplates();
    const { itemThumbnailTemplate, getTooltipText } = this.option();
    this._itemThumbnailTemplate = itemThumbnailTemplate;
    this._getTooltipText = getTooltipText;
    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(
        ($container, data, itemModel): void => {
          const $itemElement = this._getDefaultItemTemplate(
            itemModel,
            $container,
          );
          $container.append($itemElement);
        },
        ['fileItem'],
        this.option('integrationOptions.watchMethod'),
      ),
    });
  }

  _createScrollViewControl(): void {
    if (!this._scrollView) {
      this._scrollView = this._createComponent(this._$scrollView, ScrollView, {
        scrollByContent: true,
        scrollByThumb: true,
        useKeyboard: false,
        showScrollbar: 'onHover',
      });
    }
  }

  _renderScrollView(): void {
    if (!this._$scrollView) {
      this._$scrollView = $('<div>').appendTo(this.$element());
    }
  }

  getScrollable(): ScrollView | undefined {
    return this._scrollView;
  }

  _renderItemsContainer(): void {
    if (!this._$itemContainer) {
      this._$itemContainer = $('<div>')
        .addClass(FILE_MANAGER_THUMBNAILS_ITEM_LIST_CONTAINER_CLASS)
        .appendTo(this._$scrollView);
    }
  }

  _render(): void {
    super._render();

    this._detachEventHandlers();
    this._attachEventHandlers();
  }

  _clean(): void {
    this._detachEventHandlers();
    super._clean();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _supportedKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._supportedKeys(), {
      upArrow(e): void {
        this._beforeKeyProcessing(e);
        this._processArrowKeys(-1, false, e);
      },
      downArrow(e): void {
        this._beforeKeyProcessing(e);
        this._processArrowKeys(1, false, e);
      },
      home(e): void {
        this._beforeKeyProcessing(e);
        this._processHomeEndKeys(0, true, e);
      },
      end(e): void {
        this._beforeKeyProcessing(e);
        this._processHomeEndKeys(this._getItemsLength() - 1, true, e);
      },
      pageUp(e): void {
        this._beforeKeyProcessing(e);
        this._processPageChange(true, e);
      },
      pageDown(e): void {
        this._beforeKeyProcessing(e);
        this._processPageChange(false, e);
      },
      enter(e): void {
        this._beforeKeyProcessing(e);
        this._actions.onItemEnterKeyPressed(this._getFocusedItem());
      },
      A(e): void {
        this._beforeKeyProcessing(e);
        if (isCommandKeyPressed(e)) {
          this.selectAll();
        }
      },
    });
  }

  _beforeKeyProcessing(e): void {
    e.preventDefault();
    this._layoutUtils?.reset();
  }

  _processArrowKeys(offset, horizontal, eventArgs): void {
    const item = this._getFocusedItem();
    if (item) {
      if (!horizontal) {
        const layout = this._layoutUtils?.getLayoutModel();
        if (!layout) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        offset *= layout.itemPerRowCount;
      }

      const newItemIndex = this._getIndexByItem(item) + offset;
      this._focusItemByIndex(newItemIndex, true, eventArgs);
    }
  }

  _processHomeEndKeys(index, scrollToItem, eventArgs): void {
    this._focusItemByIndex(index, scrollToItem, eventArgs);
  }

  _processPageChange(pageUp, eventArgs): void {
    const item = this._getFocusedItem();
    if (!item) {
      return;
    }

    const layout = this._layoutUtils?.getLayoutModel();
    if (!layout) {
      return;
    }

    const itemLayout = this._layoutUtils?.createItemLayoutModel(
      this._getIndexByItem(item),
    );

    const rowOffset = pageUp ? layout.rowPerPageRate : -layout.rowPerPageRate;
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    const newRowRate = itemLayout?.itemRowIndex - rowOffset;
    const roundFunc = pageUp ? Math.ceil : Math.floor;
    const newRowIndex = roundFunc(newRowRate);
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    let newItemIndex = newRowIndex * layout.itemPerRowCount + itemLayout?.itemColumnIndex;
    if (newItemIndex < 0) {
      newItemIndex = 0;
    } else if (newItemIndex >= this._getItemsLength()) {
      newItemIndex = this._getItemsLength() - 1;
    }

    this._focusItemByIndex(newItemIndex, true, eventArgs);
  }

  _processLongTap(e): void {
    const $targetItem = this._closestItemElement($(e.target));
    const itemIndex = this._getIndexByItemElement($targetItem);
    this._selection.changeItemSelection(itemIndex, { control: true });
  }

  _attachEventHandlers(): void {
    const { selectionMode } = this.option();
    if (selectionMode === 'multiple') {
      eventsEngine.on(
        this._itemContainer(),
        FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME,
        `.${this._itemContentClass()}`,
        (e) => {
          this._processLongTap(e);
          e.stopPropagation();
        },
      );
    }
    eventsEngine.on(this._itemContainer(), 'mousedown selectstart', (e) => {
      if (e.shiftKey) {
        e.preventDefault();
      }
    });
  }

  _detachEventHandlers(): void {
    eventsEngine.off(
      this._itemContainer(),
      FILE_MANAGER_THUMBNAILS_LIST_BOX_HOLD_EVENT_NAME,
    );
    eventsEngine.off(this._itemContainer(), 'mousedown selectstart');
  }

  _itemContainer(): dxElementWrapper {
    return this._$itemContainer;
  }

  _itemClass(): string {
    return FILE_MANAGER_THUMBNAILS_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return FILE_MANAGER_THUMBNAILS_ITEM_DATA_KEY;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultItemTemplate(fileItemInfo, $itemElement) {
    $itemElement.attr('title', this._getTooltipText(fileItemInfo));

    const $itemThumbnail = this._itemThumbnailTemplate(fileItemInfo);

    const $itemSpacer = $('<div>').addClass(
      FILE_MANAGER_THUMBNAILS_ITEM_SPACER_CLASS,
    );

    const $itemName = $('<div>')
      .addClass(FILE_MANAGER_THUMBNAILS_ITEM_NAME_CLASS)
      .text(fileItemInfo.fileItem.name);

    $itemElement.append($itemThumbnail, $itemSpacer, $itemName);
  }

  _itemSelectHandler(e): void {
    let options = {};
    const { selectionMode } = this.option();
    if (selectionMode === 'multiple') {
      if (!this._isPreserveSelectionMode) {
        this._isPreserveSelectionMode = isCommandKeyPressed(e) || e.shiftKey;
      }
      options = {
        control: this._isPreserveSelectionMode,
        shift: e.shiftKey,
      };
    }
    const index = this._getIndexByItemElement(e.currentTarget);
    this._selection.changeItemSelection(index, options);
  }

  _initSelectionModule(): void {
    super._initSelectionModule();

    const options = extend(this._selection.options, {
      selectedKeys: this.option('selectedItemKeys'),
      onSelectionChanged: (args) => {
        this.option(
          'selectedItems',
          this._getItemsByKeys(args.selectedItemKeys, args.selectedItems),
        );
        this._updateSelectedItems(args);
      },
    });

    this._selection = new Selection(options);
  }

  _updateSelectedItems(args): void {
    const { addedItemKeys, removedItemKeys } = args;

    if (this._rendered && (addedItemKeys.length || removedItemKeys.length)) {
      if (!this._rendering) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addedSelection: any[] = [];
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let normalizedIndex;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const removedSelection: any[] = [];

        this._editStrategy.beginCache();

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < removedItemKeys.length; i += 1) {
          normalizedIndex = this._getIndexByKey(removedItemKeys[i]);
          removedSelection.push(normalizedIndex);
          this._removeSelection(normalizedIndex);
        }

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < addedItemKeys.length; i += 1) {
          normalizedIndex = this._getIndexByKey(addedItemKeys[i]);
          addedSelection.push(normalizedIndex);
          this._addSelection(normalizedIndex);
        }

        this._editStrategy.endCache();

        this._updateSelection(addedSelection, removedSelection);
      }

      this._fireSelectionChangeEvent(args);
    }
  }

  _fireSelectionChangeEvent(args): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })(args);
  }

  _updateSelection(addedSelection, removedSelection): void {
    const selectedItemsCount = this.getSelectedItems().length;
    if (selectedItemsCount === 0) {
      this._isPreserveSelectionMode = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _normalizeSelectedItems() {
    const { selectedItems } = this.option();
    // @ts-expect-error ts-error
    const newKeys = this._getKeysByItems(selectedItems);
    const oldKeys = this._selection.getSelectedItemKeys();
    if (!this._compareKeys(oldKeys, newKeys)) {
      this._selection.setSelection(newKeys);
    }

    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new Deferred().resolve().promise();
  }

  _focusOutHandler(): void {}

  _focusInHandler(): void {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getItems(): any[] {
    const { items } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return items || [];
  }

  _getItemsLength(): number {
    return this._getItems().length;
  }

  _getIndexByItemElement(itemElement): number {
    return this._editStrategy.getNormalizedIndex(itemElement);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemByIndex(index: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getItems()[index];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFocusedItem() {
    const { focusedElement } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getItemByItemElement(focusedElement);
  }

  _focusItem(item, scrollToItem): void {
    this.option('focusedElement', this.getItemElementByItem(item));
    if (scrollToItem) {
      this._layoutUtils?.scrollToItem(this._getIndexByItem(item));
    }
  }

  _focusItemByIndex(index, scrollToItem, eventArgs): void {
    if (index >= 0 && index < this._getItemsLength()) {
      const item = this._getItemByIndex(index);
      // @ts-expect-error ts-error
      this._focusItem(item, scrollToItem, eventArgs);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _syncFocusedItemKey() {
    if (!this._syncFocusedItemKeyDeferred) {
      // @ts-expect-error
      this._syncFocusedItemKeyDeferred = new Deferred();
    }

    const deferred = this._syncFocusedItemKeyDeferred;

    // @ts-expect-error
    if (this._dataSource?.isLoading()) {
      return deferred?.promise();
    }

    const focusedItemKey = this.option('focusedItemKey');
    if (isDefined(focusedItemKey)) {
      const { items } = this.option();
      const focusedItem = items?.find(
        (item) => this.keyOf(item) === focusedItemKey,
      );
      if (focusedItem) {
        this._focusItem(focusedItem, true);
        deferred?.resolve();
      } else {
        this.option('focusedItemKey', undefined);
        deferred?.reject();
      }
    } else {
      deferred?.resolve();
    }

    this._syncFocusedItemKeyDeferred = null;
    return deferred?.promise();
  }

  _onFocusedItemChanged(): void {
    const focusedItem = this._getFocusedItem();
    const newFocusedItemKey = this.keyOf(focusedItem);
    const { focusedItemKey } = this.option();
    if (newFocusedItemKey !== focusedItemKey) {
      this._lockFocusedItemProcessing = true;
      this.option('focusedItemKey', newFocusedItemKey);
      this._lockFocusedItemProcessing = false;
      this._raiseFocusedItemChanged(focusedItem);
    }
  }

  _raiseFocusedItemChanged(focusedItem): void {
    const { focusedElement } = this.option();
    const args = {
      item: focusedItem,
      itemElement: focusedElement,
    };
    this._actions.onFocusedItemChanged(args);
  }

  _changeItemSelection(item, select): void {
    if (this.isItemSelected(item) === select) {
      return;
    }
    const itemElement = this.getItemElementByItem(item);
    const index = this._getIndexByItemElement(itemElement);
    this._selection.changeItemSelection(index, {
      control: this._isPreserveSelectionMode,
    });
  }

  _chooseSelectOption(): SelectOption {
    return 'selectedItemKeys';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSelectedItems() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._selection.getSelectedItems();
  }

  getItemElementByItem(item): dxElementWrapper {
    return this._editStrategy.getItemElement(item);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemByItemElement(itemElement) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getItemByIndex(this._getIndexByItemElement(itemElement));
  }

  selectAll(): void {
    const { selectionMode } = this.option();
    if (selectionMode !== 'multiple') return;

    // @ts-expect-error ts-error
    this._selection.selectAll();
    this._isPreserveSelectionMode = true;
  }

  selectItem(item): void {
    this._changeItemSelection(item, true);
  }

  deselectItem(item): void {
    this._changeItemSelection(item, false);
  }

  clearSelection(): void {
    // @ts-expect-error ts-error
    this._selection.deselectAll();
  }

  _optionChanged(args): void {
    const { name, value } = args;

    switch (name) {
      case 'items':
        if (this._layoutUtils) {
          this._layoutUtils.updateItems(this.itemElements().first());
        }
        super._optionChanged(args);
        break;
      case 'focusedItemKey':
        if (this._lockFocusedItemProcessing) {
          break;
        }

        if (isDefined(value)) {
          // @ts-expect-error ts-error
          this._syncFocusedItemKey()?.done((): void => {
            const focusedItem = this._getFocusedItem();
            this._raiseFocusedItemChanged(focusedItem);
          });
        } else {
          this.option('focusedElement', null);
          this._raiseFocusedItemChanged(null);
        }

        break;
      case 'onItemEnterKeyPressed':
      case 'onFocusedItemChanged':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default FileManagerThumbnailListBox;
