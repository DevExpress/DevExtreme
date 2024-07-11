"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../../animation/fx"));
var _translator = require("../../../animation/translator");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _convert_location = require("../../../renovation/ui/scroll_view/utils/convert_location");
var _m_scrollable = _interopRequireDefault(require("../scroll_view/m_scrollable"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DATEVIEW_ROLLER_CLASS = 'dx-dateviewroller';
const DATEVIEW_ROLLER_ACTIVE_CLASS = 'dx-state-active';
const DATEVIEW_ROLLER_CURRENT_CLASS = 'dx-dateviewroller-current';
const DATEVIEW_ROLLER_ITEM_CLASS = 'dx-dateview-item';
const DATEVIEW_ROLLER_ITEM_SELECTED_CLASS = 'dx-dateview-item-selected';
const DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS = 'dx-dateview-item-selected-frame';
const DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS = 'dx-dateview-item-selected-border';
class DateViewRoller extends _m_scrollable.default {
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      showScrollbar: 'never',
      useNative: false,
      selectedIndex: 0,
      bounceEnabled: false,
      items: [],
      showOnClick: false,
      onClick: null,
      onSelectedIndexChanged: null,
      scrollByContent: true
    });
  }
  _init() {
    super._init();
    this.option('onVisibilityChange', this._visibilityChangedHandler.bind(this));
    this.option('onEnd', this._endActionHandler.bind(this));
  }
  _render() {
    super._render();
    this._renderSelectedItemFrame();
    this.$element().addClass(DATEVIEW_ROLLER_CLASS);
    this._renderContainerClick();
    this._renderItems();
    // @ts-expect-error
    this._renderSelectedValue();
    this._renderItemsClick();
    this._renderWheelEvent();
    this._renderSelectedIndexChanged();
  }
  _renderSelectedIndexChanged() {
    this._selectedIndexChanged = this._createActionByOption('onSelectedIndexChanged');
  }
  _renderWheelEvent() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _events_engine.default.on((0, _renderer.default)(this.container()), 'dxmousewheel', e => {
      this._isWheelScrolled = true;
    });
  }
  _renderContainerClick() {
    if (!this.option('showOnClick')) {
      return;
    }
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const clickAction = this._createActionByOption('onClick');
    _events_engine.default.off((0, _renderer.default)(this.container()), eventName);
    _events_engine.default.on((0, _renderer.default)(this.container()), eventName, e => {
      clickAction({
        event: e
      });
    });
  }
  _renderItems() {
    const items = this.option('items') || [];
    // @ts-expect-error
    let $items = (0, _renderer.default)();
    (0, _renderer.default)(this.content()).empty();
    // NOTE: rendering ~166+30+12+24+60 <div>s >> 50mc
    items.forEach(item => {
      $items = $items.add(
      // @ts-expect-error
      (0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_CLASS).append(item));
    });
    (0, _renderer.default)(this.content()).append($items);
    this._$items = $items;
    this.update();
  }
  _renderSelectedItemFrame() {
    (0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_FRAME_CLASS).append((0, _renderer.default)('<div>').addClass(DATEVIEW_ROLLER_ITEM_SELECTED_BORDER_CLASS)).appendTo((0, _renderer.default)(this.container()));
  }
  _renderSelectedValue(selectedIndex) {
    const index = this._fitIndex(selectedIndex ?? this.option('selectedIndex'));
    this._moveTo({
      top: this._getItemPosition(index)
    });
    this._renderActiveStateItem();
  }
  _fitIndex(index) {
    const items = this.option('items') || [];
    const itemCount = items.length;
    if (index >= itemCount) {
      return itemCount - 1;
    }
    if (index < 0) {
      return 0;
    }
    return index;
  }
  _getItemPosition(index) {
    return Math.round(this._itemHeight() * index);
  }
  _renderItemsClick() {
    const itemSelector = this._getItemSelector();
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    _events_engine.default.off(this.$element(), eventName, itemSelector);
    _events_engine.default.on(this.$element(), eventName, itemSelector, this._itemClickHandler.bind(this));
  }
  _getItemSelector() {
    return `.${DATEVIEW_ROLLER_ITEM_CLASS}`;
  }
  _itemClickHandler(e) {
    this.option('selectedIndex', this._itemElementIndex(e.currentTarget));
  }
  _itemElementIndex(itemElement) {
    return this._itemElements().index(itemElement);
  }
  _itemElements() {
    return this.$element().find(this._getItemSelector());
  }
  _renderActiveStateItem() {
    const selectedIndex = this.option('selectedIndex');
    (0, _iterator.each)(this._$items, function (index) {
      (0, _renderer.default)(this).toggleClass(DATEVIEW_ROLLER_ITEM_SELECTED_CLASS, selectedIndex === index);
    });
  }
  _shouldScrollToNeighborItem() {
    return _devices.default.real().deviceType === 'desktop' && this._isWheelScrolled;
  }
  _moveTo(targetLocation) {
    // @ts-expect-error
    const {
      top,
      left
    } = (0, _convert_location.convertToLocation)(targetLocation);
    const location = this.scrollOffset();
    const delta = {
      // @ts-expect-error
      x: location.left - left,
      // @ts-expect-error
      y: location.top - top
    };
    if (this._isVisible() && (delta.x || delta.y)) {
      this._prepareDirections(true);
      if (this._animation && !this._shouldScrollToNeighborItem()) {
        const that = this;
        // @ts-expect-error
        _fx.default.stop((0, _renderer.default)(this.content()));
        // @ts-expect-error
        _fx.default.animate((0, _renderer.default)(this.content()), {
          duration: 200,
          type: 'slide',
          to: {
            top: Math.floor(delta.y)
          },
          complete() {
            (0, _translator.resetPosition)((0, _renderer.default)(that.content()));
            that.handleMove({
              delta
            });
          }
        });
        delete this._animation;
      } else {
        this.handleMove({
          delta
        });
      }
    }
  }
  _validate(e) {
    return this._moveIsAllowed(e);
  }
  _fitSelectedIndexInRange(index) {
    const itemsCount = this.option('items').length;
    return Math.max(Math.min(index, itemsCount - 1), 0);
  }
  _isInNullNeighborhood(x) {
    const EPS = 0.1;
    return -EPS <= x && x <= EPS;
  }
  _getSelectedIndexAfterScroll(currentSelectedIndex) {
    const locationTop = this.scrollOffset().top;
    const currentSelectedIndexPosition = currentSelectedIndex * this._itemHeight();
    const dy = locationTop - currentSelectedIndexPosition;
    if (this._isInNullNeighborhood(dy)) {
      return currentSelectedIndex;
    }
    const direction = dy > 0 ? 1 : -1;
    const newSelectedIndex = this._fitSelectedIndexInRange(currentSelectedIndex + direction);
    return newSelectedIndex;
  }
  _getNewSelectedIndex(currentSelectedIndex) {
    if (this._shouldScrollToNeighborItem()) {
      return this._getSelectedIndexAfterScroll(currentSelectedIndex);
    }
    this._animation = true;
    const ratio = this.scrollOffset().top / this._itemHeight();
    return Math.round(ratio);
  }
  _endActionHandler() {
    const currentSelectedIndex = this.option('selectedIndex');
    const newSelectedIndex = this._getNewSelectedIndex(currentSelectedIndex);
    if (newSelectedIndex === currentSelectedIndex) {
      this._renderSelectedValue(newSelectedIndex);
    } else {
      this.option('selectedIndex', newSelectedIndex);
    }
    this._isWheelScrolled = false;
  }
  _itemHeight() {
    const $item = this._$items.first();
    return (0, _size.getHeight)($item);
  }
  _toggleActive(state) {
    this.$element().toggleClass(DATEVIEW_ROLLER_ACTIVE_CLASS, state);
  }
  _isVisible() {
    return (0, _renderer.default)(this.container()).is(':visible');
  }
  _fireSelectedIndexChanged(value, previousValue) {
    this._selectedIndexChanged({
      value,
      previousValue,
      event: undefined
    });
  }
  _visibilityChanged(visible) {
    super._visibilityChanged(visible);
    this._visibilityChangedHandler(visible);
  }
  _visibilityChangedHandler(visible) {
    if (visible) {
      // uses for purposes of renovated scrollable widget
      this._visibilityTimer = setTimeout(() => {
        this._renderSelectedValue(this.option('selectedIndex'));
      });
    }
    this.toggleActiveState(false);
  }
  toggleActiveState(state) {
    this.$element().toggleClass(DATEVIEW_ROLLER_CURRENT_CLASS, state);
  }
  _refreshSelectedIndex() {
    const selectedIndex = this.option('selectedIndex');
    const fitIndex = this._fitIndex(selectedIndex);
    if (fitIndex === selectedIndex) {
      this._renderActiveStateItem();
    } else {
      this.option('selectedIndex', fitIndex);
    }
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'selectedIndex':
        this._fireSelectedIndexChanged(args.value, args.previousValue);
        this._renderSelectedValue(args.value);
        break;
      case 'items':
        this._renderItems();
        this._refreshSelectedIndex();
        break;
      case 'onClick':
      case 'showOnClick':
        this._renderContainerClick();
        break;
      case 'onSelectedIndexChanged':
        this._renderSelectedIndexChanged();
        break;
      default:
        super._optionChanged(args);
    }
  }
  _dispose() {
    clearTimeout(this._visibilityTimer);
    super._dispose();
  }
}
// @ts-expect-error ts-error
(0, _component_registrator.default)('dxDateViewRoller', DateViewRoller);
var _default = exports.default = DateViewRoller;