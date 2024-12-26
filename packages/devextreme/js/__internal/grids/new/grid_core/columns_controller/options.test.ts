/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnsController } from './columns_controller';

const setup = (config: Options) => {
  const options = new OptionsControllerMock(config);

  const columnsController = new ColumnsController(options);

  return {
    options,
    columnsController,
  };
};

describe('Options', () => {
  describe('columns', () => {
    describe('when given as string', () => {
      it('should be normalized', () => {
        const { columnsController } = setup({ columns: ['a', 'b', 'c'] });
        const columns = columnsController.columns.unreactive_get();

        expect(columns).toMatchSnapshot();
      });
      it('should use given string as dataField', () => {
        const { columnsController } = setup({ columns: ['a', 'b', 'c'] });
        const columns = columnsController.columns.unreactive_get();

        expect(columns[0].dataField).toBe('a');
        expect(columns[1].dataField).toBe('b');
        expect(columns[2].dataField).toBe('c');
      });
      it('should be the same as if we passed objects with dataField only', () => {
        const { columnsController: columnsController1 } = setup({
          columns: ['a', 'b', 'c'],
        });
        const columns1 = columnsController1.columns.unreactive_get();

        const { columnsController: columnsController2 } = setup({
          columns: [
            { dataField: 'a' },
            { dataField: 'b' },
            { dataField: 'c' },
          ],
        });
        const columns2 = columnsController2.columns.unreactive_get();

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
        const columns = columnsController.columns.unreactive_get();
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

        const visibleColumns = columnsController.visibleColumns.unreactive_get();
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

        const visibleColumns = columnsController.visibleColumns.unreactive_get();
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
      const visibleColumns = columnsController.visibleColumns.unreactive_get();

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

  describe('column[].calculateCellValue', () => {
    it('should override value in DataRow', () => {
      const { columnsController } = setup({
        columns: [
          { calculateCellValue: (data: any) => `${data.a} ${data.b}` },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(1);
      expect(dataRow.cells[0].value).toBe('a b');
    });

    it('should take priority over dataField', () => {
      const { columnsController } = setup({
        columns: [
          {
            calculateCellValue: (data: any) => `${data.a} ${data.b}`,
            dataField: 'a',
          },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(1);
      expect(dataRow.cells[0].value).toBe('a b');
    });
  });

  describe('column[].calculateDisplayValue', () => {
    it('should override displayValue in DataRow', () => {
      const { columnsController } = setup({
        columns: [
          { calculateDisplayValue: (data: any) => `${data.a} ${data.b}` },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(1);
      expect(dataRow.cells[0].displayValue).toBe('a b');
    });
  });

  describe('column[].customizeText', () => {
    it('should override text in DataRow', () => {
      const { columnsController } = setup({
        columns: [
          {
            dataField: 'a',
            customizeText: ({ valueText }) => `aa ${valueText} aa`,
          },
        ],
      });

      const dataObject = { a: 'a', b: 'b' };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(1);
      expect(dataRow.cells[0].text).toBe('aa a aa');
    });
  });

  describe('column[].dataField', () => {
    it('should determine which value from data will be used', () => {
      const { columnsController } = setup({
        columns: [{ dataField: 'a' }, { dataField: 'b' }],
      });

      const dataObject = { a: 'a text', b: 'b text' };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(2);
      expect(dataRow.cells[0].text).toBe('a text');
      expect(dataRow.cells[1].text).toBe('b text');
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

      const columns = columnsController.columns.unreactive_get();

      expect(columns).toHaveLength(2);
      expect(columns[0].alignment).toMatchInlineSnapshot('"right"');
      expect(columns[1].alignment).toMatchInlineSnapshot('"center"');
    });
  });

  (['falseText', 'trueText'] as const).forEach((propName) => {
    describe(`column[].${propName}`, () => {
      it('should be used as text for boolean column', () => {
        const { columnsController } = setup({
          columns: [
            {
              dataField: 'a',
              dataType: 'boolean',
              [propName]: `my ${propName} text`,
            },
          ],
        });

        const dataObject = { a: propName === 'trueText' };
        const columns = columnsController.columns.unreactive_get();
        const dataRow = columnsController.createDataRow(dataObject, columns);

        expect(dataRow.cells).toHaveLength(1);
        expect(dataRow.cells[0].text).toBe(`my ${propName} text`);
      });
    });
  });

  describe('column[].format', () => {
    it('should affect dataRow text', () => {
      const { columnsController } = setup({
        columns: [
          {
            dataField: 'a',
            format: 'currency',
          },
        ],
      });

      const dataObject = { a: 123 };
      const columns = columnsController.columns.unreactive_get();
      const dataRow = columnsController.createDataRow(dataObject, columns);

      expect(dataRow.cells).toHaveLength(1);
      expect(dataRow.cells[0].text).toBe('$123');
    });
  });
});
