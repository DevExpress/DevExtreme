"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    commonUtils = require("../../core/utils/common"),
    each = require("../../core/utils/iterator").each,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    focused = require("../widget/selectors").focused,
    equalByValue = commonUtils.equalByValue,
    messageLocalization = require("../../localization/message"),
    Button = require("../button"),
    pointerEvents = require("../../events/pointer"),
    ValidationEngine = require("../validation_engine"),
    Validator = require("../validator"),
    Tooltip = require("../tooltip"),
    Overlay = require("../overlay"),
    themes = require("../themes");

var INVALIDATE_CLASS = "invalid",
    REVERT_TOOLTIP_CLASS = "revert-tooltip",
    ROWS_VIEW_CLASS = "rowsview",
    INVALID_MESSAGE_CLASS = "dx-invalid-message",
    WIDGET_INVALID_MESSAGE_CLASS = "invalid-message",
    INVALID_MESSAGE_ALWAYS_CLASS = "dx-invalid-message-always",
    REVERT_BUTTON_CLASS = "dx-revert-button",
    CELL_HIGHLIGHT_OUTLINE = "dx-highlight-outline",
    VALIDATOR_CLASS = "validator",

    INSERT_INDEX = "__DX_INSERT_INDEX__",
    PADDING_BETWEEN_TOOLTIPS = 2,
    EDIT_MODE_ROW = "row",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_CELL = "cell",
    EDIT_MODE_POPUP = "popup",

    FORM_BASED_MODES = [EDIT_MODE_POPUP, EDIT_MODE_FORM];

