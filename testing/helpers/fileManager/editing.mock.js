import { extend } from 'core/utils/extend';
import FileManagerEditingControl from 'ui/file_manager/ui.file_manager.editing';

export default class FileManagerEditingControlMock extends FileManagerEditingControl {

    _showDialog(dialog, dialogArgument) {
        const dialogMock = this._createDialogMock(dialog);
        return super._showDialog(dialogMock, dialogArgument);
    }

    _createDialogMock(sourceDialog) {
        return {
            show: dialogArgument => {
                setTimeout(() => {
                    const dialogResultGetter = this.option('getDialogResult');
                    const dialogResult = dialogResultGetter ? dialogResultGetter(sourceDialog, dialogArgument) : {};
                    this._onDialogClosed({ dialogResult });
                });
            }
        };
    }

    _getFileUploaderComponent() {
        const component = this.option('fileUploaderComponent');
        return component ? component : super._getFileUploaderComponent();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getDialogResult: null,
            fileUploaderComponent: null,
            logger: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'getDialogResult':
            case 'fileUploaderComponent':
            case 'logger':
                break;
            default:
                super._optionChanged(args);
        }
    }

}
