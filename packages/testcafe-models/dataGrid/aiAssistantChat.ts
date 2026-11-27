import Popup from '../popup';
import Button from '../button';
import Chat from '../chat';
import TextArea from '../textArea';
import { AIMessage } from './aiMessage';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  clearChatButton: 'dx-ai-chat__clear-button',
  button: 'dx-button',
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

  getClearChatButton(): Button {
    return new Button(this.element.find(`.${CLASS.clearChatButton} .${CLASS.button}`));
  }

  getAIMessages(): Selector {
    return this.element.find(`.${CLASS.message}`);
  }

  getAIMessage(index: number): AIMessage {
    return new AIMessage(this.getAIMessages().nth(index));
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
}
