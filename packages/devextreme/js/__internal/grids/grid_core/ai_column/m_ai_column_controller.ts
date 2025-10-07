/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';

export class AiColumnController extends Controller {
  private dataController!: DataController;

  private dataChangedHandler!: (e) => any;

  public init(): void {
    this.dataController = this.getController('data');

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
