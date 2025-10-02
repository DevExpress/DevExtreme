/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AiColumnCacheController } from './m_ai_column_cache_controller';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';
import { AiColumnIntegrationController } from './m_ai_column_integration_controller';

export class AiColumnController extends Controller {
  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private aiColumnCacheController!: AiColumnCacheController;

  private aiColumnIntegrationController!: AiColumnIntegrationController;

  private dataChangedHandler!: (e) => any;

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

    this.addAiCommandColumn();
  }

  private createAIColumnRequest() {
    const options = {};
    this.executeAction('onAIColumnRequestCreating', options);
  }

  private receiveAIColumnResponse() {
    const options = {};
    this.executeAction('onAIColumnResponseReceived', options);
  }

  private addAiCommandColumn(): void {
    this.columnsController.addCommandColumn(getAiCommandColumnOptions());
  }

  private refreshAIColumnInternal(columnName: string): void {
    this.aiColumnIntegrationController.sendRequest(columnName);
  }

  private handleDataChanged(e) {
    const aiColumns = this.columnsController.getColumns()
      .filter((col) => col.type === 'ai'
        && col.ai.mode === 'auto');
    for (const col of aiColumns) {
      this.refreshAIColumnInternal(col.name);
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

  public abortAIColumnRequest(columnName: string): void {

  }

  public sendAIColumnRequest(columnName: string): void {
    this.aiColumnIntegrationController.sendRequest(columnName);
  }

  public refreshAIColumn(columnName: string): void {
    this.refreshAIColumnInternal(columnName);
  }

  public clearAIColumn(columnName: string): void {

  }

  public getAIColumnText(columnName: string, key: any): void {

  }

  public dispose(): void {
    this.dataController.changed.remove(this.dataChangedHandler);
  }
}

export const aiColumnControllerModule = {
  controllers: {
    aiColumn: AiColumnController,
  },
};
