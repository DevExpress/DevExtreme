import { locate, resetPosition } from '@js/common/core/animation/translator';
import { name as clickEventName } from '@js/common/core/events/click';
import { name as contextMenuEventName } from '@js/common/core/events/contextmenu';
import eventsEngine from '@js/common/core/events/core/events_engine';
import {
  drop as dragEventDrop,
  enter as dragEventEnter,
  leave as dragEventLeave,
} from '@js/common/core/events/drag';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, isMouseEvent } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  setOuterHeight,
  setWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import errors from '@js/ui/widget/ui.errors';
import { getMemoizeScrollTo } from '@ts/core/utils/scroll';
import {
  AllDayPanelTitleComponent,
  AllDayTableComponent,
  DateTableComponent,
  GroupPanelComponent,
  HeaderPanelComponent,
  TimePanelComponent,
} from '@ts/scheduler/r1/components/index';
import type { ViewContext } from '@ts/scheduler/r1/components/types';
import type { ViewType } from '@ts/scheduler/r1/types';
import {
  calculateIsGroupedAllDayPanel,
  calculateViewStartDate, getCellDuration, getGroupCount, getStartViewDateTimeOffset,
  getViewStartByOptions,
  isDateAndTimeView,
} from '@ts/scheduler/r1/utils/index';

import WidgetObserver from '../base/m_widget_observer';
import AppointmentDragBehavior from '../m_appointment_drag_behavior';
import {
  APPOINTMENT_DRAG_SOURCE_CLASS,
  DATE_TABLE_CLASS,
  DATE_TABLE_ROW_CLASS,
  FIXED_CONTAINER_CLASS,
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  TIME_PANEL_CLASS,
  VERTICAL_GROUP_COUNT_CLASSES,
  VIRTUAL_CELL_CLASS,
} from '../m_classes';
import { APPOINTMENT_SETTINGS_KEY } from '../m_constants';
import tableCreatorModule from '../m_table_creator';
import { utils } from '../m_utils';
import {
  createResourcesTree, getCellGroups, getGroupsObjectFromGroupsArray,
} from '../resources/m_utils';
import VerticalShader from '../shaders/m_current_time_shader_vertical';
import {
  getAllDayHeight,
  getCellHeight,
  getCellWidth,
  getMaxAllowedPosition,
  PositionHelper,
} from './helpers/m_position_helper';
import { Cache } from './m_cache';
import { CellsSelectionController } from './m_cells_selection_controller';
import CellsSelectionState from './m_cells_selection_state';
import { VirtualScrollingDispatcher, VirtualScrollingRenderer } from './m_virtual_scrolling';
import HorizontalGroupedStrategy from './m_work_space_grouped_strategy_horizontal';
import VerticalGroupedStrategy from './m_work_space_grouped_strategy_vertical';
import ViewDataProvider from './view_model/m_view_data_provider';

interface RenderComponentOptions {
  header?: boolean;
  timePanel?: boolean;
  dateTable?: boolean;
  allDayPanel?: boolean;
}

interface RenderRWorkspaceOptions {
  renderComponents: RenderComponentOptions;
  generateNewData: boolean;
}

const { tableCreator } = tableCreatorModule;

// TODO: The constant is needed so that the dragging is not sharp. To prevent small twitches
const DRAGGING_MOUSE_FAULT = 10;

// @ts-expect-error
const { abstract } = WidgetObserver;
const toMs = dateUtils.dateToMilliseconds;

const COMPONENT_CLASS = 'dx-scheduler-work-space';
const GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-grouped';
const VERTICAL_GROUPED_WORKSPACE_CLASS = 'dx-scheduler-work-space-vertical-grouped';
const WORKSPACE_VERTICAL_GROUP_TABLE_CLASS = 'dx-scheduler-work-space-vertical-group-table';

const WORKSPACE_WITH_BOTH_SCROLLS_CLASS = 'dx-scheduler-work-space-both-scrollbar';
const WORKSPACE_WITH_COUNT_CLASS = 'dx-scheduler-work-space-count';
const WORKSPACE_WITH_GROUP_BY_DATE_CLASS = 'dx-scheduler-work-space-group-by-date';
const WORKSPACE_WITH_ODD_CELLS_CLASS = 'dx-scheduler-work-space-odd-cells';

const TIME_PANEL_CELL_CLASS = 'dx-scheduler-time-panel-cell';
const TIME_PANEL_ROW_CLASS = 'dx-scheduler-time-panel-row';

const ALL_DAY_PANEL_CLASS = 'dx-scheduler-all-day-panel';
const ALL_DAY_TABLE_CLASS = 'dx-scheduler-all-day-table';
const ALL_DAY_CONTAINER_CLASS = 'dx-scheduler-all-day-appointments';
const ALL_DAY_TITLE_CLASS = 'dx-scheduler-all-day-title';
const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';
const ALL_DAY_TABLE_ROW_CLASS = 'dx-scheduler-all-day-table-row';
const WORKSPACE_WITH_ALL_DAY_CLASS = 'dx-scheduler-work-space-all-day';
const WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS = 'dx-scheduler-work-space-all-day-collapsed';

const WORKSPACE_WITH_MOUSE_SELECTION_CLASS = 'dx-scheduler-work-space-mouse-selection';

const HORIZONTAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-horizontal';
const VERTICAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-vertical';

const HEADER_PANEL_CLASS = 'dx-scheduler-header-panel';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
const HEADER_ROW_CLASS = 'dx-scheduler-header-row';
const GROUP_HEADER_CLASS = 'dx-scheduler-group-header';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const DATE_TABLE_FOCUSED_CELL_CLASS = 'dx-scheduler-focused-cell';
const VIRTUAL_ROW_CLASS = 'dx-scheduler-virtual-row';

const DATE_TABLE_DROPPABLE_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';

const SCHEDULER_HEADER_SCROLLABLE_CLASS = 'dx-scheduler-header-scrollable';
const SCHEDULER_SIDEBAR_SCROLLABLE_CLASS = 'dx-scheduler-sidebar-scrollable';
const SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS = 'dx-scheduler-date-table-scrollable';

const SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME = addNamespace(pointerEvents.down, 'dxSchedulerWorkSpace');

const DragEventNames = {
  ENTER: addNamespace(dragEventEnter, 'dxSchedulerDateTable'),
  DROP: addNamespace(dragEventDrop, 'dxSchedulerDateTable'),
  LEAVE: addNamespace(dragEventLeave, 'dxSchedulerDateTable'),
};

const SCHEDULER_CELL_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxSchedulerDateTable');

const SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME = addNamespace(pointerEvents.down, 'dxSchedulerDateTable');
const SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME = addNamespace(pointerEvents.up, 'dxSchedulerDateTable');

const SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME = addNamespace(pointerEvents.move, 'dxSchedulerDateTable');

const CELL_DATA = 'dxCellData';

const DATE_TABLE_MIN_CELL_WIDTH = 75;

const DAY_MS = toMs('day');
const HOUR_MS = toMs('hour');

const DRAG_AND_DROP_SELECTOR = `.${DATE_TABLE_CLASS} td, .${ALL_DAY_TABLE_CLASS} td`;
const CELL_SELECTOR = `.${DATE_TABLE_CELL_CLASS}, .${ALL_DAY_TABLE_CELL_CLASS}`;

const CELL_INDEX_CALCULATION_EPSILON = 0.05;

const DEFAULT_WORKSPACE_RENDER_OPTIONS: RenderRWorkspaceOptions = {
  renderComponents: {
    header: true,
    timePanel: true,
    dateTable: true,
    allDayPanel: true,
  },
  generateNewData: true,
};

class SchedulerWorkSpace extends WidgetObserver {
  _viewDataProvider: any;

  _cache: any;

  _cellsSelectionState: any;

  _cellsSelectionController: any;

  _dateTableScrollable: any;

  _selectionChangedAction: any;

  _isCellClick: any;

  _contextMenuHandled: any;

  _disposed: any;

  _getToday: any;

  _$allDayPanel: any;

  _$allDayTitle: any;

  _$headerPanelEmptyCell: any;

  _groupedStrategy: any;

  virtualScrollingDispatcher: any;

  _scrollSync: any;

  _$headerPanel: any;

  _$dateTable: any;

  _$allDayTable: any;

  renderer: any;

  _createAction: any;

  _cellClickAction: any;

  _createActionByOption: any;

  _showPopup: any;

  NAME: any;

  _contextMenuAction: any;

  _$groupTable: any;

  _$thead: any;

  _headerScrollable: any;

  _sidebarScrollable: any;

  preventDefaultDragging: any;

  dragBehavior: any;

  _$dateTableContainer: any;

  _$timePanel: any;

  _activeStateUnit: any;

  positionHelper!: PositionHelper;

  _$headerPanelContainer: any;

  _$headerTablesContainer: any;

  _$fixedContainer: any;

  _$allDayContainer: any;

  _$dateTableScrollableContent: any;

  _$sidebarScrollableContent: any;

  _allDayTitles!: any[];

  _allDayTables!: any[];

  _allDayPanels!: any[];

  _$flexContainer: any;

  _shader: any;

  _$sidebarTable: any;

  _interval: any;

  renovatedAllDayPanel: any;

  renovatedDateTable: any;

  renovatedTimePanel: any;

  renovatedGroupPanel: any;

  renovatedHeaderPanel: any;

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get type(): string {
    return '';
  }

  get viewDataProvider() {
    if (!this._viewDataProvider) {
      this._viewDataProvider = new ViewDataProvider(this.type as ViewType);
    }
    return this._viewDataProvider;
  }

  get cache() {
    if (!this._cache) {
      this._cache = new Cache();
    }

    return this._cache;
  }

  get cellsSelectionState() {
    if (!this._cellsSelectionState) {
      this._cellsSelectionState = new CellsSelectionState(this.viewDataProvider);

      const selectedCellsOption: any = this.option('selectedCellData');

      if (selectedCellsOption?.length > 0) {
        const validSelectedCells = selectedCellsOption.map((selectedCell) => {
          const { groups } = selectedCell;

          if (!groups || this._getGroupCount() === 0) {
            return {
              ...selectedCell,
              groupIndex: 0,
            };
          }

          const groupIndex = this._getGroupIndexByResourceId(groups);

          return {
            ...selectedCell,
            groupIndex,
          };
        });

        this._cellsSelectionState.setSelectedCellsByData(validSelectedCells);
      }
    }

    return this._cellsSelectionState;
  }

  get cellsSelectionController() {
    if (!this._cellsSelectionController) {
      this._cellsSelectionController = new CellsSelectionController();
    }

    return this._cellsSelectionController;
  }

  get isAllDayPanelVisible() {
    return this._isShowAllDayPanel() && this.supportAllDayRow();
  }

  get verticalGroupTableClass() { return WORKSPACE_VERTICAL_GROUP_TABLE_CLASS; }

  readonly viewDirection: 'vertical' | 'horizontal' = 'vertical';

  get renovatedHeaderPanelComponent() { return HeaderPanelComponent; }

  get timeZoneCalculator(): any {
    return this.option('timeZoneCalculator');
  }

  get isDefaultDraggingMode() {
    return this.option('draggingMode') === 'default';
  }

  _supportedKeys() {
    const clickHandler = function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedCells = this.cellsSelectionState.getSelectedCells();

      if (selectedCells?.length) {
        const selectedCellsElement = selectedCells.map((cellData) => this._getCellByData(cellData)).filter((cell) => !!cell);

        e.target = selectedCellsElement;
        this._showPopup = true;

        this._cellClickAction({ event: e, cellElement: $(selectedCellsElement), cellData: selectedCells[0] });
      }
    };
    const onArrowPressed = (e, key) => {
      e.preventDefault();
      e.stopPropagation();

      const focusedCellData = this.cellsSelectionState.focusedCell?.cellData;

      if (focusedCellData) {
        const isAllDayPanelCell = focusedCellData.allDay && !this._isVerticalGroupedWorkSpace();
        const isMultiSelection = e.shiftKey;
        const isMultiSelectionAllowed = this.option('allowMultipleCellSelection');
        const isRTL = this._isRTL();
        const groupCount = this._getGroupCount();
        const isGroupedByDate = this.isGroupedByDate();
        const isHorizontalGrouping = this._isHorizontalGroupedWorkSpace();
        const focusedCellPosition = this.viewDataProvider.findCellPositionInMap({
          ...focusedCellData,
          isAllDay: focusedCellData.allDay,
        });

        const edgeIndices = isHorizontalGrouping && isMultiSelection && !isGroupedByDate
          ? this.viewDataProvider.getGroupEdgeIndices(focusedCellData.groupIndex, isAllDayPanelCell)
          : this.viewDataProvider.getViewEdgeIndices(isAllDayPanelCell);

        const nextCellData = this.cellsSelectionController.handleArrowClick({
          focusedCellPosition,
          edgeIndices,
          isRTL,
          isGroupedByDate,
          groupCount,
          isMultiSelection,
          isMultiSelectionAllowed,
          viewType: this.type,
          key,
          getCellDataByPosition: this.viewDataProvider.getCellData.bind(this.viewDataProvider),
          isAllDayPanelCell,
          focusedCellData,
        });

        this._processNextSelectedCell(
          nextCellData,
          focusedCellData,
          isMultiSelection && isMultiSelectionAllowed,
        );
      }
    };

