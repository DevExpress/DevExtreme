import registerComponent from '@js/core/component_registrator';
import { VIEWS } from '@js/ui/scheduler/constants';

import SchedulerTimeline from './m_ui_scheduler_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_DAY; }

  _getElementClass() {
    return TIMELINE_CLASS;
  }

  _needRenderWeekHeader() {
    return this._isWorkSpaceWithCount();
  }
}

// @ts-expect-error
registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay);

export default SchedulerTimelineDay;
