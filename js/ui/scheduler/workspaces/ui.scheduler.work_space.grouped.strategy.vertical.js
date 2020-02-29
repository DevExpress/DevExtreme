const GroupedStrategy = require('./ui.scheduler.work_space.grouped.strategy');

const VERTICAL_GROUPED_ATTR = 'dx-group-column-count';

const DATE_HEADER_OFFSET = 10;
const WORK_SPACE_BORDER = 1;

const VerticalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex, inAllDayRow) {
        let rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
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
        return this._workSpace.option('showAllDayPanel');
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
            return cellClass + ' ' + this.getLastGroupCellClass();
        }

        return cellClass;
    },

    _addFirstGroupCellClass: function(cellClass, index) {
        if((index - 1) % this._workSpace._getRowCount() === 0) {
            return cellClass + ' ' + this.getFirstGroupCellClass();
        }

        return cellClass;
    },

    getHorizontalMax: function(groupIndex) {
        return this._workSpace.getMaxAllowedPosition()[0];
    },

    getVerticalMax: function(groupIndex) {
        let maxAllowedPosition = this._workSpace.getMaxAllowedVerticalPosition()[groupIndex];

        maxAllowedPosition += this._getOffsetByAllDayPanel(groupIndex);

        return maxAllowedPosition;
    },

    _getOffsetByAllDayPanel: function(groupIndex) {
        let result = 0;

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            result = this._workSpace.getCellHeight() * (groupIndex + 1);
        }

        return result;
    },

    _getGroupTop: function(groupIndex) {
        return this._workSpace.getMaxAllowedVerticalPosition()[groupIndex] - this._workSpace.getCellHeight() * this._workSpace._getRowCount();
    },

    calculateTimeCellRepeatCount: function() {
        return this._workSpace._getGroupCount() || 1;
    },

    getWorkSpaceMinWidth: function() {
        let minWidth = this._workSpace._getWorkSpaceWidth();
        const workspaceContainerWidth = this._workSpace.$element().get(0).getBoundingClientRect().width - this._workSpace.getTimePanelWidth() - this._workSpace.getGroupTableWidth() - 2 * WORK_SPACE_BORDER;

        if(minWidth < workspaceContainerWidth) {
            minWidth = workspaceContainerWidth;
        }

        return minWidth;
    },

    getAllDayOffset: function() {
        return 0;
    },

    getAllDayTableHeight: function() {
        return 0;
    },

    getGroupCountAttr: function() {
        return {
            attr: VERTICAL_GROUPED_ATTR,
            count: this._workSpace.option('groups') && this._workSpace.option('groups').length
        };
    },

    getLeftOffset: function() {
        return this._workSpace.getTimePanelWidth() + this._workSpace.getGroupTableWidth();
    },

    getGroupBoundsOffset: function(cellCount, $cells, cellWidth, coordinates) {
        const groupIndex = coordinates.groupIndex;
        const startOffset = $cells.eq(0).offset().left;
        const endOffset = $cells.eq(cellCount - 1).offset().left + cellWidth;
        const dayHeight = (this._workSpace._calculateDayDuration() / this._workSpace.option('hoursInterval')) * this._workSpace.getCellHeight();
        const scrollTop = this.getScrollableScrollTop();
        let topOffset = groupIndex * dayHeight + this._workSpace._$thead.get(0).getBoundingClientRect().height + this._workSpace.invoke('getHeaderHeight') + DATE_HEADER_OFFSET - scrollTop;

        if(this._workSpace.option('showAllDayPanel') && this._workSpace.supportAllDayRow()) {
            topOffset += this._workSpace.getCellHeight() * (groupIndex + 1);
        }

        const bottomOffset = topOffset + dayHeight;

        return {
            left: startOffset,
            right: endOffset,
            top: topOffset,
            bottom: bottomOffset
        };
    },

    shiftIndicator: function($indicator, height, rtlOffset, i) {
        const offset = this._workSpace.getIndicatorOffset(0);
        const tableOffset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
        const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
        let verticalOffset = this._workSpace._getRowCount() * this._workSpace.getCellHeight() * i;

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            verticalOffset += this._workSpace.getAllDayHeight() * (i + 1);
        }

        $indicator.css('left', horizontalOffset + tableOffset);
        $indicator.css('top', height + verticalOffset);
    },

    getShaderOffset: function(i, width) {
        const offset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
        return this._workSpace.option('rtlEnabled') ? this._$container.get(0).getBoundingClientRect().width - offset - this._workSpace.getWorkSpaceLeftOffset() - width : offset;
    },

    getShaderTopOffset: function(i) {
        return 0;
    },

    getShaderHeight: function() {
        let height = this._workSpace.getIndicationHeight();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            height += this._workSpace.getCellHeight();
        }

        return height;
    },

    getShaderMaxHeight: function() {
        let height = this._workSpace._getRowCount() * this._workSpace.getCellHeight();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            height += this._workSpace.getCellHeight();
        }

        return height;
    },

    getShaderWidth: function(i) {
        return this._workSpace.getIndicationWidth(0);
    },

    getScrollableScrollTop: function(allDay) {
        return this._workSpace.getScrollable().scrollTop();
    }
});

module.exports = VerticalGroupedStrategy;
