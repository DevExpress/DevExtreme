/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

export class AiColumnController extends modules.Controller {
  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private dataChangedHandler!: (e) => any;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

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

  private handleDataChanged(e) {

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

  }

  public refreshAIColumn(columnName: string): void {

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
