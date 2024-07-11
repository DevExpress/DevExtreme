"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TIMELINE_CLASS = 'dx-scheduler-timeline-day';
class SchedulerTimelineDay extends _m_timeline.default {
  get type() {
    return _m_constants.VIEWS.TIMELINE_DAY;
  }
  _getElementClass() {
    return TIMELINE_CLASS;
  }
  _needRenderWeekHeader() {
    return this._isWorkSpaceWithCount();
  }
}
(0, _component_registrator.default)('dxSchedulerTimelineDay', SchedulerTimelineDay);
var _default = exports.default = SchedulerTimelineDay;