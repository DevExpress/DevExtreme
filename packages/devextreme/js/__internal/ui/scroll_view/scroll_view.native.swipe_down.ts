import { move } from '@js/common/core/animation/translator';
import { eventData } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import { Deferred } from '@js/core/utils/deferred';
import { getOuterHeight } from '@js/core/utils/size';
import LoadIndicator from '@js/ui/load_indicator';
import type { ScrollEvent } from '@js/ui/scroll_view';
import type { ScrollView, ScrollViewProperties } from '@ts/ui/scroll_view/scroll_view';
import NativeStrategy from '@ts/ui/scroll_view/scrollable.native';
import type { AllowedDirections, DxMouseEvent } from '@ts/ui/scroll_view/types';

const SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS = 'dx-scrollview-pull-down-loading';
const SCROLLVIEW_PULLDOWN_INDICATOR_CLASS = 'dx-scrollview-pull-down-indicator';
const SCROLLVIEW_PULLDOWN_REFRESHING_CLASS = 'dx-scrollview-pull-down-refreshing';
const PULLDOWN_ICON_CLASS = 'dx-icon-pulldown';

const STATE_RELEASED = 0;
const STATE_READY = 1;
const STATE_REFRESHING = 2;
const STATE_TOUCHED = 4;
const STATE_PULLED = 5;
class SwipeDownNativeScrollViewStrategy<
  TProperties extends ScrollViewProperties = ScrollViewProperties,
