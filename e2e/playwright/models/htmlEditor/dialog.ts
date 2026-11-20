import type { Locator, Page } from '@playwright/test';
import Button from '../button';
import FileUploader from '../fileUploader';
import Popup from '../popup';
import TextBox from '../textBox';

const CLASS = {
  wrapper: 'dx-formdialog',
  tab: 'dx-tab',
  bottomToolbar: 'dx-popup-bottom',
  button: 'dx-button',
  form: 'dx-formdialog-form',
  textBox: 'dx-textbox',
  buttonGroup: 'dx-buttongroup',
};

export default class Dialog extends Popup {
  public readonly form: Locator;

  public readonly addButton: Button;

  public readonly cancelButton: Button;

  public readonly fileUploader: FileUploader;

  public readonly url: TextBox;

  public readonly lockButton: Button;

  constructor(page: Page) {
    super(page, `${Popup.className}.${CLASS.wrapper}`);

    const footerButtons = this.element.locator(`.${CLASS.bottomToolbar} .${CLASS.button}`);

    this.form = this.element.locator(`.${CLASS.form}`);
    this.addButton = new Button(page, footerButtons.nth(0));
    this.cancelButton = new Button(page, footerButtons.nth(1));
    this.fileUploader = new FileUploader(page, this.form.locator(`.${FileUploader.className}`));
    this.url = new TextBox(page, this.form.locator(`.${CLASS.textBox}:has(input[name="src"])`));
    this.lockButton = new Button(page, this.form.locator(`.${CLASS.buttonGroup} .${CLASS.button}`));
  }

  public getTab(index: number): Locator {
    return this.element.locator(`.${CLASS.tab}`).nth(index);
  }
}
