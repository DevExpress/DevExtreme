import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, Prompt } from '@js/ai';
import { ERROR_MESSAGE, RequestManager } from '@ts/core/ai/core/request_manager';
import { Provider } from '@ts/core/ai/test_utils/provider_mock';

describe('RequestManager', () => {
  let provider = null as unknown as AIProvider;
  let requestManager = null as unknown as RequestManager;

  beforeEach(() => {
    provider = new Provider();
    requestManager = new RequestManager(provider);
  });

  describe('constructor', () => {
    it('stores the provider in a private field', () => {
      // @ts-expect-error Access to protected property for a test
      expect(requestManager.provider).toBe(provider);
    });
  });

  describe('sendRequest', () => {
    it('throws an error if the provider does not have a valid sendRequest method', () => {
      const aIProvider = {} as AIProvider;

      requestManager = new RequestManager(aIProvider);

      expect(() => {
        requestManager.sendRequest({ user: 'test' }, {});
      }).toThrow(ERROR_MESSAGE.METHOD_NOT_IMPLEMENTED);
    });

    it('calls provider.sendRequest with the correct parameters', () => {
      const prompt: Prompt = { user: 'User', system: 'System' };
      const onChunk = jest.fn();

      const sendRequestSpy = jest.spyOn(provider, 'sendRequest');

      requestManager.sendRequest(prompt, { onChunk });

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith({
        prompt,
        onChunk: expect.any(Function),
      });
    });

    it('accumulates chunk data and calls onChunk on every chunk', () => {
      const onChunkSpy = jest.fn();

      requestManager.sendRequest({ user: 'test' }, { onChunk: onChunkSpy });

      expect(onChunkSpy).toHaveBeenCalledTimes(2);
      expect(onChunkSpy).toHaveBeenNthCalledWith(1, 'AI');
      expect(onChunkSpy).toHaveBeenNthCalledWith(2, ' response');
    });

    it('after completion of the promis calls onComplete with accumulated data', async () => {
      let resolvePromise: (result: string) => void = () => {};

      const promise = new Promise<string>((resolve) => { resolvePromise = resolve; });
      const sendRequestSpy = jest.spyOn(provider, 'sendRequest');
      const onCompleteSpy = jest.fn();

      sendRequestSpy.mockImplementation(() => ({
        promise,
        abort: (): void => {},
      }));

      requestManager.sendRequest({ user: 'test' }, { onComplete: onCompleteSpy });

      resolvePromise('FirstSecond');

      await promise;

      expect(onCompleteSpy).toHaveBeenCalledTimes(1);
      expect(onCompleteSpy).toHaveBeenCalledWith('FirstSecond');
    });

    it('calls onError if the promise was rejected', async () => {
      let rejectPromise: (error: Error) => void = () => {};

      const promise = new Promise<string>((_, reject) => { rejectPromise = reject; });
      const sendRequestSpy = jest.spyOn(provider, 'sendRequest');

      const onErrorSpy = jest.fn();
      const error = new Error('Test error');

      sendRequestSpy.mockImplementation(() => ({
        promise,
        abort: (): void => {},
      }));

      requestManager.sendRequest({ user: 'user prompt' }, { onError: onErrorSpy });

      rejectPromise(error);

      await new Promise(process.nextTick);

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(error);
    });

    it('returns the abort function that returned from sendRequest', () => {
      const abort = (): void => {};

      const sendRequestSpy = jest.spyOn(provider, 'sendRequest');

      sendRequestSpy.mockReturnValue({
        promise: Promise.resolve(''),
        abort,
      });

      const abortRequest = requestManager.sendRequest({ user: 'user' }, {});

      expect(abortRequest).toBe(abort);
    });

    it('works correctly with no or partial definition of callbacks', () => {
      expect(() => {
        requestManager.sendRequest({ user: 'test' }, {});
      }).not.toThrow();

      expect(() => {
        requestManager.sendRequest({ user: 'test' }, { onChunk: () => {} });
      }).not.toThrow();
    });
  });
});
