/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import messageLocalization from '@js/common/core/localization/message';
import { createObjectWithChanges } from '@js/common/data/array_utils';
import type { GridsEditMode } from '@js/common/grids';
import type { DxElement } from '@js/core/element';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { deferUpdate, equalByValue, getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  getOuterHeight, getOuterWidth, getWidth, setHeight,
} from '@js/core/utils/size';
import { encodeHtml } from '@js/core/utils/string';
import { isDefined, isEmptyObject, isObject } from '@js/core/utils/type';
import type { EventInfo } from '@js/events';
import Button from '@js/ui/button';
import LoadIndicator from '@js/ui/load_indicator';
import Overlay from '@js/ui/overlay/ui.overlay';
import { current, isFluent } from '@js/ui/themes';
import ValidationEngine from '@js/ui/validation_engine';
import type { ValidationResult as GroupValidationResult } from '@js/ui/validation_group';
import type { InitializedEvent } from '@js/ui/validator';
import Validator from '@js/ui/validator';
import errors from '@js/ui/widget/ui.errors';
import { Deferred, fromPromise, when } from '@ts/core/utils/deferred';
import { focused } from '@ts/core/utils/selectors';
import type Widget from '@ts/core/widget/widget';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type {
  DataChange, GeneratedItem, ItemProcessingOptions, ProcessedItem,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import {
  DATA_CHANGE_TYPE, EDIT_MODE, EDITORS_INPUT_SELECTOR, EDITORS_TEXTAREA_SELECTOR, INSERT_INDEX,
} from '@ts/grids/grid_core/editing/const';
import { isCellBasedEditMode, isFormBasedEditMode } from '@ts/grids/grid_core/editing/editing_utils';
import type {
  AddChangeOptions,
  CellBasedEditingController,
  EditFormDetailOptions,
  EditFormOptions,
  EditingChange,
  EditingChangeParams,
  EditingChangesOptionChanged,
  EditingRowsViewExtension,
  EditorCellOptions,
  FormBasedEditingControllerExtension,
  PrepareEditCellOptions,
} from '@ts/grids/grid_core/editing/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type { ErrorHandlingViewController } from '@ts/grids/grid_core/error_handling/error_handling_view_controller';
import { CLASSES as MASTER_DETAIL_CLASSES } from '@ts/grids/grid_core/master_detail/const';
import modules from '@ts/grids/grid_core/modules/modules';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { PositioningEvent } from '@ts/ui/overlay/overlay';
import type { ValidationResultInternal } from '@ts/ui/validation_engine';
import type InternalValidator from '@ts/ui/validator';

import {
  INVALIDATE_CLASS,
  VALIDATION_CANCELLED,
  VALIDATION_STATUS,
  validationResultIsValid,
} from './const';
import type {
  BrokenRule,
  CellValidationAdapter,
  CellValidationParams,
  CellValidationResultData,
  CellValidationResultValue,
  RowValidatingParams,
  ValidatingCellOptions,
  ValidatingEditingController,
  ValidatingEditingControllerExtension,
  ValidatingEditorFactory,
  ValidatingEditorFactoryExtension,
  ValidationData,
  ValidationMessagePosition,
  ValidatorDataGetterResult,
  ValidatorResult,
} from './types';

const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const INVALID_MESSAGE_CLASS = 'dx-invalid-message';
const INVALID_MESSAGE_ID = 'dxInvalidMessage';
const WIDGET_INVALID_MESSAGE_CLASS = 'invalid-message';
const INVALID_MESSAGE_ALWAYS_CLASS = 'dx-invalid-message-always';
const REVERT_BUTTON_CLASS = 'dx-revert-button';
const REVERT_BUTTON_ID = 'dxRevertButton';
const VALIDATOR_CLASS = 'validator';
const PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const VALIDATION_PENDING_CLASS = 'dx-validation-pending';

const PADDING_BETWEEN_TOOLTIPS = 2;

const COMMAND_TRANSPARENT = 'transparent';

const cellValueShouldBeValidated = (
  value: unknown,
  rowOptions: ProcessedItem | undefined,
): boolean => value !== undefined || (!!rowOptions && !rowOptions.isNewRow);

const getValidationGroup = (validator: InternalValidator): ValidationData => {
  // @ts-expect-error the grid's validators get a ValidationData group
  const validationGroup: ValidationData = validator.option('validationGroup');
  return validationGroup;
};

const getValidatorData = (validator: InternalValidator): ValidatorDataGetterResult => {
  // @ts-expect-error the grid's validators get a dataGetter that returns the column
  const validatorData: ValidatorDataGetterResult = validator.option('dataGetter')();
  return validatorData;
};

export class ValidatingController extends modules.Controller {
  private _isValidationInProgress = false;

  private _disableApplyValidationResults = false;

  private _editingController!: ValidatingEditingController;

  private _editorFactoryController!: ValidatingEditorFactory;

  private _columnsController!: ColumnsController;

  public _validationState!: ValidationData[];

  private _validationStateCache!: Record<string, ValidationData>;

  private _currentCellValidator?: InternalValidator | null;

  public init(): void {
    this._editingController = this.getController('editing') as ValidatingEditingController;
    this._editorFactoryController = this.getController('editorFactory') as ValidatingEditorFactory;
    this._columnsController = this.getController('columns');
    this.createAction('onRowValidating');

    if (!this._validationState) {
      this.initValidationState();
    }
  }

  public initValidationState(): void {
    this._validationState = [];
    this._validationStateCache = {};
  }

  public resetValidationStateForChanges(changes: EditingChange[]): void {
    if (!changes?.length) {
      return;
    }

    changes.forEach(({ key }) => {
      this._removeValidationData(key);
    });
  }

  private _removeValidationData(key: RowKey): void {
    if (!this._validationState?.length) {
      return;
    }

    const keyHash = getKeyHash(key);
    const isObjectKeyHash = isObject(keyHash);

    if (!isObjectKeyHash && this._validationStateCache) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._validationStateCache[keyHash];
    }

    this._validationState = this._validationState.filter((data) => (
      isObjectKeyHash ? !equalByValue(data.key, key) : data.key !== key
    ));
  }

  public _rowIsValidated(change: EditingChange | null | undefined): boolean {
    const validationData = this.getValidationData(change?.key);

    return !!validationData && !!validationData.validated;
  }

  public getValidationData(key: RowKey, create: true): ValidationData;
  public getValidationData(key: RowKey, create?: boolean): ValidationData | undefined;
  public getValidationData(key: RowKey, create?: boolean): ValidationData | undefined {
    const keyHash = getKeyHash(key);
    const isObjectKeyHash = isObject(keyHash);
    let validationData: ValidationData | undefined = isObjectKeyHash
      ? this._validationState.find((data) => equalByValue(data.key, key))
      : this._validationStateCache[keyHash];

    if (!validationData && create) {
      validationData = { key, isValid: true };
      this._validationState.push(validationData);
      if (!isObjectKeyHash) {
        this._validationStateCache[keyHash] = validationData;
      }
    }

    return validationData;
  }

  private _getBrokenRules(
    validationData: ValidationData,
    validationResults: GroupValidationResult | undefined,
  ): BrokenRule[] | undefined {
    return validationResults
      ? validationResults.brokenRules
      : validationData.brokenRules ?? [];
  }

  private _rowValidating(
    validationData: ValidationData,
    validationResults: GroupValidationResult | undefined,
  ): DeferredObj<RowValidatingParams> {
    const deferred = Deferred<RowValidatingParams>();
    // @ts-expect-error the validated row always has a change
    const change: EditingChange = this._editingController.getChangeByKey(validationData?.key);
    const brokenRules = this._getBrokenRules(validationData, validationResults);
    const isValid = validationResults ? validationResults.isValid : validationData.isValid;
    const parameters: RowValidatingParams = {
      brokenRules,
      isValid,
      key: change.key,
      newData: change.data,
      oldData: this._editingController._getOldData(change.key),
      promise: null,
      errorText: this.getHiddenValidatorsErrorText(brokenRules),
    };

    this.executeAction('onRowValidating', parameters);

    when(fromPromise(parameters.promise)).always(() => {
      validationData.isValid = parameters.isValid;
      validationData.errorText = parameters.errorText;
      deferred.resolve(parameters);
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private getHiddenValidatorsErrorText(brokenRules: BrokenRule[] | undefined): string {
    const hiddenBrokenRules = (brokenRules ?? []).filter((brokenRule) => {
      const { column } = brokenRule;
      const isGroupExpandColumn = column
        && column.groupIndex !== undefined
        && !column.showWhenGrouped;
      const isVisibleColumn = column && column.visible;

      // @ts-expect-error the grid's broken rules come from its dxValidator instances
      return !brokenRule.validator.$element().parent().length
        && (!isVisibleColumn || isGroupExpandColumn);
    });

    return hiddenBrokenRules.map((brokenRule) => brokenRule.message).join(', ');
  }

  public validate(isFull?: boolean): DeferredObj<boolean | undefined> {
    let isValid: boolean | undefined = true;
    const deferred = Deferred<boolean | undefined>();
    const completeList: DeferredObj<RowValidatingParams>[] = [];

    const editMode = this._editingController.getEditMode();
    const isFullValidation = !!isFull || editMode === EDIT_MODE.row;

    if (this._isValidationInProgress) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.resolve(false).promise();
    }

    this._isValidationInProgress = true;
    if (isFullValidation) {
      this._editingController.addDeferred(deferred);
      const changes = this._editingController.getChanges();
      changes.forEach(({ type, key }) => {
        if (type !== DATA_CHANGE_TYPE.remove) {
          const validationData = this.getValidationData(key, true);
          const validationResult = this.validateGroup(validationData);
          completeList.push(validationResult);
          validationResult.done((rowValidatingParams) => {
            validationData.validated = true;
            isValid = isValid && rowValidatingParams.isValid;
          });
        }
      });
    } else if (this._currentCellValidator) {
      // @ts-expect-error the grid's validators get a ValidationData group
      const validationResult = this.validateGroup(this._currentCellValidator._findGroup());
      completeList.push(validationResult);
      validationResult.done((rowValidatingParams) => {
        isValid = rowValidatingParams.isValid;
      });
    }

    when(...completeList).done(() => {
      this._isValidationInProgress = false;
      deferred.resolve(isValid);
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private validateGroup(validationData: ValidationData): DeferredObj<RowValidatingParams> {
    const result = Deferred<RowValidatingParams>();
    const validateGroup = validationData && ValidationEngine.getGroupConfig(validationData);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
    let validationResult: GroupValidationResult | undefined;

    if (validateGroup?.validators.length) {
      this.resetRowValidationResults(validationData);
      validationResult = ValidationEngine.validateGroup(validationData);
    }

    // @ts-expect-error complete is typed as Promise but is a Deferred at runtime
    when<GroupValidationResult | undefined>(validationResult?.complete ?? validationResult)
      .done((completedResult) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        when(this._rowValidating(validationData, completedResult)).done(result.resolve);
      });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  private isRowDataModified(change: Partial<EditingChange>): boolean {
    return !isEmptyObject(change.data);
  }

  public updateValidationState(change: Partial<EditingChange>): void {
    const editMode = this._editingController.getEditMode();
    const { key } = change;
    const validationData = this.getValidationData(key, true);

    if (!isFormBasedEditMode(editMode)) {
      if (change.type === DATA_CHANGE_TYPE.insert && !this.isRowDataModified(change)) {
        validationData.isValid = true;
        return;
      }

      this._disableApplyValidationResults = true;
      const groupConfig = ValidationEngine.getGroupConfig(validationData);
      if (groupConfig) {
        const validationResult = ValidationEngine.validateGroup(validationData);
        // @ts-expect-error complete is typed as Promise but is a Deferred at runtime
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        when<GroupValidationResult>(validationResult.complete || validationResult)
          .done((completedResult) => {
            validationData.isValid = completedResult.isValid;
            validationData.brokenRules = completedResult.brokenRules;
          });
      } else if (!validationData.brokenRules?.length) {
        validationData.isValid = true;
      }
      this._disableApplyValidationResults = false;
    } else {
      validationData.isValid = true;
    }
  }

  public setValidator(validator: InternalValidator | null): void {
    this._currentCellValidator = validator;
  }

  private renderCellPendingIndicator($container: dxElementWrapper): void {
    let $indicator = $container.find(`.${PENDING_INDICATOR_CLASS}`);
    if (!$indicator.length) {
      const $indicatorContainer = $container;
      $indicator = $('<div>').appendTo($indicatorContainer)
        .addClass(PENDING_INDICATOR_CLASS);
      this._createComponent($indicator, LoadIndicator);
      $container.addClass(VALIDATION_PENDING_CLASS);
    }
  }

  private disposeCellPendingIndicator($container: dxElementWrapper): void {
    const $indicator = $container.find(`.${PENDING_INDICATOR_CLASS}`);
    if ($indicator.length) {
      // @ts-expect-error getInstance() is typed for Element
      const indicator = LoadIndicator.getInstance($indicator);
      if (indicator) {
        indicator.dispose();
        indicator.$element().remove();
      }
      $container.removeClass(VALIDATION_PENDING_CLASS);
    }
  }

  private validationStatusChanged(result: ValidatorResult): void {
    const { validator } = result;
    const validationGroup = getValidationGroup(validator);
    const { column } = getValidatorData(validator);

    this.updateCellValidationResult({
      rowKey: validationGroup.key,
      columnIndex: column.index,
      validationResult: result,
    });
  }

  private validatorInitialized(arg: InitializedEvent): void {
    // @ts-expect-error onInitialized always gets the component
    arg.component.on('validating', this.validationStatusChanged.bind(this));
    // @ts-expect-error onInitialized always gets the component
    arg.component.on('validated', this.validationStatusChanged.bind(this));
  }

  private validatorDisposing(arg: EventInfo<InternalValidator>): void {
    const validator = arg.component;
    const validationGroup: ValidationData | undefined = getValidationGroup(validator);
    const { column } = getValidatorData(validator);

    const result = this.getCellValidationResult({
      rowKey: validationGroup?.key,
      columnIndex: column.index,
    });
    if (validationResultIsValid(result) && result.status === VALIDATION_STATUS.pending) {
      this.cancelCellValidationResult({
        change: validationGroup,
        columnIndex: column.index,
      });
    }
  }

  private applyValidationResult(
    $container: dxElementWrapper | undefined,
    result: ValidatorResult,
  ): void {
    const { validator } = result;
    const validationGroup = getValidationGroup(validator);
    const { column } = getValidatorData(validator);

    if (result.brokenRules) {
      result.brokenRules.forEach((rule) => {
        rule.columnIndex = column.index;
        rule.column = column;
      });
    }
    if ($container) {
      const validationResult = this.getCellValidationResult({
        rowKey: validationGroup.key,
        columnIndex: column.index,
      });
      const requestIsDisabled = validationResultIsValid(validationResult)
        && validationResult.disabledPendingId === result.id;
      if (this._disableApplyValidationResults || requestIsDisabled) {
        return;
      }
      if (result.status === VALIDATION_STATUS.invalid) {
        const $focus = $container.find(':focus');
        if (!focused($focus)) {
          // @ts-expect-error eventsEngine.trigger is not fully typed
          eventsEngine.trigger($focus, 'focus');
          // @ts-expect-error eventsEngine.trigger is not fully typed
          eventsEngine.trigger($focus, pointerEvents.down);
        }
      }
      const editor = !column.editCellTemplate
        && this._editorFactoryController.getEditorInstance($container);
      if (result.status === VALIDATION_STATUS.pending) {
        if (editor) {
          editor.option('validationStatus', VALIDATION_STATUS.pending);
        } else {
          this.renderCellPendingIndicator($container);
        }
      } else if (editor) {
        editor.option('validationStatus', VALIDATION_STATUS.valid);
      } else {
        this.disposeCellPendingIndicator($container);
      }
      $container.toggleClass(
        this.addWidgetPrefix(INVALIDATE_CLASS),
        result.status === VALIDATION_STATUS.invalid,
      );
    }
  }

  private _syncInternalEditingData(parameters: EditorCellOptions): void {
    const change = this._editingController.getChangeByKey(parameters.key);
    const oldDataFromState = this._editingController._getOldData(parameters.key);
    const oldData = parameters.row?.oldData;

    if (change && oldData && !oldDataFromState) {
      this._editingController._addInternalData({ key: parameters.key, oldData });
    }
  }

  public createValidator(
    parameters: EditorCellOptions,
    $container?: dxElementWrapper,
  ): Validator | undefined {
    const { column } = parameters;

    if (
      isDefined(column.command)
      || !column.validationRules
      || !Array.isArray(column.validationRules)
      || !column.validationRules.length
    ) {
      return undefined;
    }

    const editIndex = this._editingController.getIndexByKey(
      parameters.key,
      this._editingController.getChanges(),
    );

    if (editIndex === -1) {
      let { showEditorAlways } = column;

      if (!showEditorAlways) {
        const visibleColumns = this._columnsController?.getVisibleColumns() ?? [];
        showEditorAlways = visibleColumns.some((visibleColumn) => visibleColumn.showEditorAlways);
      }

      const isEditRow = equalByValue(this.option('editing.editRowKey'), parameters.key);
      const isCellOrBatchEditingAllowed = isCellBasedEditMode(this._editingController.getEditMode())
        && this._editingController.allowUpdating({ row: parameters.row });

      const needCreateValidator = isEditRow || (isCellOrBatchEditingAllowed && showEditorAlways);

      if (isCellOrBatchEditingAllowed && showEditorAlways) {
        this._editingController._addInternalData({
          key: parameters.key,
          oldData: parameters.row?.oldData ?? parameters.data,
        });
      }

      if (!needCreateValidator) {
        return undefined;
      }
    }

    if ($container && !$container.length) {
      errors.log('E1050');
      return undefined;
    }

    this._syncInternalEditingData(parameters);
    const validationData = this.getValidationData(parameters.key, true);

    const getValue = (): unknown => {
      const change = this._editingController.getChangeByKey(validationData?.key);
      // @ts-expect-error createColumn initializes calculateCellValue
      const value: unknown = column.calculateCellValue(change?.data ?? {});
      return value !== undefined ? value : parameters.value;
    };

    const useDefaultValidator = $container?.hasClass('dx-widget');

    if ($container) {
      $container.addClass(this.addWidgetPrefix(VALIDATOR_CLASS));
    }

    // @ts-expect-error the Validator constructor is typed for Element
    const validator = new Validator($container ?? $('<div>'), {
      name: column.caption,
      validationRules: extend(true, [], column.validationRules),
      validationGroup: validationData,
      adapter: useDefaultValidator ? null : {
        getValue,
        applyValidationResults: (result: ValidatorResult): void => {
          this.applyValidationResult($container, result);
        },
      },
      dataGetter: (): ValidatorDataGetterResult => {
        const key = validationData?.key;
        const change = this._editingController.getChangeByKey(key);
        const oldData = this._editingController._getOldData(key);
        return {
          data: change
            ? createObjectWithChanges(oldData, change.data)
            : { ...(oldData ?? parameters.data) },
          // @ts-expect-error a grid column always has an index
          column,
        };
      },
      onInitialized: this.validatorInitialized.bind(this),
      onDisposing: this.validatorDisposing.bind(this),
    });

    if (useDefaultValidator) {
      const adapter = validator.option('adapter');
      if (adapter) {
        const originBypass = adapter.bypass;
        const defaultAdapterBypass = (): boolean | undefined => parameters.row?.isNewRow
          && !this._isValidationInProgress
          && !this._editingController.isCellModified(parameters);

        adapter.getValue = getValue;
        adapter.validationRequestsCallbacks = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- bypass is a Function
        adapter.bypass = (): boolean | undefined => originBypass?.call(adapter)
          || defaultAdapterBypass();
      }
    }

    return validator;
  }

  public isCurrentValidatorProcessing(
    { rowKey, columnIndex }: CellValidationParams,
  ): boolean | null | undefined {
    return this._currentCellValidator
      && equalByValue(getValidationGroup(this._currentCellValidator).key, rowKey)
      && getValidatorData(this._currentCellValidator).column.index === columnIndex;
  }

  public validateCell(validator: InternalValidator): DeferredObj<ValidationResultInternal> {
    const cellParams = {
      rowKey: getValidationGroup(validator).key,
      columnIndex: getValidatorData(validator).column.index,
      validationResult: null,
    };
    // @ts-expect-error validationResultIsValid() checks the restored result before it is read
    let validationResult: ValidationResultInternal = this.getCellValidationResult(cellParams);
    const stateRestored = validationResultIsValid(validationResult);

    // @ts-expect-error the grid's validators always have an adapter
    const adapter: CellValidationAdapter = validator.option('adapter');
    if (!stateRestored) {
      validationResult = validator.validate();
    } else {
      const currentCellValue = adapter.getValue();
      if (!equalByValue(currentCellValue, validationResult.value)) {
        validationResult = validator.validate();
      }
    }

    const deferred = Deferred<ValidationResultInternal>();

    if (stateRestored && validationResult.status === VALIDATION_STATUS.pending) {
      this.updateCellValidationResult(cellParams);
      adapter.applyValidationResults(validationResult);
    }

    // @ts-expect-error complete is typed as Promise but is a Deferred at runtime
    when<ValidationResultInternal>(validationResult.complete ?? validationResult)
      .done((completedResult) => {
        if (stateRestored) {
          adapter.applyValidationResults(completedResult);
        }
        deferred.resolve(completedResult);
      });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private updateCellValidationResult({
    rowKey, columnIndex, validationResult,
  }: CellValidationParams & { validationResult: ValidationResultInternal | null }): void {
    const validationData = this.getValidationData(rowKey);

    if (!validationData) {
      return;
    }

    validationData.validationResults ??= {};

    if (!validationResult) {
      const storedResult = validationData.validationResults[columnIndex];

      if (validationResultIsValid(storedResult) && storedResult.disabledPendingId) {
        delete storedResult.disabledPendingId;
      }
      return;
    }

    const result: CellValidationResultData = extend({}, validationResult);
    validationData.validationResults[columnIndex] = result;

    if (validationResult.status === VALIDATION_STATUS.pending) {
      if (this._editingController.getEditMode() === EDIT_MODE.cell) {
        result.deferred = Deferred<unknown>();
        // @ts-expect-error a pending result's complete is a Deferred
        result.complete.always(() => {
          // @ts-expect-error result is still the pending result here
          result.deferred.resolve();
        });
        this._editingController.addDeferred(result.deferred);
      }

      if (this._disableApplyValidationResults) {
        result.disabledPendingId = validationResult.id;
      }
    }
  }

  public getCellValidationResult(
    { rowKey, columnIndex }: CellValidationParams,
  ): CellValidationResultValue | undefined {
    const validationData = this.getValidationData(rowKey, true);
    return validationData?.validationResults?.[columnIndex];
  }

  public removeCellValidationResult({ change, columnIndex }: {
    change: EditingChange | undefined;
    columnIndex: number;
  }): void {
    const validationData = this.getValidationData(change?.key);

    if (validationData?.validationResults) {
      this.cancelCellValidationResult({ change, columnIndex });
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete validationData.validationResults[columnIndex];
    }
  }

  private cancelCellValidationResult({ change, columnIndex }: {
    change: { key: RowKey } | undefined;
    columnIndex: number;
  }): void {
    // @ts-expect-error callers cancel a result of a row that has validation data
    const validationData: ValidationData = this.getValidationData(change.key);

    if (change && validationData.validationResults) {
      const result = validationData.validationResults[columnIndex];
      if (validationResultIsValid(result)) {
        result.deferred?.reject(VALIDATION_CANCELLED);
        validationData.validationResults[columnIndex] = VALIDATION_CANCELLED;
      }
    }
  }

  private resetRowValidationResults(validationData: ValidationData | undefined): void {
    if (validationData) {
      if (validationData.validationResults) {
        delete validationData.validationResults;
      }
      delete validationData.validated;
    }
  }

  public isInvalidCell({ rowKey, columnIndex }: CellValidationParams): boolean {
    const result = this.getCellValidationResult({
      rowKey,
      columnIndex,
    });
    return validationResultIsValid(result) && result.status === VALIDATION_STATUS.invalid;
  }

  public getCellValidator(
    { rowKey, columnIndex }: CellValidationParams,
  ): InternalValidator | undefined {
    const validationData = this.getValidationData(rowKey);
    const groupConfig = validationData && ValidationEngine.getGroupConfig(validationData);
    const validators: InternalValidator[] | undefined = groupConfig?.validators;
    return validators?.find((v) => {
      const { column }: Partial<ValidatorDataGetterResult> = getValidatorData(v);
      return column ? column.index === columnIndex : false;
    });
  }

  public setCellValidationStatus(cellOptions: ValidatingCellOptions): void {
    const validationResult = this.getCellValidationResult({
      rowKey: cellOptions.key,
      // @ts-expect-error a grid column always has an index
      columnIndex: cellOptions.column.index,
    });

    if (isDefined(validationResult)) {
      cellOptions.validationStatus = validationResult !== VALIDATION_CANCELLED
        ? validationResult.status
        : VALIDATION_CANCELLED;
    } else {
      delete cellOptions.validationStatus;
    }
  }
}

export const validatingEditingExtender = (
  Base: ModuleType<CellBasedEditingController & FormBasedEditingControllerExtension>,
): ModuleType<
  CellBasedEditingController
  & FormBasedEditingControllerExtension
  & ValidatingEditingControllerExtension
> => class ValidateEditingControllerExtender extends Base {
  protected _errorHandlingController!: ErrorHandlingViewController;

  public init(): void {
    super.init();

    this._errorHandlingController = this.getController('errorHandling');
  }

  public processDataItemTreeListHack(item: GeneratedItem, options: ItemProcessingOptions): void {
    super.processDataItem(item, options);
  }

  public processItemsTreeListHack(items: RawItemData[], e: DataChange): RawItemData[] {
    return super.processItems(items, e);
  }

  protected _addChange(
    changeParams: EditingChangeParams,
    options?: AddChangeOptions,
  ): EditingChange {
    const change = super._addChange(changeParams, options);

    if (change && changeParams.type !== DATA_CHANGE_TYPE.remove) {
      this._validatingController.updateValidationState(change);
    }

    return change;
  }

  protected _handleChangesChange(args: EditingChangesOptionChanged): void {
    super._handleChangesChange(args);

    args.value.forEach((change) => {
      if (this._validatingController.getValidationData(change.key) === undefined) {
        this._validatingController.updateValidationState(change);
      }
    });
  }

  private _updateRowAndPageIndices(): void {
    const startInsertIndex = this.getView('rowsView').getTopVisibleItemIndex();
    let rowIndex = startInsertIndex;

    this.getChanges().forEach(({ key, type }) => {
      const validationData = this._validatingController.getValidationData(key);
      if (
        validationData
        && !validationData.isValid
        && validationData.pageIndex !== this._pageIndex
      ) {
        validationData.pageIndex = this._pageIndex;
        if (type === DATA_CHANGE_TYPE.insert) {
          validationData.rowIndex = startInsertIndex;
        } else {
          validationData.rowIndex = rowIndex;
        }
        rowIndex += 1;
      }
    });
  }

  public override getEditFormOptions(detailOptions: EditFormDetailOptions): EditFormOptions {
    return {
      validationGroup: this._validatingController.getValidationData(detailOptions.key, true),
      ...super.getEditFormOptions(detailOptions),
    };
  }

  protected _validateEditFormAfterUpdate(
    row: ProcessedItem,
    isCustomSetCellValue?: boolean,
  ): void {
    // T816256, T844143
    if (isCustomSetCellValue && this._editForm) {
      this._editForm.validate();
    }

    super._validateEditFormAfterUpdate(row, isCustomSetCellValue);
  }

  protected _prepareEditCell(parameters: PrepareEditCellOptions): boolean {
    const { column, item } = parameters;
    const isNotCanceled = super._prepareEditCell(parameters);
    const key = !item.isNewRow ? item.key : undefined;

    if (isNotCanceled && column.showEditorAlways) {
      this._validatingController.updateValidationState({ key });
    }

    return isNotCanceled;
  }

  public processItems(items: RawItemData[], change: DataChange): RawItemData[] {
    const changes = this.getChanges();
    const getIndexByChange = (
      editingChange: EditingChange,
      itemsToSearch: RawItemData[],
    ): number => {
      const isInsert = editingChange.type === DATA_CHANGE_TYPE.insert;
      const { key } = editingChange;

      return itemsToSearch.findIndex(
        (item) => equalByValue(key, isInsert ? item.key : this.dataSourceController.keyOf(item)),
      );
    };

    const processedItems = super.processItems(items, change);
    const itemsCount = processedItems.length;

    const addInValidItem = (
      editingChange: EditingChange,
      validationData: ValidationData,
    ): void => {
      const data: RawItemData = { key: editingChange.key };
      const index = getIndexByChange(editingChange, processedItems);

      if (index >= 0 || validationData.rowIndex === undefined) {
        return;
      }

      validationData.rowIndex = validationData.rowIndex > itemsCount
        ? validationData.rowIndex % itemsCount
        : validationData.rowIndex;
      const { rowIndex } = validationData;

      data[INSERT_INDEX] = 1;
      processedItems.splice(rowIndex, 0, data);
    };

    // @ts-expect-error change is the DataChange object, so it never equals a string
    if (this.getEditMode() === EDIT_MODE.batch && change !== 'prepend' && change !== 'append') {
      changes.forEach((editingChange) => {
        const { key } = editingChange;
        const validationData = this._validatingController.getValidationData(key);
        if (
          validationData
          && editingChange.type
          && validationData.pageIndex === this._pageIndex
          && this._pageIndex !== undefined
        ) {
          addInValidItem(editingChange, validationData);
        }
      });
    }

    return processedItems;
  }

  public processDataItem(item: GeneratedItem, options: ItemProcessingOptions): void {
    const isInserted = item.data[INSERT_INDEX];
    const key = isInserted ? item.data.key : item.key;
    const editMode = this.getEditMode();

    if (editMode === EDIT_MODE.batch && isInserted && key) {
      const changes = this.getChanges();
      const editIndex = gridCoreUtils.getIndexByKey(key, changes);

      if (editIndex >= 0) {
        const change = changes[editIndex];

        if (change.type !== DATA_CHANGE_TYPE.insert) {
          const oldData = this._getOldData(change.key);
          item.data = extend(true, {}, oldData, change.data);
          item.key = key;
        }
      }
    }

    super.processDataItem(item, options);
  }

  private _createInvisibleColumnValidators(changes: EditingChange[]): () => void {
    const columns = this._columnsController.getColumns();
    const invisibleColumns = this._columnsController.getInvisibleColumns()
      .filter((column) => !column.isBand);
    const groupColumns = this._columnsController.getGroupColumns()
      .filter((column) => !column.showWhenGrouped && !invisibleColumns.includes(column));
    const invisibleColumnValidators: Validator[] = [];
    const isCellVisible = (column: Column, rowKey: RowKey): boolean => (
      this._dataController.getRowIndexByKey(rowKey) >= 0 && !invisibleColumns.includes(column)
    );

    invisibleColumns.push(...groupColumns);

    if (!isFormBasedEditMode(this.getEditMode())) {
      columns.forEach((column) => {
        changes.forEach((change) => {
          // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the if-else
          let data: RawItemData | undefined;
          if (isCellVisible(column, change.key)) {
            return;
          }

          if (change.type === DATA_CHANGE_TYPE.insert) {
            data = change.data;
          } else if (change.type === DATA_CHANGE_TYPE.update) {
            const oldData = this._getOldData(change.key);

            if (!isDefined(oldData)) {
              return;
            }

            data = createObjectWithChanges(oldData, change.data);
          }
          if (data) {
            // @ts-expect-error invisible columns get validators without cell options
            const validator = this._validatingController.createValidator({
              column,
              key: change.key,
              // @ts-expect-error createColumn initializes calculateCellValue
              value: column.calculateCellValue(data),
            });
            if (validator) {
              invisibleColumnValidators.push(validator);
            }
          }
        });
      });
    }
    return function disposeInvisibleColumnValidators(): void {
      invisibleColumnValidators.forEach((validator) => { validator.dispose(); });
    };
  }

  protected _beforeSaveEditData(change?: EditingChange): boolean | DeferredObj<boolean> {
    let result = super._beforeSaveEditData(change);
    const validationData = this._validatingController.getValidationData(change?.key, true);

    if (change) {
      const isValid = change.type === DATA_CHANGE_TYPE.remove || validationData.isValid;
      result = result || !isValid;
    } else {
      const disposeValidators = this._createInvisibleColumnValidators(this.getChanges());
      const deferred = Deferred<boolean>();
      result = deferred;
      this.executeOperation(deferred, () => {
        this._validatingController.validate(true).done((isFullValid) => {
          disposeValidators();
          this._updateRowAndPageIndices();

          const editMode = this.getEditMode();

          if (editMode === EDIT_MODE.cell && !isFullValid) {
            this._focusEditingCell();
          } else if (editMode === EDIT_MODE.batch && !isFullValid) {
            this._resetEditRowKey();
            this._resetEditColumnName();
            this._dataController.updateItems();
          }
          deferred.resolve(!isFullValid);
        });
      });
    }
    // @ts-expect-error result is a boolean or a Deferred whose promise() is typed as Promise
    const saveResult: boolean | DeferredObj<boolean> = result.promise ? result.promise() : result;
    return saveResult;
  }

  /**
   * @param rowIndex Row index
   * @param columnIndex Column index
   * @param item Data item
   * @returns A deferred object that resolves to a boolean or just a boolean
   * to determine whether to cancel cell editing
   */
  public override beforeEditCell(
    rowIndex: number,
    columnIndex: number,
    item: ProcessedItem,
  ): DeferredObj<boolean> | boolean {
    const result = super.beforeEditCell(rowIndex, columnIndex, item);

    if (this.getEditMode() === EDIT_MODE.cell) {
      const $cell = this._rowsView._getCellElement(rowIndex, columnIndex);
      const validator = $cell?.data('dxValidator');
      const rowOptions = $cell?.closest(`.${VIEW_CLASSES.row}`).data('options');
      const value = validator?.option('adapter').getValue();
      if (validator && cellValueShouldBeValidated(value, rowOptions)) {
        const deferred = Deferred<boolean>();
        when<unknown>(this._validatingController.validateCell(validator), result)
          // @ts-expect-error when() resolves with the cell validation result and the base result
          .done((validationResult: ValidationResultInternal, isEditingAllowed: boolean) => {
            deferred.resolve(
              validationResult.status === VALIDATION_STATUS.valid && isEditingAllowed,
            );
          });
        // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value
        return deferred.promise();
      } if (!validator) {
        return result;
      }
    }
    return false;
  }

  protected _afterSaveEditData(cancel?: boolean): void {
    const isCellEditMode = this.getEditMode() === EDIT_MODE.cell;
    const $firstErrorRow = this.getChanges()
      .map((change) => this._showErrorRow(change))
      .find(isDefined);

    if ($firstErrorRow) {
      const scrollable = this._rowsView.getScrollable();
      if (scrollable) {
        scrollable.update();
        scrollable.scrollToElement($firstErrorRow);
      }
    }

    if (cancel && isCellEditMode && this._needUpdateRow()) {
      const editRowIndex = this.getEditRowIndex();

      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [editRowIndex],
      });
      this._focusEditingCell();
    } else if (!cancel) {
      const shouldResetValidationState = this._shouldResetValidationState();

      if (shouldResetValidationState) {
        this._validatingController.initValidationState();
      }
    }
  }

  protected _handleDataChanged(args: DataChange): void {
    const validationState = this._validatingController._validationState;

    if (this.option('scrolling.mode') === 'standard') {
      this.resetRowAndPageIndices();
    }

    if (args.changeType === 'prepend') {
      validationState.forEach((validationData) => {
        // @ts-expect-error a prepend change has items; an unset rowIndex becomes NaN
        validationData.rowIndex += args.items.length;
      });
    }

    super._handleDataChanged(args);
  }

  private resetRowAndPageIndices(): void {
    const validationState = this._validatingController._validationState;

    validationState.forEach((validationData) => {
      if (validationData.pageIndex !== this._pageIndex) {
        delete validationData.pageIndex;
        delete validationData.rowIndex;
      }
    });
  }

  protected _beforeCancelEditData(): void {
    const validatingController = this._validatingController;
    const shouldResetValidationState = this._shouldResetValidationState();

    if (shouldResetValidationState) {
      validatingController.initValidationState();
    } else {
      const changes = this.getChanges();
      validatingController.resetValidationStateForChanges(changes);
    }

    super._beforeCancelEditData();
  }

  private _shouldResetValidationState(): boolean {
    const isCellEditMode = this.getEditMode() === EDIT_MODE.cell;

    if (isCellEditMode) {
      const columns = this._columnsController.getColumns();
      const columnsWithValidatingEditors = columns.filter(
        (col) => col.showEditorAlways && (col.validationRules?.length ?? 0) > 0,
      );

      return columnsWithValidatingEditors.length === 0;
    }

    return true;
  }

  public _showErrorRow(change: EditingChange): dxElementWrapper | undefined {
    const items = this._dataController.items();
    const rowIndex = this.getIndexByKey(change.key, items);
    const validationData = this._validatingController.getValidationData(change.key);

    if (!validationData?.isValid && validationData?.errorText && rowIndex >= 0) {
      const $popupContent = this.getPopupContent();
      return this._errorHandlingController?.renderErrorRow(
        validationData?.errorText,
        rowIndex,
        $popupContent,
      );
    }

    return undefined;
  }

  public updateFieldValue(
    e: EditorCellOptions,
    value: unknown,
    text?: string,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> {
    const deferred = Deferred<unknown>();
    this._validatingController.removeCellValidationResult({
      change: this.getChangeByKey(e.key),
      // @ts-expect-error a grid column always has an index
      columnIndex: e.column.index,
    });

    super.updateFieldValue(e, value, text, forceUpdateRow).done(() => {
      const currentValidator = this._validatingController.getCellValidator({
        rowKey: e.key,
        // @ts-expect-error a grid column always has an index
        columnIndex: e.column.index,
      });
      when(currentValidator && this._validatingController.validateCell(currentValidator))
        .done((validationResult) => {
          this._editorFactoryController.refocus();
          deferred.resolve(validationResult);
        });
    });
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  public highlightDataCell($cell: dxElementWrapper, parameters: ValidatingCellOptions): void {
    super.highlightDataCell($cell, parameters);

    this._validatingController.setCellValidationStatus(parameters);

    const isEditableCell = !!parameters.setValue;
    const cellModified = this.isCellModified(parameters);
    const isValidated = isDefined(parameters.validationStatus);
    const needValidation = (cellModified && parameters.column.setCellValue)
      || (isEditableCell && !cellModified && !(!!parameters.row?.isNewRow || !isValidated));
    if (needValidation) {
      const validator = $cell.data('dxValidator');
      if (validator) {
        when(this._validatingController.validateCell(validator)).done(() => {
          this._validatingController.setCellValidationStatus(parameters);
        });
      }
    }
  }

  public getChangeByKey(key: RowKey): EditingChange | undefined {
    const changes = this.getChanges();
    return changes[gridCoreUtils.getIndexByKey(key, changes)];
  }

  public isCellModified(parameters: EditorCellOptions): boolean {
    const cellModified = super.isCellModified(parameters);
    const change = this.getChangeByKey(parameters.key);
    const isCellInvalid = !!parameters.row && this._validatingController.isInvalidCell({
      rowKey: parameters.key,
      // @ts-expect-error a grid column always has an index
      columnIndex: parameters.column.index,
    });
    return cellModified || (this._validatingController._rowIsValidated(change) && isCellInvalid);
  }
};

const getBoundaryNonFixedColumnsInfo = (
  fixedColumns: Column[],
): { startColumnIndex: number | undefined; endColumnIndex: number | undefined } => {
  const index = fixedColumns.findIndex((column) => column.command === COMMAND_TRANSPARENT);

  if (index === -1) {
    return { startColumnIndex: undefined, endColumnIndex: undefined };
  }

  const transparentColumn = fixedColumns[index];

  return {
    startColumnIndex: index === 0 ? -1 : index,
    endColumnIndex: index === fixedColumns.length - 1
      ? -1
      // @ts-expect-error the transparent column always has a colspan
      : index + transparentColumn.colspan - 1,
  };
};

export const validatingEditorFactoryExtender = (
  Base: ModuleType<EditorFactory>,
): ModuleType<
  EditorFactory & ValidatingEditorFactoryExtension
> => class ValidatingEditorFactoryExtender extends Base {
  protected declare _editingController: ValidatingEditingController;

  private _revertTooltip?: Overlay;

  private _showRevertButton($container: dxElementWrapper | null | undefined): void {
    let $tooltipElement = this._revertTooltip?.$element();

    if (!$container?.length) {
      $tooltipElement?.remove();
      this._revertTooltip = undefined;
      return;
    }

    // do not recreate tooltip if it is already created
    if ($tooltipElement && $container.find($tooltipElement).length) {
      this._revertTooltip?.repaint();
      return;
    }

    const $overlayContainer = this.getRevertButtonContainer($container);
    const revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);

    $tooltipElement?.remove();
    $tooltipElement = $('<div>')
      .addClass(revertTooltipClass)
      .appendTo($container);

    const tooltipOptions = {
      animation: null,
      visible: true,
      width: 'auto',
      height: 'auto',
      shading: false,
      container: $overlayContainer,
      propagateOutsideClick: true,
      hideOnOutsideClick: false,
      wrapperAttr: { class: revertTooltipClass },
      contentTemplate: (): dxElementWrapper => {
        const $buttonElement = $('<div>').addClass(REVERT_BUTTON_CLASS);
        const buttonOptions = {
          icon: 'revert',
          hint: this.option('editing.texts.validationCancelChanges'),
          elementAttr: {
            id: REVERT_BUTTON_ID,
            'aria-label': messageLocalization.format('dxDataGrid-ariaRevertButton'),
          },
          onClick: (): void => {
            this._editingController.cancelEditData();
          },
        };
        // @ts-expect-error the Button constructor is typed for Element
        const button = new Button($buttonElement, buttonOptions);
        return button.$element();
      },
      position: {
        my: 'left top',
        at: 'right top',
        offset: '1 0',
        collision: 'flip',
        boundaryOffset: '0 0',
        boundary: this._rowsView.element(),
        of: $container,
      },
      onPositioned: this.overlayPositionedHandler.bind(this),
    };

    // @ts-expect-error Overlay from ui.overlay.js is typed without constructor arguments
    this._revertTooltip = new Overlay($tooltipElement, tooltipOptions);
  }

  private _hideFixedGroupCell(
    $cell: dxElementWrapper,
    overlayOptions: Record<string, unknown> & { onDisposing?: () => void },
  ): void {
    // @ts-expect-error the column fixing extender adds isFixedColumns to the rows view
    const isFixedColumns = this._rowsView?.isFixedColumns?.();

    if (isFixedColumns && !isFormBasedEditMode(this._editingController.getEditMode())) {
      const nextRowOptions = $cell.closest(`.${VIEW_CLASSES.row}`).next().data('options');

      if (nextRowOptions?.rowType === 'group') {
        const $nextFixedRowElement = $(this._rowsView.getRowElement(nextRowOptions.rowIndex))
          .last();
        const $groupCellElement = $nextFixedRowElement.find(`.${VIEW_CLASSES.groupCell}`);

        if (
          $groupCellElement.length
          && ($groupCellElement.get(0) as HTMLElement).style.visibility !== 'hidden'
        ) {
          $groupCellElement.css('visibility', 'hidden');

          overlayOptions.onDisposing = (): void => {
            $groupCellElement.css('visibility', '');
          };
        }
      }
    }
  }

  private _showValidationMessage(
    $cell: dxElementWrapper,
    messages: string[],
    alignment: string,
  ): void {
    const editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
    const isOverlayVisible = editorPopup && editorPopup.option('visible');
    const myPosition = isOverlayVisible ? 'top right' : `top ${alignment}`;
    const atPosition = isOverlayVisible ? 'top left' : `bottom ${alignment}`;

    const $overlayContainer = this.getValidationMessageContainer($cell);

    let errorMessageText = '';
    if (messages) {
      messages.forEach((message) => {
        errorMessageText += (errorMessageText.length ? '<br/>' : '') + encodeHtml(message);
      });
    }

    const invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);

    // @ts-expect-error the view is rendered here
    this._rowsView.element().find(`.${invalidMessageClass}`).remove();

    const $overlayElement = $('<div>')
      .addClass(INVALID_MESSAGE_CLASS)
      .addClass(INVALID_MESSAGE_ALWAYS_CLASS)
      .addClass(invalidMessageClass)
      .html(errorMessageText)
      .appendTo($cell);

    const overlayOptions = {
      container: $overlayContainer,
      shading: false,
      width: 'auto',
      height: 'auto',
      visible: true,
      animation: false,
      propagateOutsideClick: true,
      hideOnOutsideClick: false,
      wrapperAttr: {
        id: INVALID_MESSAGE_ID,
        class: `${INVALID_MESSAGE_CLASS} ${INVALID_MESSAGE_ALWAYS_CLASS} ${invalidMessageClass}`,
      },
      position: {
        collision: 'flip',
        boundary: this._rowsView.element(),
        boundaryOffset: '0 0',
        offset: {
          x: 0,
          // Firefox consider the top row/cell border when calculating a cell offset.
          y: !isOverlayVisible && browser.mozilla ? -1 : 0,
        },
        my: myPosition,
        at: atPosition,
        of: $cell,
      },
      onPositioned: (e: PositioningEvent): void => {
        this.overlayPositionedHandler(e, isOverlayVisible);
        // @ts-expect-error a positioned overlay has its content
        this._shiftValidationMessageIfNeed(e.component.$content(), $cell);
      },
    };

    this._hideFixedGroupCell($cell, overlayOptions);

    // @ts-expect-error Overlay from ui.overlay.js is typed without constructor arguments
    // eslint-disable-next-line no-new -- the overlay renders itself
    new Overlay($overlayElement, overlayOptions);
  }

  private getValidationMessages(): dxElementWrapper {
    // @ts-expect-error the view is rendered here
    return this._rowsView.element()?.find(this._getValidationMessagesSelector());
  }

  private getRevertButton(): dxElementWrapper {
    return $(this._revertTooltip?.element());
  }

  private _hideValidationMessage(): void {
    const validationMessages = this._rowsView.element()
      ?.find(this._getValidationMessagesSelector());
    validationMessages?.remove();
  }

  private getWidthOfVisibleCells(element: DxElement): number {
    const rowIndex = $(element).closest('tr').index();
    const $cellElements = $(this._rowsView.getRowElement(rowIndex)).first().children().filter(':not(.dx-hidden-cell)');

    return this._rowsView._getWidths($cellElements).reduce((w1, w2) => w1 + w2, 0);
  }

  private _normalizeValidationMessagePositionAndMaxWidth(
    options: PositioningEvent,
    isRevertButton: boolean,
    isOverlayVisible: boolean | undefined,
  ): { position: ValidationMessagePosition; maxWidth: number | undefined } | undefined {
    const fixedColumns = this._columnsController.getFixedColumns();

    if (!fixedColumns?.length) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-else
    let position: ValidationMessagePosition | undefined;
    // @ts-expect-error the width is read only for a validation message, not the revert button
    const visibleTableWidth: number = !isRevertButton
      && this.getWidthOfVisibleCells(options.element);
    // @ts-expect-error a positioned overlay has its content
    const $overlayContentElement: dxElementWrapper = options.component.$content();
    const validationMessageWidth = Number(getOuterWidth($overlayContentElement, true));
    const needMaxWidth = !isRevertButton && validationMessageWidth > visibleTableWidth;
    const columnIndex = this._rowsView.getCellIndex($(options.element).closest('td'));
    const boundaryNonFixedColumnsInfo = getBoundaryNonFixedColumnsInfo(fixedColumns);

    if (
      !isRevertButton
      && (columnIndex === boundaryNonFixedColumnsInfo.startColumnIndex || needMaxWidth)
    ) {
      position = {
        collision: 'none flip',
        my: 'top left',
        at: isOverlayVisible ? 'top right' : 'bottom left',
      };
    } else if (columnIndex === boundaryNonFixedColumnsInfo.endColumnIndex) {
      position = {
        collision: 'none flip',
        my: 'top right',
        at: isRevertButton || isOverlayVisible ? 'top left' : 'bottom right',
      };

      if (isRevertButton) {
        position.offset = '-1 0';
      }
    }

    return position && { position, maxWidth: needMaxWidth ? visibleTableWidth - 2 : undefined };
  }

  private _shiftValidationMessageIfNeed($content: dxElementWrapper, $cell: dxElementWrapper): void {
    const $revertContent = this._revertTooltip?.$content();

    if (!$revertContent) {
      return;
    }

    // @ts-expect-error offset() is typed as possibly undefined
    const contentOffset: Coordinates = $content.offset();
    // @ts-expect-error offset() is typed as possibly undefined
    const revertContentOffset: Coordinates = $revertContent.offset();

    if (
      contentOffset.top === revertContentOffset.top
      && contentOffset.left + Number(getWidth($content)) > revertContentOffset.left
    ) {
      const left = Number(getWidth($revertContent)) + PADDING_BETWEEN_TOOLTIPS;
      // @ts-expect-error offset() is typed as possibly undefined
      $content.css('left', revertContentOffset.left < $cell.offset().left ? -left : left);
    }
  }

  public getOverlayBaseZIndex(): number {
    return Overlay.baseZIndex();
  }

  public overlayPositionedHandler(e: PositioningEvent, isOverlayVisible?: boolean): void {
    // @ts-expect-error the grid marks the overlay with __skipPositionProcessing
    if (!e.component.__skipPositionProcessing) {
      const isRevertButton = $(e.element).hasClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
      const needRepaint = !isRevertButton && this._rowsView.updateFreeSpaceRowHeight();
      const normalizedPosition = this._normalizeValidationMessagePositionAndMaxWidth(
        e,
        isRevertButton,
        isOverlayVisible,
      );

      // @ts-expect-error the grid marks the overlay with __skipPositionProcessing
      e.component.__skipPositionProcessing = !!needRepaint || !!normalizedPosition;

      if (normalizedPosition) {
        e.component.option(normalizedPosition);
      } else if (needRepaint) {
        e.component.repaint();
      }
    }
  }

  /**
   * interface override
   */
  public _getRevertTooltipsSelector(): string {
    const revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
    return `.dx-editor-cell .${revertTooltipClass}`;
  }

  private _getValidationMessagesSelector(): string {
    const invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);
    return `.dx-editor-cell .${invalidMessageClass}, .dx-cell-modified .${invalidMessageClass}`;
  }

  public loseFocus(skipValidator?: boolean): void {
    if (!skipValidator) {
      this._validatingController.setValidator(null);
    }
    super.loseFocus();
  }

  private updateCellState(
    $element: dxElementWrapper | null | undefined,
    validationResult: ValidationResultInternal | undefined,
    isHideBorder: boolean | undefined,
  ): void {
    const $focus = $element?.closest(this._getFocusCellSelector());
    const $cell = $focus?.is('td') ? $focus : null;
    const rowOptions = $focus?.closest(`.${VIEW_CLASSES.row}`).data('options');
    const change = rowOptions ? this._editingController.getChangeByKey(rowOptions.key) : null;
    const column = $cell && this._columnsController.getVisibleColumns()[$cell.index()];
    // @ts-expect-error a column without a name reads the undefined key
    const isCellModified = (change?.data?.[column?.name] !== undefined)
      && !this._editingController.isSaving();
    const validationDescriptionValues: string[] = [];

    if (this._editingController.getEditMode() === EDIT_MODE.cell) {
      if ((validationResult?.status === VALIDATION_STATUS.invalid) || isCellModified) {
        this._showRevertButton($focus);
        validationDescriptionValues.push(REVERT_BUTTON_ID);
      } else if (this._revertTooltip) {
        this._revertTooltip.$element().remove();
      }
    }

    const showValidationMessage = validationResult?.status === VALIDATION_STATUS.invalid;

    if (showValidationMessage && $cell && column && validationResult?.brokenRules) {
      const errorMessages: string[] = [];
      validationResult.brokenRules.forEach((rule) => {
        if (rule.message) {
          errorMessages.push(rule.message);
        }
      });

      if (errorMessages.length) {
        this._showValidationMessage($cell, errorMessages, column.alignment ?? 'left');
        validationDescriptionValues.push(INVALID_MESSAGE_ID);
      }
    }

    // @ts-expect-error descriptions are added for a focused cell only
    this._updateAriaValidationAttributes($focus, validationDescriptionValues);
    if (!isHideBorder && this._rowsView.element()) {
      this._rowsView.updateFreeSpaceRowHeight();
    }
  }

  private _updateAriaValidationAttributes(
    $focus: dxElementWrapper,
    inputDescriptionValues: string[],
  ): void {
    if (inputDescriptionValues.length === 0) { return; }

    const editMode = this._editingController.getEditMode();
    const validationAriaModes: GridsEditMode[] = [EDIT_MODE.cell, EDIT_MODE.batch, EDIT_MODE.row];
    const shouldSetValidationAriaAttributes = validationAriaModes.includes(editMode);

    if (shouldSetValidationAriaAttributes) {
      const $focusElement = this._getCurrentFocusElement($focus);

      this.setAria('labelledby', inputDescriptionValues.join(' '), $focusElement);
      this.setAria('invalid', true, $focusElement);
    }
  }

  private _getCurrentFocusElement($focus: dxElementWrapper): dxElementWrapper {
    if (this._editingController.isEditing()) {
      const selector = [EDITORS_INPUT_SELECTOR, EDITORS_TEXTAREA_SELECTOR].join(', ');
      return $focus.find(selector).first();
    }
    return $focus;
  }

  public focus(
    $element?: dxElementWrapper | null,
    isHideBorder?: boolean,
  ): dxElementWrapper | null | undefined {
    if (!arguments.length) {
      return super.focus();
    }

    this._hideValidationMessage();

    if (
      $element?.hasClass(VIEW_CLASSES.row)
      || $element?.hasClass(MASTER_DETAIL_CLASSES.detailCell)
    ) {
      return super.focus($element, isHideBorder);
    }

    const $focus = $element?.closest(this._getFocusCellSelector());
    const validator = $focus && ($focus.data('dxValidator') || $element?.find(`.${this.addWidgetPrefix(VALIDATOR_CLASS)}`).eq(0).data('dxValidator'));
    const rowOptions = $focus && $focus.closest(`.${VIEW_CLASSES.row}`).data('options');
    const change = rowOptions ? this._editingController.getChangeByKey(rowOptions.key) : null;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in a callback below
    let validationResult: ValidationResultInternal | undefined;

    if (validator && $element) {
      this._validatingController.setValidator(validator);
      const value = validator.option('adapter').getValue();
      if (
        cellValueShouldBeValidated(value, rowOptions)
        || this._validatingController._rowIsValidated(change)
      ) {
        this._editingController.waitForDeferredOperations().done(() => {
          // NOTE: after waiting for deferred operations another rerender may occur.
          // In this case this validating is outdated
          const isDetached = !this._rowsView.isElementInside($element);
          if (isDetached) {
            return;
          }
          when(this._validatingController.validateCell(validator)).done((result) => {
            validationResult = result;
            // @ts-expect-error validateCell results carry their validator
            const { column } = getValidatorData(validationResult.validator);
            if (
              change
              && column
              && !this._validatingController.isCurrentValidatorProcessing({
                rowKey: change.key,
                columnIndex: column.index,
              })
            ) {
              return;
            }
            if (!isFluent(current()) && validationResult.status === VALIDATION_STATUS.invalid) {
              // eslint-disable-next-line no-param-reassign -- the outer focus() reads it if sync
              isHideBorder = true;
            }
            this.updateCellState($element, validationResult, isHideBorder);
            super.focus.call(this, $element, isHideBorder);
          });
        });
        return super.focus($element, isHideBorder);
      }
    }

    this.updateCellState($element, validationResult, isHideBorder);
    return super.focus($element, isHideBorder);
  }

  public getEditorInstance($container: dxElementWrapper): Widget | undefined {
    const $editor = $container.find('.dx-texteditor').eq(0);
    return gridCoreUtils.getWidgetInstance($editor);
  }

  public getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper {
    return $cell.closest(`.${this.addWidgetPrefix(VIEW_CLASSES.content)}`);
  }

  public getRevertButtonContainer($cell: dxElementWrapper): dxElementWrapper {
    return $cell.closest(`.${this.addWidgetPrefix(VIEW_CLASSES.content)}`).parent();
  }

  public hasOverlayElements(): boolean {
    const $validationMessageElements = this.getValidationMessages();
    const $revertButtonElement = this.getRevertButton();

    return super.hasOverlayElements()
      || !!$validationMessageElements?.length
      || !!$revertButtonElement?.length;
  }
};

export const validatingRowsViewExtender = (
  Base: ModuleType<RowsView & EditingRowsViewExtension>,
): ModuleType<RowsView> => class ValidatingRowsViewExtender extends Base {
  public declare _editingController: ValidatingEditingController;

  public updateFreeSpaceRowHeight($table?: dxElementWrapper): boolean | undefined {
    const $element = this.element();
    const $tooltipContent = $element?.find(`.${this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS)} .dx-overlay-content`);

    super.updateFreeSpaceRowHeight($table);

    if ($tooltipContent?.length) {
      const $rowElements = this._getRowElements().filter(':visible');
      const $freeSpaceRowElements = this._getFreeSpaceRowElements($table);
      const $freeSpaceRowElement = $freeSpaceRowElements.first();

      const rowElementsHasFocusInside = $rowElements.find(':focus').length > 0;

      if (
        $freeSpaceRowElement
        && $rowElements.length === 1
        && (
          !$freeSpaceRowElement.is(':visible')
          || Number(getOuterHeight($tooltipContent)) > Number(getOuterHeight($freeSpaceRowElement))
        )
        && rowElementsHasFocusInside
      ) {
        $freeSpaceRowElements.show();
        setHeight($freeSpaceRowElements, getOuterHeight($tooltipContent));
        return true;
      }
    }

    return undefined;
  }

  public override _formItemPrepared(
    cellOptions: EditorCellOptions,
    $container: dxElementWrapper,
  ): void {
    super._formItemPrepared(cellOptions, $container);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    deferUpdate(() => {
      const $editor = $container.find('.dx-widget').first();
      const isEditorDisposed = $editor.length && !$editor.children().length;

      // T736360
      if (!isEditorDisposed) {
        this._validatingController.createValidator(cellOptions, $editor);
      }
    });
  }

  public _cellPrepared($cell: dxElementWrapper, parameters: EditorCellOptions): void {
    if (!isFormBasedEditMode(this._editingController.getEditMode())) {
      this._validatingController.createValidator(parameters, $cell);
    }

    super._cellPrepared($cell, parameters);
  }

  protected _restoreErrorRow(contentTable?: dxElementWrapper): void {
    if (this._editingController?.hasChanges()) {
      this._getRowElements(contentTable).each((_, item) => {
        const rowOptions = $(item).data('options');
        if (rowOptions) {
          const change = this._editingController.getChangeByKey(rowOptions.key);
          if (change) {
            this._editingController._showErrorRow(change);
          }
        }
      });
    }
  }
};
