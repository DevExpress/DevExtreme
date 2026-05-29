/* eslint-disable max-classes-per-file */
import type { Orientation, ScrollDirection } from '@js/common';
import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  addNamespace as addEventNamespace,
  isCommandKeyPressed,
  isDxMouseWheelEvent,
  normalizeKeyName,
} from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  deferRender,
  // @ts-expect-error ts-error
  deferRenderer,
  deferUpdate,
  // @ts-expect-error ts-error
  deferUpdater,
} from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { titleize } from '@js/core/utils/inflector';
import { each, map } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { ScrollEvent } from '@js/ui/scroll_view';
import { logger } from '@ts/core/utils/m_console';
import type { ActionConfig } from '@ts/core/widget/component';
import Animator from '@ts/ui/scroll_view/animator';
import type { ScrollViewScroller } from '@ts/ui/scroll_view/scroll_view.simulated';
import type Scrollable from '@ts/ui/scroll_view/scrollable';
import type { ScrollableProperties } from '@ts/ui/scroll_view/scrollable';
import Scrollbar from '@ts/ui/scroll_view/scrollbar';
import type {
  AllowedDirections, DxMouseEvent, DxMouseWheelEvent, ScrollEventArgs, ScrollOffset,
} from '@ts/ui/scroll_view/types';
import { getAdjustedBaseContainerSize } from '@ts/ui/scroll_view/utils/get_adjusted_base_container_size';

interface ScrollVelocity {
  x: number;
  y: number;
}

const SCROLLABLE_SIMULATED = 'dxSimulatedScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_SIMULATED_CURSOR = `${SCROLLABLE_SIMULATED}Cursor`;
const SCROLLABLE_SIMULATED_KEYBOARD = `${SCROLLABLE_SIMULATED}Keyboard`;
const SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';
const SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible';
const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const ACCELERATION = 0.92;
const OUT_BOUNDS_ACCELERATION = 0.5;
const MIN_VELOCITY_LIMIT = 1;
const FRAME_DURATION = Math.round(1000 / 60);
const SCROLL_LINE_HEIGHT = 40;
const VALIDATE_WHEEL_TIMEOUT = 500;

const BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
const BOUNCE_DURATION = 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
const BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);

const KEY_CODES = {
  PAGE_UP: 'pageUp',
  PAGE_DOWN: 'pageDown',
  END: 'end',
  HOME: 'home',
  LEFT: 'leftArrow',
  UP: 'upArrow',
  RIGHT: 'rightArrow',
  DOWN: 'downArrow',
  TAB: 'tab',
};

interface ScrollByDelta { x: number; y: number }

export interface ScrollerOptions {
  direction: string;
  $content: dxElementWrapper;
  $container: dxElementWrapper;
  $wrapper: dxElementWrapper;
  $element: dxElementWrapper;
  scrollByThumb?: boolean;
  scrollbarVisible?: boolean | string;
  bounceEnabled?: boolean;
  inertiaEnabled?: boolean;
  isAnyThumbScrolling: (target: dxElementWrapper) => boolean;

  $topPocket?: dxElementWrapper;
  $bottomPocket?: dxElementWrapper;
  $pullDown?: dxElementWrapper;
  $pullDownText?: dxElementWrapper;
  $pullingDownText?: dxElementWrapper;
  $pulledDownText?: dxElementWrapper;
  $refreshingText?: dxElementWrapper;
}

class InertiaAnimator extends Animator {
  InertiaAnimator?: Scroller;

  scroller!: Scroller;

  VELOCITY_LIMIT: number = MIN_VELOCITY_LIMIT;

  constructor(scroller: Scroller) {
    super();
    this.scroller = scroller;
  }

  _isFinished(): boolean {
    return Math.abs(this.scroller._velocity) <= this.VELOCITY_LIMIT;
  }

  _step(): void {
    this.scroller._scrollStep(this.scroller._velocity);
    this.scroller._velocity *= this._acceleration();
  }

  _acceleration(): number {
    return this.scroller._inBounds() ? ACCELERATION : OUT_BOUNDS_ACCELERATION;
  }

  _complete(): void {
    this.scroller._scrollComplete();
  }
}

class BounceAnimator extends InertiaAnimator {
  VELOCITY_LIMIT: number = BOUNCE_MIN_VELOCITY_LIMIT;

  _isFinished(): boolean {
    return this.scroller._crossBoundOnNextStep() || super._isFinished();
  }

  _acceleration(): number {
    return ACCELERATION;
  }

  _complete(): void {
    this.scroller._move(this.scroller._bounceLocation);
    super._complete();
  }
}

export class Scroller {
  _scrollbar!: Scrollbar;

  _direction?: string;

  _$element!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _$container!: dxElementWrapper;

  _bounceAction?: () => void;

  _scrollAction?: () => void;

  _maxScrollPropValue!: number;

  _scaleRatio?: number | null;

  _inertiaAnimator!: InertiaAnimator;

  _bounceAnimator!: BounceAnimator;

  _scrollProp!: 'scrollLeft' | 'scrollTop';

  _dimension!: 'width' | 'height';

  _prop!: 'left' | 'top';

  _axis!: 'x' | 'y';

