import Color from '@js/color';
import type {
  FieldInfo,
  SmartPasteCommandParams,
  SmartPasteCommandResult,
  SmartPasteFieldType,
  SmartPasteResultFieldType,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';
import { dateUtilsTs } from '@ts/core/utils/date';

export class SmartPasteCommand extends BaseCommand<
  SmartPasteCommandParams,
  SmartPasteCommandResult
> {
  private static toTyped(
    values: string[],
    desiredType?: SmartPasteFieldType,
    fieldName?: string,
  ): SmartPasteResultFieldType | undefined {
    const errorValue = JSON.stringify(values);

    const single = values.length <= 1 ? values[0] : undefined;
    const arr = values.length > 1 ? values : undefined;

    if (!single && !arr) {
      return undefined;
    }

    switch (desiredType) {
      case 'color': {
        if (new Color(single).colorIsInvalid) {
          throw errors.Error('E1064', fieldName, errorValue, 'color');
        }
        return single;
      }
      case 'boolean': {
        if (single === 'true') return true;
        if (single === 'false') return false;
        throw errors.Error('E1064', fieldName, errorValue, 'boolean');
      }
      case 'string': {
        return single;
      }
      case 'stringArray': {
        return arr;
      }
      case 'number': {
        if (single === undefined || !Number.isFinite(parseFloat(single))) {
          throw errors.Error('E1064', fieldName, errorValue, 'number');
        }
        return parseFloat(single);
      }
      case 'numberRange': {
        if (!arr || arr.length > 2) {
          throw errors.Error('E1064', fieldName, errorValue, 'number range');
        }
        const numbers = arr.map((v) => parseFloat(v));
        if (!numbers.every(Number.isFinite)) {
          throw errors.Error('E1064', fieldName, errorValue, 'number range');
        }
        return [numbers[0], numbers[1]];
      }
      case 'date': {
        if (!dateUtilsTs.isValidDate(single)) {
          throw errors.Error('E1064', fieldName, errorValue, 'date');
        }
        return new Date(single);
      }
      case 'dateRange': {
        if (!arr || arr.length > 2 || !arr.every(dateUtilsTs.isValidDate)) {
          throw errors.Error('E1064', fieldName, errorValue, 'date range');
        }
        return arr.map((v) => new Date(v));
      }
      default:
        return arr ?? single;
    }
  }

  protected getTemplateName(): PromptTemplateName {
    return 'smartPaste';
  }

  protected buildPromptData(params: SmartPasteCommandParams): PromptData {
    const fieldsInstructions = this.generateFieldsInstructions(params.fields);
    return {
      user: {
        text: params.text,
        fields: fieldsInstructions,
      },
    };
  }

  protected parseResult(
    response: string,
    params: SmartPasteCommandParams,
  ): SmartPasteCommandResult {
    const result: SmartPasteCommandResult = [];

    response.split(';;;').forEach((data: string) => {
      if (!data) {
        return;
      }

      const [name, ...rawValues] = data.split(':::');
      const values = rawValues.map((value) => value.trim());
      const fieldParams = params.fields.find((v) => v.name === name);
      const value = SmartPasteCommand.toTyped(
        values,
        fieldParams?.type,
        fieldParams?.name,
      );

      if (value) {
        result.push({
          name,
          value,
        });
      }
    });

    return result;
  }

  private generateFieldsInstructions(fields: FieldInfo[]): string {
    const fieldData = fields.map((field) => {
      const instruction = field.instruction ?? '';

      return `fieldName: ${field.name}, format: ${field.format}${instruction ? `, instruction: ${instruction}` : ''}`;
    });

    return fieldData.join(';;;');
  }
}
