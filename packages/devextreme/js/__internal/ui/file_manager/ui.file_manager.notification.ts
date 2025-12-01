/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getWidth } from '@js/core/utils/size';
import { isFunction } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import Drawer from '@js/ui/drawer';
import Popup from '@js/ui/popup/ui.popup';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import {
  MANAGER_ID_NAME,
  NotificationManager,
  NotificationManagerStub,
} from '@ts/ui/file_manager/ui.file_manager.notification_manager';

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

interface FileManagerNotificationControlActions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionProgress?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationCanceled?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationItemCanceled: (e?: any) => void;
}

interface FileManagerNotificationControlOptions extends WidgetProperties {
  progressPanelContainer?: dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentTemplate?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionProgress?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationCanceled?: (e?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOperationItemCanceled?: (e?: any) => void;
  showProgressPanel?: boolean;
  showNotificationPopup?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  positionTargetSelector?: any;
}

class FileManagerNotificationControl extends Widget<FileManagerNotificationControlOptions> {
  _isInAdaptiveState?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _managerMap!: Record<string, any>;

  _notificationManagerStubId?: string | null;

  _progressDrawer?: Drawer;

  _notificationPopup?: Popup;

  _actions!: FileManagerNotificationControlActions;

  _initMarkup(): void {
    super._initMarkup();

    this._initActions();

    this._isInAdaptiveState = this._isSmallScreen();
    this._managerMap = {};
    this._notificationManagerStubId = null;

    const { progressPanelContainer } = this.option();

    this._setNotificationManager();
    const $progressDrawer = $('<div>')
      .addClass(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS)
      .appendTo($(progressPanelContainer));

    $('<div>')
      .addClass(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS)
      .appendTo($progressDrawer);

    const drawerOptions = extend(
      {
        opened: false,
        position: 'right',
        template: (container) => this._ensureProgressPanelCreated(container),
      },
      this._getProgressDrawerAdaptiveOptions(),
    );

    this._progressDrawer = this._createComponent(
      $progressDrawer,
      Drawer,
      drawerOptions,
    );

    const $drawerContent = $progressDrawer
      .find(`.${FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS}`)
      .first();

    const contentRenderer = this.option('contentTemplate');
    if (isFunction(contentRenderer)) {
      contentRenderer($drawerContent, this);
    }
  }

  _setNotificationManager(options?): void {
    // eslint-disable-next-line no-param-reassign
    options = extend(
      {
        onActionProgressStatusChanged: this._raiseActionProgress.bind(this),
      },
      options,
    );
    if (!this._notificationManagerStubId) {
      const stubManager = new NotificationManagerStub(options);
      this._notificationManagerStubId = stubManager.getId();
      this._managerMap[this._notificationManagerStubId] = stubManager;
    }
    if (!this._isProgressDrawerDisabled()) {
      const notificationManagerComponent = this._getProgressManagerComponent();
      options.isActual = true;
      // eslint-disable-next-line new-cap
      const defaultManager = new notificationManagerComponent(options);
      this._managerMap[defaultManager.getId()] = defaultManager;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getNotificationManager(operationInfo?) {
    const actualManagerId = operationInfo?.[MANAGER_ID_NAME]
      || this._getActualNotificationManagerId();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      this._managerMap[actualManagerId]
      || this._managerMap[this._notificationManagerStubId as string]
    );
  }

  _clearManagerMap(): void {
    const stubManager = this._managerMap[this._notificationManagerStubId as string];
    // @ts-expect-error ts-error
    delete this._managerMap;
    this._managerMap = { [this._notificationManagerStubId as string]: stubManager };
  }

  _getActualNotificationManagerId(): string {
    return Object.keys(this._managerMap)
      .filter((managerId) => this._managerMap[managerId].isActual())[0];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  tryShowProgressPanel() {
    // @ts-expect-error ts-error
    const promise = new Deferred();
    const notificationManager = this._getNotificationManager();
    if (
      notificationManager.isActionProgressStatusDefault()
      || this._isProgressDrawerOpened()
      || this._isProgressDrawerDisabled()
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return promise.resolve().promise();
    }

    // eslint-disable-next-line no-restricted-globals
    setTimeout((): void => {
      // @ts-expect-error ts-error
      this._progressDrawer?.show().done(promise.resolve);
      this._hidePopup();
      notificationManager.tryHideActionProgress();
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return promise.promise();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
    const notificationManager = this._getNotificationManager();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return notificationManager.addOperation(
      processingMessage,
      allowCancel,
      allowProgressAutoUpdate,
    );
  }

  addOperationDetails(operationInfo, details, showCloseButton): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.addOperationDetails(
      operationInfo,
      details,
      showCloseButton,
    );
  }

  updateOperationItemProgress(
    operationInfo,
    itemIndex,
    itemProgress,
    commonProgress,
  ): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.updateOperationItemProgress(
      operationInfo,
      itemIndex,
      itemProgress,
      commonProgress,
    );
  }

  completeOperationItem(operationInfo, itemIndex, commonProgress): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.completeOperationItem(
      operationInfo,
      itemIndex,
      commonProgress,
    );
  }

  finishOperation(operationInfo, commonProgress): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.finishOperation(operationInfo, commonProgress);
  }

