import { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import type { GridCommand } from '@ts/grids/grid_core/ai_assistant/types';

import type { DataGridAIAssistantIntegrationController } from './ai_assistant_integration_controller';
import { dataGridCommands } from './commands/index';

export class DataGridAIAssistantController extends AIAssistantController {
  protected aiAssistantIntegrationController?: DataGridAIAssistantIntegrationController;

  protected getGridCommandList(): GridCommand[] {
    const coreCommands = super.getGridCommandList();

    return [
      ...coreCommands,
      ...dataGridCommands,
    ];
  }
}
