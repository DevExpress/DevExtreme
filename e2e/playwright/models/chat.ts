import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import Scrollable from './scrollable';
import TextArea from './textArea';

const CLASS = {
  messageList: 'dx-chat-messagelist',
  textArea: 'dx-textarea',
  scrollable: 'dx-scrollable',
  messageBubble: 'dx-chat-messagebubble',
  contextMenuContent: 'dx-messagelist-context-menu-content',
  menuItem: 'dx-menu-item',
};

export default class Chat extends Widget {
  name: WidgetName = 'dxChat';

  public readonly messageList: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.messageList = this.element.locator(`.${CLASS.messageList}`);
  }

  public getTextArea(): TextArea {
    return new TextArea(this.page, this.element.locator(`.${CLASS.textArea}`));
  }

  public getInput(): Locator {
    return this.getTextArea().input;
  }

  public getScrollable(): Scrollable {
    return new Scrollable(this.page, this.element.locator(`.${CLASS.scrollable}`));
  }

  public getMessageBubbles(): Locator {
    return this.element.locator(`.${CLASS.messageBubble}`);
  }

  public getMessage(index: number): Locator {
    return this.element.locator(`.${CLASS.messageBubble}`).nth(index);
  }

  public getContextMenuItem(index: number): Locator {
    return this.element
      .locator(`.${CLASS.contextMenuContent} .${CLASS.menuItem}`)
      .nth(index);
  }
}
