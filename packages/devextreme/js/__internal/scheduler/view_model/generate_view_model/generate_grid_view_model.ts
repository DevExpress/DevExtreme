import type Scheduler from '../../m_scheduler';
import type { AppointmentEntity, ListEntity } from '../types';
import { OptionManager } from './options/option_manager';
import { addCollector } from './steps/add_collector/add_collector';
import { addDirection } from './steps/add_direction';
import { addEmptiness } from './steps/add_emptiness';
import { addGeometry } from './steps/add_geometry/add_geometry';
import { addPosition } from './steps/add_position';
import { addSortedIndex } from './steps/add_sorted_index';
import { expandAllDayAllDayPanel, expandAllDayRegularPanel } from './steps/expand_all_day';
import { groupByGroupIndex } from './steps/group_by_group_index';
import { maybeSplit } from './steps/maybe_split';
import { snapToCells } from './steps/snap_to_cells';
import { sortByDuration, sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts/split_by_parts';
import { cropByVirtualScreen } from './steps/virtual_screen_crop';
import { filterByVirtualScreen } from './steps/virtual_screen_filter';

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
    viewOffset,
    compareOptions: { endDayHour },
  } = optionManager.options;
  // @ts-expect-error - TODO: architectural debt — accesses private Scheduler.workSpace
  const { viewDataProvider } = schedulerStore.workSpace;

  const step2 = maybeSplit(items, hasAllDayPanel, (entities, panelName) => {
    const byGroup = groupByGroupIndex(entities);
    const positionInsideGroup = byGroup.map((group) => {
      sortByDuration(group);
      sortByStartDate(group);
      const innerStep0 = isMonthView || panelName === 'allDayPanel'
        ? expandAllDayAllDayPanel(group, endDayHour, viewOffset)
        : expandAllDayRegularPanel(group);
      const innerStep1 = splitByParts(innerStep0, optionManager.getSplitIntervals(panelName));
      sortByDuration(innerStep1);
      sortByStartDate(innerStep1);
      sortByGroupIndex(innerStep1);
      const innerStep2 = addPosition(innerStep1, optionManager.getCells(panelName));
      const innerStep3 = isMonthView || panelName === 'allDayPanel'
        ? snapToCells(innerStep2, optionManager.getCells(panelName))
        : innerStep2;
      const innerStep4 = addCollector(innerStep3, optionManager.getCollectorOptions(panelName));
      return innerStep4;
    });

    return positionInsideGroup.flat();
  });

  const step3 = addSortedIndex(step2);
  const step4 = filterByVirtualScreen(
    step3,
    viewDataProvider,
    isVirtualScrolling,
  );
  const step5 = maybeSplit(step4, hasAllDayPanel, (entities, panelName) => {
    const innerStep = addGeometry(entities, optionManager.getGeometryOptions(panelName));
    return innerStep;
  });
  const step6 = cropByVirtualScreen(step5, optionManager.getVirtualCropOptions());

  const step7 = addDirection(step6, 'horizontal', viewOrientation);
  const step8 = addEmptiness(step7, { isTimelineView, isAdaptivityEnabled, isMonthView });

  return step8;
};
