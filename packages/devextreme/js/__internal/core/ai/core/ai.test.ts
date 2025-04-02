import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  RequestCallbacks,
  TranslateCommandParams,
} from '@js/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { AI, CommandNames } from '@ts/core/ai/core/ai';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';
import { Provider } from '@ts/core/ai/test_utils/provider_mock';

describe('AI', () => {
  const params: TranslateCommandParams = { text: 'text for translation', lang: 'French' };
  const params2: TranslateCommandParams = { text: 'text for translation 2', lang: 'Spanish' };

  let provider = null as unknown as AIProvider;
  let ai = null as unknown as AI;

  beforeEach(() => {
    provider = new Provider();
    ai = new AI(provider);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('creates and stores PromptManager and RequestManager', () => {
      // @ts-expect-error Access to protected property for a test
      expect(ai.promptManager).toBeInstanceOf(PromptManager);
      // @ts-expect-error Access to protected property for a test
      expect(ai.requestManager).toBeInstanceOf(RequestManager);
    });
  });

  describe('translate', () => {
    it('calls execute with TranslateCommand correctly', () => {
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
        // @ts-expect-error Access to protected property for a test
        .spyOn(ai.requestManager, 'sendRequest')
        .mockImplementation(() => abort);

      const abortRequest = ai.translate(params, {});

      expect(abortRequest).toBe(abort);
    });

    it('reuses the same command instance for multiple translate calls', () => {
      const callbacks: RequestCallbacks = {};
      const executeSpy = jest.spyOn(TranslateCommand.prototype, 'execute');

      ai.translate(params, callbacks);

      // @ts-expect-error Access to protected property for a test
      const commandsMap = ai.commands;
      const translateCommand = commandsMap.get(CommandNames.Translate);

      expect(commandsMap.size).toBe(1);
      expect(translateCommand).toBeInstanceOf(TranslateCommand);

      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(executeSpy).toHaveBeenCalledWith(params, callbacks);

      ai.translate(params2, callbacks);

      expect(commandsMap.size).toBe(1);
      expect(commandsMap.get(CommandNames.Translate)).toBe(translateCommand);

      expect(executeSpy).toHaveBeenCalledTimes(2);
      expect(executeSpy).toHaveBeenLastCalledWith(params2, callbacks);
    });
  });
});