  completeOperation(operationInfo, commonText, isError, statusText): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    if (!isError) {
      this._showPopup(commonText);
    }

    notificationManager.completeOperation(
      operationInfo,
      commonText,
      isError,
      statusText,
    );

    if (
      !this._isProgressDrawerOpened()
      || !notificationManager.hasNoOperations()
    ) {
      notificationManager.updateActionProgressStatus(operationInfo);
    } else {
      notificationManager.tryHideActionProgress();
    }
  }

  completeSingleOperationWithError(operationInfo, errorInfo): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.completeSingleOperationWithError(
      operationInfo,
      errorInfo,
    );
    this._showPopupError(errorInfo);
  }

  addOperationDetailsError(operationInfo, errorInfo): void {
    const notificationManager = this._getNotificationManager(operationInfo);
    notificationManager.addOperationDetailsError(operationInfo, errorInfo);
    this._showPopupError(errorInfo);
  }

  _hideProgressPanel(): void {
    // eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-misused-promises
    setTimeout(() => this._progressDrawer?.hide());
  }

  _isSmallScreen(): boolean {
    if (!hasWindow()) {
      return false;
    }
    return getWidth(window) <= ADAPTIVE_STATE_SCREEN_WIDTH;
  }

  _dimensionChanged(dimension?): void {
    if (!(dimension && dimension === 'height')) {
      this._checkAdaptiveState();
    }
  }

  _checkAdaptiveState(): void {
    const oldState = this._isInAdaptiveState;
    this._isInAdaptiveState = this._isSmallScreen();
    if (oldState !== this._isInAdaptiveState && this._progressDrawer) {
      const notificationManager = this._getNotificationManager();
      if (notificationManager.handleDimensionChanged()) {
        const options = this._getProgressDrawerAdaptiveOptions();
        // @ts-expect-error ts-error
        this._progressDrawer.option(options);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getProgressDrawerAdaptiveOptions() {
    if (this._isInAdaptiveState) {
      return {
        openedStateMode: 'overlap',
        shading: true,
        hideOnOutsideClick: true,
      };
    }
    return {
      openedStateMode: 'shrink',
      shading: false,
      hideOnOutsideClick: false,
    };
  }

  _ensureProgressPanelCreated(container): void {
    const notificationManager = this._getNotificationManager();
    notificationManager.ensureProgressPanelCreated(container, {
      onOperationCanceled: ({ info }) => this._raiseOperationCanceled(info),
      // eslint-disable-next-line @stylistic/max-len
      onOperationItemCanceled: ({ item, itemIndex }) => this._raiseOperationItemCanceled(item, itemIndex),
      onPanelClosed: () => this._hideProgressPanel(),
    });
  }

  // needed for editingProgress.tests.js
  _getProgressManagerComponent(): typeof NotificationManager {
    return NotificationManager;
  }

  _isProgressDrawerDisabled(): boolean {
    const { showProgressPanel } = this.option();
    return !showProgressPanel;
  }

  _isProgressDrawerOpened(): boolean | undefined {
    const { opened } = this._progressDrawer?.option() ?? {};
    return opened;
  }

  _hidePopup(forceHide?): void {
    const { showNotificationPopup } = this.option();
    if (!showNotificationPopup && !forceHide) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._getNotificationPopup().hide();
  }

  _showPopup(content, errorMode?): void {
    const { showNotificationPopup } = this.option();
    if (this._isProgressDrawerOpened() || !showNotificationPopup) {
      return;
    }
    this._getNotificationPopup()
      .$wrapper()
      ?.toggleClass(FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS, !!errorMode);
    this._getNotificationPopup().option('contentTemplate', content);
    const { visible } = this._getNotificationPopup().option();
    if (!visible) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._getNotificationPopup().show();
    }
  }

  _showPopupError(errorInfo): void {
    const { showNotificationPopup } = this.option();
    if (!showNotificationPopup) {
      return;
    }
    const notificationManager = this._getNotificationManager();
    const $content = $('<div>');

    const $message = $('<div>')
      .addClass(FILE_MANAGER_NOTIFICATION_COMMON_CLASS)
      .text(errorInfo.commonErrorText);

    const $separator = $('<div>').addClass(
      FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS,
    );
    $('<div>').appendTo($separator);

    const $details = $('<div>').addClass(
      FILE_MANAGER_NOTIFICATION_DETAILS_CLASS,
    );

    if (errorInfo.item) {
      notificationManager.createErrorDetailsProgressBox(
        $details,
        errorInfo.item,
        errorInfo.detailErrorText,
      );
    } else {
      $message.addClass(FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS);
      notificationManager.renderError($details, errorInfo.detailErrorText);
    }

    // @ts-expect-error ts-error
    $content.append($message, $separator, $details);

    this._showPopup($content, true);
  }

  _getNotificationPopup(): Popup {
    if (!this._notificationPopup) {
      const $popup = $('<div>').appendTo(this.$element());

      const { positionTargetSelector } = this.option();

      this._notificationPopup = this._createComponent($popup, Popup, {
        // @ts-expect-error ts-error
        container: this.$element(),
        width: 'auto',
        height: 'auto',
        showTitle: false,
        dragEnabled: false,
        shading: false,
        visible: false,
        hideOnOutsideClick: true,
        // @ts-expect-error ts-error
        animation: { duration: 0 },
        position: {
          my: 'right top',
          at: 'right top',
          // @ts-expect-error ts-error
          of: this._progressDrawer?.$element()
            .find(positionTargetSelector),
          offset: '-10 -5',
        },
        _wrapperClassExternal: FILE_MANAGER_NOTIFICATION_POPUP_CLASS,
      });
    }
    return this._notificationPopup;
  }

  _raiseActionProgress(message, status): void {
    this._actions.onActionProgress?.({ message, status });
  }

  _raiseOperationCanceled(info): void {
    this._actions.onOperationCanceled?.({ info });
  }

  _raiseOperationItemCanceled(item, index): void {
    this._actions.onOperationItemCanceled?.({ item, itemIndex: index });
  }

  _initActions(): void {
    this._actions = {
      onActionProgress: this._createActionByOption('onActionProgress'),
      onOperationCanceled: this._createActionByOption('onOperationCanceled'),
      onOperationItemCanceled: this._createActionByOption(
        'onOperationItemCanceled',
      ),
    };
  }

  _getDefaultOptions(): FileManagerNotificationControlOptions {
    return {
      ...super._getDefaultOptions(),
      progressPanelContainer: undefined,
      contentTemplate: undefined,
      onActionProgress: undefined,
      onOperationCanceled: undefined,
      onOperationItemCanceled: undefined,
      showProgressPanel: true,
      showNotificationPopup: true,
    };
  }

  _optionChanged(args): void {
    const { name } = args;

    switch (name) {
      case 'progressPanelContainer':
      case 'contentTemplate':
        break;
      case 'showProgressPanel':
        this._setNotificationManager();
        this._getNotificationManager().updateActionProgressStatus();
        if (!args.value) {
          this._hideProgressPanel();
          this._clearManagerMap();
        }
        this._progressDrawer?.repaint();
        break;
      case 'showNotificationPopup':
        if (!args.value) {
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

export default FileManagerNotificationControl;
