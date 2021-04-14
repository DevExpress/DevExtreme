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
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { ScrollViewLoadPanel } from './load_panel';

import { AnimatedScrollbar } from './animated_scrollbar';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import { isDxMouseWheelEvent, normalizeKeyName, isCommandKeyPressed } from '../../../events/utils/index';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
import { ScrollableSimulatedPropsType } from './scrollable_simulated_props';
import { ensureDefined } from '../../../core/utils/common';
import '../../../events/gesture/emitter.gesture.scroll';
import eventsEngine from '../../../events/core/events_engine';

import {
  normalizeLocation,
  getElementLocation, getBoundaryProps,
  updateAllowedDirection,
} from './scrollable_utils';

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
  SCROLLABLE_SCROLLBARS_HIDDEN,
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLL_LINE_HEIGHT,
  SCROLLABLE_SCROLLBAR_CLASS,
  DIRECTION_BOTH,
  KEY_CODES,
  VALIDATE_WHEEL_TIMEOUT,
  TopPocketState,
} from './common/consts';

import {
  ScrollableLocation, ScrollOffset,
  AllowedDirection,
  ScrollEventArgs,
  ScrollableDirection,
} from './types.d';

import { getElementOffset } from './utils/get_element_offset';
import { getElementStyle } from './utils/get_element_style';

import { TopPocket } from './top_pocket';
import { BottomPocket } from './bottom_pocket';

