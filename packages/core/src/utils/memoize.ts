import { Comparer } from './types';

export function memoize<TArgs extends unknown[], TReturn>(
  func: (...params: TArgs) => TReturn,
  comparer: Comparer<TArgs>,
): (...arg: TArgs) => TReturn {
  let cachedArg: TArgs;
  let cachedResult: TReturn;

  const updateCache = (...args: TArgs) => {
    cachedArg = args;
    cachedResult = func(...args);
    return cachedResult;
  };

  const getCachedResult = (...arg: TArgs) => (
    comparer(cachedArg, arg)
      ? cachedResult
      : updateCache(...arg)
  );

  let decoratedFunc = (...arg: TArgs) => {
    decoratedFunc = getCachedResult;
    return updateCache(...arg);
  };

  return (...arg: TArgs) => decoratedFunc(...arg);
}
