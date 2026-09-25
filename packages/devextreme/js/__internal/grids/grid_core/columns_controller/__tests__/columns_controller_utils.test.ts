import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import config from '@js/core/config';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import {
  createColumn,
  createColumnsFromOptions,
  customizeTextForBooleanDataType,
  getAlignmentByDataType,
  getCustomizeTextByDataType,
  getSerializationFormat,
  getValueDataType,
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

const getColumnsController = async (
  options: DataGridProperties & ColumnsControllerOptions = {},
): Promise<ColumnsController> => {
  const { instance } = await createDataGrid({ dataSource: [], columns: [], ...options });

  return instance.getController('columns');
};

describe('createColumn', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it.each([
    ['undefined', undefined],
    ['an empty string', ''],
  ])('should return undefined for %s', async (_, columnOptions) => {
    const columnsController = await getColumnsController();

    expect(createColumn(columnsController, columnOptions)).toBeUndefined();
  });

  it('should create a column from a data field string', async () => {
    const columnsController = await getColumnsController();

    const column = createColumn(columnsController, 'firstName');

    expect(column).toMatchObject({ dataField: 'firstName', name: 'firstName', caption: 'First Name' });
  });

  it('should set the name on the passed column options', async () => {
    const columnsController = await getColumnsController();
    const columnOptions: Column = { dataField: 'age' };

    createColumn(columnsController, columnOptions);

    expect(columnOptions.name).toBe('age');
  });

  it('should give each column its own header id', async () => {
    const columnsController = await getColumnsController();

    const first = createColumn(columnsController, 'a');
    const second = createColumn(columnsController, 'b');

    expect(first?.headerId).toMatch(/^dx-col-\d+$/);
    expect(second?.headerId).toMatch(/^dx-col-\d+$/);
    expect(first?.headerId).not.toBe(second?.headerId);
  });

  it('should not give a header id to a column with a type', async () => {
    const columnsController = await getColumnsController();

    expect(createColumn(columnsController, { type: 'buttons' })?.headerId).toBeUndefined();
  });

  it('should apply the default column options', async () => {
    const columnsController = await getColumnsController();

    expect(createColumn(columnsController, 'a')).toMatchObject({ visible: true, showInColumnChooser: true });
  });

  it('should apply the grid-level column settings', async () => {
    const columnsController = await getColumnsController({ columnMinWidth: 50 });

    expect(createColumn(columnsController, 'a')?.minWidth).toBe(50);
  });

  it.each([
    ['the default options', { visible: false }, 'visible', false],
    ['the grid-level settings', { minWidth: 10 }, 'minWidth', 10],
    ['the calculated options', { caption: 'Name' }, 'caption', 'Name'],
  ])('should let the column options override %s', async (_, columnOptions, optionName, expected) => {
    const columnsController = await getColumnsController({ columnMinWidth: 50 });

    const column = createColumn(columnsController, { dataField: 'firstName', ...columnOptions });

    expect(column).toHaveProperty(optionName, expected);
  });

  it('should reset the selector', async () => {
    const columnsController = await getColumnsController();

    const column = createColumn(columnsController, { dataField: 'a', selector: (): number => 1 });

    expect(column?.selector).toBeNull();
  });

  it('should disable fixing for a band child', async () => {
    const columnsController = await getColumnsController({ columnFixing: { enabled: true } });
    const bandColumn: Column = { caption: 'Band' };

    expect(createColumn(columnsController, 'a')?.allowFixing).toBe(true);
    expect(createColumn(columnsController, 'a', undefined, bandColumn)?.allowFixing).toBe(false);
  });

  it('should copy a command column without the default and grid-level settings', async () => {
    const columnsController = await getColumnsController({ columnMinWidth: 50 });
    const columnOptions: Column = { type: 'expand', command: 'expand' };

    const column = createColumn(columnsController, columnOptions);

    expect(column).toEqual(columnOptions);
    expect(column).not.toBe(columnOptions);
  });

  it('should take the data field from the user state of a named column', async () => {
    const columnsController = await getColumnsController();
    const columnOptions: Column = { name: 'n', dataField: 'original' };

    const column = createColumn(columnsController, columnOptions, { name: 'n', dataField: 'renamed' });

    expect(column?.dataField).toBe('renamed');
    expect(column?.caption).toBe('Renamed');
    expect(columnOptions.dataField).toBe('original');
  });

  it('should keep inherited column options when the user state changes the data field', async () => {
    const columnsController = await getColumnsController();
    const columnOptions = Object.create({ width: 100 }) as Column;
    columnOptions.name = 'n';
    columnOptions.dataField = 'original';

    const column = createColumn(columnsController, columnOptions, { name: 'n', dataField: 'renamed' });

    expect(column?.width).toBe(100);
  });

  it.each([
    ['has no name', { dataField: 'renamed' }],
    ['has no data field', { name: 'n' }],
  ])('should keep the data field when the user state %s', async (_, userState) => {
    const columnsController = await getColumnsController();

    const column = createColumn(columnsController, { name: 'n', dataField: 'original' }, userState);

    expect(column?.dataField).toBe('original');
  });

  it('should link the filter operations to the default ones when the column options set neither', async () => {
    const columnsController = await getColumnsController({
      commonColumnSettings: { defaultFilterOperations: ['=', '<>'] },
    });

    const column = createColumn(columnsController, 'a');

    expect(column?.filterOperations).toEqual(['=', '<>']);
    expect(column?.filterOperations).toBe(column?.defaultFilterOperations);
  });

  it('should keep the filter operations the column options set', async () => {
    const columnsController = await getColumnsController({
      commonColumnSettings: { defaultFilterOperations: ['=', '<>'] },
    });

    const column = createColumn(columnsController, { dataField: 'a', filterOperations: ['contains'] });

    expect(column?.filterOperations).toEqual(['contains']);
  });
});

