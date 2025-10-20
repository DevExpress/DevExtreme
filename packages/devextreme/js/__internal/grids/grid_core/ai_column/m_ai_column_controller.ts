/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Callback } from '@js/core/utils/callbacks';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AiColumnCacheController } from './m_ai_column_cache_controller';
import { AiColumnIntegrationController } from './m_ai_column_integration_controller';

export class AiColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnCacheController!: AiColumnCacheController;

  private aiColumnIntegrationController!: AiColumnIntegrationController;

  private dataChangedHandler!: (e) => any;

  public aiRequestCompleted!: Callback;

  public aiRequestRejected!: Callback;

  protected callbackNames(): string[] {
    return ['aiRequestCompleted', 'aiRequestRejected'];
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

    this.aiColumnCacheController = new AiColumnCacheController(this.component);
    this.aiColumnIntegrationController = new AiColumnIntegrationController(this.component);
    this.aiColumnIntegrationController.init();
    this.aiColumnCacheController.init();

    this.dataChangedHandler = this.handleDataChanged.bind(this);
    this.dataController.changed.add(this.dataChangedHandler);

    this.createAction('onAIColumnRequestCreating');
    this.createAction('onAIColumnResponseReceived');
  }

  private createAIColumnRequest() {
    const options = {};
    this.executeAction('onAIColumnRequestCreating', options);
  }

  private receiveAIColumnResponse() {
    const options = {};
    this.executeAction('onAIColumnResponseReceived', options);
  }

  private handleDataChanged(e) {
    const aiColumns = this.columnsController.getColumns()
      .filter((col) => col.type === 'ai' && (!col.ai?.mode || col.ai?.mode === 'auto'));

    for (const col of aiColumns) {
      this.refreshAIColumn(col.name);
    }
  }

  private showResult(columnName: string, data: Record<PropertyKey, string>): void {
    // TODO
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

  public abortAIColumnRequest(): void {
    this.aiColumnIntegrationController.abortRequest();
  }

  public sendAIColumnRequest(
    columnName: string,
  ): void {
    this.aiColumnIntegrationController.sendRequest(columnName, {
      onComplete: (data) => {
        this.aiRequestCompleted.fire(data);
      },
      onError: (error: Error) => {
        this.aiRequestRejected.fire(error);
      },
    });
  }

  public refreshAIColumn(
    columnName: string,
  ): void {
    this.sendAIColumnRequest(columnName);
  }

  public clearAIColumn(columnName: string): void {

  }

  public getAIColumnText(columnName: string, key: any): void {

  }

  public dispose(): void {
    this.dataController.changed.remove(this.dataChangedHandler);
  }
}
