import type { SingleOrMultiple } from '@js/common';
import { locate } from '@js/common/core/animation/translator';
import Swipeable from '@js/common/core/events/gesture/swipeable';
import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { sign } from '@js/core/utils/math';
import { getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import CollectionWidgetLiveUpdate from '@js/ui/collection/ui.collection_widget.live_update';
import type { Item, Properties } from '@js/ui/multi_view';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SwipeEndEvent, SwipeStartEvent, SwipeUpdateEvent } from '@ts/events/m_swipe';
import type {
  CollectionItemInfo,
  CollectionItemKey,
  DataChange,
  ItemRenderInfo,
} from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetLiveUpdateProperties } from '@ts/ui/collection/collection_widget.live_update';

import { _translator, animation } from './multi_view.animation';

// STYLE multiView

const MULTIVIEW_CLASS = 'dx-multiview';
const MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper';
const MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container';
const MULTIVIEW_ITEM_CLASS = 'dx-multiview-item';
const MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';
const MULTIVIEW_ITEM_DATA_KEY = 'dxMultiViewItemData';

const MULTIVIEW_ANIMATION_DURATION = 200;

const toNumber = (value): number => +value;

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const getPosition = ($element: dxElementWrapper): number => locate($element).left;

export interface MultiViewProperties extends Properties<Item>, Omit<
  CollectionWidgetLiveUpdateProperties<MultiView, Item, CollectionItemKey>,
  keyof Properties<Item, CollectionItemKey>
> {
  selectionMode?: SingleOrMultiple;
}
class MultiView<
  TProperties extends MultiViewProperties = MultiViewProperties,
