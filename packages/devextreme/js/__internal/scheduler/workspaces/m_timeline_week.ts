import registerComponent from '@js/core/component_registrator';
import { getBoundingRect } from '@js/core/utils/position';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_WEEK; }

  protected override getElementClass() {
    return TIMELINE_CLASS;
  }

  _getHeaderPanelCellWidth($headerRow) {
    return getBoundingRect($headerRow.children().first().get(0)).width;
  }

  needRenderWeekHeader() {
    return true;
  }

  incrementDate(date) {
    date.setDate(date.getDate() + 1);
  }
}

registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek as any);
