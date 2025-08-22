import type { CellInterval } from '../../../types';

export interface CollectorOptions {
  cells: CellInterval[];
  maxLevel: number;
  isCompact: boolean;
}