  _bottomReached?: boolean;

  _topReached?: boolean;

  _location!: number;

  _velocity!: number;

  _bounceLocation?: number;

  _minOffset!: number;

  _maxOffset!: number;

  _scrollByThumb!: boolean;

  _scrollbarVisible?: boolean;

  _$scrollbar!: dxElementWrapper;

  _thumbScrolling?: boolean;

  _crossThumbScrolling?: boolean;

  _inertiaEnabled?: boolean;

  _completeDeferred?: DeferredObj<unknown>;

  _translateOffset?: number;

  _bounceEnabled?: boolean;

  _isAnyThumbScrolling!: (target: dxElementWrapper) => boolean;

  constructor(options: ScrollerOptions) {
    this._initOptions(options);
    this._initAnimators();
    this._initScrollbar();
  }

  _initOptions(options: ScrollerOptions): void {
    this._location = 0;
    this._topReached = false;
    this._bottomReached = false;
    this._axis = options.direction === HORIZONTAL ? 'x' : 'y';
    this._prop = options.direction === HORIZONTAL ? 'left' : 'top';
    this._dimension = options.direction === HORIZONTAL ? 'width' : 'height';
    this._scrollProp = options.direction === HORIZONTAL ? 'scrollLeft' : 'scrollTop';

    each(options, (optionName, optionValue) => {
      this[`_${optionName}`] = optionValue;
    });
  }

  _initAnimators(): void {
    this._inertiaAnimator = new InertiaAnimator(this);
    this._bounceAnimator = new BounceAnimator(this);
  }

  _initScrollbar(): void {
    // @ts-expect-error ts-error
    this._scrollbar = new Scrollbar($('<div>').appendTo(this._$container), {
      direction: this._direction,
      visible: this._scrollByThumb,
      visibilityMode: this._visibilityModeNormalize(this._scrollbarVisible),
      expandable: this._scrollByThumb,
    });
    this._$scrollbar = this._scrollbar.$element();
  }

  _visibilityModeNormalize(mode: boolean | string | undefined): string {
    if (mode === true) return 'onScroll';
    if (mode === false) return 'never';
    return mode ?? 'never';
  }

  _scrollStep(delta: number): void {
    const prevLocation = this._location;

    this._location += delta;
    this._suppressBounce();
    this._move();

    if (Math.abs(prevLocation - this._location) < 1) {
      return;
    }

    eventsEngine.triggerHandler(this._$container, { type: 'scroll' });
  }

  _suppressBounce(): void {
    if (this._bounceEnabled || this._inBounds(this._location)) {
      return;
    }

    this._velocity = 0;
    this._location = this._boundLocation();
  }

  _boundLocation(location?: number): number {
    const actualLocation = location ?? this._location;
    return Math.max(Math.min(actualLocation, this._maxOffset), this._minOffset);
  }

  _move(location?: number): void {
    this._location = location !== undefined ? location * this._getScaleRatio() : this._location;
    this._moveContent();
    this._moveScrollbar();
  }

  _moveContent(): void {
    const location = this._location;
    // @ts-expect-error ts-error
    this._$container[this._scrollProp](-location / this._getScaleRatio());
    this._moveContentByTranslator(location);
  }

  _getScaleRatio(): number {
    if (hasWindow() && !this._scaleRatio) {
      const element = this._$element[0];
      const dimension = this._dimension;
      const realDimension = this._getRealDimension(element, dimension);
      const baseDimension = this._getBaseDimension(element, dimension);

      // NOTE: Ratio can be a fractional number,
      // which leads to inaccuracy in the calculation of sizes.
      // We should round it to hundredths in order to reduce the inaccuracy
      // and prevent the unexpected appearance of a scrollbar.
      this._scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this._scaleRatio || 1;
  }

  _getRealDimension(element: Element, dimension: string): number {
    return Math.round(getBoundingRect(element)[dimension]);
  }

  _getBaseDimension(element: HTMLElement, dimension: string): number {
    // @ts-expect-error ts-error
    const dimensionName: 'offsetWidth' | 'offsetHeight' = `offset${titleize(dimension)}`;

    return element[dimensionName];
  }

  _moveContentByTranslator(location: number): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let translateOffset;
    const minOffset = -this._maxScrollPropValue;

    if (location > 0) {
      translateOffset = location;
    }

    if (location <= minOffset) {
      translateOffset = location - minOffset;
    }

    if (this._translateOffset === translateOffset) {
      return;
    }

    const targetLocation = {};
    targetLocation[this._prop] = translateOffset;
    this._translateOffset = translateOffset;

    if (!translateOffset) {
      resetPosition(this._$content);
      return;
    }

    move(this._$content, targetLocation);
  }

  _moveScrollbar(): void {
    this._scrollbar.moveTo(this._location);
  }

  _scrollComplete(): void {
    if (this._inBounds()) {
      this._hideScrollbar();
      if (this._completeDeferred) {
        this._completeDeferred.resolve();
      }
    }
    this._scrollToBounds();
  }

  _scrollToBounds(): void {
    if (this._inBounds()) {
      return;
    }
    this._bounceAction?.();
    this._setupBounce();
    this._bounceAnimator.start();
  }

