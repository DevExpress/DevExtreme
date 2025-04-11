import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, RequestCallbacks, SummarizeCommandParams } from '@js/common/ai-integration';
import { SummarizeCommand } from '@ts/core/ai_integration/commands';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

describe('SummarizeCommand', () => {
  const params: SummarizeCommandParams = { text: 'text to summarizing' };

  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as SummarizeCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new SummarizeCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('returns name of template correctly', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe('summarize');
    });
  });

  describe('buildPromptData', () => {
    it('forms PromptData with empty object', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toEqual({
        user: { text: params.text },
      });
    });
  });

  describe('parseResult', () => {
    it('returns the string without changes', () => {
      const response = 'Summarized text';
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
      expect(promptManager.buildPrompt).toHaveBeenCalledWith('summarize', { user: { text: params.text } });
      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: 'First, identify the key points of the provided text. Then, generate an abstractive summary by paraphrasing these points, ensuring the summary captures the core ideas and is approximately 20% of the text\'s length. Return answer with no markdown formatting.',
        user: params.text,
      });
      expect(typeof abort).toBe('function');
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
