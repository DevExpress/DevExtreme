import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/m_data_controller';
import { Controller } from '../m_modules';

interface MockAIIntegration {
  sendRequest: () => Promise<unknown>,
}

export class AIAssistantController extends Controller {
  private readonly dataController!: DataController;

  private readonly columnsController!: ColumnsController;

  // TODO: need to specify type AIIntegration | null after creating AIIntegration command
  private getAIIntegration(): MockAIIntegration | null {
    const gridAIIntegration = this.option('aiAssistant.aiIntegration');

    if (gridAIIntegration) {
      return gridAIIntegration as MockAIIntegration;
    }

    return null;
  }

  public sendRequestToAI(): Promise<unknown> {
    const aiIntegration = this.getAIIntegration();

    if (!aiIntegration) {
      return Promise.reject(new Error('AI integration is not configured'));
    }

    // TODO: need to create new aiIntegration command
    return aiIntegration.sendRequest();
  }
}
