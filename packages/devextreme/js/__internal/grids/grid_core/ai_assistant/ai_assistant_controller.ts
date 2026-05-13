import type { ExecuteGridAssistantCommandResult } from '@js/common/ai-integration';
import messageLocalization from '@js/common/core/localization/message';
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
  AIMessage,
  CommandResults,
} from './types';
import { isAIMessage } from './utils';

export class AIAssistantController extends Controller {
  private gridCommands?: GridCommands;

  private messageStore?: ArrayStore<Message, string>;

  private aiAssistantIntegrationController?: AIAssistantIntegrationController;

  private processing = false;

  // TODO: need to implement method for getting customized response title
  private getCustomizedResponseTitle(): string {
    return '';
  }

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

    const customizeResponseText = this.option('aiAssistant.customizeResponseText');

    return this.gridCommands?.executeCommands(response.actions, customizeResponseText)
      ?? Promise.reject(new Error('Grid commands not initialized'));
  }

  private createPendingAIMessage(message: Message): AIMessage {
    const parsedTimestamp = isString(message.timestamp)
      ? Date.parse(message.timestamp)
      : message.timestamp ?? new Date().getTime();
    const aiMessageId = `${AI_ASSISTANT_AUTHOR_ID}-${String(new Guid())}`;
    const aiMessage: AIMessage = {
      id: aiMessageId,
      timestamp: parsedTimestamp,
      author: AI_ASSISTANT_AUTHOR,
      prompt: message.text,
      headerText: messageLocalization.format('dxDataGrid-aiAssistantProcessingMessageHeader'),
      status: MessageStatus.Pending,
      // WA to trigger status update, remove when dxChat supports
      // updating custom fields via the Store Push API
      text: MessageStatus.Pending,
    };

    this.messageStore?.push([{
      type: 'insert',
      data: aiMessage,
    }]);

    return aiMessage;
  }

  private completeAIMessage(messageId: string, commands: CommandResults): void {
    const messageStatus = hasCommandErrors(commands)
      ? MessageStatus.Failure
      : MessageStatus.Success;

    this.updateAIMessage(messageId, {
      headerText: this.getCustomizedResponseTitle(),
      commands,
      status: messageStatus,
      // WA to trigger status update, remove when dxChat supports
      // updating custom fields via the Store Push API
      text: messageStatus,
    });
  }

  private failAIMessage(messageId: string, error: Error): void {
    this.updateAIMessage(messageId, {
      headerText: messageLocalization.format('dxDataGrid-aiAssistantErrorMessageHeader'),
      errorText: error.message,
      status: MessageStatus.Failure,
      // WA to trigger status update, remove when dxChat supports
      // updating custom fields via the Store Push API
      text: MessageStatus.Failure,
    });
  }

  private setProcessing(value: boolean): void {
    this.processing = value;
  }

  private setAIMessageStatusToPending(aiMessage: AIMessage): void {
    this.updateAIMessage(aiMessage.id, {
      headerText: messageLocalization.format('dxDataGrid-aiAssistantProcessingMessageHeader'),
      errorText: undefined,
      commands: undefined,
      status: MessageStatus.Pending,
      // WA to trigger status update, remove when dxChat supports
      // updating custom fields via the Store Push API
      text: MessageStatus.Pending,
    });
  }

  private sendRequestToAICore(aiMessage: AIMessage): Promise<void> {
    this.setProcessing(true);

    return new Promise((resolve, reject) => {
      this.aiAssistantIntegrationController?.sendRequest(aiMessage.prompt, {
        onComplete: (response: ExecuteGridAssistantCommandResult): void => {
          fromPromise(this.processResponse(response))
            .done((commands: CommandResults) => {
              this.completeAIMessage(aiMessage.id, commands);
              this.setProcessing(false);
              resolve();
            })
            .fail((errorMessage) => {
              const error = errorMessage instanceof Error
                ? errorMessage
                : new Error(String(errorMessage));

              this.failAIMessage(aiMessage.id, error);
              this.setProcessing(false);
              reject(error);
            });
        },
        onError: (error: Error): void => {
          this.failAIMessage(aiMessage.id, error);
          this.setProcessing(false);
          reject(error);
        },
        onAbort: (): void => {
          const error = new Error(messageLocalization.format('dxDataGrid-aiAssistantAbortMessage'));

          this.failAIMessage(aiMessage.id, error);
          this.setProcessing(false);
          reject(error);
        },
      });
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
    };
  }

  public sendRequestToAI(message: Message | AIMessage): Promise<void> {
    if (this.processing) {
      // TODO: need to add localization message when a request is already processing
      return Promise.reject();
    }

    if (isAIMessage(message)) {
      this.setAIMessageStatusToPending(message);

      return this.sendRequestToAICore(message);
    }

    const aiMessage = this.createPendingAIMessage(message);

    return this.sendRequestToAICore(aiMessage);
  }

  public abortRequest(): void {
    this.aiAssistantIntegrationController?.abortRequest();
    this.gridCommands?.abort();
  }

  public dispose(): void {
    super.dispose();
    this.aiAssistantIntegrationController?.dispose();
  }
}
