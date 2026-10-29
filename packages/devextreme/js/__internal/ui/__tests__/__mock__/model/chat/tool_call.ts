import {
  ACCORDION_ITEM_BODY_CLASS,
  ACCORDION_ITEM_OPENED_CLASS,
  ACCORDION_ITEM_TITLE_CLASS,
} from '@ts/ui/accordion';
import {
  CHAT_TOOL_CALL_ARGUMENTS_CLASS,
  CHAT_TOOL_CALL_ERROR_CLASS,
  CHAT_TOOL_CALL_ERROR_TAG_CLASS,
  CHAT_TOOL_CALL_FIELD_CLASS,
  CHAT_TOOL_CALL_FIELD_LABEL_CLASS,
  CHAT_TOOL_CALL_ICON_CLASS,
  CHAT_TOOL_CALL_NAME_CLASS,
  CHAT_TOOL_CALL_RESULT_CLASS,
} from '@ts/ui/chat/tool_call_view/tool_call_view';
import { TEXTEDITOR_INPUT_CLASS } from '@ts/ui/text_box/text_editor.base';

export class ToolCallModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getName(): string {
    return this.root.querySelector(`.${CHAT_TOOL_CALL_NAME_CLASS}`)?.textContent ?? '';
  }

  public hasIcon(): boolean {
    return !!this.root.querySelector(`.${CHAT_TOOL_CALL_ICON_CLASS}`);
  }

  public getErrorTagText(): string | null {
    return this.root.querySelector(`.${CHAT_TOOL_CALL_ERROR_TAG_CLASS}`)
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
      .map((field) => field.querySelector(`.${CHAT_TOOL_CALL_FIELD_LABEL_CLASS}`)?.textContent ?? '');
  }

  public getArgumentsText(): string | null {
    return this.getFieldValue(CHAT_TOOL_CALL_ARGUMENTS_CLASS);
  }

  public getResultText(): string | null {
    return this.getFieldValue(CHAT_TOOL_CALL_RESULT_CLASS);
  }

  public areFieldsReadOnly(): boolean {
    const inputs = this.getFieldInputs();

    return inputs.length > 0 && inputs.every((input) => input.readOnly);
  }

  public getFieldInputLabels(): string[] {
    return this.getFieldInputs().map((input) => {
      const labelId = input.getAttribute('aria-labelledby') ?? '';

      return document.getElementById(labelId)?.textContent ?? '';
    });
  }

  public hasErrorResult(): boolean {
    return !!this.root.querySelector(`.${CHAT_TOOL_CALL_ERROR_CLASS}`);
  }

  public hasBody(): boolean {
    return !!this.root.querySelector(`.${ACCORDION_ITEM_BODY_CLASS}`);
  }

  private getFields(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll(`.${CHAT_TOOL_CALL_FIELD_CLASS}`));
  }

  private getFieldInputs(): HTMLTextAreaElement[] {
    return Array.from(this.root.querySelectorAll<HTMLTextAreaElement>(
      `.${CHAT_TOOL_CALL_FIELD_CLASS} .${TEXTEDITOR_INPUT_CLASS}`,
    ));
  }

  private getFieldValue(fieldClass: string): string | null {
    const input = this.root
      .querySelector<HTMLTextAreaElement>(`.${fieldClass} .${TEXTEDITOR_INPUT_CLASS}`);

    return input ? input.value : null;
  }
}
