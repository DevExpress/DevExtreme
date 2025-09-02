import { minusDST } from '../../../common/minus_dst';
import type { CellInterval } from '../../../types';
import type {
  AbstractSize,
  GeometryMinimalEntity,
  GeometryOptions,
  X,
  Y,
} from './types';

const getInsideCellX = (date: number, { min, max }: CellInterval, cellSizeX: number): number => {
  const cellDuration = minusDST(max) - minusDST(min);
  const startTimeDelta = minusDST(date) - minusDST(min);
  return (startTimeDelta * cellSizeX) / cellDuration;
};

export const getAppointmentX = (
  entity: Pick<GeometryMinimalEntity, 'startDate' | 'endDate' | 'cellIndex' | 'endCellIndex' | 'columnIndex'>,
  cellSize: AbstractSize,
  cells: CellInterval[],
): X => {
  const startX = getInsideCellX(entity.startDate, cells[entity.cellIndex], cellSize.sizeX);
  const endX = getInsideCellX(entity.endDate, cells[entity.endCellIndex], cellSize.sizeX);
  const offsetX = entity.columnIndex * cellSize.sizeX + startX;
  const sizeX = (entity.endCellIndex - entity.cellIndex) * cellSize.sizeX + endX - startX;

  return { offsetX, sizeX };
};

export const getAppointmentY = (
  entity: Pick<GeometryMinimalEntity, 'level' | 'maxLevel' | 'isAllDayPanelOccupied'>,
  interval: AbstractSize,
  collectorSizeY: number,
  collectorPosition: GeometryOptions['collectorPosition'],
): Y => {
  const maxSizeY = interval.sizeY - collectorSizeY;
  const sizeY = entity.maxLevel === 0
    ? maxSizeY
    : maxSizeY / entity.maxLevel;
  let offsetY = entity.level * sizeY;
  if (collectorPosition === 'start' || entity.isAllDayPanelOccupied) {
    offsetY += collectorSizeY;
  }

  return { sizeY, offsetY };
};
