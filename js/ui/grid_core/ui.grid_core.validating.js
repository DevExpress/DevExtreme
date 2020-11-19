import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import { createObjectWithChanges } from '../../data/array_utils';
import { deferUpdate, equalByValue } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isDefined, isEmptyObject } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { focused } from '../widget/selectors';
import messageLocalization from '../../localization/message';
import Button from '../button';
import pointerEvents from '../../events/pointer';
import ValidationEngine from '../validation_engine';
import Validator from '../validator';
import Tooltip from '../tooltip';
import Overlay from '../overlay';
import errors from '../widget/ui.errors';
import { Deferred, when } from '../../core/utils/deferred';
import LoadIndicator from '../load_indicator';
import { encodeHtml } from '../../core/utils/string';
import browser from '../../core/utils/browser';

const INVALIDATE_CLASS = 'invalid';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const ROWS_VIEW_CLASS = 'rowsview';
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
    pending: 'pending'
};

const EDIT_DATA_INSERT_TYPE = 'insert';
const EDIT_DATA_REMOVE_TYPE = 'remove';
const VALIDATION_CANCELLED = 'cancel';

const validationResultIsValid = function(result) {
    return isDefined(result) && result !== VALIDATION_CANCELLED;
};

const cellValueShouldBeValidated = function(value, rowOptions) {
    return value !== undefined || (value === undefined && rowOptions && !rowOptions.isNewRow);
};

