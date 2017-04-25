"use strict";

var $ = require("jquery"),
    clickEvent = require("../../events/click"),
    browser = require("../../core/utils/browser"),
    commonUtils = require("../../core/utils/common"),
    devices = require("../../core/devices"),
    gridCore = require("./ui.data_grid.core"),
    gridCoreUtils = require("../grid_core/ui.grid_core.utils");

var DATAGRID_SCROLL_CONTAINER_CLASS = "dx-datagrid-scroll-container",
    DATAGRID_ROW_CLASS = "dx-row",
    DATAGRID_GROUP_SPACE_CLASS = "dx-datagrid-group-space",
    DATAGRID_GROUP_ROW_CLASS = "dx-group-row",
    DATAGRID_DETAIL_ROW_CLASS = "dx-master-detail-row",
    DATAGRID_CONTENT_CLASS = "dx-datagrid-content",
    DATAGRID_TABLE_CLASS = "dx-datagrid-table",
    DATAGRID_TABLE_FIXED_CLASS = "dx-datagrid-table-fixed",
    DATAGRID_CONTENT_FIXED_CLASS = "dx-datagrid-content-fixed",

    DATAGRID_HIDDEN_COLUMNS_WIDTH = "0.0001px",

    DATAGRID_CELL_HINT_VISIBLE = "dxCellHintVisible",

    FORM_FIELD_ITEM_CONTENT_CLASS = "dx-field-item-content";

var appendElementTemplate = {
    render: function(options) {
        options.container.append(options.content);
    }
};

