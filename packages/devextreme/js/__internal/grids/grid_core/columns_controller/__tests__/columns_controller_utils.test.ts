import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Response as SendRequestResult } from '@js/common/ai-integration';
import config from '@js/core/config';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import {
  columnOptionCore,
  customizeTextForBooleanDataType,
  findColumn,
  fireColumnsChanged,
  getAlignmentByDataType,
  getCustomizeTextByDataType,
  getSerializationFormat,
  getValueDataType,
  resolveChangeType,
  setFilterOperationsAsDefaultValues,
  strictParseNumber,
  updateSerializers,
} from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
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
      ['groupIndex', 0, 'grouping'],
      ['calculateGroupValue', 'b', 'grouping'],
      ['sortOrder', 'asc', 'sorting'],
      ['calculateSortValue', 'b', 'sorting'],
      ['caption', 'New', 'columns'],
    ])('should record a %s change as a %s change', async (optionName, value, changeType) => {
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
