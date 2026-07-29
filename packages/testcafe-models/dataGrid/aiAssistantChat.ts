import { Selector } from 'testcafe';
import Popup from '../popup';
import Chat from '../chat';
import TextArea from '../textArea';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  abortConfirmDialog: 'dx-datagrid-ai-assistant-confirm-dialog',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  messageHeader: 'dx-ai-chat__message-header',
  messageErrorText: 'dx-ai-chat__message-error-text',
  messageRegenerateButton: 'dx-ai-chat__message-regenerate-button',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  actionListItemAborted: 'dx-ai-chat__action-list-item--aborted',
  actionListItemText: 'dx-ai-chat__action-list-item-text',
  clearChatButton: 'dx-ai-chat__clear-button',
  suggestion: 'dx-chat-suggestions',
  suggestionButton: 'dx-button',
};

export class AIAssistantChat extends Popup {
  getWrapper(): Selector {
    return this.element;
  }

  getChat(): Chat {
    return new Chat(this.element.find(`.${CLASS.aiChatContent}`));
  }

  getTextArea(): TextArea {
    return this.getChat().getTextArea();
  }

  getInput(): Selector {
    return this.getChat().getInput();
  }

  getTitle(): Selector {
    return this.topToolbar;
  }

  getClearChatButton(): Selector {
    return this.element.find(`.${CLASS.clearChatButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getAbortConfirmDialog(): Selector {
    return Selector(`.${CLASS.abortConfirmDialog}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getAbortConfirmYesButton(): Selector {
    return Selector(`.${CLASS.abortConfirmDialog} .dx-button`).nth(1);
  }

  getMessages(): Selector {
    return this.getChat().getMessageBubbles();
  }

  getUserMessages(): Selector {
    const messageClass = CLASS.message;

    return this.getMessages().filter(
      (node) => !node.querySelector(`.${messageClass}`),
      { messageClass },
    );
  }

  getAIMessages(): Selector {
    return this.element.find(`.${CLASS.message}`);
  }

  getAIMessage(index: number): Selector {
    return this.getAIMessages().nth(index);
  }

  getPendingMessages(): Selector {
    return this.element.find(`.${CLASS.messagePending}`);
  }

  getSuccessMessages(): Selector {
    return this.element.find(`.${CLASS.messageSuccess}`);
  }

  getErrorMessages(): Selector {
    return this.element.find(`.${CLASS.messageError}`);
  }

  getMessageHeader(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageHeader}`);
  }

  getMessageErrorText(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageErrorText}`);
  }

  getMessageRegenerateButton(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageRegenerateButton}`);
  }

  getActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItemSuccess}`);
  }

  getErrorActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItemError}`);
  }

  getAbortedActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItemAborted}`);
  }

  getActionItemText(messageIndex: number, actionIndex: number): Selector {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemText}`);
  }

  getSuggestions(): Selector {
    return this.element.find(`.${CLASS.suggestion} .${CLASS.suggestionButton}`);
  }

  isClearChatDisabled(): Promise<boolean> {
    return this.getClearChatButton()
      .find('.dx-button')
      .hasClass('dx-state-disabled');
  }

  isSuggestionDisabled(index: number): Promise<boolean> {
    return this.getSuggestions().nth(index).hasClass('dx-state-disabled');
  }
}
