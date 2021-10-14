import {
  Component,
  JSXComponent,
  RefObject,
  Ref,
  Mutable,
  Method,
  Effect,
  InternalState,
} from '@devextreme-generator/declarations';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { BaseWidgetProps } from '../../common/base_props';

import { Scrollbar } from './scrollbar';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../../animation/frame';
import { ScrollableSimulatedProps } from '../common/simulated_strategy_props';
import { inRange } from '../../../../core/utils/math';
import { DxMouseEvent } from '../common/types.d';
import { clampIntoRange } from '../utils/clamp_into_range';
import { AnimatedScrollbarProps } from '../common/animated_scrollbar_props';
import { isDxMouseWheelEvent } from '../../../../events/utils/index';

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
    scrollbarRef,
    props: {
      direction,
      contentSize, containerSize,
      showScrollbar, scrollByThumb, bounceEnabled,
      scrollLocation, scrollLocationChange,
      visible, rtlEnabled,
      containerHasSizes,
      minOffset, maxOffset,
    },
  } = viewModel;

  return (
    <Scrollbar
      ref={scrollbarRef}
      direction={direction}
      contentSize={contentSize}
      containerSize={containerSize}
      containerHasSizes={containerHasSizes}
      visible={visible}
      minOffset={minOffset}
      maxOffset={maxOffset}
      scrollLocation={scrollLocation}
      scrollLocationChange={scrollLocationChange}
      scrollByThumb={scrollByThumb}
      bounceEnabled={bounceEnabled}
      showScrollbar={showScrollbar}
      // Horizontal
      rtlEnabled={rtlEnabled}
    />
  );
};

