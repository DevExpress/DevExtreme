"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    columnsView = require("./ui.grid_core.columns_view"),
    isDefined = require("../../core/utils/type").isDefined,
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    messageLocalization = require("../../localization/message");

var CELL_CONTENT_CLASS = "text-content",
    HEADERS_CLASS = "headers",
    NOWRAP_CLASS = "nowrap",
    HEADER_ROW_CLASS = "dx-header-row",
    COLUMN_LINES_CLASS = "dx-column-lines",
    CONTEXT_MENU_SORT_ASC_ICON = "context-menu-sort-asc",
    CONTEXT_MENU_SORT_DESC_ICON = "context-menu-sort-desc",
    CONTEXT_MENU_SORT_NONE_ICON = "context-menu-sort-none",
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    VISIBILITY_HIDDEN_CLASS = "dx-visibility-hidden",
    TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = "dx-text-content-alignment-",
    SORT_INDICATOR_CLASS = "dx-sort-indicator",
    HEADER_FILTER_INDICATOR_CLASS = "dx-header-filter-indicator";

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_showColumnHeaders
             * @publicName showColumnHeaders
             * @type boolean
             * @default true
             */
            showColumnHeaders: true,
            /**
            * @name GridBaseOptions_cellHintEnabled
            * @publicName cellHintEnabled
            * @type boolean
            * @default true
            */
            cellHintEnabled: true
        };
    },
    views: {
        columnHeadersView: columnsView.ColumnsView.inherit((function() {
            var createCellContent = function(that, $cell, options) {
                var showColumnLines,
                    $cellContent = $("<div>").addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));

                addCssClassesToCellContent(that, $cell, options.column, $cellContent);
                showColumnLines = that.option("showColumnLines");
                return $cellContent[(showColumnLines || options.column.alignment === "right") ? "appendTo" : "prependTo"]($cell);
            };

            var addCssClassesToCellContent = function(that, $cell, column, $cellContent) {
                var $indicatorElements = that._getIndicatorElements($cell, true),
                    $visibleIndicatorElements = that._getIndicatorElements($cell),
                    indicatorCount = $indicatorElements && $indicatorElements.length,
                    columnAlignment = that._getColumnAlignment(column.alignment);

                $cellContent = $cellContent || $cell.children("." + that.addWidgetPrefix(CELL_CONTENT_CLASS));

                $cellContent
                    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0)
                    .toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === "left" ? "right" : "left"), indicatorCount > 0 && column.alignment === "center")
                    .toggleClass(SORT_INDICATOR_CLASS, !!$visibleIndicatorElements.filter("." + that._getIndicatorClassName("sort")).length)
                    .toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter("." + that._getIndicatorClassName("headerFilter")).length);
            };

            return {
                _createTable: function() {
                    var $table = this.callBase.apply(this, arguments);

                    eventsEngine.on($table, "mousedown selectstart", this.createAction(function(e) {
                        var event = e.jQueryEvent;

                        if(event.shiftKey) {
                            event.preventDefault();
                        }
                    }));

                    return $table;
                },

                _getDefaultTemplate: function(column) {
                    var that = this,
                        template;

                    if(column.command) {
                        template = function(container, options) {
                            var column = options.column,
                                $container = $(container);

                            $container.html("&nbsp;");
                            $container.addClass(column.cssClass);
                        };
                    } else {
                        template = function($container, options) {
                            var $content = createCellContent(that, $container, options);
                            $content.text(column.caption);
                        };
                    }

                    return template;
                },

                _getHeaderTemplate: function(column) {
                    return !column.command && column.headerCellTemplate || { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
                },

                _processTemplate: function(template, options) {
                    var that = this,
                        resultTemplate,
                        column = options.column,
                        renderingTemplate = that.callBase(template);

                    if(renderingTemplate && column.headerCellTemplate) {
                        resultTemplate = {
                            render: function(options) {
                                var $content = createCellContent(that, options.container, options.model);
                                renderingTemplate.render(extend({}, options, { container: $content }));
                            }
                        };
                    } else {
                        resultTemplate = renderingTemplate;
                    }

                    return resultTemplate;
                },

                _handleDataChanged: function() {
                    if(this._isGroupingChanged || this._requireReady) {
                        this._isGroupingChanged = false;
                        this.render();
                    }
                },

                _renderCell: function($row, options) {
                    var $cell = this.callBase($row, options);

                    if(options.row.rowType === "header") {
                        $cell.addClass(CELL_FOCUS_DISABLED_CLASS);

                        if(!isDefined(options.column.command)) {
                            this.setAria("role", "columnheader", $cell);
                            this.setAria("label", options.column.caption + " " + messageLocalization.format("dxDataGrid-ariaColumn"), $cell);
                        }
                    }

                    return $cell;
                },

                _createRow: function(row) {
                    var $row = this.callBase(row).toggleClass(COLUMN_LINES_CLASS, this.option("showColumnLines"));

                    if(row.rowType === "header") {
                        $row.addClass(HEADER_ROW_CLASS);
                    }

                    return $row;
                },

                _renderCore: function() {
                    var that = this,
                        $container = that.element();

                    if(that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
                        return;
                    }

                    $container
                        .addClass(that.addWidgetPrefix(HEADERS_CLASS))
                        .toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option("wordWrapEnabled"))
                        .empty();


                    that._updateContent(that._renderTable());

                    that.callBase.apply(that, arguments);
                },

                _renderRows: function() {
                    var that = this;

                    if(that._dataController.isLoaded() || that._hasRowElements) {
                        that.callBase.apply(that, arguments);
                        that._hasRowElements = true;
                    }
                },

                _getRowVisibleColumns: function(rowIndex) {
                    return this._columnsController.getVisibleColumns(rowIndex);
                },

                _renderRow: function($table, options) {
                    options.columns = this._getRowVisibleColumns(options.row.rowIndex);
                    this.callBase($table, options);
                },

                _createCell: function(options) {
                    var column = options.column,
                        $cellElement = this.callBase.apply(this, arguments);

                    column.rowspan > 1 && $cellElement.attr("rowSpan", column.rowspan);

                    return $cellElement;
                },

                _getRows: function() {
                    var i,
                        result = [],
                        rowCount = this.getRowCount();

                    if(this.option("showColumnHeaders")) {
                        for(i = 0; i < rowCount; i++) {
                            result.push({ rowType: "header", rowIndex: i });
                        }
                    }

                    return result;
                },

                _getCellTemplate: function(options) {
                    if(options.rowType === "header") {
                        return this._getHeaderTemplate(options.column);
                    }
                },

                _columnOptionChanged: function(e) {
                    var changeTypes = e.changeTypes,
                        optionNames = e.optionNames;

                    if(changeTypes.grouping) {
                        this._isGroupingChanged = true;
                        return;
                    }

                    this.callBase(e);

                    if(optionNames.width || optionNames.visible) {
                        this.resizeCompleted.fire();
                    }
                },

                _isElementVisible: function(elementOptions) {
                    return elementOptions && elementOptions.visible;
                },

                _alignCaptionByCenter: function($cell) {
                    var $indicatorsContainer = this._getIndicatorContainer($cell, true);

                    if($indicatorsContainer && $indicatorsContainer.length) {
                        $indicatorsContainer.filter("." + VISIBILITY_HIDDEN_CLASS).remove();
                        $indicatorsContainer = this._getIndicatorContainer($cell);

                        $indicatorsContainer
                            .clone()
                            .addClass(VISIBILITY_HIDDEN_CLASS)
                            .css("float", "")
                            .insertBefore($cell.children("." + this.addWidgetPrefix(CELL_CONTENT_CLASS)));
                    }
                },

                _updateCell: function($cell, options) {
                    if(options.rowType === "header" && options.column.alignment === "center") {
                        this._alignCaptionByCenter($cell);
                    }

                    this.callBase.apply(this, arguments);
                },

                _updateIndicator: function($cell, column, indicatorName) {
                    var $indicatorElement = this.callBase.apply(this, arguments);

                    if(column.alignment === "center") {
                        this._alignCaptionByCenter($cell);
                    }

                    addCssClassesToCellContent(this, $cell, column);

                    return $indicatorElement;
                },

                _getIndicatorContainer: function($cell, returnAll) {
                    var $indicatorsContainer = this.callBase($cell);

                    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(":not(." + VISIBILITY_HIDDEN_CLASS + ")");
                },

                _isSortableElement: function() {
                    return true;
                },

                getHeadersRowHeight: function() {
                    var $tableElement = this._getTableElement(),
                        $headerRows = $tableElement && $tableElement.find("." + HEADER_ROW_CLASS);

                    if($headerRows && $headerRows.length) {
                        return $headerRows.first().height() * $headerRows.length;
                    }
                    return 0;
                },

                getHeaderElement: function(index) {
                    var columnElements = this.getColumnElements();

                    return columnElements && columnElements.eq(index);
                },

                getColumnElements: function(index, bandColumnIndex) {
                    var that = this,
                        rowIndex,
                        result,
                        $cellElement,
                        visibleColumns,
                        columnsController = that._columnsController,
                        rowCount = that.getRowCount();

                    if(that.option("showColumnHeaders")) {
                        if(rowCount > 1 && (!isDefined(index) || isDefined(bandColumnIndex))) {
                            result = [];
                            visibleColumns = isDefined(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();

                            each(visibleColumns, function(_, column) {
                                rowIndex = isDefined(index) ? index : columnsController.getRowIndex(column.index);
                                $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
                                $cellElement && result.push($cellElement.get(0));
                            });

                            return $(result);
                        } else if(!index || index < rowCount) {
                            return that.getCellElements(index || 0);
                        }
                    }
                },

                getColumnWidths: function() {
                    var $columnElements = this.getColumnElements();

                    if($columnElements && $columnElements.length) {
                        return this._getWidths($columnElements);
                    }

                    return this.callBase.apply(this, arguments);
                },

                allowDragging: function(column, sourceLocation, draggingPanels) {
                    var i,
                        rowIndex = column && this._columnsController.getRowIndex(column.index),
                        columns = this.getColumns(rowIndex === 0 ? 0 : null),
                        draggableColumnCount = 0,
                        draggingPanel,
                        allowDrag = function(column) {
                            return column.allowReordering || column.allowGrouping || column.allowHiding;
                        };

                    for(i = 0; i < columns.length; i++) {
                        if(allowDrag(columns[i])) {
                            draggableColumnCount++;
                        }
                    }

                    if(draggableColumnCount <= 1) {
                        return false;
                    } else if(!draggingPanels) {
                        return (this.option("allowColumnReordering") || this._columnsController.isColumnOptionUsed("allowReordering")) && column && column.allowReordering;
                    }

                    for(i = 0; i < draggingPanels.length; i++) {
                        draggingPanel = draggingPanels[i];
                        if(draggingPanel && draggingPanel.allowDragging(column, sourceLocation)) {
                            return true;
                        }
                    }

                    return false;
                },

                getBoundingRect: function() {
                    var that = this,
                        offset,
                        $columnElements = that.getColumnElements();

                    if($columnElements && $columnElements.length) {
                        offset = that._getTableElement().offset();
                        return {
                            top: offset.top
                        };
                    }
                    return null;
                },

                getName: function() {
                    return "headers";
                },

                getColumnCount: function() {
                    var $columnElements = this.getColumnElements();

                    return $columnElements ? $columnElements.length : 0;
                },

                isVisible: function() {
                    return this.option("showColumnHeaders");
                },

                optionChanged: function(args) {
                    var that = this;

                    switch(args.name) {
                        case "showColumnHeaders":
                        case "wordWrapEnabled":
                        case "showColumnLines":
                            that._invalidate(true, true);
                            args.handled = true;
                            break;
                        default:
                            that.callBase(args);
                    }
                },

                getHeight: function() {
                    return this.getElementHeight();
                },

                getContextMenuItems: function(options) {
                    var that = this,
                        column = options.column,
                        onItemClick,
                        sortingOptions;

                    if(options.row && options.row.rowType === "header") {
                        sortingOptions = that.option("sorting");

                        if(sortingOptions && sortingOptions.mode !== "none" && column && column.allowSorting) {
                            onItemClick = function(params) {
                                setTimeout(function() {
                                    that._columnsController.changeSortOrder(column.index, params.itemData.value);
                                });
                            };
                            return [
                                { text: sortingOptions.ascendingText, value: "asc", disabled: column.sortOrder === "asc", icon: CONTEXT_MENU_SORT_ASC_ICON, onItemClick: onItemClick },
                                { text: sortingOptions.descendingText, value: "desc", disabled: column.sortOrder === "desc", icon: CONTEXT_MENU_SORT_DESC_ICON, onItemClick: onItemClick },
                                { text: sortingOptions.clearText, value: "none", disabled: !column.sortOrder, icon: CONTEXT_MENU_SORT_NONE_ICON, onItemClick: onItemClick }
                            ];
                        }
                    }
                },

                getRowCount: function() {
                    return this._columnsController && this._columnsController.getRowCount();
                },

                setRowsOpacity: function(columnIndex, value, rowIndex) {
                    var that = this,
                        i,
                        columnElements,
                        rowCount = that.getRowCount(),
                        columns = that._columnsController.getColumns(),
                        column = columns && columns[columnIndex],
                        columnID = column && column.isBand && column.index,
                        setColumnOpacity = function(index, column) {
                            if(column.ownerBand === columnID) {
                                columnElements.eq(index).css({ opacity: value });

                                if(column.isBand) {
                                    that.setRowsOpacity(column.index, value, i + 1);
                                }
                            }
                        };

                    if(isDefined(columnID)) {
                        rowIndex = rowIndex || 0;
                        for(i = rowIndex; i < rowCount; i++) {
                            columnElements = that.getCellElements(i);
                            each(that.getColumns(i), setColumnOpacity);
                        }
                    }
                }
            };
        })())
    }
};
