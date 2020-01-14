const Class = require('../../../core/class');
const abstract = Class.abstract;

const LAST_GROUP_CELL_CLASS = 'dx-scheduler-last-group-cell';
const FIRST_GROUP_CELL_CLASS = 'dx-scheduler-first-group-cell';

const GroupedStrategy = Class.inherit({

    ctor: function(workSpace) {
        this._workSpace = workSpace;
    },

    getLastGroupCellClass: function() {
        return LAST_GROUP_CELL_CLASS;
    },

    getFirstGroupCellClass: function() {
        return FIRST_GROUP_CELL_CLASS;
    },

    _getOffsetByAllDayPanel: function() {
        return 0;
    },

    _getGroupTop: function() {
        return 0;
    },

    prepareCellIndexes: abstract,
    calculateCellIndex: abstract,
    getGroupIndex: abstract,
    insertAllDayRowsIntoDateTable: abstract,
    getTotalCellCount: abstract,
    addAdditionalGroupCellClasses: abstract,
    getHorizontalMax: abstract,
    getVerticalMax: abstract,
    calculateTimeCellRepeatCount: abstract,
    getWorkSpaceMinWidth: abstract,
    getAllDayHeight: abstract,
    getGroupCountAttr: abstract,
    getLeftOffset: abstract,
    shiftIndicator: abstract,
    getShaderOffset: abstract,
    getShaderTopOffset: abstract,
    getShaderMaxHeight: abstract,
    getShaderWidth: abstract,
    getScrollableScrollTop: abstract
});


module.exports = GroupedStrategy;
