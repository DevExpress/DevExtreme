// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { equalByValue } from '@js/core/utils/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncArgs = any[];
type CachedFunc<TArgs extends FuncArgs, TReturn> = (...args: TArgs) => TReturn;
type CompareFunc<TArgs extends FuncArgs> = (args: TArgs, lastArgs: TArgs) => boolean;

export interface MemoizeOptions {
  compareType: 'reference' | 'value';
}

const compareByReference = <TArgs extends FuncArgs>(
  args: TArgs,
  lastArgs: TArgs,
): boolean => args.length === lastArgs.length
  && !Object.keys(args).some((key) => args[key] !== lastArgs[key]);

const compareByValue = <TArgs extends FuncArgs>(
  args: TArgs,
  lastArgs: TArgs,
  // TODO: Check why there is a ESlint error.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
): boolean => equalByValue(args, lastArgs, { maxDepth: 4, strict: true });

const createCacheFunc = <TArgs extends FuncArgs, TReturn>(
  firstArgs: TArgs,
  firstResult: TReturn,
  originFunc: CachedFunc<TArgs, TReturn>,
  compareFunc: CompareFunc<TArgs>,
): CachedFunc<TArgs, TReturn> => {
  let lastArgs = firstArgs;
  let lastResult = firstResult;

  return (...args: TArgs): TReturn => {
    const argsEquals = compareFunc(args, lastArgs);

    if (argsEquals) {
      return lastResult;
    }

    lastArgs = args;
    lastResult = originFunc(...lastArgs);
    return lastResult;
  };
};

const MEMOIZE_DEFAULT_OPTIONS: MemoizeOptions = {
  compareType: 'reference',
};
export const memoize = <TArgs extends FuncArgs, TReturn>(
  func: CachedFunc<TArgs, TReturn>,
  { compareType } = MEMOIZE_DEFAULT_OPTIONS,
): CachedFunc<TArgs, TReturn> => {
  let cachedFunc: CachedFunc<TArgs, TReturn> | null = null;

  return (...args: TArgs): TReturn => {
    if (!cachedFunc) {
      const firstResult = func(...args);
      cachedFunc = createCacheFunc(
        args,
        firstResult,
        func,
        compareType === 'reference'
          ? compareByReference
          : compareByValue,
      );
      return firstResult;
    }

    return cachedFunc(...args);
  };
};
