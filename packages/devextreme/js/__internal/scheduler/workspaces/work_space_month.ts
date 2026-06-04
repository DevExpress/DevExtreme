import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { getBoundingRect } from '@js/core/utils/position';
import { hasWindow } from '@js/core/utils/window';
import { DateTableMonthComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekday, monthUtils } from '@ts/scheduler/r1/utils/index';

import { utils } from '../m_utils';
import { VIEWS } from '../utils/options/constants_view';
import type { ViewDateGenerationOptions } from './m_work_space';
import SchedulerWorkSpace from './work_space_indicator';

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const toMs = dateUtils.dateToMilliseconds;

class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
  get type(): string { return VIEWS.MONTH; }

  protected override getElementClass(): string {
    return MONTH_CLASS;
  }

  protected override getFormat(): (date: Date) => string {
    return formatWeekday;
  }

  protected override getIntervalBetween(currentDate: Date): number {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const startDayHour = this.option('startDayHour');

    return currentDate.getTime()
      - (firstViewDate.getTime() - startDayHour * 3600000)
      - timeZoneOffset;
  }

  protected override getDateGenerationOptions(): ViewDateGenerationOptions
  & { cellCountInDay: number } {
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
  getCellWidth(): number | undefined {
    const cellWidth = this.cache.memo('cellWidth', (): number | undefined => {
      const DAYS_IN_WEEK = 7;

      let averageWidth = 0;
      const cells = this.getCells().slice(0, DAYS_IN_WEEK);
      cells.each((index, element) => {
        averageWidth += hasWindow() ? getBoundingRect(element).width : 0;
      });

      return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
    });

    return cellWidth as number | undefined;
  }

  protected override insertAllDayRowsIntoDateTable(): boolean {
    return false;
  }

  protected override getCellCoordinatesByIndex(
    index: number,
  ): { rowIndex: number; columnIndex: number } {
    const rowIndex = Math.floor(index / this.getCellCount());
    const columnIndex = index - this.getCellCount() * rowIndex;

    return {
      rowIndex,
      columnIndex,
    };
  }

  protected override needCreateCrossScrolling(): boolean {
    return this.option('crossScrollingEnabled') || this.isVerticalGroupedWorkSpace();
  }

  protected override getViewStartByOptions(): Date {
    return monthUtils.getViewStartByOptions(
      this.option('startDate'),
      this.option('currentDate'),
      this.option('intervalCount'),
      dateUtils.getFirstMonthDate(this.option('startDate')) as Date,
    );
  }

  protected override updateIndex(index: number): number {
    return index;
  }

  isIndicationAvailable(): boolean {
    return false;
  }

  getIntervalDuration(): number {
    return toMs('day');
  }

  getTimePanelWidth(): number {
    return 0;
  }

  supportAllDayRow(): boolean {
    return false;
  }

  keepOriginalHours(): boolean {
    return true;
  }

  getWorkSpaceLeftOffset(): number {
    return 0;
  }

  needApplyCollectorOffset(): boolean {
    return true;
  }

  protected override getHeaderDate(): Date {
    return this.getViewStartByOptions();
  }

  renderRAllDayPanel(): void {}

  renderRTimeTable(): void {}

  renderRDateTable(): void {
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

  protected override createWorkSpaceElements(): void {
    if (this.isVerticalGroupedWorkSpace()) {
      this.createWorkSpaceScrollableElements();
    } else {
      super.createWorkSpaceElements();
    }
  }

  protected override updateAllDayVisibility(): void { return noop(); }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth as any);

export default SchedulerWorkSpaceMonth;
