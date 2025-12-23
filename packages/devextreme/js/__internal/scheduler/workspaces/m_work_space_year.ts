import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';

import { VIEWS } from '../utils/options/constants_view';
import SchedulerWorkSpace from './m_work_space';
import YearCalendar from './m_year_calendar';

const YEAR_CLASS = 'dx-scheduler-work-space-year';
const YEAR_CALENDARS_CONTAINER_CLASS = 'dx-scheduler-year-calendars-container';
const YEAR_CALENDAR_ITEM_CLASS = 'dx-scheduler-year-calendar-item';

class SchedulerWorkSpaceYear extends SchedulerWorkSpace {
  _calendars: any[] = [];

  _$workSpace: any;

  get type() { return VIEWS.YEAR; }

  _init() {
    super._init();
    if (!this._calendars) {
      this._calendars = [];
    }
  }

  _getElementClass() {
    return YEAR_CLASS;
  }

  _getViewStartByOptions() {
    const currentDate = this.option('currentDate') as Date;
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    return dateUtils.trimTime(yearStart);
  }

  getStartViewDate() {
    return this._getViewStartByOptions();
  }

  getEndViewDate() {
    const yearStart = this.getStartViewDate();
    return new Date(yearStart.getFullYear() + 1, 0, 0, 23, 59, 59);
  }

  getDateRange() {
    return [this.getStartViewDate(), this.getEndViewDate()];
  }

  _createWorkSpaceElements() {
    if (this._$dateTable && this._$dateTable.length) {
      this._disposeCalendars();
      this._$dateTable.remove();
    }

    if (!this._$workSpace) {
      this._$workSpace = $('<div>').addClass('dx-scheduler-work-space');
      this.$element().append(this._$workSpace);
    }

    const $container = $('<div>').addClass(YEAR_CALENDARS_CONTAINER_CLASS);
    this._calendars = [];

    const currentYear = this.getStartViewDate().getFullYear();
    const firstDayOfWeek = this.option('firstDayOfWeek') as number;

    for (let month = 0; month < 12; month++) {
      const $calendarItem = $('<div>').addClass(YEAR_CALENDAR_ITEM_CLASS);
      const monthDate = new Date(currentYear, month, 1);

      const calendarOptions: any = {
        date: monthDate,
        firstDayOfWeek,
        showMonthLabel: true,
        onCellClick: (e: any) => {
          const clickedDate = e.value;
          if (clickedDate instanceof Date) {
            this._onCalendarDateClick(clickedDate);
          }
        },
      };

      // @ts-expect-error
      const calendar = this._createComponent($calendarItem, YearCalendar, calendarOptions);
      this._calendars.push(calendar);
      $container.append($calendarItem);
    }

    this._$dateTable = $container;
    this._$dateTable.appendTo(this._$workSpace);
  }

  _onCalendarDateClick(date: Date) {
    const onDateClick = this.option('onDateClick') as any;
    if (onDateClick) {
      onDateClick(date);
    }
  }

  getWorkArea() {
    return this._$workSpace || this.$element();
  }

  _renderView() {
    this._createWorkSpaceElements();
  }

  _renderTimePanel() { return noop(); }

  _renderAllDayPanel() { return noop(); }

  _renderDateTable() { return noop(); }

  _createAllDayPanelElements() {}

  _insertAllDayRowsIntoDateTable() { return false; }

  supportAllDayRow() {
    return false;
  }

  keepOriginalHours() {
    return true;
  }

  getTimePanelWidth() {
    return 0;
  }

  getWorkSpaceLeftOffset() {
    return 0;
  }

  isIndicationAvailable() {
    return false;
  }

  getIntervalDuration() {
    return dateUtils.dateToMilliseconds('day');
  }

  _getHeaderDate() {
    return this._getViewStartByOptions();
  }

  _getCellCoordinatesByIndex() {
    return { rowIndex: 0, columnIndex: 0 };
  }

  _getCellCount() {
    return 0;
  }

  _getCells() {
    return $();
  }

  getCellWidth() {
    return 0;
  }

  getCellHeight() {
    return 0;
  }

  _needCreateCrossScrolling() {
    return false;
  }

  _optionChanged(args) {
    const { name } = args;

    if (name === 'currentDate' || name === 'firstDayOfWeek') {
      this._disposeCalendars();
      this._renderView();
    } else {
      super._optionChanged(args);
    }
  }

  _disposeCalendars() {
    if (this._calendars && Array.isArray(this._calendars)) {
      this._calendars.forEach((calendar) => {
        calendar?.dispose();
      });
    }
    this._calendars = [];
    if (this._$dateTable) {
      this._$dateTable.empty();
    }
  }

  _dispose() {
    this._disposeCalendars();
    super._dispose();
  }
}

registerComponent('dxSchedulerWorkSpaceYear', SchedulerWorkSpaceYear as any);

export default SchedulerWorkSpaceYear;
