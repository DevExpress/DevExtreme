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
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { TemplateBase } from '@js/core/templates/template_base';
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
import type { AllDayPanelMode, CellClickEvent, CellContextMenuEvent } from '@js/ui/scheduler';
import type { ScrollEvent } from '@js/ui/scroll_view';
import errors from '@js/ui/widget/ui.errors';
import Widget from '@js/ui/widget/ui.widget';
import { getMemoizeScrollTo } from '@ts/core/utils/scroll';
import type { OptionChanged } from '@ts/core/widget/types';
import {
  AllDayPanelTitleComponent,
  AllDayTableComponent,
  DateTableComponent,
  GroupPanelComponent,
  HeaderPanelComponent,
  TimePanelComponent,
} from '@ts/scheduler/r1/components/index';
import type { ViewContext } from '@ts/scheduler/r1/components/types';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator/calculator';
import {
  calculateIsGroupedAllDayPanel,
  calculateViewStartDate,
  getCellDuration,
  getStartViewDateTimeOffset,
  getViewStartByOptions,
  isDateAndTimeView,
} from '@ts/scheduler/r1/utils/index';
import type { GroupOrientation, ViewType } from '@ts/scheduler/types';
import Scrollable, { type ScrollableProperties } from '@ts/ui/scroll_view/scrollable';

import type NotifyScheduler from '../base/widget_notify_scheduler';
import {
  APPOINTMENT_DRAG_SOURCE_CLASS,
  DATE_TABLE_CLASS,
  FIXED_CONTAINER_CLASS,
  GROUP_HEADER_CONTENT_CLASS,
  GROUP_ROW_CLASS,
  TIME_PANEL_CLASS,
  VERTICAL_GROUP_COUNT_CLASSES,
  VIRTUAL_CELL_CLASS,
} from '../classes';
import { APPOINTMENT_SETTINGS_KEY } from '../constants';
import { Cache } from '../global_cache';
import AppointmentDragBehavior from '../m_appointment_drag_behavior';
import { CompactAppointmentsHelper } from '../m_compact_appointments_helper';
import type { SubscribeKey, SubscribeMethods } from '../m_subscribes';
import tableCreatorModule, { type GroupRows } from '../m_table_creator';
import { utils } from '../m_utils';
import VerticalShader from '../shaders/current_time_shader_vertical';
import type { ViewCellData } from '../types';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import {
  getAppointmentGroupIndex,
  getSafeGroupValues,
} from '../utils/resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from '../utils/resource_manager/group_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { GroupValues, RawGroupValues } from '../utils/resource_manager/types';
import { getSkippedDaysCount as countSkippedDays } from '../utils/skipped_days';
import type { ListEntity } from '../view_model/types';
import {
  getAllDayHeight,
  getCellHeight,
  getCellWidth,
  getMaxAllowedPosition,
  PositionHelper,
} from './helpers/m_position_helper';
import { CellsSelectionController } from './m_cells_selection_controller';
import CellsSelectionState from './m_cells_selection_state';
import { VirtualScrollingDispatcher, VirtualScrollingRenderer } from './m_virtual_scrolling';
import HorizontalGroupedStrategy from './m_work_space_grouped_strategy_horizontal';
import VerticalGroupedStrategy from './m_work_space_grouped_strategy_vertical';
import type { ViewDataProviderOptions } from './view_model/m_types';
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

export interface ViewDateGenerationOptions {
  startDayHour: number;
  endDayHour: number;
  hoursInterval: number;
  interval?: number;
  intervalCount: number;
  startViewDate: Date;
  firstDayOfWeek: number;
  skippedDays?: number[];
  viewOffset: number;
  viewType: ViewType;
}

const { tableCreator } = tableCreatorModule;

// The constant is needed so that the dragging is not sharp. To prevent small twitches
const DRAGGING_MOUSE_FAULT = 10;

// @ts-expect-error Widget exposes a static abstract() helper not typed in its d.ts
const { abstract } = Widget;
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

const ALL_DAY_PANEL_CLASS = 'dx-scheduler-all-day-panel';
const ALL_DAY_TABLE_CLASS = 'dx-scheduler-all-day-table';
const ALL_DAY_CONTAINER_CLASS = 'dx-scheduler-all-day-appointments';
const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';
const WORKSPACE_WITH_ALL_DAY_CLASS = 'dx-scheduler-work-space-all-day';
const WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS = 'dx-scheduler-work-space-all-day-collapsed';

const WORKSPACE_WITH_MOUSE_SELECTION_CLASS = 'dx-scheduler-work-space-mouse-selection';

const HORIZONTAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-horizontal';
const VERTICAL_SIZES_CLASS = 'dx-scheduler-cell-sizes-vertical';

const HEADER_PANEL_CLASS = 'dx-scheduler-header-panel';
const HEADER_PANEL_CELL_CLASS = 'dx-scheduler-header-panel-cell';
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
const SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME = addNamespace(pointerEvents.up, 'dxSchedulerTable');

const SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME = addNamespace(pointerEvents.move, 'dxSchedulerDateTable');

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

export interface WorkspaceOptionsInternal {
  newAppointments: boolean;
  resources: ResourceLoader[];
  getResourceManager: () => ResourceManager;
  getFilteredItems: () => ListEntity[];
  noDataText: string;
  firstDayOfWeek: number;
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  tabIndex: number;
  accessKey: string;
  focusStateEnabled: boolean;
  showAllDayPanel: boolean;
  showCurrentTimeIndicator: boolean;
  indicatorTime: Date;
  indicatorUpdateInterval: number;
  shadeUntilCurrentTime: boolean;
  crossScrollingEnabled: boolean;
  dataCellTemplate: TemplateBase | null;
  timeCellTemplate: TemplateBase | null;
  resourceCellTemplate: TemplateBase | null;
  dateCellTemplate: TemplateBase | null;
  allowMultipleCellSelection: boolean;
  selectedCellData: ViewCellData[];
  onSelectionChanged: ((args: { selectedCellData: ViewCellData[] }) => void);
  onSelectionEnd: ((args: { selectedCellData: ViewCellData[] }) => void);
  groupByDate: boolean;
  skippedDays: number[];
  scrolling: {
    mode: 'standard' | 'virtual';
    orientation: 'horizontal' | 'vertical' | 'both';
  };
  draggingMode: 'outlook' | 'default';
  timeZoneCalculator: TimeZoneCalculator;
  schedulerHeight: string | number | undefined;
  schedulerWidth: string | number | undefined;
  allDayPanelMode: AllDayPanelMode;
  onSelectedCellsClick: (result: object, groups: GroupValues) => void;
  renderAppointments: () => void;
  onShowAllDayPanel: (isVisible: boolean) => void;
  getHeaderHeight: (() => number);
  onScrollEnd: () => void;
  onInitialized: (e: { element: dxElementWrapper }) => void;
  onDisposing: () => void;

  notifyScheduler: NotifyScheduler;
  groups: ResourceLoader[];
  onCellClick: ((e: CellClickEvent) => void) | undefined;
  onCellContextMenu: ((e: CellContextMenuEvent) => void) | undefined;
  currentDate: Date;
  hoursInterval: number;
  allDayExpanded: boolean;

  agendaDuration: number;
  intervalCount: number;
  rowHeight: number;
  startDate?: Date;
  type?: ViewType;
  groupOrientation: GroupOrientation;
  width?: number | string | undefined;
}

class SchedulerWorkSpace extends Widget<WorkspaceOptionsInternal> {
  private viewDataProviderValue: any;

  private cacheValue: any;

  private cellsSelectionStateValue: any;

  private cellsSelectionControllerValue: any;

  protected $dateTableScrollable!: Scrollable;

  private selectionChangedAction: any;

  private selectionEndAction: any;

  private isSelectionStartedOnCell = false;

  private documentPointerUpHandler: (() => void) | undefined;

  private isCellClick: any;

  private contextMenuHandled: any;

  _disposed: any;

  protected getToday?(): Date;

  protected $allDayPanel: any;

  private $allDayTitle: any;

  private $headerPanelEmptyCell: any;

  protected groupedStrategy: any;

  public virtualScrollingDispatcher: any;

  private scrollSync: any;

  private $headerPanel: any;

  protected $dateTable: any;

  private $allDayTable: any;

  private renderer: any;

  _createAction: any;

  private cellClickAction: any;

  _createActionByOption: any;

  private showPopup: any;

  private readonly NAME: any;

  private contextMenuAction: any;

  protected $groupTable: dxElementWrapper | null | undefined;

  protected $thead: any;

  private headerScrollable: any;

  protected $sidebarScrollable: any;

  private preventDefaultDragging: any;

  public dragBehavior: any;

  protected $dateTableContainer: any;

  protected $timePanel: any;

  positionHelper!: PositionHelper;

  protected $headerPanelContainer: any;

  private $headerTablesContainer: any;

  private $fixedContainer: any;

  private $allDayContainer: any;

  protected $dateTableScrollableContent: any;

  private $sidebarScrollableContent: any;

  private allDayTitles!: any[];

  private allDayTables!: any[];

  private allDayPanels!: any[];

  protected $flexContainer: any;

  protected shader: any;

  protected $sidebarTable: any;

  private interval: any;

  private renovatedAllDayPanel: any;

  public renovatedDateTable: any;

  private renovatedTimePanel: any;

  private renovatedGroupPanel: any;

  public renovatedHeaderPanel: any;

  readonly viewDirection: 'vertical' | 'horizontal' = 'vertical';

