/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GenerateGridColumnCommandResult, RequestCallbacks } from '@js/common/ai-integration';
import type { Callback } from '@js/core/utils/callbacks';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AIColumnIntegrationController } from './m_ai_column_integration_controller';
import { isAIColumnAutoMode } from './utils';

export class AIColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnIntegrationController!: AIColumnIntegrationController;

  private dataChangedHandler!: (e) => any;

  public aiRequestCompleted!: Callback;

  public aiRequestRejected!: Callback;

  protected callbackNames(): string[] {
    return ['aiRequestCompleted', 'aiRequestRejected'];
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

    this.aiColumnIntegrationController = new AIColumnIntegrationController(this.component);
    this.aiColumnIntegrationController.init();

    this.dataChangedHandler = this.handleDataChanged.bind(this);
    this.dataController.changed.add(this.dataChangedHandler);
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
        this.refreshAIColumn(col.name as string);
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

  public sendAIColumnRequest(
    columnName: string,
  ): void {
    this.aiColumnIntegrationController.sendRequest(columnName, true, this.getRequestCallbacks());
  }

  public refreshAIColumn(
    columnName: string,
  ): void {
    this.sendAIColumnRequest(columnName);
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
  }

  public getAIColumnText(columnName: string, key: any): void {

  }

  public dispose(): void {
    this.dataController.changed.remove(this.dataChangedHandler);
  }
}
