import { callbacksMiddleware } from '../callbacksMiddleware';
import { getChangedKeys } from '../getChangedKeys';

jest.mock('../getChangedKeys');
const getChangedKeysMock = jest.mocked(getChangedKeys);

describe('Core: Component: Middlewares: callbacksMiddleware', () => {
  it('Returns empty functions array if config not set', () => {
    const prev = { a: 1, b: 2 };
    const next = { a: 3, b: 4 };
    getChangedKeysMock.mockReturnValue(['a', 'b']);

    const funcArray = callbacksMiddleware(prev, next);

    expect(funcArray).toEqual([]);
  });

  it('Returns functions array of the changed values callbacks', () => {
    const expectedValue = 2;
    const callbackMock = jest.fn();
    const prev = { a: 1 };
    const next = { a: expectedValue };
    const config = {
      a: {
        controlledMode: true,
        changeCallback: callbackMock,
      },
    };
    getChangedKeysMock.mockReturnValue(['a']);

    const funcArray = callbacksMiddleware(prev, next, config);
    funcArray.forEach((func) => func());

    expect(callbackMock).toHaveBeenCalledWith(expectedValue);
  });

  it('Returns functions array only for configured properties', () => {
    const prev = { a: 1, b: 2, c: 3 };
    const next = { a: 4, b: 5, c: 6 };
    const config = {};
    getChangedKeysMock.mockReturnValue(['a', 'b', 'c']);

    const funcArray = callbacksMiddleware(prev, next, config);

    expect(funcArray.length).toEqual(0);
  });
});
