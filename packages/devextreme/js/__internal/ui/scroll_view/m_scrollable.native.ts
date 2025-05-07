import eventsEngine from '@js/common/core/events/core/events_engine';
import { isDxMouseWheelEvent } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';

import type Scrollable from './m_scrollable';
import Scrollbar from './m_scrollbar';

const SCROLLABLE_NATIVE = 'dxNativeScrollable';
const SCROLLABLE_NATIVE_CLASS = 'dx-scrollable-native';
const SCROLLABLE_SCROLLBAR_SIMULATED = 'dx-scrollable-scrollbar-simulated';
const SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden';

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const HIDE_SCROLLBAR_TIMEOUT = 500;
// @ts-expect-error dxClass inheritance issue
// eslint-disable-next-line @typescript-eslint/ban-types
class NativeStrategy extends (Class.inherit({}) as new() => {}) {
  _component!: Scrollable;

  _$element!: dxElementWrapper;

  _$container!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _useSimulatedScrollbar?: boolean;

  _direction?: string;

  _getMaxOffset!: () => { top: number; left: number };

  _allowedDirection!: () => string | null;

  _hideScrollbarTimeout?: ReturnType<typeof setTimeout> | number;

  _createActionByOption!: (event?: any) => (e?: Record<string, unknown>) => void;

  _isLocked!: () => boolean | undefined;

  _isRtlNativeStrategy!: () => boolean | undefined;

  _isDirection!: (direction) => boolean;

  option?: any;

  _scrollAction?: (args?) => void;

  _updateAction!: (args?) => void;

  _scrollbars?: Record<string, Scrollbar>;

  _contentSize!: { width: number; height: number };

  _containerSize!: { width: number; height: number };

  _componentContentSize!: { width: number; height: number };

  _eventForUserAction?: any;

  ctor(scrollable): void {
    this._init(scrollable);
  }

  _init(scrollable: Scrollable) {
    this._component = scrollable;
    this._$element = scrollable.$element();
    this._$container = $(scrollable.container());
    this._$content = scrollable.$content();

    const { direction, useSimulatedScrollbar } = scrollable.option();

    this._direction = direction;
    this._useSimulatedScrollbar = useSimulatedScrollbar;

    this.option = scrollable.option.bind(scrollable);
    this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
    this._isLocked = scrollable._isLocked.bind(scrollable);
    this._isDirection = scrollable._isDirection.bind(scrollable);
    this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
    this._getMaxOffset = scrollable._getMaxOffset.bind(scrollable);
    this._isRtlNativeStrategy = scrollable._isRtlNativeStrategy.bind(scrollable);
  }

  render(): void {
    const device = devices.real();
    const deviceType = device.platform;

    this._$element
      .addClass(SCROLLABLE_NATIVE_CLASS)
      .addClass(`${SCROLLABLE_NATIVE_CLASS}-${deviceType}`)
      .toggleClass(SCROLLABLE_SCROLLBARS_HIDDEN, !this._isScrollbarVisible());

    if (this._isScrollbarVisible() && this._useSimulatedScrollbar) {
      this._renderScrollbars();
    }
  }

  updateRtlPosition(isFirstRender): void {
    if (isFirstRender && this.option('rtlEnabled')) {
      if (this._isScrollbarVisible() && this._useSimulatedScrollbar) {
        this._moveScrollbars();
      }
    }
  }

  _renderScrollbars(): void {
    this._scrollbars = {};
    this._hideScrollbarTimeout = 0;

    this._$element.addClass(SCROLLABLE_SCROLLBAR_SIMULATED);

    this._renderScrollbar(VERTICAL);
    this._renderScrollbar(HORIZONTAL);
  }

