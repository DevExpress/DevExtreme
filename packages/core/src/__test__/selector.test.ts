import { createSelector } from '../selector';
import { memoize, shallowComparer } from '../utils';

jest.mock('../utils');

const memoizeMock = jest.mocked(memoize);
memoizeMock.mockReturnValue(jest.fn);

describe('core', () => {
  describe('selector', () => {
    describe('createSelector', () => {
      it('passes arguments to memoize', () => {
        const func = jest.fn();
        const comparer = jest.fn();

        createSelector(func, jest.fn(), comparer);

        expect(memoizeMock).toBeCalledTimes(1);
        expect(memoizeMock).toBeCalledWith(func, comparer);
      });

      it('uses shallowComparer by default', () => {
        createSelector(jest.fn(), jest.fn());

        expect(memoizeMock).toBeCalledWith(expect.anything(), shallowComparer);
      });

      it('returns memoized', () => {
        const cachedValue = {};
        const cached = jest.fn().mockReturnValue(cachedValue);
        memoizeMock.mockReturnValue(cached);

        const selector = createSelector(jest.fn(), jest.fn(), jest.fn());

        expect(memoizeMock).toBeCalledTimes(1);
        expect(selector({})).toBe(cachedValue);
      });

      it('passes params to memoized', () => {
        const param = {};
        const getParams = jest.fn().mockReturnValue(param);
        const cached = jest.fn();
        memoizeMock.mockReturnValue(cached);

        const selector = createSelector(jest.fn(), getParams, jest.fn());
        selector({});

        expect(cached).toBeCalledTimes(1);
        expect(cached).toBeCalledWith(param);
      });

      it('passes argument to params getter', () => {
        const paramsArgument = {};
        const getParams = jest.fn();
        const cached = jest.fn();
        memoizeMock.mockReturnValue(cached);

        const selector = createSelector(jest.fn(), getParams, jest.fn());
        selector(paramsArgument);

        expect(getParams).toBeCalledTimes(1);
        expect(getParams).toBeCalledWith(paramsArgument);
      });
    });
  });
});
