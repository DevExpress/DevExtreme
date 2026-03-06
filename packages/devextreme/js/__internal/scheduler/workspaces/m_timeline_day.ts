import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_DAY; }

  getElementClass() {
    return TIMELINE_CLASS;
  }

  _needRenderWeekHeader() {
    return this.isWorkSpaceWithCount();
  }
}

registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay as any);

export default SchedulerTimelineDay;
