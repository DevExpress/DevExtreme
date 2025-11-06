/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GenerateGridColumnCommandResult, RequestCallbacks } from '@js/common/ai-integration';
import type { Callback } from '@js/core/utils/callbacks';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController, HandleDataChangedArguments, UserData } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';
import { AIColumnIntegrationController } from './m_ai_column_integration_controller';
import { getAICommandColumnDefaultOptions, isAIColumnAutoMode, isPromptOption } from './utils';

export class AIColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnIntegrationController!: AIColumnIntegrationController;

  private dataSourceChangedHandler!: (e?: HandleDataChangedArguments) => void;

  private aiColumnOptionChangedHandler!: (
    column: Column,
    optionName: string,
    value: unknown,
  ) => void;

  public aiRequestCompleted!: Callback;

  public aiRequestRejected!: Callback;

  private getDefaultCellValue(column: Column, cellValue: string | undefined): string | null {
    if (cellValue === undefined) {
      return column.ai?.emptyText ?? null;
    }

    return column.ai?.noDataText ?? null;
  }

  private addAICommandColumn(): void {
    const that = this;
    const { dataController, aiColumnIntegrationController } = this;

    this.columnsController.addCommandColumn({
      ...getAICommandColumnDefaultOptions(),
      calculateCellValue(data: UserData) {
        const key = dataController.keyOf(data);
        const cellValue = aiColumnIntegrationController.getAIColumnText(this.name, key);
        const defaultValue = that.getDefaultCellValue(this, cellValue);

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return cellValue || defaultValue;
      },
    });
  }

  private subscribeToDataSourceChanged(): void {
    this.dataSourceChangedHandler = this.handleDataSourceChanged.bind(this);
    this.dataController.dataSource()?.changed.add(this.dataSourceChangedHandler);
  }

  private updateAICells(): void {
    this.dataController.updateItems({
      repaintChangesOnly: this.option('repaintChangesOnly'),
    });
  }

  protected callbackNames(): string[] {
    return ['aiRequestCompleted', 'aiRequestRejected'];
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');

    this.aiColumnIntegrationController = new AIColumnIntegrationController(this.component);
    this.aiColumnIntegrationController.init();

    this.aiColumnOptionChangedHandler = this.aiColumnOptionChanged.bind(this);
    this.columnsController.aiColumnOptionChanged.add(this.aiColumnOptionChangedHandler);

    this.subscribeToDataSourceChanged();
    this.addAICommandColumn();
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

  private handleDataSourceChanged(args?: HandleDataChangedArguments): void {
    const aiColumns = this.getAIColumns();

    if (args?.changeType === 'loadError') {
      return;
    }

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

    if (!this.aiColumnIntegrationController.isAnyRequestAwaitingCompletion()) {
      this.dataController.endCustomLoading();
    }
  }

  public sendRequest(
    columnName: string,
    useCache: boolean,
    needToShowLoadPanel = true,
  ): void {
    const callbacks = this.getRequestCallbacks();
    const column = this.columnsController.columnOption(columnName);

    if (needToShowLoadPanel && !!column?.ai?.prompt) {
      this.dataController.beginCustomLoading();
    }

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
        this.dataController.endCustomLoading();
        this.aiRequestCompleted.fire(data);
        this.updateAICells();
      },
      onError: (error: Error): void => {
        this.dataController.endCustomLoading();
        this.aiRequestRejected.fire(error);
      },
    };
  }

  public clearAIColumn(columnName: string): void {
    this.abortAIColumnRequest(columnName);
    this.aiColumnIntegrationController.clearAIColumn(columnName);
    this.columnsController.columnOption(columnName, 'ai.prompt', '');
    this.updateAICells();
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
    this.dataController.dataSource()?.changed.remove(this.dataSourceChangedHandler);
  }
}
