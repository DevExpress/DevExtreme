import registerComponent from '@js/core/component_registrator';
import dateUtils from '@js/core/utils/date';
import { formatWeekdayAndDay } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getViewStartByOptions } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/month';
// @ts-expect-error
import dxrDateHeader from '@js/renovation/ui/scheduler/workspaces/base/header_panel/layout.j';
import { VIEWS } from '@js/ui/scheduler/constants';

import SchedulerTimeline from './m_ui_scheduler_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';

class SchedulerTimelineMonth extends SchedulerTimeline {
  // @ts-expect-error
  get type() { return VIEWS.TIMELINE_MONTH; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent() { return dxrDateHeader; }

  _renderView() {
    super._renderView();

    this._updateScrollable();
  }

  _getElementClass() {
    return TIMELINE_CLASS;
  }

  _getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  }

  _calculateDurationInCells(timeDiff) {
    return timeDiff / this.getCellDuration();
  }

  isIndicatorVisible() {
    return true;
  }

  // @ts-expect-error
  _getFormat() {
    return formatWeekdayAndDay;
  }

  _getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

    return currentDate.getTime() - (firstViewDate.getTime() - (this.option('startDayHour') as any) * 3600000) - timeZoneOffset;
  }

  _getViewStartByOptions() {
    return getViewStartByOptions(
      this.option('startDate') as any,
      this.option('currentDate') as any,
      this.option('intervalCount') as any,
      dateUtils.getFirstMonthDate(this.option('startDate')) as any,
    );
  }

  generateRenderOptions() {
    // @ts-expect-error
    const options = super.generateRenderOptions(true);
    return {
      ...options,
      getDateForHeaderText: (_, date) => date,
    };
  }
}

// @ts-expect-error
registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth);

export default SchedulerTimelineMonth;
