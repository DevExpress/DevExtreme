import type { Level, ListEntity } from '../../../types';
import type { CollectorOptions } from './types';

const between = (
  value: number,
  min: number,
  max: number,
): number => Math.min(Math.max(value, min), max);

export const addLevel = <T extends Pick<
  ListEntity, 'startDateUTC' | 'endDateUTC' | 'layoutStartMs' | 'layoutEndMs'
>>(
  entities: T[],
  { minLevel, maxLevel, stackByRow }: Pick<CollectorOptions, 'minLevel' | 'maxLevel' | 'stackByRow'>,
): (T & Level)[] => {
  const minMaxLevel = maxLevel === -1 ? 0 : Math.min(minLevel, maxLevel);
  let levelsEndDate: number[] = [];
  let stack: (T & Level)[] = [];
  return entities.map((entity) => {
    const start = entity.layoutStartMs ?? entity.startDateUTC;
    const end = entity.layoutEndMs ?? entity.endDateUTC;
    const entityEndDate = end === start ? end + 1 : end;
    const entityRow = (entity as { columnIndex?: number }).columnIndex;
    const stackRow = (stack[0] as { columnIndex?: number } | undefined)?.columnIndex;
    const sameRow = !stackByRow || levelsEndDate.length === 0 || entityRow === stackRow;
    let level = 0;
    if (sameRow) {
      const index = levelsEndDate.findIndex((endDate) => start >= endDate);
      level = index === -1 ? levelsEndDate.length : index;
    }
    const extended = {
      ...entity, level, maxLevel: minMaxLevel, inStackWithCollector: false,
    };
    const isIntersectWithPrevious = sameRow && levelsEndDate.some((endDate) => start < endDate);
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
