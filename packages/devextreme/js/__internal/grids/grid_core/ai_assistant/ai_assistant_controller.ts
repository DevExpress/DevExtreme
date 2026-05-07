import type {
  ExecuteGridAssistantAction,
  ExecuteGridAssistantCommandResult,
} from '@js/common/ai-integration';
import messageLocalization from '@js/common/core/localization/message';
import { ArrayStore } from '@js/common/data';
import Guid from '@js/core/guid';
import { captionize } from '@js/core/utils/inflector';
import { isFunction, isString } from '@js/core/utils/type';
import type { DataSourceLike } from '@js/data/data_source';
import type { Message } from '@js/ui/chat';
import { fromPromise } from '@ts/core/utils/m_deferred';

import { Controller } from '../m_modules';
import { AIAssistantIntegrationController } from './ai_assistant_integration_controller';
import { commandsCore } from './commands';
import { AI_ASSISTANT_AUTHOR, AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import { GridCommands } from './grid_commands';
import type {
  AIMessage,
  CommandResult,
  CustomizeResponseText,
  CustomizeResponseTitle,
  GridCommand,
  GridExtraContextOption,
} from './types';
import { getMessageStatus, isAIMessage } from './utils';

export class AIAssistantController extends Controller {
  private gridCommands?: GridCommands;

  private messageStore?: ArrayStore<Message, string>;

  private aiAssistantIntegrationController?: AIAssistantIntegrationController;

  private processing = false;

  private getCustomizedResponseTitle(
    status: MessageStatus.Success | MessageStatus.Failure,
    commandNames: GridCommand['name'][],
  ): string {
    // TODO: remove type description, it should be got from d.ts
    const customizeResponseTitle = this.option('aiAssistant.customizeResponseTitle') as CustomizeResponseTitle | undefined;

    // There shouldn't be an empty array here, but we need to handle it anyway.
    if (!commandNames.length) {
      return messageLocalization.format('dxDataGrid-aiAssistantErrorMessage');
    }

    if (customizeResponseTitle && isFunction(customizeResponseTitle)) {
      // TODO: add type description to d.ts
      return customizeResponseTitle(status, commandNames);
    }

    if (commandNames.length === 1) {
      return captionize(commandNames[0]);
    }

    return [
      commandNames.slice(0, -1).map(captionize).join(', '),
      captionize(commandNames.at(-1)),
    ].join(' and ');
  }

  private getCommandNames(actions: ExecuteGridAssistantAction[]): GridCommand['name'][] {
    const commandNames = actions.map(({ name }) => name);
    const uniqueCommandNameSet = new Set(commandNames);

    return Array.from(uniqueCommandNameSet);
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

  private processResponse(response: ExecuteGridAssistantCommandResult): Promise<CommandResult[]> {
    if (this.gridCommands?.isExecuting()) {
      // TODO: need to localize default error message if execution is in progress
      return Promise.reject(new Error('Unexpected error'));
    }

    if (!response?.actions || !Array.isArray(response.actions) || !response.actions.length) {
      // TODO: need to localize default error message when there are no commands
      return Promise.reject(new Error('Default error message'));
    }

    if (!this.gridCommands?.validate(response.actions)) {
      // TODO: need to localize error message on validation fail
      return Promise.reject(new Error('Received invalid commands'));
    }

    // TODO: add type description to d.ts
    const customizeResponseText = this.option('aiAssistant.customizeResponseText') as CustomizeResponseText | undefined;

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

  private completeAIMessage(
    messageId: string,
    commands: CommandResult[],
    commandNames: GridCommand['name'][],
  ): void {
    const messageStatus = getMessageStatus(commands);

    this.updateAIMessage(messageId, {
      headerText: this.getCustomizedResponseTitle(messageStatus, commandNames),
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
      const responseSchema = this.gridCommands?.buildResponseSchema();
      const extraContext = this.getGridExtraContext();

      if (!responseSchema) {
        // TODO: Change error message
        const error = new Error('Grid commands not initialized');

        this.failAIMessage(aiMessage.id, error);
        this.setProcessing(false);
        reject(error);
        return;
      }

      this.aiAssistantIntegrationController?.sendRequest(
        aiMessage.prompt,
        responseSchema,
        extraContext,
        {
          onComplete: (response: ExecuteGridAssistantCommandResult): void => {
            fromPromise(this.processResponse(response))
              .done((commands: CommandResult[]) => {
                const commandNames = this.getCommandNames(response.actions);

                this.completeAIMessage(aiMessage.id, commands, commandNames);
                this.setProcessing(false);
                resolve();
              })
              .fail((errorMessage) => {
              // TODO: Change error message
                const error = errorMessage instanceof Error
                  ? errorMessage
                  : new Error(String(errorMessage));

                this.failAIMessage(aiMessage.id, error);
                this.setProcessing(false);
                reject(error);
              });
          },
          onError: (error: Error): void => {
          // TODO: Change error message
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
        },
      );
    });
  }

  protected getGridCommandList(): GridCommand[] {
    return commandsCore;
  }

  protected getGridExtraContext(): GridExtraContextOption | null {
    return null;
  }

  public init(): void {
    // TODO: initialize default commands list when they are ready
    this.gridCommands = new GridCommands(this.component, this.getGridCommandList());
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
