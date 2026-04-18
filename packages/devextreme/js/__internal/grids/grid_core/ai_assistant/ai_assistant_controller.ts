import { ArrayStore } from '@js/common/data';
import { isString } from '@js/core/utils/type';
import type { DataSourceLike } from '@js/data/data_source';
import type { Message } from '@js/ui/chat';
import { fromPromise } from '@ts/core/utils/m_deferred';

import { Controller } from '../m_modules';
import { AI_ASSISTANT_AUTHOR, AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import { GridCommands } from './grid_commands';
import type {
  CommandResponse, CommandResults, InternalRequestCallbacks,
} from './types';

interface MockAIIntegration {
  sendRequest: ({ callbacks }: { callbacks: InternalRequestCallbacks }) => void,
}

export class AIAssistantController extends Controller {
  private gridCommands!: GridCommands;

  private messageStore!: ArrayStore<Message, string>;

  private getAIMessageId(message: Message): string {
    const parsedTimestamp = isString(message.timestamp)
      ? Date.parse(message.timestamp)
      : message.timestamp?.toString() ?? '';

    return `${AI_ASSISTANT_AUTHOR_ID}-${parsedTimestamp}`;
  }

  private updateAIMessage(messageId: string, data: Partial<Message>): void {
    this.messageStore.push([
      {
        type: 'update',
        key: messageId,
        data,
      },
    ]);
  }

  // TODO: need to specify type AIIntegration | null after creating AIIntegration command
  private getAIIntegration(): MockAIIntegration | null {
    const gridAIIntegration = this.option('aiAssistant.aiIntegration');

    if (gridAIIntegration) {
      return gridAIIntegration as MockAIIntegration;
    }

    return null;
  }

  private processResponse(response: CommandResponse): Promise<CommandResults> {
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

  private createPendingAIMessage(message: Message): string {
    const parsedTimestamp = isString(message.timestamp)
      ? Date.parse(message.timestamp)
      : message.timestamp?.toString() ?? '';
    const aiMessageId = this.getAIMessageId(message);

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

  private completeAIMessage(messageId: string, commands: CommandResults): void {
    this.updateAIMessage(messageId, {
      status: MessageStatus.Success,
      commands,
    });
  }

  private failAIMessage(messageId: string, error: Error): void {
    this.updateAIMessage(messageId, {
      status: MessageStatus.Error,
      text: error.message,
    });
  }

  public init(): void {
    this.gridCommands = new GridCommands(this.component);
    this.messageStore = new ArrayStore<Message, string>({
      key: 'id',
    });
  }

  public getMessageDataSource(): DataSourceLike<Message> {
    return {
      store: this.messageStore,
      reshapeOnPush: true,
    };
  }

  public sendRequestToAI(message: Message): void {
    const aiIntegration = this.getAIIntegration();
    const aiMessageId = this.createPendingAIMessage(message);

    if (!aiIntegration) {
      this.failAIMessage(aiMessageId, new Error('AI integration is not configured'));
      return;
    }

    // TODO: need to create new aiIntegration command
    aiIntegration.sendRequest({
      callbacks: {
        onComplete: (response: CommandResponse): void => {
          fromPromise(this.processResponse(response))
            .done((commands: CommandResults) => {
              this.completeAIMessage(aiMessageId, commands);
            })
            .fail((errorMessage) => {
              const error = errorMessage instanceof Error
                ? errorMessage
                : new Error(String(errorMessage));

              this.failAIMessage(aiMessageId, error);
            });
        },
        onError: (error: Error): void => {
          this.failAIMessage(aiMessageId, error);
        },
      },
    });
  }
}
