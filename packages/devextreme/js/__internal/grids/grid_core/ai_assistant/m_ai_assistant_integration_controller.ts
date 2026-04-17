import type {
  AIIntegration,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import { Controller } from '../m_modules';

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
    callbacks?: RequestCallbacks<ExecuteGridAssistantCommandResult>,
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

    this.abort = aiIntegration.executeGridAssistant(
      {
        text,
        context: args.context,
        additionalInfo: {
          ...args.additionalInfo,
          responseSchema: args.responseSchema,
        },
      },
      this.getAICommandCallbacks(callbacks),
    );
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
    this.abortRequest();
  }

  // TODO: implement buildContext with grid commands
  // eslint-disable-next-line class-methods-use-this
  private buildContext(): Record<string, unknown> {
    return {};
  }

  // TODO: implement buildResponseSchema with grid commands
  private static buildResponseSchema(): Record<string, unknown> {
    return {};
  }
}
