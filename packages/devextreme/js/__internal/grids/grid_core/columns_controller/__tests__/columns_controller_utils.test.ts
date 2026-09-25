import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import {
  customizeTextForBooleanDataType,
  getAlignmentByDataType,
  getCommandColumnIndex,
  getCustomizeTextByDataType,
  getSerializationFormat,
  getValueDataType,
  mergeColumns,
  setFilterOperationsAsDefaultValues,
  strictParseNumber,
  updateSerializers,
} from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column, ColumnsControllerOptions } from '@ts/grids/grid_core/columns_controller/types';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('getValueDataType', () => {
  it.each([
    ['a non-empty string', 'text', 'string'],
    ['an empty string', '', 'string'],
    ['a number', 42, 'number'],
    ['zero', 0, 'number'],
    ['NaN', NaN, 'number'],
    ['true', true, 'boolean'],
    ['false', false, 'boolean'],
    ['a date', new Date(2024, 0, 1), 'date'],
    ['a plain object', { a: 1 }, 'object'],
  ])('should return the data type for %s', (_, value, expected) => {
    expect(getValueDataType(value)).toBe(expected);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['an array', [1, 2]],
    ['a function', (): void => {}],
    ['a symbol', Symbol('s')],
    ['a bigint', BigInt(1)],
  ])('should return undefined for %s', (_, value) => {
    expect(getValueDataType(value)).toBeUndefined();
  });
});

describe('getSerializationFormat', () => {
  describe.each(['date', 'datetime'])('when dataType is %s', (dataType) => {
    it.each([
      ['a timestamp', 1704067200000, 'number'],
      ['a date string', '2024/01/15', 'yyyy/MM/dd'],
      ['a date-time string', '2024/01/15 10:30:00', 'yyyy/MM/dd HH:mm:ss'],
      ['an ISO date string', '2024-01-15', 'yyyy-MM-dd'],
      ['an ISO date-time string', '2024-01-15T10:30:00', 'yyyy-MM-ddTHH:mm:ss'],
    ])('should return the format of %s', (_, value, expected) => {
      expect(getSerializationFormat(dataType, value)).toBe(expected);
    });

    it('should return null for a Date object', () => {
      expect(getSerializationFormat(dataType, new Date(2024, 0, 15))).toBeNull();
    });

    it('should return undefined for an empty value', () => {
      expect(getSerializationFormat(dataType, undefined)).toBeUndefined();
    });
  });

  describe('when dataType is number', () => {
    it('should return "string" for a numeric string', () => {
      expect(getSerializationFormat('number', '42')).toBe('string');
    });

    it('should return null for a number', () => {
      expect(getSerializationFormat('number', 42)).toBeNull();
    });

    it.each([
      ['undefined', undefined],
      ['null', null],
      ['NaN', NaN],
    ])('should return undefined for %s', (_, value) => {
      expect(getSerializationFormat('number', value)).toBeUndefined();
    });
  });

  it.each([
    ['string', 'text'],
    ['boolean', true],
    ['object', { a: 1 }],
    [undefined, 42],
  ])('should return undefined when dataType is %s', (dataType, value) => {
    expect(getSerializationFormat(dataType, value)).toBeUndefined();
  });
});

