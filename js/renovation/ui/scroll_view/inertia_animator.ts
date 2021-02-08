import { Animator } from './animator';
import devices from '../../../core/devices';
import type { Scrollbar } from './scrollbar';

const realDevice = devices.real;
const isSluggishPlatform = (realDevice as any).platform === 'android';

const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const OUT_BOUNDS_ACCELERATION = 0.5;
const MIN_VELOCITY_LIMIT = 1;

class InertiaAnimator extends Animator {
  readonly VELOCITY_LIMIT: number = MIN_VELOCITY_LIMIT;

  readonly ACCELERATION: number = ACCELERATION;

  readonly OUT_BOUNDS_ACCELERATION: number = OUT_BOUNDS_ACCELERATION;

  scrollbar: Pick<Scrollbar, 'getVelocity' | 'setVelocity' | 'inBounds' | 'scrollStep' | 'scrollComplete' | 'stopComplete'>;

  constructor(scrollMethods) {
    super();

    this.scrollbar = scrollMethods;
  }

  isFinished(): boolean {
    return Math.abs(this.scrollbar.getVelocity() || 0) <= this.VELOCITY_LIMIT;
  }

  step(): void {
    this.scrollbar.scrollStep(this.scrollbar.getVelocity());

    this.scrollbar.setVelocity(this.scrollbar.getVelocity() * this.acceleration());
  }

  acceleration(): number {
    return this.scrollbar.inBounds() ? this.ACCELERATION : this.OUT_BOUNDS_ACCELERATION;
  }

  complete(): void {
    this.scrollbar.scrollComplete();
  }

  stop(): void {
    this.scrollbar.stopComplete();
  }
}

export { InertiaAnimator };
