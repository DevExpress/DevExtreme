import { Comparer } from './types';

export function memoize<TParams, TReturn>(
  func: (params: TParams) => TReturn,
  comparer: Comparer<TParams>,
): (params: TParams) => TReturn {
  let cachedParams: TParams;
  let cachedResult: TReturn;

  const updateCache = (params: TParams) => {
    cachedParams = params;
    cachedResult = func(params);
    return cachedResult;
  };

  const getCachedResult = (params: TParams) => (
    comparer(cachedParams, params)
      ? cachedResult
      : updateCache(params)
  );

  let decoratedFunc = (params: TParams) => {
    decoratedFunc = getCachedResult;
    return updateCache(params);
  };

  return (params: TParams) => decoratedFunc(params);
}