describe('updateSerializers', () => {
  type Serializers = Parameters<typeof updateSerializers>[0];

  it('should keep existing serializers', () => {
    const deserializeValue = (value: unknown): unknown => value;
    const serializeValue = (value: unknown): unknown => value;
    const options: Serializers = { deserializeValue, serializeValue };

    updateSerializers(options, 'number');

    expect(options.deserializeValue).toBe(deserializeValue);
    expect(options.serializeValue).toBe(serializeValue);
  });

  it.each(['string', 'boolean', 'object', undefined])('should not add serializers when dataType is %s', (dataType) => {
    const options: Serializers = {};

    updateSerializers(options, dataType);

    expect(options).toEqual({});
  });

  describe.each(['date', 'datetime'])('when dataType is %s', (dataType) => {
    it('should deserialize a timestamp and a date string to a Date', () => {
      const options: Serializers = {};

      updateSerializers(options, dataType);

      expect(options.deserializeValue?.(1704067200000)).toEqual(new Date(1704067200000));
      expect(options.deserializeValue?.('2024/01/15')).toEqual(new Date(2024, 0, 15));
    });

    it('should serialize a Date using the serialization format', () => {
      const options: Serializers = { serializationFormat: 'yyyy/MM/dd' };

      updateSerializers(options, dataType);

      expect(options.serializeValue?.(new Date(2024, 0, 15))).toBe('2024/01/15');
    });

    it('should read the serialization format at call time', () => {
      const options: Serializers = {};

      updateSerializers(options, dataType);
      options.serializationFormat = 'number';

      expect(options.serializeValue?.(new Date(1704067200000))).toBe(1704067200000);
    });

    it('should return a string value as is', () => {
      const options: Serializers = { serializationFormat: 'yyyy/MM/dd' };

      updateSerializers(options, dataType);

      expect(options.serializeValue?.('2024/01/15')).toBe('2024/01/15');
    });

    it('should return the value as is when there is no serialization format', () => {
      const date = new Date(2024, 0, 15);
      const options: Serializers = {};

      updateSerializers(options, dataType);

      expect(options.serializeValue?.(date)).toBe(date);
    });
  });

  describe('when dataType is number', () => {
    it.each([
      ['a numeric string', '42.5', 42.5],
      ['a number', 7, 7],
      ['a non-numeric string', 'abc', 'abc'],
    ])('should deserialize %s', (_, value, expected) => {
      const options: Serializers = {};

      updateSerializers(options, 'number');

      expect(options.deserializeValue?.(value)).toBe(expected);
    });

    it('should serialize a number to a string when the serialization format is "string"', () => {
      const options: Serializers = { serializationFormat: 'string' };

      updateSerializers(options, 'number');

      expect(options.serializeValue?.(42)).toBe('42');
    });

    it('should not serialize a value for the filter', () => {
      const options: Serializers = { serializationFormat: 'string' };

      updateSerializers(options, 'number');

      expect(options.serializeValue?.(42, 'filter')).toBe(42);
    });

    it.each([
      ['no serialization format', undefined, 42, 42],
      ['a null serialization format', null, 42, 42],
      ['an undefined value', 'string', undefined, undefined],
      ['a null value', 'string', null, null],
    ])('should return the value as is for %s', (_, serializationFormat, value, expected) => {
      const options: Serializers = { serializationFormat };

      updateSerializers(options, 'number');

      expect(options.serializeValue?.(value)).toBe(expected);
    });
  });
});

describe('getCustomizeTextByDataType', () => {
  it('should return the shared boolean customizeText for a boolean column', () => {
    expect(getCustomizeTextByDataType('boolean')).toBe(customizeTextForBooleanDataType);
  });

  it.each(['string', 'number', 'date', 'datetime', 'object', undefined])('should return undefined when dataType is %s', (dataType) => {
    expect(getCustomizeTextByDataType(dataType)).toBeUndefined();
  });
});

describe('customizeTextForBooleanDataType', () => {
  it.each([
    ['trueText for true', { trueText: 'Yes' }, { value: true }, 'Yes'],
    ['"true" for true without trueText', {}, { value: true }, 'true'],
    ['falseText for false', { falseText: 'No' }, { value: false }, 'No'],
    ['"false" for false without falseText', {}, { value: false }, 'false'],
    ['valueText for a non-boolean value', { trueText: 'Yes' }, { value: null, valueText: 'n/a' }, 'n/a'],
    ['an empty string for a non-boolean value without valueText', {}, { value: undefined }, ''],
  ])('should return %s', (_, column, cellInfo, expected) => {
    expect(customizeTextForBooleanDataType.call(column, cellInfo)).toBe(expected);
  });
});

describe('getAlignmentByDataType', () => {
  afterEach(() => {
    config({ rtlEnabled: false });
  });

  it.each([
    ['number', false, 'right'],
    ['number', true, 'right'],
    ['boolean', false, 'center'],
    ['boolean', true, 'center'],
  ])('should return a fixed alignment for %s regardless of RTL (rtl: %s)', (dataType, isRTL, expected) => {
    expect(getAlignmentByDataType(dataType, isRTL)).toBe(expected);
  });

  it.each(['string', 'date', 'datetime', 'object', undefined])('should return the default alignment for %s', (dataType) => {
    expect(getAlignmentByDataType(dataType, false)).toBe('left');
    expect(getAlignmentByDataType(dataType, true)).toBe('right');
  });

  it('should fall back to the global rtlEnabled when isRTL is not passed', () => {
    expect(getAlignmentByDataType('string')).toBe('left');

    config({ rtlEnabled: true });

    expect(getAlignmentByDataType('string')).toBe('right');
  });
});

