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
import { isPlainObject } from '../../../core/utils/type';
import { move, resetPosition } from '../../../animation/translator';
import { isDxMouseWheelEvent } from '../../../events/utils/index';
import { Deferred } from '../../../core/utils/deferred';
import type { dxPromise } from '../../../core/utils/deferred';
import { titleize } from '../../../core/utils/inflector';
import { EventCallback } from '../common/event_callback.d';
import devices from '../../../core/devices';
import { BounceAnimator } from './bounce_animator';
import { InertiaAnimator } from './inertia_animator';

import { ScrollbarProps } from './scrollbar_props';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS,
  getElementHeight,
} from './scrollable_utils';

import {
  dxPointerDown,
  dxPointerUp,
} from '../../../events/short';

import BaseWidgetProps from '../../utils/base_props';

const OUT_BOUNDS_ACCELERATION = 0.5;

const realDevice = devices.real;
const isSluggishPlatform = (realDevice as any).platform === 'android';

const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const FRAME_DURATION = Math.round(1000 / 60);

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
    isVisible,
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <div className={viewModel.scrollClasses} style={styles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

type ScrollbarPropsType = ScrollbarProps & Pick<BaseWidgetProps, 'visible'>;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() inertiaAnimator?: InertiaAnimator;

  @Mutable() bounceAnimator?: BounceAnimator;

  @Mutable() velocity = 0;

  @Mutable() bounceLocation?: number;

  @InternalState() active = false;

  @InternalState() cachedVariables = {
    location: 0,
    thumbScrolling: false,
    crossThumbScrolling: false,
    translateOffset: undefined,
  };

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Method()
  moveTo(location): void {
    const { showScrollbar } = this.props;

    if (showScrollbar === 'never') {
      return;
    }

    let position = location;
    const prop = this.props.direction === DIRECTION_HORIZONTAL ? 'left' : 'top';

    if (isPlainObject(location)) {
      position = location[prop] || 0;
    }

    const scrollBarLocation = {};
    scrollBarLocation[prop] = this.calculateScrollBarPosition(position);
    move(this.scrollRef, scrollBarLocation);
  }

  calculateScrollBarPosition(location): number {
    return -location * this.thumbRatio();
  }

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

  crossBoundOnNextStep(): boolean {
    const { location } = this.cachedVariables;
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
    return this.cachedVariables.location;
  }

  @Method()
  setLocation(location: number): void {
    this.cachedVariables.location = location;
  }

  inBounds(): boolean {
    return this.boundLocation() === this.getLocation();
  }

  boundLocation(): number {
    return Math.max(Math.min(this.getLocation(), this.getMaxOffset()), this.getMinOffset());
  }

  // eslint-disable-next-line class-methods-use-this
  getMaxOffset(): number {
    return 0;
  }

  @Method()
  getMinOffset(): number {
    return Math.round(-Math.max(this.props.contentSize - this.props.containerSize, 0));
  }

  getAxis(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'x' : 'y';
  }

  getProp(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'left' : 'top';
  }

  @Method()
  initHandler(e, action: EventCallback<Event> | undefined,
    crossThumbScrolling: boolean): dxPromise<void> {
    const stopDeferred = Deferred<void>();

    this.stopScrolling();

    this.prepareThumbScrolling(e, crossThumbScrolling);
    action?.(e);

    return stopDeferred.promise();
  }

  @Method()
  startHandler(): void {
    this.show();
  }

  @Method()
  moveHandler(delta: any): void {
    if (this.cachedVariables.crossThumbScrolling) {
      return;
    }
    const distance = delta;

    if (this.cachedVariables.thumbScrolling) {
      distance[this.getAxis()] = -Math.round(
        distance[this.getAxis()] / this.containerToContentRatio(),
      );
    }

    this.scrollBy(distance);
  }

  @Method()
  endHandler(velocity): void {
    this.velocity = velocity[this.getAxis()];
    this.inertiaHandler();
    this.resetThumbScrolling();
  }

  @Method()
  stopHandler(): void {
    if (this.cachedVariables.thumbScrolling) {
      this.scrollComplete();
    }
    this.resetThumbScrolling();
    this.scrollToBounds();
  }

  @Method()
  scrollByHandler(delta: { x: number; y: number}): void {
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
    // this._bounceAction();
    this.setupBounce();
    this.bounceAnimator?.start();
  }

  setupBounce(): void {
    this.bounceLocation = this.boundLocation();

    const bounceDistance = this.bounceLocation - this.cachedVariables.location;

    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  // eslint-disable-next-line class-methods-use-this
  stopComplete(): void {
    // if(this._stopDeferred) {
    //     this._stopDeferred.resolve();
    // }
  }

  inertiaHandler(): void {
    this.suppressInertia();
    this.inertiaAnimator?.start();
  }

  suppressInertia(): void {
    if (!this.props.inertiaEnabled || this.cachedVariables.thumbScrolling) {
      this.velocity = 0;
    }
  }

  resetThumbScrolling(): void {
    this.cachedVariables.thumbScrolling = false;
    this.cachedVariables.crossThumbScrolling = false;
  }

  scrollBy(delta): void {
    let distance = delta[this.getAxis()];
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

  prepareThumbScrolling(e, crossThumbScrolling: boolean): void {
    if (isDxMouseWheelEvent(e.originalEvent)) {
      return;
    }

    const { target } = e.originalEvent;
    const { scrollByThumb } = this.props;
    const scrollbarClicked = (scrollByThumb && this.isScrollbar(target));

    if (scrollbarClicked) {
      this.moveToMouseLocation(e);
    }

    const thumbScrolling = scrollbarClicked || (scrollByThumb && this.isThumb(target));
    this.cachedVariables.thumbScrolling = thumbScrolling;
    this.cachedVariables.crossThumbScrolling = !thumbScrolling && crossThumbScrolling;

    if (thumbScrolling) {
      this.feedbackOn();
    }
  }

  moveToMouseLocation(e): void {
    const { scrollableOffset } = this.props;

    const mouseLocation = e[`page${this.getAxis().toUpperCase()}`] - scrollableOffset;
    const location = this.getLocation() + mouseLocation
    / this.containerToContentRatio() - getElementHeight(this.getContainerRef().current) / 2;

    this.scrollStep(-Math.round(location));
  }

  scrollStep(delta): void {
    const prevLocation = this.getLocation();

    this.setLocation(prevLocation + delta);
    this.suppressBounce();
    this.move();

    /* istanbul ignore next */
    if (Math.abs(prevLocation - this.getLocation()) < 1) {
      // eslint-disable-next-line no-useless-return
      return;
    }

    // eventsEngine.triggerHandler(this.props.containerRef, { type: 'scroll' }); // TODO
  }

  show(): void {
    this.props.onChangeVisibility?.(true);
  }

  hide(): void {
    this.props.onChangeVisibility?.(false);
  }

  getVelocity(): number {
    return this.velocity;
  }

  getBounceLocation(): number | undefined {
    return this.bounceLocation;
  }

  setVelocity(value: number): void {
    this.velocity = value;
  }

  getContainerRef(): any {
    return this.props.containerRef;
  }

  getContentRef(): any {
    return this.props.contentRef;
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

    this.moveContent();
    this.moveTo(this.getLocation());
  }

  moveContent(): void {
    const location = this.getLocation();

    this.getContainerRef().current[`scroll${titleize(this.getProp())}`] = -location / this.props.scaleRatio;
    this.moveContentByTranslator(location);
  }

  moveContentByTranslator(location): undefined | void {
    let translateOffset;
    const minOffset = this.getMinOffset();

    /* istanbul ignore next */
    if (location > 0) {
      translateOffset = location;
    } else if (location <= minOffset) {
      /* istanbul ignore next */
      translateOffset = location - minOffset;
    } else {
      translateOffset = location % 1;
    }

    if (this.cachedVariables.translateOffset === translateOffset) {
      return;
    }

    const targetLocation = {};
    targetLocation[this.getProp()] = translateOffset;
    this.cachedVariables.translateOffset = translateOffset;

    if (translateOffset === 0) {
      resetPosition(this.getContentRef().current);
      return;
    }

    move(this.getContentRef().current, targetLocation);
  }

  thumbSize(): number {
    const { containerSize, scaleRatio } = this.props;

    const size = Math.round(
      Math.max(Math.round(containerSize * this.containerToContentRatio()), THUMB_MIN_SIZE),
    );

    return size / scaleRatio;
  }

  thumbRatio(): number {
    const { contentSize, containerSize, scaleRatio } = this.props;

    return (containerSize - this.thumbSize()) / (scaleRatio * (contentSize - containerSize));
  }

  containerToContentRatio(): number {
    const { contentSize, containerSize } = this.props;

    return (contentSize ? containerSize / contentSize : containerSize);
  }

  baseContainerToContentRatio(): number {
    const { baseContainerSize, baseContentSize } = this.props;

    return (baseContentSize ? baseContainerSize / baseContentSize : baseContainerSize);
  }

  private getDimension(): string {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'width' : 'height';
  }

  private feedbackOn(): void {
    this.active = true;
  }

  private feedbackOff(): void {
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
    const style = this.restAttributes.style || {};

    return {
      ...style,
      [this.getDimension()]: this.thumbSize() || THUMB_MIN_SIZE,
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
