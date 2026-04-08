import type { NavigationDirection } from './types';

export const getNextColumnIndex = (
  direction: NavigationDirection,
  columnIndex: number,
): number => (direction === 'next' || direction === 'nextInRow'
  ? columnIndex + 1
  : columnIndex - 1);
