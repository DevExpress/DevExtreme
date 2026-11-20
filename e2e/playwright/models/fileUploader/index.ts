import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import FileContent from './fileContent';

const CLASS = {
  input: 'dx-fileuploader-input',
  filesContainer: 'dx-fileuploader-files-container',
};

export default class FileUploader extends Widget {
  name: WidgetName = 'dxFileUploader';

  public static className = 'dx-fileuploader';

  public readonly input: Locator;

  public readonly files: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.input = this.element.locator(`.${CLASS.input}`);
    this.files = this.element.locator(`.${CLASS.filesContainer} .${FileContent.className}`);
  }

  public getFile(index = 0): FileContent {
    return new FileContent(this.page, this.files.nth(index));
  }
}
