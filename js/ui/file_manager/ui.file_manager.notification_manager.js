import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { getImageContainer } from '../../core/utils/icon';

const FILE_MANAGER_PROGRESS_BOX_CLASS = 'dx-filemanager-progress-box';
const FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-error`;
const FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-image`;
const FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-wrapper`;
const FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-common`;

const ACTION_PROGRESS_STATUS = {
    default: 'default',
    progress: 'progress',
    error: 'error',
    success: 'success'
};

class NotificationManagerBase {
    constructor(options) {
        this._isRealHandler = '__operationInfoHandler';
        this._actionProgressStatus = ACTION_PROGRESS_STATUS.default;
        this._raiseActionProgress = options.onActionProgressStatusChanged;
        this._getProgressPanelComponent = options.getProgressPanelComponent;
    }

    createErrorDetailsProgressBox($container, item, errorText) {
        const detailsItem = this._createDetailsItem($container, item);
        this.renderError(detailsItem.$wrapper, errorText);
    }

    _createDetailsItem($container, item) {
        const $detailsItem = $('<div>').appendTo($container);
        return this._createProgressBox($detailsItem, {
            commonText: item.commonText,
            imageUrl: item.imageUrl
        });
    }

    _createProgressBox($container, options) {
        $container.addClass(FILE_MANAGER_PROGRESS_BOX_CLASS);

        if(options.imageUrl) {
            getImageContainer(options.imageUrl)
                .addClass(FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS)
                .appendTo($container);
        }

        const $wrapper = $('<div>')
            .addClass(FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS)
            .appendTo($container);

        const $commonText = $('<div>')
            .addClass(FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS)
            .text(options.commonText)
            .appendTo($wrapper);

        return {
            $commonText, $element: $container, $wrapper
        };
    }

    renderError($container, errorText) {
        $('<div>')
            .text(errorText)
            .addClass(FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS)
            .appendTo($container);
    }

    isActionProgressStatusDefault() {
        return this._actionProgressStatus === ACTION_PROGRESS_STATUS.default;
    }
}

class NotificationManagerStub extends NotificationManagerBase {
    addOperation() {
        return {
            [this._isRealHandler]: false
        };
    }

    addOperationDetails() {}

    updateOperationItemProgress() {}

    completeOperationItem() {}

    completeOperation() {}

    completeSingleOperationWithError() {}

    addOperationDetailsError() {}

    isDimensionChanged() { return false; }

    ensureProgressPanelCreated() {}

    updateActionProgressStatus() {}

    _updateActionProgress(message, status) {
        if(status !== ACTION_PROGRESS_STATUS.default && status !== ACTION_PROGRESS_STATUS.progress) {
            return;
        }
        this._actionProgressStatus = status;
        this._raiseActionProgress(message, status);
    }

    hasNoOperations() { return true; }

    get _operationInProgressCount() { return 0; }

    set _operationInProgressCount(value) {}

    get failedOperationCount() { return 0; }

    set failedOperationCount(value) {}
}

class NotificationManagerReal extends NotificationManagerStub {
    constructor(options) {
        super(options);

        this.failedOperationCount = 0;
        this._operationInProgressCount = 0;
    }

    addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
        this._operationInProgressCount++;
        this._updateActionProgress(processingMessage, ACTION_PROGRESS_STATUS.progress);
        const operationInfo = this._progressPanel.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
        operationInfo[this._isRealHandler] = true;
        return operationInfo;
    }

    _executeIfNeeded(needExecute, actionName, ...args) {
        if(needExecute) {
            this._progressPanel[actionName](...args);
        } else {
            super[actionName](...args);
        }
    }

    addOperationDetails(operationInfo, details, showCloseButton) {
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'addOperationDetails', operationInfo, details, showCloseButton);
    }

    updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'updateOperationItemProgress', operationInfo, itemIndex, itemProgress, commonProgress);
    }

    completeOperationItem(operationInfo, itemIndex, commonProgress) {
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'completeOperationItem', operationInfo, itemIndex, commonProgress);
    }

    completeOperation(operationInfo, commonText, isError, statusText) {
        this._operationInProgressCount--;
        if(isError) {
            this.failedOperationCount++;
        }
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'completeOperation', operationInfo, commonText, isError, statusText);
    }

    completeSingleOperationWithError(operationInfo, errorInfo) {
        this._notifyError(operationInfo, errorInfo);
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'completeSingleOperationWithError', operationInfo, errorInfo.detailErrorText);
    }

    addOperationDetailsError(operationInfo, errorInfo) {
        this._notifyError(operationInfo, errorInfo);
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'addOperationDetailsError', operationInfo, errorInfo.itemIndex, errorInfo.detailErrorText);
    }

    isDimensionChanged() {
        if(this._progressPanel) {
            this._progressPanel.$element().detach();
        }
        return true;
    }

    ensureProgressPanelCreated(container, options) {
        if(!this._progressPanel) {
            const $progressPanelElement = $('<div>').appendTo(container);
            const ProgressPanelClass = this._getProgressPanelComponent();
            this._progressPanel = new ProgressPanelClass($progressPanelElement, extend({}, options, {
                onOperationClosed: ({ info }) => this._onProgressPanelOperationClosed(info)
            }));
        } else {
            this._progressPanel.$element().appendTo(container);
        }
    }

    _onProgressPanelOperationClosed(operationInfo) {
        if(operationInfo.hasError) {
            this.failedOperationCount--;
            this._tryHideActionProgress(operationInfo);
        }
    }

    _tryHideActionProgress(operationInfo) {
        if(this.hasNoOperations(operationInfo)) {
            this._updateActionProgressWrapper(operationInfo, '', ACTION_PROGRESS_STATUS.default);
        }
    }

    updateActionProgressStatus(operationInfo) {
        let status = ACTION_PROGRESS_STATUS.success;
        if(this.hasNoOperations(operationInfo)) {
            status = ACTION_PROGRESS_STATUS.default;
        } else if(this.failedOperationCount !== 0) {
            status = ACTION_PROGRESS_STATUS.error;
        }
        this._updateActionProgressWrapper(operationInfo, '', status);
    }

    _notifyError(operationInfo, errorInfo) {
        const status = this.hasNoOperations(operationInfo) ? ACTION_PROGRESS_STATUS.default : ACTION_PROGRESS_STATUS.error;
        this._updateActionProgressWrapper(operationInfo, errorInfo.commonErrorText, status);
    }

    _updateActionProgressWrapper(operationInfo, message, status) {
        if(operationInfo?.[this._isRealHandler]) {
            this._updateActionProgress(message, status);
        } else {
            super._updateActionProgress(message, status);
        }
    }

    _updateActionProgress(message, status) {
        this._actionProgressStatus = status;
        this._raiseActionProgress(message, status);
    }

    hasNoOperations(operationInfo) {
        if(operationInfo && operationInfo[this._isRealHandler]) {
            return this._operationInProgressCount === 0 && this.failedOperationCount === 0;
        } else {
            return super.hasNoOperations();
        }
    }

    get _operationInProgressCount() { return this._operationInProgressCountInternal; }

    set _operationInProgressCount(value) { this._operationInProgressCountInternal = value; }

    get failedOperationCount() { return this._failedOperationCount; }

    set failedOperationCount(value) { this._failedOperationCount = value; }
}

export { NotificationManagerReal, NotificationManagerStub };
