"use strict";

var GroupedStrategy = require("./ui.scheduler.work_space.grouped.strategy");

var VERTICAL_GROUPED_ATTR = "dx-group-column-count";

var VerticalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex, inAllDayRow) {
        var rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option("showAllDayPanel")) {
            rowIndex += groupIndex;

            if(!inAllDayRow) {
                rowIndex += 1;
            }
        }

        return {
            rowIndex: rowIndex,
            cellIndex: cellCoordinates.cellIndex
        };
    },

    calculateCellIndex: function(rowIndex, cellIndex) {
        rowIndex = rowIndex % this._workSpace._getRowCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    },

    getGroupIndex: function(rowIndex, cellIndex) {
        return Math.floor(rowIndex / this._workSpace._getRowCount());
    },

    calculateHeaderCellRepeatCount: function() {
        return 1;
    },

    insertAllDayRowsIntoDateTable: function() {
        return this._workSpace.option("showAllDayPanel");
    },

    getTotalCellCount: function(groupCount) {
        return this._workSpace._getCellCount();
    },

    getTotalRowCount: function() {
        return this._workSpace._getRowCount() * this._workSpace._getGroupCount();
    },

    addAdditionalGroupCellClasses: function(cellClass, index, i, j) {
        cellClass = this._addLastGroupCellClass(cellClass, i + 1);

        return this._addFirstGroupCellClass(cellClass, i + 1);
    },

    _addLastGroupCellClass: function(cellClass, index) {
        if(index % this._workSpace._getRowCount() === 0) {
            return cellClass + " " + this.getLastGroupCellClass();
        }

        return cellClass;
    },

    _addFirstGroupCellClass: function(cellClass, index) {
        if((index - 1) % this._workSpace._getRowCount() === 0) {
            return cellClass + " " + this.getFirstGroupCellClass();
        }

        return cellClass;
    },

    getHorizontalMax: function(groupIndex) {
        return this._workSpace.getMaxAllowedPosition()[0];
    },

    getVerticalMax: function(groupIndex) {
        var maxAllowedPosition = this._workSpace.getMaxAllowedVerticalPosition()[groupIndex];

        if(this._workSpace.supportAllDayRow() && this._workSpace.option("showAllDayPanel")) {
            maxAllowedPosition += maxAllowedPosition + this._workSpace.getCellHeight() * groupIndex;
        }

        return maxAllowedPosition;
    },

    calculateTimeCellRepeatCount: function() {
        return this._workSpace._getGroupCount() || 1;
    },

    getWorkSpaceMinWidth: function() {
        var minWidth = this._workSpace._getWorkSpaceWidth(),
            workspaceContainerWidth = this._workSpace.$element().outerWidth() - this._workSpace.getTimePanelWidth() - this._workSpace.getGroupTableWidth();

        if(minWidth < workspaceContainerWidth) {
            minWidth = workspaceContainerWidth;
        }

        return minWidth;
    },

    getAllDayOffset: function() {
        return 0;
    },

    getGroupCountAttr: function() {
        return {
            attr: VERTICAL_GROUPED_ATTR,
            count: this._workSpace.option("groups") && this._workSpace.option("groups").length
        };
    }
});

module.exports = VerticalGroupedStrategy;
