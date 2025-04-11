import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, ChangeStyleCommandParams, RequestCallbacks } from '@js/common/ai-integration';
import { ChangeStyleCommand } from '@ts/core/ai_integration/commands';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

describe('ChangeStyleCommand', () => {
  const params: ChangeStyleCommandParams = {
    text: 'text to style change',
    writingStyle: 'creative',
  };

  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as ChangeStyleCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new ChangeStyleCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('returns name of template correctly', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('changeStyle');
    });
  });

  describe('buildPromptData', () => {
    it('forms PromptData with empty object', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        system: { writingStyle: params.writingStyle },
        user: { text: params.text },
      });
    });
  });

  describe('parseResult', () => {
    it('returns the string without changes', () => {
      const response = 'Shorten text';
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
      expect(promptManager.buildPrompt).toHaveBeenCalledWith('changeStyle', {
        system: { writingStyle: params.writingStyle },
        user: { text: params.text },
      });
      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'Rewrite the text provided to match the creative writing style. Ensure the rewritten text follows the grammatical rules and stylistic conventions of the specified style. Preserve the original meaning and context. Use complete sentences and a professional tone. Return answer with no markdown formatting.',
        user: params.text,
      });
      expect(typeof abort).toBe('function');
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
