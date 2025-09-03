/* eslint-disable max-classes-per-file */
import type { SingleOrMultiple } from '@js/common';
import type { AnimationConfig } from '@js/common/core/animation';
import { fx } from '@js/common/core/animation';
import { move } from '@js/common/core/animation/translator';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import Swipeable from '@js/common/core/events/gesture/swipeable';
import { addNamespace } from '@js/common/core/events/utils';
import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import type { DataSourceOptions } from '@js/common/data';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import {
  getOuterHeight, getOuterWidth, getWidth, setOuterWidth,
} from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import type { Item, Properties } from '@js/ui/gallery';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys, WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import type { SwipeEndEvent, SwipeStartEvent, SwipeUpdateEvent } from '@ts/events/m_swipe';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';

import type { CollectionItemKey } from './collection/collection_widget.base';

const GALLERY_CLASS = 'dx-gallery';
const GALLERY_INDICATOR_VISIBLE_CLASS = 'dx-gallery-indicator-visible';
const GALLERY_WRAPPER_CLASS = `${GALLERY_CLASS}-wrapper`;
const GALLERY_LOOP_CLASS = 'dx-gallery-loop';
const GALLERY_ITEM_CONTAINER_CLASS = `${GALLERY_CLASS}-container`;
const GALLERY_ACTIVE_CLASS = `${GALLERY_CLASS}-active`;

const GALLERY_ITEM_CLASS = `${GALLERY_CLASS}-item`;
const GALLERY_INVISIBLE_ITEM_CLASS = `${GALLERY_CLASS}-item-invisible`;
const GALLERY_LOOP_ITEM_CLASS = `${GALLERY_ITEM_CLASS}-loop`;
const GALLERY_ITEM_SELECTOR = `.${GALLERY_ITEM_CLASS}`;
const GALLERY_ITEM_SELECTED_CLASS = `${GALLERY_ITEM_CLASS}-selected`;

const GALLERY_INDICATOR_CLASS = `${GALLERY_CLASS}-indicator`;
const GALLERY_INDICATOR_ITEM_CLASS = `${GALLERY_INDICATOR_CLASS}-item`;
const GALLERY_INDICATOR_ITEM_SELECTOR = `.${GALLERY_INDICATOR_ITEM_CLASS}`;
const GALLERY_INDICATOR_ITEM_SELECTED_CLASS = `${GALLERY_INDICATOR_ITEM_CLASS}-selected`;
const ITEM_CONTENT_SELECTOR = '.dx-item-content';

const GALLERY_IMAGE_CLASS = 'dx-gallery-item-image';

const GALLERY_ITEM_DATA_KEY = 'dxGalleryItemData';

const MAX_CALC_ERROR = 1;

export interface GalleryNavButtonProperties extends WidgetProperties<GalleryNavButton> {
  direction?: string;
  onClick?: ((e: ClickEvent) => void) | null;
}

