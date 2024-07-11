"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _m_strategy_vertical = _interopRequireDefault(require("./m_strategy_vertical"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class WeekAppointmentRenderingStrategy extends _m_strategy_vertical.default {
  isApplyCompactAppointmentOffset() {
    if (this.isAdaptive && this._getMaxAppointmentCountPerCellByType() === 0) {
      return false;
    }
    return this.supportCompactDropDownAppointments();
  }
}
var _default = exports.default = WeekAppointmentRenderingStrategy;