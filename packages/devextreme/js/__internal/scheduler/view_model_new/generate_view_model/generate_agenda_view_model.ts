import type Scheduler from '../../m_scheduler';
import type { AgendaEntity, ListEntity } from '../types';
import { addLastInGroup } from './utils/add_last_in_group';
import { addSortedIndex } from './utils/add_sorted_index';
import { sortByGroupIndex, sortByStartDate } from './utils/sorting';

export const generateAgendaViewModel = (
  schedulerStore: Scheduler,
  items: ListEntity[],
): AgendaEntity[] => {
  const height = schedulerStore.fire('getAgendaVerticalStepHeight');
  const withGeometry = items.map((entity) => ({
    ...entity,
    height,
    width: '100%',
  }));
  sortByStartDate(withGeometry);
  sortByGroupIndex(withGeometry);
  const withLastGroup = addLastInGroup(withGeometry);
  return addSortedIndex(withLastGroup);
};
