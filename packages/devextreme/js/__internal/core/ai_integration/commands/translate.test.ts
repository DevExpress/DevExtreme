import {
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
  TranslateCommandResult,
} from '@js/common/ai-integration';
import { TranslateCommand } from '@ts/core/ai_integration/commands/translate';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

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
    it('should return the name of the corresponding template', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('translate');
    });
  });

  describe('getBuildPromptOptions', () => {
    it('should return applyMetaTemplates: false', () => {
      // @ts-expect-error Access to protected property for a test
      const options = command.getBuildPromptOptions();

      expect(options).toEqual({ applyMetaTemplates: false });
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with text in user section and lang in system section', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        system: { lang: 'French' },
        user: { text: 'text to translate' },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the string without changes', () => {
      const response = 'Translated text';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toBe(response);
    });
  });

  describe('execute', () => {
    const callbacks: RequestCallbacks<TranslateCommandResult> = { onComplete: () => {} };

    it('promptManager.buildPrompt should be called with parameters containing the passed values', () => {
      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith('translate', {
        system: { lang: 'French' },
        user: { text: 'text to translate' },
      }, { applyMetaTemplates: false });
    });

    it('promptManager.buildPrompt should should return prompt with passed values', () => {
      jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'Translate the text provided into French. Ensure the translation retains the original meaning and tone. Provide only the translated text in your response, without any additional formatting or commentary.',
        user: 'text to translate',
      });
    });

    it('should call provider.sendRequest once and return the abort function', () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      const abort = command.execute(params, callbacks);

      expect(typeof abort).toBe('function');
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
