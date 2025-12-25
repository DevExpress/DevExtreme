import registerComponent from '@js/core/component_registrator';
import dateUtils from '@js/core/utils/date';
// NOTE: Renovation component import.
import { HeaderPanelComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekdayAndDay, monthUtils } from '@ts/scheduler/r1/utils/index';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './m_timeline';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';

class SchedulerTimelineYear extends SchedulerTimeline {
  get type() { return VIEWS.TIMELINE_YEAR; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent() { return HeaderPanelComponent; }

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
    return (date: Date) => {
      // return index of the week + date and month
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const daysOffset = firstDayOfYear.getDay();
      const dayOfYear = Math.ceil((date.getTime() - firstDayOfYear.getTime()) / dateUtils.dateToMilliseconds('day')) + 1;
      const weekNumber = Math.ceil((dayOfYear + daysOffset - 1) / 7);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `W${weekNumber} ${date.getDate()}/${months[date.getMonth()]}`;
    };
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

registerComponent('dxSchedulerTimelineYear', SchedulerTimelineYear as any);

export default SchedulerTimelineYear;
