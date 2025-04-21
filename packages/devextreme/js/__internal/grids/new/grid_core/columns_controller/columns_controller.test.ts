/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { DataController } from '../data_controller';
import { getContext } from '../di.test_utils';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnsController } from './columns_controller';

const setup = (config: Options = {}) => {
  const context = getContext(config);

  return {
    options: context.get(OptionsControllerMock),
    dataController: context.get(DataController),
    columnsController: context.get(ColumnsController),
    itemsController: context.get(ItemsController),
  };
};

describe('ColumnsController', () => {
  describe('columns', () => {
    it('should contain processed column configs', () => {
      const { columnsController } = setup({
        columns: [
          'a',
          { dataField: 'b' },
          { dataField: 'c', visible: false },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchSnapshot();
    });
  });
  describe('visibleColumns', () => {
    it('should contain visible columns', () => {
      const { columnsController } = setup({
        columns: [
          'a',
          { dataField: 'b' },
          { dataField: 'c', visible: false },
        ],
      });

      const visibleColumns = columnsController.visibleColumns.unreactive_get();
      expect(visibleColumns).toHaveLength(2);
      expect(visibleColumns[0].name).toBe('a');
      expect(visibleColumns[1].name).toBe('b');
    });
  });
  describe('nonVisibleColumns', () => {
    it('should contain non visible columns', () => {
      const { columnsController } = setup({
        columns: [
          'a',
          { dataField: 'b' },
          { dataField: 'c', visible: false },
        ],
      });

      const nonVisibleColumns = columnsController.nonVisibleColumns.unreactive_get();
      expect(nonVisibleColumns).toHaveLength(1);
      expect(nonVisibleColumns[0].name).toBe('c');
    });
  });

  describe('addColumn', () => {
    it('should add new column to columns', () => {
      const { columnsController } = setup(
        { columns: ['a', 'b'] },
      );

      let columns = columnsController.columns.unreactive_get();
      expect(columns).toHaveLength(2);
      expect(columns).toMatchObject([
        { dataField: 'a' },
        { dataField: 'b' },
      ]);

      columnsController.addColumn('c');

      columns = columnsController.columns.unreactive_get();
      expect(columns).toHaveLength(3);
      expect(columns).toMatchObject([
        { dataField: 'a' },
        { dataField: 'b' },
        { dataField: 'c' },
      ]);
    });
  });

  describe('deleteColumn', () => {
    it('should remove given column from columns', () => {
      const { columnsController } = setup(
        { columns: ['a', 'b'] },
      );

      let columns = columnsController.columns.unreactive_get();
      expect(columns).toHaveLength(2);
      expect(columns).toMatchObject([
        { dataField: 'a' },
        { dataField: 'b' },
      ]);

      columnsController.deleteColumn(columns[1]);

      columns = columnsController.columns.unreactive_get();
      expect(columns).toHaveLength(1);
      expect(columns).toMatchObject([
        { dataField: 'a' },
      ]);
    });
  });

  describe('columnOption', () => {
    it('should update option of given column', () => {
      const { columnsController } = setup(
        { columns: ['a', 'b'] },
      );

      let columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchObject([
        { dataField: 'a', visible: true },
        { dataField: 'b', visible: true },
      ]);

      columnsController.columnOption(columns[1], 'visible', false);

      columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchObject([
        { dataField: 'a', visible: true },
        { dataField: 'b', visible: false },
      ]);
    });

    it('should correctly update visibleIndex option for all columns', () => {
      const { columnsController } = setup(
        { columns: ['a', 'b', 'c'] },
      );

      let columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchObject([
        { dataField: 'a', visibleIndex: 0 },
        { dataField: 'b', visibleIndex: 1 },
        { dataField: 'c', visibleIndex: 2 },
      ]);

      columnsController.columnOption(columns[2], 'visibleIndex', 0);

      columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchObject([
        { dataField: 'a', visibleIndex: 1 },
        { dataField: 'b', visibleIndex: 2 },
        { dataField: 'c', visibleIndex: 0 },
      ]);
    });
  });

  describe('updateColumnDataType', () => {
    it('should infer and apply dataType based on firstItem', () => {
      const { columnsController } = setup({
        columns: [
          { dataField: 'created' },
          { dataField: 'amount' },
        ],
      });

      columnsController.setFirstItems({
        created: new Date('2024-01-01'),
        amount: 1234.56,
      });

      const columns = columnsController.columns.unreactive_get();

      expect(columns[0].dataType).toBe('date');
      expect(columns[1].dataType).toBe('number');
    });
  });
});
