"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _index = require("../../scheduler/r1/components/index");
var _index2 = require("../../scheduler/r1/utils/index");
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // NOTE: Renovation component import.
const TIMELINE_CLASS = 'dx-scheduler-timeline-month';
class SchedulerTimelineMonth extends _m_timeline.default {
  constructor() {
    super(...arguments);
    this.viewDirection = 'horizontal';
  }
  get type() {
    return _m_constants.VIEWS.TIMELINE_MONTH;
  }
  get renovatedHeaderPanelComponent() {
    return _index.HeaderPanelComponent;
  }
  _renderView() {
    super._renderView();
    this._updateScrollable();
  }
  _getElementClass() {
    return TIMELINE_CLASS;
  }
  _getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  }
  _calculateDurationInCells(timeDiff) {
    return timeDiff / this.getCellDuration();
  }
  isIndicatorVisible() {
    return true;
  }
  _getFormat() {
    return _index2.formatWeekdayAndDay;
  }
  _getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  }
  _getViewStartByOptions() {
    return _index2.monthUtils.getViewStartByOptions(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
  }
  generateRenderOptions() {
    const options = super.generateRenderOptions(true);
    return _extends({}, options, {
      getDateForHeaderText: (_, date) => date
    });
  }
  keepOriginalHours() {
    return true;
  }
}
(0, _component_registrator.default)('dxSchedulerTimelineMonth', SchedulerTimelineMonth);
var _default = exports.default = SchedulerTimelineMonth;