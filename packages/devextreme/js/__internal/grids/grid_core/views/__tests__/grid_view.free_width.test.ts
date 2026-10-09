import { describe, expect, it } from '@jest/globals';

import type { Column } from '../../columns_controller/types';
import { ResizingController } from '../m_grid_view';
import type { RowsView } from '../m_rows_view';
import type { ColumnWidth } from '../types';

const CONTENT_WIDTH = 1000;

interface ResizingControllerInternals {
  _rowsView: Pick<RowsView, 'contentWidth'>;
  _getAverageColumnsWidth: (resultWidths: ColumnWidth[]) => number;
  _correctColumnWidths: (resultWidths: ColumnWidth[], visibleColumns: Column[]) => boolean;
}

const createResizingController = (): ResizingControllerInternals => {
  const controller = Object.create(ResizingController.prototype) as ResizingControllerInternals;

  controller._rowsView = { contentWidth: (): number => CONTENT_WIDTH };

  return controller;
};

const correctColumnWidths = (
  resultWidths: ColumnWidth[],
  visibleColumns: Partial<Column>[],
): { isCorrected: boolean; resultWidths: ColumnWidth[] } => {
  const isCorrected = createResizingController()._correctColumnWidths(
    resultWidths,
    visibleColumns as Column[],
  );

  return { isCorrected, resultWidths };
};

describe('ResizingController._getAverageColumnsWidth', () => {
  it('splits the free width between the columns without a width', () => {
    const averageWidth = createResizingController()
      ._getAverageColumnsWidth([200, undefined, 300, undefined]);

    expect(averageWidth).toBe(250);
  });

  it('subtracts percent widths resolved against the content width', () => {
    const averageWidth = createResizingController()._getAverageColumnsWidth(['30%', 200, undefined]);

    expect(averageWidth).toBe(500);
  });

  it('returns a negative width when the set widths exceed the content width', () => {
    const averageWidth = createResizingController()._getAverageColumnsWidth([700, 500, undefined]);

    expect(averageWidth).toBe(-200);
  });
});

describe('ResizingController._correctColumnWidths', () => {
  describe('a column without a width and with minWidth', () => {
    it('gets its minWidth when the free width is smaller', () => {
      const result = correctColumnWidths([undefined, 700], [{ minWidth: 400 }, { width: 700 }]);

      expect(result).toEqual({ isCorrected: true, resultWidths: [400, 700] });
    });

    it('keeps no width when the free width fits its minWidth', () => {
      const result = correctColumnWidths([undefined, 700], [{ minWidth: 200 }, { width: 700 }]);

      expect(result).toEqual({ isCorrected: false, resultWidths: [undefined, 700] });
    });
  });

  describe('a percent column with minWidth', () => {
    it('gets its minWidth when its percent width is smaller', () => {
      const result = correctColumnWidths(['30%', undefined], [{ width: '30%', minWidth: 400 }, {}]);

      expect(result).toEqual({ isCorrected: true, resultWidths: [400, undefined] });
    });

    it('keeps its percent width when it is wider than minWidth and minWidth fits', () => {
      const result = correctColumnWidths(['50%', undefined], [{ width: '50%', minWidth: 400 }, {}]);

      expect(result).toEqual({ isCorrected: false, resultWidths: ['50%', undefined] });
    });

    it('gets its minWidth when minWidth does not fit, even if its percent width is wider', () => {
      const result = correctColumnWidths(['150%', undefined], [{ width: '150%', minWidth: 1200 }, {}]);

      expect(result).toEqual({ isCorrected: true, resultWidths: [1200, undefined] });
    });
  });
});
