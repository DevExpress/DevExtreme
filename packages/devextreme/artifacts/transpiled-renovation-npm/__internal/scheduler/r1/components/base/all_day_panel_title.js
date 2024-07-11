"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllDayPanelTitle = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class AllDayPanelTitle extends _inferno2.InfernoWrapperComponent {
  createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  }
  render() {
    const text = _message.default.format('dxScheduler-allDay');
    return (0, _inferno.createVNode)(1, "div", "dx-scheduler-all-day-title", text, 0);
  }
}
exports.AllDayPanelTitle = AllDayPanelTitle;
AllDayPanelTitle.defaultProps = {};