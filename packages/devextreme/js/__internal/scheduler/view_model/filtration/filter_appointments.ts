import type Scheduler from '../../m_scheduler';
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
  entities: T[],
): (T & Duration)[] => entities.map((entity) => ({
    ...entity,
    duration: entity.endDateUTC - entity.startDateUTC,
  }));

const saveDatesBeforeSplit = <T extends MinimalAppointmentEntity & UTCDates>(
  entities: T[],
): (T & UTCDatesBeforeSplit)[] => entities.map((entity) => ({
    ...entity,
    datesBeforeSplit: {
      startDateUTC: entity.startDateUTC,
      endDateUTC: entity.endDateUTC,
    },
  }));

export const filterAppointments = (
  schedulerStore: Scheduler,
  items: MinimalAppointmentEntity[],
): ListEntity[] => {
  const options = getFilterOptions(schedulerStore);
  const step1 = addAllDayPanelOccupation(items, options);
  const step2 = filterByAttributes(step1, options);
  const step3 = splitByRecurrence(step2, options);
  const step4 = filterByIntervals(step3, options);
  const step5 = addDuration(step4);
  const step6 = splitByGroupIndex(step5, options);
  const step7 = saveDatesBeforeSplit(step6);

  return step7;
};
