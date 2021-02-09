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
import { Scrollbar } from './scrollbar';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { isDxMouseWheelEvent, normalizeKeyName } from '../../../events/utils/index';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { getBoundingRect } from '../../../core/utils/position';
import { titleize } from '../../../core/utils/inflector';
import { isDefined } from '../../../core/utils/type';
import { when } from '../../../core/utils/deferred';
import { ScrollableSimulatedPropsType } from './scrollable_simulated_props';
import $ from '../../../core/renderer';
import { ensureDefined } from '../../../core/utils/common';
import resizeCallbacks from '../../../core/utils/resize_callbacks';
import '../../../events/gesture/emitter.gesture.scroll';

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
  getElementWidth, getElementHeight, getElementStyle,
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
    isScrollbarVisible, onChangeVisibility,
    scaleRatioWidth, scaleRatioHeight,
    scrollableOffsetLeft, scrollableOffsetTop,
    contentWidth, containerWidth, contentHeight, containerHeight,
    baseContentWidth, baseContainerWidth, baseContentHeight, baseContainerHeight,
    scrollableRef,
    props: {
      disabled, height, width, rtlEnabled, children,
      forceGeneratePockets, needScrollViewContentWrapper,
      showScrollbar, direction, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled,
    },
    restAttributes,
  } = viewModel;

  const targetDirection = direction ?? 'vertical';
  const isVertical = targetDirection !== 'horizontal';
  const isHorizontal = targetDirection !== 'vertical';

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
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS} ref={wrapperRef}>
        <div
          className={SCROLLABLE_CONTAINER_CLASS}
          ref={containerRef}
        >
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef}>
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
          {isHorizontal && (
            <Scrollbar
              direction="horizontal"
              ref={horizontalScrollbarRef}
              containerRef={containerRef}
              contentRef={contentRef}
              scaleRatio={scaleRatioWidth}
              scrollableOffset={scrollableOffsetLeft}
              contentSize={contentWidth}
              containerSize={containerWidth}
              baseContentSize={baseContentWidth}
              baseContainerSize={baseContainerWidth}
              visible={isScrollbarVisible}
              onChangeVisibility={onChangeVisibility}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
            />
          )}
          {isVertical && (
            <Scrollbar
              direction="vertical"
              ref={verticalScrollbarRef}
              containerRef={containerRef}
              contentRef={contentRef}
              scaleRatio={scaleRatioHeight}
              scrollableOffset={scrollableOffsetTop}
              contentSize={contentHeight}
              containerSize={containerHeight}
              baseContentSize={baseContentHeight}
              baseContainerSize={baseContainerHeight}
              visible={isScrollbarVisible}
              scrollByThumb={scrollByThumb}
              onChangeVisibility={onChangeVisibility}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
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

  @Ref() verticalScrollbarRef!: RefObject<any>; // TODO: any -> Scrollbar (Generators)

  @Ref() horizontalScrollbarRef!: RefObject<any>; // TODO: any -> Scrollbar (Generators)

  @InternalState() isHovered = false;

  @InternalState() needShowScrollbars = false;

  @InternalState() scaleRatioWidth;

  @InternalState() scaleRatioHeight;

  @InternalState() scrollableOffsetLeft = 0;

  @InternalState() scrollableOffsetTop = 0;

  @InternalState() contentWidth = 0;

  @InternalState() contentHeight = 0;

  @InternalState() containerWidth = 0;

  @InternalState() containerHeight = 0;

  @InternalState() baseContentWidth = 0;

  @InternalState() baseContentHeight = 0;

  @InternalState() baseContainerWidth = 0;

  @InternalState() baseContainerHeight = 0;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = normalizeLocation(distance, this.props.direction);
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);

    if (isVertical) {
      const scrollbar = this.verticalScrollbarRef;
      location.top = scrollbar.boundLocation(
        location.top + scrollbar.getLocation(),
      ) - scrollbar.getLocation();
    }
    if (isHorizontal) {
      const scrollbar = this.horizontalScrollbarRef;
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

      const location = {
        top: getElementLocation(
          element, scrollOffset, DIRECTION_VERTICAL, this.containerRef, this.props.rtlEnabled,
        ),
        left: getElementLocation(
          element, scrollOffset, DIRECTION_HORIZONTAL, this.containerRef, this.props.rtlEnabled,
        ),
      };

      this.scrollTo(location);
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
    const { left, top } = getContainerOffsetInternal(this.containerRef);
    return {
      left: getPublicCoordinate('left', left, this.containerRef, rtlEnabled),
      top: getPublicCoordinate('top', top, this.containerRef, rtlEnabled),
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
    return this.containerRef.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerRef.clientWidth;
  }

  @Effect({ run: 'once' })
  disposeWheelTimer(): DisposeEffectReturn {
    return (): void => this.clearWheelValidationTimer();
  }

  @Effect() scrollEffect(): DisposeEffectReturn {
    return subscribeToScrollEvent(this.containerRef,
      () => {
        this.eventHandler(
          (scrollbar) => {
            /* istanbul ignore next */
            if (scrollbar.insideBounds()) {
              scrollbar.setLocation(-this.containerRef[`scroll${scrollbar.getDirection() === DIRECTION_HORIZONTAL ? 'Left' : 'Top'}`]);
              return scrollbar.moveToLocation();
            }
            /* istanbul ignore next */
            return undefined;
          },
        );

        return this.props.onScroll?.(this.getEventArgs());
      });
  }

  getEventArgs(): ScrollEventArgs {
    return {
      event: this.eventForUserAction,
      scrollOffset: this.scrollOffset(),
      ...getBoundaryProps(this.props.direction, this.scrollOffset(), this.containerRef),
    };
  }

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    /* istanbul ignore next */
    dxScrollInit.on(this.wrapperRef,
      (e: Event) => {
        this.handleInit(e);
      }, {
        getDirection: (e) => this.getDirection(e),
        validate: (e) => this.validate(e),
        isNative: false,
        scrollTarget: this.containerRef,
      }, { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef, { namespace });
  }

  @Effect()
  startEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStart.on(this.wrapperRef,
      (e: Event) => {
        this.handleStart(e);
      }, { namespace });

    return (): void => dxScrollStart.off(this.wrapperRef, { namespace });
  }

  @Effect()
  moveEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollMove.on(this.wrapperRef,
      (e: Event) => {
        this.handleMove(e);
      }, { namespace });

    return (): void => dxScrollMove.off(this.wrapperRef, { namespace });
  }

  @Effect()
  endEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollEnd.on(this.wrapperRef,
      (e: Event) => {
        this.handleEnd(e);
      }, { namespace });

    return (): void => dxScrollEnd.off(this.wrapperRef, { namespace });
  }

  @Effect()
  stopEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStop.on(this.wrapperRef,
      () => {
        this.handleStop();
      }, { namespace });

    return (): void => dxScrollStop.off(this.wrapperRef, { namespace });
  }

  @Effect()
  cancelEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollCancel.on(this.wrapperRef,
      (event: Event) => {
        this.handleCancel(event);
      }, { namespace });

    return (): void => dxScrollCancel.off(this.wrapperRef, { namespace });
  }

  onChangeVisibility(visible: boolean): void {
    this.needShowScrollbars = visible;
  }

  cursorEnterHandler(): void {
    if (this.isHoverMode()) {
      this.isHovered = true;
    }
  }

  cursorLeaveHandler(): void {
    if (this.isHoverMode()) {
      this.isHovered = false;
    }
  }

  handleInit(e: Event): void {
    this.suppressDirections(e);
    this.eventForUserAction = e;

    const crossThumbScrolling = this.isThumbScrolling(e);

    this.needShowScrollbars = true;

    this.eventHandler(
      (scrollbar) => scrollbar.initHandler(e, crossThumbScrolling),
    );

    this.props.onStop?.(this.getEventArgs());
  }

  private handleStart(e: Event): void {
    this.eventForUserAction = e;
    this.needShowScrollbars = true;

    this.eventHandler(
      (scrollbar) => scrollbar.startHandler(e),
    );

    this.props.onStart?.(this.getEventArgs());
  }

  private handleMove(e): void {
    e.preventDefault && e.preventDefault();

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
    this.needShowScrollbars = false;

    this.eventHandler(
      (scrollbar) => scrollbar.stopHandler(),
    );
  }

  private handleCancel(e: Event): void {
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.endHandler({ x: 0, y: 0 }));
  }

  applyScaleRatio(targetLocation): ScrollableLocation {
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);
    const currentTargetLocation = targetLocation;

    if (isVertical && isDefined(targetLocation.top)) {
      currentTargetLocation.top *= this.getScaleRatio('height');
    }

    if (isHorizontal && isDefined(targetLocation.left)) {
      currentTargetLocation.left *= this.getScaleRatio('width');
    }

    return currentTargetLocation;
  }

  isThumbScrolling(e): boolean {
    const { scrollByThumb } = this.props;
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);
    const { target } = e.originalEvent;

    let verticalScrolling;
    let horizontalScrolling;

    if (isVertical) {
      verticalScrolling = scrollByThumb && this.verticalScrollbarRef.isThumb(target);
    }

    if (isHorizontal) {
      horizontalScrolling = scrollByThumb && this.horizontalScrollbarRef.isThumb(target);
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

    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);
    if (isVertical) {
      const isValid = this.validateEvent(e, this.verticalScrollbarRef);
      this.validDirections[DIRECTION_VERTICAL] = isValid;
    }
    if (isHorizontal) {
      const isValid = this.validateEvent(e, this.horizontalScrollbarRef);
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
      return closest === this.scrollableRef;
    }

    return false;
  }

  eventHandler(
    handler: (
      scrollbarInstance: any
    ) => dxPromise<void>,
  ): dxPromise<void> {
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);
    const deferreds: ReturnType<typeof handler>[] = [];

    if (isVertical) {
      deferreds.push(handler(this.verticalScrollbarRef));
    }
    if (isHorizontal) {
      deferreds.push(handler(this.horizontalScrollbarRef));
    }

    return when.apply($, deferreds).promise();
  }

  private getDirection(e: Event): string | undefined {
    return isDxMouseWheelEvent(e) ? this.wheelDirection(e) : this.allowedDirection();
  }

  private allowedDirection(): string | undefined {
    return updateAllowedDirection(this.allowedDirections(), this.props.direction);
  }

  private allowedDirections(): allowedDirection {
    const { bounceEnabled, direction } = this.props;
    const { isVertical, isHorizontal } = new ScrollDirection(direction);

    return {
      vertical: isVertical
      && (Math.round(this.verticalScrollbarRef.getMinOffset()) < 0 || bounceEnabled),
      horizontal: isHorizontal
      && (Math.round(this.horizontalScrollbarRef.getMinOffset()) < 0 || bounceEnabled),
    };
  }

  containerSize(dimension: string): number {
    return this.getRealDimension(this.containerRef, dimension);
  }

  // eslint-disable-next-line
  getRealDimension(element, dimension): number {
    return Math.round(getBoundingRect(element)[dimension]);
  }

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this
  getBaseDimension(element, dimension): number {
    return element[`offset${titleize(dimension)}`];
  }

  contentSize(dimension: string): number {
    const axis = dimension === 'width' ? 'x' : 'y';

    const overflowStyleName = `overflow${axis.toUpperCase()}`;
    const isOverflowHidden = getElementStyle((overflowStyleName as 'overflowX' | 'overflowY'), this.contentRef) === 'hidden';
    let contentSize = this.getRealDimension(this.contentRef, dimension);

    if (!isOverflowHidden) {
      const containerScrollSize = this.contentRef[`scroll${titleize(dimension)}`] * this.getScaleRatio(dimension);

      contentSize = Math.max(containerScrollSize, contentSize);
    }

    return contentSize;
  }

  getScaleRatio(dimension: string): number {
    let scaleRatio = 1;

    /* istanbul ignore next */
    if (hasWindow()) {
      const realDimension = this.getRealDimension(this.scrollableRef, dimension);
      const baseDimension = this.getBaseDimension(this.scrollableRef, dimension);

      scaleRatio = Math.round((realDimension / baseDimension) * 100) / 100;
    }

    return scaleRatio;
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
      ? this.horizontalScrollbarRef
      : this.verticalScrollbarRef;

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
      distance.top = page * getElementHeight(this.containerRef);
    } else {
      distance.left = page * getElementWidth(this.containerRef);
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
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance = { [isVertical ? 'top' : 'left']: 0 };

    this.scrollTo(distance);
  }

  scrollToEnd(): void {
    const { isVertical } = new ScrollDirection(this.wheelDirection());
    const distance: { left?: number; top?: number } = {};

    if (isVertical) {
      distance.top = getElementHeight(this.contentRef) - getElementHeight(this.containerRef);
    } else {
      distance.left = getElementWidth(this.contentRef) - getElementWidth(this.containerRef);
    }

    this.scrollTo(distance);
  }

  private isHoverMode(): boolean {
    return this.props.showScrollbar === 'onHover';
  }

  get isScrollbarVisible(): boolean {
    const { showScrollbar } = this.props;

    if (showScrollbar === 'never') {
      return false;
    }
    if (showScrollbar === 'onHover') {
      return this.needShowScrollbars || this.isHovered;
    }
    if (showScrollbar === 'always') {
      return true;
    }

    return this.needShowScrollbars || false;
  }

  @Effect({ run: 'always' }) effectUpdateScrollbarSize(): void {
    this.updateScrollbarSize();
  }

  /* istanbul ignore next */
  @Effect() resizeEffect(): DisposeEffectReturn {
    const callback = (): void => {
      this.updateScrollbarSize();
      this.horizontalScrollbarRef.updateLocation();
      this.verticalScrollbarRef.updateLocation();
      this.horizontalScrollbarRef.moveScrollbar(this.horizontalScrollbarRef.getLocation());
      this.verticalScrollbarRef.moveScrollbar(this.verticalScrollbarRef.getLocation());
    };
    resizeCallbacks.add(callback);
    return (): void => { resizeCallbacks.remove(callback); };
  }

  updateScrollbarSize(): void {
    const scrollableOffset = this.getScrollableOffset() || { left: 0, top: 0 };

    this.scaleRatioWidth = this.getScaleRatio('width');
    this.contentWidth = this.contentSize('width');
    this.containerWidth = this.containerSize('width');
    this.baseContentWidth = Math.round(this.getBaseDimension(this.contentRef, 'width'));
    this.baseContainerWidth = Math.round(this.getBaseDimension(this.containerRef, 'width'));
    this.scrollableOffsetLeft = scrollableOffset.left;

    this.scaleRatioHeight = this.getScaleRatio('height');
    this.contentHeight = this.contentSize('height');
    this.containerHeight = this.containerSize('height');
    this.baseContentHeight = Math.round(this.getBaseDimension(this.contentRef, 'height'));
    this.baseContainerHeight = Math.round(this.getBaseDimension(this.containerRef, 'height'));
    this.scrollableOffsetTop = scrollableOffset.top;
  }

  getScrollableOffset(): { left: number; top: number } | undefined {
    return $(this.scrollableRef).offset();
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
}
