import type { TranslateCommandParams, TranslateCommandResult } from '@js/ai_integration';
import { BaseCommand } from '@ts/core/ai/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';

export class TranslateCommand extends BaseCommand<TranslateCommandParams, TranslateCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'translate';
  }

  protected buildPromptData(params: TranslateCommandParams): PromptData {
    return {
      user: {
        text: params.text,
        lang: params.lang,
      },
      system: {
        lang: params.lang,
      },
    };
  }

  protected parseResult(response: string): TranslateCommandResult {
    return response;
  }
}
