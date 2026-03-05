import type { TranslateCommandParams, TranslateCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { BuildPromptOptions, PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class TranslateCommand extends BaseCommand<TranslateCommandParams, TranslateCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'translate';
  }

  protected getBuildPromptOptions(): BuildPromptOptions {
    return {
      applyMetaTemplates: false,
    };
  }

  protected buildPromptData(params: TranslateCommandParams): PromptData {
    return {
      system: {
        lang: params.lang,
      },
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): TranslateCommandResult {
    return response;
  }
}
