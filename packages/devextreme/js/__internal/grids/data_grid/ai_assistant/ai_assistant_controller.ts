import { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import type { GridCommand, GridExtraContextOption } from '@ts/grids/grid_core/ai_assistant/types';

import { dataGridCommands } from './commands';

export class DataGridAIAssistantController extends AIAssistantController {
  protected getGridCommandList(): GridCommand[] {
    return dataGridCommands;
  }

  protected getGridExtraContext(): GridExtraContextOption | null {
    return {
      grid: ['summary'],
      column: ['groupIndex'],
    };
  }
}
