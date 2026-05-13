import type {
  AIIntegration,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { Controller } from '../m_modules';
import type {
  AIAssistantRequestCallbacks,
  GridContext,
  JsonSchema,
} from './types';

export class AIAssistantIntegrationController extends Controller {
  private abort?: () => void;

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

  private buildContext(): GridContext {
    const dataController = this.getController('data');
    const gridExtraContext = this.getGridExtraContext();
    const keyExpr = this.option('keyExpr') ?? dataController.getDataSource()?.store()?.key();

    return {
      keyExpr,
      columns: this.buildColumnsContext(),
      filtering: {
        filterValue: this.option('filterValue'),
      },
      paging: {
        pageIndex: dataController.pageIndex(),
        pageSize: dataController.pageSize(),
        totalCount: dataController.totalCount(),
      },
      search: {
        searchText: this.option('searchPanel.text') ?? '',
      },
      selection: {
        selectedRowKeys: this.option('selectedRowKeys') ?? [],
        mode: this.option('selection.mode'),
        selectAllMode: this.option('selection.selectAllMode'),
      },
      ...gridExtraContext,
    } as GridContext;
  }

  private buildColumnsContext(): GridContext[] {
    const columnsController = this.getController('columns');
    const allColumns: Column[] = columnsController.getColumns();

    return allColumns
      .filter((column) => !column.command)
      .map((column) => {
        const gridColumnExtraContext = this.getGridColumnExtraContext(column);

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
          ...gridColumnExtraContext,
        });
      });
  }

  protected getGridExtraContext(): GridContext {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getGridColumnExtraContext(column: Column): GridContext {
    return {};
  }

  public init(): void {
    this.createAction('onAIAssistantRequestCreating');
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
