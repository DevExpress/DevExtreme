import registerComponent from '../../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';
import { setStartDayHour } from './utils/base';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
    _getElementClass() {
        return TIMELINE_CLASS;
    }

    _setFirstViewDate() {
        const firstViewDate = this._getViewStartByOptions();

        this._firstViewDate = setStartDayHour(firstViewDate, this.option('startDayHour'));
    }

    _needRenderWeekHeader() {
        return this._isWorkSpaceWithCount();
    }
}

registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay);

export default SchedulerTimelineDay;