> extends CollectionWidgetLiveUpdate<TProperties> {
  _boundaryIndices?: {
    firstAvailableIndex: number;
    lastAvailableIndex: number;
    firstTrueIndex: number;
    lastTrueIndex: number;
  };

  _itemFocusLooped?: boolean;

  _$itemContainer!: dxElementWrapper;

  _deferredItems!: (DeferredObj<unknown> | null)[];

  _$wrapper!: dxElementWrapper;

  _itemWidthValue?: number;

  _supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {
      ...super._supportedKeys(),
      pageUp: noop,
      pageDown: noop,
    };
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      selectedIndex: 0,
      swipeEnabled: true,
      animationEnabled: true,
      loop: false,
      deferRendering: true,
      loopItemFocus: false,
      selectOnFocus: true,
      selectionMode: 'single',
      selectionRequired: true,
      selectByClick: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        // @ts-expect-error ts-error
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  _itemClass(): string {
    return MULTIVIEW_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return MULTIVIEW_ITEM_DATA_KEY;
  }

  _itemContainer(): dxElementWrapper {
    return this._$itemContainer;
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  _itemWidth(): number {
    if (this._itemWidthValue) {
      return this._itemWidthValue;
    }

    return getWidth(this._$wrapper) as number;
  }

  _clearItemWidthCache(): void {
    delete this._itemWidthValue;
  }

  _itemsCount(): number {
    const { items = [] } = this.option();

    return items.length;
  }

  _isAllItemsHidden(): boolean {
    const { items = [] } = this.option();

    return items.every((_item: Item, index) => !this._isItemVisible(index));
  }

  _normalizeIndex(index: number, direction: number, loop = true): number | undefined {
    const count = this._itemsCount();
    let normalizedIndex = index;

    if (this._isAllItemsHidden()) {
      return undefined;
    }

    if (index < 0) {
      normalizedIndex += count;
    }
    if (index >= count) {
      normalizedIndex -= count;
    }

    const step = direction > 0 ? -1 : 1;
    const lastNotLoopedIndex = step === -1 ? 0 : count - 1;

    while (
      !this._isItemVisible(normalizedIndex)
      && (loop || normalizedIndex !== lastNotLoopedIndex)
    ) {
      normalizedIndex = (normalizedIndex + step + count) % count;
    }

    return normalizedIndex;
  }

  _getRTLSignCorrection(): number {
    const { rtlEnabled } = this.option();

    return rtlEnabled ? -1 : 1;
  }

  _init(): void {
    super._init();

    this._activeStateUnit = `.${MULTIVIEW_ITEM_CLASS}`;

    const $element = this.$element();

    $element.addClass(MULTIVIEW_CLASS);

    this._$wrapper = $('<div>').addClass(MULTIVIEW_WRAPPER_CLASS);
    this._$wrapper.appendTo($element);

    this._$itemContainer = $('<div>').addClass(MULTIVIEW_ITEM_CONTAINER_CLASS);
    this._$itemContainer.appendTo(this._$wrapper);

    const { loop } = this.option();

    this.option('loopItemFocus', loop);
    this._findBoundaryIndices();

    this._initSwipeable();
  }

  _ensureSelectedItemIsVisible(): void {
    const { loop, selectedIndex: currentSelectedIndex } = this.option();

    if (!isDefined(currentSelectedIndex)) {
      return;
    }

    if (this._isItemVisible(currentSelectedIndex)) {
      return;
    }

    if (this._isAllItemsHidden()) {
      this.option('selectedIndex', 0);
      return;
    }

    const direction = -1 * this._getRTLSignCorrection();
    let newSelectedIndex = this._normalizeIndex(currentSelectedIndex, direction, loop);

    if (newSelectedIndex === currentSelectedIndex) {
      newSelectedIndex = this._normalizeIndex(currentSelectedIndex, -direction, loop);
    }

    this.option('selectedIndex', newSelectedIndex);
  }

  _initMarkup(): void {
    this._deferredItems = [];

    super._initMarkup();

    this._ensureSelectedItemIsVisible();
    const selectedItemIndices = this._getSelectedItemIndices();
    this._updateItemsVisibility(selectedItemIndices[0]);

    this._setElementAria();
    this._setItemsAria();
  }

  _afterItemElementDeleted(
    $item: dxElementWrapper,
    deletedActionArgs: CollectionItemInfo<Item, number>,
  ): void {
    super._afterItemElementDeleted($item, deletedActionArgs);

    if (this._deferredItems) {
      this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
    }
  }

  _beforeItemElementInserted(change: DataChange<Item>): void {
    super._beforeItemElementInserted(change);

    if (this._deferredItems) {
      this._deferredItems.splice(change.index, 0, null);
    }
  }

  _executeItemRenderAction(
    _index: number,
    itemData: Item,
    itemElement: HTMLElement,
  ): void {
    const { items = [] } = this.option();
    const index = items.indexOf(itemData);

    super._executeItemRenderAction(index, itemData, itemElement);
  }

  _renderItemContent(args: ItemRenderInfo<Item>): DeferredObj<dxElementWrapper> {
    const renderContentDeferred = Deferred();

    const deferred = Deferred();
    deferred.done(() => {
      const $itemContent = super._renderItemContent(args);
      renderContentDeferred.resolve($itemContent);
    });

    this._deferredItems[args.index] = deferred;

    const { deferRendering } = this.option();

    if (!deferRendering) {
      deferred.resolve();
    }

    // @ts-expect-error ts-error
    return renderContentDeferred.promise();
  }

  _render(): void {
    super._render();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(() => {
      const selectedItemIndices = this._getSelectedItemIndices();
      this._updateItems(selectedItemIndices[0]);
    });
  }

  _getElementAria(): Record<string, string> {
    return {
      role: 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxMultiView-elementAriaRoleDescription'),
      label: messageLocalization.format('dxMultiView-elementAriaLabel'),
    };
  }

  _setElementAria(): void {
    const aria = this._getElementAria();

    this.setAria(aria, this.$element());
  }

  _setItemsAria(): void {
    const $itemElements = this._itemElements();
    const itemsCount = this._itemsCount();

    // @ts-expect-error ts-error
    $itemElements.each((itemIndex, item) => {
      const aria = this._getItemAria({ itemIndex, itemsCount });

      this.setAria(aria, $(item));
    });
  }

  _getItemAria(args: {
    itemIndex: number;
    itemsCount: number;
  }): Record<string, string> {
    const { itemIndex, itemsCount } = args;

    return {
      role: 'group',
      // eslint-disable-next-line spellcheck/spell-checker
      roledescription: messageLocalization.format('dxMultiView-itemAriaRoleDescription'),
      label: messageLocalization.format(
        'dxMultiView-itemAriaLabel',
        // @ts-expect-error ts-error
        itemIndex + 1,
        itemsCount,
      ),
    };
  }

  _updateItems(selectedIndex: number, newIndex?: number): void {
    this._updateItemsPosition(selectedIndex, newIndex);
    this._updateItemsVisibility(selectedIndex, newIndex);
  }

  _modifyByChanges(changes: DataChange<Item>[], isPartialRefresh?: boolean): void {
    super._modifyByChanges(changes, isPartialRefresh);

    const selectedItemIndices = this._getSelectedItemIndices();
    this._updateItemsVisibility(selectedItemIndices[0]);
  }

  _updateItemsPosition(selectedIndex: number, newIndex?: number): void {
    const $itemElements = this._itemElements();
    const positionSign = isDefined(newIndex)
      ? -this._animationDirection(newIndex, selectedIndex)
      : undefined;
    const $selectedItem = $itemElements.eq(selectedIndex);

    _translator.move($selectedItem, 0);
    if (isDefined(newIndex) && isDefined(positionSign)) {
      _translator.move($itemElements.eq(newIndex), `${positionSign * 100}%`);
    }
  }

  _isItemVisible(index?: number): boolean {
    const { items = [] } = this.option();

    return (isDefined(index) && items[index]?.visible) ?? true;
  }

  _updateItemsVisibility(selectedIndex: number, newIndex?: number): void {
    const $itemElements = this._itemElements();

    // @ts-expect-error ts-error
    $itemElements.each((itemIndex, item) => {
      const $item = $(item);
      const isHidden = itemIndex !== selectedIndex && itemIndex !== newIndex;

      if (!isHidden) {
        this._renderSpecificItem(itemIndex);
      }

      $item.toggleClass(MULTIVIEW_ITEM_HIDDEN_CLASS, isHidden);

      this.setAria('hidden', isHidden || undefined, $item);
    });
  }

  _renderSpecificItem(index: number): void {
    const $item = this._itemElements().eq(index);
    const hasItemContent = $item.find(this._itemContentClass()).length > 0;

    if (isDefined(index) && !hasItemContent) {
      this._deferredItems[index]?.resolve();
      triggerResizeEvent($item);
    }
  }

  _refreshItem($item: dxElementWrapper, item: Item): void {
    super._refreshItem($item, item);

    const { selectedIndex = 0 } = this.option();

    this._updateItemsVisibility(selectedIndex);
  }

  _setAriaSelectionAttribute(): void {}

  _updateSelection(addedSelection: number[], removedSelection: number[]): void {
    const newIndex = addedSelection[0];
    const prevIndex = removedSelection[0];

    animation.complete(this._$itemContainer);

    this._updateItems(prevIndex, newIndex);

    const animationDirection = this._animationDirection(newIndex, prevIndex);

    this._animateItemContainer(animationDirection * this._itemWidth(), () => {
      _translator.move(this._$itemContainer, 0);
      this._updateItems(newIndex);

      // NOTE: force layout recalculation on iOS 6 & iOS 7.0 (B254713)
      getWidth(this._$itemContainer);
    });
  }

  _animateItemContainer(position: number, completeCallback: () => void): void {
    const { animationEnabled } = this.option();
    const duration = animationEnabled ? MULTIVIEW_ANIMATION_DURATION : 0;

    animation.moveTo(this._$itemContainer, position, duration, completeCallback);
  }

  _animationDirection(newIndex: number, prevIndex: number): number {
    const containerPosition = getPosition(this._$itemContainer);
    const signCorrection = this._getRTLSignCorrection() * this._getItemFocusLoopSignCorrection();
    const indexDifference = (prevIndex - newIndex) * signCorrection;
    const isSwipePresent = containerPosition !== 0;

    const directionSignVariable = isSwipePresent ? containerPosition : indexDifference;

    return sign(directionSignVariable);
  }

  _getSwipeDisabledState(): boolean {
    const { swipeEnabled } = this.option();

    return !swipeEnabled || this._itemsCount() <= 1;
  }

  _initSwipeable(): void {
    this._createComponent(this.$element(), Swipeable, {
      disabled: this._getSwipeDisabledState(),
      elastic: false,
      itemSizeFunc: this._itemWidth.bind(this),
      onStart: (args) => {
        this._swipeStartHandler(args.event);
      },
      onUpdated: (args) => {
        this._swipeUpdateHandler(args.event);
      },
      onEnd: (args) => {
        this._swipeEndHandler(args.event);
      },
    });
  }

  _findBoundaryIndices(): void {
    const { items = [] } = this.option();

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let firstIndex: number | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let lastIndex: number | undefined;

    items.forEach((item, index) => {
      const isDisabled = Boolean(item?.disabled);
      const isVisible = this._isItemVisible(index);

      if (!isDisabled && isVisible) {
        firstIndex ??= index;
        lastIndex = index;
      }
    });

    this._boundaryIndices = {
      firstAvailableIndex: firstIndex ?? 0,
      lastAvailableIndex: lastIndex ?? items.length - 1,
      firstTrueIndex: 0,
      lastTrueIndex: items.length - 1,
    };
  }

  _swipeStartHandler(e: DxEvent<SwipeStartEvent>): void {
    animation.complete(this._$itemContainer);

    const { selectedIndex, loop, rtlEnabled } = this.option();

    if (!isDefined(selectedIndex) || !isDefined(this._boundaryIndices)) {
      return;
    }

    const { firstAvailableIndex, lastAvailableIndex } = this._boundaryIndices;
    const canSwipeLeft = rtlEnabled
      ? selectedIndex > firstAvailableIndex
      : selectedIndex < lastAvailableIndex;
    const canSwipeRight = rtlEnabled
      ? selectedIndex < lastAvailableIndex
      : selectedIndex > firstAvailableIndex;

    e.maxLeftOffset = toNumber(!!loop || canSwipeLeft);
    e.maxRightOffset = toNumber(!!loop || canSwipeRight);
  }

  _swipeUpdateHandler(e: DxEvent<SwipeUpdateEvent>): void {
    const { offset } = e;
    const swipeDirection = sign(offset) * this._getRTLSignCorrection();

    const { selectedIndex } = this.option();

    if (!isDefined(selectedIndex)) {
      return;
    }

    const newIndex = this._normalizeIndex(selectedIndex - swipeDirection, swipeDirection);

    if (selectedIndex === newIndex) {
      return;
    }
    _translator.move(this._$itemContainer, offset * this._itemWidth());
    this._updateItems(selectedIndex, newIndex);
  }

  _findNextAvailableIndex(index: number, offset: number): number {
    if (!isDefined(this._boundaryIndices)) {
      return index;
    }

    const { items = [], loop } = this.option();
    const {
      firstAvailableIndex,
      lastAvailableIndex,
      firstTrueIndex,
      lastTrueIndex,
    } = this._boundaryIndices;

    const isFirstActive = [firstTrueIndex, firstAvailableIndex].includes(index);
    const isLastActive = [lastTrueIndex, lastAvailableIndex].includes(index);

    if (loop) {
      if (isFirstActive && offset < 0) {
        return lastAvailableIndex;
      }

      if (isLastActive && offset > 0) {
        return firstAvailableIndex;
      }
    }

    for (let i = index + offset; i >= firstAvailableIndex && i <= lastAvailableIndex; i += offset) {
      const isDisabled = Boolean(items[i].disabled);
      const isVisible = this._isItemVisible(i);

      if (!isDisabled && isVisible) {
        return i;
      }
    }

    return index;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _postprocessSwipe(args: { swipedTabsIndex: number }): void {}

  _swipeEndHandler(e: DxEvent<SwipeEndEvent>): void {
    const targetOffset = e.targetOffset * this._getRTLSignCorrection();

    if (targetOffset) {
      const { selectedIndex } = this.option();

      if (!isDefined(selectedIndex)) {
        return;
      }

      const newSelectedIndex = this._findNextAvailableIndex(selectedIndex, -targetOffset);
      this
        .selectItem(newSelectedIndex)
        // @ts-expect-error ts-error
        .fail(() => {
          this._animateItemContainer(0, noop);
        })
        .done(() => {
          this._postprocessSwipe({ swipedTabsIndex: newSelectedIndex });
        });

      // TODO: change focusedElement on focusedItem
      const $selectedElement = this.itemElements().filter('.dx-item-selected');
      const { focusStateEnabled } = this.option();

      if (focusStateEnabled) {
        this.option('focusedElement', getPublicElement($selectedElement));
      }
    } else {
      this._animateItemContainer(0, noop);
    }
  }

  _getItemFocusLoopSignCorrection(): number {
    return this._itemFocusLooped ? -1 : 1;
  }

  _moveFocus(location: string, e?: DxEvent<KeyboardEvent>): void {
    super._moveFocus(location, e);

    this._itemFocusLooped = false;
  }

  _prevItem($items: dxElementWrapper): dxElementWrapper {
    const $result = super._prevItem($items);

    this._itemFocusLooped = $result.is($items.last());

    return $result;
  }

  _nextItem($items: dxElementWrapper): dxElementWrapper {
    const $result = super._nextItem($items);

    this._itemFocusLooped = $result.is($items.first());

    return $result;
  }

  _dimensionChanged(): void {
    this._clearItemWidthCache();
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _updateSwipeDisabledState(): void {
    const disabled = this._getSwipeDisabledState();
    Swipeable.getInstance(this.$element()).option('disabled', disabled);
  }

  _dispose(): void {
    delete this._boundaryIndices;

    super._dispose();
  }

  _itemOptionChanged(
    item: Item,
    property: keyof Item,
    value: unknown,
    prevValue?: unknown,
  ): void {
    super._itemOptionChanged(item, property, value, prevValue);

    const { selectedItem } = this.option();

    if (property === 'visible' && item === selectedItem) {
      this._ensureSelectedItemIsVisible();
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { value } = args;

    switch (args.name) {
      case 'loop':
        this.option('loopItemFocus', value);
        break;
      case 'animationEnabled':
        break;
      case 'swipeEnabled':
        this._updateSwipeDisabledState();
        break;
      case 'deferRendering':
        this._invalidate();
        break;
      case 'items':
        this._updateSwipeDisabledState();
        this._findBoundaryIndices();
        super._optionChanged(args);
        break;
      case 'selectedIndex':
        if (this._isItemVisible(value as TProperties['selectedIndex'])) {
          super._optionChanged(args);
        } else {
          this._ensureSelectedItemIsVisible();
        }
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxMultiView', MultiView);

export default MultiView;
