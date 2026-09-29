import { describe, expect, it } from '@jest/globals';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { isColumnExcluded } from '../utils';

const createColumn = (index: number | undefined): Column => ({ index } as Column);

describe('isColumnExcluded', () => {
  describe('when there is an excluded column', () => {
    it('should report the column with the same index as excluded', () => {
      expect(isColumnExcluded(createColumn(1), createColumn(1))).toBe(true);
    });

    it('should report a column with another index as not excluded', () => {
      expect(isColumnExcluded(createColumn(1), createColumn(2))).toBe(false);
    });

    it('should report a column as excluded when neither has an index', () => {
      expect(isColumnExcluded(createColumn(undefined), createColumn(undefined))).toBe(true);
    });

    it('should report a column without an index as not excluded when the excluded one has it', () => {
      expect(isColumnExcluded(createColumn(undefined), createColumn(1))).toBe(false);
    });
  });

  describe('when there is no excluded column', () => {
    it('should report the column as not excluded', () => {
      expect(isColumnExcluded(createColumn(1), null)).toBe(false);
    });

    it('should report a column without an index as not excluded', () => {
      expect(isColumnExcluded(createColumn(undefined), null)).toBe(false);
    });
  });
});
