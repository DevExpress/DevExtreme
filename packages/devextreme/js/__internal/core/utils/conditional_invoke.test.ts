import {
  describe, expect, it, jest,
} from '@jest/globals';

import { invokeConditionally } from './conditional_invoke';

describe('invokeConditionally', () => {
  it.each([
    { cancelResult: false, expectedCallback: 'callback' },
    { cancelResult: true, expectedCallback: 'cancelCallback' },
  ])(
    'should invoke $expectedCallback when cancelResult is $cancelResult',
    ({ cancelResult, expectedCallback }) => {
      const callback = jest.fn();
      const cancelCallback = jest.fn();

      invokeConditionally(cancelResult, callback, cancelCallback);

      if (expectedCallback === 'callback') {
        expect(callback).toHaveBeenCalled();
        expect(cancelCallback).not.toHaveBeenCalled();
      } else {
        expect(cancelCallback).toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
      }
    },
  );

  it.each([
    { cancelResult: false, expectedCallback: 'callback' },
    { cancelResult: true, expectedCallback: 'cancelCallback' },
  ])(
    'should invoke $expectedToCall when cancelResult is a resolved promise of $cancelResult',
    async ({ cancelResult, expectedCallback }) => {
      const callback = jest.fn();
      const cancelCallback = jest.fn();
      invokeConditionally(
        Promise.resolve(cancelResult),
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
    },
  );

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
