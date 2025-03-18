import { BaseCommand } from '../core/base_command';
import type { PromptData, TemplateName } from '../core/prompt_manager';

export interface TranslateCommandParams {
  text: string;
  lang: string;
}

export class TranslateCommand extends BaseCommand {
  protected getTemplateName(): TemplateName {
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

  protected parseResult(response: string): string {
    return response;
  }
}
