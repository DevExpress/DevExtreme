import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimelineWeek from './m_timeline_week';

const TIMELINE_CLASS = 'dx-scheduler-timeline-work-week';

class SchedulerTimelineWorkWeek extends SchedulerTimelineWeek {
  get type() { return VIEWS.TIMELINE_WORK_WEEK; }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      skippedDays: [0, 6],
    });
  }

  protected override getElementClass() {
    return TIMELINE_CLASS;
  }
}

registerComponent('dxSchedulerTimelineWorkWeek', SchedulerTimelineWorkWeek as any);

export default SchedulerTimelineWorkWeek;
