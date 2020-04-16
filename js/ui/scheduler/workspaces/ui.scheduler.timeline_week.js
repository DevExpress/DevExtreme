const registerComponent = require('../../../core/component_registrator');
const SchedulerTimeline = require('./ui.scheduler.timeline');

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

const SchedulerTimelineWeek = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getCellCount: function() {
        return this.callBase() * this._getWeekDuration();
    },

    _getHeaderPanelCellWidth: function($headerRow) {
        return $headerRow.children().first().get(0).getBoundingClientRect().width;
    },

    _getWeekDuration: function() {
        return 7;
    },

    _needRenderWeekHeader: function() {
        return true;
    },

    _incrementDate: function(date) {
        date.setDate(date.getDate() + 1);
    }
});

registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek);

module.exports = SchedulerTimelineWeek;
