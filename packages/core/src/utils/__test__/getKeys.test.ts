import { getKeys } from '../getKeys';

describe('Core: Utils: getKeys', () => {
  it('Returns string key array of the passed object with string keys', () => {
    const testObject = {
      a: 1,
      b: 2,
      c: 3,
    };
    const expectedResult = ['a', 'b', 'c'];

    const result = getKeys(testObject);

    expect(result).toEqual(expectedResult);
  });

  it('Returns string key array of the passed object with number keys', () => {
    const testObject = {
      0: 1,
      1: 2,
      2: 3,
    };
    const expectedResult = ['0', '1', '2'];

    const result = getKeys(testObject);

    expect(result).toEqual(expectedResult);
  });

  it('Returns symbol key array of the passed object with symbols keys', () => {
    const symbols = [
      Symbol('0'),
      Symbol('1'),
      Symbol('2'),
    ];
    const testObject = {
      [symbols[0]]: 1,
      [symbols[1]]: 2,
      [symbols[2]]: 3,
    };

    const result = getKeys(testObject);

    expect(result).toEqual(symbols);
  });

  it('Returns correct key array of the passed object with different key types', () => {
    const symbol = Symbol('test');
    const testObject = {
      [symbol]: true,
      10: true,
      a: false,
    };
    const expectedResult = ['10', 'a', symbol];

    const result = getKeys(testObject);

    expect(result).toEqual(expectedResult);
  });
});