const ValidatingController = modules.Controller.inherit((function() {
    return {
        init: function() {
            this._editingController = this.getController('editing');
            this.createAction('onRowValidating');

            if(!this._validationState) {
                this._validationState = [];
            }
        },

        _rowIsValidated: function(change) {
            const validationData = this._getValidationData(change?.key);

            return !!validationData && !!validationData.validated;
        },

        _getValidationData: function(key, create) {
            let validationData = this._validationState.filter(data => data.key === key)[0];

            if(!validationData && create) {
                validationData = { key, isValid: true };
                this._validationState.push(validationData);
            }

            return validationData;
        },

        _getBrokenRules: function(validationData, validationResults) {
            let brokenRules;

            if(validationResults) {
                brokenRules = validationResults.brokenRules || validationResults.brokenRule && [validationResults.brokenRule];
            } else {
                brokenRules = validationData.brokenRules || [];
            }

            return brokenRules;
        },

        _rowValidating: function(validationData, validationResults) {
            const deferred = new Deferred();
            const change = this._editingController.getChangeByKey(validationData?.key);
            const brokenRules = this._getBrokenRules(validationData, validationResults);
            const isValid = validationResults ? validationResults.isValid : validationData.isValid;
            const parameters = {
                brokenRules: brokenRules,
                isValid: isValid,
                key: change.key,
                newData: change.data,
                oldData: this._editingController._getOldData(change.key),
                promise: null,
                errorText: this.getHiddenValidatorsErrorText(brokenRules)
            };

            this.executeAction('onRowValidating', parameters);

            when(parameters.promise).always(function() {
                validationData.isValid = parameters.isValid;
                validationData.errorText = parameters.errorText;
                deferred.resolve(parameters);
            });

            return deferred.promise();
        },

        getHiddenValidatorsErrorText: function(brokenRules) {
            const brokenRulesMessages = [];

            each(brokenRules, function(_, brokenRule) {
                const column = brokenRule.column;
                const isGroupExpandColumn = column && column.groupIndex !== undefined && !column.showWhenGrouped;
                const isVisibleColumn = column && column.visible;

                if(!brokenRule.validator.$element().parent().length && (!isVisibleColumn || isGroupExpandColumn)) {
                    brokenRulesMessages.push(brokenRule.message);
                }
            });
            return brokenRulesMessages.join(', ');
        },

        validate: function(isFull) {
            let isValid = true;
            const editingController = this._editingController;
            const deferred = new Deferred();
            const completeList = [];

            const editMode = editingController.getEditMode();
            isFull = isFull || editMode === EDIT_MODE_ROW;

            if(this._isValidationInProgress) {
                return deferred.resolve(false).promise();
            }

            this._isValidationInProgress = true;
            if(isFull) {
                editingController.addDeferred(deferred);
                const changes = editingController.getChanges();
                each(changes, (index, { type, key }) => {

                    if(type !== 'remove') {
                        const validationData = this._getValidationData(key);
                        const validationResult = this.validateGroup(validationData);
                        completeList.push(validationResult);
                        validationResult.done((validationResult) => {
                            validationData.validated = true;
                            isValid = isValid && validationResult.isValid;
                        });
                    }
                });
            } else if(this._currentCellValidator) {
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

        validateGroup: function(validationData) {
            const result = new Deferred();
            const validateGroup = validationData && ValidationEngine.getGroupConfig(validationData);
            let validationResult;

            if(validateGroup?.validators.length) {
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

        updateValidationState: function(change) {
            const editMode = this._editingController.getEditMode();
            const key = change.key;
            const validationData = this._getValidationData(key, true);

            if(FORM_BASED_MODES.indexOf(editMode) === -1) {
                if(change.type === EDIT_DATA_INSERT_TYPE && !this.isRowDataModified(change)) {
                    validationData.isValid = true;
                    return;
                }

                this.setDisableApplyValidationResults(true);
                const groupConfig = ValidationEngine.getGroupConfig(validationData);
                if(groupConfig) {
                    const validationResult = ValidationEngine.validateGroup(validationData);
                    when(validationResult.complete || validationResult).done((validationResult) => {
                        validationData.isValid = validationResult.isValid;
                        validationData.brokenRules = validationResult.brokenRules;
                    });
                } else if(!validationData.brokenRules || !validationData.brokenRules.length) {
                    validationData.isValid = true;
                }
                this.setDisableApplyValidationResults(false);
            } else {
                validationData.isValid = true;
            }
        },

        setValidator: function(validator) {
            this._currentCellValidator = validator;
        },

        renderCellPendingIndicator: function($container) {
            let $indicator = $container.find('.' + PENDING_INDICATOR_CLASS);
            if(!$indicator.length) {
                const $indicatorContainer = $container;
                $indicator = $('<div>').appendTo($indicatorContainer)
                    .addClass(PENDING_INDICATOR_CLASS);
                this._createComponent($indicator, LoadIndicator);
                $container.addClass(VALIDATION_PENDING_CLASS);
            }
        },

        disposeCellPendingIndicator: function($container) {
            const $indicator = $container.find('.' + PENDING_INDICATOR_CLASS);
            if($indicator.length) {
                const indicator = LoadIndicator.getInstance($indicator);
                if(indicator) {
                    indicator.dispose();
                    indicator.$element().remove();
                }
                $container.removeClass(VALIDATION_PENDING_CLASS);
            }
        },

        validationStatusChanged: function(result) {
            const validator = result.validator;
            const validationGroup = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            this.updateCellValidationResult({
                rowKey: validationGroup.key,
                columnIndex: column.index,
                validationResult: result
            });
        },

        validatorInitialized: function(arg) {
            arg.component.on('validating', this.validationStatusChanged.bind(this));
            arg.component.on('validated', this.validationStatusChanged.bind(this));
        },

        validatorDisposing: function(arg) {
            const validator = arg.component;
            const validationGroup = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            const result = this.getCellValidationResult({
                rowKey: validationGroup?.key,
                columnIndex: column.index
            });
            if(validationResultIsValid(result) && result.status === VALIDATION_STATUS.pending) {
                this.cancelCellValidationResult({
                    change: validationGroup,
                    columnIndex: column.index
                });
            }
        },

        applyValidationResult: function($container, result) {
            const validator = result.validator;
            const validationGroup = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            result.brokenRules && result.brokenRules.forEach((rule) => {
                rule.columnIndex = column.index;
                rule.column = column;
            });
            if($container) {
                const validationResult = this.getCellValidationResult({
                    rowKey: validationGroup.key,
                    columnIndex: column.index
                });
                const requestIsDisabled = validationResultIsValid(validationResult) && validationResult.disabledPendingId === result.id;
                if(this._disableApplyValidationResults || requestIsDisabled) {
                    return;
                }
                if(result.status === VALIDATION_STATUS.invalid) {
                    const $focus = $container.find(':focus');
                    if(!focused($focus)) {
                        eventsEngine.trigger($focus, 'focus');
                        eventsEngine.trigger($focus, pointerEvents.down);
                    }
                }
                const editor = !column.editCellTemplate && this.getController('editorFactory').getEditorInstance($container);
                if(result.status === VALIDATION_STATUS.pending) {
                    if(editor) {
                        editor.option('validationStatus', VALIDATION_STATUS.pending);
                    } else {
                        this.renderCellPendingIndicator($container);
                    }
                } else {
                    if(editor) {
                        editor.option('validationStatus', VALIDATION_STATUS.valid);
                    } else {
                        this.disposeCellPendingIndicator($container);
                    }
                }
                $container.toggleClass(this.addWidgetPrefix(INVALIDATE_CLASS), result.status === VALIDATION_STATUS.invalid);
            }
        },

        createValidator: function(parameters, $container) {
            const editingController = this._editingController;
            const column = parameters.column;
            let showEditorAlways = column.showEditorAlways;

            if(isDefined(column.command) || !column.validationRules || !Array.isArray(column.validationRules) || !column.validationRules.length) return;

            const editIndex = editingController.getIndexByKey(parameters.key, editingController.getChanges());
            let needCreateValidator = editIndex > -1;

            if(!needCreateValidator) {
                if(!showEditorAlways) {
                    const columnsController = this.getController('columns');
                    const visibleColumns = columnsController?.getVisibleColumns() || [];
                    showEditorAlways = visibleColumns.some(function(column) { return column.showEditorAlways; });
                }

                const isEditRow = equalByValue(this.option('editing.editRowKey'), parameters.key);
                const isCellOrBatchEditingAllowed = editingController.isCellOrBatchEditMode() && editingController.allowUpdating({ row: parameters.row });

                needCreateValidator = isEditRow || isCellOrBatchEditingAllowed && showEditorAlways;

                if(isCellOrBatchEditingAllowed && showEditorAlways) {
                    editingController._addInternalData({ key: parameters.key, oldData: parameters.data });
                }
            }

            if(needCreateValidator) {
                if($container && !$container.length) {
                    errors.log('E1050');
                    return;
                }

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
                    adapter: useDefaultValidator ? null : {
                        getValue: getValue,
                        applyValidationResults: (result) => {
                            this.applyValidationResult($container, result);
                        }
                    },
                    dataGetter: function() {
                        const key = validationData?.key;
                        const change = editingController.getChangeByKey(key);
                        const oldData = editingController._getOldData(key);
                        return {
                            data: createObjectWithChanges(oldData, change?.data),
                            column
                        };
                    },
                    onInitialized: this.validatorInitialized.bind(this),
                    onDisposing: this.validatorDisposing.bind(this)
                });
                if(useDefaultValidator) {
                    const adapter = validator.option('adapter');
                    if(adapter) {
                        adapter.getValue = getValue;
                        adapter.validationRequestsCallbacks = [];
                    }
                }

                return validator;
            }
        },

        setDisableApplyValidationResults: function(flag) {
            this._disableApplyValidationResults = flag;
        },

        getDisableApplyValidationResults: function() {
            return this._disableApplyValidationResults;
        },

        isCurrentValidatorProcessing: function({ rowKey, columnIndex }) {
            return this._currentCellValidator && this._currentCellValidator.option('validationGroup').key === rowKey
                    && this._currentCellValidator.option('dataGetter')().column.index === columnIndex;
        },

        validateCell: function(validator) {
            const cellParams = {
                rowKey: validator.option('validationGroup').key,
                columnIndex: validator.option('dataGetter')().column.index
            };
            let validationResult = this.getCellValidationResult(cellParams);
            const stateRestored = validationResultIsValid(validationResult);
            if(!stateRestored) {
                validationResult = validator.validate();
            }
            const deferred = new Deferred();
            const adapter = validator.option('adapter');
            if(stateRestored && validationResult.status === VALIDATION_STATUS.pending) {
                this.updateCellValidationResult(cellParams);
                adapter.applyValidationResults(validationResult);
            }
            when(validationResult.complete || validationResult).done((validationResult) => {
                stateRestored && adapter.applyValidationResults(validationResult);
                deferred.resolve(validationResult);
            });
            return deferred.promise();
        },

        updateCellValidationResult: function({ rowKey, columnIndex, validationResult }) {
            const validationData = this._getValidationData(rowKey);
            if(!validationData) {
                return;
            }
            if(!validationData.validationResults) {
                validationData.validationResults = {};
            }
            let result;
            if(validationResult) {
                result = extend({}, validationResult);
                validationData.validationResults[columnIndex] = result;
                if(validationResult.status === VALIDATION_STATUS.pending) {
                    if(this._editingController.getEditMode() === EDIT_MODE_CELL) {
                        result.deferred = new Deferred();
                        result.complete.always(() => {
                            result.deferred.resolve();
                        });
                        this._editingController.addDeferred(result.deferred);
                    }
                    if(this._disableApplyValidationResults) {
                        result.disabledPendingId = validationResult.id;
                        return;
                    }
                }
            } else {
                result = validationData.validationResults[columnIndex];
            }
            if(result && result.disabledPendingId) {
                delete result.disabledPendingId;
            }
        },

        getCellValidationResult: function({ rowKey, columnIndex }) {
            const validationData = this._getValidationData(rowKey, true);
            return validationData?.validationResults?.[columnIndex];
        },

        removeCellValidationResult: function({ change, columnIndex }) {
            const validationData = this._getValidationData(change?.key);

            if(validationData && validationData.validationResults) {
                this.cancelCellValidationResult({ change, columnIndex });
                delete validationData.validationResults[columnIndex];
            }
        },

        cancelCellValidationResult: function({ change, columnIndex }) {
            const validationData = this._getValidationData(change.key);

            if(change && validationData.validationResults) {
                const result = validationData.validationResults[columnIndex];
                if(result) {
                    result.deferred && result.deferred.reject(VALIDATION_CANCELLED);
                    validationData.validationResults[columnIndex] = VALIDATION_CANCELLED;
                }
            }
        },

        resetRowValidationResults: function(validationData) {
            if(validationData) {
                validationData.validationResults && delete validationData.validationResults;
                delete validationData.validated;
            }
        },

        isInvalidCell: function({ rowKey, columnIndex }) {
            const result = this.getCellValidationResult({
                rowKey,
                columnIndex
            });
            return validationResultIsValid(result) && result.status === VALIDATION_STATUS.invalid;
        },

        getCellValidator: function({ rowKey, columnIndex }) {
            const validationData = this._getValidationData(rowKey);
            const groupConfig = validationData && ValidationEngine.getGroupConfig(validationData);
            const validators = groupConfig && groupConfig.validators;
            return validators && validators.filter(v => {
                const column = v.option('dataGetter')().column;
                return column ? column.index === columnIndex : false;
            })[0];
        },

        setCellValidationStatus: function(cellOptions) {
            const validationResult = this.getCellValidationResult({
                rowKey: cellOptions.key,
                columnIndex: cellOptions.column.index
            });

            if(isDefined(validationResult)) {
                cellOptions.validationStatus = validationResult !== VALIDATION_CANCELLED ? validationResult.status : VALIDATION_CANCELLED;
            } else {
                delete cellOptions.validationStatus;
            }
        }
    };
})());

export default {
    defaultOptions: function() {
        return {
            editing: {
                texts: {
                    validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges')
                }
            }
        };
    },
    controllers: {
        validating: ValidatingController
    },
    extenders: {
        controllers: {
            editing: {
                _addChange: function(options, row) {
                    const index = this.callBase(options, row);
                    const validatingController = this.getController('validating');

                    if(index >= 0 && options.type !== EDIT_DATA_REMOVE_TYPE) {
                        const change = this.getChanges()[index];
                        change && validatingController.updateValidationState(change);
                    }

                    return index;
                },

                _handleChangesChange: function(args) {
                    this.callBase.apply(this, arguments);

                    const validatingController = this.getController('validating');

                    args.value.forEach(change => {
                        if(validatingController._getValidationData(change.key) === undefined) {
                            validatingController.updateValidationState(change);
                        }
                    });
                },

                _updateRowAndPageIndices: function() {
                    const that = this;
                    const startInsertIndex = that.getView('rowsView').getTopVisibleItemIndex();
                    let rowIndex = startInsertIndex;

                    each(that.getChanges(), (_, { key, type }) => {
                        const validationData = this.getController('validating')._getValidationData(key);
                        if(validationData && !validationData.isValid && validationData.pageIndex !== that._pageIndex) {
                            validationData.pageIndex = that._pageIndex;
                            if(type === EDIT_DATA_INSERT_TYPE) {
                                validationData.rowIndex = startInsertIndex;
                            } else {
                                validationData.rowIndex = rowIndex;
                            }
                            rowIndex++;
                        }
                    });
                },

                getEditFormOptions: function(detailOptions) {
                    const editFormOptions = this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');
                    const validationData = validatingController._getValidationData(detailOptions.key, true);

                    return extend({}, editFormOptions, {
                        validationGroup: validationData
                    });
                },

                _updateEditRowCore: function(row, skipCurrentRow, isCustomSetCellValue) {
                    this.callBase.apply(this, arguments);

                    // T816256, T844143
                    if(isCustomSetCellValue && this._editForm && !row.isNewRow) {
                        this._editForm.validate();
                    }
                },

                _needInsertItem: function({ key }) {
                    let result = this.callBase.apply(this, arguments);
                    const validationData = this.getController('validating')._getValidationData(key);

                    if(result && !validationData?.isValid) {
                        result = key.pageIndex === this._pageIndex;
                    }

                    return result;
                },

                _prepareEditCell: function(params) {
                    const isNotCanceled = this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');

                    if(isNotCanceled && params.column.showEditorAlways) {
                        validatingController.updateValidationState({ key: params.key });
                    }

                    return isNotCanceled;
                },

                processItems: function(items, changeType) {
                    const that = this;
                    let i;
                    const changes = that.getChanges();
                    const dataController = that.getController('data');
                    const validatingController = this.getController('validating');
                    const getIndexByChange = function(change, items) {
                        let index = -1;
                        const isInsert = change.type === EDIT_DATA_INSERT_TYPE;
                        const key = change.key;

                        each(items, function(i, item) {
                            if(equalByValue(key, isInsert ? item : dataController.keyOf(item))) {
                                index = i;
                                return false;
                            }
                        });

                        return index;
                    };

                    items = that.callBase(items, changeType);
                    const itemsCount = items.length;

                    const addInValidItem = function(change, validationData) {
                        const data = { key: change.key };
                        const index = getIndexByChange(change, items);

                        if(index >= 0) {
                            return;
                        }

                        validationData.rowIndex = validationData.rowIndex > itemsCount ? validationData.rowIndex % itemsCount : validationData.rowIndex;
                        const rowIndex = validationData.rowIndex;

                        data[INSERT_INDEX] = 1;
                        items.splice(rowIndex, 0, data);
                    };

                    if(that.getEditMode() === EDIT_MODE_BATCH && changeType !== 'prepend' && changeType !== 'append') {
                        for(i = 0; i < changes.length; i++) {
                            const key = changes[i].key;
                            const validationData = validatingController._getValidationData(key);
                            if(validationData && changes[i].type && validationData.pageIndex === that._pageIndex && key.pageIndex !== that._pageIndex) {
                                addInValidItem(changes[i], validationData);
                            }
                        }
                    }

                    return items;
                },

                processDataItem: function(item) {
                    const isInserted = item.data[INSERT_INDEX];
                    const key = isInserted ? item.data.key : item.key;
                    const editMode = this.getEditMode();

                    if(editMode === EDIT_MODE_BATCH && isInserted && key) {
                        const changes = this.getChanges();
                        const editIndex = gridCoreUtils.getIndexByKey(key, changes);

                        if(editIndex >= 0) {
                            const change = changes[editIndex];

                            if(change.type !== EDIT_DATA_INSERT_TYPE) {
                                const oldData = this._getOldData(change.key);
                                item.data = extend(true, {}, oldData, change.data);
                                item.key = key;
                            }
                        }
                    }

                    this.callBase.apply(this, arguments);
                },

                _getInvisibleColumns: function(changes) {
                    const columnsController = this.getController('columns');
                    let hasInvisibleRows;
                    const invisibleColumns = columnsController.getInvisibleColumns();

                    if(this.isCellOrBatchEditMode()) {
                        hasInvisibleRows = changes.some(change => {
                            const rowIndex = this._dataController.getRowIndexByKey(change.key);

                            return rowIndex < 0;
                        });
                    }

                    return hasInvisibleRows ? columnsController.getColumns() : invisibleColumns;
                },

                _createInvisibleColumnValidators: function(changes) {
                    const that = this;
                    const validatingController = this.getController('validating');
                    const columnsController = this.getController('columns');
                    const invisibleColumns = this._getInvisibleColumns(changes).filter((column) => !column.isBand);
                    const groupColumns = columnsController.getGroupColumns().filter((column) => !column.showWhenGrouped && invisibleColumns.indexOf(column) === -1);
                    const invisibleColumnValidators = [];

                    invisibleColumns.push(...groupColumns);

                    if(FORM_BASED_MODES.indexOf(this.getEditMode()) === -1) {
                        each(invisibleColumns, function(_, column) {
                            changes.forEach(function(change) {
                                let data;
                                if(change.type === EDIT_DATA_INSERT_TYPE) {
                                    data = change.data;
                                } else if(change.type === 'update') {
                                    const oldData = that._getOldData(change.key);
                                    data = createObjectWithChanges(oldData, change.data);
                                }
                                if(data) {
                                    const validator = validatingController.createValidator({
                                        column: column,
                                        key: change.key,
                                        value: column.calculateCellValue(data)
                                    });
                                    if(validator) {
                                        invisibleColumnValidators.push(validator);
                                    }
                                }
                            });
                        });
                    }
                    return function() {
                        invisibleColumnValidators.forEach(function(validator) { validator.dispose(); });
                    };
                },

                _beforeSaveEditData: function(change, editIndex) {
                    let result = this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');
                    const validationData = validatingController._getValidationData(change?.key);

                    if(change) {
                        const isValid = change.type === 'remove' || validationData.isValid;
                        result = result || !isValid;
                    } else {
                        const disposeValidators = this._createInvisibleColumnValidators(this.getChanges());
                        result = new Deferred();
                        this.executeOperation(result, () => {
                            validatingController.validate(true).done((isFullValid) => {
                                disposeValidators();
                                this._updateRowAndPageIndices();

                                switch(this.getEditMode()) {
                                    case EDIT_MODE_CELL:
                                        if(!isFullValid) {
                                            this._focusEditingCell();
                                        }
                                        break;
                                    case EDIT_MODE_BATCH:
                                        if(!isFullValid) {
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

                _beforeEditCell: function(rowIndex, columnIndex, item) {
                    const result = this.callBase(rowIndex, columnIndex, item);

                    if(this.getEditMode() === EDIT_MODE_CELL) {
                        const $cell = this._rowsView._getCellElement(rowIndex, columnIndex);
                        const validator = $cell && $cell.data('dxValidator');
                        const rowOptions = $cell && $cell.closest('.dx-row').data('options');
                        const value = validator && validator.option('adapter').getValue();
                        if(validator && cellValueShouldBeValidated(value, rowOptions)) {
                            const validatingController = this.getController('validating');
                            const deferred = new Deferred();
                            when(validatingController.validateCell(validator), result).done((validationResult, result) => {
                                deferred.resolve(validationResult.status === VALIDATION_STATUS.valid && result);
                            });
                            return deferred.promise();
                        } else if(!validator) {
                            return result;
                        }
                    }
                },

                _afterSaveEditData: function(cancel) {
                    let $firstErrorRow;
                    each(this.getChanges(), (_, change) => {
                        const $errorRow = this._showErrorRow(change);
                        $firstErrorRow = $firstErrorRow || $errorRow;
                    });
                    if($firstErrorRow) {
                        const scrollable = this._rowsView.getScrollable();
                        if(scrollable) {
                            scrollable.update();
                            scrollable.scrollToElement($firstErrorRow);
                        }
                    }

                    if(cancel && this.getEditMode() === EDIT_MODE_CELL && this._needUpdateRow()) {
                        const editRowIndex = this.getEditRowIndex();

                        this._dataController.updateItems({
                            changeType: 'update',
                            rowIndices: [editRowIndex]
                        });
                        this._focusEditingCell();
                    } else if(!cancel) {
                        this.getController('validating')._validationState = [];
                    }
                },

                _handleDataChanged: function(args) {
                    const validationState = this.getController('validating')._validationState;

                    if(this.option('scrolling.mode') === 'standard') {
                        this.resetRowAndPageIndices();
                    }

                    if(args.changeType === 'prepend') {
                        each(validationState, function(_, validationData) {
                            validationData.rowIndex += args.items.length;
                        });
                    }

                    this.callBase(args);
                },

                resetRowAndPageIndices: function() {
                    const validationState = this.getController('validating')._validationState;

                    each(validationState, (_, validationData) => {
                        if(validationData.pageIndex !== this._pageIndex) {
                            delete validationData.pageIndex;
                            delete validationData.rowIndex;
                        }
                    });
                },

                _beforeCancelEditData: function() {
                    const validatingController = this.getController('validating');

                    validatingController._validationState = [];

                    this.callBase();
                },

                _showErrorRow: function(change) {
                    let $popupContent;
                    const errorHandling = this.getController('errorHandling');
                    const items = this.getController('data').items();
                    const rowIndex = this.getIndexByKey(change.key, items);
                    const validationData = this.getController('validating')._getValidationData(change.key);

                    if(!validationData?.isValid && validationData?.errorText && rowIndex >= 0) {
                        $popupContent = this.getPopupContent();
                        return errorHandling && errorHandling.renderErrorRow(validationData?.errorText, rowIndex, $popupContent);
                    }
                },

                updateFieldValue: function(e) {
                    const validatingController = this.getController('validating');
                    const deferred = new Deferred();
                    validatingController.removeCellValidationResult({
                        change: this.getChangeByKey(e.key),
                        columnIndex: e.column.index
                    });

                    this.callBase.apply(this, arguments).done(() => {
                        const currentValidator = validatingController.getCellValidator({
                            rowKey: e.key,
                            columnIndex: e.column.index
                        });
                        when(currentValidator && validatingController.validateCell(currentValidator))
                            .done((validationResult) => {
                                this.getController('editorFactory').refocus();
                                deferred.resolve(validationResult);
                            });
                    });
                    return deferred.promise();
                },

                highlightDataCell: function($cell, parameters) {
                    this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');

                    validatingController.setCellValidationStatus(parameters);

                    const isEditableCell = !!parameters.setValue;
                    const cellModified = this.isCellModified(parameters);
                    const isValidated = isDefined(parameters.validationStatus);
                    const needValidation = (cellModified && parameters.column.setCellValue) || (isEditableCell && !cellModified && !(parameters.row.isNewRow || !isValidated));
                    if(needValidation) {
                        const validator = $cell.data('dxValidator');
                        if(validator) {
                            when(this.getController('validating').validateCell(validator)).done(() => {
                                validatingController.setCellValidationStatus(parameters);
                            });
                        }
                    }
                },

                getChangeByKey: function(key) {
                    const changes = this.getChanges();
                    return changes[gridCoreUtils.getIndexByKey(key, changes)];
                },

                isCellModified: function(parameters) {
                    const cellModified = this.callBase(parameters);
                    const change = this.getChangeByKey(parameters.key);
                    const isCellInvalid = !!parameters.row && this.getController('validating').isInvalidCell({
                        rowKey: parameters.key,
                        columnIndex: parameters.column.index
                    });
                    return cellModified || (this.getController('validating')._rowIsValidated(change) && isCellInvalid);
                }
            },
            editorFactory: (function() {
                const getWidthOfVisibleCells = function(that, element) {
                    const rowIndex = $(element).closest('tr').index();
                    const $cellElements = $(that._rowsView.getRowElement(rowIndex)).first().children().filter(':not(.dx-hidden-cell)');

                    return that._rowsView._getWidths($cellElements).reduce((w1, w2) => w1 + w2, 0);
                };

                const getBoundaryNonFixedColumnsInfo = function(fixedColumns) {
                    let firstNonFixedColumnIndex;
                    let lastNonFixedColumnIndex;

                    fixedColumns.some((column, index) => {
                        if(column.command === COMMAND_TRANSPARENT) {
                            firstNonFixedColumnIndex = index === 0 ? -1 : index;
                            lastNonFixedColumnIndex = index === fixedColumns.length - 1 ? -1 : index + column.colspan - 1;
                            return true;
                        }
                    });

                    return {
                        startColumnIndex: firstNonFixedColumnIndex,
                        endColumnIndex: lastNonFixedColumnIndex
                    };
                };

                return {
                    _showRevertButton: function($container) {
                        if(!$container || !$container.length) {
                            return;
                        }

                        let $tooltipElement = $container.find('.' + this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
                        $tooltipElement && $tooltipElement.remove();
                        $tooltipElement = $('<div>')
                            .addClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS))
                            .appendTo($container);

                        const tooltipOptions = {
                            animation: null,
                            visible: true,
                            target: $container,
                            container: $container,
                            closeOnOutsideClick: false,
                            closeOnTargetScroll: false,
                            contentTemplate: () => {
                                const $buttonElement = $('<div>').addClass(REVERT_BUTTON_CLASS);
                                const buttonOptions = {
                                    icon: 'revert',
                                    hint: this.option('editing.texts.validationCancelChanges'),
                                    onClick: () => {
                                        this._editingController.cancelEditData();
                                    }
                                };
                                return (new Button($buttonElement, buttonOptions)).$element();
                            },
                            position: {
                                my: 'left top',
                                at: 'right top',
                                of: $container,
                                offset: '1 0',
                                collision: 'flip',
                                boundary: this._rowsView.element()
                            },
                            onPositioned: this._positionedHandler.bind(this)
                        };

                        return new Tooltip($tooltipElement, tooltipOptions);
                    },

                    _hideFixedGroupCell: function($cell, overlayOptions) {
                        let $nextFixedRowElement;
                        let $groupCellElement;
                        const isFixedColumns = this._rowsView.isFixedColumns();
                        const isFormEditMode = this._editingController.isFormEditMode();

                        if(isFixedColumns && !isFormEditMode) {
                            const nextRowOptions = $cell.closest('.dx-row').next().data('options');

                            if(nextRowOptions && nextRowOptions.rowType === 'group') {
                                $nextFixedRowElement = $(this._rowsView.getRowElement(nextRowOptions.rowIndex)).last();
                                $groupCellElement = $nextFixedRowElement.find('.' + GROUP_CELL_CLASS);

                                if($groupCellElement.length && $groupCellElement.get(0).style.visibility !== 'hidden') {
                                    $groupCellElement.css('visibility', 'hidden');

                                    overlayOptions.onDisposing = function() {
                                        $groupCellElement.css('visibility', '');
                                    };
                                }
                            }
                        }
                    },

                    _positionedHandler: function(e, isOverlayVisible) {
                        if(!e.component.__skipPositionProcessing) {
                            const isRevertButton = $(e.element).hasClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS));
                            const needRepaint = !isRevertButton && this._rowsView.updateFreeSpaceRowHeight();
                            const normalizedPosition = this._normalizeValidationMessagePositionAndMaxWidth(e, isRevertButton, isOverlayVisible);

                            e.component.__skipPositionProcessing = !!(needRepaint || normalizedPosition);

                            if(normalizedPosition) {
                                e.component.option(normalizedPosition);
                            } else if(needRepaint) {
                                e.component.repaint();
                            }
                        }
                    },

                    _showValidationMessage: function($cell, messages, alignment, revertTooltip) {
                        const editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
                        const isOverlayVisible = editorPopup && editorPopup.option('visible');
                        const myPosition = isOverlayVisible ? 'top right' : 'top ' + alignment;
                        const atPosition = isOverlayVisible ? 'top left' : 'bottom ' + alignment;
                        const $overlayContainer = $cell.closest(`.${this.addWidgetPrefix(CONTENT_CLASS)}`);

                        let errorMessageText = '';
                        messages && messages.forEach(function(message) {
                            errorMessageText += (errorMessageText.length ? '<br/>' : '') + encodeHtml(message);
                        });

                        const $overlayElement = $('<div>')
                            .addClass(INVALID_MESSAGE_CLASS)
                            .addClass(INVALID_MESSAGE_ALWAYS_CLASS)
                            .addClass(this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS))
                            .html(errorMessageText)
                            .appendTo($cell);

                        const overlayOptions = {
                            target: $cell,
                            container: $overlayContainer,
                            shading: false,
                            width: 'auto',
                            height: 'auto',
                            visible: true,
                            animation: false,
                            propagateOutsideClick: true,
                            closeOnOutsideClick: false,
                            closeOnTargetScroll: false,
                            position: {
                                collision: 'flip',
                                boundary: this._rowsView.element(),
                                boundaryOffset: '0 0',
                                offset: {
                                    x: 0,
                                    // IE and Firefox consider the top row/cell border when calculating a cell offset.
                                    y: !isOverlayVisible && (browser.mozilla || browser.msie) ? -1 : 0
                                },
                                my: myPosition,
                                at: atPosition
                            },
                            onPositioned: e => {
                                this._positionedHandler(e, isOverlayVisible);
                                this._shiftValidationMessageIfNeed(e.component.$content(), revertTooltip && revertTooltip.$content(), $cell);
                            }
                        };

                        this._hideFixedGroupCell($cell, overlayOptions);

                        new Overlay($overlayElement, overlayOptions);
                    },

                    _normalizeValidationMessagePositionAndMaxWidth: function(options, isRevertButton, isOverlayVisible) {
                        const fixedColumns = this._columnsController.getFixedColumns();

                        if(!fixedColumns || !fixedColumns.length) {
                            return;
                        }

                        let position;
                        const visibleTableWidth = !isRevertButton && getWidthOfVisibleCells(this, options.element);
                        const $overlayContentElement = isRevertButton ? options.component.overlayContent() : options.component.$content();
                        const validationMessageWidth = $overlayContentElement.outerWidth(true);
                        const needMaxWidth = !isRevertButton && validationMessageWidth > visibleTableWidth;
                        const columnIndex = this._rowsView.getCellIndex($(options.element).closest('td'));
                        const boundaryNonFixedColumnsInfo = getBoundaryNonFixedColumnsInfo(fixedColumns);

                        if(!isRevertButton && (columnIndex === boundaryNonFixedColumnsInfo.startColumnIndex || needMaxWidth)) {
                            position = {
                                collision: 'none flip',
                                my: 'top left',
                                at: isOverlayVisible ? 'top right' : 'bottom left'
                            };
                        } else if(columnIndex === boundaryNonFixedColumnsInfo.endColumnIndex) {
                            position = {
                                collision: 'none flip',
                                my: 'top right',
                                at: isRevertButton || isOverlayVisible ? 'top left' : 'bottom right'
                            };

                            if(isRevertButton) {
                                position.offset = '-1 0';
                            }
                        }

                        return position && { position: position, maxWidth: needMaxWidth ? visibleTableWidth - 2 : undefined };
                    },

                    _shiftValidationMessageIfNeed: function($content, $revertContent, $cell) {
                        if(!$revertContent) return;

                        const contentOffset = $content.offset();
                        const revertContentOffset = $revertContent.offset();

                        if(contentOffset.top === revertContentOffset.top && contentOffset.left + $content.width() > revertContentOffset.left) {
                            const left = $revertContent.width() + PADDING_BETWEEN_TOOLTIPS;
                            $content.css('left', revertContentOffset.left < $cell.offset().left ? -left : left);
                        }
                    },

                    _getTooltipsSelector: function() {
                        const invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS);
                        const revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
                        return '.dx-editor-cell .' + revertTooltipClass + ', .dx-editor-cell .' + invalidMessageClass + ', .dx-cell-modified .' + invalidMessageClass;
                    },

                    init: function() {
                        this.callBase();
                        this._editingController = this.getController('editing');
                        this._columnsController = this.getController('columns');
                        this._rowsView = this.getView('rowsView');
                    },

                    loseFocus: function(skipValidator) {
                        if(!skipValidator) {
                            this.getController('validating').setValidator(null);
                        }
                        this.callBase();
                    },

                    updateCellState: function($element, validationResult, hideBorder) {
                        const $focus = $element?.closest(this._getFocusCellSelector());
                        const $cell = $focus?.is('td') ? $focus : null;
                        const rowOptions = $focus?.closest('.dx-row').data('options');
                        const change = rowOptions ? this.getController('editing').getChangeByKey(rowOptions.key) : null;
                        const column = $cell && this.getController('columns').getVisibleColumns()[$cell.index()];
                        let revertTooltip;

                        if((validationResult && validationResult.status === VALIDATION_STATUS.invalid)
                            || (change?.type === 'update' && !this._editingController.isSaving())) {
                            if(this._editingController.getEditMode() === EDIT_MODE_CELL) {
                                revertTooltip = this._showRevertButton($focus);
                            }
                        }

                        const showValidationMessage = validationResult && validationResult.status === VALIDATION_STATUS.invalid;

                        if(showValidationMessage && $cell && column && validationResult && validationResult.brokenRules) {
                            const errorMessages = [];
                            validationResult.brokenRules.forEach(function(rule) {
                                errorMessages.push(rule.message);
                            });
                            this._showValidationMessage($focus, errorMessages, column.alignment || 'left', revertTooltip);
                        }

                        !hideBorder && this._rowsView.element() && this._rowsView.updateFreeSpaceRowHeight();
                    },

                    focus: function($element, hideBorder) {
                        if(!arguments.length) return this.callBase();

                        const $tooltips = $element && $element.closest('.' + this.addWidgetPrefix(ROWS_VIEW_CLASS)).find(this._getTooltipsSelector());
                        $tooltips && $tooltips.remove();

                        if($element?.hasClass('dx-row')) {
                            return this.callBase($element, hideBorder);
                        }

                        const $focus = $element?.closest(this._getFocusCellSelector());
                        const callBase = this.callBase;
                        const validator = $focus && ($focus.data('dxValidator') || $element.find('.' + this.addWidgetPrefix(VALIDATOR_CLASS)).eq(0).data('dxValidator'));
                        const rowOptions = $focus && $focus.closest('.dx-row').data('options');
                        const editingController = this.getController('editing');
                        const change = rowOptions ? editingController.getChangeByKey(rowOptions.key) : null;
                        let validationResult;
                        const $cell = $focus && $focus.is('td') ? $focus : null;
                        const column = $cell && this.getController('columns').getVisibleColumns()[$cell.index()];
                        const validatingController = this.getController('validating');

                        if(validator) {
                            validatingController.setValidator(validator);
                            const value = validator.option('adapter').getValue();
                            if(cellValueShouldBeValidated(value, rowOptions) || validatingController._rowIsValidated(change)) {
                                editingController.waitForDeferredOperations().done(() => {
                                    when(validatingController.validateCell(validator)).done((result) => {
                                        validationResult = result;
                                        if(change && column && !validatingController.isCurrentValidatorProcessing({ rowKey: change.key, columnIndex: column.index })) {
                                            return;
                                        }
                                        if(validationResult.status === VALIDATION_STATUS.invalid) {
                                            hideBorder = true;
                                        }
                                        this.updateCellState($element, validationResult, hideBorder);
                                        callBase.call(this, $element, hideBorder);
                                    });
                                });
                                return this.callBase($element, hideBorder);
                            }
                        }

                        this.updateCellState($element, validationResult, hideBorder);
                        return this.callBase($element, hideBorder);
                    },

                    getEditorInstance: function($container) {
                        const $editor = $container.find('.dx-texteditor').eq(0);
                        return gridCoreUtils.getWidgetInstance($editor);
                    }
                };
            })(),
            data: {
                _isCellChanged: function(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
                    const cell = oldRow.cells[columnIndex];
                    const oldValidationStatus = cell && cell.validationStatus;
                    const validatingController = this.getController('validating');
                    const validationResult = validatingController.getCellValidationResult({
                        rowKey: oldRow.key,
                        columnIndex
                    });
                    const validationData = validatingController._getValidationData(oldRow.key);
                    const newValidationStatus = validationResultIsValid(validationResult) ? validationResult.status : validationResult;
                    const rowIsModified = JSON.stringify(newRow.modifiedValues) !== JSON.stringify(oldRow.modifiedValues);
                    const cellIsMarkedAsInvalid = $(cell?.cellElement).hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));

                    if((oldValidationStatus !== newValidationStatus && rowIsModified) || (validationData.isValid && cellIsMarkedAsInvalid)) {
                        return true;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            rowsView: {
                updateFreeSpaceRowHeight: function($table) {
                    const that = this;
                    let $rowElements;
                    let $freeSpaceRowElement;
                    let $freeSpaceRowElements;
                    const $element = that.element();
                    const $tooltipContent = $element && $element.find('.' + that.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS) + ' .dx-overlay-content');

                    that.callBase($table);

                    if($tooltipContent && $tooltipContent.length) {
                        $rowElements = that._getRowElements();
                        $freeSpaceRowElements = that._getFreeSpaceRowElements($table);
                        $freeSpaceRowElement = $freeSpaceRowElements.first();

                        if($freeSpaceRowElement && $rowElements.length === 1 && (!$freeSpaceRowElement.is(':visible') || $tooltipContent.outerHeight() > $freeSpaceRowElement.outerHeight())) {
                            $freeSpaceRowElements.show();
                            $freeSpaceRowElements.height($tooltipContent.outerHeight());
                            return true;
                        }
                    }
                },
                _formItemPrepared: function(cellOptions, $container) {
                    this.callBase.apply(this, arguments);
                    deferUpdate(() => {
                        const $editor = $container.find('.dx-widget').first();
                        const isEditorDisposed = $editor.length && !$editor.children().length;

                        // T736360
                        if(!isEditorDisposed) {
                            this.getController('validating').createValidator(cellOptions, $editor);
                        }
                    });
                },
                _cellPrepared: function($cell, parameters) {
                    if(!this.getController('editing').isFormEditMode()) {
                        this.getController('validating').createValidator(parameters, $cell);
                    }

                    this.callBase.apply(this, arguments);
                }
            }
        }
    }
};
