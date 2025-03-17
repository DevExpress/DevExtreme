/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
// @ts-expect-error ts-error
import { executeAsync } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getHeight } from '@js/core/utils/size';
import LoadIndicator from '@js/ui/load_indicator';

import { Scroller, SimulatedStrategy } from './m_scrollable.simulated';

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
export class ScrollViewScroller extends Scroller {
  _releaseTask?: DeferredObj<unknown>;

  _state?: number;

  _topPocketSize!: number;

  _bottomPocketSize!: number;

  _$topPocket!: dxElementWrapper;

  _$pullDown!: dxElementWrapper;

  _$pullingDownText?: dxElementWrapper;

  _$pulledDownText?: dxElementWrapper;

  _$refreshingText?: dxElementWrapper;

  _$bottomPocket!: dxElementWrapper;

  _reachBottomEnabled!: boolean;

  _pullDownEnabled!: boolean;

  _bottomBoundary!: number;

  pullDownCallbacks!: Callback;

  releaseCallbacks!: Callback;

  reachBottomCallbacks!: Callback;

  ctor(): void {
    this._topPocketSize = 0;
    this._bottomPocketSize = 0;
    // @ts-expect-error ts-error
    super.ctor.apply(this, arguments);
    this._initCallbacks();
    this._releaseState();
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

  _initCallbacks(): void {
    this.pullDownCallbacks = Callbacks();
    this.releaseCallbacks = Callbacks();
    this.reachBottomCallbacks = Callbacks();
  }

  _updateBounds(): void {
    const considerPockets = this._direction !== 'horizontal';

    if (considerPockets) {
      this._topPocketSize = this._$topPocket.get(0).clientHeight;
      this._bottomPocketSize = this._$bottomPocket.get(0).clientHeight;

      const containerEl = this._$container.get(0);
      const contentEl = this._$content.get(0);
      this._bottomBoundary = Math.max(contentEl.clientHeight - this._bottomPocketSize - containerEl.clientHeight, 0);
    }

    super._updateBounds();
  }

  _updateScrollbar(): void {
    this._scrollbar.option({
      containerSize: this._containerSize(),
      contentSize: this._contentSize() - this._topPocketSize - this._bottomPocketSize,
      scaleRatio: this._getScaleRatio(),
    });
  }

  _moveContent(): void {
    super._moveContent();

    if (this._isPullDown()) {
      this._pullDownReady();
    } else if (this._isReachBottom()) {
      this._reachBottomReady();
    } else if (this._state !== STATE_RELEASED) {
      this._stateReleased();
    }
  }

  _moveScrollbar(): void {
    this._scrollbar.moveTo(this._topPocketSize + this._location);
  }

  _isPullDown(): boolean {
    return this._pullDownEnabled && this._location >= 0;
  }

  _isReachBottom(): boolean {
    return this._reachBottomEnabled && this.isBottomReached();
  }

  isBottomReached() {
    const containerEl = this._$container.get(0);

    return Math.round(this._bottomBoundary - Math.ceil(containerEl.scrollTop)) <= 1;
  }

  _scrollComplete(): void {
    if (this._inBounds() && this._state === STATE_READY) {
      this._pullDownRefreshing();
    } else if (this._inBounds() && this._state === STATE_LOADING) {
      this._reachBottomLoading();
    } else {
      super._scrollComplete();
    }
  }

  _reachBottomReady(): void {
    if (this._state === STATE_LOADING) {
      return;
    }

    this._state = STATE_LOADING;
    this._minOffset = this._getMinOffset();
  }

  _getMaxOffset(): number {
    return -this._topPocketSize;
  }

  _getMinOffset(): number {
    return Math.min(super._getMinOffset(), -this._topPocketSize);
  }

  _reachBottomLoading(): void {
    this.reachBottomCallbacks.fire();
  }

  _pullDownReady(): void {
    if (this._state === STATE_READY) {
      return;
    }

    this._state = STATE_READY;
    this._maxOffset = 0;

    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_READY_CLASS);
    this._refreshPullDownText();
  }

  _stateReleased(): void {
    if (this._state === STATE_RELEASED) {
      return;
    }

    this._releaseState();
    this._updateBounds();

    this._$pullDown
      .removeClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS)
      .removeClass(SCROLLVIEW_PULLDOWN_READY_CLASS);

