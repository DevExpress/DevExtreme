import { Selector } from 'testcafe';
import Popup from '../popup';
import Button from '../button';
import Chat from '../chat';

const CLASS = {
  aiChat: 'dx-ai-chat',
  aiChatContent: 'dx-ai-chat__content',
  abortConfirmDialog: 'dx-datagrid-ai-assistant-confirm-dialog',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  messageIcon: 'dx-ai-chat__message-icon',
  messageHeader: 'dx-ai-chat__message-header',
  messageHeaderRow: 'dx-ai-chat__message-header-row',
  messageContent: 'dx-ai-chat__message-content',
  messageStatus: 'dx-ai-chat__message-status',
  messageErrorText: 'dx-ai-chat__message-error-text',
  messageProgressBar: 'dx-ai-chat__message-progressbar',
  messageRegenerateButton: 'dx-ai-chat__message-regenerate-button',
  actionList: 'dx-ai-chat__action-list',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  actionListItemIcon: 'dx-ai-chat__action-list-item-icon',
  actionListItemText: 'dx-ai-chat__action-list-item-text',
  closeButton: 'dx-closebutton',
  clearChatButton: 'dx-icon-clearhistory',
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

  getInput(): Selector {
    return this.getChat().getInput();
  }

  getCloseButton(): Button {
    return new Button(this.element.find(`.${CLASS.closeButton}`));
  }

  // eslint-disable-next-line class-methods-use-this
  getAbortConfirmDialog(): Selector {
    return Selector(`.${CLASS.abortConfirmDialog}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getAbortConfirmYesButton(): Selector {
    return Selector(`.${CLASS.abortConfirmDialog} .dx-button`).withExactText('Yes');
  }

  getClearChatButton(): Selector {
    return this.element.find(`.${CLASS.clearChatButton}`);
  }

  getMessages(): Selector {
    return this.getChat().getMessageBubbles();
  }

  getUserMessages(): Selector {
    return this.getMessages().filter((node) => !node.querySelector('.dx-ai-chat__message'));
  }

  getAIMessages(): Selector {
    return this.element.find(`.${CLASS.message}`);
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

  getAIMessage(index: number): Selector {
    return this.getAIMessages().nth(index);
  }

  getMessageHeader(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageHeader}`);
  }

  getMessageErrorText(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageErrorText}`);
  }

  getMessageProgressBar(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageProgressBar}`);
  }

  getMessageRegenerateButton(index: number): Selector {
    return this.getAIMessage(index).find(`.${CLASS.messageRegenerateButton}`);
  }

  getActionList(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionList}`);
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

  getActionItemText(messageIndex: number, actionIndex: number): Selector {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemText}`);
  }

  getActionItemIcon(messageIndex: number, actionIndex: number): Selector {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemIcon}`);
  }

  getSuggestions(): Selector {
    return this.element.find(`.${CLASS.suggestion} .${CLASS.suggestionButton}`);
  }

  isInputDisabled(): Promise<boolean> {
    return this.getChat().getTextArea().isDisabled;
  }

  isClearChatDisabled(): Promise<boolean> {
    return this.getClearChatButton()
      .parent('.dx-button')
      .hasClass('dx-state-disabled');
  }

  isSuggestionDisabled(index: number): Promise<boolean> {
    return this.getSuggestions().nth(index).hasClass('dx-state-disabled');
  }

  getTitle(): Selector {
    return this.topToolbar;
  }
}
