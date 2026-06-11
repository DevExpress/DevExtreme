import type { Orientation } from '@js/common';
import type Scheduler from '@ts/scheduler/m_scheduler';
import type { DOMMetaData } from '@ts/scheduler/types';

import type { PanelName } from '../../types';
import type { CollectorCSS, RealSize } from '../steps/add_geometry/types';
import { getCollectorSize } from './get_collector_size';
import { getMaxLevel } from './get_max_level';

const UNLIMITED_COLLECTOR_SIZES = {
  collectorSize: { width: 0, height: 0 },
  collectorWithMarginsSize: { width: 0, height: 0 },
};
const ALL_DAY_COLLECTOR_WIDTH_FACTOR = 0.75;
const MIN_LEVEL_VERTICAL_VIEW = 1;

export const getPanelCollectorOptions = (schedulerStore: Scheduler, {
  alwaysReserveSpaceForCollector,
  isTimelineView,
  viewOrientation,
  isAdaptivityEnabled,
  collectorCSS,
  DOMMetaData,
  panelName,
}: {
  DOMMetaData: DOMMetaData;
  alwaysReserveSpaceForCollector: boolean;
  isTimelineView: boolean;
  viewOrientation: Orientation;
  isAdaptivityEnabled: boolean;
  collectorCSS: CollectorCSS;
  panelName: PanelName;
}): {
  allDayPanelCellSize: RealSize;
  cellSize: RealSize;
  collectorSizes: { collectorSize: RealSize; collectorWithMarginsSize: RealSize };
  maxLevel: number;
  minLevel: number;
} => {
  // vertical grouping has only regular panel with all day appointments and regular appointments
  const allDayPanelCellDOM = DOMMetaData.allDayPanelCellsMeta[0]
    || DOMMetaData.dateTableCellsMeta[0][0];
  const regularPanelCellDOM = DOMMetaData.dateTableCellsMeta[1]?.[0]
    || DOMMetaData.dateTableCellsMeta[0][0];

  const cellDOM = panelName === 'allDayPanel' ? allDayPanelCellDOM : regularPanelCellDOM;
  const allDayPanelCellSize = {
    width: allDayPanelCellDOM.width ?? 0,
    height: allDayPanelCellDOM.height ?? 0,
  };
  const cellSize = {
    width: cellDOM.width ?? 0,
    height: cellDOM.height ?? 0,
  };
  const maxAppointmentsPerCell = schedulerStore.getViewOption('maxAppointmentsPerCell');
  const collectorSizes = maxAppointmentsPerCell === 'unlimited' && !alwaysReserveSpaceForCollector
    ? UNLIMITED_COLLECTOR_SIZES
    : getCollectorSize(
      cellSize,
      collectorCSS,
      !isAdaptivityEnabled && panelName === 'allDayPanel'
        ? cellSize.width * ALL_DAY_COLLECTOR_WIDTH_FACTOR
        : 0,
    );
  const maxLevelOptions = {
    maxAppointmentsPerCell,
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isTimelineView,
    isAdaptivityEnabled,
  };
  const maxLevel = getMaxLevel(maxLevelOptions);
  const minLevel = viewOrientation === 'vertical' ? MIN_LEVEL_VERTICAL_VIEW : getMaxLevel({
    ...maxLevelOptions,
    maxAppointmentsPerCell: 'auto',
  });

  return {
    allDayPanelCellSize,
    cellSize,
    collectorSizes,
    maxLevel,
    minLevel,
  };
};
