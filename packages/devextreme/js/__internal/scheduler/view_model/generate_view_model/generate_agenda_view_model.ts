import type Scheduler from '../../m_scheduler';
import { getCompareOptions } from '../common/get_compare_options';
import { splitIntervalByDay } from '../common/split_interval_by_days';
import type {
  AgendaEntity, AgendaGeometry, ListEntity,
  UTCDatesAfterSplit,
} from '../types';
import { addLastInGroup } from './steps/add_last_in_group';
import { addSortedIndex } from './steps/add_sorted_index';
import { sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts/split_by_parts';

const saveDatesAfterSplit = <T extends ListEntity>(
  entities: T[],
): (T & UTCDatesAfterSplit)[] => entities.map((entity) => ({
    ...entity,
    datesAfterSplit: {
      startDateUTC: entity.startDateUTC,
      endDateUTC: entity.endDateUTC,
    },
  }));

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
  const intervals = splitIntervalByDay({
    ...compareOptions,
    startDayHour: 0,
    endDayHour: 24,
  });

  let entities = splitByParts(items, intervals);
  entities = saveDatesAfterSplit(entities);
  entities = addAgendaGeometry(entities, height);
  entities = sortByStartDate(entities);
  entities = sortByGroupIndex(entities);
  entities = addLastInGroup(entities);
  return addSortedIndex(entities) as AgendaEntity[];
};
