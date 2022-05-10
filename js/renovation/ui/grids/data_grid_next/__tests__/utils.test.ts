import { Row } from '../types';
import {
  createGetKey, getReactRowKey, getFormatByDataType,
  getAlignmentByDataType, getDeserializeValueByDataType, getDefaultCalculateCellValue,
  getElementHeight,
} from '../utils';
import { setWindow } from '../../../../../core/utils/window';

describe('getKey', () => {
  const getKey = createGetKey('(Module name)');

  it('should throw E1042 if keyExpr is missing', () => {
    expect(() => getKey({}, null))
      .toThrowErrorMatchingInlineSnapshot(`
"E1042 - (Module name) requires the key field to be specified. See:
http://js.devexpress.com/error/%VERSION%/E1042"
`);
  });

  it('should return undefined if keyExpr was not initialized via plugins', () => {
    expect(getKey({}, undefined)).toEqual(undefined);
  });

  it('should throw E1046 if data object does not have key', () => {
    expect(() => getKey({}, 'id'))
      .toThrowErrorMatchingInlineSnapshot(`
"E1046 - The 'id' key field is not found in data objects. See:
http://js.devexpress.com/error/%VERSION%/E1046"
`);
  });

  it('return key', () => {
    const key = getKey({ id: '123' }, 'id');
    expect(key).toEqual('123');
  });
});

describe('getReactRowKey', () => {
  it('should return key with row key and row type', () => {
    const row: Row = {
      data: {},
      key: 'someKey',
      rowType: 'data',
    };

    expect(getReactRowKey(row, 11)).toEqual('data_someKey');
  });

  it('should return index if no key', () => {
    const row: Row = {
      data: {},
      rowType: 'data',
    };

    expect(getReactRowKey(row, 11)).toEqual('11');
  });

  it('should index if key is complex', () => {
    const row: Row = {
      data: {},
      key: {},
      rowType: 'data',
    };

    expect(getReactRowKey(row, 11)).toEqual('11');
  });
});

describe('getFormatByDataType', () => {
  it('should return shortDate for dataType date', () => {
    expect(getFormatByDataType('date')).toEqual('shortDate');
  });

  it('should return shortDateShortTime for dataType datetime', () => {
    expect(getFormatByDataType('datetime')).toEqual('shortDateShortTime');
  });

  it('should return undefined for another dataType', () => {
    expect(getFormatByDataType('number')).toBeUndefined();
    expect(getFormatByDataType('string')).toBeUndefined();
    expect(getFormatByDataType('boolean')).toBeUndefined();
  });
});

describe('getAlignmentByDataType', () => {
  it('should return right for dataType number', () => {
    expect(getAlignmentByDataType('number')).toEqual('right');
  });

  it('should return undefined for another dataType', () => {
    expect(getAlignmentByDataType('string')).toBeUndefined();
    expect(getAlignmentByDataType('boolean')).toBeUndefined();
    expect(getAlignmentByDataType('date')).toBeUndefined();
  });
});

describe('getDeserializeValueByDataType', () => {
  it('should return deserialize function for dataType date', () => {
    const deserializeValue = getDeserializeValueByDataType('date') as (value: unknown) => unknown;
    expect(deserializeValue('2022-02-02')).toEqual(new Date(2022, 1, 2));
  });

  it('should return deserialize function for dataType datetime', () => {
    const deserializeValue = getDeserializeValueByDataType('date') as (value: unknown) => unknown;
    expect(deserializeValue('2022-02-02T03:04')).toEqual(new Date(2022, 1, 2, 3, 4));
  });

  it('should return undefined for another dataType', () => {
    expect(getDeserializeValueByDataType('string')).toBeUndefined();
    expect(getDeserializeValueByDataType('number')).toBeUndefined();
    expect(getDeserializeValueByDataType('boolean')).toBeUndefined();
  });
});

describe('getDefaultCalculateCellValue', () => {
  it('should return getter for simple dataField', () => {
    const calculateCellValue = getDefaultCalculateCellValue('field1');
    expect(calculateCellValue({ field1: 1 })).toEqual(1);
  });

  it('should return getter for complex dataField', () => {
    const calculateCellValue = getDefaultCalculateCellValue('field1.field2');
    expect(calculateCellValue({ field1: { field2: 2 } })).toEqual(2);
  });

  it('should return getter with deserialization for dataType date', () => {
    const calculateCellValue = getDefaultCalculateCellValue('birthDate', 'date');
    expect(calculateCellValue({ birthDate: '2000-05-10' })).toEqual(new Date(2000, 4, 10));
  });

  it('should return empty getter if dataField is not defined', () => {
    const calculateCellValue = getDefaultCalculateCellValue();
    expect(calculateCellValue({})).toEqual(null);
  });
});

describe('getElementHeight', () => {
  it('should have correct value', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ height: '100px' }) }, true);
    expect(getElementHeight(el)).toEqual(100);
  });
});
