import { extend } from 'core/utils/extend';
import FileManagerFileUploader from 'ui/file_manager/ui.file_manager.file_uploader';

export default class FileManagerTestFileUploader extends FileManagerFileUploader {

    tryUpload() {
        const filesSelector = this.option('filesSelector');
        if(filesSelector) {
            setTimeout(() => {
                const files = filesSelector();
                const info = this._uploaderInfos[0];
                info.fileUploader.option('value', files);
                info.fileUploader._uploadFiles();
            });
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            filesSelector: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'filesSelector':
                break;
            default:
                super._optionChanged(args);
        }
    }

}
