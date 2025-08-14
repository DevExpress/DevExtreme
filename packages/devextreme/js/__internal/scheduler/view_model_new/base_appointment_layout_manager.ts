import type { Appointment } from '@js/ui/scheduler';

import type Scheduler from '../m_scheduler';
import { getMinimalAppointments } from './preparation/get_minimal_appointments';
import type { FilterOptions, ListEntity, MinimalAppointmentEntity } from './types';
import { getPanelIntervals } from './utils/get_panel_intervals';

export abstract class BaseAppointmentLayoutManager<
  B extends ListEntity,
  C extends B,
> {
  constructor(protected scheduler: Scheduler) {}

  abstract isSupportAllDayPanel(): boolean;

  protected getFilterOptions(isSplitByDays: boolean): FilterOptions {
    const workspace = this.scheduler.getWorkSpace();
    const dateRange = workspace.getDateRange() as Date[];
    const compareOptions = {
      startDayHour: this.scheduler.getViewOption('startDayHour'),
      endDayHour: this.scheduler.getViewOption('endDayHour'),
      min: dateRange[0],
      max: dateRange[1],
    };
    const viewOffset = this.scheduler.getViewOffsetMs();

    return {
      resourceManager: this.scheduler.resourceManager,
      timeZoneCalculator: this.scheduler.timeZoneCalculator,
      viewOffset,
      firstDayOfWeek: this.scheduler.option('firstDayOfWeek'),
      regularPanel: getPanelIntervals(compareOptions, viewOffset, false, isSplitByDays),
      allDayPanel: getPanelIntervals(compareOptions, viewOffset, true, false),
    };
  }

  prepareAppointments(items?: Appointment[]): MinimalAppointmentEntity[] {
    return getMinimalAppointments(
      items,
      {
        allDayPanelMode: this.scheduler.getViewOption('allDayPanelMode'),
        supportAllDayPanel: this.isSupportAllDayPanel(),
        dataAccessors: this.scheduler._dataAccessors,
        cellDurationInMinutes: this.scheduler.getViewOption('cellDuration'),
        timeZoneCalculator: this.scheduler.timeZoneCalculator,
      },
    );
  }

  abstract filterAppointments(items: MinimalAppointmentEntity[]): B[];

  abstract generateViewModel(items: B[]): C[];
}
