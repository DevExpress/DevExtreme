import type { GenerateGridColumnCommandParams, GenerateGridColumnCommandResponse, GenerateGridColumnCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class GenerateGridColumnCommand extends BaseCommand<
  GenerateGridColumnCommandParams,
  GenerateGridColumnCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'generateGridColumn';
  }

  protected buildPromptData(params: GenerateGridColumnCommandParams): PromptData {
    const dataDescription = this.generateDataDescription(params.data);
    return {
      user: {
        text: params.text,
        data: dataDescription,
      },
    };
  }

  protected parseResult(
    response: GenerateGridColumnCommandResponse,
  ): GenerateGridColumnCommandResult {
    if (typeof response === 'string') {
      return {
        data: JSON.parse(response),
      };
    }

    const data = typeof response.data === 'string'
      ? JSON.parse(response.data)
      : response.data;

    return {
      data,
    };
  }

  private generateDataDescription(data: Record<PropertyKey, unknown>): string {
    const result = JSON.stringify(data);
    return result;
  }
}
