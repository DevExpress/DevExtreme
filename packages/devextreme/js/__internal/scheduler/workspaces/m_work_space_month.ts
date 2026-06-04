import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { getBoundingRect } from '@js/core/utils/position';
import { hasWindow } from '@js/core/utils/window';
// NOTE: Renovation component import.
import { DateTableMonthComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekday, monthUtils } from '@ts/scheduler/r1/utils/index';

import { utils } from '../m_utils';
import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpace from './m_work_space_indicator';

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const toMs = dateUtils.dateToMilliseconds;

class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
  get type() { return VIEWS.MONTH; }

  protected override getElementClass() {
    return MONTH_CLASS;
  }

  protected override getFormat() {
    return formatWeekday;
  }

  protected override getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

    return currentDate.getTime() - (firstViewDate.getTime() - (this.option('startDayHour') as any) * 3600000) - timeZoneOffset;
  }

  protected override getDateGenerationOptions() {
    return {
      ...super.getDateGenerationOptions(),
      cellCountInDay: 1,
    };
  }

  /**
   * TODO: temporary fix, in the future, if we replace table layout on div layout,
   *   getCellWidth method need remove. Details in T712431 there is a test for this bug,
   *   when changing the layout, the test will also be useless
   */
  getCellWidth() {
    return this.cache.memo('cellWidth', () => {
      const DAYS_IN_WEEK = 7;

      let averageWidth = 0;
      const cells = this.getCells().slice(0, DAYS_IN_WEEK);
      cells.each((index, element) => {
        averageWidth += hasWindow() ? getBoundingRect(element).width : 0;
      });

      return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
    });
  }

  protected override insertAllDayRowsIntoDateTable() {
    return false;
  }

  protected override getCellCoordinatesByIndex(index) {
    const rowIndex = Math.floor(index / this.getCellCount());
    const columnIndex = index - this.getCellCount() * rowIndex;

    return {
      rowIndex,
      columnIndex,
    };
  }

  protected override needCreateCrossScrolling() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.option('crossScrollingEnabled') || this.isVerticalGroupedWorkSpace();
  }

  protected override getViewStartByOptions() {
    return monthUtils.getViewStartByOptions(
      this.option('startDate') as any,
      this.option('currentDate') as any,
      this.option('intervalCount') as any,
      dateUtils.getFirstMonthDate(this.option('startDate')) as any,
    );
  }

  protected override updateIndex(index) {
    return index;
  }

  isIndicationAvailable() {
    return false;
  }

  getIntervalDuration() {
    return toMs('day');
  }

  getTimePanelWidth() {
    return 0;
  }

  supportAllDayRow() {
    return false;
  }

  keepOriginalHours() {
    return true;
  }

  getWorkSpaceLeftOffset() {
    return 0;
  }

  needApplyCollectorOffset() {
    return true;
  }

  protected override getHeaderDate() {
    return this.getViewStartByOptions();
  }

  renderRAllDayPanel() {}

  renderRTimeTable() {}

  renderRDateTable() {
    utils.renovation.renderComponent(
      this,
      this.$dateTable,
      DateTableMonthComponent,
      'renovatedDateTable',
      this.getRDateTableProps(),
    );
  }

  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------

  protected override createWorkSpaceElements() {
    if (this.isVerticalGroupedWorkSpace()) {
      this.createWorkSpaceScrollableElements();
    } else {
      super.createWorkSpaceElements();
    }
  }

  protected override updateAllDayVisibility() { return noop(); }
}

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth as any);

export default SchedulerWorkSpaceMonth;
