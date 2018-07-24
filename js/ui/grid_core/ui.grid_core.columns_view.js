"use strict";

var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    dataUtils = require("../../core/element_data"),
    clickEvent = require("../../events/click"),
    browser = require("../../core/utils/browser"),
    commonUtils = require("../../core/utils/common"),
    styleUtils = require("../../core/utils/style"),
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    typeUtils = require("../../core/utils/type"),
    iteratorUtils = require("../../core/utils/iterator"),
    extend = require("../../core/utils/extend").extend,
    getDefaultAlignment = require("../../core/utils/position").getDefaultAlignment,
    devices = require("../../core/devices"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    columnStateMixin = require("./ui.grid_core.column_state_mixin"),
    noop = commonUtils.noop;

var SCROLL_CONTAINER_CLASS = "scroll-container",
    GROUP_SPACE_CLASS = "group-space",
    CONTENT_CLASS = "content",
    TABLE_CLASS = "table",
    TABLE_FIXED_CLASS = "table-fixed",
    CONTENT_FIXED_CLASS = "content-fixed",
    ROW_CLASS = "dx-row",
    GROUP_ROW_CLASS = "dx-group-row",
    DETAIL_ROW_CLASS = "dx-master-detail-row",
    FILTER_ROW_CLASS = "filter-row",

    HIDDEN_COLUMNS_WIDTH = "0.0001px",

    CELL_HINT_VISIBLE = "dxCellHintVisible",

    FORM_FIELD_ITEM_CONTENT_CLASS = "dx-field-item-content";

var appendElementTemplate = {
    render: function(options) {
        options.container.append(options.content);
    }
};

var subscribeToRowClick = function(that, $table) {
    var touchTarget,
        touchCurrentTarget,
        timeoutId;

    function clearTouchTargets(timeout) {
        return setTimeout(function() {
            touchTarget = touchCurrentTarget = null;
        }, timeout);
    }

    eventsEngine.on($table, "touchstart touchend", ".dx-row", function(e) {
        clearTimeout(timeoutId);
        if(e.type === "touchstart") {
            touchTarget = e.target;
            touchCurrentTarget = e.currentTarget;
            timeoutId = clearTouchTargets(1000);
        } else {
            timeoutId = clearTouchTargets();
        }
    });

    eventsEngine.on($table, "dxclick", ".dx-row", { useNative: that._isNativeClick() }, that.createAction(function(e) {
        var dxEvent = e.event;

        if(touchTarget) {
            dxEvent.target = touchTarget;
            dxEvent.currentTarget = touchCurrentTarget;
        }

        if(!$(dxEvent.target).closest("a").length) {
            e.rowIndex = that.getRowIndex(dxEvent.currentTarget);

            if(e.rowIndex >= 0) {
                e.rowElement = getPublicElement($(dxEvent.currentTarget));
                e.columns = that.getColumns();
                that._rowClick(e);
            }
        }
    }));
};

var getWidthStyle = function(width) {
    if(width === "auto") return "";
    return typeof width === "number" ? width + "px" : width;
};

exports.ColumnsView = modules.View.inherit(columnStateMixin).inherit({
    _createScrollableOptions: function() {
        var that = this,
            scrollingOptions = that.option("scrolling"),
            useNativeScrolling = that.option("scrolling.useNative");

        var options = extend({}, scrollingOptions, {
            direction: "both",
            updateManually: true,
            bounceEnabled: false,
            useKeyboard: false
        });

        // TODO jsdmitry: This condition is for unit tests and testing scrollable
        if(useNativeScrolling === undefined) {
            useNativeScrolling = true;
        }
        if(useNativeScrolling === "auto") {
            delete options.useNative;
            delete options.useSimulatedScrollbar;
        } else {
            options.useNative = !!useNativeScrolling;
            options.useSimulatedScrollbar = !useNativeScrolling;
        }
        return options;
    },

    _updateCell: function($cell, parameters) {
        if(parameters.rowType) {
            this._cellPrepared($cell, parameters);
        }
    },

    _createCell: function(options) {
        var column = options.column,
            alignment = column.alignment || getDefaultAlignment(this.option("rtlEnabled"));

        var cell = domAdapter.createElement("td");
        cell.style.textAlign = alignment;

        var $cell = $(cell);

        if(!typeUtils.isDefined(column.groupIndex) && column.cssClass) {
            $cell.addClass(column.cssClass);
        }
        if(column.command === "expand") {
            $cell.addClass(column.cssClass);
            $cell.addClass(this.addWidgetPrefix(GROUP_SPACE_CLASS));
        }

        if(column.colspan > 1) {
            $cell.attr("colSpan", column.colspan);
        } else if(!column.isBand && !this.option("legacyRendering") && this.option("columnAutoWidth")) {
            if(column.width || column.minWidth) {
                cell.style.minWidth = getWidthStyle(column.minWidth || column.width);
            }
            if(column.width) {
                cell.style.width = cell.style.maxWidth = getWidthStyle(column.width);
            }
        }

        return $cell;
    },

    _createRow: function(rowObject) {
        var $element = $("<tr>").addClass(ROW_CLASS);
        this.setAria("role", "row", $element);
        return $element;
    },

    _createTable: function(columns, isAppend) {
        var that = this,
            $table = $("<table>")
                .addClass(that.addWidgetPrefix(TABLE_CLASS))
                .addClass(that.addWidgetPrefix(TABLE_FIXED_CLASS));

        if(columns && !isAppend) {
            $table.append(that._createColGroup(columns));
            if(devices.real().ios) {
                // T198380
                $table.append($("<thead>").append("<tr>"));
            }
            that.setAria("role", "presentation", $table);
        } else {
            that.setAria("hidden", true, $table);
        }

        $table.append($("<tbody>"));

        if(isAppend) {
            return $table;
        }

        // T138469
        if(browser.mozilla) {
            eventsEngine.on($table, "mousedown", "td", function(e) {
                if(e.ctrlKey) {
                    e.preventDefault();
                }
            });
        }

        if(that.option("cellHintEnabled")) {
            eventsEngine.on($table, "mousemove", ".dx-row > td", this.createAction(function(args) {
                var e = args.event,
                    difference,
                    $element = $(e.target),
                    $cell = $(e.currentTarget),
                    $row = $cell.parent(),
                    isDataRow = $row.hasClass("dx-data-row"),
                    isHeaderRow = $row.hasClass("dx-header-row"),
                    isGroupRow = $row.hasClass(GROUP_ROW_CLASS),
                    isMasterDetailRow = $row.hasClass(DETAIL_ROW_CLASS),
                    isFilterRow = $row.hasClass(that.addWidgetPrefix(FILTER_ROW_CLASS)),
                    visibleColumns = that._columnsController.getVisibleColumns(),
                    rowOptions = $row.data("options"),
                    columnIndex = $cell.index(),
                    cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex],
                    column = cellOptions ? cellOptions.column : visibleColumns[columnIndex],
                    msieCorrection = browser.msie ? 1 : 0;

                if(!isMasterDetailRow && !isFilterRow && (!isDataRow || (isDataRow && column && !column.cellTemplate)) &&
                    (!isHeaderRow || (isHeaderRow && column && !column.headerCellTemplate)) &&
                    (!isGroupRow || (isGroupRow && column && (column.groupIndex === undefined || !column.groupCellTemplate)))) {
                    if($element.data(CELL_HINT_VISIBLE)) {
                        $element.removeAttr("title");
                        $element.data(CELL_HINT_VISIBLE, false);
                    }

                    difference = $element[0].scrollWidth - $element[0].clientWidth - msieCorrection; // T598499
                    if(difference > 0 && !typeUtils.isDefined($element.attr("title"))) {
                        $element.attr("title", $element.text());
                        $element.data(CELL_HINT_VISIBLE, true);
                    }
                }
            }));
        }

        var getOptions = function(event) {
            var $cell = $(event.currentTarget),
                $fieldItemContent = $(event.target).closest("." + FORM_FIELD_ITEM_CONTENT_CLASS),
                formItemOptions,
                rowOptions = $cell.parent().data("options"),
                options = rowOptions && rowOptions.cells && rowOptions.cells[$cell.index()],
                resultOptions;

            if(!$cell.closest("table").is(event.delegateTarget)) return;

            resultOptions = extend({}, options, {
                cellElement: getPublicElement($cell),
                event: event,
                eventType: event.type
            });

            if($fieldItemContent.length) {
                formItemOptions = $fieldItemContent.data("dx-form-item");
                if(formItemOptions.column) {
                    resultOptions.column = formItemOptions.column;
                    resultOptions.columnIndex = that._columnsController.getVisibleIndex(resultOptions.column.index);
                }
            }

            return resultOptions;
        };

        eventsEngine.on($table, "mouseover", ".dx-row > td", function(e) {
            var options = getOptions(e);
            options && that.executeAction("onCellHoverChanged", options);
        });

        eventsEngine.on($table, "mouseout", ".dx-row > td", function(e) {
            var options = getOptions(e);
            options && that.executeAction("onCellHoverChanged", options);
        });

        eventsEngine.on($table, clickEvent.name, ".dx-row > td", function(e) {
            var options = getOptions(e);
            options && that.executeAction("onCellClick", options);
        });

        subscribeToRowClick(that, $table);

        return $table;
    },

    _isNativeClick: commonUtils.noop,

    _rowClick: commonUtils.noop,

    _createColGroup: function(columns) {
        var i, j,
            colgroupElement = $("<colgroup>"),
            colspan;

        for(i = 0; i < columns.length; i++) {
            colspan = columns[i].colspan || 1;

            for(j = 0; j < colspan; j++) {
                colgroupElement.append(this._createCol(columns[i]));
            }
        }
        return colgroupElement;
    },

    _createCol: function(column) {
        var width = column.visibleWidth || column.width;

        if(width === "adaptiveHidden") {
            width = HIDDEN_COLUMNS_WIDTH;
        }

        var col = $("<col>");
        styleUtils.setWidth(col, width);

        return col;
    },

    renderDelayedTemplates: function() {
        var templateParameters,
            delayedTemplates = this._delayedTemplates;

        while(delayedTemplates.length) {
            templateParameters = delayedTemplates.shift();

            templateParameters.template.render(templateParameters.options);

            if(templateParameters.options.model && templateParameters.options.model.column) {
                this._updateCell(templateParameters.options.container, templateParameters.options.model);
            }
        }
    },

    _processTemplate: function(template) {
        var that = this,
            templateID,
            renderingTemplate;

        if(template && template.render && !typeUtils.isRenderer(template)) {
            renderingTemplate = {
                allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
                render: function(options) {
                    template.render(options.container, options.model);
                }
            };
        } else if(typeUtils.isFunction(template)) {
            renderingTemplate = {
                render: function(options) {
                    var renderedTemplate = template(getPublicElement(options.container), options.model);
                    if(renderedTemplate && (renderedTemplate.nodeType || typeUtils.isRenderer(renderedTemplate))) {
                        options.container.append(renderedTemplate);
                    }
                }
            };
        } else {
            templateID = typeUtils.isString(template) ? template : $(template).attr("id");

            if(!templateID) {
                renderingTemplate = that.getTemplate(template);
            } else {
                if(!that._templatesCache[templateID]) {
                    that._templatesCache[templateID] = that.getTemplate(template);
                }

                renderingTemplate = that._templatesCache[templateID];
            }
        }

        return renderingTemplate;
    },

    renderTemplate: function(container, template, options, allowRenderToDetachedContainer) {
        var that = this,
            renderingTemplate = that._processTemplate(template, options);

        if(renderingTemplate) {
            options.component = that.component;

            if(renderingTemplate.allowRenderToDetachedContainer || allowRenderToDetachedContainer) {
                renderingTemplate.render({ container: container, model: options });
                return true;
            } else {
                that._delayedTemplates.push({ template: renderingTemplate, options: { container: container, model: options } });
            }
        }

        return false;
    },

    _appendRow: function($table, $row, appendTemplate) {
        appendTemplate = appendTemplate || appendElementTemplate;
        appendTemplate.render({ content: $row, container: $table });
    },

    _resizeCore: function() {
        var that = this,
            scrollLeft = that._scrollLeft;

        if(scrollLeft >= 0) {
            that._scrollLeft = 0;
            that.scrollTo({ left: scrollLeft });
        }
    },

    _renderCore: function(e) {
        var $root = this.element().parent();

        if(!$root || $root.parent().length) {
            this.renderDelayedTemplates(e);
        }
    },

    _renderTable: function(options) {
        options = options || {};

        var that = this,
            $table;

        options.columns = that._columnsController.getVisibleColumns();
        var changeType = options.change && options.change.changeType;
        $table = that._createTable(options.columns, changeType === "append" || changeType === "prepend");

        that._renderRows($table, options);

        return $table;
    },

    _renderRows: function($table, options) {
        var that = this,
            i,
            rows = that._getRows(options.change);

        for(i = 0; i < rows.length; i++) {
            that._renderRow($table, extend({ row: rows[i] }, options));
        }
    },

    _renderRow: function($table, options) {
        var that = this,
            $row;

        options.row.cells = [];

        $row = that._createRow(options.row);

        that._renderCells($row, options);
        that._appendRow($table, $row);
        that._rowPrepared($row, extend({ columns: options.columns }, options.row));
    },

    _renderCells: function($row, options) {
        var that = this,
            i,
            columnIndex = 0,
            row = options.row,
            columns = options.columns;

        for(i = 0; i < columns.length; i++) {
            that._renderCell($row, extend({ column: columns[i], columnIndex: columnIndex, value: row.values && row.values[columnIndex] }, options));

            if(columns[i].colspan > 1) {
                columnIndex += columns[i].colspan;
            } else {
                columnIndex++;
            }
        }
    },

    _setCellAriaAttributes: function($cell, cellOptions) {
        if(cellOptions.rowType !== "freeSpace") {
            this.setAria("selected", false, $cell);
            this.setAria("role", "gridcell", $cell);
            this.setAria("colindex", cellOptions.columnIndex + 1, $cell);
        }
    },

    _renderCell: function($row, options) {
        var that = this,
            cellOptions = that._getCellOptions(options),
            $cell;

        options.row.cells.push(cellOptions);

        $cell = that._createCell(cellOptions);

        that._setCellAriaAttributes($cell, cellOptions);

        that._renderCellContent($cell, cellOptions);

        $row.get(0).appendChild($cell.get(0));

        return $cell;
    },

    _renderCellContent: function($cell, options) {
        var template = this._getCellTemplate(options);

        if((!template || this.renderTemplate($cell, template, options))) {
            this._updateCell($cell, options);
        }
    },

    _getCellTemplate: function() { },

    _getRows: function() {
        return [];
    },

    _getCellOptions: function(options) {
        return {
            column: options.column,
            columnIndex: options.columnIndex,
            rowType: options.row.rowType
        };
    },

    _cellPrepared: function(cell, options) {
        options.cellElement = getPublicElement($(cell));
        this.executeAction("onCellPrepared", options);
    },

    _rowPrepared: function($row, options) {
        dataUtils.data($row.get(0), "options", options);

        options.rowElement = getPublicElement($row);
        this.executeAction("onRowPrepared", options);
    },

    _columnOptionChanged: function(e) {
        var optionNames = e.optionNames;

        if(gridCoreUtils.checkChanges(optionNames, ["width", "visibleWidth"])) {
            var visibleColumns = this._columnsController.getVisibleColumns();
            var widths = iteratorUtils.map(visibleColumns, function(column) { return column.visibleWidth || column.width || "auto"; });

            this.setColumnWidths(widths);
            return;
        }

        if(!this._requireReady) {
            this.render();
        }
    },

    getTableElements: function() {
        return this._tableElement || $();
    },

    _getTableElement: function() {
        return this._tableElement;
    },

    _setTableElement: function(tableElement) {
        this._tableElement = tableElement;
    },

    optionChanged: function(args) {
        this.callBase(args);

        switch(args.name) {
            case "cellHintEnabled":
            case "onCellPrepared":
            case "onRowPrepared":
            case "onCellHoverChanged":
                this._invalidate(true, true);
                args.handled = true;
                break;
        }
    },

    init: function() {
        var that = this;
        that._scrollLeft = -1;
        that._columnsController = that.getController("columns");
        that._dataController = that.getController("data");
        that._delayedTemplates = [];
        that._templatesCache = {};
        that.createAction("onCellClick");
        that.createAction("onRowClick");
        that.createAction("onCellHoverChanged", { excludeValidators: ["disabled", "readOnly"] });
        that.createAction("onCellPrepared", { excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering" });
        that.createAction("onRowPrepared", {
            excludeValidators: ["designMode", "disabled", "readOnly"], category: "rendering", afterExecute: function(e) {
                that._afterRowPrepared(e);
            } });

        that._columnsController.columnsChanged.add(that._columnOptionChanged.bind(that));
        that._dataController && that._dataController.changed.add(that._handleDataChanged.bind(that));
    },

    _afterRowPrepared: commonUtils.noop,

    _handleDataChanged: function() {
    },

    callbackNames: function() {
        return ["scrollChanged"];
    },

    scrollTo: function(pos) {
        var that = this,
            $element = that.element(),
            $scrollContainer = $element && $element.children("." + that.addWidgetPrefix(SCROLL_CONTAINER_CLASS)).not("." + that.addWidgetPrefix(CONTENT_FIXED_CLASS));

        that._skipScrollChanged = false;

        if(typeUtils.isDefined(pos) && typeUtils.isDefined(pos.left) && that._scrollLeft !== pos.left) {
            that._scrollLeft = pos.left;
            $scrollContainer && $scrollContainer.scrollLeft(Math.round(pos.left));
            that._skipScrollChanged = true;
        }
    },

    _wrapTableInScrollContainer: function($table) {
        var that = this,
            $scrollContainer;

        $scrollContainer = $("<div>");

        eventsEngine.on($scrollContainer, "scroll", function() {
            !that._skipScrollChanged && that.scrollChanged.fire({
                left: $scrollContainer.scrollLeft()
            }, that.name);
            that._skipScrollChanged = false;
        });

        $scrollContainer.addClass(that.addWidgetPrefix(CONTENT_CLASS))
            .addClass(that.addWidgetPrefix(SCROLL_CONTAINER_CLASS))
            .append($table)
            .appendTo(that.element());

        that.setAria("role", "presentation", $scrollContainer);

        return $scrollContainer;
    },

    _updateContent: function($newTableElement) {
        this._setTableElement($newTableElement);
        this._wrapTableInScrollContainer($newTableElement);
    },

    _findContentElement: commonUtils.noop,

    _getWidths: function($cellElements) {
        var result = [],
            legacyRendering = this.option("legacyRendering"),
            width,
            clientRect;

        if($cellElements) {
            iteratorUtils.each($cellElements, function(index, item) {
                width = item.offsetWidth;
                if(item.getBoundingClientRect) {
                    clientRect = item.getBoundingClientRect();
                    if(clientRect.width > width - 1) {
                        width = legacyRendering ? Math.ceil(clientRect.width) : clientRect.width;
                    }
                }

                result.push(width);
            });
        }

        return result;
    },

    getColumnWidths: function($tableElement) {
        var that = this,
            result = [],
            $cells;

        (this.option("forceApplyBindings") || noop)();

        $tableElement = $tableElement || that._getTableElement();

        if($tableElement) {
            $cells = $tableElement.children("tbody").children();

            for(var i = 0; i < $cells.length; i++) {
                var $cell = $cells.eq(i);
                if(!$cell.is("." + GROUP_ROW_CLASS) && !$cell.is("." + DETAIL_ROW_CLASS)) {
                    $cells = $cell.children("td");
                    break;
                }
            }

            result = that._getWidths($cells);
        }

        return result;
    },

    setColumnWidths: function(widths, $tableElement, columns, fixed) {
        var $cols,
            i,
            width,
            minWidth,
            columnIndex,
            columnAutoWidth = this.option("columnAutoWidth"),
            legacyRendering = this.option("legacyRendering");

        $tableElement = $tableElement || this._getTableElement();

        if($tableElement && $tableElement.length && widths) {
            columnIndex = 0;
            $cols = $tableElement.children("colgroup").children("col");
            styleUtils.setWidth($cols, "auto");
            columns = columns || this.getColumns(null, $tableElement);
            for(i = 0; i < columns.length; i++) {
                if(!legacyRendering && columnAutoWidth && !fixed) {
                    width = columns[i].width;

                    if(width && !columns[i].command) {
                        width = columns[i].visibleWidth || width;

                        width = getWidthStyle(width);
                        minWidth = getWidthStyle(columns[i].minWidth || width);
                        var $rows = $rows || $tableElement.children().children(".dx-row").not("." + GROUP_ROW_CLASS).not("." + DETAIL_ROW_CLASS);
                        for(var rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
                            var cell = $rows[rowIndex].cells[i];
                            if(cell) {
                                cell.style.width = cell.style.maxWidth = width;
                                cell.style.minWidth = minWidth;
                            }
                        }
                    }
                }
                if(columns[i].colspan) {
                    columnIndex += columns[i].colspan;
                    continue;
                }
                width = widths[columnIndex];
                if(width === "adaptiveHidden") {
                    width = HIDDEN_COLUMNS_WIDTH;
                }
                if(typeof width === "number") {
                    width = width.toFixed(3) + "px";
                }
                styleUtils.setWidth($cols.eq(columnIndex), width || "auto");

                columnIndex++;
            }
        }
    },

    getCellElements: function(rowIndex) {
        return this._getCellElementsCore(rowIndex);
    },

    _getCellElementsCore: function(rowIndex) {
        var $row = this._getRowElements().eq(rowIndex);
        return $row.children();
    },

    _getCellElement: function(rowIndex, columnIdentifier) {
        var that = this,
            $cell,
            $cells = that.getCellElements(rowIndex),
            columnVisibleIndex = that._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);

        if($cells.length && columnVisibleIndex >= 0) {
            $cell = $cells.eq(columnVisibleIndex);
        }

        if($cell && $cell.length) {
            return $cell;
        }
    },

    _getRowElement: function(rowIndex) {
        var that = this,
            $rowElement = $(),
            $tableElements = that.getTableElements();

        iteratorUtils.each($tableElements, function(_, tableElement) {
            $rowElement = $rowElement.add(that._getRowElements($(tableElement)).eq(rowIndex));
        });

        if($rowElement.length) {
            return $rowElement;
        }
    },

    /**
     * @name GridBaseMethods.getCellElement
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return dxElement|undefined
     */
    /**
     * @name GridBaseMethods.getCellElement
     * @publicName getCellElement(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return dxElement|undefined
     */
    getCellElement: function(rowIndex, columnIdentifier) {
        return getPublicElement(this._getCellElement(rowIndex, columnIdentifier));
    },

    /**
     * @name GridBaseMethods.getRowElement
     * @publicName getRowElement(rowIndex)
     * @param1 rowIndex:number
     * @return Array<Node>|jQuery|undefined
     */
    getRowElement: function(rowIndex) {
        var $rows = this._getRowElement(rowIndex),
            elements = [];

        if($rows && !getPublicElement($rows).get) {
            for(var i = 0; i < $rows.length; i++) {
                elements.push($rows[i]);
            }
        } else {
            elements = $rows;
        }
        return elements;
    },

    _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {
        var columnIndex;

        if(typeUtils.isString(columnIdentifier)) {
            columnIndex = this._columnsController.columnOption(columnIdentifier, "index");
            return this._columnsController.getVisibleIndex(columnIndex);
        }

        return columnIdentifier;
    },

    getColumnElements: function() {},

    getColumns: function(rowIndex) {
        return this._columnsController.getVisibleColumns(rowIndex);
    },

    getCell: function(cellPosition, rows) {
        var $rows = rows || this._getRowElements(),
            $cells;

        if($rows.length > 0 && cellPosition.rowIndex >= 0) {
            if(this.option("scrolling.mode") !== "virtual") {
                cellPosition.rowIndex = cellPosition.rowIndex < $rows.length ? cellPosition.rowIndex : $rows.length - 1;
            }
            $cells = this.getCellElements(cellPosition.rowIndex);
            if($cells && $cells.length > 0) {
                return $cells.eq($cells.length > cellPosition.columnIndex ? cellPosition.columnIndex : $cells.length - 1);
            }
        }
    },

    getRowsCount: function() {
        var tableElement = this._getTableElement();

        if(tableElement && tableElement.length === 1) {
            return tableElement[0].rows.length;
        }
        return 0;
    },

    _getRowElements: function(tableElement) {
        tableElement = tableElement || this._getTableElement();
        return tableElement && tableElement.find("> tbody > " + "." + ROW_CLASS + ", > tbody." + ROW_CLASS) || $();
    },

    getRowIndex: function($row) {
        return this._getRowElements().index($row);
    },

    getBoundingRect: function() { },

    getName: function() { },

    setScrollerSpacing: function(width) {
        var that = this,
            $element = that.element(),
            rtlEnabled = that.option("rtlEnabled");

        $element && $element.css(rtlEnabled ? { paddingLeft: width } : { paddingRight: width });
    },

    isScrollbarVisible: function(isHorizontal) {
        var $element = this.element(),
            $tableElement = this._tableElement;

        if($element && $tableElement) {
            return isHorizontal ? ($tableElement.outerWidth() - $element.width() > 0) : ($tableElement.outerHeight() - $element.height() > 0);
        }

        return false;
    }
});
