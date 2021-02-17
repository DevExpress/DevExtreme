import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import { createObjectWithChanges, getIndexByKey, getWidgetInstance } from './ui.grid_core.utils';
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
import themes from '../themes';
import errors from '../widget/ui.errors';
import { Deferred, when } from '../../core/utils/deferred';
import LoadIndicator from '../load_indicator';
import { encodeHtml } from '../../core/utils/string';

const INVALIDATE_CLASS = 'invalid';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const ROWS_VIEW_CLASS = 'rowsview';
const INVALID_MESSAGE_CLASS = 'dx-invalid-message';
const WIDGET_INVALID_MESSAGE_CLASS = 'invalid-message';
const INVALID_MESSAGE_ALWAYS_CLASS = 'dx-invalid-message-always';
const REVERT_BUTTON_CLASS = 'dx-revert-button';
const CELL_HIGHLIGHT_OUTLINE = 'dx-highlight-outline';
const VALIDATOR_CLASS = 'validator';
const PENDING_INDICATOR_CLASS = 'dx-pending-indicator';
const VALIDATION_PENDING_CLASS = 'dx-validation-pending';

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
const VALIDATION_CANCELLED = 'cancel';

const validationResultIsValid = function(result) {
    return isDefined(result) && result !== VALIDATION_CANCELLED;
};

const cellValueShouldBeValidated = function(value, rowOptions) {
    return value !== undefined || (value === undefined && rowOptions && !rowOptions.isNewRow);
};

const rowIsValidated = function(editData) {
    return !!editData && !!editData.validated;
};

