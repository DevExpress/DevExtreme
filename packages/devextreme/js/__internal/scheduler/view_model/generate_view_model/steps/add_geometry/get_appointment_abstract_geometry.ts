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
  const startCell = cells[entity.cellIndex];
  const endCell = cells[entity.endCellIndex];
  const startX = getInsideCellX(start, startCell, cellSize.sizeX);
  const endX = getInsideCellX(end, endCell, cellSize.sizeX);
  // The spring-forward hole is a row with no cell, so the slot span is wider
  // than the number of real cells and the bar has to reach the end label.
  const offsetX = startCell.columnIndex * cellSize.sizeX + startX;
  const span = (endCell.columnIndex - startCell.columnIndex) * cellSize.sizeX + endX - startX;
  const sizeX = span > 0 ? span : 0;

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
