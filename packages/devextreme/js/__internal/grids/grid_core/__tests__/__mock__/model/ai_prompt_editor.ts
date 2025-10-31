import Popup from '@js/ui/popup';
import { ProgressBarModel } from '@ts/ui/__tests__/__mock__/model/progress_bar';
import { TextAreaModel } from '@ts/ui/__tests__/__mock__/model/text_area';
import { ButtonModel } from '@ts/ui/button/__tests__/__mock__/model/button';

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

export class AIPromptEditorModel {
  constructor(protected readonly root: HTMLElement) {}

  public isVisible(): boolean {
    return this.getWrapperElement() !== null;
  }

  public getPopupInstance(): Popup {
    return Popup.getInstance(this.root) as Popup;
  }

  public getTextArea(): TextAreaModel {
    return new TextAreaModel(
      this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorTextArea}`) as HTMLElement,
    );
  }

  public getWrapperElement(): HTMLElement {
    return document.body.querySelector(`.${CLASSES.aiPromptEditor}.${CLASSES.wrapper}`) as HTMLElement;
  }

  public getRefreshButton(): ButtonModel {
    return new ButtonModel(this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorRefreshButton}`) as HTMLElement);
  }

  public getApplyButton(): ButtonModel {
    return new ButtonModel(this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorApplyButton}`) as HTMLElement);
  }

  public getStopButton(): ButtonModel {
    return new ButtonModel(this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorStopButton}`) as HTMLElement);
  }

  public getProgressBar(): ProgressBarModel {
    return new ProgressBarModel(
      this.getWrapperElement().querySelector(`.${CLASSES.aiPromptEditorProgressBar}`) as HTMLElement,
    );
  }

  public isApplyToolbarItemVisible(): boolean {
    const applyButton = this.getApplyButton().getElement();
    const toolbarItem = applyButton.closest(`.${CLASSES.toolbarItem}`);

    return !!toolbarItem && !toolbarItem.classList.contains(CLASSES.stateInvisible);
  }

  public isStopToolbarItemVisible(): boolean {
    const stopButton = this.getStopButton().getElement();
    const toolbarItem = stopButton.closest(`.${CLASSES.toolbarItem}`);

    return !!toolbarItem && !toolbarItem.classList.contains(CLASSES.stateInvisible);
  }
}
