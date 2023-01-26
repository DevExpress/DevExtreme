import { WidgetName } from '../../helpers/createWidget';
import Widget from '../internal/widget';
import FileContent from './fileContent';

export const CLASS_NAMES = {
  INPUT: '.dx-fileuploader-input',
  FILE_CONTAINER: '.dx-fileuploader-files-container',
};

export default class FileUploader extends Widget {
  public static className = '.dx-fileuploader';

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName {
    return 'dxFileUploader';
  }

  public get input(): Selector {
    return this.element.find(CLASS_NAMES.INPUT);
  }

  public get fileContainer(): Selector {
    return this.element.find(CLASS_NAMES.FILE_CONTAINER);
  }

  public get fileCount(): Promise<number> {
    return this.fileContainer.find(FileContent.className).count;
  }

  public getFile(index = 0): FileContent {
    return new FileContent(this.fileContainer.find(FileContent.className).nth(index));
  }
}