const ValidatingController = modules.Controller.inherit((function() {
    return {
        init: function() {
            this._editingController = this.getController('editing');
            this.createAction('onRowValidating');
        },

        _getBrokenRules: function(editData, validationResults) {
            let brokenRules;

            if(validationResults) {
                brokenRules = validationResults.brokenRules || validationResults.brokenRule && [validationResults.brokenRule];
            } else {
                brokenRules = editData.brokenRules || [];
            }

            return brokenRules;
        },

        _rowValidating: function(editData, validationResults) {
            const deferred = new Deferred();
            const brokenRules = this._getBrokenRules(editData, validationResults);
            const isValid = validationResults ? validationResults.isValid : editData.isValid;
            const parameters = {
                brokenRules: brokenRules,
                isValid: isValid,
                key: editData.key,
                newData: editData.data,
                oldData: editData.oldData,
                promise: null,
                errorText: this.getHiddenValidatorsErrorText(brokenRules)
            };

            this.executeAction('onRowValidating', parameters);

            when(parameters.promise).always(function() {
                editData.isValid = parameters.isValid;
                editData.errorText = parameters.errorText;
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
                each(editingController._editData, (index, editData) => {

                    if(editData.type && editData.type !== 'remove') {
                        const validationResult = this.validateGroup(editData);
                        completeList.push(validationResult);
                        validationResult.done((validationResult) => {
                            editData.validated = true;
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

        validateGroup: function(editData) {
            const result = new Deferred();
            const validateGroup = ValidationEngine.getGroupConfig(editData);
            let validationResult;

            if(validateGroup && validateGroup.validators.length) {
                this.resetRowValidationResults(editData);
                validationResult = ValidationEngine.validateGroup(editData);
            }

            when(validationResult && validationResult.complete || validationResult).done((validationResult) => {
                when(this._rowValidating(editData, validationResult)).done(result.resolve);
            });

            return result.promise();
        },

        isRowDataModified(editData) {
            return !isEmptyObject(editData.data);
        },

        updateEditData: function(editData) {
            const editMode = this._editingController.getEditMode();

            if(FORM_BASED_MODES.indexOf(editMode) === -1) {
                if(editData.type === EDIT_DATA_INSERT_TYPE && !this.isRowDataModified(editData)) {
                    editData.isValid = true;
                    return;
                }

                this.setDisableApplyValidationResults(true);
                if(ValidationEngine.getGroupConfig(editData)) {
                    const validationResult = ValidationEngine.validateGroup(editData);
                    when(validationResult.complete || validationResult).done((validationResult) => {
                        editData.isValid = validationResult.isValid;
                        editData.brokenRules = validationResult.brokenRules;
                    });
                } else if(!editData.brokenRules || !editData.brokenRules.length) {
                    editData.isValid = true;
                }
                this.setDisableApplyValidationResults(false);
            } else {
                editData.isValid = true;
            }
        },

        setValidator: function(validator) {
            this._currentCellValidator = validator;
        },

        renderCellPendingIndicator: function($container) {
            let $indicator = $container.find('.' + PENDING_INDICATOR_CLASS);
            if(!$indicator.length) {
                let $indicatorContainer = $container.find('.' + CELL_HIGHLIGHT_OUTLINE);
                if(!$indicatorContainer.length) {
                    $indicatorContainer = $container;
                }
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
            const editData = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            this.updateCellValidationResult({
                rowKey: editData.key,
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
            const editData = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            const result = this.getCellValidationResult({
                rowKey: editData.key,
                columnIndex: column.index
            });
            if(validationResultIsValid(result) && result.status === VALIDATION_STATUS.pending) {
                this.cancelCellValidationResult({
                    editData,
                    columnIndex: column.index
                });
            }
        },

        applyValidationResult: function($container, result) {
            const validator = result.validator;
            const editData = validator.option('validationGroup');
            const column = validator.option('dataGetter')().column;

            result.brokenRules && result.brokenRules.forEach((rule) => {
                rule.columnIndex = column.index;
                rule.column = column;
            });
            if($container) {
                const validationResult = this.getCellValidationResult({
                    rowKey: editData.key,
                    columnIndex: column.index
                });
                const requestIsDisabled = validationResultIsValid(validationResult) && validationResult.disabledPendingId === result.id;
                if(this._disableApplyValidationResults || requestIsDisabled) {
                    return;
                }
                if(result.status === VALIDATION_STATUS.invalid) {
                    const $focus = $container.find(':focus');
                    this._editingController.showHighlighting($container, true);
                    if(!focused($focus)) {
                        eventsEngine.trigger($focus, 'focus');
                        eventsEngine.trigger($focus, pointerEvents.down);
                    }
                }
                const editor = !column.editCellTemplate && this.getController('editorFactory').getEditorInstance($container);
                if(result.status === VALIDATION_STATUS.pending) {
                    this._editingController.showHighlighting($container, true);
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
            let editData;
            let editIndex;
            const editingController = this._editingController;
            const column = parameters.column;

            const getValue = () => {
                const value = column.calculateCellValue(editData.data || {});
                return value !== undefined ? value : parameters.value;
            };
            let showEditorAlways = column.showEditorAlways;

            if(isDefined(column.command) || !column.validationRules || !Array.isArray(column.validationRules) || !column.validationRules.length) return;

            editIndex = editingController.getIndexByKey(parameters.key, editingController._editData);

            if(editIndex < 0) {
                if(!showEditorAlways) {
                    const columnsController = this.getController('columns');
                    const visibleColumns = columnsController && columnsController.getVisibleColumns() || [];
                    showEditorAlways = visibleColumns.some(function(column) { return column.showEditorAlways; });
                }

                if(showEditorAlways && editingController.isCellOrBatchEditMode() && editingController.allowUpdating({ row: parameters.row })) {
                    editIndex = editingController._addEditData({ key: parameters.key, oldData: parameters.data });
                }
            }

            if(editIndex >= 0) {
                if($container && !$container.length) {
                    errors.log('E1050');
                    return;
                }

                editData = editingController._editData[editIndex];

                const useDefaultValidator = $container && $container.hasClass('dx-widget');
                $container && $container.addClass(this.addWidgetPrefix(VALIDATOR_CLASS));
                const validator = new Validator($container || $('<div>'), {
                    name: column.caption,
                    validationRules: extend(true, [], column.validationRules),
                    validationGroup: editData,
                    adapter: useDefaultValidator ? null : {
                        getValue: getValue,
                        applyValidationResults: (result) => {
                            this.applyValidationResult($container, result);
                        }
                    },
                    dataGetter: function() {
                        return {
                            data: createObjectWithChanges(editData.oldData, editData.data),
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
                        adapter.validationRequestsCallbacks.empty();
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
            const editData = this._editingController.getEditDataByKey(rowKey);
            if(!editData) {
                return;
            }
            if(!editData.validationResults) {
                editData.validationResults = {};
            }
            let result;
            if(validationResult) {
                result = extend({}, validationResult);
                editData.validationResults[columnIndex] = result;
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
                result = editData.validationResults[columnIndex];
            }
            if(result && result.disabledPendingId) {
                delete result.disabledPendingId;
            }
        },

        getCellValidationResult: function({ rowKey, columnIndex }) {
            const editData = this._editingController.getEditDataByKey(rowKey);
            return editData && editData.validationResults && editData.validationResults[columnIndex];
        },

        removeCellValidationResult: function({ editData, columnIndex }) {
            if(editData && editData.validationResults) {
                this.cancelCellValidationResult({ editData, columnIndex });
                delete editData.validationResults[columnIndex];
            }
        },

        cancelCellValidationResult: function({ editData, columnIndex }) {
            if(editData && editData.validationResults) {
                const result = editData.validationResults[columnIndex];
                if(result) {
                    result.deferred && result.deferred.reject(VALIDATION_CANCELLED);
                    editData.validationResults[columnIndex] = VALIDATION_CANCELLED;
                }
            }
        },

        resetRowValidationResults: function(editData) {
            if(editData) {
                editData.validationResults && delete editData.validationResults;
                delete editData.validated;
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
            const editData = this._editingController.getEditDataByKey(rowKey);
            const groupConfig = editData && ValidationEngine.getGroupConfig(editData);
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

module.exports = {
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
                _addEditData: function(options, row) {
                    const that = this;
                    const validatingController = that.getController('validating');
                    const editDataIndex = that.callBase(options, row);

                    if(editDataIndex >= 0) {
                        const editData = that._editData[editDataIndex];
                        validatingController.updateEditData(editData);
                    }

                    return editDataIndex;
                },

                _updateRowAndPageIndices: function() {
                    const that = this;
                    const startInsertIndex = that.getView('rowsView').getTopVisibleItemIndex();
                    let rowIndex = startInsertIndex;

                    each(that._editData, function(_, editData) {
                        if(!editData.isValid && editData.pageIndex !== that._pageIndex) {
                            editData.pageIndex = that._pageIndex;
                            if(editData.type === EDIT_DATA_INSERT_TYPE) {
                                editData.rowIndex = startInsertIndex;
                            } else {
                                editData.rowIndex = rowIndex;
                            }
                            rowIndex++;
                        }
                    });
                },

                _needInsertItem: function(editData) {
                    let result = this.callBase.apply(this, arguments);

                    if(result && !editData.isValid) {
                        result = editData.key.pageIndex === this._pageIndex;
                    }

                    return result;
                },

                processItems: function(items, changeType) {
                    const that = this;
                    let i;
                    const editData = that._editData;
                    const dataController = that.getController('data');
                    const getIndexByEditData = function(editData, items) {
                        let index = -1;
                        const isInsert = editData.type === EDIT_DATA_INSERT_TYPE;
                        const key = editData.key;

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

                    const addInValidItem = function(editData) {
                        const data = { key: editData.key };
                        const index = getIndexByEditData(editData, items);

                        if(index >= 0) {
                            return;
                        }

                        editData.rowIndex = editData.rowIndex > itemsCount ? editData.rowIndex % itemsCount : editData.rowIndex;
                        const rowIndex = editData.rowIndex;

                        data[INSERT_INDEX] = 1;
                        items.splice(rowIndex, 0, data);
                    };

                    if(that.getEditMode() === EDIT_MODE_BATCH && changeType !== 'prepend' && changeType !== 'append') {
                        for(i = 0; i < editData.length; i++) {
                            if(editData[i].type && editData[i].pageIndex === that._pageIndex && editData[i].key.pageIndex !== that._pageIndex) {
                                addInValidItem(editData[i]);
                            }
                        }
                    }

                    return items;
                },

                processDataItem: function(item) {
                    const that = this;
                    const isInserted = item.data[INSERT_INDEX];
                    const key = isInserted ? item.data.key : item.key;
                    const editMode = that.getEditMode();

                    if(editMode === EDIT_MODE_BATCH && isInserted && key) {
                        const editIndex = getIndexByKey(key, that._editData);

                        if(editIndex >= 0) {
                            const editData = that._editData[editIndex];

                            if(editData.type !== EDIT_DATA_INSERT_TYPE) {
                                item.data = extend(true, {}, editData.oldData, editData.data);
                                item.key = key;
                            }
                        }
                    }

                    that.callBase.apply(that, arguments);
                },

                _createInvisibleColumnValidators: function(editData) {
                    const validatingController = this.getController('validating');
                    const columnsController = this.getController('columns');
                    const columns = columnsController.getColumns();
                    const invisibleColumns = columnsController.getInvisibleColumns().filter((column) => !column.isBand);
                    const groupColumns = columnsController.getGroupColumns().filter((column) => !column.showWhenGrouped && invisibleColumns.indexOf(column) === -1);
                    const invisibleColumnValidators = [];
                    const isCellVisible = (column, rowKey) => {
                        return this._dataController.getRowIndexByKey(rowKey) >= 0 && invisibleColumns.indexOf(column) < 0;
                    };

                    invisibleColumns.push(...groupColumns);

                    if(FORM_BASED_MODES.indexOf(this.getEditMode()) === -1) {
                        each(columns, function(_, column) {
                            editData.forEach(function(options) {
                                let data;
                                if(isCellVisible(column, options.key)) {
                                    return;
                                }

                                if(options.type === EDIT_DATA_INSERT_TYPE) {
                                    data = options.data;
                                } else if(options.type === 'update') {
                                    data = createObjectWithChanges(options.oldData, options.data);
                                }
                                if(data) {
                                    const validator = validatingController.createValidator({
                                        column: column,
                                        key: options.key,
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

                _beforeSaveEditData: function(editData, editIndex) {
                    let result = this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');

                    if(editData) {
                        const isValid = editData.type === 'remove' || editData.isValid;
                        result = result || !isValid;
                    } else {
                        const disposeValidators = this._createInvisibleColumnValidators(this._editData);
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
                                            this._editRowIndex = -1;
                                            this._editColumnIndex = -1;
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
                    each(this._editData, (_, editData) => {
                        const $errorRow = this._showErrorRow(editData);
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
                    }
                },

                _showErrorRow: function(editData) {
                    let $popupContent;
                    const errorHandling = this.getController('errorHandling');
                    const items = this.getController('data').items();
                    const rowIndex = this.getIndexByKey(editData.key, items);

                    if(!editData.isValid && editData.errorText && rowIndex >= 0) {
                        $popupContent = this.getPopupContent();
                        return errorHandling && errorHandling.renderErrorRow(editData.errorText, rowIndex, $popupContent);
                    }
                },

                updateFieldValue: function(e) {
                    const validatingController = this.getController('validating');
                    const deferred = new Deferred();
                    validatingController.removeCellValidationResult({
                        editData: this.getEditDataByKey(e.key),
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

                showHighlighting: function($cell, skipValidation) {
                    let isValid = true;
                    const callBase = this.callBase;
                    const deferred = new Deferred();

                    if(!skipValidation) {
                        const validator = $cell.data('dxValidator');
                        if(validator) {
                            when(this.getController('validating').validateCell(validator)).done((validationResult) => {
                                isValid = validationResult.status === VALIDATION_STATUS.valid;
                                if(isValid) {
                                    callBase.call(this, $cell);
                                }
                                deferred.resolve();
                            });
                            return deferred.promise();
                        }
                    }

                    if(isValid) {
                        callBase.call(this, $cell);
                    }
                    return deferred.resolve().promise();
                },

                highlightDataCell: function($cell, parameters) {
                    const isEditableCell = !!parameters.setValue;
                    const cellModified = this.isCellModified(parameters);
                    const validatingController = this.getController('validating');


                    if(!cellModified && isEditableCell) {
                        validatingController.setCellValidationStatus(parameters);
                        const isValidated = isDefined(parameters.validationStatus);
                        const skipValidation = parameters.row.isNewRow || !isValidated;
                        when(this.showHighlighting($cell, skipValidation)).done(() => {
                            validatingController.setCellValidationStatus(parameters);
                        });
                        return;
                    }
                    this.callBase.apply(this, arguments);
                },

                getEditDataByKey: function(key) {
                    return this._editData[getIndexByKey(key, this._editData)];
                },

                isCellModified: function(parameters) {
                    const cellModified = this.callBase(parameters);
                    const editData = this.getEditDataByKey(parameters.key);
                    const isCellInvalid = !!parameters.row && this.getController('validating').isInvalidCell({
                        rowKey: parameters.key,
                        columnIndex: parameters.column.index
                    });
                    return cellModified || (rowIsValidated(editData) && isCellInvalid);
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
                    _showRevertButton: function($container, $targetElement) {
                        if(!$targetElement || !$targetElement.length) {
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
                            target: $targetElement,
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
                                of: $targetElement,
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
                        const $highlightContainer = $cell.find('.' + CELL_HIGHLIGHT_OUTLINE);
                        const isMaterial = themes.isMaterial();
                        const overlayTarget = $highlightContainer.length && !isMaterial ? $highlightContainer : $cell;
                        const editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
                        const isOverlayVisible = editorPopup && editorPopup.option('visible');
                        const myPosition = isOverlayVisible ? 'top right' : 'top ' + alignment;
                        const atPosition = isOverlayVisible ? 'top left' : 'bottom ' + alignment;

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
                            target: overlayTarget,
                            container: $cell,
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
                        const $focus = $element && $element.closest(this._getFocusCellSelector());
                        const $cell = $focus && $focus.is('td') ? $focus : null;
                        const rowOptions = $focus && $focus.closest('.dx-row').data('options');
                        const editData = rowOptions ? this.getController('editing').getEditDataByKey(rowOptions.key) : null;
                        const column = $cell && this.getController('columns').getVisibleColumns()[$cell.index()];
                        let revertTooltip;

                        if((validationResult && validationResult.status === VALIDATION_STATUS.invalid)
                            || (editData && editData.type === 'update' && !this._editingController.isSaving())) {
                            if(this._editingController.getEditMode() === EDIT_MODE_CELL) {
                                revertTooltip = this._showRevertButton($focus, $cell ? $focus.find('.' + CELL_HIGHLIGHT_OUTLINE).first() : $focus);
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
                        const editData = rowOptions ? editingController.getEditDataByKey(rowOptions.key) : null;
                        let validationResult;
                        const validatingController = this.getController('validating');

                        if(validator) {
                            validatingController.setValidator(validator);
                            const value = validator.option('adapter').getValue();
                            if(cellValueShouldBeValidated(value, rowOptions) || rowIsValidated(editData)) {
                                editingController.waitForDeferredOperations().done(() => {
                                    when(validatingController.validateCell(validator)).done((result) => {
                                        validationResult = result;
                                        const column = validationResult.validator.option('dataGetter')().column;
                                        if(editData && column && !validatingController.isCurrentValidatorProcessing({ rowKey: editData.key, columnIndex: column.index })) {
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
                        return getWidgetInstance($editor);
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
                    const newValidationStatus = validationResultIsValid(validationResult) ? validationResult.status : validationResult;
                    const rowIsModified = JSON.stringify(newRow.modifiedValues) !== JSON.stringify(oldRow.modifiedValues);
                    if(oldValidationStatus !== newValidationStatus && rowIsModified) {
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
