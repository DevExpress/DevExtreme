
import { getBoundingRect } from '../../../core/utils/position';
import GroupedStrategy from './ui.scheduler.work_space.grouped.strategy';

const HORIZONTAL_GROUPED_ATTR = 'dx-group-row-count';

class HorizontalGroupedStrategy extends GroupedStrategy {
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
            return `${cellClass} ${this.getLastGroupCellClass()}`;
        }

        const groupByDate = this._workSpace.isGroupedByDate();

        if(groupByDate) {
            if(index % this._workSpace._getGroupCount() === 0) {
                return `${cellClass} ${this.getLastGroupCellClass()}`;
            }
        } else {
            if(index % this._workSpace._getCellCount() === 0) {
                return `${cellClass} ${this.getLastGroupCellClass()}`;
            }
        }

        return cellClass;
    }

    _addFirstGroupCellClass(cellClass, index, applyUnconditionally) {
        if(applyUnconditionally) {
            return `${cellClass} ${this.getFirstGroupCellClass()}`;
        }

        const groupByDate = this._workSpace.isGroupedByDate();

        if(groupByDate) {
            if((index - 1) % this._workSpace._getGroupCount() === 0) {
                return `${cellClass} ${this.getFirstGroupCellClass()}`;
            }
        } else {
            if((index - 1) % this._workSpace._getCellCount() === 0) {
                return `${cellClass} ${this.getFirstGroupCellClass()}`;
            }
        }

        return cellClass;
    }

    getHorizontalMax(groupIndex) {
        return this._workSpace.getMaxAllowedPosition()[groupIndex];
    }

    getVerticalMax(groupIndex) {
        return this._workSpace.getMaxAllowedVerticalPosition(0);
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

    getGroupCountAttr(groupRowCount, groupRows) {
        return {
            attr: HORIZONTAL_GROUPED_ATTR,
            count: groupRows && groupRows.elements.length
        };
    }

    getLeftOffset() {
        return this._workSpace.getTimePanelWidth();
    }

    getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates) {
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

    getGroupIndexByCell($cell) {
        const rowIndex = $cell.parent().index();
        const cellIndex = $cell.index();

        return this.getGroupIndex(rowIndex, cellIndex);
    }
}

export default HorizontalGroupedStrategy;
