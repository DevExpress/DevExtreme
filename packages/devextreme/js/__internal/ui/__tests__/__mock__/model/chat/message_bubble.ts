import { ACCORDION_CLASS, ACCORDION_ITEM_CLASS } from '@ts/ui/accordion';
import {
  CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
  CHAT_MESSAGEBUBBLE_DELETED_CLASS,
  CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALLS_TITLE_CLASS,
} from '@ts/ui/chat/messagebubble';

import { ToolCallModel } from './tool_call';

export class MessageBubbleModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getContentElement(): HTMLElement {
    return this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_CONTENT_CLASS}`) as HTMLElement;
  }

  public getText(): string {
    return this.getContentElement().textContent ?? '';
  }

  public isDeleted(): boolean {
    return this.root.classList.contains(CHAT_MESSAGEBUBBLE_DELETED_CLASS);
  }

  public isImage(): boolean {
    return this.root.classList.contains(CHAT_MESSAGEBUBBLE_HAS_IMAGE_CLASS);
  }

  public getChildClassNames(): string[] {
    return Array.from(this.root.children).map((child) => child.classList[0]);
  }

  public getToolCallsElement(): HTMLElement | null {
    return this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS}`);
  }

  public hasToolCalls(): boolean {
    return !!this.getToolCallsElement();
  }

  public isToolCallsBeforeContent(): boolean {
    return this.getToolCallsElement()?.nextElementSibling === this.getContentElement();
  }

  public getAccordionElement(): HTMLElement | null {
    return this.getToolCallsElement()?.querySelector(`.${ACCORDION_CLASS}`) ?? null;
  }

  public getAccordionsCount(): number {
    return this.getToolCallsElement()?.querySelectorAll(`.${ACCORDION_CLASS}`).length ?? 0;
  }

  public getToolCallsTitleText(): string | null {
    const title = this.getToolCallsElement()
      ?.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALLS_TITLE_CLASS}`);

    return title?.firstElementChild?.textContent ?? null;
  }

  public getToolCallsTitleErrorTagText(): string | null {
    const tag = this.getToolCallsElement()?.querySelector(
      `.${CHAT_MESSAGEBUBBLE_TOOLCALLS_TITLE_CLASS} .${CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS}`,
    );

    return tag?.textContent ?? null;
  }

  public getToolCalls(): ToolCallModel[] {
    const items = this.getToolCallsElement()?.querySelectorAll(`.${ACCORDION_ITEM_CLASS}`);

    return Array.from(items ?? []).map((item) => new ToolCallModel(item as HTMLElement));
  }
}
