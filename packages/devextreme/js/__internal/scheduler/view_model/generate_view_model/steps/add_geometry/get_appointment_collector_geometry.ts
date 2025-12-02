import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

export const getAppointmentCollectorGeometry = (
  entity: Pick<GeometryMinimalEntity, 'columnIndex' >,
  {
    collectorPosition,
    cellSize,
    collectorSize,
    collectorWithMarginsSize,
    viewOrientation,
  }: Pick<GeometryOptions, 'collectorPosition' | 'cellSize' | 'collectorSize' | 'collectorWithMarginsSize' | 'viewOrientation'>,
): Geometry => {
  const collectorAbstractSize = getAbstractSizeByViewOrientation(collectorSize, viewOrientation);
  const cellAbstractSize = getAbstractSizeByViewOrientation(cellSize, viewOrientation);
  const abstractGeometry = {
    offsetX: entity.columnIndex * cellAbstractSize.sizeX,
    offsetY: collectorPosition === 'start' ? 0 : cellAbstractSize.sizeY - getAbstractSizeByViewOrientation(
      collectorWithMarginsSize,
      viewOrientation,
    ).sizeY,
    sizeY: collectorAbstractSize.sizeY,
    sizeX: collectorAbstractSize.sizeX,
  };
  const entityGeometry = getRealSizeByViewOrientation(
    abstractGeometry,
    viewOrientation,
  );

  return entityGeometry;
};
