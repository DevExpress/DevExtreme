import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  InternalState,
  Mutable,
  ForwardRef,
} from '@devextreme-generator/declarations';
import '../../../events/gesture/emitter.gesture.scroll';
import {
  subscribeToScrollEvent,
  subscribeToScrollInitEvent,
  subscribeToDXScrollStartEvent,
  subscribeToDXScrollMoveEvent,
  subscribeToDXScrollEndEvent,
  subscribeToDXScrollStopEvent,
  subscribeToDXScrollCancelEvent,
  subscribeToKeyDownEvent,
} from '../../utils/subscribe_to_event';
import { ScrollViewLoadPanel } from './load_panel';

import { AnimatedScrollbar } from './animated_scrollbar';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { getBoundaryProps } from './utils/get_boundary_props';

import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import {
  isDxMouseWheelEvent, normalizeKeyName, isCommandKeyPressed,
} from '../../../events/utils/index';
import { isDefined } from '../../../core/utils/type';
import { ScrollableSimulatedPropsType } from './scrollable_simulated_props';
import eventsEngine from '../../../events/core/events_engine';

import {
  ScrollDirection,
} from './utils/scroll_direction';

import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  SCROLLABLE_SIMULATED_CLASS,
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_WRAPPER_CLASS,
  SCROLLVIEW_CONTENT_CLASS,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLL_LINE_HEIGHT,
  SCROLLABLE_SCROLLBAR_CLASS,
  DIRECTION_BOTH,
  KEY_CODES,
  VALIDATE_WHEEL_TIMEOUT,
  TopPocketState,
} from './common/consts';

import {
  ScrollOffset,
  ScrollEventArgs,
  ScrollableDirection,
  DxMouseEvent,
  DxMouseWheelEvent,
  DxKeyboardEvent,
} from './types.d';

import { getElementOffset } from '../../utils/get_element_offset';
import {
  getElementPadding,
  getElementOverflowX,
  getElementOverflowY,
} from './utils/get_element_style';

import { TopPocket } from './top_pocket';
import { BottomPocket } from './bottom_pocket';

