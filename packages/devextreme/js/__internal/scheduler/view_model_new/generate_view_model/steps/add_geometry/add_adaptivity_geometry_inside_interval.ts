import type { AppointmentCollectorWithGeometry } from '../../../types';
import type {
  Geometry,
  GeometryMinimalEntity,
  GeometryOptions,
} from './types';

const COLLECTOR_ADAPTIVE_BOTTOM_OFFSET = 40;

// NOTE: It's intended only for horizontal views and all day panel,
// for other views uses another strategy
export const addAdaptivityGeometryInsideInterval = <T extends GeometryMinimalEntity>(
  entity: T,
  { cellSize, collectorSize }: Pick<GeometryOptions, 'cellSize' | 'collectorSize'>,
): T & Geometry & AppointmentCollectorWithGeometry => {
  const topInsideCell = entity.isAllDayPanelOccupied
    ? (cellSize.height - collectorSize.height) / 2
    : cellSize.height - COLLECTOR_ADAPTIVE_BOTTOM_OFFSET;
  const leftInsideCell = (cellSize.width - collectorSize.width) / 2;
  const geometry = {
    left: leftInsideCell + entity.columnIndex * cellSize.width,
    top: topInsideCell,
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