type AnimatedScrollbarPropsType = AnimatedScrollbarProps
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<BaseWidgetProps, 'rtlEnabled'>
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<ScrollableSimulatedProps, 'pullDownEnabled' | 'reachBottomEnabled' | 'forceGeneratePockets'
| 'inertiaEnabled' | 'showScrollbar' | 'scrollByThumb' | 'bounceEnabled' | 'scrollLocationChange'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class AnimatedScrollbar extends JSXComponent<AnimatedScrollbarPropsType>() {
  @Ref() scrollbarRef!: RefObject<Scrollbar>;

  @Mutable() thumbScrolling = false;

  @Mutable() crossThumbScrolling = false;

  @Mutable() stepAnimationFrame = 0;

  @Mutable() finished = true;

  @Mutable() stopped = false;

  @Mutable() velocity = 0;

  @Mutable() animator = 'inertia';

  @Mutable() refreshing = false;

  @Mutable() loading = false;

  @InternalState() forceAnimationToBottomBound = false;

  @InternalState() pendingRefreshing = false;

  @InternalState() pendingLoading = false;

  @InternalState() pendingBounceAnimator = false;

  @InternalState() pendingInertiaAnimator = false;

  @InternalState() needRiseEnd = false;

  @InternalState() wasRelease = false;

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
    return this.props.scrollLocation >= this.props.minOffset;
  }

  @Method()
  initHandler(
    event: DxMouseEvent,
    crossThumbScrolling: boolean,
    offset: number,
  ): void {
    this.cancel();

    this.refreshing = false;
    this.loading = false;

    if (!isDxMouseWheelEvent(event.originalEvent)) {
      this.calcThumbScrolling(event, crossThumbScrolling);
      this.scrollbarRef.current!.initHandler(event, this.thumbScrolling, offset);
    }
  }

  @Method()
  moveHandler(delta: number): void {
    if (this.crossThumbScrolling) {
      return;
    }

    this.scrollbarRef.current!.moveHandler(delta,
      this.props.minOffset, this.maxOffset, this.thumbScrolling);
  }

  @Method()
  endHandler(velocity: number, needRiseEnd: boolean): void {
    this.start('inertia', velocity, this.thumbScrolling, this.crossThumbScrolling);

    this.needRiseEnd = needRiseEnd;
    this.resetThumbScrolling();
  }

  @Method()
  stopHandler(): void {
    if (this.thumbScrolling) {
      this.needRiseEnd = true;
    }

    this.resetThumbScrolling();
  }

  @Method()
  scrollTo(value: number): void {
    this.loading = false;
    this.refreshing = false;

    this.scrollbarRef.current!.moveTo(-clampIntoRange(value, -this.maxOffset, 0));

    this.needRiseEnd = true;
  }

  @Method()
  releaseHandler(): void {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled
      && inRange(this.props.scrollLocation, this.maxOffset, this.props.maxOffset)) {
      this.forceAnimationToBottomBound = true;
    }

    this.wasRelease = true;
    this.needRiseEnd = true;

    this.resetThumbScrolling();
    this.pendingRefreshing = false;
    this.pendingLoading = false;
  }

  @Effect({ run: 'once' })
  disposeAnimationFrame(): DisposeEffectReturn {
    return (): void => { this.cancel(); };
  }

  @Effect()
  /* istanbul ignore next */
  risePullDown(): void {
    if (
      this.props.forceGeneratePockets
      && this.needRiseEnd
      && this.inRange
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && this.props.pulledDown
      && !this.pendingRefreshing
      && !this.refreshing
      && -this.props.maxOffset > 0
    ) {
      this.refreshing = true;
      this.pendingRefreshing = true;

      this.props.onPullDown?.();
    }
  }

  @Effect()
  /* istanbul ignore next */
  riseEnd(): void {
    if (
      this.inBounds
      && this.needRiseEnd
      && this.finished
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && !this.pendingRelease
      && !(this.pendingRefreshing || this.pendingLoading)
    ) {
      this.needRiseEnd = false;
      this.wasRelease = false;

      this.props.onUnlock?.();

      this.forceAnimationToBottomBound = false;
      this.props.onEnd?.(this.props.direction);
    }
  }

  @Effect()
  /* istanbul ignore next */
  riseReachBottom(): void {
    if (
      this.props.forceGeneratePockets
      && this.needRiseEnd
      && this.inRange
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && this.isReachBottom
      && !this.pendingLoading
      && !this.loading
      && -this.props.maxOffset > 0
    ) {
      this.loading = true;
      this.pendingLoading = true;

      this.props.onReachBottom?.();
    }
  }

  @Effect()
  /* istanbul ignore next */
  bounceAnimatorStart(): void {
    if (
      !this.inRange
      && this.needRiseEnd
      && !(this.pendingBounceAnimator || this.pendingInertiaAnimator)
      && !(this.pendingRefreshing || this.pendingLoading)
      && -this.props.maxOffset > 0
    ) {
      this.start('bounce');
    }
  }

  @Effect()
  updateLockedState(): void {
    if (this.pendingBounceAnimator || this.pendingRefreshing || this.pendingLoading) {
      this.props.onLock?.();
    }
  }

  get pendingRelease(): boolean {
    return ((this.props.pulledDown && this.props.pullDownEnabled)
      || (this.isReachBottom && this.props.reachBottomEnabled)) && !this.wasRelease;
  }

  resetThumbScrolling(): void {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }

  get inRange(): boolean {
    return inRange(this.props.scrollLocation, this.maxOffset, this.props.minOffset);
  }

  /* istanbul ignore next */
  get inBounds(): boolean {
    return inRange(this.props.scrollLocation, this.props.maxOffset, 0);
  }

  get isReachBottom(): boolean {
    // T1032842
    // when sizes is decimal and a rounding error of about 1px
    // scrollLocation = 72.3422123432px | maxOffset = 73px
    return this.props.reachBottomEnabled
      && Math.round(this.props.scrollLocation - this.props.maxOffset) <= 1;
  }

  start(animatorName: 'inertia' | 'bounce', receivedVelocity?: number, thumbScrolling?: boolean, crossThumbScrolling?: boolean): void {
    this.animator = animatorName;

    if (this.isBounceAnimator) {
      this.pendingBounceAnimator = true;
      this.props.onBounce?.();
      this.setupBounce();
    } else {
      this.pendingInertiaAnimator = true;
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
    this.pendingBounceAnimator = false;
    this.pendingInertiaAnimator = false;

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

    this.scrollStep(this.velocity, this.props.minOffset, this.maxOffset);

    this.velocity *= this.acceleration;
  }

  setupBounce(): void {
    const { scrollLocation } = this.props;

    const bounceDistance = clampIntoRange(
      scrollLocation, this.props.minOffset, this.maxOffset,
    ) - scrollLocation;

    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  complete(): void {
    if (this.isBounceAnimator) {
      const boundaryLocation = clampIntoRange(
        this.props.scrollLocation, this.props.minOffset, this.maxOffset,
      );

      this.moveTo(boundaryLocation);
    }

    this.stopAnimator();
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
    return this.isBounceAnimator || this.inRange
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

  suppressInertia(thumbScrolling?: boolean): void {
    if (!this.props.inertiaEnabled || thumbScrolling) {
      this.velocity = 0;
    }
  }

  /* istanbul ignore next */
  crossBoundOnNextStep(): boolean {
    const location = this.props.scrollLocation;
    const nextLocation = location + this.velocity;

    return (location <= this.maxOffset && nextLocation >= this.maxOffset)
      || (location >= this.props.minOffset && nextLocation <= this.props.minOffset);
  }

  scrollStep(delta: number, minOffset: number, maxOffset: number): void {
    this.scrollbarRef.current!.scrollStep(delta, minOffset, maxOffset) as undefined;
  }

  moveTo(location: number): void {
    this.scrollbarRef.current!.moveTo(location);
  }

  stopAnimator(): void {
    // May be animator is single
    this.pendingBounceAnimator = false;
    this.pendingInertiaAnimator = false;
  }

  calcThumbScrolling(event: DxMouseEvent, currentCrossThumbScrolling: boolean): void {
    const { target } = event.originalEvent;
    const scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);

    this.thumbScrolling = scrollbarClicked || (this.props.scrollByThumb && this.isThumb(target));
    this.crossThumbScrolling = !this.thumbScrolling && currentCrossThumbScrolling;
  }

  // https://trello.com/c/6TBHZulk/2672-renovation-cannot-use-getter-to-get-access-to-components-methods-react
  // get scrollbar(): any { // set Scrollbar type is technical limitation in the generator
  //   return this.scrollbarRef.current!;
  // }
}
