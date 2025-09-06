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
import { maybeSplit } from './steps/maybe_split';
import { saveDatesBeforeSplit } from './steps/save_dates';
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
  } = optionManager.options;

  const step1 = saveDatesBeforeSplit(items, schedulerStore.timeZoneCalculator);
  const step2 = expandAllDay(step1, isMonthView);
  const step3 = maybeSplit(step2, hasAllDayPanel, (entities, panelName) => {
    sortByDuration(entities);
    sortByStartDate(entities);
    sortByGroupIndex(entities);
    const innerStep1 = splitByParts(entities, optionManager.getSplitIntervals(panelName));
    sortByDuration(innerStep1);
    sortByStartDate(innerStep1);
    sortByGroupIndex(innerStep1);
    const innerStep2 = addPosition(innerStep1, optionManager.getCells(panelName));
    const innerStep3 = isMonthView || panelName === 'allDayPanel'
      ? snapToCells(innerStep2, optionManager.getCells(panelName))
      : innerStep2;
    const output = addCollector(innerStep3, optionManager.getCollectorOptions(panelName));

    return output;
  });
  const step4 = addSortedIndex(step3);
  const step5 = filterByVirtualScreen(step4, schedulerStore._workSpace.viewDataProvider);
  const step6 = maybeSplit(step5, hasAllDayPanel, (entities, panelName) => {
    const output = addGeometry(entities, optionManager.getGeometryOptions(panelName));
    return output;
  });
  const step7 = addDirection(step6, 'horizontal', viewOrientation);
  const step8 = addEmptiness(step7, { isTimelineView, isAdaptivityEnabled });

  return step8;
};
