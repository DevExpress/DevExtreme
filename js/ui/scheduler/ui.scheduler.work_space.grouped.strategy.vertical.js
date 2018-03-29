"use strict";

var GroupedStrategy = require("./ui.scheduler.work_space.grouped.strategy");


var VerticalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex) {
        var rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();

        if(this._workSpace.option("showAllDayPanel")) {
            rowIndex += groupIndex;
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

    builtAllDayRowsIntoDateTable: function() {
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
    }
});

module.exports = VerticalGroupedStrategy;
