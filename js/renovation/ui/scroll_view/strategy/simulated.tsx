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
import '../../../../events/gesture/emitter.gesture.scroll';
import {
  subscribeToScrollEvent,
  subscribeToScrollInitEvent,
  subscribeToDXScrollStartEvent,
  subscribeToDXScrollMoveEvent,
  subscribeToDXScrollEndEvent,
  subscribeToDXScrollStopEvent,
  subscribeToDXScrollCancelEvent,
} from '../../../utils/subscribe_to_event';
import { ScrollViewLoadPanel } from '../internal/load_panel';

import { AnimatedScrollbar } from '../scrollbar/animated_scrollbar';
import { Widget } from '../../common/widget';
import { combineClasses } from '../../../utils/combine_classes';
import { getOffsetDistance } from '../utils/get_offset_distance';
import { getBoundaryProps } from '../utils/get_boundary_props';

import { DisposeEffectReturn, EffectReturn } from '../../../utils/effect_return';
import {
  isDxMouseWheelEvent, normalizeKeyName, isCommandKeyPressed,
} from '../../../../events/utils/index';
import { isDefined } from '../../../../core/utils/type';
import { ScrollableSimulatedProps } from '../common/simulated_strategy_props';
import eventsEngine from '../../../../events/core/events_engine';
import resizeObserverSingleton from '../../../../core/resize_observer';

import {
  ScrollDirection,
} from '../utils/scroll_direction';

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
} from '../common/consts';

import {
  ScrollOffset,
  ScrollEventArgs,
  ScrollableDirection,
  DxMouseEvent,
  DxMouseWheelEvent,
  DxKeyboardEvent,
} from '../common/types';

import { getElementOffset } from '../../../utils/get_element_offset';
import {
  getElementPadding,
  getElementOverflowX,
  getElementOverflowY,
} from '../utils/get_element_style';

import { TopPocket } from '../internal/pocket/top';
import { BottomPocket } from '../internal/pocket/bottom';

