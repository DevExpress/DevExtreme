/**
 * @timezone Africa/Cairo
 */

import { describe, expect, it } from '@jest/globals';

import { addPosition } from './add_position';

const HOUR_MS = 60 * 60 * 1000;

describe('addPosition fall-back DST', () => {
  it('should shift a cropped tail part by its own instant, not the original source start', () => {
    const cells = [0, 1, 2, 3, 4].map((index) => ({
      min: Date.UTC(2026, 9, 29, 22) + index * HOUR_MS,
      max: Date.UTC(2026, 9, 29, 22) + (index + 1) * HOUR_MS,
      cellIndex: index,
      rowIndex: 0,
      columnIndex: index,
    }));
    const source = {
      startDate: new Date(2026, 9, 29, 22).getTime(),
      endDate: new Date(2026, 9, 30, 2).getTime(),
    };

    const [tail] = addPosition([{
      startDateUTC: Date.UTC(2026, 9, 30),
      endDateUTC: Date.UTC(2026, 9, 30, 2),
      source,
    }], cells, HOUR_MS);

    expect(tail.cellIndex).toBe(3);
    expect(tail.endCellIndex).toBe(4);
  });
});
