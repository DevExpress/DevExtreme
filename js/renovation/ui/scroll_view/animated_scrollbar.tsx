import {
  Component,
  JSXComponent,
  RefObject,
  Ref,
  Mutable,
  ComponentBindings,
  Method,
  Event,
  Effect,
  InternalState,
} from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { BaseWidgetProps } from '../common/base_props';
import { isDefined } from '../../../core/utils/type';

import { Scrollbar } from './scrollbar';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../animation/frame';
import { ScrollbarProps } from './common/scrollbar_props';
import { ScrollableSimulatedProps } from './common/simulated_strategy_props';
import { EventCallback } from '../common/event_callback';
import { inRange } from '../../../core/utils/math';
import { DxMouseEvent } from './common/types.d';
import { clampIntoRange } from './utils/clamp_into_range';

export const OUT_BOUNDS_ACCELERATION = 0.5;

export const ACCELERATION = 0.92;
export const MIN_VELOCITY_LIMIT = 1;
export const BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;

const FRAME_DURATION = 17; // Math.round(1000 / 60)
const BOUNCE_DURATION = 400;
const BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
export const BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);

export const viewFunction = (viewModel: AnimatedScrollbar): JSX.Element => {
  const {
    scrollbarRef, start, cancel, maxOffset,
    onEnd, onRelease,
    props: {
      direction,
      scrollableOffset, contentSize, containerSize,
      showScrollbar, scrollByThumb, bounceEnabled,
      forceGeneratePockets, pullDownEnabled, reachBottomEnabled,
      scrollLocation, scrollLocationChange,
      isScrollableHovered, topPocketSize, bottomPocketSize,
      onPullDown, onReachBottom, onScroll,
      pocketState, pocketStateChange,
      rtlEnabled, contentPaddingBottom,
      containerHasSizes,
      onLock, onUnlock,
      // maxOffset,
    },
  } = viewModel;

  return (
    <Scrollbar
      ref={scrollbarRef}
      direction={direction}
      onAnimatorStart={start}
      onAnimatorCancel={cancel}
      scrollableOffset={scrollableOffset}
      contentSize={contentSize}
      containerSize={containerSize}
      isScrollableHovered={isScrollableHovered}
      maxOffset={maxOffset}
      scrollLocation={scrollLocation}
      scrollLocationChange={scrollLocationChange}
      scrollByThumb={scrollByThumb}
      bounceEnabled={bounceEnabled}
      showScrollbar={showScrollbar}
      onScroll={onScroll}
      onEnd={onEnd}
      containerHasSizes={containerHasSizes}
      // Horizontal
      rtlEnabled={rtlEnabled}
      // Vertical
      forceGeneratePockets={forceGeneratePockets}
      topPocketSize={topPocketSize}
      bottomPocketSize={bottomPocketSize}
      contentPaddingBottom={contentPaddingBottom}
      onPullDown={onPullDown}
      onRelease={onRelease}
      onReachBottom={onReachBottom}
      pullDownEnabled={pullDownEnabled}
      reachBottomEnabled={reachBottomEnabled}
      pocketState={pocketState}
      pocketStateChange={pocketStateChange}

      onLock={onLock}
      onUnlock={onUnlock}
    />
  );
};

@ComponentBindings()
export class AnimatedScrollbarProps extends ScrollbarProps {
  @Event() onBounce?: EventCallback;
}

