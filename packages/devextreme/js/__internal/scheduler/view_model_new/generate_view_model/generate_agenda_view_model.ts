import type Scheduler from '../../m_scheduler';
import { getCompareOptions } from '../common/get_compare_options';
import type { AgendaEntity, AgendaGeometry, ListEntity } from '../types';
import { getPanelIntervals } from './options/get_panel_intervals';
import { addLastInGroup } from './steps/add_last_in_group';
import { addSortedIndex } from './steps/add_sorted_index';
import { sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts';

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
  const regularPanel = getPanelIntervals(compareOptions, viewOffset, false, true);

  let entities = splitByParts(items, { allDayPanel: regularPanel, regularPanel });
  entities = addAgendaGeometry(entities, height);
  entities = sortByStartDate(entities);
  entities = sortByGroupIndex(entities);
  entities = addLastInGroup(entities);
  return addSortedIndex(entities) as AgendaEntity[];
};
