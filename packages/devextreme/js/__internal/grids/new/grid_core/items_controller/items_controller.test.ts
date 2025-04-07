/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';
import { SearchController } from '@ts/grids/new/grid_core/search';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { SortingController } from '../sorting_controller';
import { ItemsController } from './items_controller';

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);
  const columnsController = new ColumnsController(options);
  const filterController = new FilterController(options);
  const sortingController = new SortingController(options, columnsController);
  const searchController = new SearchController(options);
  const dataController = new DataController(options, sortingController, filterController);
  const itemsController = new ItemsController(
    dataController,
    columnsController,
    searchController,
  );

  return {
    options,
    dataController,
    columnsController,
    itemsController,
  };
};

describe('ItemsController', () => {
  describe('createDataRow', () => {
    it('should process data object to data row using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataRow = itemsController.createDataRow(dataObject, columns, 0);
      expect(dataRow).toMatchSnapshot();
    });

    it('should process data object to data row using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataRow = itemsController.createDataRow(dataObject, columns, 0, [1]);
      expect(dataRow).toMatchSnapshot();
    });
    it('should detect and assign proper data types to columns and convert values accordingly', () => {
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [
          {
            id: 1,
            amount: '123',
            birthday: '2024-01-01',
            updatedAt: '2024-01-01T10:00:00',
            ref: 'abc123',
          },
        ],
        columns: ['id', 'amount', 'birthday', 'updatedAt', 'ref'],
      });

      const columns = columnsController.columns.unreactive_get();
      const dataRow = itemsController.createDataRow(
        {
          id: 1,
          amount: '123',
          birthday: '2024-01-01',
          updatedAt: '2024-01-01T10:00:00',
          ref: 'abc123',
        },
        columns,
        0,
      );

      // eslint-disable-next-line no-console
      console.log(dataRow);

      const columnMap = new Map(columns.map((column) => [column.dataField, column.dataType]));

      expect(columnMap.get('id')).toBe('number');
      expect(columnMap.get('amount')).toBe('number');
      expect(columnMap.get('birthday')).toBe('date');
      expect(columnMap.get('updatedAt')).toBe('datetime');
      expect(columnMap.get('ref')).toBe('string');

      const birthdayCell = dataRow.cells.find((cell) => cell.column.dataField === 'birthday');
      expect(birthdayCell?.value).toBeInstanceOf(Date);

      const updatedAtCell = dataRow.cells.find((cell) => cell.column.dataField === 'updatedAt');
      expect(updatedAtCell?.value).toBeInstanceOf(Date);
    });
  });

  describe('setSelectionState', () => {
    it('should update the select state of the item', () => {
      const { itemsController } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, a: 'my a value' }],
      });

      itemsController.setSelectionState([1]);

      expect(itemsController.items).toMatchSnapshot();
    });
  });
});
