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
  GridColumnContext,
  GridColumnContextOptional,
  GridContext,
  GridContextOptional,
  GridExtraContextOption,
  JsonSchema,
} from './types';

export class AIAssistantIntegrationController extends Controller {
  private abort?: () => void;

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
    extraContext: GridExtraContextOption | null,
    callbacks?: AIAssistantRequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): void {
    if (this.isRequestAwaitingCompletion()) {
      this.abortRequest();
    }

    const aiIntegration = this.getAIIntegration();

    if (aiIntegration === null) {
      errors.log('E1068');
      return;
    }

    const context = this.buildContext(extraContext);
    const args: {
      context: Record<string, unknown>;
      responseSchema: JsonSchema;
      cancel: boolean;
      additionalInfo: Record<string, unknown>;
    } = {
      context: context as unknown as Record<string, unknown>,
      responseSchema,
      cancel: false,
      additionalInfo: {},
    };

    this.executeAction('onAIAssistantRequestCreating', args);

    if (args.cancel) {
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

  public buildContext(extraContext: GridExtraContextOption | null): GridContext {
    const dataController = this.getController('data');
    const selectedRowKeys = (this.option('selectedRowKeys') ?? []) as (string | number)[];
    const searchText = this.option('searchPanel.text') ?? '';
    const gridExtraContext = this.getGridExtraContext(extraContext?.grid);

    return {
      columns: this.buildColumnsContext(extraContext?.column),
      filtering: {
        filterValue: this.option('filterValue'),
      },
      paging: {
        pageIndex: dataController.pageIndex(),
        pageSize: dataController.pageSize(),
        totalCount: dataController.totalCount(),
      },
      search: {
        searchText,
      },
      selection: {
        selectedRowKeys,
      },
      ...gridExtraContext,
    };
  }

  private buildColumnsContext(
    extraContext?: GridExtraContextOption['column'],
  ): GridColumnContext[] {
    const columnsController = this.getController('columns');
    const allColumns: Column[] = columnsController.getColumns();

    return allColumns
      .filter((column) => !column.command)
      .map((column): GridColumnContext => {
        const gridColumnExtraContext = this.getGridColumnExtraContext(column, extraContext);

        return ({
          dataField: column.dataField,
          caption: column.caption,
          dataType: column.dataType,
          visible: column.visible !== false,
          sortOrder: column.sortOrder,
          sortIndex: column.sortIndex,
          filterValue: column.filterValue,
          fixed: column.fixed,
          fixedPosition: column.fixedPosition,
          width: column.width,
          visibleIndex: column.visibleIndex,
          ...gridColumnExtraContext,
        });
      });
  }

  private getGridExtraContext(
    gridExtraContext?: GridExtraContextOption['grid'],
  ): GridContextOptional | undefined {
    if (!gridExtraContext?.length) {
      return undefined;
    }

    const context: GridContextOptional = {};

    gridExtraContext.forEach((optionName) => {
      switch (optionName) {
        case 'summary': {
          context.summary = {
            totalItems: this.option('summary.totalItems'),
            groupItems: this.option('summary.groupItems'),
            skipEmptyValues: this.option('summary.skipEmptyValues'),
          };
          break;
        }
        default:
          break;
      }
    });

    return context;
  }

  private getGridColumnExtraContext(
    column: Column,
    gridColumnExtraContext?: GridExtraContextOption['column'],
  ): GridColumnContextOptional | undefined {
    if (!gridColumnExtraContext?.length) {
      return undefined;
    }

    const context: GridColumnContextOptional = {};

    gridColumnExtraContext.forEach((optionName) => {
      switch (optionName) {
        case 'groupIndex': {
          context.groupIndex = column.groupIndex;
          break;
        }
        default:
          break;
      }
    });

    return context;
  }
}
