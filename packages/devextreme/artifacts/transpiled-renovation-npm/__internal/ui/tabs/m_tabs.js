"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _bindable_template = require("../../../core/templates/bindable_template");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _icon = require("../../../core/utils/icon");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hold = _interopRequireDefault(require("../../../events/hold"));
var _pointer = _interopRequireDefault(require("../../../events/pointer"));
var _index = require("../../../events/utils/index");
var _get_boundary_props = require("../../../renovation/ui/scroll_view/utils/get_boundary_props");
var _get_scroll_left_max = require("../../../renovation/ui/scroll_view/utils/get_scroll_left_max");
var _button = _interopRequireDefault(require("../../../ui/button"));
var _uiCollection_widget = _interopRequireDefault(require("../../../ui/collection/ui.collection_widget.live_update"));
var _ui = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _themes = require("../../../ui/themes");
var _utils = require("../../../ui/widget/utils.ink_ripple");
var _constants = require("./constants");
var _m_item = _interopRequireDefault(require("./m_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-named-default

const TABS_CLASS = 'dx-tabs';
const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TABS_STRETCHED_CLASS = 'dx-tabs-stretched';
const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const OVERFLOW_HIDDEN_CLASS = 'dx-overflow-hidden';
const TABS_ITEM_CLASS = 'dx-tab';
const TABS_ITEM_SELECTED_CLASS = 'dx-tab-selected';
const TABS_SCROLLING_ENABLED_CLASS = 'dx-tabs-scrolling-enabled';
const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';
const TABS_ITEM_TEXT_SPAN_CLASS = 'dx-tab-text-span';
const TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS = 'dx-tab-text-span-pseudo';
const STATE_DISABLED_CLASS = 'dx-state-disabled';
const FOCUSED_DISABLED_NEXT_TAB_CLASS = 'dx-focused-disabled-next-tab';
const FOCUSED_DISABLED_PREV_TAB_CLASS = 'dx-focused-disabled-prev-tab';
const TABS_ORIENTATION_CLASS = {
  vertical: 'dx-tabs-vertical',
  horizontal: 'dx-tabs-horizontal'
};
const INDICATOR_POSITION_CLASS = {
  top: 'dx-tab-indicator-position-top',
  right: 'dx-tab-indicator-position-right',
  bottom: 'dx-tab-indicator-position-bottom',
  left: 'dx-tab-indicator-position-left'
};
const TABS_ICON_POSITION_CLASS = {
  top: 'dx-tabs-icon-position-top',
  end: 'dx-tabs-icon-position-end',
  bottom: 'dx-tabs-icon-position-bottom',
  start: 'dx-tabs-icon-position-start'
};
const TABS_STYLING_MODE_CLASS = {
  primary: 'dx-tabs-styling-mode-primary',
  secondary: 'dx-tabs-styling-mode-secondary'
};
const TABS_ITEM_DATA_KEY = 'dxTabData';
const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';
const FEEDBACK_HIDE_TIMEOUT = 100;
const FEEDBACK_DURATION_INTERVAL = 5;
const FEEDBACK_SCROLL_TIMEOUT = 300;
const TAB_OFFSET = 30;
const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
const INDICATOR_POSITION = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left'
};
const SCROLLABLE_DIRECTION = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};
const ICON_POSITION = {
  top: 'top',
  end: 'end',
  bottom: 'bottom',
  start: 'start'
};
const STYLING_MODE = {
  primary: 'primary',
  secondary: 'secondary'
};
const Tabs = _uiCollection_widget.default.inherit({
  _activeStateUnit: `.${TABS_ITEM_CLASS}`,
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
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
      badgeExpr(data) {
        return data ? data.badge : undefined;
      },
      _itemAttributes: {
        role: 'tab'
      },
      _indicatorPosition: null
    });
  },
  _defaultOptionsRules() {
    const themeName = (0, _themes.current)();
    return this.callBase().concat([{
      device() {
        return _devices.default.real().deviceType !== 'desktop';
      },
      options: {
        showNavButtons: false
      }
    }, {
      device: {
        deviceType: 'desktop'
      },
      options: {
        scrollByContent: false
      }
    }, {
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        return (0, _themes.isFluent)(themeName);
      },
      options: {
        iconPosition: ICON_POSITION.top,
        stylingMode: STYLING_MODE.secondary
      }
    }, {
      device() {
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        useInkRipple: true,
        selectOnFocus: false,
        iconPosition: ICON_POSITION.top
      }
    }]);
  },
  _init() {
    const {
      orientation,
      stylingMode,
      scrollingEnabled
    } = this.option();
    const indicatorPosition = this._getIndicatorPosition();
    this.callBase();
    this.setAria('role', 'tablist');
    this.$element().addClass(TABS_CLASS);
    this._toggleScrollingEnabledClass(scrollingEnabled);
    this._toggleOrientationClass(orientation);
    this._toggleIndicatorPositionClass(indicatorPosition);
    this._toggleIconPositionClass();
    this._toggleStylingModeClass(stylingMode);
    this._renderWrapper();
    this._renderMultiple();
    this._feedbackHideTimeout = FEEDBACK_HIDE_TIMEOUT;
  },
  _prepareDefaultItemTemplate(data, $container) {
    const text = (0, _type.isPlainObject)(data) ? data === null || data === void 0 ? void 0 : data.text : data;
    if ((0, _type.isDefined)(text)) {
      const $tabTextSpan = (0, _renderer.default)('<span>').addClass(TABS_ITEM_TEXT_SPAN_CLASS);
      $tabTextSpan.text(text);
      const $tabTextSpanPseudo = (0, _renderer.default)('<span>').addClass(TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS);
      $tabTextSpanPseudo.text(text);
      $tabTextSpanPseudo.appendTo($tabTextSpan);
      $tabTextSpan.appendTo($container);
    }
    if ((0, _type.isDefined)(data.html)) {
      $container.html(data.html);
    }
  },
  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      item: new _bindable_template.BindableTemplate(($container, data) => {
        this._prepareDefaultItemTemplate(data, $container);
        const $iconElement = (0, _icon.getImageContainer)(data.icon);
        $iconElement && $iconElement.prependTo($container);
        const $tabItem = (0, _renderer.default)('<div>').addClass(TABS_ITEM_TEXT_CLASS);
        $container.wrapInner($tabItem);
      }, ['text', 'html', 'icon'], this.option('integrationOptions.watchMethod'))
    });
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _createItemByTemplate: function _createItemByTemplate(itemTemplate, renderArgs) {
    const {
      itemData,
      container,
      index
    } = renderArgs;
    this._deferredTemplates[index] = (0, _deferred.Deferred)();
    return itemTemplate.render({
      model: itemData,
      container,
      index,
      onRendered: () => this._deferredTemplates[index].resolve()
    });
  },
  _itemClass() {
    return TABS_ITEM_CLASS;
  },
  _selectedItemClass() {
    return TABS_ITEM_SELECTED_CLASS;
  },
  _itemDataKey() {
    return TABS_ITEM_DATA_KEY;
  },
  _initMarkup() {
    this._deferredTemplates = [];
    this.callBase();
    this.option('useInkRipple') && this._renderInkRipple();
    this.$element().addClass(OVERFLOW_HIDDEN_CLASS);
  },
  _render() {
    this.callBase();
    this._deferRenderScrolling();
  },
  _deferRenderScrolling() {
    _deferred.when.apply(this, this._deferredTemplates).done(() => this._renderScrolling());
  },
  _renderScrolling() {
    const removeClasses = [TABS_STRETCHED_CLASS, _constants.TABS_EXPANDED_CLASS, OVERFLOW_HIDDEN_CLASS];
    this.$element().removeClass(removeClasses.join(' '));
    if (this.option('scrollingEnabled') && this._isItemsSizeExceeded()) {
      if (!this._scrollable) {
        this._renderScrollable();
        this._renderNavButtons();
      }
      const scrollable = this.getScrollable();
      scrollable.update();
      if (this.option('rtlEnabled')) {
        // @ts-expect-error
        const maxLeftOffset = (0, _get_scroll_left_max.getScrollLeftMax)((0, _renderer.default)(this.getScrollable().container()).get(0));
        scrollable.scrollTo({
          left: maxLeftOffset
        });
      }
      this._updateNavButtonsState();
      this._scrollToItem(this.option('selectedItem'));
    }
    if (!(this.option('scrollingEnabled') && this._isItemsSizeExceeded())) {
      this._cleanScrolling();
      if (this._needStretchItems()) {
        this.$element().addClass(TABS_STRETCHED_CLASS);
      }
      this.$element().removeClass(TABS_NAV_BUTTONS_CLASS).addClass(_constants.TABS_EXPANDED_CLASS);
    }
  },
  _isVertical() {
    return this.option('orientation') === ORIENTATION.vertical;
  },
  _isItemsSizeExceeded() {
    const isVertical = this._isVertical();
    const isItemsSizeExceeded = isVertical ? this._isItemsHeightExceeded() : this._isItemsWidthExceeded();
    return isItemsSizeExceeded;
  },
  _isItemsWidthExceeded() {
    const $visibleItems = this._getVisibleItems();
    const tabItemTotalWidth = this._getSummaryItemsSize('width', $visibleItems, true);
    const elementWidth = (0, _size.getWidth)(this.$element());
    if ([tabItemTotalWidth, elementWidth].includes(0)) {
      return false;
    }
    const isItemsWidthExceeded = tabItemTotalWidth > elementWidth - 1;
    return isItemsWidthExceeded;
  },
  _isItemsHeightExceeded() {
    const $visibleItems = this._getVisibleItems();
    const itemsHeight = this._getSummaryItemsSize('height', $visibleItems, true);
    const elementHeight = (0, _size.getHeight)(this.$element());
    const isItemsHeightExceeded = itemsHeight - 1 > elementHeight;
    return isItemsHeightExceeded;
  },
  _needStretchItems() {
    const $visibleItems = this._getVisibleItems();
    const elementWidth = (0, _size.getWidth)(this.$element());
    const itemsWidth = [];
    (0, _iterator.each)($visibleItems, (_, item) => {
      // @ts-expect-error
      itemsWidth.push((0, _size.getOuterWidth)(item, true));
    });
    const maxTabItemWidth = Math.max.apply(null, itemsWidth);
    const requireWidth = elementWidth / $visibleItems.length;
    const needStretchItems = maxTabItemWidth > requireWidth + 1;
    return needStretchItems;
  },
  _cleanNavButtons() {
    if (!this._leftButton || !this._rightButton) return;
    this._leftButton.$element().remove();
    this._rightButton.$element().remove();
    this._leftButton = null;
    this._rightButton = null;
  },
  _cleanScrolling() {
    if (!this._scrollable) return;
    this._$wrapper.appendTo(this.$element());
    this._scrollable.$element().remove();
    this._scrollable = null;
    this._cleanNavButtons();
  },
  _renderInkRipple() {
    this._inkRipple = (0, _utils.render)();
  },
  _getPointerEvent() {
    return _pointer.default.up;
  },
  _toggleActiveState($element, value, e) {
    this.callBase.apply(this, arguments);
    if (!this._inkRipple) {
      return;
    }
    const config = {
      element: $element,
      event: e
    };
    if (value) {
      this._inkRipple.showWave(config);
    } else {
      this._inkRipple.hideWave(config);
    }
  },
  _renderMultiple() {
    if (this.option('selectionMode') === 'multiple') {
      this.option('selectOnFocus', false);
    }
  },
  _renderWrapper() {
    this._$wrapper = (0, _renderer.default)('<div>').addClass(TABS_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  },
  _itemContainer() {
    return this._$wrapper;
  },
  _getScrollableDirection() {
    const isVertical = this._isVertical();
    const scrollableDirection = isVertical ? SCROLLABLE_DIRECTION.vertical : SCROLLABLE_DIRECTION.horizontal;
    return scrollableDirection;
  },
  _updateScrollable() {
    if (this.getScrollable()) {
      this._cleanScrolling();
    }
    this._renderScrolling();
  },
  _renderScrollable() {
    const $itemContainer = this.$element().wrapInner((0, _renderer.default)('<div>').addClass(TABS_SCROLLABLE_CLASS)).children();
    this._scrollable = this._createComponent($itemContainer, _ui.default, {
      direction: this._getScrollableDirection(),
      showScrollbar: 'never',
      useKeyboard: false,
      useNative: false,
      scrollByContent: this.option('scrollByContent'),
      onScroll: () => {
        this._updateNavButtonsState();
      }
    });
    this.$element().append(this._scrollable.$element());
  },
  _scrollToItem(itemData) {
    if (!this._scrollable) return;
    const $item = this._editStrategy.getItemElement(itemData);
    this._scrollable.scrollToElement($item);
  },
  _renderNavButtons() {
    const {
      showNavButtons,
      rtlEnabled
    } = this.option();
    this.$element().toggleClass(TABS_NAV_BUTTONS_CLASS, showNavButtons);
    if (!showNavButtons) {
      return;
    }
    this._leftButton = this._createNavButton(-TAB_OFFSET, rtlEnabled ? BUTTON_NEXT_ICON : BUTTON_PREV_ICON);
    const $leftButton = this._leftButton.$element();
    $leftButton.addClass(TABS_LEFT_NAV_BUTTON_CLASS);
    this.$element().prepend($leftButton);
    this._rightButton = this._createNavButton(TAB_OFFSET, rtlEnabled ? BUTTON_PREV_ICON : BUTTON_NEXT_ICON);
    const $rightButton = this._rightButton.$element();
    $rightButton.addClass(TABS_RIGHT_NAV_BUTTON_CLASS);
    this.$element().append($rightButton);
  },
  _updateNavButtonsAriaDisabled() {
    const buttons = [this._leftButton, this._rightButton];
    buttons.forEach(button => {
      button === null || button === void 0 || button.$element().attr({
        'aria-disabled': null
      });
    });
  },
  _updateNavButtonsState() {
    const isVertical = this._isVertical();
    const scrollable = this.getScrollable();
    if (isVertical) {
      var _this$_leftButton, _this$_rightButton;
      (_this$_leftButton = this._leftButton) === null || _this$_leftButton === void 0 || _this$_leftButton.option('disabled', (0, _get_boundary_props.isReachedTop)(scrollable.scrollTop(), 1));
      // @ts-expect-error
      (_this$_rightButton = this._rightButton) === null || _this$_rightButton === void 0 || _this$_rightButton.option('disabled', (0, _get_boundary_props.isReachedBottom)((0, _renderer.default)(scrollable.container()).get(0), scrollable.scrollTop(), 0, 1));
    } else {
      var _this$_leftButton2, _this$_rightButton2;
      (_this$_leftButton2 = this._leftButton) === null || _this$_leftButton2 === void 0 || _this$_leftButton2.option('disabled', (0, _get_boundary_props.isReachedLeft)(scrollable.scrollLeft(), 1));
      // @ts-expect-error
      (_this$_rightButton2 = this._rightButton) === null || _this$_rightButton2 === void 0 || _this$_rightButton2.option('disabled', (0, _get_boundary_props.isReachedRight)((0, _renderer.default)(scrollable.container()).get(0), scrollable.scrollLeft(), 1));
    }
    this._updateNavButtonsAriaDisabled();
  },
  _updateScrollPosition(offset, duration) {
    this._scrollable.update();
    this._scrollable.scrollBy(offset / duration);
  },
  _createNavButton(offset, icon) {
    const holdAction = this._createAction(() => {
      this._holdInterval = setInterval(() => {
        this._updateScrollPosition(offset, FEEDBACK_DURATION_INTERVAL);
      }, FEEDBACK_DURATION_INTERVAL);
    });
    const holdEventName = (0, _index.addNamespace)(_hold.default.name, 'dxNavButton');
    const pointerUpEventName = (0, _index.addNamespace)(_pointer.default.up, 'dxNavButton');
    const pointerOutEventName = (0, _index.addNamespace)(_pointer.default.out, 'dxNavButton');
    const navButton = this._createComponent((0, _renderer.default)('<div>').addClass(TABS_NAV_BUTTON_CLASS), _button.default, {
      focusStateEnabled: false,
      icon,
      integrationOptions: {},
      elementAttr: {
        role: null,
        'aria-label': null,
        'aria-disabled': null
      },
      onClick: () => {
        this._updateScrollPosition(offset, 1);
      }
    });
    const $navButton = navButton.$element();
    _events_engine.default.on($navButton, holdEventName, {
      timeout: FEEDBACK_SCROLL_TIMEOUT
    }, e => {
      holdAction({
        event: e
      });
    });
    _events_engine.default.on($navButton, pointerUpEventName, () => {
      this._clearInterval();
    });
    _events_engine.default.on($navButton, pointerOutEventName, () => {
      this._clearInterval();
    });
    return navButton;
  },
  _clearInterval() {
    if (this._holdInterval) clearInterval(this._holdInterval);
  },
  _updateSelection(addedSelection) {
    this._scrollable && this._scrollable.scrollToElement(this.itemElements().eq(addedSelection[0]));
  },
  _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged() {
    this._renderScrolling();
  },
  _itemSelectHandler(e) {
    if (this.option('selectionMode') === 'single' && this.isItemSelected(e.currentTarget)) {
      return;
    }
    this.callBase(e);
  },
  _clean() {
    this._deferredTemplates = [];
    this._cleanScrolling();
    this.callBase();
  },
  _toggleTabsVerticalClass(value) {
    this.$element().toggleClass(TABS_ORIENTATION_CLASS.vertical, value);
  },
  _toggleTabsHorizontalClass(value) {
    this.$element().toggleClass(TABS_ORIENTATION_CLASS.horizontal, value);
  },
  _getIndicatorPositionClass(indicatorPosition) {
    return INDICATOR_POSITION_CLASS[indicatorPosition];
  },
  _getIndicatorPosition() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      _indicatorPosition,
      rtlEnabled
    } = this.option();
    if (_indicatorPosition) {
      return _indicatorPosition;
    }
    const isVertical = this._isVertical();
    if (rtlEnabled) {
      return isVertical ? INDICATOR_POSITION.left : INDICATOR_POSITION.bottom;
    }
    return isVertical ? INDICATOR_POSITION.right : INDICATOR_POSITION.bottom;
  },
  _toggleIndicatorPositionClass(indicatorPosition) {
    const newClass = this._getIndicatorPositionClass(indicatorPosition);
    this._toggleElementClasses(INDICATOR_POSITION_CLASS, newClass);
  },
  _toggleScrollingEnabledClass(scrollingEnabled) {
    this.$element().toggleClass(TABS_SCROLLING_ENABLED_CLASS, Boolean(scrollingEnabled));
  },
  _toggleOrientationClass(orientation) {
    const isVertical = orientation === ORIENTATION.vertical;
    this._toggleTabsVerticalClass(isVertical);
    this._toggleTabsHorizontalClass(!isVertical);
  },
  _getTabsIconPositionClass() {
    const position = this.option('iconPosition');
    switch (position) {
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
  },
  _toggleIconPositionClass() {
    const newClass = this._getTabsIconPositionClass();
    this._toggleElementClasses(TABS_ICON_POSITION_CLASS, newClass);
  },
  _toggleStylingModeClass(value) {
    const newClass = TABS_STYLING_MODE_CLASS[value] ?? TABS_STYLING_MODE_CLASS.primary;
    this._toggleElementClasses(TABS_STYLING_MODE_CLASS, newClass);
  },
  _toggleElementClasses(classMap, newClass) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in classMap) {
      this.$element().removeClass(classMap[key]);
    }
    this.$element().addClass(newClass);
  },
  _toggleFocusedDisabledNextClass(currentIndex, isNextDisabled) {
    this._itemElements().eq(currentIndex).toggleClass(FOCUSED_DISABLED_NEXT_TAB_CLASS, isNextDisabled);
  },
  _toggleFocusedDisabledPrevClass(currentIndex, isPrevDisabled) {
    this._itemElements().eq(currentIndex).toggleClass(FOCUSED_DISABLED_PREV_TAB_CLASS, isPrevDisabled);
  },
  _toggleFocusedDisabledClasses(value) {
    const {
      selectedIndex: currentIndex
    } = this.option();
    this._itemElements().removeClass(FOCUSED_DISABLED_NEXT_TAB_CLASS).removeClass(FOCUSED_DISABLED_PREV_TAB_CLASS);
    const prevItemIndex = currentIndex - 1;
    const nextItemIndex = currentIndex + 1;
    const nextFocusedIndex = (0, _renderer.default)(value).index();
    const isNextDisabled = this._itemElements().eq(nextItemIndex).hasClass(STATE_DISABLED_CLASS);
    const isPrevDisabled = this._itemElements().eq(prevItemIndex).hasClass(STATE_DISABLED_CLASS);
    const shouldNextClassBeSetted = isNextDisabled && nextFocusedIndex === nextItemIndex;
    const shouldPrevClassBeSetted = isPrevDisabled && nextFocusedIndex === prevItemIndex;
    this._toggleFocusedDisabledNextClass(currentIndex, shouldNextClassBeSetted);
    this._toggleFocusedDisabledPrevClass(currentIndex, shouldPrevClassBeSetted);
  },
  _updateFocusedElement() {
    const {
      focusStateEnabled,
      selectedIndex
    } = this.option();
    const itemElements = this._itemElements();
    if (focusStateEnabled && itemElements.length) {
      const selectedItem = itemElements.get(selectedIndex);
      this.option({
        focusedElement: selectedItem
      });
    }
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'useInkRipple':
      case 'scrollingEnabled':
        this._toggleScrollingEnabledClass(args.value);
        this._invalidate();
        break;
      case 'showNavButtons':
        this._invalidate();
        break;
      case 'scrollByContent':
        this._scrollable && this._scrollable.option(args.name, args.value);
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        this._dimensionChanged();
        break;
      case 'selectionMode':
        this._renderMultiple();
        this.callBase(args);
        break;
      case 'badgeExpr':
        this._invalidate();
        break;
      case 'focusedElement':
        {
          this._toggleFocusedDisabledClasses(args.value);
          this.callBase(args);
          this._scrollToItem(args.value);
          break;
        }
      case 'rtlEnabled':
        {
          this.callBase(args);
          const indicatorPosition = this._getIndicatorPosition();
          this._toggleIndicatorPositionClass(indicatorPosition);
          break;
        }
      case 'orientation':
        {
          this._toggleOrientationClass(args.value);
          const indicatorPosition = this._getIndicatorPosition();
          this._toggleIndicatorPositionClass(indicatorPosition);
          if ((0, _window.hasWindow)()) {
            this._updateScrollable();
          }
          break;
        }
      case 'iconPosition':
        {
          this._toggleIconPositionClass();
          if ((0, _window.hasWindow)()) {
            this._dimensionChanged();
          }
          break;
        }
      case 'stylingMode':
        {
          this._toggleStylingModeClass(args.value);
          if ((0, _window.hasWindow)()) {
            this._dimensionChanged();
          }
          break;
        }
      case '_indicatorPosition':
        {
          this._toggleIndicatorPositionClass(args.value);
          break;
        }
      case 'selectedIndex':
      case 'selectedItem':
      case 'selectedItems':
        this.callBase(args);
        this._updateFocusedElement();
        break;
      default:
        this.callBase(args);
    }
  },
  _afterItemElementInserted() {
    this.callBase();
    this._deferRenderScrolling();
  },
  _afterItemElementDeleted($item, deletedActionArgs) {
    this.callBase($item, deletedActionArgs);
    this._renderScrolling();
  },
  getScrollable() {
    return this._scrollable;
  }
});
Tabs.ItemClass = _m_item.default;
(0, _component_registrator.default)('dxTabs', Tabs);
var _default = exports.default = Tabs;