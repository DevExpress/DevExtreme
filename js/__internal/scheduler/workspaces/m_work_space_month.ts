import { noop } from '../../../core/utils/common';
import registerComponent from '../../../core/component_registrator';
import SchedulerWorkSpace from './ui.scheduler.work_space.indicator';
import dateUtils from '../../../core/utils/date';
import { getBoundingRect } from '../../../core/utils/position';
import { utils } from '../utils';
import { hasWindow } from '../../../core/utils/window';
import dxrMonthDateTableLayout from '../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j';
import {
    getViewStartByOptions,
    getCellText,
} from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/month';
import { formatWeekday } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { VIEWS } from '../constants';

const MONTH_CLASS = 'dx-scheduler-work-space-month';

const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';

const toMs = dateUtils.dateToMilliseconds;

class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
    get type() { return VIEWS.MONTH; }

    _getElementClass() {
        return MONTH_CLASS;
    }

    _getFormat() {
        return formatWeekday;
    }

    _getIntervalBetween(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    }

    _getDateGenerationOptions() {
        return {
            ...super._getDateGenerationOptions(),
            cellCountInDay: 1,
        };
    }

    // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
    // TODO: there is a test for this bug, when changing the layout, the test will also be useless
    getCellWidth() {
        return this.cache.get('cellWidth', () => {
            const DAYS_IN_WEEK = 7;

            let averageWidth = 0;
            const cells = this._getCells().slice(0, DAYS_IN_WEEK);
            cells.each((index, element) => {
                averageWidth += hasWindow() ? getBoundingRect(element).width : 0;
            });

            return cells.length === 0 ? undefined : averageWidth / DAYS_IN_WEEK;
        });
    }

    _insertAllDayRowsIntoDateTable() {
        return false;
    }
    _getCellCoordinatesByIndex(index) {
        const rowIndex = Math.floor(index / this._getCellCount());
        const columnIndex = index - this._getCellCount() * rowIndex;

        return {
            rowIndex: rowIndex,
            columnIndex,
        };
    }

    _needCreateCrossScrolling() {
        return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
    }

    _getViewStartByOptions() {
        return getViewStartByOptions(
            this.option('startDate'),
            this.option('currentDate'),
            this.option('intervalCount'),
            dateUtils.getFirstMonthDate(this.option('startDate')),
        );
    }

    _updateIndex(index) {
        return index;
    }

    isIndicationAvailable() {
        return false;
    }

    getIntervalDuration() {
        return toMs('day');
    }

    getTimePanelWidth() {
        return 0;
    }

    supportAllDayRow() {
        return false;
    }

    keepOriginalHours() {
        return true;
    }

    getWorkSpaceLeftOffset() {
        return 0;
    }

    needApplyCollectorOffset() {
        return true;
    }

    _getHeaderDate() {
        return this._getViewStartByOptions();
    }

    scrollToTime() { return noop(); }

    renderRAllDayPanel() {}

    renderRTimeTable() {}

    renderRDateTable() {
        utils.renovation.renderComponent(
            this,
            this._$dateTable,
            dxrMonthDateTableLayout,
            'renovatedDateTable',
            this._getRDateTableProps(),
        );
    }

    // -------------
    // We need these methods for now but they are useless for renovation
    // -------------

    _createWorkSpaceElements() {
        if(this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements();
        } else {
            super._createWorkSpaceElements();
        }
    }

    _toggleAllDayVisibility() { return noop(); }
    _changeAllDayVisibility() { return noop(); }

    // --------------
    // These methods should be deleted when we get rid of old render
    // --------------

    _renderTimePanel() { return noop(); }
    _renderAllDayPanel() { return noop(); }

    _setMonthClassesToCell($cell, data) {
        $cell
            .toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, data.isCurrentDate)
            .toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, data.firstDayOfMonth)
            .toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, data.otherMonth);
    }

    _createAllDayPanelElements() {}

    _renderTableBody(options) {
        options.getCellText = (rowIndex, columnIndex) => {
            const date = this.viewDataProvider.completeViewDataMap[rowIndex][columnIndex].startDate;

            return getCellText(date, this.option('intervalCount'));
        };
        options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
        options.setAdditionalClasses = this._setMonthClassesToCell.bind(this),

        super._renderTableBody(options);
    }
}

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);

export default SchedulerWorkSpaceMonth;
