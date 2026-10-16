import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { ColumnWidth } from '@ts/grids/grid_core/views/types';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest, beforeTest, createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const CONTENT_WIDTH = 1000;

const createGrid = async (
  columns: DataGridProperties['columns'] = [],
): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({ dataSource: [], columns });

  $(instance.getView('rowsView').element()).css('width', `${CONTENT_WIDTH}px`);

  return instance;
};

const getAverageColumnsWidth = async (resultWidths: ColumnWidth[]): Promise<number> => {
  const instance = await createGrid();
  const resizingController = instance.getController('resizing');

  // @ts-expect-error _getAverageColumnsWidth is private
  return resizingController._getAverageColumnsWidth(resultWidths);
};

const correctColumnWidths = async (
  columns: DataGridProperties['columns'],
  resultWidths: ColumnWidth[],
): Promise<{ isCorrected: boolean; resultWidths: ColumnWidth[] }> => {
  const instance = await createGrid(columns);
  const resizingController = instance.getController('resizing');
  const visibleColumns = instance.getController('columns').getVisibleColumns();

  // @ts-expect-error _correctColumnWidths is protected
  const isCorrected = resizingController._correctColumnWidths(resultWidths, visibleColumns);

  return { isCorrected, resultWidths };
};

describe('ResizingController._getAverageColumnsWidth', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('splits the free width between the columns without a width', async () => {
    const averageWidth = await getAverageColumnsWidth([200, undefined, 300, undefined]);

    expect(averageWidth).toBe(250);
  });

  it('subtracts percent widths resolved against the content width', async () => {
    const averageWidth = await getAverageColumnsWidth(['30%', 200, undefined]);

    expect(averageWidth).toBe(500);
  });

  it('returns a negative width when the set widths exceed the content width', async () => {
    const averageWidth = await getAverageColumnsWidth([700, 500, undefined]);

    expect(averageWidth).toBe(-200);
  });
});

describe('ResizingController._correctColumnWidths', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('a column without a width and with minWidth', () => {
    it('gets its minWidth when the free width is smaller', async () => {
      const result = await correctColumnWidths(
        [{ dataField: 'a', minWidth: 400 }, { dataField: 'b', width: 700 }],
        [undefined, 700],
      );

      expect(result).toEqual({ isCorrected: true, resultWidths: [400, 700] });
    });

    it('keeps no width when the free width fits its minWidth', async () => {
      const result = await correctColumnWidths(
        [{ dataField: 'a', minWidth: 200 }, { dataField: 'b', width: 700 }],
        [undefined, 700],
      );

      expect(result).toEqual({ isCorrected: false, resultWidths: [undefined, 700] });
    });
  });

  describe('a percent column with minWidth', () => {
    it('gets its minWidth when its percent width is smaller', async () => {
      const result = await correctColumnWidths(
        [{ dataField: 'a', width: '30%', minWidth: 400 }, { dataField: 'b' }],
        ['30%', undefined],
      );

      expect(result).toEqual({ isCorrected: true, resultWidths: [400, undefined] });
    });

    it('keeps its percent width when it is wider than minWidth and minWidth fits', async () => {
      const result = await correctColumnWidths(
        [{ dataField: 'a', width: '50%', minWidth: 400 }, { dataField: 'b' }],
        ['50%', undefined],
      );

      expect(result).toEqual({ isCorrected: false, resultWidths: ['50%', undefined] });
    });

    it('gets its minWidth when minWidth does not fit, even if its percent width is wider', async () => {
      const result = await correctColumnWidths(
        [{ dataField: 'a', width: '150%', minWidth: 1200 }, { dataField: 'b' }],
        ['150%', undefined],
      );

      expect(result).toEqual({ isCorrected: true, resultWidths: [1200, undefined] });
    });
  });
});
