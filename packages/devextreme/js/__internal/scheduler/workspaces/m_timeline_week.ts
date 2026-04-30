import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
  get type(): string {
    return this.option('type') ?? VIEWS.TIMELINE_WEEK;
  }

  protected override getElementClass() {
    return TIMELINE_CLASS;
  }

  protected override needRenderWeekHeader() {
    return true;
  }
}

registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek as any);
