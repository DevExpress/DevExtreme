import { describe, expect, it } from '@jest/globals';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ItemsController } from './items_controller';

const setup = (options: Options = {}) => {
  const context = getContext(options);

  return {
    options: context.get(OptionsControllerMock),
    dataController: context.get(DataController),
    columnsController: context.get(ColumnsController),
    itemsController: context.get(ItemsController),
  };
};

describe('ItemsController', () => {
  describe('createCardInfo', () => {
    it('should process data object to cardInfo using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);
      expect(CardInfo).toMatchSnapshot();
    });

    it('should process data object to cardInfo using column configuration', () => {
      const dataObject = { id: 1, a: 'my a value', b: 'my b value' };
      const { columnsController, itemsController } = setup({
        keyExpr: 'id',
        dataSource: [dataObject],
        columns: [
          'a',
          { dataField: 'b' },
        ],
      });

      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0, [1]);
      expect(CardInfo).toMatchSnapshot();
    });
    it('should parse number value correctly', () => {
      const { columnsController, itemsController } = setup({
        columns: [{ dataField: 'a', dataType: 'number' }],
      });

      const dataObject = { a: '123' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields[0].value).toBe(123);
    });

    it('should parse date value correctly', () => {
      const { columnsController, itemsController } = setup({
        columns: [{ dataField: 'a', dataType: 'date' }],
      });

      const dateString = '2024-12-25T00:00:00.000Z';
      const dataObject = { a: dateString };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields[0].value).toEqual(new Date(dateString));
    });

    it('should fallback to raw value if parseValue returns undefined', () => {
      const { columnsController, itemsController } = setup({
        columns: [{ dataField: 'a', dataType: 'number' }],
      });

      const dataObject = { a: 'abc' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields[0].value).toBe('abc');
    });

    it('should infer dataType as "number" if value is a number and dataType is not set', () => {
      const { columnsController } = setup({
        columns: [{ dataField: 'a' }],
        dataSource: [{ a: 456 }],
      });

      const columns = columnsController.columns.peek();
      expect(columns[0].dataType).toBe('number');
    });

    it('should infer dataType as "date" if value is a Date object and dataType is not set', () => {
      const dateObject = new Date('2025-01-01');
      const { columnsController } = setup({
        columns: [{ dataField: 'a' }],
        dataSource: [{ a: dateObject }],
      });

      const columns = columnsController.columns.peek();
      expect(columns[0].dataType).toBe('date');
    });

    it('should infer dataType as "boolean" if value is a boolean and dataType is not set', () => {
      const { columnsController } = setup({
        columns: [{ dataField: 'a' }],
        dataSource: [{ a: true }],
      });

      const columns = columnsController.columns.peek();
      expect(columns[0].dataType).toBe('boolean');
    });

    it('should format datetime value using shortDateShortTime format', () => {
      const dateObject = new Date('2025-05-05T14:30:00Z');
      const { columnsController, itemsController } = setup({
        columns: [{ dataField: 'a', dataType: 'datetime' }],
        dataSource: [{ a: dateObject }],
      });

      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo({ a: dateObject }, columns, 0);

      expect(CardInfo.fields[0].text).toMatch('5/5/2025, 10:30 PM');
    });
  });

  describe('setSelectionState', () => {
    it('should update the select state of the item', () => {
      const { itemsController } = setup({
        keyExpr: 'id',
        dataSource: [{ id: 1, a: 'my a value' }],
      });

      itemsController.setSelectionState([1]);

      expect(itemsController.items.peek()).toMatchSnapshot();
    });
  });
});
