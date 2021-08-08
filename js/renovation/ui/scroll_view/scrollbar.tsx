import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
  Method,
  Mutable,
} from '@devextreme-generator/declarations';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';
import { isDefined } from '../../../core/utils/type';
import { isDxMouseWheelEvent } from '../../../events/utils/index';
import { ScrollbarProps } from './scrollbar_props';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS, TopPocketState,
  SCROLLABLE_SCROLL_CLASS,
  SCROLLABLE_SCROLL_CONTENT_CLASS,
  HIDE_SCROLLBAR_TIMEOUT,
  SCROLLABLE_SCROLLBAR_ACTIVE_CLASS,
  HOVER_ENABLED_STATE,
} from './common/consts';

import {
  subscribeToDXPointerDownEvent,
  subscribeToDXPointerUpEvent,
} from '../../utils/subscribe_to_event';

import { ScrollableSimulatedProps } from './scrollable_simulated_props';
import { ScrollableProps } from './scrollable_props';
import { BaseWidgetProps } from '../common/base_props';
import { inRange } from '../../../core/utils/math';
import { DxMouseEvent } from './types.d';

const OUT_BOUNDS_ACCELERATION = 0.5;
export const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    cssClasses, scrollStyles, scrollRef, scrollbarRef, hoverStateEnabled,
    onHoverStart, onHoverEnd, isVisible,
    props: { activeStateEnabled },
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollbarRef}
      classes={cssClasses}
      activeStateEnabled={activeStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      visible={isVisible}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div className={viewModel.scrollClasses} style={scrollStyles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

export type ScrollbarPropsType = ScrollbarProps
& Pick<BaseWidgetProps, 'rtlEnabled'>
& Pick<ScrollableProps, 'direction' | 'showScrollbar' | 'scrollByThumb' | 'pullDownEnabled' | 'reachBottomEnabled' | 'forceGeneratePockets'>
& Pick<ScrollableSimulatedProps, 'bounceEnabled' | 'pocketStateChange' | 'scrollLocationChange' | 'contentTranslateOffsetChange'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() thumbScrolling = false;

  @Mutable() crossThumbScrolling = false;

  @Mutable() initialTopPocketSize = 0;

  @Mutable() rightScrollLocation = 0;

  @Mutable() prevScrollLocation = 0;

  @Mutable() hideScrollbarTimer?: unknown;

  @Mutable() prevContainerSize = 0;

  @Mutable() prevContentSize = 0;

  @InternalState() wasInit = false;

  @InternalState() onReachBottomWasFiredOnce = false;

  @InternalState() onPullDownWasFiredOnce = false;

  @InternalState() pendingReachBottom = false;

  @InternalState() pendingInertiaAnimator = false;

  @InternalState() pendingBounceAnimator = false;

  @InternalState() pendingPullDown = false;

  @InternalState() pendingRelease = false;

  @InternalState() needRiseEnd = false;

  @InternalState() showOnScrollByWheel?: boolean;

  @InternalState() forceAnimationToBottomBound = false;

  @InternalState() hovered = false;

  @InternalState() expanded = false;

  @InternalState() visibility = false;

  @InternalState() isScrolling = false;

  @InternalState() wasScrollComplete = false;

  @InternalState() maxOffset = 0;

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Effect()
  pointerDownEffect(): EffectReturn {
    return subscribeToDXPointerDownEvent(this.scrollRef.current, () => { this.expand(); });
  }

  @Effect()
  pointerUpEffect(): EffectReturn {
    return subscribeToDXPointerUpEvent(domAdapter.getDocument(), () => { this.collapse(); });
  }

  @Method()
  isThumb(element: EventTarget | null): boolean {
    return this.scrollbarRef.current?.querySelector(`.${SCROLLABLE_SCROLL_CLASS}`) === element
      || this.scrollbarRef.current?.querySelector(`.${SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }

  @Method()
  isScrollbar(element: EventTarget | null): boolean {
    return element === this.scrollbarRef.current;
  }

  @Method()
  validateEvent(event: DxMouseEvent): boolean {
    const { target } = event.originalEvent;

    return this.isThumb(target) || this.isScrollbar(target);
  }

  @Method()
  getLocationWithinRange(value: number): number {
    return Math.max(Math.min(value, this.maxOffset), this.minOffset);
  }

  @Method()
  getMinOffset(): number {
    return this.minOffset;
  }

  @Method()
  getMaxOffset(): number {
    return this.maxOffset;
  }

  @Method()
  initHandler(event: DxMouseEvent, crossThumbScrolling: boolean): void {
    this.cancelScrolling();

    this.isScrolling = true;
    this.onReachBottomWasFiredOnce = false;
    this.onPullDownWasFiredOnce = false;

    this.prepareThumbScrolling(event, crossThumbScrolling);
  }

  @Method()
  startHandler(): void {
    this.visibility = true;
  }

  @Method()
  moveHandler(delta: { x: number; y: number }): void {
    if (this.crossThumbScrolling) {
      return;
    }
    const distance = delta;

    if (this.thumbScrolling) {
      distance[this.axis] = -Math.round(
        distance[this.axis] / this.containerToContentRatio,
      );
    }

    this.scrollBy(distance);
  }

  @Effect({ run: 'once' })
  disposeHideScrollbarTimer(): DisposeEffectReturn {
    return (): void => this.clearHideScrollbarTimer();
  }

  @Method()
  endHandler(velocity: { x: number; y: number }, needRiseEnd: boolean): void {
    this.needRiseEnd = needRiseEnd;

    this.onInertiaAnimatorStart(velocity[this.axis]);

    this.isScrolling = false;

    this.resetThumbScrolling();
  }

  @Method()
  stopHandler(): void {
    if (this.thumbScrolling) {
      this.stopScrolling();
    }
    this.resetThumbScrolling();
  }

  @Method()
  scrollByHandler(delta: { x: number; y: number }): void {
    this.scrollBy(delta);
    this.needRiseEnd = true;
    this.stopScrolling();
  }

  @Method()
  stopScrolling(): void {
    this.isScrolling = false;
    this.wasScrollComplete = true;
  }

  @Method()
  /* istanbul ignore next */
  stopAnimator(animator?: string): void {
    if (animator === 'bounce') {
      this.pendingBounceAnimator = false;
    }
    if (animator === 'inertia') {
      this.pendingInertiaAnimator = false;
    }
    this.wasScrollComplete = true;
  }

  @Method()
  scrollStep(delta: number): void {
    /* istanbul ignore next */
    if (this.props.bounceEnabled) {
      this.moveTo(this.props.scrollLocation + delta);
    } else {
      this.moveTo(this.getLocationWithinRange(this.props.scrollLocation + delta));
    }
  }

  @Effect()
  /* istanbul ignore next */
  risePullDown(): void {
    if (
      this.props.forceGeneratePockets
      && this.wasInit
      && !this.isScrolling
      && this.inRange
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && this.isPullDown
      && !this.pendingPullDown
      && !this.onPullDownWasFiredOnce
    ) {
      this.onPullDownWasFiredOnce = true;

      this.startRefreshing();
    }
  }

  @Effect()
  /* istanbul ignore next */
  riseReachBottom(): void {
    if (
      this.props.forceGeneratePockets
      && this.wasInit
      && !this.isScrolling
      && this.inRange
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && this.isReachBottom
      && !this.pendingReachBottom
      && !this.onReachBottomWasFiredOnce
      && this.props.containerSize
      && this.props.contentSize
    ) {
      this.onReachBottomWasFiredOnce = true;

      this.startLoading();
    }
  }

  @Effect()
  /* istanbul ignore next */
  riseEnd(): void {
    if (
      !this.isScrolling
      && this.inRange
      && this.needRiseEnd
      && this.wasScrollComplete
      && !this.pendingBounceAnimator
      && !this.pendingInertiaAnimator
      && !this.pendingReachBottom
      && !this.pendingPullDown
      && (
        this.props.scrollLocation <= 0
        && this.props.scrollLocation >= -this.visibleScrollAreaSize
      )
    ) {
      this.wasScrollComplete = false;
      this.forceAnimationToBottomBound = false;
      this.needRiseEnd = false;
      this.hide();
      this.props.onUnlock?.();
      this.props.onEnd?.(this.props.direction);
    }
  }

  @Effect()
  /* istanbul ignore next */
  bounceAnimatorStart(): void {
    if (
      !this.inRange
      && !this.isScrolling
      && this.wasScrollComplete
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && !this.pendingPullDown
      && !this.pendingReachBottom
    ) {
      this.wasScrollComplete = false;
      this.onBounceAnimatorStart();
    }
  }

  @Effect()
  updateMaxOffset(): void {
    if (this.props.forceGeneratePockets) {
      if (this.isPullDown) {
        this.maxOffset = this.props.topPocketSize;
        this.setPocketState(TopPocketState.STATE_READY);
      } else {
        this.maxOffset = 0;
        this.setPocketState(TopPocketState.STATE_RELEASED);
      }
    }
  }

  @Effect()
  updateLockedState(): void {
    if (this.pendingBounceAnimator || this.pendingPullDown) {
      this.props.onLock?.();
    }
  }

  @Effect()
  updateContentTranslate(): void {
    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      if (this.initialTopPocketSize !== this.props.topPocketSize) {
        this.updateContent(this.props.scrollLocation);
        this.initialTopPocketSize = this.props.topPocketSize;
      }
    }
  }

  @Method()
  moveTo(location: number): void {
    const scrollDelta = Math.abs(this.prevScrollLocation - location);
    // there is an issue https://stackoverflow.com/questions/49219462/webkit-scrollleft-css-translate-horizontal-bug
    this.props.scrollLocationChange?.(this.fullScrollProp, location);
    this.updateContent(location);
    if (scrollDelta >= 1) {
      this.props.onScroll?.();
    }

    this.prevScrollLocation = location;
    this.rightScrollLocation = this.minOffset - location;
  }

  @Method()
  releaseHandler(): void {
    this.onRelease();
  }

  @Effect()
  moveToBoundaryOnSizeChange(): void {
    const contentSizeChanged = this.props.contentSize !== this.prevContentSize;
    const containerSizeChanged = this.props.containerSize !== this.prevContainerSize;

    if (contentSizeChanged || containerSizeChanged) {
      this.prevContentSize = this.props.contentSize;
      this.prevContainerSize = this.props.containerSize;

      if (this.props.scrollLocation <= this.maxOffset) {
        let newScrollLocation = this.getLocationWithinRange(this.props.scrollLocation);

        if (this.isHorizontal && this.props.rtlEnabled) {
          newScrollLocation = this.minOffset - this.rightScrollLocation;

          if (newScrollLocation >= 0) {
            newScrollLocation = 0;
          }
        }

        this.moveTo(newScrollLocation);
      }
    }
  }

  hide(): void {
    this.visibility = false;

    if (isDefined(this.showOnScrollByWheel) && this.props.showScrollbar === 'onScroll') {
      this.hideScrollbarTimer = setTimeout(() => {
        this.showOnScrollByWheel = undefined;
      }, HIDE_SCROLLBAR_TIMEOUT);
    }
  }

  get inRange(): boolean {
    return inRange(this.props.scrollLocation, this.minOffset, this.maxOffset);
  }

  get axis(): 'x' | 'y' {
    return this.isHorizontal ? 'x' : 'y';
  }

  get scrollProp(): 'left' | 'top' {
    return this.isHorizontal ? 'left' : 'top';
  }

  get fullScrollProp(): 'scrollLeft' | 'scrollTop' {
    return this.isHorizontal ? 'scrollLeft' : 'scrollTop';
  }

  get dimension(): 'width' | 'height' {
    return this.isHorizontal ? 'width' : 'height';
  }

  get isHorizontal(): boolean {
    return this.props.direction === DIRECTION_HORIZONTAL;
  }

  clearHideScrollbarTimer(): void {
    clearTimeout(this.hideScrollbarTimer as number);
    this.hideScrollbarTimer = undefined;
  }

  onInertiaAnimatorStart(velocity: number): void {
    this.pendingInertiaAnimator = true;
    this.props.onAnimatorStart?.('inertia', velocity, this.thumbScrolling, this.crossThumbScrolling);
  }

  onBounceAnimatorStart(): void {
    this.pendingBounceAnimator = true;
    this.props.onAnimatorStart?.('bounce');
  }

  startRefreshing(): void {
    this.maxOffset = 0;
    this.setPocketState(TopPocketState.STATE_REFRESHING);
    this.pendingPullDown = true;

    this.props.onPullDown?.();
  }

  startLoading(): void {
    this.pendingReachBottom = true;

    this.props.onReachBottom?.();
  }

  resetThumbScrolling(): void {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }

  scrollBy(delta: { x: number; y: number }): void {
    let distance = delta[this.axis];
    if (!this.inRange) {
      distance *= OUT_BOUNDS_ACCELERATION;
    }
    this.scrollStep(distance);
  }

  cancelScrolling(): void {
    this.isScrolling = false;
    this.hide();
    this.onAnimatorCancel();
  }

  onAnimatorCancel(): void {
    this.pendingBounceAnimator = false;
    this.pendingInertiaAnimator = false;
    this.props.onAnimatorCancel?.();
  }

  // TODO: cross naming with mutable variabless (crossThumbScrolling -> currentCrossThumbScrolling)
  // https://trello.com/c/ohg2pHUZ/2579-mutable-cross-naming
  prepareThumbScrolling(event: DxMouseEvent, currentCrossThumbScrolling: boolean): void {
    if (isDxMouseWheelEvent(event.originalEvent)) {
      if (this.props.showScrollbar === 'onScroll') {
        this.showOnScrollByWheel = true;
      }
      return;
    }

    const { target } = event.originalEvent;
    const scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);

    if (scrollbarClicked) {
      this.moveToMouseLocation(event);
    }

    // TODO: cross naming with mutable variabless (thumbScrolling -> currentThumbScrolling)
    // https://trello.com/c/ohg2pHUZ/2579-mutable-cross-naming
    const currentThumbScrolling = scrollbarClicked
      || (this.props.scrollByThumb && this.isThumb(target));
    this.thumbScrolling = currentThumbScrolling;
    this.crossThumbScrolling = !currentThumbScrolling && currentCrossThumbScrolling;

    if (currentThumbScrolling) {
      this.expand();
    }
  }

  moveToMouseLocation(event: DxMouseEvent): void {
    const mouseLocation = event[`page${this.axis.toUpperCase()}`] - this.props.scrollableOffset;
    const delta = mouseLocation / this.containerToContentRatio - this.props.containerSize / 2;

    this.visibility = true;

    this.moveTo(Math.round(Math.max(Math.min(-delta, 0), -this.visibleScrollAreaSize)));
  }

  updateContent(location: number): void {
    let contentTranslateOffset = Number.NaN;

    if (location > 0) {
      contentTranslateOffset = location;
    } else if (location <= this.minOffset) {
      contentTranslateOffset = location - this.minOffset;
    } else {
      contentTranslateOffset = location % 1;
    }

    this.wasInit = true;

    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      contentTranslateOffset -= this.props.topPocketSize;
    }

    this.props.contentTranslateOffsetChange?.(this.scrollProp, contentTranslateOffset);
  }

  onRelease(): void {
    this.setPocketState(TopPocketState.STATE_RELEASED);
    this.props.onRelease?.();

    this.pendingPullDown = false;
    this.pendingReachBottom = false;

    if (this.props.scrollLocation <= -this.visibleScrollAreaSize && this.inRange) {
      this.forceAnimationToBottomBound = true;
    }

    this.stopScrolling();
  }

  setPocketState(newState: number): void {
    this.props.pocketStateChange?.(newState);
  }

  get isPullDown(): boolean {
    return this.props.pullDownEnabled
      && this.props.bounceEnabled
      && (this.props.scrollLocation - this.props.topPocketSize) >= 0;
  }

  get isReachBottom(): boolean {
    return this.props.reachBottomEnabled
      && (this.props.scrollLocation + this.visibleScrollAreaSize <= 0.5);
  }

  get visibleContentAreaSize(): number {
    const size = this.props.contentSize - this.props.bottomPocketSize - this.props.topPocketSize;

    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled) {
      return Math.max(size - this.props.contentPaddingBottom, 0);
    }

    return Math.max(size, 0);
  }

  get visibleScrollAreaSize(): number {
    return Math.max(this.visibleContentAreaSize - this.props.containerSize, 0);
  }

  get minOffset(): number {
    if (
      this.props.forceGeneratePockets
      && this.props.reachBottomEnabled
      && !this.forceAnimationToBottomBound) {
      return -Math.max(this.visibleScrollAreaSize
        + this.props.bottomPocketSize + this.props.contentPaddingBottom, 0);
    }

    return -Math.max(this.visibleScrollAreaSize, 0);
  }

  get scrollSize(): number {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }

  get scrollRatio(): number {
    if (this.visibleScrollAreaSize) {
      return (this.props.containerSize - this.scrollSize) / this.visibleScrollAreaSize;
    }

    return 1;
  }

  get containerToContentRatio(): number {
    return this.visibleContentAreaSize
      ? this.props.containerSize / this.visibleContentAreaSize
      : this.props.containerSize;
  }

  expand(): void {
    this.expanded = true;
  }

  collapse(): void {
    this.expanded = false;
  }

  onHoverStart(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = true;
    }
  }

  onHoverEnd(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = false;
    }
  }

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: !!this.expanded,
      [HOVER_ENABLED_STATE]: !!this.hoverStateEnabled,
    };
    return combineClasses(classesMap);
  }

  get scrollStyles(): { [key: string]: string | number } {
    return {
      [this.dimension]: this.scrollSize || THUMB_MIN_SIZE,
      transform: this.scrollTransform,
    };
  }

  get scrollTransform(): string {
    if (this.props.showScrollbar === 'never') {
      return 'none';
    }

    const translateValue = -this.props.scrollLocation * this.scrollRatio;

    if (this.isHorizontal) {
      return `translate(${translateValue}px, 0px)`;
    }

    return `translate(0px, ${translateValue}px)`;
  }

  get scrollClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.visible,
    });
  }

  get isVisible(): boolean {
    return this.props.showScrollbar !== 'never' && this.containerToContentRatio < 1 && this.props.containerSize > 15;
  }

  get visible(): boolean {
    const { showScrollbar, forceVisibility } = this.props;

    if (!this.isVisible) {
      return false;
    }
    if (showScrollbar === 'onHover') {
      return this.visibility || this.props.isScrollableHovered || this.hovered;
    }
    if (showScrollbar === 'always') {
      return true;
    }

    return forceVisibility || this.visibility || !!this.showOnScrollByWheel;
  }

  get hoverStateEnabled(): boolean {
    const { showScrollbar, scrollByThumb } = this.props;
    return (showScrollbar === 'onHover' || showScrollbar === 'always') && scrollByThumb;
  }
}
