import type { ExpandCommandParams, ExpandCommandResult } from '@js/ai_integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ExpandCommand extends BaseCommand<ExpandCommandParams, ExpandCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'expand';
  }

  protected buildPromptData(params: ExpandCommandParams): PromptData {
    return {
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): ExpandCommandResult {
    return response;
  }
}
