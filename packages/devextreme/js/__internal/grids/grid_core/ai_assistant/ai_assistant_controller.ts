import { ArrayStore } from '@js/common/data';
import { isString } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';

import { Controller } from '../m_modules';
import { AI_ASSISTANT_AUTHOR, AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import { GridCommands } from './grid_commands';
import type {
  CommandResponse, InternalRequestCallbacks, ProcessedCommands,
} from './types';

interface MockAIIntegration {
  sendRequest: ({ callbacks }: { callbacks: InternalRequestCallbacks }) => void,
}

export class AIAssistantController extends Controller {
  private gridCommands!: GridCommands;

  private messageStore!: ArrayStore<Message, string>;

  // TODO: need to specify type AIIntegration | null after creating AIIntegration command
  private getAIIntegration(): MockAIIntegration | null {
    const gridAIIntegration = this.option('aiAssistant.aiIntegration');

    if (gridAIIntegration) {
      return gridAIIntegration as MockAIIntegration;
    }

    return null;
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

  public init(): void {
    this.gridCommands = new GridCommands(this.component);
    this.messageStore = new ArrayStore<Message, string>({
      key: 'id',
    });
  }

  public getMessageStore(): ArrayStore<Message, string> {
    return this.messageStore;
  }

  public createPendingAIMessage(message: Message): string {
    const parsedTimestamp = isString(message.timestamp)
      ? Date.parse(message.timestamp)
      : message.timestamp?.toString() ?? '';
    const aiMessageId = `${AI_ASSISTANT_AUTHOR_ID}-${parsedTimestamp}`;

    this.messageStore.push([
      {
        type: 'insert',
        data: {
          id: aiMessageId,
          timestamp: parsedTimestamp,
          // TODO: need to localize author name and move it to constants or options
          author: AI_ASSISTANT_AUTHOR,
          text: message.text,
          status: MessageStatus.Pending,
        },
      },
    ]);

    return aiMessageId;
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
}
