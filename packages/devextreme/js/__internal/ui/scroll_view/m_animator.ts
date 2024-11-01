import { cancelAnimationFrame, requestAnimationFrame } from '@js/common/core/animation/frame';
import Class from '@js/core/class';
import { noop } from '@js/core/utils/common';

const { abstract } = Class;

const Animator = Class.inherit({

  ctor() {
    this._finished = true;
    this._stopped = false;

    this._proxiedStepCore = this._stepCore.bind(this);
  },

  start() {
    this._stopped = false;
    this._finished = false;
    this._stepCore();
  },

  stop() {
    this._stopped = true;
    cancelAnimationFrame(this._stepAnimationFrame);
  },

  _stepCore() {
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
  },

  _step: abstract,
  _isFinished: noop,
  _stop: noop,
  _complete: noop,

  _isStopped() {
    return this._stopped;
  },

  inProgress() {
    return !(this._stopped || this._finished);
  },

});

export default Animator;
