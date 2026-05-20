import type {
  AIIntegration,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';

import { Controller } from '../m_modules';
import type {
  AIAssistantRequestCallbacks,
  GridContext,
  JsonSchema,
} from './types';

export class AIAssistantIntegrationController extends Controller {
  private abort?: () => void;

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private getAICommandCallbacks(
    callbacks?: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): RequestCallbacks<ExecuteGridAssistantCommandResult> {
    return {
      onComplete: (finalResponse: ExecuteGridAssistantCommandResult): void => {
        if (!this.isRequestAwaitingCompletion()) {
          return;
        }
        this.processCommandCompletion();
        callbacks?.onComplete?.(finalResponse);
      },
      onError: (error: Error): void => {
        this.processCommandCompletion();
        callbacks?.onError?.(error);
      },
    };
  }

  private processCommandCompletion(): void {
    this.abort = undefined;
  }

  protected buildContext(): GridContext {
    return {
      keyExpr: this.option('keyExpr') ?? this.dataController.getDataSource()?.store()?.key(),
      columns: this.buildColumnsContext(),
      filtering: {
        filterValue: this.option('filterValue'),
      },
      paging: {
        pageIndex: this.dataController.pageIndex(),
        pageSize: this.dataController.pageSize(),
        totalCount: this.dataController.totalCount(),
      },
      search: {
        searchText: this.option('searchPanel.text') ?? '',
      },
      selection: {
        selectedRowKeys: this.option('selectedRowKeys') ?? [],
        mode: this.option('selection.mode'),
        selectAllMode: this.option('selection.selectAllMode'),
      },
    };
  }

  private buildColumnsContext(): GridContext[] {
    const allColumns: Column[] = this.columnsController.getColumns();

    return allColumns
      .filter((column) => !column.command)
      .map((column) => this.buildColumnContext(column));
  }

  protected buildColumnContext(column: Column): GridContext {
    return ({
      dataField: column.dataField,
      caption: column.caption,
      dataType: column.dataType,
      visible: column.visible !== false,
      sortOrder: column.sortOrder,
      sortIndex: column.sortIndex,
      fixed: column.fixed,
      fixedPosition: column.fixedPosition,
      width: column.width,
      visibleIndex: column.visibleIndex,
    });
  }

  public init(): void {
    this.createAction('onAIAssistantRequestCreating');
    this.dataController = this.getController('data');
    this.columnsController = this.getController('columns');
  }

  private getAIIntegration(): AIIntegration | null {
    const assistantAIIntegration = this.option('aiAssistant.aiIntegration');
    if (assistantAIIntegration) {
      return assistantAIIntegration;
    }

    const gridAIIntegration = this.option('aiIntegration');
    if (gridAIIntegration) {
      return gridAIIntegration;
    }

    return null;
  }

  public sendRequest(
    text: string,
    responseSchema: JsonSchema,
    callbacks?: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): void {
    if (this.isRequestAwaitingCompletion()) {
      this.abortRequest();
    }

    const aiIntegration = this.getAIIntegration();

    if (aiIntegration === null) {
      errors.log('E1068');
      callbacks?.onError?.(errors.Error('E1068'));
      return;
    }

    const args = {
      responseSchema,
      context: this.buildContext(),
      cancel: false,
      additionalInfo: {},
    };

    this.executeAction('onAIAssistantRequestCreating', args);

    if (args.cancel) {
      callbacks?.onAbort?.();
      return;
    }

    const abortRequest = aiIntegration.executeGridAssistant(
      {
        text,
        context: args.context,
        responseSchema: args.responseSchema,
        additionalInfo: args.additionalInfo,
      },
      this.getAICommandCallbacks(callbacks),
    );

    this.abort = (): void => {
      abortRequest();
      callbacks?.onAbort?.();
    };
  }

  public isRequestAwaitingCompletion(): boolean {
    return !!this.abort;
  }

  public abortRequest(): void {
    this.abort?.();
    this.abort = undefined;
  }

  public dispose(): void {
    super.dispose();
    this.abortRequest();
  }
}
