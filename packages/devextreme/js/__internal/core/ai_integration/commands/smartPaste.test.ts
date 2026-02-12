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
  SmartPasteFieldType,
  SmartPasteResultFieldType,
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
const USER_FIELDS_WITH_INSTRUCTION = [{ name: 'description', format: 'text', instruction: 'instruction' }];
const PROCESSED_USER_FIELDS = 'fieldName: description, format: text';
const PROCESSED_USER_FIELDS_WITH_INSTRUCTION = 'fieldName: description, format: text, instruction: instruction';

describe('SmartPasteCommand', () => {
  const params: SmartPasteCommandParams = { text: USER_TEXT, fields: USER_FIELDS };
  const paramsWithInstruction: SmartPasteCommandParams = {
    text: USER_TEXT,
    fields: USER_FIELDS_WITH_INSTRUCTION,
  };
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

      expect(templateName).toStrictEqual(COMMAND_NAME);
    });
  });

  describe('buildPromptData', () => {
    it('should form PromptData with text and fields info', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(params);

      expect(promptData).toStrictEqual({
        user: { text: USER_TEXT, fields: PROCESSED_USER_FIELDS },
      });
    });

    it('should form PromptData with text and fields info including instruction', () => {
      // @ts-expect-error Access to protected property for a test
      const promptData: PromptData = command.buildPromptData(paramsWithInstruction);

      expect(promptData).toStrictEqual({
        user: { text: USER_TEXT, fields: PROCESSED_USER_FIELDS_WITH_INSTRUCTION },
      });
    });
  });

  describe('parseResult', () => {
    const fields = { fields: [{ name: 'Field1', format: 'text' }, { name: 'Field2', format: 'text' }] };

    it('should return the parsed result', () => {
      const response = 'Field1:::value1;;;Field2:::value2';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response, fields);

      const expectedResult = [{
        name: 'Field1',
        value: 'value1',
      }, {
        name: 'Field2',
        value: 'value2',
      }];

      expect(result).toStrictEqual(expectedResult);
    });

    it('should parse array values correctly', () => {
      const response = 'Field1:::value1:::value2;;;Field2:::value3:::value4:::value5';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response, fields);

      const expectedResult = [
        {
          name: 'Field1',
          value: ['value1', 'value2'],
        },
        {
          name: 'Field2',
          value: ['value3', 'value4', 'value5'],
        },
      ];

      expect(result).toStrictEqual(expectedResult);
    });

    it('should not include an empty fields into parsed result', () => {
      const response = 'Field1:::value1;;;Field2:::';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response, fields);

      const expectedResult = [{
        name: 'Field1',
        value: 'value1',
      }];

      expect(result).toStrictEqual(expectedResult);
    });

    it('should process multiple delimiters and malformed field data correctly', () => {
      const response = 'Field1:::value1;;;;;;Field2';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response, fields);

      const expectedResult = [{
        name: 'Field1',
        value: 'value1',
      }];

      expect(result).toStrictEqual(expectedResult);
    });

    it('should trim string and array values in parseResult', () => {
      const response = 'Field1:::  value1  ;;;Field2:::  value2  ::: value3 ';
      // @ts-expect-error Access to protected property for a test
      const result = command.parseResult(response, fields);

      const expectedResult = [
        { name: 'Field1', value: 'value1' },
        { name: 'Field2', value: ['value2', 'value3'] },
      ];

      expect(result).toStrictEqual(expectedResult);
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
      }, { applyMetaTemplates: true });
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

  describe('toTyped', () => {
    const callToTyped = (
      values: string[],
      type?: SmartPasteFieldType,
      fieldName?: string,
    // @ts-expect-error Access to private static method for test
    ): SmartPasteResultFieldType => SmartPasteCommand.toTyped(values, type, fieldName);

    describe('Happy Path', () => {
      it('should convert valid color', () => {
        const result = callToTyped(['#ff0000'], 'color');
        expect(result).toBe('#ff0000');
      });

      it('should convert valid boolean true', () => {
        const result = callToTyped(['true'], 'boolean');
        expect(result).toBe(true);
      });

      it('should convert valid boolean false', () => {
        const result = callToTyped(['false'], 'boolean');
        expect(result).toBe(false);
      });

      it('should convert valid string', () => {
        const result = callToTyped(['test string'], 'string');
        expect(result).toBe('test string');
      });

      it('should convert valid string array', () => {
        const result = callToTyped(['item1', 'item2', 'item3'], 'stringArray');
        expect(result).toEqual(['item1', 'item2', 'item3']);
      });

      it('should convert valid number', () => {
        const result = callToTyped(['42.5'], 'number');
        expect(result).toBe(42.5);
      });

      it('should convert valid number range', () => {
        const result = callToTyped(['10', '20'], 'numberRange');
        expect(result).toEqual([10, 20]);
      });

      it('should convert valid date', () => {
        const result = callToTyped(['2024-01-15'], 'date');
        expect(result).toEqual(new Date('2024-01-15'));
      });

      it('should convert valid date range', () => {
        const result = callToTyped(['2024-01-15', '2024-01-20'], 'dateRange');
        expect(result).toEqual([new Date('2024-01-15'), new Date('2024-01-20')]);
      });
    });

    describe('Empty results', () => {
      it.each<SmartPasteFieldType>([
        'string',
        'stringArray',
        'color',
        'boolean',
        'number',
        'numberRange',
        'date',
        'dateRange',
      ])('should not throw for empty array when type=%s', (type) => {
        expect(() => callToTyped([], type, 'testField')).not.toThrow();
        expect(() => callToTyped([''], type, 'testField')).not.toThrow();
        expect(callToTyped([], type, 'testField')).toBeUndefined();
        expect(callToTyped([''], type, 'testField')).toBeUndefined();
      });

      it('should not throw for empty array when type is undefined', () => {
        expect(() => callToTyped([], undefined, 'testField')).not.toThrow();
      });
    });

    describe('Default values', () => {
      it('should return default for undefined type with single value', () => {
        const result = callToTyped(['single value']);
        expect(result).toBe('single value');
      });

      it('should return default for undefined type with multiple values', () => {
        const result = callToTyped(['value1', 'value2', 'value3']);
        expect(result).toEqual(['value1', 'value2', 'value3']);
      });

      it('should return single value when single item in array for default type', () => {
        const result = callToTyped(['single']);
        expect(result).toBe('single');
      });
    });

    describe('Exception handling', () => {
      function buildErrorRegExp(value: unknown, field: string, type: string): RegExp {
        function escapeRegExp(str: string): string {
          return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        return new RegExp(
          `E1064.*${
            escapeRegExp(JSON.stringify(value))
          }.*${
            escapeRegExp(field)
          }.*${
            escapeRegExp(type)
          }.*`,
        );
      }

      const field = 'testField';
      it('should throw error for invalid color', () => {
        const value = ['invalid-color'];
        expect(() => callToTyped(value, 'color', field))
          .toThrow(buildErrorRegExp(value, field, 'color'));
      });

      it('should throw error for invalid boolean', () => {
        const value = ['not-a-boolean'];
        expect(() => callToTyped(value, 'boolean', field))
          .toThrow(buildErrorRegExp(value, field, 'boolean'));
      });

      it('should throw error for invalid number', () => {
        const value = ['not-a-number'];
        expect(() => callToTyped(value, 'number', field))
          .toThrow(buildErrorRegExp(value, field, 'number'));
      });

      it('should throw error when number range has single value', () => {
        const value = ['10'];
        expect(() => callToTyped(value, 'numberRange', field))
          .toThrow(buildErrorRegExp(value, field, 'number range'));
      });

      it('should throw error when number range has more than 2 values', () => {
        const value = ['10', '20', '30'];
        expect(() => callToTyped(value, 'numberRange', field))
          .toThrow(buildErrorRegExp(value, field, 'number range'));
      });

      it('should throw error when number range has invalid numbers', () => {
        const value = ['10', 'invalid'];
        expect(() => callToTyped(value, 'numberRange', field))
          .toThrow(buildErrorRegExp(value, field, 'number range'));
      });

      it('should throw error for invalid date', () => {
        const value = ['invalid-date'];
        expect(() => callToTyped(value, 'date', field))
          .toThrow(buildErrorRegExp(value, field, 'date'));
      });

      it('should throw error when date range has single value', () => {
        const value = ['2024-01-15'];
        expect(() => callToTyped(value, 'dateRange', field))
          .toThrow(buildErrorRegExp(value, field, 'date range'));
      });

      it('should throw error when date range has more than 2 values', () => {
        const value = ['2024-01-15', '2024-01-20', '2024-01-25'];
        expect(() => callToTyped(value, 'dateRange', field))
          .toThrow(buildErrorRegExp(value, field, 'date range'));
      });

      it('should throw error when date range has invalid dates', () => {
        const value = ['2024-01-15', 'invalid-date'];
        expect(() => callToTyped(value, 'dateRange', field))
          .toThrow(buildErrorRegExp(value, field, 'date range'));
      });
    });
  });
});
