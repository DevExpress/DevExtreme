import type Scheduler from '../../m_scheduler';
import type { AppointmentEntity, ListEntity } from '../types';
import { OptionManager } from './options/option_manager';
import { addCollector } from './steps/add_collector/add_collector';
import { addDirection } from './steps/add_direction';
import { addEmptiness } from './steps/add_emptiness';
import { addGeometry } from './steps/add_geometry/add_geometry';
import { addPosition } from './steps/add_position';
import { addSortedIndex } from './steps/add_sorted_index';
import { expandAllDay } from './steps/expand_all_day';
import { filterByVirtualScreen } from './steps/filter_by_virtual_screen';
import { groupByGroupIndex } from './steps/group_by_group_index';
import { maybeSplit } from './steps/maybe_split';
import { snapToCells } from './steps/snap_to_cells';
import { sortByDuration, sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts/split_by_parts';

export const generateGridViewModel = (
  schedulerStore: Scheduler,
  items: ListEntity[],
): AppointmentEntity[] => {
  const optionManager = new OptionManager(schedulerStore);
  const {
    viewOrientation,
    isMonthView,
    isAdaptivityEnabled,
    isTimelineView,
    hasAllDayPanel,
    isVirtualScrolling,
    compareOptions: { startDayHour },
  } = optionManager.options;
  const { viewDataProvider } = schedulerStore._workSpace;

  const expandedStep2 = expandAllDay(items, startDayHour);

  const positionedStep3 = maybeSplit(expandedStep2, hasAllDayPanel, (entities, panelName) => {
    const byGroup = groupByGroupIndex(entities);
    const positionInsideGroup = byGroup.map((group) => {
      sortByDuration(group);
      sortByStartDate(group);
      const partsStep1 = splitByParts(group, optionManager.getSplitIntervals(panelName));
      sortByDuration(partsStep1);
      sortByStartDate(partsStep1);
      sortByGroupIndex(partsStep1);
      const indexedStep2 = addPosition(partsStep1, optionManager.getCells(panelName));
      const snappedStep3 = isMonthView || panelName === 'allDayPanel'
        ? snapToCells(indexedStep2, optionManager.getCells(panelName))
        : indexedStep2;
      const collected = addCollector(snappedStep3, optionManager.getCollectorOptions(panelName));
      return collected;
    });

    return positionInsideGroup.flat();
  });

  const sortIndexedStep4 = addSortedIndex(positionedStep3);
  const filteredStep5 = filterByVirtualScreen(
    sortIndexedStep4,
    viewDataProvider,
    isVirtualScrolling,
  );
  const sizedStep6 = maybeSplit(filteredStep5, hasAllDayPanel, (entities, panelName) => {
    const output = addGeometry(entities, optionManager.getGeometryOptions(panelName));
    return output;
  });

  const directionStep7 = addDirection(sizedStep6, 'horizontal', viewOrientation);
  const emptyStep8 = addEmptiness(directionStep7, { isTimelineView, isAdaptivityEnabled });

  return emptyStep8;
};
