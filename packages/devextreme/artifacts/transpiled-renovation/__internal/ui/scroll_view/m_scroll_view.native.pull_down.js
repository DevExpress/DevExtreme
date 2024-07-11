"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _deferred = require("../../../core/utils/deferred");
var _iterator = require("../../../core/utils/iterator");
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _m_scrollable = _interopRequireDefault(require("./m_scrollable.native"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = 'dx-scrollview-pull-down-loading';
const SCROLLVIEW_PULLDOWN_READY_CLASS = 'dx-scrollview-pull-down-ready';
const SCROLLVIEW_PULLDOWN_IMAGE_CLASS = 'dx-scrollview-pull-down-image';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_TEXT_CLASS = 'dx-scrollview-pull-down-text';
const SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS = 'dx-scrollview-pull-down-text-visible';
const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_LOADING = 3;
const PULLDOWN_RELEASE_TIME = 400;
const PullDownNativeScrollViewStrategy = _m_scrollable.default.inherit({
  _init(scrollView) {
    this.callBase(scrollView);
    this._$topPocket = scrollView._$topPocket;
    this._$pullDown = scrollView._$pullDown;
    this._$refreshingText = scrollView._$refreshingText;
    this._$scrollViewContent = (0, _renderer.default)(scrollView.content());
    this._$container = (0, _renderer.default)(scrollView.container());
    this._initCallbacks();
  },
  _initCallbacks() {
    this.pullDownCallbacks = (0, _callbacks.default)();
    this.releaseCallbacks = (0, _callbacks.default)();
    this.reachBottomCallbacks = (0, _callbacks.default)();
  },
  render() {
    this.callBase();
    this._renderPullDown();
    this._releaseState();
  },
  _renderPullDown() {
    const $image = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS);
    const $loadContainer = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
    // @ts-expect-error
    const $loadIndicator = new _load_indicator.default((0, _renderer.default)('<div>')).$element();
    const $text = this._$pullDownText = (0, _renderer.default)('<div>').addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);
    this._$pullingDownText = (0, _renderer.default)('<div>').text(this.option('pullingDownText')).appendTo($text);
    this._$pulledDownText = (0, _renderer.default)('<div>').text(this.option('pulledDownText')).appendTo($text);
    this._$refreshingText = (0, _renderer.default)('<div>').text(this.option('refreshingText')).appendTo($text);
    this._$pullDown.empty().append($image).append($loadContainer.append($loadIndicator)).append($text);
  },
  _releaseState() {
    this._state = STATE_RELEASED;
    this._refreshPullDownText();
  },
  _refreshPullDownText() {
    const that = this;
    const pullDownTextItems = [{
      element: this._$pullingDownText,
      visibleState: STATE_RELEASED
    }, {
      element: this._$pulledDownText,
      visibleState: STATE_READY
    }, {
      element: this._$refreshingText,
      visibleState: STATE_REFRESHING
    }];
    (0, _iterator.each)(pullDownTextItems, (_, item) => {
      const action = that._state === item.visibleState ? 'addClass' : 'removeClass';
      item.element[action](SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS);
    });
  },
  update() {
    this.callBase();
    this._setTopPocketOffset();
  },
  _updateDimensions() {
    this.callBase();
    this._topPocketSize = this._$topPocket.get(0).clientHeight;
    const contentEl = this._$scrollViewContent.get(0);
    const containerEl = this._$container.get(0);
    this._bottomBoundary = Math.max(contentEl.clientHeight - containerEl.clientHeight, 0);
  },
  _allowedDirections() {
    const allowedDirections = this.callBase();
    allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
    return allowedDirections;
  },
  _setTopPocketOffset() {
    this._$topPocket.css({
      top: -this._topPocketSize
    });
  },
  handleEnd() {
    this.callBase();
    this._complete();
  },
  handleStop() {
    this.callBase();
    this._complete();
  },
  _complete() {
    if (this._state === STATE_READY) {
      this._setPullDownOffset(this._topPocketSize);
      clearTimeout(this._pullDownRefreshTimeout);
      this._pullDownRefreshTimeout = setTimeout(() => {
        this._pullDownRefreshing();
      }, 400);
    }
  },
  _setPullDownOffset(offset) {
    (0, _translator.move)(this._$topPocket, {
      top: offset
    });
    (0, _translator.move)(this._$scrollViewContent, {
      top: offset
    });
  },
  handleScroll(e) {
    this.callBase(e);
    // TODO: replace with disabled check
    if (this._state === STATE_REFRESHING) {
      return;
    }
    const currentLocation = this.location().top;
    const scrollDelta = (this._location || 0) - currentLocation;
    this._location = currentLocation;
    if (this._isPullDown()) {
      this._pullDownReady();
    } else if (scrollDelta > 0 && this._isReachBottom()) {
      this._reachBottom();
    } else {
      this._stateReleased();
    }
  },
  _isPullDown() {
    return this._pullDownEnabled && this._location >= this._topPocketSize;
  },
  _isReachBottom() {
    return this._reachBottomEnabled && Math.round(this._bottomBoundary + Math.floor(this._location)) <= 1;
  },
  _reachBottom() {
    if (this._state === STATE_LOADING) {
      return;
    }
    this._state = STATE_LOADING;
    this.reachBottomCallbacks.fire();
  },
  _pullDownReady() {
    if (this._state === STATE_READY) {
      return;
    }
    this._state = STATE_READY;
    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._refreshPullDownText();
  },
  _stateReleased() {
    if (this._state === STATE_RELEASED) {
      return;
    }
    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._releaseState();
  },
  _pullDownRefreshing() {
    if (this._state === STATE_REFRESHING) {
      return;
    }
    this._state = STATE_REFRESHING;
    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._refreshPullDownText();
    this.pullDownCallbacks.fire();
  },
  pullDownEnable(enabled) {
    if (enabled) {
      this._updateDimensions();
      this._setTopPocketOffset();
    }
    this._pullDownEnabled = enabled;
  },
  reachBottomEnable(enabled) {
    this._reachBottomEnabled = enabled;
  },
  pendingRelease() {
    this._state = STATE_READY;
  },
  release() {
    const deferred = (0, _deferred.Deferred)();
    this._updateDimensions();
    clearTimeout(this._releaseTimeout);
    if (this._state === STATE_LOADING) {
      this._state = STATE_RELEASED;
    }
    this._releaseTimeout = setTimeout(() => {
      this._setPullDownOffset(0);
      this._stateReleased();
      this.releaseCallbacks.fire();
      this._updateAction();
      deferred.resolve();
    }, PULLDOWN_RELEASE_TIME);
    return deferred.promise();
  },
  dispose() {
    clearTimeout(this._pullDownRefreshTimeout);
    clearTimeout(this._releaseTimeout);
    this.callBase();
  }
});
var _default = exports.default = PullDownNativeScrollViewStrategy;