class GalleryNavButton extends Widget<GalleryNavButtonProperties> {
  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      pageUp: noop,
      pageDown: noop,
    };
  }

  _getDefaultOptions(): GalleryNavButtonProperties {
    return {
      ...super._getDefaultOptions(),
      direction: 'next',
      onClick: null,
      hoverStateEnabled: true,
      activeStateEnabled: true,
    };
  }

  _render(): void {
    super._render();

    const $element = this.$element();
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);

    const { direction } = this.option();

    $element.addClass(`${GALLERY_CLASS}-nav-button-${direction}`);

    eventsEngine.off($element, eventName);
    eventsEngine.on($element, eventName, (e) => {
      this._createActionByOption('onClick')({ event: e });
    });
  }

  _optionChanged(args: OptionChanged<GalleryNavButtonProperties>): void {
    switch (args.name) {
      case 'onClick':
      case 'direction':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export interface GalleryProperties extends Properties<Item>, Omit<
  CollectionWidgetEditProperties<Gallery, Item>,
  keyof Properties<Item>
> {
  selectionMode?: SingleOrMultiple;
}

class Gallery extends CollectionWidget<GalleryProperties, Item, CollectionItemKey> {
  private static _wasAnyItemTemplateRendered?: boolean | null = false;

  _deferredAnimate?: DeferredObj<unknown>;

  _needLongMove?: boolean;

  _animationOverride?: boolean;

  _goToGhostItem?: boolean;

  _userInteraction?: boolean;

  _$container!: dxElementWrapper;

  _$wrapper!: dxElementWrapper;

  // eslint-disable-next-line no-restricted-globals
  _slideshowTimer?: ReturnType<typeof setTimeout>;

  _cacheElementWidth?: number;

  _prevNavButton?: dxElementWrapper;

  _nextNavButton?: dxElementWrapper;

  _$indicator?: dxElementWrapper;

  protected _activeStateUnit(): string {
    return GALLERY_ITEM_SELECTOR;
  }

  _getDefaultOptions(): GalleryProperties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: false,
      animationDuration: 400,
      animationEnabled: true,
      loop: false,
      swipeEnabled: true,
      indicatorEnabled: true,
      showIndicator: true,
      selectedIndex: 0,
      slideshowDelay: 0,
      showNavButtons: false,
      wrapAround: false,
      stretchImages: false,
      loopItemFocus: false,
      selectOnFocus: true,
      selectionMode: 'single',
      selectionRequired: true,
      selectByClick: false,
      _itemAttributes: {
        role: 'option',
        'aria-label': messageLocalization.format('dxGallery-itemName'),
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    return [
      ...super._defaultOptionsRules(),
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ];
  }

  _init(): void {
    super._init();

    const { loop } = this.option();

    this.option('loopItemFocus', loop);
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container: dxElementWrapper, data: Item) => {
        const $img = $('<img>').addClass(GALLERY_IMAGE_CLASS);

        if (isPlainObject(data)) {
          this._prepareDefaultItemTemplate(data, $container);
          // @ts-expect-error ts-error
          $img.attr({
            src: data.imageSrc,
            alt: data.imageAlt,
          }).appendTo($container);
        } else {
          $img.attr('src', String(data)).appendTo($container);
        }
      }, ['imageSrc', 'imageAlt', 'text', 'html'], this.option('integrationOptions.watchMethod')),
    });
  }

  _dataSourceOptions(): DataSourceOptions<Item> {
    return {
      paginate: false,
    };
  }

  _itemContainer(): dxElementWrapper {
    return this._$container;
  }

  _itemClass(): string {
    return GALLERY_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return GALLERY_ITEM_DATA_KEY;
  }

  _actualItemWidth(): number {
    const { wrapAround, stretchImages } = this.option();

    if (stretchImages) {
      const itemPerPage = wrapAround ? this._itemsPerPage() + 1 : this._itemsPerPage();
      return 1 / itemPerPage;
    }

    if (wrapAround) {
      return (this._itemPercentWidth() * this._itemsPerPage()) / (this._itemsPerPage() + 1);
    }

    return this._itemPercentWidth();
  }

  _itemPercentWidth(): number {
    const elementWidth: number = getOuterWidth(this.$element());
    const { initialItemWidth } = this.option();

    if (initialItemWidth && initialItemWidth <= elementWidth) {
      return initialItemWidth / elementWidth;
    }

    return 1;
  }

  _itemsPerPage(): number {
    const itemsPerPage = hasWindow() ? Math.floor(1 / this._itemPercentWidth()) : 1;

    return Math.min(itemsPerPage, this._itemsCount());
  }

  _pagesCount(): number {
    return Math.ceil(this._itemsCount() / this._itemsPerPage());
  }

  _itemsCount(): number {
    const { items = [] } = this.option();

    return items.length;
  }

  _offsetDirection(): number {
    const { rtlEnabled } = this.option();

    return rtlEnabled ? -1 : 1;
  }

  _initMarkup(): void {
    this._renderWrapper();
    this._renderItemsContainer();

    this.$element().addClass(GALLERY_CLASS);

    const { loop } = this.option();

    this.$element().toggleClass(GALLERY_LOOP_CLASS, loop);

    super._initMarkup();

    const useListBoxRole = this._itemsCount() > 0;
    const ariaAttrs = {
      role: useListBoxRole ? 'listbox' : undefined,
      label: 'gallery',
    };

    this.setAria(ariaAttrs);
  }

  _render(): void {
    this._renderDragHandler();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderContainerPosition();
    this._renderItemSizes();
    this._renderItemPositions();

    this._renderNavButtons();
    this._renderIndicator();
    this._renderSelectedItem();
    this._renderItemVisibility();
    this._renderUserInteraction();

    this._setupSlideShow();

    this._reviseDimensions();

    super._render();
  }

  _dimensionChanged(): void {
    const { selectedIndex = 0 } = this.option();

    this._stopItemAnimations();
    this._clearCacheWidth();

    this._cloneDuplicateItems();

    this._renderItemSizes();
    this._renderItemPositions();
    this._renderIndicator();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderContainerPosition(this._calculateIndexOffset(selectedIndex), true);
    this._renderItemVisibility();
  }

  _renderDragHandler(): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace('dragstart', this.NAME);

    eventsEngine.off(this.$element(), eventName);
    eventsEngine.on(this.$element(), eventName, 'img', () => false);
  }

  _renderWrapper(): void {
    if (this._$wrapper) {
      return;
    }
    this._$wrapper = $('<div>')
      .addClass(GALLERY_WRAPPER_CLASS)
      .appendTo(this.$element());
  }

  _renderItems(items: Item[]): void {
    if (!hasWindow()) {
      const { selectedIndex = 0 } = this.option();
      // eslint-disable-next-line no-param-reassign
      items = items.length > selectedIndex
        ? items.slice(selectedIndex, selectedIndex + 1)
        : items.slice(0, 1);
    }
    super._renderItems(items);

    this._loadNextPageIfNeeded();
  }

  _onItemTemplateRendered() {
    return (): void => {
      if (!Gallery._wasAnyItemTemplateRendered) {
        Gallery._wasAnyItemTemplateRendered = true;
        triggerResizeEvent(this.$element()); // NOTE: T1132935
      }
    };
  }

  _renderItemsContainer(): void {
    if (this._$container) {
      return;
    }
    this._$container = $('<div>')
      .addClass(GALLERY_ITEM_CONTAINER_CLASS)
      .appendTo(this._$wrapper);
  }

  _cloneDuplicateItems(): void {
    const { loop, items = [] } = this.option();
    const itemsCount = items.length;

    if (!loop || !itemsCount) {
      return;
    }

    this._getLoopedItems().remove();

    const lastItemIndex = itemsCount - 1;
    const duplicateCount = Math.min(this._itemsPerPage(), itemsCount);

    const $items = this._getRealItems();
    const $container = this._itemContainer();

    for (let i = 0; i < duplicateCount; i += 1) {
      this._cloneItemForDuplicate($items[i], $container);
    }

    for (let i = 0; i < duplicateCount; i += 1) {
      this._cloneItemForDuplicate($items[lastItemIndex - i], $container);
    }
  }

  _cloneItemForDuplicate(item: Element, $container: dxElementWrapper): void {
    if (item) {
      const $clonedItem = $(item)
        // @ts-expect-error ts-error
        .clone(false)
        .addClass(GALLERY_LOOP_ITEM_CLASS)
        .removeAttr('id')
        .css('margin', 0)
        .appendTo($container);

      this.setAria({ hidden: true }, $clonedItem);
    }
  }

  _getRealItems(): dxElementWrapper {
    const selector = `.${GALLERY_ITEM_CLASS}:not(.${GALLERY_LOOP_ITEM_CLASS})`;
    return this.$element().find(selector);
  }

  _getLoopedItems(): dxElementWrapper {
    return this.$element().find(`.${GALLERY_LOOP_ITEM_CLASS}`);
  }

  _emptyMessageContainer(): dxElementWrapper {
    return this._$wrapper;
  }

  _renderItemSizes(startIndex?: number): void {
    let $items = this._itemElements();
    const itemWidth = this._actualItemWidth();

    if (startIndex !== undefined) {
      $items = $items.slice(startIndex);
    }

    $items.each((_index: number, element: Element): boolean => {
      setOuterWidth($(element), `${itemWidth * 100}%`);
      return true;
    });
  }

  _renderItemPositions(): void {
    const { rtlEnabled, wrapAround, selectedIndex = 0 } = this.option();
    const itemWidth = this._actualItemWidth();
    const itemsCount = this._itemsCount();
    const itemsPerPage = this._itemsPerPage();
    const loopItemsCount = this.$element().find(`.${GALLERY_LOOP_ITEM_CLASS}`).length;
    const lastItemDuplicateIndex = itemsCount + loopItemsCount - 1;
    const offsetRatio = wrapAround ? 0.5 : 0;
    const freeSpace = this._itemFreeSpace();
    const isGapBetweenImages = !!freeSpace;
    const side = rtlEnabled ? 'Right' : 'Left';

    this._itemElements().each((index: number, item: Element): boolean => {
      let realIndex = index;
      const isLoopItem = $(item).hasClass(GALLERY_LOOP_ITEM_CLASS);

      if (index > itemsCount + itemsPerPage - 1) {
        realIndex = lastItemDuplicateIndex - realIndex - itemsPerPage;
      }

      if (!isLoopItem && realIndex !== 0) {
        if (isGapBetweenImages) {
          $(item).css(`margin${side}`, `${freeSpace * 100}%`);
        }
        return true;
      }

      const itemPosition = itemWidth * (realIndex + offsetRatio)
        + freeSpace * (realIndex + 1 - offsetRatio);
      const property = isLoopItem ? side.toLowerCase() : `margin${side}`;

      $(item).css(property, `${itemPosition * 100}%`);
      return true;
    });

    this._relocateItems(selectedIndex, selectedIndex, true);
  }

  _itemFreeSpace(): number {
    const { wrapAround } = this.option();
    const itemsPerPage = wrapAround ? this._itemsPerPage() + 1 : this._itemsPerPage();

    return (1 - this._actualItemWidth() * itemsPerPage) / (itemsPerPage + 1);
  }

  _renderContainerPosition(offset = 0, hideItems?: boolean, animate?: boolean): Promise<unknown> {
    this._releaseInvisibleItems();

    const itemWidth = this._actualItemWidth();
    const targetPosition = this._offsetDirection() * offset * (itemWidth + this._itemFreeSpace());
    let showAnimation = animate;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let positionReady: DeferredObj<unknown>;

    if (isDefined(this._animationOverride)) {
      showAnimation = this._animationOverride;
      delete this._animationOverride;
    }

    if (showAnimation) {
      this._startSwipe();
      positionReady = this._animate(targetPosition).done(this._endSwipe);
    } else {
      move(this._$container, {
        // @ts-expect-error ts-error
        left: targetPosition * this._elementWidth(),
        top: 0,
      });
      // @ts-expect-error ts-error
      positionReady = Deferred().resolveWith(this);
    }

    positionReady.done(() => {
      // @ts-expect-error ts-error
      this._deferredAnimate?.resolveWith(this);
      if (hideItems) {
        this._renderItemVisibility();
      }
    });

    return positionReady.promise();
  }

  _startSwipe(): void {
    this.$element().addClass(GALLERY_ACTIVE_CLASS);
  }

  _endSwipe(): void {
    this.$element().removeClass(GALLERY_ACTIVE_CLASS);
  }

  _animate(targetPosition: number, extraConfig: AnimationConfig = {}): DeferredObj<unknown> {
    const $container = this._$container;
    const animationComplete = Deferred();
    const { animationDuration } = this.option();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fx.animate(
      this._$container.get(0),
      {
        type: 'slide',
        to: {
          left: targetPosition * (this._elementWidth() ?? 0),
        },
        duration: animationDuration,
        complete() {
          if (that._needMoveContainerForward()) {
            move($container, { left: 0, top: 0 });
          }

          if (that._needMoveContainerBack()) {
            move($container, {
              left: that._maxContainerOffset() * (that._elementWidth() ?? 0),
              top: 0,
            });
          }
          // @ts-expect-error ts-error
          animationComplete.resolveWith(that);
        },
        ...extraConfig,
      },
    );

    return animationComplete;
  }

  _needMoveContainerForward(): boolean {
    const expectedPosition = (this._$container.position()?.left ?? 0) * this._offsetDirection();
    const actualPosition = -this._maxItemWidth() * (this._elementWidth() ?? 0) * this._itemsCount();

    return expectedPosition <= actualPosition + MAX_CALC_ERROR;
  }

  _needMoveContainerBack(): boolean {
    const expectedPosition = (this._$container.position()?.left ?? 0) * this._offsetDirection();
    const actualPosition = this._actualItemWidth() * (this._elementWidth() ?? 0);

    return expectedPosition >= actualPosition - MAX_CALC_ERROR;
  }

  _maxContainerOffset(): number {
    const itemOutPageCount = this._itemsCount() - this._itemsPerPage();

    return -this._maxItemWidth() * itemOutPageCount * this._offsetDirection();
  }

  _maxItemWidth(): number {
    return this._actualItemWidth() + this._itemFreeSpace();
  }

  _reviseDimensions(): void {
    const $firstItem = this._itemElements().first().find(ITEM_CONTENT_SELECTOR);

    if (!$firstItem || $firstItem.is(':hidden')) {
      return;
    }

    const { height, width } = this.option();

    if (!height) {
      this.option('height', getOuterHeight($firstItem));
    }
    if (!width) {
      this.option('width', getOuterWidth($firstItem));
    }

    this._dimensionChanged();
  }

  _renderIndicator(): void {
    const { showIndicator } = this.option();
    this._cleanIndicators();
    this.$element().toggleClass(GALLERY_INDICATOR_VISIBLE_CLASS, showIndicator);

    if (!showIndicator) {
      return;
    }

    this._$indicator = $('<div>')
      .addClass(GALLERY_INDICATOR_CLASS)
      .appendTo(this._$wrapper);

    const { indicatorEnabled } = this.option();

    for (let i = 0; i < this._pagesCount(); i += 1) {
      const $indicatorItem = $('<div>').addClass(GALLERY_INDICATOR_ITEM_CLASS).appendTo(this._$indicator);

      if (indicatorEnabled) {
        this._attachIndicatorClickHandler($indicatorItem, i);
      }
    }

    this._renderSelectedPageIndicator();
  }

  _attachIndicatorClickHandler($element: dxElementWrapper, index: number): void {
    // @ts-expect-error ts-error
    eventsEngine.on($element, addNamespace(clickEventName, this.NAME), (event: DxEvent) => {
      this._indicatorSelectHandler(event, index);
    });
  }

  _detachIndicatorClickHandler($element: dxElementWrapper): void {
    // @ts-expect-error ts-error
    eventsEngine.off($element, addNamespace(clickEventName, this.NAME));
  }

  _toggleIndicatorInteraction(clickEnabled: boolean | undefined): void {
    const $indicatorItems = this._$indicator?.find(GALLERY_INDICATOR_ITEM_SELECTOR) ?? $();

    if ($indicatorItems.length) {
      $indicatorItems.each((index: number, element: Element): boolean => {
        if (clickEnabled) {
          this._attachIndicatorClickHandler($(element), index);
        } else {
          this._detachIndicatorClickHandler($(element));
        }
        return true;
      });
    }
  }

  _cleanIndicators(): void {
    if (this._$indicator) {
      this._$indicator.remove();
    }
  }

  _renderSelectedItem(): void {
    const { selectedIndex } = this.option();

    this._itemElements().removeClass(GALLERY_ITEM_SELECTED_CLASS);

    if (isDefined(selectedIndex)) {
      this._itemElements()
        .eq(selectedIndex)
        .addClass(GALLERY_ITEM_SELECTED_CLASS);
    }
  }

  _renderItemVisibility(): void {
    const { initialItemWidth, wrapAround, selectedIndex } = this.option();

    if (initialItemWidth || wrapAround) {
      this._releaseInvisibleItems();
      return;
    }

    this._itemElements().each((index: number, item: Element): boolean => {
      if (selectedIndex !== index) {
        $(item).find(ITEM_CONTENT_SELECTOR).addClass(GALLERY_INVISIBLE_ITEM_CLASS);
      }
      return true;
    });
  }

  _releaseInvisibleItems(): void {
    this._itemElements()
      .find(ITEM_CONTENT_SELECTOR)
      .removeClass(GALLERY_INVISIBLE_ITEM_CLASS);
  }

  _renderSelectedPageIndicator(): void {
    if (!this._$indicator) {
      return;
    }

    const { selectedIndex = 0 } = this.option();
    const lastIndex = this._pagesCount() - 1;
    let pageIndex = Math.ceil(selectedIndex / this._itemsPerPage());

    pageIndex = Math.min(lastIndex, pageIndex);

    this._$indicator
      .find(GALLERY_INDICATOR_ITEM_SELECTOR)
      .removeClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS)
      .eq(pageIndex)
      .addClass(GALLERY_INDICATOR_ITEM_SELECTED_CLASS);
  }

  _renderUserInteraction(): void {
    const { swipeEnabled: swipeEnabledOption, disabled } = this.option();
    const rootElement = this.$element();
    const swipeEnabled = swipeEnabledOption && this._itemsCount() > 1;

    this._createComponent(rootElement, Swipeable, {
      disabled: !!disabled || !swipeEnabled,
      onStart: (e) => {
        const { event } = e;
        this._swipeStartHandler(event);
      },
      onUpdated: (e) => {
        const { event } = e;
        this._swipeUpdateHandler(event);
      },
      onEnd: (e) => {
        const { event } = e;
        this._swipeEndHandler(event);
      },
      // @ts-expect-error ts-error
      itemSizeFunc: this._elementWidth.bind(this),
    });
  }

  _indicatorSelectHandler(_e: DxEvent, indicatorIndex: number): void {
    const { indicatorEnabled } = this.option();

    if (!indicatorEnabled) {
      return;
    }

    const itemIndex = this._fitPaginatedIndex(indicatorIndex * this._itemsPerPage());

    this._needLongMove = true;

    this.option('selectedIndex', itemIndex);
    this._loadNextPageIfNeeded(itemIndex);
  }

  _renderNavButtons(): void {
    const { showNavButtons } = this.option();

    if (!showNavButtons) {
      this._cleanNavButtons();
      return;
    }

    const nextPage = this._nextPage.bind(this);
    const prevPage = this._prevPage.bind(this);

    this._prevNavButton = $('<div>').appendTo(this._$wrapper);
    this._createComponent(this._prevNavButton, GalleryNavButton, {
      direction: 'prev',
      onClick() {
        prevPage();
      },
    });

    this._nextNavButton = $('<div>').appendTo(this._$wrapper);
    this._createComponent(this._nextNavButton, GalleryNavButton, {
      direction: 'next',
      onClick() {
        nextPage();
      },
    });

    this._renderNavButtonsVisibility();
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _prevPage(): DeferredObj<unknown> | void {
    const visiblePageSize = this._itemsPerPage();
    const { selectedIndex = 0 } = this.option();
    const newSelectedIndex = selectedIndex - visiblePageSize;

    if (newSelectedIndex === -visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    }

    return this.goToItem(this._fitPaginatedIndex(newSelectedIndex));
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _nextPage(): DeferredObj<unknown> | void {
    const visiblePageSize = this._itemsPerPage();
    const { selectedIndex = 0 } = this.option();
    const newSelectedIndex = selectedIndex + visiblePageSize;

    if (newSelectedIndex === visiblePageSize && visiblePageSize === this._itemsCount()) {
      return this._relocateItems(newSelectedIndex, 0);
    }

    return (this.goToItem(this._fitPaginatedIndex(newSelectedIndex)) as DeferredObj<number>).done(
      this._loadNextPageIfNeeded,
    );
  }

  _loadNextPageIfNeeded(index?: number): void {
    const { selectedIndex: selectedIndexOption = 0 } = this.option();
    const selectedIndex = index ?? selectedIndexOption;

    if (
    // @ts-expect-error ts-error
      this._dataSource?.paginate()
        && this._shouldLoadNextPage(selectedIndex)
        // @ts-expect-error ts-error
        && !this._isDataSourceLoading()
        // @ts-expect-error ts-error
        && !this._isLastPage()
    ) {
      this._loadNextPage().done(() => {
        this._renderIndicator();
        this._cloneDuplicateItems();
        this._renderItemPositions();
        this._renderNavButtonsVisibility();
        this._renderItemSizes(selectedIndex);
      });
    }
  }

  _shouldLoadNextPage(selectedIndex: number): boolean {
    const visiblePageSize = this._itemsPerPage();
    const { items = [] } = this.option();

    return selectedIndex + 2 * visiblePageSize > items.length;
  }

  _allowDynamicItemsAppend(): boolean {
    return true;
  }

  _fitPaginatedIndex(itemIndex: number): number {
    const itemsPerPage = this._itemsPerPage();
    const restItemsCount = itemIndex < 0
      ? itemsPerPage + itemIndex
      : this._itemsCount() - itemIndex;

    if (itemIndex > this._itemsCount() - 1) {
      this._goToGhostItem = true;

      return 0;
    }

    if (restItemsCount < itemsPerPage && restItemsCount > 0) {
      if (itemIndex > 0) {
        return itemIndex - itemsPerPage + restItemsCount;
      }

      return itemIndex + itemsPerPage - restItemsCount;
    }

    return itemIndex;
  }

  _cleanNavButtons(): void {
    if (this._prevNavButton) {
      this._prevNavButton.remove();
      delete this._prevNavButton;
    }
    if (this._nextNavButton) {
      this._nextNavButton.remove();
      delete this._nextNavButton;
    }
  }

  _renderNavButtonsVisibility(): void {
    const { showNavButtons, selectedIndex, loop } = this.option();

    if (!showNavButtons || !this._prevNavButton || !this._nextNavButton) {
      return;
    }

    const itemsCount = this._itemsCount();

    this._prevNavButton.show();
    this._nextNavButton.show();

    if (itemsCount === 0) {
      this._prevNavButton.hide();
      this._nextNavButton.hide();
    }

    if (loop) {
      return;
    }

    let nextHidden = selectedIndex === itemsCount - this._itemsPerPage();
    const prevHidden = itemsCount < 2 || selectedIndex === 0;

    // @ts-expect-error ts-error
    if (this._dataSource?.paginate()) {
      // @ts-expect-error ts-error
      nextHidden = nextHidden && this._isLastPage();
    } else {
      nextHidden = nextHidden || itemsCount < 2;
    }

    if (prevHidden) {
      this._prevNavButton.hide();
    }
    if (nextHidden) {
      this._nextNavButton.hide();
    }
  }

  _getUserInteraction(): boolean | undefined {
    return this._userInteraction;
  }

  _setupSlideShow(): void {
    const { slideshowDelay } = this.option();

    clearTimeout(this._slideshowTimer);

    if (!slideshowDelay) {
      return;
    }

    const getUserInteraction = this._getUserInteraction.bind(this);
    const setupSlideShow = this._setupSlideShow.bind(this);
    const nextItem = this.nextItem.bind(this);

    // eslint-disable-next-line no-restricted-globals
    this._slideshowTimer = setTimeout(() => {
      if (getUserInteraction()) {
        setupSlideShow();

        return;
      }
      nextItem(true).done(setupSlideShow);
    }, slideshowDelay);
  }

  _elementWidth(): number | undefined {
    if (!this._cacheElementWidth) {
      this._cacheElementWidth = getWidth(this.$element());
    }

    return this._cacheElementWidth;
  }

  _clearCacheWidth(): void {
    delete this._cacheElementWidth;
  }

  _swipeStartHandler(event: SwipeStartEvent): void {
    this._releaseInvisibleItems();

    this._clearCacheWidth();
    this._elementWidth();

    const itemsCount = this._itemsCount();

    if (!itemsCount) {
      event.cancel = true;
      return;
    }

    this._stopItemAnimations();
    this._startSwipe();
    this._userInteraction = true;
    const { selectedIndex = 0, rtlEnabled, loop } = this.option();

    if (!loop) {
      const startOffset = itemsCount - selectedIndex - this._itemsPerPage();
      const endOffset = selectedIndex;

      event.maxLeftOffset = rtlEnabled ? endOffset : startOffset;
      event.maxRightOffset = rtlEnabled ? startOffset : endOffset;
    }
  }

  _stopItemAnimations(): void {
    fx.stop(this._$container.get(0), true);
  }

  _swipeUpdateHandler(event: SwipeUpdateEvent): void {
    const { selectedIndex = 0, wrapAround } = this.option();

    const wrapAroundRatio = wrapAround ? 1 : 0;
    const itemsPerPage = this._itemsPerPage() + wrapAroundRatio;
    const offset = this._offsetDirection() * event.offset * itemsPerPage - selectedIndex;

    if (offset < 0) {
      this._loadNextPageIfNeeded(Math.ceil(Math.abs(offset)));
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderContainerPosition(offset);
  }

  _swipeEndHandler(event: SwipeEndEvent): void {
    const targetOffset = event.targetOffset * this._offsetDirection() * this._itemsPerPage();
    const { selectedIndex = 0 } = this.option();
    const newIndex = this._fitIndex(selectedIndex - targetOffset);
    const paginatedIndex = this._fitPaginatedIndex(newIndex);

    if (Math.abs(targetOffset) < this._itemsPerPage()) {
      this._relocateItems(selectedIndex);
      return;
    }

    if (this._itemsPerPage() === this._itemsCount()) {
      if (targetOffset > 0) {
        this._relocateItems(-targetOffset);
      } else {
        this._relocateItems(0);
      }

      return;
    }

    this.option('selectedIndex', paginatedIndex);
  }

  _setFocusOnSelect(): void {
    this._userInteraction = true;

    const selectedItem = this._getRealItems().filter(`.${GALLERY_ITEM_SELECTED_CLASS}`);
    this.option('focusedElement', getPublicElement(selectedItem));
    this._userInteraction = false;
  }

  _fitIndex(index: number): number {
    const { loop } = this.option();

    if (!loop) {
      return index;
    }

    const itemsCount = this._itemsCount();
    let fittedIndex = index;

    if (fittedIndex >= itemsCount || fittedIndex < 0) {
      this._goToGhostItem = true;
    }

    if (fittedIndex >= itemsCount) {
      fittedIndex = itemsCount - fittedIndex;
    }

    fittedIndex %= itemsCount;

    if (fittedIndex < 0) {
      fittedIndex += itemsCount;
    }

    return fittedIndex;
  }

  _clean(): void {
    super._clean();
    this._cleanIndicators();
    this._cleanNavButtons();
  }

  _dispose(): void {
    Gallery._wasAnyItemTemplateRendered = null;
    clearTimeout(this._slideshowTimer);
    super._dispose();
  }

  _updateSelection(addedSelection: number[], removedSelection: number[]): void {
    this._stopItemAnimations();
    this._renderNavButtonsVisibility();

    this._renderSelectedItem();

    this._relocateItems(addedSelection[0], removedSelection[0]);

    this._renderSelectedPageIndicator();
  }

  _relocateItems(newIndex: number, prevIndex?: number, withoutAnimation?: boolean): void {
    const indexOffset = this._calculateIndexOffset(newIndex, prevIndex ?? newIndex);
    const { animationEnabled } = this.option();

    this._renderContainerPosition(indexOffset, true, animationEnabled && !withoutAnimation)
      // @ts-expect-error ts-error
      // eslint-disable-next-line func-names
      .done(function () {
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._setFocusOnSelect();
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._userInteraction = false;
        // eslint-disable-next-line @typescript-eslint/no-invalid-this
        this._setupSlideShow();
      });
  }

  _focusInHandler(e: DxEvent): void {
    if (fx.isAnimating(this._$container.get(0)) || this._userInteraction) {
      return;
    }

    super._focusInHandler(e);
  }

  _focusOutHandler(e: DxEvent): void {
    if (fx.isAnimating(this._$container.get(0)) || this._userInteraction) {
      return;
    }

    super._focusOutHandler(e);
  }

  _selectFocusedItem(): void {}

  _moveFocus(location: string, e?: DxEvent<KeyboardEvent>): void {
    this._stopItemAnimations();
    super._moveFocus(location, e);

    const { focusedElement, animationEnabled } = this.option();

    const index = this.itemElements().index($(focusedElement));
    this.goToItem(index, animationEnabled);
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._reviseDimensions();
    }
  }

  _calculateIndexOffset(newIndex: number, lastIndex?: number): number {
    const { loop } = this.option();
    const prevIndex = lastIndex ?? newIndex;
    let indexOffset = prevIndex - newIndex;

    if (loop && !this._needLongMove && this._goToGhostItem) {
      if (this._isItemOnFirstPage(newIndex) && this._isItemOnLastPage(prevIndex)) {
        indexOffset = -this._itemsPerPage();
      } else if (this._isItemOnLastPage(newIndex) && this._isItemOnFirstPage(prevIndex)) {
        indexOffset = this._itemsPerPage();
      }

      this._goToGhostItem = false;
    }

    this._needLongMove = false;
    indexOffset -= prevIndex;

    return indexOffset;
  }

  _isItemOnLastPage(itemIndex: number): boolean {
    return itemIndex >= this._itemsCount() - this._itemsPerPage();
  }

  _isItemOnFirstPage(itemIndex: number): boolean {
    return itemIndex <= this._itemsPerPage();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'width':
      case 'initialItemWidth':
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'animationDuration':
        this._renderNavButtonsVisibility();
        break;
      case 'animationEnabled':
        break;
      case 'loop':
        this.$element().toggleClass(GALLERY_LOOP_CLASS, value);
        this.option('loopItemFocus', value);

        if (hasWindow()) {
          this._cloneDuplicateItems();
          this._renderItemPositions();
          this._renderNavButtonsVisibility();
        }
        break;
      case 'showIndicator':
        this._renderIndicator();
        break;
      case 'showNavButtons':
        this._renderNavButtons();
        break;
      case 'slideshowDelay':
        this._setupSlideShow();
        break;
      case 'wrapAround':
      case 'stretchImages':
        if (hasWindow()) {
          this._renderItemSizes();
          this._renderItemPositions();
          this._renderItemVisibility();
        }
        break;
      case 'swipeEnabled':
        this._renderUserInteraction();
        break;
      case 'indicatorEnabled':
        this._toggleIndicatorInteraction(value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  goToItem(itemIndex: number, animation?: boolean): DeferredObj<unknown> {
    const { selectedIndex } = this.option();
    const itemsCount = this._itemsCount();

    if (animation !== undefined) {
      this._animationOverride = animation;
    }

    const fittedIndex = this._fitIndex(itemIndex);

    this._deferredAnimate = Deferred();

    if (fittedIndex > itemsCount - 1 || fittedIndex < 0 || selectedIndex === fittedIndex) {
      // @ts-expect-error ts-error
      return this._deferredAnimate.resolveWith(this).promise();
    }

    this.option('selectedIndex', fittedIndex);
    // @ts-expect-error ts-error
    return this._deferredAnimate.promise();
  }

  prevItem(animation: boolean): DeferredObj<unknown> {
    const { selectedIndex = 0 } = this.option();

    return this.goToItem(selectedIndex - 1, animation);
  }

  nextItem(animation: boolean): DeferredObj<unknown> {
    const { selectedIndex = 0 } = this.option();

    return this.goToItem(selectedIndex + 1, animation);
  }
}

registerComponent('dxGallery', Gallery);

export default Gallery;
