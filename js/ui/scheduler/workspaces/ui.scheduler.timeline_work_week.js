const registerComponent = require('../../../core/component_registrator');
const SchedulerTimelineWeek = require('./ui.scheduler.timeline_week');
const dateUtils = require('../../../core/utils/date');
const toMs = dateUtils.dateToMilliseconds;

const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';
const MONDAY_INDEX = 1;

const SchedulerTimelineWorkWeek = SchedulerTimelineWeek.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getWeekDuration: function() {
        return 5;
    },

    _firstDayOfWeek: function() {
        return this.option('firstDayOfWeek') || MONDAY_INDEX;
    },

    _incrementDate: function(date) {
        const day = date.getDay();
        if(day === 5) {
            date.setDate(date.getDate() + 2);
        }
        this.callBase(date);
    },

    _getOffsetByCount: function(cellIndex, rowIndex) {
        const weekendCount = Math.floor(cellIndex / (5 * this._getCellCountInDay()));
        if(weekendCount > 0) {
            return toMs('day') * weekendCount * 2;
        } else {
            return 0;
        }
    },

    _getWeekendsCount: function(days) {
        return 2 * Math.floor(days / 7);
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this.option('currentDate'), this._firstDayOfWeek());

        this._firstViewDate = dateUtils.normalizeDateByWeek(this._firstViewDate, this.option('currentDate'));

        this._setStartDayHour(this._firstViewDate);
    }
});

registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek);

module.exports = SchedulerTimelineWorkWeek;
