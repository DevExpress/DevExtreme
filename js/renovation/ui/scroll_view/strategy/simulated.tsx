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
  subscribeToMouseEnterEvent,
  subscribeToMouseLeaveEvent,
  subscribeToDXPointerDownEvent,
  subscribeToDXPointerUpEvent,
} from '../../../utils/subscribe_to_event';

import { AnimatedScrollbar } from '../scrollbar/animated_scrollbar';
import { Widget } from '../../common/widget';
import { combineClasses } from '../../../utils/combine_classes';
import { getOffsetDistance } from '../utils/get_offset_distance';
import { getBoundaryProps } from '../utils/get_boundary_props';
import { permissibleWheelDirection } from '../utils/get_permissible_wheel_direction';

import { DisposeEffectReturn, EffectReturn } from '../../../utils/effect_return';
import {
  isDxMouseWheelEvent, normalizeKeyName, isCommandKeyPressed,
} from '../../../../events/utils/index';
import { isDefined } from '../../../../core/utils/type';
import { ScrollableSimulatedProps } from '../common/simulated_strategy_props';
import eventsEngine from '../../../../events/core/events_engine';
import { inRange } from '../../../../core/utils/math';

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
  KEY_CODES,
  VALIDATE_WHEEL_TIMEOUT,
  TopPocketState,
  DIRECTION_BOTH,
} from '../common/consts';

import {
  ScrollOffset,
  ScrollEventArgs,
  ScrollableDirection,
  DxMouseEvent,
  DxMouseWheelEvent,
  DxKeyboardEvent,
  ScrollLocationChangeArgs,
} from '../common/types';

import { getElementOffset } from '../../../utils/get_element_offset';
import {
  getElementPadding,
  getElementOverflowX,
  getElementOverflowY,
} from '../utils/get_element_style';

import { TopPocket } from '../internal/pocket/top';
import { BottomPocket } from '../internal/pocket/bottom';