    // @ts-expect-error
    return extend(super._supportedKeys(), {
      enter: clickHandler,
      space: clickHandler,
      downArrow: (e) => {
        onArrowPressed(e, 'down');
      },
      upArrow: (e) => {
        onArrowPressed(e, 'up');
      },
      rightArrow: (e) => {
        onArrowPressed(e, 'right');
      },
      leftArrow: (e) => {
        onArrowPressed(e, 'left');
      },
    });
  }

  _isRTL() {
    return this.option('rtlEnabled');
  }

  _moveToCell($cell, isMultiSelection) {
    if (!isDefined($cell) || !$cell.length) {
      return;
    }

    const isMultiSelectionAllowed = this.option('allowMultipleCellSelection');
    const currentCellData = this._getFullCellData($cell);
    const focusedCellData = this.cellsSelectionState.focusedCell.cellData;

    const nextFocusedCellData = this.cellsSelectionController.moveToCell({
      isMultiSelection,
      isMultiSelectionAllowed,
      currentCellData,
      focusedCellData,
      isVirtualCell: $cell.hasClass(VIRTUAL_CELL_CLASS),
    });

    this._processNextSelectedCell(
      nextFocusedCellData,
      focusedCellData,
      isMultiSelectionAllowed && isMultiSelection,
    );
  }

  _processNextSelectedCell(nextCellData, focusedCellData, isMultiSelection) {
    const nextCellPosition = this.viewDataProvider.findCellPositionInMap({
      startDate: nextCellData.startDate,
      groupIndex: nextCellData.groupIndex,
      isAllDay: nextCellData.allDay,
      index: nextCellData.index,
    });

    if (!this.viewDataProvider.isSameCell(focusedCellData, nextCellData)) {
      const $cell = nextCellData.allDay && !this._isVerticalGroupedWorkSpace()
        ? this._dom_getAllDayPanelCell(nextCellPosition.columnIndex)
        : this._dom_getDateCell(nextCellPosition);
      const isNextCellAllDay = nextCellData.allDay;

      this._setSelectedCellsStateAndUpdateSelection(isNextCellAllDay, nextCellPosition, isMultiSelection, $cell);

      this._dateTableScrollable.scrollToElement($cell);
    }
  }

  _setSelectedCellsStateAndUpdateSelection(isAllDay, cellPosition, isMultiSelection, $nextFocusedCell) {
    const nextCellCoordinates = {
      rowIndex: cellPosition.rowIndex,
      columnIndex: cellPosition.columnIndex,
      allDay: isAllDay,
    };

    this.cellsSelectionState.setFocusedCell(
      nextCellCoordinates.rowIndex,
      nextCellCoordinates.columnIndex,
      isAllDay,
    );

    if (isMultiSelection) {
      this.cellsSelectionState.setSelectedCells(nextCellCoordinates);
    } else {
      this.cellsSelectionState.setSelectedCells(nextCellCoordinates, nextCellCoordinates);
    }

    this.updateCellsSelection();
    this._updateSelectedCellDataOption(this.cellsSelectionState.getSelectedCells(), $nextFocusedCell);
  }

  _hasAllDayClass($cell) {
    return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
  }

  _focusInHandler(e) {
    if ($(e.target).is(this._focusTarget() as any) && this._isCellClick) {
      delete this._isCellClick;
      delete this._contextMenuHandled;
      // @ts-expect-error
      super._focusInHandler.apply(this, arguments);

      this.cellsSelectionState.restoreSelectedAndFocusedCells();

      if (!this.cellsSelectionState.focusedCell) {
        const cellCoordinates = {
          columnIndex: 0,
          rowIndex: 0,
          allDay: this._isVerticalGroupedWorkSpace() && this.isAllDayPanelVisible,
        };
        this.cellsSelectionState.setFocusedCell(
          cellCoordinates.rowIndex,
          cellCoordinates.columnIndex,
          cellCoordinates.allDay,
        );
        this.cellsSelectionState.setSelectedCells(cellCoordinates, cellCoordinates);
      }

      this.updateCellsSelection();
      this._updateSelectedCellDataOption(this.cellsSelectionState.getSelectedCells());
    }
  }

  _focusOutHandler() {
    // @ts-expect-error
    super._focusOutHandler.apply(this, arguments);

    if (!this._contextMenuHandled && !this._disposed) {
      this.cellsSelectionState.releaseSelectedAndFocusedCells();

      this.viewDataProvider.updateViewData(this.generateRenderOptions());
      this.updateCellsSelection();
    }
  }

  _focusTarget() {
    return this.$element();
  }

  _isVerticalGroupedWorkSpace() { // TODO move to the Model
    return !!this.option('groups')?.length && this.option('groupOrientation') === 'vertical';
  }

  _isHorizontalGroupedWorkSpace() {
    return !!this.option('groups')?.length && this.option('groupOrientation') === 'horizontal';
  }

  _isWorkSpaceWithCount() {
    return this.option('intervalCount') as any > 1;
  }

  _isWorkspaceWithOddCells() {
    return this.option('hoursInterval') === 0.5 && !this.isVirtualScrolling();
  }

  _getRealGroupOrientation() {
    return this._isVerticalGroupedWorkSpace()
      ? 'vertical'
      : 'horizontal';
  }

  createRAllDayPanelElements() {
    this._$allDayPanel = $('<div>').addClass(ALL_DAY_PANEL_CLASS);
    this._$allDayTitle = $('<div>').appendTo(this._$headerPanelEmptyCell);
  }

  _dateTableScrollableConfig() {
    let config: any = {
      useKeyboard: false,
      bounceEnabled: false,
      updateManually: true,
      onScroll: () => {
        this._groupedStrategy.cache?.clear();
      },
    };
    if (this._needCreateCrossScrolling()) {
      config = extend(config, this._createCrossScrollingConfig(config));
    }
    if (this.isVirtualScrolling()
            && (this.virtualScrollingDispatcher.horizontalScrollingAllowed
                || this.virtualScrollingDispatcher.height)) {
      const currentOnScroll = config.onScroll;
      config = {
        ...config,
        onScroll: (e) => {
          currentOnScroll?.(e);

          this.virtualScrollingDispatcher.handleOnScrollEvent(e?.scrollOffset);
        },
      };
    }

    return config;
  }

  _createCrossScrollingConfig({ onScroll }): any {
    return {
      direction: 'both',
      onScroll: (event) => {
        onScroll?.();

        this._scrollSync.sidebar({ top: event.scrollOffset.top });
        this._scrollSync.header({ left: event.scrollOffset.left });
      },
      onEnd: () => {
        (this.option('onScrollEnd') as any)();
      },
    };
  }

  _headerScrollableConfig() {
    return {
      useKeyboard: false,
      showScrollbar: 'never',
      direction: 'horizontal',
      useNative: false,
      updateManually: true,
      bounceEnabled: false,
      onScroll: (event) => {
        this._scrollSync.dateTable({ left: event.scrollOffset.left });
      },
    };
  }

  _visibilityChanged(visible) {
    this.cache.clear();

    if (visible) {
      this._updateGroupTableHeight();
    }

    if (visible && this._needCreateCrossScrolling()) {
      this._setTableSizes();
    }
  }

  _setTableSizes() {
    this.cache.clear();
    this._attachTableClasses();

    let cellWidth = this.getCellWidth();

    if (cellWidth < this.getCellMinWidth()) {
      cellWidth = this.getCellMinWidth();
    }

    const minWidth = this.getWorkSpaceMinWidth();

    const groupCount = this._getGroupCount();
    const totalCellCount = this._getTotalCellCount(groupCount);

    let width = cellWidth * totalCellCount;

    if (width < minWidth) {
      width = minWidth;
    }

    setWidth(this._$headerPanel, width);
    setWidth(this._$dateTable, width);
    if (this._$allDayTable) {
      setWidth(this._$allDayTable, width);
    }

    this._attachHeaderTableClasses();

    this._updateGroupTableHeight();

    this._updateScrollable();
  }

  getWorkSpaceMinWidth() {
    return this._groupedStrategy.getWorkSpaceMinWidth();
  }

  _dimensionChanged() {
    // NOTE: It's a base widget method. Be careful :)
    // @ts-expect-error
    if (!this._isVisible()) {
      return;
    }

    if (this.option('crossScrollingEnabled')) {
      this._setTableSizes();
    }

    this.updateHeaderEmptyCellWidth();

    this._updateScrollable();

    this.cache.clear();
  }

  _needCreateCrossScrolling() {
    return this.option('crossScrollingEnabled');
  }

  _getElementClass() { return noop(); }

  _getRowCount() {
    return this.viewDataProvider.getRowCount({
      intervalCount: this.option('intervalCount'),
      currentDate: this.option('currentDate'),
      viewType: this.type,
      hoursInterval: this.option('hoursInterval'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
    });
  }

  _getCellCount() {
    return this.viewDataProvider.getCellCount({
      intervalCount: this.option('intervalCount'),
      currentDate: this.option('currentDate'),
      viewType: this.type,
      hoursInterval: this.option('hoursInterval'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
    });
  }

  isRenovatedRender() {
    return this.renovatedRenderSupported() && this.option('renovateRender');
  }

  _isVirtualModeOn() {
    return this.option('scrolling.mode') === 'virtual';
  }

  isVirtualScrolling() {
    return this.isRenovatedRender() && this._isVirtualModeOn();
  }

  _initVirtualScrolling() {
    if (this.virtualScrollingDispatcher) {
      this.virtualScrollingDispatcher.dispose();
      this.virtualScrollingDispatcher = null;
    }

    this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this._getVirtualScrollingDispatcherOptions());
    this.virtualScrollingDispatcher.attachScrollableEvents();
    this.renderer = new VirtualScrollingRenderer(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDataSourceChanged(argument?: any) {
  }

  isGroupedAllDayPanel() {
    return calculateIsGroupedAllDayPanel(
      this.option('groups') as any,
      this.option('groupOrientation') as any,
      this.isAllDayPanelVisible as any,
    );
  }

  generateRenderOptions(isProvideVirtualCellsWidth?: any) {
    const groupCount = this._getGroupCount();

    const groupOrientation = groupCount > 0
      ? this.option('groupOrientation')
      : this._getDefaultGroupStrategy();

    const options = {
      groupByDate: this.option('groupByDate'),
      startRowIndex: 0,
      startCellIndex: 0,
      groupOrientation,
      today: this._getToday?.(),
      groups: this.option('groups'),
      isProvideVirtualCellsWidth,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      selectedCells: this.cellsSelectionState.getSelectedCells(),
      focusedCell: this.cellsSelectionState.focusedCell,
      headerCellTextFormat: this._getFormat(),
      getDateForHeaderText: (_, date) => date,
      viewOffset: this.option('viewOffset'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      cellDuration: this.getCellDuration(),
      viewType: this.type,
      intervalCount: this.option('intervalCount'),
      hoursInterval: this.option('hoursInterval'),
      currentDate: this.option('currentDate'),
      startDate: this.option('startDate'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),

      ...this.virtualScrollingDispatcher.getRenderState(),
    };

    return options;
  }

  renovatedRenderSupported() { return true; }

  _updateGroupTableHeight() {
    if (this._isVerticalGroupedWorkSpace() && hasWindow()) {
      this._setHorizontalGroupHeaderCellsHeight();
    }
  }

  updateHeaderEmptyCellWidth() {
    if (hasWindow() && this._isRenderHeaderPanelEmptyCell()) {
      const timePanelWidth = this.getTimePanelWidth();
      const groupPanelWidth = this.getGroupTableWidth();

      this._$headerPanelEmptyCell.css('width', timePanelWidth + groupPanelWidth);
    }
  }

  _isGroupsSpecified(resources) {
    return this.option('groups')?.length && resources;
  }

  _getGroupIndexByResourceId(id) {
    const groups = this.option('groups');
    const resourceTree = createResourcesTree(groups);

    if (!resourceTree.length) return 0;

    return this._getGroupIndexRecursively(resourceTree, id);
  }

  _getGroupIndexRecursively(resourceTree, id) {
    const currentKey = resourceTree[0].name;
    const currentValue = id[currentKey];

    return resourceTree.reduce((prevIndex, { leafIndex, value, children }) => {
      const areValuesEqual = currentValue === value;
      if (areValuesEqual && leafIndex !== undefined) {
        return leafIndex;
      }
      if (areValuesEqual) {
        return this._getGroupIndexRecursively(children, id);
      }

      return prevIndex;
    }, 0);
  }

  _getViewStartByOptions() {
    return getViewStartByOptions(
      this.option('startDate') as any,
      this.option('currentDate') as any,
      this._getIntervalDuration(),
      this.option('startDate') ? this._calculateViewStartDate() : undefined,
    );
  }

  _getIntervalDuration() {
    return this.viewDataProvider.getIntervalDuration(this.option('intervalCount'));
  }

  _getHeaderDate() {
    return this.getStartViewDate();
  }

  _calculateViewStartDate() {
    return calculateViewStartDate(this.option('startDate') as any);
  }

  _firstDayOfWeek() {
    return this.viewDataProvider.getFirstDayOfWeek(this.option('firstDayOfWeek'));
  }

  _attachEvents() {
    this._createSelectionChangedAction();
    this._attachClickEvent();
    this._attachContextMenuEvent();
  }

  _attachClickEvent() {
    const that = this;
    const pointerDownAction = this._createAction((e) => {
      that._pointerDownHandler(e.event);
    });

    this._createCellClickAction();

    const cellSelector = `.${DATE_TABLE_CELL_CLASS},.${ALL_DAY_TABLE_CELL_CLASS}`;
    const $element = this.$element();

    (eventsEngine.off as any)($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME);
    (eventsEngine.off as any)($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME);
    eventsEngine.on($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME, (e) => {
      if (isMouseEvent(e) && e.which > 1) {
        e.preventDefault();
        return;
      }
      pointerDownAction({ event: e });
    });
    eventsEngine.on($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME, cellSelector, (e) => {
      const $cell = $(e.target);
      that._cellClickAction({ event: e, cellElement: getPublicElement($cell), cellData: that.getCellData($cell) });
    });
  }

  _createCellClickAction() {
    this._cellClickAction = this._createActionByOption('onCellClick', {
      afterExecute: (e) => this._cellClickHandler(e.args[0].event),
    });
  }

  _createSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _cellClickHandler(argument?: any) {
    if (this._showPopup) {
      delete this._showPopup;
      this._handleSelectedCellsClick();
    }
  }

  _pointerDownHandler(e) {
    const $target = $(e.target);

    if (!$target.hasClass(DATE_TABLE_CELL_CLASS) && !$target.hasClass(ALL_DAY_TABLE_CELL_CLASS)) {
      this._isCellClick = false;
      return;
    }

    this._isCellClick = true;
    if ($target.hasClass(DATE_TABLE_FOCUSED_CELL_CLASS)) {
      this._showPopup = true;
    } else {
      const cellCoordinates = this._getCoordinatesByCell($target);
      const isAllDayCell = this._hasAllDayClass($target);
      this._setSelectedCellsStateAndUpdateSelection(isAllDayCell, cellCoordinates, false, $target);
    }
  }

  _handleSelectedCellsClick() {
    const selectedCells = this.cellsSelectionState.getSelectedCells();

    const firstCellData = selectedCells[0];
    const lastCellData = selectedCells[selectedCells.length - 1];

    const result: any = {
      startDate: firstCellData.startDate,
      endDate: lastCellData.endDate,
    };

    if (lastCellData.allDay !== undefined) {
      result.allDay = lastCellData.allDay;
    }

    (this.option('onSelectedCellsClick') as any)(result, lastCellData.groups);
  }

  _attachContextMenuEvent() {
    this._createContextMenuAction();

    const cellSelector = `.${DATE_TABLE_CELL_CLASS},.${ALL_DAY_TABLE_CELL_CLASS}`;
    const $element = this.$element();
    const eventName = addNamespace(contextMenuEventName, this.NAME);

    eventsEngine.off($element, eventName, cellSelector);
    eventsEngine.on($element, eventName, cellSelector, this._contextMenuHandler.bind(this));
  }

  _contextMenuHandler(e) {
    const $cell = $(e.target);
    this._contextMenuAction({ event: e, cellElement: getPublicElement($cell), cellData: this.getCellData($cell) });
    this._contextMenuHandled = true;
  }

  _createContextMenuAction() {
    this._contextMenuAction = this._createActionByOption('onCellContextMenu');
  }

  _getGroupHeaderContainer() {
    if (this._isVerticalGroupedWorkSpace()) {
      return this._$groupTable;
    }

    return this._$thead;
  }

  _getDateHeaderContainer() {
    return this._$thead;
  }

  _getCalculateHeaderCellRepeatCount() {
    return this._groupedStrategy.calculateHeaderCellRepeatCount();
  }

  _updateScrollable() {
    this._dateTableScrollable.update();

    this._headerScrollable?.update();
    this._sidebarScrollable?.update();
  }

  _getTimePanelRowCount() {
    return this._getCellCountInDay();
  }

  _getCellCountInDay() {
    const hoursInterval = this.option('hoursInterval');
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');

    return this.viewDataProvider.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  }

  _getTotalCellCount(groupCount) {
    return this._groupedStrategy.getTotalCellCount(groupCount);
  }

  _getTotalRowCount(groupCount, includeAllDayPanelRows?: any) {
    let result = this._groupedStrategy.getTotalRowCount(groupCount);

    if (includeAllDayPanelRows && this.isAllDayPanelVisible) {
      result += groupCount;
    }

    return result;
  }

  _getGroupIndex(rowIndex, columnIndex) {
    return this._groupedStrategy.getGroupIndex(rowIndex, columnIndex);
  }

  calculateEndDate(startDate) {
    const { viewDataGenerator } = this.viewDataProvider;

    return viewDataGenerator.calculateEndDate(
      startDate,
      viewDataGenerator.getInterval(this.option('hoursInterval')),
      this.option('endDayHour'),
    );
  }

  _getGroupCount() {
    return getGroupCount(this.option('groups') as any);
  }

  _attachTablesEvents() {
    const element = this.$element();

    this._attachDragEvents(element);
    this._attachPointerEvents(element);
  }

  _detachDragEvents(element) {
    (eventsEngine.off as any)(element, DragEventNames.ENTER);
    (eventsEngine.off as any)(element, DragEventNames.LEAVE);
    (eventsEngine.off as any)(element, DragEventNames.DROP);
  }

  _attachDragEvents(element) {
    this._detachDragEvents(element);

    const onDragEnter = (e) => {
      if (!this.preventDefaultDragging) {
        this.removeDroppableCellClass();
        $(e.target).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
      }
    };

    const removeClasses = () => {
      if (!this.preventDefaultDragging) {
        this.removeDroppableCellClass();
      }
    };

    const onCheckDropTarget = (target, event) => !this._isOutsideScrollable(target, event);

    (eventsEngine.on as any)(
      element,
      DragEventNames.ENTER,
      DRAG_AND_DROP_SELECTOR,
      { checkDropTarget: onCheckDropTarget },
      onDragEnter,
    );
    eventsEngine.on(element, DragEventNames.LEAVE, removeClasses);
    eventsEngine.on(element, DragEventNames.DROP, DRAG_AND_DROP_SELECTOR, () => {
      if (!this.dragBehavior) {
        return;
      }

      if (!this.dragBehavior?.dragBetweenComponentsPromise) {
        this.dragBehavior.removeDroppableClasses();
        return;
      }

      this.dragBehavior.dragBetweenComponentsPromise?.then(() => {
        this.dragBehavior.removeDroppableClasses();
      });
    });
  }

  _attachPointerEvents(element) {
    let isPointerDown = false;

    (eventsEngine.off as any)(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
    (eventsEngine.off as any)(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);

    eventsEngine.on(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME, DRAG_AND_DROP_SELECTOR, (e) => {
      if (isMouseEvent(e) && e.which === 1) {
        isPointerDown = true;
        (this.$element() as any).addClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
        (eventsEngine.off as any)(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
        eventsEngine.on(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME, () => {
          isPointerDown = false;
          (this.$element() as any).removeClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
        });
      }
    });

    eventsEngine.on(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME, DRAG_AND_DROP_SELECTOR, (e) => {
      if (isPointerDown && this._dateTableScrollable && !this._dateTableScrollable.option('scrollByContent')) {
        e.preventDefault();
        e.stopPropagation();
        this._moveToCell($(e.target), true);
      }
    });
  }

  _getFormat() { return abstract(); }

  getWorkArea() {
    return this._$dateTableContainer;
  }

  getScrollable() {
    return this._dateTableScrollable;
  }

  getScrollableScrollTop() {
    return this._dateTableScrollable.scrollTop();
  }

  getGroupedScrollableScrollTop(allDay) {
    return this._groupedStrategy.getScrollableScrollTop(allDay);
  }

  getScrollableScrollLeft() {
    return this._dateTableScrollable.scrollLeft();
  }

  getScrollableOuterWidth() {
    return this._dateTableScrollable.scrollWidth();
  }

  getScrollableContainer() {
    return $(this._dateTableScrollable.container());
  }

  getHeaderPanelHeight() {
    return this._$headerPanel && getOuterHeight(this._$headerPanel, true);
  }

  getTimePanelWidth() {
    return this._$timePanel && getBoundingRect(this._$timePanel.get(0)).width;
  }

  getGroupTableWidth() {
    return this._$groupTable ? getOuterWidth(this._$groupTable) : 0;
  }

  getWorkSpaceLeftOffset() {
    return this._groupedStrategy.getLeftOffset();
  }

  _getCellCoordinatesByIndex(index) {
    const columnIndex = Math.floor(index / this._getRowCount());
    const rowIndex = index - this._getRowCount() * columnIndex;

    return {
      columnIndex,
      rowIndex,
    };
  }

  // TODO: necessary for old render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getDateGenerationOptions(isOldRender = false) {
    return {
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      isWorkView: this.viewDataProvider.viewDataGenerator.isWorkView,
      interval: this.viewDataProvider.viewDataGenerator?.getInterval(this.option('hoursInterval')),
      startViewDate: this.getStartViewDate(),
      firstDayOfWeek: this._firstDayOfWeek(),
    };
  }

  // TODO: refactor current time indicator
  _getIntervalBetween(currentDate, allDay) {
    const firstViewDate = this.getStartViewDate();

    const startDayTime = (this.option('startDayHour') as any) * HOUR_MS;
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const fullInterval = currentDate.getTime() - firstViewDate.getTime() - timeZoneOffset;
    const days = this._getDaysOfInterval(fullInterval, startDayTime);
    const weekendsCount = this._getWeekendsCount(days);
    let result = (days - weekendsCount) * DAY_MS;

    if (!allDay) {
      const { hiddenInterval } = this.viewDataProvider;
      const visibleDayDuration = this.getVisibleDayDuration();

      result = fullInterval - days * hiddenInterval - weekendsCount * visibleDayDuration;
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getWeekendsCount(argument?: any) {
    return 0;
  }

  _getDaysOfInterval(fullInterval, startDayTime) {
    return Math.floor((fullInterval + startDayTime) / DAY_MS);
  }

  _updateIndex(index) {
    return index * this._getRowCount();
  }

  _getDroppableCell() {
    return this._getDateTables().find(`.${DATE_TABLE_DROPPABLE_CELL_CLASS}`);
  }

  _getWorkSpaceWidth() {
    return this.cache.get('workspaceWidth', () => {
      if (this._needCreateCrossScrolling()) {
        return getBoundingRect(this._$dateTable.get(0)).width;
      }
      const totalWidth = getBoundingRect((this.$element() as any).get(0)).width;
      const timePanelWidth = this.getTimePanelWidth();
      const groupTableWidth = this.getGroupTableWidth();

      return totalWidth - timePanelWidth - groupTableWidth;
    });
  }

  _getCellByCoordinates(cellCoordinates, groupIndex, inAllDayRow) {
    const indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex, inAllDayRow);
    return this._dom_getDateCell(indexes);
  }

  // TODO DOM adapter
  _dom_getDateCell(position) {
    return this._$dateTable
      .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
      .eq(position.rowIndex)
      .find(`td:not(.${VIRTUAL_CELL_CLASS})`)
      .eq(position.columnIndex);
  }

  _dom_getAllDayPanelCell(columnIndex) {
    return this._$allDayPanel
      .find('tr').eq(0)
      .find('td').eq(columnIndex);
  }

  _getCells(allDay?: any, direction?: any) {
    const cellClass = allDay ? ALL_DAY_TABLE_CELL_CLASS : DATE_TABLE_CELL_CLASS;
    if (direction === 'vertical') {
      let result: any = [];
      for (let i = 1; ; i++) {
        const cells = (this.$element() as any).find(`tr .${cellClass}:nth-child(${i})`);
        if (!cells.length) break;
        result = result.concat(cells.toArray());
      }
      return $(result);
    }
    return (this.$element() as any).find(`.${cellClass}`);
  }

  _getFirstAndLastDataTableCell() {
    const selector = this.isVirtualScrolling()
      ? `.${DATE_TABLE_CELL_CLASS}, .${VIRTUAL_CELL_CLASS}`
      : `.${DATE_TABLE_CELL_CLASS}`;

    const $cells = (this.$element() as any).find(selector);
    return [$cells[0], $cells[$cells.length - 1]];
  }

  _getAllCells(allDay) {
    if (this._isVerticalGroupedWorkSpace()) {
      return this._$dateTable.find(`td:not(.${VIRTUAL_CELL_CLASS})`);
    }

    const cellClass = allDay && this.supportAllDayRow()
      ? ALL_DAY_TABLE_CELL_CLASS
      : DATE_TABLE_CELL_CLASS;

    return (this.$element() as any).find(`.${cellClass}`);
  }

  _setHorizontalGroupHeaderCellsHeight() {
    const { height } = getBoundingRect(this._$dateTable.get(0));
    setOuterHeight(this._$groupTable, height);
  }

  _getGroupHeaderCells() {
    return (this.$element() as any).find(`.${GROUP_HEADER_CLASS}`);
  }

  _getScrollCoordinates(hours, minutes, date, groupIndex?: any, allDay?: any) {
    const currentDate = date || new Date(this.option('currentDate') as any);
    const startDayHour = this.option('startDayHour')!;
    const endDayHour = this.option('endDayHour')!;

    if (hours < startDayHour) {
      hours = startDayHour;
    }

    if (hours >= endDayHour) {
      hours = endDayHour - 1;
    }

    currentDate.setHours(hours, minutes, 0, 0);

    const cell = this.viewDataProvider.findGlobalCellPosition(currentDate, groupIndex, allDay);
    const { position, cellData } = cell;

    return this.virtualScrollingDispatcher.calculateCoordinatesByDataAndPosition(
      cellData,
      position,
      currentDate,
      isDateAndTimeView(this.type as any),
      this.viewDirection === 'vertical',
    );
  }

  _isOutsideScrollable(target, event) {
    const $dateTableScrollableElement = this._dateTableScrollable.$element();
    const scrollableSize = getBoundingRect($dateTableScrollableElement.get(0));
    const window = getWindow();
    const isTargetInAllDayPanel = !$(target).closest($dateTableScrollableElement).length;
    const isOutsideHorizontalScrollable = event.pageX < scrollableSize.left || event.pageX > (scrollableSize.left + scrollableSize.width + (window.scrollX || 0));
    const isOutsideVerticalScrollable = event.pageY < scrollableSize.top || event.pageY > (scrollableSize.top + scrollableSize.height + (window.scrollY || 0));

    if (isTargetInAllDayPanel && !isOutsideHorizontalScrollable) {
      return false;
    }

    return isOutsideVerticalScrollable || isOutsideHorizontalScrollable;
  }

  setCellDataCache(cellCoordinates, groupIndex, $cell) {
    const key = JSON.stringify({
      rowIndex: cellCoordinates.rowIndex,
      columnIndex: cellCoordinates.columnIndex,
      groupIndex,
    });

    this.cache.set(
      key,
      this.getCellData($cell),
    );
  }

  setCellDataCacheAlias(appointment, geometry) {
    const key = JSON.stringify({
      rowIndex: appointment.rowIndex,
      columnIndex: appointment.columnIndex,
      groupIndex: appointment.groupIndex,
    });

    const aliasKey = JSON.stringify({
      top: geometry.top,
      left: geometry.left,
    });

    this.cache.set(
      aliasKey,
      this.cache.get(key),
    );
  }

  supportAllDayRow() {
    return true;
  }

  keepOriginalHours() {
    return false;
  }

  _filterCellDataFields(cellData) {
    return extend(true, {}, {
      startDate: cellData.startDate,
      endDate: cellData.endDate,
      groups: cellData.groups,
      groupIndex: cellData.groupIndex,
      allDay: cellData.allDay,
    });
  }

  getCellData($cell) {
    const cellData = this._getFullCellData($cell) || {};

    return this._filterCellDataFields(cellData);
  }

  _getFullCellData($cell) {
    const currentCell = $cell[0];
    if (currentCell) {
      return this._getDataByCell($cell);
    }

    return undefined;
  }

  _getVirtualRowOffset() {
    return this.virtualScrollingDispatcher.virtualRowOffset;
  }

  _getVirtualCellOffset() {
    return this.virtualScrollingDispatcher.virtualCellOffset;
  }

  _getDataByCell($cell) {
    const rowIndex = $cell.parent().index() - this.virtualScrollingDispatcher.topVirtualRowsCount;
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;

    const { viewDataProvider } = this;
    const isAllDayCell = this._hasAllDayClass($cell);

    const cellData = viewDataProvider.getCellData(rowIndex, columnIndex, isAllDayCell);

    return cellData || undefined;
  }

  isGroupedByDate() {
    return this.option('groupByDate')
            && this._isHorizontalGroupedWorkSpace()
            && this._getGroupCount() > 0;
  }

  // TODO: refactor current time indicator
  getCellIndexByDate(date, inAllDayRow?: any) {
    const { viewDataGenerator } = this.viewDataProvider;

    const timeInterval = inAllDayRow
      ? 24 * 60 * 60 * 1000
      : viewDataGenerator.getInterval(this.option('hoursInterval'));
    const startViewDateOffset = getStartViewDateTimeOffset(this.getStartViewDate(), this.option('startDayHour') as any);
    const dateTimeStamp = this._getIntervalBetween(date, inAllDayRow) + startViewDateOffset;

    let index = Math.floor(dateTimeStamp / timeInterval);

    if (inAllDayRow) {
      index = this._updateIndex(index);
    }

    if (index < 0) {
      index = 0;
    }

    return index;
  }

  getDroppableCellIndex() {
    const $droppableCell = this._getDroppableCell();
    const $row = $droppableCell.parent();
    const rowIndex = $row.index();

    return rowIndex * $row.find('td').length + $droppableCell.index();
  }

  getDataByDroppableCell() {
    const cellData = this.getCellData($(this._getDroppableCell()));
    const { allDay } = cellData;
    const { startDate } = cellData;
    const { endDate } = cellData;

    return {
      startDate,
      endDate,
      allDay,
      groups: cellData.groups,
    };
  }

  getDateRange() {
    return [
      this.getStartViewDate(),
      this.getEndViewDateByEndDayHour(),
    ];
  }

  getCellMinWidth() {
    return DATE_TABLE_MIN_CELL_WIDTH;
  }

  getRoundedCellWidth(groupIndex, startIndex, cellCount) {
    if (groupIndex < 0 || !hasWindow()) {
      return 0;
    }

    const $row = (this.$element() as any).find(`.${DATE_TABLE_ROW_CLASS}`).eq(0);
    let width = 0;
    const $cells = $row.find(`.${DATE_TABLE_CELL_CLASS}`);
    const totalCellCount = this._getCellCount() * groupIndex;

    cellCount = cellCount || this._getCellCount();

    if (!isDefined(startIndex)) {
      startIndex = totalCellCount;
    }

    for (let i = startIndex; i < totalCellCount + cellCount; i++) {
      const element = $($cells).eq(i).get(0);
      const elementWidth = element ? getBoundingRect(element).width : 0;
      width += elementWidth;
    }

    return width / (totalCellCount + cellCount - startIndex);
  }

  // Mappings
  getCellWidth() {
    return getCellWidth(this.getDOMElementsMetaData());
  }

  getCellHeight() {
    return getCellHeight(this.getDOMElementsMetaData());
  }

  getAllDayHeight() {
    return getAllDayHeight(
      this.option('showAllDayPanel'),
      this._isVerticalGroupedWorkSpace(),
      this.getDOMElementsMetaData(),
    );
  }

  getMaxAllowedPosition(groupIndex) {
    return getMaxAllowedPosition(
      groupIndex,
      this.viewDataProvider,
      this.option('rtlEnabled'),
      this.getDOMElementsMetaData(),
    );
  }

  getAllDayOffset() {
    return this._groupedStrategy.getAllDayOffset();
  }

  // NOTE: refactor leftIndex calculation
  getCellIndexByCoordinates(coordinates, allDay) {
    const { horizontalScrollingState, verticalScrollingState } = this.virtualScrollingDispatcher;

    const cellCount = horizontalScrollingState?.itemCount ?? this._getTotalCellCount(this._getGroupCount());

    const cellWidth = this.getCellWidth();
    const cellHeight = allDay ? this.getAllDayHeight() : this.getCellHeight();

    const leftCoordinateOffset = horizontalScrollingState?.virtualItemSizeBefore ?? 0;
    const topCoordinateOffset = verticalScrollingState?.virtualItemSizeBefore ?? 0;

    const topIndex = Math.floor(Math.floor(coordinates.top - topCoordinateOffset) / Math.floor(cellHeight));
    let leftIndex = (coordinates.left - leftCoordinateOffset) / cellWidth;
    leftIndex = Math.floor(leftIndex + CELL_INDEX_CALCULATION_EPSILON);

    if (this._isRTL()) {
      leftIndex = cellCount - leftIndex - 1;
    }

    return cellCount * topIndex + leftIndex;
  }

  getStartViewDate() {
    return this.viewDataProvider.getStartViewDate();
  }

  getEndViewDate() {
    return this.viewDataProvider.getLastCellEndDate();
  }

  getEndViewDateByEndDayHour() {
    return this.viewDataProvider.getLastViewDateByEndDayHour(this.option('endDayHour'));
  }

  getCellDuration() {
    return getCellDuration(
      this.type as any,
      this.option('startDayHour') as any,
      this.option('endDayHour') as any,
      this.option('hoursInterval') as any,
    );
  }

  getIntervalDuration(allDay) {
    return allDay
      ? toMs('day')
      : this.getCellDuration();
  }

  getVisibleDayDuration() {
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');
    const hoursInterval = this.option('hoursInterval');

    return this.viewDataProvider.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  getGroupBounds(coordinates) {
    const groupBounds = this._groupedStrategy instanceof VerticalGroupedStrategy
      ? this.getGroupBoundsVertical(coordinates.groupIndex)
      : this.getGroupBoundsHorizontal(coordinates);

    return this._isRTL()
      ? this.getGroupBoundsRtlCorrection(groupBounds)
      : groupBounds;
  }

  getGroupBoundsVertical(groupIndex) {
    const $firstAndLastCells = this._getFirstAndLastDataTableCell();
    return this._groupedStrategy.getGroupBoundsOffset(groupIndex, $firstAndLastCells);
  }

  getGroupBoundsHorizontal(coordinates) {
    const cellCount = this._getCellCount();
    const $cells = this._getCells();
    const cellWidth = this.getCellWidth();

    const { groupedDataMap } = this.viewDataProvider;
    return this._groupedStrategy
      .getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap);
  }

  getGroupBoundsRtlCorrection(groupBounds) {
    const cellWidth = this.getCellWidth();

    return {
      ...groupBounds,
      left: groupBounds.right - cellWidth * 2,
      right: groupBounds.left + cellWidth * 2,
    };
  }

  needRecalculateResizableArea() {
    return this._isVerticalGroupedWorkSpace() && this.getScrollable().scrollTop() !== 0;
  }

  getCellDataByCoordinates(coordinates, allDay) {
    const key = JSON.stringify({ top: coordinates.top, left: coordinates.left });
    return this.cache.get(key, () => {
      const $cells = this._getCells(allDay);
      const cellIndex = this.getCellIndexByCoordinates(coordinates, allDay);
      const $cell = $cells.eq(cellIndex);

      return this.getCellData($cell);
    });
  }

  getVisibleBounds() { // TODO - this method is only used by the Agenda
    const result: any = {};
    const $scrollable = this.getScrollable().$element();
    const cellHeight = this.getCellHeight();
    const scrolledCellCount = this.getScrollableScrollTop() / cellHeight;
    const totalCellCount = scrolledCellCount + getHeight($scrollable) / cellHeight;

    result.top = {
      hours: Math.floor(scrolledCellCount * (this.option('hoursInterval') as any)) + (this.option('startDayHour') as any),
      minutes: scrolledCellCount % 2 ? 30 : 0,
    };

    result.bottom = {
      hours: Math.floor(totalCellCount * (this.option('hoursInterval') as any)) + (this.option('startDayHour') as any),
      minutes: Math.floor(totalCellCount) % 2 ? 30 : 0,
    };

    return result;
  }

  updateScrollPosition(date, groups, allDay = false) {
    const newDate = this.timeZoneCalculator.createDate(date, { path: 'toGrid' });
    const inAllDayRow = allDay && this.isAllDayPanelVisible;

    if (this.needUpdateScrollPosition(newDate, groups, inAllDayRow)) {
      this.scrollTo(newDate, groups, inAllDayRow, false);
    }
  }

  needUpdateScrollPosition(date, groups, inAllDayRow) {
    const cells = this._getCellsInViewport(inAllDayRow);
    const groupIndex = this._isGroupsSpecified(groups)
      ? this._getGroupIndexByResourceId(groups)
      : 0;
    const time = date.getTime();
    const trimmedTime = dateUtils.trimTime(date).getTime();

    return cells.reduce((currentResult, cell) => {
      const {
        startDate: cellStartDate,
        endDate: cellEndDate,
        groupIndex: cellGroupIndex,
      } = this.getCellData(cell);

      const cellStartTime = cellStartDate.getTime();
      const cellEndTime = cellEndDate.getTime();

      if (((!inAllDayRow && cellStartTime <= time
                && time < cellEndTime)
                || (inAllDayRow && trimmedTime === cellStartTime))
                && groupIndex === cellGroupIndex) {
        return false;
      }
      return currentResult;
    }, true);
  }

  _getCellsInViewport(inAllDayRow) {
    const $scrollable = this.getScrollable().$element();
    const cellHeight = this.getCellHeight();
    const cellWidth = this.getCellWidth();
    const totalColumnCount = this._getTotalCellCount(this._getGroupCount());
    const scrollableScrollTop = this.getScrollableScrollTop();
    const scrollableScrollLeft = this.getScrollableScrollLeft();

    const fullScrolledRowCount = scrollableScrollTop / cellHeight - this.virtualScrollingDispatcher.topVirtualRowsCount;

    let scrolledRowCount = Math.floor(fullScrolledRowCount);
    if (scrollableScrollTop % cellHeight !== 0) {
      scrolledRowCount += 1;
    }

    // TODO horizontal v-scrolling
    const fullScrolledColumnCount = scrollableScrollLeft / cellWidth;
    let scrolledColumnCount = Math.floor(fullScrolledColumnCount);
    if (scrollableScrollLeft % cellWidth !== 0) {
      scrolledColumnCount += 1;
    }

    const rowCount = Math.floor(fullScrolledRowCount + getHeight($scrollable) / cellHeight);
    const columnCount = Math.floor(fullScrolledColumnCount + getWidth($scrollable) / cellWidth);

    const $cells = this._getAllCells(inAllDayRow);
    const result: any = [];

    $cells.each(function (index) {
      const $cell = $(this);
      const columnIndex = index % totalColumnCount;
      const rowIndex = index / totalColumnCount;

      if (scrolledColumnCount <= columnIndex
                && columnIndex < columnCount
                && scrolledRowCount <= rowIndex
                && rowIndex < rowCount) {
        result.push($cell);
      }
    });

    return result;
  }

  scrollToTime(hours, minutes, date) {
    if (!this._isValidScrollDate(date)) {
      return;
    }

    const coordinates = this._getScrollCoordinates(hours, minutes, date);

    const scrollable = this.getScrollable();

    scrollable.scrollBy({
      top: coordinates.top - scrollable.scrollTop(),
      left: 0,
    });
  }

  scrollTo(date, groups, allDay = false, throwWarning = true) {
    if (!this._isValidScrollDate(date, throwWarning)) {
      return;
    }

    const groupIndex = this._getGroupCount() && groups
      ? this._getGroupIndexByResourceId(groups)
      : 0;
    const isScrollToAllDay = allDay && this.isAllDayPanelVisible;

    const coordinates = this._getScrollCoordinates(date.getHours(), date.getMinutes(), date, groupIndex, isScrollToAllDay);

    const scrollable = this.getScrollable();
    const $scrollable = scrollable.$element();

    const cellWidth = this.getCellWidth();
    const offset = this.option('rtlEnabled')
      ? cellWidth
      : 0;
    const scrollableHeight = getHeight($scrollable);
    const scrollableWidth = getWidth($scrollable);
    const cellHeight = this.getCellHeight();

    const xShift = (scrollableWidth - cellWidth) / 2;
    const yShift = (scrollableHeight - cellHeight) / 2;

    const left = coordinates.left - scrollable.scrollLeft() - xShift - offset;
    let top = coordinates.top - scrollable.scrollTop() - yShift;
    if (isScrollToAllDay && !this._isVerticalGroupedWorkSpace()) {
      top = 0;
    }

    if (this.option('templatesRenderAsynchronously')) {
      setTimeout(() => {
        scrollable.scrollBy({ left, top });
      });
    } else {
      scrollable.scrollBy({ left, top });
    }
  }

  _isValidScrollDate(date, throwWarning = true) {
    const min = this.getStartViewDate();
    const max = this.getEndViewDate();

    if (date < min || date > max) {
      throwWarning && errors.log('W1008', date);
      return false;
    }

    return true;
  }

  needApplyCollectorOffset() {
    return false;
  }

  removeDroppableCellClass($cellElement?: any) {
    const $cell = $cellElement || this._getDroppableCell();
    $cell?.removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
  }

  _getCoordinatesByCell($cell) {
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;
    let rowIndex = $cell.parent().index();
    const isAllDayCell = this._hasAllDayClass($cell);
    const isVerticalGrouping = this._isVerticalGroupedWorkSpace();

    if (!(isAllDayCell && !isVerticalGrouping)) {
      rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
    }

    return { rowIndex, columnIndex };
  }

  _isShowAllDayPanel() {
    return this.option('showAllDayPanel');
  }

  _getTimePanelCells() {
    return (this.$element() as any).find(`.${TIME_PANEL_CELL_CLASS}`);
  }

  _getRDateTableProps() {
    return {
      viewData: this.viewDataProvider.viewData,
      viewContext: this.getR1ComponentsViewContext(),
      dataCellTemplate: this.option('dataCellTemplate'),
      addDateTableClass: !this.option('crossScrollingEnabled') || this.isVirtualScrolling(),
      groupOrientation: this.option('groupOrientation'),
      addVerticalSizesClassToRows: false,
    };
  }

  protected getR1ComponentsViewContext(): ViewContext {
    return {
      view: {
        type: this.type as ViewType,
      },
      crossScrollingEnabled: !!this.option('crossScrollingEnabled'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateSelectedCellDataOption(selectedCellData, $nextFocusedCell?: any) {
    const correctedSelectedCellData = selectedCellData.map(({
      startDate,
      endDate,
      allDay,
      groupIndex,
      groups,
    }) => ({
      startDate,
      endDate,
      allDay,
      groupIndex,
      groups,
    }));

    this.option('selectedCellData', correctedSelectedCellData);
    this._selectionChangedAction({ selectedCellData: correctedSelectedCellData });
  }

  _getCellByData(cellData) {
    const {
      startDate, groupIndex, allDay, index,
    } = cellData;

    const position = this.viewDataProvider.findCellPositionInMap({
      startDate,
      groupIndex,
      isAllDay: allDay,
      index,
    });

    if (!position) {
      return undefined;
    }

    return allDay && !this._isVerticalGroupedWorkSpace()
      ? this._dom_getAllDayPanelCell(position.columnIndex)
      : this._dom_getDateCell(position);
  }

  // Must replace all DOM manipulations
  getDOMElementsMetaData() {
    return this.cache.get('cellElementsMeta', () => ({
      dateTableCellsMeta: this._getDateTableDOMElementsInfo(),
      allDayPanelCellsMeta: this._getAllDayPanelDOMElementsInfo(),
    }));
  }

  _getDateTableDOMElementsInfo() {
    const dateTableCells = this._getAllCells(false);
    if (!dateTableCells.length || !hasWindow()) {
      return [[{}]];
    }

    const dateTable = this._getDateTable();
    // We should use getBoundingClientRect in renovation
    const dateTableRect = getBoundingRect(dateTable.get(0));

    const columnsCount = this.viewDataProvider.getColumnsCount();

    const result: any = [];

    dateTableCells.each((index, cell) => {
      const rowIndex = Math.floor(index / columnsCount);

      if (result.length === rowIndex) {
        result.push([]);
      }

      this._addCellMetaData(result[rowIndex], cell, dateTableRect);
    });

    return result;
  }

  _getAllDayPanelDOMElementsInfo() {
    const result = [];

    if (this.isAllDayPanelVisible && !this._isVerticalGroupedWorkSpace() && hasWindow()) {
      const allDayCells = this._getAllCells(true);

      if (!allDayCells.length) {
        return [{}];
      }

      const allDayAppointmentContainer = this._$allDayPanel;
      const allDayPanelRect = getBoundingRect(allDayAppointmentContainer.get(0));

      allDayCells.each((_, cell) => {
        this._addCellMetaData(result, cell, allDayPanelRect);
      });
    }

    return result;
  }

  _addCellMetaData(cellMetaDataArray, cell, parentRect) {
    const cellRect = getBoundingRect(cell);

    cellMetaDataArray.push({
      left: cellRect.left - parentRect.left,
      top: cellRect.top - parentRect.top,
      width: cellRect.width,
      height: cellRect.height,
    });
  }

  // TODO: remove along with old render
  _oldRender_getAllDayCellData(groupIndex) {
    return (cell, rowIndex, columnIndex) => {
      const validColumnIndex = columnIndex % this._getCellCount();
      const options = this._getDateGenerationOptions(true);
      let startDate = this.viewDataProvider.viewDataGenerator.getDateByCellIndices(options, rowIndex, validColumnIndex, this._getCellCountInDay());

      startDate = dateUtils.trimTime(startDate);

      let validGroupIndex = groupIndex || 0;

      if (this.isGroupedByDate()) {
        validGroupIndex = Math.floor(columnIndex % this._getGroupCount());
      } else if (this._isHorizontalGroupedWorkSpace()) {
        validGroupIndex = Math.floor(columnIndex / this._getCellCount());
      }

      const data: any = {
        startDate,
        endDate: startDate,
        allDay: true,
        groupIndex: validGroupIndex,
      };

      const groupsArray = getCellGroups(validGroupIndex, this.option('groups'));

      if (groupsArray.length) {
        data.groups = getGroupsObjectFromGroupsArray(groupsArray);
      }

      return {
        key: CELL_DATA,
        value: data,
      };
    };
  }

  // ------------
  // Methods that render renovated components. Useless in renovation
  // ------------

  renderRWorkSpace({
    header,
    timePanel,
    dateTable,
    allDayPanel,
  }: RenderComponentOptions = DEFAULT_WORKSPACE_RENDER_OPTIONS.renderComponents) {
    if (header) {
      this.renderRHeaderPanel();
    }

    if (timePanel) {
      this.renderRTimeTable();
    }

    if (dateTable) {
      this.renderRDateTable();
    }

    if (allDayPanel) {
      this.renderRAllDayPanel();
    }
  }

  renderRDateTable() {
    utils.renovation.renderComponent(
      this,
      this._$dateTable,
      DateTableComponent,
      'renovatedDateTable',
      this._getRDateTableProps(),
    );
  }

  renderRGroupPanel() {
    const options = {
      viewContext: this.getR1ComponentsViewContext(),
      groups: this.option('groups'),
      groupOrientation: this.option('groupOrientation'),
      groupByDate: this.isGroupedByDate(),
      resourceCellTemplate: this.option('resourceCellTemplate'),
      className: this.verticalGroupTableClass,
      groupPanelData: this.viewDataProvider.getGroupPanelData(
        this.generateRenderOptions(),
      ),
    };

    if (this.option('groups')?.length) {
      this._attachGroupCountClass();
      utils.renovation.renderComponent(
        this,
        this._getGroupHeaderContainer(),
        GroupPanelComponent,
        'renovatedGroupPanel',
        options,
      );
    } else {
      this._detachGroupCountClass();
    }
  }

  renderRAllDayPanel() {
    const visible = this.isAllDayPanelVisible && !this.isGroupedAllDayPanel();

    if (visible) {
      this._toggleAllDayVisibility(false);

      const options = {
        viewData: this.viewDataProvider.viewData,
        viewContext: this.getR1ComponentsViewContext(),
        dataCellTemplate: this.option('dataCellTemplate'),
        startCellIndex: 0,
        ...this.virtualScrollingDispatcher.horizontalVirtualScrolling?.getRenderState() || {},
      };

      utils.renovation.renderComponent(this, this._$allDayTable, AllDayTableComponent, 'renovatedAllDayPanel', options);
      utils.renovation.renderComponent(this, this._$allDayTitle, AllDayPanelTitleComponent, 'renovatedAllDayPanelTitle', {});
    }

    this._toggleAllDayVisibility(true);
  }

  renderRTimeTable() {
    utils.renovation.renderComponent(
      this,
      this._$timePanel,
      TimePanelComponent,
      'renovatedTimePanel',
      {
        viewContext: this.getR1ComponentsViewContext(),
        timePanelData: this.viewDataProvider.timePanelData,
        timeCellTemplate: this.option('timeCellTemplate'),
        groupOrientation: this.option('groupOrientation'),
      },
    );
  }

  renderRHeaderPanel(isRenderDateHeader = true) {
    if (this.option('groups')?.length) {
      this._attachGroupCountClass();
    } else {
      this._detachGroupCountClass();
    }

    utils.renovation.renderComponent(
      this,
      this._$thead,
      this.renovatedHeaderPanelComponent,
      'renovatedHeaderPanel',
      {
        viewContext: this.getR1ComponentsViewContext(),
        dateHeaderData: this.viewDataProvider.dateHeaderData,
        groupPanelData: this.viewDataProvider.getGroupPanelData(
          this.generateRenderOptions(),
        ),
        dateCellTemplate: this.option('dateCellTemplate'),
        timeCellTemplate: this.option('timeCellTemplate'),
        groups: this.option('groups'),
        groupByDate: this.isGroupedByDate(),
        groupOrientation: this.option('groupOrientation'),
        resourceCellTemplate: this.option('resourceCellTemplate'),
        isRenderDateHeader,
      },
    );
  }

  // ------------
  // DnD should be removed from work-space
  // ------------

  initDragBehavior(scheduler) {
    if (!this.dragBehavior && scheduler) {
      this.dragBehavior = new AppointmentDragBehavior(scheduler);

      const $rootElement = $(scheduler.element());

      this._createDragBehavior(this.getWorkArea(), $rootElement);
      if (!this._isVerticalGroupedWorkSpace()) {
        this._createDragBehavior(this._$allDayPanel, $rootElement);
      }
    }
  }

  _createDragBehavior($targetElement, $rootElement) {
    const getItemData = (itemElement, appointments) => appointments._getItemData(itemElement);
    const getItemSettings = ($itemElement) => $itemElement.data(APPOINTMENT_SETTINGS_KEY);

    const options = {
      getItemData,
      getItemSettings,
    };

    this._createDragBehaviorBase($targetElement, $rootElement, options);
  }

  _createDragBehaviorBase(targetElement, rootElement, options) {
    const container = (this.$element() as any).find(`.${FIXED_CONTAINER_CLASS}`);

    const disableDefaultDragging = () => {
      if (!this.isDefaultDraggingMode) {
        this.preventDefaultDragging = true;
      }
    };

    const enableDefaultDragging = () => {
      if (!this.isDefaultDraggingMode) {
        this.preventDefaultDragging = false;
      }
    };

    this.dragBehavior.addTo(targetElement, createDragBehaviorConfig(
      container,
      rootElement,
      this.isDefaultDraggingMode,
      this.dragBehavior,
      enableDefaultDragging,
      disableDefaultDragging,
      () => this._getDroppableCell(),
      () => this._getDateTables(),
      () => this.removeDroppableCellClass(),
      () => this.getCellWidth(),
      options,
    ));
  }

  // --------------
  // We do not need these methods in renovation
  // --------------

  _isRenderHeaderPanelEmptyCell() {
    return this._isVerticalGroupedWorkSpace();
  }

  _dispose() {
    // @ts-expect-error
    super._dispose();

    this.virtualScrollingDispatcher.dispose();
  }

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(super._getDefaultOptions(), {
      currentDate: new Date(),
      intervalCount: 1,
      startDate: null,
      firstDayOfWeek: undefined,
      startDayHour: 0,
      endDayHour: 24,
      viewOffset: 0,
      hoursInterval: 0.5,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      groups: [],
      showAllDayPanel: true,
      allDayExpanded: false,
      onCellClick: null,
      crossScrollingEnabled: false,
      dataCellTemplate: null,
      timeCellTemplate: null,
      resourceCellTemplate: null,
      dateCellTemplate: null,
      allowMultipleCellSelection: true,
      indicatorTime: new Date(),
      indicatorUpdateInterval: 5 * toMs('minute'),
      shadeUntilCurrentTime: true,
      groupOrientation: 'horizontal',
      selectedCellData: [],
      groupByDate: false,
      scrolling: {
        mode: 'standard',
      },
      allDayPanelMode: 'all',
      renovateRender: true,
      height: undefined,
      draggingMode: 'outlook',
      onScrollEnd: () => {},
      getHeaderHeight: undefined,
      onRenderAppointments: () => {},
      onShowAllDayPanel: () => {},
      onSelectedCellsClick: () => {},
      timeZoneCalculator: undefined,
      schedulerHeight: undefined,
      schedulerWidth: undefined,
    });
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'startDayHour':
      case 'endDayHour':
      case 'viewOffset':
      case 'dateCellTemplate':
      case 'resourceCellTemplate':
      case 'dataCellTemplate':
      case 'timeCellTemplate':
      case 'hoursInterval':
      case 'firstDayOfWeek':
      case 'currentDate':
      case 'startDate':
        this._cleanWorkSpace();
        break;
      case 'groups':
        this._cleanView();
        this._removeAllDayElements();
        this._initGrouping();
        this.repaint();
        break;
      case 'groupOrientation':
        this._initGroupedStrategy();
        this._createAllDayPanelElements();
        this._removeAllDayElements();
        this._cleanWorkSpace();
        this._toggleGroupByDateClass();
        break;
      case 'showAllDayPanel':
        if (this._isVerticalGroupedWorkSpace()) {
          this._cleanView();
          this._removeAllDayElements();
          this._initGrouping();
          this.repaint();
        } else if (!this.isRenovatedRender()) {
          this._toggleAllDayVisibility(true);
        } else {
          this.renderWorkSpace();
        }
        break;
      case 'allDayExpanded':
        this._changeAllDayVisibility();
        this._attachTablesEvents();
        this._updateScrollable();
        break;
      case 'onSelectionChanged':
        this._createSelectionChangedAction();
        break;
      case 'onCellClick':
        this._createCellClickAction();
        break;
      case 'onCellContextMenu':
        this._attachContextMenuEvent();
        break;
      case 'intervalCount':
        this._cleanWorkSpace();
        this._toggleWorkSpaceCountClass();
        break;
      case 'groupByDate':
        this._cleanWorkSpace();
        this._toggleGroupByDateClass();
        break;
      case 'crossScrollingEnabled':
        this._toggleHorizontalScrollClass();
        this._dateTableScrollable.option(this._dateTableScrollableConfig());
        break;
      case 'allDayPanelMode':
        this.updateShowAllDayPanel();
        this.updateAppointments();
        break;
      case 'width':
        // @ts-expect-error
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'timeZoneCalculator':
      case 'allowMultipleCellSelection':
        break;
      case 'selectedCellData':
        break;
      case 'renovateRender':
      case 'scrolling':
        this.repaint();
        break;
      case 'schedulerHeight':
      case 'schedulerWidth':
        this.virtualScrollingDispatcher.updateDimensions(true);
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  updateShowAllDayPanel() {
    const isHiddenAllDayPanel = this.option('allDayPanelMode') === 'hidden';
    (this.option('onShowAllDayPanel') as any)(!isHiddenAllDayPanel);
  }

  _getVirtualScrollingDispatcherOptions() {
    return {
      getCellHeight: this.getCellHeight.bind(this),
      getCellWidth: this.getCellWidth.bind(this),
      getCellMinWidth: this.getCellMinWidth.bind(this),
      isRTL: this._isRTL.bind(this),
      getSchedulerHeight: () => this.option('schedulerHeight'),
      getSchedulerWidth: () => this.option('schedulerWidth'),
      getViewHeight: () => ((this.$element() as any).height ? (this.$element() as any).height() : getHeight(this.$element())),
      getViewWidth: () => ((this.$element() as any).width ? (this.$element() as any).width() : getWidth(this.$element())),
      getWindowHeight: () => getWindow().innerHeight,
      getWindowWidth: () => getWindow().innerWidth,
      getScrolling: () => this.option('scrolling'),
      getScrollableOuterWidth: this.getScrollableOuterWidth.bind(this),
      getScrollable: this.getScrollable.bind(this),
      createAction: this._createAction.bind(this),
      updateRender: this.updateRender.bind(this),
      updateGrid: this.updateGrid.bind(this),
      getGroupCount: this._getGroupCount.bind(this),
      isVerticalGrouping: this._isVerticalGroupedWorkSpace.bind(this),
      getTotalRowCount: this._getTotalRowCount.bind(this),
      getTotalCellCount: this._getTotalCellCount.bind(this),
    };
  }

  _cleanWorkSpace() {
    this._cleanView();
    this._toggleGroupedClass();
    this._toggleWorkSpaceWithOddCells();

    this.virtualScrollingDispatcher.updateDimensions(true);
    this._renderView();
    this.option('crossScrollingEnabled') && this._setTableSizes();
    this.cache.clear();
  }

  _init() {
    this._scrollSync = {};
    this._viewDataProvider = null;
    this._cellsSelectionState = null;
    this._activeStateUnit = CELL_SELECTOR;

    // @ts-expect-error
    super._init();

    this._initGrouping();

    this._toggleHorizontalScrollClass();
    this._toggleWorkSpaceCountClass();
    this._toggleGroupByDateClass();
    this._toggleWorkSpaceWithOddCells();

    (this.$element() as any)
      .addClass(COMPONENT_CLASS)
      .addClass(this._getElementClass());
  }

  _initPositionHelper() {
    this.positionHelper = new PositionHelper({
      key: this.option('key'),
      viewDataProvider: this.viewDataProvider,
      viewStartDayHour: this.option('startDayHour'),
      viewEndDayHour: this.option('endDayHour'),
      cellDuration: this.getCellDuration(),
      groupedStrategy: this._groupedStrategy,
      isGroupedByDate: this.isGroupedByDate(),
      rtlEnabled: this.option('rtlEnabled'),
      startViewDate: this.getStartViewDate(),
      isVerticalGrouping: this._isVerticalGroupedWorkSpace(),
      groupCount: this._getGroupCount(),
      isVirtualScrolling: this.isVirtualScrolling(),
      getDOMMetaDataCallback: this.getDOMElementsMetaData.bind(this),
    });
  }

  _initGrouping() {
    this._initGroupedStrategy();
    this._toggleGroupingDirectionClass();
    this._toggleGroupByDateClass();
  }

  isVerticalOrientation() {
    const orientation = this.option('groups')?.length
      ? this.option('groupOrientation')
      : this._getDefaultGroupStrategy();

    return orientation === 'vertical';
  }

  _initGroupedStrategy() {
    const Strategy = this.isVerticalOrientation()
      ? VerticalGroupedStrategy
      : HorizontalGroupedStrategy;

    this._groupedStrategy = new Strategy(this);
  }

  _getDefaultGroupStrategy() {
    return 'horizontal';
  }

  _toggleHorizontalScrollClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_BOTH_SCROLLS_CLASS, this.option('crossScrollingEnabled'));
  }

  _toggleGroupByDateClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS, this.isGroupedByDate());
  }

  _toggleWorkSpaceCountClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_COUNT_CLASS, this._isWorkSpaceWithCount());
  }

  _toggleWorkSpaceWithOddCells() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_ODD_CELLS_CLASS, this._isWorkspaceWithOddCells());
  }

  _toggleGroupingDirectionClass() {
    (this.$element() as any).toggleClass(VERTICAL_GROUPED_WORKSPACE_CLASS, this._isVerticalGroupedWorkSpace());
  }

  _getDateTableCellClass(rowIndex?: any, columnIndex?: any) {
    const cellClass = `${DATE_TABLE_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS} ${VERTICAL_SIZES_CLASS}`;

    return this._groupedStrategy
      .addAdditionalGroupCellClasses(cellClass, columnIndex + 1, rowIndex, columnIndex);
  }

  _getGroupHeaderClass(i?: any) {
    const cellClass = GROUP_HEADER_CLASS;

    return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1);
  }

  _initWorkSpaceUnits() {
    this._$headerPanelContainer = $('<div>').addClass('dx-scheduler-header-panel-container');
    this._$headerTablesContainer = $('<div>').addClass('dx-scheduler-header-tables-container');
    this._$headerPanel = $('<table>').attr('aria-hidden', true);
    this._$thead = $('<thead>').appendTo(this._$headerPanel);
    this._$headerPanelEmptyCell = $('<div>').addClass('dx-scheduler-header-panel-empty-cell');
    this._$allDayTable = $('<table>').attr('aria-hidden', true);

    this._$fixedContainer = $('<div>').addClass(FIXED_CONTAINER_CLASS);
    this._$allDayContainer = $('<div>').addClass(ALL_DAY_CONTAINER_CLASS);
    this._$dateTableScrollableContent = $('<div>').addClass('dx-scheduler-date-table-scrollable-content');
    this._$sidebarScrollableContent = $('<div>').addClass('dx-scheduler-side-bar-scrollable-content');

    this._initAllDayPanelElements();

    if (this.isRenovatedRender()) {
      this.createRAllDayPanelElements();
    } else {
      this._createAllDayPanelElements();
    }

    this._$timePanel = $('<table>').addClass(TIME_PANEL_CLASS).attr('aria-hidden', true);
    this._$dateTable = $('<table>').attr('aria-hidden', true);
    this._$dateTableContainer = $('<div>').addClass('dx-scheduler-date-table-container');
    this._$groupTable = $('<div>').addClass(WORKSPACE_VERTICAL_GROUP_TABLE_CLASS);
  }

  _initAllDayPanelElements() {
    this._allDayTitles = [];
    this._allDayTables = [];
    this._allDayPanels = [];
  }

  _initDateTableScrollable() {
    const $dateTableScrollable = $('<div>').addClass(SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS);

    // @ts-expect-error
    this._dateTableScrollable = this._createComponent($dateTableScrollable, Scrollable, this._dateTableScrollableConfig());
    this._scrollSync.dateTable = getMemoizeScrollTo(() => this._dateTableScrollable);
  }

  _createWorkSpaceElements() {
    if (this.option('crossScrollingEnabled')) {
      this._createWorkSpaceScrollableElements();
    } else {
      this._createWorkSpaceStaticElements();
    }
  }

  _createWorkSpaceStaticElements() {
    this._$dateTableContainer.append(this._$dateTable);

    if (this._isVerticalGroupedWorkSpace()) {
      this._$dateTableContainer.append(this._$allDayContainer);
      this._$dateTableScrollableContent.append(
        this._$groupTable,
        this._$timePanel,
        this._$dateTableContainer,
      );
      this._dateTableScrollable.$content().append(
        this._$dateTableScrollableContent,
      );

      this._$headerTablesContainer.append(this._$headerPanel);
    } else {
      this._$dateTableScrollableContent.append(
        this._$timePanel,
        this._$dateTableContainer,
      );
      this._dateTableScrollable.$content().append(this._$dateTableScrollableContent);

      this._$headerTablesContainer.append(this._$headerPanel, this._$allDayPanel);
      this._$allDayPanel?.append(this._$allDayContainer, this._$allDayTable);
    }

    this._appendHeaderPanelEmptyCellIfNecessary();
    this._$headerPanelContainer.append(this._$headerTablesContainer);

    this.$element().append(
      this._$fixedContainer,
      this._$headerPanelContainer,
      this._dateTableScrollable.$element(),
    );
  }

  _createWorkSpaceScrollableElements() {
    this.$element().append(this._$fixedContainer);

    this._$flexContainer = $('<div>').addClass('dx-scheduler-work-space-flex-container');

    this._createHeaderScrollable();

    this._headerScrollable.$content().append(this._$headerPanel);
    this._appendHeaderPanelEmptyCellIfNecessary();
    this._$headerPanelContainer.append(this._$headerTablesContainer);

    this.$element().append(this._$headerPanelContainer);
    this.$element().append(this._$flexContainer);

    this._createSidebarScrollable();
    this._$flexContainer.append(this._dateTableScrollable.$element());

    this._$dateTableContainer.append(this._$dateTable);
    this._$dateTableScrollableContent.append(this._$dateTableContainer);

    this._dateTableScrollable.$content().append(this._$dateTableScrollableContent);

    if (this._isVerticalGroupedWorkSpace()) {
      this._$dateTableContainer.append(this._$allDayContainer);
      this._$sidebarScrollableContent.append(this._$groupTable, this._$timePanel);
    } else {
      this._headerScrollable.$content().append(this._$allDayPanel);
      this._$allDayPanel?.append(this._$allDayContainer, this._$allDayTable);
      this._$sidebarScrollableContent.append(this._$timePanel);
    }

    this._sidebarScrollable.$content().append(this._$sidebarScrollableContent);
  }

  _appendHeaderPanelEmptyCellIfNecessary() {
    this._isRenderHeaderPanelEmptyCell() && this._$headerPanelContainer.append(this._$headerPanelEmptyCell);
  }

  _createHeaderScrollable() {
    const $headerScrollable = $('<div>')
      .addClass(SCHEDULER_HEADER_SCROLLABLE_CLASS)
      .appendTo(this._$headerTablesContainer);

    // @ts-expect-error
    this._headerScrollable = this._createComponent($headerScrollable, Scrollable, this._headerScrollableConfig());
    this._scrollSync.header = getMemoizeScrollTo(() => this._headerScrollable);
  }

  _createSidebarScrollable() {
    const $timePanelScrollable = $('<div>')
      .addClass(SCHEDULER_SIDEBAR_SCROLLABLE_CLASS)
      .appendTo(this._$flexContainer);

    // @ts-expect-error
    this._sidebarScrollable = this._createComponent($timePanelScrollable, Scrollable, {
      useKeyboard: false,
      showScrollbar: 'never',
      direction: 'vertical',
      useNative: false,
      updateManually: true,
      bounceEnabled: false,
      onScroll: (event) => {
        this._scrollSync.dateTable({ top: event.scrollOffset.top });
      },
    });
    this._scrollSync.sidebar = getMemoizeScrollTo(() => this._sidebarScrollable);
  }

  _attachTableClasses() {
    this._addTableClass(this._$dateTable, DATE_TABLE_CLASS);

    if (this._isVerticalGroupedWorkSpace()) {
      const groupCount = this._getGroupCount();

      for (let i = 0; i < groupCount; i++) {
        this._addTableClass(this._allDayTables[i], ALL_DAY_TABLE_CLASS);
      }
    } else if (!this.isRenovatedRender()) {
      this._addTableClass(this._$allDayTable, ALL_DAY_TABLE_CLASS);
    }
  }

  _attachHeaderTableClasses() {
    this._addTableClass(this._$headerPanel, HEADER_PANEL_CLASS);
  }

  _addTableClass($el, className) {
    ($el && !$el.hasClass(className)) && $el.addClass(className);
  }

  _initMarkup() {
    this.cache.clear();

    this._initWorkSpaceUnits();

    this._initVirtualScrolling();

    this._initDateTableScrollable();

    this._createWorkSpaceElements();

    // @ts-expect-error
    super._initMarkup();

    if (!this.option('crossScrollingEnabled')) {
      this._attachTableClasses();
      this._attachHeaderTableClasses();
    }

    this._toggleGroupedClass();

    this._renderView();
    this._attachEvents();
  }

  _render() {
    // @ts-expect-error
    super._render();
    this._renderDateTimeIndication();
    this._setIndicationUpdateInterval();
  }

  _toggleGroupedClass() {
    (this.$element() as any).toggleClass(GROUPED_WORKSPACE_CLASS, this._getGroupCount() > 0);
  }

  _renderView() {
    if (this.isRenovatedRender()) {
      if (this._isVerticalGroupedWorkSpace()) {
        this.renderRGroupPanel();
      }
    } else {
      this._applyCellTemplates(
        this._renderGroupHeader(),
      );
    }

    this.renderWorkSpace();
    if (this.isRenovatedRender()) {
      this.virtualScrollingDispatcher.updateDimensions();
    }

    this._updateGroupTableHeight();
    this.updateHeaderEmptyCellWidth();

    this._shader = new VerticalShader(this);
  }

  updateCellsSelection() {
    const renderOptions = this.generateRenderOptions();
    this.viewDataProvider.updateViewData(renderOptions);
    this.renderRWorkSpace({
      timePanel: true,
      dateTable: true,
      allDayPanel: true,
    });
  }

  protected _renderDateTimeIndication() { return noop(); }

  protected renderCurrentDateTimeLineAndShader(): void { return noop(); }

  protected renderCurrentDateTimeIndication(): void { return noop(); }

  protected _setIndicationUpdateInterval() { return noop(); }

  _detachGroupCountClass() {
    [
      ...VERTICAL_GROUP_COUNT_CLASSES,
    ].forEach((className) => {
      (this.$element() as any).removeClass(className);
    });
  }

  _attachGroupCountClass() {
    const className = this._groupedStrategy.getGroupCountClass(this.option('groups'));

    (this.$element() as any).addClass(className);
  }

  _getDateHeaderTemplate() {
    return this.option('dateCellTemplate');
  }

  _toggleAllDayVisibility(isUpdateScrollable) {
    const showAllDayPanel = this._isShowAllDayPanel();
    (this.$element() as any).toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, showAllDayPanel);

    this._changeAllDayVisibility();
    isUpdateScrollable && this._updateScrollable();
  }

  _changeAllDayVisibility() {
    this.cache.clear();
    (this.$element() as any).toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, !this.option('allDayExpanded') && this._isShowAllDayPanel());
  }

  _getDateTables() {
    return this._$dateTable.add(this._$allDayTable);
  }

  _getDateTable() {
    return this._$dateTable;
  }

  _removeAllDayElements() {
    this._$allDayTable && this._$allDayTable.remove();
    this._$allDayTitle && this._$allDayTitle.remove();
  }

  _cleanView(): void {
    this.cache.clear();
    this._cleanTableWidths();
    this.cellsSelectionState.clearSelectedAndFocusedCells();
    if (!this.isRenovatedRender()) {
      this._$thead.empty();
      this._$dateTable.empty();
      this._$timePanel.empty();
      this._$groupTable.empty();

      this._$allDayTable?.empty();
      this._$sidebarTable?.empty();
    }

    this._shader?.clean();

    delete this._interval;
  }

  _clean() {
    (eventsEngine.off as any)(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
    this._disposeRenovatedComponents();

    // @ts-expect-error
    super._clean();
  }

  _cleanTableWidths() {
    this._$headerPanel.css('width', '');
    this._$dateTable.css('width', '');
    this._$allDayTable && this._$allDayTable.css('width', '');
  }

  _disposeRenovatedComponents() {
    this.renovatedAllDayPanel?.dispose();
    this.renovatedAllDayPanel = undefined;

    this.renovatedDateTable?.dispose();
    this.renovatedDateTable = undefined;

    this.renovatedTimePanel?.dispose();
    this.renovatedTimePanel = undefined;

    this.renovatedGroupPanel?.dispose();
    this.renovatedGroupPanel = undefined;

    this.renovatedHeaderPanel?.dispose();
    this.renovatedHeaderPanel = undefined;
  }

  getGroupedStrategy() {
    return this._groupedStrategy;
  }

  getFixedContainer() {
    return this._$fixedContainer;
  }

  getAllDayContainer() {
    return this._$allDayContainer;
  }

  updateRender() {
    this.renderer.updateRender();
  }

  updateGrid() {
    this.renderer._renderGrid();
  }

  updateAppointments() {
    (this.option('onRenderAppointments') as any)();
    this.dragBehavior?.updateDragSource();
  }

  // ----------------
  // These methods should be deleted when we get rid of old render
  // ----------------

  _createAllDayPanelElements() {
    const groupCount = this._getGroupCount();

    if (this._isVerticalGroupedWorkSpace() && groupCount !== 0) {
      for (let i = 0; i < groupCount; i++) {
        const $allDayTitle = $('<div>')
          .addClass(ALL_DAY_TITLE_CLASS)
          .text(messageLocalization.format('dxScheduler-allDay'));

        this._allDayTitles.push($allDayTitle);

        this._$allDayTable = $('<table>').attr('aria-hidden', true);
        this._allDayTables.push(this._$allDayTable);

        this._$allDayPanel = $('<div>')
          .addClass(ALL_DAY_PANEL_CLASS)
          .append(this._$allDayTable);

        this._allDayPanels.push(this._$allDayPanel);
      }
    } else {
      this._$allDayTitle = $('<div>')
        .addClass(ALL_DAY_TITLE_CLASS)
        .text(messageLocalization.format('dxScheduler-allDay'))
        .appendTo(this.$element());

      this._$allDayTable = $('<table>').attr('aria-hidden', true);

      this._$allDayPanel = $('<div>')
        .addClass(ALL_DAY_PANEL_CLASS)
        .append(this._$allDayTable);
    }
  }

  renderWorkSpace({
    generateNewData,
    renderComponents,
  } = DEFAULT_WORKSPACE_RENDER_OPTIONS): void {
    this.cache.clear();

    this.viewDataProvider.update(this.generateRenderOptions(), generateNewData);

    if (this.isRenovatedRender()) {
      this.renderRWorkSpace(renderComponents);
    } else {
      // TODO Old render: Delete this old render block after the SSR tests check.
      this._renderDateHeader();
      this._renderTimePanel();
      this._renderGroupAllDayPanel();
      this._renderDateTable();
      this._renderAllDayPanel();
    }

    this._initPositionHelper();
  }

  _renderGroupHeader() {
    const $container = this._getGroupHeaderContainer();
    const groupCount = this._getGroupCount();
    let cellTemplates = [];
    if (groupCount) {
      const groupRows = this._makeGroupRows(this.option('groups'), this.option('groupByDate'));
      this._attachGroupCountClass();
      $container.append(groupRows.elements);
      cellTemplates = groupRows.cellTemplates;
    } else {
      this._detachGroupCountClass();
    }

    return cellTemplates;
  }

  _applyCellTemplates(templates) {
    templates?.forEach((template) => {
      template();
    });
  }

  _makeGroupRows(groups, groupByDate): any {
    const tableCreatorStrategy = this._isVerticalGroupedWorkSpace() ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

    return tableCreator.makeGroupedTable(
      tableCreatorStrategy,
      groups,
      {
        groupHeaderRowClass: GROUP_ROW_CLASS,
        groupRowClass: GROUP_ROW_CLASS,
        groupHeaderClass: this._getGroupHeaderClass.bind(this),
        groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
      },
      this._getCellCount() || 1,
      this.option('resourceCellTemplate'),
      this._getGroupCount(),
      groupByDate,
    );
  }

  _renderDateHeader(): any {
    const container = this._getDateHeaderContainer();
    const $headerRow = $('<tr>').addClass(HEADER_ROW_CLASS);
    const count = this._getCellCount();
    const cellTemplate = this._getDateHeaderTemplate();
    const repeatCount = this._getCalculateHeaderCellRepeatCount();
    const templateCallbacks = [];
    const groupByDate = this.isGroupedByDate();

    if (!groupByDate) {
      for (let rowIndex = 0; rowIndex < repeatCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < count; columnIndex++) {
          const templateIndex = rowIndex * count + columnIndex;
          this._renderDateHeaderTemplate($headerRow, columnIndex, templateIndex, cellTemplate, templateCallbacks);
        }
      }

      container.append($headerRow);
    } else {
      const colSpan = groupByDate ? this._getGroupCount() : 1;

      for (let columnIndex = 0; columnIndex < count; columnIndex++) {
        const templateIndex = columnIndex * repeatCount;
        const cellElement = this._renderDateHeaderTemplate($headerRow, columnIndex, templateIndex, cellTemplate, templateCallbacks);
        cellElement.attr('colSpan', colSpan);
      }

      container.prepend($headerRow);
    }

    this._applyCellTemplates(templateCallbacks);

    return $headerRow;
  }

  _renderDateHeaderTemplate(container, panelCellIndex, templateIndex, cellTemplate, templateCallbacks) {
    const validTemplateIndex = this.isGroupedByDate()
      ? Math.floor(templateIndex / this._getGroupCount())
      : templateIndex;
    const { completeDateHeaderMap } = this.viewDataProvider;

    const {
      text, startDate: date,
    } = completeDateHeaderMap[completeDateHeaderMap.length - 1][validTemplateIndex];
    const $cell = $('<th>')
      .addClass(this._getHeaderPanelCellClass(panelCellIndex))
      .attr('title', text);

    if (cellTemplate?.render) {
      templateCallbacks.push(cellTemplate.render.bind(cellTemplate, {
        model: {
          text,
          date,
          ...this._getGroupsForDateHeaderTemplate(templateIndex),
        },
        index: templateIndex,
        container: getPublicElement($cell),
      }));
    } else {
      $cell.text(text);
    }

    container.append($cell);
    return $cell;
  }

  _getGroupsForDateHeaderTemplate(templateIndex, indexMultiplier = 1) {
    let groupIndex;
    let groups;

    if (this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()) {
      groupIndex = this._getGroupIndex(0, templateIndex * indexMultiplier);
      const groupsArray = getCellGroups(
        groupIndex,
        this.option('groups'),
      );

      groups = getGroupsObjectFromGroupsArray(groupsArray);
    }

    return { groups, groupIndex };
  }

  _getHeaderPanelCellClass(i) {
    const cellClass = `${HEADER_PANEL_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS}`;

    return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1, undefined, undefined, this.isGroupedByDate());
  }

  _renderAllDayPanel(index?: any) {
    let cellCount = this._getCellCount();

    if (!this._isVerticalGroupedWorkSpace()) {
      cellCount *= this._getGroupCount() || 1;
    }

    const cellTemplates = this._renderTableBody({
      container: this._allDayPanels.length ? getPublicElement(this._allDayTables[index]) : getPublicElement(this._$allDayTable),
      rowCount: 1,
      cellCount,
      cellClass: this._getAllDayPanelCellClass.bind(this),
      rowClass: ALL_DAY_TABLE_ROW_CLASS,
      cellTemplate: this.option('dataCellTemplate'),
      // TODO: remove along with old render
      getCellData: this._oldRender_getAllDayCellData(index),
      groupIndex: index,
    }, true);

    this._toggleAllDayVisibility(true);
    this._applyCellTemplates(cellTemplates);
  }

  _renderGroupAllDayPanel() {
    if (this._isVerticalGroupedWorkSpace()) {
      const groupCount = this._getGroupCount();

      for (let i = 0; i < groupCount; i++) {
        this._renderAllDayPanel(i);
      }
    }
  }

  _getAllDayPanelCellClass(i, j) {
    const cellClass = `${ALL_DAY_TABLE_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS}`;

    return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, j + 1);
  }

  _renderTimePanel() {
    const repeatCount = this._groupedStrategy.calculateTimeCellRepeatCount();

    const getTimeCellGroups = (rowIndex) => {
      if (!this._isVerticalGroupedWorkSpace()) {
        return {};
      }

      const groupIndex = this._getGroupIndex(rowIndex, 0);

      const groupsArray = getCellGroups(
        groupIndex,
        this.option('groups'),
      );

      const groups = getGroupsObjectFromGroupsArray(groupsArray);

      return { groupIndex, groups };
    };

    const getData = (rowIndex, field) => {
      let allDayPanelsCount = 0;
      if (this.isAllDayPanelVisible) {
        allDayPanelsCount = 1;
      }
      if (this.isGroupedAllDayPanel()) {
        allDayPanelsCount = Math.ceil((rowIndex + 1) / this._getRowCount());
      }

      const validRowIndex = rowIndex + allDayPanelsCount;

      return this.viewDataProvider.completeTimePanelMap[validRowIndex][field];
    };

    this._renderTableBody({
      container: getPublicElement(this._$timePanel),
      rowCount: this._getTimePanelRowCount() * repeatCount,
      cellCount: 1,
      cellClass: this._getTimeCellClass.bind(this),
      rowClass: TIME_PANEL_ROW_CLASS,
      cellTemplate: this.option('timeCellTemplate'),
      getCellText: (rowIndex) => getData(rowIndex, 'text'),
      getCellDate: (rowIndex) => getData(rowIndex, 'startDate'),
      groupCount: this._getGroupCount(),
      allDayElements: this._insertAllDayRowsIntoDateTable() ? this._allDayTitles : undefined,
      getTemplateData: getTimeCellGroups.bind(this),
    });
  }

  _getTimeCellClass(i) {
    const cellClass = `${TIME_PANEL_CELL_CLASS} ${VERTICAL_SIZES_CLASS}`;

    return this._isVerticalGroupedWorkSpace()
      ? this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i, i)
      : cellClass;
  }

  _renderDateTable() {
    const groupCount = this._getGroupCount();
    this._renderTableBody({
      container: getPublicElement(this._$dateTable),
      rowCount: this._getTotalRowCount(groupCount),
      cellCount: this._getTotalCellCount(groupCount),
      cellClass: this._getDateTableCellClass.bind(this),
      rowClass: DATE_TABLE_ROW_CLASS,
      cellTemplate: this.option('dataCellTemplate'),
      // TODO: remove along with old render
      getCellData: (_, rowIndex, columnIndex) => {
        const isGroupedAllDayPanel = this.isGroupedAllDayPanel();
        let validRowIndex = rowIndex;

        if (isGroupedAllDayPanel) {
          const rowCount = this._getRowCount();
          const allDayPanelsCount = Math.ceil(rowIndex / rowCount);
          validRowIndex += allDayPanelsCount;
        }

        const { cellData } = this.viewDataProvider.viewDataMap.dateTableMap[validRowIndex][columnIndex];

        return {
          value: this._filterCellDataFields(cellData),
          fullValue: cellData,
          key: CELL_DATA,
        };
      },
      allDayElements: this._insertAllDayRowsIntoDateTable() ? this._allDayPanels : undefined,
      groupCount,
      groupByDate: this.option('groupByDate'),
    });
  }

  _insertAllDayRowsIntoDateTable() {
    return this._groupedStrategy.insertAllDayRowsIntoDateTable();
  }

  _renderTableBody(options, delayCellTemplateRendering?: any): any {
    let result: any[] = [];
    if (!delayCellTemplateRendering) {
      this._applyCellTemplates(
        tableCreator.makeTable(options),
      );
    } else {
      result = tableCreator.makeTable(options);
    }

    return result;
  }
}

