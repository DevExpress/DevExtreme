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
    it('should infer column configs including dataType from the first item when no columns are defined', () => {
      const dataItem = {
        id: 1,
        name: 'Alice',
        age: 30,
        isActive: true,
        createdAt: new Date('2022-01-01T00:00:00Z'),
      };

      const { columnsController } = setup({
        dataSource: [dataItem],
      });

      const columns = columnsController.columns.unreactive_get();
      expect(columns).toMatchSnapshot();
    });

    it('should not overwrite existing columns when firstItem is provided', () => {
      const { columnsController } = setup({
        columns: [{
          dataField: 'foo',
          name: 'foo',
          visible: true,
          visibleIndex: 0,
        }],
      });

      const dataItem = {
        id: 1,
        bar: 'baz',
      };

      columnsController.firstItem.update(dataItem);

      const columns = columnsController.columns.unreactive_get();
      expect(columns).toHaveLength(1);
      expect(columns[0].dataField).toBe('foo');
    });

    it('should not generate columns if firstItem is null or undefined', () => {
      const { columnsController } = setup();

      columnsController.firstItem.update(null);
      expect(columnsController.columns.unreactive_get()).toEqual([]);

      // @ts-expect-error
      columnsController.firstItem.update(undefined);
      expect(columnsController.columns.unreactive_get()).toEqual([]);
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
});
