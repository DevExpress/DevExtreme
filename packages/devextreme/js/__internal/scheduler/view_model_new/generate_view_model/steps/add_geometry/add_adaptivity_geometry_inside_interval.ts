import type { AppointmentCollectorWithGeometry } from '../../../types';
import {
  getAbstractSizeByViewOrientation,
  getRealSizeByViewOrientation,
} from './swap_by_view_orientation';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;

export const addAdaptivityGeometryInsideInterval = <T extends GeometryMinimalEntity>(
  entity: T,
  {
    cellSize,
    collectorSize,
    collectorWithMarginsSize,
    viewOrientation,
  }: Pick<GeometryOptions, 'cellSize' | 'collectorSize' | 'collectorWithMarginsSize' | 'viewOrientation'>,
): T & Geometry & AppointmentCollectorWithGeometry => {
  const cellAbstractSize = getAbstractSizeByViewOrientation(cellSize, viewOrientation);
  const topInsideCell = entity.isAllDayPanelOccupied || viewOrientation === 'vertical'
    ? (cellSize.height - collectorWithMarginsSize.height) / 2
    : cellSize.height - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  const leftInsideCell = (cellSize.width - collectorWithMarginsSize.width) / 2;

  const abstractGeometry = getAbstractSizeByViewOrientation({
    top: topInsideCell,
    left: leftInsideCell,
    width: collectorSize.width,
    height: collectorSize.height,
  }, viewOrientation);
  abstractGeometry.offsetX += entity.columnIndex * cellAbstractSize.sizeX;

  const geometry = getRealSizeByViewOrientation(abstractGeometry, viewOrientation);
  const items = entity.items.map((item) => ({
    ...item,
    width: cellSize.width,
    height: cellSize.height,
  }));

  return { ...entity, ...geometry, items };
};
