import { getAppointmentX, getAppointmentY } from './get_appointment_abstract_geometry';
import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const getAppointmentGeometry = (
  entity: GeometryMinimalEntity,
  {
    intervals,
    intervalSize,
    collectorPosition,
    cellSize,
    collectorWithMarginsSize,
    viewOrientation,
    cells,
  }: GeometryOptions,
): Geometry => {
  const dateInterval = intervals[entity.rowIndex];
  const intervalAbstractSize = getAbstractSizeByViewOrientation(intervalSize, viewOrientation);
  const interval = { ...dateInterval, ...intervalAbstractSize };
  const cellAbstractSize = getAbstractSizeByViewOrientation(cellSize, viewOrientation);
  const collectorFullAbstractSize = getAbstractSizeByViewOrientation(
    collectorWithMarginsSize,
    viewOrientation,
  );
  const abstractGeometry = {
    ...getAppointmentX(entity, cellAbstractSize, cells),
    ...getAppointmentY(entity, interval, collectorFullAbstractSize.sizeY, collectorPosition),
  };
  const entityGeometry = getRealSizeByViewOrientation(
    abstractGeometry,
    viewOrientation,
  );

  return entityGeometry;
};
