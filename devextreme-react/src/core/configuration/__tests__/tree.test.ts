/* eslint-disable max-classes-per-file */
import { findValueInObject } from '../tree';

describe('check findValueInObject', () => {
  it('get underfined by string', () => {
    const obj = 'Extension';
    const path = ['sortOrder'];
    const valueInObject = findValueInObject(obj, path);
    expect(() => findValueInObject(obj, path)).not.toThrow();
    expect(valueInObject).toEqual(undefined);
  });

  it('get value by object', () => {
    const obj = {
      sortOrder: 'desc',
    };
    const path = ['sortOrder'];
    const valueInObject = findValueInObject(obj, path);
    expect(valueInObject).toEqual({ type: 0, value: 'desc' });
    expect(() => findValueInObject(obj, path)).not.toThrow();
  });

  it('get underfined by empty object', () => {
    const obj = {};
    const path = ['sortOrder'];
    const valueInObject = findValueInObject(obj, path);
    expect(valueInObject).toEqual(undefined);
    expect(() => findValueInObject(obj, path)).not.toThrow();
  });
});
