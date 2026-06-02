import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_WEEK; }

  protected override getElementClass(): string {
    return TIMELINE_CLASS;
  }

  protected override needRenderWeekHeader(): boolean {
    return true;
  }

  protected override incrementDate(date) {
    date.setDate(date.getDate() + 1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek as any);
