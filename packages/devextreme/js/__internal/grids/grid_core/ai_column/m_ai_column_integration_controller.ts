/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AIIntegration,
  GenerateGridColumnCommandParams,
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import type { ErrorHandlingController } from '../error_handling/m_error_handling';
import { Controller } from '../m_modules';
import { AiColumnCacheController } from './m_ai_column_cache_controller';
import { getData, reduceDataCachedKeys } from './utils';

export class AiColumnIntegrationController extends Controller {
  private aborts: Record<string, (() => void) | undefined> = { };

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private errorHandlingController!: ErrorHandlingController;

  private aiColumnCacheController!: AiColumnCacheController;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');
    this.errorHandlingController = this.getController('errorHandling');

    this.aiColumnCacheController = new AiColumnCacheController(this.component);
    this.aiColumnCacheController.init();
  }

  public sendAIColumnRequest(columnName: string): void {
    this.sendRequest(columnName, true);
  }

  public refreshAIColumn(columnName: string): void {
    this.sendRequest(columnName, false);
  }

  private sendRequest(columnName: string, force: boolean): void {
    const aiIntegration = this.getAiIntegration(columnName);
    if (!aiIntegration) {
      return;
    }
    const prompt = this.columnsController.columnOption(columnName, 'ai.prompt');
    if (!prompt) {
      return;
    }

    if (this.isRequestAwaitingCompletion(columnName)) {
      this.abortRequest(columnName);
    }

    let data = getData(this.dataController.items());
    const keys = Object.keys(data);
    const cachedResponse: Record<PropertyKey, string> = force
      ? {}
      : this.aiColumnCacheController.getCachedResponse(columnName, keys);
    data = reduceDataCachedKeys(data, cachedResponse);

    const abort = aiIntegration.generateGridColumn(
      {
        text: prompt,
        data,
      },
      this.getAICommandCallbacks<GenerateGridColumnCommandResult>(columnName, cachedResponse),
    );
    this.aborts[columnName] = abort;
  }

  private processCommandCompletion(columnName: string): void {
    this.abortRequest(columnName);
  }

  private updateResults(
    columnName: string,
    result: string,
    cachedData: Record<PropertyKey, string>,
  ): void {
    // Update the results in the UI or internal state
  }

  private getAICommandCallbacks<T>(
    columnName: string,
    cachedResponse: Record<PropertyKey, string>,
  ): RequestCallbacks<T> {
    const callbacks = {
      onComplete: (finalResponse: T): void => {
        if (this.isRequestAwaitingCompletion(columnName)) {
          this.updateResults(columnName, String(finalResponse), cachedResponse);
          this.processCommandCompletion(columnName);
        }
      },
      onError: (error: Error): void => {
        this.showError(error.message);
        this.processCommandCompletion(columnName);
      },
    };

    return callbacks;
  }

  public abortRequest(columnName: string): void {
    this.aborts[columnName]?.();
    this.aborts[columnName] = undefined;
  }

  public showError(message: string): void {
    this.errorHandlingController?.showToastError(message);
  }

  private getAiIntegration(columnName: string): AIIntegration | null {
    if (!columnName) {
      errors.log('E1066');
    }
    const aiIntegration = this.columnsController.columnOption(columnName, 'ai.aiIntegration');
    if (aiIntegration) {
      return aiIntegration as AIIntegration;
    }

    const gridAiIntegration = this.option('aiIntegration');
    if (gridAiIntegration) {
      return gridAiIntegration;
    }

    errors.log('E1067', columnName);
    return null;
  }

  private isRequestAwaitingCompletion(columnName: string): boolean {
    return !!this.aborts[columnName];
  }

  public dispose(): void {
    Object.keys(this.aborts).forEach((columnName) => this.abortRequest(columnName));
  }
}
