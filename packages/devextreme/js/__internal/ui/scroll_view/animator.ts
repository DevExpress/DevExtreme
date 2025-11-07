import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import Class from '@js/core/class';
import { isDefined } from '@js/core/utils/type';

type AnimationFrameId = ReturnType<typeof requestAnimationFrame>;

abstract class Animator {
  private _finished = true;

  private _stopped = false;

  private _stepAnimationFrame?: AnimationFrameId;

  private readonly _proxiedStepCore: () => void;

  constructor() {
    this._proxiedStepCore = this._stepCore.bind(this);
  }

  start(): void {
    this._stopped = false;
    this._finished = false;
    this._stepCore();
  }

  stop(): void {
    this._stopped = true;

    if (isDefined(this._stepAnimationFrame)) {
      cancelAnimationFrame(this._stepAnimationFrame);
    }
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

  _isFinished(): boolean {
    return this._finished;
  }

  _stop(): void {
  }

  _complete(): void {
  }

  _isStopped(): boolean {
    return this._stopped;
  }

  inProgress(): boolean {
    return !(this._stopped || this._finished);
  }
}

export default Animator;
