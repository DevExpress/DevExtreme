import { describe, expect, it } from '@jest/globals';

import { DataController } from '../data_controller';
import { getContext } from '../di.test_utils';
import { ItemsController } from '../items_controller/items_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnsController } from './columns_controller';

const setup = (config: Options) => {
  const context = getContext(config);

  return {
    options: context.get(OptionsControllerMock),
    dataController: context.get(DataController),
    columnsController: context.get(ColumnsController),
    itemsController: context.get(ItemsController),
  };
};

describe('Options', () => {
  describe('columns', () => {
    describe('when given as string', () => {
      it('should be normalized', () => {
        const { columnsController } = setup({ columns: ['a', 'b', 'c'] });
        const columns = columnsController.columns.peek();

        expect(columns).toMatchSnapshot();
      });
      it('should use given string as dataField', () => {
        const { columnsController } = setup({ columns: ['a', 'b', 'c'] });
        const columns = columnsController.columns.peek();

        expect(columns[0].dataField).toBe('a');
        expect(columns[1].dataField).toBe('b');
        expect(columns[2].dataField).toBe('c');
      });
      it('should be the same as if we passed objects with dataField only', () => {
        const { columnsController: columnsController1 } = setup({
          columns: ['a', 'b', 'c'],
        });
        const columns1 = columnsController1.columns.peek();

        const { columnsController: columnsController2 } = setup({
          columns: [
            { dataField: 'a' },
            { dataField: 'b' },
            { dataField: 'c' },
          ],
        });
        const columns2 = columnsController2.columns.peek();

        expect(columns1).toEqual(columns2);
      });
    });
    describe('when given as object', () => {
      it('should be normalized', () => {
        const { columnsController } = setup({
          columns: [
            { dataField: 'a' },
            { dataField: 'b' },
            { dataField: 'c' },
          ],
        });
        const columns = columnsController.columns.peek();
        expect(columns).toMatchSnapshot();
      });
    });
  });

  describe('columns[].visible', () => {
    describe('when it is true', () => {
      it('should include column to visibleColumns', () => {
        const { columnsController } = setup({
          columns: [
            { dataField: 'a', visible: true },
            { dataField: 'b', visible: true },
          ],
        });

        const visibleColumns = columnsController.visibleColumns.peek();
        expect(visibleColumns).toHaveLength(2);
        expect(visibleColumns[0].name).toBe('a');
        expect(visibleColumns[1].name).toBe('b');
      });
    });

    describe('when it is false', () => {
      it('should exclude column from visibleColumns', () => {
        const { columnsController } = setup({
          columns: [
            { dataField: 'a', visible: true },
            { dataField: 'b', visible: false },
          ],
        });

        const visibleColumns = columnsController.visibleColumns.peek();
        expect(visibleColumns).toHaveLength(1);
        expect(visibleColumns[0].name).toBe('a');
      });
    });
  });

  describe('columns[].visibleIndex', () => {
    it('should affect order in visibleColumns', () => {
      const { columnsController } = setup({
        columns: [
          { dataField: 'a', visibleIndex: 1 },
          { dataField: 'b' },
        ],
      });
      const visibleColumns = columnsController.visibleColumns.peek();

      expect(visibleColumns).toHaveLength(2);
      expect(visibleColumns[0]).toMatchObject({
        name: 'b',
        visibleIndex: 0,
      });
      expect(visibleColumns[1]).toMatchObject({
        name: 'a',
        visibleIndex: 1,
      });
    });
  });

  describe('column[].calculateFieldValue', () => {
    it('should override value in CardInfo', () => {
      const { columnsController, itemsController } = setup({
        columns: [
          { calculateFieldValue: (data: any) => `${data.a} ${data.b}` },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(1);
      expect(CardInfo.fields[0].value).toBe('a b');
    });

    it('should take priority over dataField', () => {
      const { columnsController, itemsController } = setup({
        columns: [
          {
            calculateFieldValue: (data: any) => `${data.a} ${data.b}`,
            dataField: 'a',
          },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(1);
      expect(CardInfo.fields[0].value).toBe('a b');
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
  });

  describe('column[].calculateDisplayValue', () => {
    it('should override displayValue in CardInfo', () => {
      const { columnsController, itemsController } = setup({
        columns: [
          { calculateDisplayValue: (data: any) => `${data.a} ${data.b}` },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(1);
      expect(CardInfo.fields[0].displayValue).toBe('a b');
    });
  });

  describe('column[].customizeText', () => {
    it('should override text in CardInfo', () => {
      const { columnsController, itemsController } = setup({
        columns: [
          {
            dataField: 'a',
            customizeText: ({ valueText }) => `aa ${valueText} aa`,
          },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(1);
      expect(CardInfo.fields[0].text).toBe('aa a aa');
    });
  });

  describe('column[].dataField', () => {
    it('should determine which value from data will be used', () => {
      const { columnsController, itemsController } = setup({
        columns: [{ dataField: 'a' }, { dataField: 'b' }],
      });

      const dataObject = { a: 'a text', b: 'b text' };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(2);
      expect(CardInfo.fields[0].text).toBe('a text');
      expect(CardInfo.fields[1].text).toBe('b text');
    });
  });

  describe('column[].dataType', () => {
    it('should affect column default settings', () => {
      const { columnsController } = setup({
        columns: [
          { dataField: 'a', dataType: 'number' },
          { dataField: 'b', dataType: 'boolean' },
        ],
      });

      const columns = columnsController.columns.peek();

      expect(columns).toHaveLength(2);
      expect(columns[0].alignment).toMatchInlineSnapshot('"left"');
      expect(columns[1].alignment).toMatchInlineSnapshot('"left"');
    });
  });

  (['falseText', 'trueText'] as const).forEach((propName) => {
    describe(`column[].${propName}`, () => {
      it('should be used as text for boolean column', () => {
        const { columnsController, itemsController } = setup({
          columns: [
            {
              dataField: 'a',
              dataType: 'boolean',
              [propName]: `my ${propName} text`,
            },
          ],
        });

        const dataObject = { a: propName === 'trueText' };
        const columns = columnsController.columns.peek();
        const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

        expect(CardInfo.fields).toHaveLength(1);
        expect(CardInfo.fields[0].text).toBe(`my ${propName} text`);
      });
    });
  });

  describe('column[].format', () => {
    it('should affect CardInfo text', () => {
      const { columnsController, itemsController } = setup({
        columns: [
          {
            dataField: 'a',
            format: 'currency',
          },
        ],
      });

      const dataObject = { a: 123 };
      const columns = columnsController.columns.peek();
      const CardInfo = itemsController.createCardInfo(dataObject, columns, 0);

      expect(CardInfo.fields).toHaveLength(1);
      expect(CardInfo.fields[0].text).toBe('$123');
    });
  });
});
