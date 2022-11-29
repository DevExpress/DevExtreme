import { createObservableEmitter, DISPOSE, memoize } from '../utils';
import { createSelector, createViewModel } from '../view-model';

jest.mock('../utils/observable');
jest.mock('../utils/disposable');
jest.mock('../utils/memoize');

describe('Core: ViewModel', () => {
  describe('createViewModel', () => {
    it('returns observable', () => {
      const initialState = {};
      const mappedValue = {};
      const selector = jest.fn().mockReturnValue(mappedValue);
      const expected = {
        subscribe: jest.fn(),
        getValue: jest.fn(),
      };
      jest
        .mocked(createObservableEmitter)
        .mockReturnValueOnce({
          ...expected,
          emit: jest.fn(),
        });

      const viewModel = createViewModel(initialState, jest.fn(), selector);

      expect(viewModel).toEqual(expected);
    });

    it('selects observables from initial state', () => {
      const initialState = {};
      const mappedValue = {};
      const selector = jest.fn().mockReturnValue(mappedValue);
      jest
        .mocked(createObservableEmitter)
        .mockReturnValue({
          subscribe: jest.fn(),
          getValue: jest.fn(),
          emit: jest.fn(),
        });

      createViewModel(initialState, jest.fn(), selector);

      expect(selector).toBeCalledTimes(1);
      expect(selector).toBeCalledWith(initialState);
      expect(createObservableEmitter).toBeCalledTimes(1);
      expect(createObservableEmitter).toBeCalledWith(mappedValue);
    });

    it('selects observables from updated state', () => {
      const selector = jest.fn();
      const subscribe = jest.fn();
      const emit = jest.fn();
      const mappedValue = {};
      const value = {};
      jest
        .mocked(createObservableEmitter)
        .mockReturnValue({
          subscribe: jest.fn(),
          getValue: jest.fn(),
          emit,
        });

      createViewModel({}, subscribe, selector);

      selector
        .mockClear()
        .mockReturnValue(mappedValue);

      const [listener] = subscribe.mock.lastCall;
      listener(value);

      expect(selector).toBeCalledTimes(1);
      expect(selector).toBeCalledWith(value);

      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith(mappedValue);
    });

    it('calls unsubscribe function on dispose', () => {
      const unsubscribe = jest.fn();
      const subscribe = jest.fn().mockImplementation(() => unsubscribe);

      jest
        .mocked(createObservableEmitter)
        .mockReturnValue({
          subscribe: jest.fn(),
          getValue: jest.fn(),
          emit: jest.fn(),
        });

      const viewModel = createViewModel({}, subscribe, jest.fn());

      expect(unsubscribe).not.toHaveBeenCalled();

      viewModel[DISPOSE]();

      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('selector', () => {
    it('passes arguments to memoize', () => {
      const func = jest.fn();
      const comparer = jest.fn();

      createSelector(func, jest.fn(), comparer);

      expect(memoize).toBeCalledTimes(1);
      expect(memoize).toBeCalledWith(func, comparer);
    });

    it('returns memoized', () => {
      const cachedValue = {};
      const cached = jest.fn().mockReturnValue(cachedValue);
      jest.mocked(memoize).mockReturnValue(cached);

      const selector = createSelector(jest.fn(), jest.fn(), jest.fn());

      expect(memoize).toBeCalledTimes(1);
      expect(selector({})).toBe(cachedValue);
    });

    it('passes params to memoized', () => {
      const param = {};
      const getParams = jest.fn().mockReturnValue(param);
      const cached = jest.fn();
      jest.mocked(memoize).mockReturnValue(cached);

      const selector = createSelector(jest.fn(), getParams, jest.fn());
      selector({});

      expect(cached).toBeCalledTimes(1);
      expect(cached).toBeCalledWith(param);
    });

    it('passes argument to params getter', () => {
      const paramsArgument = {};
      const getParams = jest.fn();
      const cached = jest.fn();
      jest.mocked(memoize).mockReturnValue(cached);

      const selector = createSelector(jest.fn(), getParams, jest.fn());
      selector(paramsArgument);

      expect(getParams).toBeCalledTimes(1);
      expect(getParams).toBeCalledWith(paramsArgument);
    });
  });
});
