"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _position = require("../../../core/utils/position");
var _window = require("../../../core/utils/window");
var _index = require("../../scheduler/r1/components/index");
var _index2 = require("../../scheduler/r1/utils/index");
var _m_constants = require("../m_constants");
var _m_utils = require("../m_utils");
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // NOTE: Renovation component import.
const MONTH_CLASS = 'dx-scheduler-work-space-month';
const DATE_TABLE_CURRENT_DATE_CLASS = 'dx-scheduler-date-table-current-date';
const DATE_TABLE_CELL_TEXT_CLASS = 'dx-scheduler-date-table-cell-text';
const DATE_TABLE_FIRST_OF_MONTH_CLASS = 'dx-scheduler-date-table-first-of-month';
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = 'dx-scheduler-date-table-other-month';
const toMs = _date.default.dateToMilliseconds;
class SchedulerWorkSpaceMonth extends _m_work_space_indicator.default {
  get type() {
    return _m_constants.VIEWS.MONTH;
  }
  _getElementClass() {
    return MONTH_CLASS;
  }
  _getFormat() {
    return _index2.formatWeekday;
  }
  _getIntervalBetween(currentDate) {
    const firstViewDate = this.getStartViewDate();
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
  }
  _getDateGenerationOptions() {
    return _extends({}, super._getDateGenerationOptions(), {
      cellCountInDay: 1
    });
  }
  // TODO: temporary fix, in the future, if we replace table layout on div layout, getCellWidth method need remove. Details in T712431
  // TODO: there is a test for this bug, when changing the layout, the test will also be useless
  getCellWidth() {
    return this.cache.get('cellWidth', () => {
      const DAYS_IN_WEEK = 7;
      let averageWidth = 0;
      const cells = this._getCells().slice(0, DAYS_IN_WEEK);
      cells.each((index, element) => {
        averageWidth += (0, _window.hasWindow)() ? (0, _position.getBoundingRect)(element).width : 0;
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
      columnIndex
    };
  }
  _needCreateCrossScrolling() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.option('crossScrollingEnabled') || this._isVerticalGroupedWorkSpace();
  }
  _getViewStartByOptions() {
    return _index2.monthUtils.getViewStartByOptions(this.option('startDate'), this.option('currentDate'), this.option('intervalCount'), _date.default.getFirstMonthDate(this.option('startDate')));
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
  scrollToTime() {
    return (0, _common.noop)();
  }
  renderRAllDayPanel() {}
  renderRTimeTable() {}
  renderRDateTable() {
    _m_utils.utils.renovation.renderComponent(this, this._$dateTable, _index.DateTableMonthComponent, 'renovatedDateTable', this._getRDateTableProps());
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
  _toggleAllDayVisibility() {
    return (0, _common.noop)();
  }
  _changeAllDayVisibility() {
    return (0, _common.noop)();
  }
  // --------------
  // These methods should be deleted when we get rid of old render
  // --------------
  _renderTimePanel() {
    return (0, _common.noop)();
  }
  _renderAllDayPanel() {
    return (0, _common.noop)();
  }
  _setMonthClassesToCell($cell, data) {
    $cell.toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, data.isCurrentDate).toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, data.firstDayOfMonth).toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, data.otherMonth);
  }
  _createAllDayPanelElements() {}
  _renderTableBody(options) {
    options.getCellText = (rowIndex, columnIndex) => {
      const date = this.viewDataProvider.completeViewDataMap[rowIndex][columnIndex].startDate;
      return _index2.monthUtils.getCellText(date, this.option('intervalCount'));
    };
    options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
    options.setAdditionalClasses = this._setMonthClassesToCell.bind(this);
    super._renderTableBody(options);
  }
}
(0, _component_registrator.default)('dxSchedulerWorkSpaceMonth', SchedulerWorkSpaceMonth);
var _default = exports.default = SchedulerWorkSpaceMonth;