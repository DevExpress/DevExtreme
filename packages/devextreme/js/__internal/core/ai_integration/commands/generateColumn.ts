import type { GenerateColumnCommandParams, GenerateColumnCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class GenerateColumnCommand extends BaseCommand<
  GenerateColumnCommandParams,
  GenerateColumnCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'generateColumn';
  }

  protected buildPromptData(params: GenerateColumnCommandParams): PromptData {
    const dataDescription = this.generateDataDescription(params.data);
    return {
      user: {
        text: params.text,
        data: dataDescription,
      },
    };
  }

  protected parseResult(response: string): GenerateColumnCommandResult {
    let result: GenerateColumnCommandResult = {};
    result = JSON.parse(response);
    return result;
  }

  private generateDataDescription(data: Record<PropertyKey, unknown>): string {
    const result = JSON.stringify(data);
    return result;
  }
}
