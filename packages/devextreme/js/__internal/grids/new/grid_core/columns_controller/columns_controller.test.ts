/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnsController } from './columns_controller';

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);

  const columnsController = new ColumnsController(options);

  return {
    options,
    columnsController,
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

  describe('createDataRow', () => {
    it('should process data object to data row using column configuration', () => {
      const { columnsController } = setup({
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataObject = { a: 'my a value', b: 'my b value' };
      const dataRow = columnsController.createDataRow(dataObject, columns);
      expect(dataRow).toMatchSnapshot();
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
