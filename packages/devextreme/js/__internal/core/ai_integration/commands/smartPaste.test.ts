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
  SmartPasteCommandParams,
  SmartPasteCommandResult,
} from '@js/common/ai-integration';
import { SmartPasteCommand } from '@ts/core/ai_integration/commands/smartPaste';
import type { PromptData } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { templates } from '@ts/core/ai_integration/templates';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

const COMMAND_NAME = 'smartPaste';
const USER_TEXT = 'text to paste';
const USER_FIELDS = [{ name: 'description', format: 'text' }];
const PROCESSED_USER_FIELDS = 'fieldName: description, format: text';

describe('SmartPasteCommand', () => {
  const params: SmartPasteCommandParams = { text: USER_TEXT, fields: USER_FIELDS };
  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as SmartPasteCommand;

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new SmartPasteCommand(promptManager, requestManager);
  });

  describe('getTemplateName', () => {
    it('should return the name of the corresponding template', () => {
      // @ts-expect-error Access to protected property for a test
      const templateName = command.getTemplateName();

      expect(templateName).toBe(COMMAND_NAME);
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with text and fields info', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);
      // @ts-expect-error Access to private property for a test
      const fieldsInfo = command.generateFieldsInstructions(params.fields);

      expect(promptData).toEqual({
        user: { text: USER_TEXT, fields: fieldsInfo },
      });
    });
  });

  describe('parseResult', () => {
    it('should return the parsed result', () => {
      const response = 'Field1:::value1;;;Field2:::value2';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        Field1: 'value1',
        Field2: 'value2',
      };

      expect(JSON.parse(result)).toStrictEqual(expectedResult);
    });

    it('should not include an empty fields into parsed result', () => {
      const response = 'Field1:::value1;;;Field2:::';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response);

      const expectedResult = {
        Field1: 'value1',
      };

      expect(JSON.parse(result)).toStrictEqual(expectedResult);
    });
  });

  describe('execute', () => {
    const callbacks: RequestCallbacks<SmartPasteCommandResult> = { onComplete: () => {} };

    it('promptManager.buildPrompt should be called with parameters containing the passed values', () => {
      const buildPromptSpy = jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      expect(buildPromptSpy).toHaveBeenCalledTimes(1);
      expect(promptManager.buildPrompt).toHaveBeenCalledWith(COMMAND_NAME, {
        user: { text: USER_TEXT, fields: PROCESSED_USER_FIELDS },
      });
    });

    it('promptManager.buildPrompt should should return prompt with passed values', () => {
      jest.spyOn(promptManager, 'buildPrompt');

      command.execute(params, callbacks);

      const expectedUserPrompt = templates.smartPaste.user?.replace('{{text}}', USER_TEXT)
        .replace('{{fields}}', PROCESSED_USER_FIELDS);

      expect(promptManager.buildPrompt).toHaveReturnedWith({
        system: templates.smartPaste.system,
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
