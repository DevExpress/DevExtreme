import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  ComponentBindings,
  Mutable,
  InternalState,
  ForwardRef, OneWay,
} from '@devextreme-generator/declarations';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget, WidgetProps } from '../common/widget';
import { ScrollViewLoadPanel } from './load_panel';

import { combineClasses } from '../../utils/combine_classes';
import { getScrollLeftMax } from './utils/get_scroll_left_max';
import { getAugmentedLocation } from './utils/get_augmented_location';
import { getBoundaryProps, isReachedBottom } from './utils/get_boundary_props';

import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import devices from '../../../core/devices';
import browser from '../../../core/utils/browser';
import { isDefined } from '../../../core/utils/type';
import { BaseWidgetProps } from '../common/base_props';
import {
  ScrollableProps,
} from './scrollable_props';
import { TopPocketProps, TopPocket } from './top_pocket';
import { BottomPocketProps, BottomPocket } from './bottom_pocket';
import { nativeScrolling } from '../../../core/utils/support';
import '../../../events/gesture/emitter.gesture.scroll';

import {
  ScrollEventArgs,
  ScrollOffset, ScrollableDirection, RefreshStrategy,
} from './types.d';

import { isDxMouseWheelEvent } from '../../../events/utils/index';

import {
  getScrollSign,
  getLocation,
  normalizeOffsetLeft,
} from './scrollable_utils';

import {
  ScrollDirection,
} from './utils/scroll_direction';

import {
  DIRECTION_VERTICAL,
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
} from './common/consts';

import { Scrollbar } from './scrollbar';

import {
  dxScrollInit,
  dxScrollMove,
  dxScrollEnd,
  dxScrollStop,
} from '../../../events/short';
import { getOffsetDistance } from './utils/get_offset_distance';

