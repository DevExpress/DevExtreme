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
import { AIColumnCacheController } from './m_ai_column_cache_controller';
import { getDataFromRowItems, reduceDataCachedKeys } from './utils';

export class AIColumnIntegrationController extends Controller {
  private aborts: Record<string, (() => void) | undefined> = { };

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private errorHandlingController!: ErrorHandlingController;

  private aiColumnCacheController!: AIColumnCacheController;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');
    this.errorHandlingController = this.getController('errorHandling');

    this.aiColumnCacheController = new AIColumnCacheController(this.component);
    this.aiColumnCacheController.init();

    this.createAction('onAIColumnRequestCreating');
    this.createAction('onAIColumnResponseReceived');
  }

  public sendRequest(
    columnName: string,
    useCache: boolean,
    callbacks?: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): void {
    const aiIntegration = this.getAIIntegration(columnName);
    if (!aiIntegration) {
      return;
    }
    const column = this.columnsController.getColumnByName(columnName);
    if (!column?.ai) {
      return;
    }
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
      ? this.aiColumnCacheController.getCachedResponse(columnName, keys)
      : {};
    const keyField = this.dataController.key();
    const reducedData = reduceDataCachedKeys(data, cachedResponse, keyField);
    const areAllDataCached = Object.keys(reducedData).length === 0;
    if (areAllDataCached) {
      this.showResult(columnName, {}, cachedResponse);
      return;
    }

    const abort = aiIntegration.generateGridColumn(
      {
        text: prompt,
        data: reducedData,
        additionalInfo: args.additionalInfo,
      },
      this.getAICommandCallbacks(
        columnName,
        cachedResponse,
        callbacks,
      ),
    );
    this.aborts[columnName] = abort;
  }

  private processCommandCompletion(columnName: string): void {
    this.abortRequest(columnName);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  private showResult(
    columnName: string,
    response: Record<PropertyKey, unknown>,
    cachedData: Record<PropertyKey, string>,
  ): void {
    // TODO: Implement result display logic
    const mergedData = { ...cachedData, ...response };
  }

  private getAICommandCallbacks(
    columnName: string,
    cachedResponse: Record<PropertyKey, string>,
    callBacks?: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): RequestCallbacks<GenerateGridColumnCommandResult> {
    const column = this.columnsController.getColumnByName(columnName);
    const callbacks = {
      onComplete: (finalResponse: GenerateGridColumnCommandResult): void => {
        if (this.isRequestAwaitingCompletion(columnName)) {
          const args = {
            column,
            error: null,
            data: finalResponse.data,
          };

          this.executeAction('onAIColumnResponseReceived', args);
          this.showResult(
            columnName,
            finalResponse as Record<PropertyKey, unknown>,
            cachedResponse,
          );
          this.processCommandCompletion(columnName);
          callBacks?.onComplete?.(finalResponse);
        }
      },
      onError: (error: Error): void => {
        const message = error?.message ?? error;
        this.executeAction('onAIColumnResponseReceived', {
          column,
          error: message,
          data: null,
        });
        this.showError(message);
        this.processCommandCompletion(columnName);
        callBacks?.onError?.(error);
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

  private getAIIntegration(columnName: string): AIIntegration | null {
    if (!columnName) {
      errors.log('E1066');
    }
    const aiIntegration = this.columnsController.columnOption(columnName, 'ai.aiIntegration');
    if (aiIntegration) {
      return aiIntegration as AIIntegration;
    }

    const gridAIIntegration = this.option('aiIntegration');
    if (gridAIIntegration) {
      return gridAIIntegration;
    }

    errors.log('E1067', columnName);
    return null;
  }

  private isRequestAwaitingCompletion(columnName: string): boolean {
    return !!this.aborts[columnName];
  }

  public dispose(): void {
    super.dispose();
    Object.keys(this.aborts).forEach((columnName) => this.abortRequest(columnName));
  }
}
