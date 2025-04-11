import type { ChangeStyleCommandParams, ChangeStyleCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ChangeStyleCommand extends BaseCommand<
  ChangeStyleCommandParams,
  ChangeStyleCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'changeStyle';
  }

  protected buildPromptData(params: ChangeStyleCommandParams): PromptData {
    return {
      system: { writingStyle: params.writingStyle },
      user: { text: params.text },
    };
  }

  protected parseResult(response: string): ChangeStyleCommandResult {
    return response;
  }
}
