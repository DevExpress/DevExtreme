import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Response as SendRequestResult } from '@js/common/ai-integration';
import config from '@js/core/config';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import { variableWrapper } from '@ts/core/utils/m_variable_wrapper';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import {
  columnOptionCore,
  createColumn,
  createColumnsFromDataSourceAdapter,
  createColumnsFromOptions,
  customizeTextForBooleanDataType,
  digitsCount,
  findColumn,
  fireColumnsChanged,
  getAlignmentByDataType,
  getChildrenByBandColumn,
  getColumnByIndexes,
  getCommandColumnIndex,
  getCustomizeTextByDataType,
  getDataColumns,
  getSerializationFormat,
  getValueDataType,
  isColumnFixed,
  mergeColumns,
  numberToString,
  processBandColumns,
  reserveGroupIndex,
  resolveChangeType,
  setFilterOperationsAsDefaultValues,
  strictParseNumber,
  updateSerializers,
} from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { BandColumnsCache, Column, ColumnsControllerOptions } from '@ts/grids/grid_core/columns_controller/types';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const getColumnsController = async (
  options: DataGridProperties & ColumnsControllerOptions = {},
): Promise<ColumnsController> => {
  const { instance } = await createDataGrid({ dataSource: [], columns: [], ...options });

  return instance.getController('columns');
};

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

describe('createColumnsFromDataSourceAdapter', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    variableWrapper.resetInjection();
    afterTest();
  });

  const getDataFields = async (
    dataSource: DataGridProperties['dataSource'],
  ): Promise<(string | undefined)[]> => {
    const { instance } = await createDataGrid({ dataSource, columns: [] });
    const dataSourceAdapter = instance.getController('dataSource').getAdapter();

    if (!dataSourceAdapter) {
      throw new Error('The grid has no data source adapter');
    }

    return createColumnsFromDataSourceAdapter(instance.getController('columns'), dataSourceAdapter)
      .map((column) => column.dataField);
  };

  it('should create a column for each field of the loaded items', async () => {
    expect(await getDataFields([{ id: 1, name: 'Alex' }])).toEqual(['id', 'name']);
  });

  it('should take each field once, in the order it first appears', async () => {
    const dataFields = await getDataFields([{ id: 1, name: 'Alex' }, { id: 2, age: 30 }]);

    expect(dataFields).toEqual(['id', 'name', 'age']);
  });

  it('should put integer-like field names first, as object keys do', async () => {
    expect(await getDataFields([{ b: 1 }, { 1: 'x' }])).toEqual(['1', 'b']);
  });

  it('should include inherited fields', async () => {
    const item = Object.create({ inherited: 1 }) as Record<string, unknown>;
    item.own = 2;

    expect(await getDataFields([item])).toEqual(['own', 'inherited']);
  });

  it('should skip function fields', async () => {
    expect(await getDataFields([{ id: 1, getName: (): string => 'Alex' }])).toEqual(['id']);
  });

  it('should keep wrapped function fields', async () => {
    const observable = (): string => 'Alex';
    variableWrapper.inject({ isWrapped: (value) => value === observable });

    expect(await getDataFields([{ id: 1, name: observable }])).toEqual(['id', 'name']);
  });

  it('should skip service fields that start with a double underscore', async () => {
    expect(await getDataFields([{ __KEY__: 1, id: 1, a__b: 2 }])).toEqual(['id', 'a__b']);
  });

  it('should skip empty items', async () => {
    expect(await getDataFields([null, { id: 1 }])).toEqual(['id']);
  });

  it('should skip falsy primitive items even when their prototype has enumerable fields', async () => {
    // eslint-disable-next-line no-extend-native -- the test needs a polluted prototype
    Object.defineProperty(Number.prototype, 'polluted', { value: 'x', enumerable: true, configurable: true });

    try {
      expect(await getDataFields([0, { id: 1 }])).toEqual(['id']);
    } finally {
      Reflect.deleteProperty(Number.prototype, 'polluted');
    }
  });

  it('should take the fields of the items in the first group', async () => {
    const dataFields = await getDataFields({ store: [{ city: 'Rome', id: 1 }], group: 'city' });

    expect(dataFields).toEqual(['city', 'id']);
  });

  it('should return no columns when there are no items', async () => {
    expect(await getDataFields([])).toEqual([]);
  });
});

