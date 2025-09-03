import type { DefaultOptionsRule, Position } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { getImageContainer } from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { getHeight, getOuterWidth, getWidth } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import CollectionWidgetLiveUpdate from '@js/ui/collection/ui.collection_widget.live_update';
import type {
  Item,
  Orientation,
  Properties,
  TabsIconPosition,
  TabsStyle,
} from '@js/ui/tabs';
import { current as currentTheme, isFluent, isMaterial } from '@js/ui/themes';
import { render } from '@ts/core/utils/m_ink_ripple';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionItemInfo, InkRippleEvent } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetLiveUpdateProperties } from '@ts/ui/collection/collection_widget.live_update';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import {
  isReachedBottom, isReachedLeft, isReachedRight, isReachedTop,
} from '@ts/ui/scroll_view/utils/get_boundary_props';
import { getScrollLeftMax } from '@ts/ui/scroll_view/utils/get_scroll_left_max';

import { TABS_EXPANDED_CLASS } from './constants';
import TabsItem from './item';

// STYLE tabs

export const TABS_CLASS = 'dx-tabs';
export const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
export const TABS_STRETCHED_CLASS = 'dx-tabs-stretched';
export const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
export const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const OVERFLOW_HIDDEN_CLASS = 'dx-overflow-hidden';

export const TABS_ITEM_CLASS = 'dx-tab';
export const TABS_ITEM_SELECTED_CLASS = 'dx-tab-selected';
export const TABS_SCROLLING_ENABLED_CLASS = 'dx-tabs-scrolling-enabled';

export const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
export const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
export const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';

export const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';
export const TABS_ITEM_TEXT_SPAN_CLASS = 'dx-tab-text-span';
export const TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS = 'dx-tab-text-span-pseudo';

const STATE_DISABLED_CLASS = 'dx-state-disabled';
export const FOCUSED_DISABLED_NEXT_TAB_CLASS = 'dx-focused-disabled-next-tab';
export const FOCUSED_DISABLED_PREV_TAB_CLASS = 'dx-focused-disabled-prev-tab';

export const TABS_ORIENTATION_CLASS = {
  vertical: 'dx-tabs-vertical',
  horizontal: 'dx-tabs-horizontal',
};

export const TABS_INDICATOR_POSITION_CLASS: Record<Position, string> = {
  top: 'dx-tab-indicator-position-top',
  right: 'dx-tab-indicator-position-right',
  bottom: 'dx-tab-indicator-position-bottom',
  left: 'dx-tab-indicator-position-left',
};

export const TABS_ICON_POSITION_CLASS: Record<TabsIconPosition, string> = {
  top: 'dx-tabs-icon-position-top',
  end: 'dx-tabs-icon-position-end',
  bottom: 'dx-tabs-icon-position-bottom',
  start: 'dx-tabs-icon-position-start',
};

export const TABS_STYLING_MODE_CLASS: Record<TabsStyle, string> = {
  primary: 'dx-tabs-styling-mode-primary',
  secondary: 'dx-tabs-styling-mode-secondary',
};

const TABS_ITEM_DATA_KEY = 'dxTabData';

const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';

const FEEDBACK_HIDE_TIMEOUT = 100;
const FEEDBACK_DURATION_INTERVAL = 5;
const FEEDBACK_SCROLL_TIMEOUT = 300;

const TAB_OFFSET = 30;

const ORIENTATION: Record<Orientation, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const INDICATOR_POSITION: Record<Position, Position> = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
};

const SCROLLABLE_DIRECTION: Record<Orientation, Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const ICON_POSITION: Record<TabsIconPosition, TabsIconPosition> = {
  top: 'top',
  end: 'end',
  bottom: 'bottom',
  start: 'start',
};

const STYLING_MODE: Record<TabsStyle, TabsStyle> = {
  primary: 'primary',
  secondary: 'secondary',
};

export interface TabsProperties extends Properties, Omit<
  CollectionWidgetLiveUpdateProperties<TabsProperties>,
  keyof Properties
> {
  useInkRipple?: boolean;

  badgeExpr?: (data) => string | undefined;

  _indicatorPosition?: Position | null;
}

class Tabs extends CollectionWidgetLiveUpdate<TabsProperties> {
  static ItemClass = TabsItem;

  _scrollable?: Scrollable | null;

