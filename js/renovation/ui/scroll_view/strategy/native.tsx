import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  Mutable,
  InternalState,
  ForwardRef,
} from '@devextreme-generator/declarations';
import '../../../../events/gesture/emitter.gesture.scroll';
import {
  subscribeToScrollEvent,
  subscribeToScrollInitEvent,
  subscribeToDXScrollEndEvent,
  subscribeToDXScrollMoveEvent,
  subscribeToDXScrollStopEvent,
} from '../../../utils/subscribe_to_event';
import { Widget } from '../../common/widget';

import { combineClasses } from '../../../utils/combine_classes';
import { getScrollLeftMax } from '../utils/get_scroll_left_max';
import { getBoundaryProps } from '../utils/get_boundary_props';
import { normalizeOffsetLeft } from '../utils/normalize_offset_left';
import {
  getElementOverflowX,
  getElementOverflowY,
} from '../utils/get_element_style';

import { DisposeEffectReturn, EffectReturn } from '../../../utils/effect_return';
import devices from '../../../../core/devices';
import { isDefined } from '../../../../core/utils/type';

import { TopPocket } from '../internal/pocket/top';
import { BottomPocket } from '../internal/pocket/bottom';

import {
  ScrollEventArgs,
  ScrollOffset, ScrollableDirection, DxMouseEvent,
  DxMouseWheelEvent,
} from '../common/types';

import { isDxMouseWheelEvent } from '../../../../events/utils/index';

import {
  ScrollDirection,
} from '../utils/scroll_direction';

import {
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_WRAPPER_CLASS,
  SCROLLVIEW_CONTENT_CLASS,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBAR_SIMULATED,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  TopPocketState,
} from '../common/consts';

