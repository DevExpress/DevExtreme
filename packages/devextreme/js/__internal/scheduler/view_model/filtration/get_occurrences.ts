import type { Appointment } from '@js/ui/scheduler';

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
): Appointment[] => {
  const compareOptions = {
    startDayHour: 0,
    endDayHour: 24,
    min: startDate.getTime(),
    max: endDate.getTime(),
    skippedDays: [],
  } as CompareOptions;

  const filterOptions = {
    ...getFilterOptions(schedulerStore, compareOptions),
    // NOTE: to return allDay appointments if they intersect with [startDate; endDate]
    allDayPanelMode: 'allDay',
    supportAllDayPanel: true,
    isDateTimeView: true,
  } as FilterOptions;

  const step1 = addAllDayPanelOccupation(appointments, filterOptions);
  const step2 = splitByRecurrence(step1, filterOptions);
  const step3 = filterByIntervals(step2, filterOptions);

  const step4 = step3.map((appointment) => {
    const { startDate: sourceStartDate, endDate: sourceEndDate } = appointment.source;
    const occurrence = { ...appointment.itemData };

    schedulerStore._dataAccessors.set('startDate', occurrence, new Date(sourceStartDate));
    schedulerStore._dataAccessors.set('endDate', occurrence, new Date(sourceEndDate));

    return occurrence;
  });

  return step4;
};
