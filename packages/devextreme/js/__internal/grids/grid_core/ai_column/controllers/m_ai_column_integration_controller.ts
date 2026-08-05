import type {
  AIIntegration,
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import { getKeyHash } from '@js/core/utils/common';
import errors from '@js/ui/widget/ui.errors';

import type { ColumnsController } from '../../columns_controller/m_columns_controller';
import type { DataController, UserData } from '../../data_controller/data_controller';
import type { ErrorHandlingController } from '../../error_handling/m_error_handling';
import { Controller } from '../../m_modules';
import type { RowKey } from '../../m_types';
import type { InternalRequestCallbacks } from '../types';
import { getDataFromRowItems, isKeyMissingInData, reduceDataCachedKeys } from '../utils';
import { AIColumnCacheController } from './m_ai_column_cache_controller';

export class AIColumnIntegrationController extends Controller {
  private aborts: Record<string, (() => void) | undefined> = { };

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private errorHandlingController!: ErrorHandlingController;

  private aiColumnCacheController!: AIColumnCacheController;

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

  private processCommandCompletion(columnName: string): void {
    this.abortRequest(columnName);
  }

  private getAICommandCallbacks(
    columnName: string,
    cachedResponse: Record<PropertyKey, string>,
    callBacks?: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): RequestCallbacks<GenerateGridColumnCommandResult> {
    const callbacks = {
      onComplete: (finalResponse: GenerateGridColumnCommandResult): void => {
        if (this.isRequestAwaitingCompletion(columnName)) {
          this.aiColumnCacheController.setCachedResponse(columnName, finalResponse.data);
          this.processCommandCompletion(columnName);
          callBacks?.onComplete?.(finalResponse);
        }
      },
      onError: (error: Error): void => {
        const message = error?.message ?? error;
        this.showError(message);
        this.processCommandCompletion(columnName);
        callBacks?.onError?.(error);
      },
    };

    return callbacks;
  }

  private getRowKeyHash(item: UserData): PropertyKey {
    return getKeyHash(this.dataController.keyOf(item)) as PropertyKey;
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');
    this.errorHandlingController = this.getController('errorHandling');

    this.aiColumnCacheController = new AIColumnCacheController(this.component);
    this.aiColumnCacheController.init();

    this.createAction('onAIColumnRequestCreating');
  }

  public sendRequestCore({
    columnName,
    useCache,
    needToShowLoadPanel,
    callbacks,
  }: {
    columnName: string;
    useCache: boolean;
    needToShowLoadPanel: boolean;
    callbacks: InternalRequestCallbacks;
  }): void {
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
      callbacks.onRequestCanceled();
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

    const keyField = this.dataController.key();
    if (isKeyMissingInData(args.data, keyField)) {
      this.dataController.fireError('E1046', keyField);
      return;
    }

    let cachedResponse: Record<PropertyKey, string> = {};
    if (args.useCache) {
      const keys = args.data.map((item) => this.getRowKeyHash(item));
      cachedResponse = this.aiColumnCacheController.getCachedResponse(columnName, keys);
    }

    const reducedData = reduceDataCachedKeys(
      args.data,
      cachedResponse,
      (item) => this.getRowKeyHash(item),
    );
    const areAllDataCached = Object.keys(reducedData).length === 0;

    if (areAllDataCached) {
      return;
    }

    callbacks.onRequestSending(needToShowLoadPanel);

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

  public isAnyRequestAwaitingCompletion(): boolean {
    return Object.values(this.aborts).some((abort) => !!abort);
  }

  public abortRequest(columnName: string): void {
    this.aborts[columnName]?.();
    this.aborts[columnName] = undefined;
  }

  public showError(message: string): void {
    this.errorHandlingController?.showToastError(message);
  }

  public getAIColumnText(columnName: string, key: RowKey): string | undefined {
    return this.aiColumnCacheController.getCachedString(columnName, getKeyHash(key) as PropertyKey);
  }

  public clearAIColumn(columnName: string): void {
    this.aiColumnCacheController.clearCache(columnName);
  }

  public clearAIColumnByKey(columnName: string, key: RowKey): void {
    this.aiColumnCacheController.clearCacheByKey(columnName, getKeyHash(key) as PropertyKey);
  }

  public dispose(): void {
    super.dispose();
    Object.keys(this.aborts).forEach((columnName) => this.abortRequest(columnName));
  }
}