describe('isColumnFixed', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the column is not a command column', () => {
    it('should return true for a fixed column', async () => {
      const columnsController = await getColumnsController();

      expect(isColumnFixed(columnsController, { fixed: true })).toBe(true);
    });

    it('should return false for a sticky column', async () => {
      const columnsController = await getColumnsController();
      const column: Column = { fixed: true, fixedPosition: 'sticky' };

      expect(isColumnFixed(columnsController, column)).toBe(false);
    });

    it.each([
      ['a data column', {}],
      ['an AI column', { type: 'ai' }],
    ])('should ignore the column fixing of the grid for %s', async (_, column: Column) => {
      const columnsController = await getColumnsController();
      jest.spyOn(columnsController, '_isColumnFixing').mockReturnValue(true);

      expect(isColumnFixed(columnsController, column)).toBe(false);
    });
  });

  describe('when the column is a command column', () => {
    it.each([
      [true, true],
      [false, false],
      [false, undefined],
    ])('should return %s when the column fixing of the grid is %s', async (expected, isColumnFixing) => {
      const columnsController = await getColumnsController();
      jest.spyOn(columnsController, '_isColumnFixing').mockReturnValue(isColumnFixing);

      expect(isColumnFixed(columnsController, { type: 'buttons' })).toBe(expected);
    });
  });
});

describe('findColumn', () => {
  it('should return undefined when the identifier is undefined', () => {
    expect(findColumn([{ index: 0 }], undefined)).toBeUndefined();
  });

  it('should find a column by index', () => {
    const columns: Column[] = [{ index: 0 }, { index: 1 }];

    expect(findColumn(columns, 1)).toBe(columns[1]);
  });

  it.each(['name', 'dataField', 'caption'] as const)('should find a column by %s', (optionName) => {
    const columns: Column[] = [{ index: 0 }, { index: 1, [optionName]: 'value' }];

    expect(findColumn(columns, 'value')).toBe(columns[1]);
  });

  it('should prefer name over dataField and dataField over caption', () => {
    const columns: Column[] = [
      { index: 0, caption: 'value' },
      { index: 1, dataField: 'value' },
      { index: 2, name: 'value' },
    ];

    expect(findColumn(columns, 'value')).toBe(columns[2]);
    expect(findColumn(columns.slice(0, 2), 'value')).toBe(columns[1]);
  });

  it('should return the first column when several columns match', () => {
    const columns: Column[] = [{ index: 0, caption: 'value' }, { index: 1, caption: 'value' }];

    expect(findColumn(columns, 'value')).toBe(columns[0]);
  });

  it('should not match a numeric string to an index', () => {
    expect(findColumn([{ index: 1 }], '1')).toBeUndefined();
  });

  it('should return undefined when no column matches', () => {
    expect(findColumn([{ index: 0, dataField: 'id' }], 'name')).toBeUndefined();
  });

  describe('when the identifier has the "optionName:value" form', () => {
    it('should find a column by the given option', () => {
      const columns: Column[] = [{ index: 0, name: 'id' }, { index: 1, dataField: 'id' }];

      expect(findColumn(columns, 'dataField:id')).toBe(columns[1]);
    });

    it('should compare the option as a string', () => {
      const columns: Column[] = [{ index: 0, visible: true }, { index: 1, visible: false }];

      expect(findColumn(columns, 'index:1')).toBe(columns[1]);
      expect(findColumn(columns, 'visible:false')).toBe(columns[1]);
    });

    it('should return the first column when several columns match', () => {
      const columns: Column[] = [{ index: 0, dataField: 'id' }, { index: 1, dataField: 'id' }];

      expect(findColumn(columns, 'dataField:id')).toBe(columns[0]);
    });

    it('should not fall back to other options', () => {
      expect(findColumn([{ index: 0, caption: 'id' }], 'dataField:id')).toBeUndefined();
    });

    it('should keep colons in the value', () => {
      const columns: Column[] = [{ index: 0, caption: 'a:b' }];

      expect(findColumn(columns, 'caption:a:b')).toBe(columns[0]);
    });

    it('should search the whole identifier when it starts with a colon', () => {
      const columns: Column[] = [{ index: 0, caption: ':value' }];

      expect(findColumn(columns, ':value')).toBe(columns[0]);
    });
  });
});

