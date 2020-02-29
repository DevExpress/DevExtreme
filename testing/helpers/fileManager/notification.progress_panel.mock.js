import { extend } from 'core/utils/extend';
import FileManagerProgressPanel from 'ui/file_manager/ui.file_manager.notification.progress_panel';

export default class FileManagerProgressPanelMock extends FileManagerProgressPanel {

    _initMarkup() {
        super._initMarkup();

        this._lastId = 0;
        this._infoStore = [];
    }

    _logEvent(type, args) {
        const logger = this.option('logger');
        if(logger) {
            type = 'progress-' + type;
            logger.addEntry(type, args);
        }
    }

    addOperation(commonText, showCloseButtonAlways, allowProgressAutoUpdate) {
        const operationId = ++this._lastId;

        this._logEvent('addOperation', {
            operationId,
            commonText,
            allowCancel: showCloseButtonAlways,
            allowProgressAutoUpdate
        });

        const info = super.addOperation(commonText, showCloseButtonAlways, allowProgressAutoUpdate);
        info.testOperationId = operationId;
        this._infoStore.push(info);
        return info;
    }

    addOperationDetails(info, details, showCloseButton) {
        const detailsItems = details.map(item => {
            return {
                commonText: item.commonText,
                imageUrl: item.imageUrl
            };
        });

        this._logEvent('addOperationDetails', {
            operationId: info.testOperationId,
            details: detailsItems,
            allowCancel: showCloseButton
        });
        super.addOperationDetails(info, details, showCloseButton);
    }

    completeOperationItem(info, itemIndex, commonProgress) {
        this._logEvent('completeOperationItem', {
            operationId: info.testOperationId,
            itemIndex,
            commonProgress
        });
        super.completeOperationItem(info, itemIndex, commonProgress);
    }

    updateOperationItemProgress(info, itemIndex, itemProgress, commonProgress) {
        this._logEvent('updateOperationItemProgress', {
            operationId: info.testOperationId,
            itemIndex,
            itemProgress,
            commonProgress
        });
        super.updateOperationItemProgress(info, itemIndex, itemProgress, commonProgress);
    }

    completeOperation(info, commonText, isError, statusText) {
        this._logEvent('completeOperation', {
            operationId: info.testOperationId,
            commonText,
            isError,
            statusText
        });
        super.completeOperation(info, commonText, isError, statusText);
    }

    completeSingleOperationWithError(info, errorText) {
        this._logEvent('completeSingleOperationWithError', {
            operationId: info.testOperationId,
            errorText
        });
        super.completeSingleOperationWithError(info, errorText);
    }

    addOperationDetailsError(info, index, errorText) {
        this._logEvent('addOperationDetailsError', {
            operationId: info.testOperationId,
            index,
            errorText
        });
        super.addOperationDetailsError(info, index, errorText);
    }

    renderError($container, $target, errorText) {
        this._logEvent('renderError', {
            errorText
        });
        super.renderError($container, $target, errorText);
    }

    createErrorDetailsProgressBox($container, item, errorText) {
        const itemInfo = {
            commonText: item.commonText,
            imageUrl: item.imageUrl
        };
        this._logEvent('createErrorDetailsProgressBox', {
            item: itemInfo,
            errorText
        });
        super.createErrorDetailsProgressBox($container, item, errorText);
    }

    getStoredInfos() {
        return this._infoStore;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            logger: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'logger':
                break;
            default:
                super._optionChanged(args);
        }
    }

}
