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
// import { Deferred } from '../../../core/utils/deferred';
// import type { dxPromise } from '../../../core/utils/deferred';
import devices from '../../../core/devices';
import { BounceAnimator } from './bounce_animator';
import { InertiaAnimator } from './inertia_animator';

import { ScrollbarProps } from './scrollbar_props';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS,
} from './scrollable_utils';

import {
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

import BaseWidgetProps from '../../utils/base_props';
import { ScrollableSimulatedProps } from './scrollable_simulated_props';

const OUT_BOUNDS_ACCELERATION = 0.5;

const realDevice = devices.real;
const isSluggishPlatform = (realDevice as any).platform === 'android';
/* istanbul ignore next */
const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const FRAME_DURATION = 17; // Math.round(1000 / 60)
/* istanbul ignore next */
const BOUNCE_DURATION = isSluggishPlatform ? 300 : 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
const BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);

const SCROLLABLE_SCROLLBAR_ACTIVE_CLASS = 'dx-scrollable-scrollbar-active';
const SCROLLABLE_SCROLL_CLASS = 'dx-scrollable-scroll';
const SCROLLABLE_SCROLL_CONTENT_CLASS = 'dx-scrollable-scroll-content';
const HOVER_ENABLED_STATE = 'dx-scrollbar-hoverable';