describe('resolveChangeType', () => {
  it.each([
    ['groupIndex', 'grouping'],
    ['calculateGroupValue', 'grouping'],
    ['sortIndex', 'sorting'],
    ['sortOrder', 'sorting'],
    ['calculateSortValue', 'sorting'],
    ['caption', 'columns'],
    ['visible', 'columns'],
  ])('should return the change type of %s', (optionName, expected) => {
    expect(resolveChangeType(optionName)).toBe(expected);
  });
});

describe('columnOptionCore', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  interface Grid {
    instance: DataGridInstance;
    columnsController: ColumnsController;
    columnsChanged: jest.Mock;
    optionChanged: jest.Mock;
  }

  const createGrid = async (options: DataGridProperties): Promise<Grid> => {
    const { instance } = await createDataGrid({ dataSource: [], ...options });
    const columnsController = instance.getController('columns');
    const columnsChanged = jest.fn();
    const optionChanged = jest.fn();

    columnsController.columnsChanged.add(columnsChanged);
    instance.on('optionChanged', ({ fullName, value, previousValue }) => {
      optionChanged({ fullName, value, previousValue });
    });

    return {
      instance, columnsController, columnsChanged, optionChanged,
    };
  };

  describe('when reading an option', () => {
    it('should return the option value', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', caption: 'A' }] });
      const [column] = columnsController.getColumns();

      expect(columnOptionCore(columnsController, column, 'caption')).toBe('A');
    });

    it('should return a nested option value', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', format: { type: 'fixedPoint' } }] });
      const [column] = columnsController.getColumns();

      expect(columnOptionCore(columnsController, column, 'format.type')).toBe('fixedPoint');
    });

    it('should return a function option as is', async () => {
      const customizeText = jest.fn(() => 'text');
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', customizeText }] });
      const [column] = columnsController.getColumns();

      expect(columnOptionCore(columnsController, column, 'customizeText')).toBe(customizeText);
      expect(customizeText).not.toHaveBeenCalled();
    });
  });

  describe('when writing an option', () => {
    it('should set the option and return undefined', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', caption: 'A' }] });
      const [column] = columnsController.getColumns();

      expect(columnOptionCore(columnsController, column, 'caption', 'New')).toBeUndefined();
      expect(column.caption).toBe('New');
    });

    it('should replace a function option instead of calling it', async () => {
      const oldCustomizeText = jest.fn(() => 'old');
      const newCustomizeText = (): string => 'new';
      const { columnsController } = await createGrid({
        columns: [{ dataField: 'a', customizeText: oldCustomizeText }],
      });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'customizeText', newCustomizeText);

      expect(column.customizeText).toBe(newCustomizeText);
      expect(oldCustomizeText).not.toHaveBeenCalled();
    });

    it('should do nothing when the new value is deeply equal to the old one', async () => {
      const { columnsController, columnsChanged, optionChanged } = await createGrid({
        columns: [{ dataField: 'a', format: { type: 'fixedPoint' } }],
      });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'format', { type: 'fixedPoint' });
      fireColumnsChanged(columnsController);

      expect(columnsChanged).not.toHaveBeenCalled();
      expect(optionChanged).not.toHaveBeenCalled();
    });

    it.each([
      ['groupIndex', 'grouping', 0],
      ['calculateGroupValue', 'grouping', 'b'],
      ['sortOrder', 'sorting', 'asc'],
      ['calculateSortValue', 'sorting', 'b'],
      ['caption', 'columns', 'New'],
    ])('should record a %s change as a %s change', async (optionName, changeType, value) => {
      const { columnsController, columnsChanged } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, optionName, value);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).toHaveBeenCalledTimes(1);
      expect(columnsChanged).toHaveBeenCalledWith({
        changeTypes: { [changeType]: true, length: 1 },
        optionNames: { [optionName]: true, length: 1 },
        columnIndex: 0,
      });
    });

    it('should record a sortIndex change as a sorting change', async () => {
      const { columnsController, columnsChanged } = await createGrid({
        columns: [{ dataField: 'a', sortOrder: 'asc' }],
      });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'sortIndex', 1);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).toHaveBeenCalledWith({
        changeTypes: { sorting: true, length: 1 },
        optionNames: { sortIndex: true, length: 1 },
        columnIndex: 0,
      });
    });

    it('should record the column index from before the change', async () => {
      const { columnsController, columnsChanged } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'index', 5);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).toHaveBeenCalledWith(expect.objectContaining({ columnIndex: 0 }));
    });

    it('should keep the sort order of a column that becomes grouped', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', sortOrder: 'desc' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'groupIndex', 0);

      expect(column.lastSortOrder).toBe('desc');
    });

    it('should keep the sort order when another option changes', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a', sortOrder: 'asc' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(column.sortOrder).toBe('asc');
    });

    it('should normalize an index option and report the normalized value', async () => {
      const { columnsController, optionChanged } = await createGrid({
        columns: [{ dataField: 'a' }, { dataField: 'b' }],
      });
      const [, column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'visibleIndex', 10);

      expect(column.visibleIndex).toBe(1);
      expect(optionChanged).toHaveBeenCalledWith(expect.objectContaining({
        fullName: 'columns[1].visibleIndex',
        value: 1,
      }));
    });

    it.each(['name', 'allowEditing'])('should check the columns when %s changes', async (optionName) => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();
      const checkColumns = jest.spyOn(columnsController, '_checkColumns');

      columnOptionCore(columnsController, column, optionName, optionName === 'name' ? 'b' : false);

      expect(checkColumns).toHaveBeenCalledTimes(1);
    });

    it('should not check the columns when another option changes', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();
      const checkColumns = jest.spyOn(columnsController, '_checkColumns');

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(checkColumns).not.toHaveBeenCalled();
    });

    it('should fire optionChanged with the full option path', async () => {
      const { columnsController, optionChanged } = await createGrid({
        columns: [{ dataField: 'a' }, { dataField: 'b', caption: 'B' }],
      });
      const [, column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(optionChanged).toHaveBeenCalledWith(expect.objectContaining({
        fullName: 'columns[1].caption',
        value: 'New',
        previousValue: 'B',
      }));
    });

    it('should not fire optionChanged for a command column', async () => {
      const { columnsController, optionChanged } = await createGrid({
        columns: [{ dataField: 'a' }],
        selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
      });
      const column = columnsController._commandColumns.find(({ type }) => type === 'selection');
      if (!column) throw new Error('selection command column not found');

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(column.caption).toBe('New');
      expect(optionChanged).not.toHaveBeenCalled();
    });

    it('should write the option to the columns option', async () => {
      const { instance, columnsController } = await createGrid({ columns: [{ dataField: 'a', caption: 'A' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(instance.option('columns')).toEqual([{ dataField: 'a', caption: 'New', name: 'a' }]);
    });

    it('should not write to the columns option item of another column', async () => {
      const { instance, columnsController } = await createGrid({
        columns: [{ dataField: 'a', caption: 'A' }],
        customizeColumns: (columns) => {
          columns.unshift({ dataField: 'b' });
        },
      });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(column.dataField).toBe('b');
      expect(instance.option('columns')).toEqual([{ dataField: 'a', caption: 'A', name: 'a' }]);
    });

    it('should replace a string column in the columns option with an object', async () => {
      const { instance, columnsController } = await createGrid({ columns: ['a'] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(instance.option('columns')).toEqual([{ dataField: 'a', caption: 'New' }]);
    });

    it.each([
      ['width', 100],
      ['visibleWidth', 50],
    ])('should not write %s to the columns option', async (optionName, value) => {
      const { instance, columnsController } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, optionName, value);

      expect(column[optionName]).toBe(value);
      expect(instance.option('columns')).toEqual([{ dataField: 'a', name: 'a' }]);
    });

    it('should neither record changes nor write the columns option when notFireEvent is true', async () => {
      const {
        instance, columnsController, columnsChanged, optionChanged,
      } = await createGrid({ columns: [{ dataField: 'a', caption: 'A' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'caption', 'New', true);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).not.toHaveBeenCalled();
      expect(instance.option('columns')).toEqual([{ dataField: 'a', caption: 'A', name: 'a' }]);
      expect(optionChanged).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'columns[0].caption' }));
    });

    it('should reset the columns cache when notFireEvent is true', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a' }, { dataField: 'b' }] });
      const [, column] = columnsController.getColumns();

      columnsController.getVisibleColumns();
      columnOptionCore(columnsController, column, 'visible', false, true);

      expect(columnsController.getVisibleColumns()).toEqual([expect.objectContaining({ dataField: 'a' })]);
    });

    it('should not record a change from undefined to null', async () => {
      const { columnsController, columnsChanged, optionChanged } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'filterValue', null);
      fireColumnsChanged(columnsController);

      expect(column.filterValue).toBeNull();
      expect(columnsChanged).not.toHaveBeenCalled();
      expect(optionChanged).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'columns[0].filterValue' }));
    });

    it('should record a change from undefined to null when notFireEvent is false', async () => {
      const { columnsController, columnsChanged } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'filterValue', null, false);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).toHaveBeenCalledTimes(1);
    });

    it('should record a change from undefined to null of a buffered option', async () => {
      const { columnsController, columnsChanged } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();

      columnOptionCore(columnsController, column, 'bufferedFilterValue', null);
      fireColumnsChanged(columnsController);

      expect(columnsChanged).toHaveBeenCalledTimes(1);
    });

    it('should notify about an option change of an AI column', async () => {
      const { columnsController } = await createGrid({
        columns: [{
          type: 'ai',
          name: 'ai',
          caption: 'AI',
          ai: {
            aiIntegration: new AIIntegration({
              sendRequest: (): SendRequestResult => ({ promise: Promise.resolve('{}'), abort: (): void => {} }),
            }),
          },
        }],
      });
      const [column] = columnsController.getColumns();
      const aiColumnOptionChanged = jest.fn();
      columnsController.aiColumnOptionChanged.add(aiColumnOptionChanged);

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(aiColumnOptionChanged).toHaveBeenCalledWith(column, 'caption', 'New');
    });

    it('should not notify about an option change of a regular column', async () => {
      const { columnsController } = await createGrid({ columns: [{ dataField: 'a' }] });
      const [column] = columnsController.getColumns();
      const aiColumnOptionChanged = jest.fn();
      columnsController.aiColumnOptionChanged.add(aiColumnOptionChanged);

      columnOptionCore(columnsController, column, 'caption', 'New');

      expect(aiColumnOptionChanged).not.toHaveBeenCalled();
    });
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

