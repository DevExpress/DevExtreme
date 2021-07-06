import { getBoundingRect } from '../../../core/utils/position';
import { cache } from './cache';
import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { getVerticalGroupCountClass } from './utils/base';

const DATE_HEADER_OFFSET = 10;
const WORK_SPACE_BORDER = 1;

class VerticalGroupedStrategy {
    constructor(workSpace) {
        this._workSpace = workSpace;
    }

    prepareCellIndexes(cellCoordinates, groupIndex, inAllDayRow) {
        let rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            rowIndex += groupIndex;

            if(!inAllDayRow) {
                rowIndex += 1;
            }
        }

        return {
            rowIndex: rowIndex,
            columnIndex: cellCoordinates.columnIndex
        };
    }

    getGroupIndex(rowIndex) {
        return Math.floor(rowIndex / this._workSpace._getRowCount());
    }

    calculateHeaderCellRepeatCount() {
        return 1;
    }

    insertAllDayRowsIntoDateTable() {
        return this._workSpace.option('showAllDayPanel');
    }

    getTotalCellCount() {
        return this._workSpace._getCellCount();
    }

    getTotalRowCount() {
        return this._workSpace._getRowCount() * this._workSpace._getGroupCount();
    }

    getVerticalMax(groupIndex) {
        let maxAllowedPosition = this._workSpace.getMaxAllowedVerticalPosition(groupIndex);

        maxAllowedPosition += this._getOffsetByAllDayPanel(groupIndex);

        return maxAllowedPosition;
    }

    _getOffsetByAllDayPanel(groupIndex) {
        let result = 0;

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            result = this._workSpace.getAllDayHeight() * (groupIndex + 1);
        }

        return result;
    }

    _getGroupTop(groupIndex) {
        const workspace = this._workSpace;
        const rowCount = workspace.isVirtualScrolling()
            ? workspace.viewDataProvider.getRowCountInGroup(groupIndex)
            : workspace._getRowCount();

        return workspace.getMaxAllowedVerticalPosition(groupIndex) - workspace.getCellHeight() * rowCount;
    }

    calculateTimeCellRepeatCount() {
        return this._workSpace._getGroupCount() || 1;
    }

    getWorkSpaceMinWidth() {
        let minWidth = this._workSpace._getWorkSpaceWidth();
        const workspaceContainerWidth = getBoundingRect(this._workSpace.$element().get(0)).width - this._workSpace.getTimePanelWidth() - this._workSpace.getGroupTableWidth() - 2 * WORK_SPACE_BORDER;

        if(minWidth < workspaceContainerWidth) {
            minWidth = workspaceContainerWidth;
        }

        return minWidth;
    }

    getAllDayOffset() {
        return 0;
    }

    getAllDayTableHeight() {
        return 0;
    }

    getGroupCountClass(groups) {
        return getVerticalGroupCountClass(groups);
    }

    getLeftOffset() {
        return this._workSpace.getTimePanelWidth() + this._workSpace.getGroupTableWidth();
    }

    getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates) {
        return cache.get('groupBoundsOffset', () => {
            const groupIndex = coordinates.groupIndex;
            const startOffset = $cells.eq(0).offset().left;
            const endOffset = $cells.eq(cellCount - 1).offset().left + cellWidth;
            const dayHeight = (this._workSpace._calculateDayDuration() / this._workSpace.option('hoursInterval')) * this._workSpace.getCellHeight();
            const scrollTop = this.getScrollableScrollTop();
            let topOffset = groupIndex * dayHeight + getBoundingRect(this._workSpace._$thead.get(0)).height + this._workSpace.option('getHeaderHeight')() + DATE_HEADER_OFFSET - scrollTop;

            if(this._workSpace.option('showAllDayPanel') && this._workSpace.supportAllDayRow()) {
                topOffset += this._workSpace.getCellHeight() * (groupIndex + 1);
            }

            const bottomOffset = topOffset + dayHeight;

            return this._groupBoundsOffset = {
                left: startOffset,
                right: endOffset,
                top: topOffset,
                bottom: bottomOffset
            };
        });
    }

    shiftIndicator($indicator, height, rtlOffset, i) {
        const offset = this._workSpace.getIndicatorOffset(0);
        const tableOffset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
        const horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
        let verticalOffset = this._workSpace._getRowCount() * this._workSpace.getCellHeight() * i;

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            verticalOffset += this._workSpace.getAllDayHeight() * (i + 1);
        }

        $indicator.css('left', horizontalOffset + tableOffset);
        $indicator.css('top', height + verticalOffset);
    }

    getShaderOffset(i, width) {
        const offset = this._workSpace.option('crossScrollingEnabled') ? 0 : this._workSpace.getGroupTableWidth();
        return this._workSpace.option('rtlEnabled') ? getBoundingRect(this._$container.get(0)).width - offset - this._workSpace.getWorkSpaceLeftOffset() - width : offset;
    }

    getShaderTopOffset(i) {
        return 0;
    }

    getShaderHeight() {
        let height = this._workSpace.getIndicationHeight();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            height += this._workSpace.getCellHeight();
        }

        return height;
    }

    getShaderMaxHeight() {
        let height = this._workSpace._getRowCount() * this._workSpace.getCellHeight();

        if(this._workSpace.supportAllDayRow() && this._workSpace.option('showAllDayPanel')) {
            height += this._workSpace.getCellHeight();
        }

        return height;
    }

    getShaderWidth() {
        return this._workSpace.getIndicationWidth(0);
    }

    getScrollableScrollTop() {
        return this._workSpace.getScrollable().scrollTop();
    }

    // ------------
    // We do not need these methods in renovation
    // ------------

    addAdditionalGroupCellClasses(cellClass, index, i, j) {
        cellClass = this._addLastGroupCellClass(cellClass, i + 1);

        return this._addFirstGroupCellClass(cellClass, i + 1);
    }

    _addLastGroupCellClass(cellClass, index) {
        if(index % this._workSpace._getRowCount() === 0) {
            return `${cellClass} ${LAST_GROUP_CELL_CLASS}`;
        }

        return cellClass;
    }

    _addFirstGroupCellClass(cellClass, index) {
        if((index - 1) % this._workSpace._getRowCount() === 0) {
            return `${cellClass} ${FIRST_GROUP_CELL_CLASS}`;
        }

        return cellClass;
    }
}

export default VerticalGroupedStrategy;
