"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _element = require("../../../core/element");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _size = require("../../../core/utils/size");
var _date2 = _interopRequireDefault(require("../../../localization/date"));
var _index = require("../../scheduler/r1/utils/index");
var _m_classes = require("../m_classes");
var _m_constants = require("../m_constants");
var _m_table_creator = _interopRequireDefault(require("../m_table_creator"));
var _m_utils = require("../resources/m_utils");
var _m_work_space = _interopRequireDefault(require("./m_work_space"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  tableCreator
} = _m_table_creator.default;
const AGENDA_CLASS = 'dx-scheduler-agenda';
const AGENDA_DATE_CLASS = 'dx-scheduler-agenda-date';
const GROUP_TABLE_CLASS = 'dx-scheduler-group-table';
const TIME_PANEL_ROW_CLASS = 'dx-scheduler-time-panel-row';
const TIME_PANEL_CELL_CLASS = 'dx-scheduler-time-panel-cell';
const NODATA_CONTAINER_CLASS = 'dx-scheduler-agenda-nodata';
const LAST_ROW_CLASS = 'dx-scheduler-date-table-last-row';
const INNER_CELL_MARGIN = 5;
const OUTER_CELL_MARGIN = 20;
class SchedulerAgenda extends _m_work_space.default {
  get type() {
    return _m_constants.VIEWS.AGENDA;
  }
  get renderingStrategy() {
    return this.invoke('getLayoutManager').getRenderingStrategyInstance();
  }
  get appointmentDataProvider() {
    return this.option('getAppointmentDataProvider')();
  }
  getStartViewDate() {
    return this._startViewDate;
  }
  _init() {
    super._init();
    this._activeStateUnit = undefined;
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      // Number | "month"
      agendaDuration: 7,
      rowHeight: 60,
      noDataText: ''
    });
  }
  _optionChanged(args) {
    const {
      name
    } = args;
    const {
      value
    } = args;
    switch (name) {
      case 'agendaDuration':
        break;
      case 'noDataText':
      case 'rowHeight':
        this._recalculateAgenda(this._rows);
        break;
      case 'groups':
        if (!value || !value.length) {
          if (this._$groupTable) {
            this._$groupTable.remove();
            this._$groupTable = null;
            this._detachGroupCountClass();
          }
        } else if (!this._$groupTable) {
          this._initGroupTable();
          this._dateTableScrollable.$content().prepend(this._$groupTable);
        }
        super._optionChanged(args);
        break;
      default:
        super._optionChanged(args);
    }
  }
  _renderFocusState() {
    return (0, _common.noop)();
  }
  _renderFocusTarget() {
    return (0, _common.noop)();
  }
  _cleanFocusState() {
    return (0, _common.noop)();
  }
  supportAllDayRow() {
    return false;
  }
  _isVerticalGroupedWorkSpace() {
    return false;
  }
  _getElementClass() {
    return AGENDA_CLASS;
  }
  _calculateStartViewDate() {
    return _index.agendaUtils.calculateStartViewDate(this.option('currentDate'), this.option('startDayHour'));
  }
  _getRowCount() {
    return this.option('agendaDuration');
  }
  _getCellCount() {
    return 1;
  }
  _getTimePanelRowCount() {
    return this.option('agendaDuration');
  }
  _renderAllDayPanel() {
    return (0, _common.noop)();
  }
  _toggleAllDayVisibility() {
    return (0, _common.noop)();
  }
  _initWorkSpaceUnits() {
    this._initGroupTable();
    this._$timePanel = (0, _renderer.default)('<table>').addClass(_m_classes.TIME_PANEL_CLASS);
    this._$dateTable = (0, _renderer.default)('<table>').addClass(_m_classes.DATE_TABLE_CLASS);
    this._$dateTableScrollableContent = (0, _renderer.default)('<div>').addClass('dx-scheduler-date-table-scrollable-content');
    this._$dateTableContainer = (0, _renderer.default)('<div>').addClass('dx-scheduler-date-table-container');
  }
  _initGroupTable() {
    const groups = this.option('groups');
    if (groups && groups.length) {
      this._$groupTable = (0, _renderer.default)('<table>').addClass(GROUP_TABLE_CLASS);
    }
  }
  _renderView() {
    this._startViewDate = this._calculateStartViewDate();
    this._rows = [];
    this._initPositionHelper();
  }
  _recalculateAgenda(rows) {
    let cellTemplates = [];
    this._cleanView();
    if (this._rowsIsEmpty(rows)) {
      this._renderNoData();
      return;
    }
    this._rows = rows;
    if (this._$groupTable) {
      cellTemplates = this._renderGroupHeader();
      this._setGroupHeaderCellsHeight();
    }
    this._renderTimePanel();
    this._renderDateTable();
    this.invoke('onAgendaReady', rows);
    this._applyCellTemplates(cellTemplates);
    this._dateTableScrollable.update();
  }
  _renderNoData() {
    this._$noDataContainer = (0, _renderer.default)('<div>').addClass(NODATA_CONTAINER_CLASS).html(this.option('noDataText'));
    this._dateTableScrollable.$content().append(this._$noDataContainer);
  }
  _setTableSizes() {
    return (0, _common.noop)();
  }
  _toggleHorizontalScrollClass() {
    return (0, _common.noop)();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createCrossScrollingConfig(argument) {
    return (0, _common.noop)();
  }
  _setGroupHeaderCellsHeight() {
    const $cells = this._getGroupHeaderCells().filter((_, element) => !element.getAttribute('rowSpan'));
    const rows = this._removeEmptyRows(this._rows);
    if (!rows.length) {
      return;
    }
    for (let i = 0; i < $cells.length; i++) {
      const $cellContent = $cells.eq(i).find('.dx-scheduler-group-header-content');
      (0, _size.setOuterHeight)($cellContent, this._getGroupRowHeight(rows[i]));
    }
  }
  _rowsIsEmpty(rows) {
    let result = true;
    for (let i = 0; i < rows.length; i++) {
      const groupRow = rows[i];
      for (let j = 0; j < groupRow.length; j++) {
        if (groupRow[j]) {
          result = false;
          break;
        }
      }
    }
    return result;
  }
  _attachGroupCountClass() {
    const className = (0, _index.getVerticalGroupCountClass)(this.option('groups'));
    this.$element().addClass(className);
  }
  _removeEmptyRows(rows) {
    const result = [];
    const isEmpty = function (data) {
      return !data.some(value => value > 0);
    };
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length && !isEmpty(rows[i])) {
        result.push(rows[i]);
      }
    }
    return result;
  }
  _getGroupHeaderContainer() {
    return this._$groupTable;
  }
  _makeGroupRows() {
    const tree = (0, _m_utils.createReducedResourcesTree)(this.option('loadedResources'), (field, action) => (0, _m_utils.getDataAccessors)(this.option('getResourceDataAccessors')(), field, action), this.option('getFilteredItems')());
    const cellTemplate = this.option('resourceCellTemplate');
    const getGroupHeaderContentClass = _m_classes.GROUP_HEADER_CONTENT_CLASS;
    const cellTemplates = [];
    const table = tableCreator.makeGroupedTableFromJSON(tableCreator.VERTICAL, tree, {
      cellTag: 'th',
      groupTableClass: GROUP_TABLE_CLASS,
      groupRowClass: _m_classes.GROUP_ROW_CLASS,
      groupCellClass: this._getGroupHeaderClass(),
      groupCellCustomContent(cell, cellTextElement, index, data) {
        const container = _dom_adapter.default.createElement('div');
        container.className = getGroupHeaderContentClass;
        if (cellTemplate && cellTemplate.render) {
          cellTemplates.push(cellTemplate.render.bind(cellTemplate, {
            model: {
              data: data.data,
              id: data.value,
              color: data.color,
              text: cellTextElement.textContent
            },
            container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
            index
          }));
        } else {
          const contentWrapper = _dom_adapter.default.createElement('div');
          contentWrapper.appendChild(cellTextElement);
          container.appendChild(contentWrapper);
        }
        cell.appendChild(container);
      },
      cellTemplate
    });
    return {
      elements: (0, _renderer.default)(table).find(`.${_m_classes.GROUP_ROW_CLASS}`),
      cellTemplates
    };
  }
  _cleanView() {
    this._$dateTable.empty();
    this._$timePanel.empty();
    if (this._$groupTable) {
      this._$groupTable.empty();
    }
    if (this._$noDataContainer) {
      this._$noDataContainer.empty();
      this._$noDataContainer.remove();
      delete this._$noDataContainer;
    }
  }
  _createWorkSpaceElements() {
    this._createWorkSpaceStaticElements();
  }
  _createWorkSpaceStaticElements() {
    this._$dateTableContainer.append(this._$dateTable);
    this._dateTableScrollable.$content().append(this._$dateTableScrollableContent);
    if (this._$groupTable) {
      this._$dateTableScrollableContent.prepend(this._$groupTable);
    }
    this._$dateTableScrollableContent.append(this._$timePanel, this._$dateTableContainer);
    this.$element().append(this._dateTableScrollable.$element());
  }
  _renderDateTable() {
    this._renderTableBody({
      container: (0, _element.getPublicElement)(this._$dateTable),
      rowClass: _m_classes.DATE_TABLE_ROW_CLASS,
      cellClass: this._getDateTableCellClass()
    });
  }
  _attachTablesEvents() {
    return (0, _common.noop)();
  }
  _attachEvents() {
    return (0, _common.noop)();
  }
  _cleanCellDataCache() {
    return (0, _common.noop)();
  }
  isIndicationAvailable() {
    return false;
  }
  _prepareCellTemplateOptions(text, date, rowIndex, $cell) {
    const groupsOpt = this.option('groups');
    const groups = {};
    const isGroupedView = !!groupsOpt.length;
    const path = isGroupedView && (0, _m_utils.getPathToLeaf)(rowIndex, groupsOpt) || [];
    path.forEach((resourceValue, resourceIndex) => {
      const resourceName = groupsOpt[resourceIndex].name;
      groups[resourceName] = resourceValue;
    });
    const groupIndex = isGroupedView ? this._getGroupIndexByResourceId(groups) : undefined;
    return {
      model: {
        text,
        date,
        groups,
        groupIndex
      },
      container: (0, _element.getPublicElement)($cell),
      index: rowIndex
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderTableBody(options, delayCellTemplateRendering) {
    const cellTemplates = [];
    const cellTemplateOpt = options.cellTemplate;
    this._$rows = [];
    let i;
    const fillTableBody = function (rowIndex, rowSize) {
      if (rowSize) {
        let date;
        let cellDateNumber;
        let cellDayName;
        const $row = (0, _renderer.default)('<tr>');
        const $td = (0, _renderer.default)('<td>');
        (0, _size.setHeight)($td, this._getRowHeight(rowSize));
        if (options.getStartDate) {
          date = options.getStartDate && options.getStartDate(rowIndex);
          cellDateNumber = _date2.default.format(date, 'd');
          cellDayName = _date2.default.format(date, _index.formatWeekday);
        }
        if (cellTemplateOpt && cellTemplateOpt.render) {
          const templateOptions = this._prepareCellTemplateOptions(`${cellDateNumber} ${cellDayName}`, date, i, $td);
          cellTemplates.push(cellTemplateOpt.render.bind(cellTemplateOpt, templateOptions));
        } else if (cellDateNumber && cellDayName) {
          $td.addClass(AGENDA_DATE_CLASS).text(`${cellDateNumber} ${cellDayName}`);
        }
        if (options.rowClass) {
          $row.addClass(options.rowClass);
        }
        if (options.cellClass) {
          $td.addClass(options.cellClass);
        }
        $row.append($td);
        this._$rows.push($row);
      }
    }.bind(this);
    for (i = 0; i < this._rows.length; i++) {
      (0, _iterator.each)(this._rows[i], fillTableBody);
      this._setLastRowClass();
    }
    (0, _renderer.default)(options.container).append((0, _renderer.default)('<tbody>').append(this._$rows));
    this._applyCellTemplates(cellTemplates);
  }
  _setLastRowClass() {
    if (this._rows.length > 1 && this._$rows.length) {
      const $lastRow = this._$rows[this._$rows.length - 1];
      $lastRow.addClass(LAST_ROW_CLASS);
    }
  }
  _renderTimePanel() {
    this._renderTableBody({
      container: (0, _element.getPublicElement)(this._$timePanel),
      rowCount: this._getTimePanelRowCount(),
      cellCount: 1,
      rowClass: TIME_PANEL_ROW_CLASS,
      cellClass: TIME_PANEL_CELL_CLASS,
      cellTemplate: this.option('dateCellTemplate'),
      getStartDate: this._getTimePanelStartDate.bind(this)
    });
  }
  _getTimePanelStartDate(rowIndex) {
    const current = new Date(this.option('currentDate'));
    const cellDate = new Date(current.setDate(current.getDate() + rowIndex));
    return cellDate;
  }
  _getRowHeight(rowSize) {
    const baseHeight = this.option('rowHeight');
    const innerOffset = (rowSize - 1) * INNER_CELL_MARGIN;
    return rowSize ? baseHeight * rowSize + innerOffset + OUTER_CELL_MARGIN : 0;
  }
  _getGroupRowHeight(groupRows) {
    // TODO: hotfix
    if (!groupRows) {
      return;
    }
    let result = 0;
    for (let i = 0; i < groupRows.length; i++) {
      result += this._getRowHeight(groupRows[i]);
    }
    return result;
  }
  _calculateRows(appointments) {
    return this.renderingStrategy.calculateRows(appointments, this.option('agendaDuration'), this.option('currentDate'));
  }
  onDataSourceChanged(appointments) {
    super.onDataSourceChanged();
    this._renderView();
    const rows = this._calculateRows(appointments);
    this._recalculateAgenda(rows);
  }
  getAgendaVerticalStepHeight() {
    return this.option('rowHeight');
  }
  getEndViewDate() {
    const currentDate = new Date(this.option('currentDate'));
    const agendaDuration = this.option('agendaDuration');
    currentDate.setHours(this.option('endDayHour'));
    const result = currentDate.setDate(currentDate.getDate() + agendaDuration - 1) - 60000;
    return new Date(result);
  }
  getEndViewDateByEndDayHour() {
    return this.getEndViewDate();
  }
  getCellDataByCoordinates() {
    return {
      startDate: null,
      endDate: null
    };
  }
  updateScrollPosition(date) {
    const newDate = this.timeZoneCalculator.createDate(date, {
      path: 'toGrid'
    });
    const bounds = this.getVisibleBounds();
    const startDateHour = newDate.getHours();
    const startDateMinutes = newDate.getMinutes();
    if (this.needUpdateScrollPosition(startDateHour, startDateMinutes, bounds, newDate)) {
      this.scrollToTime(startDateHour, startDateMinutes, newDate);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  needUpdateScrollPosition(hours, minutes, bounds, newData) {
    let isUpdateNeeded = false;
    if (hours < bounds.top.hours || hours > bounds.bottom.hours) {
      isUpdateNeeded = true;
    }
    if (hours === bounds.top.hours && minutes < bounds.top.minutes) {
      isUpdateNeeded = true;
    }
    if (hours === bounds.bottom.hours && minutes > bounds.top.minutes) {
      isUpdateNeeded = true;
    }
    return isUpdateNeeded;
  }
  renovatedRenderSupported() {
    return false;
  }
  _setSelectedCellsByCellData() {}
  _getIntervalDuration() {
    return _date.default.dateToMilliseconds('day') * this.option('intervalCount');
  }
  getDOMElementsMetaData() {
    return {
      dateTableCellsMeta: [[{}]],
      allDayPanelCellsMeta: [{}]
    };
  }
}
(0, _component_registrator.default)('dxSchedulerAgenda', SchedulerAgenda);
var _default = exports.default = SchedulerAgenda;