import {
  ACCORDION_ITEM_BODY_CLASS,
  ACCORDION_ITEM_OPENED_CLASS,
  ACCORDION_ITEM_TITLE_CLASS,
} from '@ts/ui/accordion';
import {
  CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_TAG_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_ICON_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALL_NAME_CLASS,
} from '@ts/ui/chat/messagebubble';
import { FIELD_ITEM_LABEL_TEXT_CLASS } from '@ts/ui/form/components/label';
import { FIELD_ITEM_CLASS } from '@ts/ui/form/constants';
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
      .map((field) => field.querySelector(`.${FIELD_ITEM_LABEL_TEXT_CLASS}`)?.textContent ?? '');
  }

  public getArgumentsText(): string | null {
    return this.getFieldValue('arguments');
  }

  public getResultText(): string | null {
    return this.getFieldValue('result');
  }

  public hasErrorResult(): boolean {
    return !!this.root.querySelector(`.${CHAT_MESSAGEBUBBLE_TOOLCALL_ERROR_CLASS}`);
  }

  public hasBody(): boolean {
    return !!this.root.querySelector(`.${ACCORDION_ITEM_BODY_CLASS}`);
  }

  private getFields(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll(`.${FIELD_ITEM_CLASS}`));
  }

  private getFieldValue(dataField: 'arguments' | 'result'): string | null {
    const field = this.getFields()
      .find((item) => item.querySelector('label')?.getAttribute('for')?.endsWith(`_${dataField}`));
    const input = field?.querySelector(`.${TEXTEDITOR_INPUT_CLASS}`) as HTMLTextAreaElement | null;

    return input ? input.value : null;
  }
}
