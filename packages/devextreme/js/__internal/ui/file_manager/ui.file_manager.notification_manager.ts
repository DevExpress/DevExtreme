/* eslint-disable @typescript-eslint/explicit-module-boundary-types,max-classes-per-file */
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import FileManagerProgressPanel from '@ts/ui/file_manager/ui.file_manager.notification.progress_panel';

const FILE_MANAGER_PROGRESS_BOX_CLASS = 'dx-filemanager-progress-box';
const FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-error`;
const FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-image`;
const FILE_MANAGER_PROGRESS_BOX_WRAPPER_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-wrapper`;
const FILE_MANAGER_PROGRESS_BOX_COMMON_CLASS = `${FILE_MANAGER_PROGRESS_BOX_CLASS}-common`;

const MANAGER_ID_NAME = '__operationInfoManager';
const ACTION_PROGRESS_STATUS = {
  default: 'default',
  progress: 'progress',
  error: 'error',
  success: 'success',
};

class NotificationManagerBase {
  _id: string;

  _isActual: boolean;

  _actionProgressStatus: string;

  _raiseActionProgress: (message: string, status: string) => void;

  constructor({ onActionProgressStatusChanged, isActual }) {
    this._id = new Guid().toString();
    this._isActual = isActual || false;
    this._actionProgressStatus = ACTION_PROGRESS_STATUS.default;
    this._raiseActionProgress = onActionProgressStatusChanged;
  }

  getId(): string {
    return this._id;
  }

  isActual(): boolean {
    return this._isActual;
  }

  createErrorDetailsProgressBox($container, item, errorText): void {
    const detailsItem = this._createDetailsItem($container, item);
    this.renderError(detailsItem.$wrapper, errorText);
  }

  renderError($container, errorText): void {
    $('<div>')
      .text(errorText)
      .addClass(FILE_MANAGER_PROGRESS_BOX_ERROR_CLASS)
      .appendTo($container);
  }

  isActionProgressStatusDefault(): boolean {
    return this._actionProgressStatus === ACTION_PROGRESS_STATUS.default;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createDetailsItem($container, item) {
    const $detailsItem = $('<div>').appendTo($container);
    return this._createProgressBox($detailsItem, {
      commonText: item.commonText,
      imageUrl: item.imageUrl,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createProgressBox($container, options) {
    $container.addClass(FILE_MANAGER_PROGRESS_BOX_CLASS);

    if (options.imageUrl) {
      getImageContainer(options.imageUrl)
        ?.addClass(FILE_MANAGER_PROGRESS_BOX_IMAGE_CLASS)
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
      $commonText,
      $element: $container,
      $wrapper,
    };
  }
}

class NotificationManagerStub extends NotificationManagerBase {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  addOperation() {
    return {
      [MANAGER_ID_NAME]: this._id,
    };
  }

  addOperationDetails(): void {}

  updateOperationItemProgress(): void {}

  completeOperationItem(): void {}

  finishOperation(): void {}

  completeOperation(): void {}

  completeSingleOperationWithError(): void {}

  addOperationDetailsError(): void {}

  handleDimensionChanged(): boolean {
    return false;
  }

  ensureProgressPanelCreated(): void {}

  tryHideActionProgress(): void {
    this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
  }

  updateActionProgressStatus(): void {
    this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
  }

  _updateActionProgress(message, status): void {
    if (
      status !== ACTION_PROGRESS_STATUS.default
      && status !== ACTION_PROGRESS_STATUS.progress
    ) {
      return;
    }
    this._actionProgressStatus = status;
    this._raiseActionProgress(message, status);
  }

  hasNoOperations(): boolean {
    return true;
  }

  get _operationInProgressCount(): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set _operationInProgressCount(_value: number) {}

  get _failedOperationCount(): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set _failedOperationCount(_value: number) {}
}

class NotificationManager extends NotificationManagerBase {
  _progressPanel?: FileManagerProgressPanel;

  _operationInProgressCountInternal!: number;

  _failedOperationCountInternal!: number;

  constructor(options) {
    super(options);

    this._failedOperationCount = 0;
    this._operationInProgressCount = 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
    this._operationInProgressCount += 1;
    const operationInfo = this._progressPanel?.addOperation(
      processingMessage,
      allowCancel,
      allowProgressAutoUpdate,
    );
    operationInfo[MANAGER_ID_NAME] = this._id;
    this._updateActionProgress(
      processingMessage,
      ACTION_PROGRESS_STATUS.progress,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return operationInfo;
  }

  addOperationDetails(operationInfo, details, showCloseButton): void {
    this._progressPanel?.addOperationDetails(
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
    this._progressPanel?.updateOperationItemProgress(
      operationInfo,
      itemIndex,
      itemProgress,
      commonProgress,
    );
  }

  completeOperationItem(operationInfo, itemIndex, commonProgress): void {
    this._progressPanel?.completeOperationItem(
      operationInfo,
      itemIndex,
      commonProgress,
    );
  }

  finishOperation(operationInfo, commonProgress): void {
    this._progressPanel?.updateOperationCommonProgress(
      operationInfo,
      commonProgress,
    );
  }

  completeOperation(operationInfo, commonText, isError, statusText): void {
    this._operationInProgressCount -= 1;
    if (isError) {
      this._failedOperationCount += 1;
    }
    this._progressPanel?.completeOperation(
      operationInfo,
      commonText,
      isError,
      statusText,
    );
  }

  completeSingleOperationWithError(operationInfo, errorInfo): void {
    this._progressPanel?.completeSingleOperationWithError(
      operationInfo,
      errorInfo.detailErrorText,
    );
    this._notifyError(errorInfo);
  }

  addOperationDetailsError(operationInfo, errorInfo): void {
    this._progressPanel?.addOperationDetailsError(
      operationInfo,
      errorInfo.itemIndex,
      errorInfo.detailErrorText,
    );
    this._notifyError(errorInfo);
  }

  handleDimensionChanged(): boolean {
    if (this._progressPanel) {
      this._progressPanel.$element().detach();
    }
    return true;
  }

  ensureProgressPanelCreated(container, options): void {
    if (!this._progressPanel) {
      const $progressPanelElement = $('<div>').appendTo(container);
      const ProgressPanelClass = this._getProgressPanelComponent();
      this._progressPanel = new ProgressPanelClass(
        // @ts-expect-error ts-error
        $progressPanelElement,
        extend({}, options, {
          onOperationClosed: ({ info }) => this._onProgressPanelOperationClosed(info),
        }),
      );
    } else {
      this._progressPanel.$element().appendTo(container);
    }
  }

  // needed for editingProgress.tests.js
  _getProgressPanelComponent(): typeof FileManagerProgressPanel {
    return FileManagerProgressPanel;
  }

  _onProgressPanelOperationClosed(operationInfo): void {
    if (operationInfo.hasError) {
      this._failedOperationCount -= 1;
      this.tryHideActionProgress();
    }
  }

  tryHideActionProgress(): void {
    if (this.hasNoOperations()) {
      this._updateActionProgress('', ACTION_PROGRESS_STATUS.default);
    }
  }

  updateActionProgressStatus(operationInfo): void {
    if (operationInfo) {
      const status = this._failedOperationCount === 0
        ? ACTION_PROGRESS_STATUS.success
        : ACTION_PROGRESS_STATUS.error;
      this._updateActionProgress('', status);
    }
  }

  _notifyError(errorInfo): void {
    const status = this.hasNoOperations()
      ? ACTION_PROGRESS_STATUS.default
      : ACTION_PROGRESS_STATUS.error;
    this._updateActionProgress(errorInfo.commonErrorText, status);
  }

  _updateActionProgress(message, status): void {
    this._actionProgressStatus = status;
    this._raiseActionProgress(message, status);
  }

  hasNoOperations(): boolean {
    return (
      this._operationInProgressCount === 0 && this._failedOperationCount === 0
    );
  }

  get _operationInProgressCount(): number {
    return this._operationInProgressCountInternal;
  }

  set _operationInProgressCount(value: number) {
    this._operationInProgressCountInternal = value;
  }

  get _failedOperationCount(): number {
    return this._failedOperationCountInternal;
  }

  set _failedOperationCount(value: number) {
    this._failedOperationCountInternal = value;
  }
}

export { MANAGER_ID_NAME, NotificationManager, NotificationManagerStub };
