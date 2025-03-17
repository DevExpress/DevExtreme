import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { Deferred } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import LoadIndicator from '@js/ui/load_indicator';

import NativeStrategy from './m_scrollable.native';

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
class PullDownNativeScrollViewStrategy extends NativeStrategy {
  pullDownCallbacks!: Callback;

  releaseCallbacks!: Callback;

  reachBottomCallbacks!: Callback;

  _$topPocket!: dxElementWrapper;

  _$pullDown!: dxElementWrapper;

  _$refreshingText?: dxElementWrapper;

  _$scrollViewContent!: dxElementWrapper;

  _$pullingDownText!: dxElementWrapper;

  _$pulledDownText!: dxElementWrapper;

  _$pullDownText!: dxElementWrapper;

  _state?: number;

  _topPocketSize!: number;

  _releaseTimeout?: ReturnType<typeof setTimeout>;

  _pullDownRefreshTimeout?: ReturnType<typeof setTimeout>;

  _reachBottomEnabled?: boolean;

  _pullDownEnabled!: boolean;

  _bottomBoundary!: number;

  _location!: number;

  _init(scrollView): void {
    super._init(scrollView);
    this._$topPocket = scrollView._$topPocket;
    this._$pullDown = scrollView._$pullDown;
    this._$refreshingText = scrollView._$refreshingText;
    this._$scrollViewContent = $(scrollView.content());
    this._$container = $(scrollView.container());

    this._initCallbacks();
  }

  _initCallbacks(): void {
    this.pullDownCallbacks = Callbacks();
    this.releaseCallbacks = Callbacks();
    this.reachBottomCallbacks = Callbacks();
  }

  render(): void {
    super.render();
    this._renderPullDown();
    this._releaseState();
  }

  _renderPullDown(): void {
    const $image = $('<div>').addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS);
    const $loadContainer = $('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
    // @ts-expect-error ts-error
    const $loadIndicator = new LoadIndicator($('<div>')).$element();
    const $text = this._$pullDownText = $('<div>').addClass(SCROLLVIEW_PULLDOWN_TEXT_CLASS);

    this._$pullingDownText = $('<div>').text(this.option('pullingDownText')).appendTo($text);
    this._$pulledDownText = $('<div>').text(this.option('pulledDownText')).appendTo($text);
    this._$refreshingText = $('<div>').text(this.option('refreshingText')).appendTo($text);

    this._$pullDown
      .empty()
      .append($image)
      .append($loadContainer.append($loadIndicator))
      .append($text);
  }

  _releaseState(): void {
    this._state = STATE_RELEASED;
    this._refreshPullDownText();
  }

  _refreshPullDownText(): void {
    const that = this;
    const pullDownTextItems = [{
      element: this._$pullingDownText,
      visibleState: STATE_RELEASED,
    }, {
      element: this._$pulledDownText,
      visibleState: STATE_READY,
    }, {
      element: this._$refreshingText,
      visibleState: STATE_REFRESHING,
    }];

    each(pullDownTextItems, (_, item) => {
      const action = that._state === item.visibleState ? 'addClass' : 'removeClass';
      item.element[action](SCROLLVIEW_PULLDOWN_VISIBLE_TEXT_CLASS);
    });
  }

  update(): void {
    super.update();
    this._setTopPocketOffset();
  }

  _updateDimensions(): void {
    super._updateDimensions();
    this._topPocketSize = this._$topPocket.get(0).clientHeight;

    const contentEl = this._$scrollViewContent.get(0);
    const containerEl = this._$container.get(0);
    this._bottomBoundary = Math.max(contentEl.clientHeight - containerEl.clientHeight, 0);
  }

  _allowedDirections() {
    const allowedDirections = super._allowedDirections();
    allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
    return allowedDirections;
  }

  _setTopPocketOffset(): void {
    this._$topPocket.css({
      top: -this._topPocketSize,
    });
  }

  handleEnd(): void {
    super.handleEnd();
    this._complete();
  }

  handleStop(): void {
    super.handleStop();
    this._complete();
  }

  _complete(): void {
    if (this._state === STATE_READY) {
      this._setPullDownOffset(this._topPocketSize);
      clearTimeout(this._pullDownRefreshTimeout);
      this._pullDownRefreshTimeout = setTimeout(() => {
        this._pullDownRefreshing();
      }, 400);
    }
  }

  _setPullDownOffset(offset): void {
    move(this._$topPocket, { top: offset });
    move(this._$scrollViewContent, { top: offset });
  }

  handleScroll(e): void {
    super.handleScroll(e);

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
  }

  _isPullDown() {
    return this._pullDownEnabled && this._location >= this._topPocketSize;
  }

  _isReachBottom() {
    return this._reachBottomEnabled && this.isBottomReached();
  }

  isBottomReached() {
    return Math.round(this._bottomBoundary + Math.floor(this._location)) <= 1;
  }

  _reachBottom() {
    if (this._state === STATE_LOADING) {
      return;
    }
    this._state = STATE_LOADING;
    this.reachBottomCallbacks.fire();
  }

  _pullDownReady() {
    if (this._state === STATE_READY) {
      return;
    }
    this._state = STATE_READY;
    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._refreshPullDownText();
  }

  _stateReleased() {
    if (this._state === STATE_RELEASED) {
      return;
    }

    this._$pullDown
      .removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS)
      .removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);

    this._releaseState();
  }

  _pullDownRefreshing(): void {
    if (this._state === STATE_REFRESHING) {
      return;
    }
    this._state = STATE_REFRESHING;

    this._$pullDown
      .addClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS)
      .removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);

    this._refreshPullDownText();
    this.pullDownCallbacks.fire();
  }

  pullDownEnable(enabled): void {
    if (enabled) {
      this._updateDimensions();
      this._setTopPocketOffset();
    }
    this._pullDownEnabled = enabled;
  }

  reachBottomEnable(enabled): void {
    this._reachBottomEnabled = enabled;
  }

  pendingRelease(): void {
    this._state = STATE_READY;
  }

  release() {
    const deferred = Deferred();

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
  }

  dispose(): void {
    clearTimeout(this._pullDownRefreshTimeout);
    clearTimeout(this._releaseTimeout);
    super.dispose();
  }
}

export default PullDownNativeScrollViewStrategy;
