import type {
  AllDayPanelOccupation,
  AppointmentCollector,
  AppointmentCollectorWithGeometry,
  DateInterval,
  Level,
  ListEntity, MaxLevel,
  Position,
} from '../../../types';
import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';
import type {
  AbstractSize,
  Geometry,
  GeometryOptions,
  RealSize, X, Y,
} from './types';

type Entity = Pick<ListEntity, 'startDate' | 'endDate' | 'groupIndex'>;

const getAppointmentX = (
  entity: Entity,
  interval: AbstractSize & DateInterval,
): X => {
  const { min, max } = interval;
  const intervalDuration = max - min;
  const startTimeDelta = entity.startDate - min;
  const entityDuration = entity.endDate - entity.startDate;
  const offsetX = (startTimeDelta * interval.sizeX) / intervalDuration;
  const sizeX = (entityDuration * interval.sizeX) / intervalDuration;

  return { offsetX, sizeX };
};
const getAppointmentY = (
  entity: Level & MaxLevel & Position,
  interval: AbstractSize,
  collectorSizeY: number,
): Y => {
  const maxSizeY = interval.sizeY - collectorSizeY;
  const sizeY = entity.maxLevel === 0
    ? maxSizeY
    : maxSizeY / entity.maxLevel;
  const offsetY = interval.sizeY - (entity.level + 1) * sizeY
    + entity.rowIndex * interval.sizeY;

  return { sizeY, offsetY };
};
const getAppointmentGeometry = (
  entity: Entity & Level & MaxLevel & Position & AppointmentCollector,
  interval: AbstractSize & DateInterval,
  { collectorSize, collectorWithMarginsSize, viewOrientation }: GeometryOptions,
): X & Y => {
  const collectorFullAbstractSize = getAbstractSizeByViewOrientation(
    collectorWithMarginsSize,
    viewOrientation,
  );
  const abstractGeometry = {
    ...getAppointmentX(entity, interval),
    ...getAppointmentY(entity, interval, collectorFullAbstractSize.sizeY),
  };

  if (entity.items.length) {
    const collectorAbstractSize = getAbstractSizeByViewOrientation(collectorSize, viewOrientation);

    abstractGeometry.offsetY = entity.rowIndex * interval.sizeY;
    abstractGeometry.sizeY = collectorAbstractSize.sizeY;
    abstractGeometry.sizeX = collectorAbstractSize.sizeX;
  }

  return abstractGeometry;
};

const addGroupingOffset = (
  entity: Entity & Geometry & Position,
  cellSize: RealSize,
  interval: RealSize,
  intervalsCount: number,
  {
    groupCount,
    groupOrientation,
    isGroupByDate,
  }: GeometryOptions,
): void => {
  if (groupCount) {
    switch (true) {
      case groupOrientation === 'horizontal' && isGroupByDate:
        entity.left
          += (groupCount - 1) * cellSize.width * entity.columnIndex // cells before date
          + cellSize.width * entity.groupIndex; // cells inside date
        break;
      case groupOrientation === 'horizontal':
        entity.left += entity.groupIndex * interval.width; // intervals before
        break;
      default:
        entity.top += entity.groupIndex * interval.height * intervalsCount;
    }
  }
};

const addTimelineOffset = (
  entity: Entity & Geometry & Position,
  interval: RealSize,
  intervalsCount: number,
  {
    groupCount,
    groupOrientation,
    isGroupByDate,
    isTimeline,
  }: GeometryOptions,
): void => {
  if (isTimeline) {
    entity.left += entity.rowIndex * interval.width; // intervals before

    if (groupCount) {
      switch (true) {
        case groupOrientation === 'horizontal' && isGroupByDate:
          // grouped intervals before
          entity.left += (groupCount - 1) * entity.rowIndex * interval.width;
          break;
        case groupOrientation === 'horizontal':
          // intervals of groups before
          entity.left += entity.groupIndex * intervalsCount * interval.width;
          break;
        default:
      }
    }
  }
};

const getPanelSizeByInterval = (
  interval: RealSize,
  {
    intervals,
    groupOrientation,
    isTimeline,
    groupCount,
  }: GeometryOptions,
): RealSize => {
  const resultInterval = { ...interval };

  if (isTimeline) {
    resultInterval.width *= intervals.length;
  } else {
    resultInterval.height *= intervals.length;
  }

  if (groupCount) {
    if (groupOrientation === 'horizontal') {
      resultInterval.width *= groupCount;
    } else {
      resultInterval.height *= groupCount;
    }
  }

  return resultInterval;
};

