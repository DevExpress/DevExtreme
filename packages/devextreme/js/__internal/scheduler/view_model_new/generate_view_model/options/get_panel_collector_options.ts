import type { Orientation } from '@js/common';
import type Scheduler from '@ts/scheduler/m_scheduler';

import type { PanelName } from '../../types';
import type { CollectorCSS, RealSize } from '../steps/add_geometry/types';
import { getCollectorSize } from './get_collector_size';
import { getMaxLevel } from './get_max_level';

const UNLIMITED_COLLECTOR_SIZES = {
  collectorSize: { width: 0, height: 0 },
  collectorWithMarginsSize: { width: 0, height: 0 },
};
const ALL_DAY_COLLECTOR_WIDTH_FACTOR = 0.75;

export const getPanelCollectorOptions = (schedulerStore: Scheduler, {
  alwaysReserveSpaceForCollector,
  isTimelineView,
  viewOrientation,
  isAdaptivityEnabled,
  collectorCSS,
  DOMMetaData,
  panelName,
}: {
  DOMMetaData: {
    dateTableCellsMeta: RealSize[][];
    allDayPanelCellsMeta: RealSize[];
  };
  alwaysReserveSpaceForCollector: boolean;
  isTimelineView: boolean;
  viewOrientation: Orientation;
  isAdaptivityEnabled: boolean;
  collectorCSS: CollectorCSS;
  panelName: PanelName;
}): {
  cellSize: RealSize;
  collectorSizes: { collectorSize: RealSize; collectorWithMarginsSize: RealSize };
  maxLevel: number;
  minLevel: number;
} => {
  const cellDOM = panelName === 'allDayPanel'
    ? DOMMetaData.allDayPanelCellsMeta[0] || DOMMetaData.dateTableCellsMeta[0][0]
    : DOMMetaData.dateTableCellsMeta[0][0];
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
  const maxLevel = getMaxLevel({
    maxAppointmentsPerCell,
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isTimelineView,
    isAdaptivityEnabled,
  });
  const minLevel = viewOrientation === 'vertical' ? 1 : getMaxLevel({
    maxAppointmentsPerCell: 'auto',
    cellSize,
    collectorSize: collectorSizes.collectorWithMarginsSize,
    viewOrientation,
    isTimelineView,
    isAdaptivityEnabled,
  });

  return {
    cellSize,
    collectorSizes,
    maxLevel,
    minLevel,
  };
};
