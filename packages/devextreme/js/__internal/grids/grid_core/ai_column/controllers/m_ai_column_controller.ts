import type { DataChange } from '@js/common/grids';
import type { Callback } from '@js/core/utils/callbacks';
import { isDefined } from '@ts/core/utils/m_type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import type { ColumnsController } from '../../columns_controller/m_columns_controller';
import type { DataController, HandleDataChangedArguments, UserData } from '../../data_controller/m_data_controller';
import { Controller } from '../../m_modules';
import gridCoreUtils from '../../m_utils';
import type { InternalRequestCallbacks } from '../types';
import { getAICommandColumnDefaultOptions, isAIColumnAutoMode, isPromptOption } from '../utils';
import { AIColumnIntegrationController } from './m_ai_column_integration_controller';

export class AIColumnController extends Controller {
  private dataController!: DataController;

  private columnsController!: ColumnsController;

  private aiColumnIntegrationController!: AIColumnIntegrationController;

  private dataSourceChangedHandler!: (e?: HandleDataChangedArguments) => void;

  private storeUpdatedHandler!: (key: PropertyKey) => void;

  private storeRemovedHandler!: (key: PropertyKey) => void;

  private storeBeforePushHandler!: ({ changes }: { changes: DataChange[] }) => void;

  private dataControllerChangedHandler!: () => void;

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

  private _endCustomLoadingIfNoPendingRequests(): void {
    if (!this.aiColumnIntegrationController.isAnyRequestAwaitingCompletion()) {
      this.dataController.endCustomLoading();
    }
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

  private unsubscribeFromDataControllerChanged(): void {
    if (!this.dataControllerChangedHandler) {
      return;
    }

    this.dataController.changed.remove(this.dataControllerChangedHandler);
  }

  private subscribeToDataControllerChanged(): void {
    if (!this.getAIColumns().length || !gridCoreUtils.isVirtualRowRendering(this)) {
      return;
    }

    this.dataControllerChangedHandler = this.dataControllerChangedHandler
      ?? this.handleDataControllerChanged.bind(this);

    this.dataController.changed.add(this.dataControllerChangedHandler);
  }

  private handleDataControllerChanged(): void {
    if (this.dataController.isViewportChanging()) {
      this.sendRequests();
    }
  }

  private unsubscribeFromStoreEvents(): void {
    const store = this.dataController.store();

    if (this.storeUpdatedHandler) {
      store?.off('updated', this.storeUpdatedHandler);
    }
    if (this.storeRemovedHandler) {
      store?.off('removed', this.storeRemovedHandler);
    }
    if (this.storeBeforePushHandler) {
      store?.off('beforePush', this.storeBeforePushHandler);
    }
  }

  private subscribeToStoreEvents(): void {
    const store = this.dataController.store();

    if (!store) {
      return;
    }

    this.storeUpdatedHandler = this.storeUpdatedHandler ?? this.handleStoreUpdated.bind(this);
    this.storeRemovedHandler = this.storeRemovedHandler ?? this.handleStoreRemoved.bind(this);
    this.storeBeforePushHandler = this.storeBeforePushHandler
      ?? this.handleStoreBeforePush.bind(this);

    store.on('updated', this.storeUpdatedHandler);
    store.on('removed', this.storeRemovedHandler);
    store.on('beforePush', this.storeBeforePushHandler);
  }

  private handleStoreUpdated(key: PropertyKey): void {
    this.clearAIColumnsByKey(key);
  }

  private handleStoreRemoved(key: PropertyKey): void {
    this.clearAIColumnsByKey(key);
  }

  private handleStoreBeforePush({ changes }: { changes: DataChange[] }): void {
    changes.forEach(({ key }) => {
      if (isDefined(key)) {
        this.clearAIColumnsByKey(key);
      }
    });
  }

  private updateAICells(): void {
    this.dataController.updateItems({
      repaintChangesOnly: this.option('repaintChangesOnly'),
    });
  }

  private checkStoreKey(): boolean {
    const store = this.dataController.store();

    if (store && !store.key()) {
      this.dataController.fireError('E1042', 'AI Column');

      return false;
    }

    return true;
  }

  private clearAIColumnsByKey(key: PropertyKey): void {
    const aiColumns = this.getAIColumns();

    aiColumns.forEach((col) => {
      this.aiColumnIntegrationController.clearAIColumnByKey(col.name as string, key);
    });
  }

  private sendRequests(): void {
    const aiColumns = this.getAIColumns();

    if (!aiColumns.length || !this.checkStoreKey()) {
      return;
    }

    for (const col of aiColumns) {
      if (isAIColumnAutoMode(col)) {
        this.sendRequest(col.name as string, true);
      }
    }
  }

  private handleDataSourceChanged(args?: HandleDataChangedArguments): void {
    if (args?.changeType === 'loadError') {
      return;
    }

    this.sendRequests();
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

    this.unsubscribeFromStoreEvents();
    this.subscribeToStoreEvents();

    this.unsubscribeFromDataControllerChanged();
    this.subscribeToDataControllerChanged();

    this.addAICommandColumn();
  }

  public getAIColumns(): Column[] {
    return this.columnsController.getColumns().filter((col) => col.type === 'ai') as Column[];
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

    this._endCustomLoadingIfNoPendingRequests();
  }

  public sendRequest(
    columnName: string,
    useCache: boolean,
    needToShowLoadPanel = true,
  ): void {
    if (!this.checkStoreKey()) {
      return;
    }

    const callbacks = this.getRequestCallbacks();

    this.aiColumnIntegrationController.sendRequestCore({
      columnName,
      useCache,
      needToShowLoadPanel,
      callbacks,
    });
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

  private getRequestCallbacks(): InternalRequestCallbacks {
    return {
      onRequestSending: (needToShowLoadPanel: boolean): void => {
        if (needToShowLoadPanel) {
          this.dataController.beginCustomLoading();
        }
      },
      onComplete: (data): void => {
        this._endCustomLoadingIfNoPendingRequests();
        this.aiRequestCompleted.fire(data);
        this.updateAICells();
      },
      onError: (error: Error): void => {
        this._endCustomLoadingIfNoPendingRequests();
        this.aiRequestRejected.fire(error);
      },
      onRequestCanceled: (): void => {
        this._endCustomLoadingIfNoPendingRequests();
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

      if (!column.ai?.prompt) {
        this.updateAICells();
      }
    }
  }

  public dispose(): void {
    super.dispose();
    this.dataController.dataSource()?.changed.remove(this.dataSourceChangedHandler);
    this.unsubscribeFromStoreEvents();
    this.unsubscribeFromDataControllerChanged();
  }
}
