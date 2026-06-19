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
    isMonthView,
    cells,
    autoRowHeights,
  }: GeometryOptions,
): Geometry => {
  const rowKey = isMonthView ? entity.rowIndex : entity.groupIndex;
  const effectiveCellSize = autoRowHeights?.length
    ? { ...cellSize, height: autoRowHeights[rowKey] ?? cellSize.height }
    : cellSize;

  const cellAbstractSize = getAbstractSizeByViewOrientation(effectiveCellSize, viewOrientation);
  const collectorFullAbstractSize = getAbstractSizeByViewOrientation(
    collectorWithMarginsSize,
    viewOrientation,
  );
  const abstractGeometry = {
    ...getAppointmentX(entity, cellAbstractSize, cells),
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
