import { createReducer } from '../reducer';

describe('reducer', () => {
  it('calls event handler', () => {
    const expectedReturnValue = {};
    const actionValue = {};
    const state = { model: {}, dictionary: {} };
    const handler = jest.fn().mockReturnValue(expectedReturnValue);
    const reducer = createReducer()({
      a: handler,
    });

    const actualReturnValue = reducer(state, 'a', actionValue);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(state, actionValue);
    expect(actualReturnValue).toBe(expectedReturnValue);
  });

  it('does not call other events handlers', () => {
    const state = { model: {}, dictionary: {} };
    const handlerB = jest.fn();
    const handlerC = jest.fn();
    const reducer = createReducer()({
      a: jest.fn(),
      b: handlerB,
      c: handlerC,
    });

    reducer(state, 'a', undefined);

    expect(handlerB).not.toBeCalled();
    expect(handlerC).not.toBeCalled();
  });

  it('can use Symbol actions', () => {
    const action = Symbol('action');
    const handler = jest.fn();
    const value = {};
    const state = { model: {}, dictionary: {} };
    const reducer = createReducer()({
      [action]: handler,
    });

    reducer(state, action, value);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(state, value);
  });

  it('throws for unknown event', () => {
    const state = { model: {}, dictionary: {} };
    const reducer = createReducer()({
      a: jest.fn(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => reducer(state, 'b' as any, {})).toThrow();
  });

  it('throws for undefined handler', () => {
    const invalidHandlers = {
      a: undefined as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    expect(() => createReducer()(invalidHandlers)).toThrow();
  });

  it('throws for undefined handler of a Symbol action', () => {
    const action = Symbol('action');
    const invalidHandlers = {
      [action]: undefined as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    expect(() => createReducer()(invalidHandlers)).toThrow();
  });
});