  _renderScrollbar(direction): void {
    if (!this._isDirection(direction)) {
      return;
    }
    // @ts-expect-error ts-error
    this._scrollbars[direction] = new Scrollbar($('<div>').appendTo(this._$element), {
      direction,
      expandable: this._component.option('scrollByThumb'),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleInit(e): void {}

  handleStart(): void {}

  handleMove(e): void {
    if (this._isLocked()) {
      e.cancel = true;
      return;
    }

    if (this._allowedDirection()) {
      e.originalEvent.isScrollingEvent = true;
    }
  }

  handleEnd(): void {}

  handleCancel(): void {}

  handleStop(): void {}

  _eachScrollbar(callback): void {
    callback = callback.bind(this);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    each(this._scrollbars || {}, (direction, scrollbar) => {
      callback(scrollbar, direction);
    });
  }

  createActions(): void {
    this._scrollAction = this._createActionByOption('onScroll');
    this._updateAction = this._createActionByOption('onUpdated');
  }

  _createActionArgs() {
    const { left, top } = this.location();

    return {
      event: this._eventForUserAction,
      scrollOffset: this._getScrollOffset(),
      reachedLeft: this._isRtlNativeStrategy() ? this._isReachedRight(-left) : this._isReachedLeft(left),
      reachedRight: this._isRtlNativeStrategy() ? this._isReachedLeft(-Math.abs(left)) : this._isReachedRight(left),
      reachedTop: this._isDirection(VERTICAL) ? Math.round(top) >= 0 : undefined,
      reachedBottom: this._isDirection(VERTICAL) ? Math.round(Math.abs(top) - this._getMaxOffset().top) >= 0 : undefined,
    };
  }

  _getScrollOffset() {
    const { top, left } = this.location();

    return {
      top: -top,
      left: this._normalizeOffsetLeft(-left),
    };
  }

  _normalizeOffsetLeft(scrollLeft) {
    if (this._isRtlNativeStrategy()) {
      return this._getMaxOffset().left + scrollLeft;
    }

    return scrollLeft;
  }

  _isReachedLeft(left) {
    return this._isDirection(HORIZONTAL) ? Math.round(left) >= 0 : undefined;
  }

  _isReachedRight(left) {
    return this._isDirection(HORIZONTAL) ? Math.round(Math.abs(left) - this._getMaxOffset().left) >= 0 : undefined;
  }

  _isScrollbarVisible() {
    const { showScrollbar } = this.option();

    return showScrollbar !== 'never' && showScrollbar !== false;
  }

  handleScroll(e): void {
    this._eventForUserAction = e;
    this._moveScrollbars();
    this._scrollAction?.(this._createActionArgs());
  }

  _moveScrollbars(): void {
    const { top, left } = this._getScrollOffset();

    this._eachScrollbar((scrollbar) => {
      scrollbar.moveTo({ top: -top, left: -left });
      scrollbar.option('visible', true);
    });

    this._hideScrollbars();
  }

  _hideScrollbars() {
    clearTimeout(this._hideScrollbarTimeout);

    this._hideScrollbarTimeout = setTimeout(() => {
      this._eachScrollbar((scrollbar) => {
        scrollbar.option('visible', false);
      });
    }, HIDE_SCROLLBAR_TIMEOUT);
  }

  location() {
    return {
      left: -this._$container.scrollLeft(),
      top: -this._$container.scrollTop(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  disabledChanged(): void {}

  update(): void {
    this._update();
    this._updateAction(this._createActionArgs());
  }

  _update(): void {
    this._updateDimensions();
    this._updateScrollbars();
  }

  _updateDimensions(): void {
    this._containerSize = {
      height: getHeight(this._$container),
      width: getWidth(this._$container),
    };
    this._componentContentSize = {
      height: getHeight(this._component.$content()),
      width: getWidth(this._component.$content()),
    };
    this._contentSize = {
      height: getHeight(this._$content),
      width: getWidth(this._$content),
    };
  }

  _updateScrollbars(): void {
    this._eachScrollbar(function (scrollbar, direction) {
      const dimension = direction === VERTICAL ? 'height' : 'width';
      scrollbar.option({
        containerSize: this._containerSize[dimension],
        contentSize: this._componentContentSize[dimension],
      });
      scrollbar.update();
    });
  }

  _allowedDirections(): {
    vertical: boolean;
    horizontal: boolean;
  } {
    return {
      vertical: this._isDirection(VERTICAL) && this._contentSize.height > this._containerSize.height,
      horizontal: this._isDirection(HORIZONTAL) && this._contentSize.width > this._containerSize.width,
    };
  }

  dispose(): void {
    const { className } = this._$element.get(0);
    const scrollableNativeRegexp = new RegExp(`${SCROLLABLE_NATIVE_CLASS}\\S*`, 'g');

    if (scrollableNativeRegexp.test(className)) {
      // @ts-expect-error ts-error
      this._$element.removeClass(className.match(scrollableNativeRegexp).join(' '));
    }

    eventsEngine.off(this._$element, `.${SCROLLABLE_NATIVE}`);
    eventsEngine.off(this._$container, `.${SCROLLABLE_NATIVE}`);
    this._removeScrollbars();
    clearTimeout(this._hideScrollbarTimeout);
  }

  _removeScrollbars(): void {
    this._eachScrollbar((scrollbar) => {
      scrollbar.$element().remove();
    });
  }

  scrollBy(distance): void {
    const location = this.location();
    // @ts-expect-error ts-error
    this._$container.scrollTop(Math.round(-location.top - distance.top));
    // @ts-expect-error ts-error
    this._$container.scrollLeft(Math.round(-location.left - distance.left));
  }

  validate(e): boolean {
    const { disabled } = this.option();

    if (disabled) {
      return false;
    }

    if (isDxMouseWheelEvent(e) && this._isScrolledInMaxDirection(e)) {
      return false;
    }

    return !!this._allowedDirection();
  }

  // TODO: rtl
  // TODO: horizontal scroll when shift is pressed
  _isScrolledInMaxDirection(e) {
    const container = this._$container.get(0);
    let result;

    if (e.delta > 0) {
      result = e.shiftKey ? !container.scrollLeft : !container.scrollTop;
    } else if (e.shiftKey) {
      result = container.scrollLeft >= this._getMaxOffset().left;
    } else {
      result = container.scrollTop >= this._getMaxOffset().top;
    }

    return result;
  }

  getDirection(): string | null {
    return this._allowedDirection();
  }
}

export default NativeStrategy;
