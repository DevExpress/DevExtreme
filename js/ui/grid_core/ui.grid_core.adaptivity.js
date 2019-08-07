import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";
import clickEvent from "../../events/click";
import typeUtils from "../../core/utils/type";
import browser from "../../core/utils/browser";
import Guid from "../../core/guid";
import modules from "./ui.grid_core.modules";
import Form from "../form";
import gridCoreUtils from "./ui.grid_core.utils";
import themes from "../themes";
import { getWindow } from "../../core/utils/window";
import { equalByValue } from "../../core/utils/common";
import { each } from "../../core/utils/iterator";
import { extend } from "../../core/utils/extend";

var COLUMN_HEADERS_VIEW = "columnHeadersView",
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
    LAST_DATA_CELL_CLASS = "dx-last-data-cell",
    ADAPTIVE_COLUMN_NAME = "adaptive",
    EDIT_MODE_BATCH = "batch",
    EDIT_MODE_ROW = "row",
    EDIT_MODE_FORM = "form",
    EDIT_MODE_POPUP = "popup",
    REVERT_TOOLTIP_CLASS = "revert-tooltip";

function getColumnId(that, column) {
    return that._columnsController.getColumnId(column);
}

function getDataCellElements($row) {
    return $row.find("td:not(.dx-datagrid-hidden-column):not([class*='dx-command-'])");
}