describe('processBandColumns', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const copyColumns = (columnsController: ColumnsController): Column[] => {
    const columns: Column[] = columnsController.getColumns();

    return columns.map((column) => ({ ...column }));
  };

  const getSpans = (columns: Column[]): Record<string, Pick<Column, 'colspan' | 'rowspan'>> => Object.fromEntries(
    columns.map(({
      dataField, caption, type, colspan, rowspan,
    }) => [String(dataField ?? caption ?? type), { colspan, rowspan }]),
  );

  it('should not set spans when there are no bands', async () => {
    const columnsController = await getColumnsController({ columns: ['a', 'b'] });
    const columns = copyColumns(columnsController);

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns)).toEqual({ a: {}, b: {} });
  });

  it('should span a band over its children and a plain column over all header rows', async () => {
    const columnsController = await getColumnsController({
      columns: ['a', { caption: 'Band', columns: ['b', 'c'] }],
    });
    const columns = copyColumns(columnsController);

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns)).toEqual({
      a: { rowspan: 2 },
      Band: { colspan: 2 },
      b: {},
      c: {},
    });
  });

  it('should skip the hidden columns', async () => {
    const columnsController = await getColumnsController({
      columns: [
        'a',
        { dataField: 'd', visible: false },
        { caption: 'Band', columns: ['b', { dataField: 'c', visible: false }] },
      ],
    });
    const columns = copyColumns(columnsController);

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns)).toEqual({
      a: { rowspan: 2 },
      d: {},
      Band: { colspan: 1 },
      b: {},
      c: {},
    });
  });

  it('should subtract the parent bands from the rowspan of a nested column', async () => {
    const columnsController = await getColumnsController({
      columns: ['a', {
        caption: 'Band',
        columns: ['b', { caption: 'Nested band', columns: ['c', 'd'] }],
      }],
    });
    const columns = copyColumns(columnsController);

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns)).toEqual({
      a: { rowspan: 3 },
      Band: { colspan: 3 },
      b: { rowspan: 2 },
      'Nested band': { colspan: 2 },
      c: {},
      d: {},
    });
  });

  it('should keep the colspan a band already has', async () => {
    const columnsController = await getColumnsController({
      columns: ['a', { caption: 'Band', columns: ['b', 'c'] }],
    });
    const columns = copyColumns(columnsController)
      .map((column) => (column.isBand ? { ...column, colspan: 5 } : column));

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns).Band).toEqual({ colspan: 5 });
  });

  it('should recalculate a zero colspan of a band', async () => {
    const columnsController = await getColumnsController({
      columns: ['a', { caption: 'Band', columns: ['b', 'c'] }],
    });
    const columns = copyColumns(columnsController)
      .map((column) => (column.isBand ? { ...column, colspan: 0 } : column));

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns).Band).toEqual({ colspan: 2 });
  });

  it('should span a band without visible children over all header rows', async () => {
    const columnsController = await getColumnsController({
      columns: [
        { caption: 'Empty band', columns: [{ dataField: 'a', visible: false }] },
        { caption: 'Band', columns: ['b'] },
      ],
    });
    const columns = copyColumns(columnsController);

    processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

    expect(getSpans(columns)).toEqual({
      'Empty band': { colspan: 0, rowspan: 2 },
      a: {},
      Band: { colspan: 1 },
      b: {},
    });
  });

  describe('when a column of a band is grouped', () => {
    it('should span the grouped column over all header rows', async () => {
      const columnsController = await getColumnsController({
        columns: ['a', { caption: 'Band', columns: [{ dataField: 'b', groupIndex: 0 }, 'c'] }],
      });
      const columns = copyColumns(columnsController);

      processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

      expect(getSpans(columns)).toEqual({
        a: { rowspan: 2 },
        Band: { colspan: 1 },
        b: { rowspan: 2 },
        c: {},
      });
    });

    it('should keep the grouped column in the band when showWhenGrouped is set', async () => {
      const columnsController = await getColumnsController({
        columns: ['a', {
          caption: 'Band',
          columns: [{ dataField: 'b', groupIndex: 0, showWhenGrouped: true }, 'c'],
        }],
      });
      const columns = copyColumns(columnsController);

      processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

      expect(getSpans(columns)).toEqual({
        a: { rowspan: 2 },
        Band: { colspan: 2 },
        b: {},
        c: {},
      });
    });
  });

  describe('when processing the command columns', () => {
    it('should span a command column over all header rows even without the visible option', async () => {
      const columnsController = await getColumnsController({
        columns: ['a', { caption: 'Band', columns: ['b'] }],
      });
      const columns = [...copyColumns(columnsController), { type: 'expand', command: 'expand' }];

      processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

      expect(getSpans(columns).expand).toEqual({ rowspan: 2 });
    });

    it('should not subtract the parent bands from the rowspan of a command column in a band', async () => {
      const columnsController = await getColumnsController({
        editing: { mode: 'row', allowUpdating: true },
        columns: ['a', { caption: 'Band', columns: ['b', { type: 'buttons' }] }],
      });
      const columns = mergeColumns(
        columnsController,
        columnsController.getColumns(),
        columnsController._commandColumns,
        true,
      );

      processBandColumns(columnsController, columns, columnsController.getBandColumnsCache());

      expect(getSpans(columns).buttons).toEqual({ rowspan: 2 });
    });
  });
});

