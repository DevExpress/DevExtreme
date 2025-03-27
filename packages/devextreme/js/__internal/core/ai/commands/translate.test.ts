import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Prompt, RequestCallbacks, TranslateCommandParams } from '@js/ai/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import type { PromptData, PromptManager } from '@ts/core/ai/core/prompt_manager';
import type { RequestManager } from '@ts/core/ai/core/request_manager';

describe('TranslateCommand', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let promptManager: PromptManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let requestManager: RequestManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let command: TranslateCommand;

  beforeEach(() => {
    promptManager = {
      buildPrompt: jest.fn(() => ({
        system: 'system prompt',
        user: 'user prompt',
      })),
    } as unknown as PromptManager;

    requestManager = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sendRequest: jest.fn((prompt: Prompt, callbacks: RequestCallbacks) => (): void => {}),
    } as unknown as RequestManager;

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
      const params: TranslateCommandParams = {
        text: 'Hello world',
        lang: 'French',
      };

      // @ts-expect-error
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        user: {
          text: 'Hello world',
          lang: 'French',
        },
        system: {
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
      const params: TranslateCommandParams = { text: 'text to translate', lang: 'French' };
      const callbacks: RequestCallbacks = { onComplete: () => {} };

      const abort = command.execute(params, callbacks);

      expect(promptManager.buildPrompt).toHaveBeenCalledTimes(1);

      expect(promptManager.buildPrompt).toHaveBeenCalledWith('translate', {
        user: { text: 'text to translate', lang: 'French' },
        system: { lang: 'French' },
      });

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        user: 'user prompt',
        system: 'system prompt',
      });

      expect(typeof abort).toBe('function');
      expect(requestManager.sendRequest).toHaveBeenCalledTimes(1);
    });

    it('pulls onChunk callback when getting a chunk', () => {
      const callbacks: RequestCallbacks = { onChunk: jest.fn() };

      command.execute({ text: 'text to translate', lang: 'French' }, callbacks);

      const sendRequestParams = (requestManager.sendRequest as jest.Mock).mock.calls[0];
      const sendRequestCallbacks = sendRequestParams[1] as RequestCallbacks;

      sendRequestCallbacks.onChunk?.('chunk');

      expect(callbacks.onChunk).toHaveBeenCalledWith('chunk');
    });

    it('calls onComplete callback, passing the result of parseResult to it', () => {
      const callbacks: RequestCallbacks = { onComplete: jest.fn() };
      // @ts-expect-error
      const spy = jest.spyOn(command, 'parseResult');

      command.execute({ text: 'text to translate', lang: 'French' }, callbacks);

      const sendRequestParams = (requestManager.sendRequest as jest.Mock).mock.calls[0];
      const sendRequestCallbacks = sendRequestParams[1] as RequestCallbacks;

      sendRequestCallbacks.onComplete?.('AI response');

      expect(spy).toHaveBeenCalledWith('AI response');
      expect(callbacks.onComplete).toHaveBeenCalledWith('AI response');
    });

    it('calls onError callback when an error occurs', () => {
      const callbacks: RequestCallbacks = { onError: jest.fn() };

      command.execute({ text: 'text to translate', lang: 'French' }, callbacks);

      const sendRequestParams = (requestManager.sendRequest as jest.Mock).mock.calls[0];
      const sendRequestCallbacks = sendRequestParams[1] as RequestCallbacks;

      const error = new Error('Test error');

      sendRequestCallbacks.onError?.(error);

      expect(callbacks.onError).toHaveBeenCalledWith(error);
    });
  });
});
