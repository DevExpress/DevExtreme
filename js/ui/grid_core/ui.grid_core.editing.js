var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    window = require("../../core/utils/window").getWindow(),
    eventsEngine = require("../../events/core/events_engine"),
    Guid = require("../../core/guid"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    modules = require("./ui.grid_core.modules"),
    clickEvent = require("../../events/click"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    getIndexByKey = gridCoreUtils.getIndexByKey,
    eventUtils = require("../../events/utils"),
    addNamespace = eventUtils.addNamespace,
    dialog = require("../dialog"),
    messageLocalization = require("../../localization/message"),
    Button = require("../button"),
    Popup = require("../popup"),
    errors = require("../widget/ui.errors"),
    devices = require("../../core/devices"),
    Form = require("../form"),
    holdEvent = require("../../events/hold"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    commonUtils = require("../../core/utils/common"),
    Scrollable = require("../scroll_view/ui.scrollable");

var EDIT_FORM_CLASS = "edit-form",
    EDIT_FORM_ITEM_CLASS = "edit-form-item",
    FOCUS_OVERLAY_CLASS = "focus-overlay",
    READONLY_CLASS = "readonly",
    EDIT_POPUP_CLASS = "edit-popup",
    FORM_BUTTONS_CONTAINER_CLASS = "form-buttons-container",
    ADD_ROW_BUTTON_CLASS = "addrow-button",
    LINK_CLASS = "dx-link",
    EDITOR_CELL_CLASS = "dx-editor-cell",
    ROW_SELECTED = "dx-selection",
    EDIT_ROW = "dx-edit-row",
    EDIT_BUTTON_CLASS = "dx-edit-button",
    COMMAND_EDIT_CLASS = "dx-command-edit",
    COMMAND_EDIT_WITH_ICONS_CLASS = COMMAND_EDIT_CLASS + "-with-icons",
    SCROLLABLE_CONTAINER_CLASS = "dx-scrollable-container",

    BUTTON_CLASS = "dx-button",

    INSERT_INDEX = "__DX_INSERT_INDEX__",
    ROW_CLASS = "dx-row",
    ROW_REMOVED = "dx-row-removed",
    ROW_INSERTED = "dx-row-inserted",
    ROW_MODIFIED = "dx-row-modified",
    CELL_MODIFIED = "dx-cell-modified",
    CELL_HIGHLIGHT_OUTLINE = "dx-highlight-outline",
    EDITING_NAMESPACE = "dxDataGridEditing",
    DATA_ROW_CLASS = "dx-data-row",

    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",

    EDITORS_INPUT_SELECTOR = "input:not([type='hidden'])",
    FOCUSABLE_ELEMENT_SELECTOR = "[tabindex], " + EDITORS_INPUT_SELECTOR,

    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_ROW = "row",
    EDIT_MODE_CELL = "cell",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_POPUP = "popup",

    DATA_EDIT_DATA_INSERT_TYPE = "insert",
    DATA_EDIT_DATA_UPDATE_TYPE = "update",
    DATA_EDIT_DATA_REMOVE_TYPE = "remove",

    POINTER_EVENTS_NONE_CLASS = "dx-pointer-events-none",
    POINTER_EVENTS_TARGET_CLASS = "dx-pointer-events-target",

    EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP],
    ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP],
    CELL_BASED_MODES = [EDIT_MODE_BATCH, EDIT_MODE_CELL],
    FORM_BASED_MODES = [EDIT_MODE_FORM, EDIT_MODE_POPUP],
    MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];

var EDIT_LINK_CLASS = {
        saveEditData: "dx-link-save",
        cancelEditData: "dx-link-cancel",
        editRow: "dx-link-edit",
        undeleteRow: "dx-link-undelete",
        deleteRow: "dx-link-delete",
        addRowByRowIndex: "dx-link-add"
    },
    EDIT_ICON_CLASS = {
        saveEditData: "dx-icon-save",
        cancelEditData: "dx-icon-revert",
        editRow: "dx-icon-edit",
        undeleteRow: "dx-icon-revert",
        deleteRow: "dx-icon-trash",
        addRowByRowIndex: "dx-icon-add"
    };

var getEditMode = function(that) {
    var editMode = that.option("editing.mode");

    if(EDIT_MODES.indexOf(editMode) !== -1) {
        return editMode;
    }
    return EDIT_MODE_ROW;
};

var isRowEditMode = function(that) {
    var editMode = getEditMode(that);
    return ROW_BASED_MODES.indexOf(editMode) !== -1;
};

