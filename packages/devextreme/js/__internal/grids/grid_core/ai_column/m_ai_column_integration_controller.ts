import type {
  AIIntegration,
  GenerateGridColumnCommandResult,
  RequestCallbacks,
} from '@js/common/ai-integration';
import errors from '@js/ui/widget/ui.errors';

import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';

export class AiColumnIntegrationController extends Controller {
  private abort?: () => void;

  private columnsController!: ColumnsController;

  private dataController!: DataController;

  private getAICommandCallbacks(
    callBacks?: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): RequestCallbacks<GenerateGridColumnCommandResult> {
    const callbacks = {
      onComplete: (finalResponse: GenerateGridColumnCommandResult): void => {
        this.abort = undefined;
        callBacks?.onComplete?.(finalResponse);
      },
      onError: (error: Error): void => {
        this.abort = undefined;
        callBacks?.onError?.(error);
      },
    };

    return callbacks;
  }

  private getAiIntegration(columnName: string): AIIntegration | null {
    if (!columnName) {
      errors.log('E1066');
    }
    const aiIntegration = this.columnsController.columnOption(columnName, 'ai.aiIntegration');
    if (aiIntegration) {
      return aiIntegration as AIIntegration;
    }

    const gridAiIntegration = this.option('aiIntegration');
    if (gridAiIntegration) {
      return gridAiIntegration;
    }

    errors.log('E1067', columnName);
    return null;
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataController = this.getController('data');
  }

  public sendRequest(
    columnName: string,
    callbacks?: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): void {
    const aiIntegration = this.getAiIntegration(columnName);
    if (!aiIntegration) {
      return;
    }
    const data = this.dataController.items()
      .filter((row) => row.rowType === 'data')
      .reduce<Record<PropertyKey, unknown>>((acc, row) => {
        acc[JSON.stringify(row.key) as PropertyKey] = row.data;
        return acc;
      }, {});
    const prompt = this.columnsController.columnOption(columnName, 'ai.prompt');
    const abort = aiIntegration.generateGridColumn(
      {
        text: prompt,
        data,
      },
      this.getAICommandCallbacks(callbacks),
    );
    this.abort = abort;
  }

  public abortRequest(): void {
    this.abort?.();
    this.abort = undefined;
  }
}
