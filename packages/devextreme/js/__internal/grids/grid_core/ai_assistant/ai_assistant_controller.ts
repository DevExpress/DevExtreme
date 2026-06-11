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
      const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantExecutionInProgressMessage');
      return Promise.reject(new Error(localizedErrorMsg));
    }

    if (!response?.actions || !Array.isArray(response.actions) || !response.actions.length) {
      const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantInvalidResponseMessage');
      return Promise.reject(new Error(localizedErrorMsg));
    }

    const parsedActions = this.gridCommands?.parse(response.actions);

    if (!parsedActions) {
      const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantInvalidResponseMessage');
      return Promise.reject(new Error(localizedErrorMsg));
    }

    const customizeResponseText = this.option('aiAssistant.customizeResponseText');
    const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantUnexpectedErrorMessage');

    return this.gridCommands?.executeCommands(parsedActions, customizeResponseText)
      ?? Promise.reject(new Error(localizedErrorMsg));
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
        const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantUnexpectedErrorMessage');
        const error = new Error(localizedErrorMsg);

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
                const error = errorMessage instanceof Error
                  ? errorMessage
                  : new Error(String(errorMessage));

                this.failAIMessage(aiMessage.id, error);
                reject(error);
              });
          },
          onError: (error: Error): void => {
            const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantInvalidResponseMessage');

            this.failAIMessage(aiMessage.id, new Error(localizedErrorMsg));
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
      const localizedErrorMsg = messageLocalization.format('dxDataGrid-aiAssistantRequestInProgressMessage');
      return Promise.reject(new Error(localizedErrorMsg));
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
