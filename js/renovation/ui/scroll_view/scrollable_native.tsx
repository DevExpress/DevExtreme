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
  OneWay,
  ForwardRef,
} from '@devextreme-generator/declarations';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget } from '../common/widget';
import { ScrollViewLoadPanel } from './load_panel';

import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import devices from '../../../core/devices';
import { isDefined } from '../../../core/utils/type';
import { BaseWidgetProps } from '../../utils/base_props';
import {
  ScrollableProps,
} from './scrollable_props';
import { TopPocketProps, TopPocket } from './top_pocket';
import { BottomPocketProps, BottomPocket } from './bottom_pocket';
import browser from '../../../core/utils/browser';
import { nativeScrolling } from '../../../core/utils/support';
import '../../../events/gesture/emitter.gesture.scroll';

import {
  ScrollEventArgs,
  ScrollableLocation, ScrollOffset, ScrollableDirection, RefreshStrategy,
} from './types.d';

import { isDxMouseWheelEvent } from '../../../events/utils/index';

import {
  ensureLocation, normalizeCoordinate, getMaxScrollOffset,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
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

const HIDE_SCROLLBAR_TIMEOUT = 500;

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, topPocketRef, bottomPocketRef, direction,
    horizontalScrollbarRef, verticalScrollbarRef,
    contentClientWidth, containerClientWidth, contentClientHeight, containerClientHeight,
    windowResizeHandler, needForceScrollbarsVisibility, useSimulatedScrollbar,
    scrollableRef, isLoadPanelVisible, topPocketState, refreshStrategy,
    pullDownTopOffset, pullDownIconAngle, needPullDownRefreshClass, pullDownOpacity,
    props: {
      disabled, height, width, rtlEnabled, children, visible,
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
              pullDownTopOffset={pullDownTopOffset}
              pullDownIconAngle={pullDownIconAngle}
              pullDownOpacity={pullDownOpacity}
              needPullDownRefreshClass={needPullDownRefreshClass}
              visible={!!pullDownEnabled}
            />
            )}
            {needScrollViewContentWrapper
              ? <div className={SCROLLVIEW_CONTENT_CLASS}>{children}</div>
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
          ref={horizontalScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientWidth}
          containerSize={containerClientWidth}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
      { showScrollbar && useSimulatedScrollbar && direction.isVertical && (
        <Scrollbar
          direction="vertical"
          ref={verticalScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientHeight}
          containerSize={containerClientHeight}
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

type ScrollableNativePropsType = ScrollableNativeProps
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

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() verticalScrollbarRef!: RefObject<Scrollbar>;

  @Ref() horizontalScrollbarRef!: RefObject<Scrollbar>;

  @ForwardRef() topPocketRef!: RefObject<HTMLDivElement>;

  @ForwardRef() bottomPocketRef!: RefObject<HTMLDivElement>;

  @Mutable() locked = false;

  @Mutable() loadingIndicatorEnabled = true;

  @Mutable() hideScrollbarTimeout?: any;

  @Mutable() releaseTimeout?: any;

  @Mutable() eventForUserAction?: Event;

  @Mutable() startClientY = 0;

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

  @InternalState() pullDownTopOffset = 0;

  @InternalState() pullDownIconAngle = 0;

  @InternalState() pullDownOpacity = 0;

  @InternalState() needPullDownRefreshClass = false;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef.current!;
  }

  @Method()
  update(): void {
    const contentEl = this.contentRef.current;

    if (isDefined(contentEl)) {
      this.updateSizes();
      this.props.onUpdated?.(this.getEventArgs());
    }
  }

  @Method()
  refresh(): void {
    this.topPocketState = TopPocketState.STATE_READY;

    this.startLoading();
    this.props.onPullDown?.({});
  }

  @Method()
  release(): void {
    this.clearReleaseTimeout();
    this.releaseTimeout = setTimeout((() => {
      this.stateReleased();
      this.onRelease();
    }), 800);
  }

  clearReleaseTimeout(): void {
    clearTimeout(this.hideScrollbarTimeout);
    this.hideScrollbarTimeout = undefined;
  }

  @Effect({ run: 'once' })
  disposeReleaseTimeout(): DisposeEffectReturn {
    return (): void => this.clearReleaseTimeout();
  }

  onRelease(): void {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
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
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);

    if (this.direction.isVertical) {
      this.containerRef.current!.scrollTop += Math.round(location.top);
    }
    if (this.direction.isHorizontal) {
      this.containerRef.current!.scrollLeft += normalizeCoordinate('left', Math.round(location.left), this.props.rtlEnabled);
    }
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(targetLocation);
    const containerPosition = this.scrollOffset();

    const top = location.top - containerPosition.top;
    const left = location.left - containerPosition.left;

    this.scrollBy({ top, left });
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<ScrollOffset>): void {
    if (element === undefined || element === null) {
      return;
    }

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
    const maxScrollLeftOffset = getMaxScrollOffset('width', this.containerRef.current!);

    return {
      left: getPublicCoordinate('left', this.containerRef.current!.scrollLeft, maxScrollLeftOffset, this.props.rtlEnabled),
      top: this.containerRef.current!.scrollTop,
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
        this.lastLocation = this.location();

        if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
          if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
            return;
          }

          const currentLocation = this.location().top;
          const scrollDelta = this.locationTop - currentLocation;

          this.locationTop = currentLocation;

          if (scrollDelta > 0 && this.isReachBottom()) {
            this.onReachBottom();
          } else {
            this.stateReleased();
          }
        }
      });
  }

  onReachBottom(): void {
    this.props.onReachBottom?.({});
  }

  stateReleased(): void {
    if (this.topPocketState === TopPocketState.STATE_RELEASED) {
      return;
    }

    this.releaseState();
  }

  getEventArgs(): ScrollEventArgs {
    return {
      event: this.eventForUserAction,
      scrollOffset: this.scrollOffset(),
      ...getBoundaryProps(this.props.direction, this.scrollOffset(), this.containerRef.current!, 0),
    };
  }

  isReachBottom(): boolean {
    const maxScrollTopOffset = getMaxScrollOffset('height', this.containerRef.current!);

    return this.props.reachBottomEnabled
      && this.locationTop <= -maxScrollTopOffset + this.bottomPocketRef.current!.clientHeight;
  }

  // isScrollLocationChanged(): boolean {
  //   const currentLocation = this.location();

  //   const isTopChanged = this.lastLocation.top !== currentLocation.top;
  //   const isLeftChanged = this.lastLocation.left !== currentLocation.left;

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
    this.updateSizes();
    this.props.onUpdated?.(this.getEventArgs());
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
    const { top, left } = this.location();

    if (this.direction.isHorizontal) {
      const scrollbarEl = this.horizontalScrollbarRef.current;
      if (isDefined(scrollbarEl)) {
        this.horizontalScrollbarRef.current!.moveScrollbar(left);
      }
    }

    if (this.direction.isVertical) {
      const scrollbarEl = this.verticalScrollbarRef.current;
      if (isDefined(scrollbarEl)) {
        this.verticalScrollbarRef.current!.moveScrollbar(top);
      }
    }

    this.needForceScrollbarsVisibility = true;

    this.clearHideScrollbarTimeout();

    /* istanbul ignore next */
    this.hideScrollbarTimeout = setTimeout(() => {
      /* istanbul ignore next */
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

  location(): { top: number; left: number } {
    return {
      top: -this.containerRef.current!.scrollTop,
      left: -this.containerRef.current!.scrollLeft,
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
        && this.containerRef.current!.scrollTop === 0) {
        this.startClientY = e.originalEvent.pageY;
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
      this.deltaY = e.originalEvent.pageY - this.startClientY;

      if (this.topPocketState === TopPocketState.STATE_TOUCHED) {
        if (this.props.pullDownEnabled && this.deltaY > 0) {
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
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      if (this.isPullDown) {
        this.pullDownRefreshing();
      }

      this.complete();
    }
  }

  handleStop(): void {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.complete();
    }
  }

  pullDownRefreshing(): void {
    this.topPocketState = TopPocketState.STATE_LOADING;
    this.needPullDownRefreshClass = false;
    this.pullDownRefreshHandler();
  }

  pullDownRefreshHandler(): void {
    this.refreshPullDown();
    this.props.onPullDown?.({});
  }

  refreshPullDown(): void {
    // this._$pullDown.addClass(SCROLLVIEW_PULLDOWN_DOWN_LOADING_CLASS);
    this.pullDownTopOffset = this.getPullDownHeight();
  }

  movePullDown(): void {
    const pullDownHeight = this.getPullDownHeight();
    const top = Math.min(pullDownHeight * 3, this.deltaY + this.getPullDownStartPosition());
    const angle = (180 * top) / pullDownHeight / 3;

    if (top < pullDownHeight) {
      this.needPullDownRefreshClass = true;
    }

    this.pullDownOpacity = 1;
    this.pullDownTopOffset = top;
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
    this.needPullDownRefreshClass = false;
    this.topPocketState = TopPocketState.STATE_RELEASED;
    this.pullDownOpacity = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get refreshStrategy(): RefreshStrategy {
    return devices.real().platform === 'android' ? 'swipeDown' : 'pullDown';
  }

  get isSwipeDownStrategy(): boolean {
    return this.refreshStrategy === 'swipeDown';
  }

  get isPullDown(): boolean {
    return this.props.pullDownEnabled
      && this.topPocketState === TopPocketState.STATE_PULLED
      && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  }

  tryGetAllowedDirection(): ScrollableDirection | undefined {
    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.props.direction);

    const contentEl = this.contentRef.current;
    const containerEl = this.containerRef.current;

    const isOverflowVertical = (isVertical && contentEl!.clientHeight > containerEl!.clientHeight)
      || this.props.pullDownEnabled;
    const isOverflowHorizontal = (isHorizontal && contentEl!.clientWidth > containerEl!.clientWidth)
      || this.props.pullDownEnabled;

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

    if (this.isLocked() || disabled || (isDxMouseWheelEvent(e) && this.isScrollingOutOfBound(e))) {
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
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${devices.real().platform} dx-scrollable-renovated`]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar && this.useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean } {
    return new ScrollDirection(this.props.direction);
  }

  get useSimulatedScrollbar(): boolean {
    if (!isDefined(this.props.useSimulatedScrollbar)) {
      return nativeScrolling && devices.real().platform === 'android' && !browser.mozilla;
    }

    return this.props.useSimulatedScrollbar;
  }
}