describe('setFilterOperationsAsDefaultValues', () => {
  it('should set filterOperations to the default filter operations', () => {
    const defaultFilterOperations = ['=', '<>'];
    const column: Column = { defaultFilterOperations };

    setFilterOperationsAsDefaultValues(column);

    expect(column.filterOperations).toBe(defaultFilterOperations);
  });

  it('should replace existing filterOperations', () => {
    const column: Column = { filterOperations: ['contains'], defaultFilterOperations: ['='] };

    setFilterOperationsAsDefaultValues(column);

    expect(column.filterOperations).toEqual(['=']);
  });

  it('should reset filterOperations when there are no default filter operations', () => {
    const column: Column = { filterOperations: ['contains'] };

    setFilterOperationsAsDefaultValues(column);

    expect(column.filterOperations).toBeUndefined();
  });
});

describe('strictParseNumber', () => {
  it.each([
    ['an integer in the decimal format', '123', 'decimal', 123],
    ['a negative number in the decimal format', '-5', 'decimal', -5],
    ['a number in its own format', '1,234.5', { type: 'fixedPoint', precision: 1 }, 1234.5],
    ['a number in the decimal format when the column format differs', '1234.5', { type: 'fixedPoint', precision: 1 }, 1234.5],
  ])('should parse %s', (_, text, format, expected) => {
    expect(strictParseNumber(text, format)).toBe(expected);
  });

  it.each([
    ['a non-numeric text', 'abc', 'decimal'],
    ['an empty text', '', 'decimal'],
    ['a text that matches neither the column format nor the decimal format', '12.30', { type: 'fixedPoint', precision: 1 }],
  ])('should return undefined for %s', (_, text, format) => {
    expect(strictParseNumber(text, format)).toBeUndefined();
  });
});

describe('getCommandColumnIndex', () => {
  const selectColumn: Column = { type: 'selection', command: 'select' };
  const editColumn: Column = { type: 'buttons', command: 'edit' };

  it.each<[string, Column]>([
    ['type', { type: 'buttons' }],
    ['command', { command: 'edit' }],
  ])('should find the command column with the same %s', (_, column) => {
    expect(getCommandColumnIndex(column, [selectColumn, editColumn])).toBe(1);
  });

  it('should return -1 when no command column matches', () => {
    expect(getCommandColumnIndex({ type: 'custom' }, [selectColumn, editColumn])).toBe(-1);
  });

  it('should return -1 when there are no command columns', () => {
    expect(getCommandColumnIndex({ type: 'buttons' }, [])).toBe(-1);
  });

  it('should return -1 for a column without a type and a command', () => {
    expect(getCommandColumnIndex({ dataField: 'a' }, [{ command: 'custom' }])).toBe(-1);
  });

  it('should return the last command column that matches', () => {
    const column: Column = { type: 'buttons', command: 'select' };

    expect(getCommandColumnIndex(column, [editColumn, selectColumn])).toBe(1);
  });

  describe('when looking up the column as the expand column', () => {
    const expandColumn: Column = { type: 'expand', command: 'expand' };

    it('should find the expand command column', () => {
      expect(getCommandColumnIndex({ type: 'custom' }, [selectColumn, expandColumn], true)).toBe(1);
    });

    it('should not match the own type of the column', () => {
      const commandColumns: Column[] = [expandColumn, { type: 'custom', command: 'custom' }];

      expect(getCommandColumnIndex({ type: 'custom' }, commandColumns, true)).toBe(0);
    });
  });

  it('should not find the expand command column by default', () => {
    const expandColumn: Column = { type: 'expand', command: 'expand' };

    expect(getCommandColumnIndex({ type: 'custom' }, [selectColumn, expandColumn])).toBe(-1);
  });
});

const getColumnsController = async (
  options: DataGridProperties & ColumnsControllerOptions = {},
): Promise<ColumnsController> => {
  const { instance } = await createDataGrid({ dataSource: [], columns: [], ...options });

  return instance.getController('columns');
};

