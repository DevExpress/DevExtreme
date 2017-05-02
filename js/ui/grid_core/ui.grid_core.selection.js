"use strict";

var $ = require("../../core/renderer"),
    gridCore = require("../data_grid/ui.data_grid.core"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    support = require("../../core/utils/support"),
    clickEvent = require("../../events/click"),
    messageLocalization = require("../../localization/message"),
    eventUtils = require("../../events/utils"),
    holdEvent = require("../../events/hold"),
    Selection = require("../selection/selection");

var EDITOR_CELL_CLASS = "dx-editor-cell",
    ROW_CLASS = "dx-row",
    ROW_SELECTION_CLASS = "dx-selection",
    SELECT_CHECKBOX_CLASS = "dx-select-checkbox",
    CHECKBOXES_HIDDEN_CLASS = "dx-select-checkboxes-hidden",
    COMMAND_SELECT_CLASS = "dx-command-select",
    SELECTION_DISABLED_CLASS = "dx-selection-disabled",
    DATA_ROW_CLASS = "dx-data-row";

var SHOW_CHECKBOXES_MODE = "selection.showCheckBoxesMode",
    SELECTION_MODE = "selection.mode";

var processLongTap = function(that, jQueryEvent) {
    var selectionController = that.getController("selection"),
        rowsView = that.getView("rowsView"),
        $row = $(jQueryEvent.target).closest("." + DATA_ROW_CLASS),
        rowIndex = rowsView.getRowIndex($row);

    if(rowIndex < 0) return;

    if((that.option(SHOW_CHECKBOXES_MODE) === "onLongTap")) {
        if(selectionController.isSelectionWithCheckboxes()) {
            selectionController.stopSelectionWithCheckboxes();
        } else {
            selectionController.startSelectionWithCheckboxes();
        }
    } else {
        if(that.option(SHOW_CHECKBOXES_MODE) === "onClick") {
            selectionController.startSelectionWithCheckboxes();
        }
        if(that.option(SHOW_CHECKBOXES_MODE) !== "always") {
            selectionController.changeItemSelection(rowIndex, { control: true });
        }
    }
};

exports.SelectionController = gridCore.Controller.inherit((function() {
    var isSeveralRowsSelected = function(that, selectionFilter) {
        var keyIndex = 0,
            store = that.getController("data").store(),
            key = store && store.key(),
            isComplexKey = Array.isArray(key);

        if(!selectionFilter.length) {
            return false;
        }

        if(isComplexKey && Array.isArray(selectionFilter[0]) && selectionFilter[1] === "and") {
            for(var i = 0; i < selectionFilter.length; i++) {
                if(Array.isArray(selectionFilter[i])) {
                    if(selectionFilter[i][0] !== key[keyIndex] || selectionFilter[i][1] !== "=") {
                        return true;
                    }
                    keyIndex++;
                }
            }
            return false;
        }

        return key !== selectionFilter[0];
    };

    return {
        init: function() {
            var that = this,
                dataController = that.getController("data"),
                selectionOptions = that.option("selection") || {};

            that._selectionMode = that.option(SELECTION_MODE);

            that._isSelectionWithCheckboxes = false;

            that._selection = that._createSelection({
                selectedKeys: that.option("selectedRowKeys"),
                mode: that._selectionMode,
                deferred: selectionOptions.deferred,
                maxFilterLengthInRequest: selectionOptions.maxFilterLengthInRequest,
                selectionFilter: that.option("selectionFilter"),
                key: function() {
                    var store = dataController.store();
                    return store && store.key();
                },
                keyOf: function(item) {
                    var store = dataController.store();
                    return store && store.keyOf(item);
                },
                dataFields: function() {
                    return dataController.dataSource() && dataController.dataSource().select();
                },
                load: function(options) {
                    return dataController.dataSource() && dataController.dataSource().load(options) || $.Deferred().resolve([]);
                },
                plainItems: function() {
                    return dataController.items();
                },
                isItemSelected: function(item) {
                    return item.selected;
                },
                isSelectableItem: function(item) {
                    return item && item.rowType === "data" && !item.inserted;
                },
                getItemData: function(item) {
                    return item && (item.oldData || item.data || item);
                },
                filter: function() {
                    return dataController.getCombinedFilter();
                },
                totalCount: function() {
                    return dataController.totalCount();
                },
                onSelectionChanged: that._updateSelectedItems.bind(this)
            });

            that._updateSelectColumn();
            that.createAction("onSelectionChanged", { excludeValidators: ["disabled", "readOnly"] });
        },

        _updateSelectColumn: function() {
            var columnsController = this.getController("columns"),
                isSelectColumnVisible = this.isSelectColumnVisible();

            columnsController.addCommandColumn({
                command: "select",
                visible: isSelectColumnVisible,
                visibleIndex: -1,
                dataType: "boolean",
                alignment: "center",
                cssClass: COMMAND_SELECT_CLASS,
                width: "auto"
            });

            columnsController.columnOption("command:select", "visible", isSelectColumnVisible);
        },

        _createSelection: function(options) {
            return new Selection(options);
        },

        _fireSelectionChanged: function() {
            var argument = this.option("selection.deferred") ?
                { selectionFilter: this.option("selectionFilter") } :
                { selectedRowKeys: this.option("selectedRowKeys") };

            this.selectionChanged.fire(argument);
        },

        _updateCheckboxesState: function(options) {
            var isDeferredMode = options.isDeferredMode,
                selectionFilter = options.selectionFilter,
                selectedItemKeys = options.selectedItemKeys,
                removedItemKeys = options.removedItemKeys;

            if(this.option(SHOW_CHECKBOXES_MODE) === "onClick") {
                if(isDeferredMode ? selectionFilter && isSeveralRowsSelected(this, selectionFilter) : selectedItemKeys.length > 1) {
                    this.startSelectionWithCheckboxes();
                } else if(isDeferredMode ? selectionFilter && !selectionFilter.length : selectedItemKeys.length === 0 && removedItemKeys.length) {
                    this.stopSelectionWithCheckboxes();
                }
            }
        },

        _updateSelectedItems: function(args) {
            var that = this,
                isDeferredMode = that.option("selection.deferred"),
                selectionFilter = that._selection.selectionFilter(),
                dataController = that.getController("data"),
                items = dataController.items();

            if(!items) {
                return;
            }

            var isSelectionWithCheckboxes = that.isSelectionWithCheckboxes();
            var changedItemIndexes = that.getChangedItemIndexes(items);

            that._updateCheckboxesState({
                selectedItemKeys: args.selectedItemKeys,
                removedItemKeys: args.removedItemKeys,
                selectionFilter: selectionFilter,
                isDeferredMode: isDeferredMode
            });

            if(changedItemIndexes.length || (isSelectionWithCheckboxes !== that.isSelectionWithCheckboxes())) {
                dataController.updateItems({
                    changeType: "updateSelection",
                    itemIndexes: changedItemIndexes
                });
            }

            if(isDeferredMode) {
                that.option("selectionFilter", selectionFilter);
                that._fireSelectionChanged();
                that.executeAction("onSelectionChanged", {});
            } else {
                if(args.addedItemKeys.length || args.removedItemKeys.length) {
                    that._selectedItemsInternalChange = true;
                    that.option("selectedRowKeys", args.selectedItemKeys.slice(0));
                    that._selectedItemsInternalChange = false;

                    that.executeAction("onSelectionChanged", {
                        selectedRowsData: args.selectedItems,
                        selectedRowKeys: args.selectedItemKeys,
                        currentSelectedRowKeys: args.addedItemKeys,
                        currentDeselectedRowKeys: args.removedItemKeys
                    });
                }

                that._fireSelectionChanged();
            }
        },

        getChangedItemIndexes: function(items) {
            var that = this,
                itemIndexes = [],
                isDeferredSelection = this.option("selection.deferred");

            for(var i = 0, length = items.length; i < length; i++) {
                var row = items[i];
                var isItemSelected = that._selection.isItemSelected(isDeferredSelection ? row.data : row.key);

                if(that._selection.isDataItem(row) && row.isSelected !== isItemSelected) {
                    itemIndexes.push(i);
                }
            }

            return itemIndexes;
        },

        callbackNames: function() {
            return ["selectionChanged"];
        },

        optionChanged: function(args) {
            var that = this;

            that.callBase(args);

            switch(args.name) {
                case "selection":
                    var oldSelectionMode = that._selectionMode;

                    that.init();

                    var selectionMode = that._selectionMode;
                    var selectedRowKeys = that.option("selectedRowKeys");

                    if(oldSelectionMode !== selectionMode) {
                        if(selectionMode === "single") {
                            if(selectedRowKeys.length > 1) {
                                selectedRowKeys = [selectedRowKeys[0]];
                            }
                        } else if(selectionMode !== "multiple") {
                            selectedRowKeys = [];
                        }
                    }

                    that.selectRows(selectedRowKeys).always(function() {
                        that._fireSelectionChanged();
                    });

                    that.getController("columns").updateColumns();
                    args.handled = true;
                    break;
                case "selectionFilter":
                    this._selection.selectionFilter(args.value);
                    args.handled = true;
                    break;
                case "selectedRowKeys":
                    if(Array.isArray(args.value) && !that._selectedItemsInternalChange && that.component.getDataSource()) {
                        that.selectRows(args.value);
                    }
                    args.handled = true;
                    break;
            }
        },

        publicMethods: function() {
            return ["selectRows", "deselectRows", "selectRowsByIndexes", "getSelectedRowKeys", "getSelectedRowsData", "clearSelection", "selectAll", "deselectAll", "startSelectionWithCheckboxes", "stopSelectionWithCheckboxes", "isRowSelected"];
        },

        /**
         * @name GridBaseMethods_isRowSelected(key)
         * @publicName isRowSelected(key)
         * @param1 key:any
         * @return boolean
         */
        /**
         * @name GridBaseMethods_isRowSelected(data)
         * @publicName isRowSelected(data)
         * @param1 data:any
         * @return boolean
         */
        isRowSelected: function(arg) {
            return this._selection.isItemSelected(arg);
        },

        isSelectColumnVisible: function() {
            return this.option(SELECTION_MODE) === "multiple" && (this.option(SHOW_CHECKBOXES_MODE) === "always" || this.option(SHOW_CHECKBOXES_MODE) === "onClick" || this._isSelectionWithCheckboxes);
        },

        _isOnePageSelectAll: function() {
            return this.option("selection.selectAllMode") === "page";
        },

        isSelectAll: function() {
            return this._selection.getSelectAllState(this._isOnePageSelectAll());
        },

        /**
         * @name GridBaseMethods_selectAll
         * @publicName selectAll()
         * @return Promise
         */
        selectAll: function() {
            if(this.option(SHOW_CHECKBOXES_MODE) === "onClick") {
                this.startSelectionWithCheckboxes();
            }

            return this._selection.selectAll(this._isOnePageSelectAll());
        },

        /**
         * @name GridBaseMethods_deselectAll
         * @publicName deselectAll()
         * @return Promise
         */
        deselectAll: function() {
            return this._selection.deselectAll(this._isOnePageSelectAll());
        },

        /**
         * @name GridBaseMethods_clearSelection
         * @publicName clearSelection()
         */
        clearSelection: function() {
            return this.selectedItemKeys([]);
        },

        refresh: function() {
            var selectedRowKeys = this.option("selectedRowKeys") || [];

            if(!this.option("selection.deferred") && selectedRowKeys.length) {
                return this.selectedItemKeys(selectedRowKeys);
            }

            return $.Deferred().resolve().promise();
        },

        selectedItemKeys: function(value, preserve, isDeselect, isSelectAll) {
            return this._selection.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
        },

        /**
         * @name GridBaseMethods_getSelectedRowKeys
         * @publicName getSelectedRowKeys()
         * @return array | Promise
         */
        getSelectedRowKeys: function() {
            return this._selection.getSelectedItemKeys();
        },

        /**
         * @name GridBaseMethods_selectRows
         * @publicName selectRows(keys, preserve)
         * @param1 keys:array
         * @param2 preserve:boolean
         * @return Promise
         */
        selectRows: function(keys, preserve) {
            return this.selectedItemKeys(keys, preserve);
        },
        /**
        * @name GridBaseMethods_deselectRows
        * @publicName deselectRows(keys)
        * @param1 keys:array
        * @return Promise
        */
        deselectRows: function(keys) {
            return this.selectedItemKeys(keys, true, true);
        },

        /**
         * @name GridBaseMethods_selectRowsByIndexes
         * @publicName selectRowsByIndexes(indexes)
         * @param1 indexes:array
         * @return Promise
         */
        selectRowsByIndexes: function(indexes) {
            var items = this.getController("data").items(),
                keys = [];

            if(!Array.isArray(indexes)) {
                indexes = Array.prototype.slice.call(arguments, 0);
            }

            $.each(indexes, function() {
                var item = items[this];
                if(item && item.rowType === "data") {
                    keys.push(item.key);
                }
            });
            return this.selectRows(keys);
        },

        /**
         * @name GridBaseMethods_getSelectedRowsData
         * @publicName getSelectedRowsData()
         * @return array | Promise
         */
        getSelectedRowsData: function() {
            return this._selection.getSelectedItems();
        },

        changeItemSelection: function(itemIndex, keys) {
            keys = keys || {};
            if(this.isSelectionWithCheckboxes()) {
                keys.control = true;
            }
            return this._selection.changeItemSelection(itemIndex, keys);
        },

        focusedItemIndex: function(itemIndex) {
            var that = this;

            if(commonUtils.isDefined(itemIndex)) {
                that._selection._focusedItemIndex = itemIndex;
            } else {
                return that._selection._focusedItemIndex;
            }
        },

        isSelectionWithCheckboxes: function() {
            return this.option(SELECTION_MODE) === "multiple" && (this.option(SHOW_CHECKBOXES_MODE) === "always" || this._isSelectionWithCheckboxes);
        },

        /**
         * @name GridBaseMethods_startSelectionWithCheckboxes
         * @publicName startSelectionWithCheckboxes()
         * @hidden
         * @return boolean
         */
        startSelectionWithCheckboxes: function() {
            var that = this;

            if(that.option(SELECTION_MODE) === "multiple" && !that.isSelectionWithCheckboxes()) {
                that._isSelectionWithCheckboxes = true;
                that._updateSelectColumn();
                return true;
            }
            return false;
        },

        /**
         * @name GridBaseMethods_stopSelectionWithCheckboxes
         * @publicName stopSelectionWithCheckboxes()
         * @hidden
         * @return boolean
         */
        stopSelectionWithCheckboxes: function() {
            var that = this;

            if(that._isSelectionWithCheckboxes) {
                that._isSelectionWithCheckboxes = false;
                that._updateSelectColumn();
                return true;
            }
            return false;
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
        /**
         * @name GridBaseOptions_selection
         * @publicName selection
         * @type object
         */
        /**
         * @name dxDataGridOptions_selection
         * @publicName selection
         * @type object
         */
        /**
         * @name dxTreeListOptions_selection
         * @publicName selection
         * @type object
         */
            selection: {
                /**
                 * @name GridBaseOptions_selection_mode
                 * @publicName mode
                 * @type string
                 * @acceptValues "none" | "single" | "multiple"
                 * @default "none"
                 */
                mode: "none", // "single", "multiple"
                /**
                 * @name  dxDataGridOptions_selection_showCheckBoxesMode
                 * @publicName showCheckBoxesMode
                 * @type string
                 * @acceptValues "onClick" | "onLongTap" | "always" | "none"
                 * @default "onClick"
                 */
                showCheckBoxesMode: "onClick", // "onLongTap", "always", "none"
                /**
                 * @name GridBaseOptions_selection_allowSelectAll
                 * @publicName allowSelectAll
                 * @type boolean
                 * @default true
                 */
                allowSelectAll: true,
                /**
                 * @name dxDataGridOptions_selection_selectAllMode
                 * @publicName selectAllMode
                 * @type string
                 * @acceptValues "page" | "allPages"
                 * @default "allPages"
                 */
                selectAllMode: "allPages",

                 /**
                 * @name dxDataGridOptions_selection_maxFilterLengthInRequest
                 * @publicName maxFilterLengthInRequest
                 * @type number
                 * @hidden
                 * @default 1500
                 */
                maxFilterLengthInRequest: 1500,
                 /**
                 * @name dxDataGridOptions_selection_deferred
                 * @publicName deferred
                 * @type boolean
                 * @default false
                 */
                deferred: false
            },
            /**
            * @name dxDataGridOptions_selectionFilter
            * @publicName selectionFilter
            * @type Filter expression
            * @default []
            */
            selectionFilter: [],
            /**
             * @name GridBaseOptions_onSelectionChanged
             * @publicName onSelectionChanged
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 currentSelectedRowKeys:array
             * @type_function_param1_field5 currentDeselectedRowKeys:array
             * @type_function_param1_field6 selectedRowKeys:array
             * @type_function_param1_field7 selectedRowsData:array
             * @extends Action
             * @action
             */
            /**
             * @name GridBaseOptions_selectedRowKeys
             * @publicName selectedRowKeys
             * @type array
             */
            selectedRowKeys: []
        };
    },

    controllers: {
        selection: exports.SelectionController
    },

    extenders: {
        controllers: {
            data: {
                init: function() {
                    var selectionController = this.getController("selection"),
                        isDeferredMode = this.option("selection.deferred");

                    this.callBase.apply(this, arguments);

                    if(isDeferredMode) {
                        selectionController._updateCheckboxesState({
                            isDeferredMode: true,
                            selectionFilter: this.option("selectionFilter")
                        });
                    }
                },

                _loadDataSource: function() {
                    var that = this;

                    return that.callBase().done(function() {
                        that.getController("selection").refresh();
                    });
                },

                pageIndex: function(value) {
                    var that = this,
                        dataSource = that._dataSource;

                    if(dataSource && value && dataSource.pageIndex() !== value) {
                        that.getController("selection").focusedItemIndex(-1);
                    }
                    return that.callBase(value);
                },

                _processDataItem: function(item, options) {
                    var that = this,
                        selectionController = that.getController("selection"),
                        hasSelectColumn = selectionController.isSelectColumnVisible(),
                        isDeferredSelection = options.isDeferredSelection = options.isDeferredSelection === undefined ? this.option("selection.deferred") : options.isDeferredSelection,
                        dataItem = this.callBase.apply(this, arguments);

                    dataItem.isSelected = selectionController.isRowSelected(isDeferredSelection ? dataItem.data : dataItem.key);

                    if(hasSelectColumn && dataItem.values) {
                        for(var i = 0; i < options.visibleColumns.length; i++) {
                            if(options.visibleColumns[i].command === "select") {
                                dataItem.values[i] = dataItem.isSelected;
                                break;
                            }
                        }
                    }
                    return dataItem;
                },

                refresh: function() {
                    var that = this,
                        d = $.Deferred();

                    this.callBase.apply(this, arguments).done(function() {
                        that.getController("selection").refresh().done(d.resolve).fail(d.reject);
                    }).fail(d.reject);

                    return d.promise();
                }
            },
            contextMenu: {
                _contextMenuPrepared: function(options) {
                    var jQueryEvent = options.jQueryEvent;

                    if(jQueryEvent.originalEvent && jQueryEvent.originalEvent.type !== "dxhold" || options.items && options.items.length > 0) return;

                    processLongTap(this, jQueryEvent);
                }
            }
        },

        views: {
            columnHeadersView: {
                init: function() {
                    var that = this;
                    that.callBase();
                    that.getController("selection").selectionChanged.add(that._updateSelectAllValue.bind(that));
                },
                _updateSelectAllValue: function() {
                    var that = this,
                        $element = that.element(),
                        $editor = $element && $element.find("." + SELECT_CHECKBOX_CLASS);

                    if($element && $editor.length && that.option("selection.mode") === "multiple") {
                        $editor.dxCheckBox("instance").option("value", that.getController("selection").isSelectAll());
                    }
                },
                _handleDataChanged: function(e) {
                    this.callBase(e);
                    if(!e || e.changeType === "refresh") {
                        this._updateSelectAllValue();
                    }
                },
                _getDefaultTemplate: function(column) {
                    var that = this;

                    if(column.command === "select") {
                        return function($cell, options) {
                            var column = options.column;

                            if(column.command === "select") {
                                $cell.addClass(EDITOR_CELL_CLASS);

                                that._renderSelectAllCheckBox($cell, column);
                                that._attachSelectAllCheckBoxClickEvent($cell);
                            }
                        };
                    } else {
                        return that.callBase(column);
                    }
                },

                _renderSelectAllCheckBox: function($container, column) {
                    var that = this,
                        groupElement,
                        selectionController = that.getController("selection");

                    groupElement = $("<div />")
                        .appendTo($container)
                        .addClass(SELECT_CHECKBOX_CLASS);

                    that.setAria("label", messageLocalization.format("dxDataGrid-ariaSelectAll"), $container);

                    that.getController("editorFactory").createEditor(groupElement, extend({}, column, {
                        parentType: "headerRow",
                        dataType: "boolean",
                        value: selectionController.isSelectAll(),
                        editorOptions: {
                            visible: that.option("selection.allowSelectAll") || selectionController.isSelectAll() !== false
                        },
                        tabIndex: -1,
                        setValue: function(value, e) {
                            var allowSelectAll = that.option("selection.allowSelectAll");
                            e.component.option("visible", allowSelectAll || e.component.option("value") !== false);

                            if(!e.jQueryEvent || selectionController.isSelectAll() === value) {
                                return;
                            }

                            if(e.value && !allowSelectAll) {
                                e.component.option("value", false);
                            } else {
                                e.value ? selectionController.selectAll() : selectionController.deselectAll();
                            }

                            e.jQueryEvent.preventDefault();
                        }
                    }));

                    return groupElement;
                },

                _attachSelectAllCheckBoxClickEvent: function($element) {
                    $element.on(clickEvent.name, this.createAction(function(e) {
                        var event = e.jQueryEvent;

                        if(!$(event.target).closest("." + SELECT_CHECKBOX_CLASS).length) {
                            $(event.currentTarget).children().trigger(clickEvent.name);
                        }
                        event.stopPropagation();
                        event.preventDefault();
                    }));
                }
            },

            rowsView: {
                _getDefaultTemplate: function(column) {
                    var that = this;

                    if(column.command === "select") {
                        return function(container, options) {
                            that.renderSelectCheckBoxContainer(column, container, options);
                        };
                    } else {
                        return that.callBase(column);
                    }
                },

                renderSelectCheckBoxContainer: function(column, container, options) {
                    if(options.rowType === "data" && !options.row.inserted) {
                        container.addClass(EDITOR_CELL_CLASS);
                        this._attachCheckBoxClickEvent(container);

                        this.setAria("label", messageLocalization.format("dxDataGrid-ariaSelectRow"), container);
                        this._renderSelectCheckBox(container, options.value, column);
                    }
                },

                _renderSelectCheckBox: function(container, value, column) {
                    var groupElement = $("<div />")
                            .addClass(SELECT_CHECKBOX_CLASS)
                            .appendTo(container);

                    this.getController("editorFactory").createEditor(groupElement, extend({}, column, {
                        parentType: "dataRow",
                        dataType: "boolean",
                        value: value,
                        tabIndex: -1,
                        setValue: function(value, e) {
                            if(e && e.jQueryEvent && e.jQueryEvent.type === "keydown") {
                                container.trigger(clickEvent.name, e);
                            }
                        }
                    }));

                    return groupElement;
                },

                _attachCheckBoxClickEvent: function($element) {
                    $element.on(clickEvent.name, this.createAction(function(e) {
                        var selectionController = this.getController("selection"),
                            event = e.jQueryEvent,
                            rowIndex = this.getRowIndex($(event.currentTarget).closest("." + ROW_CLASS));

                        if(rowIndex >= 0) {
                            selectionController.startSelectionWithCheckboxes();
                            selectionController.changeItemSelection(rowIndex, { shift: event.shiftKey });
                        }
                    }));
                },

                _update: function(change) {
                    var that = this,
                        tableElements = that.getTableElements();

                    if(change.changeType === "updateSelection") {
                        if(tableElements.length > 0) {
                            $.each(tableElements, function(_, tableElement) {
                                $.each(change.itemIndexes || [], function(_, index) {
                                    var $row,
                                        isSelected;

                                    //T108078
                                    if(change.items[index]) {
                                        $row = that._getRowElements($(tableElement)).eq(index);
                                        isSelected = !!change.items[index].isSelected;
                                        $row
                                            .toggleClass(ROW_SELECTION_CLASS, isSelected)
                                            .find("." + SELECT_CHECKBOX_CLASS).dxCheckBox("option", "value", isSelected);
                                        that.setAria("selected", isSelected, $row);
                                    }
                                });
                            });

                            that._updateCheckboxesClass();
                        }
                    } else {
                        that.callBase(change);
                    }
                },

                _createTable: function() {
                    var that = this,
                        selectionMode = that.option("selection.mode"),
                        $table = that.callBase.apply(that, arguments);


                    if(selectionMode !== "none") {
                        if(that.option(SHOW_CHECKBOXES_MODE) === "onLongTap" || !support.touch) {
                            //TODO Not working timeout by hold when it is larger than other timeouts by hold
                            $table.on(eventUtils.addNamespace(holdEvent.name, "dxDataGridRowsView"), "." + DATA_ROW_CLASS, that.createAction(function(e) {
                                processLongTap(that.component, e.jQueryEvent);

                                e.jQueryEvent.stopPropagation();
                            }));
                        }
                        $table.on("mousedown selectstart", that.createAction(function(e) {
                            var event = e.jQueryEvent;

                            if(event.shiftKey) {
                                event.preventDefault();
                            }
                        }));
                    }

                    return $table;
                },

                _createRow: function(row) {
                    var $row = this.callBase(row),
                        isSelected;

                    if(row) {
                        isSelected = !!row.isSelected;
                        if(isSelected) {
                            $row.addClass(ROW_SELECTION_CLASS);
                        }
                        this.setAria("selected", isSelected, $row);
                    }

                    return $row;
                },

                _rowClick: function(e) {
                    var that = this,
                        jQueryEvent = e.jQueryEvent,
                        isSelectionDisabled = $(jQueryEvent.target).closest("." + SELECTION_DISABLED_CLASS).length;

                    if(!that.isClickableElement($(jQueryEvent.target))) {
                        if(!isSelectionDisabled && (that.option(SELECTION_MODE) !== "multiple" || that.option(SHOW_CHECKBOXES_MODE) !== "always")) {
                            if(that.getController("selection").changeItemSelection(e.rowIndex, {
                                control: jQueryEvent.ctrlKey || jQueryEvent.metaKey,
                                shift: jQueryEvent.shiftKey
                            })) {
                                jQueryEvent.preventDefault();
                                e.handled = true;
                            }
                        }
                        that.callBase(e);
                    }
                },

                isClickableElement: function($target) {
                    var isCommandSelect = $target.closest("." + COMMAND_SELECT_CLASS).length;

                    return !!isCommandSelect;
                },

                _renderCore: function(change) {
                    this.callBase(change);
                    this._updateCheckboxesClass();
                },

                _updateCheckboxesClass: function() {
                    var tableElements = this.getTableElements(),
                        selectionController = this.getController("selection"),
                        isCheckBoxesHidden = selectionController.isSelectColumnVisible() && !selectionController.isSelectionWithCheckboxes();

                    $.each(tableElements, function(_, tableElement) {
                        $(tableElement).toggleClass(CHECKBOXES_HIDDEN_CLASS, isCheckBoxesHidden);
                    });
                }
            }
        }
    }
};
