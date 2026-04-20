/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  cancelAnimationFrame,
  requestAnimationFrame,
} from '@js/common/core/animation/frame';
import coreLocalization from '@js/common/core/localization/core';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { format } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import { getGlobalFormatByDataType } from '@ts/core/m_global_format_config';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import { getGanttViewCore } from '@ts/ui/gantt/gantt_importer';
import { TaskAreaContainer } from '@ts/ui/gantt/ui.gantt.task.area.container';

const visualStateKey = 'visualState';
const fullScreenModeKey = 'fullScreen';

interface GanttViewProperties extends WidgetProperties {
  onSelectionChanged?: Function;
  onViewTypeChanged?: Function;
  onScroll?: Function;
  onDialogShowing?: Function;
  onPopupMenuShowing?: Function;
  onPopupMenuHiding?: Function;
  onExpandAll?: Function;
  onCollapseAll?: Function;
  onTaskClick?: Function;
  onTaskDblClick?: Function;
  onAdjustControl?: Function;
}

export class GanttView extends Widget<GanttViewProperties> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _ganttViewCore?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onSelectionChanged?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onViewTypeChanged?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onScroll?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onDialogShowing?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onPopupMenuShowing?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onPopupMenuHiding?: (e: any) => void;

  _expandAll?: () => void;

  _collapseAll?: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _taskClick?: (e: any) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _taskDblClick?: (e: any) => void;

  _onAdjustControl?: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _restoreStateFrameId?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _sieveOptions?: any;

  _taskAreaContainer?: TaskAreaContainer;

  _init(): void {
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

  _initMarkup(): void {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const GanttView = getGanttViewCore();
    this._ganttViewCore = new GanttView(this.$element().get(0), this, {
      showResources: this.option('showResources'),
      showDependencies: this.option('showDependencies'),
      taskTitlePosition: this._getTaskTitlePosition(
        this.option('taskTitlePosition'),
      ),
      firstDayOfWeek: this._getFirstDayOfWeek(this.option('firstDayOfWeek')),
      allowSelectTask: this.option('allowSelection'),
      startDateRange: this.option('startDateRange'),
      endDateRange: this.option('endDateRange'),
      editing: this._parseEditingSettings(this.option('editing')),
      validation: this.option('validation'),
      stripLines: {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        stripLines: this.option('stripLines')?.map((item) => ({ ...item })),
      },
      areHorizontalBordersEnabled: this.option('showRowLines'),
      areAlternateRowsEnabled: false,
      viewType: this._getViewTypeByScaleType(this.option('scaleType')),
      viewTypeRange: this._parseViewTypeRangeSettings(
        this.option('scaleTypeRange'),
      ),
      cultureInfo: this._getCultureInfo(),
      taskTooltipContentTemplate: this.option('taskTooltipContentTemplate'),
      taskProgressTooltipContentTemplate: this.option(
        'taskProgressTooltipContentTemplate',
      ),
      taskTimeTooltipContentTemplate: this.option(
        'taskTimeTooltipContentTemplate',
      ),
      taskContentTemplate: this.option('taskContentTemplate'),
      sieve: this.option('sieve'),
    });
    this._selectTask(this.option('selectedRowKey'));
    this.updateBarItemsState();

    const visualState = this.option(visualStateKey);
    if (visualState) {
      // eslint-disable-next-line @stylistic/max-len
      this._restoreStateFrameId = requestAnimationFrame(() => this._restoreVisualState(visualState));
    }
  }

  _dispose(): void {
    super._dispose();
    cancelAnimationFrame(this._restoreStateFrameId);
  }

  _restoreVisualState(state): void {
    if (state[fullScreenModeKey]) {
      this._ganttViewCore.setFullScreenMode();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFirstDayOfWeek(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isDefined(value) ? value : dateLocalization.firstDayOfWeekIndex();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskAreaContainer() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttViewCore.getTaskAreaContainer();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getBarManager() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttViewCore.barManager;
  }

  executeCoreCommand(id): void {
    const command = this._ganttViewCore.getCommandByKey(id);
    if (command) {
      command.execute();
    }
  }

  changeTaskExpanded(id, value): void {
    this._ganttViewCore.changeTaskExpanded(id, value);
  }

  updateView(): void {
    this._ganttViewCore?.updateView();
  }

  updateBarItemsState(): void {
    this._ganttViewCore.barManager.updateItemsState([]);
  }

  setWidth(value): void {
    this._ganttViewCore.setWidth(value);
  }

  _onDimensionChanged(): void {
    this._ganttViewCore.onBrowserWindowResize();
  }

  _selectTask(id): void {
    this._ganttViewCore.selectTaskById(id);
  }

  _update(keepExpandState): void {
    this._ganttViewCore?.updateWithDataReload(keepExpandState);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCultureInfo() {
    return {
      // @ts-expect-error ts-error
      monthNames: dateLocalization.getMonthNames('wide'),
      // @ts-expect-error ts-error
      dayNames: dateLocalization.getDayNames('wide'),
      abbrMonthNames: dateLocalization.getMonthNames('abbreviated'),
      abbrDayNames: dateLocalization.getDayNames('abbreviated'),
      quarterNames: this._getQuarterNames(),
      amText: this._getAmText(),
      pmText: this._getPmText(),
      start: messageLocalization.format('dxGantt-dialogStartTitle'),
      end: messageLocalization.format('dxGantt-dialogEndTitle'),
      progress: messageLocalization.format('dxGantt-dialogProgressTitle'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getAmText() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._hasAmPM() ? dateLocalization.getPeriodNames()[0] : '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPmText() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._hasAmPM() ? dateLocalization.getPeriodNames()[1] : '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _hasAmPM() {
    const date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    const dateString = date.toLocaleTimeString(coreLocalization.locale());
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return /am|pm/i.exec(dateString) || /am|pm/i.exec(date.toString());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getQuarterNames() {
    const quarterFormat = messageLocalization.format('dxGantt-quarter');
    if (!quarterFormat) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return dateLocalization.getQuarterNames();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [
      format(quarterFormat, 1),
      format(quarterFormat, 2),
      format(quarterFormat, 3),
      format(quarterFormat, 4),
    ];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
      allowTaskResourceUpdate: value.allowTaskResourceUpdating,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _parseViewTypeRangeSettings(value) {
    return {
      min: this._getViewTypeByScaleType(value.min),
      max: this._getViewTypeByScaleType(value.max),
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _optionChanged(args): void {
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
        this._ganttViewCore.setTaskTitlePosition(
          this._getTaskTitlePosition(args.value),
        );
        break;
      case 'firstDayOfWeek':
        this._ganttViewCore.setFirstDayOfWeek(
          this._getFirstDayOfWeek(args.value),
        );
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
        this._ganttViewCore.setEditingSettings(
          this._parseEditingSettings(args.value),
        );
        break;
      case 'validation':
        this._ganttViewCore.setValidationSettings(args.value);
        this._update(true);
        break;
      case 'showRowLines':
        this._ganttViewCore.setRowLinesVisible(args.value);
        break;
      case 'scaleType':
        this._ganttViewCore.setViewType(
          this._getViewTypeByScaleType(args.value),
        );
        break;
      case 'scaleTypeRange':
        this._ganttViewCore.setViewTypeRange(
          this._getViewTypeByScaleType(args.value.min),
          this._getViewTypeByScaleType(args.value.max),
        );
        break;
      case 'stripLines':
        this._ganttViewCore.setStripLines({
          stripLines: this.option('stripLines'),
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
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get bars() {
    return this.option('bars');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getRowHeight() {
    return this.option('rowHeight');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getHeaderHeight() {
    return this.option('headerHeight');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGanttTasksData() {
    const tasks = this.option('tasks');
    const sieveOptions = this.getSieveOptions();
    if (sieveOptions?.sievedItems && sieveOptions?.sieveColumn) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return sieveOptions.sievedItems;
    }
    return tasks;
  }

  _sortAndFilter(args): void {
    this._sieveOptions = args;
    this._update(!args?.expandTasks);
    const selectedRowKey = this.option('selectedRowKey');
    this._selectTask(selectedRowKey);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSieveOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._sieveOptions;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGanttDependenciesData() {
    return this.option('dependencies');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGanttResourcesData() {
    return this.option('resources');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGanttResourceAssignmentsData() {
    return this.option('resourceAssignments');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGanttWorkTimeRules() {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getExternalTaskAreaContainer(element) {
    if (!this._taskAreaContainer) {
      this._taskAreaContainer = new TaskAreaContainer(element, this);
    }
    return this._taskAreaContainer;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  prepareExternalTaskAreaContainer(element, info) {
    if (info?.height) {
      this._taskAreaContainer?._scrollView.option('height', info.height);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  changeGanttTaskSelection(id, selected) {
    this._onSelectionChanged?.({ id, selected });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onGanttScroll(scrollTop) {
    this._onScroll?.({ scrollTop });
  }

  showDialog(name, parameters, callback, afterClosing): void {
    this._onDialogShowing?.({
      name,
      parameters,
      callback,
      afterClosing,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getModelChangesListener() {
    return this.option('modelChangesListener');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getExportInfo() {
    return this.option('exportInfo');
  }

  showPopupMenu(info): void {
    this._onPopupMenuShowing?.(info);
  }

  hidePopupMenu(info): void {
    this._onPopupMenuHiding?.(info);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getMainElement() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.option('mainElement').get(0);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  adjustControl() {
    this._onAdjustControl?.();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getRequireFirstLoadParentAutoCalc() {
    return this.option('validation.autoUpdateParentTasks');
  }

  collapseAll(): void {
    this._collapseAll?.();
  }

  expandAll(): void {
    this._expandAll?.();
  }

  onTaskClick(key, event): boolean {
    this._taskClick?.({ key, event });
    return true;
  }

  onTaskDblClick(key, event): void {
    return this._taskDblClick?.({ key, event });
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
  onGanttViewContextMenu(event, key, type) {
    return true;
  }

  getFormattedDateText(date): string {
    let result = '';
    if (date) {
      const globalDateTimeFormat = getGlobalFormatByDataType('datetime');
      if (globalDateTimeFormat) {
        result = String(dateLocalization.format(date, globalDateTimeFormat) ?? '');
      } else {
        const datePart = dateLocalization.format(date, 'shortDate');
        const timeFormat = this._hasAmPM() ? 'hh:mm a' : 'HH:mm';
        const timePart = dateLocalization.format(date, timeFormat);
        result = `${datePart} ${timePart}`;
      }
    }
    return result;
  }

  destroyTemplate(container): void {
    $(container).empty();
  }

  onTaskAreaSizeChanged(info): void {
    const scrollView = this._taskAreaContainer?._scrollView;
    if (isDefined(info?.height)) {
      // @ts-expect-error ts-error
      const direction = info?.height > this._taskAreaContainer?.getHeight()
        ? 'both'
        : 'horizontal';
      scrollView.option('direction', direction);
    }
  }

  updateGanttViewType(type): void {
    this._onViewTypeChanged?.({ type });
  }

  // export
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTreeListTableStyle() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callExportHelperMethod('getTreeListTableStyle');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTreeListColCount() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callExportHelperMethod('getTreeListColCount');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTreeListHeaderInfo(colIndex) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callExportHelperMethod('getTreeListHeaderInfo', colIndex);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTreeListCellInfo(rowIndex, colIndex, key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callExportHelperMethod('getTreeListCellInfo', key, colIndex);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTreeListEmptyDataCellInfo() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.callExportHelperMethod('getTreeListEmptyDataCellInfo');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  callExportHelperMethod(methodName, ...args) {
    const helper = this.option('exportHelper');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return helper[methodName](...args);
  }

  applyTasksExpandedState(state): void {
    this._ganttViewCore?.applyTasksExpandedState(state);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getVisualStateToRestore() {
    return {
      [fullScreenModeKey]: this._ganttViewCore?.isInFullScreenMode?.(),
    };
  }
}
