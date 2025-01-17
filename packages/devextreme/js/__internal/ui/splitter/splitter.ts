import type { Orientation } from '@js/common';
import { lock } from '@js/common/core/events/core/emitter.feedback';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { contains } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import {
  getOuterHeight,
  getOuterWidth,
} from '@js/core/utils/size';
import { isDefined, isObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type {
  Item,
  ItemCollapsedEvent,
  ItemExpandedEvent,
  Properties as PublicProperties,
  ResizeEndEvent,
  ResizeEvent,
  ResizeStartEvent,
} from '@js/ui/splitter';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidget from '@ts/ui/collection/live_update';
import type { CollectionWidgetBaseProperties, ItemRenderInfo } from '@ts/ui/collection/m_collection_widget.base';

import type ResizeHandle from './resize_handle';
import type { ResizeHandleOptions } from './resize_handle';
import { RESIZE_HANDLE_CLASS } from './resize_handle';
import SplitterItem from './splitter_item';
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
  findLastIndexOfNonCollapsedItem,
  findLastIndexOfVisibleItem,
  getElementSize,
  getNextLayout,
  isElementVisible,
  setFlexProp,
} from './utils/layout';
import { getDefaultLayout } from './utils/layout_default';
import { compareNumbersWithPrecision } from './utils/number_comparison';
import {
  CollapseExpandDirection,
  type EventMap,
  type FlexProperty,
  type HandlerMap,
  type InteractionEvent,
  type PaneRestrictions,
  type RenderQueueItem,
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
type ItemLike<TKey> = string | Item<TKey> | any;

export interface Properties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike<TKey> = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends PublicProperties<TItem, TKey>,
  Omit<
  CollectionWidgetBaseProperties<Splitter, TItem, TKey>,
  keyof PublicProperties<TItem, TKey> & keyof CollectionWidgetBaseProperties<Splitter, TItem, TKey>
  > {
  _renderQueue?: RenderQueueItem[];
}

interface PaneCache {
  size: number;
  direction: CollapseExpandDirection;
}

class Splitter extends CollectionWidget<Properties> {
  static ItemClass = SplitterItem;

  private _renderQueue: RenderQueueItem[] = [];

  private _panesCacheSize: (PaneCache | undefined)[] = [];

  private _savedCollapsingEvent?: InteractionEvent;

  private _shouldRecalculateLayout?: boolean;

  private _layout?: number[];

  private _currentLayout?: number[];

  private _activeResizeHandleIndex?: number;

  private _collapseDirection?: CollapseExpandDirection;

  private _itemRestrictions: PaneRestrictions[] = [];

  private _currentOnePxRatio?: number;

  private _feedbackDeferred?: DeferredObj<unknown>;

  _getDefaultOptions(): Properties {
    const defaultOptions = super._getDefaultOptions();

    return {
      ...defaultOptions,
      orientation: ORIENTATION.horizontal,
      onItemCollapsed: undefined,
      onItemExpanded: undefined,
      onResize: undefined,
      onResizeEnd: undefined,
      onResizeStart: undefined,
      allowKeyboardNavigation: true,
      separatorSize: DEFAULT_RESIZE_HANDLE_SIZE,

      _itemAttributes: {
        ...defaultOptions._itemAttributes,
        role: 'group',
      },
      _renderQueue: undefined,
    };
  }

  _itemClass(): string {
    return SPLITTER_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return SPLITTER_ITEM_DATA_KEY;
  }

  _init(): void {
    super._init();

    this._initializeRenderQueue();
  }

  _initializeRenderQueue(): void {
    // @ts-expect-error
    this._renderQueue = this.option('_renderQueue') ?? [];
  }

  _isRenderQueueEmpty(): boolean {
    return this._renderQueue.length <= 0;
  }

  _pushItemToRenderQueue(
    itemContent: dxElementWrapper,
    splitterConfig: Properties,
  ): void {
    this._renderQueue.push({ itemContent, splitterConfig });
  }

  _shiftItemFromQueue(): RenderQueueItem | undefined {
    return this._renderQueue.shift();
  }

  _initMarkup(): void {
    $(this.element()).addClass(SPLITTER_CLASS);

    this._toggleOrientationClass();

    super._initMarkup();

    this._panesCacheSize = [];
    this._attachResizeObserverSubscription();
  }

  _getItemDimension(element: Element): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._isHorizontalOrientation()
      ? getOuterWidth(element)
      : getOuterHeight(element);
  }

  _attachResizeObserverSubscription(): void {
    if (hasWindow()) {
      const element = $(this.element()).get(0);

      resizeObserverSingleton.unobserve(element);
      resizeObserverSingleton.observe(element, () => { this._resizeHandler(); });
    }
  }

  _attachHoldEvent(): void {}

  _isAttached(): boolean {
    return !!contains(domAdapter.getBody(), $(this.element()).get(0));
  }

  _isVisible(): boolean {
    return isElementVisible($(this.element())[0]);
  }

  _resizeHandler(): void {
    if (this._shouldRecalculateLayout && this._isAttached() && this._isVisible()) {
      this._layout = this._getDefaultLayoutBasedOnSize();

      this._applyStylesFromLayout(this._layout);
      this._updateItemSizes();

      this._shouldRecalculateLayout = false;
    }
  }

  _renderItems(items: Item[]): void {
    super._renderItems(items);

    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();

    if (this._isVisible()) {
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

    if (!item) {
      return;
    }

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

  _itemElements(): dxElementWrapper {
    return $(this._itemContainer()).children(this._itemSelector());
  }

  _isLastVisibleItem(index: number): boolean {
    const { items = [] } = this.option();

    return index === findLastIndexOfVisibleItem(items);
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): dxElementWrapper {
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    const itemElement = $itemFrame.get(0) as HTMLElement;

    setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);

    this._getItemInstance($itemFrame)._renderResizeHandle();

    return $itemFrame;
  }

  _getItemInstance($item: dxElementWrapper): SplitterItem {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Splitter.ItemClass.getInstance($item);
  }

  _updateResizeHandlesResizableState(): void {
    this._getResizeHandles().forEach((resizeHandle) => {
      const $resizeHandle = (resizeHandle.$element() as unknown) as dxElementWrapper;

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
      const $resizeHandle = $(resizeHandle.element());

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
    const { items = [] } = this.option();

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
    const { items = [] } = this.option();

    return this._getItemDataByIndex(findIndexOfNextVisibleItem(items, index));
  }

  _getItemDataByIndex(index: number): Item {
    // @ts-expect-error badly typed base class
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._editStrategy.getItemDataByIndex(index);
  }

  _createEventAction(eventName: keyof HandlerMap): void {
    const actionName = getActionNameByEventName(eventName);

    this[actionName] = this._createActionByOption(eventName, {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _getAction<K extends keyof HandlerMap>(
    eventName: K,
  ): HandlerMap[K] {
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

        this._savedCollapsingEvent = e.event;
        this.handleCollapseEvent(
          this._getResizeHandleLeftItem($(e.element)),
          CollapseExpandDirection.Previous,
        );
      },
      onCollapseNext: (e: ItemCollapsedEvent | ItemExpandedEvent): void => {
        e.event?.stopPropagation();

        this._savedCollapsingEvent = e.event;
        this.handleCollapseEvent(
          this._getResizeHandleLeftItem($(e.element)),
          CollapseExpandDirection.Next,
        );
      },
      onResizeStart: (e: ResizeStartEvent): void => {
        const { element, event } = e;

        if (!event) { return; }

        const $resizeHandle = $(element);

        const eventArgs: Partial<EventMap['onResizeStart']> = {
          event,
          handleElement: getPublicElement<HTMLElement>($resizeHandle),
        };

        this._getAction(RESIZE_EVENT.onResizeStart)(eventArgs);

        if (eventArgs.cancel) {
          // @ts-expect-error ts-error
          event.cancel = true;
          return;
        }

        this._feedbackDeferred = Deferred();
        lock(this._feedbackDeferred);
        this._toggleActiveState($resizeHandle, true);

        const $leftItem = this._getResizeHandleLeftItem($resizeHandle);
        const leftItemData = this._getItemData($leftItem);
        const leftItemIndex = this._getIndexByItem(leftItemData);
        this._activeResizeHandleIndex = leftItemIndex;

        this._currentOnePxRatio = convertSizeToRatio(
          1,
          getElementSize($(this.element()), orientation),
          this._getResizeHandlesSize(),
        );

        this._currentLayout = this.getLayout();

        this._updateItemsRestrictions();
      },
      onResize: (e: ResizeEvent): void => {
        const { element, event } = e;

        if (!event) { return; }

        const eventArgs: Partial<EventMap['onResize']> = {
          event,
          handleElement: getPublicElement<HTMLElement>($(element)),
        };

        this._getAction(RESIZE_EVENT.onResize)(eventArgs);

        if (eventArgs.cancel) {
          // @ts-expect-error ts-error
          event.cancel = true;
          return;
        }

        const { orientation: currentOrientation } = this.option();

        const newLayout = getNextLayout(
          this._currentLayout ?? [],
          calculateDelta(
            // @ts-expect-error ts-error
            event.offset,
            currentOrientation,
            rtlEnabled,
            this._currentOnePxRatio,
          ),
          this._activeResizeHandleIndex,
          this._itemRestrictions,
        );

        this._applyStylesFromLayout(newLayout);
        this._layout = newLayout;
      },
      onResizeEnd: (e: ResizeEndEvent): void => {
        const { element, event } = e;

        this._activeResizeHandleIndex = undefined;

        if (!event) { return; }

        const $resizeHandle = $(element);

        const eventArgs: Partial<EventMap['onResizeEnd']> = {
          event,
          handleElement: getPublicElement<HTMLElement>($resizeHandle),
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._feedbackDeferred?.resolve();
        this._toggleActiveState($resizeHandle, false);

        this._updateItemSizes();
        this._getAction(RESIZE_EVENT.onResizeEnd)(eventArgs);
      },
    };
  }

  handleCollapseEvent(
    $resizeHandle: dxElementWrapper,
    direction: CollapseExpandDirection,
    isItemCollapsed?: boolean,
  ): void {
    const $leftItem = $resizeHandle;
    const leftItemData = this._getItemData($leftItem);
    const leftItemIndex = this._getIndexByItem(leftItemData);
    const $rightItem = this._getResizeHandleRightItem($leftItem);
    const rightItemData = this._getItemData($rightItem);
    const rightItemIndex = this._getIndexByItem(rightItemData);

    this._activeResizeHandleIndex = leftItemIndex;
    this._collapseDirection = direction;

    const isCollapsed = isItemCollapsed
      ?? (direction === CollapseExpandDirection.Previous
        ? rightItemData.collapsed
        : leftItemData.collapsed);

    let index = 0;
    if (direction === CollapseExpandDirection.Previous) {
      index = isCollapsed ? rightItemIndex : leftItemIndex;
    } else {
      index = isCollapsed ? leftItemIndex : rightItemIndex;
    }

    this._updateItemData('collapsed', index, !isCollapsed, false);
  }

  _getResizeHandleLeftItem($element: dxElementWrapper): dxElementWrapper {
    let $leftItem = $element.prev();

    while ($leftItem.hasClass(INVISIBLE_STATE_CLASS) || $leftItem.hasClass(RESIZE_HANDLE_CLASS)) {
      $leftItem = $leftItem.prev();
    }

    return $leftItem;
  }

  _getResizeHandleRightItem($element: dxElementWrapper): dxElementWrapper {
    let $rightItem = $element.next();

    while ($rightItem.hasClass(INVISIBLE_STATE_CLASS) || $rightItem.hasClass(RESIZE_HANDLE_CLASS)) {
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

  _createItemByTemplate(
    itemTemplate: { source: () => unknown },
    args: ItemRenderInfo<Item>,
  ): unknown {
    const { itemData } = args;

    if (itemData.splitter) {
      this._onItemTemplateRendered(itemTemplate, args)();
      return itemTemplate.source
        ? itemTemplate.source()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : ($ as any)();
    }

    return super._createItemByTemplate(itemTemplate, args);
  }

  _postprocessRenderItem(args: {
    itemElement: dxElementWrapper;
    itemContent: dxElementWrapper;
    itemData: Item;
    itemIndex: number;
  }): void {
    const splitterConfig = args.itemData.splitter;
    if (!splitterConfig) {
      return;
    }

    this._pushItemToRenderQueue(args.itemContent, splitterConfig);
  }

  _isHorizontalOrientation(): boolean {
    const { orientation } = this.option();

    return orientation === ORIENTATION.horizontal;
  }

  _toggleOrientationClass(): void {
    $(this.element())
      .toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation())
      .toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  _itemOptionChanged(item: Item, property: string, value: unknown, prevValue: unknown): void {
    switch (property) {
      case 'size':
      case 'maxSize':
      case 'minSize':
      case 'collapsedSize':
        this._layout = this._getDefaultLayoutBasedOnSize();

        this._applyStylesFromLayout(this.getLayout());
        this._updateItemSizes();
        break;
      case 'collapsed':
        this._itemCollapsedOptionChanged(item, value as boolean, prevValue as boolean);
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
        super._itemOptionChanged(item, property, value, prevValue);
    }
  }

  _itemCollapsedOptionChanged(item: Item, value: boolean, prevValue: boolean): void {
    if (Boolean(value) === Boolean(prevValue)) {
      return;
    }

    const itemIndex = this._getIndexByItem(item);
    const $item = $(this._itemElements()[itemIndex]);
    const { items = [] } = this.option();

    if (!isDefined(this._activeResizeHandleIndex)) {
      if (value) {
        const isLastNonCollapsedItem = itemIndex > findLastIndexOfNonCollapsedItem(items);

        if (this._isLastVisibleItem(itemIndex) || isLastNonCollapsedItem) {
          this.handleCollapseEvent(
            this._getResizeHandleLeftItem($item),
            CollapseExpandDirection.Next,
            !!prevValue,
          );
        } else {
          this.handleCollapseEvent(
            $item,
            CollapseExpandDirection.Previous,
            !!prevValue,
          );
        }
      } else {
        const isLastNonCollapsedItem = itemIndex >= findLastIndexOfNonCollapsedItem(items);

        if (this._isLastVisibleItem(itemIndex) || isLastNonCollapsedItem) {
          this.handleCollapseEvent(
            this._getResizeHandleLeftItem($item),
            CollapseExpandDirection.Previous,
            !!prevValue,
          );
        } else if (this._panesCacheSize[itemIndex]?.direction
          === CollapseExpandDirection.Previous) {
          this.handleCollapseEvent(
            this._getResizeHandleLeftItem($item),
            CollapseExpandDirection.Previous,
            !!prevValue,
          );
        } else {
          this.handleCollapseEvent(
            $item,
            CollapseExpandDirection.Next,
            !!prevValue,
          );
        }
      }
    }

    this._updateItemsRestrictions();

    const collapsedDelta = this._getCollapseDelta(item, value);

    this._itemRestrictions.map((pane) => {
      pane.maxSize = undefined;
      pane.resizable = undefined;

      return item;
    });

    this._layout = getNextLayout(
      this.getLayout(),
      collapsedDelta,
      this._activeResizeHandleIndex,
      this._itemRestrictions,
    );

    this._applyStylesFromLayout(this.getLayout());
    this._updateItemSizes();

    this._updateResizeHandlesResizableState();
    this._updateResizeHandlesCollapsibleState();

    this._fireCollapsedStateChanged(!value, $item, this._savedCollapsingEvent);

    this._savedCollapsingEvent = undefined;
    this._collapseDirection = undefined;
    this._activeResizeHandleIndex = undefined;
  }

  _calculateExpandToLeftSize(leftItemIndex: number): number {
    const { items = [] } = this.option();

    for (let i = leftItemIndex; i >= 0; i -= 1) {
      const { collapsed, visible } = items[i];

      if (collapsed !== true && visible !== false) {
        return this.getLayout()[i] / 2;
      }
    }

    return 0;
  }

  _calculateExpandToRightSize(rightItemIndex: number): number {
    const { items = [] } = this.option();
    for (let i = rightItemIndex; i <= items.length - 1; i += 1) {
      const { collapsed, visible } = items[i];

      if (collapsed !== true && visible !== false) {
        return this.getLayout()[i] / 2;
      }
    }

    return 0;
  }

  _getCollapseDelta(item: Item, newCollapsedState: boolean): number {
    const itemIndex = this._getIndexByItem(item);

    const { collapsedSize = 0, minSize = 0, maxSize = 100 } = this._itemRestrictions[itemIndex];

    const currentPaneSize = this.getLayout()[itemIndex];

    if (newCollapsedState) {
      const targetPaneSize = collapsedSize;

      if (currentPaneSize > targetPaneSize) {
        this._panesCacheSize[itemIndex] = {
          size: currentPaneSize,
          direction: this._collapseDirection === CollapseExpandDirection.Next
            ? CollapseExpandDirection.Previous
            : CollapseExpandDirection.Next,
        };
      }

      const delta = this._collapseDirection === CollapseExpandDirection.Previous
        ? targetPaneSize - currentPaneSize
        : currentPaneSize - targetPaneSize;

      return delta;
    }

    const paneCache = this._panesCacheSize[itemIndex];
    this._panesCacheSize[itemIndex] = undefined;

    let targetPaneSize = 0;

    if (paneCache && paneCache.direction === this._collapseDirection) {
      targetPaneSize = paneCache.size - collapsedSize;
    } else {
      targetPaneSize = this._collapseDirection === CollapseExpandDirection.Previous
        ? this._calculateExpandToLeftSize(itemIndex - 1)
        : this._calculateExpandToRightSize(itemIndex + 1);
    }

    let adjustedSize = compareNumbersWithPrecision(targetPaneSize, minSize) < 0
      ? minSize
      : targetPaneSize;

    adjustedSize = Math.min(maxSize, adjustedSize);

    const deltaSign = this._collapseDirection === CollapseExpandDirection.Previous ? -1 : 1;

    const delta = adjustedSize * deltaSign;

    return delta;
  }

  _fireCollapsedStateChanged(
    isExpanded: boolean,
    $item: dxElementWrapper,
    e?: unknown,
  ): void {
    const eventName = isExpanded ? ITEM_EXPANDED_EVENT : ITEM_COLLAPSED_EVENT;

    this._itemEventHandler($item, eventName, { event: e });
  }

  _getDefaultLayoutBasedOnSize(): number[] {
    this._updateItemsRestrictions();

    return getDefaultLayout(this._itemRestrictions);
  }

  _updateItemsRestrictions(): void {
    const { orientation, items = [] } = this.option();

    const handlesSizeSum = this._getResizeHandlesSize();
    const elementSize = getElementSize($(this.element()), orientation);

    this._itemRestrictions = [];

    items.forEach((item) => {
      this._itemRestrictions.push({
        resizable: item.resizable !== false,
        visible: item.visible !== false,
        collapsed: item.collapsed === true,
        collapsedSize: convertSizeToRatio(item.collapsedSize, elementSize, handlesSizeSum),
        size: convertSizeToRatio(item.size, elementSize, handlesSizeSum),
        maxSize: convertSizeToRatio(item.maxSize, elementSize, handlesSizeSum),
        minSize: convertSizeToRatio(item.minSize, elementSize, handlesSizeSum),
      });
    });
  }

  _applyStylesFromLayout(layout: number[]): void {
    this._iterateItems((index, itemElement) => {
      setFlexProp($(itemElement)[0], FLEX_PROPERTY.flexGrow, layout[index]);

      const itemData = this._getItemData(itemElement);
      const shouldHideContent = layout[index] === 0 && itemData.visible !== false;

      $(itemElement).toggleClass(SPLITTER_ITEM_HIDDEN_CONTENT_CLASS, shouldHideContent);
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

  _iterateItems(callback: (index: number, itemElement: Element) => void): void {
    this._itemElements().each((index, itemElement) => {
      callback(index, itemElement);

      return true;
    });
  }

  _getResizeHandles(): ResizeHandle[] {
    const handles: ResizeHandle[] = [];

    this._iterateItems((_, itemElement) => {
      const instance = this._getItemInstance($(itemElement));
      const resizeHandle = instance.getResizeHandle();

      if (resizeHandle) {
        handles.push(resizeHandle);
      }
    });

    return handles;
  }

  _getResizeHandleItems(): dxElementWrapper {
    return $(this.element()).children(`.${RESIZE_HANDLE_CLASS}`);
  }

  _iterateResizeHandles(callback: (instance: ResizeHandle) => void): void {
    this._getResizeHandleItems().each((index, element) => {
      callback(getComponentInstance($(element)));

      return true;
    });
  }

  _dimensionChanged(): void {
    this._updateItemSizes();

    this._layout = this._getDefaultLayoutBasedOnSize();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'width':
      case 'height':
        super._optionChanged(args);

        this._dimensionChanged();
        break;
      case 'allowKeyboardNavigation':
        this._iterateResizeHandles((instance) => {
          instance.option('focusStateEnabled', !!value);
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
      case '_renderQueue':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }

  registerKeyHandler(key: string, handler: () => void): void {
    $(this.element()).find(`.${RESIZE_HANDLE_CLASS}`).each((index, element) => {
      getComponentInstance($(element)).registerKeyHandler(key, handler);

      return true;
    });
  }

  getLayout(): number[] {
    return this._layout ?? [];
  }
}

registerComponent('dxSplitter', Splitter);

export default Splitter;