exports.ColumnsView = gridCore.View.inherit(gridCoreUtils.columnStateMixin).inherit({
    _createScrollableOptions: function() {
        var that = this,
            scrollingOptions = that.option("scrolling"),
            useNativeScrolling = that.option("scrolling.useNative");

        var options = $.extend({}, scrollingOptions, {
            direction: "both",
            bounceEnabled: false,
            useKeyboard: false
        });

        //TODO jsdmitry: This condition is for unit tests and testing scrollable
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
            alignment = column.alignment || commonUtils.getDefaultAlignment(this.option("rtlEnabled"));

        var cell = window.document.createElement("td");
        cell.style.textAlign = alignment;

        var $cell = $(cell);
        this.setAria("role", "gridcell", $cell);

        if(!commonUtils.isDefined(column.groupIndex) && column.cssClass) {
            $cell.addClass(column.cssClass);
        }
        if(column.command === "expand") {
            $cell.addClass(DATAGRID_GROUP_SPACE_CLASS);
        }

        column.colspan > 1 && $cell.attr("colspan", column.colspan);

        return $cell;
    },

    _createRow: function() {
        return $("<tr />")
            .addClass(DATAGRID_ROW_CLASS)
            .attr("role", "row");
    },

    _createTable: function(columns) {
        var that = this,
            $table = $("<table />")
                .addClass(DATAGRID_TABLE_CLASS)
                .addClass(DATAGRID_TABLE_FIXED_CLASS)
                .attr("role", "grid");

        if(columns) {
            $table.append(that._createColGroup(columns));
            if(devices.real().ios) {
                //T198380
                $table.append("<thead><tr></tr></thead>");
            }
        }

        $table.append("<tbody />");

        //T138469
        if(browser.mozilla) {
            $table.on("mousedown", "td", function(e) {
                if(e.ctrlKey) {
                    e.preventDefault();
                }
            });
        }

        if(that.option("cellHintEnabled")) {
            $table.on("mousemove", ".dx-row > td", this.createAction(function(args) {
                var e = args.jQueryEvent,
                    $element = $(e.target),
                    $cell = $(e.currentTarget),
                    $row = $cell.parent(),
                    isDataRow = $row.hasClass("dx-data-row"),
                    isHeaderRow = $row.hasClass("dx-header-row"),
                    isGroupRow = $row.hasClass("dx-group-row"),
                    visibleColumns = that._columnsController.getVisibleColumns(),
                    rowOptions = $row.data("options"),
                    columnIndex = $cell.index(),
                    cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex],
                    column = cellOptions ? cellOptions.column : visibleColumns[columnIndex];

                if((!isDataRow || (isDataRow && column && !column.cellTemplate)) &&
                    (!isHeaderRow || (isHeaderRow && column && !column.headerCellTemplate)) &&
                    (!isGroupRow || (isGroupRow && column && (column.groupIndex === undefined || !column.groupCellTemplate)))) {
                    if($element.data(DATAGRID_CELL_HINT_VISIBLE)) {
                        $element.removeAttr("title");
                        $element.data(DATAGRID_CELL_HINT_VISIBLE, false);
                    }

                    if($element[0].scrollWidth > $element[0].clientWidth && !commonUtils.isDefined($element.attr("title"))) {
                        $element.attr("title", $element.text());
                        $element.data(DATAGRID_CELL_HINT_VISIBLE, true);
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

            resultOptions = $.extend({}, options, {
                cellElement: $cell,
                jQueryEvent: event,
                eventType: event.type
            });

            if($fieldItemContent.length) {
                formItemOptions = $fieldItemContent.data("dxFormItem");
                if(formItemOptions.column) {
                    resultOptions.column = formItemOptions.column;
                    resultOptions.columnIndex = that._columnsController.getVisibleIndex(resultOptions.column.index);
                }
            }

            return resultOptions;
        };

        $table.on("mouseover", ".dx-row > td", function(e) {
            that.executeAction("onCellHoverChanged", getOptions(e));
        });
        $table.on("mouseout", ".dx-row > td", function(e) {
            that.executeAction("onCellHoverChanged", getOptions(e));
        });

        $table.on(clickEvent.name, ".dx-row > td", function(e) {
            that.executeAction("onCellClick", getOptions(e));
        });

        $table.on(clickEvent.name, ".dx-row", { useNative: that._isNativeClick() }, that.createAction(function(e) {
            var jQueryEvent = e.jQueryEvent;

            if(!$(jQueryEvent.target).closest("a").length) {
                e.rowIndex = that.getRowIndex(jQueryEvent.currentTarget);

                if(e.rowIndex >= 0) {
                    e.rowElement = $(jQueryEvent.currentTarget);
                    e.columns = that.getColumns();
                    that._rowClick(e);
                }
            }
        }));

        return $table;
    },

    _isNativeClick: $.noop,

    _rowClick: $.noop,

    _createColGroup: function(columns) {
        var i, j,
            colgroupElement = $("<colgroup />"),
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
            width = DATAGRID_HIDDEN_COLUMNS_WIDTH;
        }

        return $("<col />").width(width);
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

        if(template && template.render && !template.jquery) {
            renderingTemplate = {
                allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
                render: function(options) {
                    template.render(options.container, options.model);
                }
            };
        } else if($.isFunction(template)) {
            renderingTemplate = {
                render: function(options) {
                    var renderedTemplate = template(options.container, options.model);
                    if(renderedTemplate && (renderedTemplate.jquery || renderedTemplate.nodeType)) {
                        options.container.append(renderedTemplate);
                    }
                }
            };
        } else {
            templateID = commonUtils.isString(template) ? template : $(template).attr("id");

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

    _renderCore: function() {
        var $root = this.element().parent();

        if(!$root || $root.parent().length) {
            this.renderDelayedTemplates();
        }
    },

    _renderTable: function(options) {
        options = options || {};

        var that = this,
            $table;

        options.columns = that._columnsController.getVisibleColumns();
        $table = that._createTable(options.columns);

        that._renderRows($table, options);

        return $table;
    },

    _renderRows: function($table, options) {
        var that = this,
            i,
            rows = that._getRows(options.change);

        for(i = 0; i < rows.length; i++) {
            that._renderRow($table, $.extend({ row: rows[i] }, options));
        }
    },

    _renderRow: function($table, options) {
        var that = this,
            $row;

        options.row.cells = [];

        $row = that._createRow(options.row);
        that._renderCells($row, options);
        that._appendRow($table, $row);
        that._rowPrepared($row, $.extend({ columns: options.columns }, options.row));
    },

    _renderCells: function($row, options) {
        var that = this,
            i,
            columnIndex = 0,
            row = options.row,
            columns = options.columns;

        for(i = 0; i < columns.length; i++) {
            that._renderCell($row, $.extend({ column: columns[i], columnIndex: columnIndex, value: row.values && row.values[columnIndex] }, options));

            if(columns[i].colspan > 1) {
                columnIndex += columns[i].colspan;
            } else {
                columnIndex++;
            }
        }
    },

    _renderCell: function($row, options) {
        var that = this,
            cellOptions = that._getCellOptions(options),
            column = options.column,
            $cell;

        options.row.cells.push(cellOptions);

        $cell = that._createCell(cellOptions);

        //TODO move to cellPrepared
        if(!column.command) {
            that.setAria("label", that.localize("dxDataGrid-ariaColumn") + " " + column.caption + ", " + that.localize("dxDataGrid-ariaValue") + " " + cellOptions.text, $cell);
        }

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

    _cellPrepared: function($cell, options) {
        options.cellElement = $cell;
        this.executeAction("onCellPrepared", options);
    },

    _rowPrepared: function($row, options) {
        $.data($row.get(0), "options", options);

        options.rowElement = $row;
        this.executeAction("onRowPrepared", options);
    },

    _columnOptionChanged: function(e) {
        var optionNames = e.optionNames;

        if(gridCore.checkChanges(optionNames, ["width", "visibleWidth"])) {
            var visibleColumns = this._columnsController.getVisibleColumns();
            var widths = $.map(visibleColumns, function(column) { return column.visibleWidth || column.width || "auto"; });

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

        that._columnsController.columnsChanged.add($.proxy(that._columnOptionChanged, that));
        that._dataController && that._dataController.changed.add($.proxy(that._handleDataChanged, that));
    },

    _afterRowPrepared: $.noop,

    _handleDataChanged: function() {
    },

    callbackNames: function() {
        return ["scrollChanged"];
    },

    scrollTo: function(pos) {
        var that = this,
            $element = that.element(),
            $scrollContainer = $element && $element.children("." + DATAGRID_SCROLL_CONTAINER_CLASS).not("." + DATAGRID_CONTENT_FIXED_CLASS);

        that._skipScrollChanged = false;

        if(commonUtils.isDefined(pos) && commonUtils.isDefined(pos.left) && that._scrollLeft !== pos.left) {
            that._scrollLeft = pos.left;
            $scrollContainer && $scrollContainer.scrollLeft(Math.round(pos.left));
            that._skipScrollChanged = true;
        }
    },

    _wrapTableInScrollContainer: function($table) {
        var that = this,
            $scrollContainer;

        $scrollContainer = $("<div/>")
            .on("scroll", function() {
                !that._skipScrollChanged && that.scrollChanged.fire({
                    left: $scrollContainer.scrollLeft()
                }, that.name);
                that._skipScrollChanged = false;
            })
            .addClass(DATAGRID_CONTENT_CLASS)
            .addClass(DATAGRID_SCROLL_CONTAINER_CLASS)
            .append($table)
            .appendTo(that.element());

        return $scrollContainer;
    },

    _updateContent: function($newTableElement) {
        this._setTableElement($newTableElement);
        this._wrapTableInScrollContainer($newTableElement);
    },

    _findContentElement: $.noop,

    _getWidths: function($cellElements) {
        var result = [],
            width,
            clientRect;

        if($cellElements) {
            $.each($cellElements, function(index, item) {
                width = item.offsetWidth;
                if(item.getBoundingClientRect) {
                    clientRect = item.getBoundingClientRect();
                    if(clientRect.width > width) {
                        width = Math.ceil(clientRect.width);
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

        $tableElement = $tableElement || that._getTableElement();

        if($tableElement) {
            $cells = $tableElement
                        .children("tbody")
                        .children(":not(." + DATAGRID_GROUP_ROW_CLASS + ", ." + DATAGRID_DETAIL_ROW_CLASS + ")")
                        .first()
                        .children("td");
            result = that._getWidths($cells);
        }

        return result;
    },

    setColumnWidths: function(widths, $tableElement, columns) {
        var $cols,
            i,
            width,
            columnIndex;

        $tableElement = $tableElement || this._getTableElement();

        if($tableElement && $tableElement.length && widths) {
            columnIndex = 0;
            $cols = $tableElement.find("col");
            columns = columns || this.getColumns(null, $tableElement);

            for(i = 0; i < columns.length; i++) {
                if(columns[i].colspan) {
                    columnIndex += columns[i].colspan;
                    continue;
                }
                width = widths[columnIndex];
                if(width === "adaptiveHidden") {
                    width = DATAGRID_HIDDEN_COLUMNS_WIDTH;
                }
                $cols.eq(columnIndex).css("width", width || "auto");
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

    /**
     * @name dxDataGridMethods_getCellElement
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return jQuery|undefined
     */
    /**
     * @name dxDataGridMethods_getCellElement
     * @publicName getCellElement(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return jQuery|undefined
     */
    getCellElement: function(rowIndex, columnIdentifier) {
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

    /**
     * @name dxDataGridMethods_getRowElement
     * @publicName getRowElement(rowIndex)
     * @param1 rowIndex:number
     * @return jQuery|undefined
     */
    getRowElement: function(rowIndex) {
        var that = this,
            $rowElement = $(),
            $tableElements = that.getTableElements();

        $.each($tableElements, function(_, tableElement) {
            $rowElement = $rowElement.add(that._getRowElements($(tableElement)).eq(rowIndex));
        });

        if($rowElement.length) {
            return $rowElement;
        }
    },

    _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {
        var columnIndex;

        if(commonUtils.isString(columnIdentifier)) {
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
        return tableElement && tableElement.children("tbody").children("." + DATAGRID_ROW_CLASS) || $();
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
