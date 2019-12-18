var registerComponent = require('../../../core/component_registrator'),
    SchedulerTimeline = require('./ui.scheduler.timeline');

var TIMELINE_CLASS = 'dx-scheduler-timeline-day';

var SchedulerTimelineDay = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this.option('currentDate');
        this._setStartDayHour(this._firstViewDate);
    },

    _needRenderWeekHeader: function() {
        return this._isWorkSpaceWithCount();
    },
});

registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay);

module.exports = SchedulerTimelineDay;
