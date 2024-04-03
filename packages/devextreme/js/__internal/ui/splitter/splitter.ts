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
  getDefaultLayout,
  getElementSize,
  getNextLayout,
  getVisibleItemsCount,
  isElementVisible,
  setFlexProp,
  validateLayout,
} from './utils/layout';
import type {
  FlexProperty, RenderQueueItem, ResizeEvents, ResizeHandleOptions,
} from './utils/types';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

const INACTIVE_RESIZE_HANDLE_SIZE = 2;

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

class SplitterItem extends CollectionWidgetItem {
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
      separatorSize: 8,

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

  _isRenderQueueNotEmpty(): boolean {
    return this._renderQueue.length > 0;
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

  _getItemDimension(element: Element): number | string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._isHorizontalOrientation()
      ? getOuterWidth(element) : getOuterHeight(element);
  }

  _shouldUpdateLayout(): boolean {
    const size: number = this._getDimension(this.$element().get(0));

    return size === 0;
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

  _resizeHandler(): void {
    if (!this._shouldRecalculateLayout) {
      return;
    }

    this._layout = this._getDefaultLayoutBasedOnSize();

    this._applyFlexGrowFromLayout(this._layout);
    this._updatePaneSizesWithOuterWidth();

    this._shouldRecalculateLayout = false;
  }

  _renderItems(items: Item[]): void {
    this._resizeHandles = [];

    super._renderItems(items);

    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();

    if (isElementVisible(this.$element().get(0))) {
      this._layout = this._getDefaultLayoutBasedOnSize();
      this._applyFlexGrowFromLayout(this._layout);
    } else {
      this._shouldRecalculateLayout = true;
    }

    this._processRenderQueue();
  }

  _processRenderQueue(): void {
    if (!this._isRenderQueueNotEmpty()) {
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

    setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, 100 / getVisibleItemsCount(this.option('items')));
    setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);

    const groupAriaAttributes: { role: string; id?: string } = {
      role: 'group',
    };

    if (itemData.visible !== false && !this._isLastVisibleItem(index)) {
      const itemId = `dx_${new Guid()}`;

      groupAriaAttributes.id = itemId;

      this._renderResizeHandle(itemId);
    }

    this.setAria(groupAriaAttributes, $itemFrame);

    return $itemFrame;
  }

  _renderResizeHandle(paneId: string): void {
    const $resizeHandle = $('<div>')
      .appendTo(this.$element());

    const config = this._getResizeHandleConfig(paneId);
    const resizeHandle = this._createComponent($resizeHandle, ResizeHandle, config);

    this._resizeHandles.push(resizeHandle);
  }

  _updateResizeHandlesResizableState(): void {
    this._resizeHandles.forEach((resizeHandle) => {
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
    });
  }

  _updateResizeHandlesCollapsibleState(): void {
    this._resizeHandles.forEach((resizeHandle) => {
      const $resizeHandle = resizeHandle.$element();
      const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
      const $rightItem = this._getResizeHandleRightItem($resizeHandle);
      const leftItemData = this._getItemData($leftItem);
      const rightItemData = this._getItemData($rightItem);
      const showCollapsePrev = rightItemData.collapsed === true
        ? rightItemData.collapsible === true && leftItemData.collapsed !== true
        : leftItemData.collapsible === true && leftItemData.collapsed !== true;

      const showCollapseNext = leftItemData.collapsed === true
        ? leftItemData.collapsible === true && rightItemData.collapsed !== true
        : rightItemData.collapsible === true && rightItemData.collapsed !== true;

      resizeHandle.option({ showCollapsePrev, showCollapseNext });
    });
  }

  _updateResizeHandlesOption(optionName: string, optionValue: unknown): void {
    this._resizeHandles.forEach((resizeHandle) => {
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
        const $resizeHandle = $(e.element);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);

        const isRightItemCollapsed = rightItemData.collapsed === true;

        if (isRightItemCollapsed) {
          this._options.silent(`items[${rightItemIndex}].size`, this._panesCacheSize[rightItemIndex]);
          this.option(`items[${rightItemIndex}].collapsed`, false);

          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: rightItemData,
            itemElement: getPublicElement($rightItem),
            itemIndex: rightItemIndex,
          });

          return;
        }

        this._panesCacheSize[leftItemIndex] = this._getItemDimension($leftItem.get(0));