const createDragBehaviorConfig = (
  container,
  rootElement,
  isDefaultDraggingMode,
  dragBehavior,
  enableDefaultDragging,
  disableDefaultDragging,
  getDroppableCell,
  getDateTables,
  removeDroppableCellClass,
  getCellWidth,
  options,
) => {
  const state: any = {
    dragElement: undefined,
    itemData: undefined,
  };

  const isItemDisabled = () => {
    const { itemData } = state;

    if (itemData) {
      const getter: any = compileGetter('disabled');
      return getter(itemData);
    }

    return true;
  };

  const createDragAppointment = (itemData, settings, appointments) => {
    const appointmentIndex = appointments.option('items').length;

    settings.isCompact = false;
    settings.virtual = false;

    const items = appointments._renderItem(appointmentIndex, {
      itemData,
      settings: [settings],
    });

    return items[0];
  };

  const onDragStart = (e) => {
    if (!isDefaultDraggingMode) {
      disableDefaultDragging();
    }

    const canceled = e.cancel;
    const { event } = e;
    const $itemElement = $(e.itemElement);
    const appointments = e.component._appointments;

    state.itemData = options.getItemData(e.itemElement, appointments);
    const settings = options.getItemSettings($itemElement, e);
    const { initialPosition } = options;

    if (!isItemDisabled()) {
      event.data = event.data || {};
      if (!canceled) {
        if (!settings.isCompact) {
          dragBehavior.updateDragSource(state.itemData, settings);
        }

        state.dragElement = createDragAppointment(state.itemData, settings, appointments);

        event.data.itemElement = state.dragElement;
        event.data.initialPosition = initialPosition ?? locate($(state.dragElement));
        event.data.itemData = state.itemData;
        event.data.itemSettings = settings;

        dragBehavior.onDragStart(event.data);

        resetPosition($(state.dragElement));
      }
    }
  };

  const getElementsFromPoint = () => {
    const appointmentWidth = getWidth(state.dragElement);
    const cellWidth = getCellWidth();
    const isWideAppointment = appointmentWidth > cellWidth;
    const isNarrowAppointment = appointmentWidth <= DRAGGING_MOUSE_FAULT;
    const dragElementContainer = $(state.dragElement).parent().get(0);
    const boundingRect = getBoundingRect(dragElementContainer);
    const newX = boundingRect.left;
    const newY = boundingRect.top;

    if (isWideAppointment) {
      return (domAdapter as any).elementsFromPoint(newX + DRAGGING_MOUSE_FAULT, newY + DRAGGING_MOUSE_FAULT, dragElementContainer);
    } if (isNarrowAppointment) {
      return (domAdapter as any).elementsFromPoint(newX, newY, dragElementContainer);
    }
    return (domAdapter as any).elementsFromPoint(newX + appointmentWidth / 2, newY + DRAGGING_MOUSE_FAULT, dragElementContainer);
  };

  const onDragMove = () => {
    if (isDefaultDraggingMode) {
      return;
    }

    const elements = getElementsFromPoint();

    const isMoveUnderControl = !!elements.find((el) => el === rootElement.get(0));
    const dateTables = getDateTables();

    const droppableCell = elements.find((el) => {
      const { classList } = el;

      const isCurrentSchedulerElement = dateTables.find(el).length === 1;

      return isCurrentSchedulerElement
                && (
                  classList.contains(DATE_TABLE_CELL_CLASS)
                    || classList.contains(ALL_DAY_TABLE_CELL_CLASS)
                );
    });

    if (droppableCell) {
      if (!getDroppableCell().is(droppableCell)) {
        removeDroppableCellClass();
      }

      $(droppableCell).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
    } else if (!isMoveUnderControl) {
      removeDroppableCellClass();
    }
  };

  const onDragEnd = (e) => {
    if (!isDefaultDraggingMode) {
      enableDefaultDragging();
    }

    if (!isItemDisabled()) {
      dragBehavior.onDragEnd(e);
    }

    state.dragElement?.remove();
    removeDroppableCellClass();
  };

  const onDragCancel = (e) => {
    if (!isDefaultDraggingMode) {
      enableDefaultDragging();
    }

    removeDroppableCellClass();
    e.itemElement?.removeClass?.(APPOINTMENT_DRAG_SOURCE_CLASS);
  };

  const cursorOffset = options.isSetCursorOffset
    ? () => {
      const $dragElement = $(state.dragElement);
      return {
        x: getWidth($dragElement) / 2,
        y: getHeight($dragElement) / 2,
      };
    }
    : undefined;

  return {
    container,
    dragTemplate: () => state.dragElement,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
    cursorOffset,
    filter: options.filter,
  };
};

export default SchedulerWorkSpace;
