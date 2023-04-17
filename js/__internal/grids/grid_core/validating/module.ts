import {
  getOuterWidth, getWidth, getOuterHeight, setHeight,
} from '@js/core/utils/size';
import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';
import { createObjectWithChanges } from '@js/data/array_utils';
// @ts-expect-error
import { deferUpdate, equalByValue, getKeyHash } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import { isDefined, isEmptyObject, isObject } from '@js/core/utils/type';
import { extend } from '@js/core/utils/extend';
import { focused } from '@js/ui/widget/selectors';
import messageLocalization from '@js/localization/message';
import Button from '@js/ui/button';
import pointerEvents from '@js/events/pointer';
import ValidationEngine from '@js/ui/validation_engine';
import Validator from '@js/ui/validator';
import Overlay from '@js/ui/overlay/ui.overlay';
import errors from '@js/ui/widget/ui.errors';
// @ts-expect-error
import { Deferred, when, fromPromise } from '@js/core/utils/deferred';
import LoadIndicator from '@js/ui/load_indicator';
import { encodeHtml } from '@js/core/utils/string';
import browser from '@js/core/utils/browser';
import gridCoreUtils from '../module_utils';
import modules from '../modules';

const INVALIDATE_CLASS = 'invalid';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const INVALID_MESSAGE_CLASS = 'dx-invalid-message';
const WIDGET_INVALID_MESSAGE_CLASS = 'invalid-message';
const INVALID_MESSAGE_ALWAYS_CLASS = 'dx-invalid-message-always';
const REVERT_BUTTON_CLASS = 'dx-revert-button';
const VALIDATOR_CLASS = 'validator';
const PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const VALIDATION_PENDING_CLASS = 'dx-validation-pending';
const CONTENT_CLASS = 'content';

const INSERT_INDEX = '__DX_INSERT_INDEX__';
const PADDING_BETWEEN_TOOLTIPS = 2;
const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_CELL = 'cell';
const EDIT_MODE_POPUP = 'popup';
const GROUP_CELL_CLASS = 'dx-group-cell';

const FORM_BASED_MODES = [EDIT_MODE_POPUP, EDIT_MODE_FORM];

const COMMAND_TRANSPARENT = 'transparent';

const VALIDATION_STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending',
};

const EDIT_DATA_INSERT_TYPE = 'insert';
const EDIT_DATA_REMOVE_TYPE = 'remove';
const VALIDATION_CANCELLED = 'cancel';

const validationResultIsValid = function (result) {
  return isDefined(result) && result !== VALIDATION_CANCELLED;
};

const cellValueShouldBeValidated = function (value, rowOptions) {
  return value !== undefined || (value === undefined && rowOptions && !rowOptions.isNewRow);
};

