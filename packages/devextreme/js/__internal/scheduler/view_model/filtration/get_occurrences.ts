import type { Occurrence } from '@js/ui/scheduler';

import type Scheduler from '../../m_scheduler';
import type {
  CompareOptions, FilterOptions, MinimalAppointmentEntity,
} from '../types';
import { addAllDayPanelOccupation } from './utils/add_all_day_panel_occupation';
import { filterByIntervals } from './utils/filter_by_intervals/filter_by_intervals';
import { getFilterOptions } from './utils/get_filter_options/get_filter_options';
import { splitByRecurrence } from './utils/split_by_recurrence/split_by_recurrence';

export const getOccurrences = (
  schedulerStore: Scheduler,
  startDate: Date,
  endDate: Date,
  appointments: MinimalAppointmentEntity[],
): Occurrence[] => {
  const compareOptions: CompareOptions = {
    // NOTE: days hours are intentionally set to 0 and 24
    // to return all appointments that intersect with [startDate; endDate]
    startDayHour: 0,
    endDayHour: 24,
    min: startDate.getTime(),
    max: endDate.getTime(),
    skippedDays: [],
  };

  const filterOptions: FilterOptions = {
    ...getFilterOptions(schedulerStore, compareOptions),
    // NOTE: to return allDay appointments if they intersect with [startDate; endDate]
    allDayPanelMode: 'allDay',
    supportAllDayPanel: true,
    isDateTimeView: true,
  };

  const step1 = addAllDayPanelOccupation(appointments, filterOptions);
  const step2 = splitByRecurrence(step1, filterOptions);
  const step3 = filterByIntervals(step2, filterOptions);

  const step4: Occurrence[] = step3.map((appointment) => ({
    startDate: new Date(appointment.source.startDate),
    endDate: new Date(appointment.source.endDate),
    appointmentData: appointment.itemData,
  }));

  return step4;
};
