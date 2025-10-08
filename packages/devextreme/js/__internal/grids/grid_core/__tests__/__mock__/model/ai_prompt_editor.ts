import Popup from '@js/ui/popup';

const CLASSES = {
  wrapper: 'dx-overlay-wrapper',
  toolbarItem: 'dx-toolbar-item',
  stateInvisible: 'dx-state-invisible',
  stateDisabled: 'dx-state-disabled',
  aiPromptEditor: 'dx-ai-prompt-editor',
  aiPromptEditorTextArea: 'dx-ai-prompt-editor__text-area',
  aiPromptEditorRefreshButton: 'dx-ai-prompt-editor__refresh-button',
  aiPromptEditorApplyButton: 'dx-ai-prompt-editor__apply-button',
  aiPromptEditorStopButton: 'dx-ai-prompt-editor__stop-button',
  aiPromptEditorProgressBar: 'dx-ai-prompt-editor__progressbar',
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

  public getTextArea(): HTMLTextAreaElement {
    return this.getTextAreaElement().querySelector('textarea') as HTMLTextAreaElement;
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

  public getStopButtonElement(): HTMLElement {
    return this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorStopButton}`) as HTMLElement;
  }

  public getProgressBarElement(): HTMLElement {
    return this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorProgressBar}`) as HTMLElement;
  }

  public changeTextAreaValue(value: string): void {
    const textArea = this.getTextArea();

    textArea.value = value;
    textArea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  public isRefreshButtonDisabled(): boolean {
    return this.getRefreshButtonElement().classList.contains(CLASSES.stateDisabled);
  }

  public isApplyButtonDisabled(): boolean {
    return this.getApplyButtonElement().classList.contains(CLASSES.stateDisabled);
  }

  public isApplyButtonVisible(): boolean {
    const applyButton = this.getApplyButtonElement();
    const toolbarItem = applyButton.closest(`.${CLASSES.toolbarItem}`);

    return !!toolbarItem && !toolbarItem.classList.contains(CLASSES.stateInvisible);
  }

  public isStopButtonVisible(): boolean {
    const stopButton = this.getStopButtonElement();
    const toolbarItem = stopButton.closest(`.${CLASSES.toolbarItem}`);

    return !!toolbarItem && !toolbarItem.classList.contains(CLASSES.stateInvisible);
  }

  public isProgressBarVisible(): boolean {
    const progressBar = this.getProgressBarElement();

    return !!progressBar && !progressBar.classList.contains(CLASSES.stateInvisible);
  }
}
