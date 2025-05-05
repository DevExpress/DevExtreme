import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, Prompt } from '@js/common/ai-integration';
import type { RequestManagerParams } from '@ts/core/ai_integration/core/request_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

const INVALID_SEND_REQUEST_ERROR_MESSAGE = 'E0122 - AIIntegration: The sendRequest method is missing.';

describe('RequestManager', () => {
  let provider = null as unknown as AIProvider;
  let requestManager = null as unknown as RequestManager;

  beforeEach(() => {
    provider = new Provider();
    requestManager = new RequestManager(provider);
  });

  describe('constructor', () => {
    it('should store the provider in a private field', () => {
      // @ts-expect-error Access to protected property for a test
      expect(requestManager.provider).toBe(provider);
    });

    it('should throw an error when constructed with invalid sendRequest method', () => {
      const invalidProvider = {} as AIProvider;

      const createRequestManager = (): RequestManager => new RequestManager(invalidProvider);

      expect(createRequestManager).toThrow(INVALID_SEND_REQUEST_ERROR_MESSAGE);
    });
  });

  describe('sendRequest', () => {
    it('should call provider.sendRequest with the propmpt and onChunk once', () => {
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

    it('should call onChunk on every chunk', () => {
      const onChunkSpy = jest.fn();

      requestManager.sendRequest({ user: 'test' }, { onChunk: onChunkSpy });

      expect(onChunkSpy).toHaveBeenCalledTimes(2);
      expect(onChunkSpy).toHaveBeenNthCalledWith(1, 'AI');
      expect(onChunkSpy).toHaveBeenNthCalledWith(2, ' response');
    });

    describe('after completion of the promise', () => {
      it('should call onComplete with accumulated data', async () => {
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
    });

    describe('if the promise was rejected', () => {
      it('should call onError', async () => {
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
    });

    it('should call the abort function that returned from sendRequest', () => {
      const abort = jest.fn();

      const sendRequestSpy = jest.spyOn(provider, 'sendRequest');

      sendRequestSpy.mockReturnValue({
        promise: Promise.resolve(''),
        abort,
      });

      const abortRequest = requestManager.sendRequest({ user: 'user' }, {});

      abortRequest();

      expect(abort).toHaveBeenCalledTimes(1);
    });

    it('should work correctly with no definition of callbacks', () => {
      expect(() => {
        requestManager.sendRequest({ user: 'test' }, {});
      }).not.toThrow();
    });

    it('should work correctly with partial definition of callbacks', () => {
      expect(() => {
        requestManager.sendRequest({ user: 'test' }, { onChunk: () => {} });
      }).not.toThrow();
    });

    describe('if abort is called', () => {
      it('should not forward chunks', () => {
        const onChunkSpy = jest.fn();

        let capturedParams = undefined as unknown as RequestManagerParams;

        jest.spyOn(provider, 'sendRequest').mockImplementation((params) => {
          capturedParams = params;

          return {
            promise: Promise.resolve(''),
            abort: (): void => {},
          };
        });

        const abort = requestManager.sendRequest({ user: 'test' }, { onChunk: onChunkSpy });

        abort();

        capturedParams?.onChunk?.('chunk');

        expect(onChunkSpy).not.toHaveBeenCalled();
      });

      it('should not call onComplete', async () => {
        let resolvePromise: (response: string) => void = () => {};

        const promise = new Promise<string>((resolve) => { resolvePromise = resolve; });

        jest.spyOn(provider, 'sendRequest').mockReturnValue({
          promise,
          abort: (): void => {},
        });

        const onCompleteSpy = jest.fn();
        const abort = requestManager.sendRequest({ user: 'user' }, { onComplete: onCompleteSpy });

        abort();
        resolvePromise('resolve');

        await promise;

        expect(onCompleteSpy).not.toHaveBeenCalled();
      });

      it('should not call onError', async () => {
        let rejectPromise: (e: Error) => void = () => {};

        const promise = new Promise<string>((_, reject) => { rejectPromise = reject; });

        jest.spyOn(provider, 'sendRequest').mockReturnValue({
          promise,
          abort: (): void => {},
        });

        const onErrorSpy = jest.fn();
        const abort = requestManager.sendRequest({ user: 'user' }, { onError: onErrorSpy });

        abort();
        rejectPromise(new Error('error'));

        await new Promise(process.nextTick);

        expect(onErrorSpy).not.toHaveBeenCalled();
      });
    });
  });
});