function adaptiveCellTemplate(container, options) {
    var $adaptiveColumnButton,
        $container = $(container),
        adaptiveColumnsController = options.component.getController("adaptiveColumns");

    if(options.rowType === "data") {
        $adaptiveColumnButton = $("<span>").addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
        eventsEngine.on($adaptiveColumnButton, eventUtils.addNamespace(clickEvent.name, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(function() {
            adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
        }));
        $adaptiveColumnButton.appendTo($container);
    } else {
        gridCoreUtils.setEmptyText($container);
    }
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
            focusAction = that.createAction(function() {
                eventsEngine.trigger($container, clickEvent.name);
            }),
            container,
            value = column.calculateCellValue(cellOptions.data),
            displayValue = gridCoreUtils.getDisplayValue(column, value, cellOptions.data, cellOptions.rowType),
            text = gridCoreUtils.formatValue(displayValue, column);

        if(column.allowEditing && that.option("useKeyboard")) {
            $container.attr("tabIndex", that.option("tabIndex"));
            eventsEngine.off($container, "focus", focusAction);
            eventsEngine.on($container, "focus", focusAction);
        }

        if(column.cellTemplate) {
            var templateOptions = extend({}, cellOptions, { value: value, displayValue: displayValue, text: text, column: column });
            that._rowsView.renderTemplate($container, column.cellTemplate, templateOptions, !!$container.closest(getWindow().document).length);
        } else {
            container = $container.get(0);
            if(column.encodeHtml) {
                container.textContent = text;
            } else {
                container.innerHTML = text;
            }

            $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
            if(!typeUtils.isDefined(text) || text === "") {
                $container.html("&nbsp;");
            }

            if(!that._isRowEditMode()) {
                if(that._isItemModified(item, cellOptions)) {
                    $container.addClass(FORM_ITEM_MODIFIED);
                }
            }
        }

        that.getView("rowsView")._cellPrepared($container, cellOptions);
    },

    _getTemplate: function(item, cellOptions) {
        var that = this,
            column = item.column,
            editingController = this.getController("editing");

        return function(options, container) {
            var isItemEdited = that._isItemEdited(item),
                $container = $(container),
                columnIndex = that._columnsController.getVisibleIndex(column.visibleIndex),
                templateOptions = extend({}, cellOptions);

            templateOptions.value = cellOptions.row.values[columnIndex];

            if(isItemEdited || column.showEditorAlways) {
                editingController.renderFormEditTemplate(templateOptions, item, options.component, $container, !isItemEdited);
            } else {
                templateOptions.column = column;
                templateOptions.columnIndex = columnIndex;

                templateOptions.watch && templateOptions.watch(function() {
                    return templateOptions.column.selector(templateOptions.data);
                }, function(newValue) {
                    templateOptions.value = newValue;
                    $container.contents().remove();
                    that._renderFormViewTemplate(item, templateOptions, $container);
                });

                that._renderFormViewTemplate(item, templateOptions, $container);
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

    _isColumnHidden: function(column) {
        return this._hiddenColumns.filter(function(hiddenColumn) {
            return hiddenColumn.index === column.index;
        }).length > 0;
    },

    _getAverageColumnsWidth: function(containerWidth, columns, columnsCanFit) {
        var that = this,
            fixedColumnsWidth = 0,
            columnsWithoutFixedWidthCount = 0;

        columns.forEach(function(column) {
            if(!that._isColumnHidden(column)) {
                var width = column.width;
                if(typeUtils.isDefined(width) && !isNaN(parseFloat(width))) {
                    fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
                        visibleIndex: column.visibleIndex,
                        columnsCount: columns.length,
                        columnsCanFit: columnsCanFit,
                        bestFitWidth: column.bestFitWidth,
                        columnWidth: width,
                        containerWidth: containerWidth
                    }) : parseFloat(width);
                } else {
                    columnsWithoutFixedWidthCount++;
                }
            }
        });
        return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
    },

    _calculateColumnWidth: function(column, containerWidth, contentColumns, columnsCanFit) {
        var columnId = getColumnId(this, column),
            widthOption = this._columnsController.columnOption(columnId, "width"),
            bestFitWidth = this._columnsController.columnOption(columnId, "bestFitWidth"),
            columnsCount = contentColumns.length,
            colWidth;

        if(widthOption && widthOption !== "auto") {
            if(this._isPercentWidth(widthOption)) {
                colWidth = this._calculatePercentWidth({
                    visibleIndex: column.visibleIndex,
                    columnsCount: columnsCount,
                    columnsCanFit: columnsCanFit,
                    bestFitWidth: bestFitWidth,
                    columnWidth: widthOption,
                    containerWidth: containerWidth
                });
            } else {
                return widthOption;
            }
        } else {
            var columnAutoWidth = this.option("columnAutoWidth");
            colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
        }

        return colWidth;
    },

    _calculatePercentWidth: function(options) {
        var columnFitted = (options.visibleIndex < options.columnsCount - 1) && options.columnsCanFit,
            partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100,
            resultWidth = options.columnsCanFit && (partialWidth < options.bestFitWidth) ? options.bestFitWidth : partialWidth;

        return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
    },

    _getNotTruncatedColumnWidth: function(column, containerWidth, contentColumns, columnsCanFit) {
        var columnId = getColumnId(this, column),
            widthOption = this._columnsController.columnOption(columnId, "width"),
            bestFitWidth = this._columnsController.columnOption(columnId, "bestFitWidth"),
            colWidth;

        if(widthOption && widthOption !== "auto" && !this._isPercentWidth(widthOption)) {
            return widthOption;
        }

        colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);

        return colWidth < bestFitWidth ? null : colWidth;
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

        each(columns, function(index, column) {
            if(column.index < 0 || column.command) {
                colWidth += that._columnsController.columnOption(getColumnId(that, column), "bestFitWidth") || 0;
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
        each(hiddenColumns, function(_, column) {
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
        return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS);
    },

    _addCssClassToColumn: function(cssClassName, visibleIndex) {
        var that = this;
        COLUMN_VIEWS.forEach(function(viewName) {
            var view = that.getView(viewName);
            view && that._addCssClassToViewColumn(view, cssClassName, visibleIndex);
        });
    },

    _addCssClassToViewColumn: function(view, cssClassName, visibleIndex) {
        var viewName = view.name,
            rowsCount,
            rowIndex,
            $cellElement,
            currentVisibleIndex,
            column = this._columnsController.getVisibleColumns()[visibleIndex],
            editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();

        if(view && view.isVisible() && column) {
            rowsCount = view.getRowsCount();
            var $rowElements = view._getRowElements();
            for(rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
                if(rowIndex !== editFormRowIndex || viewName !== ROWS_VIEW) {
                    currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
                    if(currentVisibleIndex >= 0) {
                        $cellElement = $rowElements.eq(rowIndex).children().eq(currentVisibleIndex);
                        this._isCellValid($cellElement) && $cellElement.addClass(cssClassName);
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
                $rootElement = that.component.$element(),
                rootElementWidth = $rootElement.width() - that._getCommandColumnsWidth(),
                getVisibleContentColumns = function() {
                    return visibleColumns.filter(item => !item.command && this._hiddenColumns.filter(i => i.dataField === item.dataField).length === 0);
                }.bind(this),
                visibleContentColumns = getVisibleContentColumns(),
                contentColumnsCount = visibleContentColumns.length,
                columnsCanFit,
                i,
                hasHiddenColumns,
                needHideColumn;

            do {
                needHideColumn = false;
                totalWidth = 0;

                percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);

                columnsCanFit = percentWidths < 100 && percentWidths !== 0;
                for(i = 0; i < visibleColumns.length; i++) {
                    visibleColumn = visibleColumns[i];

                    var columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit),
                        columnId = getColumnId(that, visibleColumn),
                        widthOption = that._columnsController.columnOption(columnId, "width"),
                        minWidth = that._columnsController.columnOption(columnId, "minWidth"),
                        columnBestFitWidth = that._columnsController.columnOption(columnId, "bestFitWidth");

                    if(resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
                        hasHiddenColumns = true;
                        continue;
                    }
                    if(!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
                        needHideColumn = true;
                        break;
                    }

                    if(!widthOption || widthOption === "auto") {
                        columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
                    }

                    if(visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
                        totalWidth += columnWidth;
                    }
                }

                needHideColumn = needHideColumn || totalWidth > $rootElement.width();

                if(needHideColumn) {
                    var column = hiddenQueue.pop(),
                        visibleIndex = that._columnsController.getVisibleIndex(column.index);

                    rootElementWidth += that._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);

                    that._addCssClassToColumn(that.addWidgetPrefix(HIDDEN_COLUMN_CLASS), visibleIndex);
                    resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
                    this._hiddenColumns.push(column);
                    visibleContentColumns = getVisibleContentColumns();
                }
            }
            while(needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);

            if(contentColumnsCount === visibleContentColumns.length) {
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

    toggleExpandAdaptiveDetailRow: function(key, alwaysExpanded) {
        if(!(this.isFormEditMode() && this._editingController.isEditing())) {
            this.getController("data").toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
        }
    },

    createFormByHiddenColumns: function(container, options) {
        var that = this,
            $container = $(container),
            userFormOptions = {
                items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
                formID: "dx-" + new Guid()
            },
            defaultFormOptions = themes.isMaterial() ? { colCount: 2 } : {};

        this.executeAction("onAdaptiveDetailRowPreparing", { formOptions: userFormOptions });

        that._$itemContents = null;

        that._form = that._createComponent($("<div>").appendTo($container), Form, extend(defaultFormOptions, userFormOptions, {
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
                return column.visible && !column.type && !column.fixed && !(typeUtils.isDefined(column.groupIndex) && column.groupIndex >= 0);
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
            type: ADAPTIVE_COLUMN_NAME,
            command: ADAPTIVE_COLUMN_NAME,
            visible: true,
            adaptiveHidden: true,
            cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
            alignment: "center",
            width: "auto",
            cellTemplate: adaptiveCellTemplate,
            fixedPosition: "right"
        });

        that._columnsController.columnsChanged.add(function() {
            var isAdaptiveVisible = !!that.updateHidingQueue(that._columnsController.getColumns()).length;
            that._columnsController.columnOption("command:adaptive", "adaptiveHidden", !isAdaptiveVisible, true);
        });
        that._editingController = that.getController("editing");
        that._hidingColumnsQueue = [];
        that._hiddenColumns = [];
        that.createAction("onAdaptiveDetailRowPreparing");

        that.callBase();
    },

    optionChanged: function(args) {
        if(args.name === "columnHidingEnabled") {
            this._columnsController.columnOption("command:adaptive", "adaptiveHidden", !args.value);
        }

        this.callBase(args);
    },

    publicMethods: function() {
        return ["isAdaptiveDetailRowExpanded", "expandAdaptiveDetailRow", "collapseAdaptiveDetailRow"];
    },

    /**
     * @name GridBaseMethods.isAdaptiveDetailRowExpanded
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     * @return boolean
     */
    isAdaptiveDetailRowExpanded: function(key) {
        return this._dataController.adaptiveExpandedKey() && equalByValue(this._dataController.adaptiveExpandedKey(), key);
    },

    /**
    * @name GridBaseMethods.expandAdaptiveDetailRow
    * @publicName expandAdaptiveDetailRow(key)
    * @param1 key:any
    */
    expandAdaptiveDetailRow: function(key) {
        if(!this.hasAdaptiveDetailRowExpanded()) {
            this.toggleExpandAdaptiveDetailRow(key);
        }
    },

    /**
    * @name GridBaseMethods.collapseAdaptiveDetailRow
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
            * @name GridBaseOptions.columnHidingEnabled
            * @type boolean
            * @default false
            */
            columnHidingEnabled: false,
            /**
            * @name GridBaseOptions.onAdaptiveDetailRowPreparing
            * @extends Action
            * @type function(e)
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

                    if(options.rowType === ADAPTIVE_ROW_TYPE && column.command === "detail") {
                        return function(container, options) {
                            that._adaptiveColumnsController.createFormByHiddenColumns($(container), options);
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

                _renderCells: function($row, options) {
                    this.callBase($row, options);

                    var hidingColumnsQueueLength = this._adaptiveColumnsController.getHidingColumnsQueue().length,
                        hiddenColumnsLength = this._adaptiveColumnsController.getHiddenColumns().length;

                    if(hidingColumnsQueueLength && !hiddenColumnsLength) {
                        getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
                    }
                },

                _getColumnIndexByElementCore: function($element) {
                    var $itemContent = $element.closest("." + FORM_ITEM_CONTENT_CLASS);
                    if($itemContent.length && $itemContent.closest(this.component.$element()).length) {
                        var formItem = $itemContent.length ? $itemContent.first().data("dx-form-item") : null;
                        return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
                    } else {
                        return this.callBase($element);
                    }
                },

                _cellPrepared: function($cell, options) {
                    this.callBase.apply(this, arguments);

                    if(options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
                        $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
                    }
                },

                _getCellElement: function(rowIndex, columnIdentifier) {
                    var item = this._dataController.items()[rowIndex];

                    if(item && item.rowType === ADAPTIVE_ROW_TYPE) {
                        return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
                    } else {
                        return this.callBase(rowIndex, columnIdentifier);
                    }
                },

                getContextMenuItems: function(options) {
                    if(options.row && options.row.rowType === "detailAdaptive") {
                        let view = this.component.getView("columnHeadersView");
                        let formItem = $(options.targetElement).closest(".dx-field-item-label").next().data("dx-form-item");
                        options.column = formItem ? formItem.column : options.column;
                        return view.getContextMenuItems && view.getContextMenuItems(options);
                    }
                    return this.callBase && this.callBase(options);
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
                        column = columns[point.columnIndex - 1] || {},
                        hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;

                    return result || hasAdaptiveHiddenWidth;
                }
            },
            editing: {
                _isRowEditMode: function() {
                    return this.getEditMode() === EDIT_MODE_ROW;
                },

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
                        this._adaptiveController.toggleExpandAdaptiveDetailRow(options.key, this.isRowEditMode());
                        this._isForceRowAdaptiveExpand = true;
                    }
                },

                _collapseAdaptiveDetailRow: function() {
                    if(this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
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
                    if(this._isRowEditMode() && this._adaptiveController.hasHiddenColumns()
                        && this.getController("validating").validate(true)) {
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

                deleteRow: function(rowIndex) {
                    var rowKey = this._dataController.getKeyByRowIndex(rowIndex);

                    if(this.getEditMode() === EDIT_MODE_BATCH && this._adaptiveController.isAdaptiveDetailRowExpanded(rowKey)) {
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
                _needBestFit: function() {
                    return this.callBase() || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
                },

                _updateScrollableForIE: function() {
                    var that = this;

                    if(browser.msie && parseInt(browser.version) <= 11) {
                        this._updateScrollableTimeoutID = setTimeout(function() {
                            that.getView("rowsView")._updateScrollable();
                        });
                    }
                },

                _correctColumnWidths: function(resultWidths, visibleColumns) {
                    var adaptiveController = this._adaptiveColumnsController,
                        columnAutoWidth = this.option("columnAutoWidth"),
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

                    if(columnAutoWidth && hidingColumnsQueue.length && !hiddenColumns.length) {
                        this._updateScrollableForIE();
                    }

                    return this.callBase.apply(this, arguments);
                },

                _toggleBestFitMode: function(isBestFit) {
                    isBestFit && this._adaptiveColumnsController._removeCssClassesFromColumns();
                    this.callBase(isBestFit);
                },

                _needStretch: function() {
                    var adaptiveColumnsController = this._adaptiveColumnsController;
                    return this.callBase.apply(this, arguments) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
                },

                init: function() {
                    this._adaptiveColumnsController = this.getController("adaptiveColumns");
                    this.callBase();
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._updateScrollableTimeoutID);
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
                    } else if(changeType === "refresh") {
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

                toggleExpandAdaptiveDetailRow: function(key, alwaysExpanded) {
                    var that = this;

                    var oldExpandRowIndex = gridCoreUtils.getIndexByKey(that._adaptiveExpandedKey, that._items);
                    var newExpandRowIndex = gridCoreUtils.getIndexByKey(key, that._items);

                    if(oldExpandRowIndex >= 0 && oldExpandRowIndex === newExpandRowIndex && !alwaysExpanded) {
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
                    return this.callBase() + ", .dx-field-item-content ." + this.addWidgetPrefix(REVERT_TOOLTIP_CLASS);
                }
            },
            columns: {
                _isColumnVisible: function(column) {
                    return this.callBase(column) && !column.adaptiveHidden;
                }
            },
            keyboardNavigation: {
                _isCellValid: function($cell) {
                    return this.callBase($cell) && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
                },

                _processNextCellInMasterDetail: function($nextCell) {
                    this.callBase($nextCell);

                    if(!this._isInsideEditForm($nextCell) && $nextCell) {
                        var focusHandler = function() {
                            eventsEngine.off($nextCell, "focus", focusHandler);
                            eventsEngine.trigger($nextCell, "dxclick");
                        };
                        eventsEngine.on($nextCell, "focus", focusHandler);
                    }
                },

                _handleTabKeyOnMasterDetailCell: function(eventTarget, direction) {
                    var result = this.callBase(eventTarget, direction),
                        $currentCell = this._getFocusedCell();

                    if(!result && $currentCell) {
                        var $row = $currentCell.parent(),
                            $dataCells = getDataCellElements($row),
                            $targetCell = direction === "next" ? $dataCells.last() : $dataCells.first(),
                            rowIndex = $row.get(0).rowIndex,
                            adaptiveController = this._adaptiveController,
                            key = this._dataController.getKeyByRowIndex(direction === "next" ? rowIndex : rowIndex - 1),
                            isCellElementsEquals = $currentCell && $targetCell && $currentCell.get(0) === $targetCell.get(0);

                        return adaptiveController.isAdaptiveDetailRowExpanded(key) && isCellElementsEquals;
                    }
                    return result;
                },

                init: function() {
                    this.callBase();
                    this._adaptiveController = this.getController("adaptiveColumns");
                }
            }
        }
    }
};
