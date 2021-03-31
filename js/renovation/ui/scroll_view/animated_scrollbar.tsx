import {
  Component,
  JSXComponent,
  RefObject,
  Ref,
  Mutable,
  ComponentBindings,
  Method,
  Event,
} from '@devextreme-generator/declarations';
import { isDefined } from '../../../core/utils/type';
import devices from '../../../core/devices';

import { Scrollbar } from './scrollbar';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../animation/frame';
import { ScrollbarProps } from './scrollbar_props';
import { ScrollableSimulatedProps } from './scrollable_simulated_props';
import { EventCallback } from '../common/event_callback.d';

export const OUT_BOUNDS_ACCELERATION = 0.5;

const realDevice = devices.real;
const isSluggishPlatform = (realDevice as any).platform === 'android';
/* istanbul ignore next */
export const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
export const MIN_VELOCITY_LIMIT = 1;
export const BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;

const FRAME_DURATION = 17; // Math.round(1000 / 60)
/* istanbul ignore next */
const BOUNCE_DURATION = isSluggishPlatform ? 300 : 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
export const BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);

export const viewFunction = (viewModel: AnimatedScrollbar): JSX.Element => {
  const {
    scrollbarRef, start, cancel,
    props: { onBounce, inertiaEnabled, ...scrollbarProps },
    restAttributes,
  } = viewModel;

  return (
    <Scrollbar
      ref={scrollbarRef}
      onAnimatorStart={start}
      onAnimatorCancel={cancel}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...scrollbarProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    />
  );
};

@ComponentBindings()
export class AnimatedScrollbarProps extends ScrollbarProps {
  @Event() onBounce?: EventCallback;
}

type AnimatedScrollbarPropsType = AnimatedScrollbarProps
& Pick<ScrollableSimulatedProps, 'inertiaEnabled' | 'contentPositionChange' | 'contentTranslateOffset' | 'contentTranslateOffsetChange'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class AnimatedScrollbar extends JSXComponent<AnimatedScrollbarPropsType>() {
  @Ref() scrollbarRef!: RefObject<Scrollbar>;

  @Mutable() stepAnimationFrame = 0;

  @Mutable() finished = true;

  @Mutable() stopped = false;

  @Mutable() velocity = 0;

  @Mutable() animator = 'inertia';

  start(animatorName: 'inertia'| 'bounce', receivedVelocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean): void {
    this.animator = animatorName;

    if (this.isBounceAnimator) {
      this.props.onBounce?.();
      this.setupBounce();
    } else {
      if (!thumbScrolling && crossThumbScrolling) {
        this.velocity = 0;
      } else {
        this.velocity = receivedVelocity || 0;
      }

      this.suppressInertia(thumbScrolling);
    }

    this.stopped = false;
    this.finished = false;
    this.stepCore();
  }

  cancel(): void {
    this.stopped = true;
    cancelAnimationFrame(this.stepAnimationFrame);
  }

  stepCore(): void {
    if (this.stopped) {
      this.stop();
      return;
    }

    if (this.isFinished) {
      this.finished = true;
      this.complete();
      return;
    }

    this.step();
    this.stepAnimationFrame = this.getStepAnimationFrame();
  }

  /* istanbul ignore next */
  getStepAnimationFrame(): number {
    return requestAnimationFrame(this.stepCore);
  }

  step(): void {
    if (!this.props.bounceEnabled && !this.inBounds()) {
      this.velocity = 0;
    }

    this.scrollStep(this.velocity);

    this.velocity *= this.acceleration;
  }

  setupBounce(): void {
    const bounceDistance = this.boundLocation() - this.getScrollLocation();

    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  complete(): void {
    if (this.isBounceAnimator) {
      this.moveScrollbar(this.boundLocation());
    }

    this.scrollComplete();
  }

  get isBounceAnimator(): boolean {
    return this.animator === 'bounce';
  }

  get isFinished(): boolean {
    if (this.isBounceAnimator) {
      return this.crossBoundOnNextStep()
        || Math.abs(this.velocity) <= BOUNCE_MIN_VELOCITY_LIMIT;
    }

    return Math.abs(this.velocity) <= MIN_VELOCITY_LIMIT;
  }

  get inProgress(): boolean {
    return !(this.stopped || this.finished);
  }

  get acceleration(): number {
    if (!isDefined(this.scrollbarRef?.current)) {
      return 0;
    }

    return this.inBounds() || this.isBounceAnimator
      ? ACCELERATION
      : OUT_BOUNDS_ACCELERATION;
  }

  stop(): void {
    this.stopComplete();
  }

  suppressInertia(thumbScrolling?: boolean): void {
    if (!this.props.inertiaEnabled || thumbScrolling) {
      this.velocity = 0;
    }
  }

  /* istanbul ignore next */
  crossBoundOnNextStep(): boolean {
    const location = this.getScrollLocation();
    const nextLocation = location + this.velocity;

    const minOffset = this.getMinOffset();
    const maxOffset = this.getMaxOffset();

    return (location < minOffset && nextLocation >= minOffset)
      || (location > maxOffset && nextLocation <= maxOffset);
  }

  inBounds(): boolean {
    const scrollbar = this.scrollbarRef.current;

    if (!isDefined(scrollbar)) {
      return false;
    }

    return scrollbar.inBounds();
  }

  getMaxOffset(): number {
    return this.scrollbar.getMaxOffset();
  }

  scrollStep(delta: number): void {
    return this.scrollbar.scrollStep(delta);
  }

  moveScrollbar(location?: number): void {
    return this.scrollbar.moveScrollbar(location);
  }

  stopComplete(): void {
    return this.scrollbar.stopComplete();
  }

  scrollComplete(): void {
    return this.scrollbar.scrollComplete();
  }

  @Method()
  boundLocation(value?: number): number {
    return this.scrollbar.boundLocation(value);
  }

  @Method()
  getScrollLocation(): number {
    return this.scrollbar.getScrollLocation();
  }

  @Method()
  getMinOffset(): number {
    return this.scrollbar.getMinOffset();
  }

  @Method()
  validateEvent(e): boolean {
    return this.scrollbar.validateEvent(e);
  }

  @Method()
  isThumb(element: HTMLDivElement): boolean {
    return this.scrollbar.isThumb(element);
  }

  @Method()
  reachedMin(): boolean {
    return this.scrollbar.reachedMin();
  }

  @Method()
  reachedMax(): boolean {
    return this.scrollbar.reachedMax();
  }

  @Method()
  initHandler(e, crossThumbScrolling: boolean): void {
    this.scrollbar.initHandler(e, crossThumbScrolling);
  }

  @Method()
  startHandler(): void {
    this.scrollbar.startHandler();
  }

  @Method()
  moveHandler(delta: { x: number; y: number }): void {
    this.scrollbar.moveHandler(delta);
  }

  @Method()
  endHandler(velocity: { x: number; y: number }): void {
    this.scrollbar.endHandler(velocity);
  }

  @Method()
  stopHandler(): void {
    this.scrollbar.stopHandler();
  }

  @Method()
  scrollByHandler(delta: { x: number; y: number }): void {
    this.scrollbar.scrollByHandler(delta);
  }

  @Method()
  releaseHandler(): void {
    this.scrollbar.releaseHandler();
  }

  get scrollbar(): Scrollbar {
    return this.scrollbarRef.current!;
  }
}
