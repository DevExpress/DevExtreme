"use strict";

var GroupedStrategy = require("./ui.scheduler.work_space.grouped.strategy");

var HorizontalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex) {
        return {
            rowIndex: cellCoordinates.rowIndex,
            cellIndex: cellCoordinates.cellIndex + groupIndex * this._workSpace._getCellCount()
        };
    },

    calculateCellIndex: function(rowIndex, cellIndex) {
        cellIndex = cellIndex % this._workSpace._getCellCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    },

    getGroupIndex: function(rowIndex, cellIndex) {
        return Math.floor(cellIndex / this._workSpace._getCellCount());
    },

    calculateHeaderCellRepeatCount: function() {
        return this._workSpace._getGroupCount() || 1;
    },

    builtAllDayRowsIntoDateTable: function() {
        return false;
    },

    getTotalCellCount: function(groupCount) {
        groupCount = groupCount || 1;

        return this._workSpace._getCellCount() * groupCount;
    },

    getTotalRowCount: function() {
        return this._workSpace._getRowCount();
    },

    addAdditionalGroupCellClasses: function(cellClass, index) {
        cellClass = this._addLastGroupCellClass(cellClass, index);

        return this._addFirstGroupCellClass(cellClass, index);
    },

    _addLastGroupCellClass: function(cellClass, index) {
        if(index % this._workSpace._getCellCount() === 0) {
            return cellClass + " " + this.getLastGroupCellClass();
        }

        return cellClass;
    },

    _addFirstGroupCellClass: function(cellClass, index) {
        if((index - 1) % this._workSpace._getCellCount() === 0) {
            return cellClass + " " + this.getFirstGroupCellClass();
        }

        return cellClass;
    }
});

module.exports = HorizontalGroupedStrategy;
