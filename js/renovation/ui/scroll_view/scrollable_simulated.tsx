import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  InternalState,
  Mutable,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';

import { AnimatedScrollbar } from './animated_scrollbar';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import { isDxMouseWheelEvent, normalizeKeyName } from '../../../events/utils/index';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
// import { when } from '../../../core/utils/deferred';
import { ScrollableSimulatedPropsType } from './scrollable_simulated_props';
import { ensureDefined } from '../../../core/utils/common';
import '../../../events/gesture/emitter.gesture.scroll';
import eventsEngine from '../../../events/core/events_engine';

import type { dxPromise } from '../../../core/utils/deferred';
import {
  ScrollableLocation, ScrollOffset,
  allowedDirection,
  ScrollEventArgs,
  ScrollableDirection,
} from './types.d';

import {
  normalizeLocation, ScrollDirection,
  getContainerOffsetInternal,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
  getElementStyle, getElementOffset,
  updateAllowedDirection,
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
} from './scrollable_utils';

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

const VALIDATE_WHEEL_TIMEOUT = 500;

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, onWidgetKeyDown,
    horizontalScrollbarRef, verticalScrollbarRef,
    cursorEnterHandler, cursorLeaveHandler,
    isHovered, contentTranslateOffsetChange, contentPositionChange,
    scaleRatioWidth, scaleRatioHeight,
    scrollableOffsetLeft, scrollableOffsetTop,
    contentWidth, containerClientWidth, contentHeight, containerClientHeight,
    baseContentWidth, baseContainerWidth, baseContentHeight, baseContainerHeight,
    scrollableRef, windowResizeHandler, contentStyles, containerStyles, onBounce,
    direction,
    props: {
      disabled, height, width, rtlEnabled, children,
      forceGeneratePockets, needScrollViewContentWrapper,
      showScrollbar, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled, contentTranslateOffset,
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
              pullingDownText={pullingDownText}
              pulledDownText={pulledDownText}
              refreshingText={refreshingText}
              refreshStrategy="simulated"
            />
            )}
            {needScrollViewContentWrapper && (
              <div className={SCROLLVIEW_CONTENT_CLASS}>{children}</div>)}
            {!needScrollViewContentWrapper && children}
            {forceGeneratePockets && (
            <BottomPocket
              reachBottomText={reachBottomText}
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
            />
          )}
        </div>
      </div>
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

  @Mutable() eventForUserAction?: Event;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Ref() scrollableRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() verticalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

  @Ref() horizontalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

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

  @Method()
  content(): HTMLDivElement {
    return this.contentRef.current!;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = normalizeLocation(distance, this.props.direction);
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);

    if (isVertical) {
      const scrollbar = this.verticalScrollbarRef.current;
      location.top = scrollbar.boundLocation(
        location.top + scrollbar.getLocation(),
      ) - scrollbar.getLocation();
    }
    if (isHorizontal) {
      const scrollbar = this.horizontalScrollbarRef.current;
      location.left = scrollbar.boundLocation(
        location.left + scrollbar.getLocation(),
      ) - scrollbar.getLocation();
    }

    this.prepareDirections(true);
    this.props.onStart?.(this.getEventArgs());
    this.eventHandler(
      (scrollbar) => scrollbar.scrollByHandler(
        { x: location.left || 0, y: location.top || 0 },
      ),
    );
    this.props.onEnd?.(this.getEventArgs());
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
    const { rtlEnabled } = this.props;
    const { left, top } = getContainerOffsetInternal(this.containerRef.current!);

    return {
      left: getPublicCoordinate('left', left, this.containerRef.current!, rtlEnabled),
      top: getPublicCoordinate('top', top, this.containerRef.current!, rtlEnabled),
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
    // this.eventHandler( // Think about reworking it | only for tab press support
    //   (scrollbar) => {
    //     /* istanbul ignore next */
    //     if (scrollbar.insideBounds()) {
    //       scrollbar.setLocation(
    // -this.containerRef[`scroll${scrollbar.getDirection()
    // === DIRECTION_HORIZONTAL ? 'Left' : 'Top'}`]);
    //       return scrollbar.moveToLocation();
    //     }
    //     /* istanbul ignore next */
    //     return undefined;
    //   },
    // );
  }

  getEventArgs(): ScrollEventArgs {
    return {
      event: this.eventForUserAction,
      scrollOffset: this.scrollOffset(),
      ...getBoundaryProps(this.props.direction, this.scrollOffset(), this.containerRef.current!),
    };
  }

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    /* istanbul ignore next */
    dxScrollInit.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleInit(e);
      }, {
        getDirection: (e) => this.getDirection(e),
        validate: (e) => this.validate(e),
        isNative: false,
        scrollTarget: this.containerRef.current,
      }, { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef.current, { namespace });
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

  onBounce(): void {
    this.props.onBounce?.(this.getEventArgs());
  }

  contentPositionChange(scrollProp: 'scrollLeft' | 'scrollTop', location: number, ratio: number): void {
    this.containerRef.current![scrollProp] = -location / ratio;

    if (Math.abs(location - this.containerRef.current![scrollProp] * ratio) > 1) {
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

    this.props.onStop?.(this.getEventArgs());
  }

  private handleStart(e: Event): void {
    this.eventForUserAction = e;

    this.eventHandler(
      (scrollbar) => scrollbar.startHandler(e),
    );

    this.props.onStart?.(this.getEventArgs());
  }

  private handleMove(e): void {
    if (this.isLocked()) {
      e.cancel = true;
      return;
    }

    e.preventDefault();

    this.adjustDistance(e, 'delta');
    this.eventForUserAction = e;

    this.eventHandler(
      (scrollbar) => scrollbar.moveHandler(e.delta),
    );
  }

  private handleEnd(e): void {
    this.adjustDistance(e, 'velocity');
    this.eventForUserAction = e;

    this.eventHandler(
      (scrollbar) => scrollbar.endHandler(e.velocity),
    );

    this.props.onEnd?.(this.getEventArgs());
  }

  private handleStop(): void {
    this.eventHandler(
      (scrollbar) => scrollbar.stopHandler(),
    );
  }

  private handleCancel(e: Event): void {
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

    if (this.direction.isVertical) {
      const isValid = this.validateEvent(e, this.verticalScrollbarRef.current!);
      this.validDirections[DIRECTION_VERTICAL] = isValid;
    }
    if (this.direction.isHorizontal) {
      const isValid = this.validateEvent(e, this.horizontalScrollbarRef.current!);
      this.validDirections[DIRECTION_HORIZONTAL] = isValid;
    }
  }

  validateEvent(e, scrollbarRef): boolean {
    const { scrollByThumb, scrollByContent } = this.props;

    return (scrollByThumb && scrollbarRef.validateEvent(e))
    || (scrollByContent && this.isContent(e.originalEvent.target));
  }

  prepareDirections(value: boolean): void {
    this.validDirections[DIRECTION_HORIZONTAL] = value;
    this.validDirections[DIRECTION_VERTICAL] = value;
  }

  isContent(element): boolean {
    const closest = element.closest('.dx-scrollable-simulated');

    if (isDefined(closest)) {
      return closest === this.scrollableRef.current;
    }

    return false;
  }

  eventHandler(
    handler: (
      scrollbarInstance: any
    ) => dxPromise<void>,
  ): any { // dxPromise<void> {
    const deferreds: ReturnType<typeof handler>[] = [];

    if (this.direction.isVertical) {
      deferreds.push(handler(this.verticalScrollbarRef.current!));
    }
    if (this.direction.isHorizontal) {
      deferreds.push(handler(this.horizontalScrollbarRef.current!));
    }

    // return when.apply($, deferreds).promise();
  }

  private getDirection(e: Event): string | undefined {
    return isDxMouseWheelEvent(e) ? this.wheelDirection(e) : this.allowedDirection();
  }

  private allowedDirection(): string | undefined {
    return updateAllowedDirection(this.allowedDirections, this.props.direction);
  }

  get allowedDirections(): allowedDirection {
    if (
      !isDefined(this.verticalScrollbarRef?.current)
      && !isDefined(this.horizontalScrollbarRef?.current)
    ) {
      return { vertical: false, horizontal: false };
    }

    return {
      vertical:
        this.direction.isVertical
        && (Math.round(this.verticalScrollbarRef.current!.getMinOffset()) < 0
          || this.props.bounceEnabled),
      horizontal:
        this.direction.isHorizontal
        && (Math.round(this.horizontalScrollbarRef.current!.getMinOffset()) < 0
          || this.props.bounceEnabled),
    };
  }

  private validate(e: Event): boolean {
    if (this.isLocked()) {
      return false;
    }

    if (this.props.disabled) {
      return false;
    }

    if (this.props.bounceEnabled) {
      return true;
    }

    return isDxMouseWheelEvent(e)
      ? this.validateWheel(e)
      : this.validateMove(e);
  }

  private isLocked(): boolean {
    return this.locked;
  }

  private validateWheel(e: Event): boolean {
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

  private clearWheelValidationTimer(): void {
    clearTimeout(this.validateWheelTimer);
    this.validateWheelTimer = undefined;
  }

  private validateMove(e: Event): boolean {
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

  private keyDownHandler(e): void {
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

  scrollByLine(lines): void {
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

  /* istanbul ignore next */
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

  private wheelDirection(e?: any): ScrollableDirection {
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

  @Effect({ run: 'always' }) effectUpdateScrollbarSize(): void {
    this.scrollableOffsetLeft = this.scrollableOffset.left;
    this.scrollableOffsetTop = this.scrollableOffset.top;

    this.updateSizes();
  }

  windowResizeHandler(): void {
    this.updateSizes();
  }

  updateSizes(): void {
    this.containerClientWidth = this.containerRef.current!.clientWidth;
    this.containerClientHeight = this.containerRef.current!.clientHeight;

    this.contentClientWidth = this.contentRef.current!.clientWidth;
    this.contentClientHeight = this.contentRef.current!.clientHeight;
    this.contentScrollWidth = this.contentRef.current!.scrollWidth;
    this.contentScrollHeight = this.contentRef.current!.scrollHeight;

    this.containerOffsetWidth = this.containerRef.current!.offsetWidth;
    this.containerOffsetHeight = this.containerRef.current!.offsetHeight;
    this.contentOffsetWidth = this.contentRef.current!.offsetWidth;
    this.contentOffsetHeight = this.contentRef.current!.offsetHeight;
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
    if (!isDefined(this.scrollableRef?.current)) {
      return 1;
    }

    let scaleRatio = 1;

    /* istanbul ignore next */
    if (hasWindow()) {
      const realDimension = this.scrollableRef.current!.clientWidth;
      const baseDimension = this.scrollableRef.current!.offsetWidth;

      scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    return scaleRatio;
  }

  get scaleRatioHeight(): number {
    if (!isDefined(this.scrollableRef?.current)) {
      return 1;
    }

    let scaleRatio = 1;

    /* istanbul ignore next */
    if (hasWindow()) {
      const realDimension = this.scrollableRef.current!.clientHeight;
      const baseDimension = this.scrollableRef.current!.offsetHeight;

      scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    return scaleRatio;
  }

  get contentWidth(): number {
    if (!isDefined(this.contentRef)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowX', this.contentRef.current!) === 'hidden';

    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollWidth * this.scaleRatioWidth;

      return Math.max(containerScrollSize, this.contentClientWidth);
    }

    return this.contentClientWidth;
  }

  get contentHeight(): number {
    if (!isDefined(this.contentRef)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowY', this.contentRef.current!) === 'hidden';

    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollHeight * this.scaleRatioHeight;

      return Math.max(containerScrollSize, this.contentClientHeight);
    }

    return this.contentClientHeight;
  }

  get scrollableOffset(): { left: number; top: number } {
    return this.getScrollableOffset();
  }

  getScrollableOffset(): { left: number; top: number } {
    return getElementOffset(this.scrollableRef.current!);
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
