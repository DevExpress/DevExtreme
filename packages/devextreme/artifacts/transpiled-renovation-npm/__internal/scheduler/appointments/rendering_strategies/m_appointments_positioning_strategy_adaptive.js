"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _m_appointments_positioning_strategy_base = _interopRequireDefault(require("./m_appointments_positioning_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const COLLECTOR_ADAPTIVE_SIZE = 28;
const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;
const ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET = 35;
const ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH = 30;
class AdaptivePositioningStrategy extends _m_appointments_positioning_strategy_base.default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDropDownAppointmentWidth(intervalCount, isAllDay) {
    return this.getDropDownButtonAdaptiveSize();
  }
  getDropDownButtonAdaptiveSize() {
    return COLLECTOR_ADAPTIVE_SIZE;
  }
  getCollectorTopOffset(allDay) {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported() && allDay) {
      return (renderingStrategy.allDayHeight - renderingStrategy.getDropDownButtonAdaptiveSize()) / 2;
    }
    return this._renderingStrategy.cellHeight - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  }
  getCollectorLeftOffset() {
    const collectorWidth = this._renderingStrategy.getDropDownAppointmentWidth();
    return (this._renderingStrategy.cellWidth - collectorWidth) / 2;
  }
  getAppointmentDefaultOffset() {
    return ADAPTIVE_APPOINTMENT_DEFAULT_OFFSET;
  }
  getDynamicAppointmentCountPerCell() {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported()) {
      return {
        allDay: 0,
        simple: this._calculateDynamicAppointmentCountPerCell() || this._getAppointmentMinCount()
      };
    }
    return 0;
  }
  getDropDownAppointmentHeight() {
    return COLLECTOR_ADAPTIVE_SIZE;
  }
  _getAppointmentMinCount() {
    return 0;
  }
  _getAppointmentDefaultWidth() {
    const renderingStrategy = this._renderingStrategy;
    if (renderingStrategy.allDaySupported()) {
      return ADAPTIVE_APPOINTMENT_DEFAULT_WIDTH;
    }
    return super._getAppointmentDefaultWidth();
  }
  _calculateDynamicAppointmentCountPerCell() {
    return Math.floor(this._renderingStrategy._getAppointmentMaxWidth() / this._renderingStrategy._getAppointmentDefaultWidth());
  }
}
var _default = exports.default = AdaptivePositioningStrategy;