const registerComponent = require('../../../core/component_registrator');
const SchedulerTimeline = require('./ui.scheduler.timeline');
const getBoundingRect = require('../../../core/utils/position').getBoundingRect;

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

const SchedulerTimelineWeek = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getCellCount: function() {
        return this.callBase() * this._getWeekDuration();
    },

    _getHeaderPanelCellWidth: function($headerRow) {
        return getBoundingRect($headerRow.children().first()).width;
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
