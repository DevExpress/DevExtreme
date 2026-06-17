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
    collectorPosition,
    cellSize,
    collectorWithMarginsSize,
    viewOrientation,
    cells,
    panelLeftOffset,
  }: GeometryOptions,
): Geometry => {
  const cellAbstractSize = getAbstractSizeByViewOrientation(cellSize, viewOrientation);
  const collectorFullAbstractSize = getAbstractSizeByViewOrientation(
    collectorWithMarginsSize,
    viewOrientation,
  );
  const abstractLeftOffset = viewOrientation === 'horizontal' ? (panelLeftOffset ?? 0) : 0;
  const abstractGeometry = {
    ...getAppointmentX(entity, cellAbstractSize, cells, abstractLeftOffset),
    ...getAppointmentY(
      entity,
      cellAbstractSize,
      collectorFullAbstractSize.sizeY,
      collectorPosition,
    ),
  };
  const entityGeometry = getRealSizeByViewOrientation(
    abstractGeometry,
    viewOrientation,
  );

  return entityGeometry;
};
