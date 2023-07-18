import FileUploader from '../../fileUploader';
import Form from '../../form/form';

export default class AddImageFileForm extends Form {
  public get fileUploader(): FileUploader {
    return new FileUploader(this.element.find(FileUploader.className));
  }
}
