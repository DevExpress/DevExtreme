import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import type { FooterItem } from '../../types';

// `footerItems` is added by this extender, so it is not on the registered controller's type.
const footerItemsOf = (instance: DataGridInstance): FooterItem[] => (
  instance.getController('data') as unknown as { footerItems: () => FooterItem[] }
).footerItems();

const DATA = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 },
];

const TOTAL_ITEMS = [
  { name: 'valueSum', column: 'value', summaryType: 'sum' as const },
  { name: 'valueMax', column: 'value', summaryType: 'max' as const },
];

describe('Summary data controller — total summary', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('with a data source', () => {
    it('answers getTotalSummaryValue from the aggregates', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      expect(instance.getTotalSummaryValue('valueSum')).toBe(60);
      expect(instance.getTotalSummaryValue('valueMax')).toBe(30);
    });

    it('returns undefined for a summary item that does not exist', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      expect(instance.getTotalSummaryValue('missing')).toBeUndefined();
    });

    it('builds a footer row cell per total item', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: ['value'],
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      const [footerItem] = footerItemsOf(instance);

      expect(footerItem.summaryCells[0].map((cell) => cell.value)).toEqual([60, 30]);
    });

    it('recomputes the footer row after the data changes', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columns: ['value'],
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      instance.option('dataSource', [...DATA, { id: 4, value: 40 }]);
      await flushAsync();

      expect(instance.getTotalSummaryValue('valueSum')).toBe(100);

      const [footerItem] = footerItemsOf(instance);

      expect(footerItem.summaryCells[0].map((cell) => cell.value)).toEqual([100, 40]);
    });
  });

  describe('with no data source', () => {
    it('returns undefined from getTotalSummaryValue', async () => {
      const { instance } = await createDataGrid({
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      expect(instance.getTotalSummaryValue('valueSum')).toBeUndefined();
    });

    it('builds no footer row', async () => {
      const { instance } = await createDataGrid({
        summary: { totalItems: TOTAL_ITEMS },
      });
      await flushAsync();

      expect(footerItemsOf(instance)).toEqual([]);
    });
  });
});
