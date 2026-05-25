import { Selector } from 'testcafe';
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
  getWrapper(): Selector {
    return this.element;
  }

  getChat(): Chat {
    return new Chat(this.element.find(`.${CLASS.aiChatContent}`));
  }

  getCloseButton(): Button {
    return new Button(this.element.find(`.${CLASS.closeButton}`));
  }

  getClearChatButton(): Selector {
    return this.element.find(`.${CLASS.clearChatButton}`);
  }

  getMessages(): Selector {
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

  getMessage(index: number): Selector {
    return this.getMessages().nth(index);
  }

  getMessageHeader(index: number): Selector {
    return this.getMessage(index).find(`.${CLASS.messageHeader}`);
  }

  getMessageErrorText(index: number): Selector {
    return this.getMessage(index).find(`.${CLASS.messageErrorText}`);
  }

  getMessageProgressBar(index: number): Selector {
    return this.getMessage(index).find(`.${CLASS.messageProgressBar}`);
  }

  getMessageRegenerateButton(index: number): Selector {
    return this.getMessage(index).find(`.${CLASS.messageRegenerateButton}`);
  }

  getActionList(messageIndex: number): Selector {
    return this.getMessage(messageIndex).find(`.${CLASS.actionList}`);
  }

  getActionItems(messageIndex: number): Selector {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(messageIndex: number): Selector {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItemSuccess}`);
  }

  getErrorActionItems(messageIndex: number): Selector {
    return this.getMessage(messageIndex).find(`.${CLASS.actionListItemError}`);
  }

  getActionItemText(messageIndex: number, actionIndex: number): Selector {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemText}`);
  }

  getActionItemIcon(messageIndex: number, actionIndex: number): Selector {
    return this.getActionItems(messageIndex).nth(actionIndex).find(`.${CLASS.actionListItemIcon}`);
  }
}
