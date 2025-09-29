/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GenerateColumnCommandParams, GenerateColumnCommandResult, RequestCallbacks } from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import type { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { Controller } from '../m_modules';
import type { GenerateColumnCommandExecutor } from './types';

export class AiColumnIntegrationController extends Controller {
  private abort?: () => void;

  private isAICommandExecuting = false;

  private columnsController!: ColumnsController;

  public init(): void {
    this.columnsController = this.getController('columns');
  }

  public sendRequest(columnName: string, data: any[], additionalInfo: Record<string, any>): void {
    const aiIntegration = this.getAiIntegration(columnName);
    aiIntegration.generateColumn(
      {
        text: additionalInfo.text,
        data: data[0] || {},
      },
      this.getAICommandCallbacks<GenerateColumnCommandResult>(),
    );
  }

  private processCommandCompletion(): void {
    this.abort?.();
    this.abort = undefined;
    this.isAICommandExecuting = false;
  }

  private updateResults(result: string): void {
    // Update the results in the UI or internal state
  }

  private executeAICommand(columnName: string): void {
    const aiCommandName = 'generateColumn';
    const uiCommand = this.getAiIntegration(columnName)[aiCommandName];

    const callbacks = this.getAICommandCallbacks();
    const params = this.getAICommandParams();

    this.isAICommandExecuting = true;

    const abort = (uiCommand as GenerateColumnCommandExecutor)(params, callbacks);

    this.abort = abort;
  }

  private getAICommandCallbacks<T>(): RequestCallbacks<T> {
    const callbacks = {
      onComplete: (finalResponse: T): void => {
        this.updateResults(String(finalResponse));
        this.processCommandCompletion();
      },
      onError: (): void => {
        this.processCommandCompletion();
      },
    };

    return callbacks;
  }

  private getAICommandParams(): GenerateColumnCommandParams {
    const params = {
      text: '',
      data: {},
    };

    return params;
  }

  public abortRequest(): void {

  }

  public showError(message: string): void {

  }

  private getAiIntegration(columnName: string): AIIntegration {
    const aiIntegration = this.columnsController.columnOption(columnName, 'ai.aiIntegration');
    if (aiIntegration) {
      return aiIntegration as AIIntegration;
    }

    const gridAiIntegration = this.component.option('aiIntegration');
    if (gridAiIntegration) {
      return gridAiIntegration as AIIntegration;
    }

    // TODO
    throw errors.Error('E9999', columnName);
  }
}