  // eslint-disable-next-line class-methods-use-this
  protected _activeStateUnit(): string {
    return CELL_SELECTOR;
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get type(): string {
    return '';
  }

  get viewDataProvider(): ViewDataProvider {
    if (!this.viewDataProviderValue) {
      this.viewDataProviderValue = new ViewDataProvider(this.type as ViewType);
    }
    return this.viewDataProviderValue;
  }

  get cache() {
    if (!this.cacheValue) {
      this.cacheValue = new Cache();
    }

    return this.cacheValue;
  }

  get resourceManager(): ResourceManager {
    return this.option('getResourceManager')();
  }

  get cellsSelectionState() {
    if (!this.cellsSelectionStateValue) {
      this.cellsSelectionStateValue = new CellsSelectionState(this.viewDataProvider);

      const selectedCellsOption: any = this.option('selectedCellData');

      if (selectedCellsOption?.length > 0) {
        const validSelectedCells = selectedCellsOption.map((selectedCell) => {
          const { groups } = selectedCell;

          if (!groups || this.getGroupCount() === 0) {
            return {
              ...selectedCell,
              groupIndex: 0,
            };
          }

          const groupIndex = this.getGroupIndexByGroupValues(groups);

          return {
            ...selectedCell,
            groupIndex,
          };
        });

        this.cellsSelectionStateValue.setSelectedCellsByData(validSelectedCells);
      }
    }

    return this.cellsSelectionStateValue;
  }

  get cellsSelectionController() {
    if (!this.cellsSelectionControllerValue) {
      this.cellsSelectionControllerValue = new CellsSelectionController();
    }

    return this.cellsSelectionControllerValue;
  }

  get isAllDayPanelVisible() {
    return this.isShowAllDayPanel() && this.supportAllDayRow();
  }

  get verticalGroupTableClass() { return WORKSPACE_VERTICAL_GROUP_TABLE_CLASS; }

  get renovatedHeaderPanelComponent() { return HeaderPanelComponent; }

  get timeZoneCalculator(): any {
    return this.option('timeZoneCalculator');
  }

  get isDefaultDraggingMode() {
    return this.option('draggingMode') === 'default';
  }

  notifyObserver<Subject extends SubscribeKey>(
    funcName: Subject,
    args: Parameters<SubscribeMethods[Subject]>,
  ): void {
    this.invoke(funcName, ...args);
  }

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> | undefined {
    const notifyScheduler = this.option('notifyScheduler') as NotifyScheduler | undefined;

    if (!notifyScheduler) {
      return undefined;
    }

    return notifyScheduler.invoke(funcName, ...args);
  }

  _supportedKeys() {
    const clickHandler = function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedCells = this.getSelectedCellsData();

      if (selectedCells?.length) {
        const selectedCellsElement = selectedCells.map((cellData) => this.getCellByData(cellData)).filter((cell) => Boolean(cell));

        e.target = selectedCellsElement;
        this.showPopup = true;

        this.cellClickAction({ event: e, cellElement: $(selectedCellsElement), cellData: selectedCells[0] });
      }
    };
    const onArrowPressed = (e, key) => {
      e.preventDefault();
      e.stopPropagation();

      const focusedCellData = this.cellsSelectionState.getFocusedCell()?.cellData;

      if (focusedCellData) {
        const isAllDayPanelCell = focusedCellData.allDay && !this.isVerticalGroupedWorkSpace();
        const isMultiSelection = e.shiftKey;
        const isMultiSelectionAllowed = this.option('allowMultipleCellSelection');
        const isRTL = this.isRTL();
        const groupCount = this.getGroupCount();
        const isGroupedByDate = this.isGroupedByDate();
        const isHorizontalGrouping = this.isHorizontalGroupedWorkSpace();
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

        this.processNextSelectedCell(
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

  private isRTL() {
    return this.option('rtlEnabled');
  }

  private moveToCell($cell, isMultiSelection) {
    if (!isDefined($cell) || !$cell.length) {
      return;
    }

    const isMultiSelectionAllowed = this.option('allowMultipleCellSelection');
    const currentCellData = this.getFullCellData($cell);
    const focusedCell = this.cellsSelectionState.getFocusedCell();

    if (!focusedCell) {
      return;
    }

    const focusedCellData = focusedCell.cellData;

    const nextFocusedCellData = this.cellsSelectionController.moveToCell({
      isMultiSelection,
      isMultiSelectionAllowed,
      currentCellData,
      focusedCellData,
      isVirtualCell: $cell.hasClass(VIRTUAL_CELL_CLASS),
    });

    this.processNextSelectedCell(
      nextFocusedCellData,
      focusedCellData,
      isMultiSelectionAllowed && isMultiSelection,
    );
  }

  private processNextSelectedCell(nextCellData, focusedCellData, isMultiSelection) {
    const nextCellPosition = this.viewDataProvider.findCellPositionInMap({
      startDate: nextCellData.startDate,
      groupIndex: nextCellData.groupIndex,
      isAllDay: nextCellData.allDay,
      index: nextCellData.index,
    });

    if (!this.viewDataProvider.isSameCell(focusedCellData, nextCellData)) {
      const $cell = nextCellData.allDay && !this.isVerticalGroupedWorkSpace()
        ? this.domGetAllDayPanelCell(nextCellPosition.columnIndex)
        : this.domGetDateCell(nextCellPosition);
      const isNextCellAllDay = nextCellData.allDay;

      this.setSelectedCellsStateAndUpdateSelection(isNextCellAllDay, nextCellPosition, isMultiSelection, $cell);

      this.$dateTableScrollable.scrollToElement($cell);
    }
  }

  private setSelectedCellsStateAndUpdateSelection(isAllDay, cellPosition, isMultiSelection, $nextFocusedCell) {
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
    this.updateSelectedCellDataOption(this.getSelectedCellsData(), $nextFocusedCell);
  }

  private hasAllDayClass($cell) {
    return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
  }

  _focusInHandler(e) {
    const $target = $(e.target);
    const $focusTarget = this._focusTarget();
    // T1312256: On macOS, e.target can be a child element of the workspace root
    const isTargetInsideWorkspace = $target.is($focusTarget)
      || $target.closest($focusTarget).length > 0;

    if (isTargetInsideWorkspace && this.isCellClick) {
      delete this.isCellClick;
      delete this.contextMenuHandled;
      // @ts-expect-error
      super._focusInHandler.apply(this, arguments);

      this.cellsSelectionState.restoreSelectedAndFocusedCells();

      if (!this.cellsSelectionState.getFocusedCell()) {
        const cellCoordinates = {
          columnIndex: 0,
          rowIndex: 0,
          allDay: this.isVerticalGroupedWorkSpace() && this.isAllDayPanelVisible,
        };
        this.cellsSelectionState.setFocusedCell(
          cellCoordinates.rowIndex,
          cellCoordinates.columnIndex,
          cellCoordinates.allDay,
        );
        this.cellsSelectionState.setSelectedCells(cellCoordinates, cellCoordinates);
      }

      this.updateCellsSelection();
      this.updateSelectedCellDataOption(this.getSelectedCellsData());
    }
  }

  _focusOutHandler() {
    // @ts-expect-error
    super._focusOutHandler.apply(this, arguments);

    if (!this.contextMenuHandled && !this._disposed) {
      this.cellsSelectionState.releaseSelectedAndFocusedCells();

      this.viewDataProvider.updateViewData(this.generateRenderOptions());
      this.updateCellsSelection();
    }
  }

  _focusTarget() {
    return this.$element();
  }

  protected isVerticalGroupedWorkSpace() { // TODO move to the Model
    return Boolean(this.option('groups')?.length) && this.option('groupOrientation') === 'vertical';
  }

  protected isHorizontalGroupedWorkSpace() {
    return Boolean(this.option('groups')?.length) && this.option('groupOrientation') === 'horizontal';
  }

  protected isWorkSpaceWithCount() {
    return this.option('intervalCount') > 1;
  }

  private isWorkspaceWithOddCells() {
    return this.option('hoursInterval') === 0.5 && !this.isVirtualScrolling();
  }

  private getRealGroupOrientation() {
    return this.isVerticalGroupedWorkSpace()
      ? 'vertical'
      : 'horizontal';
  }

  createRAllDayPanelElements() {
    this.$allDayPanel = $('<div>').addClass(ALL_DAY_PANEL_CLASS);
    this.$allDayTitle = $('<div>').appendTo(this.$headerPanelEmptyCell);
  }

  protected dateTableScrollableConfig(): ScrollableProperties {
    let config: ScrollableProperties = {
      useKeyboard: false,
      bounceEnabled: false,
      updateManually: true,
      onScroll: () => {
        this.groupedStrategy.cache?.clear();
      },
      // TODO (Scrollable:useKeyboard) -> remove this WA
      //  after ScrollView private option "useKeyboard" will be extended to useNative: true
      // NOTE: Scrollable container focusable by default
      // To prevent scroll container focus in native mode we set tabindex -1 to container
      // In simulated mode focusable behavior prevented by useKeyboard: false private option
      onInitialized: ({ component }) => {
        const useKeyboardDisabled = component?.option().useKeyboard === false;
        const useNativeEnabled = component?.option().useNative === true;
        if (useKeyboardDisabled && useNativeEnabled) {
          $(component?.container()).attr('tabindex', -1);
        }
      },
      onOptionChanged: ({ fullName, value, component }) => {
        const useKeyboardDisabled = component.option().useKeyboard === false;
        if (useKeyboardDisabled && fullName === 'useNative' && value === true) {
          $(component.container()).attr('tabindex', -1);
        }
      },
    };

    if (this.needCreateCrossScrolling()) {
      config = extend(config, this.createCrossScrollingConfig(config));
    }

    if (this.isVirtualScrolling()
      && (this.virtualScrollingDispatcher.horizontalScrollingAllowed
        || this.virtualScrollingDispatcher.height)) {
      const currentOnScroll = config.onScroll;
      config = {
        ...config,
        onScroll: (e: ScrollEvent) => {
          currentOnScroll?.(e);

          this.virtualScrollingDispatcher.handleOnScrollEvent(e?.scrollOffset);
        },
      };
    }

    return config;
  }

  protected createCrossScrollingConfig(
    { onScroll }: Pick<ScrollableProperties, 'onScroll'>,
  ): Pick<ScrollableProperties, 'direction' | 'onScroll' | 'onEnd'> {
    return {
      direction: 'both',
      onScroll: (event: ScrollEvent) => {
        onScroll?.(event);

        const top = event.scrollOffset?.top;
        const left = event.scrollOffset?.left;

        if (top !== undefined) {
          this.scrollSync.sidebar({ top });
        }

        if (left !== undefined) {
          this.scrollSync.header({ left });
        }
      },
      onEnd: () => {
        (this.option('onScrollEnd') as any)();
      },
    };
  }

  protected headerScrollableConfig(): ScrollableProperties {
    return {
      useKeyboard: false,
      showScrollbar: 'never',
      direction: 'horizontal',
      useNative: false,
      updateManually: true,
      bounceEnabled: false,
      onScroll: (event: ScrollEvent) => {
        this.scrollSync.dateTable({ left: event.scrollOffset.left });
      },
    };
  }

  _visibilityChanged(visible) {
    this.cache.clear();

    if (visible) {
      this.updateGroupTableHeight();
    }

    if (visible && this.needCreateCrossScrolling()) {
      this.setTableSizes();
    }
  }

  protected setTableSizes() {
    this.cache.clear();
    this.attachTableClasses();

    let cellWidth = this.getCellWidth();

    if (cellWidth < this.getCellMinWidth()) {
      cellWidth = this.getCellMinWidth();
    }

    const minWidth = this.getWorkSpaceMinWidth();

    const groupCount = this.getGroupCount();
    const totalCellCount = this.getTotalCellCount(groupCount);

    let width = cellWidth * totalCellCount;

    if (width < minWidth) {
      width = minWidth;
    }

    setWidth(this.$headerPanel, width);
    setWidth(this.$dateTable, width);
    if (this.$allDayTable) {
      setWidth(this.$allDayTable, width);
    }

    this.attachHeaderTableClasses();

    this.updateGroupTableHeight();

    this.updateScrollable();
  }

  getWorkSpaceMinWidth() {
    return this.groupedStrategy.getWorkSpaceMinWidth();
  }

  _dimensionChanged() {
    // NOTE: It's a base widget method. Be careful :)
    // @ts-expect-error
    if (!this._isVisible()) {
      return;
    }

    if (this.option('crossScrollingEnabled')) {
      this.setTableSizes();
    }

    this.updateHeaderEmptyCellWidth();

    this.updateScrollable();

    this.cache.clear();
  }

  protected needCreateCrossScrolling() {
    return this.option('crossScrollingEnabled');
  }

  protected getElementClass() { return noop(); }

  protected getRowCount() {
    return this.viewDataProvider.getRowCount({
      intervalCount: this.option('intervalCount'),
      currentDate: this.option('currentDate'),
      viewType: this.type,
      hoursInterval: this.option('hoursInterval'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
    });
  }

  protected getCellCount() {
    return this.viewDataProvider.getCellCount({
      intervalCount: this.option('intervalCount'),
      currentDate: this.option('currentDate'),
      viewType: this.type,
      hoursInterval: this.option('hoursInterval'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
    });
  }

  private isVirtualModeOn() {
    return this.option('scrolling.mode') === 'virtual';
  }

  isVirtualScrolling() {
    return this.renovatedRenderSupported() && this.isVirtualModeOn();
  }

  private initVirtualScrolling() {
    if (this.virtualScrollingDispatcher) {
      this.virtualScrollingDispatcher.dispose();
      this.virtualScrollingDispatcher = null;
    }

    this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this.getVirtualScrollingDispatcherOptions());
    this.virtualScrollingDispatcher.attachScrollableEvents();
    this.renderer = new VirtualScrollingRenderer(this);
  }

  isGroupedAllDayPanel() {
    return calculateIsGroupedAllDayPanel(
      this.option('groups').length,
      this.option('groupOrientation') as any,
      this.isAllDayPanelVisible as any,
    );
  }

  generateRenderOptions(isProvideVirtualCellsWidth = false): ViewDataProviderOptions {
    const groupCount = this.getGroupCount();

    const groupOrientation = groupCount > 0
      ? this.option('groupOrientation')
      : this.getDefaultGroupStrategy();

    const options: ViewDataProviderOptions = {
      groupByDate: this.option('groupByDate'),
      startRowIndex: 0,
      startCellIndex: 0,
      groupOrientation,
      today: this.getToday?.(),
      getResourceManager: this.option('getResourceManager'),
      isProvideVirtualCellsWidth,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      selectedCells: this.cellsSelectionState.getSelectedCells(),
      focusedCell: this.cellsSelectionState.getFocusedCell(),
      headerCellTextFormat: this.getFormat(),
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
      skippedDays: this.option('skippedDays'),

      ...this.virtualScrollingDispatcher.getRenderState(),
    };

    return options;
  }

  renovatedRenderSupported() { return true; }

  private updateGroupTableHeight() {
    if (this.isVerticalGroupedWorkSpace() && hasWindow()) {
      this.setHorizontalGroupHeaderCellsHeight();
    }
  }

  updateHeaderEmptyCellWidth() {
    if (hasWindow() && this.isRenderHeaderPanelEmptyCell()) {
      const timePanelWidth = this.getTimePanelWidth();
      const groupPanelWidth = this.getGroupTableWidth();

      this.$headerPanelEmptyCell.css('width', timePanelWidth + groupPanelWidth);
    }
  }

  updateHeaderPanelScrollbarPadding() {
    if (hasWindow() && this.$headerPanelContainer) {
      const scrollbarWidth = this.getScrollbarWidth();
      this.$headerPanelContainer.css('paddingRight', `${scrollbarWidth}px`);
    }
  }

  private getScrollbarWidth() {
    const containerElement = $(this.$dateTableScrollable.container()).get(0) as HTMLElement;
    const scrollbarWidth = containerElement.offsetWidth - containerElement.clientWidth;
    return scrollbarWidth;
  }

  private isGroupsSpecified(groupValues?: GroupValues) {
    return this.option('groups')?.length && groupValues;
  }

  private getGroupIndexByGroupValues(groupValues?: RawGroupValues | GroupValues) {
    return groupValues && getAppointmentGroupIndex(
      getSafeGroupValues(groupValues),
      this.resourceManager.groupsLeafs,
    )[0];
  }

  protected getViewStartByOptions() {
    return getViewStartByOptions(
      this.option('startDate'),
      this.option('currentDate'),
      this.getTotalViewDuration(),
      this.option('startDate') ? this.calculateViewStartDate() : undefined,
    );
  }

  protected getTotalViewDuration() {
    return this.viewDataProvider.getIntervalDuration(this.option('intervalCount'));
  }

  protected getHeaderDate() {
    return this.getStartViewDate();
  }

  protected calculateViewStartDate() {
    return calculateViewStartDate(this.option('startDate'));
  }

  protected firstDayOfWeek() {
    return this.viewDataProvider.getFirstDayOfWeek(this.option('firstDayOfWeek'));
  }

  protected attachEvents() {
    this.createSelectionChangedAction();
    this.createSelectionEndAction();
    this.attachClickEvent();
    this.attachContextMenuEvent();
  }

  private attachClickEvent() {
    const that = this;
    const pointerDownAction = this._createAction((e) => {
      that.pointerDownHandler(e.event);
    });

    this.createCellClickAction();

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
      that.cellClickAction({ event: e, cellElement: getPublicElement($cell), cellData: that.getCellData($cell) });
    });

    if (this.documentPointerUpHandler) {
      (eventsEngine.off as any)(domAdapter.getDocument(), SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME, this.documentPointerUpHandler);
    }
    this.documentPointerUpHandler = () => {
      if (this.isSelectionStartedOnCell && !this._disposed) {
        this.fireSelectionEndEvent();
        this.isSelectionStartedOnCell = false;
      }
    };
    eventsEngine.on(domAdapter.getDocument(), SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME, this.documentPointerUpHandler);
  }

  private createCellClickAction() {
    this.cellClickAction = this._createActionByOption('onCellClick', {
      afterExecute: (e) => this.cellClickHandler(e.args[0].event),
    });
  }

  private createSelectionChangedAction() {
    this.selectionChangedAction = this._createActionByOption('onSelectionChanged');
  }

  private createSelectionEndAction() {
    this.selectionEndAction = this._createActionByOption('onSelectionEnd');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private cellClickHandler(argument?: any) {
    if (this.showPopup) {
      delete this.showPopup;
      this.isSelectionStartedOnCell = false;
      this.handleSelectedCellsClick();
    }
  }

  private pointerDownHandler(e) {
    const $target = $(e.target);

    if (!$target.hasClass(DATE_TABLE_CELL_CLASS) && !$target.hasClass(ALL_DAY_TABLE_CELL_CLASS)) {
      this.isCellClick = false;
      this.isSelectionStartedOnCell = false;
      return;
    }

    this.isCellClick = true;
    if ($target.hasClass(DATE_TABLE_FOCUSED_CELL_CLASS)) {
      this.showPopup = true;
      this.isSelectionStartedOnCell = false;
    } else {
      this.isSelectionStartedOnCell = true;
      const cellCoordinates = this.getCoordinatesByCell($target);
      const isAllDayCell = this.hasAllDayClass($target);
      this.setSelectedCellsStateAndUpdateSelection(isAllDayCell, cellCoordinates, false, $target);
    }
  }

  private handleSelectedCellsClick() {
    const selectedCells = this.getSelectedCellsData();

    const firstCellData = selectedCells[0];
    const lastCellData = selectedCells[selectedCells.length - 1];

    const result: any = {
      startDate: firstCellData.startDate,
      endDate: lastCellData.endDate,
      startDateUTC: firstCellData.startDateUTC,
      endDateUTC: lastCellData.endDateUTC,
    };

    if (lastCellData.allDay !== undefined) {
      result.allDay = lastCellData.allDay;
    }

    (this.option('onSelectedCellsClick') as any)(result, lastCellData.groups);
  }

  private attachContextMenuEvent() {
    this.createContextMenuAction();

    const cellSelector = `.${DATE_TABLE_CELL_CLASS},.${ALL_DAY_TABLE_CELL_CLASS}`;
    const $element = this.$element();
    const eventName = addNamespace(contextMenuEventName, this.NAME);

    eventsEngine.off($element, eventName, cellSelector);
    eventsEngine.on($element, eventName, cellSelector, this.contextMenuHandler.bind(this));
  }

  private contextMenuHandler(e) {
    const $cell = $(e.target);
    this.contextMenuAction({ event: e, cellElement: getPublicElement($cell), cellData: this.getCellData($cell) });
    this.contextMenuHandled = true;
  }

  private createContextMenuAction() {
    this.contextMenuAction = this._createActionByOption('onCellContextMenu');
  }

  protected getGroupHeaderContainer() {
    if (this.isVerticalGroupedWorkSpace()) {
      return this.$groupTable;
    }

    return this.$thead;
  }

  private getDateHeaderContainer() {
    return this.$thead;
  }

  private getCalculateHeaderCellRepeatCount() {
    return this.groupedStrategy.calculateHeaderCellRepeatCount();
  }

  protected updateScrollable() {
    this.$dateTableScrollable.update();
    this.headerScrollable?.update();
    this.$sidebarScrollable?.update();
    this.updateHeaderPanelScrollbarPadding();
  }

  protected getTimePanelRowCount() {
    return this.getCellCountInDay();
  }

  protected getCellCountInDay() {
    const hoursInterval = this.option('hoursInterval');
    const startDayHour = this.option('startDayHour');
    const endDayHour = this.option('endDayHour');

    return this.viewDataProvider.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  }

  private getTotalCellCount(groupCount) {
    return this.groupedStrategy.getTotalCellCount(groupCount);
  }

  protected getTotalRowCount(groupCount: number, includeAllDayPanelRows?: boolean) {
    let result = this.groupedStrategy.getTotalRowCount(groupCount);

    if (includeAllDayPanelRows && this.isAllDayPanelVisible) {
      result += groupCount;
    }

    return result;
  }

  private getGroupIndex(rowIndex, columnIndex) {
    return this.groupedStrategy.getGroupIndex(rowIndex, columnIndex);
  }

  calculateEndDate(startDate) {
    const { viewDataGenerator } = this.viewDataProvider;

    return viewDataGenerator.calculateEndDate(
      startDate,
      viewDataGenerator.getInterval(this.option('hoursInterval')),
      this.option('endDayHour'),
    );
  }

  protected getGroupCount() {
    return this.resourceManager.groupCount();
  }

  protected attachTablesEvents() {
    const element = this.$element();

    this.attachDragEvents(element);
    this.attachPointerEvents(element);
  }

  private detachDragEvents(element) {
    (eventsEngine.off as any)(element, DragEventNames.ENTER);
    (eventsEngine.off as any)(element, DragEventNames.LEAVE);
    (eventsEngine.off as any)(element, DragEventNames.DROP);
  }

  private attachDragEvents(element) {
    if (this.option('newAppointments')) {
      return;
    }

    this.detachDragEvents(element);

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

    const onCheckDropTarget = (target, event) => !this.isOutsideScrollable(target, event);

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

  private attachPointerEvents(element) {
    let isPointerDown = false;

    (eventsEngine.off as any)(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
    (eventsEngine.off as any)(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);

    eventsEngine.on(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME, DRAG_AND_DROP_SELECTOR, (e) => {
      if ((isMouseEvent(e) || (e.originalEvent && isMouseEvent(e.originalEvent))) && e.which === 1) {
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
      if (isPointerDown && this.$dateTableScrollable) {
        e.preventDefault();
        e.stopPropagation();
        this.moveToCell($(e.target), true);
      }
    });
  }

  protected getFormat(): string | ((date: Date) => string) { return abstract(); }

  getWorkArea() {
    return this.$dateTableContainer;
  }

  getScrollable() {
    return this.$dateTableScrollable;
  }

  getScrollableScrollTop() {
    return this.$dateTableScrollable.scrollTop();
  }

  getGroupedScrollableScrollTop(allDay) {
    return this.groupedStrategy.getScrollableScrollTop(allDay);
  }

  getScrollableScrollLeft() {
    return this.$dateTableScrollable.scrollLeft();
  }

  getScrollableOuterWidth() {
    return this.$dateTableScrollable.scrollWidth();
  }

  getScrollableContainer() {
    return $(this.$dateTableScrollable.container());
  }

  getHeaderPanelHeight() {
    return this.$headerPanel && getOuterHeight(this.$headerPanel, true);
  }

  getTimePanelWidth() {
    return this.$timePanel && getBoundingRect(this.$timePanel.get(0)).width;
  }

  getGroupTableWidth() {
    return this.$groupTable ? getOuterWidth(this.$groupTable) : 0;
  }

  getWorkSpaceLeftOffset() {
    return this.groupedStrategy.getLeftOffset();
  }

  protected getCellCoordinatesByIndex(index) {
    const columnIndex = Math.floor(index / this.getRowCount());
    const rowIndex = index - this.getRowCount() * columnIndex;

    return {
      columnIndex,
      rowIndex,
    };
  }

  protected getDateGenerationOptions(): ViewDateGenerationOptions {
    return {
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      hoursInterval: this.option('hoursInterval'),
      interval: this.viewDataProvider.viewDataGenerator?.getInterval(this.option('hoursInterval')),
      intervalCount: this.option('intervalCount'),
      startViewDate: this.getStartViewDate(),
      firstDayOfWeek: this.firstDayOfWeek(),
      skippedDays: this.option('skippedDays'),
      viewOffset: 0,
      viewType: this.type as ViewType,
    };
  }

  // TODO: refactor current time indicator
  protected getIntervalBetween(currentDate, allDay) {
    const firstViewDate = this.getStartViewDate();

    const startDayTime = this.option('startDayHour') * HOUR_MS;
    const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
    const fullInterval = currentDate.getTime() - firstViewDate.getTime() - timeZoneOffset;
    const days = this.getDaysOfInterval(fullInterval, startDayTime);
    const skippedDaysCount = this.getSkippedDaysCount(firstViewDate, days);
    let result = (days - skippedDaysCount) * DAY_MS;

    if (!allDay) {
      const { hiddenInterval } = this.viewDataProvider;
      const visibleDayDuration = this.getVisibleDayDuration();

      result = fullInterval - days * hiddenInterval - skippedDaysCount * visibleDayDuration;
    }

    return result;
  }

  protected getSkippedDaysCount(startDate: Date, days: number) {
    return countSkippedDays(
      startDate,
      days,
      this.option('skippedDays'),
    );
  }

  private getDaysOfInterval(fullInterval, startDayTime) {
    return Math.floor((fullInterval + startDayTime) / DAY_MS);
  }

  protected updateIndex(index) {
    return index * this.getRowCount();
  }

  getDroppableCell() {
    return this.getDateTables().find(`.${DATE_TABLE_DROPPABLE_CELL_CLASS}`);
  }

  protected getWorkSpaceWidth() {
    return this.cache.memo('workspaceWidth', () => {
      if (this.needCreateCrossScrolling()) {
        return getBoundingRect(this.$dateTable.get(0)).width;
      }
      const totalWidth = getBoundingRect((this.$element() as any).get(0)).width;
      const timePanelWidth = this.getTimePanelWidth();
      const groupTableWidth = this.getGroupTableWidth();

      return totalWidth - timePanelWidth - groupTableWidth;
    });
  }

  protected getCellElementByPosition(cellCoordinates, groupIndex, inAllDayRow) {
    const indexes = this.groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex, inAllDayRow);
    return this.domGetDateCell(indexes);
  }

  private domGetDateCell(position) {
    return this.$dateTable
      .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
      .eq(position.rowIndex)
      .find(`td:not(.${VIRTUAL_CELL_CLASS})`)
      .eq(position.columnIndex);
  }

  private domGetAllDayPanelCell(columnIndex) {
    return this.$allDayPanel
      .find('tr').eq(0)
      .find('td').eq(columnIndex);
  }

  protected getCells(allDay?: any, direction?: any) {
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

  private getFirstAndLastDataTableCell() {
    const selector = this.isVirtualScrolling()
      ? `.${DATE_TABLE_CELL_CLASS}, .${VIRTUAL_CELL_CLASS}`
      : `.${DATE_TABLE_CELL_CLASS}`;

    const $cells = (this.$element() as any).find(selector);
    return [$cells[0], $cells[$cells.length - 1]];
  }

  private getAllCells(allDay) {
    if (this.isVerticalGroupedWorkSpace()) {
      return this.$dateTable.find(`td:not(.${VIRTUAL_CELL_CLASS})`);
    }

    const cellClass = allDay && this.supportAllDayRow()
      ? ALL_DAY_TABLE_CELL_CLASS
      : DATE_TABLE_CELL_CLASS;

    return (this.$element() as any).find(`.${cellClass}`);
  }

  protected setHorizontalGroupHeaderCellsHeight() {
    const { height } = getBoundingRect(this.$dateTable.get(0));
    setOuterHeight(this.$groupTable, height);
  }

  protected getGroupHeaderCells() {
    return (this.$element() as any).find(`.${GROUP_HEADER_CLASS}`);
  }

  private getScrollCoordinates(date, groupIndex?: any, allDay?: any) {
    const currentDate = date || new Date(this.option('currentDate'));

    const cell = this.viewDataProvider.findGlobalCellPosition(currentDate, groupIndex, allDay, true);

    if (!cell) {
      return undefined;
    }

    currentDate.setHours(cell.cellData.startDate.getHours(), currentDate.getMinutes(), 0, 0);

    return this.virtualScrollingDispatcher.calculateCoordinatesByDataAndPosition(
      cell.cellData,
      cell.position,
      currentDate,
      isDateAndTimeView(this.type as any),
      this.viewDirection === 'vertical',
    );
  }

  private isOutsideScrollable(target, event) {
    const $dateTableScrollableElement = this.$dateTableScrollable.$element();
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

  supportAllDayRow() {
    return true;
  }

  keepOriginalHours() {
    return false;
  }

  private normalizeCellData(cellData) {
    return extend(true, {}, {
      startDate: cellData.startDate,
      endDate: cellData.endDate,
      startDateUTC: cellData.startDate && this.timeZoneCalculator?.createDate(cellData.startDate, 'fromGrid'),
      endDateUTC: cellData.endDate && this.timeZoneCalculator?.createDate(cellData.endDate, 'fromGrid'),
      groups: cellData.groups,
      groupIndex: cellData.groupIndex,
      allDay: cellData.allDay,
    });
  }

  private getSelectedCellsData() {
    const selected = this.cellsSelectionState.getSelectedCells();

    return selected?.map(this.normalizeCellData.bind(this));
  }

  getCellData($cell) {
    const cellData = this.getFullCellData($cell) ?? {};

    return this.normalizeCellData(cellData);
  }

  private getFullCellData($cell) {
    const currentCell = $cell[0];
    if (currentCell) {
      return this.getDataByCell($cell);
    }

    return undefined;
  }

  private getVirtualRowOffset() {
    return this.virtualScrollingDispatcher.virtualRowOffset;
  }

  private getVirtualCellOffset() {
    return this.virtualScrollingDispatcher.virtualCellOffset;
  }

  private getDataByCell($cell) {
    const rowIndex = $cell.parent().index() - this.virtualScrollingDispatcher.topVirtualRowsCount;
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;

    const { viewDataProvider } = this;
    const isAllDayCell = this.hasAllDayClass($cell);

    const cellData = viewDataProvider.getCellData(rowIndex, columnIndex, isAllDayCell);

    return cellData || undefined;
  }

  isGroupedByDate() {
    return this.option('groupByDate')
      && this.isHorizontalGroupedWorkSpace()
      && this.getGroupCount() > 0;
  }

  // TODO: refactor current time indicator
  getCellIndexByDate(date, inAllDayRow?: any) {
    const { viewDataGenerator } = this.viewDataProvider;

    const timeInterval = inAllDayRow
      ? 24 * 60 * 60 * 1000
      : viewDataGenerator.getInterval(this.option('hoursInterval'));
    const startViewDateOffset = getStartViewDateTimeOffset(this.getStartViewDate(), this.option('startDayHour') as any);
    const dateTimeStamp = this.getIntervalBetween(date, inAllDayRow) + startViewDateOffset;

    let index = Math.floor(dateTimeStamp / timeInterval);

    if (inAllDayRow) {
      index = this.updateIndex(index);
    }

    if (index < 0) {
      index = 0;
    }

    return index;
  }

  getDataByDroppableCell() {
    const cellData = this.getCellData($(this.getDroppableCell()));
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
      this.isVerticalGroupedWorkSpace(),
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
    return this.groupedStrategy.getAllDayOffset();
  }

  // NOTE: refactor leftIndex calculation
  getCellIndexByCoordinates(coordinates, allDay) {
    const { horizontalScrollingState, verticalScrollingState } = this.virtualScrollingDispatcher;

    const cellCount = horizontalScrollingState?.itemCount ?? this.getTotalCellCount(this.getGroupCount());

    const cellWidth = this.getCellWidth();
    const cellHeight = allDay ? this.getAllDayHeight() : this.getCellHeight();

    const leftCoordinateOffset = horizontalScrollingState?.virtualItemSizeBefore ?? 0;
    const topCoordinateOffset = verticalScrollingState?.virtualItemSizeBefore ?? 0;

    const topIndex = Math.floor(Math.floor(coordinates.top - topCoordinateOffset) / Math.floor(cellHeight));
    let leftIndex = (coordinates.left - leftCoordinateOffset) / cellWidth;
    leftIndex = Math.floor(leftIndex + CELL_INDEX_CALCULATION_EPSILON);

    if (this.isRTL()) {
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
    const groupBounds = this.groupedStrategy instanceof VerticalGroupedStrategy
      ? this.getGroupBoundsVertical(coordinates.groupIndex)
      : this.getGroupBoundsHorizontal(coordinates);

    return this.isRTL()
      ? this.getGroupBoundsRtlCorrection(groupBounds)
      : groupBounds;
  }

  getGroupBoundsVertical(groupIndex) {
    const $firstAndLastCells = this.getFirstAndLastDataTableCell();
    return this.groupedStrategy.getGroupBoundsOffset(groupIndex, $firstAndLastCells);
  }

  getGroupBoundsHorizontal(coordinates) {
    const cellCount = this.getCellCount();
    const $cells = this.getCells();
    const cellWidth = this.getCellWidth();

    const { groupedDataMap } = this.viewDataProvider;
    return this.groupedStrategy
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
    return this.isVerticalGroupedWorkSpace() && this.getScrollable().scrollTop() !== 0;
  }

  getCellByCoordinates(coordinates, allDay) {
    const $cells = this.getCells(allDay);
    const cellIndex = this.getCellIndexByCoordinates(coordinates, allDay);

    return $cells.eq(cellIndex);
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

  updateScrollPosition(date, appointmentGroupValues?: GroupValues, allDay = false) {
    const newDate = this.timeZoneCalculator.createDate(date, 'toGrid');
    const inAllDayRow = allDay && this.isAllDayPanelVisible;

    if (this.needUpdateScrollPosition(newDate, appointmentGroupValues, inAllDayRow)) {
      this.scrollTo(newDate, appointmentGroupValues, inAllDayRow, false);
    }
  }

  needUpdateScrollPosition(date, appointmentGroupValues?: GroupValues, inAllDayRow = false) {
    const cells = this.getCellsInViewport(inAllDayRow);
    const groupIndex = this.isGroupsSpecified(appointmentGroupValues)
      ? this.getGroupIndexByGroupValues(appointmentGroupValues)
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

  private getCellsInViewport(inAllDayRow) {
    const $scrollable = this.getScrollable().$element();
    const cellHeight = this.getCellHeight();
    const cellWidth = this.getCellWidth();
    const totalColumnCount = this.getTotalCellCount(this.getGroupCount());
    const scrollableScrollTop = this.getScrollableScrollTop();
    const scrollableScrollLeft = this.getScrollableScrollLeft();

    const fullScrolledRowCount = scrollableScrollTop / cellHeight - this.virtualScrollingDispatcher.topVirtualRowsCount;

    let scrolledRowCount = Math.floor(fullScrolledRowCount);
    if (scrollableScrollTop % cellHeight !== 0) {
      scrolledRowCount += 1;
    }

    // horizontal v-scrolling
    const fullScrolledColumnCount = scrollableScrollLeft / cellWidth;
    let scrolledColumnCount = Math.floor(fullScrolledColumnCount);
    if (scrollableScrollLeft % cellWidth !== 0) {
      scrolledColumnCount += 1;
    }

    const rowCount = Math.floor(fullScrolledRowCount + getHeight($scrollable) / cellHeight);
    const columnCount = Math.floor(fullScrolledColumnCount + getWidth($scrollable) / cellWidth);

    const $cells = this.getAllCells(inAllDayRow);
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

  scrollTo(date: Date, groupValues?: RawGroupValues | GroupValues, allDay = false, throwWarning = true, align: 'start' | 'center' = 'center') {
    if (!this.isValidScrollDate(date, throwWarning)) {
      return;
    }

    const groupIndex = this.getGroupCount() && groupValues
      ? this.getGroupIndexByGroupValues(groupValues)
      : 0;
    const isScrollToAllDay = allDay && this.isAllDayPanelVisible;

    const coordinates = this.getScrollCoordinates(date, groupIndex, isScrollToAllDay);

    if (!coordinates) {
      return;
    }

    const scrollable = this.getScrollable();
    const $scrollable = scrollable.$element();

    const cellWidth = this.getCellWidth();
    const offset = this.option('rtlEnabled')
      ? cellWidth
      : 0;
    const scrollableHeight = getHeight($scrollable);
    const scrollableWidth = getWidth($scrollable);
    const cellHeight = this.getCellHeight();

    const xShift = align === 'start' ? 0 : (scrollableWidth - cellWidth) / 2;
    const yShift = align === 'start' ? 0 : (scrollableHeight - cellHeight) / 2;

    const left = coordinates.left - scrollable.scrollLeft() - xShift - offset;
    let top = coordinates.top - scrollable.scrollTop() - yShift;
    if (isScrollToAllDay && !this.isVerticalGroupedWorkSpace()) {
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

  private isValidScrollDate(date, throwWarning = true) {
    const viewOffset = this.option('viewOffset');
    const min = new Date(this.getStartViewDate().getTime() + viewOffset);
    const max = new Date(this.getEndViewDate().getTime() + viewOffset);

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
    const $cell = $cellElement || this.getDroppableCell();
    $cell?.removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
  }

  private getCoordinatesByCell($cell) {
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;
    let rowIndex = $cell.parent().index();
    const isAllDayCell = this.hasAllDayClass($cell);
    const isVerticalGrouping = this.isVerticalGroupedWorkSpace();

    if (!(isAllDayCell && !isVerticalGrouping)) {
      rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
    }

    return { rowIndex, columnIndex };
  }

  private isShowAllDayPanel() {
    return this.option('showAllDayPanel');
  }

  protected getTimePanelCells() {
    return (this.$element() as any).find(`.${TIME_PANEL_CELL_CLASS}`);
  }

  protected getRDateTableProps() {
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
      crossScrollingEnabled: Boolean(this.option('crossScrollingEnabled')),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private updateSelectedCellDataOption(selectedCellData, $nextFocusedCell?: any) {
    this.option('selectedCellData', selectedCellData);
    this.selectionChangedAction({ selectedCellData });
  }

  private fireSelectionEndEvent() {
    const selectedCellData = this.option('selectedCellData') ?? [];
    if (selectedCellData.length > 0 && this.selectionEndAction) {
      this.selectionEndAction({ selectedCellData });
    }
  }

  private getCellByData(cellData) {
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

    return allDay && !this.isVerticalGroupedWorkSpace()
      ? this.domGetAllDayPanelCell(position.columnIndex)
      : this.domGetDateCell(position);
  }

  // Must replace all DOM manipulations
  getDOMElementsMetaData() {
    return this.cache.memo('cellElementsMeta', () => ({
      dateTableCellsMeta: this.getDateTableDOMElementsInfo(),
      allDayPanelCellsMeta: this.getAllDayPanelDOMElementsInfo(),
    }));
  }

  getPanelDOMSize(panelName: 'allDayPanel' | 'regularPanel'): { width: number; height: number } {
    return panelName === 'allDayPanel'
      ? this.cache.memo('allDayPanelSize', () => getBoundingRect(this.$allDayPanel.get(0)))
      : this.cache.memo('regularPanelSize', () => getBoundingRect(this.getDateTable().get(0)));
  }

  getCollectorDimension(isCollectorCompact: boolean, panelName: 'allDayPanel' | 'regularPanel') {
    return this.cache.memo(`collectorSize-${panelName}`, () => CompactAppointmentsHelper.measureCollectorDimensions(
      panelName === 'allDayPanel' ? this.getAllDayContainer() : this.getFixedContainer(),
      isCollectorCompact,
    ));
  }

  private getDateTableDOMElementsInfo() {
    const dateTableCells = this.getAllCells(false);
    if (!dateTableCells.length || !hasWindow()) {
      return [[{}]];
    }

    const dateTable = this.getDateTable();
    // We should use getBoundingClientRect in renovation
    const dateTableRect = getBoundingRect(dateTable.get(0));

    const columnsCount = this.viewDataProvider.getColumnsCount();

    const result: any = [];

    dateTableCells.each((index, cell) => {
      const rowIndex = Math.floor(index / columnsCount);

      if (result.length === rowIndex) {
        result.push([]);
      }

      this.addCellMetaData(result[rowIndex], cell, dateTableRect);
    });

    return result;
  }

  private getAllDayPanelDOMElementsInfo() {
    const result = [];

    if (this.isAllDayPanelVisible && !this.isVerticalGroupedWorkSpace() && hasWindow()) {
      const allDayCells = this.getAllCells(true);

      if (!allDayCells.length) {
        return [{}];
      }

      const allDayAppointmentContainer = this.$allDayPanel;
      const allDayPanelRect = getBoundingRect(allDayAppointmentContainer.get(0));

      allDayCells.each((_, cell) => {
        this.addCellMetaData(result, cell, allDayPanelRect);
      });
    }

    return result;
  }

  private addCellMetaData(cellMetaDataArray, cell, parentRect) {
    const cellRect = getBoundingRect(cell);

    cellMetaDataArray.push({
      left: cellRect.left - parentRect.left,
      top: cellRect.top - parentRect.top,
      width: cellRect.width,
      height: cellRect.height,
    });
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
      this.$dateTable,
      DateTableComponent,
      'renovatedDateTable',
      this.getRDateTableProps(),
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
      this.attachGroupCountClass();
      utils.renovation.renderComponent(
        this,
        this.getGroupHeaderContainer(),
        GroupPanelComponent,
        'renovatedGroupPanel',
        options,
      );
    } else {
      this.detachGroupCountClass();
    }
  }

  renderRAllDayPanel() {
    const visible = this.isAllDayPanelVisible && !this.isGroupedAllDayPanel();

    if (visible) {
      this.updateAllDayVisibility();

      const options = {
        viewData: this.viewDataProvider.viewData,
        viewContext: this.getR1ComponentsViewContext(),
        dataCellTemplate: this.option('dataCellTemplate'),
        startCellIndex: 0,
        ...this.virtualScrollingDispatcher.horizontalVirtualScrolling?.getRenderState() || {},
      };

      utils.renovation.renderComponent(this, this.$allDayTable, AllDayTableComponent, 'renovatedAllDayPanel', options);
      utils.renovation.renderComponent(this, this.$allDayTitle, AllDayPanelTitleComponent, 'renovatedAllDayPanelTitle', {});
    }

    this.updateAllDayVisibility();
    this.updateScrollable();
  }

  renderRTimeTable() {
    utils.renovation.renderComponent(
      this,
      this.$timePanel,
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
      this.attachGroupCountClass();
    } else {
      this.detachGroupCountClass();
    }

    utils.renovation.renderComponent(
      this,
      this.$thead,
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

  public getCellFromDragTarget($dragTarget: dxElementWrapper): dxElementWrapper | null {
    if ($dragTarget.length === 0) {
      return null;
    }

    const point = this.getPointFromDragTarget($dragTarget);
    const elements = (domAdapter as any).elementsFromPoint(point.x, point.y);

    const cell = elements.find((element) => element.classList.contains('dx-scheduler-date-table-cell')
      || element.classList.contains('dx-scheduler-all-day-table-cell'));

    return cell ? $(cell) : null;
  }

  private getPointFromDragTarget($dragTarget: dxElementWrapper): { x: number; y: number } {
    const THRESHOLD = 10;

    const dragElementContainer = $dragTarget.get(0);
    const rect = dragElementContainer.getBoundingClientRect();

    const cellWidth = this.getCellWidth();
    const isWideAppointment = rect.width > cellWidth;
    const isNarrowAppointment = rect.width <= THRESHOLD;

    const x = rect.left;
    const y = rect.top;

    if (isWideAppointment) {
      return {
        x: x + THRESHOLD,
        y: y + THRESHOLD,
      };
    }

    if (isNarrowAppointment) {
      return { x, y };
    }

    return {
      x: x + rect.width / 2,
      y: y + THRESHOLD,
    };
  }

  // ------------
  // DnD should be removed from work-space
  // ------------

  // TODO<Appointments>: dragBehavior when old impl is removed
  initDragBehavior(scheduler) {
    if (!this.dragBehavior && scheduler) {
      this.dragBehavior = new AppointmentDragBehavior(scheduler);

      const $rootElement = $(scheduler.element());

      this.createDragBehavior(this.getWorkArea(), $rootElement);
      if (!this.isVerticalGroupedWorkSpace()) {
        this.createDragBehavior(this.$allDayPanel, $rootElement);
      }
    }
  }

  private createDragBehavior($targetElement, $rootElement) {
    const getItemData = (itemElement, appointments) => appointments._getItemData(itemElement);
    const getItemSettings = ($itemElement) => $itemElement.data(APPOINTMENT_SETTINGS_KEY);

    const options = {
      getItemData,
      getItemSettings,
    };

    this.createDragBehaviorBase($targetElement, $rootElement, options);
  }

  protected createDragBehaviorBase(targetElement, rootElement, options) {
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
      () => this.getDroppableCell(),
      () => this.getDateTables(),
      () => this.removeDroppableCellClass(),
      () => this.getCellWidth(),
      options,
    ));
  }

  // --------------
  // We do not need these methods in renovation
  // --------------

  protected isRenderHeaderPanelEmptyCell() {
    return this.isVerticalGroupedWorkSpace();
  }

  _dispose() {
    // @ts-expect-error
    super._dispose();

    if (this.documentPointerUpHandler) {
      (eventsEngine.off as any)(domAdapter.getDocument(), SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME, this.documentPointerUpHandler);
      this.documentPointerUpHandler = undefined;
    }
    this.virtualScrollingDispatcher.dispose();
  }

  _getDefaultOptions(): WorkspaceOptionsInternal {
    // @ts-expect-error
    const defaultOptions = extend(super._getDefaultOptions(), {
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
      skippedDays: undefined,
      scrolling: {
        mode: 'standard',
      },
      allDayPanelMode: 'all',
      height: undefined,
      draggingMode: 'outlook',
      onScrollEnd: noop,
      getHeaderHeight: undefined,
      renderAppointments: noop,
      onShowAllDayPanel: noop,
      onSelectedCellsClick: noop,
      timeZoneCalculator: undefined,
      schedulerHeight: undefined,
      schedulerWidth: undefined,
    });

    return defaultOptions;
  }

  _optionChanged(args: OptionChanged<WorkspaceOptionsInternal>): void {
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
        this.cleanWorkSpace();
        break;
      case 'groups':
        this.cleanView();
        this.removeAllDayElements();
        this.initGrouping();
        this.repaint();
        break;
      case 'groupOrientation':
        this.initGroupedStrategy();
        this.createRAllDayPanelElements();
        this.removeAllDayElements();
        this.cleanWorkSpace();
        this.toggleGroupByDateClass();
        break;
      case 'showAllDayPanel':
        if (this.isVerticalGroupedWorkSpace()) {
          this.cleanView();
          this.removeAllDayElements();
          this.initGrouping();
          this.repaint();
        } else {
          this.renderWorkSpace();
        }
        break;
      case 'allDayExpanded':
        this.updateAllDayExpansion();
        this.attachTablesEvents();
        this.updateScrollable();
        break;
      case 'onSelectionChanged':
        this.createSelectionChangedAction();
        break;
      case 'onSelectionEnd':
        this.createSelectionEndAction();
        break;
      case 'onCellClick':
        this.createCellClickAction();
        break;
      case 'onCellContextMenu':
        this.attachContextMenuEvent();
        break;
      case 'intervalCount':
        this.cleanWorkSpace();
        this.toggleWorkSpaceCountClass();
        break;
      case 'groupByDate':
        this.cleanWorkSpace();
        this.toggleGroupByDateClass();
        break;
      case 'crossScrollingEnabled':
        this.toggleHorizontalScrollClass();
        this.$dateTableScrollable.option(this.dateTableScrollableConfig());
        break;
      case 'allDayPanelMode':
        this.updateShowAllDayPanel();
        this.renderAppointments();
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

  private getVirtualScrollingDispatcherOptions() {
    return {
      getCellHeight: this.getCellHeight.bind(this),
      getCellWidth: this.getCellWidth.bind(this),
      getCellMinWidth: this.getCellMinWidth.bind(this),
      isRTL: this.isRTL.bind(this),
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
      getGroupCount: this.getGroupCount.bind(this),
      isVerticalGrouping: this.isVerticalGroupedWorkSpace.bind(this),
      getTotalRowCount: this.getTotalRowCount.bind(this),
      getTotalCellCount: this.getTotalCellCount.bind(this),
    };
  }

  protected cleanWorkSpace() {
    this.cleanView();
    this.toggleGroupedClass();
    this.toggleWorkSpaceWithOddCells();

    this.virtualScrollingDispatcher.updateDimensions(true);
    this.renderView();
    this.option('crossScrollingEnabled') && this.setTableSizes();
    this.cache.clear();
  }

  _init() {
    this.scrollSync = {};
    this.viewDataProviderValue = null;
    this.cellsSelectionStateValue = null;

    // @ts-expect-error
    super._init();

    this.initGrouping();

    this.toggleHorizontalScrollClass();
    this.toggleWorkSpaceCountClass();
    this.toggleGroupByDateClass();
    this.toggleWorkSpaceWithOddCells();

    (this.$element() as any)
      .addClass(COMPONENT_CLASS)
      .addClass(this.getElementClass());
  }

  private initPositionHelper() {
    this.positionHelper = new PositionHelper({
      key: this.option('key'),
      viewDataProvider: this.viewDataProvider,
      viewStartDayHour: this.option('startDayHour'),
      viewEndDayHour: this.option('endDayHour'),
      cellDuration: this.getCellDuration(),
      isGroupedByDate: this.isGroupedByDate(),
      rtlEnabled: this.option('rtlEnabled'),
      startViewDate: this.getStartViewDate(),
      isVerticalGrouping: this.isVerticalGroupedWorkSpace(),
      groupCount: this.getGroupCount(),
      isVirtualScrolling: this.isVirtualScrolling(),
      getDOMMetaDataCallback: this.getDOMElementsMetaData.bind(this),
    });
  }

  private initGrouping() {
    this.initGroupedStrategy();
    this.toggleGroupingDirectionClass();
    this.toggleGroupByDateClass();
  }

  isVerticalOrientation() {
    const orientation = this.option('groups')?.length
      ? this.option('groupOrientation')
      : this.getDefaultGroupStrategy();

    return orientation === 'vertical';
  }

  private initGroupedStrategy() {
    const Strategy = this.isVerticalOrientation()
      ? VerticalGroupedStrategy
      : HorizontalGroupedStrategy;

    this.groupedStrategy = new Strategy(this);
  }

  protected getDefaultGroupStrategy() {
    return 'horizontal';
  }

  protected toggleHorizontalScrollClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_BOTH_SCROLLS_CLASS, this.option('crossScrollingEnabled'));
  }

  private toggleGroupByDateClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS, this.isGroupedByDate());
  }

  private toggleWorkSpaceCountClass() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_COUNT_CLASS, this.isWorkSpaceWithCount());
  }

  protected toggleWorkSpaceWithOddCells() {
    (this.$element() as any).toggleClass(WORKSPACE_WITH_ODD_CELLS_CLASS, this.isWorkspaceWithOddCells());
  }

  protected toggleGroupingDirectionClass() {
    (this.$element() as any).toggleClass(VERTICAL_GROUPED_WORKSPACE_CLASS, this.isVerticalGroupedWorkSpace());
  }

  protected getDateTableCellClass(rowIndex?: any, columnIndex?: any) {
    const cellClass = `${DATE_TABLE_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS} ${VERTICAL_SIZES_CLASS}`;

    return this.groupedStrategy
      .addAdditionalGroupCellClasses(cellClass, columnIndex + 1, rowIndex, columnIndex);
  }

  protected getGroupHeaderClass(i?: any) {
    const cellClass = GROUP_HEADER_CLASS;

    return this.groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1);
  }

  protected initWorkSpaceUnits() {
    this.$headerPanelContainer = $('<div>').addClass('dx-scheduler-header-panel-container');
    this.$headerTablesContainer = $('<div>').addClass('dx-scheduler-header-tables-container');
    this.$headerPanel = $('<table>').attr('aria-hidden', true);
    this.$thead = $('<thead>').appendTo(this.$headerPanel);
    this.$headerPanelEmptyCell = $('<div>').addClass('dx-scheduler-header-panel-empty-cell');
    this.$allDayTable = $('<table>').attr('aria-hidden', true);

    this.$fixedContainer = $('<div>').addClass(FIXED_CONTAINER_CLASS);
    this.$allDayContainer = $('<div>').addClass(ALL_DAY_CONTAINER_CLASS);
    this.$dateTableScrollableContent = $('<div>').addClass('dx-scheduler-date-table-scrollable-content');
    this.$sidebarScrollableContent = $('<div>').addClass('dx-scheduler-side-bar-scrollable-content');

    this.initAllDayPanelElements();

    this.createRAllDayPanelElements();

    this.$timePanel = $('<table>').addClass(TIME_PANEL_CLASS).attr('aria-hidden', true);
    this.$dateTable = $('<table>').attr('aria-hidden', true);
    this.$dateTableContainer = $('<div>').addClass('dx-scheduler-date-table-container');
    this.$groupTable = $('<div>').addClass(WORKSPACE_VERTICAL_GROUP_TABLE_CLASS);
  }

  private initAllDayPanelElements() {
    this.allDayTitles = [];
    this.allDayTables = [];
    this.allDayPanels = [];
  }

  private initDateTableScrollable() {
    const $dateTableScrollable = $('<div>').addClass(SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS);

    // @ts-expect-error
    this.$dateTableScrollable = this._createComponent($dateTableScrollable, Scrollable, this.dateTableScrollableConfig());
    this.scrollSync.dateTable = getMemoizeScrollTo(() => this.$dateTableScrollable);
  }

  protected createWorkSpaceElements() {
    if (this.option('crossScrollingEnabled')) {
      this.createWorkSpaceScrollableElements();
    } else {
      this.createWorkSpaceStaticElements();
    }
  }

  protected createWorkSpaceStaticElements() {
    this.$dateTableContainer.append(this.$dateTable);

    if (this.isVerticalGroupedWorkSpace()) {
      this.$dateTableContainer.append(this.$allDayContainer);
      this.$dateTableScrollableContent.append(
        this.$groupTable,
        this.$timePanel,
        this.$dateTableContainer,
      );
      this.$dateTableScrollable.$content().append(
        this.$dateTableScrollableContent,
      );

      this.$headerTablesContainer.append(this.$headerPanel);
    } else {
      this.$dateTableScrollableContent.append(
        this.$timePanel,
        this.$dateTableContainer,
      );
      this.$dateTableScrollable.$content().append(this.$dateTableScrollableContent);

      this.$headerTablesContainer.append(this.$headerPanel, this.$allDayPanel);
      this.$allDayPanel?.append(this.$allDayContainer, this.$allDayTable);
    }

    this.appendHeaderPanelEmptyCellIfNecessary();
    this.$headerPanelContainer.append(this.$headerTablesContainer);

    this.$element()
      .append(this.$fixedContainer)
      .append(this.$headerPanelContainer)
      .append(this.$dateTableScrollable.$element());
  }

  protected createWorkSpaceScrollableElements() {
    this.$element().append(this.$fixedContainer);

    this.$flexContainer = $('<div>').addClass('dx-scheduler-work-space-flex-container');

    this.createHeaderScrollable();

    this.headerScrollable.$content().append(this.$headerPanel);
    this.appendHeaderPanelEmptyCellIfNecessary();
    this.$headerPanelContainer.append(this.$headerTablesContainer);

    this.$element().append(this.$headerPanelContainer);
    this.$element().append(this.$flexContainer);

    this.createSidebarScrollable();
    this.$flexContainer.append(this.$dateTableScrollable.$element());

    this.$dateTableContainer.append(this.$dateTable);
    this.$dateTableScrollableContent.append(this.$dateTableContainer);

    this.$dateTableScrollable.$content().append(this.$dateTableScrollableContent);

    if (this.isVerticalGroupedWorkSpace()) {
      this.$dateTableContainer.append(this.$allDayContainer);
      this.$sidebarScrollableContent.append(this.$groupTable, this.$timePanel);
    } else {
      this.headerScrollable.$content().append(this.$allDayPanel);
      this.$allDayPanel?.append(this.$allDayContainer, this.$allDayTable);
      this.$sidebarScrollableContent.append(this.$timePanel);
    }

    this.$sidebarScrollable.$content().append(this.$sidebarScrollableContent);
  }

  private appendHeaderPanelEmptyCellIfNecessary() {
    this.isRenderHeaderPanelEmptyCell() && this.$headerPanelContainer.append(this.$headerPanelEmptyCell);
  }

  private createHeaderScrollable() {
    const $headerScrollable = $('<div>')
      .addClass(SCHEDULER_HEADER_SCROLLABLE_CLASS)
      .appendTo(this.$headerTablesContainer);

    // @ts-expect-error
    this.headerScrollable = this._createComponent($headerScrollable, Scrollable, this.headerScrollableConfig());
    this.scrollSync.header = getMemoizeScrollTo(() => this.headerScrollable);
  }

  private createSidebarScrollable() {
    const $timePanelScrollable = $('<div>')
      .addClass(SCHEDULER_SIDEBAR_SCROLLABLE_CLASS)
      .appendTo(this.$flexContainer);

    // @ts-expect-error
    this.$sidebarScrollable = this._createComponent($timePanelScrollable, Scrollable, {
      useKeyboard: false,
      showScrollbar: 'never',
      direction: 'vertical',
      useNative: false,
      updateManually: true,
      bounceEnabled: false,
      onScroll: (event) => {
        this.scrollSync.dateTable({ top: event.scrollOffset.top });
      },
    });
    this.scrollSync.sidebar = getMemoizeScrollTo(() => this.$sidebarScrollable);
  }

  private attachTableClasses() {
    this.addTableClass(this.$dateTable, DATE_TABLE_CLASS);

    if (this.isVerticalGroupedWorkSpace()) {
      const groupCount = this.getGroupCount();

      for (let i = 0; i < groupCount; i++) {
        this.addTableClass(this.allDayTables[i], ALL_DAY_TABLE_CLASS);
      }
    }
  }

  private attachHeaderTableClasses() {
    this.addTableClass(this.$headerPanel, HEADER_PANEL_CLASS);
  }

  private addTableClass($el, className) {
    ($el && !$el.hasClass(className)) && $el.addClass(className);
  }

  _initMarkup() {
    this.cache.clear();

    this.initWorkSpaceUnits();

    this.initVirtualScrolling();

    this.initDateTableScrollable();

    this.createWorkSpaceElements();

    // @ts-expect-error
    super._initMarkup();

    if (!this.option('crossScrollingEnabled')) {
      this.attachTableClasses();
      this.attachHeaderTableClasses();
    }

    this.toggleGroupedClass();

    this.renderView();
    this.attachEvents();
  }

  _render() {
    // @ts-expect-error
    super._render();
    this.renderDateTimeIndication();
    this.setIndicationUpdateInterval();
  }

  private toggleGroupedClass() {
    (this.$element() as any).toggleClass(GROUPED_WORKSPACE_CLASS, this.getGroupCount() > 0);
  }

  protected renderView() {
    if (this.isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }

    this.renderWorkSpace();
    this.virtualScrollingDispatcher.updateDimensions();

    this.updateGroupTableHeight();
    this.updateHeaderEmptyCellWidth();

    this.shader = new VerticalShader(this);
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

  protected renderDateTimeIndication() { return noop(); }

  protected renderCurrentDateTimeLineAndShader(): void { return noop(); }

  protected renderCurrentDateTimeIndication(): void { return noop(); }

  protected setIndicationUpdateInterval() { return noop(); }

  protected detachGroupCountClass() {
    VERTICAL_GROUP_COUNT_CLASSES.forEach((className) => {
      this.$element().removeClass(className);
    });
  }

  protected attachGroupCountClass() {
    const className = this.groupedStrategy.getGroupCountClass(this.option('groups'));

    this.$element().addClass(className);
  }

  protected getDateHeaderTemplate(): TemplateBase | null | undefined {
    return this.option('dateCellTemplate');
  }

  protected updateAllDayVisibility(): void {
    this.$element().toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, this.isShowAllDayPanel());
    this.updateAllDayExpansion();
  }

  private updateAllDayExpansion(): void {
    const isExpanded = !this.option('allDayExpanded') && this.isShowAllDayPanel();

    this.cache.clear();
    this.$element().toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, isExpanded);
  }

  private getDateTables() {
    return this.$dateTable.add(this.$allDayTable);
  }

  private getDateTable() {
    return this.$dateTable;
  }

  private removeAllDayElements() {
    this.$allDayTable?.remove();
    this.$allDayTitle?.remove();
  }

  protected cleanView(): void {
    this.cache.clear();
    this.cleanTableWidths();
    this.cellsSelectionState.clearSelectedAndFocusedCells();

    this.shader?.clean();

    delete this.interval;
  }

  _clean() {
    (eventsEngine.off as any)(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
    this.disposeRenovatedComponents();

    // @ts-expect-error
    super._clean();
  }

  private cleanTableWidths() {
    this.$headerPanel.css('width', '');
    this.$dateTable.css('width', '');
    this.$allDayTable?.css('width', '');
  }

  private disposeRenovatedComponents() {
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
    return this.groupedStrategy;
  }

  getFixedContainer() {
    return this.$fixedContainer;
  }

  getAllDayContainer() {
    return this.$allDayContainer;
  }

  updateRender() {
    this.renderer.updateRender();
  }

  updateGrid() {
    this.renderer._renderGrid();
  }

  renderAppointments() {
    (this.option('renderAppointments') as any)();
    this.dragBehavior?.updateDragSource();
  }

  renderWorkSpace({
    generateNewData,
    renderComponents,
  } = DEFAULT_WORKSPACE_RENDER_OPTIONS): void {
    this.cache.clear();

    this.viewDataProvider.update(this.generateRenderOptions(), generateNewData);

    this.renderRWorkSpace(renderComponents);

    this.initPositionHelper();
  }

  protected renderGroupHeader() {
    const $container = this.getGroupHeaderContainer();
    const groupCount = this.getGroupCount();
    let cellTemplates: (() => dxElementWrapper)[] = [];
    if (groupCount) {
      const groupRows = this.makeGroupRows(this.option('groups'), this.option('groupByDate'));
      this.attachGroupCountClass();
      $container.append(groupRows.elements);
      cellTemplates = groupRows.cellTemplates;
    } else {
      this.detachGroupCountClass();
    }

    return cellTemplates;
  }

  protected applyCellTemplates(templates) {
    templates?.forEach((template) => {
      template();
    });
  }

  protected makeGroupRows(groups: ResourceLoader[], groupByDate: boolean): GroupRows {
    const tableCreatorStrategy = this.isVerticalGroupedWorkSpace() ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

    return tableCreator.makeGroupedTable(
      tableCreatorStrategy,
      groups,
      {
        groupHeaderRowClass: GROUP_ROW_CLASS,
        groupRowClass: GROUP_ROW_CLASS,
        groupHeaderClass: this.getGroupHeaderClass.bind(this),
        groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
      },
      this.getCellCount() || 1,
      this.option('resourceCellTemplate'),
      this.getGroupCount(),
      groupByDate,
    );
  }

  protected getGroupsForDateHeaderTemplate(templateIndex, indexMultiplier = 1) {
    if (this.isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()) {
      const groupIndex = this.getGroupIndex(0, templateIndex * indexMultiplier);
      const groups = getLeafGroupValues(this.resourceManager.groupsLeafs, groupIndex);

      return {
        groups,
        groupIndex,
      };
    }

    return {};
  }

  protected getHeaderPanelCellClass(i: number): string {
    const cellClass = `${HEADER_PANEL_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS}`;

    return this.groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1, undefined, undefined, this.isGroupedByDate());
  }

  protected insertAllDayRowsIntoDateTable() {
    return this.groupedStrategy.insertAllDayRowsIntoDateTable();
  }
}

// TODO<Appointments>: remove dragBehavior when old impl is removed
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
    const $item = appointments._renderItem(appointmentIndex, {
      itemData,
      ...settings,
      isCompact: false,
      virtual: false,
      sortedIndex: -1,
    });

    return $item;
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

    const isMoveUnderControl = Boolean(elements.find((el) => el === rootElement.get(0)));
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
