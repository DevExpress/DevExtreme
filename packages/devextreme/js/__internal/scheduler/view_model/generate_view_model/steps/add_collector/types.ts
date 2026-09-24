import type { CellInterval } from '../../../types';

export interface CollectorOptions {
  cells: CellInterval[];
  minLevel: number;
  maxLevel: number;
  isCompact: boolean;
  collectBy: 'byStartDate' | 'byOccupation';
  // Vertical rows are separate cells. Overlapping layout times on different rows stay full width.
  stackByRow?: boolean;
}
