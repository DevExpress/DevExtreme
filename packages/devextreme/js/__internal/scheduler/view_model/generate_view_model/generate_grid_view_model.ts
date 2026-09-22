import type Scheduler from '../../scheduler';
import { repeatedHourShiftMs } from '../../utils/repeated_hour';
import type { AppointmentEntity, ListEntity, SortedEntity } from '../types';
import type { OptionManager } from './options/option_manager';
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

export const sortAppointments = (
  optionManager: OptionManager,
  items: ListEntity[],
): SortedEntity[] => {
  const {
    isMonthView,
    hasAllDayPanel,
    snapToCellsMode,
    viewOffset,
    isTimelineView,
    compareOptions,
    compareOptions: { endDayHour },
    cellDurationMinutes,
  } = optionManager.options;

  const step2 = maybeSplit(items, hasAllDayPanel, (entities, panelName) => {
    const byGroup = groupByGroupIndex(entities);
    const positionInsideGroup = byGroup.map((group) => {
      sortByDuration(group);
      sortByStartDate(group);
      const innerStep0 = isMonthView || panelName === 'allDayPanel'
        ? expandAllDayAllDayPanel(group, endDayHour, viewOffset)
        : expandAllDayRegularPanel(group);
      const stretchedTimeline = isTimelineView && !isMonthView && panelName === 'regularPanel';
      const shiftedStep = stretchedTimeline
        ? innerStep0.map((entity) => {
          const shiftOf = (sourceDate: number): number => repeatedHourShiftMs(
            compareOptions.min,
            compareOptions.max,
            new Date(sourceDate),
            compareOptions.startDayHour,
            compareOptions.endDayHour,
            cellDurationMinutes * 60 * 1000,
            compareOptions.skippedDays,
          );
          const startDateUTC = entity.startDateUTC + shiftOf(entity.source.startDate);
          const endDateUTC = entity.endDateUTC + shiftOf(entity.source.endDate);

          return {
            ...entity,
            startDateUTC,
            endDateUTC,
            duration: endDateUTC - startDateUTC,
          };
        })
        : innerStep0;
      const innerStep1 = splitByParts(shiftedStep, optionManager.getSplitIntervals(panelName));
      sortByDuration(innerStep1);
      sortByStartDate(innerStep1);
      sortByGroupIndex(innerStep1);
      const innerStep2 = addPosition(innerStep1, optionManager.getCells(panelName));
      const innerStep3 = snapToCells(
        innerStep2,
        optionManager.getCells(panelName),
        panelName === 'allDayPanel' ? 'always' : snapToCellsMode,
      );
      const innerStep4 = addCollector(innerStep3, optionManager.getCollectorOptions(panelName));
      return innerStep4;
    });

    return positionInsideGroup.flat();
  });

  const step3 = addSortedIndex(step2);

  return step3;
};

export const generateGridViewModel = (
  schedulerStore: Scheduler,
  optionManager: OptionManager,
  items: SortedEntity[],
): AppointmentEntity[] => {
  const {
    viewOrientation,
    isMonthView,
    isAdaptivityEnabled,
    isTimelineView,
    hasAllDayPanel,
    isVirtualScrolling,
  } = optionManager.options;
  const { viewDataProvider } = schedulerStore._workSpace;

  const step4 = filterByVirtualScreen(
    items,
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
