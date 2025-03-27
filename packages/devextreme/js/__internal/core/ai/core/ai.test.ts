import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AI as IAI,
  AIProvider,
  RequestCallbacks,
  ResponseParams,
  TranslateCommandParams,
} from '@js/ai/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { AI } from '@ts/core/ai/core/ai';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';

describe('AI', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let provider: AIProvider;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let ai: IAI;

  beforeEach(() => {
    provider = {
      sendRequest: (): ResponseParams => ({
        promise: Promise.resolve(),
        abort: (): void => {},
      }),
    };

    ai = new AI(provider);
  });

  describe('constructor', () => {
    it('creates and stores PromptManager and RequestManager', () => {
      // @ts-expect-error
      expect(ai.promptManager).toBeInstanceOf(PromptManager);
      // @ts-expect-error
      expect(ai.requestManager).toBeInstanceOf(RequestManager);
    });
  });

  describe('translate', () => {
    it('calls execute with TranslateCommand correctly', () => {
      const params: TranslateCommandParams = { text: 'Hello', lang: 'French' };
      const callbacks: RequestCallbacks = {
        onComplete: () => {},
        onChunk: () => {},
        onError: () => {},
      };

      const executeSpy = jest.spyOn(TranslateCommand.prototype, 'execute');

      ai.translate(params, callbacks);

      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(executeSpy).toHaveBeenCalledWith(params, callbacks);
    });

    it('returns the abort function received from the command', () => {
      const abort = (): void => {};

      jest
        // @ts-expect-error
        .spyOn(ai.requestManager, 'sendRequest')
        .mockImplementation(() => abort);

      const abortRequest = ai.translate({} as TranslateCommandParams, {});

      expect(abortRequest).toBe(abort);
    });
  });
});
