import type { GroupIndex } from '../../types';

export const groupByGroupIndex = <T extends GroupIndex>(entities: T[]): T[][] => {
  const result: T[][] = [];
  entities.forEach((entity) => {
    result[entity.groupIndex] = result[entity.groupIndex] || [];
    result[entity.groupIndex].push(entity);
  });
  return result.map((group) => group || []);
};
