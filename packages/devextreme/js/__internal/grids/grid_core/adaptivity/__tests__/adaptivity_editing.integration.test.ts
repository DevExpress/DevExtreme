import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Kate' },
];

describe('Adaptivity editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Closing an edit cell in batch mode', () => {
    it('should repaint the row whose adaptive detail row is expanded', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });
      await flushAsync();

      instance.expandAdaptiveDetailRow(2);
      await flushAsync();
      instance.editCell(0, 'name');
      await flushAsync();

      const expandedRowElement = instance.getRowElement(1)?.[0];
      instance.closeEditCell();
      await flushAsync();

      expect(instance.getRowElement(1)?.[0]).not.toBe(expandedRowElement);
    });

    it('should not repaint the other rows', async () => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        keyExpr: 'id',
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
      });
      await flushAsync();

      instance.expandAdaptiveDetailRow(2);
      await flushAsync();
      instance.editCell(0, 'name');
      await flushAsync();

      const lastRowElement = instance.getRowElement(3)?.[0];
      instance.closeEditCell();
      await flushAsync();

      expect(lastRowElement).toBeInstanceOf(HTMLElement);
      expect(instance.getRowElement(3)?.[0]).toBe(lastRowElement);
    });
  });
});
