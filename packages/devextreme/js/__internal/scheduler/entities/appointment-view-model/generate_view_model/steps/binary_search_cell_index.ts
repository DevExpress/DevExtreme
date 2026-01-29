import type { CellInterval } from '../../types';

export const binarySearchCellIndex = (cells: CellInterval[], targetDate: number): number => {
  let left = 0;
  let right = cells.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const cell = cells[mid];

    if (targetDate >= cell.min && targetDate < cell.max) {
      return mid;
    }

    if (targetDate < cell.min) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return Math.min(left, cells.length - 1);
};
