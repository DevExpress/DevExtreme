import { BaseCommand } from '@ts/core/ai/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import type { TranslateResult } from '@ts/core/ai-types';

export interface TranslateCommandParams {
  text: string;
  lang: string;
}

export class TranslateCommand extends BaseCommand {
  protected getTemplateName(): PromptTemplateName {
    return 'translate';
  }

  protected buildPromptData(params: TranslateCommandParams): PromptData {
    return {
      user: {
        text: params.text,
        lang: params.lang,
      },
    };
  }

  protected parseResult(response: string): TranslateResult {
    return response;
  }
}
