import { createGetKey } from '../utils';

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