import { getScrollTopMax } from '../utils/get_scroll_top_max';
import { getScrollLeftMax } from '../utils/get_scroll_left_max';
import { getDevicePixelRatio } from '../utils/get_device_pixel_ratio';
import { isVisible } from '../utils/is_element_visible';
import { getTranslateValues } from '../utils/get_translate_values';
import { clampIntoRange } from '../utils/clamp_into_range';

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, handleKeyDown,
    hScrollbarRef, vScrollbarRef,
    topPocketRef, bottomPocketRef, bottomPocketClientHeight,
    hoverInHandler, hoverOutHandler, hovered, pulledDown,
    scrollLocationChange,
    contentWidth, containerClientWidth, contentHeightWithoutPockets, containerClientHeight,
    scrollableRef, contentStyles, containerStyles, onBounce,
    onReachBottom, onRelease, onPullDown, onEnd, direction, topPocketState,
    isLoadPanelVisible, scrollViewContentRef,
    vScrollLocation, hScrollLocation, contentPaddingBottom,
    onVisibilityChangeHandler,
    lock, unlock, containerHasSizes,
    hScrollOffsetMax, vScrollOffsetMax, vScrollOffsetMin,
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
      onHoverStart={hoverInHandler}
      onHoverEnd={hoverOutHandler}
      onVisibilityChange={onVisibilityChangeHandler}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
      // onKeyDown exist in restAttributes and has undefined value
      onKeyDown={useKeyboard ? handleKeyDown : undefined}
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
              contentSize={contentWidth}
              containerSize={containerClientWidth}
              isScrollableHovered={hovered}
              minOffset={0}
              maxOffset={hScrollOffsetMax}
              scrollLocation={hScrollLocation}
              scrollLocationChange={scrollLocationChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onEnd={onEnd}
              rtlEnabled={rtlEnabled}
              containerHasSizes={containerHasSizes}
            />
          )}
          {needRenderScrollbars && direction.isVertical && (
            <AnimatedScrollbar
              direction="vertical"
              ref={vScrollbarRef}
              contentSize={contentHeightWithoutPockets}
              containerSize={containerClientHeight}
              isScrollableHovered={hovered}
              minOffset={vScrollOffsetMin}
              maxOffset={vScrollOffsetMax}
              scrollLocation={vScrollLocation}
              scrollLocationChange={scrollLocationChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onEnd={onEnd}
              containerHasSizes={containerHasSizes}

              forceGeneratePockets={forceGeneratePockets}
              bottomPocketSize={bottomPocketClientHeight}
              contentPaddingBottom={contentPaddingBottom}
              pulledDown={pulledDown}
              onPullDown={onPullDown}
              onRelease={onRelease}
              onReachBottom={onReachBottom}
              pullDownEnabled={pullDownEnabled}
              reachBottomEnabled={reachBottomEnabled}

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

export class ScrollableSimulated extends JSXComponent<ScrollableSimulatedProps>() {
  @Mutable() validateWheelTimer?: unknown;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() eventForUserAction?: DxMouseEvent;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Mutable()
  endActionDirections:
  { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false };

  @Mutable() savedScrollOffset?: { scrollTop: number; scrollLeft: number };

  @Ref() scrollableRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() vScrollbarRef!: RefObject<AnimatedScrollbar>;

  @Ref() hScrollbarRef!: RefObject<AnimatedScrollbar>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @InternalState() hovered = false;

  @InternalState() scrolling = false;

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
    this.topPocketState = TopPocketState.STATE_READY;
    this.startLoading();
    this.props.onPullDown?.({});
  }

  @Method()
  release(): void {
    this.updateElementDimensions();

    this.hScrollbarRef.current?.releaseHandler();
    this.vScrollbarRef.current?.releaseHandler();
  }

  @Method()
  updateHandler(): void {
    this.updateElementDimensions();
    this.onUpdated();
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
    const { top, left } = getTranslateValues(this.contentRef.current);
    const { scrollTop, scrollLeft } = this.containerRef.current!;

    return {
      top: scrollTop - top
        - (this.props.pullDownEnabled && this.props.forceGeneratePockets
          ? this.topPocketClientHeight
          : 0
        ),
      left: scrollLeft - left,
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
    return this.containerRef.current!.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerRef.current!.clientWidth;
  }

  @Effect({ run: 'once' })
  disposeWheelTimer(): DisposeEffectReturn {
    return (): void => this.clearWheelValidationTimer();
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerRef.current, () => { this.handleScroll(); });
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
    if (this.direction.isBoth) {
      return;
    }

    const inactiveScrollProp = !this.direction.isVertical ? 'scrollTop' : 'scrollLeft';

    this.scrollLocationChange(inactiveScrollProp, 0, true);
  }

  @Effect()
  updatePocketState(): void {
    if (this.props.forceGeneratePockets) {
      this.topPocketState = this.pulledDown
        ? TopPocketState.STATE_READY
        : TopPocketState.STATE_RELEASED;
    }
  }

  get pulledDown(): boolean {
    return this.props.pullDownEnabled
      && this.props.bounceEnabled
      && this.topPocketClientHeight > 0 // topPocket was initialized
      && (this.vScrollLocation - this.topPocketClientHeight) >= 0;
  }

  @Effect({ run: 'once' })
  /* istanbul ignore next */
  containerResizeObserver(): DisposeEffectReturn {
    const containerEl = this.containerRef.current;

    resizeObserverSingleton.observe(containerEl, ({ target }) => {
      this.setContainerDimensions(target);
    });

    return (): void => { resizeObserverSingleton.unobserve(containerEl); };
  }

  @Effect({ run: 'once' })
  /* istanbul ignore next */
  contentResizeObserver(): DisposeEffectReturn {
    const contentEl = this.contentRef.current;

    resizeObserverSingleton.observe(contentEl, ({ target }) => {
      this.setContentDimensions(target);
    });

    return (): void => { resizeObserverSingleton.unobserve(contentEl); };
  }

  // if delete this effect we need to wait changing size inside resizeObservable
  // it needs for support qunit tests
  @Effect({ run: 'once' }) updateDimensions(): void {
    this.updateElementDimensions();
  }

  scrollByLocation(location: ScrollOffset): void {
    this.scrolling = true;

    this.updateHandler();
    this.prepareDirections(true);
    this.onStart();

    const { scrollLeft, scrollTop } = this.containerRef.current!;

    this.hScrollbarRef.current?.scrollTo(scrollLeft + location.left);
    this.vScrollbarRef.current?.scrollTo(scrollTop + location.top);

    this.scrolling = false;
  }

  handleScroll(): void {
    if (!this.scrolling) {
      this.syncScrollbarsWithContent();
    }

    this.props.onScroll?.(this.getEventArgs());
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
        this.containerRef.current!,
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
      scrollTarget: this.containerRef.current,
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

        this.scrolling = false;
        this.props.onEnd?.(this.getEventArgs());
      }
    } else {
      this.scrolling = false;
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
    this.topPocketState = TopPocketState.STATE_REFRESHING;

    this.loadingIndicatorEnabled = false;
    this.startLoading();
    this.props.onPullDown?.({});
  }

  onRelease(): void {
    this.topPocketState = TopPocketState.STATE_RELEASED;

    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    this.onUpdated();
  }

  onReachBottom(): void {
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    this.props.onReachBottom?.({});
  }

  scrollLocationChange(scrollProp: 'scrollLeft' | 'scrollTop', scrollValue: number, needFireScroll: boolean): void {
    const containerEl = this.containerRef.current!;
    const prevScrollValue = containerEl[scrollProp];

    containerEl[scrollProp] = scrollValue;

    if (scrollProp === 'scrollLeft') {
      this.hScrollLocation = -scrollValue;
    } else {
      this.vScrollLocation = -scrollValue;
    }

    // TODO: or 1px instead of 0px?
    if (needFireScroll && Math.abs(prevScrollValue - scrollValue) > 0) {
      this.onScroll();
    }
  }

  get hScrollOffsetMax(): number {
    return -Math.max(this.contentWidth - this.containerClientWidth, 0);
  }

  get vScrollOffsetMax(): number {
    return -Math.max(this.contentHeightWithoutPockets - this.containerClientHeight, 0);
  }

  get vScrollOffsetMin(): number {
    return this.pulledDown && this.topPocketState !== TopPocketState.STATE_RELEASED
      ? this.topPocketClientHeight
      : 0;
  }

  onScroll(): void {
    eventsEngine.triggerHandler(this.containerRef.current, { type: 'scroll' });
  }

  hoverInHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = true;
    }
  }

  hoverOutHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = false;
    }
  }

  handleInit(event: DxMouseEvent): void {
    this.suppressDirections(event);
    this.eventForUserAction = event;

    this.scrolling = true;
    const crossThumbScrolling = this.isCrossThumbScrolling(event);

    const { left, top } = getElementOffset(this.scrollableRef.current);
    this.hScrollbarRef.current?.initHandler(event, crossThumbScrolling, left);
    this.vScrollbarRef.current?.initHandler(event, crossThumbScrolling, top);
  }

  handleStart(event: DxMouseEvent): void {
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.show();
    this.vScrollbarRef.current?.show();

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

    this.hScrollbarRef.current?.moveHandler(e.delta.x);
    this.vScrollbarRef.current?.moveHandler(e.delta.y);
  }

  handleEnd(event: DxMouseEvent): void {
    this.adjustDistance(event, 'velocity');
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.endHandler(event.velocity.x, true);
    this.vScrollbarRef.current?.endHandler(event.velocity.y, true);
  }

  handleStop(): void {
    this.hScrollbarRef.current?.stopHandler();
    this.vScrollbarRef.current?.stopHandler();
    this.scrolling = false;
  }

  handleCancel(event: DxMouseEvent): void {
    this.eventForUserAction = event;

    this.hScrollbarRef.current?.endHandler(0, false);
    this.vScrollbarRef.current?.endHandler(0, false);
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

    const vDirectionAllowed = this.direction.isVertical
      && (getScrollTopMax(this.containerRef.current!) > 0 || this.props.bounceEnabled);
    const hDirectionAllowed = this.direction.isHorizontal
    && (getScrollLeftMax(this.containerRef.current!) > 0 || this.props.bounceEnabled);

    if (this.direction.isBoth && vDirectionAllowed && hDirectionAllowed) {
      return DIRECTION_BOTH;
    } if (this.direction.isHorizontal && hDirectionAllowed) {
      return DIRECTION_HORIZONTAL;
    } if (this.direction.isVertical && vDirectionAllowed) {
      return DIRECTION_VERTICAL;
    }
    return undefined;
  }

  get allowedDirections(): { vertical: boolean; horizontal: boolean } {
    return {
      vertical: this.direction.isVertical
      && (this.vScrollOffsetMax < 0 || this.props.bounceEnabled),
      horizontal: this.direction.isHorizontal
      && (this.hScrollOffsetMax < 0 || this.props.bounceEnabled),
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

  syncScrollbarsWithContent(): void {
    const { scrollLeft, scrollTop } = this.containerRef.current!;

    this.hScrollLocation = -scrollLeft;
    this.vScrollLocation = -scrollTop;
  }

  handleKeyDown(event: DxKeyboardEvent): void {
    if (this.scrolling) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
      return;
    }

    const isKeySupported = Object.values(KEY_CODES).includes(normalizeKeyName(event));

    if (isKeySupported) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    }

    switch (normalizeKeyName(event)) {
      case KEY_CODES.DOWN:
        this.scrollByLine({ top: 1, left: 0 });
        break;
      case KEY_CODES.UP:
        this.scrollByLine({ top: -1, left: 0 });
        break;
      case KEY_CODES.RIGHT:
        this.scrollByLine({ top: 0, left: 1 });
        break;
      case KEY_CODES.LEFT:
        this.scrollByLine({ top: 0, left: -1 });
        break;
      case KEY_CODES.PAGE_DOWN:
        this.scrollByPage(1);
        break;
      case KEY_CODES.PAGE_UP:
        this.scrollByPage(-1);
        break;
      case KEY_CODES.HOME:
        this.scrollByKey(KEY_CODES.HOME);
        break;
      case KEY_CODES.END:
        this.scrollByKey(KEY_CODES.END);
        break;
      default:
        break;
    }
  }

  // https://github.com/DevExpress/devextreme-renovation/issues/734
  scrollByLine(lines: { left: number; top: number }): void {
    const scrollOffset = Math.abs((SCROLL_LINE_HEIGHT / getDevicePixelRatio()) * 100) / 100;

    this.scrollByLocation({
      top: lines.top * scrollOffset,
      left: lines.left * scrollOffset,
    });
  }

  scrollByPage(page: number): void {
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance = { left: 0, top: 0 };
    const { clientHeight, clientWidth } = this.containerRef.current!;

    if (isVertical) {
      distance.top = page * clientHeight;
    } else {
      distance.left = page * clientWidth;
    }

    this.scrollByLocation(distance);
  }

  scrollByKey(key: string): void {
    const containerEl = this.containerRef.current!;

    const vOffsetMin = 0;
    const vOffsetMax = Math.max(this.contentHeight - containerEl.clientHeight, 0);

    const hOffsetMin = 0;
    const hOffsetMax = Math.max(this.contentWidth - containerEl.clientWidth, 0);

    const offset = getOffsetDistance(
      key === KEY_CODES.HOME
        ? { top: vOffsetMin, left: this.props.rtlEnabled ? hOffsetMax : hOffsetMin }
        : { top: vOffsetMax, left: this.props.rtlEnabled ? hOffsetMin : hOffsetMax },
      { top: containerEl.scrollTop, left: containerEl.scrollLeft },
    );

    this.scrollByLocation({
      top: offset.top,
      left: offset.left,
    });
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

  lock(): void {
    this.locked = true;
  }

  unlock(): void {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }

  onVisibilityChangeHandler(visible: boolean): void {
    if (visible) {
      this.updateHandler();

      if (this.savedScrollOffset) {
        const { scrollTop, scrollLeft } = this.savedScrollOffset;

        this.scrollLocationChange('scrollTop', scrollTop, false);
        this.scrollLocationChange('scrollLeft', scrollLeft, false);
      }

      this.savedScrollOffset = undefined;
    } else {
      const { scrollTop, scrollLeft } = this.containerRef.current!;
      this.savedScrollOffset = { scrollTop, scrollLeft };
    }

    this.props.onVisibilityChange?.(visible);
  }

  updateElementDimensions(): void {
    this.setContentDimensions(this.contentRef.current!);
    this.setContainerDimensions(this.containerRef.current!);
  }

  setContentDimensions(contentEl: HTMLDivElement): void {
    const heightChanged = (this.contentClientHeight !== contentEl.clientHeight)
      || (this.contentScrollHeight !== contentEl.scrollHeight);

    const widthChanged = (this.contentClientWidth !== contentEl.clientWidth)
      || (this.contentScrollWidth !== contentEl.scrollWidth);

    this.contentClientWidth = contentEl.clientWidth;
    this.contentClientHeight = contentEl.clientHeight;
    this.contentScrollWidth = contentEl.scrollWidth;
    this.contentScrollHeight = contentEl.scrollHeight;

    if (this.props.forceGeneratePockets) {
      this.topPocketClientHeight = this.topPocketRef.current!.clientHeight;
      this.bottomPocketClientHeight = this.bottomPocketRef.current!.clientHeight;
    }

    this.contentPaddingBottom = getElementPadding(contentEl, 'bottom');

    if (heightChanged) {
      this.vScrollLocation = clampIntoRange(this.vScrollLocation, 0, this.vScrollOffsetMax);
    }
    if (widthChanged) {
      this.hScrollLocation = clampIntoRange(this.hScrollLocation, 0, this.hScrollOffsetMax);
    }
  }

  setContainerDimensions(containerEl: HTMLDivElement): void {
    const heightChanged = this.containerClientHeight !== containerEl.clientHeight;
    const widthChanged = this.containerClientWidth !== containerEl.clientWidth;

    if (heightChanged) {
      this.vScrollLocation = clampIntoRange(this.vScrollLocation, 0,
        -Math.max(this.contentHeight - this.topPocketClientHeight - containerEl.clientHeight, 0));
    }

    if (widthChanged) {
      this.hScrollLocation = clampIntoRange(this.hScrollLocation, 0,
        -Math.max(this.contentWidth - containerEl.clientWidth, 0));
    }

    this.containerClientWidth = containerEl.clientWidth;
    this.containerClientHeight = containerEl.clientHeight;
  }

  get contentHeight(): number {
    // T320141
    return getElementOverflowY(this.contentRef?.current) === 'hidden'
      ? this.contentClientHeight
      // for position absolute elements inside content
      : Math.max(this.contentScrollHeight, this.contentClientHeight);
  }

  get contentHeightWithoutPockets(): number {
    const size = this.contentHeight - this.bottomPocketClientHeight - this.topPocketClientHeight;

    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled) {
      return Math.max(size - this.contentPaddingBottom, 0);
    }

    return Math.max(size, 0);
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
      transform: `translate(${this.contentTranslateX}px, ${this.contentTranslateY}px)`,
    };
  }

  get contentTranslateY(): number {
    const location = this.vScrollLocation;
    let transformValue = location % 1;

    const maxOffset = this.vScrollOffsetMax
      - this.bottomPocketClientHeight - this.contentPaddingBottom;

    if (location > 0) {
      transformValue = location;
    } else if (location <= maxOffset) {
      transformValue = location - maxOffset;
    }

    return transformValue - this.topPocketClientHeight;
  }

  get contentTranslateX(): number {
    const location = this.hScrollLocation;
    let transformValue = location % 1;

    if (location > 0) {
      transformValue = location;
    } else if (location <= this.hScrollOffsetMax) {
      transformValue = location - this.hScrollOffsetMax;
    }

    return transformValue;
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
      [String(classes)]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean; isBoth: boolean } {
    return new ScrollDirection(this.props.direction);
  }
}