const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    cssClasses, styles, scrollRef, scrollbarRef, hoverStateEnabled,
    isVisible, windowResizeHandler,
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
      onDimensionChanged={windowResizeHandler}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <div className={viewModel.scrollClasses} style={styles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

type ScrollbarPropsType = ScrollbarProps & Pick<BaseWidgetProps, 'visible'>
& Pick<ScrollableSimulatedProps, 'contentPositionChange' | 'contentTranslateOffset' | 'contentTranslateOffsetChange'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() inertiaAnimator?: InertiaAnimator;

  @Mutable() bounceAnimator?: BounceAnimator;

  @Mutable() velocity = 0;

  @Mutable() bounceLocation = 0;

  @Mutable() location = 0;

  @Mutable() thumbScrolling = false;

  @Mutable() crossThumbScrolling = false;

  @Mutable() translateOffset?: number;

  @Mutable() windowSizeChanged?: boolean;

  @Mutable() prevThumbRatio = 0;

  @Mutable() pendingThumbScrolling?: boolean;

  @InternalState() active = false;

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
    const thumbRatioChanged = (this.thumbRatio - this.prevThumbRatio) > 0.01;
    if (this.windowSizeChanged || thumbRatioChanged) {
      this.scrollLocation = this.boundLocation(this.scrollLocation);
      this.windowSizeChanged = undefined;
      this.prevThumbRatio = this.thumbRatio;
    }

    return -this.scrollLocation * this.thumbRatio;
  }

  // @Method()
  // getDirection(): Partial<ScrollableDirection> { // 'vertical' & 'horizontal'
  //   return this.props.direction;
  // }

  @Effect()
  pointerDownEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerDown.on(this.scrollRef,
      () => {
        this.feedbackOn();
      }, { namespace });

    return (): void => dxPointerDown.off(this.scrollRef, { namespace });
  }

  @Effect()
  pointerUpEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollbar';

    dxPointerUp.on(domAdapter.getDocument(),
      () => {
        this.feedbackOff();
      }, { namespace });

    return (): void => dxPointerUp.off(this.scrollRef, { namespace });
  }

  @Effect()
  setupAnimators(): () => void {
    const animatorConfig = this.getAnimatorArgs();

    this.inertiaAnimator = new InertiaAnimator(animatorConfig);
    this.bounceAnimator = new BounceAnimator(animatorConfig);

    return (): void => {
      this.inertiaAnimator = undefined;
      this.bounceAnimator = undefined;
    };
  }

  getAnimatorArgs(): Pick<Scrollbar, 'getVelocity' | 'setVelocity' | 'inBounds' | 'scrollStep' | 'scrollComplete' | 'stopComplete' | 'crossBoundOnNextStep' | 'move' | 'getBounceLocation'> {
    return {
      getVelocity: this.getVelocity.bind(this),
      setVelocity: this.setVelocity.bind(this),
      inBounds: this.inBounds.bind(this),
      scrollStep: this.scrollStep.bind(this),
      scrollComplete: this.scrollComplete.bind(this),
      stopComplete: this.stopComplete.bind(this),
      crossBoundOnNextStep: this.crossBoundOnNextStep.bind(this),
      move: this.move.bind(this),
      getBounceLocation: this.getBounceLocation.bind(this),
    };
  }

  /* istanbul ignore next */
  crossBoundOnNextStep(): boolean {
    const location = this.getLocation();
    const nextLocation = location + this.velocity;

    return (location < this.getMinOffset() && nextLocation >= this.getMinOffset())
        || (location > this.getMaxOffset() && nextLocation <= this.getMaxOffset());
  }

  @Method()
  isThumb(element: HTMLDivElement): boolean {
    return this.scrollbarRef.querySelector(`.${SCROLLABLE_SCROLL_CLASS}`) === element
      || this.scrollbarRef.querySelector(`.${SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }

  @Method()
  isScrollbar(element: HTMLDivElement): boolean {
    return element === this.scrollbarRef;
  }

  @Method()
  validateEvent(event): boolean {
    const { target } = event.originalEvent;

    return (this.isThumb(target) || this.isScrollbar(target));
  }

  @Method()
  reachedMin(): boolean {
    return this.getLocation() <= this.getMinOffset();
  }

  @Method()
  reachedMax(): boolean {
    return this.getLocation() >= this.getMaxOffset();
  }

  @Method()
  getLocation(): number {
    return this.location;
  }

  @Method()
  setLocation(value: number): void {
    this.location = value;
  }

  inBounds(): boolean {
    return this.boundLocation() === this.getLocation();
  }

  // @Method()
  // insideBounds(): boolean {
  //   return this.inBounds();
  // }

  @Method()
  boundLocation(value?: number): number {
    const currentLocation = isDefined(value) ? value : this.getLocation();

    return Math.max(Math.min(currentLocation, this.getMaxOffset()), this.getMinOffset());
  }

  // eslint-disable-next-line class-methods-use-this
  getMaxOffset(): number {
    return 0;
  }

  @Method()
  getMinOffset(): number {
    return Math.round(-Math.max(this.props.contentSize - this.props.containerSize, 0));
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
  initHandler(e, crossThumbScrolling: boolean): void { // dxPromise<void> {
    // const stopDeferred = Deferred<void>();

    this.stopScrolling();

    this.prepareThumbScrolling(e, crossThumbScrolling);

    // return stopDeferred.promise();
  }

  @Method()
  startHandler(): void {
    this.show();
  }

  @Method()
  moveHandler(delta: any): void {
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

  @Method()
  endHandler(velocity): void {
    this.velocity = velocity[this.axis];
    this.inertiaHandler();
    this.resetThumbScrolling();
  }

  @Method()
  stopHandler(): void {
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

    this.props.onBounce?.();
    this.setupBounce();
    this.bounceAnimator?.start();
  }

  setupBounce(): void {
    this.setBounceLocation(this.boundLocation());

    const bounceDistance = this.getBounceLocation() - this.getLocation();

    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line class-methods-use-this
  stopComplete(): void { // TODO: it needs if we deside to use the Promises
    this.velocity = 0;
    // if(this._stopDeferred) {
    //     this._stopDeferred.resolve();
    // }
  }

  inertiaHandler(): void {
    this.suppressInertia();
    this.inertiaAnimator?.start();
  }

  suppressInertia(): void {
    if (!this.props.inertiaEnabled || this.thumbScrolling) {
      this.velocity = 0;
    }
  }

  resetThumbScrolling(): void {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }

  scrollBy(delta): void {
    let distance = delta[this.axis];
    if (!this.inBounds()) {
      distance *= OUT_BOUNDS_ACCELERATION;
    }
    this.scrollStep(distance);
  }

  stopScrolling(): void {
    this.hide();
    this.inertiaAnimator?.stop();
    this.bounceAnimator?.stop();
  }

  // TODO: cross naming with mutable variabless (crossThumbScrolling -> currentCrossThumbScrolling)
  // https://trello.com/c/ohg2pHUZ/2579-mutable-cross-naming
  prepareThumbScrolling(e, currentCrossThumbScrolling: boolean): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
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

  scrollStep(delta): void {
    this.setLocation(this.getLocation() + delta);
    this.suppressBounce();
    this.move();
  }

  show(): void {
    this.props.scrollVisibilityChange?.(true);
  }

  hide(): void {
    this.props.scrollVisibilityChange?.(false);
  }

  getVelocity(): number {
    return this.velocity;
  }

  setBounceLocation(value: number): void {
    this.bounceLocation = value;
  }

  getBounceLocation(): number {
    return this.bounceLocation;
  }

  setVelocity(value: number): void {
    this.velocity = value;
  }

  suppressBounce(): void {
    if (this.props.bounceEnabled || this.inBounds()) {
      return;
    }

    this.velocity = 0;
    this.setLocation(this.boundLocation());
  }

  move(location?: number): void {
    const currentLocation = location !== undefined
      ? location * this.props.scaleRatio
      : this.getLocation();

    this.setLocation(currentLocation);
    this.scrollLocation = currentLocation;

    this.moveContent();
  }

  // @Method()
  // moveToLocation(): void {
  //   this.move();
  // }

  moveContent(): void {
    const location = this.getLocation();
    const minOffset = this.getMinOffset();

    let currentTranslateOffset: number;
    if (location > 0) {
      currentTranslateOffset = location;
    } else if (location <= minOffset) {
      currentTranslateOffset = location - minOffset;
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

    return 0;
  }

  containerToContentRatio(): number {
    const { contentSize, containerSize } = this.props;

    return (contentSize ? containerSize / contentSize : containerSize);
  }

  baseContainerToContentRatio(): number {
    const { baseContainerSize, baseContentSize } = this.props;

    return (baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize);
  }

  windowResizeHandler(): void {
    this.windowSizeChanged = true;
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
      'dx-state-invisible': !(this.props.visible && this.baseContainerToContentRatio() < 1),
    });
  }

  get isVisible(): boolean {
    return this.props.showScrollbar !== 'never' && this.baseContainerToContentRatio() < 1;
  }

  get hoverStateEnabled(): boolean {
    const { showScrollbar, scrollByThumb } = this.props;
    return (showScrollbar === 'onHover' || showScrollbar === 'always') && scrollByThumb;
  }
}
