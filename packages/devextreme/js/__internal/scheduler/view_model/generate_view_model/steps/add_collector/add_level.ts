import type { Level, ListEntity } from '../../../types';
import type { CollectorOptions } from './types';

const between = (
  value: number,
  min: number,
  max: number,
): number => Math.min(Math.max(value, min), max);

export const addLevel = <T extends Pick<ListEntity, 'startDateUTC' | 'endDateUTC'>>(
  entities: T[],
  { minLevel, maxLevel }: Pick<CollectorOptions, 'minLevel' | 'maxLevel'>,
): (T & Level)[] => {
  const minMaxLevel = maxLevel === -1 ? 0 : Math.min(minLevel, maxLevel);
  let levelsEndDate: number[] = [];
  let stack: (T & Level)[] = [];
  return entities.map((entity) => {
    const entityEndDate = entity.endDateUTC === entity.startDateUTC
      ? entity.endDateUTC + 1
      : entity.endDateUTC;
    const index = levelsEndDate.findIndex((endDate) => entity.startDateUTC >= endDate);
    const level = index === -1 ? levelsEndDate.length : index;
    const extended = {
      ...entity, level, maxLevel: minMaxLevel, inStackWithCollector: false,
    };

    const isIntersectWithPrevious = levelsEndDate.some((endDate) => entity.startDateUTC < endDate);
    if (isIntersectWithPrevious) {
      levelsEndDate[level] = entityEndDate;
      stack.push(extended);
      stack.forEach((item) => {
        item.maxLevel = maxLevel === -1
          ? levelsEndDate.length
          : between(levelsEndDate.length, minMaxLevel, maxLevel);
        item.inStackWithCollector = maxLevel !== -1 && levelsEndDate.length > maxLevel;
      });
    } else {
      extended.maxLevel = minMaxLevel;
      extended.inStackWithCollector = maxLevel !== -1 && levelsEndDate.length > maxLevel;
      levelsEndDate = [entityEndDate];
      stack = [extended];
    }

    return extended;
  });
};
