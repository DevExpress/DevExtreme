const registerComponent = require('../../../core/component_registrator');
const SchedulerTimeline = require('./ui.scheduler.timeline');

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';

const SchedulerTimelineWeek = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getCellCount: function() {
        return this.callBase() * this._getWeekDuration();
    },

    _setTableSizes: function() {
        this.callBase();
        const cellWidth = this.getCellWidth();
        const minWidth = this.getWorkSpaceMinWidth();
        const $headerCells = this.$element().find('.' + HEADER_ROW_CLASS).last().find('th');

        let width = cellWidth * $headerCells.length;

        if(width < minWidth) {
            width = minWidth;
        }

        this._$headerPanel.width(width);
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
