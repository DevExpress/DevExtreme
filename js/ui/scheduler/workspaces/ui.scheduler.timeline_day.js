const registerComponent = require('../../../core/component_registrator');
const SchedulerTimeline = require('./ui.scheduler.timeline');

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

const SchedulerTimelineDay = SchedulerTimeline.inherit({
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
