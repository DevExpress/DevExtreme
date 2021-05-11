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
import { DisposeEffectReturn } from '../../utils/effect_return.d';
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
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

import { ScrollableSimulatedProps } from './scrollable_simulated_props';
import { ScrollableProps } from './scrollable_props';
import { BaseWidgetProps } from '../common/base_props';
import { inRange } from '../../../core/utils/math';

const OUT_BOUNDS_ACCELERATION = 0.5;
const THUMB_MIN_SIZE = 15;

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
& Pick<ScrollableSimulatedProps, 'bounceEnabled' | 'scrollLocationChange' | 'contentTranslateOffsetChange'>;
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

  @InternalState() showOnScrollByWheel?: boolean;

  @InternalState() hovered = false;

  @InternalState() expanded = false;

  @InternalState() visibility = false;

  @InternalState() maxOffset = 0;

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Effect()
  pointerDownEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerDown.on(this.scrollRef.current,
      () => {
        this.expand();
      }, { namespace });

    return (): void => dxPointerDown.off(this.scrollRef.current, { namespace });
  }

  @Effect()
  pointerUpEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerUp.on(domAdapter.getDocument(),
      () => {
        this.collapse();
      }, { namespace });

    return (): void => dxPointerUp.off(this.scrollRef.current, { namespace });
  }

  @Method()
  isThumb(element: HTMLDivElement): boolean {
    return this.scrollbarRef.current?.querySelector(`.${SCROLLABLE_SCROLL_CLASS}`) === element
      || this.scrollbarRef.current?.querySelector(`.${SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }

  @Method()
  isScrollbar(element: HTMLDivElement): boolean {
    return element === this.scrollbarRef.current;
  }

  @Method()
  validateEvent(e): boolean {
    const { target } = e.originalEvent;

    return (this.isThumb(target) || this.isScrollbar(target));
  }

  @Method()
  reachedMin(): boolean {
    return this.props.scrollLocation <= this.minOffset;
  }

  @Method()
  reachedMax(): boolean {
    return this.props.scrollLocation >= this.maxOffset;
  }

  inRange(): boolean {
    return inRange(this.props.scrollLocation, this.minOffset, this.maxOffset);
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

  @Method()
  initHandler(e, crossThumbScrolling: boolean): void {
    this.stopScrolling();
    this.prepareThumbScrolling(e, crossThumbScrolling);
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

  hide(): void {
    this.visibility = false;

    if (isDefined(this.showOnScrollByWheel) && this.props.showScrollbar === 'onScroll') {
      setTimeout(() => {
        this.showOnScrollByWheel = undefined;
      }, HIDE_SCROLLBAR_TIMEOUT);
    }
  }

  @Method()
  endHandler(velocity: { x: number; y: number }): void {
    this.onInertiaAnimatorStart(velocity[this.axis]);
    this.resetThumbScrolling();
  }

  onInertiaAnimatorStart(velocity: number): void {
    this.props.onAnimatorStart?.('inertia', velocity, this.thumbScrolling, this.crossThumbScrolling);
  }

  onBounceAnimatorStart(): void {
    this.props.onAnimatorStart?.('bounce');
  }

  @Method()
  stopHandler(): void {
    this.hide();

    if (this.thumbScrolling) {
      this.scrollComplete();
    } else {
      this.scrollToBounds();
    }
    this.resetThumbScrolling();
  }

  @Method()
  scrollByHandler(delta: { x: number; y: number }): void {
    this.scrollBy(delta);
    this.scrollComplete();
  }

  @Method()
  scrollComplete(): void {
    if (this.props.forceGeneratePockets) {
      if (this.inRange()) {
        if (this.props.pocketState === TopPocketState.STATE_READY) {
          this.pullDownRefreshing();
          this.maxOffset = 0;
          return;
        } if (this.props.pocketState === TopPocketState.STATE_LOADING) {
          this.reachBottomLoading();
          return;
        }
      }
    }

    if (this.inRange()) {
      this.props.onEnd?.();
    }

    this.scrollToBounds();
  }

  pullDownRefreshing(): void {
    this.setPocketState(TopPocketState.STATE_REFRESHING);
    this.onPullDown();
  }

  reachBottomLoading(): void {
    this.onReachBottom();
  }

  onPullDown(): void {
    this.props.onPullDown?.();
  }

  onReachBottom(): void {
    this.props.onReachBottom?.();
  }

  scrollToBounds(): void {
    if (this.inRange()) {
      this.hide();
      return;
    }

    this.onBounceAnimatorStart();
  }

  @Method()
  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this
  stopComplete(): void {}

  resetThumbScrolling(): void {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }

  scrollBy(delta: { x: number; y: number }): void {
    let distance = delta[this.axis];
    if (!this.inRange()) {
      distance *= OUT_BOUNDS_ACCELERATION;
    }
    this.scrollStep(distance);
  }

  stopScrolling(): void {
    this.hide();
    this.onAnimatorCancel();
  }

  onAnimatorCancel(): void {
    this.props.onAnimatorCancel?.();
  }

  // TODO: cross naming with mutable variabless (crossThumbScrolling -> currentCrossThumbScrolling)
  // https://trello.com/c/ohg2pHUZ/2579-mutable-cross-naming
  prepareThumbScrolling(e, currentCrossThumbScrolling: boolean): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      if (this.props.showScrollbar === 'onScroll') {
        this.showOnScrollByWheel = true;
      }
      return;
    }

    const { target } = e.originalEvent;
    const scrollbarClicked = (this.props.scrollByThumb && this.isScrollbar(target));

    if (scrollbarClicked) {
      this.moveToMouseLocation(e);
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

  moveToMouseLocation(e): void {
    const mouseLocation = e[`page${this.axis.toUpperCase()}`] - this.props.scrollableOffset;
    const delta = this.props.scrollLocation + mouseLocation
    / this.containerToContentRatio - this.props.containerSize / 2;

    this.scrollStep(-Math.round(delta));
  }

  @Method()
  scrollStep(delta: number): void {
    if (this.props.bounceEnabled) {
      this.moveTo(this.props.scrollLocation + delta);
    } else {
      this.moveTo(this.getLocationWithinRange(this.props.scrollLocation + delta));
    }
  }

  @Effect()
  moveToBoundaryOnSizeChange(): void {
    if (this.props.forceUpdateScrollbarLocation) {
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

  updateContent(location: number): void {
    let contentTranslateOffset: number;

    if (location > 0) {
      contentTranslateOffset = location;
    } else if (location <= this.minOffset) {
      contentTranslateOffset = location - this.minOffset;
    } else {
      contentTranslateOffset = location % 1;
    }

    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      contentTranslateOffset -= this.topPocketSize;
    }

    this.props.contentTranslateOffsetChange?.(this.scrollProp, contentTranslateOffset);
  }

  @Effect()
  updateContentTranslate(): void {
    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      if (this.initialTopPocketSize !== this.topPocketSize) {
        this.updateContent(this.props.scrollLocation);
        this.initialTopPocketSize = this.topPocketSize;
      }
    }
  }

  updateMaxOffset(): void {
    if (this.props.forceGeneratePockets) {
      const topBoundaryOffset = this.props.scrollLocation - this.topPocketSize;
      this.maxOffset = topBoundaryOffset > 0 ? this.topPocketSize : 0;
    }
  }

  @Method()
  moveTo(location: number): void {
    this.updateMaxOffset();

    const scrollDelta = Math.abs(this.prevScrollLocation - location);
    // there is an issue https://stackoverflow.com/questions/49219462/webkit-scrollleft-css-translate-horizontal-bug
    this.props.scrollLocationChange?.(this.fullScrollProp, location);
    this.updateContent(location);
    if (scrollDelta >= 1) {
      this.props.onScroll?.();
    }

    this.prevScrollLocation = location;
    this.rightScrollLocation = this.minOffset - location;

    if (this.props.forceGeneratePockets) {
      if (this.isPullDown()) {
        if (this.props.pocketState !== TopPocketState.STATE_READY) {
          this.setPocketState(TopPocketState.STATE_READY);
        }
      } else if (this.isReachBottom()) {
        if (this.props.pocketState !== TopPocketState.STATE_LOADING) {
          this.setPocketState(TopPocketState.STATE_LOADING);
        }
      } else if (this.props.pocketState !== TopPocketState.STATE_RELEASED) {
        this.stateReleased();
      }
    }
  }

  @Method()
  releaseHandler(): void {
    this.release();
  }

  release(): void {
    this.stateReleased();
    this.scrollComplete();
  }

  stateReleased(): void {
    this.setPocketState(TopPocketState.STATE_RELEASED);
    this.onRelease();
  }

  onRelease(): void {
    this.props.onRelease?.();
  }

  setPocketState(state: number): void {
    this.props.pocketStateChange?.(state);
  }

  isPullDown(): boolean {
    return this.props.pullDownEnabled
      && this.props.bounceEnabled
      && (this.props.scrollLocation - this.props.topPocketSize) >= 0;
  }

  isReachBottom(): boolean {
    return this.props.reachBottomEnabled
      && (this.props.scrollLocation - this.minOffset - this.bottomPocketSize <= 0.5);
  }

  get minOffset(): number {
    if (this.props.forceGeneratePockets) {
      return -Math.max(this.bottomBoundaryOffset + this.bottomPocketSize, 0);
    }

    return -Math.max(this.bottomBoundaryOffset, 0);
  }

  get scrollSize(): number {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }

  get scrollRatio(): number {
    if (this.bottomBoundaryOffset) {
      return (this.props.containerSize - this.scrollSize) / this.bottomBoundaryOffset;
    }

    return 1;
  }

  get contentSize(): number {
    if (this.props.contentSize) {
      return this.props.contentSize - this.bottomPocketSize - this.topPocketSize;
    }
    return 0;
  }

  get containerToContentRatio(): number {
    return this.contentSize
      ? this.props.containerSize / this.contentSize
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

  get topPocketSize(): number {
    if (this.props.pullDownEnabled) {
      return this.props.topPocketSize;
    }

    return 0;
  }

  get bottomPocketSize(): number {
    if (this.props.reachBottomEnabled) {
      return this.props.bottomPocketSize;
    }

    return 0;
  }

  get bottomBoundaryOffset(): number {
    return this.contentSize - this.props.containerSize;
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
    return this.props.showScrollbar !== 'never' && this.containerToContentRatio < 1;
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