  _setupBounce(): void {
    this._bounceLocation = this._boundLocation();
    const bounceDistance = this._bounceLocation - this._location;

    this._velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  _inBounds(location?: number): boolean {
    const currentLocation = location ?? this._location;
    return this._boundLocation(currentLocation) === currentLocation;
  }

  _crossBoundOnNextStep(): boolean {
    const location = this._location;
    const nextLocation = location + this._velocity;

    return (location < this._minOffset && nextLocation >= this._minOffset)
      || (location > this._maxOffset && nextLocation <= this._maxOffset);
  }

  _initHandler(e: DxMouseEvent): void {
    this._stopScrolling();
    this._prepareThumbScrolling(e);
  }

  _stopScrolling(): void {
    deferRenderer(() => {
      this._hideScrollbar();
      this._inertiaAnimator.stop();
      this._bounceAnimator.stop();
    })();
  }

  _prepareThumbScrolling(e: DxMouseEvent): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      return;
    }

    const $target = $(e.originalEvent.target as Element);
    const scrollbarClicked = this._isScrollbar($target);

    if (scrollbarClicked) {
      this._moveToMouseLocation(e);
    }

    this._thumbScrolling = scrollbarClicked || this._isThumb($target);
    this._crossThumbScrolling = !this._thumbScrolling && this._isAnyThumbScrolling($target);

