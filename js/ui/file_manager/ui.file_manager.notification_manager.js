import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { getImageContainer } from '../../core/utils/icon';
import messageLocalization from '../../localization/message';

import Button from '../button';
import ProgressBar from '../progress_bar';
import Widget from '../widget/ui.widget';

import FileManagerProgressPanel from './ui.file_manager.notification.progress_panel';

const FILE_MANAGER_PROGRESS_BOX_CLASS = 'dx-filemanager-progress-box';
const FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-error`;
const FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-without-close-button`;
const FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-image`;
const FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-wrapper`;
const FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-common`;
const FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-progress-bar`;
const FILE_MANAGER_PROGRESS_BOX_CLOSE_BUTTON_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-close-button`;
const DX_CARD_CLASS = 'dx-card';

class NotificationManagerBase extends Widget {
    _initMarkup() {
        super._initMarkup();

        this._initActions();
        this._isRealHandler = '__operationInfoHandler';
    }

    _initActions() {
        this._actions = {
            onOperationItemCanceled: this._createActionByOption('onOperationItemCanceled'),
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onOperationItemCanceled: null,
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'onOperationItemCanceled':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    createErrorDetailsProgressBox($container, item, errorText) {
        const detailsItem = this._createDetailsItem($container, item, -1, true);
        this._renderOperationError(detailsItem, errorText);
    }

    _renderOperationError(info, errorText) {
        this._removeProgressBar(info);
        this.renderError(info.$wrapper, info.$commonText, errorText);
    }

    _removeProgressBar(progressBox) {
        if(progressBox.progressBar) {
            progressBox.progressBar.dispose();
            progressBox.progressBar.$element().remove();
            progressBox.progressBar = null;
        }
    }

    renderError($container, $target, errorText) {
        $('<div>')
            .text(errorText)
            .addClass(FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS)
            .appendTo($container);
    }

    _createDetailsItem($container, item, itemIndex, skipProgressBox, showCloseButton) {
        const $detailsItem = $('<div>').appendTo($container);
        if(itemIndex !== -1) {
            $detailsItem.addClass(DX_CARD_CLASS);
        }
        return this._createProgressBox($detailsItem, {
            commonText: item.commonText,
            imageUrl: item.imageUrl,
            skipProgressBox,
            showCloseButton,
            showCloseButtonAlways: showCloseButton,
            onCloseButtonClick: () => this._cancelOperationItem(item, itemIndex)
        });
    }

    _createProgressBox($container, options) {
        $container.addClass(FILE_MANAGER_PROGRESS_BOX_CLASS);
        if(!options.showCloseButtonAlways) {
            $container.addClass(FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS);
        }

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

        let progressBar = null;
        if(!options.skipProgressBox) {
            const $progressBar = $('<div>')
                .addClass(FILE_MANAGER_PROGRESS_BOX_PROGRESS_BAR_CLASS)
                .appendTo($wrapper);

            progressBar = this._createComponent($progressBar, ProgressBar, {
                min: 0,
                max: 100,
                width: '100%',
                validationMessageMode: 'always',
                statusFormat: (ratio, value) => this._getStatusString(ratio, value)
            });
        }

        let closeButton = null;
        if(options.showCloseButton) {
            const $button = $('<div>')
                .addClass(FILE_MANAGER_PROGRESS_BOX_CLOSE_BUTTON_CLASS)
                .appendTo($container);
            closeButton = this._createComponent($button, Button, {
                icon: 'dx-filemanager-i dx-filemanager-i-cancel',
                stylingMode: 'text',
                visible: options.showCloseButtonAlways,
                onClick: options.onCloseButtonClick
            });
        }

        return {
            $commonText, progressBar, $element: $container, $wrapper, closeButton
        };
    }

    _getStatusString(ratio, value) {
        return ratio === 1 ? messageLocalization.format('Done') : (Math.round(ratio * 100) + '%');
    }

    _cancelOperationItem(item, itemIndex) {
        this._raiseOperationItemCanceled(item, itemIndex);

        const itemInfo = item.info.details[itemIndex];
        this._displayClosedOperationItem(itemInfo);
    }

    _displayClosedOperationItem(itemInfo) {
        this._setProgressBarText(itemInfo, messageLocalization.format('dxFileManager-notificationProgressPanelOperationCanceled'));
        this._setCloseButtonVisible(itemInfo, false);
    }

    _setProgressBarText(progressBox, text) {
        progressBox.progressBar.option('statusFormat', () => text);
    }

    _setCloseButtonVisible(progressBox, visible) {
        if(progressBox.closeButton) {
            progressBox.$element.toggleClass(FILE_MANAGER_PROGRESS_BOX_WITHOUT_CLOSE_BUTTON_CLASS, !visible);
            progressBox.closeButton.option('visible', visible);
        }
    }

    _raiseOperationItemCanceled(item, itemIndex) {
        this._actions.onOperationItemCanceled({ item, itemIndex });
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

    _getProgressPanelComponent() {}

    hasNoOperations() { return true; }

    get operationInProgressCount() { return 0; }

    set operationInProgressCount(value) {}

    get failedOperationCount() { return 0; }

    set failedOperationCount(value) {}
}

class NotificationManagerReal extends NotificationManagerStub {
    _initMarkup() {
        super._initMarkup();

        this.failedOperationCount = 0;
        this.operationInProgressCount = 0;
    }

    addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
        this.operationInProgressCount++;
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
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'completeOperation', operationInfo, commonText, isError, statusText);
    }

    completeSingleOperationWithError(operationInfo, errorInfo) {
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'completeSingleOperationWithError', operationInfo, errorInfo.detailErrorText);
    }

    addOperationDetailsError(operationInfo, errorInfo) {
        this._executeIfNeeded(operationInfo[this._isRealHandler], 'addOperationDetailsError', operationInfo, errorInfo.itemIndex, errorInfo.detailErrorText);
    }

    isDimensionChanged() {
        if(this._progressPanel) {
            this._progressPanel.$element().detach();
        }
        return true;
    }

    ensureProgressPanelCreated(container) {
        if(!this._progressPanel) {
            const $progressPanelElement = $('<div>').appendTo(container);
            this._progressPanel = this._createComponent($progressPanelElement, this._getProgressPanelComponent(), {
                onOperationClosed: ({ info }) => this._onProgressPanelOperationClosed(info),
                onOperationCanceled: ({ info }) => this._raiseOperationCanceled(info),
                onOperationItemCanceled: ({ item, itemIndex }) => this._raiseOperationItemCanceled(item, itemIndex),
                onPanelClosed: () => this._hideProgressPanel()
            });
        } else {
            this._progressPanel.$element().appendTo(container);
        }
    }

    // needed for editingProgress.tests.js
    _getProgressPanelComponent() {
        return FileManagerProgressPanel;
    }

    hasNoOperations(operationInfo) {
        if(operationInfo && operationInfo[this._isRealHandler]) {
            return this.operationInProgressCount === 0 && this.failedOperationCount === 0;
        } else {
            return super.hasNoOperations();
        }
    }

    get operationInProgressCount() { return this._operationInProgressCount; }

    set operationInProgressCount(value) { this._operationInProgressCount = value; }

    get failedOperationCount() { return this._failedOperationCount; }

    set failedOperationCount(value) { this._failedOperationCount = value; }
}

export { NotificationManagerReal, NotificationManagerStub };
