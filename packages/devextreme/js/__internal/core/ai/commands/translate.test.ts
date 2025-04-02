import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, RequestCallbacks, TranslateCommandParams } from '@js/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import type { PromptData } from '@ts/core/ai/core/prompt_manager';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';
import { Provider } from '@ts/core/ai/test_utils/provider_mock';

describe('TranslateCommand', () => {
  const params: TranslateCommandParams = { text: 'text to translate', lang: 'French' };
  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as TranslateCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new TranslateCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('returns name of template correctly', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('translate');
    });
  });

  describe('buildPromptData', () => {
    it('forms PromptData with text and lang in user-section', () => {
      // @ts-expect-error Access to protected property for a test
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
      // @ts-expect-error Access to protected property for a test
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
  });
});
