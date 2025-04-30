import {
  describe, expect, it, jest,
} from '@jest/globals';

import { invokeConditionally } from './conditional_invoke';

describe('invokeConditionally', () => {
  [false, true].forEach((isPromise) => {
    [
      { cancelResult: false, expectedCallback: 'callback' },
      { cancelResult: true, expectedCallback: 'cancelCallback' },
    ].forEach(({ cancelResult, expectedCallback }) => {
      it(`should invoke ${expectedCallback} (isPromise=${isPromise}, cancelResult=${cancelResult})`, async () => {
        const callback = jest.fn();
        const cancelCallback = jest.fn();

        invokeConditionally(
          isPromise ? Promise.resolve(cancelResult) : cancelResult,
          callback,
          cancelCallback,
        );

        await new Promise(process.nextTick);

        if (expectedCallback === 'callback') {
          expect(callback).toHaveBeenCalled();
          expect(cancelCallback).not.toHaveBeenCalled();
        } else {
          expect(cancelCallback).toHaveBeenCalled();
          expect(callback).not.toHaveBeenCalled();
        }
      });
    });
  });

  it('should invoke the callback when cancelResult is a rejected promise', async () => {
    const callback = jest.fn();
    const cancelCallback = jest.fn();

    invokeConditionally(
      Promise.reject(new Error('test error')),
      callback,
      cancelCallback,
    );

    await new Promise(process.nextTick);

    expect(cancelCallback).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('should not throw when cancelCallback is undefined and cancelResult is true', () => {
    const callback = jest.fn();
    expect(() => invokeConditionally(true, callback)).not.toThrow();
  });
});