const ValidatingController = modules.Controller.inherit((function () {
  return {
    init() {
      this._editingController = this.getController('editing');
      this.createAction('onRowValidating');

      if (!this._validationState) {
        this.initValidationState();
      }
    },

    initValidationState() {
      this._validationState = [];
      this._validationStateCache = {};
    },

    _rowIsValidated(change) {
      const validationData = this._getValidationData(change?.key);

      return !!validationData && !!validationData.validated;
    },

    _getValidationData(key, create) {
      const keyHash = getKeyHash(key);
      const isObjectKeyHash = isObject(keyHash);
      let validationData;

      if (isObjectKeyHash) {
        // eslint-disable-next-line prefer-destructuring
        validationData = this._validationState.filter((data) => equalByValue(data.key, key))[0];
      } else {
        validationData = this._validationStateCache[keyHash];
      }

      if (!validationData && create) {
        validationData = { key, isValid: true };
        this._validationState.push(validationData);
        if (!isObjectKeyHash) {
          this._validationStateCache[keyHash] = validationData;
        }
      }

      return validationData;
    },

    _getBrokenRules(validationData, validationResults) {
      let brokenRules;

      if (validationResults) {
        brokenRules = validationResults.brokenRules || validationResults.brokenRule && [validationResults.brokenRule];
      } else {
        brokenRules = validationData.brokenRules || [];
      }

      return brokenRules;
    },

    _rowValidating(validationData, validationResults) {
      // @ts-expect-error
      const deferred = new Deferred();
      const change = this._editingController.getChangeByKey(validationData?.key);
      const brokenRules = this._getBrokenRules(validationData, validationResults);
      const isValid = validationResults ? validationResults.isValid : validationData.isValid;
      const parameters = {
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

      return deferred.promise();
    },

    getHiddenValidatorsErrorText(brokenRules) {
      const brokenRulesMessages: any[] = [];

      each(brokenRules, (_, brokenRule) => {
        const { column } = brokenRule;
        const isGroupExpandColumn = column && column.groupIndex !== undefined && !column.showWhenGrouped;
        const isVisibleColumn = column && column.visible;

        if (!brokenRule.validator.$element().parent().length && (!isVisibleColumn || isGroupExpandColumn)) {
          brokenRulesMessages.push(brokenRule.message);
        }
      });
      return brokenRulesMessages.join(', ');
    },

    validate(isFull) {
      let isValid = true;
      const editingController = this._editingController;
      // @ts-expect-error
      const deferred = new Deferred();
      const completeList: any[] = [];

      const editMode = editingController.getEditMode();
      isFull = isFull || editMode === EDIT_MODE_ROW;

      if (this._isValidationInProgress) {
        return deferred.resolve(false).promise();
      }

      this._isValidationInProgress = true;
      if (isFull) {
        editingController.addDeferred(deferred);
        const changes = editingController.getChanges();
        each(changes, (index, { type, key }) => {
          if (type !== 'remove') {
            const validationData = this._getValidationData(key, true);
            const validationResult = this.validateGroup(validationData);
            completeList.push(validationResult);
            validationResult.done((validationResult) => {
              validationData.validated = true;
              isValid = isValid && validationResult.isValid;
            });
          }
        });
      } else if (this._currentCellValidator) {
        const validationResult = this.validateGroup(this._currentCellValidator._findGroup());
        completeList.push(validationResult);
        validationResult.done((validationResult) => {
          isValid = validationResult.isValid;
        });
      }

      when(...completeList).done(() => {
        this._isValidationInProgress = false;
        deferred.resolve(isValid);
      });

      return deferred.promise();
    },

    validateGroup(validationData) {
      // @ts-expect-error
      const result = new Deferred();
      const validateGroup = validationData && ValidationEngine.getGroupConfig(validationData);
      let validationResult;

      if (validateGroup?.validators.length) {
        this.resetRowValidationResults(validationData);
        validationResult = ValidationEngine.validateGroup(validationData);
      }

      when(validationResult?.complete || validationResult).done((validationResult) => {
        when(this._rowValidating(validationData, validationResult)).done(result.resolve);
      });

      return result.promise();
    },

    isRowDataModified(change) {
      return !isEmptyObject(change.data);
    },

    updateValidationState(change) {
      const editMode = this._editingController.getEditMode();
      const { key } = change;
      const validationData = this._getValidationData(key, true);

      if (!FORM_BASED_MODES.includes(editMode)) {
        if (change.type === EDIT_DATA_INSERT_TYPE && !this.isRowDataModified(change)) {
          validationData.isValid = true;
          return;
        }

        this.setDisableApplyValidationResults(true);
        const groupConfig = ValidationEngine.getGroupConfig(validationData);
        if (groupConfig) {
          const validationResult = ValidationEngine.validateGroup(validationData);
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          when(validationResult.complete || validationResult).done((validationResult) => {
            // @ts-expect-error
            validationData.isValid = validationResult.isValid;
            // @ts-expect-error
            validationData.brokenRules = validationResult.brokenRules;
          });
        } else if (!validationData.brokenRules || !validationData.brokenRules.length) {
          validationData.isValid = true;
        }
        this.setDisableApplyValidationResults(false);
      } else {
        validationData.isValid = true;
      }
    },

    setValidator(validator) {
      this._currentCellValidator = validator;
    },

    renderCellPendingIndicator($container) {
      let $indicator = $container.find(`.${PENDING_INDICATOR_CLASS}`);
      if (!$indicator.length) {
        const $indicatorContainer = $container;
        $indicator = $('<div>').appendTo($indicatorContainer)
          .addClass(PENDING_INDICATOR_CLASS);
        this._createComponent($indicator, LoadIndicator);
        $container.addClass(VALIDATION_PENDING_CLASS);
      }
    },

    disposeCellPendingIndicator($container) {
      const $indicator = $container.find(`.${PENDING_INDICATOR_CLASS}`);
      if ($indicator.length) {
        const indicator = LoadIndicator.getInstance($indicator);
        if (indicator) {
          indicator.dispose();
          indicator.$element().remove();
        }
        $container.removeClass(VALIDATION_PENDING_CLASS);
      }
    },

    validationStatusChanged(result) {
      const { validator } = result;
      const validationGroup = validator.option('validationGroup');
      const { column } = validator.option('dataGetter')();

      this.updateCellValidationResult({
        rowKey: validationGroup.key,
        columnIndex: column.index,
        validationResult: result,
      });
    },

    validatorInitialized(arg) {
      arg.component.on('validating', this.validationStatusChanged.bind(this));
      arg.component.on('validated', this.validationStatusChanged.bind(this));
    },

    validatorDisposing(arg) {
      const validator = arg.component;
      const validationGroup = validator.option('validationGroup');
      const { column } = validator.option('dataGetter')();

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
    },

    applyValidationResult($container, result) {
      const { validator } = result;
      const validationGroup = validator.option('validationGroup');
      const { column } = validator.option('dataGetter')();

      result.brokenRules && result.brokenRules.forEach((rule) => {
        rule.columnIndex = column.index;
        rule.column = column;
      });
      if ($container) {
        const validationResult = this.getCellValidationResult({
          rowKey: validationGroup.key,
          columnIndex: column.index,
        });
        const requestIsDisabled = validationResultIsValid(validationResult) && validationResult.disabledPendingId === result.id;
        if (this._disableApplyValidationResults || requestIsDisabled) {
          return;
        }
        if (result.status === VALIDATION_STATUS.invalid) {
          const $focus = $container.find(':focus');
          if (!focused($focus)) {
            // @ts-expect-error
            eventsEngine.trigger($focus, 'focus');
            // @ts-expect-error
            eventsEngine.trigger($focus, pointerEvents.down);
          }
        }
        const editor = !column.editCellTemplate && this.getController('editorFactory').getEditorInstance($container);
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
        $container.toggleClass(this.addWidgetPrefix(INVALIDATE_CLASS), result.status === VALIDATION_STATUS.invalid);
      }
    },

    _syncInternalEditingData(parameters) {
      const editingController = this._editingController;
      const change = editingController.getChangeByKey(parameters.key);
      const oldDataFromState = editingController._getOldData(parameters.key);
      const oldData = parameters.row?.oldData;

      if (change && oldData && !oldDataFromState) {
        editingController._addInternalData({ key: parameters.key, oldData });
      }
    },

    createValidator(parameters, $container) {
      const editingController = this._editingController;
      const { column } = parameters;
      let { showEditorAlways } = column;

      if (isDefined(column.command) || !column.validationRules || !Array.isArray(column.validationRules) || !column.validationRules.length) return;

      const editIndex = editingController.getIndexByKey(parameters.key, editingController.getChanges());
      let needCreateValidator = editIndex > -1;

      if (!needCreateValidator) {
        if (!showEditorAlways) {
          const columnsController = this.getController('columns');
          const visibleColumns = columnsController?.getVisibleColumns() || [];
          showEditorAlways = visibleColumns.some((column) => column.showEditorAlways);
        }

        const isEditRow = equalByValue(this.option('editing.editRowKey'), parameters.key);
        const isCellOrBatchEditingAllowed = editingController.isCellOrBatchEditMode() && editingController.allowUpdating({ row: parameters.row });

        needCreateValidator = isEditRow || isCellOrBatchEditingAllowed && showEditorAlways;

        if (isCellOrBatchEditingAllowed && showEditorAlways) {
          editingController._addInternalData({ key: parameters.key, oldData: parameters.row?.oldData ?? parameters.data });
        }
      }

      if (needCreateValidator) {
        if ($container && !$container.length) {
          errors.log('E1050');
          return;
        }

        this._syncInternalEditingData(parameters);
        const validationData = this._getValidationData(parameters.key, true);

        const getValue = () => {
          const change = editingController.getChangeByKey(validationData?.key);
          const value = column.calculateCellValue(change?.data || {});
          return value !== undefined ? value : parameters.value;
        };

        const useDefaultValidator = $container && $container.hasClass('dx-widget');
        $container && $container.addClass(this.addWidgetPrefix(VALIDATOR_CLASS));
        const validator = new Validator($container || $('<div>'), {
          name: column.caption,
          validationRules: extend(true, [], column.validationRules),
          validationGroup: validationData,
          // @ts-expect-error
          adapter: useDefaultValidator ? null : {
            getValue,
            applyValidationResults: (result) => {
              this.applyValidationResult($container, result);
            },
          },
          dataGetter() {
            const key = validationData?.key;
            const change = editingController.getChangeByKey(key);
            const oldData = editingController._getOldData(key);
            return {
              data: createObjectWithChanges(oldData, change?.data),
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
            const defaultAdapterBypass = () => parameters.row.isNewRow && !this._isValidationInProgress && !editingController.isCellModified(parameters);

            adapter.getValue = getValue;
            adapter.validationRequestsCallbacks = [];
            // @ts-expect-error
            adapter.bypass = () => originBypass.call(adapter) || defaultAdapterBypass();
          }
        }

        return validator;
      }

      return undefined;
    },

    setDisableApplyValidationResults(flag) {
      this._disableApplyValidationResults = flag;
    },

    getDisableApplyValidationResults() {
      return this._disableApplyValidationResults;
    },

    isCurrentValidatorProcessing({ rowKey, columnIndex }) {
      return this._currentCellValidator && equalByValue(this._currentCellValidator.option('validationGroup').key, rowKey)
                && this._currentCellValidator.option('dataGetter')().column.index === columnIndex;
    },

    validateCell(validator) {
      const cellParams = {
        rowKey: validator.option('validationGroup').key,
        columnIndex: validator.option('dataGetter')().column.index,
      };
      let validationResult = this.getCellValidationResult(cellParams);
      const stateRestored = validationResultIsValid(validationResult);
      const adapter = validator.option('adapter');
      if (!stateRestored) {
        validationResult = validator.validate();
      } else {
        const currentCellValue = adapter.getValue();
        if (!equalByValue(currentCellValue, validationResult.value)) {
          validationResult = validator.validate();
        }
      }
      // @ts-expect-error
      const deferred = new Deferred();
      if (stateRestored && validationResult.status === VALIDATION_STATUS.pending) {
        this.updateCellValidationResult(cellParams);
        adapter.applyValidationResults(validationResult);
      }
      when(validationResult.complete || validationResult).done((validationResult) => {
        stateRestored && adapter.applyValidationResults(validationResult);
        deferred.resolve(validationResult);
      });
      return deferred.promise();
    },

    updateCellValidationResult({ rowKey, columnIndex, validationResult }) {
      const validationData = this._getValidationData(rowKey);
      if (!validationData) {
        return;
      }
      if (!validationData.validationResults) {
        validationData.validationResults = {};
      }
      let result;
      if (validationResult) {
        result = extend({}, validationResult);
        validationData.validationResults[columnIndex] = result;
        if (validationResult.status === VALIDATION_STATUS.pending) {
          if (this._editingController.getEditMode() === EDIT_MODE_CELL) {
            // @ts-expect-error
            result.deferred = new Deferred();
            result.complete.always(() => {
              result.deferred.resolve();
            });
            this._editingController.addDeferred(result.deferred);
          }
          if (this._disableApplyValidationResults) {
            result.disabledPendingId = validationResult.id;
            return;
          }
        }
      } else {
        result = validationData.validationResults[columnIndex];
      }
      if (result && result.disabledPendingId) {
        delete result.disabledPendingId;
      }
    },

    getCellValidationResult({ rowKey, columnIndex }) {
      const validationData = this._getValidationData(rowKey, true);
      return validationData?.validationResults?.[columnIndex];
    },

    removeCellValidationResult({ change, columnIndex }) {
      const validationData = this._getValidationData(change?.key);

      if (validationData && validationData.validationResults) {
        this.cancelCellValidationResult({ change, columnIndex });
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete validationData.validationResults[columnIndex];
      }
    },

    cancelCellValidationResult({ change, columnIndex }) {
      const validationData = this._getValidationData(change.key);

      if (change && validationData.validationResults) {
        const result = validationData.validationResults[columnIndex];
        if (result) {
          result.deferred && result.deferred.reject(VALIDATION_CANCELLED);
          validationData.validationResults[columnIndex] = VALIDATION_CANCELLED;
        }
      }
    },

    resetRowValidationResults(validationData) {
      if (validationData) {
        validationData.validationResults && delete validationData.validationResults;
        delete validationData.validated;
      }
    },

    isInvalidCell({ rowKey, columnIndex }) {
      const result = this.getCellValidationResult({
        rowKey,
        columnIndex,
      });
      return validationResultIsValid(result) && result.status === VALIDATION_STATUS.invalid;
    },

    getCellValidator({ rowKey, columnIndex }) {
      const validationData = this._getValidationData(rowKey);
      const groupConfig = validationData && ValidationEngine.getGroupConfig(validationData);
      const validators = groupConfig && groupConfig.validators;
      return validators && validators.filter((v) => {
        const { column } = v.option('dataGetter')();
        return column ? column.index === columnIndex : false;
      })[0];
    },

    setCellValidationStatus(cellOptions) {
      const validationResult = this.getCellValidationResult({
        rowKey: cellOptions.key,
        columnIndex: cellOptions.column.index,
      });

      if (isDefined(validationResult)) {
        cellOptions.validationStatus = validationResult !== VALIDATION_CANCELLED ? validationResult.status : VALIDATION_CANCELLED;
      } else {
        delete cellOptions.validationStatus;
      }
    },
  };
})());

export const validatingModule = {
  defaultOptions() {
    return {
      editing: {
        texts: {
          validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges'),
        },
      },
    };
  },
  controllers: {
    validating: ValidatingController,
  },
  extenders: {
    controllers: {
      editing: {
        _addChange(changeParams) {
          const change = this.callBase.apply(this, arguments);
          const validatingController = this.getController('validating');

          if (change && changeParams.type !== EDIT_DATA_REMOVE_TYPE) {
            validatingController.updateValidationState(change);
          }

          return change;
        },

        _handleChangesChange(args) {
          this.callBase.apply(this, arguments);

          const validatingController = this.getController('validating');

          args.value.forEach((change) => {
            if (validatingController._getValidationData(change.key) === undefined) {
              validatingController.updateValidationState(change);
            }
          });
        },

        _updateRowAndPageIndices() {
          const that = this;
          const startInsertIndex = that.getView('rowsView').getTopVisibleItemIndex();
          let rowIndex = startInsertIndex;

          each(that.getChanges(), (_, { key, type }) => {
            const validationData = this.getController('validating')._getValidationData(key);
            if (validationData && !validationData.isValid && validationData.pageIndex !== that._pageIndex) {
              validationData.pageIndex = that._pageIndex;
              if (type === EDIT_DATA_INSERT_TYPE) {
                validationData.rowIndex = startInsertIndex;
              } else {
                validationData.rowIndex = rowIndex;
              }
              rowIndex++;
            }
          });
        },

        _getValidationGroupsInForm(detailOptions) {
          const validatingController = this.getController('validating');
          const validationData = validatingController._getValidationData(detailOptions.key, true);

          return {
            validationGroup: validationData,
          };
        },

        _validateEditFormAfterUpdate(row, isCustomSetCellValue) {
          // T816256, T844143
          if (isCustomSetCellValue && this._editForm) {
            this._editForm.validate();
          }

          this.callBase.apply(this, arguments);
        },

        _prepareEditCell(params) {
          const isNotCanceled = this.callBase.apply(this, arguments);
          const validatingController = this.getController('validating');

          if (isNotCanceled && params.column.showEditorAlways) {
            validatingController.updateValidationState({ key: params.key });
          }

          return isNotCanceled;
        },

        processItems(items, changeType) {
          const changes = this.getChanges();
          const dataController = this.getController('data');
          const validatingController = this.getController('validating');
          const getIndexByChange = function (change, items: any[]) {
            let index = -1;
            const isInsert = change.type === EDIT_DATA_INSERT_TYPE;
            const { key } = change;

            each(items, (i, item) => {
              if (equalByValue(key, isInsert ? item.key : dataController.keyOf(item))) {
                index = i;
                return false;
              }

              return undefined;
            });

            return index;
          };

          items = this.callBase(items, changeType);
          const itemsCount = items.length;

          const addInValidItem = function (change, validationData) {
            const data = { key: change.key };
            const index = getIndexByChange(change, items);

            if (index >= 0) {
              return;
            }

            validationData.rowIndex = validationData.rowIndex > itemsCount ? validationData.rowIndex % itemsCount : validationData.rowIndex;
            const { rowIndex } = validationData;

            data[INSERT_INDEX] = 1;
            items.splice(rowIndex, 0, data);
          };

          if (this.getEditMode() === EDIT_MODE_BATCH && changeType !== 'prepend' && changeType !== 'append') {
            changes.forEach((change) => {
              const { key } = change;
              const validationData = validatingController._getValidationData(key);
              if (validationData && change.type && validationData.pageIndex === this._pageIndex && change?.pageIndex !== this._pageIndex) {
                addInValidItem(change, validationData);
              }
            });
          }

          return items;
        },

        processDataItem(item) {
          const isInserted = item.data[INSERT_INDEX];
          const key = isInserted ? item.data.key : item.key;
          const editMode = this.getEditMode();

          if (editMode === EDIT_MODE_BATCH && isInserted && key) {
            const changes = this.getChanges();
            const editIndex = gridCoreUtils.getIndexByKey(key, changes);

            if (editIndex >= 0) {
              const change = changes[editIndex];

              if (change.type !== EDIT_DATA_INSERT_TYPE) {
                const oldData = this._getOldData(change.key);
                item.data = extend(true, {}, oldData, change.data);
                item.key = key;
              }
            }
          }

          this.callBase.apply(this, arguments);
        },

        _createInvisibleColumnValidators(changes) {
          const that = this;
          const validatingController = this.getController('validating');
          const columnsController = this.getController('columns');
          const columns = columnsController.getColumns();
          const invisibleColumns = columnsController.getInvisibleColumns().filter((column) => !column.isBand);
          const groupColumns = columnsController.getGroupColumns().filter((column) => !column.showWhenGrouped && invisibleColumns.indexOf(column) === -1);
          const invisibleColumnValidators: any[] = [];
          const isCellVisible = (column, rowKey) => this._dataController.getRowIndexByKey(rowKey) >= 0 && invisibleColumns.indexOf(column) < 0;

          invisibleColumns.push(...groupColumns);

          if (!FORM_BASED_MODES.includes(this.getEditMode())) {
            each(columns, (_, column) => {
              changes.forEach((change) => {
                let data;
                if (isCellVisible(column, change.key)) {
                  return;
                }

                if (change.type === EDIT_DATA_INSERT_TYPE) {
                  data = change.data;
                } else if (change.type === 'update') {
                  const oldData = that._getOldData(change.key);
                  data = createObjectWithChanges(oldData, change.data);
                }
                if (data) {
                  const validator = validatingController.createValidator({
                    column,
                    key: change.key,
                    value: column.calculateCellValue(data),
                  });
                  if (validator) {
                    invisibleColumnValidators.push(validator);
                  }
                }
              });
            });
          }
          return function () {
            invisibleColumnValidators.forEach((validator) => { validator.dispose(); });
          };
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _beforeSaveEditData(change, editIndex) {
          let result = this.callBase.apply(this, arguments);
          const validatingController = this.getController('validating');
          const validationData = validatingController._getValidationData(change?.key);

          if (change) {
            const isValid = change.type === 'remove' || validationData.isValid;
            result = result || !isValid;
          } else {
            const disposeValidators = this._createInvisibleColumnValidators(this.getChanges());
            // @ts-expect-error
            result = new Deferred();
            this.executeOperation(result, () => {
              validatingController.validate(true).done((isFullValid) => {
                disposeValidators();
                this._updateRowAndPageIndices();

                // eslint-disable-next-line default-case
                switch (this.getEditMode()) {
                  case EDIT_MODE_CELL:
                    if (!isFullValid) {
                      this._focusEditingCell();
                    }
                    break;
                  case EDIT_MODE_BATCH:
                    if (!isFullValid) {
                      this._resetEditRowKey();
                      this._resetEditColumnName();
                      this.getController('data').updateItems();
                    }
                    break;
                }
                result.resolve(!isFullValid);
              });
            });
          }
          return result.promise ? result.promise() : result;
        },

        _beforeEditCell(rowIndex, columnIndex, item) {
          const result = this.callBase(rowIndex, columnIndex, item);

          if (this.getEditMode() === EDIT_MODE_CELL) {
            const $cell = this._rowsView._getCellElement(rowIndex, columnIndex);
            const validator = $cell && $cell.data('dxValidator');
            const rowOptions = $cell && $cell.closest('.dx-row').data('options');
            const value = validator && validator.option('adapter').getValue();
            if (validator && cellValueShouldBeValidated(value, rowOptions)) {
              const validatingController = this.getController('validating');
              // @ts-expect-error
              const deferred = new Deferred();
              when(validatingController.validateCell(validator), result).done((validationResult, result) => {
                deferred.resolve(validationResult.status === VALIDATION_STATUS.valid && result);
              });
              return deferred.promise();
            } if (!validator) {
              return result;
            }
          }
        },

        _afterSaveEditData(cancel) {
          let $firstErrorRow;
          const isCellEditMode = this.getEditMode() === EDIT_MODE_CELL;

          each(this.getChanges(), (_, change) => {
            const $errorRow = this._showErrorRow(change);
            $firstErrorRow = $firstErrorRow || $errorRow;
          });
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
            let shouldResetValidationState = true;

            if (isCellEditMode) {
              const columns = this.getController('columns').getColumns();
              const columnsWithValidatingEditors = columns.filter((col) => col.showEditorAlways && col.validationRules?.length > 0).length > 0;

              shouldResetValidationState = !columnsWithValidatingEditors;
            }

            if (shouldResetValidationState) {
              this.getController('validating').initValidationState();
            }
          }
        },

        _handleDataChanged(args) {
          const validationState = this.getController('validating')._validationState;

          if (this.option('scrolling.mode') === 'standard') {
            this.resetRowAndPageIndices();
          }

          if (args.changeType === 'prepend') {
            each(validationState, (_, validationData) => {
              validationData.rowIndex += args.items.length;
            });
          }

          this.callBase(args);
        },

        resetRowAndPageIndices() {
          const validationState = this.getController('validating')._validationState;

          each(validationState, (_, validationData) => {
            if (validationData.pageIndex !== this._pageIndex) {
              delete validationData.pageIndex;
              delete validationData.rowIndex;
            }
          });
        },

        _beforeCancelEditData() {
          this.getController('validating').initValidationState();

          this.callBase();
        },

        _showErrorRow(change) {
          let $popupContent;
          const errorHandling = this.getController('errorHandling');
          const items = this.getController('data').items();
          const rowIndex = this.getIndexByKey(change.key, items);
          const validationData = this.getController('validating')._getValidationData(change.key);

          if (!validationData?.isValid && validationData?.errorText && rowIndex >= 0) {
            $popupContent = this.getPopupContent();
            return errorHandling && errorHandling.renderErrorRow(validationData?.errorText, rowIndex, $popupContent);
          }
        },

        updateFieldValue(e) {
          const validatingController = this.getController('validating');
          // @ts-expect-error
          const deferred = new Deferred();
          validatingController.removeCellValidationResult({
            change: this.getChangeByKey(e.key),
            columnIndex: e.column.index,
          });

          this.callBase.apply(this, arguments).done(() => {
            const currentValidator = validatingController.getCellValidator({
              rowKey: e.key,
              columnIndex: e.column.index,
            });
            when(currentValidator && validatingController.validateCell(currentValidator))
              .done((validationResult) => {
                this.getController('editorFactory').refocus();
                deferred.resolve(validationResult);
              });
          });
          return deferred.promise();
        },

        highlightDataCell($cell, parameters) {
          this.callBase.apply(this, arguments);
          const validatingController = this.getController('validating');

          validatingController.setCellValidationStatus(parameters);

          const isEditableCell = !!parameters.setValue;
          const cellModified = this.isCellModified(parameters);
          const isValidated = isDefined(parameters.validationStatus);
          const needValidation = (cellModified && parameters.column.setCellValue) || (isEditableCell && !cellModified && !(parameters.row.isNewRow || !isValidated));
          if (needValidation) {
            const validator = $cell.data('dxValidator');
            if (validator) {
              when(this.getController('validating').validateCell(validator)).done(() => {
                validatingController.setCellValidationStatus(parameters);
              });
            }
          }
        },

        getChangeByKey(key) {
          const changes = this.getChanges();
          return changes[gridCoreUtils.getIndexByKey(key, changes)];
        },

        isCellModified(parameters) {
          const cellModified = this.callBase(parameters);
          const change = this.getChangeByKey(parameters.key);
          const isCellInvalid = !!parameters.row && this.getController('validating').isInvalidCell({
            rowKey: parameters.key,
            columnIndex: parameters.column.index,
          });
          return cellModified || (this.getController('validating')._rowIsValidated(change) && isCellInvalid);
        },
      },
      editorFactory: (function () {
        const getWidthOfVisibleCells = function (that, element) {
          const rowIndex = $(element).closest('tr').index();
          const $cellElements = $(that._rowsView.getRowElement(rowIndex)).first().children().filter(':not(.dx-hidden-cell)');

          return that._rowsView._getWidths($cellElements).reduce((w1, w2) => w1 + w2, 0);
        };

        const getBoundaryNonFixedColumnsInfo = function (fixedColumns) {
          let firstNonFixedColumnIndex;
          let lastNonFixedColumnIndex;

          // eslint-disable-next-line array-callback-return
          fixedColumns.some((column, index) => {
            if (column.command === COMMAND_TRANSPARENT) {
              firstNonFixedColumnIndex = index === 0 ? -1 : index;
              lastNonFixedColumnIndex = index === fixedColumns.length - 1 ? -1 : index + column.colspan - 1;
              return true;
            }

            return undefined;
          });

          return {
            startColumnIndex: firstNonFixedColumnIndex,
            endColumnIndex: lastNonFixedColumnIndex,
          };
        };

        return {
          _showRevertButton($container) {
            let $tooltipElement = this._revertTooltip?.$element();

            if (!$container || !$container.length) {
              $tooltipElement?.remove();
              this._revertTooltip = undefined;
              return;
            }

            // do not render tooltip if it is already rendered
            if ($container.find($tooltipElement).length) {
              return;
            }

            const $overlayContainer = $container.closest(`.${this.addWidgetPrefix(CONTENT_CLASS)}`);
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
              contentTemplate: () => {
                const $buttonElement = $('<div>').addClass(REVERT_BUTTON_CLASS);
                const buttonOptions = {
                  icon: 'revert',
                  hint: this.option('editing.texts.validationCancelChanges'),
                  onClick: () => {
                    this._editingController.cancelEditData();
                  },
                };
                // @ts-expect-error
                return new Button($buttonElement, buttonOptions).$element();
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
              onPositioned: this._positionedHandler.bind(this),
            };

            this._revertTooltip = new Overlay($tooltipElement, tooltipOptions);
          },

          _hideFixedGroupCell($cell, overlayOptions) {
            let $nextFixedRowElement;
            let $groupCellElement;
            const isFixedColumns = this._rowsView.isFixedColumns();
            const isFormOrPopupEditMode = this._editingController.isFormOrPopupEditMode();

            if (isFixedColumns && !isFormOrPopupEditMode) {
              const nextRowOptions = $cell.closest('.dx-row').next().data('options');

              if (nextRowOptions && nextRowOptions.rowType === 'group') {
                $nextFixedRowElement = $(this._rowsView.getRowElement(nextRowOptions.rowIndex)).last();
                $groupCellElement = $nextFixedRowElement.find(`.${GROUP_CELL_CLASS}`);

                if ($groupCellElement.length && $groupCellElement.get(0).style.visibility !== 'hidden') {
                  $groupCellElement.css('visibility', 'hidden');

                  overlayOptions.onDisposing = function () {
                    $groupCellElement.css('visibility', '');
                  };
                }
              }
            }
          },

          _positionedHandler(e, isOverlayVisible) {
            if (!e.component.__skipPositionProcessing) {
              const isRevertButton = $(e.element).hasClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
              const needRepaint = !isRevertButton && this._rowsView.updateFreeSpaceRowHeight();
              const normalizedPosition = this._normalizeValidationMessagePositionAndMaxWidth(e, isRevertButton, isOverlayVisible);

              e.component.__skipPositionProcessing = !!(needRepaint || normalizedPosition);

              if (normalizedPosition) {
                e.component.option(normalizedPosition);
              } else if (needRepaint) {
                e.component.repaint();
              }
            }
          },

          _showValidationMessage($cell, messages, alignment) {
            const editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
            const isOverlayVisible = editorPopup && editorPopup.option('visible');
            const myPosition = isOverlayVisible ? 'top right' : `top ${alignment}`;
            const atPosition = isOverlayVisible ? 'top left' : `bottom ${alignment}`;
            const $overlayContainer = $cell.closest(`.${this.addWidgetPrefix(CONTENT_CLASS)}`);

            let errorMessageText = '';
            messages && messages.forEach((message) => {
              errorMessageText += (errorMessageText.length ? '<br/>' : '') + encodeHtml(message);
            });

            const invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);

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
              wrapperAttr: { class: `${INVALID_MESSAGE_CLASS} ${INVALID_MESSAGE_ALWAYS_CLASS} ${invalidMessageClass}` },
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
              onPositioned: (e) => {
                this._positionedHandler(e, isOverlayVisible);
                this._shiftValidationMessageIfNeed(e.component.$content(), $cell);
              },
            };

            this._hideFixedGroupCell($cell, overlayOptions);

            // eslint-disable-next-line no-new
            new Overlay($overlayElement, overlayOptions);
          },

          _hideValidationMessage() {
            const validationMessages = this._rowsView.element()?.find(this._getValidationMessagesSelector());
            validationMessages?.remove();
          },

          _normalizeValidationMessagePositionAndMaxWidth(options, isRevertButton, isOverlayVisible) {
            const fixedColumns = this._columnsController.getFixedColumns();

            if (!fixedColumns || !fixedColumns.length) {
              return;
            }

            let position;
            const visibleTableWidth = !isRevertButton && getWidthOfVisibleCells(this, options.element);
            const $overlayContentElement = options.component.$content();
            const validationMessageWidth = getOuterWidth($overlayContentElement, true);
            const needMaxWidth = !isRevertButton && validationMessageWidth > visibleTableWidth;
            const columnIndex = this._rowsView.getCellIndex($(options.element).closest('td'));
            const boundaryNonFixedColumnsInfo = getBoundaryNonFixedColumnsInfo(fixedColumns);

            if (!isRevertButton && (columnIndex === boundaryNonFixedColumnsInfo.startColumnIndex || needMaxWidth)) {
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
          },

          _shiftValidationMessageIfNeed($content, $cell) {
            const $revertContent = this._revertTooltip && this._revertTooltip.$content();

            if (!$revertContent) return;

            const contentOffset = $content.offset();
            const revertContentOffset = $revertContent.offset();

            if (contentOffset.top === revertContentOffset.top && contentOffset.left + getWidth($content) > revertContentOffset.left) {
              const left = getWidth($revertContent) + PADDING_BETWEEN_TOOLTIPS;
              $content.css('left', revertContentOffset.left < $cell.offset().left ? -left : left);
            }
          },

          _getRevertTooltipsSelector() {
            const revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
            return `.dx-editor-cell .${revertTooltipClass}`;
          },

          _getValidationMessagesSelector() {
            const invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);
            return `.dx-editor-cell .${invalidMessageClass}, .dx-cell-modified .${invalidMessageClass}`;
          },

          init() {
            this.callBase();
            this._editingController = this.getController('editing');
            this._columnsController = this.getController('columns');
            this._rowsView = this.getView('rowsView');
          },

          loseFocus(skipValidator) {
            if (!skipValidator) {
              this.getController('validating').setValidator(null);
            }
            this.callBase();
          },

          updateCellState($element, validationResult, isHideBorder) {
            const $focus = $element?.closest(this._getFocusCellSelector());
            const $cell = $focus?.is('td') ? $focus : null;
            const rowOptions = $focus?.closest('.dx-row').data('options');
            const change = rowOptions ? this.getController('editing').getChangeByKey(rowOptions.key) : null;
            const column = $cell && this.getController('columns').getVisibleColumns()[$cell.index()];
            const isCellModified = (change?.data?.[column?.name] !== undefined) && !this._editingController.isSaving();

            if (this._editingController.getEditMode() === EDIT_MODE_CELL) {
              if ((validationResult?.status === VALIDATION_STATUS.invalid) || isCellModified) {
                this._showRevertButton($focus);
              } else {
                this._revertTooltip && this._revertTooltip.$element().remove();
              }
            }

            const showValidationMessage = validationResult && validationResult.status === VALIDATION_STATUS.invalid;

            if (showValidationMessage && $cell && column && validationResult && validationResult.brokenRules) {
              const errorMessages: any[] = [];
              validationResult.brokenRules.forEach((rule) => {
                if (rule.message) {
                  errorMessages.push(rule.message);
                }
              });

              if (errorMessages.length) {
                this._showValidationMessage($focus, errorMessages, column.alignment || 'left');
              }
            }

            !isHideBorder && this._rowsView.element() && this._rowsView.updateFreeSpaceRowHeight();
          },

          focus($element, isHideBorder) {
            if (!arguments.length) return this.callBase();

            this._hideValidationMessage();

            if ($element?.hasClass('dx-row') || $element?.hasClass('dx-master-detail-cell')) {
              return this.callBase($element, isHideBorder);
            }

            const $focus = $element?.closest(this._getFocusCellSelector());
            const { callBase } = this;
            const validator = $focus && ($focus.data('dxValidator') || $element.find(`.${this.addWidgetPrefix(VALIDATOR_CLASS)}`).eq(0).data('dxValidator'));
            const rowOptions = $focus && $focus.closest('.dx-row').data('options');
            const editingController = this.getController('editing');
            const change = rowOptions ? editingController.getChangeByKey(rowOptions.key) : null;
            const validatingController = this.getController('validating');
            let validationResult;

            if (validator) {
              validatingController.setValidator(validator);
              const value = validator.option('adapter').getValue();
              if (cellValueShouldBeValidated(value, rowOptions) || validatingController._rowIsValidated(change)) {
                editingController.waitForDeferredOperations().done(() => {
                  when(validatingController.validateCell(validator)).done((result) => {
                    validationResult = result;
                    const { column } = validationResult.validator.option('dataGetter')();
                    if (change && column && !validatingController.isCurrentValidatorProcessing({ rowKey: change.key, columnIndex: column.index })) {
                      return;
                    }
                    if (validationResult.status === VALIDATION_STATUS.invalid) {
                      isHideBorder = true;
                    }
                    this.updateCellState($element, validationResult, isHideBorder);
                    callBase.call(this, $element, isHideBorder);
                  });
                });
                return this.callBase($element, isHideBorder);
              }
            }

            this.updateCellState($element, validationResult, isHideBorder);
            return this.callBase($element, isHideBorder);
          },

          getEditorInstance($container) {
            const $editor = $container.find('.dx-texteditor').eq(0);
            return gridCoreUtils.getWidgetInstance($editor);
          },
        };
      }()),
      data: {
        _getValidationStatus(validationResult) {
          const validationStatus = validationResultIsValid(validationResult) ? validationResult.status : validationResult;

          return validationStatus || VALIDATION_STATUS.valid;
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
          const cell = oldRow.cells?.[columnIndex];
          const oldValidationStatus = this._getValidationStatus({ status: cell?.validationStatus });
          const validatingController = this.getController('validating');
          const validationResult = validatingController.getCellValidationResult({
            rowKey: oldRow.key,
            columnIndex,
          });
          const validationData = validatingController._getValidationData(oldRow.key);
          const newValidationStatus = this._getValidationStatus(validationResult);
          const rowIsModified = JSON.stringify(newRow.modifiedValues) !== JSON.stringify(oldRow.modifiedValues);
          const validationStatusChanged = oldValidationStatus !== newValidationStatus && rowIsModified;
          const cellIsMarkedAsInvalid = $(cell?.cellElement).hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));
          const hasValidationRules = cell?.column.validationRules?.length;
          const rowEditStateChanged = oldRow.isEditing !== newRow.isEditing && hasValidationRules;
          const cellValidationStateChanged = validationStatusChanged || validationData.isValid && cellIsMarkedAsInvalid;

          if (rowEditStateChanged || cellValidationStateChanged) {
            return true;
          }

          return this.callBase.apply(this, arguments);
        },
      },
    },
    views: {
      rowsView: {
        updateFreeSpaceRowHeight($table) {
          const that = this;
          let $rowElements;
          let $freeSpaceRowElement;
          let $freeSpaceRowElements;
          const $element = that.element();
          const $tooltipContent = $element && $element.find(`.${that.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS)} .dx-overlay-content`);

          that.callBase($table);

          if ($tooltipContent && $tooltipContent.length) {
            $rowElements = that._getRowElements();
            $freeSpaceRowElements = that._getFreeSpaceRowElements($table);
            $freeSpaceRowElement = $freeSpaceRowElements.first();

            if ($freeSpaceRowElement && $rowElements.length === 1 && (!$freeSpaceRowElement.is(':visible') || getOuterHeight($tooltipContent) > getOuterHeight($freeSpaceRowElement))) {
              $freeSpaceRowElements.show();
              setHeight($freeSpaceRowElements, getOuterHeight($tooltipContent));
              return true;
            }
          }

          return undefined;
        },
        _formItemPrepared(cellOptions, $container) {
          this.callBase.apply(this, arguments);
          deferUpdate(() => {
            const $editor = $container.find('.dx-widget').first();
            const isEditorDisposed = $editor.length && !$editor.children().length;

            // T736360
            if (!isEditorDisposed) {
              this.getController('validating').createValidator(cellOptions, $editor);
            }
          });
        },
        _cellPrepared($cell, parameters) {
          if (!this.getController('editing').isFormOrPopupEditMode()) {
            this.getController('validating').createValidator(parameters, $cell);
          }

          this.callBase.apply(this, arguments);
        },

        _restoreErrorRow(contentTable) {
          const editingController = this.getController('editing');
          editingController && editingController.hasChanges() && this._getRowElements(contentTable).each((_, item) => {
            const rowOptions = $(item).data('options');
            if (rowOptions) {
              // @ts-expect-error
              const change = editingController.getChangeByKey(rowOptions.key);
              change && editingController._showErrorRow(change);
            }
          });
        },
      },
    },
  },
};
