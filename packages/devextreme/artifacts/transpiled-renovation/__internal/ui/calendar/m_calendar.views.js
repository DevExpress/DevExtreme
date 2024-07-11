"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _date_serialization = _interopRequireDefault(require("../../../core/utils/date_serialization"));
var _extend = require("../../../core/utils/extend");
var _date2 = _interopRequireDefault(require("../../../localization/date"));
var _m_calendar = _interopRequireDefault(require("./m_calendar.base_view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_WEEK_SELECTION_CLASS = 'dx-calendar-week-selection';
const Views = {
  month: _m_calendar.default.inherit({
    _getViewName() {
      return 'month';
    },
    _getCurrentDateFormat() {
      return 'longdate';
    },
    _getDefaultOptions() {
      return (0, _extend.extend)(this.callBase(), {
        firstDayOfWeek: 0,
        rowCount: 6,
        colCount: 7
      });
    },
    _renderImpl() {
      this.callBase();
      this._renderHeader();
    },
    _renderBody() {
      this.callBase();
      this._$table.find(`.${CALENDAR_OTHER_VIEW_CLASS}`).addClass(CALENDAR_OTHER_MONTH_CLASS);
    },
    _renderFocusTarget: _common.noop,
    _renderHeader() {
      const $headerRow = (0, _renderer.default)('<tr>');
      const $header = (0, _renderer.default)('<thead>').append($headerRow);
      this._$table.prepend($header);
      for (let colIndex = 0, colCount = this.option('colCount'); colIndex < colCount; colIndex++) {
        this._renderHeaderCell(colIndex, $headerRow);
      }
      if (this.option('showWeekNumbers')) {
        this._renderWeekHeaderCell($headerRow);
      }
    },
    _renderHeaderCell(cellIndex, $headerRow) {
      const {
        firstDayOfWeek
      } = this.option();
      const {
        full: fullCaption,
        abbreviated: abbrCaption
      } = this._getDayCaption(firstDayOfWeek + cellIndex);
      const $cell = (0, _renderer.default)('<th>')
      // @ts-expect-error
      .attr({
        scope: 'col',
        abbr: fullCaption
      }).text(abbrCaption);
      $headerRow.append($cell);
    },
    _renderWeekHeaderCell($headerRow) {
      const $weekNumberHeaderCell = (0, _renderer.default)('<th>')
      // @ts-expect-error
      .attr({
        scope: 'col',
        abbr: 'WeekNumber',
        class: 'dx-week-number-header'
      });
      $headerRow.prepend($weekNumberHeaderCell);
    },
    _renderWeekNumberCell(rowData) {
      const {
        showWeekNumbers,
        cellTemplate,
        selectionMode,
        selectWeekOnClick
      } = this.option();
      if (!showWeekNumbers) {
        return;
      }
      const weekNumber = this._getWeekNumber(rowData.prevCellDate);
      const cell = _dom_adapter.default.createElement('td');
      const $cell = (0, _renderer.default)(cell);
      cell.className = CALENDAR_WEEK_NUMBER_CELL_CLASS;
      if (selectionMode !== 'single' && selectWeekOnClick) {
        $cell.addClass(CALENDAR_WEEK_SELECTION_CLASS);
      }
      if (cellTemplate) {
        cellTemplate.render(this._prepareCellTemplateData(weekNumber, -1, $cell));
      } else {
        cell.innerHTML = weekNumber;
      }
      rowData.row.prepend(cell);
      this.setAria({
        role: 'gridcell',
        label: `Week ${weekNumber}`
      }, $cell);
    },
    _getWeekNumber(date) {
      const {
        weekNumberRule,
        firstDayOfWeek
      } = this.option();
      if (weekNumberRule === 'auto') {
        return _date.default.getWeekNumber(date, firstDayOfWeek, firstDayOfWeek === 1 ? 'firstFourDays' : 'firstDay');
      }
      return _date.default.getWeekNumber(date, firstDayOfWeek, weekNumberRule);
    },
    getNavigatorCaption() {
      return _date2.default.format(this.option('date'), 'monthandyear');
    },
    _isTodayCell(cellDate) {
      const today = this.option('_todayDate')();
      return _date.default.sameDate(cellDate, today);
    },
    _isDateOutOfRange(cellDate) {
      const minDate = this.option('min');
      const maxDate = this.option('max');
      return !_date.default.dateInRange(cellDate, minDate, maxDate, 'date');
    },
    _isOtherView(cellDate) {
      return cellDate.getMonth() !== this.option('date').getMonth();
    },
    _isStartDayOfMonth(cellDate) {
      return _date.default.sameDate(cellDate, _date.default.getFirstMonthDate(this.option('date')));
    },
    _isEndDayOfMonth(cellDate) {
      return _date.default.sameDate(cellDate, _date.default.getLastMonthDate(this.option('date')));
    },
    _getCellText(cellDate) {
      return _date2.default.format(cellDate, 'd');
    },
    _getDayCaption(day) {
      const daysInWeek = this.option('colCount');
      const dayIndex = day % daysInWeek;
      return {
        full: _date2.default.getDayNames()[dayIndex],
        abbreviated: _date2.default.getDayNames('abbreviated')[dayIndex]
      };
    },
    _getFirstCellData() {
      const {
        firstDayOfWeek
      } = this.option();
      const firstDay = _date.default.getFirstMonthDate(this.option('date'));
      // @ts-expect-error
      let firstMonthDayOffset = firstDayOfWeek - firstDay.getDay();
      const daysInWeek = this.option('colCount');
      if (firstMonthDayOffset >= 0) {
        firstMonthDayOffset -= daysInWeek;
      }
      // @ts-expect-error
      firstDay.setDate(firstDay.getDate() + firstMonthDayOffset);
      return firstDay;
    },
    _getNextCellData(date) {
      date = new Date(date);
      date.setDate(date.getDate() + 1);
      return date;
    },
    _getCellByDate(date) {
      return this._$table.find(`td[data-value='${_date_serialization.default.serializeDate(date, _date.default.getShortDateFormat())}']`);
    },
    isBoundary(date) {
      return _date.default.sameMonthAndYear(date, this.option('min')) || _date.default.sameMonthAndYear(date, this.option('max'));
    },
    _getDefaultDisabledDatesHandler(disabledDates) {
      // @ts-expect-error
      return function (args) {
        const isDisabledDate = disabledDates.some(item => _date.default.sameDate(item, args.date));
        if (isDisabledDate) {
          return true;
        }
      };
    }
  }),
  year: _m_calendar.default.inherit({
    _getViewName() {
      return 'year';
    },
    _getCurrentDateFormat() {
      return 'monthandyear';
    },
    _isTodayCell(cellDate) {
      const today = this.option('_todayDate')();
      return _date.default.sameMonthAndYear(cellDate, today);
    },
    _isDateOutOfRange(cellDate) {
      return !_date.default.dateInRange(cellDate, _date.default.getFirstMonthDate(this.option('min')), _date.default.getLastMonthDate(this.option('max')));
    },
    _isOtherView() {
      return false;
    },
    _isStartDayOfMonth() {
      return false;
    },
    _isEndDayOfMonth() {
      return false;
    },
    _getCellText(cellDate) {
      return _date2.default.getMonthNames('abbreviated')[cellDate.getMonth()];
    },
    _getFirstCellData() {
      const currentDate = this.option('date');
      const data = new Date(currentDate);
      data.setDate(1);
      data.setMonth(0);
      return data;
    },
    _getNextCellData(date) {
      date = new Date(date);
      date.setMonth(date.getMonth() + 1);
      return date;
    },
    _getCellByDate(date) {
      const foundDate = new Date(date);
      foundDate.setDate(1);
      return this._$table.find(`td[data-value='${_date_serialization.default.serializeDate(foundDate, _date.default.getShortDateFormat())}']`);
    },
    getNavigatorCaption() {
      return _date2.default.format(this.option('date'), 'yyyy');
    },
    isBoundary(date) {
      return _date.default.sameYear(date, this.option('min')) || _date.default.sameYear(date, this.option('max'));
    },
    _renderWeekNumberCell: _common.noop
  }),
  decade: _m_calendar.default.inherit({
    _getViewName() {
      return 'decade';
    },
    _isTodayCell(cellDate) {
      const today = this.option('_todayDate')();
      return _date.default.sameYear(cellDate, today);
    },
    _isDateOutOfRange(cellDate) {
      const min = this.option('min');
      const max = this.option('max');
      return !_date.default.dateInRange(cellDate.getFullYear(), min && min.getFullYear(), max && max.getFullYear());
    },
    _isOtherView(cellDate) {
      const date = new Date(cellDate);
      date.setMonth(1);
      return !_date.default.sameDecade(date, this.option('date'));
    },
    _isStartDayOfMonth() {
      return false;
    },
    _isEndDayOfMonth() {
      return false;
    },
    _getCellText(cellDate) {
      return _date2.default.format(cellDate, 'yyyy');
    },
    _getFirstCellData() {
      const year = _date.default.getFirstYearInDecade(this.option('date')) - 1;
      return _date.default.createDateWithFullYear(year, 0, 1);
    },
    _getNextCellData(date) {
      date = new Date(date);
      date.setFullYear(date.getFullYear() + 1);
      return date;
    },
    getNavigatorCaption() {
      const currentDate = this.option('date');
      const firstYearInDecade = _date.default.getFirstYearInDecade(currentDate);
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      startDate.setFullYear(firstYearInDecade);
      endDate.setFullYear(firstYearInDecade + 9);
      return `${_date2.default.format(startDate, 'yyyy')}-${_date2.default.format(endDate, 'yyyy')}`;
    },
    _isValueOnCurrentView(currentDate, value) {
      return _date.default.sameDecade(currentDate, value);
    },
    _getCellByDate(date) {
      const foundDate = new Date(date);
      foundDate.setDate(1);
      foundDate.setMonth(0);
      return this._$table.find(`td[data-value='${_date_serialization.default.serializeDate(foundDate, _date.default.getShortDateFormat())}']`);
    },
    isBoundary(date) {
      return _date.default.sameDecade(date, this.option('min')) || _date.default.sameDecade(date, this.option('max'));
    },
    _renderWeekNumberCell: _common.noop
  }),
  century: _m_calendar.default.inherit({
    _getViewName() {
      return 'century';
    },
    _isTodayCell(cellDate) {
      const today = this.option('_todayDate')();
      return _date.default.sameDecade(cellDate, today);
    },
    _isDateOutOfRange(cellDate) {
      const decade = _date.default.getFirstYearInDecade(cellDate);
      const minDecade = _date.default.getFirstYearInDecade(this.option('min'));
      const maxDecade = _date.default.getFirstYearInDecade(this.option('max'));
      return !_date.default.dateInRange(decade, minDecade, maxDecade);
    },
    _isOtherView(cellDate) {
      const date = new Date(cellDate);
      date.setMonth(1);
      return !_date.default.sameCentury(date, this.option('date'));
    },
    _isStartDayOfMonth() {
      return false;
    },
    _isEndDayOfMonth() {
      return false;
    },
    _getCellText(cellDate) {
      const startDate = _date2.default.format(cellDate, 'yyyy');
      const endDate = new Date(cellDate);
      endDate.setFullYear(endDate.getFullYear() + 9);
      return `${startDate} - ${_date2.default.format(endDate, 'yyyy')}`;
    },
    _getFirstCellData() {
      const decade = _date.default.getFirstDecadeInCentury(this.option('date')) - 10;
      return _date.default.createDateWithFullYear(decade, 0, 1);
    },
    _getNextCellData(date) {
      date = new Date(date);
      date.setFullYear(date.getFullYear() + 10);
      return date;
    },
    _getCellByDate(date) {
      const foundDate = new Date(date);
      foundDate.setDate(1);
      foundDate.setMonth(0);
      foundDate.setFullYear(_date.default.getFirstYearInDecade(foundDate));
      return this._$table.find(`td[data-value='${_date_serialization.default.serializeDate(foundDate, _date.default.getShortDateFormat())}']`);
    },
    getNavigatorCaption() {
      const currentDate = this.option('date');
      const firstDecadeInCentury = _date.default.getFirstDecadeInCentury(currentDate);
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      startDate.setFullYear(firstDecadeInCentury);
      endDate.setFullYear(firstDecadeInCentury + 99);
      return `${_date2.default.format(startDate, 'yyyy')}-${_date2.default.format(endDate, 'yyyy')}`;
    },
    isBoundary(date) {
      return _date.default.sameCentury(date, this.option('min')) || _date.default.sameCentury(date, this.option('max'));
    },
    _renderWeekNumberCell: _common.noop
  })
};
var _default = exports.default = Views;