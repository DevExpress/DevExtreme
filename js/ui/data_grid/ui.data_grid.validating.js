"use strict";

var $ = require("jquery"),
    gridCore = require("./ui.data_grid.core"),
    gridCoreUtils = require("../grid_core/ui.grid_core.utils"),
    commonUtils = require("../../core/utils/common"),
    equalByValue = commonUtils.equalByValue,
    messageLocalization = require("../../localization/message"),
    Button = require("../button"),
    pointerEvents = require("../../events/pointer"),
    ValidationEngine = require("../validation_engine"),
    Validator = require("../validator"),
    Tooltip = require("../tooltip"),
    Overlay = require("../overlay");

require("./ui.data_grid.editing");

var DATAGRID_INVALIDATE_CLASS = "dx-datagrid-invalid",
    DATAGRID_INVALID_MESSAGE_CLASS = "dx-invalid-message",
    DATAGRID_INVALID_MESSAGE_ALWAYS_CLASS = "dx-invalid-message-always",
    DATAGRID_REVERT_BUTTON_CLASS = "dx-revert-button",
    DATAGRID_REVERT_TOOLTIP_CLASS = "dx-datagrid-revert-tooltip",
    DATAGRID_CELL_HIGHLIGHT_OUTLINE = "dx-highlight-outline",

    DATAGRID_INSERT_INDEX = "__DX_INSERT_INDEX__",
    DATAGRID_EDIT_MODE_ROW = "row",
    DATAGRID_EDIT_MODE_FORM = "form",
    DATAGRID_EDIT_MODE_BATCH = "batch",
    DATAGRID_EDIT_MODE_CELL = "cell";