import { getOffsetDistance } from './utils/get_offset_distance';
import { convertToLocation } from './utils/convert_location';
import { getScrollTopMax } from './utils/get_scroll_top_max';
import { getScrollLeftMax } from './utils/get_scroll_left_max';
import { getDevicePixelRatio } from './utils/get_device_pixel_ratio';
import { inRange } from '../../../core/utils/math';
import { isVisible } from './utils/is_element_visible';
import { clampIntoRange } from './utils/clamp_into_range';

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, handleKeyDown,
    hScrollbarRef, vScrollbarRef,
    topPocketRef, bottomPocketRef, bottomPocketClientHeight, topPocketClientHeight,
    cursorEnterHandler, cursorLeaveHandler,
    isHovered, contentTranslateOffsetChange, scrollLocationChange,
    scrollableOffsetLeft, scrollableOffsetTop,
    contentWidth, containerClientWidth, contentHeight, containerClientHeight,
    scrollableRef, updateHandler, contentStyles, containerStyles, onBounce,
    onReachBottom, onRelease, onPullDown, onScroll, onEnd, direction, topPocketState,
    isLoadPanelVisible, pocketStateChange, scrollViewContentRef,
    vScrollLocation, hScrollLocation, contentPaddingBottom,
    onVisibilityChangeHandler,
    lock, unlock, containerHasSizes,
    props: {
      aria, disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needRenderScrollbars, needScrollViewLoadPanel,
      showScrollbar, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled,
      pullDownEnabled, reachBottomEnabled, activeStateUnit,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      focusStateEnabled={useKeyboard}
      activeStateUnit={activeStateUnit}
      hoverStateEnabled
      aria={aria}
      addWidgetClass={false}
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      onKeyDown={useKeyboard ? handleKeyDown : undefined}
      onHoverStart={cursorEnterHandler}
      onHoverEnd={cursorLeaveHandler}
      onDimensionChanged={updateHandler}
      onVisibilityChange={onVisibilityChangeHandler}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS} ref={wrapperRef}>
        <div
          className={SCROLLABLE_CONTAINER_CLASS}
          ref={containerRef}
          style={containerStyles}
        >
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef} style={contentStyles}>
            {forceGeneratePockets && (
            <TopPocket
              topPocketRef={topPocketRef}
              pullingDownText={pullingDownText}
              pulledDownText={pulledDownText}
              refreshingText={refreshingText}
              refreshStrategy="simulated"
              pocketState={topPocketState}
              visible={!!pullDownEnabled}
            />
            )}
            {needScrollViewContentWrapper
              ? (
                <div className={SCROLLVIEW_CONTENT_CLASS} ref={scrollViewContentRef}>
                  {children}
                </div>
              )
              : children}
            {forceGeneratePockets && (
            <BottomPocket
              bottomPocketRef={bottomPocketRef}
              reachBottomText={reachBottomText}
              visible={!!reachBottomEnabled}
            />
            )}
          </div>
          {needRenderScrollbars && direction.isHorizontal && (
            <AnimatedScrollbar
              direction="horizontal"
              ref={hScrollbarRef}
              scrollableOffset={scrollableOffsetLeft}
              contentSize={contentWidth}
              containerSize={containerClientWidth}
              isScrollableHovered={isHovered}
              scrollLocation={hScrollLocation}
              scrollLocationChange={scrollLocationChange}
              contentTranslateOffsetChange={contentTranslateOffsetChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onScroll={onScroll}
              onEnd={onEnd}
              rtlEnabled={rtlEnabled}
              containerHasSizes={containerHasSizes}
            />
          )}
          {needRenderScrollbars && direction.isVertical && (
            <AnimatedScrollbar
              direction="vertical"
              ref={vScrollbarRef}
              scrollableOffset={scrollableOffsetTop}
              contentSize={contentHeight}
              containerSize={containerClientHeight}
              isScrollableHovered={isHovered}
              scrollLocation={vScrollLocation}
              scrollLocationChange={scrollLocationChange}
              contentTranslateOffsetChange={contentTranslateOffsetChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onScroll={onScroll}
              onEnd={onEnd}
              containerHasSizes={containerHasSizes}

              forceGeneratePockets={forceGeneratePockets}
              topPocketSize={topPocketClientHeight}
              bottomPocketSize={bottomPocketClientHeight}
              contentPaddingBottom={contentPaddingBottom}
              onPullDown={onPullDown}
              onRelease={onRelease}
              onReachBottom={onReachBottom}
              pullDownEnabled={pullDownEnabled}
              reachBottomEnabled={reachBottomEnabled}
              pocketState={topPocketState}
              pocketStateChange={pocketStateChange}

              onLock={lock}
              onUnlock={unlock}
            />
          )}
        </div>
      </div>
      { needScrollViewLoadPanel && (
        <ScrollViewLoadPanel
          targetElement={scrollableRef}
          refreshingText={refreshingText}
          visible={isLoadPanelVisible}
        />
      )}
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class ScrollableSimulated extends JSXComponent<ScrollableSimulatedPropsType>() {
  // https://trello.com/c/psOGNvMc/2745-renovation-type-for-timers
  @Mutable() validateWheelTimer?: unknown;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() eventForUserAction?: DxMouseEvent;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Mutable()
  endActionDirections:
  { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false };

  @Mutable() tabWasPressed = false;

  @Mutable() savedScrollOffset?: { top: number; left: number };

  @Ref() scrollableRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() vScrollbarRef!: RefObject<AnimatedScrollbar>;

  @Ref() hScrollbarRef!: RefObject<AnimatedScrollbar>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @InternalState() isHovered = false;

  @InternalState() canRiseScrollAction = false;

  @InternalState() scrollableOffsetLeft = 0;

  @InternalState() scrollableOffsetTop = 0;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentScrollWidth = 0;

  @InternalState() contentScrollHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() contentPaddingBottom = 0;

  @InternalState() topPocketClientHeight = 0;

  @InternalState() bottomPocketClientHeight = 0;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @InternalState() vScrollLocation = 0;

  @InternalState() hScrollLocation = 0;

  @InternalState() vContentTranslateOffset = 0;

  @InternalState() hContentTranslateOffset = 0;

  @Method()
  content(): HTMLDivElement {
    if (this.props.needScrollViewContentWrapper) {
      return this.scrollViewContentRef.current!;
    }

    return this.contentRef.current!;
  }

  @Method()
  container(): HTMLDivElement {
    return this.containerRef.current!;
  }

  @Method()
  refresh(): void {
    this.pocketStateChange(TopPocketState.STATE_READY);
    this.startLoading();
    this.props.onPullDown?.({});
  }

  @Method()
  release(): void {
    this.updateSizes();

    this.hScrollbarRef.current?.releaseHandler();
    this.vScrollbarRef.current?.releaseHandler();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    this.scrollByLocation(convertToLocation(distance, this.props.direction));
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    const distance = getOffsetDistance(targetLocation, this.props.direction, this.scrollOffset());

    this.scrollBy(distance);
  }

  @Method()
  scrollHeight(): number {
    return this.content().offsetHeight;
  }

  @Method()
  scrollWidth(): number {
    return this.content().offsetWidth;
  }

  @Method()
  scrollOffset(): ScrollOffset {
    const { scrollTop, scrollLeft } = this.containerElement;

    return {
      top: scrollTop,
      left: scrollLeft,
    };
  }

  @Method()
  scrollTop(): number {
    return this.scrollOffset().top;
  }

  @Method()
  scrollLeft(): number {
    return this.scrollOffset().left;
  }

  @Method()
  clientHeight(): number {
    return this.containerElement.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerElement.clientWidth;
  }

  @Effect({ run: 'once' })
  disposeWheelTimer(): DisposeEffectReturn {
    return (): void => this.clearWheelValidationTimer();
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerElement, () => { this.handleScroll(); });
  }

  // run always: effect doesn't rise always after change state canRiseScrollAction in QUnit tests
  @Effect({ run: 'always' }) riseScroll(): void {
    if (this.canRiseScrollAction) {
      this.props.onScroll?.(this.getEventArgs());
      this.canRiseScrollAction = false;
    }
  }

  @Effect()
  keyboardEffect(): EffectReturn {
    return subscribeToKeyDownEvent(
      this.containerElement,
      (event) => {
        if (normalizeKeyName(event) === KEY_CODES.TAB) {
          this.tabWasPressed = true;
        }
      },
    );
  }

  @Effect()
  initEffect(): EffectReturn {
    return subscribeToScrollInitEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleInit(event);
      },
      this.getInitEventData(),
    );
  }

  @Effect()
  startEffect(): EffectReturn {
    return subscribeToDXScrollStartEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleStart(event);
      },
    );
  }

  @Effect()
  moveEffect(): EffectReturn {
    return subscribeToDXScrollMoveEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleMove(event);
      },
    );
  }

  @Effect()
  endEffect(): EffectReturn {
    return subscribeToDXScrollEndEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleEnd(event);
      },
    );
  }

  @Effect()
  stopEffect(): EffectReturn {
    return subscribeToDXScrollStopEvent(this.wrapperRef.current, () => { this.handleStop(); });
  }

  @Effect()
  cancelEffect(): EffectReturn {
    return subscribeToDXScrollCancelEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleCancel(event);
      },
    );
  }

  @Method()
  validate(event: DxMouseEvent): boolean {
    if (this.isLocked()) {
      return false;
    }

    this.updateHandler();

    return this.moveIsAllowed(event);
  }

  @Method()
  moveIsAllowed(event: DxMouseEvent | DxMouseWheelEvent): boolean {
    if (this.props.disabled
      || (isDxMouseWheelEvent(event) && isCommandKeyPressed({
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
      }))) {
      return false;
    }

    if (this.props.bounceEnabled) {
      return true;
    }

    return isDxMouseWheelEvent(event)
      ? this.validateWheel(event as DxMouseWheelEvent)
      : this.validateMove(event as DxMouseEvent);
  }

  @Effect() effectDisabledState(): void {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  }

  @Effect() effectResetInactiveState(): void {
    if (this.props.direction === DIRECTION_BOTH
      || !isDefined(this.containerElement)) {
      return;
    }

    this.containerElement[this.fullScrollInactiveProp] = 0;
  }

  @Effect({ run: 'always' }) updateScrollbarSize(): void {
    const { left, top } = getElementOffset(this.scrollableRef.current);

    this.scrollableOffsetLeft = left;
    this.scrollableOffsetTop = top;

    this.updateSizes();
  }

  scrollByLocation(location: Partial<ScrollOffset>): void {
    let { top = 0, left = 0 } = location;

    // destructuring assignment with default values not working
    // TODO: delete next two conditions after fix - https://github.com/DevExpress/devextreme-renovation/issues/734
    /* istanbul ignore next */
    if (!isDefined(top)) {
      top = 0;
    }
    /* istanbul ignore next */
    if (!isDefined(left)) {
      left = 0;
    }

    if (top === 0 && left === 0) {
      return;
    }

    this.updateHandler();
    this.prepareDirections(true);
    this.onStart();

    const scrollOffset = this.scrollOffset();

    this.hScrollbarRef.current?.scrollTo(
      clampIntoRange(scrollOffset.left + left, getScrollLeftMax(this.containerElement), 0),
    );
    this.vScrollbarRef.current?.scrollTo(
      clampIntoRange(scrollOffset.top + top, getScrollTopMax(this.containerElement), 0),
    );
  }

  updateHandler(): void {
    this.updateSizes();
    this.onUpdated();
  }

  handleScroll(): void {
    this.handleTabKey();
    this.canRiseScrollAction = true;
  }

  startLoading(): void {
    if (this.loadingIndicatorEnabled && isVisible(this.scrollableRef.current!)) {
      this.isLoadPanelVisible = true;
    }
    this.lock();
  }

  finishLoading(): void {
    this.isLoadPanelVisible = false;
    this.unlock();
  }

  getEventArgs(): ScrollEventArgs {
    const scrollOffset = this.scrollOffset();

    return {
      event: this.eventForUserAction,
      scrollOffset,
      ...getBoundaryProps(
        this.props.direction,
        scrollOffset,
        this.containerElement,
        this.topPocketClientHeight,
      ),
    };
  }

  getInitEventData(): {
    getDirection: (event: DxMouseWheelEvent) => string | undefined;
    validate: (event: DxMouseEvent) => boolean;
    isNative: boolean;
    scrollTarget: HTMLDivElement | null;
  } {
    return {
      getDirection: this.tryGetAllowedDirection,
      validate: this.validate,
      isNative: false,
      scrollTarget: this.containerElement,
    };
  }

  onStart(): void {
    this.props.onStart?.(this.getEventArgs());
  }

  onEnd(direction: string): void {
    if (this.direction.isBoth) {
      this.endActionDirections[direction] = true;

      const { horizontal, vertical } = this.endActionDirections;

      if (horizontal && vertical) {
        this.endActionDirections.vertical = false;
        this.endActionDirections.horizontal = false;
        this.props.onEnd?.(this.getEventArgs());
      }
    } else {
      this.props.onEnd?.(this.getEventArgs());
    }
  }

  onUpdated(): void {
    this.props.onUpdated?.(this.getEventArgs());
  }

  onBounce(): void {
    this.props.onBounce?.(this.getEventArgs());
  }

  onPullDown(): void {
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    this.props.onPullDown?.({});
  }

  onRelease(): void {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    this.onUpdated();
  }

  onReachBottom(): void {
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    this.props.onReachBottom?.({});
  }

  pocketStateChange(newState: number): void {
    this.topPocketState = newState;
  }

  scrollLocationChange(scrollProp: 'scrollLeft' | 'scrollTop', location: number): void {
    const containerEl = this.containerElement;

    containerEl[scrollProp] = -location;

    if (scrollProp === 'scrollLeft') {
      this.hScrollLocation = location;
    } else {
      this.vScrollLocation = location;
    }
  }

  onScroll(): void {
    eventsEngine.triggerHandler(this.containerElement, { type: 'scroll' });
  }

  contentTranslateOffsetChange(prop: string, translateOffset: number): void {
    if (prop === 'top') {
      this.vContentTranslateOffset = translateOffset;
    } else {
      this.hContentTranslateOffset = translateOffset;
    }
  }

  cursorEnterHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.isHovered = true;
    }
  }

  cursorLeaveHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.isHovered = false;
    }
  }

  handleInit(event: DxMouseEvent): void {
    this.suppressDirections(event);
    this.eventForUserAction = event;

    const crossThumbScrolling = this.isCrossThumbScrolling(event);

    this.hScrollbarRef.current?.initHandler(event, crossThumbScrolling);
    this.vScrollbarRef.current?.initHandler(event, crossThumbScrolling);
  }

  handleStart(event: DxMouseEvent): void {
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.startHandler();
    this.vScrollbarRef.current?.startHandler();

    this.onStart();
  }

  handleMove(e: DxMouseEvent): void {
    if (this.isLocked()) {
      e.cancel = true;
      return;
    }

    e.preventDefault?.();

    this.adjustDistance(e, 'delta');
    this.eventForUserAction = e;

    this.hScrollbarRef.current?.moveHandler(e.delta);
    this.vScrollbarRef.current?.moveHandler(e.delta);
  }

  handleEnd(event: DxMouseEvent): void {
    this.adjustDistance(event, 'velocity');
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.endHandler(event.velocity, true);
    this.vScrollbarRef.current?.endHandler(event.velocity, true);
  }

  handleStop(): void {
    this.hScrollbarRef.current?.stopHandler();
    this.vScrollbarRef.current?.stopHandler();
  }

  handleCancel(event: DxMouseEvent): void {
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.endHandler({ x: 0, y: 0 }, false);
    this.vScrollbarRef.current?.endHandler({ x: 0, y: 0 }, false);
  }

  isCrossThumbScrolling(event: DxMouseEvent): boolean {
    const { target } = event.originalEvent;

    let verticalScrolling = false;
    let horizontalScrolling = false;

    if (this.direction.isVertical) {
      verticalScrolling = this.props.scrollByThumb
        && this.vScrollbarRef.current!.isThumb(target);
    }

    if (this.direction.isHorizontal) {
      horizontalScrolling = this.props.scrollByThumb
        && this.hScrollbarRef.current!.isThumb(target);
    }

    return verticalScrolling || horizontalScrolling;
  }

  adjustDistance(event: DxMouseEvent, property: 'delta' | 'velocity'): void {
    const distance = event[property];

    distance.x *= this.validDirections[DIRECTION_HORIZONTAL] ? 1 : 0;
    distance.y *= this.validDirections[DIRECTION_VERTICAL] ? 1 : 0;

    if (isDxMouseWheelEvent(event.originalEvent)) {
      const devicePixelRatio = getDevicePixelRatio();

      distance.x = Math.round((distance.x / devicePixelRatio) * 100) / 100;
      distance.y = Math.round((distance.y / devicePixelRatio) * 100) / 100;
    }
  }

  suppressDirections(event: DxMouseEvent): void {
    if (isDxMouseWheelEvent(event.originalEvent)) {
      this.prepareDirections(true);
      return;
    }

    this.prepareDirections(false);

    const { target } = event.originalEvent;

    if (this.direction.isVertical) {
      const scrollbar = this.vScrollbarRef.current!;

      this.validDirections[DIRECTION_VERTICAL] = this.validateEvent(
        this.isContent(target),
        scrollbar.isScrollbar(target),
        scrollbar.isThumb(target),
      );
    }
    if (this.direction.isHorizontal) {
      const scrollbar = this.hScrollbarRef.current!;
      this.validDirections[DIRECTION_HORIZONTAL] = this.validateEvent(
        this.isContent(target),
        scrollbar.isScrollbar(target),
        scrollbar.isThumb(target),
      );
    }
  }

  validateEvent(isContent: boolean, isScrollbar: boolean, isThumb: boolean): boolean {
    return (this.props.scrollByThumb && (isScrollbar || isThumb))
    || (this.props.scrollByContent && isContent);
  }

  prepareDirections(value: boolean): void {
    this.validDirections[DIRECTION_HORIZONTAL] = value;
    this.validDirections[DIRECTION_VERTICAL] = value;
  }

  isContent(element: EventTarget | null): boolean {
    const closest = (element as Element).closest(`.${SCROLLABLE_SIMULATED_CLASS}`);

    if (isDefined(closest)) {
      return closest === this.scrollableRef.current;
    }

    return false;
  }

  tryGetAllowedDirection(event: DxMouseWheelEvent): ScrollableDirection | undefined {
    return isDxMouseWheelEvent(event) ? this.wheelDirection(event) : this.allowedDirection();
  }

  allowedDirection(): ScrollableDirection | undefined {
    // https://trello.com/c/Jnvnb7qc/2728-renovation-react-cannot-destruct-from-this
    // const { allowedDirections } = this;

    if (this.direction.isBoth
      && this.allowedDirections.vertical && this.allowedDirections.horizontal) {
      return DIRECTION_BOTH;
    } if (this.direction.isHorizontal && this.allowedDirections.horizontal) {
      return DIRECTION_HORIZONTAL;
    } if (this.direction.isVertical && this.allowedDirections.vertical) {
      return DIRECTION_VERTICAL;
    }
    return undefined;
  }

  get allowedDirections(): { vertical: boolean; horizontal: boolean } {
    return {
      vertical: this.direction.isVertical
        && (Math.round(
          -Math.max(this.contentHeight - this.containerClientHeight, 0),
        ) < 0 || this.props.bounceEnabled),
      horizontal: this.direction.isHorizontal
      && (Math.round(
        -Math.max(this.contentWidth - this.containerClientWidth, 0),
      ) < 0 || this.props.bounceEnabled),
    };
  }

  isLocked(): boolean {
    return this.locked;
  }

  validateWheel(event: DxMouseWheelEvent): boolean {
    const scrollbar = this.wheelDirection(event) === DIRECTION_HORIZONTAL
      ? this.hScrollbarRef.current!
      : this.vScrollbarRef.current!;

    const reachedMin = scrollbar.reachedMin();
    const reachedMax = scrollbar.reachedMax();

    const contentGreaterThanContainer = !reachedMin || !reachedMax;
    const locatedNotAtBound = !reachedMin && !reachedMax;

    const scrollFromMin = reachedMin && event.delta > 0;
    const scrollFromMax = reachedMax && event.delta < 0;

    let validated = contentGreaterThanContainer
      && (locatedNotAtBound || scrollFromMin || scrollFromMax);

    validated = validated || this.validateWheelTimer !== undefined;

    if (validated) {
      this.clearWheelValidationTimer();
      this.validateWheelTimer = setTimeout(
        this.clearWheelValidationTimer, VALIDATE_WHEEL_TIMEOUT,
      );
    }

    return validated;
  }

  clearWheelValidationTimer(): void {
    clearTimeout(this.validateWheelTimer as number);
    this.validateWheelTimer = undefined;
  }

  validateMove(event: DxMouseEvent): boolean {
    if (!this.props.scrollByContent
      && !isDefined((event.target as HTMLElement).closest(`.${SCROLLABLE_SCROLLBAR_CLASS}`))) {
      return false;
    }

    return isDefined(this.allowedDirection());
  }

  handleTabKey(): void {
    if (this.tabWasPressed) {
      const { top, left } = this.scrollOffset();

      if (inRange(this.hScrollLocation, -getScrollLeftMax(this.containerElement), 0)
        && inRange(this.vScrollLocation, -getScrollTopMax(this.containerElement), 0)) {
        if (this.hScrollLocation !== -left) {
          this.hScrollLocation = -left;
        }

        if (this.vScrollLocation !== -top) {
          this.vScrollLocation = -top;
        }
      }
      this.tabWasPressed = false;
    }
  }

  handleKeyDown(event: DxKeyboardEvent): void {
    let handled = true;

    switch (normalizeKeyName(event)) {
      case KEY_CODES.TAB:
        this.tabWasPressed = true;
        handled = false;
        break;
      case KEY_CODES.DOWN:
        this.scrollByLine({ y: 1 });
        break;
      case KEY_CODES.UP:
        this.scrollByLine({ y: -1 });
        break;
      case KEY_CODES.RIGHT:
        this.scrollByLine({ x: 1 });
        break;
      case KEY_CODES.LEFT:
        this.scrollByLine({ x: -1 });
        break;
      case KEY_CODES.PAGE_DOWN:
        this.scrollByPage(1);
        break;
      case KEY_CODES.PAGE_UP:
        this.scrollByPage(-1);
        break;
      case KEY_CODES.HOME:
        this.scrollToHome();
        break;
      case KEY_CODES.END:
        this.scrollToEnd();
        break;
      default:
        handled = false;
        break;
    }

    if (handled) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    }
  }

  scrollByLine(lines: { x?: number; y?: number }): void {
    const scrollOffset = Math.abs((SCROLL_LINE_HEIGHT / getDevicePixelRatio()) * 100) / 100;

    this.scrollBy({
      top: (lines.y ?? 0) * scrollOffset,
      left: (lines.x ?? 0) * scrollOffset,
    });
  }

  scrollByPage(page: number): void {
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance: { left?: number; top?: number } = {};
    const { clientHeight, clientWidth } = this.containerElement;

    if (isVertical) {
      distance.top = page * clientHeight;
    } else {
      distance.left = page * clientWidth;
    }

    this.scrollBy(distance);
  }

  wheelDirection(event?: DxMouseWheelEvent): ScrollableDirection {
    switch (this.props.direction) {
      case DIRECTION_HORIZONTAL:
        return DIRECTION_HORIZONTAL;
      case DIRECTION_VERTICAL:
        return DIRECTION_VERTICAL;
      default:
        return event?.shiftKey ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL;
    }
  }

  scrollToHome(): void {
    const distance = { [this.direction.isVertical ? 'top' : 'left']: 0 };

    this.scrollTo(distance);
  }

  scrollToEnd(): void {
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance: { left?: number; top?: number } = {};

    if (isVertical) {
      distance.top = getScrollTopMax(this.containerElement);
    } else {
      distance.left = getScrollLeftMax(this.containerElement);
    }

    this.scrollTo(distance);
  }

  lock(): void {
    this.locked = true;
  }

  unlock(): void {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }

  get fullScrollInactiveProp(): 'scrollLeft' | 'scrollTop' {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'scrollTop' : 'scrollLeft';
  }

  onVisibilityChangeHandler(visible: boolean): void {
    if (visible) {
      this.updateHandler();

      if (this.savedScrollOffset) {
        this.containerElement.scrollTop = this.savedScrollOffset.top;
        this.containerElement.scrollLeft = this.savedScrollOffset.left;
      }

      this.savedScrollOffset = undefined;
    } else {
      this.savedScrollOffset = this.scrollOffset();
    }

    this.props.onVisibilityChange?.(visible);
  }

  updateSizes(): void {
    const containerEl = this.containerElement;
    const contentEl = this.contentRef.current;

    if (isDefined(containerEl)) {
      this.containerClientWidth = containerEl.clientWidth;
      this.containerClientHeight = containerEl.clientHeight;
    }

    if (isDefined(contentEl)) {
      this.contentClientWidth = contentEl.clientWidth;
      this.contentClientHeight = contentEl.clientHeight;
      this.contentScrollWidth = contentEl.scrollWidth;
      this.contentScrollHeight = contentEl.scrollHeight;
    }

    const topPocketEl = this.topPocketRef.current;
    const bottomPocketEl = this.bottomPocketRef.current;

    if (isDefined(topPocketEl)) {
      this.topPocketClientHeight = topPocketEl.clientHeight;
    }

    if (isDefined(bottomPocketEl)) {
      this.bottomPocketClientHeight = bottomPocketEl.clientHeight;
    }

    this.contentPaddingBottom = getElementPadding(contentEl, 'bottom');
  }

  get containerElement(): HTMLDivElement {
    return this.containerRef.current!;
  }

  get contentHeight(): number {
    // T320141
    return getElementOverflowY(this.contentRef?.current) === 'hidden'
      ? this.contentClientHeight
      // for position absolute elements inside content
      : Math.max(this.contentScrollHeight, this.contentClientHeight);
  }

  get contentWidth(): number {
    // T320141
    return getElementOverflowX(this.contentRef?.current) === 'hidden'
      ? this.contentClientWidth
      // for position absolute elements inside content
      : Math.max(this.contentScrollWidth, this.contentClientWidth);
  }

  get containerHasSizes(): boolean {
    return this.containerClientHeight > 0 && this.containerClientWidth > 0;
  }

  get contentStyles(): { [key: string]: string } {
    return {
      transform: `translate(${this.hContentTranslateOffset}px, ${this.vContentTranslateOffset}px)`,
    };
  }

  get containerStyles(): { [key: string]: string } {
    let touchDirection = this.allowedDirections.vertical ? 'pan-x' : '';
    touchDirection = this.allowedDirections.horizontal ? 'pan-y' : touchDirection;
    touchDirection = this.allowedDirections.vertical && this.allowedDirections.horizontal ? 'none' : touchDirection;

    return {
      touchAction: touchDirection,
    };
  }

  get cssClasses(): string {
    const {
      direction, classes, disabled, showScrollbar,
    } = this.props;

    const classesMap = {
      'dx-scrollable': true,
      [SCROLLABLE_SIMULATED_CLASS]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE]: showScrollbar === 'always',
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean; isBoth: boolean } {
    return new ScrollDirection(this.props.direction);
  }
}