    if (this._thumbScrolling) {
      this._scrollbar.feedbackOn();
    }
  }

  _isThumbScrollingHandler($target: dxElementWrapper): boolean {
    return this._isThumb($target);
  }

  _moveToMouseLocation(e: DxMouseEvent): void {
    // @ts-expect-error ts-error
    const mouseLocation = e[`page${this._axis.toUpperCase()}`] - this._$element.offset()[this._prop];
    const location = this._location
      + mouseLocation / this._containerToContentRatio() - getHeight(this._$container) / 2;

    this._scrollStep(-Math.round(location));
  }

  _startHandler(): void {
    this._showScrollbar();
  }

  _moveHandler(delta: ScrollByDelta): void {
    if (this._crossThumbScrolling) {
      return;
    }

    if (this._thumbScrolling) {
      delta[this._axis] = -Math.round(delta[this._axis] / this._containerToContentRatio());
    }

    this._scrollBy(delta);
  }

  _scrollBy(delta: ScrollByDelta): void {
    let scrollDelta = delta[this._axis];
    if (!this._inBounds()) {
      scrollDelta *= OUT_BOUNDS_ACCELERATION;
    }
    this._scrollStep(scrollDelta);
  }

  _scrollByHandler(delta: ScrollByDelta): void {
    if (!delta.x && !delta.y) {
      return;
    }
    this._scrollBy(delta);
    this._scrollComplete();
  }

  _containerToContentRatio(): number {
    return this._scrollbar.containerToContentRatio();
  }

  _endHandler(velocity: ScrollVelocity): Promise<unknown> {
    this._completeDeferred = Deferred();
    this._velocity = velocity[this._axis];
    this._inertiaHandler();
    this._resetThumbScrolling();
    return this._completeDeferred.promise();
  }

  _inertiaHandler(): void {
    this._suppressInertia();
    this._inertiaAnimator.start();
  }

  _suppressInertia(): void {
    if (!this._inertiaEnabled || this._thumbScrolling) {
      this._velocity = 0;
    }
  }

  _resetThumbScrolling(): void {
    this._thumbScrolling = false;
    this._crossThumbScrolling = false;
  }

  _stopHandler(): void {
    if (this._thumbScrolling) {
      this._scrollComplete();
    }
    this._resetThumbScrolling();
    this._scrollToBounds();
  }

  _disposeHandler(): void {
    this._stopScrolling();
    this._$scrollbar.remove();
  }

  _updateHandler(): void {
    this._update();
    this._moveToBounds();
  }

  _update(): unknown {
    this._stopScrolling();
    return deferUpdate(() => {
      this._resetScaleRatio();
      this._updateLocation();
      this._updateBounds();
      this._updateScrollbar();
      return deferRender(() => {
        this._moveScrollbar();
        this._scrollbar.update();
      });
    });
  }

  _resetScaleRatio(): void {
    this._scaleRatio = null;
  }

  _updateLocation(): void {
    // @ts-expect-error ts-error
    this._location = (locate(this._$content)[this._prop] - this._$container[this._scrollProp]())
      * this._getScaleRatio();
  }

  _updateBounds(): void {
    this._maxOffset = this._getMaxOffset();
    this._minOffset = this._getMinOffset();
  }

  _getMaxOffset(): number {
    return 0;
  }

  _getMinOffset(): number {
    this._maxScrollPropValue = Math.max(this._contentSize() - this._containerSize(), 0);
    return -this._maxScrollPropValue;
  }

  _updateScrollbar(): void {
    deferUpdater(() => {
      const dimension = this._dimension;
      const rawContainerSize = getBoundingRect(this._$container[0])[dimension];
      const containerSize = Math.round(rawContainerSize);
      const contentSize = this._contentSize();

      // NOTE: Real container and content sizes can be a fractional number when scaling.
      //       Let's save sizes when scale = 100% to decide whether it is necessary to show
      //       the scrollbar based on by more precise numbers. We can do it because the container
      //       size to content size ratio should remain approximately the same at any zoom.
      const rawBaseContainerSize = this._getBaseDimension(this._$container[0], dimension);
      const baseContentSize = this._getBaseDimension(this._$content[0], dimension);
      const baseContainerSize = getAdjustedBaseContainerSize(
        rawContainerSize,
        rawBaseContainerSize,
        baseContentSize,
      );

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferRender(() => {
        this._scrollbar.option({
          containerSize,
          contentSize,
          baseContainerSize,
          baseContentSize,
          scaleRatio: this._getScaleRatio(),
        });
      });
    })();
  }

  _moveToBounds(): void {
    deferRenderer(deferUpdater(deferRenderer(() => {
      const location = this._boundLocation();
      const locationChanged = location !== this._location;

      this._location = location;
      this._move();

      if (locationChanged) {
        this._scrollAction?.();
      }
    })))();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _createActionsHandler(actions): void {
    this._scrollAction = actions.scroll;
    this._bounceAction = actions.bounce;
  }

  _showScrollbar(): void {
    this._scrollbar.option('visible', true);
  }

  _hideScrollbar(): void {
    this._scrollbar.option('visible', false);
  }

  _containerSize(): number {
    return this._getRealDimension(this._$container.get(0), this._dimension);
  }

  _contentSize(): number {
    const isOverflowHidden = this._$content.css(`overflow${this._axis.toUpperCase()}`) === 'hidden';
    let contentSize = this._getRealDimension(this._$content.get(0), this._dimension);

    if (!isOverflowHidden) {
      const containerScrollSize = this._$content[0][`scroll${titleize(this._dimension)}`] * this._getScaleRatio();

      contentSize = Math.max(containerScrollSize, contentSize);
    }

    return contentSize;
  }

  _validateEvent(e: DxMouseEvent): boolean {
    const $target = $(e.originalEvent.target as Element);

    return this._isThumb($target) || this._isScrollbar($target);
  }

  _isThumb($element: dxElementWrapper): boolean {
    return this._scrollByThumb && this._scrollbar.isThumb($element);
  }

  _isScrollbar($element: dxElementWrapper | null): boolean {
    return Boolean(this._scrollByThumb && $element?.is(this._$scrollbar));
  }

  _reachedMin(): boolean {
    return Math.round(this._location - this._minOffset) <= 0;
  }

  _reachedMax(): boolean {
    return Math.round(this._location - this._maxOffset) >= 0;
  }

  _cursorEnterHandler(): void {
    this._resetScaleRatio();
    this._updateScrollbar();

    this._scrollbar.cursorEnter();
  }

  _cursorLeaveHandler(): void {
    this._scrollbar.cursorLeave();
  }

  isBottomReached(): boolean {
    return false;
  }

  dispose(): void {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hoveredScrollable: SimulatedStrategy<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let activeScrollable: SimulatedStrategy<any> | null = null;

export class SimulatedStrategy<
  TProperties extends ScrollableProperties = ScrollableProperties,
  TComponent extends Scrollable<TProperties> = Scrollable<TProperties>,
> {
  _component!: TComponent;

  _$element!: dxElementWrapper;

  _$container!: dxElementWrapper;

  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _updateHandlerTimeout?: ReturnType<typeof setTimeout>;

  _validateWheelTimer?: ReturnType<typeof setTimeout>;

  _eventForUserAction?: unknown;

  _allowedDirection!: () => ScrollDirection | null;

  option!: {
    (): TProperties;
    <K extends keyof TProperties>(name: K): TProperties[K];
    <K extends keyof TProperties>(name: K, value: TProperties[K]): void;
  };

  _scrollers!: Record<Orientation, Scroller | ScrollViewScroller>;

  _startAction?: (event?: Record<string, unknown>) => void;

  _endAction?: (event?: Record<string, unknown>) => void;

  _updateAction?: (event?: Record<string, unknown>) => void;

  _isLocked!: () => boolean;

  _rtlConfig!: {
    scrollRight: number;
    clientWidth?: number;
    windowPixelRatio: number;
    skipUpdating?: boolean;
  };

  _isDirection!: (direction: ScrollDirection) => boolean;

  _getMaxOffset!: () => ScrollOffset;

  _scrollOffset?: ScrollOffset;

  _createActionByOption!: (
    optionName: keyof TProperties,
    config?: ActionConfig,
  ) => (event?: Record<string, unknown>) => void;

  _scrollAction?: () => void;

  _bounceAction?: () => void;

  _validDirections!: Record<string, boolean>;

  constructor(scrollable: TComponent) {
    this._init(scrollable);
  }

  _init(scrollable: TComponent): void {
    this._component = scrollable;
    this._$element = scrollable.$element();
    this._$container = $(scrollable.container());
    this._$wrapper = scrollable._$wrapper;
    this._$content = scrollable.$content();
    this.option = scrollable.option.bind(scrollable);
    this._createActionByOption = scrollable._createActionByOption.bind(scrollable);
    this._isLocked = scrollable._isLocked.bind(scrollable);
    this._isDirection = scrollable._isDirection.bind(scrollable);
    this._allowedDirection = scrollable._allowedDirection.bind(scrollable);
    this._getMaxOffset = scrollable._getMaxOffset.bind(scrollable);
  }

  render(): void {
    this._$element.addClass(SCROLLABLE_SIMULATED_CLASS);
    this._createScrollers();

    const { useKeyboard } = this.option();

    if (useKeyboard) {
      this._$container.prop('tabIndex', 0);
    }
    this._attachKeyboardHandler();
    this._attachCursorHandlers();
  }

  _createScrollers(): void {
    // @ts-expect-error ts-error
    this._scrollers = {};

    if (this._isDirection(HORIZONTAL)) {
      this._createScroller(HORIZONTAL);
    }

    if (this._isDirection(VERTICAL)) {
      this._createScroller(VERTICAL);
    }

    this._$element.toggleClass(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE, this.option('showScrollbar') === 'always');
  }

  _createScroller(direction: Orientation): void {
    this._scrollers[direction] = new Scroller(this._scrollerOptions(direction));
  }

  _scrollerOptions(direction: Orientation): ScrollerOptions {
    return {
      direction,
      $content: this._$content,
      $container: this._$container,
      $wrapper: this._$wrapper,
      $element: this._$element,
      scrollByThumb: this.option('scrollByThumb'),
      scrollbarVisible: this.option('showScrollbar'),
      bounceEnabled: this.option('bounceEnabled'),
      inertiaEnabled: this.option('inertiaEnabled'),
      isAnyThumbScrolling: this._isAnyThumbScrolling.bind(this),
    };
  }

  _applyScaleRatio(targetLocation: Partial<ScrollOffset>): Partial<ScrollOffset> {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const direction in this._scrollers) {
      const prop = this._getPropByDirection(direction);

      if (isDefined(targetLocation[prop])) {
        const scroller = this._scrollers[direction];
        const currentValue = targetLocation[prop];
        if (currentValue !== undefined) {
          targetLocation[prop] = currentValue * scroller._getScaleRatio();
        }
      }
    }
    return targetLocation;
  }

  _isAnyThumbScrolling($target: dxElementWrapper): boolean {
    let result = false;
    // @ts-expect-error ts-error
    this._eventHandler('isThumbScrolling', $target).done((isThumbScrollingVertical, isThumbScrollingHorizontal) => {
      result = isThumbScrollingVertical || isThumbScrollingHorizontal;
    });
    return result;
  }

  handleInit(e: ScrollEvent): void {
    // @ts-expect-error ts-error
    this._suppressDirections(e);
    this._eventForUserAction = e;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('init', e);
  }

  _suppressDirections(e: DxMouseEvent): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      this._prepareDirections(true);
      return;
    }

    this._prepareDirections();
    this._eachScroller(function suppressDirections(scroller, direction) {
      const $target = $(e.originalEvent.target as Element);

      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const isValid = scroller._validateEvent(e) || (this.option('scrollByContent') && this._isContent($target));
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this._validDirections[direction] = isValid;
    });
  }

  _isContent($element: dxElementWrapper): boolean {
    return !!$element.closest(this._$element).length;
  }

  _prepareDirections(value = false): void {
    this._validDirections = {};
    this._validDirections[HORIZONTAL] = value;
    this._validDirections[VERTICAL] = value;
  }

  _eachScroller(
    callback: (
      this: SimulatedStrategy<TProperties>,
      scroller: Scroller | ScrollViewScroller,
      direction: Orientation,
    ) => void,
  ): void {
    const boundCallback = callback.bind(this);
    each(this._scrollers, (direction: Orientation, scroller: Scroller | ScrollViewScroller) => {
      boundCallback(scroller, direction);
    });
  }

  handleStart(e: DxMouseEvent): void {
    this._eventForUserAction = e;
    // @ts-expect-error ts-error
    this._eventHandler('start').done(this._startAction);
  }

  _saveActive(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeScrollable = this;
  }

  _resetActive(): void {
    if (activeScrollable === this) {
      activeScrollable = null;
    }
  }

  handleMove(e: DxMouseEvent): void {
    if (this._isLocked()) {
      e.cancel = true;
      this._resetActive();
      return;
    }
    this._saveActive();
    e.preventDefault?.();

    this._adjustDistance(e, e.delta);
    this._eventForUserAction = e;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('move', e.delta);
  }

  _adjustDistance(e: DxMouseEvent, distance: { x: number; y: number }): void {
    // @ts-expect-error ts-error
    distance.x *= this._validDirections[HORIZONTAL];
    // @ts-expect-error ts-error
    distance.y *= this._validDirections[VERTICAL];

    const devicePixelRatio = this._tryGetDevicePixelRatio();
    if (devicePixelRatio && isDxMouseWheelEvent(e.originalEvent)) {
      distance.x = Math.round((distance.x / devicePixelRatio) * 100) / 100;
      distance.y = Math.round((distance.y / devicePixelRatio) * 100) / 100;
    }
  }

  _tryGetDevicePixelRatio(): number | undefined {
    if (hasWindow()) {
      return getWindow().devicePixelRatio;
    }
    return undefined;
  }

  handleEnd(e: DxMouseEvent): Promise<unknown> {
    this._resetActive();
    this._refreshCursorState(e.originalEvent?.target ?? undefined);

    this._adjustDistance(e, e.velocity);
    this._eventForUserAction = e;
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._eventHandler('end', e.velocity).done(this._endAction);
  }

  handleCancel(e: DxMouseEvent): Promise<unknown> {
    this._resetActive();
    this._eventForUserAction = e;
    return this._eventHandler('end', { x: 0, y: 0 });
  }

  handleStop(): void {
    this._resetActive();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('stop');
  }

  handleScroll(): void {
    this._updateRtlConfig();
    this._scrollAction?.();
  }

  _attachKeyboardHandler(): void {
    eventsEngine.off(this._$element, `.${SCROLLABLE_SIMULATED_KEYBOARD}`);

    if (!this.option('disabled') && this.option('useKeyboard')) {
      eventsEngine.on(this._$element, addEventNamespace('keydown', SCROLLABLE_SIMULATED_KEYBOARD), this._keyDownHandler.bind(this));
    }
  }

  _keyDownHandler(e: KeyboardEvent): void {
    clearTimeout(this._updateHandlerTimeout);
    // eslint-disable-next-line no-restricted-globals
    this._updateHandlerTimeout = setTimeout(() => {
      if (normalizeKeyName(e) === KEY_CODES.TAB) {
        this._eachScroller((scroller) => {
          scroller._updateHandler();
        });
      }
    });
    // @ts-expect-error ts-error
    if (!this._$container.is(domAdapter.getActiveElement(this._$container.get(0)))) {
      return;
    }

    let handled = true;

    switch (normalizeKeyName(e)) {
      case KEY_CODES.DOWN:
        this._scrollByLine({ y: 1 });
        break;
      case KEY_CODES.UP:
        this._scrollByLine({ y: -1 });
        break;
      case KEY_CODES.RIGHT:
        this._scrollByLine({ x: 1 });
        break;
      case KEY_CODES.LEFT:
        this._scrollByLine({ x: -1 });
        break;
      case KEY_CODES.PAGE_DOWN:
        this._scrollByPage(1);
        break;
      case KEY_CODES.PAGE_UP:
        this._scrollByPage(-1);
        break;
      case KEY_CODES.HOME:
        this._scrollToHome();
        break;
      case KEY_CODES.END:
        this._scrollToEnd();
        break;
      default:
        handled = false;
        break;
    }

    if (handled) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _scrollByLine(lines: { x?: number; y?: number }): void {
    const devicePixelRatio = this._tryGetDevicePixelRatio();
    let scrollOffset = SCROLL_LINE_HEIGHT;
    if (devicePixelRatio) {
      scrollOffset = Math.abs((scrollOffset / devicePixelRatio) * 100) / 100;
    }
    this.scrollBy({
      top: (lines.y ?? 0) * -scrollOffset,
      left: (lines.x ?? 0) * -scrollOffset,
    });
  }

  _scrollByPage(page: number): void {
    const prop = this._wheelProp();
    const dimension = this._dimensionByProp(prop);

    const distance = {};
    const getter = dimension === 'width' ? getWidth : getHeight;
    distance[prop] = page * -getter(this._$container);
    this.scrollBy(distance);
  }

  _dimensionByProp(prop: 'top' | 'left'): 'width' | 'height' {
    return prop === 'left' ? 'width' : 'height';
  }

  _getPropByDirection(direction: string): 'left' | 'top' {
    return direction === HORIZONTAL ? 'left' : 'top';
  }

  _scrollToHome(): void {
    const prop = this._wheelProp();
    const distance = {};

    distance[prop] = 0;
    this._component.scrollTo(distance);
  }

  _scrollToEnd(): void {
    const prop = this._wheelProp();
    const dimension = this._dimensionByProp(prop);

    const distance = {};
    const getter = dimension === 'width' ? getWidth : getHeight;
    distance[prop] = getter(this._$content) - getter(this._$container);
    this._component.scrollTo(distance);
  }

  createActions(): void {
    this._startAction = this._createActionHandler('onStart');
    this._endAction = this._createActionHandler('onEnd');
    this._updateAction = this._createActionHandler('onUpdated');

    this._createScrollerActions();
  }

  _createScrollerActions(): void {
    this._scrollAction = this._createActionHandler('onScroll');
    this._bounceAction = this._createActionHandler('onBounce');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('createActions', {
      scroll: this._scrollAction,
      bounce: this._bounceAction,
    });
  }

  _createActionHandler(optionName: keyof TProperties): () => void {
    const actionHandler = this._createActionByOption(optionName);

    return (...args: unknown[]) => {
      try {
        actionHandler(extend(this._createActionArgs(), args));
      } catch (e) {
        logger.error(e);
      }
    };
  }

  _createActionArgs(): ScrollEventArgs {
    const { horizontal: scrollerX, vertical: scrollerY } = this._scrollers;

    const offset = this._getScrollOffset();

    this._scrollOffset = {
      top: scrollerY && offset.top,
      left: scrollerX && offset.left,
    };

    return {
      // @ts-expect-error ts-error
      event: this._eventForUserAction,
      scrollOffset: this._scrollOffset,
      reachedLeft: scrollerX?._reachedMax(),
      reachedRight: scrollerX?._reachedMin(),
      reachedTop: scrollerY?._reachedMax(),
      reachedBottom: scrollerY?._reachedMin(),
    };
  }

  _getScrollOffset(): ScrollOffset {
    return {
      top: -this.location().top,
      left: -this.location().left,
    };
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
  _eventHandler(eventName: string, location?: unknown) {
    // eslint-disable-next-line prefer-rest-params
    const args = [].slice.call(arguments).slice(1);
    // eslint-disable-next-line prefer-spread, @typescript-eslint/no-unsafe-return
    const deferreds = map(this._scrollers, (scroller) => scroller[`_${eventName}Handler`].apply(scroller, args));

    return when.apply($, deferreds).promise();
  }

  location(): ScrollOffset {
    const location = locate(this._$content);
    // @ts-expect-error ts-error
    location.top -= this._$container.scrollTop();
    // @ts-expect-error ts-error
    location.left -= this._$container.scrollLeft();
    return location;
  }

  disabledChanged(): void {
    this._attachCursorHandlers();
  }

  _attachCursorHandlers(): void {
    eventsEngine.off(this._$element, `.${SCROLLABLE_SIMULATED_CURSOR}`);

    const { disabled } = this.option();

    if (!disabled && this._isHoverMode()) {
      eventsEngine.on(this._$element, addEventNamespace('mouseenter', SCROLLABLE_SIMULATED_CURSOR), this._cursorEnterHandler.bind(this));
      eventsEngine.on(this._$element, addEventNamespace('mouseleave', SCROLLABLE_SIMULATED_CURSOR), this._cursorLeaveHandler.bind(this));
    }
  }

  _isHoverMode(): boolean {
    return this.option('showScrollbar') === 'onHover';
  }

  _cursorEnterHandler(e: DxMouseEvent): void {
    const event = e || {};
    event.originalEvent = event.originalEvent || {};
    // @ts-expect-error ts-error
    if (activeScrollable || event.originalEvent._hoverHandled) {
      return;
    }

    if (hoveredScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    hoveredScrollable = this;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('cursorEnter');
    // @ts-expect-error ts-error
    event.originalEvent._hoverHandled = true;
  }

  _cursorLeaveHandler(e?: DxMouseEvent): void {
    if (hoveredScrollable !== this || activeScrollable === hoveredScrollable) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('cursorLeave');
    hoveredScrollable = null;
    this._refreshCursorState(e?.relatedTarget);
  }

  _refreshCursorState(target?: EventTarget | null): void {
    if (!this._isHoverMode() && (!target || activeScrollable)) {
      return;
    }

    const $target = $(target as Element);
    const $scrollable = $target.closest(`.${SCROLLABLE_SIMULATED_CLASS}:not(.dx-state-disabled)`);
    const targetScrollable = $scrollable.length && $scrollable.data(SCROLLABLE_STRATEGY);
    // @ts-expect-error ts-error
    if (hoveredScrollable && hoveredScrollable !== targetScrollable) {
      hoveredScrollable._cursorLeaveHandler();
    }

    if (targetScrollable) {
      // @ts-expect-error ts-error
      targetScrollable._cursorEnterHandler();
    }
  }

  update(): unknown {
    // @ts-expect-error ts-error
    const result = this._eventHandler('update').done(this._updateAction);

    return when(result, deferUpdate(() => {
      const allowedDirections = this._allowedDirections();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferRender(() => {
        let touchDirection = allowedDirections.vertical ? 'pan-x' : '';
        touchDirection = allowedDirections.horizontal ? 'pan-y' : touchDirection;
        touchDirection = allowedDirections.vertical && allowedDirections.horizontal ? 'none' : touchDirection;
        this._$container.css('touchAction', touchDirection);
      });
      return when().promise();
    }));
  }

  _allowedDirections(): AllowedDirections {
    const { bounceEnabled } = this.option();
    const verticalScroller = this._scrollers[VERTICAL];
    const horizontalScroller = this._scrollers[HORIZONTAL];

    return {
      vertical: Boolean(verticalScroller
        && (verticalScroller._minOffset < 0 || bounceEnabled)),
      horizontal: Boolean(horizontalScroller
        && (horizontalScroller._minOffset < 0 || bounceEnabled)),
    };
  }

  _updateBounds(): void {
    this._scrollers[HORIZONTAL]?._updateBounds();
  }

  _isHorizontalAndRtlEnabled(): boolean {
    return this.option('rtlEnabled')
      && this.option('direction') !== VERTICAL;
  }

  updateRtlPosition(needInitializeRtlConfig?: boolean): void {
    if (needInitializeRtlConfig) {
      this._rtlConfig = {
        scrollRight: 0,
        clientWidth: this._$container.get(0).clientWidth,
        windowPixelRatio: this._getWindowDevicePixelRatio(),
      };
    }

    this._updateBounds();
    if (this._isHorizontalAndRtlEnabled()) {
      let scrollLeft = this._getMaxOffset().left - this._rtlConfig.scrollRight;

      if (scrollLeft <= 0) {
        scrollLeft = 0;
        this._rtlConfig.scrollRight = this._getMaxOffset().left;
      }

      if (this._getScrollOffset().left !== scrollLeft) {
        this._rtlConfig.skipUpdating = true;
        this._component.scrollTo({ left: scrollLeft });
        this._rtlConfig.skipUpdating = false;
      }
    }
  }

  _updateRtlConfig(): void {
    if (this._isHorizontalAndRtlEnabled() && !this._rtlConfig.skipUpdating) {
      const { clientWidth, scrollLeft } = this._$container.get(0);
      const windowPixelRatio = this._getWindowDevicePixelRatio();
      if (this._rtlConfig.windowPixelRatio === windowPixelRatio
        && this._rtlConfig.clientWidth === clientWidth) {
        this._rtlConfig.scrollRight = this._getMaxOffset().left - scrollLeft;
      }
      this._rtlConfig.clientWidth = clientWidth;
      this._rtlConfig.windowPixelRatio = windowPixelRatio;
    }
  }

  _getWindowDevicePixelRatio(): number {
    return hasWindow()
      ? getWindow().devicePixelRatio
      : 1;
  }

  scrollBy(distance: Partial<ScrollOffset>): void {
    const verticalScroller = this._scrollers[VERTICAL];
    const horizontalScroller = this._scrollers[HORIZONTAL];

    if (verticalScroller) {
      distance.top = verticalScroller._boundLocation(
        // @ts-expect-error ts-error
        distance.top + verticalScroller._location,
      ) - verticalScroller._location;
    }
    if (horizontalScroller) {
      distance.left = horizontalScroller._boundLocation(
        // @ts-expect-error ts-error
        distance.left + horizontalScroller._location,
      ) - horizontalScroller._location;
    }

    this._prepareDirections(true);
    this._startAction?.();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('scrollBy', { x: distance.left, y: distance.top });
    this._endAction?.();

    this._updateRtlConfig();
  }

  validate(e: DxMouseEvent | DxMouseWheelEvent): boolean | string | null {
    if (isDxMouseWheelEvent(e) && isCommandKeyPressed(e)) {
      return false;
    }

    if (this.option('disabled')) {
      return false;
    }

    if (this.option('bounceEnabled')) {
      return true;
    }

    return isDxMouseWheelEvent(e)
      ? this._validateWheel(e as DxMouseWheelEvent)
      : this._validateMove(e as DxMouseEvent);
  }

  _validateWheel(e: DxMouseWheelEvent): boolean {
    const scroller = this._scrollers[this._wheelDirection(e)];
    const reachedMin = scroller._reachedMin();
    const reachedMax = scroller._reachedMax();

    const contentGreaterThanContainer = !reachedMin || !reachedMax;
    const locatedNotAtBound = !reachedMin && !reachedMax;
    const scrollFromMin = reachedMin && e.delta > 0;
    const scrollFromMax = reachedMax && e.delta < 0;

    let validated = contentGreaterThanContainer
      && (locatedNotAtBound || scrollFromMin || scrollFromMax);
    validated = validated || this._validateWheelTimer !== undefined;

    if (validated) {
      clearTimeout(this._validateWheelTimer);
      // eslint-disable-next-line no-restricted-globals
      this._validateWheelTimer = setTimeout(() => {
        this._validateWheelTimer = undefined;
      }, VALIDATE_WHEEL_TIMEOUT);
    }

    return validated;
  }

  _validateMove(e: DxMouseEvent): boolean | string | null {
    const { scrollByContent } = this.option();
    if (!scrollByContent && !$(e.target as Element).closest(`.${SCROLLABLE_SCROLLBAR_CLASS}`).length) {
      return false;
    }

    return this._allowedDirection();
  }

  getDirection(e: DxMouseEvent | DxMouseWheelEvent): ScrollDirection | null {
    return isDxMouseWheelEvent(e)
      ? this._wheelDirection(e as DxMouseWheelEvent)
      : this._allowedDirection();
  }

  _wheelProp(): 'left' | 'top' {
    return this._wheelDirection() === HORIZONTAL ? 'left' : 'top';
  }

  _wheelDirection(e?: DxMouseWheelEvent): Orientation {
    const { direction } = this.option();

    switch (direction) {
      case HORIZONTAL:
        return HORIZONTAL;
      case VERTICAL:
        return VERTICAL;
      default:
        return e?.shiftKey ? HORIZONTAL : VERTICAL;
    }
  }

  dispose(): void {
    this._resetActive();

    if (hoveredScrollable === this) {
      hoveredScrollable = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._eventHandler('dispose');
    this._detachEventHandlers();
    this._$element.removeClass(SCROLLABLE_SIMULATED_CLASS);
    this._eventForUserAction = undefined;
    clearTimeout(this._validateWheelTimer);
    clearTimeout(this._updateHandlerTimeout);
  }

  _detachEventHandlers(): void {
    eventsEngine.off(this._$element, `.${SCROLLABLE_SIMULATED_CURSOR}`);
    eventsEngine.off(this._$container, `.${SCROLLABLE_SIMULATED_KEYBOARD}`);
  }
}
/// #DEBUG
export {
  ACCELERATION,
  FRAME_DURATION,
  MIN_VELOCITY_LIMIT,
};
/// #ENDDEBUG
