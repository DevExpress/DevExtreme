import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import { getFirstViewDate } from './utils/day';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _getFirstViewDate() {
        return getFirstViewDate(
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
