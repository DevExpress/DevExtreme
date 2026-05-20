import type {
  ExecuteGridAssistantAction,
  ExecuteGridAssistantCommandResult,
} from '@js/common/ai-integration';
import messageLocalization from '@js/common/core/localization/message';
import { ArrayStore } from '@js/common/data';
import type { PredefinedCommandNames, ResponseStatus } from '@js/common/grids';
import Guid from '@js/core/guid';
import { captionize } from '@js/core/utils/inflector';
import { isFunction, isString } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';
import { fromPromise } from '@ts/core/utils/m_deferred';

import { Controller } from '../m_modules';
import { AIAssistantIntegrationController } from './ai_assistant_integration_controller';
import { coreCommands } from './commands/index';
import { AI_ASSISTANT_AUTHOR, AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import { GridCommands } from './grid_commands';
import type {
  AIMessage,
  CommandResult,
  GridCommand,
} from './types';
import { getMessageStatus, isAIMessage } from './utils';

export class AIAssistantController extends Controller {
  private gridCommands?: GridCommands;

  private messageStore?: ArrayStore<Message, string>;

  protected aiAssistantIntegrationController?: AIAssistantIntegrationController;

  private processing = false;

  private getCustomizedResponseTitle(
    status: ResponseStatus,
    commandNames: PredefinedCommandNames[],
  ): string {
    const customizeResponseTitle = this.option('aiAssistant.customizeResponseTitle');

    if (!commandNames.length) {
      return messageLocalization.format('dxDataGrid-aiAssistantErrorMessage');
    }

    if (customizeResponseTitle && isFunction(customizeResponseTitle)) {
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

  private getCommandNames(actions: ExecuteGridAssistantAction[]): PredefinedCommandNames[] {
    const commandNames = actions.map(({ name }) => name as PredefinedCommandNames);
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

  private completeAIMessage(
    messageId: string,
    commands: CommandResult[],
    commandNames: PredefinedCommandNames[],
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

  private withProcessing(promise: Promise<void>): Promise<void> {
    this.setProcessing(true);

    return promise.finally(() => {
      this.setProcessing(false);
    });
  }

  private sendRequestToAICore(aiMessage: AIMessage): Promise<void> {
    return this.withProcessing(new Promise<void>((resolve, reject) => {
      const responseSchema = this.gridCommands?.buildResponseSchema();

      if (!responseSchema) {
        // TODO: Change error message
        const error = new Error('Grid commands not initialized');

        this.failAIMessage(aiMessage.id, error);
        reject(error);
        return;
      }

      this.aiAssistantIntegrationController?.sendRequest(
        aiMessage.prompt,
        responseSchema,
        {
          onComplete: (response: ExecuteGridAssistantCommandResult): void => {
            fromPromise(this.processResponse(response))
              .done((commands: CommandResult[]) => {
                const commandNames = this.getCommandNames(response.actions);

                this.completeAIMessage(aiMessage.id, commands, commandNames);
                resolve();
              })
              .fail((errorMessage) => {
                // TODO: Change error message
                const error = errorMessage instanceof Error
                  ? errorMessage
                  : new Error(String(errorMessage));

                this.failAIMessage(aiMessage.id, error);
                reject(error);
              });
          },
          onError: (error: Error): void => {
            // TODO: Change error message
            this.failAIMessage(aiMessage.id, error);
            reject(error);
          },
          onAbort: (): void => {
            const error = new Error(messageLocalization.format('dxDataGrid-aiAssistantAbortMessage'));

            this.failAIMessage(aiMessage.id, error);
            reject(error);
          },
        },
      );
    }));
  }

  protected getGridCommandList(): GridCommand[] {
    return [...coreCommands];
  }

  protected getAiAssistantIntegrationController(): AIAssistantIntegrationController {
    return new AIAssistantIntegrationController(this.component);
  }

  public init(): void {
    this.gridCommands = new GridCommands(this.component, this.getGridCommandList());
    this.messageStore = new ArrayStore<Message, string>({ key: 'id' });
    this.aiAssistantIntegrationController = this.getAiAssistantIntegrationController();
    this.aiAssistantIntegrationController.init();
  }

  public getMessageStore(): ArrayStore<Message, string> {
    return this.messageStore ?? new ArrayStore({ key: 'id' });
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

  public isProcessing(): boolean {
    return this.processing;
  }

  public dispose(): void {
    super.dispose();
    this.aiAssistantIntegrationController?.dispose();
  }
}
