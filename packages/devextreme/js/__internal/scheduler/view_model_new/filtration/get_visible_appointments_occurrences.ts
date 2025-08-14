import type {
  FilterOptions, ListEntity, MinimalAppointmentEntity,
} from '../types';
import { filterByAttributes } from './filter_by_attributes';
import { filterByIntervals } from './filter_by_intervals';
import { splitByGroupIndex } from './split_by_group_index';
import { splitByParts } from './split_by_parts';
import { splitByRecurrence } from './split_by_recurrence';

// NOTE: can be applied to one new entity
export const getVisibleAppointmentsOccurrences = <T extends MinimalAppointmentEntity>(
  items: T[],
  options: FilterOptions,
): ListEntity<T>[] => {
  let entities = items;
  entities = filterByAttributes(entities, options);
  entities = splitByRecurrence(entities, options);
  entities = filterByIntervals(entities, options);
  entities = splitByGroupIndex(entities, options);
  entities = splitByParts(entities, options);

  return entities as ListEntity<T>[];
};