describe('getChildrenByBandColumn', () => {
  const band: Column = { index: 0, isBand: true };
  const b: Column = { index: 1, dataField: 'b' };
  const nestedBand: Column = { index: 2, isBand: true };
  const c: Column = { index: 3, dataField: 'c' };
  const d: Column = { index: 4, dataField: 'd' };
  const e: Column = { index: 5, dataField: 'e' };
  const columnChildrenByIndex: BandColumnsCache['columnChildrenByIndex'] = {
    [-1]: [band],
    0: [b, nestedBand, e],
    2: [c, d],
  };

  it.each([false, true])('should return no children for a column that is not a band (recursive: %s)', (recursive) => {
    expect(getChildrenByBandColumn(1, columnChildrenByIndex, recursive)).toEqual([]);
  });

  it('should return only the direct children of a band', () => {
    expect(getChildrenByBandColumn(0, columnChildrenByIndex, false)).toEqual([b, nestedBand, e]);
  });

  it('should return the children of a nested band right after that band when recursive', () => {
    expect(getChildrenByBandColumn(0, columnChildrenByIndex, true))
      .toEqual([b, nestedBand, c, d, e]);
  });

  describe('when a child is grouped', () => {
    it('should skip the grouped child', () => {
      const groupedColumn: Column = { ...b, groupIndex: 0 };

      expect(getChildrenByBandColumn(0, { 0: [groupedColumn, e] }, false)).toEqual([e]);
    });

    it('should keep the grouped child when showWhenGrouped is set', () => {
      const groupedColumn: Column = { ...b, groupIndex: 0, showWhenGrouped: true };

      expect(getChildrenByBandColumn(0, { 0: [groupedColumn, e] }, false))
        .toEqual([groupedColumn, e]);
    });
  });
});

