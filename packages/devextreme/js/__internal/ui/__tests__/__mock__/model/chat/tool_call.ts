import {
  ACCORDION_ITEM_BODY_CLASS,
  ACCORDION_ITEM_OPENED_CLASS,
  ACCORDION_ITEM_TITLE_CLASS,
} from '@ts/ui/accordion';
import {
  CHAT_MESSAGEBUBBLE_TOOLCALL_ARGUMENTS_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_LABEL_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ICON_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_NAME_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_RESULT_CLASS,
} from '@ts/ui/chat/messagebubble';
import { TEXTEDITOR_INPUT_CLASS } from '@ts/ui/text_box/text_editor.base';

export class ToolCallModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getName(): string {
    return this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_NAME_CLASS}`)?.textContent ?? '';
  }

  public hasIcon(): boolean {
    return !!this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_ICON_CLASS}`);
  }

  public getErrorTagText(): string | null {
    return this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS}`)
      ?.textContent ?? null;
  }

  public isExpanded(): boolean {
    return this.root.classList.contains(ACCORDION_ITEM_OPENED_CLASS);
  }

  public toggle(): void {
    (this.root.querySelector(`.${ACCORDION_ITEM_TITLE_CLASS}`) as HTMLElement).click();
  }

  public getFieldLabels(): string[] {
    return this.getFields()
      .map((field) => field.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_LABEL_CLASS}`)?.textContent ?? '');
  }

  public getArgumentsText(): string | null {
    return this.getFieldValue(CHAT_MESSAGEBUBBLE_TOOLCALL_ARGUMENTS_CLASS);
  }

  public getResultText(): string | null {
    return this.getFieldValue(CHAT_MESSAGEBUBBLE_TOOLCALL_RESULT_CLASS);
  }

  public hasErrorResult(): boolean {
    return !!this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS}`);
  }

  public hasBody(): boolean {
    return !!this.root.querySelector(`.${ACCORDION_ITEM_BODY_CLASS}`);
  }

  private getFields(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_FIELD_CLASS}`));
  }

  private getFieldValue(fieldClass: string): string | null {
    const input = this.root
      .querySelector<HTMLTextAreaElement>(`.${fieldClass} .${TEXTEDITOR_INPUT_CLASS}`);

    return input ? input.value : null;
  }
}
