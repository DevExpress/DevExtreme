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
import { getBoundaryProps } from './utils/get_boundary_props';
import { getElementLocationInternal } from './utils/get_element_location_internal';

import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import { isDxMouseWheelEvent, normalizeKeyName, isCommandKeyPressed } from '../../../events/utils/index';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
import { ScrollableSimulatedPropsType } from './scrollable_simulated_props';
import '../../../events/gesture/emitter.gesture.scroll';
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
  keyDown,
} from '../../../events/short';
import { getOffsetDistance } from './utils/get_offset_distance';
import { restoreLocation } from './utils/restore_location';
import { getScrollTopMax } from './utils/get_scroll_top_max';
import { getScrollLeftMax } from './utils/get_scroll_left_max';
import { inRange } from '../../../core/utils/math';
import { isVisible } from './utils/is_element_visible';

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
    vScrollLocation, hScrollLocation,
    forceUpdateHScrollbarLocation, forceUpdateVScrollbarLocation,
    props: {
      aria, disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      showScrollbar, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled,
      pullDownEnabled, reachBottomEnabled,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      focusStateEnabled={useKeyboard}
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
      onVisibilityChange={updateHandler}
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
              forceUpdateScrollbarLocation={forceUpdateHScrollbarLocation}
              rtlEnabled={rtlEnabled}
            />
          )}
          {direction.isVertical && (
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
              forceUpdateScrollbarLocation={forceUpdateVScrollbarLocation}

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
  // https://trello.com/c/psOGNvMc/2745-renovation-type-for-timers
  @Mutable() validateWheelTimer?: any;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() eventForUserAction?: Event;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Mutable()
  endActionDirections:
  { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false };

  @Mutable() prevContainerClientWidth = 0;

  @Mutable() prevContainerClientHeight = 0;

  @Mutable() prevContentClientWidth = 0;

  @Mutable() prevContentClientHeight = 0;

  @Mutable() tabWasPressed = false;

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

  @InternalState() scrollableOffsetLeft = 0;

  @InternalState() scrollableOffsetTop = 0;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentScrollWidth = 0;

  @InternalState() contentScrollHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() topPocketClientHeight = 0;

  @InternalState() bottomPocketClientHeight = 0;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @InternalState() vScrollLocation = 0;

  @InternalState() hScrollLocation = 0;

  @InternalState() vContentTranslateOffset = 0;

  @InternalState() hContentTranslateOffset = 0;

  @InternalState() forceUpdateHScrollbarLocation = false;

  @InternalState() forceUpdateVScrollbarLocation = false;

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
    this.pocketStateChange(TopPocketState.STATE_READY);
    this.startLoading();
    this.props.onPullDown?.({});
  }

  @Method()
  release(): void {
    this.eventHandler((scrollbar) => scrollbar.releaseHandler());
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    const location = restoreLocation(distance, this.props.direction);

    if (!location.top && !location.left) {
      return;
    }

    this.update();

    if (this.direction.isVertical) {
      const scrollbar = this.vScrollbarRef.current!;
      location.top = scrollbar.getLocationWithinRange(
        location.top! + this.vScrollLocation,
      ) - this.vScrollLocation;
    }
    if (this.direction.isHorizontal) {
      const scrollbar = this.hScrollbarRef.current!;
      location.left = scrollbar.getLocationWithinRange(
        location.left! + this.hScrollLocation,
      ) - this.hScrollLocation;
    }

    this.prepareDirections(true);
    this.onStart();
    this.eventHandler(
      (scrollbar) => scrollbar.scrollByHandler(
        { x: location.left || 0, y: location.top || 0 },
      ),
    );
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    const { direction } = this.props;
    const distance = getOffsetDistance(targetLocation, direction, this.scrollOffset());

    this.scrollBy(distance);
  }

  @Method()
  /* istanbul ignore next */
  scrollToElement(
    element: HTMLElement,
    scrollToOptions: {
      block: 'start' | 'center' | 'end' | 'nearest';
      inline: 'start' | 'center' | 'end' | 'nearest';
      behavior: 'auto'; 'smooth';
    },
  ): void {
    if (!isDefined(element)) {
      return;
    }

    const { top, left } = this.scrollOffset();
    element.scrollIntoView(scrollToOptions || { block: 'nearest', inline: 'nearest' });

    const containerEl = this.containerElement;

    const { direction } = this.props;
    const distance = getOffsetDistance({ top, left }, direction, this.scrollOffset());

    if (!this.direction.isHorizontal) {
      containerEl.scrollLeft += distance.left;
    }

    if (!this.direction.isVertical) {
      containerEl.scrollTop += distance.top;
    }

    this.vScrollLocation = -containerEl.scrollTop;
    this.hScrollLocation = -containerEl.scrollLeft;
  }

  @Method()
  // TODO: it uses for DataGrid only
  /* istanbul ignore next */
  getElementLocation(
    element: HTMLElement,
    direction: ScrollableDirection,
    offset?: Partial<Omit<ClientRect, 'width' | 'height'>>,
  ): number {
    return getElementLocationInternal(
      element,
      {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...offset,
      },
      direction,
      this.containerElement,
    );
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
    return subscribeToScrollEvent(this.containerElement,
      () => {
        this.handleScroll();
      });
  }

  @Effect()
  keyboardEffect(): DisposeEffectReturn {
    keyDown.on(this.containerElement,
      (e) => {
        if (normalizeKeyName(e) === KEY_CODES.TAB) {
          this.tabWasPressed = true;
        }
      });

    return (): void => keyDown.off(this.containerElement);
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

  @Method()
  validate(e: Event): boolean {
    if (this.isLocked()) {
      return false;
    }

    this.update();

    if (this.props.disabled
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

  @Effect()
  cancelEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollCancel.on(this.wrapperRef.current,
      (event: Event) => {
        this.handleCancel(event);
      }, { namespace });

    return (): void => dxScrollCancel.off(this.wrapperRef.current, { namespace });
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
      || !isDefined(this.containerElement)) { // || !hasWindow()
      return;
    }

    this.containerElement[this.fullScrollInactiveProp] = 0;
  }

  @Effect({ run: 'always' }) updateScrollbarSize(): void {
    this.scrollableOffsetLeft = this.scrollableOffset.left;
    this.scrollableOffsetTop = this.scrollableOffset.top;

    this.updateSizes();
  }

  handleScroll(): void {
    this.handleTabKey();
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
        this.containerElement,
        this.topPocketClientHeight,
      ),
    };
  }

  getInitEventData(): {
    getDirection: (e: Event) => string | undefined;
    validate: (e: Event) => boolean;
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

  pocketStateChange(state: number): void {
    this.topPocketState = state;
  }

  scrollLocationChange(scrollProp: 'scrollLeft' | 'scrollTop', location: number): void {
    const containerEl = this.containerElement;

    containerEl[scrollProp] = -location;

    if (scrollProp === 'scrollLeft') {
      this.hScrollLocation = location;
    } else {
      this.vScrollLocation = location;
    }

    this.forceUpdateHScrollbarLocation = false;
    this.forceUpdateVScrollbarLocation = false;
  }

  onScroll(): void {
    (eventsEngine as any).triggerHandler(this.containerElement, { type: 'scroll' });
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

  handleInit(e: Event): void {
    this.suppressDirections(e);
    this.eventForUserAction = e;

    const crossThumbScrolling = this.isCrossThumbScrolling(e);

    this.eventHandler(
      (scrollbar) => scrollbar.initHandler(e, crossThumbScrolling),
    );
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
  }

  handleStop(): void {
    this.eventHandler((scrollbar) => scrollbar.stopHandler());
  }

  handleCancel(e: Event): void {
    this.eventForUserAction = e;

    this.eventHandler((scrollbar) => scrollbar.endHandler({ x: 0, y: 0 }));
  }

  isCrossThumbScrolling(e): boolean {
    const { target } = e.originalEvent;

    let verticalScrolling;
    let horizontalScrolling;

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
      const isValid = this.validateEvent(e, this.vScrollbarRef.current!);
      this.validDirections[DIRECTION_VERTICAL] = isValid;
    }
    if (this.direction.isHorizontal) {
      const isValid = this.validateEvent(e, this.hScrollbarRef.current!);
      this.validDirections[DIRECTION_HORIZONTAL] = isValid;
    }
  }

  // https://trello.com/c/6TBHZulk/2672-renovation-cannot-use-getter-to-get-access-to-components-methods-react
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
    if (this.direction.isHorizontal) {
      handler(this.hScrollbarRef.current!);
    }
    if (this.direction.isVertical) {
      handler(this.vScrollbarRef.current!);
    }
  }

  tryGetAllowedDirection(e: Event): ScrollableDirection | undefined {
    return isDxMouseWheelEvent(e) ? this.wheelDirection(e) : this.allowedDirection();
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

  validateWheel(e: Event): boolean {
    const scrollbar = this.wheelDirection(e) === 'horizontal'
      ? this.hScrollbarRef.current!
      : this.vScrollbarRef.current!;

    const reachedMin = scrollbar.reachedMin();
    const reachedMax = scrollbar.reachedMax();

    const contentGreaterThanContainer = !reachedMin || !reachedMax;
    const locatedNotAtBound = !reachedMin && !reachedMax;

    const { delta } = e as any;
    const scrollFromMin = reachedMin && delta > 0;
    const scrollFromMax = reachedMax && delta < 0;

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

  handleKeyDown({ originalEvent }: any): void {
    let handled = true;

    switch (normalizeKeyName(originalEvent)) {
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
      originalEvent.stopPropagation();
      originalEvent.preventDefault();
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
    const { clientHeight, clientWidth } = this.containerElement;

    if (isVertical) {
      distance.top = page * clientHeight;
    } else {
      distance.left = page * clientWidth;
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

  updateHandler(): void {
    this.update();
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

    if (this.prevContentClientWidth !== this.contentClientWidth
      || this.prevContainerClientWidth !== this.containerClientWidth) {
      this.forceUpdateHScrollbarLocation = true;
      this.prevContentClientWidth = this.contentClientWidth;
      this.prevContainerClientWidth = this.containerClientWidth;
      this.hScrollLocation = -containerEl.scrollLeft;
    }
    if (this.prevContentClientHeight !== this.contentClientHeight
      || this.prevContainerClientHeight !== this.containerClientHeight) {
      this.forceUpdateVScrollbarLocation = true;
      this.prevContentClientHeight = this.contentClientHeight;
      this.prevContainerClientHeight = this.containerClientHeight;
      /* istanbul ignore next */
      if (this.vScrollLocation <= 0) {
        this.vScrollLocation = -containerEl.scrollTop;
      }
    }
  }

  get containerElement(): HTMLDivElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.containerRef.current!;
  }

  get contentWidth(): number {
    if (!isDefined(this.contentRef?.current)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowX', this.contentRef.current) === 'hidden';

    /* istanbul ignore next */
    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollWidth;
      return Math.max(containerScrollSize, this.contentClientWidth);
    }

    return this.contentClientWidth;
  }

  get contentHeight(): number {
    if (!isDefined(this.contentRef?.current)) {
      return 0;
    }

    const isOverflowHidden = getElementStyle('overflowY', this.contentRef.current) === 'hidden';

    /* istanbul ignore next */
    if (!isOverflowHidden) {
      const containerScrollSize = this.contentScrollHeight;
      return Math.max(containerScrollSize, this.contentClientHeight);
    }

    return this.contentClientHeight;
  }

  /* istanbul ignore next */
  get scrollableOffset(): { left: number; top: number } {
    return getElementOffset(this.scrollableRef.current);
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
      'dx-scrollable dx-scrollable-renovated': true,
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
