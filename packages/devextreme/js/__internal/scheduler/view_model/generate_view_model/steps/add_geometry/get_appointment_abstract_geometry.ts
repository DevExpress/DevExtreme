import type { CellInterval } from '../../../types';
import type {
  AbstractSize,
  GeometryMinimalEntity,
  GeometryOptions,
  X,
  Y,
} from './types';

const getInsideCellX = (date: number, { min, max }: CellInterval, cellSizeX: number): number => {
  const cellDuration = max - min;
  const startTimeDelta = date - min;

  return cellDuration === 0 ? 0 : (startTimeDelta * cellSizeX) / cellDuration;
};

export const getAppointmentX = (
  entity: Pick<GeometryMinimalEntity,
    'startDateUTC' | 'endDateUTC' | 'layoutStartMs' | 'layoutEndMs' | 'cellIndex' | 'endCellIndex' | 'columnIndex'>,
  cellSize: AbstractSize,
  cells: CellInterval[],
): X => {
  const start = entity.layoutStartMs ?? entity.startDateUTC;
  const end = entity.layoutEndMs ?? entity.endDateUTC;
  const startX = getInsideCellX(start, cells[entity.cellIndex], cellSize.sizeX);
  const endX = getInsideCellX(end, cells[entity.endCellIndex], cellSize.sizeX);
  const offsetX = entity.columnIndex * cellSize.sizeX + startX;
  const sizeX = (entity.endCellIndex - entity.cellIndex) * cellSize.sizeX + endX - startX;

  return { offsetX, sizeX };
};

export const getAppointmentY = (
  entity: Pick<GeometryMinimalEntity, 'level' | 'maxLevel' | 'isAllDayPanelOccupied' | 'inStackWithCollector'>,
  cellSize: AbstractSize,
  collectorSizeY: number,
  collectorPosition: GeometryOptions['collectorPosition'],
): Y => {
  if (entity.isAllDayPanelOccupied && !entity.inStackWithCollector) {
    const sizeY = entity.maxLevel === 0
      ? cellSize.sizeY - collectorSizeY
      : (cellSize.sizeY - collectorSizeY) / entity.maxLevel;
    const offsetY = entity.level * sizeY;
    return { sizeY, offsetY };
  }

  const maxSizeY = cellSize.sizeY - collectorSizeY;
  const sizeY = entity.maxLevel === 0
    ? maxSizeY
    : maxSizeY / entity.maxLevel;
  let offsetY = entity.level * sizeY;
  if (collectorPosition === 'start') {
    offsetY += collectorSizeY;
  }

  return { sizeY, offsetY };
};
