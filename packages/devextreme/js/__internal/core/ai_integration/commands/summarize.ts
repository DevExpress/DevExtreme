import type { SummarizeCommandParams, SummarizeCommandResult } from '@js/ai_integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class SummarizeCommand extends BaseCommand<SummarizeCommandParams, SummarizeCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'summarize';
  }

  protected buildPromptData(params: SummarizeCommandParams): PromptData {
    return {
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): SummarizeCommandResult {
    return response;
  }
}
