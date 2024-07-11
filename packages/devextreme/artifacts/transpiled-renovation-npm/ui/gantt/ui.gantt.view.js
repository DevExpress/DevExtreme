"use strict";

exports.GanttView = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _gantt_importer = require("./gantt_importer");
var _uiGanttTaskArea = require("./ui.gantt.task.area.container");
var _date = _interopRequireDefault(require("../../localization/date"));
var _type = require("../../core/utils/type");
var _message = _interopRequireDefault(require("../../localization/message"));
var _string = require("../../core/utils/string");
var _core = _interopRequireDefault(require("../../localization/core"));
var _frame = require("../../animation/frame");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const visualStateKey = 'visualState';
const fullScreenModeKey = 'fullScreen';
class GanttView extends _ui.default {
  _init() {
    super._init();
    this._onSelectionChanged = this._createActionByOption('onSelectionChanged');
    this._onViewTypeChanged = this._createActionByOption('onViewTypeChanged');
    this._onScroll = this._createActionByOption('onScroll');
    this._onDialogShowing = this._createActionByOption('onDialogShowing');
    this._onPopupMenuShowing = this._createActionByOption('onPopupMenuShowing');
    this._onPopupMenuHiding = this._createActionByOption('onPopupMenuHiding');
    this._expandAll = this._createActionByOption('onExpandAll');
    this._collapseAll = this._createActionByOption('onCollapseAll');
    this._taskClick = this._createActionByOption('onTaskClick');
    this._taskDblClick = this._createActionByOption('onTaskDblClick');
    this._onAdjustControl = this._createActionByOption('onAdjustControl');
  }
  _initMarkup() {
    const GanttView = (0, _gantt_importer.getGanttViewCore)();
    this._ganttViewCore = new GanttView(this.$element().get(0), this, {
      showResources: this.option('showResources'),
      showDependencies: this.option('showDependencies'),
      taskTitlePosition: this._getTaskTitlePosition(this.option('taskTitlePosition')),
      firstDayOfWeek: this._getFirstDayOfWeek(this.option('firstDayOfWeek')),
      allowSelectTask: this.option('allowSelection'),
      startDateRange: this.option('startDateRange'),
      endDateRange: this.option('endDateRange'),
      editing: this._parseEditingSettings(this.option('editing')),
      validation: this.option('validation'),
      stripLines: {
        stripLines: this.option('stripLines')
      },
      areHorizontalBordersEnabled: this.option('showRowLines'),
      areAlternateRowsEnabled: false,
      viewType: this._getViewTypeByScaleType(this.option('scaleType')),
      viewTypeRange: this._parseViewTypeRangeSettings(this.option('scaleTypeRange')),
      cultureInfo: this._getCultureInfo(),
      taskTooltipContentTemplate: this.option('taskTooltipContentTemplate'),
      taskProgressTooltipContentTemplate: this.option('taskProgressTooltipContentTemplate'),
      taskTimeTooltipContentTemplate: this.option('taskTimeTooltipContentTemplate'),
      taskContentTemplate: this.option('taskContentTemplate'),
      sieve: this.option('sieve')
    });
    this._selectTask(this.option('selectedRowKey'));
    this.updateBarItemsState();
    const visualState = this.option(visualStateKey);
    if (visualState) {
      this._restoreStateFrameId = (0, _frame.requestAnimationFrame)(() => this._restoreVisualState(visualState));
    }
  }
  _dispose() {
    super._dispose();
    (0, _frame.cancelAnimationFrame)(this._restoreStateFrameId);
  }
  _restoreVisualState(state) {
    if (state[fullScreenModeKey]) {
      this._ganttViewCore.setFullScreenMode();
    }
  }
  _getFirstDayOfWeek(value) {
    return (0, _type.isDefined)(value) ? value : _date.default.firstDayOfWeekIndex();
  }
  getTaskAreaContainer() {
    return this._ganttViewCore.getTaskAreaContainer();
  }
  getBarManager() {
    return this._ganttViewCore.barManager;
  }
  executeCoreCommand(id) {
    const command = this._ganttViewCore.getCommandByKey(id);
    if (command) {
      command.execute();
    }
  }
  changeTaskExpanded(id, value) {
    this._ganttViewCore.changeTaskExpanded(id, value);
  }
  updateView() {
    var _this$_ganttViewCore;
    (_this$_ganttViewCore = this._ganttViewCore) === null || _this$_ganttViewCore === void 0 || _this$_ganttViewCore.updateView();
  }
  updateBarItemsState() {
    this._ganttViewCore.barManager.updateItemsState([]);
  }
  setWidth(value) {
    this._ganttViewCore.setWidth(value);
  }
  _onDimensionChanged() {
    this._ganttViewCore.onBrowserWindowResize();
  }
  _selectTask(id) {
    this._ganttViewCore.selectTaskById(id);
  }
  _update(keepExpandState) {
    var _this$_ganttViewCore2;
    (_this$_ganttViewCore2 = this._ganttViewCore) === null || _this$_ganttViewCore2 === void 0 || _this$_ganttViewCore2.updateWithDataReload(keepExpandState);
  }
  _getCultureInfo() {
    return {
      monthNames: _date.default.getMonthNames('wide'),
      dayNames: _date.default.getDayNames('wide'),
      abbrMonthNames: _date.default.getMonthNames('abbreviated'),
      abbrDayNames: _date.default.getDayNames('abbreviated'),
      quarterNames: this._getQuarterNames(),
      amText: this._getAmText(),
      pmText: this._getPmText(),
      start: _message.default.format('dxGantt-dialogStartTitle'),
      end: _message.default.format('dxGantt-dialogEndTitle'),
      progress: _message.default.format('dxGantt-dialogProgressTitle')
    };
  }
  _getAmText() {
    return this._hasAmPM() ? _date.default.getPeriodNames()[0] : '';
  }
  _getPmText() {
    return this._hasAmPM() ? _date.default.getPeriodNames()[1] : '';
  }
  _hasAmPM() {
    const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    const dateString = date.toLocaleTimeString(_core.default.locale());
    return dateString.match(/am|pm/i) || date.toString().match(/am|pm/i);
  }
  _getQuarterNames() {
    const quarterFormat = _message.default.format('dxGantt-quarter');
    if (!quarterFormat) {
      return _date.default.getQuarterNames();
    }
    return [(0, _string.format)(quarterFormat, 1), (0, _string.format)(quarterFormat, 2), (0, _string.format)(quarterFormat, 3), (0, _string.format)(quarterFormat, 4)];
  }
  _getTaskTitlePosition(value) {
    switch (value) {
      case 'outside':
        return 1;
      case 'none':
        return 2;
      default:
        return 0;
    }
  }
  _getViewTypeByScaleType(scaleType) {
    switch (scaleType) {
      case 'minutes':
        return 0;
      case 'hours':
        return 1;
      case 'sixHours':
        return 2;
      case 'days':
        return 3;
      case 'weeks':
        return 4;
      case 'months':
        return 5;
      case 'quarters':
        return 6;
      case 'years':
        return 7;
      default:
        return undefined;
    }
  }
  _parseEditingSettings(value) {
    return {
      enabled: value.enabled,
      allowDependencyDelete: value.allowDependencyDeleting,
      allowDependencyInsert: value.allowDependencyAdding,
      allowTaskDelete: value.allowTaskDeleting,
      allowTaskInsert: value.allowTaskAdding,
      allowTaskUpdate: value.allowTaskUpdating,
      allowResourceDelete: value.allowResourceDeleting,
      allowResourceInsert: value.allowResourceAdding,
      allowResourceUpdate: value.allowResourceUpdating,
      allowTaskResourceUpdate: value.allowTaskResourceUpdating
    };
  }
  _parseViewTypeRangeSettings(value) {
    return {
      min: this._getViewTypeByScaleType(value.min),
      max: this._getViewTypeByScaleType(value.max)
    };
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'width':
        super._optionChanged(args);
        this._ganttViewCore.setWidth(args.value);
        break;
      case 'height':
        this._ganttViewCore.setHeight(args.value);
        break;
      case 'tasks':
      case 'dependencies':
      case 'resources':
      case 'resourceAssignments':
        this._sieveOptions = undefined;
        this._update(true);
        break;
      case 'showResources':
        this._ganttViewCore.setShowResources(args.value);
        break;
      case 'showDependencies':
        this._ganttViewCore.setShowDependencies(args.value);
        break;
      case 'taskTitlePosition':
        this._ganttViewCore.setTaskTitlePosition(this._getTaskTitlePosition(args.value));
        break;
      case 'firstDayOfWeek':
        this._ganttViewCore.setFirstDayOfWeek(this._getFirstDayOfWeek(args.value));
        break;
      case 'startDateRange':
        this._ganttViewCore.setStartDateRange(args.value);
        break;
      case 'endDateRange':
        this._ganttViewCore.setEndDateRange(args.value);
        break;
      case 'allowSelection':
        this._ganttViewCore.setAllowSelection(args.value);
        break;
      case 'selectedRowKey':
        this._selectTask(args.value);
        break;
      case 'editing':
        this._ganttViewCore.setEditingSettings(this._parseEditingSettings(args.value));
        break;
      case 'validation':
        this._ganttViewCore.setValidationSettings(args.value);
        this._update(true);
        break;
      case 'showRowLines':
        this._ganttViewCore.setRowLinesVisible(args.value);
        break;
      case 'scaleType':
        this._ganttViewCore.setViewType(this._getViewTypeByScaleType(args.value));
        break;
      case 'scaleTypeRange':
        this._ganttViewCore.setViewTypeRange(this._getViewTypeByScaleType(args.value.min), this._getViewTypeByScaleType(args.value.max));
        break;
      case 'stripLines':
        this._ganttViewCore.setStripLines({
          stripLines: args.value
        });
        break;
      case 'taskTooltipContentTemplate':
        this._ganttViewCore.setTaskTooltipContentTemplate(args.value);
        break;
      case 'taskProgressTooltipContentTemplate':
        this._ganttViewCore.setTaskProgressTooltipContentTemplate(args.value);
        break;
      case 'taskTimeTooltipContentTemplate':
        this._ganttViewCore.setTaskTimeTooltipContentTemplate(args.value);
        break;
      case 'taskContentTemplate':
        this._ganttViewCore.setTaskContentTemplate(args.value);
        break;
      case 'sieve':
        this._sortAndFilter(args.value);
        break;
      default:
        super._optionChanged(args);
    }
  }

  // IGanttOwner
  get bars() {
    return this.option('bars');
  }
  getRowHeight() {
    return this.option('rowHeight');
  }
  getHeaderHeight() {
    return this.option('headerHeight');
  }
  getGanttTasksData() {
    const tasks = this.option('tasks');
    const sieveOptions = this.getSieveOptions();
    if (sieveOptions !== null && sieveOptions !== void 0 && sieveOptions.sievedItems && sieveOptions !== null && sieveOptions !== void 0 && sieveOptions.sieveColumn) {
      return sieveOptions.sievedItems;
    }
    return tasks;
  }
  _sortAndFilter(args) {
    this._sieveOptions = args;
    this._update(!(args !== null && args !== void 0 && args.expandTasks));
    const selectedRowKey = this.option('selectedRowKey');
    this._selectTask(selectedRowKey);
  }
  getSieveOptions() {
    return this._sieveOptions;
  }
  getGanttDependenciesData() {
    return this.option('dependencies');
  }
  getGanttResourcesData() {
    return this.option('resources');
  }
  getGanttResourceAssignmentsData() {
    return this.option('resourceAssignments');
  }
  getGanttWorkTimeRules() {
    return null;
  }
  getExternalTaskAreaContainer(element) {
    if (!this._taskAreaContainer) {
      this._taskAreaContainer = new _uiGanttTaskArea.TaskAreaContainer(element, this);
    }
    return this._taskAreaContainer;
  }
  prepareExternalTaskAreaContainer(element, info) {
    if (info !== null && info !== void 0 && info.height) {
      this._taskAreaContainer._scrollView.option('height', info.height);
    }
  }
  changeGanttTaskSelection(id, selected) {
    this._onSelectionChanged({
      id: id,
      selected: selected
    });
  }
  onGanttScroll(scrollTop) {
    this._onScroll({
      scrollTop: scrollTop
    });
  }
  showDialog(name, parameters, callback, afterClosing) {
    this._onDialogShowing({
      name: name,
      parameters: parameters,
      callback: callback,
      afterClosing: afterClosing
    });
  }
  getModelChangesListener() {
    return this.option('modelChangesListener');
  }
  getExportInfo() {
    return this.option('exportInfo');
  }
  showPopupMenu(info) {
    this._onPopupMenuShowing(info);
  }
  hidePopupMenu(info) {
    this._onPopupMenuHiding(info);
  }
  getMainElement() {
    return this.option('mainElement').get(0);
  }
  adjustControl() {
    this._onAdjustControl();
  }
  getRequireFirstLoadParentAutoCalc() {
    return this.option('validation.autoUpdateParentTasks');
  }
  collapseAll() {
    this._collapseAll();
  }
  expandAll() {
    this._expandAll();
  }
  onTaskClick(key, event) {
    this._taskClick({
      key: key,
      event: event
    });
    return true;
  }
  onTaskDblClick(key, event) {
    return this._taskDblClick({
      key: key,
      event: event
    });
  }
  onGanttViewContextMenu(event, key, type) {
    return true;
  }
  getFormattedDateText(date) {
    let result = '';
    if (date) {
      const datePart = _date.default.format(date, 'shortDate');
      const timeFormat = this._hasAmPM() ? 'hh:mm a' : 'HH:mm';
      const timePart = _date.default.format(date, timeFormat);
      result = datePart + ' ' + timePart;
    }
    return result;
  }
  destroyTemplate(container) {
    (0, _renderer.default)(container).empty();
  }
  onTaskAreaSizeChanged(info) {
    const scrollView = this._taskAreaContainer._scrollView;
    if ((0, _type.isDefined)(info === null || info === void 0 ? void 0 : info.height)) {
      const direction = (info === null || info === void 0 ? void 0 : info.height) > this._taskAreaContainer.getHeight() ? 'both' : 'horizontal';
      scrollView.option('direction', direction);
    }
  }
  updateGanttViewType(type) {
    this._onViewTypeChanged({
      type: type
    });
  }
  // export
  getTreeListTableStyle() {
    return this.callExportHelperMethod('getTreeListTableStyle');
  }
  getTreeListColCount() {
    return this.callExportHelperMethod('getTreeListColCount');
  }
  getTreeListHeaderInfo(colIndex) {
    return this.callExportHelperMethod('getTreeListHeaderInfo', colIndex);
  }
  getTreeListCellInfo(rowIndex, colIndex, key) {
    return this.callExportHelperMethod('getTreeListCellInfo', key, colIndex);
  }
  getTreeListEmptyDataCellInfo() {
    return this.callExportHelperMethod('getTreeListEmptyDataCellInfo');
  }
  callExportHelperMethod(methodName) {
    const helper = this.option('exportHelper');
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return helper[methodName](...args);
  }
  applyTasksExpandedState(state) {
    var _this$_ganttViewCore3;
    (_this$_ganttViewCore3 = this._ganttViewCore) === null || _this$_ganttViewCore3 === void 0 || _this$_ganttViewCore3.applyTasksExpandedState(state);
  }
  getVisualStateToRestore() {
    var _this$_ganttViewCore4;
    return {
      [fullScreenModeKey]: (_this$_ganttViewCore4 = this._ganttViewCore) === null || _this$_ganttViewCore4 === void 0 ? void 0 : _this$_ganttViewCore4.isInFullScreenMode()
    };
  }
}
exports.GanttView = GanttView;