var ValidatingController = modules.Controller.inherit((function() {
    return {
        init: function() {
            this._editingController = this.getController("editing");
            this.createAction("onRowValidating");
        },

        _rowValidating: function(editData, validate) {
            var that = this,
                brokenRules = validate ? validate.brokenRules || validate.brokenRule && [validate.brokenRule] : [],
                isValid = validate ? validate.isValid : editData.isValid,
                parameters = {
                    brokenRules: brokenRules,
                    isValid: isValid,
                    key: editData.key,
                    newData: editData.data,
                    oldData: editData.oldData,
                    errorText: this.getHiddenValidatorsErrorText(brokenRules)
                };

            that.executeAction("onRowValidating", parameters);

            editData.isValid = parameters.isValid;
            editData.errorText = parameters.errorText;

            return parameters;
        },

        getHiddenValidatorsErrorText: function(brokenRules) {
            var brokenRulesMessages = [];

            each(brokenRules, function(_, brokenRule) {
                if(!brokenRule.validator.$element().parent().length) {
                    brokenRulesMessages.push(brokenRule.message);
                }
            });
            return brokenRulesMessages.join(", ");
        },

        validate: function(isFull) {
            var that = this,
                isValid = true,
                editingController = that._editingController;

            isFull = isFull || editingController.getEditMode() === EDIT_MODE_ROW;

            if(that._isValidationInProgress) {
                return false;
            }

            that._isValidationInProgress = true;
            if(isFull) {
                each(editingController._editData, function(index, editData) {
                    var validationResult;

                    if(editData.type && editData.type !== "remove") {
                        validationResult = that.validateGroup(editData);
                        if(!validationResult.isValid) {
                            each(validationResult.brokenRules, function() {
                                var value = this.validator.option("adapter").getValue();
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
                    }
                });
            } else if(that._currentCellValidator) {
                isValid = that.validateGroup(that._currentCellValidator._findGroup()).isValid;
            }

            that._isValidationInProgress = false;

            return isValid;
        },

        validateGroup: function(editData) {
            var that = this,
                validateGroup = ValidationEngine.getGroupConfig(editData),
                validationResults;

            if(validateGroup && validateGroup.validators.length) {
                validationResults = ValidationEngine.validateGroup(editData);
            }

            return that._rowValidating(editData, validationResults);
        },

        updateEditData: function(editData) {
            var editMode = this._editingController.getEditMode();

            if(FORM_BASED_MODES.indexOf(editMode) === -1) {
                this.setDisableApplyValidationResults(true);
                editData.isValid = ValidationEngine.getGroupConfig(editData) ? ValidationEngine.validateGroup(editData).isValid : true;
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
            var that = this,
                editingController = that._editingController,
                column = parameters.column,
                editData,
                editIndex,
                defaultValidationResult = function(options) {
                    if(options.brokenRule) {
                        options.brokenRule.columnIndex = column.index;
                        options.brokenRule.column = column;
                    }

                    if($container && !that.getDisableApplyValidationResults()) {
                        if(!options.isValid) {
                            var $focus = $container.find(":focus");
                            editingController.showHighlighting($container, true);
                            if(!focused($focus)) {
                                eventsEngine.trigger($focus, "focus");
                                eventsEngine.trigger($focus, pointerEvents.down);
                            }
                        }
                        $container.toggleClass(that.addWidgetPrefix(INVALIDATE_CLASS), !options.isValid);
                    }
                },
                getValue = function() {
                    var value = column.calculateCellValue(editData.data || {});
                    return value !== undefined ? value : parameters.value;
                },
                visibleColumns,
                columnsController,
                showEditorAlways = column.showEditorAlways;

            if(!column.validationRules || !Array.isArray(column.validationRules) || typeUtils.isDefined(column.command)) return;

            editIndex = editingController.getIndexByKey(parameters.key, editingController._editData);

            if(editIndex < 0) {
                if(!showEditorAlways) {
                    columnsController = that.getController("columns");
                    visibleColumns = columnsController && columnsController.getVisibleColumns() || [];
                    showEditorAlways = visibleColumns.some(function(column) { return column.showEditorAlways; });
                }

                if(showEditorAlways) {
                    editIndex = editingController._addEditData({ key: parameters.key, oldData: parameters.data });
                }
            }

            if(editIndex >= 0) {
                editData = editingController._editData[editIndex];

                var useDefaultValidator = $container && $container.hasClass("dx-widget");
                $container && $container.addClass(that.addWidgetPrefix(VALIDATOR_CLASS));

                var validator = new Validator($container || $("<div>"), {
                    name: column.caption,
                    validationRules: extend(true, [], column.validationRules),
                    validationGroup: editData,
                    adapter: useDefaultValidator ? null : {
                        getValue: getValue,
                        applyValidationResults: defaultValidationResult
                    },
                    dataGetter: function() {
                        return gridCoreUtils.createObjectWithChanges(editData.oldData, editData.data);
                    }
                });

                if(useDefaultValidator) {
                    var adapter = validator.option("adapter");
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
            * @type_function_param1_field4 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule>
            * @type_function_param1_field5 isValid:boolean
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 newData:object
            * @type_function_param1_field8 oldData:object
            * @type_function_param1_field9 errorText:string
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
                    validationCancelChanges: messageLocalization.format("dxDataGrid-validationCancelChanges")
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
                    var that = this,
                        validatingController = that.getController("validating"),
                        editDataIndex = that.callBase(options, row),
                        editData;

                    if(editDataIndex >= 0) {
                        editData = that._editData[editDataIndex];
                        validatingController.updateEditData(editData);
                    }

                    return editDataIndex;
                },

                _updateRowAndPageIndices: function() {
                    var that = this,
                        startInsertIndex = that.getView("rowsView").getTopVisibleItemIndex(),
                        rowIndex = startInsertIndex;

                    each(that._editData, function(_, editData) {
                        if(!editData.isValid && editData.pageIndex !== that._pageIndex) {
                            editData.pageIndex = that._pageIndex;
                            if(editData.type === "insert") {
                                editData.rowIndex = startInsertIndex;
                            } else {
                                editData.rowIndex = rowIndex;
                            }
                            rowIndex++;
                        }
                    });
                },

                _needInsertItem: function(editData) {
                    var result = this.callBase.apply(this, arguments);

                    if(result && !editData.isValid) {
                        result = editData.key.pageIndex === this._pageIndex;
                    }

                    return result;
                },

                processItems: function(items, changeType) {
                    var that = this,
                        i,
                        itemsCount,
                        insertCount = 0,
                        editData = that._editData,
                        dataController = that.getController("data"),
                        getIndexByEditData = function(editData, items) {
                            var index = -1,
                                isInsert = editData.type === "insert",
                                key = editData.key;

                            each(items, function(i, item) {
                                if(equalByValue(key, isInsert ? item : dataController.keyOf(item))) {
                                    index = i;
                                    return false;
                                }
                            });

                            return index;
                        },
                        addInValidItem = function(editData) {
                            var data = { key: editData.key },
                                index = getIndexByEditData(editData, items),
                                rowIndex;

                            if(index >= 0) {
                                return;
                            }

                            editData.rowIndex = editData.rowIndex > itemsCount ? editData.rowIndex % itemsCount : editData.rowIndex;
                            rowIndex = editData.rowIndex;

                            data[INSERT_INDEX] = 1;
                            items.splice(rowIndex, 0, data);
                            insertCount++;
                        };

                    items = that.callBase(items, changeType);
                    itemsCount = items.length;

                    if(that.getEditMode() === EDIT_MODE_BATCH && changeType !== "prepend" && changeType !== "append") {
                        for(i = 0; i < editData.length; i++) {
                            if(editData[i].type && editData[i].pageIndex === that._pageIndex && editData[i].key.pageIndex !== that._pageIndex) {
                                addInValidItem(editData[i]);
                            }
                        }
                    }

                    return items;
                },

                processDataItem: function(item) {
                    var that = this,
                        editIndex,
                        editData,
                        isInserted = item.data[INSERT_INDEX],
                        key = isInserted ? item.data.key : item.key,
                        editMode = that.getEditMode();

                    if(editMode === EDIT_MODE_BATCH && isInserted && key) {
                        editIndex = gridCoreUtils.getIndexByKey(key, that._editData);

                        if(editIndex >= 0) {
                            editData = that._editData[editIndex];

                            if(editData.type !== "insert") {
                                item.data = extend(true, {}, editData.oldData, editData.data);
                                item.key = key;
                            }
                        }
                    }

                    that.callBase.apply(that, arguments);
                },

                _createInvisibleColumnValidators: function(editData) {
                    var validatingController = this.getController("validating"),
                        invisibleColumns = commonUtils.grep(this.getController("columns").getInvisibleColumns(), function(column) { return !column.isBand; }),
                        invisibleColumnValidators = [];

                    if(FORM_BASED_MODES.indexOf(this.getEditMode()) === -1) {
                        each(invisibleColumns, function(_, column) {
                            editData.forEach(function(options) {
                                var data;
                                if(options.type === "insert") {
                                    data = options.data;
                                } else if(options.type === "update") {
                                    data = gridCoreUtils.createObjectWithChanges(options.oldData, options.data);
                                }
                                if(data) {
                                    var validator = validatingController.createValidator({
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
                    var that = this,
                        isValid,
                        isFullValid,
                        result = that.callBase.apply(that, arguments),
                        validatingController = that.getController("validating");

                    if(editData) {
                        isValid = editData.type === "remove" || editData.isValid;
                        result = result || !isValid;
                    } else {
                        var disposeValidators = that._createInvisibleColumnValidators(this._editData);
                        isFullValid = validatingController.validate(true);
                        disposeValidators();
                        that._updateRowAndPageIndices();

                        switch(that.getEditMode()) {
                            case EDIT_MODE_CELL:
                                if(!isFullValid) {
                                    that._focusEditingCell();
                                    result = true;
                                }
                                break;
                            case EDIT_MODE_BATCH:
                                if(!isFullValid) {
                                    that._editRowIndex = -1;
                                    that._editColumnIndex = -1;
                                    that.getController("data").updateItems();
                                    result = true;
                                }
                                break;
                            case EDIT_MODE_ROW:
                            case EDIT_MODE_POPUP:
                                result = !isFullValid;
                                break;
                        }
                    }
                    return result;
                },

                _beforeEditCell: function(rowIndex, columnIndex, item) {
                    var result = this.callBase(rowIndex, columnIndex, item),
                        $cell = this._rowsView._getCellElement(rowIndex, columnIndex),
                        validator = $cell && $cell.data("dxValidator"),
                        value = validator && validator.option("adapter").getValue();

                    if(this.getEditMode(this) === EDIT_MODE_CELL && (!validator || value !== undefined && validator.validate().isValid)) {
                        return result;
                    }
                },

                _afterSaveEditData: function() {
                    var that = this,
                        $firstErrorRow;

                    each(that._editData, function(_, editData) {
                        var $errorRow = that._showErrorRow(editData);
                        $firstErrorRow = $firstErrorRow || $errorRow;
                    });
                    if($firstErrorRow) {
                        var scrollable = this._rowsView.getScrollable();
                        if(scrollable) {
                            scrollable.update();
                            scrollable.scrollToElement($firstErrorRow);
                        }
                    }
                },

                _showErrorRow: function(editData) {
                    var $popupContent,
                        errorHandling = this.getController("errorHandling"),
                        items = this.getController("data").items(),
                        rowIndex = this.getIndexByKey(editData.key, items);

                    if(!editData.isValid && editData.errorText && rowIndex >= 0) {
                        $popupContent = this.getPopupContent();
                        return errorHandling && errorHandling.renderErrorRow(editData.errorText, rowIndex, $popupContent);
                    }
                },

                updateFieldValue: function(e) {
                    var that = this,
                        editMode = that.getEditMode();

                    that.callBase.apply(that, arguments);

                    if(editMode === EDIT_MODE_ROW || (editMode === EDIT_MODE_BATCH && e.column.showEditorAlways)) {
                        var currentValidator = that.getController("validating").getValidator();
                        currentValidator && currentValidator.validate();
                    }
                },

                showHighlighting: function($cell, skipValidation) {
                    var isValid = true,
                        validator;

                    if(!skipValidation) {
                        validator = $cell.data("dxValidator");
                        if(validator) {
                            isValid = validator.validate().isValid;
                        }
                    }

                    if(isValid) {
                        this.callBase($cell);
                    }
                },
                getEditDataByKey: function(key) {
                    return this._editData[gridCoreUtils.getIndexByKey(key, this._editData)];
                }
            },
            editorFactory: {
                _showRevertButton: function($container, $targetElement) {
                    if(!$targetElement || !$targetElement.length) {
                        return;
                    }

                    let $tooltipElement = $("<div>")
                        .addClass(this.addWidgetPrefix(REVERT_TOOLTIP_CLASS))
                        .appendTo($container);

                    let tooltipOptions = {
                        animation: null,
                        visible: true,
                        target: $targetElement,
                        container: $container,
                        closeOnOutsideClick: false,
                        closeOnTargetScroll: false,
                        boundary: this._rowsView.element(),
                        contentTemplate: () => {
                            let $buttonElement = $("<div>").addClass(REVERT_BUTTON_CLASS);
                            let buttonOptions = {
                                icon: "revert",
                                hint: this.option("editing.texts.validationCancelChanges"),
                                onClick: () => {
                                    this._editingController.cancelEditData();
                                }
                            };
                            return (new Button($buttonElement, buttonOptions)).$element();
                        },
                        position: {
                            my: "left top",
                            at: "right top",
                            of: $targetElement,
                            offset: "1 0",
                            collision: "flip"
                        }
                    };

                    return new Tooltip($tooltipElement, tooltipOptions);
                },

                _showValidationMessage: function($cell, message, alignment, revertTooltip) {
                    let needRepaint,
                        $highlightContainer = $cell.find("." + CELL_HIGHLIGHT_OUTLINE),
                        isMaterial = themes.isMaterial(),
                        overlayTarget = $highlightContainer.length && !isMaterial ? $highlightContainer : $cell,
                        isOverlayVisible = $cell.find(".dx-dropdowneditor-overlay").is(":visible"),
                        myPosition = isOverlayVisible ? "top right" : "top " + alignment,
                        atPosition = isOverlayVisible ? "top left" : "bottom " + alignment;

                    let $overlayElement = $("<div>")
                        .addClass(INVALID_MESSAGE_CLASS)
                        .addClass(INVALID_MESSAGE_ALWAYS_CLASS)
                        .addClass(this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS))
                        .text(message)
                        .appendTo($cell);

                    let overlayOptions = {
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
                            collision: "flip",
                            boundary: this._rowsView.element(),
                            boundaryOffset: "0 0",
                            my: myPosition,
                            at: atPosition
                        },
                        onPositioned: e => {
                            if(!needRepaint) {
                                needRepaint = this._rowsView.updateFreeSpaceRowHeight();
                                if(needRepaint) {
                                    e.component.repaint();
                                }
                            }

                            this._shiftValidationMessageIfNeed(e.component.$content(), revertTooltip && revertTooltip.$content(), $cell);
                        }
                    };

                    new Overlay($overlayElement, overlayOptions);
                },

                _shiftValidationMessageIfNeed: function($content, $revertContent, $cell) {
                    if(!$revertContent) return;

                    var contentOffset = $content.offset(),
                        revertContentOffset = $revertContent.offset();

                    if(contentOffset.top === revertContentOffset.top && contentOffset.left + $content.width() > revertContentOffset.left) {
                        var left = $revertContent.width() + PADDING_BETWEEN_TOOLTIPS;
                        $content.css("left", revertContentOffset.left < $cell.offset().left ? -left : left);
                    }
                },

                _getTooltipsSelector: function() {
                    var invalidMessageClass = this.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS),
                        revertTooltipClass = this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
                    return ".dx-editor-cell ." + revertTooltipClass + ", .dx-editor-cell ." + invalidMessageClass + ", .dx-cell-modified ." + invalidMessageClass;
                },

                init: function() {
                    this.callBase();
                    this._editingController = this.getController("editing");
                    this._rowsView = this.getView("rowsView");
                },

                loseFocus: function(skipValidator) {
                    if(!skipValidator) {
                        this.getController("validating").setValidator(null);
                    }
                    this.callBase();
                },

                focus: function($element, hideBorder) {
                    var that = this,
                        $focus = $element && $element.closest(that._getFocusCellSelector()),
                        validator = $focus && ($focus.data("dxValidator") || $element.find("." + that.addWidgetPrefix(VALIDATOR_CLASS)).eq(0).data("dxValidator")),
                        rowOptions = $focus && $focus.closest(".dx-row").data("options"),
                        editData = rowOptions ? that.getController("editing").getEditDataByKey(rowOptions.key) : null,
                        validationResult,
                        $tooltips = $focus && $focus.closest("." + that.addWidgetPrefix(ROWS_VIEW_CLASS)).find(that._getTooltipsSelector()),
                        $cell = $focus && $focus.is("td") ? $focus : null,
                        showValidationMessage = false,
                        revertTooltip,
                        column = $cell && that.getController("columns").getVisibleColumns()[$cell.index()];

                    if(!arguments.length) return that.callBase();

                    $tooltips && $tooltips.remove();

                    if(validator) {
                        that.getController("validating").setValidator(validator);

                        if(validator.option("adapter").getValue() !== undefined) {
                            validationResult = validator.validate();

                            if(!validationResult.isValid) {
                                hideBorder = true;
                                showValidationMessage = true;
                            }
                        }
                    }

                    if((validationResult && !validationResult.isValid) || (editData && editData.type === "update")) {
                        if(that._editingController.getEditMode() === EDIT_MODE_CELL) {
                            revertTooltip = that._showRevertButton($focus, $cell ? $focus.find("." + CELL_HIGHLIGHT_OUTLINE).first() : $focus);
                        }
                    }
                    if(showValidationMessage && $cell && column && validationResult.brokenRule.message) {
                        that._showValidationMessage($focus, validationResult.brokenRule.message, column.alignment, revertTooltip);
                    }

                    !hideBorder && that._rowsView.element() && that._rowsView.updateFreeSpaceRowHeight();
                    return that.callBase($element, hideBorder);
                }
            }
        },
        views: {
            rowsView: {
                updateFreeSpaceRowHeight: function($table) {
                    var that = this,
                        $rowElements,
                        $freeSpaceRowElement,
                        $freeSpaceRowElements,
                        $element = that.element(),
                        $tooltipContent = $element && $element.find("." + that.addWidgetPrefix(WIDGET_INVALID_MESSAGE_CLASS) + " .dx-overlay-content");

                    that.callBase($table);

                    if($tooltipContent && $tooltipContent.length) {
                        $rowElements = that._getRowElements();
                        $freeSpaceRowElements = that._getFreeSpaceRowElements($table);
                        $freeSpaceRowElement = $freeSpaceRowElements.first();

                        if($freeSpaceRowElement && $rowElements.length === 1 && (!$freeSpaceRowElement.is(":visible") || $tooltipContent.outerHeight() > $freeSpaceRowElement.outerHeight())) {
                            $freeSpaceRowElements.show();
                            $freeSpaceRowElements.height($tooltipContent.outerHeight());
                            return true;
                        }
                    }
                },
                _formItemPrepared: function(cellOptions, $container) {
                    this.callBase.apply(this, arguments);
                    this.getController("validating").createValidator(cellOptions, $container.find(".dx-widget").first());
                },
                _cellPrepared: function($cell, parameters) {
                    this.getController("validating").createValidator(parameters, $cell);

                    this.callBase.apply(this, arguments);
                }
            }
        }
    }
};
