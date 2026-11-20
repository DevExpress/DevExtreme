import type { Page } from '@playwright/test';
import Button from '../button';
import Popup from '../popup';
import TextArea from '../textArea';

const CLASS = {
  wrapper: 'dx-aidialog',
  bottomToolbar: 'dx-popup-bottom',
  button: 'dx-button',
  menuButton: 'dx-dropdownmenu-button',
  textArea: 'dx-textarea',
};

export default class AIDialog extends Popup {
  constructor(page: Page) {
    super(page, `${Popup.className}.${CLASS.wrapper}`);
  }

  private getFooterButton(index: number): Button {
    return new Button(
      this.page,
      this.element.locator(`.${CLASS.bottomToolbar} .${CLASS.button}`).nth(index),
    );
  }

  public getGenerateButton(): Button {
    return this.getFooterButton(0);
  }

  public getCancelButton(): Button {
    return this.getFooterButton(0);
  }

  public getSplitButton(): Button {
    return this.getFooterButton(3);
  }

  public getMenuButton(): Button {
    return new Button(
      this.page,
      this.element.locator(`.${CLASS.bottomToolbar} .${CLASS.menuButton}`),
    );
  }

  public getPromptTextArea(): TextArea {
    return new TextArea(this.page, this.element.locator(`.${CLASS.textArea}`).first());
  }
}
