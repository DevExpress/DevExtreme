"use strict";

var $ = require("../../core/renderer"),
    clickEvent = require("../../events/click"),
    isDefined = require("../../core/utils/type").isDefined,
    extend = require("../../core/utils/extend").extend,
    sortingMixin = require("../grid_core/ui.grid_core.sorting_mixin"),
    messageLocalization = require("../../localization/message"),
    eventUtils = require("../../events/utils");

var COLUMN_HEADERS_VIEW_NAMESPACE = "dxDataGridColumnHeadersView";

var ColumnHeadersViewSortingExtender = extend({}, sortingMixin, {
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
                        columnIndex = null,
                        columnsIndex = [],
                        visibleColumns = that._columnsController.getVisibleColumns(rowIndex),
                        column = null,
                        editingController = that.getController("editing"),
                        editingMode = that.option("editing.mode"),
                        isCellEditing = editingController && editingController.isEditing() && (editingMode === "batch" || editingMode === "cell");

                    $.each(that.getCellElements(rowIndex), function(index, $cellElement) {
                        if($cellElement === $cellElementFromEvent.get(0)) {
                            columnsIndex.push(index);
                        }
                    });

                    columnIndex = columnsIndex[0];
                    column = visibleColumns[columnIndex];

                    if(isCellEditing) {
                        return;
                    }

                    if(column && !isDefined(column.groupIndex) && !column.command) {
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

var HeaderPanelSortingExtender = extend({}, sortingMixin, {
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

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_sorting
             * @publicName sorting
             * @type object
             */
            sorting: {
                /**
                 * @name GridBaseOptions_sorting_sortingMode
                 * @publicName mode
                 * @type string
                 * @acceptValues "none" | "single" | "multiple"
                 * @default "single"
                 */
                mode: "single",
                /**
                 * @name GridBaseOptions_sorting_ascendingText
                 * @publicName ascendingText
                 * @type string
                 * @default "Sort Ascending"
                 */
                ascendingText: messageLocalization.format("dxDataGrid-sortingAscendingText"),
                /**
                 * @name GridBaseOptions_sorting_descendingText
                 * @publicName descendingText
                 * @type string
                 * @default "Sort Descending"
                 */
                descendingText: messageLocalization.format("dxDataGrid-sortingDescendingText"),
                /**
                 * @name GridBaseOptions_sorting_clearText
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
};
