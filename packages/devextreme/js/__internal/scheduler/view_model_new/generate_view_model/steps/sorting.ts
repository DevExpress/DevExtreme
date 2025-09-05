export const sortByGroupIndex = <T extends { groupIndex: number }>(
  entities: T[],
): T[] => entities.sort((a, b) => a.groupIndex - b.groupIndex);

export const sortByDuration = <T extends { duration: number }>(
  entities: T[],
): T[] => entities.sort((a, b) => b.duration - a.duration);

export const sortByStartDate = <T extends { startDate: number }>(
  entities: T[],
): T[] => entities.sort((a, b) => a.startDate - b.startDate);
