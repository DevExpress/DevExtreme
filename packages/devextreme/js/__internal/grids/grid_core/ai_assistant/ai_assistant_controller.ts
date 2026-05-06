import type { ExecuteGridAssistantCommandResult } from '@js/common/ai-integration';
import { ArrayStore } from '@js/common/data';
import Guid from '@js/core/guid';
import { isString } from '@js/core/utils/type';
import type { DataSourceLike } from '@js/data/data_source';
import type { Message } from '@js/ui/chat';
import { fromPromise } from '@ts/core/utils/m_deferred';

import { hasCommandErrors } from '../ai_chat/utils';
import { Controller } from '../m_modules';
import { AIAssistantIntegrationController } from './ai_assistant_integration_controller';
import { AI_ASSISTANT_AUTHOR, AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import { GridCommands } from './grid_commands';
import type {
  CommandResults,
} from './types';

export class AIAssistantController extends Controller {
  private gridCommands?: GridCommands;

  private messageStore?: ArrayStore<Message, string>;

  private aiAssistantIntegrationController?: AIAssistantIntegrationController;

  private updateAIMessage(messageId: string, data: Partial<Message>): void {
    this.messageStore?.push([
      {
        type: 'update',
        key: messageId,
        data,
      },
    ]);
  }

  private processResponse(response: ExecuteGridAssistantCommandResult): Promise<CommandResults> {
    if (!response?.actions || !Array.isArray(response.actions)) {
      // TODO: need to localize default error message when there are no commands
      return Promise.reject(new Error('Default error message'));
    }

    if (!this.gridCommands?.validate(response.actions)) {
      // TODO: need to localize error message on validation fail
      return Promise.reject(new Error('Received invalid commands'));
    }

    return this.gridCommands?.executeCommands(response.actions) ?? Promise.reject(new Error('Grid commands not initialized'));
  }

  private createPendingAIMessage(message: Message): string {
    const parsedTimestamp = isString(message.timestamp)
      ? Date.parse(message.timestamp)
      : message.timestamp ?? new Date().getTime();
    const aiMessageId = `${AI_ASSISTANT_AUTHOR_ID}-${String(new Guid())}`;

    this.messageStore?.push([
      {
        type: 'insert',
        data: {
          id: aiMessageId,
          timestamp: parsedTimestamp,
          author: AI_ASSISTANT_AUTHOR,
          text: message.text,
          status: MessageStatus.Pending,
        },
      },
    ]);

    return aiMessageId;
  }

  private completeAIMessage(messageId: string, commands: CommandResults): void {
    const messageStatus = hasCommandErrors(commands)
      ? MessageStatus.Failure
      : MessageStatus.Success;

    this.updateAIMessage(messageId, {
      status: messageStatus,
      commands,
    });
  }

  private failAIMessage(messageId: string, error: Error): void {
    this.updateAIMessage(messageId, {
      status: MessageStatus.Failure,
      text: error.message,
    });
  }

  public init(): void {
    // TODO: initialize default commands list when they are ready
    this.gridCommands = new GridCommands(this.component, []);
    this.messageStore = new ArrayStore<Message, string>({
      key: 'id',
    });
    this.aiAssistantIntegrationController = new AIAssistantIntegrationController(this.component);
    this.aiAssistantIntegrationController.init();
  }

  public getMessageDataSource(): DataSourceLike<Message> {
    return {
      store: this.messageStore,
      reshapeOnPush: true,
    };
  }

  public sendRequestToAI(message: Message): Promise<void> {
    const aiMessageId = this.createPendingAIMessage(message);

    return new Promise((resolve, reject) => {
      this.aiAssistantIntegrationController?.sendRequest(message.text, {
        onComplete: (response: ExecuteGridAssistantCommandResult): void => {
          fromPromise(this.processResponse(response))
            .done((commands: CommandResults) => {
              this.completeAIMessage(aiMessageId, commands);
              resolve();
            })
            .fail((errorMessage) => {
              const error = errorMessage instanceof Error
                ? errorMessage
                : new Error(String(errorMessage));

              this.failAIMessage(aiMessageId, error);
              reject(error);
            });
        },
        onError: (error: Error): void => {
          this.failAIMessage(aiMessageId, error);
          reject(error);
        },
      });
    });
  }

  public dispose(): void {
    super.dispose();
    this.aiAssistantIntegrationController?.dispose();
  }
}