type AnimatedScrollbarPropsType = AnimatedScrollbarProps
& Pick<BaseWidgetProps, 'rtlEnabled'>
& Pick<ScrollableSimulatedProps, 'direction' | 'pullDownEnabled' | 'reachBottomEnabled' | 'forceGeneratePockets'
| 'inertiaEnabled' | 'showScrollbar' | 'scrollByThumb' | 'bounceEnabled' | 'pocketStateChange' | 'scrollLocationChange'>;

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

  @InternalState() forceAnimationToBottomBound = false;

  @Method()
  isThumb(element: EventTarget | null): boolean {
    return this.scrollbarRef.current!.isThumb(element);
  }

  @Method()
  isScrollbar(element: EventTarget | null): boolean {
    return this.scrollbarRef.current!.isScrollbar(element);
  }

  @Method()
  reachedMin(): boolean {
    return this.props.scrollLocation <= this.maxOffset;
  }

  @Method()
  reachedMax(): boolean {
    return this.props.scrollLocation >= this.getMinOffset();
  }

  @Method()
  initHandler(event: DxMouseEvent, crossThumbScrolling: boolean): void {
    this.scrollbarRef.current!.initHandler(event, crossThumbScrolling);
  }

  @Method()
  startHandler(): void {
    this.scrollbarRef.current!.startHandler();
  }

  @Method()
  moveHandler(delta: number): void {
    this.scrollbarRef.current!.moveHandler(delta);
  }

  @Method()
  endHandler(velocity: number, needRiseEnd: boolean): void {
    this.scrollbarRef.current!.endHandler(velocity, needRiseEnd);
  }

  @Method()
  stopHandler(): void {
    this.scrollbarRef.current!.stopHandler();
  }

  @Method()
  scrollTo(value: number): void {
    this.scrollbarRef.current!.scrollTo(value);
  }

  @Method()
  releaseHandler(): void {
    this.scrollbarRef.current!.releaseHandler();
  }

  @Effect({ run: 'once' })
  disposeAnimationFrame(): DisposeEffectReturn {
    return (): void => { this.cancel(); };
  }

  start(animatorName: 'inertia' | 'bounce', receivedVelocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean): void {
    this.animator = animatorName;

    if (this.isBounceAnimator) {
      this.props.onBounce?.();
      this.setupBounce();
    } else {
      if (!thumbScrolling && crossThumbScrolling) {
        this.velocity = 0;
      } else {
        this.velocity = receivedVelocity ?? 0;
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
    return requestAnimationFrame(this.stepCore.bind(this));
  }

  step(): void {
    if (!this.props.bounceEnabled && (this.reachedMin() || this.reachedMax())) {
      this.velocity = 0;
    }

    this.scrollStep(this.velocity);

    this.velocity *= this.acceleration;
  }

  setupBounce(): void {
    const { scrollLocation } = this.props;

    const bounceDistance = clampIntoRange(
      scrollLocation, this.getMinOffset(), this.maxOffset,
    ) - scrollLocation;

    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  complete(): void {
    if (this.isBounceAnimator) {
      const boundaryLocation = clampIntoRange(
        this.props.scrollLocation, this.getMinOffset(), this.maxOffset,
      );

      this.moveTo(boundaryLocation);

      this.stopAnimator('bounce');
    } else {
      this.stopAnimator('inertia');
    }
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

    return this.isBounceAnimator
    || inRange(this.props.scrollLocation, this.maxOffset, this.getMinOffset())
      ? ACCELERATION
      : OUT_BOUNDS_ACCELERATION;
  }

  get maxOffset(): number {
    if (this.props.forceGeneratePockets
      && this.props.reachBottomEnabled && !this.forceAnimationToBottomBound) {
      return this.props.maxOffset - this.props.bottomPocketSize - this.props.contentPaddingBottom;
    }

    return this.props.maxOffset;
  }

  onEnd(direction: string): void {
    this.forceAnimationToBottomBound = false;
    this.props.onEnd?.(direction);
  }

  onRelease(): void {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled
      && inRange(this.props.scrollLocation, this.maxOffset, this.props.maxOffset)) {
      this.forceAnimationToBottomBound = true;
    }

    this.props.onRelease?.();
  }

  suppressInertia(thumbScrolling?: boolean): void {
    if (!this.props.inertiaEnabled || thumbScrolling) {
      this.velocity = 0;
    }
  }

  /* istanbul ignore next */
  crossBoundOnNextStep(): boolean {
    const location = this.props.scrollLocation;
    const nextLocation = location + this.velocity;

    const minOffset = this.getMinOffset();

    return (location < this.maxOffset && nextLocation >= this.maxOffset)
      || (location > minOffset && nextLocation <= minOffset);
  }

  getMinOffset(): number {
    return this.scrollbarRef.current!.getMinOffset();
  }

  scrollStep(delta: number): void {
    this.scrollbarRef.current!.scrollStep(delta);
  }

  moveTo(location: number): void {
    this.scrollbarRef.current!.moveTo(location) as undefined;
  }

  stopAnimator(animator: string): void {
    this.scrollbarRef.current!.stopAnimator(animator) as undefined;
  }

  // https://trello.com/c/6TBHZulk/2672-renovation-cannot-use-getter-to-get-access-to-components-methods-react
  // get scrollbar(): any { // set Scrollbar type is technical limitation in the generator
  //   return this.scrollbarRef.current!;
  // }
}
