import { equalByValue } from '@js/core/utils/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncArgs = any[];
type CachedFunc<TArgs extends FuncArgs, TReturn> = (...args: TArgs) => TReturn;

const createCacheFunc = <TArgs extends FuncArgs, TReturn>(
  firstArgs: TArgs,
  firstResult: TReturn,
  originFunc: CachedFunc<TArgs, TReturn>,
): CachedFunc<TArgs, TReturn> => {
  let lastArgs = firstArgs;
  let lastResult = firstResult;

  return (...args: TArgs): TReturn => {
    const argsEquals = args.length === lastArgs.length
    && !Object.keys(args).some((key) => !equalByValue(args[key], lastArgs[key]));

    if (argsEquals) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = originFunc(...lastArgs);
    return lastResult;
  };
};

export const memoize = <TArgs extends FuncArgs, TReturn>(
  func: CachedFunc<TArgs, TReturn>,
): CachedFunc<TArgs, TReturn> => {
  let cachedFunc: CachedFunc<TArgs, TReturn> | null = null;

  return (...args: TArgs): TReturn => {
    if (!cachedFunc) {
      const firstResult = func(...args);
      cachedFunc = createCacheFunc(args, firstResult, func);
      return firstResult;
    }

    return cachedFunc(...args);
  };
};
