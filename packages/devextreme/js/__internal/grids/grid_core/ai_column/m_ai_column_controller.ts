/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

export class AiColumnController extends modules.Controller {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _dataChangedHandler!: (e) => any;

  public init(): void {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');

    this._dataChangedHandler = this._handleDataChanged.bind(this);
    this._dataController.changed.add(this._dataChangedHandler);

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
    const aiColumnOptions = getAiCommandColumnOptions();
    this._columnsController.addCommandColumn(aiColumnOptions);
  }

  protected _handleDataChanged(e) {

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
    this._dataController.changed.remove(this._dataChangedHandler);
  }
}

export const aiColumnControllerModule = {
  controllers: {
    aiColumn: AiColumnController,
  },
};
