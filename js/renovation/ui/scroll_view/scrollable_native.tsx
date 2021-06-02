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
  ForwardRef,
} from '@devextreme-generator/declarations';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget, WidgetProps } from '../common/widget';
import { ScrollViewLoadPanel } from './load_panel';

import { combineClasses } from '../../utils/combine_classes';
import { getScrollLeftMax } from './utils/get_scroll_left_max';
import { getAugmentedLocation } from './utils/get_augmented_location';
import { getBoundaryProps, isReachedBottom } from './utils/get_boundary_props';
import { getScrollSign, normalizeOffsetLeft } from './utils/normalize_offset_left';
import { getElementLocationInternal } from './utils/get_element_location_internal';

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
  ScrollOffset, ScrollableDirection, RefreshStrategy, DxMouseEvent,
} from './types.d';

import { isDxMouseWheelEvent } from '../../../events/utils/index';

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
import { isVisible } from './utils/is_element_visible';

const HIDE_SCROLLBAR_TIMEOUT = 500;

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, topPocketRef, bottomPocketRef, direction,
    hScrollbarRef, vScrollbarRef,
    contentClientWidth, containerClientWidth, contentClientHeight, containerClientHeight,
    updateHandler, needForceScrollbarsVisibility, useSimulatedScrollbar,
    scrollableRef, isLoadPanelVisible, topPocketState, refreshStrategy,
    pullDownTranslateTop, pullDownIconAngle, pullDownOpacity,
    topPocketTop, contentStyles, scrollViewContentRef, contentTranslateTop,
    hScrollLocation, vScrollLocation,
    props: {
      aria, disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel,
      pullingDownText, pulledDownText, refreshingText, reachBottomText,
      pullDownEnabled, reachBottomEnabled, showScrollbar,
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
      onDimensionChanged={updateHandler}
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
      { needScrollViewLoadPanel && (
        <ScrollViewLoadPanel
          targetElement={scrollableRef}
          refreshingText={refreshingText}
          visible={isLoadPanelVisible}
        />
      )}
      { showScrollbar !== 'never' && useSimulatedScrollbar && direction.isHorizontal && (
        <Scrollbar
          direction="horizontal"
          ref={hScrollbarRef}
          contentSize={contentClientWidth}
          containerSize={containerClientWidth}
          scrollLocation={hScrollLocation}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
      { showScrollbar !== 'never' && useSimulatedScrollbar && direction.isVertical && (
        <Scrollbar
          direction="vertical"
          ref={vScrollbarRef}
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

  @Mutable() hideScrollbarTimer?: ReturnType<typeof setTimeout>;

  @Mutable() releaseTimer?: ReturnType<typeof setTimeout>;

  @Mutable() refreshTimer?: ReturnType<typeof setTimeout>;

  @Mutable() eventForUserAction?: DxMouseEvent;

  @Mutable() initPageY = 0;

  @Mutable() deltaY = 0;

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
    this.updateSizes();
    this.onUpdated();
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

    const containerEl = this.containerElement;
    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }
    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * location.left;
    }
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

    const distance = getOffsetDistance({ top, left }, this.props.direction, this.scrollOffset());

    const containerEl = this.containerElement;
    if (!this.direction.isHorizontal) {
      containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * distance.left;
    }

    if (!this.direction.isVertical) {
      containerEl.scrollTop += distance.top;
    }
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
    const { top, left } = this.scrollLocation();
    const scrollLeftMax = getScrollLeftMax(this.containerElement);

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
    return this.containerElement.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerElement.clientWidth;
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerElement,
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

  @Effect() effectResetInactiveState(): void {
    if (this.props.direction === DIRECTION_BOTH
      || !isDefined(this.containerElement)) { // || !hasWindow()
      return;
    }

    this.containerElement[this.fullScrollInactiveProp] = 0;
  }

  @Effect({ run: 'always' }) updateScrollbarSize(): void {
    this.updateSizes();
  }

  @Effect({ run: 'once' })
  disposeHideScrollbarTimer(): DisposeEffectReturn {
    return (): void => this.clearHideScrollbarTimer();
  }

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollInit.on(this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleInit(event);
      }, this.getInitEventData(), { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  moveEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollMove.on(this.wrapperRef.current,
      (event: DxMouseEvent) => {
        this.handleMove(event);
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

  @Effect({ run: 'once' })
  disposeRefreshTimer(): DisposeEffectReturn {
    return (): void => this.clearRefreshTimer();
  }

  @Method()
  validate(event: DxMouseEvent): boolean {
    const { disabled } = this.props;

    if (this.isLocked()) {
      return false;
    }

    if (disabled || (isDxMouseWheelEvent(event) && this.isScrollingOutOfBound(event))) {
      return false;
    }

    return isDefined(this.tryGetAllowedDirection());
  }

  clearReleaseTimer(): void {
    clearTimeout(this.releaseTimer as unknown as number);
    this.releaseTimer = undefined;
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
    if (this.loadingIndicatorEnabled && isVisible(this.scrollableRef.current!)) {
      this.isLoadPanelVisible = true;
    }
    this.lock();
  }

  finishLoading(): void {
    this.isLoadPanelVisible = false;
    this.unlock();
  }

  setPocketState(state: number): void {
    this.topPocketState = state;
  }

  handleScroll(event: DxMouseEvent): void {
    this.eventForUserAction = event;
    if (this.useSimulatedScrollbar) {
      this.moveScrollbars();
    }

    this.props.onScroll?.(this.getEventArgs());

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
      ...getBoundaryProps(this.props.direction, scrollOffset, this.containerElement, 0),
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

  updateHandler(): void { // TODO: update if simulatedScrollbars are using
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
    }
  }

  moveScrollbars(): void {
    const { top, left } = this.scrollOffset();

    this.hScrollLocation = -left;
    this.vScrollLocation = -top;

    this.needForceScrollbarsVisibility = true;

    this.clearHideScrollbarTimer();

    this.hideScrollbarTimer = setTimeout(() => {
      this.needForceScrollbarsVisibility = false;
    }, HIDE_SCROLLBAR_TIMEOUT);
  }

  clearHideScrollbarTimer(): void {
    clearTimeout(this.hideScrollbarTimer as unknown as number);
    this.hideScrollbarTimer = undefined;
  }

  scrollLocation(): { top: number; left: number } {
    return {
      top: this.containerElement.scrollTop,
      left: this.containerElement.scrollLeft,
    };
  }

  getInitEventData(): {
    getDirection: () => string | undefined;
    validate: (event: DxMouseEvent) => boolean;
    isNative: boolean;
    scrollTarget: HTMLDivElement | null;
  } {
    return {
      getDirection: this.tryGetAllowedDirection,
      validate: this.validate,
      isNative: true,
      scrollTarget: this.containerElement,
    };
  }

  handleInit(event: DxMouseEvent): void {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      if (this.topPocketState === TopPocketState.STATE_RELEASED
        && this.scrollLocation().top === 0) {
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
      e.originalEvent.isScrollingEvent = true;
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
    clearTimeout(this.refreshTimer as unknown as number);
    this.refreshTimer = undefined;
  }

  get topPocketHeight(): number {
    return this.topPocketRef.current?.clientHeight || 0;
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
    return -Math.round(this.topPocketRef.current!.clientHeight * 1.5);
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
      && isReachedBottom(this.containerElement, top, this.bottomPocketHeight);
  }

  get bottomPocketHeight(): number {
    if (this.props.reachBottomEnabled && this.bottomPocketRef.current) {
      return this.bottomPocketRef.current.clientHeight;
    }

    return 0;
  }

  tryGetAllowedDirection(): ScrollableDirection | undefined {
    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.props.direction);

    const contentEl = this.contentRef.current!;
    const containerEl = this.containerElement;

    const isOverflowVertical = (isVertical && contentEl.clientHeight > containerEl.clientHeight)
      || this.pullDownEnabled;
    const isOverflowHorizontal = (isHorizontal && contentEl.clientWidth > containerEl.clientWidth)
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

  isLocked(): boolean {
    return this.locked;
  }

  isScrollingOutOfBound(event: DxMouseEvent): boolean {
    const { delta, shiftKey } = event;
    const {
      scrollLeft, scrollTop, scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = this.containerElement;

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
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar !== 'never' && this.useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: showScrollbar === 'never',
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

  get containerElement(): HTMLDivElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.containerRef.current!;
  }
}
