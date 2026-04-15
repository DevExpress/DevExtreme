import type { GridCommand } from './base';
import { sortCommand } from './sorting';

export type { GridCommand } from './base';

export const defaultCommands: GridCommand[] = [
  sortCommand,
];
