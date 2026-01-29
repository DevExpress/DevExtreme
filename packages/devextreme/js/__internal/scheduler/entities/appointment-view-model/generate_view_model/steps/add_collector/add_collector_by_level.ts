import type {
  AppointmentCollector,
  AppointmentPart, Level,
  ListEntity,
  Position,
  UTCDatesBeforeSplit,
} from '../../../types';
import { splitByCondition } from './split_by_condition';
import type { CollectorOptions } from './types';

const addEmptyCollector = <T>(
  entities: T[],
): (T & AppointmentCollector)[] => entities.map((entity) => ({
  ...entity,
  items: [],
  isCompact: false,
}));

const groupByStart = <T extends Position>(
  entities: T[],
  cellsCount: number,
): T[][] => entities.reduce<T[][]>((result, entity) => {
  result[entity.cellIndex].push(entity);
  return result;
}, Array.from({ length: cellsCount }, () => []));

const groupByOccupation = <T extends ListEntity & Level & Position>(
  entities: T[],
  cells: CollectorOptions['cells'],
  maxLevel: number,
): T[][] => entities.reduce<T[][]>((result, entity) => {
  result[entity.cellIndex].push(entity);
  for (let i = entity.cellIndex + 1; i <= entity.endCellIndex; i += 1) {
    if (entity.level >= maxLevel) {
      result[i].push({
        ...entity,
        cellIndex: i,
        endCellIndex: i,
        startDateUTC: cells[i].min,
        endDateUTC: cells[i].max,
        columnIndex: cells[i].columnIndex,
        rowIndex: cells[i].rowIndex,
      });
    }
  }

  return result;
}, Array.from({ length: cells.length }, () => []));

export const addCollectorByLevel = <
  T extends ListEntity & Level & Position & AppointmentPart & UTCDatesBeforeSplit,
>(
  entities: T[],
  {
    cells, isCompact, maxLevel, collectBy,
  }: CollectorOptions,
): (T & AppointmentCollector)[] => {
  if (maxLevel < 0) {
    return addEmptyCollector(entities);
  }

  const groupByCell = collectBy === 'byStartDate'
    ? groupByStart(entities, cells.length)
    : groupByOccupation(entities, cells, maxLevel);

  return groupByCell.reduce<(T & AppointmentCollector)[]>((result, cellEntities) => {
    const [free, collected] = splitByCondition(
      cellEntities,
      (item) => item.level < maxLevel,
    );

    result.push(...addEmptyCollector(free));
    if (collected.length > 0) {
      result.push({
        ...collected[0],
        items: collected,
        isCompact,
      });
    }

    return result;
  }, []);
};
