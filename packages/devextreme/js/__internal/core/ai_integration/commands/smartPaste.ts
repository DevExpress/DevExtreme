import type { FieldInfo, SmartPasteCommandParams, SmartPasteCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class SmartPasteCommand extends BaseCommand<
  SmartPasteCommandParams,
  SmartPasteCommandResult
> {
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

  protected parseResult(response: string): SmartPasteCommandResult {
    const result = {};
    response.split(';;;').forEach((data: string) => {
      const [name, ...values] = data.split(':::');
      const value = values.length === 1 ? values[0] : values;

      if (value) {
        try {
          result[name] = value;
        } catch (e) {
          result[name] = undefined;
        }
      }
    });

    return JSON.stringify(result);
  }

  private generateFieldsInstructions(fields: FieldInfo[]): string {
    const fieldData = fields.map((field) => {
      const instruction = field.instruction ?? '';

      return `fieldName: ${field.name}, format: ${field.format}${instruction ? `, instruction: ${instruction}` : ''}`;
    });

    return fieldData.join(';;;');
  }
}
