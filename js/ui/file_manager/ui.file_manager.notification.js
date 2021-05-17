import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isFunction } from '../../core/utils/type';
import { Deferred } from '../../core/utils/deferred';
import { getWindow, hasWindow } from '../../core/utils/window';

import Widget from '../widget/ui.widget';
import Popup from '../popup';
import Drawer from '../drawer/ui.drawer';

import { NotificationManager, NotificationManagerStub, MANAGER_ID_NAME } from './ui.file_manager.notification_manager';

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 1000;

const FILE_MANAGER_NOTIFICATION_CLASS = 'dx-filemanager-notification';
const FILE_MANAGER_NOTIFICATION_DRAWER_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-drawer`;
const FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS = `${FILE_MANAGER_NOTIFICATION_DRAWER_CLASS}-panel`;
const FILE_MANAGER_NOTIFICATION_POPUP_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-popup`;
const FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-popup-error`;
const FILE_MANAGER_NOTIFICATION_COMMON_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-common`;
const FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-separator`;
const FILE_MANAGER_NOTIFICATION_DETAILS_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-details`;
const FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS = `${FILE_MANAGER_NOTIFICATION_CLASS}-common-no-item`;

export default class FileManagerNotificationControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._isInAdaptiveState = this._isSmallScreen();
        this._managerMap = {};
        this._notificationManagerStubId = null;

        this._setNotificationManager();
        const $progressPanelContainer = this.option('progressPanelContainer');
        const $progressDrawer = $('<div>')
            .addClass(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS)
            .appendTo($progressPanelContainer);

        $('<div>')
            .addClass(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS)
            .appendTo($progressDrawer);

        const drawerOptions = extend({
            opened: false,
            position: 'right',
            template: (container) => this._ensureProgressPanelCreated(container)
        },
        this._getProgressDrawerAdaptiveOptions());

        this._progressDrawer = this._createComponent($progressDrawer, Drawer, drawerOptions);

        const $drawerContent = $progressDrawer.find(`.${FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS}`).first();

        const contentRenderer = this.option('contentTemplate');
        if(isFunction(contentRenderer)) {
            contentRenderer($drawerContent, this);
        }
    }

    _setNotificationManager(options) {
        options = extend({
            onActionProgressStatusChanged: this._raiseActionProgress.bind(this)
        }, options);
        if(!this._notificationManagerStubId) {
            const stubManager = new NotificationManagerStub(options);
            this._notificationManagerStubId = stubManager.getId();
            this._managerMap[this._notificationManagerStubId] = stubManager;
        }
        if(!this._isProgressDrawerDisabled()) {
            const notificationManagerComponent = this._getProgressManagerComponent();
            options.isActual = true;
            const defaultManager = new notificationManagerComponent(options);
            this._managerMap[defaultManager.getId()] = defaultManager;
        }
    }

    _getNotificationManager(operationInfo) {
        const actualManagerId = operationInfo?.[MANAGER_ID_NAME] || this._getActualNotificationManagerId();
        return this._managerMap[actualManagerId] || this._managerMap[this._notificationManagerStubId];
    }

    _clearManagerMap() {
        const stubManager = this._managerMap[this._notificationManagerStubId];
        delete this._managerMap;
        this._managerMap = { [this._notificationManagerStubId]: stubManager };
    }

    _getActualNotificationManagerId() {
        return Object.keys(this._managerMap).filter(managerId => this._managerMap[managerId].isActual())[0];
    }

    tryShowProgressPanel() {
        const promise = new Deferred();
        const notificationManager = this._getNotificationManager();
        if(notificationManager.isActionProgressStatusDefault() || this._isProgressDrawerOpened() || this._isProgressDrawerDisabled()) {
            return promise.resolve().promise();
        }

        setTimeout(() => {
            this._progressDrawer.show().done(promise.resolve);
            this._hidePopup();
            notificationManager.tryHideActionProgress();
        });
        return promise.promise();
    }

    addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
        const notificationManager = this._getNotificationManager();
        return notificationManager.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
    }

    addOperationDetails(operationInfo, details, showCloseButton) {
        const notificationManager = this._getNotificationManager(operationInfo);
        notificationManager.addOperationDetails(operationInfo, details, showCloseButton);
    }

    updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
        const notificationManager = this._getNotificationManager(operationInfo);
        notificationManager.updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress);
    }

    completeOperationItem(operationInfo, itemIndex, commonProgress) {
        const notificationManager = this._getNotificationManager(operationInfo);
        notificationManager.completeOperationItem(operationInfo, itemIndex, commonProgress);
    }

    completeOperation(operationInfo, commonText, isError, statusText) {
        const notificationManager = this._getNotificationManager(operationInfo);
        if(!isError) {
            this._showPopup(commonText);
        }

        notificationManager.completeOperation(operationInfo, commonText, isError, statusText);

        if(!this._isProgressDrawerOpened() || !notificationManager.hasNoOperations()) {
            notificationManager.updateActionProgressStatus(operationInfo);
        }
    }

    completeSingleOperationWithError(operationInfo, errorInfo) {
        const notificationManager = this._getNotificationManager(operationInfo);
        notificationManager.completeSingleOperationWithError(operationInfo, errorInfo);
        this._showPopupError(errorInfo);
    }

    addOperationDetailsError(operationInfo, errorInfo) {
        const notificationManager = this._getNotificationManager(operationInfo);
        notificationManager.addOperationDetailsError(operationInfo, errorInfo);
        this._showPopupError(errorInfo);
    }

    _hideProgressPanel() {
        setTimeout(() => this._progressDrawer.hide());
    }

    _isSmallScreen() {
        if(!hasWindow()) {
            return false;
        }
        return $(window).width() <= ADAPTIVE_STATE_SCREEN_WIDTH;
    }

    _dimensionChanged(dimension) {
        const notificationManager = this._getNotificationManager();
        if(!(dimension && dimension === 'height') && notificationManager.handleDimensionChanged()) {
            this._checkAdaptiveState();
        }
    }

    _checkAdaptiveState() {
        const oldState = this._isInAdaptiveState;
        this._isInAdaptiveState = this._isSmallScreen();
        if(this._progressDrawer && oldState !== this._isInAdaptiveState) {
            const options = this._getProgressDrawerAdaptiveOptions();
            this._progressDrawer.option(options);
        }
    }

    _getProgressDrawerAdaptiveOptions() {
        if(this._isInAdaptiveState) {
            return {
                openedStateMode: 'overlap',
                shading: true,
                closeOnOutsideClick: true
            };
        } else {
            return {
                openedStateMode: 'shrink',
                shading: false,
                closeOnOutsideClick: false
            };
        }
    }

    _ensureProgressPanelCreated(container) {
        const notificationManager = this._getNotificationManager();
        notificationManager.ensureProgressPanelCreated(container, {
            onOperationCanceled: ({ info }) => this._raiseOperationCanceled(info),
            onOperationItemCanceled: ({ item, itemIndex }) => this._raiseOperationItemCanceled(item, itemIndex),
            onPanelClosed: () => this._hideProgressPanel()
        });
    }

    // needed for editingProgress.tests.js
    _getProgressManagerComponent() {
        return NotificationManager;
    }

    _isProgressDrawerDisabled() {
        return !this.option('showProgressPanel');
    }

    _isProgressDrawerOpened() {
        return this._progressDrawer.option('opened');
    }

    _hidePopup(forceHide) {
        if(!this.option('showNotificationPopup') && !forceHide) {
            return;
        }
        this._getNotificationPopup().hide();
    }

    _showPopup(content, errorMode) {
        if(this._isProgressDrawerOpened() || !this.option('showNotificationPopup')) {
            return;
        }
        this._getNotificationPopup().$wrapper().toggleClass(FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS, !!errorMode);
        this._getNotificationPopup().option('contentTemplate', content);
        if(!this._getNotificationPopup().option('visible')) {
            this._getNotificationPopup().show();
        }
    }

    _showPopupError(errorInfo) {
        if(!this.option('showNotificationPopup')) {
            return;
        }
        const notificationManager = this._getNotificationManager();
        const $content = $('<div>');

        const $message = $('<div>')
            .addClass(FILE_MANAGER_NOTIFICATION_COMMON_CLASS)
            .text(errorInfo.commonErrorText);

        const $separator = $('<div>').addClass(FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS);
        $('<div>').appendTo($separator);

        const $details = $('<div>').addClass(FILE_MANAGER_NOTIFICATION_DETAILS_CLASS);

        if(errorInfo.item) {
            notificationManager.createErrorDetailsProgressBox($details, errorInfo.item, errorInfo.detailErrorText);
        } else {
            $message.addClass(FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS);
            notificationManager.renderError($details, errorInfo.detailErrorText);
        }

        $content.append($message, $separator, $details);

        this._showPopup($content, true);
    }

    _getNotificationPopup() {
        if(!this._notificationPopup) {
            const $popup = $('<div>')
                .addClass(FILE_MANAGER_NOTIFICATION_POPUP_CLASS)
                .appendTo(this.$element());

            this._notificationPopup = this._createComponent($popup, Popup, {
                container: this.$element(),
                width: 'auto',
                height: 'auto',
                showTitle: false,
                dragEnabled: false,
                shading: false,
                visible: false,
                closeOnOutsideClick: true,
                animation: { duration: 0 },
                position: {
                    my: 'right top',
                    at: 'right top',
                    of: this.option('positionTarget'),
                    offset: '-10 -5'
                }
            });
        }
        return this._notificationPopup;
    }

    _raiseActionProgress(message, status) {
        this._actions.onActionProgress({ message, status });
    }

    _raiseOperationCanceled(info) {
        this._actions.onOperationCanceled({ info });
    }

    _raiseOperationItemCanceled(item, index) {
        this._actions.onOperationItemCanceled({ item, itemIndex: index });
    }

    _initActions() {
        this._actions = {
            onActionProgress: this._createActionByOption('onActionProgress'),
            onOperationCanceled: this._createActionByOption('onOperationCanceled'),
            onOperationItemCanceled: this._createActionByOption('onOperationItemCanceled')
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            progressPanelContainer: null,
            contentTemplate: null,
            onActionProgress: null,
            onOperationCanceled: null,
            onOperationItemCanceled: null,
            showProgressPanel: true,
            showNotificationPopup: true
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'progressPanelContainer':
            case 'contentTemplate':
                break;
            case 'showProgressPanel':
                this._setNotificationManager();
                this._getNotificationManager().updateActionProgressStatus();
                if(!args.value) {
                    this._hideProgressPanel();
                    this._clearManagerMap();
                }
                this._progressDrawer.repaint();
                break;
            case 'showNotificationPopup':
                if(!args.value) {
                    this._hidePopup(true);
                }
                break;
            case 'onActionProgress':
            case 'onOperationCanceled':
            case 'onOperationItemCanceled':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}
