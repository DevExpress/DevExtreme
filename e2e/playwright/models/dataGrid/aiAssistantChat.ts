import type { Locator, Page } from '@playwright/test';
import Popup from '../popup';
import Button from '../button';
import Chat from '../chat';
import type TextArea from '../textArea';
import AIMessage from './aiMessage';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  message: 'dx-ai-chat__message',
  messagePending: 'dx-ai-chat__message--pending',
  messageSuccess: 'dx-ai-chat__message--success',
  messageError: 'dx-ai-chat__message--error',
  clearChatButton: 'dx-ai-chat__clear-button',
  suggestions: 'dx-chat-suggestions',
  button: 'dx-button',
  dialogWrapper: 'dx-dialog-wrapper',
};

// "element" is the popup's wrapper, which renders in the body while the popup is shown. The chat
// itself is looked up in "chatRoot": the wrapper when shown, the popup widget in the grid's element
// when hidden, since the popup moves its content back there on hiding.
export default class AIAssistantChat extends Popup {
  private readonly chatRoot: Locator;

  private readonly confirmDialogClass: string;

  constructor(page: Page, element: Locator, chatRoot: Locator, confirmDialogClass: string) {
    super(page, element);

    this.chatRoot = chatRoot;
    this.confirmDialogClass = confirmDialogClass;
  }

  public getWrapper(): Locator {
    return this.element;
  }

  public getChat(): Chat {
    return new Chat(this.page, this.chatRoot.locator(`.${CLASS.aiChatContent}`));
  }

  public getTextArea(): TextArea {
    return this.getChat().getTextArea();
  }

  public getInput(): Locator {
    return this.getChat().getInput();
  }

  public getTitle(): Locator {
    return this.getToolbar();
  }

  public getClearChatButton(): Button {
    return new Button(this.page, this.chatRoot.locator(`.${CLASS.clearChatButton} .${CLASS.button}`));
  }

  public getAbortConfirmDialog(): Locator {
    return this.page.locator(`.${this.confirmDialogClass} .${CLASS.dialogWrapper}`);
  }

  public getMessages(): Locator {
    return this.getChat().getMessageBubbles();
  }

  public getAIMessages(): Locator {
    return this.chatRoot.locator(`.${CLASS.message}`);
  }

  public getAIMessage(index: number): AIMessage {
    return new AIMessage(this.getAIMessages().nth(index));
  }

  public getPendingMessages(): Locator {
    return this.chatRoot.locator(`.${CLASS.messagePending}`);
  }

  public getSuccessMessages(): Locator {
    return this.chatRoot.locator(`.${CLASS.messageSuccess}`);
  }

  public getErrorMessages(): Locator {
    return this.chatRoot.locator(`.${CLASS.messageError}`);
  }

  public getSuggestions(): Locator {
    return this.chatRoot.locator(`.${CLASS.suggestions} .${CLASS.button}`);
  }

  public getSuggestion(index: number): Button {
    return new Button(this.page, this.getSuggestions().nth(index));
  }
}
