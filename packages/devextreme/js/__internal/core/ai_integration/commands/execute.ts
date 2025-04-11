import type { ExecuteCommandParams, ExecuteCommandResult } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ExecuteCommand extends BaseCommand<
  ExecuteCommandParams,
  ExecuteCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'execute';
  }

  protected buildPromptData(params: ExecuteCommandParams): PromptData {
    return {
      user: {
        text: params.text,
      },
    };
  }

  protected parseResult(response: string): ExecuteCommandResult {
    return response;
  }
}
