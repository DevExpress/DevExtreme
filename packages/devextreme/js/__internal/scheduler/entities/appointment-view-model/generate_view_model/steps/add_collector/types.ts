import type { CellInterval } from '../../../types';

export interface CollectorOptions {
  cells: CellInterval[];
  minLevel: number;
  maxLevel: number;
  isCompact: boolean;
  collectBy: 'byStartDate' | 'byOccupation';
}
