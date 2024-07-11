"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPromise = createPromise;
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable spellcheck/spell-checker */
/**
 * This function is substitution for `Promise.withResolvers`
 * and should be replaced by native one once possible
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers}
 */
function createPromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
}