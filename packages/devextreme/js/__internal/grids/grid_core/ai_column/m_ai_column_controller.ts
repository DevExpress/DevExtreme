/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GenerateGridColumnCommandResult, RequestCallbacks } from '@js/common/ai-integration';
import type { Callback } from '@js/core/utils/callbacks';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AIColumnIntegrationController } from './m_ai_column_integration_controller';
import { getAICommandColumnDefaultOptions, isAIColumnAutoMode, isPromptOption } from './utils';

export class AIColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnIntegrationController!: AIColumnIntegrationController;

  private dataChangedHandler!: (e) => any;

  private aiColumnOptionChangedHandler!: (
    column: Column,
    optionName: string,
    value: unknown,
  ) => void;

  public aiRequestCompleted!: Callback;

  public aiRequestRejected!: Callback;

  private addAICommandColumn(): void {
    this.columnsController.addCommandColumn(getAICommandColumnDefaultOptions());
  }

  protected callbackNames(): string[] {
    return ['aiRequestCompleted', 'aiRequestRejected'];
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

    this.addAICommandColumn();

    this.aiColumnIntegrationController = new AIColumnIntegrationController(this.component);
    this.aiColumnIntegrationController.init();

    this.dataChangedHandler = this.handleDataChanged.bind(this);
    this.dataController.changed.add(this.dataChangedHandler);

    this.aiColumnOptionChangedHandler = this.aiColumnOptionChanged.bind(this);
    this.columnsController.aiColumnOptionChanged.add(this.aiColumnOptionChangedHandler);
  }

  private showResults(
    columnName: string,
    result: string,
    cachedData: Record<PropertyKey, string>,
  ): void {
    // Update the results in the UI or internal state
  }

  public getAIColumns(): Column[] {
    return this.columnsController.getColumns().filter((col) => col.type === 'ai') as Column[];
  }

  private handleDataChanged(e) {
    const aiColumns = this.getAIColumns();

    for (const col of aiColumns) {
      if (isAIColumnAutoMode(col)) {
        this.sendRequest(col.name as string, true);
      }
    }
  }

  // API methods

  public publicMethods() {
    return [
      'abortAIColumnRequest',
      'sendAIColumnRequest',
      'refreshAIColumn',
      'clearAIColumn',
      'getAIColumnText',
    ];
  }

  public abortAIColumnRequest(columnName: string): void {
    this.aiColumnIntegrationController.abortRequest(columnName);
  }

  private sendRequest(
    columnName: string,
    useCache: boolean,
  ): void {
    const callbacks = this.getRequestCallbacks();
    this.aiColumnIntegrationController.sendRequest(columnName, useCache, callbacks);
  }

  public sendAIColumnRequest(
    columnName: string,
  ): void {
    this.sendRequest(columnName, false);
  }

  public refreshAIColumn(
    columnName: string,
  ): void {
    this.sendRequest(columnName, false);
  }

  private getRequestCallbacks(): RequestCallbacks<GenerateGridColumnCommandResult> {
    return {
      onComplete: (data): void => {
        this.aiRequestCompleted.fire(data);
      },
      onError: (error: Error): void => {
        this.aiRequestRejected.fire(error);
      },
    };
  }

  public clearAIColumn(columnName: string): void {
    this.aiColumnIntegrationController.abortRequest(columnName);
    this.aiColumnIntegrationController.clearAIColumn(columnName);
    this.columnsController.columnOption(columnName, 'ai.prompt', '');
  }

  public getAIColumnText(columnName: string, key: unknown): string | undefined {
    return this.aiColumnIntegrationController.getAIColumnText(columnName, key as PropertyKey);
  }

  public aiColumnOptionChanged(
    column: Column,
    optionName: string,
    value: unknown,
  ): void {
    const isPromptOptionName = isPromptOption(optionName, value);

    if (isPromptOptionName && column.name) {
      this.aiColumnIntegrationController.clearAIColumn(column.name);
    }
  }

  public dispose(): void {
    super.dispose();
    if (this.aiColumnOptionChangedHandler) {
      this.columnsController.aiColumnOptionChanged.remove(this.aiColumnOptionChangedHandler);
    }
    if (this.dataChangedHandler) {
      this.dataController.changed.remove(this.dataChangedHandler);
    }
  }
}
