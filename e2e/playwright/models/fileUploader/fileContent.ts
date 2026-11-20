import type { Locator, Page } from '@playwright/test';
import Button from '../button';

const CLASS = {
  cancelButton: 'dx-fileuploader-cancel-button',
  fileName: 'dx-fileuploader-file-name',
  fileSize: 'dx-fileuploader-file-size',
  statusMessage: 'dx-fileuploader-file-status-message',
};

export default class FileContent {
  public static className = 'dx-fileuploader-file-container';

  public readonly element: Locator;

  public readonly cancelButton: Button;

  public readonly fileName: Locator;

  public readonly fileSize: Locator;

  public readonly statusMessage: Locator;

  public readonly validationMessage: Locator;

  constructor(page: Page, element: Locator) {
    this.element = element;
    this.cancelButton = new Button(page, element.locator(`.${CLASS.cancelButton}`));
    this.fileName = element.locator(`.${CLASS.fileName}`);
    this.fileSize = element.locator(`.${CLASS.fileSize}`);
    this.statusMessage = element.locator(`.${CLASS.statusMessage}`);
    this.validationMessage = this.statusMessage.locator('> span');
  }
}