describe('createColumnsFromOptions', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should return an empty array when there are no column options', async () => {
    const columnsController = await getColumnsController();

    expect(createColumnsFromOptions(columnsController, undefined)).toEqual([]);
  });

  it('should create a column from a data field string', async () => {
    const columnsController = await getColumnsController();

    const [column] = createColumnsFromOptions(columnsController, ['firstName']);

    expect(column.dataField).toBe('firstName');
    expect(column.caption).toBe('First Name');
  });

  it('should keep the passed column options', async () => {
    const columnsController = await getColumnsController();

    const [column] = createColumnsFromOptions(columnsController, [{ dataField: 'age', width: 100 }]);

    expect(column.dataField).toBe('age');
    expect(column.width).toBe(100);
  });

  it('should skip empty column options', async () => {
    const columnsController = await getColumnsController();

    // @ts-expect-error JS users can leave empty items in the columns option
    const columns = createColumnsFromOptions(columnsController, [null, 'a']);

    expect(columns.map((column) => column.dataField)).toEqual(['a']);
  });

  it('should put band children right after their band and link them to it', async () => {
    const columnsController = await getColumnsController();

    const columns = createColumnsFromOptions(columnsController, [
      { caption: 'Band', columns: ['a', { dataField: 'b' }] },
      'c',
    ]);

    expect(columns.map((column) => column.caption)).toEqual(['Band', 'A', 'B', 'C']);
    expect(columns[1].ownerBand).toBe(columns[0]);
    expect(columns[2].ownerBand).toBe(columns[0]);
    expect(columns[0].ownerBand).toBeUndefined();
    expect(columns[3].ownerBand).toBeUndefined();
  });

  it('should replace the band child options with the hasColumns flag', async () => {
    const columnsController = await getColumnsController();

    const [band] = createColumnsFromOptions(columnsController, [{ caption: 'Band', columns: ['a'] }]);

    expect(band.hasColumns).toBe(true);
    expect(band).not.toHaveProperty('columns');
  });

  it('should flatten nested bands depth-first', async () => {
    const columnsController = await getColumnsController();

    const columns = createColumnsFromOptions(columnsController, [
      { caption: 'Outer', columns: [{ caption: 'Inner', columns: ['x'] }, 'y'] },
    ]);

    expect(columns.map((column) => column.caption)).toEqual(['Outer', 'Inner', 'X', 'Y']);
    expect(columns[1].ownerBand).toBe(columns[0]);
    expect(columns[2].ownerBand).toBe(columns[1]);
    expect(columns[3].ownerBand).toBe(columns[0]);
  });

  it('should look up the user state of a band child by its position in the flat list', async () => {
    const columnsController = await getColumnsController();
    columnsController.setUserState([
      { name: 'band' },
      { name: 'child', dataField: 'renamed' },
    ]);

    const columns = createColumnsFromOptions(columnsController, [
      { name: 'band', caption: 'Band', columns: [{ name: 'child', dataField: 'original' }] },
    ]);

    expect(columns[1].dataField).toBe('renamed');
  });

  it('should warn once about unsupported options in band children', async () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(jest.fn());
    const columnsController = await getColumnsController();
    const columnsOptions = [{ caption: 'Band', columns: [{ dataField: 'a', fixed: true }] }];

    createColumnsFromOptions(columnsController, columnsOptions);
    createColumnsFromOptions(columnsController, columnsOptions);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith('W1028', 'fixed');
  });
});
