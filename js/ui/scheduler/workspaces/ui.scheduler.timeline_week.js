import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import { getBoundingRect } from '../../../core/utils/position';
import dateUtils from '../../../core/utils/date';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _getCellCount() {
        return super._getCellCount() * this._getWeekDuration();
    }

    _getHeaderPanelCellWidth($headerRow) {
        return getBoundingRect($headerRow.children().first().get(0)).width;
    }

    _getWeekDuration() {
        return 7;
    }

    _needRenderWeekHeader() {
        return true;
    }

    _incrementDate(date) {
        date.setDate(date.getDate() + 1);
    }

    _getIntervalDuration() {
        return dateUtils.dateToMilliseconds('day') * 7 * this.option('intervalCount');
    }
}

registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek);
