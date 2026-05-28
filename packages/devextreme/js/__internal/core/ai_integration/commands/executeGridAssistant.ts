import type {
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResponse,
  ExecuteGridAssistantCommandResult,
} from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';

/**
 * Matches "AIDate(year, month, day)" format used by the filtering command.
 * All components are 1-based.
 */
const AI_DATE_REGEX = /^AIDate\((\d+),\s*(\d+),\s*(\d+)\)$/;

function parseDates(_key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    const match = AI_DATE_REGEX.exec(value);
    if (match) {
      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      );
    }
  }
  return value;
}

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
      return JSON.parse(response, parseDates) as ExecuteGridAssistantCommandResult;
    }

    const actions = typeof response.actions === 'string'
      ? JSON.parse(response.actions, parseDates)
      : response.actions;

    return { actions };
  }
}