> extends NativeStrategy<TProperties> {
  pullDownCallbacks!: Callback;

  releaseCallbacks!: Callback;

  reachBottomCallbacks!: Callback;

  _$topPocket!: dxElementWrapper;

  _$pullDown!: dxElementWrapper;

  _$refreshingText?: dxElementWrapper;

  _$scrollViewContent!: dxElementWrapper;

  _$icon!: dxElementWrapper;

  _state?: number;

  _topPocketSize!: number;

  // eslint-disable-next-line no-restricted-globals
  _releaseTimeout?: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line no-restricted-globals
  _pullDownRefreshTimeout?: ReturnType<typeof setTimeout>;

  _reachBottomEnabled!: boolean;

  _pullDownEnabled!: boolean;

  _bottomBoundary!: number;

  _location!: number;

  _startClientY!: number;

  _deltaY!: number;

  // @ts-expect-error ts-error
  _init(scrollView: ScrollView): void {
    // @ts-expect-error ts-error
    super._init(scrollView);
    this._$topPocket = scrollView._$topPocket;
    this._$pullDown = scrollView._$pullDown;
    this._$scrollViewContent = $(scrollView.content());
    this._$container = $(scrollView.container());
    this._initCallbacks();

    this._location = 0;
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
    const $loadContainer = $('<div>').addClass(SCROLLVIEW_PULLDOWN_INDICATOR_CLASS);
    const loadIndicatorElement = $('<div>')[0];
    const $loadIndicator = new LoadIndicator(loadIndicatorElement).$element();

    this._$icon = $('<div>')
      .addClass(PULLDOWN_ICON_CLASS);

    this._$pullDown
      .empty()
      .append(this._$icon)
      .append($loadContainer.append($loadIndicator));
  }

  _releaseState(): void {
    this._state = STATE_RELEASED;
    this._releasePullDown();
    this._updateDimensions();
  }

  _releasePullDown(): void {
    this._$pullDown.css({
      opacity: 0,
    });
  }

  _updateDimensions(): void {
    super._updateDimensions();
    this._topPocketSize = this._$topPocket.get(0).clientHeight;

    const contentEl = this._$scrollViewContent.get(0);
    const containerEl = this._$container.get(0);
    this._bottomBoundary = Math.max(contentEl.clientHeight - containerEl.clientHeight, 0);
  }

  _allowedDirections(): AllowedDirections {
    const allowedDirections = super._allowedDirections();
    allowedDirections.vertical = allowedDirections.vertical || this._pullDownEnabled;
    return allowedDirections;
  }

  handleInit(e: ScrollEvent): void {
    super.handleInit(e);

    if (this._state === STATE_RELEASED && this._location === 0) {
      // @ts-expect-error ts-error
      this._startClientY = eventData(e.originalEvent).y;
      this._state = STATE_TOUCHED;
    }
  }

  handleMove(e: DxMouseEvent): void {
    super.handleMove(e);
    this._deltaY = eventData(e.originalEvent).y - this._startClientY;

    if (this._state === STATE_TOUCHED) {
      if (this._pullDownEnabled && this._deltaY > 0) {
        this._state = STATE_PULLED;
      } else {
        this._complete();
      }
    }

    if (this._state === STATE_PULLED) {
      e.preventDefault();
      this._movePullDown();
    }
  }

  _movePullDown(): void {
    const pullDownHeight = this._getPullDownHeight();
    const top = Math.min(pullDownHeight * 3, this._deltaY + this._getPullDownStartPosition());
    const angle = (180 * top) / (pullDownHeight * 3);

    this._$pullDown
      .css({
        opacity: 1,
      })
      .toggleClass(SCROLLVIEW_PULLDOWN_REFRESHING_CLASS, top < pullDownHeight);

    move(this._$pullDown, { top });

    this._$icon.css({
      transform: `rotate(${angle}deg)`,
    });
  }

  _isPullDown(): boolean {
    return this._pullDownEnabled
      && this._state === STATE_PULLED
      && this._deltaY >= this._getPullDownHeight() - this._getPullDownStartPosition();
  }

  _getPullDownHeight(): number {
    return Math.round(getOuterHeight(this._$element) * 0.05);
  }

  _getPullDownStartPosition(): number {
    return -Math.round(getOuterHeight(this._$pullDown) * 1.5);
  }

  handleEnd(): void {
    if (this._isPullDown()) {
      this._pullDownRefreshing();
    }

    this._complete();
  }

  handleStop(): void {
    this._complete();
  }

  _complete(): void {
    if (this._state === STATE_TOUCHED || this._state === STATE_PULLED) {
      this._releaseState();
    }
  }

  handleScroll(e: ScrollEvent): void {
    super.handleScroll(e);

    // TODO: replace with disabled check
    if (this._state === STATE_REFRESHING) {
      return;
    }

    const currentLocation = this.location().top;
    const scrollDelta = this._location - currentLocation;

    this._location = currentLocation;

    if (scrollDelta > 0 && this._isReachBottom()) {
      this._reachBottom();
    } else {
      this._stateReleased();
    }
  }

  _isReachBottom(): boolean {
    return this._reachBottomEnabled && this.isBottomReached();
  }

  isBottomReached(): boolean {
    return Math.round(this._bottomBoundary + Math.floor(this._location)) <= 1;
  }

  _reachBottom(): void {
    this.reachBottomCallbacks.fire();
  }

  _stateReleased(): void {
    if (this._state === STATE_RELEASED) {
      return;
    }

    this._$pullDown.removeClass(SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS);
    this._releaseState();
  }

  _pullDownRefreshing(): void {
    this._state = STATE_REFRESHING;
    this._pullDownRefreshHandler();
  }

  _pullDownRefreshHandler(): void {
    this._refreshPullDown();
    this.pullDownCallbacks.fire();
  }

  _refreshPullDown(): void {
    this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS);
    move(this._$pullDown, { top: this._getPullDownHeight() });
  }

  pullDownEnable(enabled: boolean): void {
    this._$topPocket.toggle(enabled);
    this._pullDownEnabled = enabled;
  }

  reachBottomEnable(enabled: boolean): void {
    this._reachBottomEnabled = enabled;
  }

  pendingRelease(): void {
    this._state = STATE_READY;
  }

  release(): PromiseLike<unknown> {
    const deferred = Deferred();

    this._updateDimensions();
    clearTimeout(this._releaseTimeout);
    // eslint-disable-next-line no-restricted-globals
    this._releaseTimeout = setTimeout(() => {
      this._stateReleased();
      this.releaseCallbacks.fire();
      this._updateAction();
      deferred.resolve();
    }, 800);

    return deferred.promise();
  }

  dispose(): void {
    clearTimeout(this._pullDownRefreshTimeout);
    clearTimeout(this._releaseTimeout);
    super.dispose();
  }
}

export default SwipeDownNativeScrollViewStrategy;
