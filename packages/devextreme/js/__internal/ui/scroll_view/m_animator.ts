import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import Class from '@js/core/class';

// @ts-expect-error dxClass inheritance issue
class Animator extends (Class.inherit({}) as new() => {}) {
  _finished!: boolean;

  _stopped!: boolean;

  _stepAnimationFrame?: any;

  _proxiedStepCore?: any;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ctor(strategy?): void {
    this._finished = true;
    this._stopped = false;

    this._proxiedStepCore = this._stepCore.bind(this);
  }

  start(): void {
    this._stopped = false;
    this._finished = false;
    this._stepCore();
  }

  stop(): void {
    this._stopped = true;
    cancelAnimationFrame(this._stepAnimationFrame);
  }

  _stepCore(): void {
    if (this._isStopped()) {
      this._stop();
      return;
    }

    if (this._isFinished()) {
      this._finished = true;
      this._complete();
      return;
    }

    this._step();
    this._stepAnimationFrame = requestAnimationFrame(this._proxiedStepCore);
  }

  _step(): void {
    Class.abstract();
  }

  // @ts-expect-error ts-error
  _isFinished(): boolean {}

  _stop(): void {}

  _complete(): void {}

  _isStopped() {
    return this._stopped;
  }

  inProgress() {
    return !(this._stopped || this._finished);
  }
}

export default Animator;
