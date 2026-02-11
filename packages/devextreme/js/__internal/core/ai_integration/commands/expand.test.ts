import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  ExpandCommandParams,
  ExpandCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import { ExpandCommand } from '@ts/core/ai_integration/commands';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

describe('ExpandCommand', () => {
  const params: ExpandCommandParams = { text: 'text to expansion' };

  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as ExpandCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new ExpandCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('should return the name of the corresponding template', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('expand');
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with empty object', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        user: { text: params.text },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the string without changes', () => {
      const response = 'Expanded text';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toBe(response);
    });
  });

  describe('execute', () => {
    const callbacks: RequestCallbacks<ExpandCommandResult> = { onComplete: () => {} };

    it('promptManager.buildPrompt should be called with parameters containing the passed values', () => {
      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith('expand', { user: { text: params.text } }, { applyMetaTemplates: true });
    });

    it('promptManager.buildPrompt should should return prompt with passed values', () => {
      jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'Expand the following text by adding relevant details, examples, and context while keeping the main point intact. Ensure the expanded text is coherent and logically structured. Return answer with no markdown formatting.',
        user: params.text,
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