describe('getDataColumns', () => {
  const a: Column = { dataField: 'a' };
  const band: Column = { index: 1, isBand: true, colspan: 2 };
  const b: Column = { dataField: 'b', ownerBand: 1 };
  const c: Column = { dataField: 'c', ownerBand: 1 };
  const e: Column = { dataField: 'e' };

  it('should return no columns when there are no rows', () => {
    expect(getDataColumns([])).toEqual([]);
  });

  it('should return the columns of the only row when there are no bands', () => {
    expect(getDataColumns([[a, e]])).toEqual([a, e]);
  });

  it('should put the children of a band in place of the band', () => {
    expect(getDataColumns([[a, band, e], [b, c]])).toEqual([a, b, c, e]);
  });

  it('should take only the own children of each band from the next row', () => {
    const otherBand: Column = { index: 4, isBand: true, colspan: 1 };
    const d: Column = { dataField: 'd', ownerBand: 4 };

    expect(getDataColumns([[band, otherBand], [b, c, d]])).toEqual([b, c, d]);
  });

  it('should go down through the nested bands', () => {
    const nestedBand: Column = {
      index: 3, isBand: true, colspan: 1, ownerBand: 1,
    };
    const d: Column = { dataField: 'd', ownerBand: 3 };

    expect(getDataColumns([[a, band], [b, nestedBand], [d]])).toEqual([a, b, d]);
  });

  it('should keep a band without visible children as a data column', () => {
    const emptyBand: Column = { index: 1, isBand: true, colspan: 0 };

    expect(getDataColumns([[a, emptyBand]])).toEqual([a, emptyBand]);
  });

  describe('when there are command columns', () => {
    it('should keep the command columns of the first row', () => {
      const selectColumn: Column = { type: 'selection', command: 'select' };

      expect(getDataColumns([[selectColumn, a]])).toEqual([selectColumn, a]);
    });

    it('should skip the command columns of a band', () => {
      const editColumn: Column = { type: 'buttons', command: 'edit', ownerBand: 1 };

      expect(getDataColumns([[a, band], [b, editColumn]])).toEqual([a, b]);
    });

    it('should keep a groupExpand column of the first row even when it has an owner band', () => {
      const groupExpandColumn: Column = { type: 'groupExpand', command: 'expand', ownerBand: 1 };

      expect(getDataColumns([[groupExpandColumn, band], [b, c]]))
        .toEqual([groupExpandColumn, b, c]);
    });
  });
});