        this.option(`items[${leftItemIndex}].collapsed`, true);

        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: leftItemData,
          itemElement: getPublicElement($leftItem),
          itemIndex: leftItemIndex,
        });
      },
      onCollapseNext: (e: ItemCollapsedEvent | ItemExpandedEvent): void => {
        const $resizeHandle = $(e.element);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        const $rightItem = this._getResizeHandleRightItem($resizeHandle);
        const rightItemData = this._getItemData($rightItem);
        const rightItemIndex = this._getIndexByItem(rightItemData);

        const isLeftItemCollapsed = leftItemData.collapsed === true;

        if (isLeftItemCollapsed) {
          this._options.silent(`items[${leftItemIndex}].size`, this._panesCacheSize[leftItemIndex]);
          this.option(`items[${leftItemIndex}].collapsed`, false);

          this._getAction(ITEM_EXPANDED_EVENT)({
            event: e.event,
            itemData: leftItemData,
            itemElement: getPublicElement($leftItem),
            itemIndex: leftItemIndex,
          });

          return;
        }

        this._panesCacheSize[rightItemIndex] = this._getItemDimension($rightItem.get(0));

        this.option(`items[${rightItemIndex}].collapsed`, true);

        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e.event,
          itemData: rightItemData,
          itemElement: getPublicElement($rightItem),
          itemIndex: rightItemIndex,
        });
      },
      onResizeStart: (e: ResizeStartEvent): void => {
        const { element, event } = e;

        this._currentLayout = this._layout;
        const $resizeHandle = $(element);
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

        const { items } = this.option();

        this._updateItemsRestrictions(items);

        this._getAction(RESIZE_EVENT.onResizeStart)({
          event,
          handleElement: getPublicElement($resizeHandle),
        });
      },
      onResize: (e: ResizeEvent): void => {
        const { element, event } = e;

        const newLayout = getNextLayout(
          this._currentLayout,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          calculateDelta((event as any).offset, this.option('orientation'), rtlEnabled, this._currentOnePxRatio),
          this._activeResizeHandleIndex,
          this._itemRestrictions,
        );

        this._applyFlexGrowFromLayout(newLayout);
        this._layout = newLayout;

        this._getAction(RESIZE_EVENT.onResize)({
          event,
          handleElement: getPublicElement($(element)),
        });
      },
      onResizeEnd: (e: ResizeEndEvent): void => {
        const { element, event } = e;
        const $resizeHandle = $(element);

        this._feedbackDeferred.resolve();
        this._toggleActiveState($resizeHandle, false);

        each(this._itemElements(), (index: number, itemElement: Element) => {
          this._options.silent(`items[${index}].size`, this._getItemDimension(itemElement));
        });

        this._getAction(RESIZE_EVENT.onResizeEnd)({
          event,
          handleElement: getPublicElement($resizeHandle),
        });
      },
    };
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
    let size = 0;

    this._resizeHandles.forEach((resizeHandle) => {
      const { disabled, separatorSize } = resizeHandle.option();

      size += disabled ? INACTIVE_RESIZE_HANDLE_SIZE : separatorSize as number;
    });

    return size;
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

  _itemOptionChanged(item: unknown, property: unknown, value: unknown): void {
    if (property === 'splitter.onResizeEnd') {
      const $item = this._findItemElementByItem(item);

      if (!$item.length) {
        return;
      }

      const splitInstance = getComponentInstance($item.find('.dx-splitter'));
      splitInstance.option('onResizeEnd', value);

      return;
    }

    switch (property) {
      case 'size':
      case 'maxSize':
      case 'minSize':
        this._layout = this._getDefaultLayoutBasedOnSize();

        this._applyFlexGrowFromLayout(this._layout);
        this._updatePaneSizesWithOuterWidth();
        break;
      case 'collapsed':
        this._updateResizeHandlesResizableState();
        this._updateResizeHandlesCollapsibleState();

        this._layout = this._getDefaultLayoutBasedOnSize();

        this._applyFlexGrowFromLayout(this._layout);
        this._updatePaneSizesWithOuterWidth();
        break;
      case 'resizable':
        this._updateResizeHandlesResizableState();
        break;
      case 'collapsible':
        this._updateResizeHandlesCollapsibleState();
        break;
      default:
        super._itemOptionChanged(item, property, value);
    }
  }

  _getDefaultLayoutBasedOnSize(): number[] {
    const { items } = this.option();

    this._updateItemsRestrictions(items);

    const defaultLayout = getDefaultLayout(this._itemRestrictions);

    if (items && items.length === 1) {
      return defaultLayout;
    }

    return validateLayout(defaultLayout, this._itemRestrictions);
  }

  _updateItemsRestrictions(items: Item[]): void {
    const { orientation } = this.option();

    const handlesSizeSum = this._getResizeHandlesSize();
    const elementSize = getElementSize(this.$element(), orientation);

    this._itemRestrictions = [];

    items.forEach((item) => {
      this._itemRestrictions.push({
        resizable: item.resizable !== false,
        visible: item.visible,
        collapsed: item.collapsed === true,
        size: convertSizeToRatio(item.size, elementSize, handlesSizeSum),
        maxSize: convertSizeToRatio(item.maxSize, elementSize, handlesSizeSum),
        minSize: convertSizeToRatio(item.minSize, elementSize, handlesSizeSum),
      });
    });
  }

  _applyFlexGrowFromLayout(layout: number[]): void {
    this._iterateItems((index, itemElement) => {
      setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, layout[index]);
    });
  }

  _updatePaneSizesWithOuterWidth(): void {
    this._iterateItems((index, itemElement) => {
      this._options.silent(`items[${index}].size`, this._getItemDimension(itemElement));
    });
  }

  _iterateItems(callback: (index: number, itemElement: HTMLElement) => void): void {
    each(this._itemElements(), (index: number, itemElement: HTMLElement) => {
      callback(index, itemElement);
    });
  }

  _getResizeHandleItems(): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$element().children(`.${RESIZE_HANDLE_CLASS}`);
  }

  _iterateResizeHandles(callback: (instance: ResizeHandle) => void): void {
    this._getResizeHandleItems().each((index, element) => {
      callback(getComponentInstance($(element)) as ResizeHandle);

      return true;
    });
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'allowKeyboardNavigation':
        this._iterateResizeHandles((instance) => {
          instance.option('focusStateEnabled', value);
        });
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
        break;
      case 'separatorSize':
        this._updateResizeHandlesOption(name, value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  registerKeyHandler(key: string, handler: () => void): void {
    this._iterateResizeHandles((instance) => {
      instance.registerKeyHandler(key, handler);
    });
  }
}

Splitter.ItemClass = SplitterItem;

// @ts-expect-error // temp fix
registerComponent('dxSplitter', Splitter);

export default Splitter;
