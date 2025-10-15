/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AIIntegration,
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import type { ErrorHandlingController } from '../error_handling/m_error_handling';
import { Controller } from '../m_modules';
import { AiColumnCacheController } from './m_ai_column_cache_controller';
import { getDataFromRowItems, reduceDataCachedKeys } from './utils';

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

    this.createAction('onAIColumnRequestCreating');
    this.createAction('onAIColumnResponseReceived');
  }

  public sendAIColumnRequest(columnName: string): void {
    this.sendRequest(columnName, true);
  }

  public refreshAIColumn(columnName: string): void {
    this.sendRequest(columnName, false);
  }

  private sendRequest(columnName: string, useCache: boolean): void {
    const aiIntegration = this.getAiIntegration(columnName);
    if (!aiIntegration) {
      return;
    }
    const column = this.columnsController.getColumns().find((col) => col.name === columnName);
    const { prompt } = column.ai;
    if (!prompt) {
      return;
    }

    if (this.isRequestAwaitingCompletion(columnName)) {
      this.abortRequest(columnName);
    }

    const rowItems = this.dataController.items();
    const data = getDataFromRowItems(rowItems);
    const args = {
      column,
      useCache,
      cancel: false,
      additionalInfo: { },
      data,
    };
    this.executeAction('onAIColumnRequestCreating', args);

    if (args.cancel) {
      return;
    }

    const keys = Object.keys(data);
    const cachedResponse: Record<PropertyKey, string> = useCache
      ? {}
      : this.aiColumnCacheController.getCachedResponse(columnName, keys);
    const keyField = this.dataController.key();
    const reducedData = reduceDataCachedKeys(data, cachedResponse, keyField);
    const areAllDataCached = Object.keys(reducedData).length === 0;
    if (areAllDataCached) {
      this.showResult(columnName, '', cachedResponse);
      return;
    }

    const abort = aiIntegration.generateGridColumn(
      {
        text: prompt,
        data: reducedData,
        params: args.additionalInfo,
      },
      this.getAICommandCallbacks<GenerateGridColumnCommandResult>(columnName, cachedResponse),
    );
    this.aborts[columnName] = abort;
  }

  private processCommandCompletion(columnName: string): void {
    this.abortRequest(columnName);
  }

  private showResult(
    columnName: string,
    response: string,
    cachedData: Record<PropertyKey, string>,
  ): void {
    // TODO
  }

  private getAICommandCallbacks<T>(
    columnName: string,
    cachedResponse: Record<PropertyKey, string>,
  ): RequestCallbacks<T> {
    const callbacks = {
      onComplete: (finalResponse: T): void => {
        if (this.isRequestAwaitingCompletion(columnName)) {
          this.showResult(columnName, String(finalResponse), cachedResponse);
          this.executeAction('onAIColumnResponseReceived', {});
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