    this.releaseCallbacks.fire();
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

  _releaseHandler() {
    if (this._state === STATE_RELEASED) {
      this._moveToBounds();
    }
    this._update();

    if (this._releaseTask) {
      // @ts-expect-error ts-error
      this._releaseTask.abort();
    }

    this._releaseTask = executeAsync(this._release.bind(this));
    return this._releaseTask?.promise;
  }

  _release(): void {
    this._stateReleased();
    this._scrollComplete();
  }

  _reachBottomEnablingHandler(enabled) {
    if (this._reachBottomEnabled === enabled) {
      return;
    }

    this._reachBottomEnabled = enabled;
    this._updateBounds();
  }

  _pullDownEnablingHandler(enabled): void {
    if (this._pullDownEnabled === enabled) {
      return;
    }

    this._pullDownEnabled = enabled;
    this._considerTopPocketChange();
    this._updateHandler();
  }

  _considerTopPocketChange(): void {
    this._location -= getHeight(this._$topPocket) || -this._topPocketSize;
    this._maxOffset = 0;
    this._move();
  }

  _pendingReleaseHandler(): void {
    this._state = STATE_READY;
  }

  dispose(): void {
    if (this._releaseTask) {
      // @ts-expect-error ts-error
      this._releaseTask.abort();
    }
    super.dispose();
  }
}

class SimulatedScrollViewStrategy extends SimulatedStrategy {
  pullDownCallbacks!: Callback;

  releaseCallbacks!: Callback;

  reachBottomCallbacks!: Callback;

  _$pullDown!: dxElementWrapper;

  _$topPocket?: dxElementWrapper;

  _$bottomPocket?: dxElementWrapper;

  _$pullingDownText?: dxElementWrapper;

  _$pullDownText?: dxElementWrapper;

  _$pulledDownText?: dxElementWrapper;

  _$refreshingText?: dxElementWrapper;

  _init(scrollView): void {
    super._init(scrollView);
    this._$pullDown = scrollView._$pullDown;
    this._$topPocket = scrollView._$topPocket;
    this._$bottomPocket = scrollView._$bottomPocket;
    this._initCallbacks();
  }

  _initCallbacks(): void {
    this.pullDownCallbacks = Callbacks();
    this.releaseCallbacks = Callbacks();
    this.reachBottomCallbacks = Callbacks();
  }

  render(): void {
    this._renderPullDown();
    super.render();
  }

  _renderPullDown(): void {
    const $image = $('<div>').addClass(SCROLLVIEW_PULLDOWN_IMAGE_CLASS);
    const $loadContainer = $('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
    // @ts-expect-error
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

  pullDownEnable(enabled): void {
    this._eventHandler('pullDownEnabling', enabled);
  }

  reachBottomEnable(enabled): void {
    this._eventHandler('reachBottomEnabling', enabled);
  }

  _createScroller(direction): void {
    const that = this;
    // @ts-expect-error ts-error
    const scroller = that._scrollers[direction] = new ScrollViewScroller(that._scrollerOptions(direction));
    scroller.pullDownCallbacks.add(() => { that.pullDownCallbacks.fire(); });
    scroller.releaseCallbacks.add(() => { that.releaseCallbacks.fire(); });
    scroller.reachBottomCallbacks.add(() => { that.reachBottomCallbacks.fire(); });
  }

  _scrollerOptions(direction) {
    return {
      ...super._scrollerOptions(direction),
      $topPocket: this._$topPocket,
      $bottomPocket: this._$bottomPocket,
      $pullDown: this._$pullDown,
      $pullDownText: this._$pullDownText,
      $pullingDownText: this._$pullingDownText,
      $pulledDownText: this._$pulledDownText,
      $refreshingText: this._$refreshingText,
    };
  }

  pendingRelease(): void {
    this._eventHandler('pendingRelease');
  }

  release() {
    // @ts-expect-error ts-error
    return this._eventHandler('release').done(this._updateAction);
  }

  location() {
    const location = super.location();
    location.top += getHeight(this._$topPocket);
    return location;
  }

  isBottomReached() {
    // @ts-expect-error ts-error
    return this._scrollers.vertical.isBottomReached();
  }

  dispose() {
    each(this._scrollers, function () {
      this.dispose();
    });
    super.dispose();
  }
}

export default SimulatedScrollViewStrategy;
