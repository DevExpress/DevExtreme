"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _frame = require("../../../animation/frame");
var _class = _interopRequireDefault(require("../../../core/class"));
var _common = require("../../../core/utils/common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  abstract
} = _class.default;
const Animator = _class.default.inherit({
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
    (0, _frame.cancelAnimationFrame)(this._stepAnimationFrame);
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
    this._stepAnimationFrame = (0, _frame.requestAnimationFrame)(this._proxiedStepCore);
  },
  _step: abstract,
  _isFinished: _common.noop,
  _stop: _common.noop,
  _complete: _common.noop,
  _isStopped() {
    return this._stopped;
  },
  inProgress() {
    return !(this._stopped || this._finished);
  }
});
var _default = exports.default = Animator;