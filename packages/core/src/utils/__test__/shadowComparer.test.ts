import { shadowComparer } from '../shadowComparer';

describe('Core: Utils: shadowComparer', () => {
  it('Returns false for arguments of different type', () => {
    const prev = { a: 1 } as unknown;
    const next = (() => {}) as unknown;

    const result = shadowComparer(prev, next);

    expect(result).toBeFalsy();
  });

  it('Returns true if compared values have value types and equal', () => {
    const prev = 2;
    const next = 2;

    const result = shadowComparer(prev, next);

    expect(result).toBeTruthy();
  });

  it('Returns false if compared values have value types and not equal', () => {
    const prev = true;
    const next = false;

    const result = shadowComparer(prev, next);

    expect(result).toBeFalsy();
  });

  it('Returns true if compared values are functions and equal', () => {
    const firstFunc = () => {};

    const result = shadowComparer(firstFunc, firstFunc);

    expect(result).toBeTruthy();
  });

  it('Returns false if compared values are functions and not equal', () => {
    const firstFunc = () => {};
    const secondFunc = () => {};

    const result = shadowComparer(firstFunc, secondFunc);

    expect(result).toBeFalsy();
  });

  it('Returns true if compared values are dates and equal', () => {
    const firstDate = new Date('2022-10-10T00:00:00Z');
    const secondDate = new Date('2022-10-10T00:00:00Z');

    const result = shadowComparer(firstDate, secondDate);

    expect(result).toBeTruthy();
  });

  it('Returns false if compared values are dates and not equal', () => {
    const firstDate = new Date('2022-10-10T00:00:00Z');
    const secondDate = new Date('2021-10-10T00:00:00Z');

    const result = shadowComparer(firstDate, secondDate);

    expect(result).toBeFalsy();
  });

  it('Returns false if keys count aren\'t equal', () => {
    const prev = { a: 1 };
    const next = { a: 1, b: 2 };

    const result = shadowComparer(prev, next);

    expect(result).toBeFalsy();
  });

  it('Returns true if all keys on the first level are equal', () => {
    const testFunc = () => {};
    const testArray = [0, 1, 2];
    const testRef = { b: 2 };
    const prev = {
      a: 1,
      ref: testRef,
      func: testFunc,
      array: testArray,
    };
    const next = {
      a: 1,
      ref: testRef,
      func: testFunc,
      array: testArray,
    };

    const result = shadowComparer(prev, next);

    expect(result).toBeTruthy();
  });

  it('Returns false if some keys on the first level are different', () => {
    const prev = {
      ref: {
        b: 2,
      },
    };
    const next = {
      ref: {
        b: 2,
      },
    };

    const result = shadowComparer(prev, next);

    expect(result).toBeFalsy();
  });

  it('Compares only first level keys', () => {
    const testRef = {
      a: {
        b: true,
      },
    };
    const prev = testRef;
    const next = testRef;
    next.a.b = false;

    const result = shadowComparer(prev, next);

    expect(result).toBeTruthy();
  });
});