import {
  dxScrollInit,
  dxScrollStart,
  dxScrollMove,
  dxScrollEnd,
  dxScrollStop,
  dxScrollCancel,
} from '../../../events/short';

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, onWidgetKeyDown,
    horizontalScrollbarRef, verticalScrollbarRef,
    topPocketRef, bottomPocketRef, bottomPocketClientHeight, topPocketClientHeight,
    cursorEnterHandler, cursorLeaveHandler,
    isHovered, contentTranslateOffsetChange, contentPositionChange,
    scaleRatioWidth, scaleRatioHeight,
    scrollableOffsetLeft, scrollableOffsetTop,
    contentWidth, containerClientWidth, contentHeight, containerClientHeight,
    baseContentWidth, baseContainerWidth, baseContentHeight, baseContainerHeight,
    scrollableRef, windowResizeHandler, contentStyles, containerStyles, onBounce,
    onReachBottom, onRelease, onPullDown, direction, topPocketState,
    isLoadPanelVisible, pocketStateChange, scrollViewContentRef,
    props: {
      disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      showScrollbar, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled, contentTranslateOffset,
      pullDownEnabled, reachBottomEnabled,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      focusStateEnabled={useKeyboard}
      hoverStateEnabled
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      onKeyDown={onWidgetKeyDown}
      onHoverStart={cursorEnterHandler}
      onHoverEnd={cursorLeaveHandler}
      onDimensionChanged={windowResizeHandler}
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
              : <div>{children}</div>}
            {forceGeneratePockets && (
            <BottomPocket
              bottomPocketRef={bottomPocketRef}
              reachBottomText={reachBottomText}
              visible={!!reachBottomEnabled}
            />
            )}
          </div>
          {direction.isHorizontal && (
            <AnimatedScrollbar
              direction="horizontal"
              ref={horizontalScrollbarRef}
              scaleRatio={scaleRatioWidth}
              scrollableOffset={scrollableOffsetLeft}
              contentSize={contentWidth}
              containerSize={containerClientWidth}
              baseContentSize={baseContentWidth}
              baseContainerSize={baseContainerWidth}
              isScrollableHovered={isHovered}
              contentPositionChange={contentPositionChange}
              contentTranslateOffset={contentTranslateOffset}
              contentTranslateOffsetChange={contentTranslateOffsetChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
            />
          )}
          {direction.isVertical && (
            <AnimatedScrollbar
              direction="vertical"
              ref={verticalScrollbarRef}
              scaleRatio={scaleRatioHeight}
              scrollableOffset={scrollableOffsetTop}
              contentSize={contentHeight}
              containerSize={containerClientHeight}
              baseContentSize={baseContentHeight}
              baseContainerSize={baseContainerHeight}
              isScrollableHovered={isHovered}
              contentPositionChange={contentPositionChange}
              contentTranslateOffset={contentTranslateOffset}
              contentTranslateOffsetChange={contentTranslateOffsetChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}

              forceGeneratePockets={forceGeneratePockets}
              topPocketSize={topPocketClientHeight}
              bottomPocketSize={bottomPocketClientHeight}
              onPullDown={onPullDown}
              onRelease={onRelease}
              onReachBottom={onReachBottom}
              pullDownEnabled={pullDownEnabled}
              reachBottomEnabled={reachBottomEnabled}
              pocketState={topPocketState}
              pocketStateChange={pocketStateChange}
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
  @Mutable() validateWheelTimer?: any;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() eventForUserAction?: Event;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Ref() scrollableRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() verticalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

  @Ref() horizontalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @InternalState() isHovered = false;

  @InternalState() scrollableOffsetLeft = 0;

  @InternalState() scrollableOffsetTop = 0;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentScrollWidth = 0;

  @InternalState() contentScrollHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() containerOffsetWidth = 0;

  @InternalState() containerOffsetHeight = 0;

  @InternalState() contentOffsetWidth = 0;

  @InternalState() contentOffsetHeight = 0;

  @InternalState() topPocketClientHeight = 0;

  @InternalState() bottomPocketClientHeight = 0;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @Method()
  content(): HTMLDivElement {
    if (this.props.needScrollViewContentWrapper) {
      return this.scrollViewContentRef.current!;
    }

    return this.contentRef.current!;
  }

  @Method()
  update(): void {
    this.updateSizes();
    this.onUpdated();
  }

  @Method()
  refresh(): void {
    this.topPocketState = TopPocketState.STATE_READY;

    this.startLoading();
    this.props.onPullDown?.({});
  }

  startLoading(): void {
    if (this.loadingIndicatorEnabled) {
      // TODO: check visibility - && this.$element().is(':visible')
      this.isLoadPanelVisible = true;
    }
    this.lock();
  }

  finishLoading(): void {
    this.isLoadPanelVisible = false;
    this.unlock();
  }

  @Method()
  release(): void {
    this.eventHandler((scrollbar) => scrollbar.releaseHandler());
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = normalizeLocation(distance, this.props.direction);

    if (this.direction.isVertical) {
      const scrollbar = this.verticalScrollbarRef.current;
      location.top = scrollbar.boundLocation(
        location.top + scrollbar.getScrollLocation(),
      ) - scrollbar.getScrollLocation();
    }
    if (this.direction.isHorizontal) {
      const scrollbar = this.horizontalScrollbarRef.current;
      location.left = scrollbar.boundLocation(
        location.left + scrollbar.getScrollLocation(),
      ) - scrollbar.getScrollLocation();
    }

    this.prepareDirections(true);
    this.onStart();
    this.eventHandler(
      (scrollbar) => scrollbar.scrollByHandler(
        { x: location.left || 0, y: location.top || 0 },
      ),
    );
    this.onEnd();
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollableLocation>): void {
    let location = normalizeLocation(targetLocation, this.props.direction);
    let containerPosition = this.scrollOffset();

    location = this.applyScaleRatio(location);
    containerPosition = this.applyScaleRatio(containerPosition);

    const distance = {
      top: -containerPosition.top - ensureDefined(location.top, -containerPosition.top),
      left: -containerPosition.left - ensureDefined(location.left, -containerPosition.left),
    };

    if (!distance.top && !distance.left) {
      return;
    }

    this.scrollBy(distance);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<ScrollOffset>): void {
    if (element === undefined || element === null) {
      return;
    }

    /* istanbul ignore next */
    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      const scrollOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(offset as Partial<ScrollOffset>),
      };

      this.scrollTo({
        top: getElementLocation(
          element,
          scrollOffset,
          DIRECTION_VERTICAL,
          this.containerRef.current!,
          this.props.rtlEnabled,
        ),
        left: getElementLocation(
          element,
          scrollOffset,
          DIRECTION_HORIZONTAL,
          this.containerRef.current!,
          this.props.rtlEnabled,
        ),
      });
    }
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
  scrollOffset(): ScrollableLocation {
    return {
      top: this.containerRef.current!.scrollTop,
      left: this.containerRef.current!.scrollLeft,
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
    return subscribeToScrollEvent(this.containerRef.current!,
      () => this.props.onScroll?.(this.getEventArgs()));
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

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollInit.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleInit(e);
      }, this.getInitEventData(), { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef.current, { namespace });
  }

  getInitEventData(): {
    getDirection: (e: Event) => string | undefined;
    validate: (e: Event) => boolean;
    isNative: boolean;
    scrollTarget: HTMLDivElement | null;
  } {
    return {
      getDirection: this.getDirection,
      validate: this.validate,
      isNative: false,
      scrollTarget: this.containerRef.current,
    };
  }

  @Effect()
  startEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStart.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleStart(e);
      }, { namespace });

    return (): void => dxScrollStart.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  moveEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollMove.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleMove(e);
      }, { namespace });

    return (): void => dxScrollMove.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  endEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollEnd.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleEnd(e);
      }, { namespace });

    return (): void => dxScrollEnd.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  stopEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStop.on(this.wrapperRef.current,
      () => {
        this.handleStop();
      }, { namespace });

    return (): void => dxScrollStop.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  cancelEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollCancel.on(this.wrapperRef.current,
      (event: Event) => {
        this.handleCancel(event);
      }, { namespace });

    return (): void => dxScrollCancel.off(this.wrapperRef.current, { namespace });
  }

  onStart(): void {
    this.props.onStart?.(this.getEventArgs());
  }

  onEnd(): void {
    this.props.onEnd?.(this.getEventArgs());
  }

  onStop(): void {
    this.props.onStop?.(this.getEventArgs());
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

  pocketStateChange(state: number): void {
    this.topPocketState = state;
  }

  contentPositionChange(scrollProp: 'scrollLeft' | 'scrollTop', location: number, ratio: number): void {
    const containerEl = this.containerRef.current;

    containerEl![scrollProp] = -location / ratio;

    if (Math.abs(location - containerEl![scrollProp] * ratio) > 1) {
      this.triggerScrollEvent();
    }
  }

  triggerScrollEvent(): void {
    (eventsEngine as any).triggerHandler(this.containerRef.current, { type: 'scroll' });
  }

  contentTranslateOffsetChange(
    translateOffset: { left?: number; top?: number },
  ): void {
    this.props.contentTranslateOffset = {
      ...this.props.contentTranslateOffset,
      ...translateOffset,
    };
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

  handleInit(e: Event): void {
    this.suppressDirections(e);
    this.eventForUserAction = e;

    const crossThumbScrolling = this.isCrossThumbScrolling(e);

    this.eventHandler(
      (scrollbar) => scrollbar.initHandler(e, crossThumbScrolling),
    );

    this.onStop();
  }

  handleStart(e: Event): void {
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.startHandler());

    this.onStart();
  }

  handleMove(e): void {
    if (this.isLocked()) {
      e.cancel = true;
      return;
    }

    e.preventDefault();

    this.adjustDistance(e, 'delta');
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.moveHandler(e.delta));
  }

  handleEnd(e): void {
    this.adjustDistance(e, 'velocity');
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.endHandler(e.velocity));

    this.onEnd();
  }

  handleStop(): void {
    this.eventHandler((scrollbar) => scrollbar.stopHandler());
  }

  handleCancel(e: Event): void {
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.endHandler({ x: 0, y: 0 }));
  }

  applyScaleRatio(targetLocation): ScrollableLocation {
    const currentTargetLocation = targetLocation;

    if (this.direction.isVertical && isDefined(targetLocation.top)) {
      currentTargetLocation.top *= this.scaleRatioHeight;
    }

    if (this.direction.isHorizontal && isDefined(targetLocation.left)) {
      currentTargetLocation.left *= this.scaleRatioWidth;
    }

    return currentTargetLocation;
  }

  isCrossThumbScrolling(e): boolean {
    const { target } = e.originalEvent;

    let verticalScrolling;
    let horizontalScrolling;

    if (this.direction.isVertical) {
      verticalScrolling = this.props.scrollByThumb
        && this.verticalScrollbarRef.current!.isThumb(target);
    }

    if (this.direction.isHorizontal) {
      horizontalScrolling = this.props.scrollByThumb
        && this.horizontalScrollbarRef.current!.isThumb(target);
    }

    return verticalScrolling || horizontalScrolling;
  }

  adjustDistance(e, property: string): void {
    const distance = e[property];

    distance.x *= this.validDirections[DIRECTION_HORIZONTAL] ? 1 : 0;
    distance.y *= this.validDirections[DIRECTION_VERTICAL] ? 1 : 0;

    const devicePixelRatio = this.tryGetDevicePixelRatio();
    if (devicePixelRatio && isDxMouseWheelEvent(e.originalEvent)) {
      distance.x = Math.round((distance.x / devicePixelRatio) * 100) / 100;
      distance.y = Math.round((distance.y / devicePixelRatio) * 100) / 100;
    }
  }

  suppressDirections(e): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      this.prepareDirections(true);
      return;
    }

    this.prepareDirections(false);

    if (this.direction.isVertical && isDefined(this.verticalScrollbarRef.current)) {
      const isValid = this.validateEvent(e, this.verticalScrollbarRef.current);
      this.validDirections[DIRECTION_VERTICAL] = isValid;
    }
    if (this.direction.isHorizontal && isDefined(this.horizontalScrollbarRef.current)) {
      const isValid = this.validateEvent(e, this.horizontalScrollbarRef.current);
      this.validDirections[DIRECTION_HORIZONTAL] = isValid;
    }
  }

  validateEvent(e, scrollbarRef: any): boolean {
    const { scrollByThumb, scrollByContent } = this.props;

    return (scrollByThumb && scrollbarRef.validateEvent(e))
    || (scrollByContent && this.isContent(e.originalEvent.target));
  }

  prepareDirections(value: boolean): void {
    this.validDirections[DIRECTION_HORIZONTAL] = value;
    this.validDirections[DIRECTION_VERTICAL] = value;
  }

  isContent(element: HTMLDivElement): boolean {
    const closest = element.closest('.dx-scrollable-simulated');

    if (isDefined(closest)) {
      return closest === this.scrollableRef.current;
    }

    return false;
  }

  eventHandler(handler: (scrollbarInstance: any) => void): void {
    if (this.direction.isVertical) {
      handler(this.verticalScrollbarRef.current!);
    }
    if (this.direction.isHorizontal) {
      handler(this.horizontalScrollbarRef.current!);
    }
  }

  getDirection(e: Event): string | undefined {
    return isDxMouseWheelEvent(e) ? this.wheelDirection(e) : this.allowedDirection();
  }

  allowedDirection(): string | undefined {
    return updateAllowedDirection(this.allowedDirections, this.props.direction);
  }

  get allowedDirections(): AllowedDirection {
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

  @Method()
  validate(e: Event): boolean {
    if (this.isLocked() || this.props.disabled
    || (isDxMouseWheelEvent(e) && isCommandKeyPressed({
      ctrlKey: (e as any).ctrlKey,
      metaKey: (e as any).metaKey,
    }))) {
      return false;
    }

    if (this.props.bounceEnabled) {
      return true;
    }

    return isDxMouseWheelEvent(e)
      ? this.validateWheel(e)
      : this.validateMove(e);
  }

  isLocked(): boolean {
    return this.locked;
  }

  validateWheel(e: Event): boolean {
    const scrollbar = this.wheelDirection(e) === 'horizontal'
      ? this.horizontalScrollbarRef.current!
      : this.verticalScrollbarRef.current!;

    const reachedMin = scrollbar.reachedMin();
    const reachedMax = scrollbar.reachedMax();

    const contentGreaterThanContainer = !reachedMin || !reachedMax;
    const locatedNotAtBound = !reachedMin && !reachedMax;

    const { delta } = e as any;
    const scrollFromMin = (reachedMin && delta > 0);
    const scrollFromMax = (reachedMax && delta < 0);

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
    clearTimeout(this.validateWheelTimer);
    this.validateWheelTimer = undefined;
  }

  validateMove(e: Event): boolean {
    if (!this.props.scrollByContent
      && !isDefined((e.target as HTMLElement).closest(`.${SCROLLABLE_SCROLLBAR_CLASS}`))) {
      return false;
    }

    return isDefined(this.allowedDirection());
  }

  onWidgetKeyDown(options): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent } = options;

    const result = onKeyDown?.(options);
    if (result?.cancel) {
      return result;
    }

    this.keyDownHandler(originalEvent);

    return undefined;
  }

  keyDownHandler(e): void {
    let handled = true;

    switch (normalizeKeyName(e)) {
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
      e.stopPropagation();
      e.preventDefault();
    }
  }

  scrollByLine(lines: { x?: number; y?: number }): void {
    const devicePixelRatio = this.tryGetDevicePixelRatio();
    let scrollOffset = SCROLL_LINE_HEIGHT;
    if (devicePixelRatio) {
      scrollOffset = Math.abs((scrollOffset / devicePixelRatio) * 100) / 100;
    }
    this.scrollBy({
      top: (lines.y || 0) * scrollOffset,
      left: (lines.x || 0) * scrollOffset,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  tryGetDevicePixelRatio(): number | undefined {
    if (hasWindow()) {
      return (getWindow() as any).devicePixelRatio;
    }
    return undefined;
  }

  scrollByPage(page: number): void {
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance: { left?: number; top?: number } = {};

    if (isVertical) {
      distance.top = page * this.containerRef.current!.clientHeight;
    } else {
      distance.left = page * this.containerRef.current!.clientWidth;
    }

    this.scrollBy(distance);
  }

  wheelDirection(e?: any): ScrollableDirection {
    switch (this.props.direction) {
      case DIRECTION_HORIZONTAL:
        return DIRECTION_HORIZONTAL;
      case DIRECTION_VERTICAL:
        return DIRECTION_VERTICAL;
      default:
        return e?.shiftKey ? DIRECTION_HORIZONTAL : DIRECTION_VERTICAL;
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
      distance.top = this.contentRef.current!.clientHeight
        - this.containerRef.current!.clientHeight;
    } else {
      distance.left = this.contentRef.current!.clientWidth
        - this.containerRef.current!.clientWidth;
    }

    this.scrollTo(distance);
  }

  @Effect() effectDisabledState(): void {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
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

  @Effect() effectResetInactiveState(): void {
    const containerEl = this.containerRef.current;

    if (this.props.direction === DIRECTION_BOTH || !isDefined(containerEl)) { // || !hasWindow()
      return;
    }

    containerEl[this.fullScrollInactiveProp] = 0;
  }

  get fullScrollInactiveProp(): 'scrollLeft' | 'scrollTop' {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'scrollTop' : 'scrollLeft';
  }

  @Effect({ run: 'always' }) updateScrollbarSize(): void {
    this.scrollableOffsetLeft = this.scrollableOffset.left;
    this.scrollableOffsetTop = this.scrollableOffset.top;

    this.updateSizes();
  }

  windowResizeHandler(): void {
    this.updateSizes();
    this.onUpdated();
  }

  updateSizes(): void {
    const containerEl = this.containerRef.current;
    const contentEl = this.contentRef.current;

    if (isDefined(containerEl)) {
      this.containerClientWidth = containerEl.clientWidth;
      this.containerClientHeight = containerEl.clientHeight;

      this.containerOffsetWidth = containerEl.offsetWidth;
      this.containerOffsetHeight = containerEl.offsetHeight;
    }

    if (isDefined(contentEl)) {
      this.contentClientWidth = contentEl.clientWidth;
      this.contentClientHeight = contentEl.clientHeight;
      this.contentScrollWidth = contentEl.scrollWidth;
      this.contentScrollHeight = contentEl.scrollHeight;

      this.contentOffsetWidth = contentEl.offsetWidth;
      this.contentOffsetHeight = contentEl.offsetHeight;
    }

    if (this.props.forceGeneratePockets) {
      if (this.props.pullDownEnabled) {
        const topPocketEl = this.topPocketRef.current;

        if (isDefined(topPocketEl)) {
          this.topPocketClientHeight = topPocketEl.clientHeight;
        }
      }

      if (this.props.reachBottomEnabled) {
        const bottomPocketEl = this.bottomPocketRef.current;

        if (isDefined(bottomPocketEl)) {
          this.bottomPocketClientHeight = bottomPocketEl.clientHeight;
        }
      }
    }
  }

  get baseContentWidth(): number {
    return this.contentOffsetWidth;
  }

  get baseContainerWidth(): number {
    return this.containerOffsetWidth;
  }

  get baseContentHeight(): number {
    return this.contentOffsetHeight;
  }

  get baseContainerHeight(): number {
    return this.containerOffsetHeight;
  }

  get scaleRatioWidth(): number {
    if (!isDefined(this.containerRef?.current)) {
      return 1;
    }

    let scaleRatio = 1;

    if (hasWindow()) {
      const realDimension = this.containerRef.current.clientWidth;
      const baseDimension = this.containerRef.current.offsetWidth;

      scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    return scaleRatio;
  }

  get scaleRatioHeight(): number {
    if (!isDefined(this.containerRef?.current)) {
      return 1;
    }

    let scaleRatio = 1;

    if (hasWindow()) {
      const realDimension = this.containerRef.current.clientHeight;
      const baseDimension = this.containerRef.current.offsetHeight;

      scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    return scaleRatio;
  }

  get contentWidth(): number {
    if (!isDefined(this.contentRef) || !isDefined(this.contentRef.current)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowX', this.contentRef.current) === 'hidden';

    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollWidth * this.scaleRatioWidth;

      return Math.max(containerScrollSize, this.contentClientWidth);
    }

    return this.contentClientWidth;
  }

  get contentHeight(): number {
    if (!isDefined(this.contentRef) || !isDefined(this.contentRef.current)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowY', this.contentRef.current) === 'hidden';

    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollHeight * this.scaleRatioHeight;

      return Math.max(containerScrollSize, this.contentClientHeight);
    }

    return this.contentClientHeight;
  }

  /* istanbul ignore next */
  get scrollableOffset(): { left: number; top: number } {
    return getElementOffset(this.scrollableRef.current);
  }

  get contentStyles(): { [key: string]: string } {
    const { left, top } = { ...{ left: 0, top: 0 }, ...this.props.contentTranslateOffset };

    return {
      transform: `translate(${left}px, ${top}px)`,
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
      'dx-scrollable dx-scrollable-renovated': true,
      [SCROLLABLE_SIMULATED_CLASS]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE]: showScrollbar === 'always',
      [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean } {
    return new ScrollDirection(this.props.direction);
  }
}
