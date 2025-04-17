import type { ChangeToneCommandParams, ChangeToneCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ChangeToneCommand extends BaseCommand<
  ChangeToneCommandParams,
  ChangeToneCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'changeTone';
  }

  protected buildPromptData(params: ChangeToneCommandParams): PromptData {
    return {
      system: { tone: params.tone },
      user: { text: params.text },
    };
  }

  protected parseResult(response: string): ChangeToneCommandResult {
    return response;
  }
}
