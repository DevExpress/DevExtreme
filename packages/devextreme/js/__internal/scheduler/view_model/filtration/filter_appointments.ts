import type Scheduler from '../../m_scheduler';
import { getCompareOptions } from '../common/get_compare_options';
import type {
  Duration, ListEntity, MinimalAppointmentEntity, UTCDates,
  UTCDatesBeforeSplit,
} from '../types';
import { addAllDayPanelOccupation } from './utils/add_all_day_panel_occupation';
import { filterByAttributes } from './utils/filter_by_attributes/filter_by_attributes';
import { filterByIntervals } from './utils/filter_by_intervals/filter_by_intervals';
import { getFilterOptions } from './utils/get_filter_options/get_filter_options';
import { splitByGroupIndex } from './utils/split_by_group_index';
import { splitByRecurrence } from './utils/split_by_recurrence/split_by_recurrence';

const addDuration = <T extends MinimalAppointmentEntity & UTCDates>(
  appointments: T[],
): (T & Duration)[] => appointments.map((appointment) => ({
    ...appointment,
    duration: appointment.endDateUTC - appointment.startDateUTC,
  }));

const saveDatesBeforeSplit = <T extends MinimalAppointmentEntity & UTCDates>(
  appointments: T[],
): (T & UTCDatesBeforeSplit)[] => appointments.map((appointment) => ({
    ...appointment,
    datesBeforeSplit: {
      startDateUTC: appointment.startDateUTC,
      endDateUTC: appointment.endDateUTC,
    },
  }));

export const filterAppointments = (
  schedulerStore: Scheduler,
  appointments: MinimalAppointmentEntity[],
): ListEntity[] => {
  const compareOptions = getCompareOptions(schedulerStore);
  const options = getFilterOptions(schedulerStore, compareOptions);
  const step1 = addAllDayPanelOccupation(appointments, options);
  const step2 = filterByAttributes(step1, options);
  const step3 = splitByRecurrence(step2, options);
  const step4 = filterByIntervals(step3, options);
  const step5 = addDuration(step4);
  const step6 = splitByGroupIndex(step5, options);
  const step7 = saveDatesBeforeSplit(step6);

  return step7;
};