describe('mergeColumns', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when merging the command columns into the columns', () => {
    const selectColumn: Column = { type: 'selection', command: 'select' };
    const editColumn: Column = { type: 'buttons', command: 'edit', width: 'auto' };

    it('should return copies of the columns', async () => {
      const columnsController = await getColumnsController();
      const columns: Column[] = [{ dataField: 'a' }, { dataField: 'b' }];

      const result = mergeColumns(columnsController, columns, [], true);

      expect(result).toEqual(columns);
      expect(result[0]).not.toBe(columns[0]);
      expect(result[1]).not.toBe(columns[1]);
    });

    it('should append the command columns after the columns', async () => {
      const columnsController = await getColumnsController();

      const result = mergeColumns(columnsController, [{ dataField: 'a' }], [selectColumn], true);

      expect(result).toEqual([
        { dataField: 'a' },
        { type: 'selection', command: 'select', fixed: false },
      ]);
    });

    it('should not append the command columns when there are no columns', async () => {
      const columnsController = await getColumnsController();

      expect(mergeColumns(columnsController, [], [selectColumn], true)).toEqual([]);
    });

    it.each<[string, DataGridProperties & ColumnsControllerOptions]>([
      ['column fixing is enabled', { columnFixing: { enabled: true } }],
      ['a column is fixed', { columns: [{ dataField: 'a', fixed: true }] }],
    ])('should fix the appended command columns when %s', async (_, options) => {
      const columnsController = await getColumnsController(options);

      const [, commandColumn] = mergeColumns(columnsController, [{ dataField: 'a' }], [selectColumn], true);

      expect(commandColumn.fixed).toBe(true);
    });

    it('should keep the fixed option of a command column', async () => {
      const columnsController = await getColumnsController({ columnFixing: { enabled: true } });
      const aiColumn: Column = { type: 'ai', command: 'ai', fixed: false };

      const [, commandColumn] = mergeColumns(columnsController, [{ dataField: 'a' }], [aiColumn], true);

      expect(commandColumn.fixed).toBe(false);
    });

    it('should not change the passed columns', async () => {
      const columnsController = await getColumnsController();
      const columns: Column[] = [{ dataField: 'a' }, { type: 'buttons', cssClass: 'custom' }];
      const commandColumns: Column[] = [selectColumn, { ...editColumn, cssClass: 'edit' }];
      const columnsCopy = columns.map((column) => ({ ...column }));
      const commandColumnsCopy = commandColumns.map((column) => ({ ...column }));

      mergeColumns(columnsController, columns, commandColumns, true);

      expect(columns).toEqual(columnsCopy);
      expect(commandColumns).toEqual(commandColumnsCopy);
    });

    it.each<[string, Column]>([
      ['type', { type: 'buttons' }],
      ['command', { command: 'edit' }],
    ])('should merge a column into the command column with the same %s', async (_, column) => {
      const columnsController = await getColumnsController();

      const result = mergeColumns(
        columnsController,
        [{ dataField: 'a' }, { ...column, caption: 'Actions' }],
        [editColumn],
        true,
      );

      expect(result).toEqual([
        { dataField: 'a' },
        {
          type: 'buttons', command: 'edit', width: 'auto', caption: 'Actions', cssClass: '', fixed: false,
        },
      ]);
    });

    it('should let the column options override the command column options', async () => {
      const columnsController = await getColumnsController();

      const [column] = mergeColumns(
        columnsController,
        [{ type: 'buttons', width: 100, fixed: true }],
        [editColumn],
        true,
      );

      expect(column.width).toBe(100);
      expect(column.fixed).toBe(true);
    });

    it('should keep calculateCellValue of the command column', async () => {
      const columnsController = await getColumnsController();
      const calculateCellValue = (): string => 'command';

      const [column] = mergeColumns(
        columnsController,
        [{ type: 'ai', calculateCellValue: (): string => 'column' }],
        [{ type: 'ai', command: 'ai', calculateCellValue }],
        true,
      );

      expect(column.calculateCellValue).toBe(calculateCellValue);
    });

    it('should keep calculateCellValue of the column when the command column has none', async () => {
      const columnsController = await getColumnsController();
      const calculateCellValue = (): string => 'column';

      const [column] = mergeColumns(
        columnsController,
        [{ type: 'buttons', calculateCellValue }],
        [editColumn],
        true,
      );

      expect(column.calculateCellValue).toBe(calculateCellValue);
    });

    it.each([
      ['both columns', 'edit', 'custom', 'edit custom'],
      ['only the command column', 'edit', undefined, 'edit'],
      ['only the column', undefined, 'custom', 'custom'],
      ['neither column', undefined, undefined, ''],
    ])('should join the css classes when %s have one', async (_, commandCssClass, cssClass, expected) => {
      const columnsController = await getColumnsController();

      const [column] = mergeColumns(
        columnsController,
        [{ type: 'buttons', cssClass }],
        [{ ...editColumn, cssClass: commandCssClass }],
        true,
      );

      expect(column.cssClass).toBe(expected);
    });

    it('should append only the command columns that no column customizes', async () => {
      const columnsController = await getColumnsController();

      const result = mergeColumns(
        columnsController,
        [{ dataField: 'a' }, { type: 'buttons' }],
        [selectColumn, editColumn],
        true,
      );

      expect(result.map(({ dataField, command }) => dataField ?? command)).toEqual(['a', 'edit', 'select']);
    });

    it('should use the last command column that matches', async () => {
      const columnsController = await getColumnsController();

      const result = mergeColumns(
        columnsController,
        [{ type: 'buttons', command: 'select' }],
        [{ ...editColumn, caption: 'Edit' }, { ...selectColumn, caption: 'Select' }],
        true,
      );

      expect(result.map(({ caption }) => caption)).toEqual(['Select', 'Edit']);
    });

    it('should not merge a column without a type and a command into a command column', async () => {
      const columnsController = await getColumnsController();

      const result = mergeColumns(columnsController, [{ dataField: 'a' }], [{ command: 'custom' }], true);

      expect(result).toEqual([
        { dataField: 'a' },
        { command: 'custom', fixed: false },
      ]);
    });

    describe('when a column customizes the group expand column', () => {
      const expandColumn: Column = { type: 'expand', command: 'expand', cssClass: 'expand' };

      it('should merge it into the expand command column', async () => {
        const columnsController = await getColumnsController();

        const [column] = mergeColumns(
          columnsController,
          [{ type: 'groupExpand', caption: 'Group' }],
          [expandColumn],
          true,
        );

        expect(column).toEqual({
          type: 'groupExpand', command: 'expand', caption: 'Group', cssClass: 'expand', fixed: false,
        });
      });

      it('should still append the expand command column', async () => {
        const columnsController = await getColumnsController();

        const result = mergeColumns(columnsController, [{ type: 'groupExpand' }], [expandColumn], true);

        expect(result).toHaveLength(2);
        expect(result[1]).toEqual({ ...expandColumn, fixed: false });
      });
    });
  });

  describe('when merging the columns into the expand columns', () => {
    const groupExpandColumn: Column = {
      type: 'groupExpand',
      command: 'expand',
      index: 1,
      visibleIndex: 2,
      headerId: 'dx-col-1',
      groupIndex: 0,
      cssClass: 'expand',
      width: 'auto',
    };

    it('should return copies of the expand columns and append nothing', async () => {
      const columnsController = await getColumnsController();
      const expandColumns: Column[] = [groupExpandColumn];

      const result = mergeColumns(columnsController, expandColumns, [{ dataField: 'a' }]);

      expect(result).toEqual(expandColumns);
      expect(result[0]).not.toBe(expandColumns[0]);
    });

    it('should apply the options of a groupExpand column but keep the position of the expand column', async () => {
      const columnsController = await getColumnsController();
      const column: Column = {
        type: 'groupExpand',
        index: 5,
        visibleIndex: 6,
        headerId: 'dx-col-5',
        groupIndex: 3,
        cssClass: 'custom',
        width: 50,
        caption: 'Group',
      };

      const result = mergeColumns(columnsController, [groupExpandColumn], [{ dataField: 'a' }, column]);

      expect(result).toEqual([{
        type: 'groupExpand',
        command: 'expand',
        index: 1,
        visibleIndex: 2,
        headerId: 'dx-col-1',
        groupIndex: 0,
        cssClass: 'custom',
        width: 50,
        caption: 'Group',
        allowFixing: true,
        allowReordering: true,
      }]);
    });

    it.each([1, undefined])('should forbid fixing and reordering when groupIndex is %s', async (groupIndex) => {
      const columnsController = await getColumnsController();

      const [column] = mergeColumns(
        columnsController,
        [{ ...groupExpandColumn, groupIndex }],
        [{ type: 'groupExpand' }],
      );

      expect(column.allowFixing).toBe(false);
      expect(column.allowReordering).toBe(false);
    });

    it('should let a column of another type override every option', async () => {
      const columnsController = await getColumnsController();

      const [column] = mergeColumns(
        columnsController,
        [{
          type: 'detailExpand', command: 'expand', index: 1, visibleIndex: 2,
        }],
        [{
          type: 'detailExpand', index: 5, visibleIndex: 6, width: 40,
        }],
      );

      expect(column).toEqual({
        type: 'detailExpand', command: 'expand', index: 5, visibleIndex: 6, width: 40,
      });
    });

    it('should not treat a groupExpand column as the expand command column', async () => {
      const columnsController = await getColumnsController();

      const [column] = mergeColumns(
        columnsController,
        [{ type: 'groupExpand', command: 'expand', index: 1 }],
        [{ type: 'expand', caption: 'Expand' }],
      );

      expect(column).toEqual({ type: 'groupExpand', command: 'expand', index: 1 });
    });
  });
});
