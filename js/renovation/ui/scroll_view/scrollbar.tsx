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
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS,
} from './scrollable_utils';

import {
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

import { ScrollableSimulatedProps } from './scrollable_simulated_props';

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
    cssClasses, styles, scrollRef, scrollbarRef, hoverStateEnabled,
    onHoverStartHandler, onHoverEndHandler, isVisible,
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
      onHoverStart={onHoverStartHandler}
      onHoverEnd={onHoverEndHandler}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <div className={viewModel.scrollClasses} style={styles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

export type ScrollbarPropsType = ScrollbarProps
& Pick<ScrollableSimulatedProps, 'contentPositionChange' | 'contentTranslateOffset' | 'contentTranslateOffsetChange'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() location = 0;

  @Mutable() thumbScrolling = false;

  @Mutable() crossThumbScrolling = false;

  @Mutable() translateOffset?: number;

  @Mutable() prevThumbRatio = 1;

  @InternalState() showOnScrollByWheel?: boolean;

  @InternalState() hovered = false;

  @InternalState() active = false;

  @InternalState() visibility = false;

  @InternalState() scrollLocation = 0;

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  get scrollTranslateOffset(): { left: number; top: number } {
    return {
      ...{ left: 0, top: 0 },
      ...{ [this.scrollProp]: this.scrollPosition },
    };
  }

  get scrollPosition(): number {
    const thumbRatioChanged = Math.abs(this.thumbRatio - this.prevThumbRatio) > 0.01;
    if (thumbRatioChanged) {
      this.scrollLocation = this.boundLocation(this.scrollLocation);
      this.prevThumbRatio = this.thumbRatio;
    }

    return -this.scrollLocation * this.thumbRatio;
  }

  @Effect()
  pointerDownEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerDown.on(this.scrollRef.current,
      () => {
        this.feedbackOn();
      }, { namespace });

    return (): void => dxPointerDown.off(this.scrollRef.current, { namespace });
  }

  @Effect()
  pointerUpEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerUp.on(domAdapter.getDocument(),
      () => {
        this.feedbackOff();
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

    return Math.max(Math.min(currentLocation, this.maxOffset), this.minOffset);
  }

  @Method()
  getMinOffset(): number {
    return this.minOffset;
  }

  @Method()
  getMaxOffset(): number {
    return this.maxOffset;
  }

  get minOffset(): number {
    return Math.round(-Math.max(this.props.contentSize - this.props.containerSize, 0));
  }

  // eslint-disable-next-line class-methods-use-this
  get maxOffset(): number {
    return MAX_OFFSET;
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
    if (this.inBounds()) {
      this.hide();
    }

    this.scrollToBounds();
  }

  scrollToBounds(): void {
    if (this.inBounds()) {
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
      this.feedbackOn();
    }
  }

  moveToMouseLocation(e): void {
    const mouseLocation = e[`page${this.axis.toUpperCase()}`] - this.props.scrollableOffset;
    const location = this.getLocation() + mouseLocation
    / this.containerToContentRatio() - this.props.containerSize / 2;

    this.scrollStep(-Math.round(location));
  }

  @Method()
  scrollStep(delta: number): void {
    this.setLocation(this.getLocation() + delta);
    this.suppressBounce();
    this.move();
  }

  suppressBounce(): void {
    if (this.props.bounceEnabled || this.inBounds()) {
      return;
    }

    this.setLocation(this.boundLocation());
  }

  @Method()
  move(location?: number): void {
    this.moveScrollbar(location);
    this.moveContent();
  }

  @Method()
  moveScrollbar(location?: number): void {
    const currentLocation = location !== undefined
      ? location * this.props.scaleRatio
      : this.getLocation();

    this.setLocation(currentLocation);
    this.scrollLocation = currentLocation;
  }

  moveContent(): void {
    const location = this.getLocation();

    let currentTranslateOffset: number;
    if (location > 0) {
      currentTranslateOffset = location;
    } else if (location <= this.minOffset) {
      currentTranslateOffset = location - this.minOffset;
    } else {
      currentTranslateOffset = location % 1;
    }

    // there is an issue https://stackoverflow.com/questions/49219462/webkit-scrollleft-css-translate-horizontal-bug
    this.props.contentPositionChange?.(this.fullScrollProp, location, this.props.scaleRatio);
    this.props.contentTranslateOffsetChange?.({ [this.scrollProp]: currentTranslateOffset });
  }

  get thumbSize(): number {
    const { containerSize, scaleRatio } = this.props;

    const size = Math.round(
      Math.max(Math.round(containerSize * this.containerToContentRatio()), THUMB_MIN_SIZE),
    );

    return size / scaleRatio;
  }

  get thumbRatio(): number {
    const { contentSize, containerSize, scaleRatio } = this.props;

    if (contentSize) {
      return (containerSize - this.thumbSize) / (scaleRatio * (contentSize - containerSize));
    }

    return 1;
  }

  containerToContentRatio(): number {
    const { contentSize, containerSize } = this.props;

    return (contentSize ? containerSize / contentSize : containerSize);
  }

  baseContainerToContentRatio(): number {
    const { baseContainerSize, baseContentSize } = this.props;

    return (baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize);
  }

  get dimension(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'width' : 'height';
  }

  feedbackOn(): void {
    this.active = true;
  }

  feedbackOff(): void {
    this.active = false;
  }

  onHoverStartHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = true;
    }
  }

  onHoverEndHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = false;
    }
  }

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${direction}`]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: !!this.active,
      [HOVER_ENABLED_STATE]: !!this.hoverStateEnabled,
    };
    return combineClasses(classesMap);
  }

  get styles(): { [key: string]: string | number } {
    return {
      [this.dimension]: this.thumbSize || THUMB_MIN_SIZE,
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
