import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';

class SchedulerWorkspaceVertical extends SchedulerWorkSpace {
    _getCellsBetween($first, $last) {
        if(this._hasAllDayClass($last)) {
            return super._getCellsBetween($first, $last);
        }

        let $cells = this._getCells();
        const firstColumn = $first.index();
        const firstRow = $first.parent().index();
        const lastColumn = $last.index();
        const lastRow = $last.parent().index();
        const groupCount = this._getGroupCount();
        const cellCount = groupCount > 0 ? this._getTotalCellCount(groupCount) : this._getCellCount();
        const rowCount = this._getTotalRowCount(groupCount);
        const result = [];

        for(let i = 0; i < cellCount; i++) {
            for(let j = 0; j < rowCount; j++) {
                const cell = $cells.get(cellCount * j + i);
                result.push(cell);
            }
        }

        const lastCellGroup = this.getCellData($last).groups;
        const indexesDifference = this.option('showAllDayPanel') && this._isVerticalGroupedWorkSpace() ? this._getGroupIndexByResourceId(lastCellGroup) + 1 : 0;

        let newFirstIndex = rowCount * firstColumn + firstRow - indexesDifference;
        let newLastIndex = rowCount * lastColumn + lastRow - indexesDifference;

        if(newFirstIndex > newLastIndex) {
            const buffer = newFirstIndex;
            newFirstIndex = newLastIndex;
            newLastIndex = buffer;
        }

        $cells = $(result).slice(newFirstIndex, newLastIndex + 1);

        if(this._getGroupCount()) {
            const arr = [];
            const focusedGroupIndex = this._getGroupIndexByCell($first);
            each($cells, (function(_, cell) {
                const groupIndex = this._getGroupIndexByCell($(cell));
                if(focusedGroupIndex === groupIndex) {
                    arr.push(cell);
                }
            }).bind(this));
            $cells = $(arr);
        }
        return $cells;
    }

    _getRightCell(isMultiSelection) {
        if(!isMultiSelection || this.isGroupedByDate()) {
            return super._getRightCell(isMultiSelection);
        }
        let $rightCell;
        const $focusedCell = this._$focusedCell;
        const groupCount = this._getGroupCount();
        const rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount);
        const edgeCellIndex = this._isRTL() ? 0 : rowCellCount - 1;
        const direction = this._isRTL() ? 'prev' : 'next';

        if($focusedCell.index() === edgeCellIndex || this._isGroupEndCell($focusedCell)) {
            $rightCell = $focusedCell;
        } else {
            $rightCell = $focusedCell[direction]();
            $rightCell = this._checkForViewBounds($rightCell);
        }

        return $rightCell;
    }

    _getLeftCell(isMultiSelection) {
        if(!isMultiSelection || this.isGroupedByDate) {
            return super._getLeftCell(isMultiSelection);
        }
        let $leftCell;
        const $focusedCell = this._$focusedCell;
        const groupCount = this._getGroupCount();
        const rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount);
        const edgeCellIndex = this._isRTL() ? rowCellCount - 1 : 0;
        const direction = this._isRTL() ? 'next' : 'prev';

        if($focusedCell.index() === edgeCellIndex || this._isGroupStartCell($focusedCell)) {
            $leftCell = $focusedCell;
        } else {
            $leftCell = $focusedCell[direction]();
            $leftCell = this._checkForViewBounds($leftCell);
        }

        return $leftCell;
    }

    _getFormat() {
        return this._formatWeekdayAndDay;
    }
}

module.exports = SchedulerWorkspaceVertical;