describe('digitsCount', () => {
  it.each([
    [10, 1],
    [11, 2],
  ])('should return the digits count of the largest index below %s', (count, expected) => {
    expect(digitsCount(count)).toBe(expected);
  });
});

describe('numberToString', () => {
  it('should pad a number with leading zeros', () => {
    expect(numberToString(5, 3)).toBe('005');
  });

  it('should not cut a number that is longer than the length', () => {
    expect(numberToString(123, 2)).toBe('123');
  });
});

describe('reserveGroupIndex', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const getGroupedColumnsController = (): Promise<ColumnsController> => getColumnsController({
    columns: [{ dataField: 'a', groupIndex: 0 }, { dataField: 'b', groupIndex: 1 }, 'c'],
  });

  const getGroupIndexes = (columnsController: ColumnsController): (number | undefined)[] => {
    const columns: Column[] = columnsController.getColumns();

    return columns.map(({ groupIndex }) => groupIndex);
  };

  describe('when the group index is set', () => {
    it.each([
      [0, [1, 2, undefined]],
      [1, [0, 2, undefined]],
      [2, [0, 1, undefined]],
    ])('should shift the group columns from the group index %s', async (groupIndex, expected) => {
      const columnsController = await getGroupedColumnsController();

      reserveGroupIndex(columnsController, groupIndex);

      expect(getGroupIndexes(columnsController)).toEqual(expected);
    });

    it('should return the group index', async () => {
      const columnsController = await getGroupedColumnsController();

      expect(reserveGroupIndex(columnsController, 1)).toBe(1);
    });
  });

  describe.each([undefined, -1])('when the group index is %s', (groupIndex) => {
    it('should return the index after the last group column', async () => {
      const columnsController = await getGroupedColumnsController();

      expect(reserveGroupIndex(columnsController, groupIndex)).toBe(2);
    });

    it('should not change the group columns', async () => {
      const columnsController = await getGroupedColumnsController();

      reserveGroupIndex(columnsController, groupIndex);

      expect(getGroupIndexes(columnsController)).toEqual([0, 1, undefined]);
    });

    it('should return 0 when the grid has no group columns', async () => {
      const columnsController = await getColumnsController({ columns: ['a'] });

      expect(reserveGroupIndex(columnsController, groupIndex)).toBe(0);
    });
  });
});

