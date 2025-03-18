import type { ShortenCommandParams, ShortenCommandResult } from '@js/ai_integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ShortenCommand extends BaseCommand<ShortenCommandParams, ShortenCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'shorten';
  }

  protected buildPromptData(params: ShortenCommandParams): PromptData {
    return {
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): ShortenCommandResult {
    return response;
  }
}