exports.ValidatingController = gridCore.Controller.inherit((function() {
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
                    errorText: null
                };

            that.executeAction("onRowValidating", parameters);

            editData.isValid = parameters.isValid;
            editData.errorText = parameters.errorText;

            return parameters;
        },

        validate: function(isFull) {
            var that = this,
                isValid = true,
                editingController = that._editingController;

            isFull = isFull || editingController.getEditMode() === DATAGRID_EDIT_MODE_ROW;

            if(that._isValidationInProgress) {
                return false;
            }

            that._isValidationInProgress = true;
            if(isFull) {
                $.each(editingController._editData, function(index, editData) {
                    var validationResult;

                    if(editData.type && editData.type !== "remove") {
                        validationResult = that.validateGroup(editData);
                        if(!validationResult.isValid) {
                            $.each(validationResult.brokenRules, function() {
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
            if(this._editingController.getEditMode() !== DATAGRID_EDIT_MODE_FORM) {
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

        removeValidators: function(editIndex) {
            var that = this,
                editingController = that._editingController;

            $.each(editingController._editData, function(index, editData) {
                var validateGroup = ValidationEngine.getGroupConfig(editData);

                if(!commonUtils.isDefined(editIndex) || editIndex === index) {
                    if(validateGroup) {
                        for(var i = 0; i < validateGroup.validators.length; i++) {
                            validateGroup.validators[i]._dispose();
                            i--;
                        }
                    }
                }
            });
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
                            if(!$focus.is(":focus")) $focus.focus().trigger(pointerEvents.down);
                        }
                        $container.toggleClass(DATAGRID_INVALIDATE_CLASS, !options.isValid);
                    }
                },
                getValue = function() {
                    var value = column.calculateCellValue(editData.data || {});
                    return value !== undefined ? value : parameters.value;
                };

            if(!column.validationRules || !commonUtils.isArray(column.validationRules) || commonUtils.isDefined(column.command)) return;

            editIndex = editingController.getIndexByKey(parameters.key, editingController._editData);

            if(editIndex < 0 && column.showEditorAlways) {
                editIndex = editingController._addEditData({ key: parameters.key });
            }

            if(editIndex >= 0) {
                editData = editingController._editData[editIndex];

                var useDefaultValidator = $container && $container.hasClass("dx-widget");
                var validator = new Validator($container || {}, {
                    name: column.caption,
                    validationRules: $.extend(true, [], column.validationRules),
                    validationGroup: editData,
                    adapter: useDefaultValidator ? null : {
                        getValue: getValue,
                        applyValidationResults: defaultValidationResult
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

gridCore.registerModule("validating", {
    defaultOptions: function() {
        return {
        /**
        * @name dxDataGridOptions_onRowValidating
        * @publicName onRowValidating
        * @type function(e)
        * @type_function_param1 e:object
        * @type_function_param1_field4 brokenRules:array
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
                 * @name dxDataGridOptions_editing_texts_validationCancelChanges
                 * @publicName validationCancelChanges
                 * @type string
                 * @default "Cancel changes"
                 */
                    validationCancelChanges: messageLocalization.format("dxDataGrid-validationCancelChanges")
                }
            }
        };
    },
    controllers: {
        validating: exports.ValidatingController
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

                    $.each(that._editData, function(_, editData) {
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

                            $.each(items, function(i, item) {
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

                            data[DATAGRID_INSERT_INDEX] = 1;

                            if(index >= 0) {
                                items.splice(index, 1);
                                rowIndex -= insertCount;
                            }

                            items.splice(rowIndex, 0, data);
                            insertCount++;
                        };

                    items = that.callBase(items, changeType);
                    itemsCount = items.length;

                    if(that.getEditMode() === DATAGRID_EDIT_MODE_BATCH && changeType !== "prepend" && changeType !== "append") {
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
                        isInserted = item.data[DATAGRID_INSERT_INDEX],
                        key = isInserted ? item.data.key : item.key,
                        editMode = that.getEditMode();

                    if(editMode === DATAGRID_EDIT_MODE_BATCH && isInserted && key) {
                        editIndex = gridCoreUtils.getIndexByKey(key, that._editData);

                        if(editIndex >= 0) {
                            editData = that._editData[editIndex];

                            if(editData.type !== "insert") {
                                item.data = $.extend(true, {}, editData.oldData, editData.data);
                                item.key = key;
                            }
                        }
                    }

                    that.callBase.apply(that, arguments);
                },

                _afterInsertRow: function(options) {
                    var validatingController = this.getController("validating"),
                        invisibleColumns = $.grep(this.getController("columns").getInvisibleColumns(), function(column) { return !column.isBand; });

                    if(this.getEditMode() !== DATAGRID_EDIT_MODE_FORM) {
                        $.each(invisibleColumns, function(_, column) {
                            validatingController.createValidator({
                                column: column,
                                key: options.key,
                                value: column.calculateCellValue(options.data)
                            });
                        });
                    }

                    this.callBase(options);
                },

                _beforeSaveEditData: function(editData, editIndex) {
                    var that = this,
                        isValid,
                        isFullValid,
                        result = that.callBase.apply(that, arguments),
                        validatingController = that.getController("validating");

                    if(editData) {
                        isValid = editData.type === "remove" || editData.isValid;

                        if(isValid) {
                            validatingController.removeValidators(editIndex);
                        }

                        result = result || !isValid;
                    } else {
                        isFullValid = validatingController.validate(true);
                        that._updateRowAndPageIndices();

                        if(that.getEditMode() === DATAGRID_EDIT_MODE_CELL) {
                            if(!isFullValid) {
                                that._focusEditingCell();
                                result = true;
                            }
                        } else if(that.getEditMode() === DATAGRID_EDIT_MODE_BATCH) {
                            if(!isFullValid) {
                                that._editRowIndex = -1;
                                that._editColumnIndex = -1;
                                that.getController("data").updateItems();
                                result = true;
                            }
                        } else if(that.getEditMode() === DATAGRID_EDIT_MODE_ROW) {
                            result = !isFullValid;
                        }
                    }
                    return result;
                },

                _beforeEditCell: function(rowIndex, columnIndex, item) {
                    var result = this.callBase(rowIndex, columnIndex, item),
                        $cell = this.component.getCellElement(rowIndex, columnIndex),
                        validator = $cell && $cell.data("dxValidator");

                    if(this.getEditMode(this) === DATAGRID_EDIT_MODE_CELL && (!validator || validator.validate().isValid)) {
                        return result;
                    }
                },

                _afterSaveEditData: function() {
                    var that = this;

                    $.each(that._editData, function(_, editData) {
                        that._showErrorRow(editData);
                    });
                },

                _beforeCancelEditData: function() {
                    var validatingController = this.getController("validating");

                    validatingController.removeValidators();

                    this.callBase();
                },

                _showErrorRow: function(editData) {
                    var errorHandling = this.getController("errorHandling"),
                        items = this.getController("data").items(),
                        rowIndex = this.getIndexByKey(editData.key, items);

                    if(!editData.isValid && editData.errorText && rowIndex >= 0) {
                        errorHandling && errorHandling.renderErrorRow(editData.errorText, rowIndex);
                    }
                },

                updateFieldValue: function() {
                    var that = this;

                    that.callBase.apply(that, arguments);

                    if(that.getEditMode() === DATAGRID_EDIT_MODE_ROW) {
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
                    var that = this;

                    if($targetElement && $targetElement.length) {
                        new Tooltip(
                        $("<div>")
                            .addClass(DATAGRID_REVERT_TOOLTIP_CLASS)
                            .appendTo($container),
                            {
                                animation: null,
                                visible: true,
                                target: $targetElement,
                                container: $container,
                                closeOnOutsideClick: false,
                                closeOnTargetScroll: false,
                                boundary: that._rowsView.element(),
                                contentTemplate: function() {
                                    return (new Button($("<div>")
                                        .addClass(DATAGRID_REVERT_BUTTON_CLASS), {
                                            icon: "revert",
                                            hint: that.option("editing.texts.validationCancelChanges"),
                                            onClick: function() {
                                                that._editingController.cancelEditData();
                                            }
                                        })).element();
                                },
                                position: {
                                    my: "left top",
                                    at: "right top",
                                    of: $targetElement,
                                    offset: "1 0",
                                    collision: "flip"
                                }
                            });
                    }
                },

                _showValidationMessage: function($cell, message, alignment) {
                    var that = this,
                        $highlightContainer = $cell.find("." + DATAGRID_CELL_HIGHLIGHT_OUTLINE),
                        isOverlayVisible = $cell.find(".dx-dropdowneditor-overlay:visible").length,
                        myPosition = isOverlayVisible ? "top right" : "top " + alignment,
                        atPosition = isOverlayVisible ? "top left" : "bottom " + alignment;

                    new Overlay($("<div/>")
                        .addClass(DATAGRID_INVALID_MESSAGE_CLASS)
                        .addClass(DATAGRID_INVALID_MESSAGE_ALWAYS_CLASS)
                        .text(message)
                        .appendTo($cell),
                        {
                            target: $highlightContainer.length ? $highlightContainer : $cell,
                            container: $cell,
                            shading: false,
                            width: 'auto',
                            height: 'auto',
                            visible: true,
                            animation: false,
                            closeOnOutsideClick: false,
                            closeOnTargetScroll: false,
                            position: {
                                collision: "flip",
                                boundary: that._rowsView.element(),
                                boundaryOffset: "0 0",
                                my: myPosition,
                                at: atPosition
                            },
                            onPositioned: function() {
                                that._rowsView.element() && that._rowsView.updateFreeSpaceRowHeight();
                            }
                        });
                },

                _getTooltipsSelector: function() {
                    return ".dx-editor-cell .dx-tooltip, .dx-editor-cell .dx-invalid-message";
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
                        validator = $focus && ($focus.data("dxValidator") || $element.find(".dx-validator").eq(0).data("dxValidator")),
                        rowOptions = $focus && $focus.closest(".dx-row").data("options"),
                        editData = rowOptions ? that.getController("editing").getEditDataByKey(rowOptions.key) : null,
                        validationResult,
                        $tooltips = $focus && $focus.closest(".dx-datagrid-rowsview").find(that._getTooltipsSelector()),
                        $cell = $focus && $focus.is("td") ? $focus : null,
                        column = $cell && that.getController("columns").getVisibleColumns()[$cell.index()];

                    if(!arguments.length) return that.callBase();

                    $tooltips && $tooltips.remove();

                    if(validator) {
                        that.getController("validating").setValidator(validator);

                        if(validator.option("adapter").getValue() !== undefined) {
                            validationResult = validator.validate();

                            if(!validationResult.isValid) {
                                hideBorder = true;

                                if($cell && column) {
                                    that._showValidationMessage($focus, validationResult.brokenRule.message, column.alignment);
                                }
                            }
                        }
                    }

                    if((validationResult && !validationResult.isValid) || (editData && editData.type === "update")) {
                        if(that._editingController.getEditMode() === DATAGRID_EDIT_MODE_CELL) {
                            that._showRevertButton($focus, $cell ? $focus.find("." + DATAGRID_CELL_HIGHLIGHT_OUTLINE).first() : $focus);
                        }
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
                        $rowElements = that._getRowElements(),
                        $freeSpaceRowElements = that._getFreeSpaceRowElements($table),
                        $freeSpaceRowElement = $freeSpaceRowElements.first(),
                        $tooltipContent = that.element().find(".dx-invalid-message .dx-overlay-content");

                    that.callBase($table);


                    if($tooltipContent.length && $freeSpaceRowElement && $rowElements.length === 1 && (!$freeSpaceRowElement.is(":visible") || $tooltipContent.outerHeight() > $freeSpaceRowElement.outerHeight())) {
                        $freeSpaceRowElements.show();
                        $freeSpaceRowElements.height($tooltipContent.outerHeight());
                    }
                },
                _formItemPrepared: function(cellOptions, $container) {
                    this.callBase.apply(this, arguments);
                    this.getController("validating").createValidator(cellOptions, $container.children(".dx-widget"));
                },
                _cellPrepared: function($cell, parameters) {
                    this.getController("validating").createValidator(parameters, $cell);

                    this.callBase.apply(this, arguments);
                }
            }
        }
    }
});
