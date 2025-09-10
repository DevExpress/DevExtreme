import { minusDST } from '../../common/minus_dst';
import type { CellInterval, Duration, Position } from '../../types';

const getDuration = (entity: Duration & Position, cells: CellInterval[]): number => {
  let gapDuration = 0;
  for (let i = entity.cellIndex + 1; i <= entity.endCellIndex; i += 1) {
    gapDuration += minusDST(cells[i].min) - minusDST(cells[i - 1].max);
  }
  return entity.duration - gapDuration;
};

export const subtractGapsFromDuration = <T extends Duration & Position>(
  entities: T[],
  cells: CellInterval[],
): T[] => entities.map((entity) => ({
    ...entity,
    duration: getDuration(entity, cells),
  }));
