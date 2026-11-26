import type { Locator, Page } from '@playwright/test';
import Popup from '../popup';
import Chat from '../chat';
import AIMessage from './aiMessage';

const CLASS = {
  aiChatContent: 'dx-ai-chat__content',
  message: 'dx-ai-chat__message',
  messageSuccess: 'dx-ai-chat__message--success',
  dialogWrapper: 'dx-dialog-wrapper',
};

// Built on the popup's wrapper: it holds the content and renders in the body, while the popup
// widget itself stays in the grid's element.
export default class AIAssistantChat extends Popup {
  private readonly confirmDialogClass: string;

  constructor(page: Page, element: Locator, confirmDialogClass: string) {
    super(page, element);

    this.confirmDialogClass = confirmDialogClass;
  }

  public getWrapper(): Locator {
    return this.element;
  }

  public getChat(): Chat {
    return new Chat(this.page, this.element.locator(`.${CLASS.aiChatContent}`));
  }

  public getInput(): Locator {
    return this.getChat().getInput();
  }

  public getTitle(): Locator {
    return this.getToolbar();
  }

  public getAbortConfirmDialog(): Locator {
    return this.page.locator(`.${this.confirmDialogClass} .${CLASS.dialogWrapper}`);
  }

  public getAIMessages(): Locator {
    return this.element.locator(`.${CLASS.message}`);
  }

  public getAIMessage(index: number): AIMessage {
    return new AIMessage(this.getAIMessages().nth(index));
  }

  public getSuccessMessages(): Locator {
    return this.element.locator(`.${CLASS.messageSuccess}`);
  }
}
