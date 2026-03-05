import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  GenerateGridColumnCommandParams,
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { templates } from '@ts/core/ai_integration/templates';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

import { GenerateGridColumnCommand } from './generateGridColumn';

const COMMAND_NAME = 'generateGridColumn';
const USER_TEXT = 'user text';
const PROCESSED_DATA = '{"1":{"id":1,"name":"Test 1"},"2":{"id":2,"name":"Test 2"}}';

describe('GenerateGridColumnCommand', () => {
  const params: GenerateGridColumnCommandParams = {
    text: USER_TEXT,
    data: {
      1: { id: 1, name: 'Test 1' },
      2: { id: 2, name: 'Test 2' },
    },
  };
  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as GenerateGridColumnCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new GenerateGridColumnCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('should return the name of the corresponding template', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toStrictEqual(COMMAND_NAME);
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with text and fields info', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toStrictEqual({
        user: {
          text: USER_TEXT,
          data: PROCESSED_DATA,
        },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the parsed result', () => {
      const response = '{ "1": "Item with the name Item 1.", "10": "Item with the name Item 10." }';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        data: {
          1: 'Item with the name Item 1.',
          10: 'Item with the name Item 10.',
        },
      };

      expect(result).toStrictEqual(expectedResult);
    });

    it('should return empty data object when response is an empty string', () => {
      const response = '';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        data: {},
      };

      expect(result).toStrictEqual(expectedResult);
    });

    it('should parse result when response data is a stringified object', () => {
      const response = {
        data: '{ "1": "Item with the name Item 1.", "10": "Item with the name Item 10." }',
      };
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        data: {
          1: 'Item with the name Item 1.',
          10: 'Item with the name Item 10.',
        },
      };

      expect(result).toStrictEqual(expectedResult);
    });

    it('should not parse result when response data is an object', () => {
      const response = {
        data: {
          1: 'Item with the name Item 1.',
          10: 'Item with the name Item 10.',
        },
      };
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      expect(result).toStrictEqual(response);
    });
  });

  describe('execute', () => {
    const callbacks: RequestCallbacks<GenerateGridColumnCommandResult> = { onComplete: () => {} };

    it('promptManager.buildPrompt should be called with the passed data', () => {
      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith(COMMAND_NAME, {
        user: {
          text: USER_TEXT,
          data: PROCESSED_DATA,
        },
      }, { applyMetaTemplates: true });
    });

    it('promptManager.buildPrompt should should return prompt with passed values', () => {
      jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      const expectedUserPrompt = templates.generateGridColumn.user?.replace('{{text}}', USER_TEXT)
        .replace('{{data}}', PROCESSED_DATA);

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: templates.generateGridColumn.system,
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