  // eslint-disable-next-line no-restricted-globals
  _holdInterval?: ReturnType<typeof setInterval>;

  _leftButton?: Button | null;

  _rightButton?: Button | null;

  _$wrapper!: dxElementWrapper;

  protected _activeStateUnit(): string {
    return `.${TABS_ITEM_CLASS}`;
  }

  protected _feedbackHideTimeout(): number {
    return FEEDBACK_HIDE_TIMEOUT;
  }

  _getDefaultOptions(): TabsProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      showNavButtons: true,
      scrollByContent: true,
      scrollingEnabled: true,
      selectionMode: 'single',
      orientation: ORIENTATION.horizontal,
      iconPosition: ICON_POSITION.start,
      stylingMode: STYLING_MODE.primary,
      activeStateEnabled: true,
      selectionRequired: false,
      selectOnFocus: true,
      loopItemFocus: false,
      useInkRipple: false,
      badgeExpr(data: Item): string | undefined {
        return data?.badge;
      },
      _itemAttributes: { role: 'tab' },
      _indicatorPosition: null,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TabsProperties>[] {
    const themeName = currentTheme();

    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType !== 'desktop';
        },
        options: {
          showNavButtons: false,
        },
      },
      {
        device: { deviceType: 'desktop' },
        options: {
          scrollByContent: false,
        },
      },
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device(): boolean {
          return isFluent(themeName);
        },
        options: {
          iconPosition: ICON_POSITION.top,
          stylingMode: STYLING_MODE.secondary,
        },
      },
      {
        device(): boolean {
          return isMaterial(themeName);
        },
        options: {
          useInkRipple: true,
          selectOnFocus: false,
          iconPosition: ICON_POSITION.top,
        },
      },
    ]);
  }

  _init(): void {
    const { orientation, stylingMode, scrollingEnabled } = this.option();
    const indicatorPosition = this._getIndicatorPosition();

    super._init();

    this.setAria('role', 'tablist');
    this.$element().addClass(TABS_CLASS);
    this._toggleScrollingEnabledClass(scrollingEnabled);
    this._toggleOrientationClass(orientation);
    this._toggleIndicatorPositionClass(indicatorPosition);
    this._toggleIconPositionClass();
    this._toggleStylingModeClass(stylingMode);
    this._renderWrapper();
    this._renderMultiple();
  }

  _prepareDefaultItemTemplate(data: Item, $container: dxElementWrapper): void {
    const text = isPlainObject(data) ? data?.text : data;

    if (isDefined(text)) {
      const $tabTextSpan = $('<span>').addClass(TABS_ITEM_TEXT_SPAN_CLASS);

      $tabTextSpan.text(text);

      const $tabTextSpanPseudo = $('<span>').addClass(TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS);

      $tabTextSpanPseudo.text(text);
      $tabTextSpanPseudo.appendTo($tabTextSpan);

      $tabTextSpan.appendTo($container);
    }

    if (isDefined(data.html)) {
      $container.html(data.html);
    }
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container: dxElementWrapper, data: Item) => {
        this._prepareDefaultItemTemplate(data, $container);

        const $iconElement = getImageContainer(data.icon);
        if ($iconElement) {
          $iconElement.prependTo($container);
        }

        const $tabItem = $('<div>').addClass(TABS_ITEM_TEXT_CLASS);

        $container.wrapInner($tabItem);
      }, ['text', 'html', 'icon'], this.option('integrationOptions.watchMethod')),
    });
  }

  _itemClass(): string {
    return TABS_ITEM_CLASS;
  }

  _selectedItemClass(): string {
    return TABS_ITEM_SELECTED_CLASS;
  }

  _itemDataKey(): string {
    return TABS_ITEM_DATA_KEY;
  }

  _initMarkup(): void {
    super._initMarkup();

    if (this.option('useInkRipple')) {
      this._renderInkRipple();
    }

    this.$element().addClass(OVERFLOW_HIDDEN_CLASS);

    this._attachResizeObserverSubscription();
  }

  _postProcessRenderItems(): void {
    this._renderScrolling();
  }

  _renderScrolling(): void {
    const removeClasses = [TABS_STRETCHED_CLASS, TABS_EXPANDED_CLASS, OVERFLOW_HIDDEN_CLASS];
    this.$element().removeClass(removeClasses.join(' '));

    if (this.option('scrollingEnabled') && this._isItemsSizeExceeded()) {
      if (!this._scrollable) {
        this._renderScrollable();
        this._renderNavButtons();
      }

      const scrollable = this.getScrollable();
      scrollable?.update();

      if (this.option('rtlEnabled')) {
        // @ts-expect-error ts-error
        const maxLeftOffset = getScrollLeftMax($(this.getScrollable().container()).get(0));
        scrollable?.scrollTo({ left: maxLeftOffset });
      }
      this._updateNavButtonsState();

      const { selectedItem } = this.option();

      this._scrollToItem(selectedItem);
    }

    if (!(this.option('scrollingEnabled') && this._isItemsSizeExceeded())) {
      this._cleanScrolling();

      if (this._needStretchItems()) {
        this.$element().addClass(TABS_STRETCHED_CLASS);
      }

      this.$element()
        .removeClass(TABS_NAV_BUTTONS_CLASS)
        .addClass(TABS_EXPANDED_CLASS);
    }
  }

  _isVertical(): boolean {
    const { orientation } = this.option();
    return orientation === ORIENTATION.vertical;
  }

  _isItemsSizeExceeded(): boolean {
    const isVertical = this._isVertical();

    return isVertical
      ? this._isItemsHeightExceeded()
      : this._isItemsWidthExceeded();
  }

  _isItemsWidthExceeded(): boolean {
    const $visibleItems = this._getVisibleItems();
    const tabItemTotalWidth = this._getSummaryItemsSize('width', $visibleItems, true);
    const elementWidth = getWidth(this.$element());

    if ([tabItemTotalWidth, elementWidth].includes(0)) {
      return false;
    }

    return tabItemTotalWidth > elementWidth - 1;
  }

  _isItemsHeightExceeded(): boolean {
    const $visibleItems = this._getVisibleItems();
    const itemsHeight = this._getSummaryItemsSize('height', $visibleItems, true);
    const elementHeight = getHeight(this.$element());

    return itemsHeight - 1 > elementHeight;
  }

  _needStretchItems(): boolean {
    const $visibleItems = this._getVisibleItems();
    const elementWidth = getWidth(this.$element());
    const itemsWidth = [];

    each($visibleItems, (_, item) => {
      // @ts-expect-error ts-error
      itemsWidth.push(getOuterWidth(item, true));
    });

    const maxTabItemWidth = Math.max.apply(null, itemsWidth);
    const requireWidth = elementWidth / $visibleItems.length;

    return maxTabItemWidth > requireWidth + 1;
  }

  _cleanNavButtons(): void {
    if (!this._leftButton || !this._rightButton) return;

    this._leftButton.$element().remove();
    this._rightButton.$element().remove();
    this._leftButton = null;
    this._rightButton = null;
  }

  _cleanScrolling(): void {
    if (!this._scrollable) return;

    this._$wrapper.appendTo(this.$element());

    this._scrollable.$element().remove();
    this._scrollable = null;

    this._cleanNavButtons();
  }

  _renderInkRipple(): void {
    this._inkRipple = render();
  }

  _getPointerEvent(): string {
    return pointerEvents.up;
  }

  _toggleActiveState(
    $element: dxElementWrapper,
    value: boolean,
    event: InkRippleEvent,
  ): void {
    super._toggleActiveState($element, value, event);

    if (!this._inkRipple) {
      return;
    }

    const config = {
      element: $element,
      event,
    };

    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  }

  _renderMultiple(): void {
    const { selectionMode } = this.option();

    if (selectionMode === 'multiple') {
      this.option('selectOnFocus', false);
    }
  }

  _renderWrapper(): void {
    this._$wrapper = $('<div>').addClass(TABS_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  }

  _itemContainer(): dxElementWrapper {
    return this._$wrapper;
  }

  _getScrollableDirection(): Orientation {
    const isVertical = this._isVertical();

    return isVertical
      ? SCROLLABLE_DIRECTION.vertical
      : SCROLLABLE_DIRECTION.horizontal;
  }

  _updateScrollable(): void {
    if (this.getScrollable()) {
      this._cleanScrolling();
    }

    this._renderScrolling();
  }

  _renderScrollable(): void {
    const $itemContainer = this.$element().wrapInner($('<div>').addClass(TABS_SCROLLABLE_CLASS)).children();
    const { scrollByContent } = this.option();
    this._scrollable = this._createComponent($itemContainer, Scrollable, {
      direction: this._getScrollableDirection(),
      showScrollbar: 'never',
      useKeyboard: false,
      useNative: false,
      scrollByContent,
      onScroll: () => {
        this._updateNavButtonsState();
      },
    });

    this.$element().append(this._scrollable.$element());
  }

  _scrollToItem(item: Element | undefined | null): void {
    if (!this._scrollable) return;
    const $item = this._editStrategy.getItemElement(item);
    this._scrollable.scrollToElement($item);
  }

  _itemPointerHandler(e: DxEvent): void {
    this._handleItemFocus(e);
  }

  _itemPointerUpHandler(e: DxEvent): void {
    super._itemPointerHandler(e);
  }

  _renderNavButtons(): void {
    const { showNavButtons, rtlEnabled } = this.option();

    this.$element().toggleClass(TABS_NAV_BUTTONS_CLASS, showNavButtons);

    if (!showNavButtons) {
      return;
    }

    this._leftButton = this._createNavButton(
      -TAB_OFFSET,
      rtlEnabled ? BUTTON_NEXT_ICON : BUTTON_PREV_ICON,
    );
    const $leftButton = this._leftButton.$element();

    $leftButton.addClass(TABS_LEFT_NAV_BUTTON_CLASS);

    this.$element().prepend($leftButton);

    this._rightButton = this._createNavButton(
      TAB_OFFSET,
      rtlEnabled ? BUTTON_PREV_ICON : BUTTON_NEXT_ICON,
    );
    const $rightButton = this._rightButton.$element();

    $rightButton.addClass(TABS_RIGHT_NAV_BUTTON_CLASS);

    this.$element().append($rightButton);
  }

  _updateNavButtonsAriaDisabled(): void {
    const buttons = [this._leftButton, this._rightButton];

    buttons.forEach((button) => {
      // @ts-expect-error ts-error
      button?.$element().attr({ 'aria-disabled': null });
    });
  }

  _updateNavButtonsState(): void {
    const isVertical = this._isVertical();
    const scrollable = this.getScrollable();

    if (isVertical) {
      // @ts-expect-error ts-error
      this._leftButton?.option('disabled', isReachedTop(scrollable.scrollTop(), 1));
      // @ts-expect-error ts-error
      this._rightButton?.option('disabled', isReachedBottom($(scrollable.container()).get(0), scrollable.scrollTop(), 0, 1));
    } else {
      // @ts-expect-error ts-error
      this._leftButton?.option('disabled', isReachedLeft(scrollable.scrollLeft(), 1));
      // @ts-expect-error ts-error
      this._rightButton?.option('disabled', isReachedRight($(scrollable.container()).get(0), scrollable.scrollLeft(), 1));
    }

    this._updateNavButtonsAriaDisabled();
  }

  _updateScrollPosition(offset: number, duration: number): void {
    this._scrollable?.update();
    this._scrollable?.scrollBy(offset / duration);
  }

  _createNavButton(offset: number, icon: string): Button {
    const holdAction = this._createAction(() => {
      // eslint-disable-next-line no-restricted-globals
      this._holdInterval = setInterval(() => {
        this._updateScrollPosition(offset, FEEDBACK_DURATION_INTERVAL);
      }, FEEDBACK_DURATION_INTERVAL);
    });

    const holdEventName = addNamespace(holdEvent.name, 'dxNavButton');
    const pointerUpEventName = addNamespace(pointerEvents.up, 'dxNavButton');
    const pointerOutEventName = addNamespace(pointerEvents.out, 'dxNavButton');

    const navButton = this._createComponent<Button, ButtonProperties>($('<div>').addClass(TABS_NAV_BUTTON_CLASS), Button, {
      focusStateEnabled: false,
      icon,
      // @ts-expect-error
      integrationOptions: {},
      elementAttr: {
        role: null,
        'aria-label': null,
        'aria-disabled': null,
      },
      onClick: () => {
        this._updateScrollPosition(offset, 1);
      },
    });

    const $navButton = navButton.$element();

    eventsEngine.on($navButton, holdEventName, { timeout: FEEDBACK_SCROLL_TIMEOUT }, (e) => {
      holdAction({ event: e });
    });
    eventsEngine.on($navButton, pointerUpEventName, () => {
      this._clearInterval();
    });
    eventsEngine.on($navButton, pointerOutEventName, () => {
      this._clearInterval();
    });

    return navButton;
  }

  _clearInterval(): void {
    if (this._holdInterval) clearInterval(this._holdInterval);
  }

  _updateSelection(addedSelection: number[]): void {
    if (this._scrollable) {
      return this._scrollable.scrollToElement(this.itemElements().eq(addedSelection[0]));
    }

    return undefined;
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _attachResizeObserverSubscription(): void {
    resizeObserverSingleton.unobserve(this.$element().get(0));
    resizeObserverSingleton.observe(this.$element().get(0), () => { this._dimensionChanged(); });
  }

  _dimensionChanged(): void {
    this._renderScrolling();
  }

  _enterKeyHandler(
    e: DxEvent<KeyboardEvent>,
  ): void {
    const { focusedElement } = this.option();

    super._enterKeyHandler(e);

    this.option('focusedElement', focusedElement);
  }

  _itemSelectHandler(e: DxEvent): void {
    const { selectionMode } = this.option();
    if (selectionMode === 'single' && this.isItemSelected(e.currentTarget)) {
      return;
    }

    super._itemSelectHandler(e);
  }

  _clean(): void {
    resizeObserverSingleton.unobserve(this.$element().get(0));
    this._cleanScrolling();
    super._clean();
  }

  _toggleTabsVerticalClass(value: boolean): void {
    this.$element().toggleClass(TABS_ORIENTATION_CLASS.vertical, value);
  }

  _toggleTabsHorizontalClass(value: boolean): void {
    this.$element().toggleClass(TABS_ORIENTATION_CLASS.horizontal, value);
  }

  _getIndicatorPositionClass(indicatorPosition: Position): string {
    return TABS_INDICATOR_POSITION_CLASS[indicatorPosition];
  }

  _getIndicatorPosition(): Position {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _indicatorPosition, rtlEnabled } = this.option();

    if (_indicatorPosition) {
      return _indicatorPosition;
    }

    const isVertical = this._isVertical();

    if (rtlEnabled) {
      return isVertical ? INDICATOR_POSITION.left : INDICATOR_POSITION.bottom;
    }
    return isVertical ? INDICATOR_POSITION.right : INDICATOR_POSITION.bottom;
  }

  _toggleIndicatorPositionClass(indicatorPosition: Position): void {
    const newClass = this._getIndicatorPositionClass(indicatorPosition);

    this._toggleElementClasses(TABS_INDICATOR_POSITION_CLASS, newClass);
  }

  _toggleScrollingEnabledClass(scrollingEnabled: boolean | undefined): void {
    this.$element().toggleClass(TABS_SCROLLING_ENABLED_CLASS, Boolean(scrollingEnabled));
  }

  _toggleOrientationClass(orientation: Orientation | undefined): void {
    const isVertical = orientation === ORIENTATION.vertical;

    this._toggleTabsVerticalClass(isVertical);
    this._toggleTabsHorizontalClass(!isVertical);
  }

  _getTabsIconPositionClass(): string {
    const { iconPosition } = this.option();

    switch (iconPosition) {
      case ICON_POSITION.top:
        return TABS_ICON_POSITION_CLASS.top;
      case ICON_POSITION.end:
        return TABS_ICON_POSITION_CLASS.end;
      case ICON_POSITION.bottom:
        return TABS_ICON_POSITION_CLASS.bottom;
      case ICON_POSITION.start:
      default:
        return TABS_ICON_POSITION_CLASS.start;
    }
  }

  _toggleIconPositionClass(): void {
    const newClass = this._getTabsIconPositionClass();

    this._toggleElementClasses(TABS_ICON_POSITION_CLASS, newClass);
  }

  _toggleStylingModeClass(value: TabsStyle | undefined): void {
    const newClass = TABS_STYLING_MODE_CLASS[value ?? 'primary'];

    this._toggleElementClasses(TABS_STYLING_MODE_CLASS, newClass);
  }

  _toggleElementClasses(
    classMap: Record<TabsStyle, string>
      | Record<TabsIconPosition, string>
      | Record<Position, string>,
    newClass: string,
  ): void {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in classMap) {
      this.$element().removeClass(classMap[key]);
    }

    this.$element().addClass(newClass);
  }

  _toggleFocusedDisabledNextClass(currentIndex: number, isNextDisabled: boolean): void {
    this._itemElements()
      .eq(currentIndex)
      .toggleClass(FOCUSED_DISABLED_NEXT_TAB_CLASS, isNextDisabled);
  }

  _toggleFocusedDisabledPrevClass(currentIndex: number, isPrevDisabled: boolean): void {
    this._itemElements()
      .eq(currentIndex)
      .toggleClass(FOCUSED_DISABLED_PREV_TAB_CLASS, isPrevDisabled);
  }

  _toggleFocusedDisabledClasses(value: dxElementWrapper): void {
    const { selectedIndex: currentIndex } = this.option();

    this._itemElements()
      .removeClass(FOCUSED_DISABLED_NEXT_TAB_CLASS)
      .removeClass(FOCUSED_DISABLED_PREV_TAB_CLASS);
    // @ts-expect-error ts-error
    const prevItemIndex = currentIndex - 1;
    // @ts-expect-error ts-error
    const nextItemIndex = currentIndex + 1;
    const nextFocusedIndex = $(value).index();

    const isNextDisabled = this._itemElements().eq(nextItemIndex).hasClass(STATE_DISABLED_CLASS);
    const isPrevDisabled = this._itemElements().eq(prevItemIndex).hasClass(STATE_DISABLED_CLASS);

    const shouldNextClassBeSetted = isNextDisabled && nextFocusedIndex === nextItemIndex;
    const shouldPrevClassBeSetted = isPrevDisabled && nextFocusedIndex === prevItemIndex;
    // @ts-expect-error ts-error
    this._toggleFocusedDisabledNextClass(currentIndex, shouldNextClassBeSetted);
    // @ts-expect-error ts-error
    this._toggleFocusedDisabledPrevClass(currentIndex, shouldPrevClassBeSetted);
  }

  _updateFocusedElement(): void {
    const { focusStateEnabled, selectedIndex } = this.option();
    const itemElements = this._itemElements();

    if (focusStateEnabled && itemElements.length) {
      // @ts-expect-error ts-error
      const selectedItem = itemElements.get(selectedIndex);

      this.option({ focusedElement: selectedItem });
    }
  }

  _optionChanged(args: OptionChanged<TabsProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'useInkRipple':
      case 'scrollingEnabled':
        this._toggleScrollingEnabledClass(value);
        this._invalidate();
        break;
      case 'showNavButtons':
        this._invalidate();
        break;
      case 'scrollByContent':
        this._scrollable?.option(name, value);
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'selectionMode':
        this._renderMultiple();
        super._optionChanged(args);
        break;
      case 'badgeExpr':
        this._invalidate();
        break;
      case 'focusedElement': {
        this._toggleFocusedDisabledClasses($(value));
        super._optionChanged(args);
        this._scrollToItem(value);
        break;
      }
      case 'rtlEnabled': {
        super._optionChanged(args);
        const indicatorPosition = this._getIndicatorPosition();
        this._toggleIndicatorPositionClass(indicatorPosition);
        break;
      }
      case 'orientation': {
        this._toggleOrientationClass(value);
        const indicatorPosition = this._getIndicatorPosition();
        this._toggleIndicatorPositionClass(indicatorPosition);
        if (hasWindow()) {
          this._updateScrollable();
        }
        break;
      }
      case 'iconPosition': {
        this._toggleIconPositionClass();
        if (hasWindow()) {
          this._dimensionChanged();
        }
        break;
      }
      case 'stylingMode': {
        this._toggleStylingModeClass(value);
        if (hasWindow()) {
          this._dimensionChanged();
        }
        break;
      }
      case '_indicatorPosition': {
        const indicatorPosition = this._getIndicatorPosition();
        this._toggleIndicatorPositionClass(indicatorPosition);
        break;
      }
      case 'selectedIndex':
      case 'selectedItem':
      case 'selectedItems':
        super._optionChanged(args);
        this._updateFocusedElement();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _afterItemElementInserted(): void {
    super._afterItemElementInserted();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._planPostRenderActions();
  }

  _afterItemElementDeleted(
    $item: dxElementWrapper,
    deletedActionArgs: CollectionItemInfo<Item, number>,
  ): void {
    super._afterItemElementDeleted($item, deletedActionArgs);
    this._renderScrolling();
  }

  getScrollable(): Scrollable | undefined | null {
    return this._scrollable;
  }
}

registerComponent('dxTabs', Tabs);

export default Tabs;
