import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { templates } from '@ts/core/ai_integration/templates';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

import { ExecuteGridAssistantCommand } from './executeGridAssistant';

const COMMAND_NAME = 'executeGridAssistant';
const USER_TEXT = 'Sort by name ascending';
const CONTEXT = { columns: ['id', 'name', 'value'], pageSize: 10 };
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    actions: { type: 'array' },
  },
};
const PROCESSED_CONTEXT = JSON.stringify(CONTEXT);

describe('ExecuteGridAssistantCommand', () => {
  const params: ExecuteGridAssistantCommandParams = {
    text: USER_TEXT,
    context: CONTEXT,
    responseSchema: RESPONSE_SCHEMA,
  };
  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as ExecuteGridAssistantCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new ExecuteGridAssistantCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('should return the name of the corresponding template', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toStrictEqual(COMMAND_NAME);
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with text and context', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toStrictEqual({
        user: {
          text: USER_TEXT,
          context: PROCESSED_CONTEXT,
        },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the parsed result from a JSON string', () => {
      const response = '{"actions":[{"name":"sort","args":{"columnName":"name","sortOrder":"asc"}}]}';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        actions: [{ name: 'sort', args: { columnName: 'name', sortOrder: 'asc' } }],
      };

      expect(result).toStrictEqual(expectedResult);
    });

    it('should return empty actions when response is an empty string', () => {
      const response = '';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toStrictEqual({
        actions: [],
      });
    });

    it('should return the response object as-is when actions is an array', () => {
      const response = {
        actions: [{ name: 'sort', args: { columnName: 'id', sortOrder: 'desc' } }],
      };
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toStrictEqual({
        actions: [{ name: 'sort', args: { columnName: 'id', sortOrder: 'desc' } }],
      });
    });

    it('should parse actions when response actions is a stringified array', () => {
      const response = {
        actions: '[{"name":"sort","args":{"columnName":"name","sortOrder":"asc"}}]',
      };
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toStrictEqual({
        actions: [{ name: 'sort', args: { columnName: 'name', sortOrder: 'asc' } }],
      });
    });

    it('should convert AIDate strings to Date objects in string response', () => {
      const response = '{"actions":[{"name":"filterValue","args":{"expression":{"field":"SaleDate","operator":"=","value":"AIDate(2024, 5, 10)"}}}]}';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const { args } = result.actions[0];
      const expression = args.expression as Record<string, unknown>;
      expect(expression.value).toBeInstanceOf(Date);
      expect(expression.value).toStrictEqual(new Date(2024, 4, 10));
    });

    it('should convert AIDate strings to Date objects in stringified actions', () => {
      const response = {
        actions: '[{"name":"filterValue","args":{"expression":{"field":"SaleDate","operator":"=","value":"AIDate(2024, 12, 1)"}}}]',
      };
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const { args } = result.actions[0];
      const expression = args.expression as Record<string, unknown>;
      expect(expression.value).toBeInstanceOf(Date);
      expect(expression.value).toStrictEqual(new Date(2024, 11, 1));
    });
  });

  describe('execute', () => {
    const callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = { onComplete: () => {} };

    it('promptManager.buildPrompt should be called with the passed data', () => {
      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith(COMMAND_NAME, {
        user: {
          text: USER_TEXT,
          context: PROCESSED_CONTEXT,
        },
      }, { applyMetaTemplates: true });
    });

    it('promptManager.buildPrompt should return prompt with passed values', () => {
      jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      const expectedUserPrompt = templates.executeGridAssistant.user
        ?.replace('{{text}}', USER_TEXT)
        .replace('{{context}}', PROCESSED_CONTEXT);

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: templates.executeGridAssistant.system,
        user: expectedUserPrompt,
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
