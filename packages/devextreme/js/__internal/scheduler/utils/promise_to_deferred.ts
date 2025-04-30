import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';

export const promiseToDeferred = <T>(promise: Promise<T>): DeferredObj<T> => {
  // @ts-expect-error
  const deferred: DeferredObj<T> = new Deferred();

  promise
    .then((result) => {
      deferred.resolve(result);
    })
    .catch((result) => {
      deferred.reject(result);
    });

  return deferred;
};
