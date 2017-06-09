"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    stringUtils = require("../../core/utils/string"),
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    compileGetter = require("../../core/utils/data").compileGetter,
    gridCoreUtils = require("./ui.grid_core.utils"),
    columnsView = require("./ui.grid_core.columns_view"),
    Scrollable = require("../scroll_view/ui.scrollable"),
    removeEvent = require("../../core/remove_event"),
    messageLocalization = require("../../localization/message"),
    isDefined = commonUtils.isDefined;

var ROWS_VIEW_CLASS = "rowsview",
    CONTENT_CLASS = "content",
    NOWRAP_CLASS = "nowrap",
    GROUP_ROW_CLASS = "dx-group-row",
    GROUP_CELL_CLASS = "dx-group-cell",
    DATA_ROW_CLASS = "dx-data-row",
    FREE_SPACE_CLASS = "dx-freespace-row",
    ROW_LINES_CLASS = "dx-row-lines",
    COLUMN_LINES_CLASS = "dx-column-lines",
    ROW_ALTERNATION_CLASS = "dx-row-alt",
    LAST_ROW_BORDER = "dx-last-row-border",

    LOADPANEL_HIDE_TIMEOUT = 200;

module.exports = {
    defaultOptions: function() {
        return {
            hoverStateEnabled: false,
            /**
            * @name dxDataGridOptions_onCellHoverChanged
            * @publicName onCellHoverChanged
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 eventType:string
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 value:any
            * @type_function_param1_field8 text:string
            * @type_function_param1_field9 displayValue:string
            * @type_function_param1_field10 columnIndex:number
            * @type_function_param1_field11 rowIndex:number
            * @type_function_param1_field12 column:object
            * @type_function_param1_field13 rowType:string
            * @type_function_param1_field14 cellElement:jQuery
            * @type_function_param1_field15 row:dxDataGridRowObject
            * @extends Action
            * @action
            */
            /**
            * @name dxTreeListOptions_onCellHoverChanged
            * @publicName onCellHoverChanged
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 eventType:string
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 value:any
            * @type_function_param1_field8 text:string
            * @type_function_param1_field9 displayValue:string
            * @type_function_param1_field10 columnIndex:number
            * @type_function_param1_field11 rowIndex:number
            * @type_function_param1_field12 column:object
            * @type_function_param1_field13 rowType:string
            * @type_function_param1_field14 cellElement:jQuery
            * @type_function_param1_field15 row:dxTreeListRowObject
            * @extends Action
            * @action
            */

            /**
             * @name GridBaseOptions_scrolling
             * @publicName scrolling
             * @type object
             */
            /**
             * @name dxDataGridOptions_scrolling
             * @publicName scrolling
             * @type object
             */
            /**
             * @name dxTreeListOptions_scrolling
             * @publicName scrolling
             * @type object
             */
            scrolling: {
                /**
                 * @name GridBaseOptions_scrolling_useNative
                 * @publicName useNative
                 * @type string|boolean
                 * @default "auto"
                 */
                useNative: "auto"
                /**
                * @name GridBaseOptions_scrolling_showScrollbar
                * @publicName showScrollbar
                * @type string
                * @acceptValues 'onScroll'|'onHover'|'always'|'never'
                * @default 'onScroll'
                */
                /**
                * @name GridBaseOptions_scrolling_scrollByContent
                * @publicName scrollByContent
                * @type boolean
                * @default true
                */
                /**
                * @name GridBaseOptions_scrolling_scrollByThumb
                * @publicName scrollByThumb
                * @type boolean
                * @default false
                */
            },

            /**
             * @name GridBaseOptions_loadPanel
             * @publicName loadPanel
             * @type object
             */
            loadPanel: {
                /**
                 * @name GridBaseOptions_loadPanel_enabled
                 * @publicName enabled
                 * @type string|boolean
                 * @default "auto"
                 * @acceptValues "auto" | true | false
                 */
                enabled: "auto",
                /**
                 * @name GridBaseOptions_loadPanel_text
                 * @publicName text
                 * @type string
                 * @default "Loading..."
                 */
                text: messageLocalization.format("Loading"),
                /**
                 * @name GridBaseOptions_loadPanel_width
                 * @publicName width
                 * @type number
                 * @default 200
                 */
                width: 200,
                /**
                 * @name GridBaseOptions_loadPanel_height
                 * @publicName height
                 * @type number
                 * @default 90
                 */
                height: 90,
                /**
                * @name GridBaseOptions_loadPanel_showIndicator
                * @publicName showIndicator
                * @type boolean
                * @default true
                */
                showIndicator: true,

                /**
                * @name GridBaseOptions_loadPanel_indicatorSrc
                * @publicName indicatorSrc
                * @type string
                * @default ""
                */
                indicatorSrc: "",

                /**
                * @name GridBaseOptions_loadPanel_showPane
                * @publicName showPane
                * @type boolean
                * @default true
                */
                showPane: true
            },
            /**
            * @name dxDataGridOptions_onRowClick
            * @publicName onRowClick
            * @type function(e)|string
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery-event object
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 values:array
            * @type_function_param1_field8 columns:array
            * @type_function_param1_field9 rowIndex:number
            * @type_function_param1_field10 rowType:string
            * @type_function_param1_field11 isSelected:boolean
            * @type_function_param1_field12 isExpanded:boolean
            * @type_function_param1_field13 groupIndex:number
            * @type_function_param1_field14 rowElement:jQuery
            * @type_function_param1_field15 handled:boolean
            * @extends Action
            * @action
            */
            /**
            * @name dxTreeListOptions_onRowClick
            * @publicName onRowClick
            * @type function(e)|string
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery-event object
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 values:array
            * @type_function_param1_field8 columns:array
            * @type_function_param1_field9 rowIndex:number
            * @type_function_param1_field10 rowType:string
            * @type_function_param1_field11 isSelected:boolean
            * @type_function_param1_field12 isExpanded:boolean
            * @type_function_param1_field13 rowElement:jQuery
            * @type_function_param1_field14 handled:boolean
            * @extends Action
            * @action
            */
            /**
            * @name dxDataGridOptions_onCellClick
            * @publicName onCellClick
            * @type function(e)|string
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery-event object
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 value:any
            * @type_function_param1_field8 displayValue:string
            * @type_function_param1_field9 text:string
            * @type_function_param1_field10 columnIndex:number
            * @type_function_param1_field11 column:object
            * @type_function_param1_field12 rowIndex:number
            * @type_function_param1_field13 rowType:string
            * @type_function_param1_field14 cellElement:jQuery
            * @type_function_param1_field15 row:dxDataGridRowObject
            * @extends Action
            * @action
            */
            /**
            * @name dxTreeListOptions_onCellClick
            * @publicName onCellClick
            * @type function(e)|string
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery-event object
            * @type_function_param1_field5 data:object
            * @type_function_param1_field6 key:any
            * @type_function_param1_field7 value:any
            * @type_function_param1_field8 displayValue:string
            * @type_function_param1_field9 text:string
            * @type_function_param1_field10 columnIndex:number
            * @type_function_param1_field11 column:object
            * @type_function_param1_field12 rowIndex:number
            * @type_function_param1_field13 rowType:string
            * @type_function_param1_field14 cellElement:jQuery
            * @type_function_param1_field15 row:dxTreeListRowObject
            * @extends Action
            * @action
            */
            /**
             * @name dxDataGridOptions_rowTemplate
             * @publicName rowTemplate
             * @type template
             * @type_function_param1 rowElement:jQuery
             * @type_function_param2 rowInfo:object
             */
            rowTemplate: null,
            /**
             * @name GridBaseOptions_columnAutoWidth
             * @publicName columnAutoWidth
             * @type boolean
             * @default false
             */
            columnAutoWidth: false,
            /**
             * @name GridBaseOptions_noDataText
             * @publicName noDataText
             * @type string
             * @default "No data"
             */
            noDataText: messageLocalization.format("dxDataGrid-noDataText"),
            /**
             * @name GridBaseOptions_wordWrapEnabled
             * @publicName wordWrapEnabled
             * @type boolean
             * @default false
             */
            wordWrapEnabled: false,
            /**
             * @name GridBaseOptions_showColumnLines
             * @publicName showColumnLines
             * @type boolean
             * @default true
             */
            showColumnLines: true,
            /**
             * @name GridBaseOptions_showRowLines
             * @publicName showRowLines
             * @type boolean
             * @default false
             */
            showRowLines: false,
            /**
             * @name GridBaseOptions_rowAlternationEnabled
             * @publicName rowAlternationEnabled
             * @type boolean
             * @default false
             */
            rowAlternationEnabled: false,
            /**
             * @name dxDataGridOptions_onCellPrepared
             * @publicName onCellPrepared
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 value:any
             * @type_function_param1_field7 displayValue:string
             * @type_function_param1_field8 text:string
             * @type_function_param1_field9 columnIndex:number
             * @type_function_param1_field10 column:object
             * @type_function_param1_field11 rowIndex:number
             * @type_function_param1_field12 rowType:string
             * @type_function_param1_field13 row:dxDataGridRowObject
             * @type_function_param1_field14 isSelected:boolean
             * @type_function_param1_field15 isExpanded:boolean
             * @type_function_param1_field16 cellElement:jQuery
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions_onCellPrepared
             * @publicName onCellPrepared
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 value:any
             * @type_function_param1_field7 displayValue:string
             * @type_function_param1_field8 text:string
             * @type_function_param1_field9 columnIndex:number
             * @type_function_param1_field10 column:object
             * @type_function_param1_field11 rowIndex:number
             * @type_function_param1_field12 rowType:string
             * @type_function_param1_field13 row:dxTreeListRowObject
             * @type_function_param1_field14 isSelected:boolean
             * @type_function_param1_field15 isExpanded:boolean
             * @type_function_param1_field16 cellElement:jQuery
             * @extends Action
             * @action
             */
            /**
             * @name dxDataGridOptions_onRowPrepared
             * @publicName onRowPrepared
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 values:any
             * @type_function_param1_field7 columns:array
             * @type_function_param1_field8 rowIndex:number
             * @type_function_param1_field9 rowType:string
             * @type_function_param1_field10 groupIndex:number
             * @type_function_param1_field11 isSelected:boolean
             * @type_function_param1_field12 isExpanded:boolean
             * @type_function_param1_field13 rowElement:jQuery
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions_onRowPrepared
             * @publicName onRowPrepared
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 values:any
             * @type_function_param1_field7 columns:array
             * @type_function_param1_field8 rowIndex:number
             * @type_function_param1_field9 rowType:string
             * @type_function_param1_field10 isSelected:boolean
             * @type_function_param1_field11 isExpanded:boolean
             * @type_function_param1_field12 rowElement:jQuery
             * @extends Action
             * @action
             */
            activeStateEnabled: false,
            /**
             * @name GridBaseOptions_twoWayBindingEnabled
             * @publicName twoWayBindingEnabled
             * @type boolean
             * @default true
             */
            twoWayBindingEnabled: true
        };
    },
    views: {
        rowsView: columnsView.ColumnsView.inherit((function() {
            var appendFreeSpaceRowTemplate = {
                render: function(options) {
                    var $tbody = options.container.find("tbody");

                    if($tbody.length) {
                        $tbody.last().append(options.content);
                    } else {
                        options.container.append(options.content);
                    }
                }
            };

            return {
                _getDefaultTemplate: function(column) {
                    switch(column.command) {
                        case "empty":
                            return function(container) {
                                container.html("&nbsp;");
                            };
                        default:
                            return function($container, options) {
                                var isDataTextEmpty = stringUtils.isEmpty(options.text) && options.rowType === "data",
                                    text = isDataTextEmpty ? "&nbsp;" : options.text,
                                    container = $container.get(0);

                                if(column.encodeHtml && !isDataTextEmpty) {
                                    container.textContent = text;
                                } else {
                                    container.innerHTML = text;
                                }
                            };
                    }
                },

                _getDefaultGroupTemplate: function(column) {
                    var that = this,
                        summaryTexts = that.option("summary.texts");

                    return function($container, options) {
                        var data = options.data,
                            text = options.column.caption + ": " + options.text,
                            container = $container.get(0);

                        if(options.summaryItems && options.summaryItems.length) {
                            text += " " + gridCoreUtils.getGroupRowSummaryText(options.summaryItems, summaryTexts);
                        }

                        if(data) {
                            if(options.groupContinuedMessage && options.groupContinuesMessage) {
                                text += " (" + options.groupContinuedMessage + ". " + options.groupContinuesMessage + ")";
                            } else if(options.groupContinuesMessage) {
                                text += " (" + options.groupContinuesMessage + ")";
                            } else if(options.groupContinuedMessage) {
                                text += " (" + options.groupContinuedMessage + ")";
                            }
                        }

                        $container.addClass(GROUP_CELL_CLASS);

                        if(column.encodeHtml) {
                            container.textContent = text;
                        } else {
                            container.innerHTML = text;
                        }
                    };
                },

                _update: function() { },

                _getCellTemplate: function(options) {
                    var that = this,
                        column = options.column,
                        template;

                    if(options.rowType === "group" && isDefined(column.groupIndex) && !column.showWhenGrouped) {
                        template = column.groupCellTemplate || { allowRenderToDetachedContainer: true, render: that._getDefaultGroupTemplate(column) };
                    } else {
                        template = column.cellTemplate || { allowRenderToDetachedContainer: true, render: that._getDefaultTemplate(column) };
                    }

                    return template;
                },

                _createRow: function(row) {
                    var $row = this.callBase(row),
                        isGroup,
                        isDataRow,
                        isRowExpanded;

                    if(row) {
                        isGroup = row.rowType === "group";
                        isDataRow = row.rowType === "data";

                        isDataRow && $row.addClass(DATA_ROW_CLASS);
                        isDataRow && row.dataIndex % 2 === 1 && this.option("rowAlternationEnabled") && $row.addClass(ROW_ALTERNATION_CLASS);
                        isDataRow && this.option("showRowLines") && $row.addClass(ROW_LINES_CLASS);

                        this.option("showColumnLines") && $row.addClass(COLUMN_LINES_CLASS);

                        if(row.visible === false) {
                            $row.hide();
                        }

                        if(isGroup) {
                            $row.addClass(GROUP_ROW_CLASS);
                            isRowExpanded = row.isExpanded;
                            this.setAria("role", "rowgroup", $row);
                            this.setAria("expanded", isDefined(isRowExpanded) && isRowExpanded.toString(), $row);
                        }
                    }

                    return $row;
                },

                _afterRowPrepared: function(e) {
                    var arg = e.args[0],
                        dataController = this._dataController,
                        watch = this.option("integrationOptions.watchMethod");

                    if(!arg.data || arg.rowType !== "data" || arg.inserted || !this.option("twoWayBindingEnabled") || !watch) return;

                    var dispose = watch(
                        function() {
                            return dataController.generateDataValues(arg.data, arg.columns);
                        },
                        function() {
                            dataController.updateItems({ changeType: "update", rowIndices: [arg.rowIndex] });
                        },
                        {
                            deep: true,
                            skipImmediate: true
                        }
                     );

                    arg.rowElement.on(removeEvent, dispose);
                },

                _renderScrollable: function(force) {
                    var that = this,
                        $element = that.element();

                    if(!$element.children().length) {
                        $element.append("<div />");
                    }
                    if((force || !that._loadPanel)) {
                        that._renderLoadPanel($element, $element.parent(), that._dataController.isLocalStore());
                    }

                    if((force || !that.getScrollable()) && that._dataController.isLoaded()) {
                        var columns = that.getColumns(),
                            allColumnsHasWidth = true;

                        for(var i = 0; i < columns.length; i++) {
                            if(!columns[i].width && !columns[i].minWidth) {
                                allColumnsHasWidth = false;
                                break;
                            }
                        }

                        if(that.option("columnAutoWidth") || that._hasHeight || allColumnsHasWidth || that._columnsController._isColumnFixing()) {
                            that._renderScrollableCore($element);
                        }
                    }
                },

                _handleScroll: function(e) {
                    var that = this;

                    that._isScrollByEvent = !!e.jQueryEvent;
                    that._scrollTop = e.scrollOffset.top;
                    that._scrollLeft = e.scrollOffset.left;
                    that.scrollChanged.fire(e.scrollOffset, that.name);
                },

                _renderScrollableCore: function($element) {
                    var that = this,
                        dxScrollableOptions = that._createScrollableOptions(),
                        scrollHandler = that._handleScroll.bind(that);

                    dxScrollableOptions.onScroll = scrollHandler;
                    dxScrollableOptions.onStop = scrollHandler;

                    that._scrollable = that._createComponent($element, Scrollable, dxScrollableOptions);
                    that._scrollableContainer = that._scrollable && that._scrollable._$container;
                },

                _renderLoadPanel: gridCoreUtils.renderLoadPanel,

                _renderContent: function(contentElement, tableElement) {
                    contentElement.replaceWith($("<div>").addClass(this.addWidgetPrefix(CONTENT_CLASS)).append(tableElement));

                    return this._findContentElement();
                },

                _updateContent: function(newTableElement, change) {
                    var that = this,
                        tableElement = that._getTableElement(),
                        contentElement = that._findContentElement(),
                        changeType = change && change.changeType,
                        executors = [];

                    switch(changeType) {
                        case "update":
                            $.each(change.rowIndices, function(index, rowIndex) {
                                var $newRowElement = that._getRowElements(newTableElement).eq(index),
                                    changeType = change.changeTypes[index],
                                    item = change.items && change.items[index];

                                executors.push(function() {
                                    var $rowsElement = that._getRowElements(),
                                        $rowElement = $rowsElement.eq(rowIndex);

                                    switch(changeType) {
                                        case "update":
                                            if(item) {
                                                if(isDefined(item.visible) && item.visible !== $rowElement.is(":visible")) {
                                                    $rowElement.toggle(item.visible);
                                                } else {
                                                    $rowElement.replaceWith($newRowElement);
                                                }
                                            }
                                            break;
                                        case "insert":
                                            if(!$rowsElement.length) {
                                                $newRowElement.prependTo(tableElement);
                                            } else if($rowElement.length) {
                                                $newRowElement.insertBefore($rowElement);
                                            } else {
                                                $newRowElement.insertAfter($rowsElement.last());
                                            }
                                            break;
                                        case "remove":
                                            $rowElement.remove();
                                            break;
                                    }
                                });
                            });
                            $.each(executors, function() {
                                this();
                            });

                            newTableElement.remove();
                            break;
                        default:
                            that._setTableElement(newTableElement);
                            contentElement.addClass(that.addWidgetPrefix(CONTENT_CLASS));
                            that._renderContent(contentElement, newTableElement);
                            break;
                    }
                },

                _renderFreeSpaceRow: function(tableElement) {
                    var that = this,
                        i,
                        freeSpaceRowElement = that._createRow(),
                        columns = this.getColumns();

                    freeSpaceRowElement
                        .addClass(FREE_SPACE_CLASS)
                        .toggleClass(COLUMN_LINES_CLASS, that.option("showColumnLines"));

                    for(i = 0; i < columns.length; i++) {
                        freeSpaceRowElement.append(that._createCell({ column: columns[i], rowType: "freeSpace" }));
                    }

                    that._appendRow(tableElement, freeSpaceRowElement, appendFreeSpaceRowTemplate);
                },

                _needUpdateRowHeight: function(itemsCount) {
                    return itemsCount > 0 && !this._rowHeight;
                },

                _updateRowHeight: function() {
                    var that = this,
                        tableElement = that._getTableElement(),
                        tableHeight,
                        freeSpaceRowHeight,
                        itemsCount = that._dataController.items().length,
                        $freeSpaceRowElement;

                    if(tableElement && that._needUpdateRowHeight(itemsCount)) {
                        tableHeight = tableElement.outerHeight();
                        $freeSpaceRowElement = that._getFreeSpaceRowElements().first();
                        if($freeSpaceRowElement && $freeSpaceRowElement.is(":visible")) {
                            freeSpaceRowHeight = parseFloat($freeSpaceRowElement[0].style.height) || 0;
                            tableHeight -= freeSpaceRowHeight;
                        }
                        that._rowHeight = tableHeight / itemsCount;
                    }
                },

                _findContentElement: function() {
                    var $content = this.element(),
                        scrollable = this.getScrollable();

                    if($content) {
                        if(scrollable) {
                            $content = scrollable.content();
                        }
                        return $content.children().first();
                    }
                },

                _getRowElements: function(tableElement) {
                    var $rows = this.callBase(tableElement);

                    return $rows && $rows.not("." + FREE_SPACE_CLASS);
                },

                _getFreeSpaceRowElements: function($table) {
                    var tableElements = $table || this.getTableElements();

                    return tableElements && tableElements.children("tbody").children("." + FREE_SPACE_CLASS);
                },

                _getNoDataText: function() {
                    return this.option("noDataText");
                },

                _renderNoDataText: gridCoreUtils.renderNoDataText,

                _rowClick: function(e) {
                    var item = this._dataController.items()[e.rowIndex] || {};
                    this.executeAction("onRowClick", extend({
                        evaluate: function(expr) {
                            var getter = compileGetter(expr);
                            return getter(item.data);
                        } }, e, item));
                },

                _getGroupCellOptions: function(options) {
                    var columnIndex = (options.row.groupIndex || 0) + options.columnsCountBeforeGroups;

                    return {
                        columnIndex: columnIndex,
                        colspan: options.columns.length - columnIndex - 1
                    };
                },

                _renderCells: function($row, options) {
                    if(options.row.rowType === "group") {
                        this._renderGroupedCells($row, options);
                    } else if(options.row.values) {
                        this.callBase($row, options);
                    }
                },

                _renderGroupedCells: function($row, options) {
                    var row = options.row,
                        i,
                        columns = options.columns,
                        rowIndex = row.rowIndex,
                        isExpanded,
                        groupColumn,
                        groupColumnAlignment,
                        groupCellOptions = this._getGroupCellOptions(options);

                    for(i = 0; i <= groupCellOptions.columnIndex; i++) {
                        if(i === groupCellOptions.columnIndex && columns[i].allowCollapsing && options.scrollingMode !== "infinite") {
                            isExpanded = !!row.isExpanded;
                        } else {
                            isExpanded = null;
                        }

                        this._renderCell($row, {
                            value: isExpanded,
                            row: row,
                            rowIndex: rowIndex,
                            column: { command: "expand", cssClass: columns[i].cssClass },
                            columnIndex: i
                        });
                    }

                    groupColumnAlignment = getDefaultAlignment(this.option("rtlEnabled"));

                    groupColumn = extend(
                        {},
                        columns[groupCellOptions.columnIndex],
                        {
                            command: null,
                            cssClass: null,
                            showWhenGrouped: false,
                            alignment: groupColumnAlignment
                        }
                    );

                    if(groupCellOptions.colspan > 1) {
                        groupColumn.colspan = groupCellOptions.colspan;
                    }

                    this._renderCell($row, {
                        value: row.values[row.groupIndex],
                        row: row,
                        rowIndex: rowIndex,
                        column: groupColumn,
                        columnIndex: groupCellOptions.columnIndex
                    });
                },

                _renderRows: function($table, options) {
                    var that = this,
                        i,
                        columns = options.columns,
                        columnsCountBeforeGroups = 0,
                        scrollingMode = that.option("scrolling.mode");

                    for(i = 0; i < columns.length; i++) {
                        if(columns[i].command === "expand") {
                            columnsCountBeforeGroups = i;
                            break;
                        }
                    }

                    that.callBase($table, extend({
                        scrollingMode: scrollingMode,
                        columnsCountBeforeGroups: columnsCountBeforeGroups
                    }, options));

                    that._renderFreeSpaceRow($table);
                    if(!that._hasHeight) {
                        that.updateFreeSpaceRowHeight($table);
                    }
                },

                _renderRow: function($table, options) {
                    var that = this,
                        row = options.row,
                        rowTemplate = that.option("rowTemplate");

                    if((row.rowType === "data" || row.rowType === "group") && !isDefined(row.groupIndex) && rowTemplate) {
                        that.renderTemplate($table, rowTemplate, extend({ columns: options.columns }, row), true);
                    } else {
                        that.callBase($table, options);
                    }
                },

                _renderTable: function(options) {
                    var that = this,
                        $table = that.callBase(options),
                        resizeCompletedHandler = function() {
                            var scrollableInstance = that.getScrollable();

                            if(scrollableInstance && that.element().closest(document).length) {
                                that.resizeCompleted.remove(resizeCompletedHandler);
                                scrollableInstance._visibilityChanged(true);
                            }
                        };

                    if(!isDefined(that._getTableElement())) {
                        that._setTableElement($table);
                        that._renderScrollable(true);
                        that.resizeCompleted.add(resizeCompletedHandler);
                    } else {
                        that._renderScrollable();
                    }

                    return $table;
                },

                _renderCore: function(change) {
                    var that = this,
                        $table,
                        $element = that.element();

                    $element.addClass(that.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option("wordWrapEnabled"));

                    $table = that._renderTable({ change: change });
                    that._updateContent($table, change);

                    that.callBase(change);

                    that._lastColumnWidths = null;
                },

                _getRows: function(change) {
                    return change && change.items || this._dataController.items();
                },

                _getCellOptions: function(options) {
                    var that = this,
                        parameters,
                        column = options.column,
                        row = options.row,
                        data = row.data,
                        summaryCells = row && row.summaryCells,
                        value = options.value,
                        displayValue = gridCoreUtils.getDisplayValue(column, value, data, row.rowType),
                        groupingTextsOptions,
                        scrollingMode;

                    parameters = this.callBase(options);
                    parameters.value = value;
                    parameters.displayValue = displayValue;
                    parameters.row = row;
                    parameters.key = row.key;
                    parameters.data = data;
                    parameters.rowType = row.rowType;
                    parameters.values = row.values;
                    parameters.text = !column.command ? gridCoreUtils.formatValue(displayValue, column) : "";
                    parameters.rowIndex = row.rowIndex;
                    parameters.summaryItems = summaryCells && summaryCells[options.columnIndex];
                    parameters.resized = column.resizedCallbacks;

                    if(isDefined(column.groupIndex)) {
                        groupingTextsOptions = that.option("grouping.texts");
                        scrollingMode = that.option("scrolling.mode");
                        if(scrollingMode !== "virtual" && scrollingMode !== "infinite") {
                            parameters.groupContinuesMessage = data && data.isContinuationOnNextPage && groupingTextsOptions && groupingTextsOptions.groupContinuesMessage;
                            parameters.groupContinuedMessage = data && data.isContinuation && groupingTextsOptions && groupingTextsOptions.groupContinuedMessage;
                        }
                    }

                    return parameters;
                },

                getCellOptions: function(rowIndex, columnIdentifier) {
                    var rowOptions = this._dataController.items()[rowIndex],
                        cellOptions,
                        column;

                    if(rowOptions) {
                        column = this._columnsController.columnOption(columnIdentifier);
                        if(column) {
                            cellOptions = this._getCellOptions({
                                value: column.calculateCellValue(rowOptions.data),
                                rowIndex: rowOptions.rowIndex,
                                row: rowOptions,
                                column: column
                            });
                        }
                    }
                    return cellOptions;
                },

                getRow: function(index) {
                    var rows = this._getRowElements();
                    if(rows.length > index) {
                        return $(rows[index]);
                    }
                },

                getCellIndex: function($cell) {
                    var cellIndex = $cell.length ? $cell[0].cellIndex : -1;

                    return cellIndex;
                },

                updateFreeSpaceRowHeight: function($table) {
                    var that = this,
                        contentElement = that._findContentElement(),
                        freeSpaceRowElements = that._getFreeSpaceRowElements($table),
                        freeSpaceRowCount,
                        scrollingMode;

                    if(freeSpaceRowElements && contentElement) {
                        var isFreeSpaceRowVisible = false;

                        if(that._dataController.items().length > 0) {
                            if(!that._hasHeight) {
                                freeSpaceRowCount = that._dataController.pageSize() - that._dataController.items().length;
                                scrollingMode = that.option("scrolling.mode");

                                if(freeSpaceRowCount > 0 && that._dataController.pageCount() > 1 && scrollingMode !== "virtual" && scrollingMode !== "infinite") {
                                    freeSpaceRowElements.height(freeSpaceRowCount * that._rowHeight);
                                    isFreeSpaceRowVisible = true;
                                }
                                if(!isFreeSpaceRowVisible && $table) {
                                    freeSpaceRowElements.height(0);
                                } else {
                                    freeSpaceRowElements.css("display", isFreeSpaceRowVisible ? "" : "none");
                                }
                                that._updateLastRowBorder(isFreeSpaceRowVisible);
                            } else {
                                freeSpaceRowElements.css("display", "none");
                                commonUtils.deferUpdate(function() {
                                    var scrollbarWidth = that.getScrollbarWidth(true),
                                        elementHeightWithoutScrollbar = that.element().height() - scrollbarWidth,
                                        contentHeight = contentElement.outerHeight(),
                                        showFreeSpaceRow = (elementHeightWithoutScrollbar - contentHeight) > 0,
                                        contentTableHeight = contentElement.children().first().outerHeight(),
                                        resultHeight = elementHeightWithoutScrollbar - contentTableHeight;

                                    if(showFreeSpaceRow) {
                                        commonUtils.deferRender(function() {
                                            freeSpaceRowElements.height(resultHeight);
                                            isFreeSpaceRowVisible = true;
                                            freeSpaceRowElements.css("display", "");
                                        });
                                    }
                                    commonUtils.deferRender(function() {
                                        that._updateLastRowBorder(isFreeSpaceRowVisible);
                                    });
                                });
                            }
                        } else {
                            freeSpaceRowElements.height(0);
                            freeSpaceRowElements.css("display", "");
                            that._updateLastRowBorder(true);
                        }
                    }
                },

                _columnOptionChanged: function(e) {
                    var optionNames = e.optionNames;

                    if(e.changeTypes.grouping) return;

                    if(optionNames.width || optionNames.visibleWidth) {
                        this.callBase(e);
                        this._fireColumnResizedCallbacks();
                    }
                },

                /**
                 * @name GridBaseMethods_getScrollable
                 * @publicName getScrollable()
                 * @return Scrollable
                 */
                getScrollable: function() {
                    return this._scrollable;
                },

                init: function() {
                    var that = this,
                        dataController = that.getController("data");

                    that.callBase();
                    that._editorFactoryController = that.getController("editorFactory");
                    that._rowHeight = 0;
                    that._scrollTop = 0;
                    that._scrollLeft = -1;
                    that._hasHeight = false;
                    dataController.loadingChanged.add(function(isLoading, messageText) {
                        that.setLoading(isLoading, messageText);
                    });

                    dataController.dataSourceChanged.add(function() {
                        that._handleScroll({ scrollOffset: { top: that._scrollTop, left: that._scrollLeft } });
                    });
                },

                _handleDataChanged: function(change) {
                    var that = this;

                    switch(change.changeType) {
                        case "refresh":
                        case "prepend":
                        case "append":
                        case "update":
                            that.render(null, change);
                            break;
                        default:
                            that._update(change);
                            break;
                    }
                },

                publicMethods: function() {
                    return ["isScrollbarVisible", "getTopVisibleRowData", "getScrollbarWidth", "getCellElement", "getRowElement", "getScrollable"];
                },

                contentWidth: function() {
                    return this.element().width() - this.getScrollbarWidth();
                },

                getScrollbarWidth: function(isHorizontal) {
                    var scrollableContainer = this._scrollableContainer && this._scrollableContainer.get(0),
                        scrollbarWidth = 0;

                    if(scrollableContainer) {
                        if(!isHorizontal) {
                            scrollbarWidth = scrollableContainer.clientWidth ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth : 0;
                        } else {
                            scrollbarWidth = scrollableContainer.clientHeight ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight : 0;
                        }
                    }
                    return scrollbarWidth > 0 ? scrollbarWidth : 0;
                },

                //TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
                _fireColumnResizedCallbacks: function() {
                    var that = this,
                        lastColumnWidths = that._lastColumnWidths || [],
                        columnWidths = [],
                        columns = that.getColumns(),
                        i;

                    for(i = 0; i < columns.length; i++) {
                        columnWidths[i] = columns[i].visibleWidth;
                        if(columns[i].resizedCallbacks && !isDefined(columns[i].groupIndex) && lastColumnWidths[i] !== columnWidths[i]) {
                            columns[i].resizedCallbacks.fire(columnWidths[i]);
                        }
                    }

                    that._lastColumnWidths = columnWidths;
                },

                _updateLastRowBorder: function(isFreeSpaceRowVisible) {
                    if(this.option("showBorders") && this.option("showRowLines") && !isFreeSpaceRowVisible) {
                        this.element().addClass(LAST_ROW_BORDER);
                    } else {
                        this.element().removeClass(LAST_ROW_BORDER);
                    }
                },

                _updateScrollable: function() {
                    var dxScrollable = Scrollable.getInstance(this.element());

                    if(dxScrollable) {
                        dxScrollable.update();
                        this._updateHorizontalScrollPosition();
                    }
                },

                _updateHorizontalScrollPosition: function() {
                    var scrollable = this.getScrollable(),
                        scrollLeft = scrollable && scrollable.scrollOffset().left;

                    if(this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
                        scrollable.scrollTo({ x: this._scrollLeft });
                    }
                },

                _resizeCore: function() {
                    var that = this;

                    that._fireColumnResizedCallbacks();
                    that._updateRowHeight();
                    commonUtils.deferRender(function() {
                        that._renderScrollable();
                        that._renderNoDataText();
                        that.updateFreeSpaceRowHeight();
                    });
                    that._updateScrollable();
                    that.setLoading(that._dataController.isLoading());
                },

                scrollTo: function(location) {
                    var $element = this.element(),
                        dxScrollable = $element && Scrollable.getInstance($element);

                    if(dxScrollable) {
                        dxScrollable.scrollTo(location);
                    }
                },

                height: function(height, hasHeight) {
                    var that = this,
                        $element = this.element();

                    if(isDefined(height)) {
                        that._hasHeight = hasHeight === undefined ? height !== "auto" : hasHeight;

                        if($element) {
                            $element.css("height", height);
                        }
                    } else {
                        return $element ? $element.outerHeight(true) : 0;
                    }
                },

                setLoading: function(isLoading, messageText) {
                    var that = this,
                        loadPanel = that._loadPanel,
                        dataController = that._dataController,
                        loadPanelOptions = that.option("loadPanel") || {},
                        animation = dataController.isLoaded() ? loadPanelOptions.animation : null,
                        $element = that.element(),
                        visibilityOptions;

                    if(!loadPanel && messageText !== undefined && dataController.isLocalStore() && loadPanelOptions.enabled === "auto" && $element) {
                        that._renderLoadPanel($element, $element.parent());
                        loadPanel = that._loadPanel;
                    }
                    if(loadPanel) {
                        visibilityOptions = {
                            message: messageText || loadPanelOptions.text,
                            animation: animation,
                            visible: isLoading
                        };
                        clearTimeout(that._hideLoadingTimeoutID);
                        if(loadPanel.option("visible") && !isLoading) {
                            that._hideLoadingTimeoutID = setTimeout(function() {
                                loadPanel.option(visibilityOptions);
                            }, LOADPANEL_HIDE_TIMEOUT);
                        } else {
                            loadPanel.option(visibilityOptions);
                        }
                    }
                },

                setRowsOpacity: function(columnIndex, value) {
                    var that = this,
                        i,
                        columnsController = that._columnsController,
                        visibleColumns = that.getColumns(),
                        columns = columnsController.getColumns(),
                        column = columns && columns[columnIndex],
                        columnID = column && column.isBand && column.index,
                        $rows = that._getRowElements().not("." + GROUP_ROW_CLASS) || [];

                    $.each($rows, function(rowIndex, row) {
                        if(!$(row).hasClass(GROUP_ROW_CLASS)) {
                            for(i = 0; i < visibleColumns.length; i++) {
                                if(commonUtils.isNumeric(columnID) && columnsController.isParentBandColumn(visibleColumns[i].index, columnID) || visibleColumns[i].index === columnIndex) {
                                    that.getCellElements(rowIndex).eq(i).css({ opacity: value });
                                    if(!commonUtils.isNumeric(columnID)) {
                                        break;
                                    }
                                }
                            }
                        }
                    });
                },

                _getCellElementsCore: function(rowIndex) {
                    var $cells = this.callBase(rowIndex),
                        groupCellIndex;

                    if($cells) {
                        groupCellIndex = $cells.filter("." + GROUP_CELL_CLASS).index();
                        if(groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
                            $cells.length = groupCellIndex + 1;
                        }
                    }
                    return $cells;
                },

                getTopVisibleItemIndex: function() {
                    var that = this,
                        itemIndex = 0,
                        prevOffsetTop = 0,
                        offsetTop = 0,
                        rowElements,
                        rowElement,
                        scrollPosition = that._scrollTop,
                        contentElementOffsetTop = that._findContentElement().offset().top,
                        items = that._dataController.items(),
                        tableElement = that._getTableElement();

                    if(items.length && tableElement) {
                        rowElements = tableElement.children("tbody").children(".dx-row:visible, .dx-error-row").not("." + FREE_SPACE_CLASS);

                        for(itemIndex = 0; itemIndex < items.length; itemIndex++) {
                            prevOffsetTop = offsetTop;
                            rowElement = rowElements.eq(itemIndex);
                            if(rowElement.length) {
                                offsetTop = rowElement.offset().top - contentElementOffsetTop;
                                if(offsetTop > scrollPosition) {
                                    if(scrollPosition * 2 < offsetTop + prevOffsetTop && itemIndex) {
                                        itemIndex--;
                                    }
                                    break;
                                }
                            }
                        }
                        if(itemIndex && itemIndex === items.length) {
                            itemIndex--;
                        }
                    }

                    return itemIndex;
                },

                getTopVisibleRowData: function() {
                    var itemIndex = this.getTopVisibleItemIndex(),
                        items = this._dataController.items();

                    if(items[itemIndex]) {
                        return items[itemIndex].data;
                    }
                },

                optionChanged: function(args) {
                    var that = this;

                    that.callBase(args);

                    switch(args.name) {
                        case "wordWrapEnabled":
                        case "showColumnLines":
                        case "showRowLines":
                        case "rowAlternationEnabled":
                        case "rowTemplate":
                        case "twoWayBindingEnabled":
                            that._invalidate(true, true);
                            args.handled = true;
                            break;
                        case "scrolling":
                            that._rowHeight = null;
                            that._tableElement = null;
                            args.handled = true;
                            break;
                        case "rtlEnabled":
                            that._rowHeight = null;
                            that._tableElement = null;
                            break;
                        case "loadPanel":
                            that._tableElement = null;
                            that._invalidate(true, true);
                            args.handled = true;
                            break;
                        case "noDataText":
                            that._renderNoDataText();
                            args.handled = true;
                            break;
                    }
                },

                dispose: function() {
                    clearTimeout(this._hideLoadingTimeoutID);
                },

                setScrollerSpacing: function() { }
            };
        })())
    }
};

