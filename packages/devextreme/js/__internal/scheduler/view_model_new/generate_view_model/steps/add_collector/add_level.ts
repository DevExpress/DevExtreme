import type { Level, ListEntity, MaxLevel } from '../../../types';

export const addLevel = <T extends Pick<ListEntity, 'startDate' | 'endDate' | 'groupIndex'>>(
  entities: T[],
  maxLevel: number,
): (T & Level & MaxLevel)[] => {
  let levelsEndDate: number[] = [];
  let stack: (T & Level & MaxLevel)[] = [];
  return entities.map((entity, entityIndex) => {
    const index = levelsEndDate.findIndex((endDate) => entity.startDate >= endDate);
    const level = index === -1 ? levelsEndDate.length : index;
    const extended = { ...entity, level, maxLevel };

    if (maxLevel < 0) {
      const isIntersectWithPrevious = levelsEndDate.some((endDate) => entity.startDate < endDate);
      if (isIntersectWithPrevious) {
        levelsEndDate[level] = extended.endDate;
        stack.push(extended);
        stack.forEach((item) => {
          item.maxLevel = levelsEndDate.length;
        });
      } else {
        extended.maxLevel = 0;
        levelsEndDate = [extended.endDate];
        stack = [extended];
      }
    } else {
      levelsEndDate[level] = extended.endDate;
    }

    if (entities[entityIndex + 1]?.groupIndex !== entity.groupIndex) {
      levelsEndDate = [];
    }

    return extended;
  });
};
