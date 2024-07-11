"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';
class CurrentTimeShader {
  constructor(_workSpace) {
    this._workSpace = _workSpace;
    this._$container = this._workSpace._dateTableScrollable.$content();
  }
  render() {
    this.initShaderElements();
    this.renderShader();
    this._shader.forEach(shader => {
      this._$container.append(shader);
    });
  }
  initShaderElements() {
    this._$shader = this.createShader();
    this._shader = [];
    this._shader.push(this._$shader);
  }
  renderShader() {}
  createShader() {
    return (0, _renderer.default)('<div>').addClass(DATE_TIME_SHADER_CLASS);
  }
  clean() {
    this._$container && this._$container.find(`.${DATE_TIME_SHADER_CLASS}`).remove();
  }
}
var _default = exports.default = CurrentTimeShader;