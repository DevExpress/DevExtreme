import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import SchedulerWorkSpaceIndicator from './ui.scheduler.work_space.indicator';
import dateLocalization from '../../../localization/date';
import timeZoneUtils from '../utils.timeZone';

class SchedulerWorkspaceVertical extends SchedulerWorkSpaceIndicator {
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
        const indexesDifference = this.option('showAllDayPanel') && this._isVerticalGroupedWorkSpace()
            ? this._getGroupIndexByResourceId(lastCellGroup) + 1 : 0;

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

    _getCellFromNextColumn(direction, isMultiSelection) {
        let $nextCell = super._getCellFromNextColumn(direction, isMultiSelection);
        const $focusedCell = this._$focusedCell;

        if($focusedCell.parent().index() !== $nextCell.parent().index() && isMultiSelection) {
            $nextCell = $focusedCell;
        }

        return $nextCell;
    }

    _getFormat() {
        return this._formatWeekdayAndDay;
    }

    renovatedRenderSupported() { return true; }

    generateRenderOptions() {
        const startViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this.getStartViewDate());
        const _getTimeText = (row, column) => {
            // T410490: incorrectly displaying time slots on Linux
            const index = row % this._getRowCount();
            if(index % 2 === 0 && column === 0) {
                return dateLocalization.format(this._getTimeCellDateCore(startViewDate, row), 'shorttime');
            }
            return '';
        };

        const options = super.generateRenderOptions();
        options.cellDataGetters.push((_, rowIndex, cellIndex) => {
            return {
                value: {
                    text: _getTimeText(rowIndex, cellIndex)
                },
            };
        });

        return options;
    }
}

export default SchedulerWorkspaceVertical;
