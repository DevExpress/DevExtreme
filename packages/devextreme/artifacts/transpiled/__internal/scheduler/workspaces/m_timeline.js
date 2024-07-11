"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _index = require("../../scheduler/r1/components/index");
var _index2 = require("../../scheduler/r1/utils/index");
var _m_classes = require("../m_classes");
var _m_table_creator = _interopRequireDefault(require("../m_table_creator"));
var _m_utils_time_zone = _interopRequireDefault(require("../m_utils_time_zone"));
var _m_current_time_shader_horizontal = _interopRequireDefault(require("../shaders/m_current_time_shader_horizontal"));
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // NOTE: Renovation component import.
const {
  tableCreator
} = _m_table_creator.default;
const TIMELINE_CLASS = 'dx-scheduler-timeline';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';
const HORIZONTAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-horizontal-grouped';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_PANEL_WEEK_CELL_CLASS = 'dx-scheduler-header-panel-week-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';
const HORIZONTAL = 'horizontal';
const toMs = _date.default.dateToMilliseconds;
class SchedulerTimeline extends _m_work_space_indicator.default {
  constructor() {
    super(...arguments);
    this.viewDirection = 'horizontal';
  }
  get verticalGroupTableClass() {
    return GROUP_TABLE_CLASS;
  }
  get renovatedHeaderPanelComponent() {
    return _index.HeaderPanelTimelineComponent;
  }
  getGroupTableWidth() {
    return this._$sidebarTable ? (0, _size.getOuterWidth)(this._$sidebarTable) : 0;
  }
  _getTotalRowCount(groupCount) {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._getRowCount();
    }
    groupCount = groupCount || 1;
    return this._getRowCount() * groupCount;
  }
  _getFormat() {
    return 'shorttime';
  }
  _getWorkSpaceHeight() {
    if (this.option('crossScrollingEnabled') && (0, _window.hasWindow)()) {
      return (0, _position.getBoundingRect)(this._$dateTable.get(0)).height;
    }
    return (0, _position.getBoundingRect)(this.$element().get(0)).height;
  }
  _dateTableScrollableConfig() {
    const config = super._dateTableScrollableConfig();
    const timelineConfig = {
      direction: HORIZONTAL
    };
    return this.option('crossScrollingEnabled') ? config : (0, _extend.extend)(config, timelineConfig);
  }
  _needCreateCrossScrolling() {
    return true;
  }
  _headerScrollableConfig() {
    const config = super._headerScrollableConfig();
    return (0, _extend.extend)(config, {
      scrollByContent: true
    });
  }
  supportAllDayRow() {
    return false;
  }
  _getGroupHeaderContainer() {
    if (this._isHorizontalGroupedWorkSpace()) {
      return this._$thead;
    }
    return this._$sidebarTable;
  }
  _insertAllDayRowsIntoDateTable() {
    return false;
  }
  _needRenderWeekHeader() {
    return false;
  }
  _incrementDate(date) {
    date.setDate(date.getDate() + 1);
  }
  getIndicationCellCount() {
    const timeDiff = this._getTimeDiff();
    return this._calculateDurationInCells(timeDiff);
  }
  _getTimeDiff() {
    let today = this._getToday();
    const date = this._getIndicationFirstViewDate();
    const startViewDate = this.getStartViewDate();
    const dayLightOffset = _m_utils_time_zone.default.getDaylightOffsetInMs(startViewDate, today);
    if (dayLightOffset) {
      today = new Date(today.getTime() + dayLightOffset);
    }
    return today.getTime() - date.getTime();
  }
  _calculateDurationInCells(timeDiff) {
    const today = this._getToday();
    const differenceInDays = Math.floor(timeDiff / toMs('day'));
    let duration = (timeDiff - differenceInDays * toMs('day') - this.option('startDayHour') * toMs('hour')) / this.getCellDuration();
    if (today.getHours() > this.option('endDayHour')) {
      duration = this._getCellCountInDay();
    }
    if (duration < 0) {
      duration = 0;
    }
    return differenceInDays * this._getCellCountInDay() + duration;
  }
  getIndicationWidth() {
    if (this.isGroupedByDate()) {
      const cellCount = this.getIndicationCellCount();
      const integerPart = Math.floor(cellCount);
      const fractionPart = cellCount - integerPart;
      return this.getCellWidth() * (integerPart * this._getGroupCount() + fractionPart);
    }
    return this.getIndicationCellCount() * this.getCellWidth();
  }
  _isVerticalShader() {
    return false;
  }
  _isCurrentTimeHeaderCell() {
    return false;
  }
  _setTableSizes() {
    super._setTableSizes();
    const minHeight = this._getWorkSpaceMinHeight();
    (0, _size.setHeight)(this._$sidebarTable, minHeight);
    (0, _size.setHeight)(this._$dateTable, minHeight);
    this.virtualScrollingDispatcher.updateDimensions();
  }
  _getWorkSpaceMinHeight() {
    let minHeight = this._getWorkSpaceHeight();
    const workspaceContainerHeight = (0, _size.getOuterHeight)(this._$flexContainer, true);
    if (minHeight < workspaceContainerHeight) {
      minHeight = workspaceContainerHeight;
    }
    return minHeight;
  }
  _getCellCoordinatesByIndex(index) {
    return {
      columnIndex: index % this._getCellCount(),
      rowIndex: 0
    };
  }
  _getCellByCoordinates(cellCoordinates, groupIndex) {
    const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);
    return this._$dateTable.find('tr').eq(indexes.rowIndex).find('td').eq(indexes.columnIndex);
  }
  _getWorkSpaceWidth() {
    return (0, _size.getOuterWidth)(this._$dateTable, true);
  }
  _getIndicationFirstViewDate() {
    return _date.default.trimTime(new Date(this.getStartViewDate()));
  }
  _getIntervalBetween(currentDate, allDay) {
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');
    const firstViewDate = this.getStartViewDate();
    const firstViewDateTime = firstViewDate.getTime();
    const hiddenInterval = (24 - endDayHour + startDayHour) * toMs('hour');
    const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
    const apptStart = currentDate.getTime();
    const fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
    const fullDays = Math.floor(fullInterval / toMs('day'));
    const tailDuration = fullInterval - fullDays * toMs('day');
    let tailDelta = 0;
    const cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays));
    const gapBeforeAppt = apptStart - _date.default.trimTime(new Date(currentDate)).getTime();
    let result = cellCount * this.option('hoursInterval') * toMs('hour');
    if (!allDay) {
      if (currentDate.getHours() < startDayHour) {
        tailDelta = tailDuration - hiddenInterval + gapBeforeAppt;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
        tailDelta = tailDuration;
      } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
        tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs('hour'));
      } else if (!fullDays) {
        result = fullInterval;
      }
      result += tailDelta;
    }
    return result;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getWeekendsCount(argument) {
    return 0;
  }
  getAllDayContainer() {
    return null;
  }
  getTimePanelWidth() {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIntervalDuration(allDay) {
    return this.getCellDuration();
  }
  getCellMinWidth() {
    return 0;
  }
  getWorkSpaceLeftOffset() {
    return 0;
  }
  scrollToTime(hours, minutes, date) {
    const coordinates = this._getScrollCoordinates(hours, minutes, date);
    const scrollable = this.getScrollable();
    const offset = this.option('rtlEnabled') ? (0, _position.getBoundingRect)(this.getScrollableContainer().get(0)).width : 0;
    if (this.option('templatesRenderAsynchronously')) {
      setTimeout(() => {
        scrollable.scrollBy({
          left: coordinates.left - scrollable.scrollLeft() - offset,
          top: 0
        });
      });
    } else {
      scrollable.scrollBy({
        left: coordinates.left - scrollable.scrollLeft() - offset,
        top: 0
      });
    }
  }
  renderRAllDayPanel() {}
  renderRTimeTable() {}
  _renderGroupAllDayPanel() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateRenderOptions(argument) {
    const options = super.generateRenderOptions(true);
    return _extends({}, options, {
      isGenerateWeekDaysHeaderData: this._needRenderWeekHeader(),
      getDateForHeaderText: _index2.timelineWeekUtils.getDateForHeaderText
    });
  }
  // -------------
  // We need these methods for now but they are useless for renovation
  // -------------
  _init() {
    super._init();
    this.$element().addClass(TIMELINE_CLASS);
    this._$sidebarTable = (0, _renderer.default)('<div>').addClass(GROUP_TABLE_CLASS);
  }
  _getDefaultGroupStrategy() {
    return 'vertical';
  }
  _toggleGroupingDirectionClass() {
    this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace());
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      groupOrientation: 'vertical'
    });
  }
  _createWorkSpaceElements() {
    this._createWorkSpaceScrollableElements();
  }
  _toggleAllDayVisibility() {
    return (0, _common.noop)();
  }
  _changeAllDayVisibility() {
    return (0, _common.noop)();
  }
  _getDateHeaderTemplate() {
    return this.option('timeCellTemplate');
  }
  _renderView() {
    let groupCellTemplates;
    if (!this.isRenovatedRender()) {
      groupCellTemplates = this._renderGroupHeader();
    }
    this.renderWorkSpace();
    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }
    this._shader = new _m_current_time_shader_horizontal.default(this);
    this._$sidebarTable.appendTo(this._sidebarScrollable.$content());
    if (this.isRenovatedRender() && this._isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }
    this.updateHeaderEmptyCellWidth();
    this._applyCellTemplates(groupCellTemplates);
  }
  _setHorizontalGroupHeaderCellsHeight() {
    return (0, _common.noop)();
  }
  _getTimePanelCells() {
    return this.$element().find(`.${HEADER_PANEL_CELL_CLASS}:not(.${HEADER_PANEL_WEEK_CELL_CLASS})`);
  }
  _getCurrentTimePanelCellIndices() {
    const columnCountPerGroup = this._getCellCount();
    const today = this._getToday();
    const index = this.getCellIndexByDate(today);
    const {
      columnIndex: currentTimeColumnIndex
    } = this._getCellCoordinatesByIndex(index);
    if (currentTimeColumnIndex === undefined) {
      return [];
    }
    const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? this._getGroupCount() : 1;
    return [...new Array(horizontalGroupCount)].map((_, groupIndex) => columnCountPerGroup * groupIndex + currentTimeColumnIndex);
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
  _createAllDayPanelElements() {
    return (0, _common.noop)();
  }
  _renderDateHeader() {
    const $headerRow = super._renderDateHeader();
    if (this._needRenderWeekHeader()) {
      const firstViewDate = new Date(this.getStartViewDate());
      let currentDate = new Date(firstViewDate);
      const $cells = [];
      const groupCount = this._getGroupCount();
      const cellCountInDay = this._getCellCountInDay();
      const colSpan = this.isGroupedByDate() ? cellCountInDay * groupCount : cellCountInDay;
      const cellTemplate = this.option('dateCellTemplate');
      const horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? groupCount : 1;
      const cellsInGroup = this.viewDataProvider.viewDataGenerator.daysInInterval * this.option('intervalCount');
      const cellsCount = cellsInGroup * horizontalGroupCount;
      for (let templateIndex = 0; templateIndex < cellsCount; templateIndex++) {
        const $th = (0, _renderer.default)('<th>');
        const text = (0, _index2.formatWeekdayAndDay)(currentDate);
        if (cellTemplate) {
          const templateOptions = {
            model: _extends({
              text,
              date: new Date(currentDate)
            }, this._getGroupsForDateHeaderTemplate(templateIndex, colSpan)),
            container: $th,
            index: templateIndex
          };
          cellTemplate.render(templateOptions);
        } else {
          $th.text(text);
        }
        $th.addClass(HEADER_PANEL_CELL_CLASS).addClass(HEADER_PANEL_WEEK_CELL_CLASS).attr('colSpan', colSpan);
        $cells.push($th);
        if (templateIndex % cellsInGroup === cellsInGroup - 1) {
          currentDate = new Date(firstViewDate);
        } else {
          this._incrementDate(currentDate);
        }
      }
      const $row = (0, _renderer.default)('<tr>').addClass(HEADER_ROW_CLASS).append($cells);
      $headerRow.before($row);
    }
  }
  _renderIndicator(height, rtlOffset, $container, groupCount) {
    let $indicator;
    const width = this.getIndicationWidth();
    if (this.option('groupOrientation') === 'vertical') {
      $indicator = this._createIndicator($container);
      (0, _size.setHeight)($indicator, (0, _position.getBoundingRect)($container.get(0)).height);
      $indicator.css('left', rtlOffset ? rtlOffset - width : width);
    } else {
      for (let i = 0; i < groupCount; i++) {
        const offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
        $indicator = this._createIndicator($container);
        (0, _size.setHeight)($indicator, (0, _position.getBoundingRect)($container.get(0)).height);
        $indicator.css('left', rtlOffset ? rtlOffset - width - offset : width + offset);
      }
    }
  }
  _makeGroupRows(groups, groupByDate) {
    const tableCreatorStrategy = this.option('groupOrientation') === 'vertical' ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;
    return tableCreator.makeGroupedTable(tableCreatorStrategy, groups, {
      groupRowClass: _m_classes.GROUP_ROW_CLASS,
      groupHeaderRowClass: _m_classes.GROUP_ROW_CLASS,
      groupHeaderClass: this._getGroupHeaderClass.bind(this),
      groupHeaderContentClass: _m_classes.GROUP_HEADER_CONTENT_CLASS
    }, this._getCellCount() || 1, this.option('resourceCellTemplate'), this._getTotalRowCount(this._getGroupCount()), groupByDate);
  }
  // Old render methods.
  // TODO Old render: delete these methods with the old render.
  _setCurrentTimeCells() {
    const timePanelCells = this._getTimePanelCells();
    const currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
    currentTimeCellIndices.forEach(timePanelCellIndex => {
      timePanelCells.eq(timePanelCellIndex).addClass(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS);
    });
  }
  _cleanCurrentTimeCells() {
    this.$element().find(`.${_m_classes.HEADER_CURRENT_TIME_CELL_CLASS}`).removeClass(_m_classes.HEADER_CURRENT_TIME_CELL_CLASS);
  }
}
(0, _component_registrator.default)('dxSchedulerTimeline', SchedulerTimeline);
var _default = exports.default = SchedulerTimeline;