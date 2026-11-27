import type { Locator } from '@playwright/test';
import Button from '../button';
import Popup from '../popup';
import TextArea from '../textArea';

const CLASS = {
  aiPromptEditor: 'dx-ai-prompt-editor',
  overlayWrapper: 'dx-overlay-wrapper',
  button: 'dx-button',
  textArea: 'dx-ai-prompt-editor__text-area',
  regenerateButton: 'dx-ai-prompt-editor__refresh-button',
  stopButton: 'dx-ai-prompt-editor__stop-button',
  applyButton: 'dx-ai-prompt-editor__apply-button',
};

export default class AIPromptEditor extends Popup {
  // The popup widget is in the grid; its wrapper, which holds the content while it is shown, is in
  // the body and carries the same class.
  public getWrapper(): Locator {
    return this.page.locator(`.${CLASS.overlayWrapper}.${CLASS.aiPromptEditor}`);
  }

  public getTextArea(): TextArea {
    return new TextArea(this.page, this.getWrapper().locator(`.${CLASS.textArea}`));
  }

  public getRegenerateButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}.${CLASS.regenerateButton}`));
  }

  public getStopButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}.${CLASS.stopButton}`));
  }

  public getApplyButton(): Button {
    return new Button(this.page, this.getWrapper().locator(`.${CLASS.button}.${CLASS.applyButton}`));
  }
}