/**
 * @name dxDataGridRowObject_data
 * @publicName data
 * @type object
 */

/**
 * @name dxTreeListRowObject_node
 * @publicName node
 * @type dxTreeListNode
 */

/**
 * @name dxTreeListRowObject_level
 * @publicName level
 * @type number
 */

/**
 * @name dxDataGridRowObject_key
 * @publicName key
 * @type any
 */
/**
 * @name dxTreeListRowObject_key
 * @publicName key
 * @type any
 */

/**
 * @name dxDataGridRowObject_rowIndex
 * @publicName rowIndex
 * @type number
 */
/**
 * @name dxTreeListRowObject_rowIndex
 * @publicName rowIndex
 * @type number
 */

/**
 * @name dxDataGridRowObject_rowType
 * @publicName rowType
 * @type string
 */
/**
 * @name dxTreeListRowObject_rowType
 * @publicName rowType
 * @type string
 */

/**
 * @name dxDataGridRowObject_groupIndex
 * @publicName groupIndex
 * @type number
 */

/**
 * @name dxDataGridRowObject_isExpanded
 * @publicName isExpanded
 * @type boolean
 */
/**
 * @name dxTreeListRowObject_isExpanded
 * @publicName isExpanded
 * @type boolean
 */

/**
 * @name dxDataGridRowObject_isSelected
 * @publicName isSelected
 * @type boolean
 */
/**
 * @name dxTreeListRowObject_isSelected
 * @publicName isSelected
 * @type boolean
 */

/**
 * @name dxDataGridRowObject_values
 * @publicName values
 * @type array
 */
/**
 * @name dxTreeListRowObject_values
 * @publicName values
 * @type array
 */

/**
 * @name dxDataGridRowObject_isEditing
 * @publicName isEditing
 * @type boolean
 */
/**
 * @name dxTreeListRowObject_isEditing
 * @publicName isEditing
 * @type boolean
 */
