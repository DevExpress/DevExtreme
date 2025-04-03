import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';

// @ts-expect-error bad deferred ctor type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDeferred = (): any => new Deferred();

export type DeferredAction<TArgs, TResult> = (...args: TArgs[]) => DeferredObj<TResult>;

export const deferredCache = <TArgs, TResult>(
  actionFn: DeferredAction<TArgs, TResult>,
): DeferredAction<TArgs, TResult> => {
  let lastArgs: TArgs[] | null = null;
  let cachedResult: TResult | null = null;

  return (
    ...args: TArgs[]
  ): DeferredObj<TResult> => {
    const hasPreviousCall = lastArgs !== null && cachedResult !== null;
    const isArgsSame = hasPreviousCall
      ? equalByValue(lastArgs, args)
      : false;

    if (hasPreviousCall && isArgsSame) {
      return createDeferred().resolve(cachedResult) as DeferredObj<TResult>;
    }

    lastArgs = args;
    return actionFn(...args)
      .then((result) => {
        cachedResult = result;
        return result;
      });
  };
};
