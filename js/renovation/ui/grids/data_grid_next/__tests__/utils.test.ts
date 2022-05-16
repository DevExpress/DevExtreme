import { Row } from '../types';
import { createGetKey, getReactRowKey, getElementHeight } from '../utils';
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

describe('getElementHeight', () => {
  it('should have correct value', () => {
    const el = {} as HTMLElement;
    setWindow({ getComputedStyle: () => ({ height: '100px' }) }, true);
    expect(getElementHeight(el)).toEqual(100);
  });
});
