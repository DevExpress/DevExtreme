import registerComponent from '@js/core/component_registrator';
import dateUtils from '@js/core/utils/date';
// NOTE: Renovation component import.
import { HeaderPanelComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekdayAndDay, monthUtils } from '@ts/scheduler/r1/utils/index';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';

class SchedulerTimelineMonth extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_MONTH; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent() { return HeaderPanelComponent; }

  renderView() {
    super.renderView();

    this.updateScrollable();
  }

  getElementClass() {
    return TIMELINE_CLASS;
  }

  getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  }

  _calculateDurationInCells(timeDiff) {
    return timeDiff / this.getCellDuration();
  }

  isIndicatorVisible() {
    return true;
  }

  getFormat() {
    return formatWeekdayAndDay;
  }

  getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

    return currentDate.getTime() - (firstViewDate.getTime() - (this.option('startDayHour') as any) * 3600000) - timeZoneOffset;
  }

  getViewStartByOptions() {
    return monthUtils.getViewStartByOptions(
      this.option('startDate') as any,
      this.option('currentDate') as any,
      this.option('intervalCount') as any,
      dateUtils.getFirstMonthDate(this.option('startDate') as any) as any,
    );
  }

  generateRenderOptions() {
    const options = super.generateRenderOptions(true);
    return {
      ...options,
      getDateForHeaderText: (_, date) => date,
    };
  }

  keepOriginalHours() {
    return true;
  }
}

registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth as any);

export default SchedulerTimelineMonth;