const HIDE_SCROLLBAR_TIMEOUT = 500;

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, topPocketRef, bottomPocketRef, direction,
    hScrollbarRef, vScrollbarRef,
    contentClientWidth, containerClientWidth, contentClientHeight, containerClientHeight,
    windowResizeHandler, needForceScrollbarsVisibility, useSimulatedScrollbar,
    scrollableRef, isLoadPanelVisible, topPocketState, refreshStrategy,
    pullDownTranslateTop, pullDownIconAngle, pullDownOpacity,
    topPocketTop, contentStyles, scrollViewContentRef, contentTranslateTop,
    hScrollLocation, vScrollLocation,
    props: {
      aria, disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      showScrollbar, scrollByThumb, pullingDownText,
      pulledDownText, refreshingText, reachBottomText,
      pullDownEnabled, reachBottomEnabled,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollableRef}
      aria={aria}
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      onDimensionChanged={windowResizeHandler}
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
              pocketTop={topPocketTop}
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
              : <div>{children}</div>}
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
      { needScrollViewLoadPanel && (
        <ScrollViewLoadPanel
          targetElement={scrollableRef}
          refreshingText={refreshingText}
          visible={isLoadPanelVisible}
        />
      )}
      { showScrollbar && useSimulatedScrollbar && direction.isHorizontal && (
        <Scrollbar
          direction="horizontal"
          ref={hScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientWidth}
          containerSize={containerClientWidth}
          scrollLocation={hScrollLocation}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
      { showScrollbar && useSimulatedScrollbar && direction.isVertical && (
        <Scrollbar
          direction="vertical"
          ref={vScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientHeight}
          containerSize={containerClientHeight}
          scrollLocation={vScrollLocation}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
    </Widget>
  );
};
@ComponentBindings()
export class ScrollableNativeProps extends ScrollableProps {
  @OneWay() useSimulatedScrollbar?: boolean;
}

export type ScrollableNativePropsType = ScrollableNativeProps
& Pick<WidgetProps, 'aria'>
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'onKeyDown' | 'visible' >
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ScrollableNative extends JSXComponent<ScrollableNativePropsType>() {
  @Ref() scrollableRef!: RefObject<HTMLDivElement>;

  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() scrollViewContentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() vScrollbarRef!: RefObject<Scrollbar>;

  @Ref() hScrollbarRef!: RefObject<Scrollbar>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() hideScrollbarTimeout?: any;

  @Mutable() releaseTimeout?: any;

  @Mutable() refreshTimeout?: any;

  @Mutable() eventForUserAction?: Event;

  @Mutable() initPageY = 0;

  @Mutable() deltaY = 0;

  @Mutable() lastLocation: { top: number; left: number } = { top: 0, left: 0 };

  @Mutable() locationTop = 0;

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() needForceScrollbarsVisibility = false;

  @InternalState() topPocketState = TopPocketState.STATE_RELEASED;

  @InternalState() isLoadPanelVisible = false;

  @InternalState() pullDownTranslateTop = 0;

  @InternalState() pullDownIconAngle = 0;

  @InternalState() pullDownOpacity = 0;

  @InternalState() topPocketTop = -80; // TODO: set default as topPocketClientHeight

  @InternalState() contentTranslateTop = 0;

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
  update(): void {
    if (!this.props.updateManually) {
      this.updateSizes();
      this.onUpdated();
    }
  }

  @Method()
  refresh(): void {
    this.topPocketState = TopPocketState.STATE_READY;

    this.startLoading();
    this.onPullDown();
  }

  @Method()
  release(): void {
    this.clearReleaseTimeout();

    if (this.isPullDownStrategy) {
      if (this.topPocketState === TopPocketState.STATE_LOADING) {
        this.topPocketState = TopPocketState.STATE_RELEASED;
      }
    }

    this.releaseTimeout = setTimeout((() => {
      if (this.isPullDownStrategy) {
        this.contentTranslateTop = 0;
      }
      this.stateReleased();
      this.onRelease();
    }), this.isSwipeDownStrategy ? 800 : 400);
  }

  clearReleaseTimeout(): void {
    clearTimeout(this.releaseTimeout);
    this.releaseTimeout = undefined;
  }

  @Effect({ run: 'once' })
  disposeReleaseTimeout(): DisposeEffectReturn {
    return (): void => this.clearReleaseTimeout();
  }

  onRelease(): void {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    this.onUpdated();
  }

  onUpdated(): void {
    this.props.onUpdated?.(this.getEventArgs());
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
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    const { direction } = this.props;
    const distance = getOffsetDistance(targetLocation, direction, this.scrollOffset());

    this.scrollBy(distance);
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    const location = getAugmentedLocation(distance);

    if (!location.top && !location.left) {
      return;
    }

    const containerEl = this.containerRef.current!;
    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }
    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * location.left;
    }
  }

  @Method()
  /* istanbul ignore next */
  scrollToElement(element: HTMLElement): void {
    if (!isDefined(element)) {
      return;
    }

    const { top, left } = this.scrollOffset();
    element.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    const distance = getOffsetDistance({ top, left }, this.props.direction, this.scrollOffset());

    const containerEl = this.containerRef.current!;
    if (!this.direction.isHorizontal) {
      containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * distance.left;
    }

    if (!this.direction.isVertical) {
      containerEl.scrollTop += distance.top;
    }
    // if (getClosestElement(element, `.${SCROLLABLE_CONTENT_CLASS}`)) {
    //   const top = this.getElementLocation(element, DIRECTION_VERTICAL, offset);
    //   const left = this.getElementLocation(element, DIRECTION_HORIZONTAL, offset);

    //   this.scrollTo({ top, left });
    // }
  }

  @Method()
  /* istanbul ignore next */
  getElementLocation(
    element: HTMLElement,
    direction: ScrollableDirection,
    offset?: Partial<Omit<ClientRect, 'width' | 'height'>>,
  ): number {
    const scrollOffset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      ...offset,
    };

    return getLocation(
      element,
      scrollOffset,
      direction,
      this.containerRef.current!,
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
    const { top, left } = this.scrollLocation();
    const scrollLeftMax = getScrollLeftMax(this.containerRef.current!);

    return {
      top,
      left: normalizeOffsetLeft(left, scrollLeftMax, !!this.props.rtlEnabled),
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

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerRef.current!,
      (e: Event) => {
        this.handleScroll(e);
      });
  }

  handleScroll(e: Event): void {
    // https://supportcenter.devexpress.com/internal/ticket/details/B250122
    // if (!this.isScrollLocationChanged()) { // TODO: need check it after renovation
    //   e.stopImmediatePropagation();
    //   return;
    // }

    this.eventForUserAction = e;
    if (this.useSimulatedScrollbar) {
      this.moveScrollbars();
    }

    this.props.onScroll?.(this.getEventArgs());
    this.lastLocation = this.scrollLocation();

    this.handlePocketState();
  }

  handlePocketState(): void {
    if (this.props.forceGeneratePockets) {
      if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
        return;
      }

      const currentLocation = -this.scrollLocation().top;
      const scrollDelta = this.locationTop - currentLocation;

      this.locationTop = currentLocation;

      if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
        this.onReachBottom();
        return;
      }

      if (this.isPullDownStrategy) {
        if (this.isPullDown()) {
          this.pullDownReady();
          return;
        }

        if (scrollDelta > 0 && this.isReachBottom()) {
          if (this.topPocketState !== TopPocketState.STATE_LOADING) {
            this.topPocketState = TopPocketState.STATE_LOADING;
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
    this.topPocketState = TopPocketState.STATE_READY;
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
      ...getBoundaryProps(this.props.direction, scrollOffset, this.containerRef.current!, 0),
    };
  }

  // isScrollLocationChanged(): boolean {
  //   const currentLocation = this.location();

  //   const isTopChanged = this.lastLocation.top !== -currentLocation.top;
  //   const isLeftChanged = this.lastLocation.left !== -currentLocation.left;

  //   return isTopChanged || isLeftChanged;
  // }

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
    this.updateSizes();
  }

  windowResizeHandler(): void { // update if simulatedScrollbars are using
    this.update();
  }

  updateSizes(): void {
    const containerEl = this.containerRef.current;
    const contentEl = this.contentRef.current;

    if (isDefined(containerEl)) {
      this.containerClientWidth = containerEl.clientWidth;
      this.containerClientHeight = containerEl.clientHeight;
    }

    if (isDefined(contentEl)) {
      this.contentClientWidth = contentEl.clientWidth;
      this.contentClientHeight = contentEl.clientHeight;
    }
  }

  moveScrollbars(): void {
    const { top, left } = this.scrollOffset();

    this.hScrollLocation = -left;
    this.vScrollLocation = -top;

    this.needForceScrollbarsVisibility = true;

    this.clearHideScrollbarTimeout();

    this.hideScrollbarTimeout = setTimeout(() => {
      this.needForceScrollbarsVisibility = false;
    }, HIDE_SCROLLBAR_TIMEOUT);
  }

  @Effect({ run: 'once' })
  disposeHideScrollbarTimeout(): DisposeEffectReturn {
    return (): void => this.clearHideScrollbarTimeout();
  }

  clearHideScrollbarTimeout(): void {
    clearTimeout(this.hideScrollbarTimeout);
    this.hideScrollbarTimeout = undefined;
  }

  scrollLocation(): { top: number; left: number } {
    return {
      top: this.containerRef.current!.scrollTop,
      left: this.containerRef.current!.scrollLeft,
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
      getDirection: this.tryGetAllowedDirection,
      validate: this.validate,
      isNative: true,
      scrollTarget: this.containerRef.current,
    };
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
      () => {
        this.handleEnd();
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

  handleInit(e): void {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      if (this.topPocketState === TopPocketState.STATE_RELEASED
        && this.scrollLocation().top === 0) {
        this.initPageY = e.originalEvent.pageY;
        this.topPocketState = TopPocketState.STATE_TOUCHED;
      }
    }
  }

  handleMove(e): void {
    if (this.locked) {
      e.cancel = true;
      return;
    }

    if (isDefined(this.tryGetAllowedDirection())) {
      e.originalEvent.isScrollingEvent = true;
    }

    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.deltaY = e.originalEvent.pageY - this.initPageY;

      if (this.topPocketState === TopPocketState.STATE_TOUCHED) {
        if (this.pullDownEnabled && this.deltaY > 0) {
          this.topPocketState = TopPocketState.STATE_PULLED;
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
      this.clearRefreshTimeout();
      this.refreshTimeout = setTimeout((() => {
        this.pullDownRefreshing();
      }), 400);
    }
  }

  clearRefreshTimeout(): void {
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = undefined;
  }

  @Effect({ run: 'once' })
  disposeRefreshTimeout(): DisposeEffectReturn {
    return (): void => this.clearRefreshTimeout();
  }

  get topPocketHeight(): number {
    return this.topPocketRef.current?.clientHeight || 0;
  }

  pullDownRefreshing(): void {
    if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
      return;
    }
    this.topPocketState = TopPocketState.STATE_REFRESHING;

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
    return -Math.round(this.topPocketRef.current!.clientHeight * 1.5);
  }

  complete(): void {
    if (this.topPocketState === TopPocketState.STATE_TOUCHED
      || this.topPocketState === TopPocketState.STATE_PULLED) {
      this.releaseState();
    }
  }

  releaseState(): void {
    this.topPocketState = TopPocketState.STATE_RELEASED;
    this.pullDownOpacity = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get refreshStrategy(): RefreshStrategy {
    return this.platform === 'android' ? 'swipeDown' : 'pullDown';
  }

  get isSwipeDownStrategy(): boolean {
    return this.refreshStrategy === 'swipeDown';
  }

  get isPullDownStrategy(): boolean {
    return this.refreshStrategy === 'pullDown';
  }

  isSwipeDown(): boolean {
    return this.pullDownEnabled
      && this.topPocketState === TopPocketState.STATE_PULLED
      && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  }

  isPullDown(): boolean {
    return this.pullDownEnabled && this.scrollLocation().top <= -this.topPocketHeight;
  }

  isReachBottom(): boolean {
    const { top } = this.scrollLocation();

    return this.props.reachBottomEnabled
      && isReachedBottom(this.containerRef.current!, top, this.bottomPocketHeight);
  }

  get bottomPocketHeight(): number {
    if (this.props.reachBottomEnabled && this.bottomPocketRef.current) {
      return this.bottomPocketRef.current.clientHeight;
    }

    return 0;
  }

  tryGetAllowedDirection(): ScrollableDirection | undefined {
    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.props.direction);

    const contentEl = this.contentRef.current;
    const containerEl = this.containerRef.current;

    const isOverflowVertical = (isVertical && contentEl!.clientHeight > containerEl!.clientHeight)
      || this.pullDownEnabled;
    const isOverflowHorizontal = (isHorizontal && contentEl!.clientWidth > containerEl!.clientWidth)
      || this.pullDownEnabled;

    if (isBoth && isOverflowVertical && isOverflowHorizontal) {
      return DIRECTION_BOTH;
    } if (isHorizontal && isOverflowHorizontal) {
      return DIRECTION_HORIZONTAL;
    } if (isVertical && isOverflowVertical) {
      return DIRECTION_VERTICAL;
    }
    return undefined;
  }

  @Method()
  validate(e: Event): boolean {
    const { disabled } = this.props;

    if (this.isLocked()) {
      return false;
    }

    this.update();

    if (disabled || (isDxMouseWheelEvent(e) && this.isScrollingOutOfBound(e))) {
      return false;
    }

    return isDefined(this.tryGetAllowedDirection());
  }

  isLocked(): boolean {
    return this.locked;
  }

  isScrollingOutOfBound(e: Event): boolean {
    const { delta, shiftKey } = e as any;
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
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${this.platform} dx-scrollable-renovated`]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar && this.useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }

  // eslint-disable-next-line class-methods-use-this
  get platform(): string | undefined {
    return devices.real().platform;
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean } {
    return new ScrollDirection(this.props.direction);
  }

  get useSimulatedScrollbar(): boolean {
    if (!isDefined(this.props.useSimulatedScrollbar)) {
      return nativeScrolling && this.platform === 'android' && !browser.mozilla;
    }

    return this.props.useSimulatedScrollbar;
  }

  get pullDownEnabled(): boolean {
    return this.props.pullDownEnabled && this.platform !== 'generic';
  }

  get contentStyles(): { [key: string]: string | number } | undefined {
    if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
      return {
        transform: `translate(0px, ${this.contentTranslateTop}px)`,
      };
    }

    return undefined;
  }
}
