import Quill from 'devextreme-quill';
import BaseModule from './base';

let ImageUploadModule = BaseModule;

if(Quill) {
    ImageUploadModule = class ImageUploadModule extends BaseModule {

    };
}

export default ImageUploadModule;
