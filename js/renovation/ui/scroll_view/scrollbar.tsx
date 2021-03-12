import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
  Method,
  Mutable,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';
import { isDefined } from '../../../core/utils/type';
import { isDxMouseWheelEvent } from '../../../events/utils/index';
import { ScrollbarProps } from './scrollbar_props';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS, TopPocketState,
} from './scrollable_utils';

import {
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

import { ScrollableSimulatedProps } from './scrollable_simulated_props';
import { ScrollableProps } from './scrollable_props';

const OUT_BOUNDS_ACCELERATION = 0.5;

const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
const HOVER_ENABLED_STATE = 'dx-scrollbar-hoverable';

const MAX_OFFSET = 0;
const THUMB_MIN_SIZE = 15;
const HIDE_SCROLLBAR_TIMEOUT = 500;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    cssClasses, scrollStyles, scrollRef, scrollbarRef, hoverStateEnabled,
    onHoverStart, onHoverEnd, isVisible,
    props: { activeStateEnabled },
    restAttributes,
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <div className={viewModel.scrollClasses} style={scrollStyles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

export type ScrollbarPropsType = ScrollbarProps
& Pick<ScrollableSimulatedProps, 'contentPositionChange' | 'contentTranslateOffset' | 'contentTranslateOffsetChange' | 'forceGeneratePockets'>
& Pick<ScrollableProps, 'pullDownEnabled' | 'reachBottomEnabled'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() location = 0;

  @Mutable() thumbScrolling = false;

  @Mutable() crossThumbScrolling = false;

  // @Mutable() prevThumbRatio = 1;

  @InternalState() showOnScrollByWheel?: boolean;

  @InternalState() hovered = false;

  @InternalState() expanded = false;

  @InternalState() visibility = false;

  @InternalState() scrollLocation = 0;

  @InternalState() boundaryOffset = 0;

  @InternalState() maxOffset = MAX_OFFSET;

  @InternalState() minOffset = 0;

  @InternalState() minLimit = 0;

  @InternalState() pendingRelease = true;

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  get scrollTranslateOffset(): { left: number; top: number } {
    return {
      ...{ left: 0, top: 0 },
      ...{ [this.scrollProp]: this.scrollPosition },
    };
  }

  get scrollPosition(): number {
    // const thumbRatioChanged = Math.abs(this.thumbRatio - this.prevThumbRatio) > 0.01;
    // if (thumbRatioChanged) {
    // TODO: it's not relevant to add content onPullDown, ReachBottom
    // this.scrollLocation = this.boundLocation(this.scrollLocation);
    // this.prevThumbRatio = this.thumbRatio;
    // }

    return -this.scrollLocation * this.thumbRatio;
  }

  @Effect()
  updateBoundaryOffset(): void {
    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      this.boundaryOffset = this.scrollLocation - this.topPocketSize;

      if (this.boundaryOffset > 0) {
        this.maxOffset = this.topPocketSize;
      } else {
        this.maxOffset = 0;
      }
    }
  }

  @Effect()
  updateMinOffset(): void {
    if (this.props.forceGeneratePockets) {
      this.minOffset = -Math.max(
        this.bottomBoundaryOffset + this.topPocketSize + this.bottomPocketSize, 0,
      );
    } else {
      this.minOffset = -Math.max(this.bottomBoundaryOffset, 0);
    }
  }

  @Effect()
  updateMinLimit(): void {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled) {
      if (!this.props.bounceEnabled) {
        this.minLimit = -Math.max(this.bottomBoundaryOffset + this.bottomPocketSize, 0);
      } if (!this.pendingRelease) {
        this.scrollLocation = this.boundLocation(-this.bottomBoundaryOffset);
        this.pendingRelease = true;
      } if (this.isReachBottom()
      && this.scrollLocation + this.bottomBoundaryOffset + this.bottomPocketSize < 0) {
        this.minLimit = this.minOffset + this.topPocketSize;
      } else {
        this.minLimit = this.minOffset;
      }
    }
  }

  get bottomBoundaryOffset(): number {
    return this.contentSize - this.props.containerSize;
  }

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
    return this.getLocation() <= this.minOffset;
  }

  @Method()
  reachedMax(): boolean {
    return this.getLocation() >= this.maxOffset;
  }

  @Method()
  getLocation(): number {
    return this.location;
  }

  @Method()
  getScrollLocation(): number {
    if (this.props.forceGeneratePockets && this.isReachBottom()) {
      return this.boundaryOffset;
    }

    return this.scrollLocation;
  }

  @Method()
  setLocation(value: number): void {
    this.location = value;
  }

  @Method()
  inBounds(): boolean {
    return this.boundLocation() === this.getLocation();
  }

  @Method()
  boundLocation(value?: number): number {
    const currentLocation = isDefined(value) ? value : this.getLocation();

    return Math.max(
      Math.min(currentLocation, this.maxOffset), Math.max(this.minOffset, this.minLimit),
    );
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
    return this.props.direction === DIRECTION_HORIZONTAL ? 'x' : 'y';
  }

  get scrollProp(): 'left' | 'top' {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'left' : 'top';
  }

  get fullScrollProp(): 'scrollLeft' | 'scrollTop' {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'scrollLeft' : 'scrollTop';
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
        distance[this.axis] / this.containerToContentRatio(),
      );
    }

    this.scrollBy(distance);
  }

  hide(): void {
    this.visibility = false;

    /* istanbul ignore next */
    if (isDefined(this.showOnScrollByWheel) && this.props.showScrollbar === 'onScroll') {
      setTimeout(() => {
        this.showOnScrollByWheel = undefined;
      }, HIDE_SCROLLBAR_TIMEOUT);
    }
  }

  @Method()
  endHandler(velocity: { x: number; y: number }): void {
    this.props.onAnimatorStart?.('inertia', velocity[this.axis], this.thumbScrolling, this.crossThumbScrolling);
    this.resetThumbScrolling();
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
      if (this.inBounds()) {
        if (this.props.pocketState === TopPocketState.STATE_READY) {
          this.pullDownRefreshing();
          return;
        } if (this.props.pocketState === TopPocketState.STATE_LOADING) {
          this.reachBottomLoading();
          return;
        }
      }

      if (this.isReachBottom()) {
        this.pendingRelease = false;
      }
    }

    this.scrollToBounds();
  }

  pullDownRefreshing(): void {
    if (this.props.pocketState === TopPocketState.STATE_REFRESHING) {
      return;
    }

    this.setPocketState(TopPocketState.STATE_REFRESHING);
    this.props.onPullDown?.();
  }

  // eslint-disable-next-line class-methods-use-this
  reachBottomLoading(): void {
    this.props.onReachBottom?.();
  }

  scrollToBounds(): void {
    if (this.inBounds()) {
      this.hide();
      return;
    }

    this.props.onAnimatorStart?.('bounce');
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
    if (!this.inBounds()) {
      distance *= OUT_BOUNDS_ACCELERATION;
    }
    this.scrollStep(distance);
  }

  stopScrolling(): void {
    this.hide();
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
    const { scrollByThumb } = this.props;
    const scrollbarClicked = (scrollByThumb && this.isScrollbar(target));

    if (scrollbarClicked) {
      this.moveToMouseLocation(e);
    }

    // TODO: cross naming with mutable variabless (thumbScrolling -> currentThumbScrolling)
    // https://trello.com/c/ohg2pHUZ/2579-mutable-cross-naming
    const currentThumbScrolling = scrollbarClicked || (scrollByThumb && this.isThumb(target));
    this.thumbScrolling = currentThumbScrolling;
    this.crossThumbScrolling = !currentThumbScrolling && currentCrossThumbScrolling;

    if (currentThumbScrolling) {
      this.expand();
    }
  }

  moveToMouseLocation(e): void {
    const mouseLocation = e[`page${this.axis.toUpperCase()}`] - this.props.scrollableOffset;
    const location = this.scrollLocation + mouseLocation
    / this.containerToContentRatio() - this.props.containerSize / 2;

    this.scrollStep(-Math.round(location));
  }

  @Method()
  scrollStep(delta: number): void {
    this.setLocation(this.scrollLocation + delta);
    this.suppressBounce();
    this.moveScrollbar();
  }

  suppressBounce(): void {
    if (this.props.bounceEnabled || this.inBounds()) {
      return;
    }

    this.setLocation(this.boundLocation());
  }

  @Method()
  moveScrollbar(location?: number): void {
    const currentLocation = isDefined(location)
      ? location * this.props.scaleRatio
      : this.getLocation();

    this.setLocation(currentLocation);
    this.scrollLocation = currentLocation;

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

  @Effect() updateContent(): void {
    const location = this.scrollLocation;

    let currentTranslateOffset: number;
    if (location > 0) {
      currentTranslateOffset = location;
    } else if (location <= this.minOffset) {
      currentTranslateOffset = location - this.minOffset;
    } else {
      currentTranslateOffset = location % 1;
    }

    if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
      currentTranslateOffset -= this.props.topPocketSize;
    }

    // there is an issue https://stackoverflow.com/questions/49219462/webkit-scrollleft-css-translate-horizontal-bug
    this.props.contentPositionChange?.(this.fullScrollProp, location, this.props.scaleRatio);
    this.props.contentTranslateOffsetChange?.({ [this.scrollProp]: currentTranslateOffset });
  }

  stateReleased(): void {
    if (this.props.pocketState === TopPocketState.STATE_RELEASED) {
      return;
    }

    this.setPocketState(TopPocketState.STATE_RELEASED);
    this.props.onRelease?.();
  }

  @Method()
  releaseHandler(): void {
    this.release();
  }

  release(): void {
    this.stateReleased();
    this.scrollComplete();
    if (this.isReachBottom()) {
      this.scrollLocation = this.boundLocation(-(this.contentSize - this.props.containerSize));
    }
  }

  setPocketState(state: number): void {
    this.props.pocketStateChange?.(state);
  }

  isPullDown(): boolean {
    return this.props.pullDownEnabled && this.props.bounceEnabled && this.boundaryOffset >= 0;
  }

  isReachBottom(): boolean {
    return this.props.reachBottomEnabled
      && (this.scrollLocation - this.minOffset - this.topPocketSize - this.bottomPocketSize <= 0.5);
  }

  get thumbSize(): number {
    const { containerSize, scaleRatio } = this.props;

    const size = Math.round(
      Math.max(Math.round(containerSize * this.containerToContentRatio()), THUMB_MIN_SIZE),
    );

    // console.log('size', size / scaleRatio);
    return size / scaleRatio;
  }

  get thumbRatio(): number {
    const { containerSize, scaleRatio } = this.props;

    if (this.contentSize) {
      return (containerSize - this.thumbSize) / (scaleRatio * (this.contentSize - containerSize));
    }

    return 1;
  }

  get contentSize(): number {
    if (this.props.contentSize) {
      return this.props.contentSize - this.bottomPocketSize - this.topPocketSize;
    }
    return 0;
  }

  containerToContentRatio(): number {
    return this.contentSize
      ? this.props.containerSize / this.contentSize
      : this.props.containerSize;
  }

  baseContainerToContentRatio(): number {
    const { baseContainerSize, baseContentSize } = this.props;

    return (baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize);
  }

  get dimension(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'width' : 'height';
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
      [this.dimension]: `${this.thumbSize || THUMB_MIN_SIZE}px`,
      transform: this.props.showScrollbar === 'never'
        ? 'none'
        : `translate(${this.scrollTranslateOffset.left}px, ${this.scrollTranslateOffset.top}px)`,
    };
  }

  get scrollClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.visible,
    });
  }

  get isVisible(): boolean {
    return this.props.showScrollbar !== 'never' && this.baseContainerToContentRatio() < 1;
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
