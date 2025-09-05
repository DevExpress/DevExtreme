import type Scheduler from '../../m_scheduler';
import { getCellHeight, getCellWidth } from '../../workspaces/helpers/m_position_helper';
import { getCompareOptions } from '../common/get_compare_options';
import type { AppointmentEntity, ListEntity } from '../types';
import { getMonthCells } from './options/get_month_cells';
import { getMonthPanelIntervals } from './options/get_month_panel_intervals';
import { addCollector } from './steps/add_collector/add_collector';
import { addDirection } from './steps/add_direction';
import { addEmptiness } from './steps/add_geometry/add_emptiness';
import { addGeometry } from './steps/add_geometry/add_geometry';
import { getCollectorSize } from './steps/add_geometry/options/get_collector_size';
import { getMaxLevel } from './steps/add_geometry/options/get_max_level';
import type { GeometryOptions } from './steps/add_geometry/types';
import { addPosition } from './steps/add_position';
import { addSortedIndex } from './steps/add_sorted_index';
import { filterByVirtualScreen } from './steps/filter_by_virtual_screen';
import { snapToCells } from './steps/snap_to_cells';
import { sortByDuration, sortByGroupIndex, sortByStartDate } from './steps/sorting';
import { splitByParts } from './steps/split_by_parts';

const INTERVAL_CELLS_COUNT = 7;
const UNLIMITED_COLLECTOR_SIZES = {
  collectorSize: { width: 0, height: 0 },
  collectorWithMarginsSize: { width: 0, height: 0 },
};
const addOneMsToAllDay = <T extends ListEntity>(entities: T[]): T[] => entities.map((entity) => ({
  ...entity,
  endDate: entity.allDay ? entity.endDate + 1 : entity.endDate,
}));

export const generateMonthViewModel = (
  schedulerStore: Scheduler,
  items: ListEntity[],
): AppointmentEntity[] => {
  const viewOffset = schedulerStore.getViewOffsetMs();
  const { groupOrientation, type } = schedulerStore.currentView;
  const isGroupByDate = schedulerStore.getViewOption('groupByDate');
  const groupCount = schedulerStore.resourceManager.groupCount();
  const compareOptions = getCompareOptions(schedulerStore);
  const monthPanel = getMonthPanelIntervals(compareOptions, viewOffset);
  const cells = getMonthCells(monthPanel.intervals);
  const splitPanelOptions = {
    ...monthPanel,
    intervals: groupCount && groupOrientation === 'horizontal' && isGroupByDate
      ? cells
      : monthPanel.intervals,
  };
  const splitOptions = {
    allDayPanel: splitPanelOptions,
    regularPanel: splitPanelOptions,
  };

  const isTimeline = false;
  const isRTLEnabled = Boolean(schedulerStore.option('rtlEnabled'));
  const isAdaptivityEnabled = Boolean(schedulerStore.option('adaptivityEnabled'));
  // TODO: for other views: isCompactCollector = adaptivityEnabled || !allDayPanel && vertical_view
  const isCompactCollector = isAdaptivityEnabled;
  const workspace = schedulerStore.getWorkSpace();
  const workspaceDOMSize = workspace.getWorkspaceDOMSize();
  const DOMMetaData = workspace.getDOMElementsMetaData();
  const cellSize = {
    width: getCellWidth(DOMMetaData),
    height: getCellHeight(DOMMetaData),
  };
  const viewOrientation = 'horizontal';
  const rawCollectorSize = schedulerStore.getAppointmentsInstance().getCollectorDimension(
    isCompactCollector,
    false,
  );
  const maxAppointmentsPerCell = schedulerStore.getViewOption('maxAppointmentsPerCell');
  const collectorSizes = maxAppointmentsPerCell === 'unlimited' && type !== 'month'
    ? UNLIMITED_COLLECTOR_SIZES
    : getCollectorSize(cellSize, rawCollectorSize);
  const maxLevel = getMaxLevel({
    maxAppointmentsPerCell,
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isTimeline,
    isAdaptivityEnabled,
  });
  const minLevel = getMaxLevel({
    maxAppointmentsPerCell: 'auto',
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isTimeline,
    isAdaptivityEnabled,
  });
  const geometryOptions: GeometryOptions = {
    intervals: monthPanel.intervals,
    maxAppointmentsPerCell: maxLevel,
    viewOrientation,
    groupOrientation,
    isGroupByDate,
    isTimeline,
    isRTLEnabled,
    isAdaptivityEnabled,
    groupCount,
    cellSize,
    collectorPosition: 'start',
    ...collectorSizes,
    intervalSize: {
      width: cellSize.width * INTERVAL_CELLS_COUNT,
      height: cellSize.height,
    },
    panelSize: workspaceDOMSize.regularDayPenalSize,
  };

  // NOTE: if all day starts at 00:00 make it on one ms longer to occupy next cell
  const step0 = addOneMsToAllDay(items);
  sortByDuration(step0);
  sortByStartDate(step0);
  sortByGroupIndex(step0);
  const step2 = splitByParts(step0, splitOptions);
  sortByStartDate(step2);
  sortByGroupIndex(step2);
  const step3 = addPosition(step2, cells);
  const step4 = snapToCells(step3, cells);
  const step5 = addCollector(step4, {
    cells,
    minLevel,
    maxLevel,
    collectBy: 'byOccupation',
    isCompact: isCompactCollector,
  });
  const step6 = addSortedIndex(step5);
  const step7 = filterByVirtualScreen(step6);
  const step8 = addGeometry(step7, geometryOptions);
  const step9 = addDirection(step8, 'horizontal', 'horizontal');
  const step10 = addEmptiness(step9, { isTimeline, isAdaptivityEnabled });

  return step10;
};
