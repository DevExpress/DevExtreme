import type {
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResponse,
  ExecuteGridAssistantCommandResult,
} from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

export class ExecuteGridAssistantCommand extends BaseCommand<
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResult
> {
  protected getTemplateName(): PromptTemplateName {
    return 'executeGridAssistant';
  }

  protected buildPromptData(params: ExecuteGridAssistantCommandParams): PromptData {
    return {
      user: {
        text: params.text,
        context: JSON.stringify(params.context),
      },
    };
  }

  protected parseResult(
    response: ExecuteGridAssistantCommandResponse,
  ): ExecuteGridAssistantCommandResult {
    if (typeof response === 'string') {
      if (response === '') {
        return { actions: [] };
      }
      return JSON.parse(response) as ExecuteGridAssistantCommandResult;
    }

    const actions = typeof response.actions === 'string'
      ? JSON.parse(response.actions)
      : response.actions;

    return { actions };
  }
}
