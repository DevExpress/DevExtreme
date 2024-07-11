"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _index = require("../../scheduler/r1/utils/index");
var _m_constants = require("../m_constants");
var _m_work_space_week = _interopRequireDefault(require("./m_work_space_week"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';
class SchedulerWorkSpaceWorkWeek extends _m_work_space_week.default {
  get type() {
    return _m_constants.VIEWS.WORK_WEEK;
  }
  constructor() {
    // @ts-expect-error
    super(...arguments);
    this._getWeekendsCount = _index.getWeekendsCount;
  }
  _getElementClass() {
    return WORK_WEEK_CLASS;
  }
}
(0, _component_registrator.default)('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);
var _default = exports.default = SchedulerWorkSpaceWorkWeek;