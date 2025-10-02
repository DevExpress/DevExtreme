/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AIIntegration,
  GenerateColumnCommandParams,
  GenerateColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import type { GenerateColumnCommandExecutor } from './types';

export class AiColumnIntegrationController extends Controller {
  private abort?: () => void;

  private isAICommandExecuting = false;

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');
  }

  public sendRequest(columnName: string): void {
    const aiIntegration = this.getAiIntegration(columnName);
    if (!aiIntegration) {
      return;
    }
    const data = this.dataController.items()
      .filter((row) => row.rowType === 'data')
      .reduce<Record<PropertyKey, unknown>>((acc, row) => {
        acc[JSON.stringify(row.key) as PropertyKey] = row.data;
        return acc;
      }, {});
    const prompt = this.columnsController.columnOption(columnName, 'ai.prompt');
    aiIntegration.generateColumn(
      {
        text: prompt,
        data,
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

  private getAiIntegration(columnName: string): AIIntegration | null {
    if (!columnName) {
      errors.log('E1066');
    }
    const aiIntegration = this.columnsController.columnOption(columnName, 'ai.aiIntegration');
    if (aiIntegration) {
      return aiIntegration as AIIntegration;
    }

    const gridAiIntegration = this.component.option('aiIntegration');
    if (gridAiIntegration) {
      return gridAiIntegration as AIIntegration;
    }

    errors.log('E1067', columnName);
    return null;
  }
}
