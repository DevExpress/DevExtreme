/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable spellcheck/spell-checker */

export interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (value: T) => void;
}

/**
 * This function is substitution for `Promise.withResolvers`
 * and should be replaced by native one once possible
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers}
 */
export function createPromise<T>(): PromiseWithResolvers<T> {
  let resolve!: (value: T) => void;
  let reject!: (value: T) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
