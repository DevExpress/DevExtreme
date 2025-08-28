import type Scheduler from '../../m_scheduler';
import { getCellHeight, getCellWidth } from '../../workspaces/helpers/m_position_helper';
import { getCompareOptions } from '../common/get_compare_options';
import type { AppointmentEntity, ListEntity } from '../types';
import { getMonthCells } from './options/get_month_cells';
import { getMonthPanelIntervals } from './options/get_month_panel_intervals';
import { addCollector } from './steps/add_collector/add_collector';
import { addDirection } from './steps/add_direction';
import { addGeometry } from './steps/add_geometry/add_geometry';
import { getCollectorSize } from './steps/add_geometry/options/get_collector_size';
import { getMaxLevel } from './steps/add_geometry/options/get_max_level';
import type { GeometryOptions } from './steps/add_geometry/types';
import { addPosition } from './steps/add_position';
import { addSortedIndex } from './steps/add_sorted_index';
import { filterByVirtualScreen } from './steps/filter_by_virtual_screen';
import { snapToCells } from './steps/snap_to_cells';
import { splitByParts } from './steps/split_by_parts';

const INTERVAL_CELLS_COUNT = 7;
const UNLIMITED_COLLECTOR_SIZES = {
  collectorSize: { width: 0, height: 0 },
  collectorWithMarginsSize: { width: 0, height: 0 },
};

export const generateMonthViewModel = (
  schedulerStore: Scheduler,
  items: ListEntity[],
): AppointmentEntity[] => {
  const viewOffset = schedulerStore.getViewOffsetMs();
  const { groupOrientation } = schedulerStore.currentView;
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
  const collectorSizes = maxAppointmentsPerCell === 'unlimited'
    ? UNLIMITED_COLLECTOR_SIZES
    : getCollectorSize(cellSize, rawCollectorSize);
  const maxLevel = getMaxLevel({
    maxAppointmentsPerCell,
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isAdaptivityEnabled,
  });
  const geometryOptions: GeometryOptions = {
    intervals: monthPanel.intervals,
    maxAppointmentsPerCell: maxLevel,
    viewOrientation,
    groupOrientation,
    isGroupByDate,
    isTimeline: false,
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

  const step1 = splitByParts(items, splitOptions);
  const step2 = addPosition(step1, cells);
  const step3 = snapToCells(step2, cells);
  const step7 = addCollector(step3, {
    cells,
    maxLevel,
    isCompact: isCompactCollector,
  });
  const step9 = addSortedIndex(step7);
  const step10 = filterByVirtualScreen(step9);
  const step11 = addGeometry(step10, geometryOptions);
  const step12 = addDirection(step11, 'horizontal', 'horizontal');

  return step12;
};
