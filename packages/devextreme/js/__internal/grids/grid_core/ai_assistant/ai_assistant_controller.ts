import { Controller } from '../m_modules';
import { GridCommands } from './grid_commands';
import type {
  CommandResponse, InternalRequestCallbacks, ProcessedCommands,
} from './types';

interface MockAIIntegration {
  sendRequest: ({ callbacks }: { callbacks: InternalRequestCallbacks }) => void,
}

export class AIAssistantController extends Controller {
  private gridCommands!: GridCommands;

  // TODO: need to specify type AIIntegration | null after creating AIIntegration command
  private getAIIntegration(): MockAIIntegration | null {
    const gridAIIntegration = this.option('aiAssistant.aiIntegration');

    if (gridAIIntegration) {
      return gridAIIntegration as MockAIIntegration;
    }

    return null;
  }

  public init(): void {
    this.gridCommands = new GridCommands(this.component);
  }

  public sendRequestToAI(): Promise<ProcessedCommands> {
    const aiIntegration = this.getAIIntegration();

    if (!aiIntegration) {
      return Promise.reject(new Error('AI integration is not configured'));
    }

    // TODO: need to create new aiIntegration command
    return new Promise((resolve, reject) => {
      aiIntegration.sendRequest({
        callbacks: {
          onComplete: (response: CommandResponse): void => {
            this.processResponse(response).then(resolve, reject);
          },
          onError: (error: Error): void => {
            reject(error);
          },
        },
      });
    });
  }

  private processResponse(response: CommandResponse): Promise<ProcessedCommands> {
    if (!response?.commands || response?.explanation) {
      // TODO: need to localize default error message when there are no commands
      return Promise.reject(new Error(response.explanation || 'Default error message'));
    }

    if (!this.gridCommands.validate(response.commands)) {
      // TODO: need to localize error message on validation fail
      return Promise.reject(new Error('Received invalid commands'));
    }

    return this.gridCommands.executeCommands(response.commands);
  }
}
