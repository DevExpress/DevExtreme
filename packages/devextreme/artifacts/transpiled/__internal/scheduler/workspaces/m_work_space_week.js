"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _index = require("../../scheduler/r1/utils/index");
var _m_constants = require("../m_constants");
var _m_work_space_vertical = _interopRequireDefault(require("./m_work_space_vertical"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends _m_work_space_vertical.default {
  get type() {
    return _m_constants.VIEWS.WEEK;
  }
  _getElementClass() {
    return WEEK_CLASS;
  }
  _calculateViewStartDate() {
    return _index.weekUtils.calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
  }
}
(0, _component_registrator.default)('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);
var _default = exports.default = SchedulerWorkSpaceWeek;