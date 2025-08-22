import type {
  AppointmentCollector,
  AppointmentPart,
  Level,
  ListEntity,
  Position,
} from '../../../types';
import { splitByCondition } from '../split_by_condition';
import type { CollectorOptions } from './types';

const addEmptyCollector = <T>(
  entities: T[],
): (T & AppointmentCollector)[] => entities.map((entity) => ({
    ...entity,
    items: [],
    isCompact: false,
  }));

export const addCollectorByLevel = <T extends ListEntity & Level & Position & AppointmentPart>(
  entities: T[],
  { cells, isCompact, maxLevel }: CollectorOptions,
): (T & AppointmentCollector)[] => {
  if (maxLevel < 0) {
    return addEmptyCollector(entities);
  }

  const groupByCell = entities.reduce<T[][]>((result, entity) => {
    result[entity.cellIndex].push(entity);
    return result;
  }, Array.from({ length: cells.length }, () => []));

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
