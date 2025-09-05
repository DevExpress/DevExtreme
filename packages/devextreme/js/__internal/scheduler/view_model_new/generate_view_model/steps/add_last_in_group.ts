import type { LastInGroup, ListEntity } from '../../types';

const getDayStart = (date: number): number => new Date(date).setHours(0, 0, 0, 0);

export const addLastInGroup = <T extends ListEntity>(
  entities: T[],
): (T & LastInGroup)[] => {
  if (entities.length === 0) {
    return entities as (T & LastInGroup)[];
  }

  let nextGroupIndex = entities[0].groupIndex;
  let nextStartDate = getDayStart(entities[0].startDate);
  return entities.map((entity, index) => {
    const nextEntity = entities[index + 1];
    if (!nextEntity) {
      return { ...entity, isLastInGroup: true };
    }

    const trimDate = nextEntity && getDayStart(nextEntity.startDate);
    if (nextGroupIndex !== nextEntity.groupIndex || nextStartDate !== trimDate) {
      nextGroupIndex = nextEntity.groupIndex;
      nextStartDate = trimDate;
      return { ...entity, isLastInGroup: true };
    }

    return { ...entity, isLastInGroup: false };
  });
};
