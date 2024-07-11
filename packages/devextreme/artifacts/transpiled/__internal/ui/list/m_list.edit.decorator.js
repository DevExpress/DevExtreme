"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _size = require("../../../core/utils/size");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _swipe = require("../../../events/swipe");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LIST_EDIT_DECORATOR = 'dxListEditDecorator';
const SWIPE_START_EVENT_NAME = (0, _index.addNamespace)(_swipe.start, LIST_EDIT_DECORATOR);
const SWIPE_UPDATE_EVENT_NAME = (0, _index.addNamespace)(_swipe.swipe, LIST_EDIT_DECORATOR);
const SWIPE_END_EVENT_NAME = (0, _index.addNamespace)(_swipe.end, LIST_EDIT_DECORATOR);
const EditDecorator = _class.default.inherit({
  ctor(list) {
    this._list = list;
    this._init();
  },
  _init: _common.noop,
  _shouldHandleSwipe: false,
  _attachSwipeEvent(config) {
    const swipeConfig = {
      itemSizeFunc: function () {
        if (this._clearSwipeCache) {
          this._itemWidthCache = (0, _size.getWidth)(this._list.$element());
          this._clearSwipeCache = false;
        }
        return this._itemWidthCache;
      }.bind(this)
    };
    _events_engine.default.on(config.$itemElement, SWIPE_START_EVENT_NAME, swipeConfig, this._itemSwipeStartHandler.bind(this));
    _events_engine.default.on(config.$itemElement, SWIPE_UPDATE_EVENT_NAME, this._itemSwipeUpdateHandler.bind(this));
    _events_engine.default.on(config.$itemElement, SWIPE_END_EVENT_NAME, this._itemSwipeEndHandler.bind(this));
  },
  _itemSwipeStartHandler(e) {
    const $itemElement = (0, _renderer.default)(e.currentTarget);
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      e.cancel = true;
      return;
    }
    clearTimeout(this._list._inkRippleTimer);
    this._swipeStartHandler($itemElement, e);
  },
  _itemSwipeUpdateHandler(e) {
    const $itemElement = (0, _renderer.default)(e.currentTarget);
    this._swipeUpdateHandler($itemElement, e);
  },
  _itemSwipeEndHandler(e) {
    const $itemElement = (0, _renderer.default)(e.currentTarget);
    this._swipeEndHandler($itemElement, e);
    this._clearSwipeCache = true;
  },
  beforeBag: _common.noop,
  afterBag: _common.noop,
  _commonOptions() {
    return {
      activeStateEnabled: this._list.option('activeStateEnabled'),
      hoverStateEnabled: this._list.option('hoverStateEnabled'),
      focusStateEnabled: this._list.option('focusStateEnabled')
    };
  },
  modifyElement(config) {
    if (this._shouldHandleSwipe) {
      this._attachSwipeEvent(config);
      this._clearSwipeCache = true;
    }
  },
  afterRender: _common.noop,
  handleClick: _common.noop,
  handleKeyboardEvents: _common.noop,
  handleEnterPressing: _common.noop,
  handleContextMenu: _common.noop,
  _swipeStartHandler: _common.noop,
  _swipeUpdateHandler: _common.noop,
  _swipeEndHandler: _common.noop,
  visibilityChange: _common.noop,
  getExcludedSelectors: _common.noop,
  dispose: _common.noop
});
var _default = exports.default = EditDecorator;