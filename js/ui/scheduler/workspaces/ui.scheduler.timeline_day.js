import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerTimeline from './ui.scheduler.timeline';
import { calculateStartViewDate } from './utils/day';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
    get type() { return VIEWS.TIMELINE_DAY; }

    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _calculateStartViewDate() {
        return calculateStartViewDate(
            this.option('currentDate'),
            this.option('startDayHour'),
            this.option('startDate'),
            this._getIntervalDuration(),
        );
    }

    _needRenderWeekHeader() {
        return this._isWorkSpaceWithCount();
    }
}

registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay);

export default SchedulerTimelineDay;
