import { getBoundingRect } from '../../../core/utils/position';
import { Cache } from './cache';
import { FIRST_GROUP_CELL_CLASS, LAST_GROUP_CELL_CLASS } from '../classes';
import { calculateDayDuration, getVerticalGroupCountClass } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { ALL_DAY_BEHAVIOR_JS_NAMES } from '../../../renovation/ui/scheduler/appointment/allDayStrategy/index';

const DATE_HEADER_OFFSET = 10;
const WORK_SPACE_BORDER = 1;

class VerticalGroupedStrategy {
    constructor(workSpace) {
        this._workSpace = workSpace;
        this.cache = new Cache();
    }

    prepareCellIndexes(cellCoordinates, groupIndex, inAllDayRow) {
        const supportAllDayRow = this._workSpace.supportAllDayRow();
        const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
        let rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount();

        if(supportAllDayRow && allDayPanelVisible) {
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
        return this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
    }

    getTotalCellCount() {
        return this._workSpace._getCellCount();
    }

    getTotalRowCount() {
        return this._workSpace._getRowCount() * this._workSpace._getGroupCount();
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

    getGroupCountClass(groups) {
        return getVerticalGroupCountClass(groups);
    }

    getLeftOffset() {
        return this._workSpace.getTimePanelWidth() + this._workSpace.getGroupTableWidth();
    }

    getGroupBoundsOffset(groupIndex, [$firstCell, $lastCell]) {
        return this.cache.get(`groupBoundsOffset${groupIndex}`, () => {
            const startDayHour = this._workSpace.option('startDayHour');
            const endDayHour = this._workSpace.option('endDayHour');
            const hoursInterval = this._workSpace.option('hoursInterval');

            const dayHeight = (calculateDayDuration(startDayHour, endDayHour) / hoursInterval) * this._workSpace.getCellHeight();
            const scrollTop = this.getScrollableScrollTop();
            let topOffset = groupIndex * dayHeight + getBoundingRect(this._workSpace._$thead.get(0)).height + this._workSpace.option('getHeaderHeight')() + DATE_HEADER_OFFSET - scrollTop;

            const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
            const supportAllDayRow = this._workSpace.supportAllDayRow();
            if(allDayPanelVisible && supportAllDayRow) {
                topOffset += this._workSpace.getCellHeight() * (groupIndex + 1);
            }

            const bottomOffset = topOffset + dayHeight;

            const { left } = $firstCell.getBoundingClientRect();
            const { right } = $lastCell.getBoundingClientRect();
            return this._groupBoundsOffset = {
                left,
                right,
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

        const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
        const supportAllDayRow = this._workSpace.supportAllDayRow();
        if(allDayPanelVisible && supportAllDayRow) {
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

        const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
        const supportAllDayRow = this._workSpace.supportAllDayRow();
        if(allDayPanelVisible && supportAllDayRow) {
            height += this._workSpace.getCellHeight();
        }

        return height;
    }

    getShaderMaxHeight() {
        let height = this._workSpace._getRowCount() * this._workSpace.getCellHeight();

        const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;
        const supportAllDayRow = this._workSpace.supportAllDayRow();
        if(allDayPanelVisible && supportAllDayRow) {
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
