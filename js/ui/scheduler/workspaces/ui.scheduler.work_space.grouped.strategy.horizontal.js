
import { getBoundingRect } from '../../../core/utils/position';
import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';

const HORIZONTAL_GROUPED_ATTR = 'dx-group-row-count';

class HorizontalGroupedStrategy {
    constructor(workSpace) {
        this._workSpace = workSpace;
    }

    prepareCellIndexes(cellCoordinates, groupIndex, inAllDay) {
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
    }

    calculateCellIndex(rowIndex, cellIndex) {
        cellIndex = cellIndex % this._workSpace._getCellCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    }

    getGroupIndex(rowIndex, cellIndex) {
        const groupByDay = this._workSpace.isGroupedByDate();
        const groupCount = this._workSpace._getGroupCount();

        if(groupByDay) {
            return cellIndex % groupCount;
        } else {
            return Math.floor(cellIndex / this._workSpace._getCellCount());
        }
    }

    calculateHeaderCellRepeatCount() {
        return this._workSpace._getGroupCount() || 1;
    }

    insertAllDayRowsIntoDateTable() {
        return false;
    }

    getTotalCellCount(groupCount) {
        groupCount = groupCount || 1;

        return this._workSpace._getCellCount() * groupCount;
    }

    getTotalRowCount() {
        return this._workSpace._getRowCount();
    }

    addAdditionalGroupCellClasses(cellClass, index, i, j, applyUnconditionally = false) {
        cellClass = this._addLastGroupCellClass(cellClass, index, applyUnconditionally);

        return this._addFirstGroupCellClass(cellClass, index, applyUnconditionally);
    }

    _addLastGroupCellClass(cellClass, index, applyUnconditionally) {
        if(applyUnconditionally) {
            return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
        }

        const groupByDate = this._workSpace.isGroupedByDate();

        if(groupByDate) {
            if(index % this._workSpace._getGroupCount() === 0) {
                return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
            }
        } else {
            if(index % this._workSpace._getCellCount() === 0) {
                return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
            }
        }

        return cellClass;
    }

    _addFirstGroupCellClass(cellClass, index, applyUnconditionally) {
        if(applyUnconditionally) {
            return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
        }

        const groupByDate = this._workSpace.isGroupedByDate();

        if(groupByDate) {
            if((index - 1) % this._workSpace._getGroupCount() === 0) {
                return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
            }
        } else {
            if((index - 1) % this._workSpace._getCellCount() === 0) {
                return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
            }
        }

        return cellClass;
    }

    getVerticalMax(groupIndex) {
        const isVirtualScrolling = this._workSpace.isVirtualScrolling();
        const correctedGroupIndex = isVirtualScrolling
            ? groupIndex
            : 0;

        return this._workSpace.getMaxAllowedVerticalPosition(correctedGroupIndex);
    }

    calculateTimeCellRepeatCount() {
        return 1;
    }

    getWorkSpaceMinWidth() {
        return getBoundingRect(this._workSpace.$element().get(0)).width - this._workSpace.getTimePanelWidth();
    }

    getAllDayOffset() {
        return this._workSpace.getAllDayHeight();
    }

    getAllDayTableHeight() {
        return getBoundingRect(this._workSpace._$allDayTable.get(0)).height || 0;
    }

    getGroupCountAttr(groups) {
        return {
            attr: HORIZONTAL_GROUPED_ATTR,
            count: groups?.length
        };
    }

    getLeftOffset() {
        return this._workSpace.getTimePanelWidth();
    }

    _createGroupBoundOffset(startCell, endCell, cellWidth) {
        const extraOffset = cellWidth / 2;

        const startOffset = startCell ? startCell.offset().left - extraOffset : 0;
        const endOffset = endCell ? endCell.offset().left + cellWidth + extraOffset : 0;

        return {
            left: startOffset,
            right: endOffset,
            top: 0,
            bottom: 0
        };
    }

    _getGroupedByDateBoundOffset($cells, cellWidth) {
        const firstCellIndex = 0;
        const lastCellIndex = $cells.length - 1;

        const startCell = $cells.eq(firstCellIndex);
        const endCell = $cells.eq(lastCellIndex);

        return this._createGroupBoundOffset(startCell, endCell, cellWidth);
    }

    getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap) {
        if(this._workSpace.isGroupedByDate()) {
            return this._getGroupedByDateBoundOffset($cells, cellWidth);
        }

        let startCell;
        let endCell;

        const cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
        const groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);

        const currentCellGroup = groupedDataMap.dateTableGroupedMap[groupIndex];

        if(currentCellGroup) {
            const groupRowLength = currentCellGroup[0].length;

            const groupStartPosition = currentCellGroup[0][0].position;
            const groupEndPosition = currentCellGroup[0][groupRowLength - 1].position;

            startCell = $cells.eq(groupStartPosition.cellIndex);
            endCell = $cells.eq(groupEndPosition.cellIndex);
        }

        return this._createGroupBoundOffset(startCell, endCell, cellWidth);
    }

    shiftIndicator($indicator, height, rtlOffset, groupIndex) {
        const offset = this._getIndicatorOffset(groupIndex);

        const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;

        $indicator.css('left', horizontalOffset);
        $indicator.css('top', height);
    }

    _getIndicatorOffset(groupIndex) {
        const groupByDay = this._workSpace.isGroupedByDate();

        return groupByDay ? this._calculateGroupByDateOffset(groupIndex) : this._calculateOffset(groupIndex);
    }

    _calculateOffset(groupIndex) {
        return this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex + this._workSpace.getIndicatorOffset(groupIndex) + groupIndex;
    }

    _calculateGroupByDateOffset(groupIndex) {
        return this._workSpace.getIndicatorOffset(0) * this._workSpace._getGroupCount() + this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex;
    }

    getShaderOffset(i, width) {
        const offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1) * i;
        return this._workSpace.option('rtlEnabled') ? getBoundingRect(this._workSpace._dateTableScrollable.$content().get(0)).width - offset - this._workSpace.getTimePanelWidth() - width : offset;
    }

    getShaderTopOffset(i) {
        return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0);
    }

    getShaderHeight() {
        const height = this._workSpace.getIndicationHeight();

        return height;
    }

    getShaderMaxHeight() {
        return getBoundingRect(this._workSpace._dateTableScrollable.$content().get(0)).height;
    }

    getShaderWidth(i) {
        return this._workSpace.getIndicationWidth(i);
    }

    getScrollableScrollTop(allDay) {
        return !allDay ? this._workSpace.getScrollable().scrollTop() : 0;
    }

    _getOffsetByAllDayPanel() {
        return 0;
    }

    _getGroupTop() {
        return 0;
    }
}

export default HorizontalGroupedStrategy;
