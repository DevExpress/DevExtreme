import { AIAssistantIntegrationController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_integration_controller';
import type { GridContext } from '@ts/grids/grid_core/ai_assistant/types';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

export class DataGridAIAssistantIntegrationController extends AIAssistantIntegrationController {
  protected getGridExtraContext(): GridContext {
    const context = super.getGridExtraContext();

    context.summary = {
      totalItems: this.option('summary.totalItems'),
      groupItems: this.option('summary.groupItems'),
    };

    return context;
  }

  protected getGridColumnExtraContext(column: Column): GridContext {
    const context = super.getGridColumnExtraContext(column);

    context.summary = {
      groupIndex: column.groupIndex,
    };

    return context;
  }
}
