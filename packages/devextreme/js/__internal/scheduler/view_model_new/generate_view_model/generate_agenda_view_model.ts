import type Scheduler from '../../m_scheduler';
import { getCompareOptions } from '../common/get_compare_options';
import { shiftIntervals } from '../common/shift_intervals';
import { splitIntervalByDay } from '../common/split_interval_by_days';
import type { AgendaEntity, AgendaGeometry, ListEntity } from '../types';
import { addLastInGroup } from './steps/add_last_in_group';
import { addSortedIndex } from './steps/add_sorted_index';
import { saveDatesAfterSplit, saveDatesBeforeSplit } from './steps/save_dates';
import { sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts/split_by_parts';

const addAgendaGeometry = <T>(
  entities: T[],
  height: number,
): (T & AgendaGeometry)[] => entities.map((entity) => ({
    ...entity,
    height,
    width: '100%',
  }));

export const generateAgendaViewModel = (
  schedulerStore: Scheduler,
  items: ListEntity[],
): AgendaEntity[] => {
  const height = schedulerStore.fire('getAgendaVerticalStepHeight');
  const compareOptions = getCompareOptions(schedulerStore);
  const viewOffset = schedulerStore.getViewOffsetMs();
  const intervals = splitIntervalByDay(compareOptions);
  const shiftedIntervals = shiftIntervals(intervals, viewOffset);

  let entities = saveDatesBeforeSplit(items, schedulerStore.timeZoneCalculator);
  entities = splitByParts(entities, shiftedIntervals);
  entities = saveDatesAfterSplit(entities);
  entities = addAgendaGeometry(entities, height);
  entities = sortByStartDate(entities);
  entities = sortByGroupIndex(entities);
  entities = addLastInGroup(entities);
  return addSortedIndex(entities) as AgendaEntity[];
};
