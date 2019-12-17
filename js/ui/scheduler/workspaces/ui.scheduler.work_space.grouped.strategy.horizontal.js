const GroupedStrategy = require('./ui.scheduler.work_space.grouped.strategy');

const HORIZONTAL_GROUPED_ATTR = 'dx-group-row-count';

const HorizontalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex, inAllDay) {
        const groupByDay = this._workSpace.isGroupedByDate();

        if(!groupByDay) {
            return {
                rowIndex: cellCoordinates.rowIndex,
                cellIndex: cellCoordinates.cellIndex + groupIndex * this._workSpace._getCellCount()
            };
        } else {
            return {
                rowIndex: cellCoordinates.rowIndex,
                cellIndex: cellCoordinates.cellIndex * this._workSpace._getGroupCount() + groupIndex
            };
        }
    },

    calculateCellIndex: function(rowIndex, cellIndex) {
        cellIndex = cellIndex % this._workSpace._getCellCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    },

    getGroupIndex: function(rowIndex, cellIndex) {
        const groupByDay = this._workSpace.isGroupedByDate();
        const groupCount = this._workSpace._getGroupCount();

        if(groupByDay) {
            return cellIndex % groupCount;
        } else {
            return Math.floor(cellIndex / this._workSpace._getCellCount());
        }
    },

    calculateHeaderCellRepeatCount: function() {
        return this._workSpace._getGroupCount() || 1;
    },

    insertAllDayRowsIntoDateTable: function() {
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
        const groupByDay = this._workSpace.option('groupByDate');

        if(groupByDay) {
            if(index % this._workSpace._getGroupCount() === 0) {
                return cellClass + ' ' + this.getLastGroupCellClass();
            }
        } else {
            if(index % this._workSpace._getCellCount() === 0) {
                return cellClass + ' ' + this.getLastGroupCellClass();
            }
        }

        return cellClass;
    },

    _addFirstGroupCellClass: function(cellClass, index) {
        if((index - 1) % this._workSpace._getCellCount() === 0) {
            return cellClass + ' ' + this.getFirstGroupCellClass();
        }

        return cellClass;
    },

    getHorizontalMax: function(groupIndex) {
        return this._workSpace.getMaxAllowedPosition()[groupIndex];
    },

    getVerticalMax: function(groupIndex) {
        return this._workSpace.getMaxAllowedVerticalPosition()[0];
    },

    calculateTimeCellRepeatCount: function() {
        return 1;
    },

    getWorkSpaceMinWidth: function() {
        return this._workSpace.$element().get(0).getBoundingClientRect().width - this._workSpace.getTimePanelWidth();
    },

    getAllDayOffset: function() {
        return this._workSpace.getAllDayHeight();
    },

    getAllDayTableHeight: function() {
        return this._workSpace._$allDayTable.get(0).getBoundingClientRect().height || 0;
    },

    getGroupCountAttr: function(groupRowCount, groupRows) {
        return {
            attr: HORIZONTAL_GROUPED_ATTR,
            count: groupRows && groupRows.elements.length
        };
    },

    getLeftOffset: function() {
        return this._workSpace.getTimePanelWidth();
    },

    getGroupBoundsOffset: function(cellCount, $cells, cellWidth, coordinates) {
        let groupIndex;
        let cellIndex;
        let startCellIndex;
        let startOffset;
        let endOffset;

        if(this._workSpace.isGroupedByDate()) {
            startCellIndex = 0;

            startOffset = $cells.eq(startCellIndex).offset().left - cellWidth / 2;
            endOffset = $cells.eq(cellCount * this._workSpace._getGroupCount() - 1).offset().left + cellWidth + cellWidth / 2;
        } else {
            cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
            groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);
            startCellIndex = groupIndex * cellCount;

            startOffset = $cells.eq(startCellIndex).offset().left - cellWidth / 2;
            endOffset = $cells.eq(startCellIndex + cellCount - 1).offset().left + cellWidth + cellWidth / 2;
        }

        return {
            left: startOffset,
            right: endOffset,
            top: 0,
            bottom: 0
        };
    },

    shiftIndicator: function($indicator, height, rtlOffset, i) {
        const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1, 0) * i + this._workSpace.getIndicatorOffset(i) + i;
        const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;

        $indicator.css('left', horizontalOffset);
        $indicator.css('top', height);
    },

    getShaderOffset: function(i, width) {
        const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1) * i;
        return this._workSpace.option('rtlEnabled') ? this._workSpace._dateTableScrollable.$content().get(0).getBoundingClientRect().width - offset - this._workSpace.getTimePanelWidth() - width : offset;
    },

    getShaderTopOffset: function(i) {
        return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
    },

    getShaderHeight: function() {
        const height = this._workSpace.getIndicationHeight();

        return height;
    },

    getShaderMaxHeight: function() {
        return this._workSpace._dateTableScrollable.$content().get(0).getBoundingClientRect().height;
    },

    getShaderWidth: function(i) {
        return this._workSpace.getIndicationWidth(i);
    },

    getScrollableScrollTop: function(allDay) {
        return !allDay ? this._workSpace.getScrollable().scrollTop() : 0;
    }
});

module.exports = HorizontalGroupedStrategy;
