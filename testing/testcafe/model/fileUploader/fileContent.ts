import Button from '../button';

const CLASS = {
  CANCEL_BUTTON: '.dx-fileuploader-cancel-button',
  FILE_NAME: '.dx-fileuploader-file-name',
  FILE_SIZE: '.dx-fileuploader-file-size',
  STATUS_MESSAGE: '.dx-fileuploader-file-status-message',
};

export default class FileContent {
  public static className = '.dx-fileuploader-file-container';

  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  public get isExist(): Promise<boolean> {
    return this.element.exists;
  }

  public get cancelButton(): Button {
    return new Button(this.element.find(CLASS.CANCEL_BUTTON));
  }

  public get fileName(): Promise<string> {
    return this.element.find(CLASS.FILE_NAME).innerText;
  }

  public get fileSize(): Promise<string> {
    return this.element.find(CLASS.FILE_SIZE).innerText;
  }

  public get statusMessage(): Promise<string> {
    return this.element.find(`${CLASS.STATUS_MESSAGE}`).innerText;
  }

  public get validationMessage(): Promise<string> {
    return this.element.find(`${CLASS.STATUS_MESSAGE} > span`).innerText;
  }
}
