import registerComponent from '../../../core/component_registrator';
import dateUtils from '../../../core/utils/date';
import dateLocalization from '../../../localization/date';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';

const WEEK_CLASS = 'dx-scheduler-work-space-week';

const toMs = dateUtils.dateToMilliseconds;
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
    _getElementClass() {
        return WEEK_CLASS;
    }

    _getRowCount() {
        return this._getCellCountInDay();
    }

    _getCellCount() {
        return 7 * this.option('intervalCount');
    }

    _getDateByIndex(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    }

    _getFormat() {
        return this._formatWeekdayAndDay;
    }

    _getStartViewDate() {
        return dateUtils.getFirstWeekDate(this.option('startDate'), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
    }

    _getIntervalDuration() {
        return toMs('day') * 7 * this.option('intervalCount');
    }

    _getRightCell(isMultiSelection) {
        if(!isMultiSelection) {
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
        if(!isMultiSelection) {
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

    getPositionShift(timeShift, isAllDay) {
        if(!isAllDay && this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return {
                top: 0,
                left: 0,
                cellPosition: 0
            };
        }
        return super.getPositionShift(timeShift, isAllDay);
    }

    _isApplyCompactAppointmentOffset() {
        if(this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
            return false;
        }
        return super._isApplyCompactAppointmentOffset();
    }
}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);

module.exports = SchedulerWorkSpaceWeek;
