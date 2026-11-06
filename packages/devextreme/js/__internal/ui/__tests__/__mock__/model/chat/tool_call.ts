import { ICON_CLASS } from '@ts/core/utils/icon';
import {
  ACCORDION_ITEM_BODY_CLASS,
  ACCORDION_ITEM_OPENED_CLASS,
  ACCORDION_ITEM_TITLE_CLASS,
} from '@ts/ui/accordion';
import { CHAT_TOOL_CALL_CLASSES } from '@ts/ui/chat/tool_call_view/tool_call_view';
import { TEXTEDITOR_CLASS, TEXTEDITOR_INPUT_CLASS } from '@ts/ui/text_box/text_editor.base';

const EDITOR_OUTLINED_CLASS = 'dx-editor-outlined';

export class ToolCallModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getName(): string {
    return this.root.querySelector(`.${CHAT_TOOL_CALL_CLASSES.name}`)?.textContent ?? '';
  }

  public hasIcon(): boolean {
    return !!this.root.querySelector(`.${CHAT_TOOL_CALL_CLASSES.icon}`);
  }

  public getIconClasses(): string[] {
    const icon = this.root.querySelector(`.${CHAT_TOOL_CALL_CLASSES.icon}`);

    return Array.from(icon?.classList ?? []);
  }

  public hasWrenchIcon(): boolean {
    const classes = this.getIconClasses();

    return classes.includes(ICON_CLASS) && classes.includes(`${ICON_CLASS}-wrench`);
  }

  public getErrorTagText(): string | null {
    return this.root.querySelector(`.${CHAT_TOOL_CALL_CLASSES.errorTag}`)
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
      .map((field) => field.querySelector(`.${CHAT_TOOL_CALL_CLASSES.fieldLabel}`)?.textContent ?? '');
  }

  public getArgumentsText(): string | null {
    return this.getFieldValue(CHAT_TOOL_CALL_CLASSES.arguments);
  }

  public getResultText(): string | null {
    return this.getFieldValue(CHAT_TOOL_CALL_CLASSES.result);
  }

  public getResultInput(): HTMLTextAreaElement {
    return this.root.querySelector(
      `.${CHAT_TOOL_CALL_CLASSES.result} .${TEXTEDITOR_INPUT_CLASS}`,
    ) as HTMLTextAreaElement;
  }

  public areFieldsReadOnly(): boolean {
    const inputs = this.getFieldInputs();

    return inputs.length > 0 && inputs.every((input) => input.readOnly);
  }

  public areFieldsOutlined(): boolean {
    const editors = this.getFieldEditors();

    return editors.length > 0
      && editors.every((editor) => editor.classList.contains(EDITOR_OUTLINED_CLASS));
  }

  public getFieldInputLabels(): string[] {
    return this.getFieldInputs().map((input) => {
      const labelId = input.getAttribute('aria-labelledby') ?? '';

      return document.getElementById(labelId)?.textContent ?? '';
    });
  }

  public hasErrorResult(): boolean {
    return !!this.root.querySelector(`.${CHAT_TOOL_CALL_CLASSES.error}`);
  }

  public hasBody(): boolean {
    return !!this.root.querySelector(`.${ACCORDION_ITEM_BODY_CLASS}`);
  }

  private getFields(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll(`.${CHAT_TOOL_CALL_CLASSES.field}`));
  }

  private getFieldEditors(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll<HTMLElement>(
      `.${CHAT_TOOL_CALL_CLASSES.field} .${TEXTEDITOR_CLASS}`,
    ));
  }

  private getFieldInputs(): HTMLTextAreaElement[] {
    return Array.from(this.root.querySelectorAll<HTMLTextAreaElement>(
      `.${CHAT_TOOL_CALL_CLASSES.field} .${TEXTEDITOR_INPUT_CLASS}`,
    ));
  }

  private getFieldValue(fieldClass: string): string | null {
    const input = this.root
      .querySelector<HTMLTextAreaElement>(`.${fieldClass} .${TEXTEDITOR_INPUT_CLASS}`);

    return input ? input.value : null;
  }
}
