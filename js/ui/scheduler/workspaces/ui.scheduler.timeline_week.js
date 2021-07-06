import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import { getBoundingRect } from '../../../core/utils/position';
import { getIntervalDuration } from './utils/week';
import { VIEWS } from '../constants';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
    get type() { return VIEWS.TIMELINE_WEEK; }

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
        return getIntervalDuration(this.option('intervalCount'));
    }
}

registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek);
