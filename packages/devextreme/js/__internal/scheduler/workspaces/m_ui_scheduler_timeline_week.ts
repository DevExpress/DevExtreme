import registerComponent from '@js/core/component_registrator';
import { getBoundingRect } from '@js/core/utils/position';
import { VIEWS } from '@js/ui/scheduler/constants';

import SchedulerTimeline from './m_ui_scheduler_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-week';

export default class SchedulerTimelineWeek extends SchedulerTimeline {
  // @ts-expect-error
  get type() { return VIEWS.TIMELINE_WEEK; }

  _getElementClass() {
    return TIMELINE_CLASS;
  }

  _getHeaderPanelCellWidth($headerRow) {
    return getBoundingRect($headerRow.children().first().get(0)).width;
  }

  _needRenderWeekHeader() {
    return true;
  }

  _incrementDate(date) {
    date.setDate(date.getDate() + 1);
  }
}

// @ts-expect-error
registerComponent('dxSchedulerTimelineWeek', SchedulerTimelineWeek);
