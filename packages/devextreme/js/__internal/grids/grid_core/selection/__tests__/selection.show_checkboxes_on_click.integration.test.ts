import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { ArrayStore } from '@js/common/data';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

const SELECTION: DataGridProperties['selection'] = {
  mode: 'multiple',
  deferred: true,
  showCheckBoxesMode: 'onClick',
};

describe('Deferred selection with showCheckBoxesMode: onClick', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('simple key', () => {
    const createGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
      dataSource: [
        { id: 1, name: 'Anna' },
        { id: 2, name: 'Berta' },
      ],
      keyExpr: 'id',
      columns: ['id', 'name'],
      selection: SELECTION,
    });

    it('does not show checkboxes when one row is selected', async () => {
      const { instance } = await createGrid();

      await instance.selectRows([1], false);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(false);
    });

    it('shows checkboxes when several rows are selected', async () => {
      const { instance } = await createGrid();

      await instance.selectRows([1, 2], false);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(true);
    });

    it('hides checkboxes when the selection is cleared', async () => {
      const { instance } = await createGrid();

      await instance.selectRows([1, 2], false);
      await flushAsync();
      instance.clearSelection();
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(false);
    });
  });

  describe('complex key', () => {
    const createGrid = (): ReturnType<typeof createDataGrid> => createDataGrid({
      dataSource: new ArrayStore({
        key: ['id', 'group'],
        data: [
          { id: 1, group: 1, name: 'Anna' },
          { id: 2, group: 1, name: 'Berta' },
        ],
      }),
      keyExpr: undefined,
      columns: ['id', 'group', 'name'],
      selection: SELECTION,
    });

    it('does not show checkboxes when one row is selected', async () => {
      const { instance } = await createGrid();

      await instance.selectRows([{ id: 1, group: 1 }], false);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(false);
    });

    it('shows checkboxes when several rows are selected', async () => {
      const { instance } = await createGrid();

      await instance.selectRows([{ id: 1, group: 1 }, { id: 2, group: 1 }], false);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(true);
    });

    it('shows checkboxes when the selection filter has a field outside the key', async () => {
      const { instance } = await createGrid();

      instance.option('selectionFilter', [['id', '=', 1], 'and', ['name', '=', 'Anna']]);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(true);
    });

    it('shows checkboxes when the selection filter compares a key field with another operator', async () => {
      const { instance } = await createGrid();

      instance.option('selectionFilter', [['id', '>', 0], 'and', ['group', '=', 1]]);
      await flushAsync();

      expect(instance.getController('selection').isSelectionWithCheckboxes()).toBe(true);
    });
  });
});