var EditingController = modules.ViewController.inherit((function() {
    var getDefaultEditorTemplate = function(that) {
        return function(container, options) {
            var $editor = $("<div>").appendTo(container);

            that.getController("editorFactory").createEditor($editor, extend({}, options.column, {
                value: options.value,
                setValue: options.setValue,
                row: options.row,
                parentType: "dataRow",
                width: null,
                readOnly: !options.setValue,
                isOnForm: options.isOnForm,
                id: options.id
            }));
        };
    };

    var editCellTemplate = (container, options) => {
        var editingTexts,
            editingOptions,
            $container = $(container),
            editingController = options.component.getController("editing"),
            isRowMode = isRowEditMode(editingController);

        if(options.rowType === "data") {
            $container.css("textAlign", "center");
            options.rtlEnabled = editingController.option("rtlEnabled");

            editingOptions = editingController.option("editing") || {};
            editingTexts = editingOptions.texts || {};

            if(options.row && options.row.rowIndex === editingController._getVisibleEditRowIndex() && isRowMode) {
                editingController._createLink($container, editingTexts.saveRowChanges, "saveEditData", options, editingOptions.useIcons);
                editingController._createLink($container, editingTexts.cancelRowChanges, "cancelEditData", options, editingOptions.useIcons);
            } else {
                editingController._createEditingLinks($container, options, editingOptions, isRowMode);
            }
        } else {
            gridCoreUtils.setEmptyText($container);
        }
    };

    return {
        init: function() {
            var that = this;

            that._editRowIndex = -1;
            that._editData = [];
            that._editColumnIndex = -1;
            that._columnsController = that.getController("columns");
            that._dataController = that.getController("data");
            that._rowsView = that.getView("rowsView");
            that._editForm = null;

            if(!that._dataChangedHandler) {
                that._dataChangedHandler = that._handleDataChanged.bind(that);
                that._dataController.changed.add(that._dataChangedHandler);
            }

            if(!that._saveEditorHandler) {
                that.createAction("onInitNewRow", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowInserting", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowInserted", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onEditingStart", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowUpdating", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowUpdated", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowRemoving", { excludeValidators: ["disabled", "readOnly"] });
                that.createAction("onRowRemoved", { excludeValidators: ["disabled", "readOnly"] });

                that._saveEditorHandler = that.createAction(function(e) {
                    var event = e.event,
                        isEditorPopup,
                        isDomElement,
                        isFocusOverlay,
                        isAddRowButton,
                        isCellEditMode,
                        $target;

                    if(!isRowEditMode(that) && !that._editCellInProgress) {
                        $target = $(event.target);
                        isEditorPopup = $target.closest(".dx-dropdowneditor-overlay").length;
                        isDomElement = $target.closest(window.document).length;
                        isAddRowButton = $target.closest("." + that.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)).length;
                        isFocusOverlay = $target.hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                        isCellEditMode = getEditMode(that) === EDIT_MODE_CELL;

                        if(!isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && that.isEditing()) && isDomElement) {
                            that._closeEditItem.bind(that)($target);
                        }
                    }
                });

                eventsEngine.on(domAdapter.getDocument(), clickEvent.name, that._saveEditorHandler);
            }
            that._updateEditColumn();
            that._updateEditButtons();
        },

        _closeEditItem: function($targetElement) {
            var isDataRow = $targetElement.closest("." + DATA_ROW_CLASS).length,
                $targetCell = $targetElement.closest("." + ROW_CLASS + "> td"),
                columnIndex = $targetCell[0] && $targetCell[0].cellIndex,
                rowIndex = this.getView("rowsView").getRowIndex($targetCell.parent()),
                visibleColumns = this._columnsController.getVisibleColumns(),
                // TODO jsdmitry: Move this code to _rowClick method of rowsView
                allowEditing = visibleColumns[columnIndex] && visibleColumns[columnIndex].allowEditing;

            if(this.isEditing() && (!isDataRow || (isDataRow && !allowEditing && !this.isEditCell(rowIndex, columnIndex)))) {
                this.closeEditCell();
            }
        },

        _handleDataChanged: function(args) {
            var that = this,
                editForm = that._editForm;

            if(that.option("scrolling.mode") === "standard") {
                that.resetRowAndPageIndices();
            }
            if(args.changeType === "prepend") {
                each(that._editData, function(_, editData) {
                    editData.rowIndex += args.items.length;

                    if(editData.type === DATA_EDIT_DATA_INSERT_TYPE) {
                        editData.key.rowIndex += args.items.length;
                        editData.key.dataRowIndex += args.items.filter(function(item) {
                            return item.rowType === "data";
                        }).length;
                    }
                });
            }

            if(args.changeType === "refresh" && getEditMode(that) === EDIT_MODE_POPUP && editForm && editForm.option("visible")) {
                editForm.repaint();
            }
        },

        correctEditRowIndexAfterExpand: function(key) {
            if(this._editRowIndex > this._dataController.getRowIndexByKey(key)) {
                this._editRowIndex++;
            }
        },

        isRowEditMode: function() {
            return isRowEditMode(this);
        },

        isFormEditMode: function() {
            var editMode = getEditMode(this);
            return FORM_BASED_MODES.indexOf(editMode) !== -1;
        },

        getEditMode: function() {
            return getEditMode(this);
        },

        getFirstEditableColumnIndex: function() {
            var columnsController = this.getController("columns"),
                firstFormItem = this._firstFormItem,
                columnIndex;

            if(getEditMode(this) === EDIT_MODE_FORM && firstFormItem) {
                var $editFormElements = this._rowsView.getCellElements(this._editRowIndex);
                columnIndex = this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
            } else {
                var visibleColumns = columnsController.getVisibleColumns();
                each(visibleColumns, function(index, column) {
                    if(column.allowEditing) {
                        columnIndex = index;
                        return false;
                    }
                });
            }

            return columnIndex;
        },

        getFirstEditableCellInRow: function(rowIndex) {
            return this.getView("rowsView")._getCellElement(rowIndex ? rowIndex : 0, this.getFirstEditableColumnIndex());
        },

        getFocusedCellInRow: function(rowIndex) {
            return this.getFirstEditableCellInRow(rowIndex);
        },

        getIndexByKey: function(key, items) {
            return getIndexByKey(key, items);
        },

        hasChanges: function(rowIndex) {
            var that = this,
                result = false;

            for(var i = 0; i < that._editData.length; i++) {
                if(that._editData[i].type && (!typeUtils.isDefined(rowIndex) || that._dataController.getRowIndexByKey(that._editData[i].key) === rowIndex)) {
                    result = true;
                    break;
                }
            }

            return result;
        },

        dispose: function() {
            this.callBase();
            clearTimeout(this._inputFocusTimeoutID);
            eventsEngine.off(domAdapter.getDocument(), clickEvent.name, this._saveEditorHandler);
        },

        optionChanged: function(args) {
            if(args.name === "editing") {
                if(this._editPopup && this._editPopup.option("visible") && args.fullName.indexOf("editing.form") === 0) {
                    var rowIndex = this._getVisibleEditRowIndex();
                    if(rowIndex >= 0) {
                        this._showEditPopup(rowIndex);
                    }
                } else {
                    this.init();
                }
                args.handled = true;
            } else {
                this.callBase(args);
            }
        },

        publicMethods: function() {
            return ["insertRow", "addRow", "removeRow", "deleteRow", "undeleteRow", "editRow", "editCell", "closeEditCell", "saveEditData", "cancelEditData", "hasEditData"];
        },

        refresh: function() {
            if(getEditMode(this) === EDIT_MODE_CELL) return;

            if(getEditMode(this) !== EDIT_MODE_BATCH) {
                this.init();
            } else {
                this._editRowIndex = -1;
                this._editColumnIndex = -1;
            }
        },

        isEditing: function() {
            return this._editRowIndex > -1;
        },

        isEditRow: function(rowIndex) {
            var editMode = getEditMode(this);
            return this._getVisibleEditRowIndex() === rowIndex && ROW_BASED_MODES.indexOf(editMode) !== -1;
        },

        getEditRowKey: function() {
            var items = this._dataController.items(),
                item = items[this._getVisibleEditRowIndex()];

            return item && item.key;
        },

        getEditRowIndex: function() {
            return this._getVisibleEditRowIndex();
        },

        getEditFormRowIndex: function() {
            var editMode = getEditMode(this);

            return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP ? this._getVisibleEditRowIndex() : -1;
        },

        isEditCell: function(rowIndex, columnIndex) {
            return this._getVisibleEditRowIndex() === rowIndex && this._editColumnIndex === columnIndex;
        },

        getPopupContent: function() {
            var editMode = getEditMode(this),
                popupVisible = this._editPopup && this._editPopup.option("visible");

            if(editMode === EDIT_MODE_POPUP && popupVisible) {
                return this._$popupContent;
            }
        },

        getEditForm: function() {
            return this._editForm;
        },

        _needInsertItem: function(editData, changeType) {
            var that = this,
                dataSource = that._dataController.dataSource(),
                scrollingMode = that.option("scrolling.mode"),
                pageIndex = dataSource.pageIndex(),
                beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : pageIndex,
                endPageIndex = dataSource.endPageIndex ? dataSource.endPageIndex() : pageIndex;

            if(scrollingMode !== "standard") {
                switch(changeType) {
                    case "append":
                        return editData.key.pageIndex === endPageIndex;
                    case "prepend":
                        return editData.key.pageIndex === beginPageIndex;
                    case "refresh":
                        editData.key.rowIndex = 0;
                        editData.key.dataRowIndex = 0;
                        editData.key.pageIndex = 0;
                        break;
                    default:
                        return editData.key.pageIndex >= beginPageIndex && editData.key.pageIndex <= endPageIndex;
                }
            }

            return editData.key.pageIndex === pageIndex;
        },

        _generateNewItem: function(key) {
            var item = {
                key: key
            };

            if(key && key[INSERT_INDEX]) {
                item[INSERT_INDEX] = key[INSERT_INDEX];
            }

            return item;
        },

        processItems: function(items, changeType) {
            var that = this,
                i,
                key,
                item,
                editData = that._editData;

            that.update(changeType);
            for(i = 0; i < editData.length; i++) {
                key = editData[i].key;
                item = that._generateNewItem(key);

                if(editData[i].type === DATA_EDIT_DATA_INSERT_TYPE && that._needInsertItem(editData[i], changeType, items, item)) {
                    items.splice(key.dataRowIndex, 0, item);
                }
            }

            return items;
        },

        processDataItem: function(item, options, generateDataValues) {
            var that = this,
                data,
                editMode,
                editData,
                editIndex,
                columns = options.visibleColumns,
                key = item.data[INSERT_INDEX] ? item.data.key : item.key;

            editIndex = getIndexByKey(key, that._editData);

            if(editIndex >= 0) {
                editMode = getEditMode(that);
                editData = that._editData[editIndex];
                data = editData.data;

                item.isEditing = false;

                switch(editData.type) {
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        if(editMode === EDIT_MODE_POPUP) {
                            item.visible = false;
                        }
                        item.inserted = true;
                        item.key = key;
                        item.data = data;
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        item.modified = true;
                        item.oldData = item.data;
                        item.data = gridCoreUtils.createObjectWithChanges(item.data, data);
                        item.modifiedValues = generateDataValues(data, columns);
                        break;
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        if(editMode === EDIT_MODE_BATCH) {
                            item.data = gridCoreUtils.createObjectWithChanges(item.data, data);
                        }
                        item.removed = true;
                        break;
                }
            }
        },

        /**
         * @name dxDataGridMethods.insertRow
         * @publicName insertRow()
         * @deprecated dxDataGridMethods.addRow
         */
        insertRow: function() {
            errors.log("W0002", "dxDataGrid", "insertRow", "15.2", "Use the 'addRow' method instead");
            return this.addRow();
        },

        _initNewRow: function(options, insertKey) {
            this.executeAction("onInitNewRow", options);

            var rows = this._dataController.items(),
                row = rows[insertKey.rowIndex];

            if(row && (!row.isEditing && row.rowType === "detail" || row.rowType === "detailAdaptive")) {
                insertKey.rowIndex++;
            }

            insertKey.dataRowIndex = rows.filter(function(row, index) {
                return index < insertKey.rowIndex && (row.rowType === "data" || row.rowType === "group");
            }).length;
        },

        _getInsertIndex: function() {
            var maxInsertIndex = 0;
            this._editData.forEach(function(editItem) {
                if(editItem.type === DATA_EDIT_DATA_INSERT_TYPE && editItem.key[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = editItem.key[INSERT_INDEX];
                }
            });
            return maxInsertIndex + 1;
        },

        /**
         * @name dxDataGridMethods.addRow
         * @publicName addRow()
         */
        /**
         * @name dxTreeListMethods.addRow
         * @publicName addRow()
         */
        /**
         * @name dxTreeListMethods.addRow
         * @publicName addRow(parentId)
         * @param1 parentId:any
         */
        addRow: function(parentKey) {
            var that = this,
                dataController = that._dataController,
                store = dataController.store(),
                key = store && store.key(),
                rowsView = that.getView("rowsView"),
                param = { data: {} },
                parentRowIndex = dataController.getRowIndexByKey(parentKey),
                insertKey = {
                    pageIndex: dataController.pageIndex(),
                    rowIndex: (parentRowIndex >= 0 ? parentRowIndex + 1 : (rowsView ? rowsView.getTopVisibleItemIndex() : 0)),
                    parentKey: parentKey
                },
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                editMode = getEditMode(that),
                $firstCell;

            if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData();
            }

            that.refresh();

            var insertIndex = that._getInsertIndex();

            if(editMode !== EDIT_MODE_BATCH && insertIndex > 1) {
                return;
            }

            if(!key) {
                param.data.__KEY__ = String(new Guid());
            }

            that._initNewRow(param, insertKey);

            editMode = getEditMode(that);
            if(editMode !== EDIT_MODE_BATCH) {
                that._editRowIndex = insertKey.rowIndex + that._dataController.getRowIndexOffset();
            }

            insertKey[INSERT_INDEX] = insertIndex;

            that._addEditData({ key: insertKey, data: param.data, type: DATA_EDIT_DATA_INSERT_TYPE });

            dataController.updateItems({
                changeType: "update",
                rowIndices: [oldEditRowIndex, insertKey.rowIndex]
            });

            if(editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(insertKey.rowIndex);
            } else {
                $firstCell = that.getFirstEditableCellInRow(insertKey.rowIndex);
                that._editCellInProgress = true;
                that._delayedInputFocus($firstCell, function() {
                    that._editCellInProgress = false;
                    var $cell = that.getFirstEditableCellInRow(insertKey.rowIndex);
                    $cell && eventsEngine.trigger($cell, clickEvent.name);
                });
            }

            that._afterInsertRow({ key: insertKey, data: param.data });
        },

        _isEditingStart: function(options) {
            this.executeAction("onEditingStart", options);

            return options.cancel;
        },

        _beforeEditCell: function(rowIndex, columnIndex, item) {
            var that = this;

            if(getEditMode(that) === EDIT_MODE_CELL && !item.inserted && that.hasChanges()) {
                var d = new Deferred();
                that.saveEditData().always(function() {
                    d.resolve(that.hasChanges());
                });
                return d;
            }
        },

        _beforeUpdateItems: function() { },

        _getVisibleEditRowIndex: function() {
            return this._editRowIndex >= 0 ? this._editRowIndex - this._dataController.getRowIndexOffset() : -1;
        },

        /**
         * @name GridBaseMethods.editRow
         * @publicName editRow(rowIndex)
         * @param1 rowIndex:number
         */
        editRow: function(rowIndex) {
            var that = this,
                dataController = that._dataController,
                items = dataController.items(),
                item = items[rowIndex],
                params = { data: item && item.data, cancel: false },
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                $editingCell;

            if(!item) {
                return;
            }

            if(rowIndex === oldEditRowIndex) {
                return true;
            }

            if(!item.inserted) {
                params.key = item.key;
            }

            if(that._isEditingStart(params)) {
                return;
            }

            that.init();
            that._pageIndex = dataController.pageIndex();
            that._editRowIndex = (items[0].inserted ? rowIndex - 1 : rowIndex) + that._dataController.getRowIndexOffset();
            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });

            var rowIndices = [oldEditRowIndex, rowIndex],
                editMode = getEditMode(that);

            that._beforeUpdateItems(rowIndices, rowIndex, oldEditRowIndex);

            if(editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(rowIndex);
            } else {
                dataController.updateItems({
                    changeType: "update",
                    rowIndices: rowIndices
                });
            }

            if(MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
                $editingCell = that.getFocusedCellInRow(that._getVisibleEditRowIndex());

                that._delayedInputFocus($editingCell, function() {
                    $editingCell && that.component.focus($editingCell);
                });
            }
        },

        _showEditPopup: function(rowIndex) {
            var that = this,
                isMobileDevice = devices.current().deviceType !== "desktop",
                popupOptions = extend(
                    {
                        showTitle: false,
                        fullScreen: isMobileDevice,
                        toolbarItems: [
                            { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: that._getSaveButtonConfig() },
                            { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: that._getCancelButtonConfig() }
                        ],
                        contentTemplate: that._getPopupEditFormTemplate(rowIndex)
                    },
                    that.option("editing.popup")
                );

            if(!that._editPopup) {
                var $popupContainer = $("<div>")
                    .appendTo(that.component.$element())
                    .addClass(that.addWidgetPrefix(EDIT_POPUP_CLASS));

                that._editPopup = that._createComponent($popupContainer, Popup, {});
                that._editPopup.on("hiding", that._getEditPopupHiddenHandler());
                that._editPopup.on("shown", function(e) {
                    eventsEngine.trigger(e.component.$content().find(FOCUSABLE_ELEMENT_SELECTOR).not("." + SCROLLABLE_CONTAINER_CLASS).first(), "focus");
                });
            }

            that._editPopup.option(popupOptions);
            that._editPopup.show();
        },

        _getEditPopupHiddenHandler: function() {
            var that = this;

            return function(e) {
                if(that.isEditing()) {
                    that.cancelEditData();
                }
            };
        },

        _getPopupEditFormTemplate: function(rowIndex) {
            var that = this,
                row = that.component.getVisibleRows()[rowIndex],
                templateOptions = {
                    row: row,
                    rowType: row.rowType,
                    key: row.key
                };

            return function(container) {
                var formTemplate = that.getEditFormTemplate(),
                    scrollable = that._createComponent($("<div>").appendTo(container), Scrollable);

                that._$popupContent = scrollable.$content();

                formTemplate(that._$popupContent, templateOptions, true);
            };
        },

        _getSaveButtonConfig: function() {
            return {
                text: this.option("editing.texts.saveRowChanges"),
                onClick: this.saveEditData.bind(this)
            };
        },

        _getCancelButtonConfig: function() {
            return {
                text: this.option("editing.texts.cancelRowChanges"),
                onClick: this.cancelEditData.bind(this)
            };
        },

        _removeEditDataItem: function(index) {
            this._editData.splice(index, 1);
        },

        /**
         * @name GridBaseMethods.editCell
         * @publicName editCell(rowIndex, visibleColumnIndex)
         * @param1 rowIndex:number
         * @param2 visibleColumnIndex:number
         */
        /**
         * @name GridBaseMethods.editCell
         * @publicName editCell(rowIndex, dataField)
         * @param1 rowIndex:number
         * @param2 dataField:string
         */
        editCell: function(rowIndex, columnIndex) {
            var that = this,
                columnsController = that._columnsController,
                dataController = that._dataController,
                items = dataController.items(),
                item = items[rowIndex],
                params = {
                    data: item && item.data,
                    cancel: false
                },
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                visibleColumns = columnsController.getVisibleColumns(),
                oldColumn = visibleColumns[that._editColumnIndex];

            if(typeUtils.isString(columnIndex)) {
                columnIndex = columnsController.columnOption(columnIndex, "index");
                columnIndex = columnsController.getVisibleIndex(columnIndex);
            }

            var column = params.column = visibleColumns[columnIndex];

            if(column && item && (item.rowType === "data" || item.rowType === "detailAdaptive") && !item.removed && !isRowEditMode(that)) {
                if(that.isEditCell(rowIndex, columnIndex)) {
                    return true;
                }

                var editRowIndex = rowIndex + dataController.getRowIndexOffset();

                return when(that._beforeEditCell(rowIndex, columnIndex, item)).done(function(cancel) {
                    if(cancel) {
                        return;
                    }

                    if(that._prepareEditCell(params, item, columnIndex, editRowIndex)) {
                        commonUtils.deferRender(function() {
                            that._repaintEditCell(column, oldColumn, oldEditRowIndex);
                        });
                    }

                });
            }
            return false;
        },

        _prepareEditCell: function(params, item, editColumnIndex, editRowIndex) {
            var that = this;

            if(!item.inserted) {
                params.key = item.key;
            }

            if(that._isEditingStart(params)) {
                return false;
            }

            that._editRowIndex = editRowIndex;
            that._editColumnIndex = editColumnIndex;
            that._pageIndex = that._dataController.pageIndex();

            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });

            return true;
        },

        _repaintEditCell: function(column, oldColumn, oldEditRowIndex) {
            var that = this,
                rowsView = that._rowsView;

            if(!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
                that._editCellInProgress = true;

                // T316439
                that.getController("editorFactory").loseFocus();

                that._dataController.updateItems({
                    changeType: "update",
                    rowIndices: [oldEditRowIndex, that._getVisibleEditRowIndex()]
                });
            }

            // TODO no focus border when call editCell via API
            var $cell = rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex); // T319885
            if($cell && !$cell.find(":focus").length) {
                that._focusEditingCell(function() {
                    that._editCellInProgress = false;
                }, $cell, true);
            } else {
                that._editCellInProgress = false;
            }
        },

        _delayedInputFocus: function($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
            var that = this;

            function inputFocus() {
                if(beforeFocusCallback) {
                    beforeFocusCallback();
                }

                $cell && eventsEngine.trigger($cell.find(FOCUSABLE_ELEMENT_SELECTOR).first(), "focus");
                that._beforeFocusCallback = null;
            }

            if(devices.real().ios || devices.real().android) {
                inputFocus();
            } else {
                if(that._beforeFocusCallback) that._beforeFocusCallback();

                clearTimeout(that._inputFocusTimeoutID);

                if(callBeforeFocusCallbackAlways) {
                    that._beforeFocusCallback = beforeFocusCallback;
                }

                that._inputFocusTimeoutID = setTimeout(inputFocus);
            }
        },

        _focusEditingCell: function(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
            var that = this,
                rowsView = that.getView("rowsView");

            $editCell = $editCell || rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex);
            that._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
        },


        /**
         * @name dxDataGridMethods.removeRow
         * @publicName removeRow(rowIndex)
         * @param1 rowIndex:number
         * @deprecated GridBaseMethods.deleteRow
         */
        removeRow: function(rowIndex) {
            errors.log("W0002", "dxDataGrid", "removeRow", "15.2", "Use the 'deleteRow' method instead");
            return this.deleteRow(rowIndex);
        },

        /**
         * @name GridBaseMethods.deleteRow
         * @publicName deleteRow(rowIndex)
         * @param1 rowIndex:number
         */
        deleteRow: function(rowIndex) {
            var that = this,
                editingOptions = that.option("editing"),
                editingTexts = editingOptions && editingOptions.texts,
                confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle,
                isBatchMode = editingOptions && editingOptions.mode === EDIT_MODE_BATCH,
                confirmDeleteMessage = editingTexts && editingTexts.confirmDeleteMessage,
                dataController = that._dataController,
                removeByKey,
                showDialogTitle,
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                item = dataController.items()[rowIndex],
                key = item && item.key;

            if(item) {
                removeByKey = function(key) {
                    that.refresh();

                    var editIndex = getIndexByKey(key, that._editData);

                    if(editIndex >= 0) {
                        if(that._editData[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
                            that._removeEditDataItem(editIndex);
                        } else {
                            that._editData[editIndex].type = DATA_EDIT_DATA_REMOVE_TYPE;
                        }
                    } else {
                        that._addEditData({ key: key, oldData: item.data, type: DATA_EDIT_DATA_REMOVE_TYPE });
                    }

                    if(isBatchMode) {
                        dataController.updateItems({
                            changeType: "update",
                            rowIndices: [oldEditRowIndex, rowIndex]
                        });
                    } else {
                        that.saveEditData();
                    }
                };

                if(isBatchMode || !confirmDeleteMessage) {
                    removeByKey(key);
                } else {
                    showDialogTitle = typeUtils.isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
                    dialog.confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(function(confirmResult) {
                        if(confirmResult) {
                            removeByKey(key);
                        }
                    });
                }
            }
        },
        /**
         * @name GridBaseMethods.undeleteRow
         * @publicName undeleteRow(rowIndex)
         * @param1 rowIndex:number
         */
        undeleteRow: function(rowIndex) {
            var that = this,
                dataController = that._dataController,
                item = dataController.items()[rowIndex],
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                key = item && item.key;

            if(item) {
                var editIndex = getIndexByKey(key, that._editData),
                    editData;

                if(editIndex >= 0) {
                    editData = that._editData[editIndex];

                    if(typeUtils.isEmptyObject(editData.data)) {
                        that._removeEditDataItem(editIndex);
                    } else {
                        editData.type = DATA_EDIT_DATA_UPDATE_TYPE;
                    }
                    dataController.updateItems({
                        changeType: "update",
                        rowIndices: [oldEditRowIndex, rowIndex]
                    });
                }
            }
        },
        _saveEditDataCore: function(deferreds, results) {
            var that = this,
                store = that._dataController.store(),
                isDataSaved = true;

            function executeEditingAction(actionName, params, func) {
                var deferred = new Deferred();

                that.executeAction(actionName, params);

                function createFailureHandler(deferred) {
                    return function(arg) {
                        var error = arg instanceof Error ? arg : new Error(arg && String(arg) || "Unknown error");
                        deferred.reject(error);
                    };
                }

                when(deferredUtils.fromPromise(params.cancel)).done(function(cancel) {
                    if(cancel) {
                        setTimeout(function() {
                            deferred.resolve("cancel");
                        });
                    } else {
                        func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
                    }
                }).fail(createFailureHandler(deferred));

                return deferred;
            }

            each(that._editData, function(index, editData) {
                var data = editData.data,
                    oldData = editData.oldData,
                    type = editData.type,
                    deferred,
                    doneDeferred,
                    params;

                if(that._beforeSaveEditData(editData, index)) {
                    return;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        params = { data: oldData, key: editData.key, cancel: false };
                        deferred = executeEditingAction("onRowRemoving", params, function() {
                            return store.remove(editData.key);
                        });
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        params = { data: data, cancel: false };
                        deferred = executeEditingAction("onRowInserting", params, function() {
                            return store.insert(params.data).done(function(data, key) {
                                editData.key = key;
                            });
                        });
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        params = { newData: data, oldData: oldData, key: editData.key, cancel: false };
                        deferred = executeEditingAction("onRowUpdating", params, function() {
                            return store.update(editData.key, params.newData);
                        });
                        break;
                }

                if(deferred) {
                    doneDeferred = new Deferred();
                    deferred
                        .always(function(data) {
                            isDataSaved = data !== "cancel";
                            results.push({ key: editData.key, result: data });
                        })
                        .always(doneDeferred.resolve);

                    deferreds.push(doneDeferred.promise());
                }
            });

            return isDataSaved;
        },
        _processSaveEditDataResult: function(results) {
            var that = this,
                dataController = that._dataController,
                i,
                arg,
                cancel,
                editData,
                editIndex,
                isError,
                $popupContent,
                hasSavedData = false,
                editMode = getEditMode(that);

            for(i = 0; i < results.length; i++) {
                arg = results[i].result;
                cancel = arg === "cancel";
                editIndex = getIndexByKey(results[i].key, that._editData);
                editData = that._editData[editIndex];
                isError = arg && arg instanceof Error;

                if(isError) {
                    if(editData) {
                        editData.error = arg;
                    }
                    $popupContent = that.getPopupContent();
                    dataController.dataErrorOccurred.fire(arg, $popupContent);
                    if(editMode !== EDIT_MODE_BATCH) {
                        break;
                    }
                } else if(!cancel || !editData || editMode !== EDIT_MODE_BATCH && editData.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                    if(editIndex >= 0) {
                        that._removeEditDataItem(editIndex);
                    }
                    hasSavedData = !cancel;
                }
            }
            return hasSavedData;
        },
        _fireSaveEditDataEvents: function(editData) {
            var that = this;

            each(editData, function(_, itemData) {
                var data = itemData.data,
                    key = itemData.key,
                    type = itemData.type,
                    params = { key: key, data: data };

                if(itemData.error) {
                    params.error = itemData.error;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        that.executeAction("onRowRemoved", extend({}, params, { data: itemData.oldData }));
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        that.executeAction("onRowInserted", params);
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        that.executeAction("onRowUpdated", params);
                        break;
                }
            });
        },
        /**
         * @name GridBaseMethods.saveEditData
         * @publicName saveEditData()
         * @return Promise<void>
         */
        saveEditData: function() {
            var that = this,
                editData,
                results = [],
                deferreds = [],
                dataController = that._dataController,
                dataSource = dataController.dataSource(),
                editMode = getEditMode(that),
                result = new Deferred();

            var resetEditIndices = function(that) {
                if(editMode !== EDIT_MODE_CELL) {
                    that._editColumnIndex = -1;
                    that._editRowIndex = -1;
                }
            };

            if(that._beforeSaveEditData() || that._saving) {
                that._afterSaveEditData();
                return result.resolve().promise();
            }

            editData = that._editData.slice(0);

            if(!that._saveEditDataCore(deferreds, results) && editMode === EDIT_MODE_CELL) {
                that._focusEditingCell();
            }

            if(deferreds.length) {
                that._saving = true;

                dataSource && dataSource.beginLoading();

                when.apply($, deferreds).done(function() {
                    if(that._processSaveEditDataResult(results)) {
                        resetEditIndices(that);

                        if(editMode === EDIT_MODE_POPUP && that._editPopup) {
                            that._editPopup.hide();
                        }

                        dataSource && dataSource.endLoading();

                        when(dataController.refresh()).always(function() {
                            that._fireSaveEditDataEvents(editData);
                            that._afterSaveEditData();
                            result.resolve();
                        });
                    } else {
                        dataSource && dataSource.endLoading();
                        result.resolve();
                    }
                }).fail(function() {
                    dataSource && dataSource.endLoading();
                    result.resolve();
                });

                return result.always(function() {
                    that._focusEditingCell();
                    that._saving = false;
                }).promise();
            }

            if(isRowEditMode(that)) {
                if(!that.hasChanges()) {
                    that.cancelEditData();
                }
            } else if(CELL_BASED_MODES.indexOf(editMode) !== -1) {
                resetEditIndices(that);
                dataController.updateItems();
            } else {
                that._focusEditingCell();
            }

            that._afterSaveEditData();
            return result.resolve().promise();
        },

        isSaving: function() {
            return this._saving;
        },

        _updateEditColumn: function() {
            var that = this,
                useIcons = that.option("editing.useIcons"),
                isEditColumnVisible = that._isEditColumnVisible(),
                cssClass = COMMAND_EDIT_CLASS + (useIcons ? " " + COMMAND_EDIT_WITH_ICONS_CLASS : "");

            that._columnsController.addCommandColumn({
                command: "edit",
                visible: isEditColumnVisible,
                cssClass: cssClass,
                width: "auto",
                cellTemplate: editCellTemplate
            });

            that._columnsController.columnOption("command:edit", {
                visible: isEditColumnVisible,
                cssClass: cssClass
            });
        },

        _isEditColumnVisible: function() {
            var that = this,
                editingOptions = that.option("editing");

            if(editingOptions) {
                var editMode = getEditMode(that),
                    isVisibleWithCurrentEditMode = false;

                switch(editMode) {
                    case EDIT_MODE_ROW:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
                        break;
                    case EDIT_MODE_FORM:
                    case EDIT_MODE_POPUP:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating;
                        break;
                }

                return editingOptions.allowDeleting || isVisibleWithCurrentEditMode;
            }
        },

        _updateEditButtons: function() {
            var that = this,
                headerPanel = that.getView("headerPanel"),
                hasChanges = that.hasChanges();

            if(headerPanel) {
                headerPanel.setToolbarItemDisabled("saveButton", !hasChanges);
                headerPanel.setToolbarItemDisabled("revertButton", !hasChanges);
            }
        },

        _applyModified: function($element) {
            $element && $element.addClass(CELL_MODIFIED);
        },

        _beforeCloseEditCellInBatchMode: function() { },

        /**
         * @name GridBaseMethods.cancelEditData
         * @publicName cancelEditData()
         */
        cancelEditData: function() {
            var that = this,
                editMode = getEditMode(that),
                rowIndex = this._getVisibleEditRowIndex(),
                dataController = that._dataController;

            that._beforeCancelEditData();

            that.init();

            if(ROW_BASED_MODES.indexOf(editMode) !== -1 && rowIndex >= 0) {
                dataController.updateItems({
                    changeType: "update",
                    rowIndices: [rowIndex, rowIndex + 1]
                });
            } else {
                dataController.updateItems();
            }

            if(editMode === EDIT_MODE_POPUP) {
                that._hideEditPopup();
            }
        },

        _hideEditPopup: function() {
            this._editPopup && this._editPopup.option("visible", false);
        },

        /**
         * @name GridBaseMethods.hasEditData
         * @publicName hasEditData()
         * @return boolean
         */
        hasEditData: function() {
            return this.hasChanges();
        },
        /**
         * @name GridBaseMethods.closeEditCell
         * @publicName closeEditCell()
         */
        closeEditCell: function() {
            var that = this,
                editMode = getEditMode(that),
                oldEditRowIndex = that._getVisibleEditRowIndex(),
                dataController = that._dataController;

            if(!isRowEditMode(that)) {
                setTimeout(function() {
                    if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                        that.saveEditData().done(function() {
                            if(!that.hasChanges()) {
                                that.closeEditCell();
                            }
                        });
                    } else if(oldEditRowIndex >= 0) {
                        var rowIndices = [oldEditRowIndex];

                        that._editRowIndex = -1;
                        that._editColumnIndex = -1;

                        that._beforeCloseEditCellInBatchMode(rowIndices);
                        dataController.updateItems({
                            changeType: "update",
                            rowIndices: rowIndices
                        });
                    }
                });
            }
        },

        update: function(changeType) {
            var that = this,
                dataController = that._dataController;

            if(dataController && that._pageIndex !== dataController.pageIndex()) {
                if(changeType === "refresh") {
                    that.refresh();
                }
                that._pageIndex = dataController.pageIndex();
            }
            that._updateEditButtons();
        },

        _getRowIndicesForCascadeUpdating: function(row, skipCurrentRow) {
            return skipCurrentRow ? [] : [row.rowIndex];
        },

        updateFieldValue: function(options, value, text, forceUpdateRow) {
            var that = this,
                newData = {},
                oldData = options.data,
                rowKey = options.key,
                $cellElement = $(options.cellElement),
                editMode = getEditMode(that),
                params,
                columns;

            if(rowKey === undefined) {
                that._dataController.dataErrorOccurred.fire(errors.Error("E1043"));
            }

            if(options.column.setCellValue) {
                if(rowKey !== undefined) {
                    if(editMode === EDIT_MODE_BATCH) {
                        that._applyModified($cellElement, options);
                    }
                    options.value = value;
                    options.column.setCellValue(newData, value, extend(true, {}, oldData), text);
                    if(text && options.column.displayValueMap) {
                        options.column.displayValueMap[value] = text;
                    }
                }
                params = {
                    data: newData,
                    key: rowKey,
                    oldData: oldData,
                    type: DATA_EDIT_DATA_UPDATE_TYPE
                };

                that._addEditData(params, options.row);
                that._updateEditButtons();

                if(options.column.showEditorAlways && !forceUpdateRow) {
                    if(editMode === EDIT_MODE_CELL && options.row && !options.row.inserted) {
                        return that.saveEditData();
                    } else if(editMode === EDIT_MODE_BATCH) {
                        columns = that._columnsController.getVisibleColumns();
                        forceUpdateRow = columns.some((column) => column.calculateCellValue !== column.defaultCalculateCellValue);
                    }
                }

                if(options.row && (forceUpdateRow || options.column.setCellValue !== options.column.defaultSetCellValue)) {
                    that._updateEditRow(options.row, forceUpdateRow);
                }
            }
        },
        _updateEditRowCore: function(row, skipCurrentRow) {
            var that = this,
                editForm = that._editForm,
                editMode = getEditMode(that);

            if(editMode === EDIT_MODE_POPUP) {
                editForm && editForm.repaint();
            } else {
                that._dataController.updateItems({
                    changeType: "update",
                    rowIndices: that._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
                });
            }
        },

        _updateEditRow: function(row, forceUpdateRow) {
            var that = this;

            if(forceUpdateRow || !isRowEditMode(that)) {
                that._updateEditRowCore(row, !forceUpdateRow);
                if(!forceUpdateRow) {
                    that._focusEditingCell();
                }
            } else {
                setTimeout(function() {
                    var $focusedElement = $(domAdapter.getActiveElement()),
                        columnIndex = that._rowsView.getCellIndex($focusedElement, row.rowIndex),
                        focusedElement = $focusedElement.get(0),
                        selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

                    that._updateEditRowCore(row);

                    if(columnIndex >= 0) {
                        var $focusedItem = that._rowsView._getCellElement(row.rowIndex, columnIndex);
                        that._delayedInputFocus($focusedItem, function() {
                            setTimeout(function() {
                                focusedElement = domAdapter.getActiveElement();
                                if(selectionRange.selectionStart >= 0) {
                                    gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
                                }
                            });
                        });
                    }
                });
            }
        },

        _addEditData: function(options, row) {
            var that = this,
                editDataIndex = getIndexByKey(options.key, that._editData);

            if(editDataIndex < 0) {
                editDataIndex = that._editData.length;
                that._editData.push(options);
            }
            if(that._editData[editDataIndex]) {
                if(options.data) {
                    that._editData[editDataIndex].data = gridCoreUtils.createObjectWithChanges(that._editData[editDataIndex].data, options.data);
                }
                if(!that._editData[editDataIndex].type && options.type) {
                    that._editData[editDataIndex].type = options.type;
                }
                if(row) {
                    row.oldData = that._editData[editDataIndex].oldData;
                    row.data = gridCoreUtils.createObjectWithChanges(row.data, options.data);
                }
            }

            return editDataIndex;
        },

        _getFormEditItemTemplate: function(cellOptions, column) {
            return column.editCellTemplate || getDefaultEditorTemplate(this);
        },

        renderFormEditTemplate: function(detailCellOptions, item, form, container, isReadOnly) {
            var that = this,
                $container = $(container),
                column = item.column,
                rowData = detailCellOptions.row && detailCellOptions.row.data,
                cellOptions = extend({}, detailCellOptions, {
                    data: rowData,
                    cellElement: null,
                    isOnForm: true,
                    item: item,
                    value: column.calculateCellValue(rowData),
                    column: extend({}, column, { editorOptions: item.editorOptions }),
                    id: form.getItemID(item.name || item.dataField),
                    columnIndex: column.index,
                    setValue: !isReadOnly && column.allowEditing && function(value) {
                        that.updateFieldValue(cellOptions, value);
                    }
                }),
                template = that._getFormEditItemTemplate.bind(that)(cellOptions, column);

            if(that._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest(window.document).length)) {
                that._rowsView._updateCell($container, cellOptions);
            }
        },

        getFormEditorTemplate: function(cellOptions, item) {
            var that = this;
            return function(options, $container) {
                that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container);
            };
        },

        getEditFormTemplate: function() {
            var that = this;

            return function($container, detailOptions, renderFormOnly) {
                var editFormOptions = that.option("editing.form"),
                    items = that.option("editing.form.items"),
                    userCustomizeItem = that.option("editing.form.customizeItem"),
                    editData = that._editData[getIndexByKey(detailOptions.key, that._editData)],
                    editFormItemClass = that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);

                if(!items) {
                    var columns = that.getController("columns").getColumns();
                    items = [];
                    each(columns, function(_, column) {
                        if(!column.isBand) {
                            items.push({
                                column: column,
                                name: column.name,
                                dataField: column.dataField
                            });
                        }
                    });
                }

                that._firstFormItem = undefined;

                that._editForm = that._createComponent($("<div>").appendTo($container), Form, extend({}, editFormOptions, {
                    items: items,
                    formID: "dx-" + new Guid(),
                    validationGroup: editData,
                    customizeItem: function(item) {
                        var column;
                        if(item.column || item.dataField || item.name) {
                            column = item.column || that._columnsController.columnOption(item.name ? "name:" + item.name : "dataField:" + item.dataField);
                        }
                        if(column) {
                            item.label = item.label || {};
                            item.label.text = item.label.text || column.caption;
                            item.template = item.template || that.getFormEditorTemplate(detailOptions, item);
                            item.column = column;
                            if(column.formItem) {
                                extend(item, column.formItem);
                            }
                            if(item.isRequired === undefined && column.validationRules) {
                                item.isRequired = column.validationRules.some(function(rule) { return rule.type === "required"; });
                                item.validationRules = [];
                            }

                            var itemVisible = typeUtils.isDefined(item.visible) ? item.visible : true;
                            if(!that._firstFormItem && itemVisible) {
                                that._firstFormItem = item;
                            }
                        }
                        userCustomizeItem && userCustomizeItem.call(this, item);
                        item.cssClass = typeUtils.isString(item.cssClass) ? item.cssClass + " " + editFormItemClass : editFormItemClass;
                    }
                }));

                if(!renderFormOnly) {
                    var $buttonsContainer = $("<div>").addClass(that.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
                    that._createComponent($("<div>").appendTo($buttonsContainer), Button, that._getSaveButtonConfig());
                    that._createComponent($("<div>").appendTo($buttonsContainer), Button, that._getCancelButtonConfig());
                }

                that._editForm.on("contentReady", function() {
                    that._editPopup && that._editPopup.repaint();
                });
            };
        },

        getColumnTemplate: function(options) {
            var that = this,
                column = options.column,
                rowIndex = options.row && options.row.rowIndex,
                template,
                allowUpdating,
                isRowMode = isRowEditMode(that),
                isRowEditing = that.isEditRow(rowIndex),
                isCellEditing = that.isEditCell(rowIndex, options.columnIndex),
                editingStartOptions;

            if((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) &&
                (options.rowType === "data" || options.rowType === "detailAdaptive") && !column.command) {
                allowUpdating = that.option("editing.allowUpdating");
                if(((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowMode && isRowEditing || !isRowMode)) {
                    if(column.showEditorAlways && !isRowMode) {
                        editingStartOptions = {
                            cancel: false,
                            key: options.row.inserted ? undefined : options.row.key,
                            data: options.row.data,
                            column: column
                        };
                        that._isEditingStart(editingStartOptions);
                    }
                    if(!editingStartOptions || !editingStartOptions.cancel) {
                        options.setValue = function(value, text) {
                            that.updateFieldValue(options, value, text);
                        };
                    }
                }
                template = column.editCellTemplate || getDefaultEditorTemplate(that);
            } else if(column.command === "detail" && options.rowType === "detail" && isRowEditing) {
                template = that.getEditFormTemplate(options);
            }

            return template;
        },

        _createLink: function(container, text, methodName, options, useIcon) {
            var that = this,
                $link = $("<a>")
                    .attr("href", "#")
                    .addClass(LINK_CLASS)
                    .addClass(EDIT_LINK_CLASS[methodName]);

            if(useIcon) {
                $link
                    .addClass(EDIT_ICON_CLASS[methodName])
                    .attr("title", text);
            } else {
                $link.text(text);
            }

            eventsEngine.on($link, addNamespace(clickEvent.name, EDITING_NAMESPACE), that.createAction(function(params) {
                var e = params.event;

                e.stopPropagation();
                e.preventDefault();
                setTimeout(function() {
                    options.row && that[methodName](options.row.rowIndex);
                });
            }));

            options.rtlEnabled ? container.prepend($link, "&nbsp;") : container.append($link, "&nbsp;");
        },

        _createEditingLinks: function(container, options, editingOptions, isRowMode) {
            var editingTexts = editingOptions.texts || {};

            if(editingOptions.allowUpdating && isRowMode) {
                this._createLink(container, editingTexts.editRow, "editRow", options, editingOptions.useIcons);
            }
            if(editingOptions.allowDeleting) {
                if(options.row.removed) {
                    this._createLink(container, editingTexts.undeleteRow, "undeleteRow", options, editingOptions.useIcons);
                } else {
                    this._createLink(container, editingTexts.deleteRow, "deleteRow", options, editingOptions.useIcons);
                }
            }
        },

        prepareEditButtons: function(headerPanel) {
            var that = this,
                editingOptions = that.option("editing") || {},
                editingTexts = that.option("editing.texts") || {},
                titleButtonTextByClassNames = {
                    "revert": editingTexts.cancelAllChanges,
                    "save": editingTexts.saveAllChanges,
                    "addRow": editingTexts.addRow
                },
                classNameButtonByNames = {
                    "revert": "cancel",
                    "save": "save",
                    "addRow": "addrow"
                },
                buttonItems = [];

            var prepareButtonItem = function(name, methodName, sortIndex) {
                var className = classNameButtonByNames[name],
                    onInitialized = function(e) {
                        $(e.element).addClass(headerPanel._getToolbarButtonClass(EDIT_BUTTON_CLASS + " " + that.addWidgetPrefix(className) + "-button"));
                    },
                    hintText = titleButtonTextByClassNames[name],
                    isButtonDisabled = (className === "save" || className === "cancel") && !that.hasChanges();

                return {
                    widget: "dxButton",
                    options: {
                        onInitialized: onInitialized,
                        icon: "edit-button-" + className,
                        disabled: isButtonDisabled,
                        onClick: function() {
                            setTimeout(function() {
                                that[methodName]();
                            });
                        },
                        text: hintText,
                        hint: hintText
                    },
                    showText: "inMenu",
                    name: name + "Button",
                    location: "after",
                    locateInMenu: "auto",
                    sortIndex: sortIndex
                };
            };

            if(editingOptions.allowAdding) {
                buttonItems.push(prepareButtonItem("addRow", "addRow", 20));
            }

            if((editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting) && getEditMode(that) === EDIT_MODE_BATCH) {
                buttonItems.push(prepareButtonItem("save", "saveEditData", 21));
                buttonItems.push(prepareButtonItem("revert", "cancelEditData", 22));
            }

            return buttonItems;
        },

        showHighlighting: function($cell) {
            var $highlight = $cell.find("." + CELL_HIGHLIGHT_OUTLINE);

            if($cell.get(0).tagName === "TD" && !$highlight.length) {
                $cell.wrapInner($("<div>").addClass(CELL_HIGHLIGHT_OUTLINE + " " + POINTER_EVENTS_TARGET_CLASS));
            }
        },

        resetRowAndPageIndices: function(alwaysRest) {
            var that = this;

            each(that._editData, function(_, editData) {
                if(editData.pageIndex !== that._pageIndex || alwaysRest) {
                    delete editData.pageIndex;
                    delete editData.rowIndex;
                }
            });
        },

        _afterInsertRow: function() { },

        _beforeSaveEditData: function(editData) {
            if(editData && !typeUtils.isDefined(editData.key) && typeUtils.isDefined(editData.type)) {
                return true;
            }
        },

        _afterSaveEditData: function() { },

        _beforeCancelEditData: function() { }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.onInitNewRow
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowInserting
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowInserted
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onEditingStart
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean
             * @type_function_param1_field7 column:object
             * @extends Action
             * @action
             */

            /**
             * @name dxTreeListOptions.onEditingStart
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean
             * @type_function_param1_field7 column:object
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowUpdating
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 oldData:object
             * @type_function_param1_field5 newData:object
             * @type_function_param1_field6 key:any
             * @type_function_param1_field7 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowUpdated
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowRemoving
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowRemoved
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.editing
             * @type object
             */
            /**
             * @name dxTreeListOptions.editing
             * @type object
             */
            /**
             * @name GridBaseOptions.editing
             * @type object
             */
            editing: {
                /**
                 * @name GridBaseOptions.editing.mode
                 * @type Enums.GridEditMode
                 * @default "row"
                 */
                mode: "row", // "batch"
                /**
                 * @name GridBaseOptions.editing.allowAdding
                 * @type boolean
                 * @default false
                 */
                allowAdding: false,
                /**
                 * @name GridBaseOptions.editing.allowUpdating
                 * @type boolean
                 * @default false
                 */
                allowUpdating: false,
                /**
                 * @name GridBaseOptions.editing.allowDeleting
                 * @type boolean
                 * @default false
                 */
                allowDeleting: false,
                /**
                 * @name GridBaseOptions.editing.useIcons
                 * @type boolean
                 * @default false
                 */
                useIcons: false,
                /**
                 * @name dxDataGridOptions.editing.texts
                 * @type object
                 */
                /**
                 * @name GridBaseOptions.editing.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name GridBaseOptions.editing.texts.editRow
                     * @type string
                     * @default "Edit"
                     */
                    editRow: messageLocalization.format("dxDataGrid-editingEditRow"),
                    /**
                     * @name GridBaseOptions.editing.texts.saveAllChanges
                     * @type string
                     * @default "Save changes"
                     */
                    saveAllChanges: messageLocalization.format("dxDataGrid-editingSaveAllChanges"),
                    /**
                     * @name GridBaseOptions.editing.texts.saveRowChanges
                     * @type string
                     * @default "Save"
                     */
                    saveRowChanges: messageLocalization.format("dxDataGrid-editingSaveRowChanges"),
                    /**
                     * @name GridBaseOptions.editing.texts.cancelAllChanges
                     * @type string
                     * @default "Discard changes"
                     */
                    cancelAllChanges: messageLocalization.format("dxDataGrid-editingCancelAllChanges"),
                    /**
                     * @name GridBaseOptions.editing.texts.cancelRowChanges
                     * @type string
                     * @default "Cancel"
                     */
                    cancelRowChanges: messageLocalization.format("dxDataGrid-editingCancelRowChanges"),
                    /**
                     * @name GridBaseOptions.editing.texts.addRow
                     * @type string
                     * @default "Add a row"
                     */
                    addRow: messageLocalization.format("dxDataGrid-editingAddRow"),
                    /**
                     * @name GridBaseOptions.editing.texts.deleteRow
                     * @type string
                     * @default "Delete"
                     */
                    deleteRow: messageLocalization.format("dxDataGrid-editingDeleteRow"),
                    /**
                     * @name GridBaseOptions.editing.texts.undeleteRow
                     * @type string
                     * @default "Undelete"
                     */
                    undeleteRow: messageLocalization.format("dxDataGrid-editingUndeleteRow"),
                    /**
                     * @name GridBaseOptions.editing.texts.confirmDeleteMessage
                     * @type string
                     * @default "Are you sure you want to delete this record?"
                     */
                    confirmDeleteMessage: messageLocalization.format("dxDataGrid-editingConfirmDeleteMessage"),
                    /**
                     * @name GridBaseOptions.editing.texts.confirmDeleteTitle
                     * @type string
                     * @default ""
                     */
                    confirmDeleteTitle: ""
                },
                /**
                 * @name GridBaseOptions.editing.form
                 * @type dxFormOptions
                 */
                form: {
                    colCount: 2
                },

                /**
                 * @name GridBaseOptions.editing.popup
                 * @type dxPopupOptions
                 */
                popup: {}
            }
        };
    },
    controllers: {
        editing: EditingController
    },
    extenders: {
        controllers: {
            data: {
                init: function() {
                    this._editingController = this.getController("editing");
                    this.callBase();
                },
                reload: function(full) {
                    var d,
                        editingController = this.getController("editing");

                    this._editingController.refresh();
                    d = this.callBase(full);

                    return d && d.done(function() {
                        editingController.resetRowAndPageIndices(true);
                    });
                },
                repaintRows: function() {
                    if(this.getController("editing").isSaving()) return;
                    return this.callBase.apply(this, arguments);
                },
                _updateItemsCore: function(change) {
                    this.callBase(change);

                    var editingController = this._editingController,
                        editRowIndex = editingController.getEditRowIndex(),
                        editItem = this.items()[editRowIndex];

                    if(editItem) {
                        editItem.isEditing = true;
                        if(editingController.getEditMode() === EDIT_MODE_FORM) {
                            editItem.rowType = "detail";
                        }
                    }
                },
                _processItems: function(items, changeType) {
                    items = this._editingController.processItems(items, changeType);
                    return this.callBase(items, changeType);
                },
                _processDataItem: function(dataItem, options) {
                    this._editingController.processDataItem(dataItem, options, this.generateDataValues);
                    return this.callBase(dataItem, options);
                },
                _processItem: function(item, options) {
                    item = this.callBase(item, options);

                    if(item.inserted) {
                        options.dataIndex--;
                        delete item.dataIndex;
                    }

                    return item;
                }
            }
        },
        views: {
            rowsView: {
                init: function() {
                    this.callBase();
                    this._editingController = this.getController("editing");
                },
                getCellElements: function(rowIndex) {
                    var $cellElements = this.callBase(rowIndex),
                        editingController = this._editingController,
                        editForm = editingController.getEditForm(),
                        editFormRowIndex = editingController.getEditFormRowIndex();

                    if(editFormRowIndex === rowIndex && $cellElements && editForm) {
                        return editForm.$element().find("." + this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS) + ", ." + BUTTON_CLASS);
                    }

                    return $cellElements;
                },
                getCellIndex: function($cell, rowIndex) {
                    if(!$cell.is("td") && rowIndex >= 0) {
                        var $cellElements = this.getCellElements(rowIndex),
                            cellIndex = -1;

                        each($cellElements, function(index, cellElement) {
                            if($(cellElement).find($cell).length) {
                                cellIndex = index;
                                return false;
                            }
                        });

                        return cellIndex;
                    }

                    return this.callBase.apply(this, arguments);
                },
                _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {
                    var editFormRowIndex = this._editingController.getEditFormRowIndex(),
                        column;

                    if(editFormRowIndex === rowIndex && typeUtils.isString(columnIdentifier)) {
                        column = this._columnsController.columnOption(columnIdentifier);
                        return this._getEditFormEditorVisibleIndex($cells, column);
                    }

                    return this.callBase.apply(this, arguments);
                },

                _getEditFormEditorVisibleIndex: function($cells, column) {
                    var item,
                        visibleIndex = -1;

                    each($cells, function(index, cellElement) {
                        item = $(cellElement).find(".dx-field-item-content").data("dx-form-item");
                        if(item && item.column && column && item.column.index === column.index) {
                            visibleIndex = index;
                            return false;
                        }
                    });
                    return visibleIndex;
                },

                publicMethods: function() {
                    return this.callBase().concat(["cellValue"]);
                },
                _getCellTemplate: function(options) {
                    var that = this,
                        template = that._editingController.getColumnTemplate(options);

                    return template || that.callBase(options);
                },
                _isNativeClick: function() {
                    return (devices.real().ios || devices.real().android) && this.option("editing.allowUpdating");
                },
                _createTable: function() {
                    var that = this,
                        $table = that.callBase.apply(that, arguments);

                    if(!isRowEditMode(that) && that.option("editing.allowUpdating")) {

                        eventsEngine.on($table, addNamespace(holdEvent.name, "dxDataGridRowsView"), "td:not(." + EDITOR_CELL_CLASS + ")", that.createAction(function() {
                            var editingController = that._editingController;

                            if(editingController.isEditing()) {
                                editingController.closeEditCell();
                            }
                        }));
                    }

                    return $table;
                },
                _createRow: function(row) {
                    var $row = this.callBase(row),
                        editingController,
                        isEditRow,
                        isRowRemoved,
                        isRowInserted,
                        isRowModified;

                    if(row) {
                        editingController = this._editingController;
                        isEditRow = editingController.isEditRow(row.rowIndex);
                        isRowRemoved = !!row.removed;
                        isRowInserted = !!row.inserted;
                        isRowModified = !!row.modified;

                        if(getEditMode(this) === EDIT_MODE_BATCH) {
                            isRowRemoved && $row.addClass(ROW_REMOVED);
                        } else {
                            isEditRow && $row.addClass(EDIT_ROW);
                        }

                        isRowInserted && $row.addClass(ROW_INSERTED);
                        isRowModified && $row.addClass(ROW_MODIFIED);

                        if(isEditRow || isRowInserted || isRowRemoved) {
                            $row.removeClass(ROW_SELECTED);
                        }

                        if(isEditRow && row.rowType === "detail") {
                            $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
                        }
                    }
                    return $row;
                },
                _getColumnIndexByElement: function($element) {
                    var $tableElement = $element.closest("table"),
                        $tableElements = this.getTableElements();

                    while($tableElement.length && !$tableElements.filter($tableElement).length) {
                        $element = $tableElement.closest("td");
                        $tableElement = $element.closest("table");
                    }

                    return this._getColumnIndexByElementCore($element);
                },
                _getColumnIndexByElementCore: function($element) {
                    var $targetElement = $element.closest("." + ROW_CLASS + "> td:not(.dx-master-detail-cell)");

                    return this.getCellIndex($targetElement);
                },
                _rowClick: function(e) {
                    var that = this,
                        editingController = that._editingController,
                        $targetElement = $(e.event.target),
                        columnIndex = that._getColumnIndexByElement($targetElement),
                        row = that._dataController.items()[e.rowIndex],
                        allowUpdating = that.option("editing.allowUpdating") || row && row.inserted,
                        column = that._columnsController.getVisibleColumns()[columnIndex],
                        allowEditing = column && (column.allowEditing || editingController.isEditCell(e.rowIndex, columnIndex));

                    if($targetElement.closest("." + ROW_CLASS + "> td").hasClass(POINTER_EVENTS_NONE_CLASS)) return;

                    if(!(allowUpdating && allowEditing && editingController.editCell(e.rowIndex, columnIndex)) && !editingController.isEditRow(e.rowIndex)) {
                        that.callBase(e);
                    }
                },
                _cellPrepared: function($cell, parameters) {
                    var columnIndex = parameters.columnIndex,
                        editingController = this._editingController,
                        isCommandCell = !!parameters.column.command,
                        isEditableCell = parameters.setValue,
                        isEditing = parameters.isEditing || editingController.isEditRow(parameters.rowIndex) && parameters.column.allowEditing;

                    if(parameters.rowType === "data" && !parameters.column.command && (isEditing || parameters.column.showEditorAlways)) {
                        var alignment = parameters.column.alignment;

                        $cell
                            .addClass(EDITOR_CELL_CLASS)
                            .toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell)
                            .toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);

                        if(alignment) {
                            $cell.find(EDITORS_INPUT_SELECTOR).first().css("textAlign", alignment);
                        }
                    }

                    var modifiedValues = parameters.row && (parameters.row.inserted ? parameters.row.values : parameters.row.modifiedValues);

                    if(modifiedValues && modifiedValues[columnIndex] !== undefined && parameters.column && !isCommandCell && parameters.column.setCellValue) {
                        editingController.showHighlighting($cell);
                        $cell.addClass(CELL_MODIFIED);
                    } else if(isEditableCell) {
                        editingController.showHighlighting($cell, true);
                    }

                    this.callBase.apply(this, arguments);
                },
                _formItemPrepared: function() { },
                _isFormItem: function(parameters) {
                    var isDetailRow = parameters.rowType === "detail" || parameters.rowType === "detailAdaptive",
                        isPopupEditing = parameters.rowType === "data" && getEditMode(this) === "popup";
                    return (isDetailRow || isPopupEditing) && parameters.item;
                },
                _updateCell: function($cell, parameters) {
                    if(this._isFormItem(parameters)) {
                        this._formItemPrepared(parameters, $cell);
                    } else {
                        this.callBase($cell, parameters);
                    }
                },
                _update: function(change) {
                    this.callBase(change);
                    if(change.changeType === "updateSelection") {
                        this.getTableElements().children("tbody").children("." + EDIT_ROW).removeClass(ROW_SELECTED);
                    }
                },
                _getCellOptions: function(options) {
                    var cellOptions = this.callBase(options);

                    cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);

                    return cellOptions;
                },
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, visibleColumnIndex)
                 * @param1 rowIndex:number
                 * @param2 visibleColumnIndex:number
                 * @return any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, dataField)
                 * @param1 rowIndex:number
                 * @param2 dataField:string
                 * @return any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, visibleColumnIndex, value)
                 * @param1 rowIndex:number
                 * @param2 visibleColumnIndex:number
                 * @param3 value:any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, dataField, value)
                 * @param1 rowIndex:number
                 * @param2 dataField:string
                 * @param3 value:any
                 */
                cellValue: function(rowIndex, columnIdentifier, value, text) {
                    var cellOptions = this.getCellOptions(rowIndex, columnIdentifier);

                    if(cellOptions) {
                        if(value === undefined) {
                            return cellOptions.value;
                        } else {
                            this._editingController.updateFieldValue(cellOptions, value, text, true);
                        }
                    }
                }
            },

            headerPanel: {
                _getToolbarItems: function() {
                    var items = this.callBase(),
                        editButtonItems = this.getController("editing").prepareEditButtons(this);

                    return editButtonItems.concat(items);
                },

                optionChanged: function(args) {
                    switch(args.name) {
                        case "editing":
                            this._invalidate();
                            this.callBase(args);
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                isVisible: function() {
                    var that = this,
                        editingOptions = that.getController("editing").option("editing");

                    return that.callBase() || (editingOptions && (editingOptions.allowAdding || ((editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === EDIT_MODE_BATCH)));

                }
            }
        }
    }
};
