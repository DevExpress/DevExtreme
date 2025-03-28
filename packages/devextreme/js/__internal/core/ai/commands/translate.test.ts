import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, RequestCallbacks, TranslateCommandParams } from '@js/ai/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import type { PromptData } from '@ts/core/ai/core/prompt_manager';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';
import { Provider } from '@ts/core/ai/testUtils/provider_mock';

describe('TranslateCommand', () => {
  const params: TranslateCommandParams = { text: 'text to translate', lang: 'French' };
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let promptManager: PromptManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let requestManager: RequestManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let command: TranslateCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new TranslateCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('returns name of template correctly', () => {
      // @ts-expect-error
      const templateName = command.getTemplateName();

      expect(templateName).toBe('translate');
    });
  });

  describe('buildPromptData', () => {
    it('forms PromptData with text and lang in user-section', () => {
      // @ts-expect-error
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        system: {
          lang: 'French',
        },
        user: {
          text: 'text to translate',
          lang: 'French',
        },
      });
    });
  });

  describe('parseResult', () => {
    it('returns the string without changes', () => {
      const response = 'Translated text';
      // @ts-expect-error
      const result = command.parseResult(response);

      expect(result).toBe(response);
    });
  });

  describe('execute', () => {
    it('correctly calls promptManager.buildPrompt and returns the abort function', () => {
      const callbacks: RequestCallbacks = { onComplete: () => {} };

      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      const abort = command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);

      expect(promptManager.buildPrompt).toHaveBeenCalledWith('translate', {
        system: { lang: 'French' },
        user: { text: 'text to translate', lang: 'French' },
      });

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'You are a translation assistant, who speaks French at a native level.',
        user: 'Translate "text to translate" to French language.',
      });

      expect(typeof abort).toBe('function');
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('pulls onChunk callback when getting a chunk', () => {
      const callbacks: RequestCallbacks = { onChunk: jest.fn() };
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      command.execute(params, callbacks);

      const sendRequestCallbacks = sendRequestSpy.mock.calls[0][1];

      sendRequestCallbacks.onChunk?.('chunk');

      expect(callbacks.onChunk).toHaveBeenCalledWith('chunk');
    });

    it('calls onComplete callback, passing the result of parseResult to it', () => {
      const callbacks: RequestCallbacks = { onComplete: jest.fn() };

      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      // @ts-expect-error
      const parseResultSpy = jest.spyOn(command, 'parseResult');

      command.execute(params, callbacks);

      const sendRequestCallbacks = sendRequestSpy.mock.calls[0][1];

      sendRequestCallbacks.onComplete?.('AI response');

      expect(parseResultSpy).toHaveBeenCalledWith('AI response');
      expect(callbacks.onComplete).toHaveBeenCalledWith('AI response');
    });

    it('calls onError callback when an error occurs', () => {
      const callbacks: RequestCallbacks = { onError: jest.fn() };
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      command.execute(params, callbacks);

      const sendRequestCallbacks = sendRequestSpy.mock.calls[0][1];
      const error = new Error('Test error');

      sendRequestCallbacks.onError?.(error);

      expect(callbacks.onError).toHaveBeenCalledWith(error);
    });
  });
});
