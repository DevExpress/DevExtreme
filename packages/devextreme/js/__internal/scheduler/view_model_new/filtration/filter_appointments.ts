import type Scheduler from '../../m_scheduler';
import type { ListEntity, MinimalAppointmentEntity } from '../types';
import { addAllDayPanelOccupation } from './utils/add_all_day_panel_occupation';
import { filterByAttributes } from './utils/filter_by_attributes/filter_by_attributes';
import { filterByIntervals } from './utils/filter_by_intervals/filter_by_intervals';
import { getFilterOptions } from './utils/get_filter_options/get_filter_options';
import { splitByGroupIndex } from './utils/split_by_group_index';
import { splitByParts } from './utils/split_by_parts';
import { splitByRecurrence } from './utils/split_by_recurrence/split_by_recurrence';

export const filterAppointments = (
  schedulerStore: Scheduler,
  items: MinimalAppointmentEntity[],
): ListEntity[] => {
  const options = getFilterOptions(schedulerStore);
  let entities = addAllDayPanelOccupation(items, options);
  entities = filterByAttributes(entities, options);
  entities = splitByRecurrence(entities, options);
  entities = filterByIntervals(entities, options);
  entities = splitByGroupIndex(entities, options);
  entities = splitByParts(entities, options);

  return entities as ListEntity[];
};
