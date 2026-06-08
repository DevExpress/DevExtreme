import { Selector } from 'testcafe';
import Popup from '../popup';
import Button from '../button';
import Chat from '../chat';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  actionListItem: 'dx-ai-chat__action-list-item',
  actionListItemSuccess: 'dx-ai-chat__action-list-item--success',
  actionListItemError: 'dx-ai-chat__action-list-item--error',
  closeButton: 'dx-closebutton',
};

export class AIAssistantChat extends Popup {
  getChat(): Chat {
    return new Chat(this.element.find(`.${CLASS.aiChatContent}`));
  }

  getInput(): Selector {
    return this.getChat().getInput();
  }

  getCloseButton(): Button {
    return new Button(this.element.find(`.${CLASS.closeButton}`));
  }

  getTitle(): Selector {
    return this.topToolbar;
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

  getActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItem}`);
  }

  getSuccessActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItemSuccess}`);
  }

  getErrorActionItems(messageIndex: number): Selector {
    return this.getAIMessage(messageIndex).find(`.${CLASS.actionListItemError}`);
  }
}
