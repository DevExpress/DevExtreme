"use strict";

var Class = require("../../core/class"),
    abstract = Class.abstract;

var LAST_GROUP_CELL_CLASS = "dx-scheduler-last-group-cell",
    FIRST_GROUP_CELL_CLASS = "dx-scheduler-first-group-cell";

var GroupedStrategy = Class.inherit({

    ctor: function(workSpace) {
        this._workSpace = workSpace;
    },

    getLastGroupCellClass: function() {
        return LAST_GROUP_CELL_CLASS;
    },

    getFirstGroupCellClass: function() {
        return FIRST_GROUP_CELL_CLASS;
    },
    prepareCellIndexes: abstract,
    calculateCellIndex: abstract,
    getGroupIndex: abstract,
    builtAllDayRowsIntoDateTable: abstract,
    getTotalCellCount: abstract,
    addAdditionalGroupCellClasses: abstract
});


module.exports = GroupedStrategy;
