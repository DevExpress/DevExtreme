import { InertiaAnimator } from './inertia_animator';
import devices from '../../../core/devices';
import type { Scrollbar } from './scrollbar';

const realDevice = devices.real;
const isSluggishPlatform = (realDevice as any).platform === 'android';

const ACCELERATION = isSluggishPlatform ? 0.95 : 0.92;
const MIN_VELOCITY_LIMIT = 1;
const BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;

export class BounceAnimator extends InertiaAnimator {
  readonly VELOCITY_LIMIT: number = BOUNCE_MIN_VELOCITY_LIMIT;

  readonly ACCELERATION: number = ACCELERATION;

  scrollbar!: Pick<Scrollbar, 'getVelocity' | 'setVelocity' | 'inBounds' | 'scrollStep' | 'scrollComplete' | 'stopComplete' | 'crossBoundOnNextStep' | 'move' | 'getBounceLocation'>;

  isFinished(): boolean {
    return this.scrollbar.crossBoundOnNextStep() || super.isFinished();
  }

  acceleration(): number {
    return this.ACCELERATION;
  }

  complete(): void {
    this.scrollbar.move(this.scrollbar.getBounceLocation());

    super.complete();
  }
}
