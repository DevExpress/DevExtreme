import registerComponent from '@js/core/component_registrator';
import type { TemplateBase } from '@js/core/templates/template_base';
import dateUtils from '@js/core/utils/date';
import { HeaderPanelComponent } from '@ts/scheduler/r1/components/index';
import { formatWeekdayAndDay, monthUtils } from '@ts/scheduler/r1/utils/index';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerTimeline from './timeline';
import type { ViewDataProviderOptions } from './view_model/m_types';

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';

class SchedulerTimelineMonth extends SchedulerTimeline {
  get type(): string { return VIEWS.TIMELINE_MONTH; }

  readonly viewDirection = 'horizontal';

  get renovatedHeaderPanelComponent(): typeof HeaderPanelComponent { return HeaderPanelComponent; }

  protected override renderView(): void {
    super.renderView();

    this.updateScrollable();
  }

  protected override getElementClass(): string {
    return TIMELINE_CLASS;
  }

  protected override getDateHeaderTemplate(): TemplateBase | null | undefined {
    return this.option('dateCellTemplate');
  }

  protected override calculateDurationInCells(timeDiff: number): number {
    return timeDiff / this.getCellDuration();
  }

  isIndicatorVisible(): boolean {
    return true;
  }

  protected override getFormat(): (date: Date) => string {
    return formatWeekdayAndDay;
  }

  protected override getIntervalBetween(currentDate: Date): number {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const startDayHour = this.option('startDayHour');

    return currentDate.getTime()
      - (firstViewDate.getTime() - startDayHour * 3600000)
      - timeZoneOffset;
  }

  protected override getViewStartByOptions(): Date {
    const currentDate: Date = this.option('currentDate') ?? new Date();
    const startDate: Date = this.option('startDate') ?? currentDate;
    const firstMonthDate = dateUtils.getFirstMonthDate(startDate) ?? startDate;

    return monthUtils.getViewStartByOptions(
      startDate,
      currentDate,
      this.option('intervalCount'),
      firstMonthDate,
    );
  }

  generateRenderOptions(): ViewDataProviderOptions {
    const options = super.generateRenderOptions(true);
    return {
      ...options,
      getDateForHeaderText: (_, date: Date): Date => date,
    };
  }

  keepOriginalHours(): boolean {
    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth as any);

export default SchedulerTimelineMonth;
