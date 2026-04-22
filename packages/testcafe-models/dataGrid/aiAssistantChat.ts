import Popup from '../popup';
import Button from '../button';
import Chat from '../chat';

const CLASS = {
  aiChat: 'dx-ai-chat',
  aiChatContent: 'dx-ai-chat__content',
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
};

export class AIAssistantChat extends Popup {
  getChat(): Chat {
    return new Chat(this.getWrapper().find(`.${CLASS.aiChatContent}`));
  }

  getCloseButton(): Button {
    return new Button(this.getWrapper().find(`.${CLASS.closeButton}`));
  }

  getClearChatButton() {
    return this.getWrapper().find(`.${CLASS.clearChatButton}`);
  }

  getMessages() {
    return this.getWrapper().find(`.${CLASS.message}`);
  }

  getPendingMessages() {
    return this.getWrapper().find(`.${CLASS.messagePending}`);
  }

  getSuccessMessages() {
    return this.getWrapper().find(`.${CLASS.messageSuccess}`);
  }

  getErrorMessages() {
    return this.getWrapper().find(`.${CLASS.messageError}`);
  }

  getMessage(index: number) {
    return this.getMessages().nth(index);
  }

  getMessageHeader(index: number) {
    return this.getMessage(index).find(`.${CLASS.messageHeader}`);
  }

  getMessageErrorText(index: number) {
    return this.getMessage(index).find(`.${CLASS.messageErrorText}`);
  }

  getMessageProgressBar(index: number) {
    return this.getMessage(index).find(`.${CLASS.messageProgressBar}`);
  }

  getMessageRegenerateButton(index: number) {
    return this.getMessage(index).find(`.${CLASS.messageRegenerateButton}`);
  }

  getActionList(messageIndex: number) {
    return this.getMessage(messageIndex).find(`.${CLASS.actionList}`);
  }

  getActionItems(messageIndex: number) {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(messageIndex: number) {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItemSuccess}`);
  }

  getErrorActionItems(messageIndex: number) {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItemError}`);
  }

  getActionItemText(messageIndex: number, actionIndex: number) {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemText}`);
  }

  getActionItemIcon(messageIndex: number, actionIndex: number) {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemIcon}`);
  }
}
