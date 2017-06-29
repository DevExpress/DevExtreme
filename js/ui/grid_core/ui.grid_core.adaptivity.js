"use strict";

var $ = require("../../core/renderer"),
    eventUtils = require("../../events/utils"),
    clickEvent = require("../../events/click"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    equalByValue = commonUtils.equalByValue,
    Guid = require("../../core/guid"),
    modules = require("./ui.grid_core.modules"),
    Form = require("../form"),
    gridCoreUtils = require("./ui.grid_core.utils"),

    COLUMN_HEADERS_VIEW = "columnHeadersView",
    ROWS_VIEW = "rowsView",
    FOOTER_VIEW = "footerView",
    COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW],

    ADAPTIVE_NAMESPACE = "dxDataGridAdaptivity",
    HIDDEN_COLUMNS_WIDTH = "adaptiveHidden",
    ADAPTIVE_ROW_TYPE = "detailAdaptive",

    FORM_ITEM_CONTENT_CLASS = "dx-field-item-content",
    FORM_ITEM_MODIFIED = "dx-item-modified",

    HIDDEN_COLUMN_CLASS = "hidden-column",
    ADAPTIVE_COLUMN_BUTTON_CLASS = "adaptive-more",
    ADAPTIVE_COLUMN_NAME_CLASS = "dx-command-adaptive",
    COMMAND_ADAPTIVE_HIDDEN_CLASS = "dx-command-adaptive-hidden",
    ADAPTIVE_DETAIL_ROW_CLASS = "dx-adaptive-detail-row",
    ADAPTIVE_ITEM_TEXT_CLASS = "dx-adaptive-item-text",
    MASTER_DETAIL_CELL_CLASS = "dx-master-detail-cell",
    ADAPTIVE_COLUMN_NAME = "adaptive",
    EDIT_MODE_ROW = "row",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_POPUP = "popup";

function getColumnId(column) {
    return column.command ? "command:" + column.command : column.index;
}