import { getDevicePixelRatio } from '../utils/get_device_pixel_ratio';
import { isElementVisible } from '../utils/is_element_visible';
import { allowedDirection } from '../utils/get_allowed_direction';
import { subscribeToResize } from '../utils/subscribe_to_resize';
import domAdapter from '../../../../core/dom_adapter';
import { getScrollLeftMax } from '../utils/get_scroll_left_max';

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, handleKeyDown,
    hScrollbarRef, vScrollbarRef,
    topPocketRef, bottomPocketRef, bottomPocketHeight,
    hovered, pulledDown, scrollLocationChange,
    containerHasSizes, contentWidth, containerClientWidth, contentHeight, containerClientHeight,
    scrollableRef, contentStyles, containerStyles, onBounce, onScroll,
    onReachBottom, onPullDown, onEnd, direction, topPocketState,
    isLoadPanelVisible, scrollViewContentRef,
    vScrollLocation, hScrollLocation, contentPaddingBottom, active,
    onVisibilityChangeHandler, scrolling, lock, unlock,
    hScrollOffsetMax, vScrollOffsetMax, vScrollOffsetMin,
    props: {
      aria, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needRenderScrollbars,
      showScrollbar, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText, useKeyboard, bounceEnabled, inertiaEnabled,
      pullDownEnabled, reachBottomEnabled, refreshStrategy,
      loadPanelTemplate: LoadPanelTemplate,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      focusStateEnabled={useKeyboard}
      aria={aria}
      addWidgetClass={false}
      classes={cssClasses}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      // onVisibilityChange uses for date_view_roller purposes only
      onVisibilityChange={onVisibilityChangeHandler}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
      // onKeyDown exist in restAttributes and has undefined value
      onKeyDown={handleKeyDown}
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
              refreshStrategy={refreshStrategy}
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
              visible={hovered || scrolling || active}
              minOffset={0}
              maxOffset={hScrollOffsetMax}
              scrollLocation={hScrollLocation}
              scrollLocationChange={scrollLocationChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onScroll={onScroll}
              onEnd={onEnd}
              containerHasSizes={containerHasSizes}

              rtlEnabled={rtlEnabled}

              onLock={lock}
              onUnlock={unlock}
            />
          )}
          {needRenderScrollbars && direction.isVertical && (
            <AnimatedScrollbar
              direction="vertical"
              ref={vScrollbarRef}
              contentSize={contentHeight}
              containerSize={containerClientHeight}
              visible={hovered || scrolling || active}
              minOffset={vScrollOffsetMin}
              maxOffset={vScrollOffsetMax}
              scrollLocation={vScrollLocation}
              scrollLocationChange={scrollLocationChange}
              scrollByThumb={scrollByThumb}
              bounceEnabled={bounceEnabled}
              showScrollbar={showScrollbar}
              inertiaEnabled={inertiaEnabled}
              onBounce={onBounce}
              onScroll={onScroll}
              onEnd={onEnd}
              containerHasSizes={containerHasSizes}

              forceGeneratePockets={forceGeneratePockets}
              bottomPocketSize={bottomPocketHeight}
              contentPaddingBottom={contentPaddingBottom}
              pulledDown={pulledDown}
              onPullDown={onPullDown}
              onReachBottom={onReachBottom}
              reachBottomEnabled={reachBottomEnabled}

              onLock={lock}
              onUnlock={unlock}
            />
          )}
        </div>
      </div>
      { LoadPanelTemplate && (
      <LoadPanelTemplate
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
  @ForwardRef() scrollableRef!: RefObject<HTMLDivElement>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() vScrollbarRef!: RefObject<AnimatedScrollbar>;

  @Ref() hScrollbarRef!: RefObject<AnimatedScrollbar>;

  @InternalState() active = false;

  @InternalState() hovered = false;

  @InternalState() scrolling = false;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentScrollWidth = 0;

  @InternalState() contentScrollHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() contentPaddingBottom = 0;

  @InternalState() topPocketHeight = 0;

  @InternalState() bottomPocketHeight = 0;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @InternalState() vScrollLocation = 0;

  @InternalState() hScrollLocation = 0;

  @InternalState() pendingScrollEvent = false;

  @Mutable() prevDirection = 'initial';

  @Mutable() validateWheelTimer?: unknown;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() eventForUserAction?: DxMouseEvent;

  @Mutable() validDirections: { horizontal?: boolean; vertical?: boolean } = {};

  @Mutable()
  endActionDirections:
  { horizontal: boolean; vertical: boolean } = { horizontal: false, vertical: false };

  @Mutable() savedScrollOffset:
  { scrollTop: number; scrollLeft: number } = { scrollTop: 0, scrollLeft: 0 };

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
    this.onRelease();

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
    const { scrollTop, scrollLeft } = this.savedScrollOffset;

    return {
      top: this.vScrollOffsetMax === 0 ? 0 : scrollTop,
      left: this.hScrollOffsetMax === 0 ? 0 : scrollLeft,
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
  startEffect(): EffectReturn {
    return subscribeToDXScrollStartEvent(
      this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleStart(event);
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

  @Effect({ run: 'once' })
  pointerDownEffect(): EffectReturn {
    return subscribeToDXPointerDownEvent(
      this.wrapperRef.current, () => {
        this.active = true;
      },
    );
  }

  @Effect({ run: 'once' })
  pointerUpEffect(): EffectReturn {
    return subscribeToDXPointerUpEvent(
      domAdapter.getDocument(), () => {
        this.active = false;
      },
    );
  }

  @Effect()
  mouseEnterEffect(): EffectReturn {
    if (this.isHoverable) {
      return subscribeToMouseEnterEvent(
        this.scrollableRef.current, () => {
          this.hovered = true;
        },
      );
    }

    return undefined;
  }

  @Effect()
  mouseLeaveEffect(): EffectReturn {
    if (this.isHoverable) {
      return subscribeToMouseLeaveEvent(
        this.scrollableRef.current, () => {
          this.hovered = false;
        },
      );
    }

    return undefined;
  }

  @Method()
  validate(event: DxMouseEvent): boolean {
    if (this.isLocked()) {
      return false;
    }

    // this.updateHandler();

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
      && this.topPocketHeight > 0 // topPocket was initialized
      && (this.vScrollLocation - this.topPocketHeight) >= 0;
  }

  @Effect({ run: 'once' })
  subscribeTopPocketToResize(): EffectReturn {
    return subscribeToResize(
      this.topPocketRef?.current, // ?. for angular
      (element: HTMLDivElement) => { this.setTopPocketDimensions(element); },
    );
  }

  @Effect({ run: 'once' })
  subscribeBottomPocketToResize(): EffectReturn {
    return subscribeToResize(
      this.bottomPocketRef?.current, // ?. for angular
      (element: HTMLDivElement) => { this.setBottomPocketDimensions(element); },
    );
  }

  @Effect({ run: 'once' })
  subscribeContainerToResize(): EffectReturn {
    return subscribeToResize(
      this.containerRef.current,
      (element: HTMLDivElement) => {
        this.setContainerDimensions(element);
      },
    );
  }

  @Effect({ run: 'once' })
  subscribeToResizeContent(): EffectReturn {
    if (this.props.needScrollViewContentWrapper) {
      const unsubscribeHeightResize = subscribeToResize(
        this.content(),
        (element: HTMLDivElement) => { this.setContentHeight(element); },
      );

      const unsubscribeWidthResize = subscribeToResize(
        this.contentRef.current,
        (element: HTMLDivElement) => { this.setContentWidth(element); },
      );

      /* istanbul ignore next */
      return (): void => {
        unsubscribeHeightResize?.();
        unsubscribeWidthResize?.();
      };
    }

    return subscribeToResize(
      this.contentRef.current,
      (element: HTMLDivElement) => {
        this.setContentHeight(element);
        this.setContentWidth(element);
      },
    );
  }

  // if delete this effect we need to wait changing size inside resizeObservable
  // it needs for support qunit tests
  @Effect({ run: 'once' }) updateDimensions(): void {
    this.updateElementDimensions();
  }

  @Effect() triggerScrollEvent(): void {
    if (this.pendingScrollEvent) {
      this.pendingScrollEvent = false;
      eventsEngine.triggerHandler(this.containerRef.current, { type: 'scroll' });
    }
  }

  @Effect() resetInactiveOffsetToInitial(): void {
    if (this.direction.isBoth) {
      this.prevDirection = this.props.direction;
      return;
    }

    const maxScrollOffset = getScrollLeftMax(this.containerRef.current!);
    const needResetInactiveOffset = this.prevDirection !== this.props.direction && maxScrollOffset;

    if (!needResetInactiveOffset) {
      return;
    }

    this.prevDirection = this.props.direction;

    const inactiveScrollProp = !this.direction.isVertical ? 'scrollTop' : 'scrollLeft';
    const location = this.props.rtlEnabled && inactiveScrollProp === 'scrollLeft'
      ? maxScrollOffset
      : 0;

    this.scrollLocationChange({
      fullScrollProp: inactiveScrollProp,
      // set default content position
      location,
    });
  }

  @Method()
  scrollByLocation(location: ScrollOffset): void {
    this.updateHandler();

    this.scrolling = true;
    this.prepareDirections(true);
    this.onStart();

    const { scrollLeft, scrollTop } = this.containerRef.current!;
    const { top, left } = location;

    this.hScrollbarRef.current?.scrollTo(scrollLeft + left, true);
    this.vScrollbarRef.current?.scrollTo(scrollTop + top, true);

    this.scrolling = false;
  }

  handleScroll(): void {
    if (!this.scrolling) {
      this.syncScrollbarsWithContent();
    }

    this.props.onScroll?.(this.getEventArgs());
  }

  syncScrollbarsWithContent(): void {
    const { scrollLeft, scrollTop } = this.containerRef.current!;

    this.vScrollbarRef.current?.scrollTo(scrollTop, false);
    if (!this.props.rtlEnabled) { // TODO: support native rtl mode // require for Qunit test
      this.hScrollbarRef.current?.scrollTo(scrollLeft, false);
    }
  }

  startLoading(): void {
    if (this.loadingIndicatorEnabled && isElementVisible(this.containerRef.current)) {
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
        this.topPocketHeight,
      ),
    };
  }

  getInitEventData(): {
    getDirection: (event: DxMouseWheelEvent) => ScrollableDirection | undefined;
    validate: (event: DxMouseEvent) => boolean;
    isNative: boolean;
    scrollTarget: HTMLDivElement | null;
  } {
    return {
      getDirection: (
        event: DxMouseWheelEvent,
      ): ScrollableDirection | undefined => this.tryGetAllowedDirection(event),
      validate: (event: DxMouseEvent): boolean => this.validate(event),
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
        this.restoreEndActionDirections();

        this.scrolling = false;
        this.props.onEnd?.(this.getEventArgs());
      }
    } else {
      this.scrolling = false;
      this.props.onEnd?.(this.getEventArgs());
    }
  }

  restoreEndActionDirections(): void {
    this.endActionDirections[DIRECTION_HORIZONTAL] = false;
    this.endActionDirections[DIRECTION_VERTICAL] = false;
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
    // this.updateHandler();

    // the resizeObserver handler calls too late
    // in case when List visibility was changed
    this.updateElementDimensions();
  }

  onReachBottom(): void {
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    this.props.onReachBottom?.({});
  }

  scrollLocationChange(eventData: ScrollLocationChangeArgs): void {
    if (!isElementVisible(this.containerRef.current)) {
      return;
    }

    const { fullScrollProp, location } = eventData;

    this.containerRef.current![fullScrollProp] = location;

    if (fullScrollProp === 'scrollLeft') {
      this.hScrollLocation = -location;
    } else {
      this.vScrollLocation = -location;
    }

    this.savedScrollOffset[fullScrollProp] = location;
  }

  get hScrollOffsetMax(): number {
    return -Math.max(this.contentWidth - this.containerClientWidth, 0);
  }

  get vScrollOffsetMax(): number {
    return -Math.max(this.contentHeight - this.containerClientHeight, 0);
  }

  get vScrollOffsetMin(): number {
    return this.pulledDown && this.topPocketState !== TopPocketState.STATE_RELEASED
      ? this.topPocketHeight
      : 0;
  }

  onScroll(): void {
    this.pendingScrollEvent = true;
  }

  handleInit(event: DxMouseEvent): void {
    this.suppressDirections(event);
    this.restoreEndActionDirections();

    this.eventForUserAction = event;

    const crossThumbScrolling = this.isCrossThumbScrolling(event);

    const { left, top } = getElementOffset(this.scrollableRef.current);
    this.hScrollbarRef.current?.initHandler(event, crossThumbScrolling, left);
    this.vScrollbarRef.current?.initHandler(event, crossThumbScrolling, top);
  }

  handleStart(event: DxMouseEvent): void {
    this.scrolling = true;
    this.eventForUserAction = event;

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

    const isDxMouseWheel = isDxMouseWheelEvent(e.originalEvent);
    this.hScrollbarRef.current?.moveHandler(e.delta.x, isDxMouseWheel);
    this.vScrollbarRef.current?.moveHandler(e.delta.y, isDxMouseWheel);
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
    return isDxMouseWheelEvent(event)
      ? permissibleWheelDirection(this.props.direction, event.shiftKey)
      : this.permissibleDirection;
  }

  isLocked(): boolean {
    return this.locked;
  }

  validateWheel(event: DxMouseWheelEvent): boolean {
    const scrollbar = permissibleWheelDirection(
      this.props.direction, event.shiftKey,
    ) === DIRECTION_HORIZONTAL
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

    return isDefined(this.permissibleDirection);
  }

  handleKeyDown(event: DxKeyboardEvent): void {
    if (this.scrolling) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
      return;
    }

    const isKeySupported = Object.values(KEY_CODES).includes(normalizeKeyName(event) as string);

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

  scrollByLine(lines: { left: number; top: number }): void {
    const scrollOffset = Math.abs((SCROLL_LINE_HEIGHT / getDevicePixelRatio()) * 100) / 100;

    this.scrollByLocation({
      top: lines.top * scrollOffset,
      left: lines.left * scrollOffset,
    });
  }

  scrollByPage(page: number): void {
    const distance = { left: 0, top: 0 };
    const { clientHeight, clientWidth } = this.containerRef.current!;

    if (permissibleWheelDirection(this.props.direction, false) === DIRECTION_VERTICAL) {
      distance.top = page * clientHeight;
    } else {
      distance.left = page * clientWidth;
    }

    this.scrollByLocation(distance);
  }

  scrollByKey(key: string): void {
    const { scrollTop, scrollLeft } = this.containerRef.current!;

    const vOffsetMin = 0;
    const hOffsetMin = 0;
    const vOffsetMax = -this.vScrollOffsetMax + this.bottomPocketHeight + this.contentPaddingBottom;
    const hOffsetMax = -this.hScrollOffsetMax;

    const offset = getOffsetDistance(
      key === KEY_CODES.HOME
        ? { top: vOffsetMin, left: this.props.rtlEnabled ? hOffsetMax : hOffsetMin }
        : { top: vOffsetMax, left: this.props.rtlEnabled ? hOffsetMin : hOffsetMax },
      { top: scrollTop, left: scrollLeft },
    );

    const direction = permissibleWheelDirection(this.props.direction, false);

    this.scrollByLocation(
      direction === DIRECTION_VERTICAL
        ? { top: offset.top, left: 0 }
        : { top: 0, left: offset.left },
    );
  }

  lock(): void {
    this.locked = true;
  }

  unlock(): void {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }

  // onVisibilityChangeHandler uses for date_view_roller purposes only
  onVisibilityChangeHandler(visible: boolean): void {
    if (visible) {
      // this.updateHandler();

      const { scrollTop, scrollLeft } = this.savedScrollOffset;
      // restore scrollLocation on second and next opening of popup with data_view rollers
      this.vScrollbarRef.current?.scrollTo(scrollTop, false);
      this.hScrollbarRef.current?.scrollTo(scrollLeft, false);
    }

    this.props.onVisibilityChange?.(visible);
  }

  updateElementDimensions(): void {
    if (this.props.forceGeneratePockets) {
      this.setTopPocketDimensions(this.topPocketRef.current!);
      this.setBottomPocketDimensions(this.bottomPocketRef.current!);
    }

    this.setContentWidth(this.contentRef.current!);
    this.setContentHeight(this.content());
    this.setContainerDimensions(this.containerRef.current!);
  }

  setTopPocketDimensions(topPocketEl: HTMLDivElement): void {
    this.topPocketHeight = this.props.forceGeneratePockets && this.props.pullDownEnabled
      ? topPocketEl.clientHeight
      : 0;
  }

  setBottomPocketDimensions(bottomPocketEl: HTMLDivElement): void {
    this.bottomPocketHeight = this.props.forceGeneratePockets && this.props.reachBottomEnabled
      ? bottomPocketEl.clientHeight
      : 0;
  }

  setContentHeight(contentEl: HTMLDivElement): void {
    if (isElementVisible(contentEl)) {
      this.contentClientHeight = contentEl.clientHeight;
      this.contentScrollHeight = contentEl.scrollHeight;

      this.contentPaddingBottom = getElementPadding(this.contentRef.current, 'bottom');
    }
  }

  setContentWidth(contentEl: HTMLDivElement): void {
    if (isElementVisible(contentEl)) {
      this.contentClientWidth = contentEl.clientWidth;
      this.contentScrollWidth = contentEl.scrollWidth;
    }
  }

  setContainerDimensions(containerEl: HTMLDivElement): void {
    if (isElementVisible(containerEl)) {
      this.containerClientHeight = containerEl.clientHeight;
      this.containerClientWidth = containerEl.clientWidth;
    }
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
      transform: `translate(${this.contentTranslateX}px, ${this.contentTranslateY}px)`,
    };
  }

  get contentTranslateY(): number {
    const location = this.vScrollLocation;
    let transformValue = location % 1;

    const maxOffset = this.vScrollOffsetMax
      - this.bottomPocketHeight - this.contentPaddingBottom;

    if (maxOffset >= 0) {
      return 0;
    }

    if (!this.props.bounceEnabled || inRange(this.vScrollLocation, maxOffset, 0)) {
      return -this.topPocketHeight;
    }

    if (location > 0) {
      transformValue = location;
    }
    if (location < maxOffset) {
      transformValue = location - maxOffset;
    }

    return transformValue - this.topPocketHeight;
  }

  get contentTranslateX(): number {
    // https://stackoverflow.com/questions/49219462/webkit-scrollleft-css-translate-horizontal-bug
    const location = this.hScrollLocation;
    let transformValue = location % 1;

    if (!this.props.bounceEnabled
      || this.hScrollOffsetMax === 0 || inRange(this.hScrollLocation, this.hScrollOffsetMax, 0)) {
      return 0;
    }

    if (location > 0) {
      transformValue = location;
    }
    if (location < this.hScrollOffsetMax) {
      transformValue = location - this.hScrollOffsetMax;
    }

    return transformValue;
  }

  get containerStyles(): { 'touchAction': string } | undefined {
    const direction = this.permissibleDirection;

    const vDirectionAllowed = direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH;
    const hDirectionAllowed = direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH;

    let touchDirection = vDirectionAllowed ? 'pan-x' : '';
    touchDirection = hDirectionAllowed ? 'pan-y' : touchDirection;
    touchDirection = vDirectionAllowed && hDirectionAllowed ? 'none' : touchDirection;

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

  get permissibleDirection(): ScrollableDirection | undefined {
    const { bounceEnabled } = this.props;

    return allowedDirection(
      this.props.direction, -this.vScrollOffsetMax, -this.hScrollOffsetMax, bounceEnabled,
    );
  }

  get isHoverable(): boolean {
    return !this.props.disabled && this.props.showScrollbar === 'onHover';
  }
}