describe('getColumnByIndexes', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const getDataField = async (
    columns: DataGridProperties['columns'],
    columnIndexes: number[],
  ): Promise<string | undefined> => {
    const columnsController = await getColumnsController({ columns });

    return getColumnByIndexes(columnsController, columnIndexes)?.dataField;
  };

  describe('when there are no band columns', () => {
    it('should return the column at the index', async () => {
      expect(await getDataField(['a', 'b', 'c'], [1])).toBe('b');
    });

    it('should take the position in the columns, not the visible index', async () => {
      const columns = [{ dataField: 'a', visibleIndex: 1 }, { dataField: 'b', visibleIndex: 0 }];

      expect(await getDataField(columns, [0])).toBe('a');
    });

    it('should return undefined for an index out of range', async () => {
      expect(await getDataField(['a', 'b'], [5])).toBeUndefined();
    });
  });

  describe('when there are band columns', () => {
    const columns = ['a', { caption: 'Band', columns: ['b', 'c'] }, 'd'];

    it('should count only the top-level columns for the first index', async () => {
      expect(await getDataField(columns, [2])).toBe('d');
    });

    it('should return a band child by the band index and the child index', async () => {
      expect(await getDataField(columns, [1, 1])).toBe('c');
    });

    it('should return a child of a nested band', async () => {
      const nestedColumns = ['a', { caption: 'Outer', columns: ['b', { caption: 'Inner', columns: ['c', 'd'] }] }];

      expect(await getDataField(nestedColumns, [1, 1, 1])).toBe('d');
    });

    it('should return undefined for a child index out of range', async () => {
      expect(await getDataField(columns, [1, 5])).toBeUndefined();
    });

    it('should return undefined when there are no indexes', async () => {
      expect(await getDataField(columns, [])).toBeUndefined();
    });
  });
});