var AdaptiveColumnsController = modules.ViewController.inherit({
    _isRowEditMode: function() {
        var editMode = this._editingController.getEditMode();
        return editMode === EDIT_MODE_ROW;
    },

    _isItemModified: function(item, cellOptions) {
        var columnIndex = this._columnsController.getVisibleIndex(item.column.index),
            rowIndex = this._dataController.getRowIndexByKey(cellOptions.key),
            row = this._dataController.items()[rowIndex + 1];

        return row && row.modifiedValues && typeUtils.isDefined(row.modifiedValues[columnIndex]);
    },

    _renderFormViewTemplate: function(item, cellOptions, $container) {
        var that = this,
            column = item.column,
            cellValue = column.calculateCellValue(cellOptions.data),
            cellText;

        cellValue = gridCoreUtils.getDisplayValue(column, cellValue, cellOptions.data, cellOptions.rowType);
        cellText = gridCoreUtils.formatValue(cellValue, column);

        if(column.cellTemplate) {
            var templateOptions = extend({}, cellOptions, { value: cellValue, text: cellText, column: column });
            that._rowsView.renderTemplate($container, column.cellTemplate, templateOptions);
        } else {
            var container = $container.get(0);
            if(column.encodeHtml) {
                container.textContent = cellText;
            } else {
                container.innerHTML = cellText;
            }

            $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
            if(!typeUtils.isDefined(cellText) || cellText === "") {
                $container.html("&nbsp;");
            }

            if(!that._isRowEditMode()) {
                if(that._isItemModified(item, cellOptions)) {
                    $container.addClass(FORM_ITEM_MODIFIED);
                }
            }
        }
    },

    _getTemplate: function(item, cellOptions) {
        var that = this,
            column = item.column,
            editingController = this.getController("editing");

        return function(options, $container) {
            var isItemEdited = that._isItemEdited(item),
                columnIndex = that._columnsController.getVisibleIndex(column.visibleIndex),
                templateOptions = extend({}, cellOptions);

            templateOptions.value = cellOptions.row.values[columnIndex];

            if(isItemEdited || column.showEditorAlways) {
                editingController.renderFormEditTemplate(templateOptions, item, options.component, $container, !isItemEdited);
            } else {
                templateOptions.column = column;
                templateOptions.columnIndex = columnIndex;

                that._renderFormViewTemplate(item, templateOptions, $container);
                that.getView("rowsView")._cellPrepared($container, templateOptions);
            }
        };
    },

    _isVisibleColumnsValid: function(visibleColumns) {
        var getCommandColumnsCount = function() {
            var result = 0,
                j,
                visibleColumn;

            for(j = 0; j < visibleColumns.length; j++) {
                visibleColumn = visibleColumns[j];
                if(visibleColumn.command) {
                    result++;
                }
            }
            return result;
        };

        if(visibleColumns < 2) {
            return false;
        }

        if(visibleColumns.length - getCommandColumnsCount() <= 1) {
            return false;
        }

        return true;
    },

    _calculatePercentWidths: function(widths, visibleColumns) {
        var that = this,
            percentWidths = 0;

        visibleColumns.forEach(function(item, index) {
            if(widths[index] !== HIDDEN_COLUMNS_WIDTH) {
                percentWidths += that._getItemPercentWidth(item);
            }
        });

        return percentWidths;
    },

    _isPercentWidth: function(width) {
        return typeUtils.isString(width) && width.slice(-1) === "%";
    },

    _getNotTruncatedColumnWidth: function(column, containerWidth, columnsCount, columnsCanFit) {
        var columnId = getColumnId(column),
            widthOption = this._columnsController.columnOption(columnId, "width"),
            bestFitWidth = this._columnsController.columnOption(columnId, "bestFitWidth"),
            colWidth;

        if(widthOption && widthOption !== "auto") {
            if(this._isPercentWidth(widthOption)) {
                var columnFitted = (column.visibleIndex < columnsCount - 1) && columnsCanFit,
                    partialWidth = containerWidth * parseFloat(widthOption) / 100,
                    resultWidth = columnsCanFit && (partialWidth < bestFitWidth) ? bestFitWidth : partialWidth;

                colWidth = columnFitted ? this.component.element().width() * parseFloat(widthOption) / 100 : resultWidth;
            } else {
                return widthOption;
            }
        } else {
            var columnAutoWidth = this.option("columnAutoWidth");

            colWidth = columnAutoWidth || !!column.command ? bestFitWidth : containerWidth / columnsCount;
        }

        var isTruncated = colWidth < bestFitWidth;

        return isTruncated ? null : colWidth;
    },

    _getItemPercentWidth: function(item) {
        var result = 0;

        if(item.width && this._isPercentWidth(item.width)) {
            result = parseFloat(item.width);
        }

        return result;
    },

    _getCommandColumnsWidth: function() {
        var that = this,
            columns = that._columnsController.getVisibleColumns(),
            colWidth = 0;

        $.each(columns, function(index, column) {
            if(column.index < 0 || column.command) {
                colWidth += that._columnsController.columnOption(getColumnId(column), "bestFitWidth") || 0;
            }
        });

        return colWidth;
    },

    _isItemEdited: function(item) {
        if(this.isFormEditMode()) {
            return false;
        }

        if(this._isRowEditMode()) {
            var editRowKey = this._editingController.getEditRowKey();
            if(equalByValue(editRowKey, this._dataController.adaptiveExpandedKey())) {
                return true;
            }
        } else {
            var rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1,
                columnIndex = this._columnsController.getVisibleIndex(item.column.index);

            return this._editingController.isEditCell(rowIndex, columnIndex);
        }
    },

    _getFormItemsByHiddenColumns: function(hiddenColumns) {
        var items = [];
        $.each(hiddenColumns, function(_, column) {
            items.push({
                column: column,
                name: column.name,
                dataField: column.dataField,
                visibleIndex: column.visibleIndex
            });
        });

        return items;
    },

    _getAdaptiveColumnVisibleIndex: function(visibleColumns) {
        var i,
            column;

        for(i = 0; i < visibleColumns.length; i++) {
            column = visibleColumns[i];
            if(column.command === ADAPTIVE_COLUMN_NAME) {
                return i;
            }
        }
    },

    _hideAdaptiveColumn: function(resultWidths, visibleColumns) {
        var visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
        if(typeUtils.isDefined(visibleIndex)) {
            resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
            this._addCssClassToColumn(COMMAND_ADAPTIVE_HIDDEN_CLASS, visibleIndex);
        }
    },

    _removeCssClassFromColumn: function(cssClassName) {
        var i,
            view,
            $cells;

        for(i = 0; i < COLUMN_VIEWS.length; i++) {
            view = this.getView(COLUMN_VIEWS[i]);
            if(view && view.isVisible() && view.element()) {
                $cells = view.element().find("." + cssClassName);
                $cells.removeClass(cssClassName);
            }
        }
    },

    _removeCssClassesFromColumns: function() {
        this._removeCssClassFromColumn(COMMAND_ADAPTIVE_HIDDEN_CLASS);
        this._removeCssClassFromColumn(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
    },

    _isCellValid: function($cell) {
        return !$cell.hasClass(MASTER_DETAIL_CELL_CLASS);
    },

    _addCssClassToColumn: function(cssClassName, visibleIndex) {
        var i,
            view,
            viewName,
            rowsCount,
            rowIndex,
            $cellElement,
            currentVisibleIndex,
            column = this._columnsController.getVisibleColumns()[visibleIndex],
            editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();

        for(i = 0; i < COLUMN_VIEWS.length; i++) {
            viewName = COLUMN_VIEWS[i];
            view = this.getView(viewName);
            if(view && view.isVisible() && column) {
                rowsCount = view.getRowsCount();
                for(rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
                    if(rowIndex !== editFormRowIndex || viewName !== ROWS_VIEW) {
                        currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
                        if(currentVisibleIndex >= 0) {
                            $cellElement = view.getCellElements(rowIndex).eq(currentVisibleIndex);
                            this._isCellValid($cellElement) && $cellElement.addClass(cssClassName);
                        }
                    }
                }
            }
        }
    },

    isFormEditMode: function() {
        var editMode = this._editingController.getEditMode();

        return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
    },

    hideRedundantColumns: function(resultWidths, visibleColumns, hiddenQueue) {
        var that = this,
            visibleColumn;

        this._hiddenColumns = [];

        if(that._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
            var totalWidth = 0,
                percentWidths,
                $rootElement = that.component.element(),
                rootElementWidth = $rootElement.width() - that._getCommandColumnsWidth(),
                contentColumns = visibleColumns.filter(function(item) {
                    return !item.command;
                }),
                columnsCanFit,
                i,
                contentColumnCount = contentColumns.length,
                needHideColumn;

            do {
                needHideColumn = false;
                totalWidth = 0;

                percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);
                columnsCanFit = percentWidths < 100 && percentWidths !== 0;
                for(i = 0; i < visibleColumns.length; i++) {
                    visibleColumn = visibleColumns[i];

                    var columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, contentColumnCount, columnsCanFit),
                        columnId = getColumnId(visibleColumn),
                        widthOption = that._columnsController.columnOption(columnId, "width"),
                        columnBestFitWidth = that._columnsController.columnOption(columnId, "bestFitWidth");

                    if(resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
                        continue;
                    }
                    if(!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
                        needHideColumn = true;
                        break;
                    }
                    if(widthOption && widthOption !== "auto") {
                        totalWidth += columnWidth;
                    } else {
                        totalWidth += columnBestFitWidth || 0;
                    }
                }
                needHideColumn = needHideColumn || totalWidth > $rootElement.width();
                if(needHideColumn) {
                    var column = hiddenQueue.pop(),
                        visibleIndex = that._columnsController.getVisibleIndex(column.index);

                    that._addCssClassToColumn(that.addWidgetPrefix(HIDDEN_COLUMN_CLASS), visibleIndex);
                    resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
                    contentColumnCount--;
                    this._hiddenColumns.push(column);
                }
            }
            while(needHideColumn && contentColumnCount > 1 && hiddenQueue.length);

            if(contentColumnCount === contentColumns.length) {
                that._hideAdaptiveColumn(resultWidths, visibleColumns);
            }
        } else {
            that._hideAdaptiveColumn(resultWidths, visibleColumns);
        }
    },

    getItemContentByColumnIndex: function(visibleColumnIndex) {
        var $itemContent,
            i,
            item;

        for(i = 0; i < this._$itemContents.length; i++) {
            $itemContent = this._$itemContents.eq(i);
            item = $itemContent.data("dx-form-item");
            if(item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
                return $itemContent;
            }
        }
    },

    toggleExpandAdaptiveDetailRow: function(key) {
        if(!(this.isFormEditMode() && this._editingController.isEditing())) {
            this.getController("data").toggleExpandAdaptiveDetailRow(key);
        }
    },

    createFormByHiddenColumns: function($container, options) {
        var that = this,
            userFormOptions = {
                items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
                formID: "dx-" + new Guid()
            };

        this.executeAction("onAdaptiveDetailRowPreparing", { formOptions: userFormOptions });

        that._$itemContents = null;

        that._form = that._createComponent($("<div>").appendTo($container), Form, extend({}, userFormOptions, {
            customizeItem: function(item) {
                var column = item.column || that._columnsController.columnOption(item.name || item.dataField);
                if(column) {
                    item.label = item.label || {};
                    item.label.text = item.label.text || column.caption;
                    item.column = column;
                    item.template = that._getTemplate(item, options, that.updateForm.bind(that));
                }
                userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
            },
            onContentReady: function(e) {
                userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
                that._$itemContents = $container.find("." + FORM_ITEM_CONTENT_CLASS);
            }
        }));
    },

    hasAdaptiveDetailRowExpanded: function() {
        return typeUtils.isDefined(this._dataController.adaptiveExpandedKey());
    },

    updateForm: function(hiddenColumns) {
        if(this.hasAdaptiveDetailRowExpanded()) {
            if(this._form && typeUtils.isDefined(this._form._contentReadyAction)) {
                if(hiddenColumns && hiddenColumns.length) {
                    this._form.option("items", this._getFormItemsByHiddenColumns(hiddenColumns));
                } else {
                    this._form.repaint();
                }
            }
        }
    },

    updateHidingQueue: function(columns) {
        var that = this,
            hideableColumns = columns.filter(function(column) {
                return column.visible && !column.fixed && !(typeUtils.isDefined(column.groupIndex) && column.groupIndex >= 0);
            }),
            columnsHasHidingPriority,
            i;

        that._hidingColumnsQueue = [];

        if(that.option("allowColumnResizing") && that.option("columnResizingMode") === "widget") {
            return that._hidingColumnsQueue;
        }

        for(i = 0; i < hideableColumns.length; i++) {
            if(typeUtils.isDefined(hideableColumns[i].hidingPriority) && hideableColumns[i].hidingPriority >= 0) {
                columnsHasHidingPriority = true;
                that._hidingColumnsQueue[hideableColumns[i].hidingPriority] = hideableColumns[i];
            }
        }

        if(columnsHasHidingPriority) {
            that._hidingColumnsQueue.reverse();
        } else if(that.option("columnHidingEnabled")) {
            for(i = 0; i < hideableColumns.length; i++) {
                var visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);
                that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
            }
        }

        that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
        return that._hidingColumnsQueue;
    },

    getHiddenColumns: function() {
        return this._hiddenColumns;
    },

    hasHiddenColumns: function() {
        return this._hiddenColumns.length > 0;
    },

    getHidingColumnsQueue: function() {
        return this._hidingColumnsQueue;
    },

    init: function() {
        var that = this;
        that._columnsController = that.getController("columns");
        that._dataController = that.getController("data");
        that._rowsView = that.getView("rowsView");

        that._columnsController.addCommandColumn({
            command: ADAPTIVE_COLUMN_NAME,
            visible: false,
            cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
            width: "auto"
        });

        that._columnsController.columnsChanged.add(function() {
            var isAdaptiveVisible = !!that.updateHidingQueue(that._columnsController.getColumns()).length;
            that._columnsController.columnOption("command:adaptive", "visible", isAdaptiveVisible, true);
        });
        that._editingController = that.getController("editing");
        that._hidingColumnsQueue = [];
        that._hiddenColumns = [];
        that.createAction("onAdaptiveDetailRowPreparing");

        that.callBase();
    },

    optionChanged: function(args) {
        if(args.name === "columnHidingEnabled") {
            this._columnsController.columnOption("command:adaptive", "visible", args.value);
        }

        this.callBase(args);
    },

    publicMethods: function() {
        return ["isAdaptiveDetailRowExpanded", "expandAdaptiveDetailRow", "collapseAdaptiveDetailRow"];
    },

    /**
     * @name GridBaseMethods_isAdaptiveDetailRowExpanded
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     */
    isAdaptiveDetailRowExpanded: function(key) {
        return this._dataController.adaptiveExpandedKey() && commonUtils.equalByValue(this._dataController.adaptiveExpandedKey(), key);
    },

    /**
    * @name GridBaseMethods_expandAdaptiveDetailRow
    * @publicName expandAdaptiveDetailRow(key)
    * @param1 key:any
    */
    expandAdaptiveDetailRow: function(key) {
        if(!this.hasAdaptiveDetailRowExpanded()) {
            this.toggleExpandAdaptiveDetailRow(key);
        }
    },

     /**
    * @name GridBaseMethods_collapseAdaptiveDetailRow
    * @publicName collapseAdaptiveDetailRow()
    */
    collapseAdaptiveDetailRow: function() {
        if(this.hasAdaptiveDetailRowExpanded()) {
            this.toggleExpandAdaptiveDetailRow();
        }
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
            * @name GridBaseOptions_columnHidingEnabled
            * @publicName columnHidingEnabled
            * @type boolean
            * @default false
            */
            columnHidingEnabled: false,
            /**
            * @name GridBaseOptions_onAdaptiveDetailRowPreparing
            * @publicName onAdaptiveDetailRowPreparing
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 formOptions:object
            * @action
            */
            onAdaptiveDetailRowPreparing: null
        };
    },
    controllers: {
        adaptiveColumns: AdaptiveColumnsController
    },
    extenders: {
        views: {
            rowsView: {
                _getCellTemplate: function(options) {
                    var that = this,
                        column = options.column;

                    if(column.command === ADAPTIVE_COLUMN_NAME && options.rowType !== "groupFooter") {
                        return function(container) {
                            $("<span/>")
                                .addClass(that.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS))
                                .on(eventUtils.addNamespace(clickEvent.name, ADAPTIVE_NAMESPACE), that.createAction(
                                    function() {
                                        that._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
                                    }
                                ))
                                .appendTo(container);
                        };
                    }
                    if(options.rowType === ADAPTIVE_ROW_TYPE && column.command === "detail") {
                        return function(container, options) {
                            that._adaptiveColumnsController.createFormByHiddenColumns(container, options);
                        };
                    }
                    return that.callBase(options);
                },

                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(row && row.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.adaptiveExpandedKey()) {
                        $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
                    }
                    return $row;
                },

                _getColumnIndexByElementCore: function($element) {
                    var $itemContent = $element.closest("." + FORM_ITEM_CONTENT_CLASS);
                    if($itemContent.length && $itemContent.closest(this.component.element()).length) {
                        var formItem = $itemContent.length ? $itemContent.first().data("dx-form-item") : null;
                        return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
                    } else {
                        return this.callBase($element);
                    }
                },

                getCellElement: function(rowIndex, columnIdentifier) {
                    var item = this._dataController.items()[rowIndex];

                    if(item && item.rowType === ADAPTIVE_ROW_TYPE) {
                        return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
                    } else {
                        return this.callBase(rowIndex, columnIdentifier);
                    }
                },

                isClickableElement: function($target) {
                    var isClickable = this.callBase ? this.callBase($target) : false;

                    return isClickable || !!$target.closest("." + ADAPTIVE_COLUMN_NAME_CLASS).length;
                },

                init: function() {
                    this.callBase();
                    this._adaptiveColumnsController = this.getController("adaptiveColumns");
                }
            }
        },
        controllers: {
            export: {
                _updateColumnWidth: function(column, width) {
                    this.callBase(column, column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width);
                }
            },
            columnsResizer: {
                _pointCreated: function(point, cellsLength, columns) {
                    var result = this.callBase(point, cellsLength, columns),
                        currentColumn = columns[point.columnIndex] || {},
                        nextColumnIndex = this._getNextColumnIndex(point.columnIndex),
                        nextColumn = columns[nextColumnIndex] || {},
                        hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command,
                        hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;

                    return result || hasAdaptiveHiddenWidth;
                },
                _getNextColumnIndex: function(currentColumnIndex) {
                    var visibleColumns = this._columnsController.getVisibleColumns(),
                        index = this.callBase(currentColumnIndex);

                    while(visibleColumns[index] && visibleColumns[index].visibleWidth === HIDDEN_COLUMNS_WIDTH) {
                        index++;
                    }

                    return index;
                }
            },
            draggingHeader: {
                _pointCreated: function(point, columns, location, sourceColumn) {
                    var result = this.callBase(point, columns, location, sourceColumn),
                        column = columns[point.columnIndex] || {},
                        hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;

                    return result || hasAdaptiveHiddenWidth;
                }
            },
            editing: {
                _getFormEditItemTemplate: function(cellOptions, column) {
                    if(this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === "detailAdaptive") {
                        cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
                        return this.getColumnTemplate(cellOptions);
                    }

                    return this.callBase(cellOptions, column);
                },

                _closeEditItem: function($targetElement) {
                    var $itemContents = $targetElement.closest("." + FORM_ITEM_CONTENT_CLASS),
                        rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1,
                        formItem = $itemContents.length ? $itemContents.first().data("dx-form-item") : null,
                        columnIndex = formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);

                    if(!this.isEditCell(rowIndex, columnIndex)) {
                        this.callBase($targetElement);
                    }
                },

                _beforeUpdateItems: function(rowIndices, rowIndex) {
                    if(!this._adaptiveController.isFormEditMode() && this._adaptiveController.hasHiddenColumns()) {
                        var items = this._dataController.items(),
                            item = items[rowIndex],
                            oldExpandRowIndex = gridCoreUtils.getIndexByKey(this._dataController.adaptiveExpandedKey(), items);

                        this._isForceRowAdaptiveExpand = !this._adaptiveController.hasAdaptiveDetailRowExpanded();

                        if(oldExpandRowIndex >= 0 && rowIndex > oldExpandRowIndex) {
                            this._editRowIndex--;
                        }

                        if(oldExpandRowIndex >= 0) {
                            rowIndices.push(oldExpandRowIndex + 1);
                        }

                        rowIndices.push(rowIndex + 1);
                        this._dataController.adaptiveExpandedKey(item.key);
                    }
                },

                _afterInsertRow: function(options) {
                    this.callBase(options);
                    if(this._adaptiveController.hasHiddenColumns()) {
                        this._adaptiveController.expandAdaptiveDetailRow(options.key);
                        this._isForceRowAdaptiveExpand = true;
                    }
                },

                _collapseAdaptiveDetailRow: function() {
                    if(this.getEditMode() === EDIT_MODE_ROW && this._isForceRowAdaptiveExpand) {
                        this._adaptiveController.collapseAdaptiveDetailRow();
                        this._isForceRowAdaptiveExpand = false;
                    }
                },

                _cancelEditAdaptiveDetailRow: function() {
                    if(this._adaptiveController.hasHiddenColumns()) {
                        this._collapseAdaptiveDetailRow();
                    }
                },

                _afterSaveEditData: function() {
                    this.callBase();
                    if(this.getController("validating").validate(true)) {
                        this._cancelEditAdaptiveDetailRow();
                    }
                },

                _beforeCancelEditData: function() {
                    this.callBase();
                    this._cancelEditAdaptiveDetailRow();
                },

                _getRowIndicesForCascadeUpdating: function(row) {
                    var rowIndices = this.callBase.apply(this, arguments);

                    if(this._adaptiveController.isAdaptiveDetailRowExpanded(row.key)) {
                        rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
                    }

                    return rowIndices;
                },

                _beforeCloseEditCellInBatchMode: function(rowIndices) {
                    var expandedKey = this._dataController._adaptiveExpandedKey,
                        rowIndex;

                    if(expandedKey) {
                        rowIndex = gridCoreUtils.getIndexByKey(expandedKey, this._dataController.items());
                        if(rowIndex > -1) {
                            rowIndices.unshift(rowIndex);
                        }
                    }
                },

                editRow: function(rowIndex) {
                    if(this._adaptiveController.isFormEditMode()) {
                        this._adaptiveController.collapseAdaptiveDetailRow();
                    }

                    this.callBase(rowIndex);
                },

                init: function() {
                    this.callBase();
                    this._adaptiveController = this.getController("adaptiveColumns");
                }
            },
            resizing: {
                _isNeedToCalcBestFitWidths: function(needBestFit) {
                    return this.callBase(needBestFit) || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
                },

                _correctColumnWidths: function(resultWidths, visibleColumns) {
                    var adaptiveController = this._adaptiveColumnsController,
                        oldHiddenColumns = adaptiveController.getHiddenColumns(),
                        hiddenColumns,
                        hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());

                    adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
                    hiddenColumns = adaptiveController.getHiddenColumns();
                    if(adaptiveController.hasAdaptiveDetailRowExpanded()) {
                        if(oldHiddenColumns.length !== hiddenColumns.length) {
                            adaptiveController.updateForm(hiddenColumns);
                        }
                    }

                    !hiddenColumns.length && adaptiveController.collapseAdaptiveDetailRow();
                    return this.callBase(resultWidths, visibleColumns);
                },

                _toggleBestFitMode: function(isBestFit) {
                    isBestFit && this._adaptiveColumnsController._removeCssClassesFromColumns();
                    this.callBase(isBestFit);
                },

                init: function() {
                    this._adaptiveColumnsController = this.getController("adaptiveColumns");
                    this.callBase();
                }
            },
            data: {
                _processItems: function(items, changeType) {
                    var that = this,
                        item,
                        expandRowIndex;

                    items = that.callBase.apply(that, arguments);

                    if((changeType === "loadingAll") || (!typeUtils.isDefined(that._adaptiveExpandedKey))) {
                        return items;
                    }

                    expandRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, items);

                    if(expandRowIndex >= 0) {
                        item = items[expandRowIndex];
                        items.splice(expandRowIndex + 1, 0, {
                            visible: true,
                            rowType: ADAPTIVE_ROW_TYPE,
                            key: item.key,
                            data: item.data,
                            modifiedValues: item.modifiedValues,
                            inserted: item.inserted,
                            values: item.values
                        });
                    } else {
                        that._adaptiveExpandedKey = undefined;
                    }

                    return items;
                },

                _getRowIndicesForExpand: function(key) {
                    var rowIndices = this.callBase.apply(this, arguments),
                        lastRowIndex;

                    if(this.getController("adaptiveColumns").isAdaptiveDetailRowExpanded(key)) {
                        lastRowIndex = rowIndices[rowIndices.length - 1];
                        rowIndices.push(lastRowIndex + 1);
                    }

                    return rowIndices;
                },

                adaptiveExpandedKey: function(value) {
                    if(typeUtils.isDefined(value)) {
                        this._adaptiveExpandedKey = value;
                    } else {
                        return this._adaptiveExpandedKey;
                    }
                },

                toggleExpandAdaptiveDetailRow: function(key) {
                    var that = this;

                    var oldExpandRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, that._items);
                    var newExpandRowIndex = gridCoreUtils.getIndexByKey(key, that._items);

                    if(oldExpandRowIndex >= 0 && oldExpandRowIndex === newExpandRowIndex) {
                        key = undefined;
                        newExpandRowIndex = -1;
                    }

                    that._adaptiveExpandedKey = key;

                    if(oldExpandRowIndex >= 0) {
                        oldExpandRowIndex++;
                    }
                    if(newExpandRowIndex >= 0) {
                        newExpandRowIndex++;
                    }

                    that.updateItems({
                        changeType: "update",
                        rowIndices: [oldExpandRowIndex, newExpandRowIndex]
                    });
                },

                init: function() {
                    this.callBase();
                    this._adaptiveExpandedKey = undefined;
                }
            },
            editorFactory: {
                _getFocusCellSelector: function() {
                    return this.callBase() + ", .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content";
                },

                _getTooltipsSelector: function() {
                    return this.callBase() + ", .dx-field-item-content .dx-tooltip";
                }
            }

        }
    }
};
