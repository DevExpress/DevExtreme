import { Selector } from 'testcafe';
import Popup from '../popup';
import Chat from '../chat';
import TextArea from '../textArea';
import { AIMessage } from './aiMessage';
import { AIAssistantConfirmDialog } from './aiAssistantConfirmDialog';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  clearChatButton: 'dx-ai-chat__clear-button',
  suggestion: 'dx-chat-suggestions',
  suggestionButton: 'dx-button',
};

export class AIAssistantChat extends Popup {
  private readonly confirmDialogClass: string;

  constructor(element: Selector, confirmDialogClass: string) {
    super(element);

    this.confirmDialogClass = confirmDialogClass;
  }

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

  getAbortConfirmDialog(): AIAssistantConfirmDialog {
    return new AIAssistantConfirmDialog(Selector(`.${this.confirmDialogClass}`));
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
