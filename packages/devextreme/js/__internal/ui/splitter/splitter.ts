// eslint-disable-next-line max-classes-per-file
import type { Orientation } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getOuterHeight,
  getOuterWidth,
} from '@js/core/utils/size';
import { isDefined, isObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import { lock } from '@js/events/core/emitter.feedback';
import CollectionWidgetItem from '@js/ui/collection/item';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import type {
  Item,
  ItemCollapsedEvent,
  ItemExpandedEvent,
  Properties,
  ResizeEndEvent,
  ResizeEvent,
  ResizeStartEvent,
} from '@js/ui/splitter';

import ResizeHandle, { RESIZE_HANDLE_CLASS } from './resize_handle';
import { getComponentInstance } from './utils/component';
import {
  getActionNameByEventName,
  ITEM_COLLAPSED_EVENT,
  ITEM_EXPANDED_EVENT,
  RESIZE_EVENT,
} from './utils/event';
import {
  calculateDelta,
  convertSizeToRatio,
  findIndexOfNextVisibleItem,
  findLastIndexOfVisibleItem,
  getElementSize,
  getNextLayout,
  isElementVisible,
  setFlexProp,
} from './utils/layout';
import { getDefaultLayout } from './utils/layout_default';
import type {
  FlexProperty, InteractionEvent, RenderQueueItem, ResizeEvents, ResizeHandleOptions,
} from './utils/types';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_HIDDEN_CONTENT_CLASS = 'dx-splitter-item-hidden-content';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const DEFAULT_RESIZE_HANDLE_SIZE = 8;

const FLEX_PROPERTY: Record<string, FlexProperty> = {
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexBasis: 'flexBasis',
};

const DEFAULT_FLEX_SHRINK_PROP = 0;
const DEFAULT_FLEX_BASIS_PROP = 0;

const ORIENTATION: Record<string, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SplitterItem extends (CollectionWidgetItem as any) {
  constructor($element, options, rawData) {
    options._id = `dx_${new Guid()}`;

    super($element, options, rawData);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get owner(): Splitter {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.owner;
  }

  get resizeHandle(): ResizeHandle {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options._resizeHandle;
  }

  get option(): SplitterItem {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._rawData;
  }

  get index(): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.owner._getIndexByItemData(this.option);
  }

  _render(): void {
    super._render();
  }

  _renderResizeHandle(): void {
    if (this.option.visible !== false && !this.isLast()) {
      this._setIdAttr();
      const config = this.owner._getResizeHandleConfig(this._options._id);
      this._options._resizeHandle = this.owner._createComponent($('<div>'), ResizeHandle, config);

      this.resizeHandle.$element().insertAfter(this._$element);
    }
  }

  _setIdAttr(): void {
    this._$element.attr('id', this._options._id);
  }

  isLast(): boolean {
    return this.owner._isLastVisibleItem(this.index);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Splitter extends (CollectionWidget as any) {
  private _renderQueue: RenderQueueItem[] = [];

  _getDefaultOptions(): Properties {
    return extend(super._getDefaultOptions(), {
      orientation: ORIENTATION.horizontal,
      onItemCollapsed: null,
      onItemExpanded: null,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      allowKeyboardNavigation: true,
      separatorSize: DEFAULT_RESIZE_HANDLE_SIZE,

      _itemAttributes: { role: 'group' },
      _renderQueue: undefined,
    }) as Properties;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemClass(): string {
    return SPLITTER_ITEM_CLASS;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemDataKey(): string {
    return SPLITTER_ITEM_DATA_KEY;
  }

  _init(): void {
    super._init();

    this._initializeRenderQueue();
  }

  _initializeRenderQueue(): void {
    this._renderQueue = this.option('_renderQueue') || [];
  }

  _isRenderQueueEmpty(): boolean {
    return this._renderQueue.length <= 0;
  }

  _pushItemToRenderQueue(
    itemContent: Element,
    splitterConfig: Properties,
  ): void {
    this._renderQueue.push({ itemContent, splitterConfig });
  }

  _shiftItemFromQueue(): RenderQueueItem | undefined {
    return this._renderQueue.shift();
  }

  _initMarkup(): void {
    this.$element().addClass(SPLITTER_CLASS);

    this._toggleOrientationClass();

    super._initMarkup();

    this._panesCacheSize = {};
    this._attachResizeObserverSubscription();
  }

  _getItemDimension(element: Element): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._isHorizontalOrientation()
      ? getOuterWidth(element) : getOuterHeight(element);
  }

  _render(): void {
    super._render();
  }

  _attachResizeObserverSubscription(): void {
    if (hasWindow()) {
      const formRootElement = this.$element().get(0);

      resizeObserverSingleton.unobserve(formRootElement);
      resizeObserverSingleton.observe(formRootElement, () => { this._resizeHandler(); });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _attachHoldEvent(): void {}

  _resizeHandler(): void {
    if (!this._shouldRecalculateLayout) {
      return;
    }

    this._layout = this._getDefaultLayoutBasedOnSize();

    this._applyStylesFromLayout(this._layout);
    this._updateItemSizes();

    this._shouldRecalculateLayout = false;
  }

  _renderItems(items: Item[]): void {
    super._renderItems(items);

    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();

    if (isElementVisible(this.$element().get(0))) {
      this._layout = this._getDefaultLayoutBasedOnSize();
      this._applyStylesFromLayout(this._layout);

      this._updateItemSizes();
    } else {
      this._shouldRecalculateLayout = true;
    }

    this._processRenderQueue();
  }

  _processRenderQueue(): void {
    if (this._isRenderQueueEmpty()) {
      return;
    }

    const item = this._shiftItemFromQueue();
    if (!item) return;

    this._createComponent($(item.itemContent), Splitter, extend({
      itemTemplate: this.option('itemTemplate'),
      onResize: this.option('onResize'),
      onResizeStart: this.option('onResizeStart'),
      onResizeEnd: this.option('onResizeEnd'),
      onItemClick: this.option('onItemClick'),
      onItemContextMenu: this.option('onItemContextMenu'),
      onItemRendered: this.option('onItemRendered'),
      onItemExpanded: this.option('onItemExpanded'),
      onItemCollapsed: this.option('onItemCollapsed'),
      separatorSize: this.option('separatorSize'),
      allowKeyboardNavigation: this.option('allowKeyboardNavigation'),
      rtlEnabled: this.option('rtlEnabled'),
      _renderQueue: this._renderQueue,
    }, item.splitterConfig));

    this._processRenderQueue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _itemElements(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemContainer().children(this._itemSelector());
  }

  _isLastVisibleItem(index: number): boolean {
    return index === findLastIndexOfVisibleItem(this.option('items'));
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): unknown {
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    const itemElement = $itemFrame.get(0);

    setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, 100 / this.option('items').length);
    setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);

    this._getItemInstance($itemFrame)._renderResizeHandle();

    return $itemFrame;
  }

  _getItemInstance($item: dxElementWrapper): SplitterItem {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Splitter.ItemClass.getInstance($item);
  }

  _renderResizeHandle($itemFrame: dxElementWrapper): void {
    const { resizeHandle } = this._getItemInstance($itemFrame);

    if (resizeHandle) {
      this.$element().append(resizeHandle.$element());
    }
  }

  _updateResizeHandlesResizableState(): void {
    this._getResizeHandles().forEach((resizeHandle) => {
      const $resizeHandle = resizeHandle.$element();

      const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      const $rightItem = this._getResizeHandleRightItem($resizeHandle);
      const leftItemData = this._getItemData($leftItem);
      const rightItemData = this._getItemData($rightItem);
      const resizable = leftItemData.resizable !== false
        && rightItemData.resizable !== false
        && leftItemData.collapsed !== true
        && rightItemData.collapsed !== true;

      resizeHandle.option('resizable', resizable);

      resizeHandle.option('disabled', resizeHandle.isInactive());
    });
  }

  _updateResizeHandlesCollapsibleState(): void {
    this._getResizeHandles().forEach((resizeHandle) => {
      const $resizeHandle = resizeHandle.$element();

      const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      const $rightItem = this._getResizeHandleRightItem($resizeHandle);
      const leftItemData = this._getItemData($leftItem);
      const rightItemData = this._getItemData($rightItem);

      const showCollapsePrev = rightItemData.collapsed === true
        ? rightItemData.collapsible === true && leftItemData.collapsed !== true
        : leftItemData.collapsible === true && leftItemData.collapsed !== true;

      const showCollapseNext = leftItemData.collapsed === true
        ? leftItemData.collapsible === true
        : rightItemData.collapsible === true && rightItemData.collapsed !== true;

      resizeHandle.option({ showCollapsePrev, showCollapseNext });

      resizeHandle.option('disabled', resizeHandle.isInactive());
    });
  }

  _updateNestedSplitterOption(optionName: string, optionValue: unknown): void {
    const { items } = this.option();

    items.forEach((item) => {
      if (item?.splitter) {
        const $nestedSplitter = this._findItemElementByItem(item).find(`.${SPLITTER_CLASS}`).eq(0);

        if ($nestedSplitter.length) {
          getComponentInstance($nestedSplitter).option(optionName, optionValue);
        }
      }
    });
  }

  _updateResizeHandlesOption(optionName: string, optionValue: unknown): void {
    this._getResizeHandles().forEach((resizeHandle) => {
      resizeHandle.option(optionName, optionValue);
    });
  }

  _getNextVisibleItemData(index: number): Item {
    const { items } = this.option();
    return this._getItemDataByIndex(findIndexOfNextVisibleItem(items, index));
  }

  _getItemDataByIndex(index: number): Item {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._editStrategy.getItemDataByIndex(index);
  }

  _createEventAction(eventName: string): void {
    const actionName = getActionNameByEventName(eventName);

    this[actionName] = this._createActionByOption(eventName, {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _getAction(eventName: ResizeEvents | 'onItemExpanded' | 'onItemCollapsed'): (e) => void {
    const actionName = getActionNameByEventName(eventName);

    if (!this[actionName]) {
      this._createEventAction(eventName);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this[actionName];
  }

  _getResizeHandleConfig(paneId: string): ResizeHandleOptions {
    const {
      orientation,
      rtlEnabled,
      allowKeyboardNavigation,
      separatorSize,
    } = this.option();

    return {
      direction: orientation,
      focusStateEnabled: allowKeyboardNavigation,
      hoverStateEnabled: true,
      separatorSize,
      elementAttr: {
        'aria-controls': paneId,
      },
      onCollapsePrev: (e: ItemCollapsedEvent | ItemExpandedEvent): void => {
        e.event?.stopPropagation();

        const $resizeHandle = $(e.element);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);

        const isRightItemCollapsed = rightItemData.collapsed === true;

        this._activeResizeHandleIndex = leftItemIndex;
        this._collapseButton = 'prev';

        if (isRightItemCollapsed) {
          this._collapsedItemSize = this._panesCacheSize[rightItemIndex];

          if (!this._collapsedItemSize) {
            for (let i = leftItemIndex; i >= 0; i -= 1) {
              // eslint-disable-next-line max-depth
              if (this.option('items')[i].collapsed !== true) {
                this._collapsedItemSize = this._layout[i] / 2;
              }
            }
          }

          this._panesCacheSize[rightItemIndex] = undefined;
          this._updateItemData('collapsed', rightItemIndex, false, false);

          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: rightItemData,
            itemElement: getPublicElement($rightItem),
            itemIndex: rightItemIndex,
          });

          return;
        }

        this._panesCacheSize[leftItemIndex] = this._layout[leftItemIndex];
        this._collapsedItemSize = this._layout[leftItemIndex];

        this._updateItemData('collapsed', leftItemIndex, true, false);

        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: leftItemData,
          itemElement: getPublicElement($leftItem),
          itemIndex: leftItemIndex,
        });
      },
      onCollapseNext: (e: ItemCollapsedEvent | ItemExpandedEvent): void => {
        e.event?.stopPropagation();

        const $resizeHandle = $(e.element);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData) as number;

        const isLeftItemCollapsed = leftItemData.collapsed === true;

        this._activeResizeHandleIndex = leftItemIndex;
        this._collapseButton = 'next';

        if (isLeftItemCollapsed) {
          this._collapsedItemSize = this._panesCacheSize[leftItemIndex];

          if (!this._collapsedItemSize) {
            for (let i = rightItemIndex; i <= this.option('items').length - 1; i += 1) {
              // eslint-disable-next-line max-depth
              if (this.option('items')[i].collapsed !== true) {
                this._collapsedItemSize = this._layout[i] / 2;
              }
            }
          }

          this._panesCacheSize[leftItemIndex] = undefined;

          this._updateItemData('collapsed', leftItemIndex, false, false);

          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: leftItemData,
            itemElement: getPublicElement($leftItem),
            itemIndex: leftItemIndex,
          });

          return;
        }

        this._panesCacheSize[rightItemIndex] = this._layout[rightItemIndex];
        this._collapsedItemSize = this._layout[rightItemIndex];

        this._updateItemData('collapsed', rightItemIndex, true, false);

        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: rightItemData,
          itemElement: getPublicElement($rightItem),
          itemIndex: rightItemIndex,
        });
      },
      onResizeStart: (e: ResizeStartEvent): void => {
        const { element, event } = e;

        if (!event) { return; }

        const $resizeHandle = $(element);

        const resizeStartEventsArgs = this._getResizeStartEventArgs(
          event,
          getPublicElement($resizeHandle),
        );

        this._getAction(RESIZE_EVENT.onResizeStart)(resizeStartEventsArgs);

        if (resizeStartEventsArgs.cancel) {
          // @ts-expect-error ts-error
          event.cancel = true;
          return;
        }

        // @ts-expect-error ts-error
        this._feedbackDeferred = new Deferred();
        lock(this._feedbackDeferred);
        this._toggleActiveState($resizeHandle, true);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        this._activeResizeHandleIndex = leftItemIndex;

        this._currentOnePxRatio = convertSizeToRatio(
          1,
          getElementSize(this.$element(), orientation),
          this._getResizeHandlesSize(),
        );

        this._currentLayout = this._layout;

        this._updateItemsRestrictions(this.option('items'));
      },
      onResize: (e: ResizeEvent): void => {
        const { element, event } = e;

        if (!event) { return; }

        const resizeEventsArgs = this._getResizeEventArgs(event, getPublicElement($(element)));

        this._getAction(RESIZE_EVENT.onResize)(resizeEventsArgs);

        if (resizeEventsArgs.cancel) {
          // @ts-expect-error ts-error
          event.cancel = true;
          return;
        }

        const newLayout = getNextLayout(
          this._currentLayout,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          calculateDelta((event as any).offset, this.option('orientation'), rtlEnabled, this._currentOnePxRatio),
          this._activeResizeHandleIndex,
          this._itemRestrictions,
        );

        this._applyStylesFromLayout(newLayout);
        this._layout = newLayout;
      },
      onResizeEnd: (e: ResizeEndEvent): void => {
        const { element, event } = e;

        if (!event) { return; }

        const $resizeHandle = $(element);

        const resizeEndEventsArgs = this._getResizeEndEventArgs(
          event,
          getPublicElement($resizeHandle),
        );

        this._getAction(RESIZE_EVENT.onResizeEnd)(resizeEndEventsArgs);

        if (resizeEndEventsArgs.cancel) {
          // @ts-expect-error ts-error
          event.cancel = true;
          return;
        }

        this._feedbackDeferred.resolve();
        this._toggleActiveState($resizeHandle, false);

        this._updateItemSizes();
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeStartEventArgs(event: InteractionEvent, handleElement: HTMLElement): ResizeStartEvent {
    return { event, handleElement } as ResizeStartEvent;
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeEventArgs(event: InteractionEvent, handleElement: HTMLElement): ResizeEvent {
    return { event, handleElement } as ResizeEvent;
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeEndEventArgs(event: InteractionEvent, handleElement: HTMLElement): ResizeEndEvent {
    return { event, handleElement } as ResizeEndEvent;
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeHandleLeftItem($resizeHandle: dxElementWrapper): dxElementWrapper {
    let $leftItem = $resizeHandle.prev();

    while ($leftItem.hasClass(INVISIBLE_STATE_CLASS)) {
      $leftItem = $leftItem.prev();
    }

    return $leftItem;
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeHandleRightItem($resizeHandle: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error renderer d.ts issue
    let $rightItem = $resizeHandle.next();

    while ($rightItem.hasClass(INVISIBLE_STATE_CLASS)) {
      // @ts-expect-error renderer d.ts issue
      $rightItem = $rightItem.next();
    }

    return $rightItem;
  }

  _getResizeHandlesSize(): number {
    return this._getResizeHandles().reduce(
      (size: number, resizeHandle: ResizeHandle) => size + resizeHandle.getSize(),
      0,
    );
  }

  _renderItemContent(args: unknown): unknown {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._renderItemContent(args);
  }

  _createItemByTemplate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    itemTemplate,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    args,
  ): unknown {
    const { itemData } = args;

    if (itemData.splitter) {
      return itemTemplate.source
        ? itemTemplate.source()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : ($ as any)();
    }

    return super._createItemByTemplate(itemTemplate, args);
  }

  _postprocessRenderItem(args: { itemData: Item; itemContent: Element }): void {
    const splitterConfig = args.itemData.splitter;
    if (!splitterConfig) {
      return;
    }

    this._pushItemToRenderQueue(args.itemContent, splitterConfig);
  }

  _isHorizontalOrientation(): boolean {
    return this.option('orientation') === ORIENTATION.horizontal;
  }

  _toggleOrientationClass(): void {
    this.$element().toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation());
    this.$element().toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  _itemOptionChanged(item: Item, property: unknown, value: unknown): void {
    switch (property) {
      case 'size':
      case 'maxSize':
      case 'minSize':
      case 'collapsedSize':
        this._layout = this._getDefaultLayoutBasedOnSize();

        this._applyStylesFromLayout(this._layout);
        this._updateItemSizes();
        break;
      case 'collapsed':
        this._itemCollapsedOptionChanged(item);
        break;
      case 'resizable':
        this._updateResizeHandlesResizableState();
        break;
      case 'collapsible':
        this._updateResizeHandlesCollapsibleState();
        break;
      case 'visible':
        this._invalidate();
        break;
      default:
        super._itemOptionChanged(item, property, value);
    }
  }

  _itemCollapsedOptionChanged(item: Item): void {
    this._updateItemsRestrictions(this.option('items'), true);

    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();

    if (isDefined(this._collapsedItemSize)) {
      this._layout = getNextLayout(
        this._layout,
        this._getCollapseDelta(item),
        this._activeResizeHandleIndex,
        this._itemRestrictions,
        true,
      );
    } else {
      this._layout = this._getDefaultLayoutBasedOnSize();
    }

    this._collapseButton = undefined;
    this._collapsedItemSize = undefined;

    this._applyStylesFromLayout(this._layout);
    this._updateItemSizes();
  }

  _getCollapseDelta(item: Item): number {
    const itemIndex = this._getIndexByItem(item);

    const { collapsedSize = 0, minSize = 0 } = this._itemRestrictions[itemIndex];

    const itemSize = this._collapsedItemSize !== undefined && this._collapsedItemSize >= minSize
      ? this._collapsedItemSize
      : minSize;

    const deltaSign = this._collapseButton === 'prev' ? -1 : 1;
    const delta = Math.abs(itemSize - collapsedSize) * deltaSign;

    return delta;
  }

  _getDefaultLayoutBasedOnSize(): number[] {
    const { items } = this.option();

    this._updateItemsRestrictions(items);

    return getDefaultLayout(this._itemRestrictions);
  }

  _updateItemsRestrictions(items: Item[], collapseStateRestrictions = false): void {
    const { orientation } = this.option();

    const handlesSizeSum = this._getResizeHandlesSize();
    const elementSize = getElementSize(this.$element(), orientation);

    this._itemRestrictions = [];

    items.forEach((item) => {
      this._itemRestrictions.push({
        resizable: collapseStateRestrictions ? undefined : item.resizable !== false,
        visible: item.visible !== false,
        collapsed: item.collapsed === true,
        collapsedSize: convertSizeToRatio(item.collapsedSize, elementSize, handlesSizeSum),
        size: convertSizeToRatio(item.size, elementSize, handlesSizeSum),
        maxSize: collapseStateRestrictions
          ? undefined
          : convertSizeToRatio(item.maxSize, elementSize, handlesSizeSum),
        minSize: convertSizeToRatio(item.minSize, elementSize, handlesSizeSum),
      });
    });
  }

  _applyStylesFromLayout(layout: number[]): void {
    this._iterateItems((index, itemElement) => {
      setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, layout[index]);

      const $item = $(itemElement);
      const itemSize = this._getItemDimension(itemElement);
      const itemData = this._getItemData($item);
      const shouldHideContent = itemSize === 0 && itemData.visible !== false;

      $item.toggleClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS, shouldHideContent);
    });
  }

  _updateItemSizes(): void {
    this._iterateItems((index, itemElement) => {
      this._updateItemData('size', index, this._getItemDimension(itemElement));
    });
  }

  _updateItemData(
    prop: 'size' | 'collapsed',
    itemIndex: number,
    value: unknown,
    silent = true,
  ): void {
    const itemPath = `items[${itemIndex}]`;
    const itemData = this.option(itemPath);

    if (isObject(itemData)) {
      this._updateItemOption(`${itemPath}.${prop}`, value, silent);
    } else {
      this._updateItemOption(itemPath, {
        text: itemData,
        [prop]: value,
      }, silent);
    }
  }

  _updateItemOption(path: string, value: unknown, silent = false): void {
    if (silent) {
      this._options.silent(path, value);
    } else {
      this.option(path, value);
    }
  }

  _iterateItems(callback: (index: number, itemElement: HTMLElement) => void): void {
    each(this._itemElements(), (index: number, itemElement: HTMLElement) => {
      callback(index, itemElement);
    });
  }

  _getResizeHandles(): ResizeHandle[] {
    const handles: ResizeHandle[] = [];

    this._iterateItems((index, itemElement) => {
      const instance = this._getItemInstance($(itemElement));

      if (instance.resizeHandle) {
        handles.push(instance.resizeHandle);
      }
    });

    return handles;
  }

  _getResizeHandleItems(): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$element().children(`.${RESIZE_HANDLE_CLASS}`);
  }

  _iterateResizeHandles(callback: (instance: ResizeHandle) => void): void {
    this._getResizeHandleItems().each((index, element) => {
      callback(getComponentInstance($(element)));

      return true;
    });
  }

  _dimensionChanged(): void {
    this._layout = this._getDefaultLayoutBasedOnSize();

    this._applyStylesFromLayout(this._layout);
    this._updateItemSizes();
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'width':
      case 'height':
        super._optionChanged(args);

        this._dimensionChanged();
        break;
      case 'allowKeyboardNavigation':
        this._iterateResizeHandles((instance) => {
          instance.option('focusStateEnabled', value);
        });
        this._updateNestedSplitterOption(name, value);
        break;
      case 'orientation':
        this._toggleOrientationClass();
        this._updateResizeHandlesOption('direction', value);
        break;
      case 'onResizeStart':
      case 'onResizeEnd':
      case 'onResize':
      case 'onItemCollapsed':
      case 'onItemExpanded':
        this._createEventAction(name);
        this._updateNestedSplitterOption(name, value);
        break;
      case 'separatorSize':
        this._updateResizeHandlesOption(name, value);
        this._updateNestedSplitterOption(name, value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  registerKeyHandler(key: string, handler: () => void): void {
    this.$element().find(`.${RESIZE_HANDLE_CLASS}`).each((index, element) => {
      getComponentInstance($(element)).registerKeyHandler(key, handler);

      return true;
    });
  }
}

Splitter.ItemClass = SplitterItem;

// @ts-expect-error // temp fix
registerComponent('dxSplitter', Splitter);

export default Splitter;
