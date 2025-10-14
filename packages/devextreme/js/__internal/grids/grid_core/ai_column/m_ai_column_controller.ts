/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AiColumnCacheController } from './m_ai_column_cache_controller';
import { AiColumnIntegrationController } from './m_ai_column_integration_controller';

export class AiColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnIntegrationController!: AiColumnIntegrationController;

  private dataChangedHandler!: (e) => any;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

    this.aiColumnIntegrationController = new AiColumnIntegrationController(this.component);
    this.aiColumnIntegrationController.init();
    this.aiColumnIntegrationController.showResultsCallback = this.showResults.bind(this);

    this.dataChangedHandler = this.handleDataChanged.bind(this);
    this.dataController.changed.add(this.dataChangedHandler);
  }

  private createAIColumnRequest() {
    const args = {};
    this.executeAction('onAIColumnRequestCreating', args);
  }

  private receiveAIColumnResponse() {
    const options = {};
    this.executeAction('onAIColumnResponseReceived', options);
  }

  private refreshAIColumnInternal(columnName: string): void {
    this.aiColumnIntegrationController.refreshAIColumn(columnName);
  }

  private showResults(
    columnName: string,
    result: string,
    cachedData: Record<PropertyKey, string>,
  ): void {
    // Update the results in the UI or internal state
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
    this.aiColumnIntegrationController.abortRequest(columnName);
  }

  public sendAIColumnRequest(columnName: string): void {
    this.aiColumnIntegrationController.sendAIColumnRequest(columnName);
  }

  public refreshAIColumn(columnName: string): void {
    this.aiColumnIntegrationController.sendAIColumnRequest(columnName);
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
