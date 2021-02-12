import Class from '../../../core/class';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../animation/frame';

const { abstract } = Class;

export class Animator {
  finished = true;

  stopped = false;

  stepAnimationFrame = 0;

  proxiedStepCore: () => void;

  constructor() {
    this.proxiedStepCore = this.stepCore.bind(this);
  }

  start(): void {
    this.stopped = false;
    this.finished = false;
    this.stepCore();
  }

  stop(): void {
    this.stopped = true;
    cancelAnimationFrame(this.stepAnimationFrame);
  }

  stepCore(): void {
    if (this.isStopped()) {
      this.stop();
      return;
    }

    if (this.isFinished()) {
      this.finished = true;
      this.complete();
      return;
    }

    this.step();
    this.stepAnimationFrame = requestAnimationFrame(this.proxiedStepCore);
  }

  // eslint-disable-next-line class-methods-use-this
  step(): void {
    abstract();
  }

  // eslint-disable-next-line class-methods-use-this
  complete(): void {}

  // eslint-disable-next-line class-methods-use-this
  isFinished(): boolean {
    return false;
  }

  isStopped(): boolean {
    return this.stopped;
  }

  inProgress(): boolean {
    return !(this.stopped || this.finished);
  }
}
