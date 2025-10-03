import Popup from '@js/ui/popup';

const CLASSES = {
  wrapper: 'dx-overlay-wrapper',
  aiPromptEditor: 'dx-ai-prompt-editor',
  aiPromptEditorTextArea: 'dx-ai-prompt-editor__text-area',
  aiPromptEditorRefreshButton: 'dx-ai-prompt-editor__refresh-button',
  aiPromptEditorApplyButton: 'dx-ai-prompt-editor__apply-button',
};

export class AiPromptEditorModel {
  constructor(protected readonly root: HTMLElement) {}

  public isVisible(): boolean {
    return !!Popup.getInstance(this.root)?.option('visible');
  }

  public getPopupInstance(): Popup {
    return Popup.getInstance(this.root) as Popup;
  }

  public getTextAreaElement(): HTMLElement {
    return this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorTextArea}`) as HTMLElement;
  }

  public getRefreshButtonElement(): HTMLElement {
    return this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorRefreshButton}`) as HTMLElement;
  }

  public getApplyButtonElement(): HTMLElement {
    return this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorApplyButton}`) as HTMLElement;
  }

  public getWrapperElement(): HTMLElement {
    return document.body.querySelector(`.${CLASSES.aiPromptEditor}.${CLASSES.wrapper}`) as HTMLElement;
  }

  public changeTextAreaValue(value: string): void {
    const textArea = this.getTextAreaElement().querySelector('textarea') as HTMLTextAreaElement;

    textArea.value = value;
    textArea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  public isRefreshButtonDisabled(): boolean {
    return this.getRefreshButtonElement().classList.contains('dx-state-disabled');
  }

  public isApplyButtonDisabled(): boolean {
    return this.getApplyButtonElement().classList.contains('dx-state-disabled');
  }
}
