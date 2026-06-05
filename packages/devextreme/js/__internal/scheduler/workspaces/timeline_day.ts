import registerComponent from '@js/core/component_registrator';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-day';

class SchedulerTimelineDay extends SchedulerTimeline {
  get type(): string { return VIEWS.TIMELINE_DAY; }

  protected override getElementClass(): string {
    return TIMELINE_CLASS;
  }

  protected override needRenderWeekHeader(): boolean {
    return this.isWorkSpaceWithCount();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerTimelineDay', SchedulerTimelineDay as any);

export default SchedulerTimelineDay;
