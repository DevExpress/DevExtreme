import type { ProofreadCommandParams, ProofreadCommandResult } from '@js/ai_integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ProofreadCommand extends BaseCommand<ProofreadCommandParams, ProofreadCommandResult> {
  protected getTemplateName(): PromptTemplateName {
    return 'proofread';
  }

  protected buildPromptData(params: ProofreadCommandParams): PromptData {
    return {
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): ProofreadCommandResult {
    return response;
  }
}
