const registerComponent = require('../../../core/component_registrator');
const SchedulerTimelineWeek = require('./ui.scheduler.timeline_week');
const dateUtils = require('../../../core/utils/date');
const workWeekUtils = require('./utils.work_week');
const toMs = dateUtils.dateToMilliseconds;

const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';

const SchedulerTimelineWorkWeek = SchedulerTimelineWeek.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getWeekDuration: function() {
        return 5;
    },

    _firstDayOfWeek: function() {
        return workWeekUtils.getFirstDayOfWeek(this.option('firstDayOfWeek'));
    },

    _isSkipData: workWeekUtils.isDataOnWeekend,

    _incrementDate: function(date) {
        const day = date.getDay();
        if(day === 5) {
            date.setDate(date.getDate() + 2);
        }
        this.callBase(date);
    },

    _getOffsetByCount: function(cellIndex) {
        const weekendCount = Math.floor(cellIndex / (5 * this._getCellCountInDay()));
        return toMs('day') * weekendCount * 2;
    },

    _getWeekendsCount: workWeekUtils.getWeekendsCount,

    _setFirstViewDate: function() {
        this._firstViewDate = workWeekUtils.getFirstViewDate(this.option('currentDate'), this._firstDayOfWeek());
        this._setStartDayHour(this._firstViewDate);
    }
});

registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);

module.exports = SchedulerTimelineWorkWeek;
