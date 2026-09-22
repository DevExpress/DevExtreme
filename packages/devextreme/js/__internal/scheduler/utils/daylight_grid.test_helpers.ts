// eslint-disable-next-line import/no-extraneous-dependencies -- test-only helper
import { expect } from '@jest/globals';

import type { DaylightCell } from './daylight_grid';

export const MINUTE_MS = 60 * 1000;
export const HOUR_MS = 60 * MINUTE_MS;

export const elapsedMs = (cells: DaylightCell[]): number => (
  cells.reduce((sum, cell) => sum + (cell.endUTC - cell.startUTC), 0)
);

/** Cell instants meet, and none of them is empty. */
export const expectContinuousInstants = (cells: DaylightCell[]): void => {
  cells.forEach((cell, index) => {
    expect(cell.endUTC).toBeGreaterThan(cell.startUTC);

    if (index > 0) {
      expect(cell.startUTC).toBe(cells[index - 1].endUTC);
    }
  });
};
