import type { DateInterval } from '../../../types';
import { getAbstractSizeByViewOrientation } from './swap_by_view_orientation';
import type {
  AbstractSize,
  GeometryMinimalEntity,
  GeometryOptions,
  X,
  Y,
} from './types';

export const getAppointmentX = (
  entity: Pick<GeometryMinimalEntity, 'startDate' | 'endDate'>,
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

export const getAppointmentY = (
  entity: Pick<GeometryMinimalEntity, 'level' | 'maxLevel'>,
  interval: AbstractSize,
  collectorSizeY: number,
  collectorPosition: GeometryOptions['collectorPosition'],
): Y => {
  const maxSizeY = interval.sizeY - collectorSizeY;
  const sizeY = entity.maxLevel === 0
    ? maxSizeY
    : maxSizeY / entity.maxLevel;
  let offsetY = entity.level * sizeY;
  if (collectorPosition === 'start') {
    offsetY += collectorSizeY;
  }

  return { sizeY, offsetY };
};

export const getAppointmentGeometry = (
  entity: GeometryMinimalEntity,
  interval: AbstractSize & DateInterval,
  {
    collectorPosition,
    cellSize,
    collectorSize,
    collectorWithMarginsSize,
    viewOrientation,
  }: Pick<GeometryOptions, 'collectorPosition' | 'cellSize' | 'collectorSize' | 'collectorWithMarginsSize' | 'viewOrientation'>,
): X & Y => {
  if (entity.items.length) {
    const collectorAbstractSize = getAbstractSizeByViewOrientation(collectorSize, viewOrientation);
    const cellAbstractSize = getAbstractSizeByViewOrientation(cellSize, viewOrientation);
    const abstractGeometry = {
      offsetX: entity.columnIndex * cellAbstractSize.sizeX,
      offsetY: collectorPosition === 'start' ? 0 : cellAbstractSize.sizeY - collectorAbstractSize.sizeY,
      sizeY: collectorAbstractSize.sizeY,
      sizeX: collectorAbstractSize.sizeX,
    };

    return abstractGeometry;
  }

  const collectorFullAbstractSize = getAbstractSizeByViewOrientation(
    collectorWithMarginsSize,
    viewOrientation,
  );
  const abstractGeometry = {
    ...getAppointmentX(entity, interval),
    ...getAppointmentY(entity, interval, collectorFullAbstractSize.sizeY, collectorPosition),
  };

  return abstractGeometry;
};