import { Scrollbar } from '../scrollbar/scrollbar';
import { isElementVisible } from '../utils/is_element_visible';
import { ScrollableNativeProps } from '../common/native_strategy_props';
import { allowedDirection } from '../utils/get_allowed_direction';
import { getScrollTopMax } from '../utils/get_scroll_top_max';
import { subscribeToResize } from '../utils/subscribe_to_resize';

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, topPocketRef, bottomPocketRef, direction,
    hScrollbarRef, vScrollbarRef,
    contentWidth, containerClientWidth, contentHeight, containerClientHeight, scrolling,
    scrollableRef, isLoadPanelVisible, topPocketState,
    pullDownTranslateTop, pullDownIconAngle, pullDownOpacity,
    topPocketHeight, contentStyles, scrollViewContentRef, contentTranslateTop,
    hScrollLocation, vScrollLocation, vScrollOffsetMax, hScrollOffsetMax,
    props: {
      aria, disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needRenderScrollbars,
      pullingDownText, pulledDownText, refreshingText, reachBottomText, refreshStrategy,
      pullDownEnabled, reachBottomEnabled, showScrollbar,
      useSimulatedScrollbar,
      loadPanelTemplate: LoadPanelTemplate,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      aria={aria}
      addWidgetClass={false}
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS} ref={wrapperRef}>
        <div className={SCROLLABLE_CONTAINER_CLASS} ref={containerRef}>
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef}>
            {forceGeneratePockets && (
            <TopPocket
              topPocketRef={topPocketRef}
              pullingDownText={pullingDownText}
              pulledDownText={pulledDownText}
              refreshingText={refreshingText}
              pocketState={topPocketState}
              refreshStrategy={refreshStrategy}
              pullDownTranslateTop={pullDownTranslateTop}
              pullDownIconAngle={pullDownIconAngle}
              topPocketTranslateTop={contentTranslateTop}
              pullDownOpacity={pullDownOpacity}
              pocketTop={topPocketHeight}
              visible={!!pullDownEnabled}
            />
            )}
            {needScrollViewContentWrapper
              ? (
                <div
                  className={SCROLLVIEW_CONTENT_CLASS}
                  ref={scrollViewContentRef}
                  style={contentStyles}
                >
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
        </div>
      </div>
      { LoadPanelTemplate && (
      <LoadPanelTemplate
        targetElement={scrollableRef}
        refreshingText={refreshingText}
        visible={isLoadPanelVisible}
      />
      )}
      { needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isHorizontal && (
        <Scrollbar
          direction="horizontal"
          showScrollbar="onScroll"
          ref={hScrollbarRef}
          contentSize={contentWidth}
          containerSize={containerClientWidth}
          maxOffset={hScrollOffsetMax}
          scrollLocation={hScrollLocation}
          visible={scrolling}
        />
      )}
      { needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isVertical && (
        <Scrollbar
          direction="vertical"
          showScrollbar="onScroll"
          ref={vScrollbarRef}
          contentSize={contentHeight}
          containerSize={containerClientHeight}
          maxOffset={vScrollOffsetMax}
          scrollLocation={vScrollLocation}
          visible={scrolling}
        />
      )}
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ScrollableNative extends JSXComponent<ScrollableNativeProps>() {
  @ForwardRef() scrollableRef!: RefObject<HTMLDivElement>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() vScrollbarRef!: RefObject<Scrollbar>;

  @Ref() hScrollbarRef!: RefObject<Scrollbar>;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() contentScrollWidth = 0;

  @InternalState() contentScrollHeight = 0;

  @InternalState() topPocketHeight = 0;

  @InternalState() bottomPocketHeight = 0;

  @InternalState() scrolling = false;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @InternalState() pullDownTranslateTop = 0;

  @InternalState() pullDownIconAngle = 0;

  @InternalState() pullDownOpacity = 0;

  @InternalState() contentTranslateTop = 0;

  @InternalState() vScrollLocation = 0;

  @InternalState() hScrollLocation = 0;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() hideScrollbarTimer?: unknown;

  @Mutable() releaseTimer?: unknown;

  @Mutable() refreshTimer?: unknown;

  @Mutable() eventForUserAction?: DxMouseEvent;

  @Mutable() initPageY = 0;

  @Mutable() deltaY = 0;

  @Mutable() locationTop = 0;

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
    this.setPocketState(TopPocketState.STATE_READY);

    this.startLoading();
    this.onPullDown();
  }

  @Method()
  release(): void {
    this.clearReleaseTimer();

    if (this.isPullDownStrategy) {
      if (this.topPocketState === TopPocketState.STATE_LOADING) {
        this.setPocketState(TopPocketState.STATE_RELEASED);
      }
    }

    this.releaseTimer = setTimeout(() => {
      if (this.isPullDownStrategy) {
        this.contentTranslateTop = 0;
      }
      this.stateReleased();
      this.onRelease();
    }, this.isSwipeDownStrategy ? 800 : 400);
  }

  @Effect({ run: 'once' })
  disposeReleaseTimer(): DisposeEffectReturn {
    return (): void => this.clearReleaseTimer();
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
    return {
      top: this.scrollTop(),
      left: this.scrollLeft(),
    };
  }

  @Method()
  scrollTop(): number {
    return this.containerRef.current!.scrollTop;
  }

  @Method()
  scrollLeft(): number {
    const containerEl = this.containerRef.current!;
    const scrollLeftMax = getScrollLeftMax(containerEl);

    return normalizeOffsetLeft(containerEl.scrollLeft, scrollLeftMax, !!this.props.rtlEnabled);
  }

  @Method()
  clientHeight(): number {
    return this.containerRef.current!.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerRef.current!.clientWidth;
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerRef.current,
      (event: DxMouseEvent) => {
        this.handleScroll(event);
      });
  }

  @Effect() effectDisabledState(): void {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  }

  @Effect() resetInactiveOffsetToInitial(): void {
    if (this.props.direction === DIRECTION_BOTH) {
      return;
    }

    this.containerRef.current![this.fullScrollInactiveProp] = 0;
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
      () => { this.handleEnd(); },
    );
  }

  @Effect()
  stopEffect(): EffectReturn {
    return subscribeToDXScrollStopEvent(
      this.wrapperRef.current,
      () => { this.handleStop(); },
    );
  }

  @Effect({ run: 'once' })
  disposeRefreshTimer(): DisposeEffectReturn {
    return (): void => this.clearRefreshTimer();
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
    if (this.props.disabled || (isDxMouseWheelEvent(event)
    && this.isScrollingOutOfBound(event as DxMouseWheelEvent))) {
      return false;
    }

    return isDefined(this.tryGetAllowedDirection());
  }

  @Method()
  updateHandler(): void {
    this.updateElementDimensions();
    this.onUpdated();
  }

  // if delete this effect we need to wait changing size inside resizeObservable
  // it needs for support qunit tests
  @Effect({ run: 'once' }) updateDimensions(): void {
    this.updateElementDimensions();
  }

  @Effect({ run: 'once' })
  subscribeContainerToResize(): EffectReturn {
    return subscribeToResize(
      this.containerRef.current,
      (element: HTMLDivElement) => { this.setContainerDimensions(element); },
    );
  }

  @Effect({ run: 'once' })
  subscribeContentToResize(): EffectReturn {
    return subscribeToResize(
      this.content(),
      (element: HTMLDivElement) => {
        this.setContentHeight(element);
        this.setContentWidth(element);
      },
    );
  }

  @Method()
  scrollByLocation(location: ScrollOffset): void {
    const containerEl = this.containerRef.current!;

    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }
    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += location.left;
    }
  }

  clearReleaseTimer(): void {
    clearTimeout(this.releaseTimer as number);
    this.releaseTimer = undefined;
  }

  onRelease(): void {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    // this.updateHandler();
  }

  onUpdated(): void {
    this.props.onUpdated?.(this.getEventArgs());
  }

  startLoading(): void {
    if (this.loadingIndicatorEnabled && isElementVisible(this.scrollableRef.current)) {
      this.isLoadPanelVisible = true;
    }
    this.lock();
  }

  finishLoading(): void {
    this.isLoadPanelVisible = false;
    this.unlock();
  }

  setPocketState(newState: number): void {
    this.topPocketState = newState;
  }

  handleScroll(event: DxMouseEvent): void {
    this.eventForUserAction = event;

    if (this.props.useSimulatedScrollbar) {
      this.scrolling = true;
      this.syncScrollbarsWithContent();
      this.scrolling = false;
    }

    this.props.onScroll?.(this.getEventArgs());
    this.handlePocketState();
  }

  handlePocketState(): void {
    if (this.props.forceGeneratePockets) {
      if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
        return;
      }

      const { scrollTop } = this.containerRef.current!;
      const scrollDelta = this.locationTop + scrollTop;

      this.locationTop = -scrollTop;

      if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
        this.onReachBottom();
        return;
      }

      if (this.isPullDownStrategy) {
        if (this.pulledDown()) {
          this.pullDownReady();
          return;
        }

        if (scrollDelta > 0 && this.isReachBottom()) {
          if (this.topPocketState !== TopPocketState.STATE_LOADING) {
            this.setPocketState(TopPocketState.STATE_LOADING);
            this.onReachBottom();
          }
          return;
        }
      }

      this.stateReleased();
    }
  }

  pullDownReady(): void {
    if (this.topPocketState === TopPocketState.STATE_READY) {
      return;
    }
    this.setPocketState(TopPocketState.STATE_READY);
  }

  onReachBottom(): void {
    this.props.onReachBottom?.({});
  }

  onPullDown(): void {
    this.props.onPullDown?.({});
  }

  stateReleased(): void {
    if (this.topPocketState === TopPocketState.STATE_RELEASED) {
      return;
    }

    this.releaseState();
  }

  getEventArgs(): ScrollEventArgs {
    const scrollOffset = this.scrollOffset();

    return {
      event: this.eventForUserAction,
      scrollOffset,
      ...getBoundaryProps(this.props.direction, scrollOffset, this.containerRef.current!),
    };
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

  updateElementDimensions(): void {
    this.setContentHeight(this.content());
    this.setContentWidth(this.content());
    this.setContainerDimensions(this.containerRef.current!);
  }

  setContainerDimensions(containerEl: HTMLDivElement): void {
    this.containerClientWidth = containerEl.clientWidth;
    this.containerClientHeight = containerEl.clientHeight;
  }

  setContentHeight(contentEl: HTMLDivElement): void {
    this.contentClientHeight = contentEl.clientHeight;
    this.contentScrollHeight = contentEl.scrollHeight;

    if (this.props.forceGeneratePockets) {
      this.topPocketHeight = this.topPocketRef?.current!.clientHeight || 0; // ?. for angular
      this.bottomPocketHeight = this.bottomPocketRef?.current!.clientHeight || 0; // ?. for angular
    }
  }

  setContentWidth(contentEl: HTMLDivElement): void {
    this.contentClientWidth = contentEl.clientWidth;
    this.contentScrollWidth = contentEl.scrollWidth;
  }

  syncScrollbarsWithContent(): void {
    const { top, left } = this.scrollOffset();

    this.hScrollLocation = -left;
    this.vScrollLocation = -top;
  }

  getInitEventData(): {
    getDirection: () => ScrollableDirection | undefined;
    validate: (event: DxMouseEvent) => boolean;
    isNative: boolean;
    scrollTarget: HTMLDivElement | null;
  } {
    return {
      getDirection: (): ScrollableDirection | undefined => this.tryGetAllowedDirection(),
      validate: (event: DxMouseEvent): boolean => this.validate(event),
      isNative: true,
      scrollTarget: this.containerRef.current,
    };
  }

  handleInit(event: DxMouseEvent): void {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      const { scrollTop } = this.containerRef.current!;

      if (this.topPocketState === TopPocketState.STATE_RELEASED && scrollTop === 0) {
        this.initPageY = event.originalEvent.pageY;
        this.setPocketState(TopPocketState.STATE_TOUCHED);
      }
    }
  }

  handleMove(e: DxMouseEvent): void {
    if (this.locked) {
      e.cancel = true;
      return;
    }

    if (isDefined(this.tryGetAllowedDirection())) {
      // eslint-disable-next-line
      (e.originalEvent as any).isScrollingEvent = true;
    }

    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.deltaY = e.originalEvent.pageY - this.initPageY;

      if (this.topPocketState === TopPocketState.STATE_TOUCHED) {
        if (this.pullDownEnabled && this.deltaY > 0) {
          this.setPocketState(TopPocketState.STATE_PULLED);
        } else {
          this.complete();
        }
      }

      if (this.topPocketState === TopPocketState.STATE_PULLED) {
        e.preventDefault();
        this.movePullDown();
      }
    }
  }

  handleEnd(): void {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        if (this.isSwipeDown()) {
          this.pullDownRefreshing();
        }

        this.complete();
      }

      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }

  handleStop(): void {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        this.complete();
      }

      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  }

  pullDownComplete(): void {
    if (this.topPocketState === TopPocketState.STATE_READY) {
      this.contentTranslateTop = this.topPocketHeight;
      this.clearRefreshTimer();
      this.refreshTimer = setTimeout(() => {
        this.pullDownRefreshing();
      }, 400);
    }
  }

  clearRefreshTimer(): void {
    clearTimeout(this.refreshTimer as number);
    this.refreshTimer = undefined;
  }

  pullDownRefreshing(): void {
    if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
      return;
    }
    this.setPocketState(TopPocketState.STATE_REFRESHING);

    if (this.isSwipeDownStrategy) {
      this.pullDownTranslateTop = this.getPullDownHeight();
    }

    this.onPullDown();
  }

  movePullDown(): void {
    const pullDownHeight = this.getPullDownHeight();
    const top = Math.min(pullDownHeight * 3, this.deltaY + this.getPullDownStartPosition());
    const angle = (180 * top) / pullDownHeight / 3;

    this.pullDownOpacity = 1;
    this.pullDownTranslateTop = top;
    this.pullDownIconAngle = angle;
  }

  getPullDownHeight(): number {
    return Math.round(this.scrollableRef.current!.offsetHeight * 0.05);
  }

  getPullDownStartPosition(): number {
    return -Math.round(this.topPocketHeight * 1.5);
  }

  complete(): void {
    if (this.topPocketState === TopPocketState.STATE_TOUCHED
      || this.topPocketState === TopPocketState.STATE_PULLED) {
      this.releaseState();
    }
  }

  releaseState(): void {
    this.setPocketState(TopPocketState.STATE_RELEASED);
    this.pullDownOpacity = 0;
  }

  get isSwipeDownStrategy(): boolean {
    return this.props.refreshStrategy === 'swipeDown';
  }

  get isPullDownStrategy(): boolean {
    return this.props.refreshStrategy === 'pullDown';
  }

  isSwipeDown(): boolean {
    return this.pullDownEnabled
      && this.topPocketState === TopPocketState.STATE_PULLED
      && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  }

  pulledDown(): boolean {
    const { scrollTop } = this.containerRef.current!;

    return this.pullDownEnabled && scrollTop <= -this.topPocketHeight;
  }

  isReachBottom(): boolean {
    const { scrollTop } = this.containerRef.current!;

    // T1032842;
    return this.props.reachBottomEnabled
      && Math.round(-scrollTop - this.vScrollOffsetMax) <= 1;
  }

  tryGetAllowedDirection(): ScrollableDirection | undefined {
    const containerEl = this.containerRef.current!;

    return allowedDirection(
      this.props.direction, getScrollTopMax(containerEl), getScrollLeftMax(containerEl), false,
    );
  }

  isLocked(): boolean {
    return this.locked;
  }

  isScrollingOutOfBound(event: DxMouseWheelEvent): boolean {
    const { delta, shiftKey } = event;
    const {
      scrollLeft, scrollTop, scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = this.containerRef.current!;

    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }

    return shiftKey
      ? clientWidth >= scrollWidth - scrollLeft
      : clientHeight >= scrollHeight - scrollTop;
  }

  get cssClasses(): string {
    const {
      direction, classes, disabled, showScrollbar,
    } = this.props;

    const classesMap = {
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${devices.real().platform}`]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar !== 'never' && this.props.useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: showScrollbar === 'never',
      [String(classes)]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean } {
    return new ScrollDirection(this.props.direction);
  }

  get pullDownEnabled(): boolean {
    return this.props.pullDownEnabled && devices.real().platform !== 'generic';
  }

  get contentStyles(): { transform: string } | undefined {
    if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
      return {
        transform: `translate(0px, ${this.contentTranslateTop}px)`,
      };
    }

    return undefined;
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

  get hScrollOffsetMax(): number {
    return -Math.max(this.contentWidth - this.containerClientWidth, 0);
  }

  get vScrollOffsetMax(): number {
    return -Math.max(this.contentHeight - this.containerClientHeight, 0);
  }
}
