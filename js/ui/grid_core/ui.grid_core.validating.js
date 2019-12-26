import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import modules from './ui.grid_core.modules';
import { createObjectWithChanges, getIndexByKey } from './ui.grid_core.utils';
import { deferUpdate, equalByValue } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { isDefined } from '../../core/utils/type';
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

const INVALIDATE_CLASS = 'invalid';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const ROWS_VIEW_CLASS = 'rowsview';
const INVALID_MESSAGE_CLASS = 'dx-invalid-message';
const WIDGET_INVALID_MESSAGE_CLASS = 'invalid-message';
const INVALID_MESSAGE_ALWAYS_CLASS = 'dx-invalid-message-always';
const REVERT_BUTTON_CLASS = 'dx-revert-button';
const CELL_HIGHLIGHT_OUTLINE = 'dx-highlight-outline';
const VALIDATOR_CLASS = 'validator';

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
            let brokenRulesMessages = [];

            each(brokenRules, function(_, brokenRule) {
                let column = brokenRule.column,
                    isGroupExpandColumn = column && column.groupIndex !== undefined && !column.showWhenGrouped,
                    isVisibleColumn = column && column.visible;

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

            isFull = isFull || editingController.getEditMode() === EDIT_MODE_ROW;

            if(this._isValidationInProgress) {
                return deferred.resolve(false).promise();
            }

            this._isValidationInProgress = true;
            if(isFull) {
                each(editingController._editData, (index, editData) => {
                    let validationResult;

                    if(editData.type && editData.type !== 'remove') {
                        validationResult = this.validateGroup(editData);
                        completeList.push(validationResult);

                        validationResult.done(validationResult => {
                            if(!validationResult.isValid) {
                                each(validationResult.brokenRules, function() {
                                    let value = this.validator.option('adapter').getValue();
                                    if(value === undefined) {
                                        value = null;
                                    }
                                    if(this.column) {
                                        editingController.updateFieldValue({
                                            key: editData.key,
                                            column: this.column
                                        }, value, null, true);
                                    }
                                });
                            }
                            isValid = isValid && validationResult.isValid;
                        });
                    }
                });
            } else if(this._currentCellValidator) {
                const validationResult = this.validateGroup(this._currentCellValidator._findGroup());
                completeList.push(validationResult);
                validationResult.done(validationResult => {
                    isValid = validationResult.isValid;
                });
            }

            this._isValidationInProgress = false;

            when(...completeList).done(function() {
                deferred.resolve(isValid);
            });

            return deferred.promise();
        },

        validateGroup: function(editData) {
            const result = new Deferred();
            const validateGroup = ValidationEngine.getGroupConfig(editData);
            let validationResults;

            if(validateGroup && validateGroup.validators.length) {
                validationResults = ValidationEngine.validateGroup(editData);
            }

            when(validationResults && validationResults.complete || validationResults).done(validationResults => {
                when(this._rowValidating(editData, validationResults)).done(result.resolve);
            });

            return result.promise();
        },

        updateEditData: function(editData) {
            const editMode = this._editingController.getEditMode();

            if(FORM_BASED_MODES.indexOf(editMode) === -1) {
                this.setDisableApplyValidationResults(true);
                if(ValidationEngine.getGroupConfig(editData)) {
                    const validationResult = ValidationEngine.validateGroup(editData);
                    when(validationResult.complete || validationResult).done(validationResult => {
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

        getValidator: function() {
            return this._currentCellValidator;
        },

        createValidator: function(parameters, $container) {
            const that = this;
            const editingController = that._editingController;
            const column = parameters.column;
            let editData;
            let editIndex;
            const defaultValidationResult = function(options) {
                if(options.brokenRule) {
                    options.brokenRule.columnIndex = column.index;
                    options.brokenRule.column = column;
                }

                if($container && !that.getDisableApplyValidationResults()) {
                    if(!options.isValid) {
                        const $focus = $container.find(':focus');
                        editingController.showHighlighting($container, true);
                        if(!focused($focus)) {
                            eventsEngine.trigger($focus, 'focus');
                            eventsEngine.trigger($focus, pointerEvents.down);
                        }
                    }
                    $container.toggleClass(that.addWidgetPrefix(INVALIDATE_CLASS), !options.isValid);
                }
            };
            const getValue = function() {
                const value = column.calculateCellValue(editData.data || {});
                return value !== undefined ? value : parameters.value;
            };
            let visibleColumns;
            let columnsController;
            let showEditorAlways = column.showEditorAlways;

            if(!column.validationRules || !Array.isArray(column.validationRules) || !column.validationRules.length || isDefined(column.command)) return;

            editIndex = editingController.getIndexByKey(parameters.key, editingController._editData);

            if(editIndex < 0) {
                if(!showEditorAlways) {
                    columnsController = that.getController('columns');
                    visibleColumns = columnsController && columnsController.getVisibleColumns() || [];
                    showEditorAlways = visibleColumns.some(function(column) { return column.showEditorAlways; });
                }

                if(showEditorAlways) {
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
                $container && $container.addClass(that.addWidgetPrefix(VALIDATOR_CLASS));

                const validator = new Validator($container || $('<div>'), {
                    name: column.caption,
                    validationRules: extend(true, [], column.validationRules),
                    validationGroup: editData,
                    adapter: useDefaultValidator ? null : {
                        getValue: getValue,
                        applyValidationResults: defaultValidationResult
                    },
                    dataGetter: function() {
                        return {
                            data: createObjectWithChanges(editData.oldData, editData.data),
                            column
                        };
                    }
                });

                if(useDefaultValidator) {
                    const adapter = validator.option('adapter');
                    if(adapter) {
                        adapter.getValue = getValue;
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
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
            /**
            * @name GridBaseOptions.onRowValidating
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
            * @type_function_param1_field5 isValid:boolean
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 newData:object
            * @type_function_param1_field8 oldData:object
            * @type_function_param1_field9 errorText:string
            * @type_function_param1_field10 promise:Promise<void>
            * @extends Action
            * @action
            */
            editing: {
                texts: {
                    /**
                     * @name GridBaseOptions.editing.texts.validationCancelChanges
                     * @type string
                     * @default "Cancel changes"
                     */
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
                    let editData;

                    if(editDataIndex >= 0) {
                        editData = that._editData[editDataIndex];
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
                            if(editData.type === 'insert') {
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
                    let itemsCount;
                    const editData = that._editData;
                    const dataController = that.getController('data');
                    const getIndexByEditData = function(editData, items) {
                        let index = -1;
                        const isInsert = editData.type === 'insert';
                        const key = editData.key;

                        each(items, function(i, item) {
                            if(equalByValue(key, isInsert ? item : dataController.keyOf(item))) {
                                index = i;
                                return false;
                            }
                        });

                        return index;
                    };
                    const addInValidItem = function(editData) {
                        const data = { key: editData.key };
                        const index = getIndexByEditData(editData, items);
                        let rowIndex;

                        if(index >= 0) {
                            return;
                        }

                        editData.rowIndex = editData.rowIndex > itemsCount ? editData.rowIndex % itemsCount : editData.rowIndex;
                        rowIndex = editData.rowIndex;

                        data[INSERT_INDEX] = 1;
                        items.splice(rowIndex, 0, data);
                    };

                    items = that.callBase(items, changeType);
                    itemsCount = items.length;

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
                    let editIndex;
                    let editData;
                    const isInserted = item.data[INSERT_INDEX];
                    const key = isInserted ? item.data.key : item.key;
                    const editMode = that.getEditMode();

                    if(editMode === EDIT_MODE_BATCH && isInserted && key) {
                        editIndex = getIndexByKey(key, that._editData);

                        if(editIndex >= 0) {
                            editData = that._editData[editIndex];

                            if(editData.type !== 'insert') {
                                item.data = extend(true, {}, editData.oldData, editData.data);
                                item.key = key;
                            }
                        }
                    }

                    that.callBase.apply(that, arguments);
                },

                _getInvisibleColumns: function(editData) {
                    var columnsController = this.getController('columns'),
                        hasInvisibleRows,
                        invisibleColumns = columnsController.getInvisibleColumns();

                    if(this.isCellOrBatchEditMode()) {
                        hasInvisibleRows = editData.some((rowEditData) => {
                            let rowIndex = this._dataController.getRowIndexByKey(rowEditData.key);

                            return rowIndex < 0;
                        });
                    }

                    return hasInvisibleRows ? columnsController.getColumns() : invisibleColumns;
                },

                _createInvisibleColumnValidators: function(editData) {
                    var validatingController = this.getController('validating'),
                        columnsController = this.getController('columns'),
                        invisibleColumns = this._getInvisibleColumns(editData).filter((column) => !column.isBand),
                        groupColumns = columnsController.getGroupColumns().filter((column) => !column.showWhenGrouped && invisibleColumns.indexOf(column) === -1),
                        invisibleColumnValidators = [];

                    invisibleColumns.push(...groupColumns);

                    if(FORM_BASED_MODES.indexOf(this.getEditMode()) === -1) {
                        each(invisibleColumns, function(_, column) {
                            editData.forEach(function(options) {
                                let data;
                                if(options.type === 'insert') {
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
                        invisibleColumnValidators.forEach(function(validator) { validator._dispose(); });
                    };
                },

                _beforeSaveEditData: function(editData, editIndex) {
                    let isValid;
                    let result = this.callBase.apply(this, arguments);
                    const validatingController = this.getController('validating');

                    if(editData) {
                        isValid = editData.type === 'remove' || editData.isValid;
                        result = result || !isValid;
                    } else {
                        const disposeValidators = this._createInvisibleColumnValidators(this._editData);
                        result = new Deferred();
                        validatingController.validate(true).done(isFullValid => {
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
                    }
                    return result.promise ? result.promise() : result;
                },

                _beforeEditCell: function(rowIndex, columnIndex, item) {
                    const result = this.callBase(rowIndex, columnIndex, item);
                    const $cell = this._rowsView._getCellElement(rowIndex, columnIndex);
                    const validator = $cell && $cell.data('dxValidator');
                    const value = validator && validator.option('adapter').getValue();

                    if(this.getEditMode(this) === EDIT_MODE_CELL && (!validator || value !== undefined && validator.validate().isValid)) {
                        return result;
                    }
                },

                _afterSaveEditData: function() {
                    const that = this;
                    let $firstErrorRow;

                    each(that._editData, function(_, editData) {
                        const $errorRow = that._showErrorRow(editData);
                        $firstErrorRow = $firstErrorRow || $errorRow;
                    });
                    if($firstErrorRow) {
                        const scrollable = this._rowsView.getScrollable();
                        if(scrollable) {
                            scrollable.update();
                            scrollable.scrollToElement($firstErrorRow);
                        }
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
                    const that = this;
                    const editMode = that.getEditMode();

                    that.callBase.apply(that, arguments);

                    if(editMode === EDIT_MODE_ROW || (editMode === EDIT_MODE_BATCH && e.column.showEditorAlways)) {
                        const currentValidator = that.getController('validating').getValidator();
                        currentValidator && currentValidator.validate();
                    }
                },

                showHighlighting: function($cell, skipValidation) {
                    let isValid = true;
                    const callBase = this.callBase;
                    let validator;

                    if(!skipValidation) {
                        validator = $cell.data('dxValidator');
                        if(validator) {
                            const validationResult = validator.validate();
                            when(validationResult.complete || validationResult).done(validationResult => {
                                isValid = validationResult.isValid;
                                if(isValid) {
                                    callBase.call(this, $cell);
                                }
                            });
                            return;
                        }
                    }

                    if(isValid) {
                        callBase.call(this, $cell);
                    }
                },
                getEditDataByKey: function(key) {
                    return this._editData[getIndexByKey(key, this._editData)];
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

                        const $tooltipElement = $('<div>')
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
                        let nextRowOptions;
                        let $nextFixedRowElement;
                        let $groupCellElement;
                        const isFixedColumns = this._rowsView.isFixedColumns();
                        const isFormEditMode = this._editingController.isFormEditMode();

                        if(isFixedColumns && !isFormEditMode) {
                            nextRowOptions = $cell.closest('.dx-row').next().data('options');

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

                    _showValidationMessage: function($cell, message, alignment, revertTooltip) {
                        const $highlightContainer = $cell.find('.' + CELL_HIGHLIGHT_OUTLINE);
                        const isMaterial = themes.isMaterial();
                        const overlayTarget = $highlightContainer.length && !isMaterial ? $highlightContainer : $cell;
                        const editorPopup = $cell.find('.dx-dropdowneditor-overlay').data('dxPopup');
                        const isOverlayVisible = editorPopup && editorPopup.option('visible');
                        const myPosition = isOverlayVisible ? 'top right' : 'top ' + alignment;
                        const atPosition = isOverlayVisible ? 'top left' : 'bottom ' + alignment;

                        const $overlayElement = $('<div>')
                            .addClass(INVALID_MESSAGE_CLASS)
                            .addClass(INVALID_MESSAGE_ALWAYS_CLASS)
                            .addClass(this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS))
                            .text(message)
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

                    focus: function($element, hideBorder) {
                        const that = this;
                        const $focus = $element && $element.closest(that._getFocusCellSelector());
                        const validator = $focus && ($focus.data('dxValidator') || $element.find('.' + that.addWidgetPrefix(VALIDATOR_CLASS)).eq(0).data('dxValidator'));
                        const rowOptions = $focus && $focus.closest('.dx-row').data('options');
                        const editData = rowOptions ? that.getController('editing').getEditDataByKey(rowOptions.key) : null;
                        let validationResult;
                        const $tooltips = $focus && $focus.closest('.' + that.addWidgetPrefix(ROWS_VIEW_CLASS)).find(that._getTooltipsSelector());
                        const $cell = $focus && $focus.is('td') ? $focus : null;
                        let showValidationMessage = false;
                        let revertTooltip;
                        const column = $cell && that.getController('columns').getVisibleColumns()[$cell.index()];

                        if(!arguments.length) return that.callBase();

                        $tooltips && $tooltips.remove();

                        if(validator) {
                            that.getController('validating').setValidator(validator);

                            if(validator.option('adapter').getValue() !== undefined) {
                                validationResult = validator.validate();

                                if(!validationResult.isValid) {
                                    hideBorder = true;
                                    showValidationMessage = true;
                                }
                            }
                        }

                        if((validationResult && !validationResult.isValid) || (editData && editData.type === 'update' && !that._editingController.isSaving())) {
                            if(that._editingController.getEditMode() === EDIT_MODE_CELL) {
                                revertTooltip = that._showRevertButton($focus, $cell ? $focus.find('.' + CELL_HIGHLIGHT_OUTLINE).first() : $focus);
                            }
                        }
                        if(showValidationMessage && $cell && column && validationResult.brokenRule.message) {
                            that._showValidationMessage($focus, validationResult.brokenRule.message, column.alignment || 'left', revertTooltip);
                        }

                        !hideBorder && that._rowsView.element() && that._rowsView.updateFreeSpaceRowHeight();
                        return that.callBase($element, hideBorder);
                    }
                };
            })()
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
