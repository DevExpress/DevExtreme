import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  Prompt,
  RequestParams,
  ResponseParams,
} from '@js/ai/ai';
import { ERROR_MESSAGE, RequestManager } from '@ts/core/ai/core/request_manager';

describe('RequestManager', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let onChunkCallback: RequestParams['onChunk'];
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let provider: AIProvider;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let requestManager: RequestManager;

  beforeEach(() => {
    provider = {
      sendRequest: jest.fn((params: RequestParams) => {
        onChunkCallback = params.onChunk;

        return {
          promise: Promise.resolve(),
          abort: (): void => {},
        };
      }),
    };

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

      requestManager.sendRequest(prompt, { onChunk });

      expect(provider.sendRequest).toHaveBeenCalledTimes(1);
      expect(provider.sendRequest).toHaveBeenCalledWith({
        prompt,
        onChunk: expect.any(Function),
      });
    });

    it('accumulates chunk data and calls onChunk on every chunk', () => {
      const onChunkSpy = jest.fn();

      requestManager.sendRequest({ user: 'test' }, { onChunk: onChunkSpy });

      onChunkCallback?.('First');
      onChunkCallback?.('Second');

      expect(onChunkSpy).toHaveBeenCalledTimes(2);
      expect(onChunkSpy).toHaveBeenNthCalledWith(1, 'First');
      expect(onChunkSpy).toHaveBeenNthCalledWith(2, 'Second');
    });

    it('after completion of the promis calls onComplete with accumulated data', async () => {
      let resolvePromise: () => void = () => {};

      const promise = new Promise<void>((resolve) => { resolvePromise = resolve; });

      (provider.sendRequest as jest.MockedFunction<typeof provider.sendRequest>)
        .mockImplementation((params: RequestParams) => {
          onChunkCallback = params.onChunk;

          return {
            promise,
            abort: (): void => {},
          };
        });

      const onCompleteSpy = jest.fn();

      requestManager.sendRequest({ user: 'test' }, { onComplete: onCompleteSpy });

      onChunkCallback?.('First');
      onChunkCallback?.('Second');

      resolvePromise();

      await promise;

      expect(onCompleteSpy).toHaveBeenCalledTimes(1);
      expect(onCompleteSpy).toHaveBeenCalledWith('FirstSecond');
    });

    it('calls onError if the promise was rejected', async () => {
      let rejectPromise: (reason?: unknown) => void = () => {};

      const error = new Error('Test error');
      const onErrorSpy = jest.fn();

      const promise = new Promise<void>((_, reject) => { rejectPromise = reject; });

      (provider.sendRequest as jest.MockedFunction<typeof provider.sendRequest>)
        .mockImplementation((params: RequestParams) => {
          onChunkCallback = params.onChunk;

          return {
            promise,
            abort: (): void => {},
          };
        });

      requestManager.sendRequest({ user: 'user prompt' }, { onError: onErrorSpy });

      rejectPromise(error);

      await new Promise(process.nextTick);

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(error);
    });

    it('returns the abort function that returned from sendRequest', () => {
      const abort = (): void => {};

      (provider.sendRequest as jest.Mock).mockReturnValue({
        promise: Promise.resolve(),
        abort,
      } as ResponseParams);

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
