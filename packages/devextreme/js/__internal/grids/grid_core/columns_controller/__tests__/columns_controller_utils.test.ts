import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import config from '@js/core/config';
import {
  customizeTextForBooleanDataType,
  findColumn,
  getAlignmentByDataType,
  getCustomizeTextByDataType,
  getSerializationFormat,
  getValueDataType,
  setFilterOperationsAsDefaultValues,
  strictParseNumber,
  updateSerializers,
} from '@ts/grids/grid_core/columns_controller/m_columns_controller_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

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
