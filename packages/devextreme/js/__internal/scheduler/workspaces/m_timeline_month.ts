import registerComponent from '@js/core/component_registrator';
import dateUtils from '@js/core/utils/date';
import { formatWeekdayAndDay } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getViewStartByOptions } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/month';

// NOTE: Renovation component import.
// @ts-expect-error
import dxrDateHeader from '../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j';
import { VIEWS } from '../m_constants';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';

class SchedulerTimelineMonth extends SchedulerTimeline {
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
