"use strict";

var $ = require("jquery"),
    clickEvent = require("../../events/click"),
    gridCore = require("./ui.data_grid.core"),
    commonUtils = require("../../core/utils/common"),
    sortingMixin = require("../grid_core/ui.grid_core.sorting").sortingMixin,
    messageLocalization = require("../../localization/message"),
    eventUtils = require("../../events/utils");

var COLUMN_HEADERS_VIEW_NAMESPACE = "dxDataGridColumnHeadersView";

var ColumnHeadersViewSortingExtender = $.extend({}, sortingMixin, {
    _createRow: function(row) {
        var that = this,
            $row = that.callBase(row);

        if(row.rowType === "header") {
            $row
                .on(eventUtils.addNamespace(clickEvent.name, COLUMN_HEADERS_VIEW_NAMESPACE), "> td", that.createAction(function(e) {
                    var keyName = null,
                        event = e.jQueryEvent,
                        $cellElementFromEvent = $(event.currentTarget),
                        rowIndex = $cellElementFromEvent.parent().index(),
                        columnIndex = $.map(that.getCellElements(rowIndex), function($cellElement, index) {
                            if($cellElement === $cellElementFromEvent.get(0)) return index;
                        })[0],
                        visibleColumns = that._columnsController.getVisibleColumns(rowIndex),
                        column = visibleColumns[columnIndex],
                        editingController = that.getController("editing"),
                        editingMode = that.option("editing.mode"),
                        isCellEditing = editingController.isEditing() && (editingMode === "batch" || editingMode === "cell");

                    if(isCellEditing) {
                        return;
                    }

                    if(column && !commonUtils.isDefined(column.groupIndex) && !column.command) {
                        if(event.shiftKey) {
                            keyName = "shift";
                        } else if(event.ctrlKey) {
                            keyName = "ctrl";
                        }
                        setTimeout(function() {
                            that._columnsController.changeSortOrder(column.index, keyName);
                        });
                    }
                }));
        }

        return $row;
    },

    _renderCellContent: function($cell, options) {
        var that = this,
            column = options.column;

        if(!column.command && options.rowType === "header") {
            that._applyColumnState({
                name: "sort",
                rootElement: $cell,
                column: column,
                showColumnLines: that.option("showColumnLines")
            });
        }

        that.callBase($cell, options);
    },

    _columnOptionChanged: function(e) {
        var changeTypes = e.changeTypes;

        if(changeTypes.length === 1 && changeTypes.sorting) {
            this._updateIndicators("sort");
            return;
        }

        this.callBase(e);
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    }
});

var HeaderPanelSortingExtender = $.extend({}, sortingMixin, {
    _createGroupPanelItem: function($rootElement, groupColumn) {
        var that = this,
            $item = that.callBase.apply(that, arguments);

        $item.on(eventUtils.addNamespace(clickEvent.name, "dxDataGridHeaderPanel"), that.createAction(function() {
            setTimeout(function() {
                that.getController("columns").changeSortOrder(groupColumn.index);
            });
        }));

        that._applyColumnState({
            name: "sort",
            rootElement: $item,
            column: {
                alignment: that.option("rtlEnabled") ? "right" : "left",
                allowSorting: groupColumn.allowSorting,
                sortOrder: groupColumn.sortOrder === "desc" ? "desc" : "asc"
            },
            showColumnLines: true
        });

        return $item;
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    }
});

gridCore.registerModule("sorting", {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions_sorting
             * @publicName sorting
             * @type object
             */
            sorting: {
                /**
                 * @name dxDataGridOptions_sorting_sortingMode
                 * @publicName mode
                 * @type string
                 * @acceptValues "none" | "single" | "multiple"
                 * @default "single"
                 */
                mode: "single",
                /**
                 * @name dxDataGridOptions_sorting_ascendingText
                 * @publicName ascendingText
                 * @type string
                 * @default "Sort Ascending"
                 */
                ascendingText: messageLocalization.format("dxDataGrid-sortingAscendingText"),
                /**
                 * @name dxDataGridOptions_sorting_descendingText
                 * @publicName descendingText
                 * @type string
                 * @default "Sort Descending"
                 */
                descendingText: messageLocalization.format("dxDataGrid-sortingDescendingText"),
                /**
                 * @name dxDataGridOptions_sorting_clearText
                 * @publicName clearText
                 * @type string
                 * @default "Clear Sorting"
                 */
                clearText: messageLocalization.format("dxDataGrid-sortingClearText")
            }
        };
    },
    extenders: {
        views: {
            columnHeadersView: ColumnHeadersViewSortingExtender,
            headerPanel: HeaderPanelSortingExtender
        }
    }
});
