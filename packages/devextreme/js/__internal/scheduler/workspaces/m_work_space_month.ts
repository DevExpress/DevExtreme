import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { getBoundingRect } from '@js/core/utils/position';
import { hasWindow } from '@js/core/utils/window';

// NOTE: Renovation component import.
// @ts-expect-error
import dxrMonthDateTableLayout from '../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j';
import { formatWeekday, monthUtils } from '../__migration/utils/index';
import { VIEWS } from '../m_constants';
import { utils } from '../m_utils';
import SchedulerWorkSpace from './m_work_space_indicator';

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

    return currentDate.getTime() - (firstViewDate.getTime() - (this.option('startDayHour') as any) * 3600000) - timeZoneOffset;
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
      rowIndex,
      columnIndex,
    };
  }

  _needCreateCrossScrolling() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
  }

  _getViewStartByOptions() {
    return monthUtils.getViewStartByOptions(
      this.option('startDate') as any,
      this.option('currentDate') as any,
      this.option('intervalCount') as any,
      dateUtils.getFirstMonthDate(this.option('startDate')) as any,
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
    if (this._isVerticalGroupedWorkSpace()) {
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

      return monthUtils.getCellText(date, this.option('intervalCount') as any);
    };
    options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
    options.setAdditionalClasses = this._setMonthClassesToCell.bind(this);

    super._renderTableBody(options);
  }
}

registerComponent('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth as any);

export default SchedulerWorkSpaceMonth;
