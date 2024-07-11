"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../core/utils/callbacks"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _load_indicator = _interopRequireDefault(require("../../../ui/load_indicator"));
var _m_scrollable = require("./m_scrollable.simulated");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

const math = Math;
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
const ScrollViewScroller = _m_scrollable.Scroller.inherit({
  ctor() {
    this._topPocketSize = 0;
    this._bottomPocketSize = 0;
    this.callBase.apply(this, arguments);
    this._initCallbacks();
    this._releaseState();
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
  _initCallbacks() {
    this.pullDownCallbacks = (0, _callbacks.default)();
    this.releaseCallbacks = (0, _callbacks.default)();
    this.reachBottomCallbacks = (0, _callbacks.default)();
  },
  _updateBounds() {
    const considerPockets = this._direction !== 'horizontal';
    if (considerPockets) {
      this._topPocketSize = this._$topPocket.get(0).clientHeight;
      this._bottomPocketSize = this._$bottomPocket.get(0).clientHeight;
      const containerEl = this._$container.get(0);
      const contentEl = this._$content.get(0);
      this._bottomBoundary = Math.max(contentEl.clientHeight - this._bottomPocketSize - containerEl.clientHeight, 0);
    }
    this.callBase();
  },
  _updateScrollbar() {
    this._scrollbar.option({
      containerSize: this._containerSize(),
      contentSize: this._contentSize() - this._topPocketSize - this._bottomPocketSize,
      scaleRatio: this._getScaleRatio()
    });
  },
  _moveContent() {
    this.callBase();
    if (this._isPullDown()) {
      this._pullDownReady();
    } else if (this._isReachBottom()) {
      this._reachBottomReady();
    } else if (this._state !== STATE_RELEASED) {
      this._stateReleased();
    }
  },
  _moveScrollbar() {
    this._scrollbar.moveTo(this._topPocketSize + this._location);
  },
  _isPullDown() {
    return this._pullDownEnabled && this._location >= 0;
  },
  _isReachBottom() {
    const containerEl = this._$container.get(0);
    return this._reachBottomEnabled && Math.round(this._bottomBoundary - Math.ceil(containerEl.scrollTop)) <= 1;
  },
  _scrollComplete() {
    if (this._inBounds() && this._state === STATE_READY) {
      this._pullDownRefreshing();
    } else if (this._inBounds() && this._state === STATE_LOADING) {
      this._reachBottomLoading();
    } else {
      this.callBase();
    }
  },
  _reachBottomReady() {
    if (this._state === STATE_LOADING) {
      return;
    }
    this._state = STATE_LOADING;
    this._minOffset = this._getMinOffset();
  },
  _getMaxOffset() {
    return -this._topPocketSize;
  },
  _getMinOffset() {
    return math.min(this.callBase(), -this._topPocketSize);
  },
  _reachBottomLoading() {
    this.reachBottomCallbacks.fire();
  },
  _pullDownReady() {
    if (this._state === STATE_READY) {
      return;
    }
    this._state = STATE_READY;
    this._maxOffset = 0;
    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._refreshPullDownText();
  },
  _stateReleased() {
    if (this._state === STATE_RELEASED) {
      return;
    }
    this._releaseState();
    this._updateBounds();
    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS).removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this.releaseCallbacks.fire();
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
  _releaseHandler() {
    if (this._state === STATE_RELEASED) {
      this._moveToBounds();
    }
    this._update();
    if (this._releaseTask) {
      this._releaseTask.abort();
    }
    this._releaseTask = (0, _common.executeAsync)(this._release.bind(this));
    return this._releaseTask.promise;
  },
  _release() {
    this._stateReleased();
    this._scrollComplete();
  },
  _reachBottomEnablingHandler(enabled) {
    if (this._reachBottomEnabled === enabled) {
      return;
    }
    this._reachBottomEnabled = enabled;
    this._updateBounds();
  },
  _pullDownEnablingHandler(enabled) {
    if (this._pullDownEnabled === enabled) {
      return;
    }
    this._pullDownEnabled = enabled;
    this._considerTopPocketChange();
    this._updateHandler();
  },
  _considerTopPocketChange() {
    this._location -= (0, _size.getHeight)(this._$topPocket) || -this._topPocketSize;
    this._maxOffset = 0;
    this._move();
  },
  _pendingReleaseHandler() {
    this._state = STATE_READY;
  },
  dispose() {
    if (this._releaseTask) {
      this._releaseTask.abort();
    }
    this.callBase();
  }
});
const SimulatedScrollViewStrategy = _m_scrollable.SimulatedStrategy.inherit({
  _init(scrollView) {
    this.callBase(scrollView);
    this._$pullDown = scrollView._$pullDown;
    this._$topPocket = scrollView._$topPocket;
    this._$bottomPocket = scrollView._$bottomPocket;
    this._initCallbacks();
  },
  _initCallbacks() {
    this.pullDownCallbacks = (0, _callbacks.default)();
    this.releaseCallbacks = (0, _callbacks.default)();
    this.reachBottomCallbacks = (0, _callbacks.default)();
  },
  render() {
    this._renderPullDown();
    this.callBase();
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
  pullDownEnable(enabled) {
    this._eventHandler('pullDownEnabling', enabled);
  },
  reachBottomEnable(enabled) {
    this._eventHandler('reachBottomEnabling', enabled);
  },
  _createScroller(direction) {
    const that = this;
    const scroller = that._scrollers[direction] = new ScrollViewScroller(that._scrollerOptions(direction));
    // @ts-expect-error
    scroller.pullDownCallbacks.add(() => {
      that.pullDownCallbacks.fire();
    });
    // @ts-expect-error
    scroller.releaseCallbacks.add(() => {
      that.releaseCallbacks.fire();
    });
    // @ts-expect-error
    scroller.reachBottomCallbacks.add(() => {
      that.reachBottomCallbacks.fire();
    });
  },
  _scrollerOptions(direction) {
    return (0, _extend.extend)(this.callBase(direction), {
      $topPocket: this._$topPocket,
      $bottomPocket: this._$bottomPocket,
      $pullDown: this._$pullDown,
      $pullDownText: this._$pullDownText,
      $pullingDownText: this._$pullingDownText,
      $pulledDownText: this._$pulledDownText,
      $refreshingText: this._$refreshingText
    });
  },
  pendingRelease() {
    this._eventHandler('pendingRelease');
  },
  release() {
    return this._eventHandler('release').done(this._updateAction);
  },
  location() {
    const location = this.callBase();
    location.top += (0, _size.getHeight)(this._$topPocket);
    return location;
  },
  dispose() {
    (0, _iterator.each)(this._scrollers, function () {
      this.dispose();
    });
    this.callBase();
  }
});
var _default = exports.default = SimulatedScrollViewStrategy;