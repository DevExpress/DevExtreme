import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  ChangeToneCommandParams,
  ChangeToneCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import { ChangeToneCommand } from '@ts/core/ai_integration/commands';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

describe('ChangeToneCommand', () => {
  const params: ChangeToneCommandParams = {
    text: 'text to tone change',
    tone: 'friendly',
  };

  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as ChangeToneCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new ChangeToneCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('should return name of template correctly', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('changeTone');
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with empty object', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        system: { tone: params.tone },
        user: { text: params.text },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the string without changes', () => {
      const response = 'Shorten text';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toBe(response);
    });
  });

  describe('execute', () => {
    it('should call promptManager.buildPrompt correctly and return the abort function', () => {
      const callbacks: RequestCallbacks<ChangeToneCommandResult> = { onComplete: () => {} };

      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      const abort = command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith('changeTone', {
        system: { tone: params.tone },
        user: { text: params.text },
      });
      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'Rewrite the following text to keep its original meaning but change its tone to friendly. Provide only the rewritten text as plain text without any comments or formatting.',
        user: params.text,
      });
      expect(typeof abort).toBe('function');
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
