import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import { getBoundingRect } from '../../../core/utils/position';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

const SchedulerTimelineWeek = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getCellCount: function() {
        return this.callBase() * this._getWeekDuration();
    },

    _getHeaderPanelCellWidth: function($headerRow) {
        return getBoundingRect($headerRow.children().first().get(0)).width;
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

export default SchedulerTimelineWeek;