// NOTE: It needs to stabilize the appointment size for partial interval size
const resizeToWorkspace = (
  entity: Geometry,
  interval: RealSize,
  options: GeometryOptions,
): void => {
  const { panelSize } = options;
  if (panelSize.width === 0 || panelSize.height === 0) {
    return;
  }

  const panelSizeByInterval = getPanelSizeByInterval(interval, options);
  entity.left *= panelSize.width / panelSizeByInterval.width;
  entity.top *= panelSize.height / panelSizeByInterval.height;
  entity.width *= panelSize.width / panelSizeByInterval.width;
  entity.height *= panelSize.height / panelSizeByInterval.height;
};

const RTLSwap = (
  entity: Geometry,
  { panelSize, isRTLEnabled }: GeometryOptions,
): void => {
  if (isRTLEnabled) {
    entity.left = panelSize.width - entity.left - entity.width;
  }
};

const addGeometryInsideInterval = <
  T extends Entity & Position & Level & MaxLevel & AppointmentCollector,
>(
    entity: T,
    options: GeometryOptions,
  ): T & Geometry & AppointmentCollectorWithGeometry => {
  const { intervals, intervalSize, viewOrientation } = options;
  const dateInterval = intervals[entity.rowIndex];
  const intervalAbstractSize = getAbstractSizeByViewOrientation(intervalSize, viewOrientation);
  const interval = { ...dateInterval, ...intervalAbstractSize };
  const abstractGeometryInsideInterval = getAppointmentGeometry(entity, interval, options);
  const entityGeometry = getRealSizeByViewOrientation(
    abstractGeometryInsideInterval,
    viewOrientation,
  );
  const items = entity.items.map((item) => {
    const x = getAppointmentX({ ...entity, ...item }, interval);
    const itemRealSize = getRealSizeByViewOrientation(
      { sizeX: x.sizeX, sizeY: abstractGeometryInsideInterval.sizeY },
      viewOrientation,
    );

    return { ...item, ...itemRealSize };
  });

  return { ...entity, ...entityGeometry, items };
};

const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;
const addAdaptivityGeometryInsideInterval = <
  T extends Entity & Position & Level & MaxLevel & AppointmentCollector & AllDayPanelOccupation,
>(
    entity: T,
    options: GeometryOptions,
  ): T & Geometry & AppointmentCollectorWithGeometry => {
  const {
    cellSize, collectorSize, intervalSize, intervals,
  } = options;
  const dateInterval = intervals[entity.rowIndex];
  const topInsideCell = entity.isAllDayPanelOccupied
    ? (cellSize.height - collectorSize.height) / 2
    : cellSize.height - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  const leftInsideCell = (cellSize.width - collectorSize.width) / 2;
  const x = getAppointmentX(entity, {
    ...dateInterval,
    sizeX: intervalSize.width,
    sizeY: intervalSize.height,
  });
  const geometry = {
    left: leftInsideCell + x.offsetX,
    top: topInsideCell + entity.rowIndex * intervalSize.height,
    width: collectorSize.width,
    height: collectorSize.height,
  };
  const items = entity.items.map((item) => ({
    ...item,
    width: cellSize.width,
    height: cellSize.height,
  }));

  return { ...entity, ...geometry, items };
};

export const addGeometry = <
  T extends Entity & Position & Level & MaxLevel & AppointmentCollector & AllDayPanelOccupation,
>(
    entities: T[],
    options: GeometryOptions,
  ): (T & Geometry & AppointmentCollectorWithGeometry)[] => entities.map((rawEntity) => {
    const {
      intervals, cellSize, intervalSize, isAdaptivityEnabled, maxLevel,
    } = options;
    const entity = isAdaptivityEnabled && maxLevel === 0
      ? addAdaptivityGeometryInsideInterval(rawEntity, options)
      : addGeometryInsideInterval(rawEntity, options);
    const intervalsCount = intervals.length;
    addGroupingOffset(entity, cellSize, intervalSize, intervalsCount, options);
    addTimelineOffset(entity, intervalSize, intervalsCount, options);
    resizeToWorkspace(entity, intervalSize, options);
    RTLSwap(entity, options);

    return entity;
  });
