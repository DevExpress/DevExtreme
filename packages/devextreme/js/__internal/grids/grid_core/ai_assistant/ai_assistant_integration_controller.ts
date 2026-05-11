import type {
  AIIntegration,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import { Controller } from '../m_modules';
import type { AIAssistantRequestCallbacks } from './types';

export class AIAssistantIntegrationController extends Controller {
  private abort?: () => void;

  public init(): void {
    this.createAction('onAIAssistantRequestCreating');
  }

  private getAIIntegration(): AIIntegration | null {
    const assistantAIIntegration = this.option('aiAssistant.aiIntegration');
    if (assistantAIIntegration) {
      return assistantAIIntegration;
    }

    const gridAIIntegration = this.option('aiIntegration');
    if (gridAIIntegration) {
      return gridAIIntegration;
    }

    errors.log('E1068');
    return null;
  }

  public sendRequest(
    text: string,
    callbacks?: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): void {
    if (this.isRequestAwaitingCompletion()) {
      this.abortRequest();
    }

    const aiIntegration = this.getAIIntegration();
    if (!aiIntegration) {
      return;
    }

    const context = this.buildContext();
    const responseSchema = AIAssistantIntegrationController.buildResponseSchema();

    const args = {
      context,
      responseSchema,
      cancel: false,
      additionalInfo: {} as Record<string, unknown>,
    };
    this.executeAction('onAIAssistantRequestCreating', args);

    if (args.cancel) {
      return;
    }

    const abortRequest = aiIntegration.executeGridAssistant(
      {
        text,
        context: args.context,
        responseSchema: args.responseSchema,
        additionalInfo: args.additionalInfo,
      },
      this.getAICommandCallbacks(callbacks),
    );

    this.abort = (): void => {
      abortRequest();
      callbacks?.onAbort?.();
    };
  }

  public isRequestAwaitingCompletion(): boolean {
    return !!this.abort;
  }

  public abortRequest(): void {
    this.abort?.();
    this.abort = undefined;
  }

  public dispose(): void {
    super.dispose();
    this.abortRequest();
  }

  private getAICommandCallbacks(
    callbacks?: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): RequestCallbacks<ExecuteGridAssistantCommandResult> {
    return {
      onComplete: (finalResponse: ExecuteGridAssistantCommandResult): void => {
        if (!this.isRequestAwaitingCompletion()) {
          return;
        }
        this.processCommandCompletion();
        callbacks?.onComplete?.(finalResponse);
      },
      onError: (error: Error): void => {
        this.processCommandCompletion();
        callbacks?.onError?.(error);
      },
    };
  }

  private processCommandCompletion(): void {
    this.abort = undefined;
  }

  // TODO: implement buildContext with grid commands

  private buildContext(): Record<string, unknown> {
    return {};
  }

  // TODO: implement buildResponseSchema with grid commands
  private static buildResponseSchema(): Record<string, unknown> {
    return {};
  }
}
