import type { ScrollDirection } from '@js/common';
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
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
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
  setHeight,
  setOuterHeight,
  setWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { DxEvent, InitializedEventInfo } from '@js/events';
import type {
  AllDayPanelMode,
  AppointmentDraggingEndEvent,
  AppointmentDraggingRemoveEvent,
  AppointmentDraggingStartEvent,
  CellClickEvent,
  CellContextMenuEvent,
  ScrollMode,
} from '@js/ui/scheduler';
import type { ScrollEvent } from '@js/ui/scroll_view';
import errors from '@js/ui/widget/ui.errors';
import type { TranslateVector } from '@ts/common/core/animation/translator';
import { getMemoizeScrollTo, type ScrollToFunc } from '@ts/core/utils/scroll';
import type { ActionConfig } from '@ts/core/widget/component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys, WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
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
import type HorizontalCurrentTimeShader from '../shaders/current_time_shader_horizontal';
import VerticalShader from '../shaders/current_time_shader_vertical';
import tableCreatorModule, { type GroupRows } from '../table_creator';
import type {
  CellPositionData,
  CellRect,
  DOMMetaData,
  GroupBoundsOffset,
  ViewCellData,
} from '../types';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import {
  getAppointmentGroupIndex,
  getSafeGroupValues,
} from '../utils/resource_manager/appointment_groups_utils';
import { getLeafGroupValues } from '../utils/resource_manager/group_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { GroupValues, RawGroupValues } from '../utils/resource_manager/types';
import { getSkippedDaysCount as countSkippedDays } from '../utils/skipped_days';
import type { CollectorCSS, RealSize } from '../view_model/generate_view_model/steps/add_geometry/types';
import type { AppointmentViewModelPlain, ListEntity, PanelName } from '../view_model/types';
import { CellsSelectionController } from './cells_selection_controller';
import CellsSelectionState from './cells_selection_state';
import {
  getAllDayHeight,
  getCellHeight,
  getCellWidth,
  getMaxAllowedPosition,
  PositionHelper,
} from './helpers/position_helper';
import type { ViewDataProviderOptions } from './view_model/types';
import ViewDataProvider from './view_model/view_data_provider';
import { VirtualScrollingDispatcher, type VirtualScrollingDispatcherOptions, VirtualScrollingRenderer } from './virtual_scrolling';
import type { GroupedStrategyConfig } from './work_space_grouped_strategy_config';
import HorizontalGroupedStrategy from './work_space_grouped_strategy_horizontal';
import VerticalGroupedStrategy from './work_space_grouped_strategy_vertical';

interface RenderComponentOptions {
  header?: boolean;
  timePanel?: boolean;
  dateTable?: boolean;
  allDayPanel?: boolean;
}

interface RenovationWidget {
  $element: () => dxElementWrapper;
  option: (options: Record<string, unknown>) => void;
  dispose: () => void;
}

type CreateRenovationComponentFn = (
  element: string | HTMLElement | dxElementWrapper | Element,
  component: unknown,
  config: Record<string, unknown>,
) => RenovationWidget;

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

interface ScrollSync {
  dateTable: ScrollToFunc;
  header: ScrollToFunc;
  sidebar: ScrollToFunc;
}

interface NormalizedCellData {
  startDate: Date;
  endDate: Date;
  startDateUTC?: Date | false | undefined;
  endDateUTC?: Date | false | undefined;
  groups?: ViewCellData['groups'];
  groupIndex: ViewCellData['groupIndex'];
  allDay?: ViewCellData['allDay'];
  index?: ViewCellData['index'];
  isFirstGroupCell?: ViewCellData['isFirstGroupCell'];
  isLastGroupCell?: ViewCellData['isLastGroupCell'];
  key?: ViewCellData['key'];
}

const { tableCreator } = tableCreatorModule;

// The constant is needed so that the dragging is not sharp. To prevent small twitches
const DRAGGING_MOUSE_FAULT = 10;

// @ts-expect-error Widget exposes a static abstract() helper not typed in its d.ts
const { abstract: widgetAbstract } = Widget;
const abstract = widgetAbstract as () => never;
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

interface SelectedCellsEventArgs {
  selectedCellData: ViewCellData[];
}

interface WorkspaceOptionActionMap {
  onSelectionChanged: SelectedCellsEventArgs;
  onSelectionEnd: SelectedCellsEventArgs;
  onCellClick: Pick<CellClickEvent, 'event' | 'cellElement' | 'cellData'>;
  onCellContextMenu: Pick<CellContextMenuEvent, 'event' | 'cellElement' | 'cellData'>;
}

type WorkspaceCoordinates = Coordinates & { groupIndex?: number };

type DroppableCellData = Pick<ViewCellData, 'startDate' | 'endDate' | 'allDay' | 'groups'>;

export interface WorkspaceOptionsInternal extends WidgetProperties<SchedulerWorkSpace> {
  newAppointments: boolean;
  resources: ResourceLoader[];
  getResourceManager: () => ResourceManager;
  getFilteredItems: () => ListEntity[];
  noDataText: string;
  firstDayOfWeek?: number;
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
  onSelectionChanged: ((args: SelectedCellsEventArgs) => void);
  onSelectionEnd: ((args: SelectedCellsEventArgs) => void);
  groupByDate: boolean;
  skippedDays?: number[];
  scrolling: {
    mode: ScrollMode;
    orientation?: ScrollDirection;
  };
  draggingMode: 'outlook' | 'default';
  timeZoneCalculator?: TimeZoneCalculator;
  schedulerHeight: string | number | undefined;
  schedulerWidth: string | number | undefined;
  allDayPanelMode: AllDayPanelMode;
  onSelectedCellsClick: (result: object, groups: GroupValues) => void;
  renderAppointments: () => void;
  onShowAllDayPanel: (isVisible: boolean) => void;
  getHeaderHeight?: (() => number);
  onScrollEnd: () => void;
  onInitialized: (e: InitializedEventInfo<SchedulerWorkSpace>) => void;
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
  startDate?: Date | null;
  type?: ViewType;
  groupOrientation: GroupOrientation;

  rtlEnabled: boolean;
}

class SchedulerWorkSpace extends Widget<WorkspaceOptionsInternal> {
  private viewDataProviderValue!: ViewDataProvider | null;

  private cacheValue!: Cache | null;

  private cellsSelectionStateValue!: CellsSelectionState | null;

  private cellsSelectionControllerValue!: CellsSelectionController | null;

  protected $dateTableScrollable!: Scrollable;

  private selectionChangedAction:
    | ((args: WorkspaceOptionActionMap['onSelectionChanged']) => void)
    | undefined;

  private selectionEndAction:
    | ((args: WorkspaceOptionActionMap['onSelectionEnd']) => void)
    | undefined;

  private isSelectionStartedOnCell = false;

  private documentPointerUpHandler: (() => void) | undefined;

  private isCellClick?: boolean;

  private contextMenuHandled?: boolean;

  _disposed: boolean | undefined;

  protected getToday?(): Date;

  protected $allDayPanel!: dxElementWrapper;

  private $allDayTitle!: dxElementWrapper;

  private $headerPanelEmptyCell!: dxElementWrapper;

  protected groupedStrategy!: HorizontalGroupedStrategy | VerticalGroupedStrategy;

  public virtualScrollingDispatcher!: VirtualScrollingDispatcher;

  private scrollSync!: Partial<ScrollSync>;

  private $headerPanel!: dxElementWrapper;

  protected $dateTable!: dxElementWrapper;

  private $allDayTable: dxElementWrapper | undefined;

  private renderer!: VirtualScrollingRenderer;

  _createAction!: (fn: (e: { event: Event }) => void) => (event?: unknown) => void;

  private cellClickAction:
    | ((args: WorkspaceOptionActionMap['onCellClick']) => void)
    | undefined;

  _createActionByOption!: (
    name: keyof WorkspaceOptionsInternal,
    options?: ActionConfig,
  ) => (event?: unknown) => void;

  private showPopup?: boolean;

  private contextMenuAction:
    | ((args: WorkspaceOptionActionMap['onCellContextMenu']) => void)
    | undefined;

  protected $groupTable: dxElementWrapper | null | undefined;

  protected $thead!: dxElementWrapper;

  private headerScrollable!: Scrollable;

  protected $sidebarScrollable!: Scrollable;

  private preventDefaultDragging = false;

  public dragBehavior: AppointmentDragBehavior | null = null;

  protected $dateTableContainer!: dxElementWrapper;

  protected $timePanel!: dxElementWrapper;

  positionHelper!: PositionHelper;

  protected $headerPanelContainer!: dxElementWrapper;

  private $headerTablesContainer!: dxElementWrapper;

  private $fixedContainer!: dxElementWrapper;

  private $allDayContainer!: dxElementWrapper;

  protected $dateTableScrollableContent!: dxElementWrapper;

  private $sidebarScrollableContent!: dxElementWrapper;

  private allDayTables!: dxElementWrapper[];

  protected $flexContainer!: dxElementWrapper;

  protected shader!: VerticalShader | HorizontalCurrentTimeShader;

  protected $sidebarTable: dxElementWrapper | undefined;

  private interval?: ReturnType<typeof setInterval>;

  private renovatedAllDayPanel: RenovationWidget | undefined;

  public renovatedDateTable: RenovationWidget | undefined;

  private renovatedTimePanel: RenovationWidget | undefined;

  private renovatedGroupPanel: RenovationWidget | undefined;

  public renovatedHeaderPanel: RenovationWidget | undefined;

  readonly viewDirection: 'vertical' | 'horizontal' = 'vertical';

  protected _activeStateUnit(): string {
    return CELL_SELECTOR;
  }

  get type(): ViewType {
    return abstract();
  }

  get viewDataProvider(): ViewDataProvider {
    this.viewDataProviderValue ??= new ViewDataProvider(this.type);
    return this.viewDataProviderValue;
  }

  get cache(): Cache {
    this.cacheValue ??= new Cache();
    return this.cacheValue;
  }

  get resourceManager(): ResourceManager {
    return this.option().getResourceManager();
  }

  get cellsSelectionState(): CellsSelectionState {
    const isFirstInit = this.cellsSelectionStateValue == null;
    this.cellsSelectionStateValue ??= new CellsSelectionState(this.viewDataProvider);

    if (isFirstInit) {
      const selectedCellsOption = this.option().selectedCellData;

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

  get cellsSelectionController(): CellsSelectionController {
    this.cellsSelectionControllerValue ??= new CellsSelectionController();
    return this.cellsSelectionControllerValue;
  }

  get isAllDayPanelVisible(): boolean {
    return this.isShowAllDayPanel() && this.supportAllDayRow();
  }

  get verticalGroupTableClass(): string { return WORKSPACE_VERTICAL_GROUP_TABLE_CLASS; }

  get renovatedHeaderPanelComponent(): typeof HeaderPanelComponent { return HeaderPanelComponent; }

  get timeZoneCalculator(): TimeZoneCalculator | undefined {
    return this.option().timeZoneCalculator;
  }

  get isDefaultDraggingMode(): boolean {
    return this.option().draggingMode === 'default';
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
    const { notifyScheduler } = this.option();

    if (!notifyScheduler) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return notifyScheduler.invoke(funcName, ...args);
  }

  _supportedKeys(): SupportedKeys {
    const enterKeydownHandler = (
      e: KeyboardEvent,
    ): void => {
      e.preventDefault();
      e.stopPropagation();

      const selectedCells = this.getSelectedCellsData();

      if (selectedCells?.length) {
        const selectedCellsElement = selectedCells
          .map((cellData) => this.getCellByData(cellData))
          .filter((cell): cell is dxElementWrapper => Boolean(cell));

        this.showPopup = true;

        const cellElements = selectedCellsElement.map(($cell) => $cell.get(0));

        this.cellClickAction?.(
          {
            event: e as CellClickEvent['event'],
            cellElement: getPublicElement($(cellElements)),
            cellData: selectedCells[0],
          },
        );
      }
    };
    const onArrowPressed = (e: KeyboardEvent, key: 'up' | 'down' | 'left' | 'right'): void => {
      e.preventDefault();
      e.stopPropagation();

      const focusedCellData = this.cellsSelectionState.getFocusedCell()?.cellData;

      if (focusedCellData) {
        const isAllDayPanelCell = Boolean(focusedCellData.allDay
          && !this.isVerticalGroupedWorkSpace());
        const isMultiSelection = Boolean(e.shiftKey);
        const isMultiSelectionAllowed = this.option().allowMultipleCellSelection;
        const isRTL = this.isRTL();
        const groupCount = this.getGroupCount();
        const isGroupedByDate = this.isGroupedByDate();
        const isHorizontalGrouping = this.isHorizontalGroupedWorkSpace();
        const focusedCellPosition = this.viewDataProvider.findCellPositionInMap(focusedCellData);

        const edgeIndices = isHorizontalGrouping && isMultiSelection && !isGroupedByDate
          ? this.viewDataProvider.getGroupEdgeIndices(
            focusedCellData.groupIndex ?? 0,
            isAllDayPanelCell,
          )
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

    const supportedKeys: SupportedKeys = {
      enter: enterKeydownHandler,
      space: enterKeydownHandler,
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
    };

    return extend(super._supportedKeys(), supportedKeys) as SupportedKeys;
  }

  private isRTL(): boolean {
    return this.option().rtlEnabled;
  }

  private moveToCell($cell: dxElementWrapper, isMultiSelection: boolean): void {
    if (!isDefined($cell) || !$cell.length) {
      return;
    }

    const isMultiSelectionAllowed = this.option().allowMultipleCellSelection;
    const currentCellData = this.getFullCellData($cell);
    if (!currentCellData) {
      return;
    }

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

  private processNextSelectedCell(
    nextCellData: ViewCellData,
    focusedCellData: ViewCellData,
    isMultiSelection: boolean,
  ): void {
    const nextCellPosition = this.viewDataProvider.findCellPositionInMap(nextCellData);

    if (!nextCellPosition) {
      return;
    }

    if (!this.viewDataProvider.isSameCell(focusedCellData, nextCellData)) {
      const $cell = nextCellData.allDay && !this.isVerticalGroupedWorkSpace()
        ? this.domGetAllDayPanelCell(nextCellPosition.columnIndex)
        : this.domGetDateCell(nextCellPosition);
      const isNextCellAllDay = nextCellData.allDay;

      this.setSelectedCellsStateAndUpdateSelection(
        Boolean(isNextCellAllDay),
        nextCellPosition,
        isMultiSelection,
        $cell,
      );

      this.$dateTableScrollable.scrollToElement($cell);
    }
  }

  private setSelectedCellsStateAndUpdateSelection(
    isAllDay: boolean,
    cellPosition: CellPositionData,
    isMultiSelection: boolean,
    $nextFocusedCell: dxElementWrapper,
  ): void {
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

  private hasAllDayClass($cell: dxElementWrapper): boolean {
    return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
  }

  _focusInHandler(e: DxEvent): void {
    const $target = $(e.target as Element | null);
    const $focusTarget = this._focusTarget();
    // T1312256: On macOS, e.target can be a child element of the workspace root
    const isTargetInsideWorkspace = $target.is($focusTarget)
      || $target.closest($focusTarget).length > 0;

    if (isTargetInsideWorkspace && this.isCellClick) {
      delete this.isCellClick;
      delete this.contextMenuHandled;
      super._focusInHandler(e);

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

  _focusOutHandler(e: DxEvent): void {
    super._focusOutHandler(e);

    if (!this.contextMenuHandled && !this._disposed) {
      this.cellsSelectionState.releaseSelectedAndFocusedCells();

      this.viewDataProvider.updateViewData(this.generateRenderOptions());
      this.updateCellsSelection();
    }
  }

  _focusTarget(): dxElementWrapper {
    return this.$element();
  }

  protected isVerticalGroupedWorkSpace(): boolean { // TODO move to the Model
    return Boolean(this.option().groups?.length) && this.option().groupOrientation === 'vertical';
  }

  protected isHorizontalGroupedWorkSpace(): boolean {
    return Boolean(this.option().groups?.length) && this.option().groupOrientation === 'horizontal';
  }

  protected isWorkSpaceWithCount(): boolean {
    return this.option().intervalCount > 1;
  }

  private isWorkspaceWithOddCells(): boolean {
    return this.option().hoursInterval === 0.5 && !this.isVirtualScrolling();
  }

  createRAllDayPanelElements(): void {
    this.$allDayPanel = $('<div>').addClass(ALL_DAY_PANEL_CLASS);
    this.$allDayTitle = $('<div>').appendTo(this.$headerPanelEmptyCell);
  }

  protected dateTableScrollableConfig(): ScrollableProperties {
    let config: ScrollableProperties = {
      useKeyboard: false,
      bounceEnabled: false,
      updateManually: true,
      onScroll: () => {
        if (this.groupedStrategy instanceof VerticalGroupedStrategy) {
          this.groupedStrategy.cache.clear();
        }
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
        onScroll: (e: ScrollEvent): void => {
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
      onScroll: (event: ScrollEvent): void => {
        onScroll?.(event);

        const top = event.scrollOffset?.top;
        const left = event.scrollOffset?.left;

        if (top !== undefined) {
          this.scrollSync.sidebar?.({ top });
        }

        if (left !== undefined) {
          this.scrollSync.header?.({ left });
        }
      },
      onEnd: (): void => {
        this.option().onScrollEnd();
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
      onScroll: (event: ScrollEvent): void => {
        this.scrollSync.dateTable?.({ left: event.scrollOffset.left });
      },
    };
  }

  _visibilityChanged(visible: boolean): void {
    this.cache.clear();

    if (visible) {
      this.updateGroupTableHeight();
    }

    if (visible && this.needCreateCrossScrolling()) {
      this.setTableSizes();
    }
  }

  protected setTableSizes(): void {
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

  getWorkSpaceMinWidth(): number {
    return this.groupedStrategy.getWorkSpaceMinWidth();
  }

  _dimensionChanged(): void {
    if (!this._isVisible()) {
      return;
    }

    if (this.option().crossScrollingEnabled) {
      this.setTableSizes();
    }

    this.updateHeaderEmptyCellWidth();

    this.updateScrollable();

    this.cache.clear();
  }

  protected needCreateCrossScrolling(): boolean {
    return this.option().crossScrollingEnabled;
  }

  protected getElementClass(): string { return ''; }

  protected getRowCount(): number {
    return this.viewDataProvider.getRowCount({
      intervalCount: this.option().intervalCount,
      currentDate: this.option().currentDate,
      viewType: this.type,
      hoursInterval: this.option().hoursInterval,
      startDayHour: this.option().startDayHour,
      endDayHour: this.option().endDayHour,
    });
  }

  protected getCellCount(): number {
    return this.viewDataProvider.getCellCount({
      intervalCount: this.option().intervalCount,
      currentDate: this.option().currentDate,
      viewType: this.type,
      hoursInterval: this.option().hoursInterval,
      startDayHour: this.option().startDayHour,
      endDayHour: this.option().endDayHour,
    });
  }

  private isVirtualModeOn(): boolean {
    return this.option().scrolling.mode === 'virtual';
  }

  isVirtualScrolling(): boolean {
    return this.renovatedRenderSupported() && this.isVirtualModeOn();
  }

  private initVirtualScrolling(): void {
    if (this.virtualScrollingDispatcher) {
      this.virtualScrollingDispatcher.dispose();
    }

    this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(
      this.getVirtualScrollingDispatcherOptions(),
    );
    this.virtualScrollingDispatcher.attachScrollableEvents();
    this.renderer = new VirtualScrollingRenderer(this);
  }

  isGroupedAllDayPanel(): boolean {
    return calculateIsGroupedAllDayPanel(
      this.option().groups.length,
      this.option().groupOrientation,
      this.isAllDayPanelVisible,
    );
  }

  generateRenderOptions(isProvideVirtualCellsWidth = false): ViewDataProviderOptions {
    const groupCount = this.getGroupCount();

    const groupOrientation: GroupOrientation = groupCount > 0
      ? this.option().groupOrientation
      : this.getDefaultGroupStrategy();

    const renderState = this.virtualScrollingDispatcher.getRenderState();
    const options: ViewDataProviderOptions = {
      groupByDate: this.option().groupByDate,
      groupOrientation,
      today: this.getToday?.() ?? new Date(),
      getResourceManager: this.option().getResourceManager,
      isProvideVirtualCellsWidth,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      selectedCells: this.cellsSelectionState.getSelectedCells(),
      focusedCell: this.cellsSelectionState.getFocusedCell(),
      headerCellTextFormat: this.getFormat(),
      getDateForHeaderText: (_: number, date: Date): Date => date,
      viewOffset: this.option().viewOffset,
      startDayHour: this.option().startDayHour,
      endDayHour: this.option().endDayHour,
      cellDuration: this.getCellDuration(),
      viewType: this.type,
      intervalCount: this.option().intervalCount,
      hoursInterval: this.option().hoursInterval,
      currentDate: this.option().currentDate,
      startDate: this.option().startDate ?? undefined,
      firstDayOfWeek: this.option().firstDayOfWeek ?? 0,
      showCurrentTimeIndicator: this.option().showCurrentTimeIndicator,
      skippedDays: this.option().skippedDays,

      ...renderState,
      startRowIndex: renderState.startRowIndex ?? 0,
      startCellIndex: renderState.startCellIndex ?? 0,
    };

    return options;
  }

  renovatedRenderSupported(): boolean { return true; }

  private updateGroupTableHeight(): void {
    if (this.isVerticalGroupedWorkSpace() && hasWindow()) {
      this.setHorizontalGroupHeaderCellsHeight();
    }
  }

  updateHeaderEmptyCellWidth(): void {
    if (hasWindow() && this.isRenderHeaderPanelEmptyCell()) {
      const timePanelWidth = this.getTimePanelWidth();
      const groupPanelWidth = this.getGroupTableWidth();

      this.$headerPanelEmptyCell.css('width', timePanelWidth + groupPanelWidth);
    }
  }

  updateHeaderPanelScrollbarPadding(): void {
    if (hasWindow() && this.$headerPanelContainer) {
      const scrollbarWidth = this.getScrollbarWidth();
      this.$headerPanelContainer.css('paddingRight', `${scrollbarWidth}px`);
    }
  }

  private getScrollbarWidth(): number {
    const containerElement = $(this.$dateTableScrollable.container()).get(0) as HTMLElement;
    const scrollbarWidth = containerElement.offsetWidth - containerElement.clientWidth;
    return scrollbarWidth;
  }

  private isGroupsSpecified(groupValues?: GroupValues): number | GroupValues | undefined {
    return this.option().groups?.length && groupValues;
  }

  private getGroupIndexByGroupValues(
    groupValues?: RawGroupValues | GroupValues,
  ): number | undefined {
    return groupValues && getAppointmentGroupIndex(
      getSafeGroupValues(groupValues),
      this.resourceManager.groupsLeafs,
    )[0];
  }

  protected getViewStartByOptions(): Date {
    return getViewStartByOptions(
      this.option().startDate ?? undefined,
      this.option().currentDate,
      this.getTotalViewDuration(),
      this.option().startDate ? this.calculateViewStartDate() : undefined,
    );
  }

  protected getTotalViewDuration(): number {
    return this.viewDataProvider.getIntervalDuration(this.option().intervalCount);
  }

  protected getHeaderDate(): Date {
    return this.getStartViewDate();
  }

  protected calculateViewStartDate(): Date | undefined {
    return calculateViewStartDate(this.option().startDate ?? undefined);
  }

  protected firstDayOfWeek(): number {
    return this.viewDataProvider.getFirstDayOfWeek(this.option().firstDayOfWeek ?? 0);
  }

  protected attachEvents(): void {
    this.createSelectionChangedAction();
    this.createSelectionEndAction();
    this.attachClickEvent();
    this.attachContextMenuEvent();
  }

  private attachClickEvent(): void {
    const pointerDownAction = this._createAction((e) => {
      this.pointerDownHandler(e.event);
    });

    this.createCellClickAction();

    const cellSelector = `.${DATE_TABLE_CELL_CLASS},.${ALL_DAY_TABLE_CELL_CLASS}`;
    const $element = this.$element();

    eventsEngine.off($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME);
    eventsEngine.off($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME);
    eventsEngine.on($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME, (e) => {
      if (isMouseEvent(e) && e.which > 1) {
        e.preventDefault();
        return;
      }
      pointerDownAction({ event: e });
    });
    eventsEngine.on($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME, cellSelector, (e) => {
      const $cell = $(e.target as Element | null);
      this.cellClickAction?.(
        {
          event: e,
          cellElement: getPublicElement($cell),
          cellData: this.getCellData($cell),
        },
      );
    });

    if (this.documentPointerUpHandler) {
      eventsEngine.off(
        domAdapter.getDocument(),
        SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME,
        this.documentPointerUpHandler,
      );
    }
    this.documentPointerUpHandler = (): void => {
      if (this.isSelectionStartedOnCell && !this._disposed) {
        this.fireSelectionEndEvent();
        this.isSelectionStartedOnCell = false;
      }
    };
    eventsEngine.on(
      domAdapter.getDocument(),
      SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME,
      this.documentPointerUpHandler,
    );
  }

  private createWorkspaceOptionAction<K extends keyof WorkspaceOptionActionMap>(
    optionName: K,
    config?: ActionConfig,
  ): (args: WorkspaceOptionActionMap[K]) => void {
    return this._createActionByOption(optionName, config) as (
      args: WorkspaceOptionActionMap[K],
    ) => void;
  }

  private createCellClickAction(): void {
    this.cellClickAction = this.createWorkspaceOptionAction('onCellClick', {
      afterExecute: () => this.cellClickHandler(),
    });
  }

  private createSelectionChangedAction(): void {
    this.selectionChangedAction = this.createWorkspaceOptionAction('onSelectionChanged');
  }

  private createSelectionEndAction(): void {
    this.selectionEndAction = this.createWorkspaceOptionAction('onSelectionEnd');
  }

  private cellClickHandler(): void {
    if (this.showPopup) {
      delete this.showPopup;
      this.isSelectionStartedOnCell = false;
      this.handleSelectedCellsClick();
    }
  }

  private pointerDownHandler(e: { target: EventTarget | null; which?: number }): void {
    const $target = $(e.target as Element | null);

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

  private handleSelectedCellsClick(): void {
    const selectedCells = this.getSelectedCellsData();

    const firstCellData = selectedCells[0];
    const lastCellData = selectedCells[selectedCells.length - 1];

    const result: {
      startDate: Date;
      endDate: Date;
      startDateUTC: NormalizedCellData['startDateUTC'];
      endDateUTC: NormalizedCellData['endDateUTC'];
      allDay?: NormalizedCellData['allDay'];
    } = {
      startDate: firstCellData.startDate,
      endDate: lastCellData.endDate,
      startDateUTC: firstCellData.startDateUTC,
      endDateUTC: lastCellData.endDateUTC,
    };

    if (lastCellData.allDay !== undefined) {
      result.allDay = lastCellData.allDay;
    }

    this.option().onSelectedCellsClick(result, lastCellData.groups as GroupValues);
  }

  private attachContextMenuEvent(): void {
    this.createContextMenuAction();

    const cellSelector = `.${DATE_TABLE_CELL_CLASS},.${ALL_DAY_TABLE_CELL_CLASS}`;
    const $element = this.$element();
    const eventName = addNamespace(contextMenuEventName, this.NAME as string);

    eventsEngine.off($element, eventName, cellSelector);
    eventsEngine.on($element, eventName, cellSelector, this.contextMenuHandler.bind(this));
  }

  private contextMenuHandler(e: DxEvent): void {
    const $cell = $(e.target as Element | null);
    this.contextMenuAction?.(
      {
        event: e as CellContextMenuEvent['event'],
        cellElement: getPublicElement($cell),
        cellData: this.getCellData($cell),
      },
    );
    this.contextMenuHandled = true;
  }

  private createContextMenuAction(): void {
    this.contextMenuAction = this.createWorkspaceOptionAction('onCellContextMenu');
  }

  protected getGroupHeaderContainer(): dxElementWrapper | null | undefined {
    if (this.isVerticalGroupedWorkSpace()) {
      return this.$groupTable;
    }

    return this.$thead;
  }

  protected updateScrollable(): void {
    this.$dateTableScrollable.update();
    this.headerScrollable?.update();
    this.$sidebarScrollable?.update();
    this.updateHeaderPanelScrollbarPadding();
  }

  protected getTimePanelRowCount(): number {
    return this.getCellCountInDay();
  }

  protected getCellCountInDay(): number {
    const { hoursInterval, startDayHour, endDayHour } = this.option();

    return this.viewDataProvider.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  }

  private getTotalCellCount(groupCount: number): number {
    return this.groupedStrategy.getTotalCellCount(groupCount);
  }

  protected getTotalRowCount(groupCount: number, includeAllDayPanelRows?: boolean): number {
    let result = this.groupedStrategy.getTotalRowCount();

    if (includeAllDayPanelRows && this.isAllDayPanelVisible) {
      result += groupCount;
    }

    return result;
  }

  private getGroupIndex(rowIndex: number, columnIndex: number): number {
    return this.groupedStrategy.getGroupIndex(rowIndex, columnIndex);
  }

  calculateEndDate(startDate: Date): Date {
    const { viewDataGenerator } = this.viewDataProvider;

    return viewDataGenerator.calculateEndDate(
      startDate,
      viewDataGenerator.getInterval(this.option().hoursInterval),
      this.option().endDayHour,
    );
  }

  protected getGroupCount(): number {
    return this.resourceManager.groupCount();
  }

  protected attachTablesEvents(): void {
    const element = this.$element();

    this.attachDragEvents(element);
    this.attachPointerEvents(element);
  }

  private detachDragEvents(element: dxElementWrapper): void {
    eventsEngine.off(element, DragEventNames.ENTER);
    eventsEngine.off(element, DragEventNames.LEAVE);
    eventsEngine.off(element, DragEventNames.DROP);
  }

  private attachDragEvents(element: dxElementWrapper): void {
    if (this.option().newAppointments) {
      return;
    }

    this.detachDragEvents(element);

    const onDragEnter = (e: { target: Element }): void => {
      if (!this.preventDefaultDragging) {
        this.removeDroppableCellClass();
        $(e.target).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
      }
    };

    const removeClasses = (): void => {
      if (!this.preventDefaultDragging) {
        this.removeDroppableCellClass();
      }
    };

    const onCheckDropTarget = (
      target: Element,
      event: { pageX: number; pageY: number },
    ): boolean => !this.isOutsideScrollable(target, event);

    eventsEngine.on(
      element,
      DragEventNames.ENTER,
      DRAG_AND_DROP_SELECTOR,
      { checkDropTarget: onCheckDropTarget },
      // @ts-expect-error
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
        this.dragBehavior?.removeDroppableClasses();
      });
    });
  }

  private attachPointerEvents(element: dxElementWrapper): void {
    let isPointerDown = false;

    eventsEngine.off(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
    eventsEngine.off(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);

    eventsEngine.on(
      element,
      SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME,
      DRAG_AND_DROP_SELECTOR,
      (e: {
        type: string;
        target: Element;
        originalEvent: Event;
        which: number;
      }): void => {
        if ((
          isMouseEvent(e) || (e.originalEvent && isMouseEvent(e.originalEvent))
        ) && e.which === 1) {
          isPointerDown = true;
          this.$element().addClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
          eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
          eventsEngine.on(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME, () => {
            isPointerDown = false;
            this.$element().removeClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
          });
        }
      },
    );

    eventsEngine.on(
      element,
      SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME,
      DRAG_AND_DROP_SELECTOR,
      (e) => {
        if (isPointerDown && this.$dateTableScrollable) {
          e.preventDefault();
          e.stopPropagation();
          this.moveToCell($(e.target), true);
        }
      },
    );
  }

  protected getFormat(): string | ((date: Date) => string) {
    return abstract() as string;
  }

  getWorkArea(): dxElementWrapper {
    return this.$dateTableContainer;
  }

  getScrollable(): Scrollable {
    return this.$dateTableScrollable;
  }

  getScrollableScrollTop(): number {
    return this.$dateTableScrollable.scrollTop();
  }

  getGroupedScrollableScrollTop(allDay: boolean): number {
    return this.groupedStrategy.getScrollableScrollTop(allDay);
  }

  getScrollableScrollLeft(): number {
    return this.$dateTableScrollable.scrollLeft();
  }

  getScrollableOuterWidth(): number {
    return this.$dateTableScrollable.scrollWidth();
  }

  getScrollableContainer(): dxElementWrapper {
    return $(this.$dateTableScrollable.container());
  }

  getHeaderPanelHeight(): number | false {
    return this.$headerPanel && getOuterHeight(this.$headerPanel, true) as number;
  }

  getTimePanelWidth(): number {
    return this.$timePanel && getBoundingRect(this.$timePanel.get(0)).width as number;
  }

  getGroupTableWidth(): number {
    return this.$groupTable ? getOuterWidth(this.$groupTable) as number : 0;
  }

  getWorkSpaceLeftOffset(): number {
    return this.groupedStrategy.getLeftOffset();
  }

  protected getCellCoordinatesByIndex(index: number): CellPositionData {
    const columnIndex = Math.floor(index / this.getRowCount());
    const rowIndex = index - this.getRowCount() * columnIndex;

    return {
      columnIndex,
      rowIndex,
    };
  }

  protected getDateGenerationOptions(): ViewDateGenerationOptions {
    return {
      startDayHour: this.option().startDayHour,
      endDayHour: this.option().endDayHour,
      hoursInterval: this.option().hoursInterval,
      interval: this.viewDataProvider.viewDataGenerator?.getInterval(this.option().hoursInterval),
      intervalCount: this.option().intervalCount,
      startViewDate: this.getStartViewDate(),
      firstDayOfWeek: this.firstDayOfWeek(),
      skippedDays: this.option().skippedDays,
      viewOffset: 0,
      viewType: this.type,
    };
  }

  // TODO: refactor current time indicator
  protected getIntervalBetween(currentDate: Date, allDay: boolean): number {
    const firstViewDate = this.getStartViewDate();

    const startDayTime = this.option().startDayHour * HOUR_MS;
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

  protected getSkippedDaysCount(startDate: Date, days: number): number {
    return countSkippedDays(
      startDate,
      days,
      this.option().skippedDays,
    );
  }

  private getDaysOfInterval(fullInterval: number, startDayTime: number): number {
    return Math.floor((fullInterval + startDayTime) / DAY_MS);
  }

  protected updateIndex(index: number): number {
    return index * this.getRowCount();
  }

  getDroppableCell(): dxElementWrapper {
    return this.getDateTables().find(`.${DATE_TABLE_DROPPABLE_CELL_CLASS}`);
  }

  protected getWorkSpaceWidth(): number {
    return this.cache.memo('workspaceWidth', (): number => {
      if (this.needCreateCrossScrolling()) {
        return getBoundingRect(this.$dateTable.get(0)).width as number;
      }
      const totalWidth = getBoundingRect(this.$element().get(0)).width;
      const timePanelWidth = this.getTimePanelWidth();
      const groupTableWidth = this.getGroupTableWidth();

      return totalWidth - timePanelWidth - groupTableWidth;
    });
  }

  protected getCellElementByPosition(
    cellCoordinates: CellPositionData,
    groupIndex: number,
    inAllDayRow: boolean,
  ): dxElementWrapper {
    const indexes = this.groupedStrategy.prepareCellIndexes(
      cellCoordinates,
      groupIndex,
      inAllDayRow,
    );
    return this.domGetDateCell(indexes);
  }

  private domGetDateCell(position: CellPositionData): dxElementWrapper {
    return this.$dateTable
      .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
      .eq(position.rowIndex)
      .find(`td:not(.${VIRTUAL_CELL_CLASS})`)
      .eq(position.columnIndex);
  }

  private domGetAllDayPanelCell(columnIndex: number): dxElementWrapper {
    return this.$allDayPanel
      .find('tr').eq(0)
      .find('td').eq(columnIndex);
  }

  protected getCells(allDay?: boolean, direction?: string): dxElementWrapper {
    const cellClass = allDay ? ALL_DAY_TABLE_CELL_CLASS : DATE_TABLE_CELL_CLASS;
    if (direction === 'vertical') {
      let result: Element[] = [];
      for (let i = 1; ; i += 1) {
        const cells = this.$element().find(`tr .${cellClass}:nth-child(${i})`);
        if (!cells.length) break;
        result = result.concat(cells.toArray());
      }
      return $(result);
    }
    return this.$element().find(`.${cellClass}`);
  }

  private getFirstAndLastDataTableCell(): Element[] {
    const selector = this.isVirtualScrolling()
      ? `.${DATE_TABLE_CELL_CLASS}, .${VIRTUAL_CELL_CLASS}`
      : `.${DATE_TABLE_CELL_CLASS}`;

    const $cells = this.$element().find(selector);
    return [$cells.get(0), $cells.get(-1)];
  }

  private getAllCells(allDay: boolean): dxElementWrapper {
    if (this.isVerticalGroupedWorkSpace()) {
      return this.$dateTable.find(`td:not(.${VIRTUAL_CELL_CLASS})`);
    }

    const cellClass = allDay && this.supportAllDayRow()
      ? ALL_DAY_TABLE_CELL_CLASS
      : DATE_TABLE_CELL_CLASS;

    return this.$element().find(`.${cellClass}`);
  }

  protected setHorizontalGroupHeaderCellsHeight(): void {
    const { height } = getBoundingRect(this.$dateTable.get(0));
    setOuterHeight(this.$groupTable, height);
  }

  protected getGroupHeaderCells(): dxElementWrapper {
    return this.$element().find(`.${GROUP_HEADER_CLASS}`);
  }

  private getScrollCoordinates(
    date: Date,
    groupIndex?: number,
    allDay?: boolean,
  ): Coordinates | undefined {
    const currentDate = date || new Date(this.option().currentDate);

    const cell = this.viewDataProvider.findGlobalCellPosition(
      currentDate,
      groupIndex,
      allDay,
      true,
    );

    if (!cell) {
      return undefined;
    }

    currentDate.setHours(cell.cellData.startDate.getHours(), currentDate.getMinutes(), 0, 0);

    return this.virtualScrollingDispatcher.calculateCoordinatesByDataAndPosition(
      cell.cellData,
      cell.position,
      currentDate,
      isDateAndTimeView(this.type),
      this.viewDirection === 'vertical',
    );
  }

  private isOutsideScrollable(target: Element, event: { pageX: number; pageY: number }): boolean {
    const $dateTableScrollableElement = this.$dateTableScrollable.$element();
    const scrollableSize = getBoundingRect($dateTableScrollableElement.get(0));
    const window = getWindow();
    const isTargetInAllDayPanel = !$(target).closest($dateTableScrollableElement).length;
    const isOutsideHorizontalScrollable = event.pageX < scrollableSize.left
      || event.pageX > (scrollableSize.left + scrollableSize.width + (window.scrollX || 0));
    const isOutsideVerticalScrollable = event.pageY < scrollableSize.top
      || event.pageY > (scrollableSize.top + scrollableSize.height + (window.scrollY || 0));

    if (isTargetInAllDayPanel && !isOutsideHorizontalScrollable) {
      return false;
    }

    return isOutsideVerticalScrollable || isOutsideHorizontalScrollable;
  }

  supportAllDayRow(): boolean {
    return true;
  }

  keepOriginalHours(): boolean {
    return false;
  }

  private normalizeCellData(cellData: Partial<ViewCellData>): NormalizedCellData {
    const normalizedCellData: NormalizedCellData = {
      startDate: cellData.startDate ?? new Date(),
      endDate: cellData.endDate ?? new Date(),
      startDateUTC: cellData.startDate && this.timeZoneCalculator?.createDate(cellData.startDate, 'fromGrid'),
      endDateUTC: cellData.endDate && this.timeZoneCalculator?.createDate(cellData.endDate, 'fromGrid'),
      groups: cellData.groups,
      groupIndex: cellData.groupIndex,
      allDay: cellData.allDay,
    };

    return extend(true, {}, normalizedCellData) as NormalizedCellData;
  }

  private getSelectedCellsData(): NormalizedCellData[] {
    const selected = this.cellsSelectionState.getSelectedCells();

    return selected?.map(this.normalizeCellData.bind(this)) ?? [];
  }

  getCellData($cell: dxElementWrapper): NormalizedCellData {
    const cellData = this.getFullCellData($cell) ?? {};

    return this.normalizeCellData(cellData);
  }

  private getFullCellData($cell: dxElementWrapper): ViewCellData | undefined {
    const currentCell = $cell[0];
    if (currentCell) {
      return this.getDataByCell($cell);
    }

    return undefined;
  }

  private getDataByCell($cell: dxElementWrapper): ViewCellData | undefined {
    const rowIndex = $cell.parent().index() - this.virtualScrollingDispatcher.topVirtualRowsCount;
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;

    const { viewDataProvider } = this;
    const isAllDayCell = this.hasAllDayClass($cell);

    const cellData = viewDataProvider.getCellData(rowIndex, columnIndex, isAllDayCell);

    return cellData || undefined;
  }

  isGroupedByDate(): boolean {
    return this.option().groupByDate
      && this.isHorizontalGroupedWorkSpace()
      && this.getGroupCount() > 0;
  }

  // TODO: refactor current time indicator
  getCellIndexByDate(date: Date, inAllDayRow?: boolean): number {
    const { viewDataGenerator } = this.viewDataProvider;

    const timeInterval = inAllDayRow
      ? 24 * 60 * 60 * 1000
      : viewDataGenerator.getInterval(this.option().hoursInterval);
    const startViewDateOffset = getStartViewDateTimeOffset(
      this.getStartViewDate(),
      this.option().startDayHour,
    );
    const dateTimeStamp = this.getIntervalBetween(date, inAllDayRow ?? false) + startViewDateOffset;

    let index = Math.floor(dateTimeStamp / timeInterval);

    if (inAllDayRow) {
      index = this.updateIndex(index);
    }

    if (index < 0) {
      index = 0;
    }

    return index;
  }

  getDataByDroppableCell(): DroppableCellData {
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

  getDateRange(): Date[] {
    return [
      this.getStartViewDate(),
      this.getEndViewDateByEndDayHour(),
    ];
  }

  getCellMinWidth(): number {
    return DATE_TABLE_MIN_CELL_WIDTH;
  }

  // Mappings
  getCellWidth(): number {
    return getCellWidth(this.getDOMElementsMetaData());
  }

  getCellHeight(): number {
    return getCellHeight(this.getDOMElementsMetaData());
  }

  getAllDayHeight(): number {
    return getAllDayHeight(
      this.option().showAllDayPanel,
      this.isVerticalGroupedWorkSpace(),
      this.getDOMElementsMetaData(),
    );
  }

  getIndicatorOffset(): number {
    return 0;
  }

  getIndicationHeight(): number {
    return 0;
  }

  getIndicationWidth(): number {
    return 0;
  }

  getMaxAllowedPosition(groupIndex: number): number {
    return getMaxAllowedPosition(
      groupIndex,
      this.viewDataProvider,
      this.option().rtlEnabled,
      this.getDOMElementsMetaData(),
    );
  }

  getAllDayOffset(): number {
    return this.groupedStrategy.getAllDayOffset();
  }

  // NOTE: refactor leftIndex calculation
  getCellIndexByCoordinates(coordinates: Coordinates, allDay?: boolean): number {
    const { horizontalScrollingState, verticalScrollingState } = this.virtualScrollingDispatcher;

    const cellCount = horizontalScrollingState?.itemCount
      ?? this.getTotalCellCount(this.getGroupCount());

    const cellWidth = this.getCellWidth();
    const cellHeight = allDay ? this.getAllDayHeight() : this.getCellHeight();

    const leftCoordinateOffset = horizontalScrollingState?.virtualItemSizeBefore ?? 0;
    const topCoordinateOffset = verticalScrollingState?.virtualItemSizeBefore ?? 0;

    const topIndex = Math.floor(
      Math.floor(coordinates.top - topCoordinateOffset) / Math.floor(cellHeight),
    );
    let leftIndex = (coordinates.left - leftCoordinateOffset) / cellWidth;
    leftIndex = Math.floor(leftIndex + CELL_INDEX_CALCULATION_EPSILON);

    if (this.isRTL()) {
      leftIndex = cellCount - leftIndex - 1;
    }

    return cellCount * topIndex + leftIndex;
  }

  getStartViewDate(): Date {
    return this.viewDataProvider.getStartViewDate();
  }

  getEndViewDate(): Date {
    return this.viewDataProvider.getLastCellEndDate();
  }

  getEndViewDateByEndDayHour(): Date {
    return this.viewDataProvider.getLastViewDateByEndDayHour(this.option().endDayHour);
  }

  getCellDuration(): number {
    return getCellDuration(
      this.type,
      this.option().startDayHour,
      this.option().endDayHour,
      this.option().hoursInterval,
    );
  }

  getIntervalDuration(allDay: boolean): number {
    return allDay
      ? toMs('day')
      : this.getCellDuration();
  }

  getVisibleDayDuration(): number {
    const { startDayHour, endDayHour, hoursInterval } = this.option();

    return this.viewDataProvider.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  getGroupBounds(
    coordinates: WorkspaceCoordinates,
  ): GroupBoundsOffset | undefined {
    const groupBounds = this.groupedStrategy instanceof VerticalGroupedStrategy
      ? this.getGroupBoundsVertical(coordinates.groupIndex ?? 0)
      : this.getGroupBoundsHorizontal(coordinates);

    return this.isRTL() && groupBounds
      ? this.getGroupBoundsRtlCorrection(groupBounds)
      : groupBounds;
  }

  getGroupBoundsVertical(groupIndex: number): GroupBoundsOffset | undefined {
    const $firstAndLastCells = this.getFirstAndLastDataTableCell();
    if (this.groupedStrategy instanceof VerticalGroupedStrategy) {
      return this.groupedStrategy.getGroupBoundsOffset(groupIndex, [
        $firstAndLastCells[0], $firstAndLastCells[1],
      ]);
    }
    return undefined;
  }

  getGroupBoundsHorizontal(
    coordinates: WorkspaceCoordinates,
  ): GroupBoundsOffset | undefined {
    const cellCount = this.getCellCount();
    const $cells = this.getCells();
    const cellWidth = this.getCellWidth();

    const { groupedDataMap } = this.viewDataProvider;
    if (this.groupedStrategy instanceof HorizontalGroupedStrategy) {
      return this.groupedStrategy
        .getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap);
    }
    return undefined;
  }

  getGroupBoundsRtlCorrection(groupBounds: GroupBoundsOffset): GroupBoundsOffset {
    const cellWidth = this.getCellWidth();

    return {
      ...groupBounds,
      left: groupBounds.right - cellWidth * 2,
      right: groupBounds.left + cellWidth * 2,
    };
  }

  needRecalculateResizableArea(): boolean {
    return this.isVerticalGroupedWorkSpace() && this.getScrollable().scrollTop() !== 0;
  }

  getCellByCoordinates(
    coordinates: Coordinates,
    allDay: boolean,
  ): dxElementWrapper {
    const $cells = this.getCells(allDay);
    const cellIndex = this.getCellIndexByCoordinates(coordinates, allDay);

    return $cells.eq(cellIndex);
  }

  // TODO - this method is only used by the Agenda
  getVisibleBounds(): {
    top: { hours: number; minutes: number };
    bottom: { hours: number; minutes: number };
  } {
    const $scrollable = this.getScrollable().$element();
    const cellHeight = this.getCellHeight();
    const scrolledCellCount = this.getScrollableScrollTop() / cellHeight;
    const totalCellCount = scrolledCellCount + getHeight($scrollable) / cellHeight;

    const result = {
      top: {
        hours: Math.floor(scrolledCellCount * this.option().hoursInterval)
          + this.option().startDayHour,
        minutes: scrolledCellCount % 2 ? 30 : 0,
      },
      bottom: {
        hours: Math.floor(totalCellCount * this.option().hoursInterval)
          + this.option().startDayHour,
        minutes: Math.floor(totalCellCount) % 2 ? 30 : 0,
      },
    };

    return result;
  }

  updateScrollPosition(date: Date, appointmentGroupValues?: GroupValues, allDay = false): void {
    const newDate = this.timeZoneCalculator?.createDate(date, 'toGrid') ?? date;
    const inAllDayRow = allDay && this.isAllDayPanelVisible;

    if (this.needUpdateScrollPosition(newDate, appointmentGroupValues, inAllDayRow)) {
      this.scrollTo(newDate, appointmentGroupValues, inAllDayRow, false);
    }
  }

  needUpdateScrollPosition(
    date: Date,
    appointmentGroupValues?: GroupValues,
    inAllDayRow = false,
  ): boolean {
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

  private getCellsInViewport(inAllDayRow: boolean): dxElementWrapper[] {
    const $scrollable = this.getScrollable().$element();
    const cellHeight = this.getCellHeight();
    const cellWidth = this.getCellWidth();
    const totalColumnCount = this.getTotalCellCount(this.getGroupCount());
    const scrollableScrollTop = this.getScrollableScrollTop();
    const scrollableScrollLeft = this.getScrollableScrollLeft();

    const fullScrolledRowCount = scrollableScrollTop / cellHeight
      - this.virtualScrollingDispatcher.topVirtualRowsCount;

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
    const result: dxElementWrapper[] = [];

    $cells.toArray().forEach((_, index) => {
      const $cell = $cells.eq(index);
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

  scrollTo(date: Date, groupValues?: RawGroupValues | GroupValues, allDay = false, throwWarning = true, align: 'start' | 'center' = 'center'): void {
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
    const offset = this.option().rtlEnabled
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

    if (this.option().templatesRenderAsynchronously) {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => {
        scrollable.scrollBy({ left, top });
      });
    } else {
      scrollable.scrollBy({ left, top });
    }
  }

  private isValidScrollDate(date: Date, throwWarning = true): boolean {
    const { viewOffset } = this.option();
    const min = new Date(this.getStartViewDate().getTime() + viewOffset);
    const max = new Date(this.getEndViewDate().getTime() + viewOffset);

    if (date < min || date > max) {
      if (throwWarning) {
        errors.log('W1008', date);
      }
      return false;
    }

    return true;
  }

  needApplyCollectorOffset(): boolean {
    return false;
  }

  removeDroppableCellClass($cellElement?: dxElementWrapper): void {
    const $cell = $cellElement ?? this.getDroppableCell();
    $cell?.removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
  }

  private getCoordinatesByCell($cell: dxElementWrapper): CellPositionData {
    const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;
    let rowIndex = $cell.parent().index();
    const isAllDayCell = this.hasAllDayClass($cell);
    const isVerticalGrouping = this.isVerticalGroupedWorkSpace();

    if (!(isAllDayCell && !isVerticalGrouping)) {
      rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
    }

    return { rowIndex, columnIndex };
  }

  private isShowAllDayPanel(): boolean {
    return this.option().showAllDayPanel;
  }

  protected getTimePanelCells(): dxElementWrapper {
    return this.$element().find(`.${TIME_PANEL_CELL_CLASS}`);
  }

  protected getRDateTableProps(): Record<string, unknown> {
    return {
      viewData: this.viewDataProvider.viewData,
      viewContext: this.getR1ComponentsViewContext(),
      dataCellTemplate: this.option().dataCellTemplate,
      addDateTableClass: !this.option().crossScrollingEnabled || this.isVirtualScrolling(),
      groupOrientation: this.option().groupOrientation,
      addVerticalSizesClassToRows: false,
    };
  }

  protected getR1ComponentsViewContext(): ViewContext {
    return {
      view: {
        type: this.type,
      },
      crossScrollingEnabled: Boolean(this.option().crossScrollingEnabled),
    };
  }

  private updateSelectedCellDataOption(
    selectedCellData: NormalizedCellData[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nextFocusedCell?: dxElementWrapper,
  ): void {
    this.option().selectedCellData = selectedCellData as ViewCellData[];
    this.selectionChangedAction?.({
      selectedCellData: selectedCellData as ViewCellData[],
    });
  }

  private fireSelectionEndEvent(): void {
    const selectedCellData = this.option().selectedCellData ?? [];
    if (selectedCellData.length > 0 && this.selectionEndAction) {
      this.selectionEndAction({ selectedCellData });
    }
  }

  private getCellByData(cellData: NormalizedCellData | ViewCellData): dxElementWrapper | undefined {
    const { allDay } = cellData;
    const position = this.viewDataProvider.findCellPositionInMap(
      {
        startDate: cellData.startDate,
        allDay: cellData.allDay,
        groupIndex: cellData.groupIndex,
        index: cellData.index ?? 0,
      },
    );

    if (!position) {
      return undefined;
    }

    return allDay && !this.isVerticalGroupedWorkSpace()
      ? this.domGetAllDayPanelCell(position.columnIndex)
      : this.domGetDateCell(position);
  }

  // Must replace all DOM manipulations
  getDOMElementsMetaData(): DOMMetaData {
    return this.cache.memo('cellElementsMeta', () => ({
      dateTableCellsMeta: this.getDateTableDOMElementsInfo(),
      allDayPanelCellsMeta: this.getAllDayPanelDOMElementsInfo(),
    }));
  }

  getPanelDOMSize(panelName: PanelName): RealSize {
    const getElementSize = (element: Element | undefined): RealSize => {
      const { width, height } = getBoundingRect(element) as Pick<DOMRect, 'width' | 'height'>;
      return { width, height };
    };

    return panelName === 'allDayPanel'
      ? this.cache.memo('allDayPanelSize', () => getElementSize(this.$allDayPanel.get(0)))
      : this.cache.memo('regularPanelSize', () => getElementSize(this.getDateTable().get(0)));
  }

  getCollectorDimension(isCollectorCompact: boolean, panelName: PanelName): CollectorCSS {
    return this.cache.memo(`collectorSize-${panelName}`, () => CompactAppointmentsHelper.measureCollectorDimensions(
      panelName === 'allDayPanel' ? this.getAllDayContainer() : this.getFixedContainer(),
      isCollectorCompact,
    ));
  }

  private getDateTableDOMElementsInfo(): CellRect[][] {
    const dateTableCells = this.getAllCells(false);
    if (!dateTableCells.length || !hasWindow()) {
      return [[{
        top: 0, left: 0, width: 0, height: 0,
      }]];
    }

    const dateTable = this.getDateTable();
    // We should use getBoundingClientRect in renovation
    const dateTableRect = getBoundingRect(dateTable.get(0));

    const columnsCount = this.viewDataProvider.getColumnsCount();

    const result: CellRect[][] = [];

    dateTableCells.toArray().forEach((cell, index) => {
      const rowIndex = Math.floor(index / columnsCount);

      if (result.length === rowIndex) {
        result.push([]);
      }

      this.addCellMetaData(result[rowIndex], cell, dateTableRect);
    });

    return result;
  }

  private getAllDayPanelDOMElementsInfo(): CellRect[] {
    const result = [];

    if (this.isAllDayPanelVisible && !this.isVerticalGroupedWorkSpace() && hasWindow()) {
      const allDayCells = this.getAllCells(true);

      if (!allDayCells.length) {
        return [{
          top: 0, left: 0, width: 0, height: 0,
        }];
      }

      const allDayAppointmentContainer = this.$allDayPanel;
      const allDayPanelRect = getBoundingRect(allDayAppointmentContainer.get(0));

      allDayCells.toArray().forEach((cell) => {
        this.addCellMetaData(result, cell, allDayPanelRect);
      });
    }

    return result;
  }

  private addCellMetaData(
    cellMetaDataArray: CellRect[],
    cell: Element,
    parentRect: Coordinates,
  ): void {
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
  }: RenderComponentOptions = DEFAULT_WORKSPACE_RENDER_OPTIONS.renderComponents): void {
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

  renderRDateTable(): void {
    this.renderRenovatedComponent(
      this.$dateTable,
      DateTableComponent,
      'renovatedDateTable',
      this.getRDateTableProps(),
    );
  }

  renderRGroupPanel(): void {
    const options = {
      viewContext: this.getR1ComponentsViewContext(),
      groups: this.option().groups,
      groupOrientation: this.option().groupOrientation,
      groupByDate: this.isGroupedByDate(),
      resourceCellTemplate: this.option().resourceCellTemplate,
      className: this.verticalGroupTableClass,
      groupPanelData: this.viewDataProvider.getGroupPanelData(
        this.generateRenderOptions(),
      ),
    };

    if (this.option().groups?.length) {
      this.attachGroupCountClass();
      const $groupHeaderContainer = this.getGroupHeaderContainer();
      if ($groupHeaderContainer) {
        this.renderRenovatedComponent(
          $groupHeaderContainer,
          GroupPanelComponent,
          'renovatedGroupPanel',
          options,
        );
      }
    } else {
      this.detachGroupCountClass();
    }
  }

  protected renderRenovatedComponent(
    parentElement: dxElementWrapper,
    componentClass: unknown,
    componentName: string,
    viewModel: Record<string, unknown>,
  ): void {
    const host = this as unknown as Record<string, unknown>;
    let component = host[componentName] as RenovationWidget | undefined;
    if (!component) {
      const container = getPublicElement(parentElement);
      const createFn = host._createComponent as CreateRenovationComponentFn;
      component = createFn.call(this, container, componentClass, viewModel);
      host[componentName] = component;
    } else {
      const $element = component.$element();
      const elementStyle = ($element.get(0) as HTMLElement).style;
      const { height } = elementStyle;
      const { width } = elementStyle;

      component.option(viewModel);

      if (height) {
        setHeight($element, height);
      }
      if (width) {
        setWidth($element, width);
      }
    }
  }

  renderRAllDayPanel(): void {
    const visible = this.isAllDayPanelVisible && !this.isGroupedAllDayPanel();

    if (visible) {
      this.updateAllDayVisibility();

      const options = {
        viewData: this.viewDataProvider.viewData,
        viewContext: this.getR1ComponentsViewContext(),
        dataCellTemplate: this.option().dataCellTemplate,
        startCellIndex: 0,
        ...(this.virtualScrollingDispatcher.horizontalVirtualScrolling?.getRenderState() ?? {}),
      };

      if (this.$allDayTable) {
        this.renderRenovatedComponent(this.$allDayTable, AllDayTableComponent, 'renovatedAllDayPanel', options);
      }
      this.renderRenovatedComponent(this.$allDayTitle, AllDayPanelTitleComponent, 'renovatedAllDayPanelTitle', {});
    }

    this.updateAllDayVisibility();
    this.updateScrollable();
  }

  renderRTimeTable(): void {
    this.renderRenovatedComponent(
      this.$timePanel,
      TimePanelComponent,
      'renovatedTimePanel',
      {
        viewContext: this.getR1ComponentsViewContext(),
        timePanelData: this.viewDataProvider.timePanelData,
        timeCellTemplate: this.option().timeCellTemplate,
        groupOrientation: this.option().groupOrientation,
      },
    );
  }

  renderRHeaderPanel(isRenderDateHeader = true): void {
    if (this.option().groups?.length) {
      this.attachGroupCountClass();
    } else {
      this.detachGroupCountClass();
    }

    this.renderRenovatedComponent(
      this.$thead,
      this.renovatedHeaderPanelComponent,
      'renovatedHeaderPanel',
      {
        viewContext: this.getR1ComponentsViewContext(),
        dateHeaderData: this.viewDataProvider.dateHeaderData,
        groupPanelData: this.viewDataProvider.getGroupPanelData(
          this.generateRenderOptions(),
        ),
        dateCellTemplate: this.option().dateCellTemplate,
        timeCellTemplate: this.option().timeCellTemplate,
        groups: this.option().groups,
        groupByDate: this.isGroupedByDate(),
        groupOrientation: this.option().groupOrientation,
        resourceCellTemplate: this.option().resourceCellTemplate,
        isRenderDateHeader,
      },
    );
  }

  public getCellFromDragTarget($dragTarget: dxElementWrapper): dxElementWrapper | null {
    if ($dragTarget.length === 0) {
      return null;
    }

    const point = this.getPointFromDragTarget($dragTarget);
    // @ts-expect-error
    const elements = domAdapter.elementsFromPoint(point.x, point.y) as Element[];

    const cell = elements.find((element) => element.classList.contains('dx-scheduler-date-table-cell')
      || element.classList.contains('dx-scheduler-all-day-table-cell'));

    return cell ? $(cell) : null;
  }

  private getPointFromDragTarget($dragTarget: dxElementWrapper): TranslateVector {
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
  initDragBehavior(scheduler: { element: () => Element }): void {
    if (!this.dragBehavior && scheduler) {
      this.dragBehavior = new AppointmentDragBehavior(scheduler);

      const $rootElement = $(scheduler.element());

      this.createDragBehavior(this.getWorkArea(), $rootElement);
      if (!this.isVerticalGroupedWorkSpace()) {
        this.createDragBehavior(this.$allDayPanel, $rootElement);
      }
    }
  }

  private createDragBehavior(
    $targetElement: dxElementWrapper,
    $rootElement: dxElementWrapper,
  ): void {
    const getItemData = (
      itemElement: Element | dxElementWrapper,
      appointments: AppointmentsList,
    ): unknown => appointments._getItemData(itemElement);

    const getItemSettings = (
      $itemElement: dxElementWrapper,
    ): AppointmentViewModelPlain => (
      $itemElement.data(APPOINTMENT_SETTINGS_KEY) as unknown as AppointmentViewModelPlain);

    const options = {
      getItemData,
      getItemSettings,
    };

    this.createDragBehaviorBase($targetElement, $rootElement, options);
  }

  protected createDragBehaviorBase(
    targetElement: dxElementWrapper,
    rootElement: dxElementWrapper,
    options: DragBehaviorOptions,
  ): void {
    const container = this.$element().find(`.${FIXED_CONTAINER_CLASS}`);

    const disableDefaultDragging = (): void => {
      if (!this.isDefaultDraggingMode) {
        this.preventDefaultDragging = true;
      }
    };

    const enableDefaultDragging = (): void => {
      if (!this.isDefaultDraggingMode) {
        this.preventDefaultDragging = false;
      }
    };

    if (!this.dragBehavior) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
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

  protected isRenderHeaderPanelEmptyCell(): boolean {
    return this.isVerticalGroupedWorkSpace();
  }

  _dispose(): void {
    super._dispose();

    if (this.documentPointerUpHandler) {
      eventsEngine.off(
        domAdapter.getDocument(),
        SCHEDULER_TABLE_DXPOINTERUP_EVENT_NAME,
        this.documentPointerUpHandler,
      );
      this.documentPointerUpHandler = undefined;
    }
    this.virtualScrollingDispatcher.dispose();
  }

  _getDefaultOptions(): WorkspaceOptionsInternal {
    const defaultOptions: WorkspaceOptionsInternal = {
      ...super._getDefaultOptions(),
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
      onCellClick: undefined,
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
      draggingMode: 'outlook',
      onScrollEnd: noop,
      getHeaderHeight: undefined,
      renderAppointments: noop,
      onShowAllDayPanel: noop,
      onSelectedCellsClick: noop,
      timeZoneCalculator: undefined,
      schedulerHeight: undefined,
      schedulerWidth: undefined,
    };

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
        super._optionChanged(args);
    }
  }

  updateShowAllDayPanel(): void {
    const isHiddenAllDayPanel = this.option().allDayPanelMode === 'hidden';
    this.option().onShowAllDayPanel(!isHiddenAllDayPanel);
  }

  private getVirtualScrollingDispatcherOptions(): VirtualScrollingDispatcherOptions {
    return {
      getCellHeight: this.getCellHeight.bind(this),
      getCellWidth: this.getCellWidth.bind(this),
      getCellMinWidth: this.getCellMinWidth.bind(this),
      isRTL: this.isRTL.bind(this),
      getSchedulerHeight: () => this.option().schedulerHeight,
      getSchedulerWidth: () => this.option().schedulerWidth,
      getViewHeight: () => getHeight(this.$element()) as number,
      getViewWidth: () => getWidth(this.$element()) as number,
      getWindowHeight: () => getWindow().innerHeight,
      getWindowWidth: () => getWindow().innerWidth,
      getScrolling: (): WorkspaceOptionsInternal['scrolling'] => this.option().scrolling,
      getScrollableOuterWidth: this.getScrollableOuterWidth.bind(this),
      createAction: this._createAction.bind(this),
      updateRender: this.updateRender.bind(this),
      updateGrid: this.updateGrid.bind(this),
      getGroupCount: this.getGroupCount.bind(this),
      isVerticalGrouping: this.isVerticalGroupedWorkSpace.bind(this),
      getTotalRowCount: this.getTotalRowCount.bind(this),
      getTotalCellCount: this.getTotalCellCount.bind(this),
    };
  }

  protected cleanWorkSpace(): void {
    this.cleanView();
    this.toggleGroupedClass();
    this.toggleWorkSpaceWithOddCells();

    this.virtualScrollingDispatcher.updateDimensions(true);
    this.renderView();
    if (this.option().crossScrollingEnabled) {
      this.setTableSizes();
    }
    this.cache.clear();
  }

  _init(): void {
    this.scrollSync = {};
    this.viewDataProviderValue = null;
    this.cellsSelectionStateValue = null;

    super._init();

    this.initGrouping();

    this.toggleHorizontalScrollClass();
    this.toggleWorkSpaceCountClass();
    this.toggleGroupByDateClass();
    this.toggleWorkSpaceWithOddCells();

    this.$element()
      .addClass(COMPONENT_CLASS)
      .addClass(this.getElementClass());
  }

  private initPositionHelper(): void {
    this.positionHelper = new PositionHelper({
      viewDataProvider: this.viewDataProvider,
      isGroupedByDate: this.isGroupedByDate(),
      rtlEnabled: this.option().rtlEnabled,
      isVerticalGrouping: this.isVerticalGroupedWorkSpace(),
      groupCount: this.getGroupCount(),
      isVirtualScrolling: this.isVirtualScrolling(),
      getDOMMetaDataCallback: this.getDOMElementsMetaData.bind(this),
    });
  }

  private initGrouping(): void {
    this.initGroupedStrategy();
    this.toggleGroupingDirectionClass();
    this.toggleGroupByDateClass();
  }

  isVerticalOrientation(): boolean {
    const orientation = this.option().groups?.length
      ? this.option().groupOrientation
      : this.getDefaultGroupStrategy();

    return orientation === 'vertical';
  }

  private initGroupedStrategy(): void {
    const Strategy = this.isVerticalOrientation()
      ? VerticalGroupedStrategy
      : HorizontalGroupedStrategy;

    this.groupedStrategy = new Strategy(this.createGroupedStrategyConfig());
  }

  private createGroupedStrategyConfig(): GroupedStrategyConfig {
    return {
      getRowCount: () => this.getRowCount(),
      getCellCount: () => this.getCellCount(),
      getGroupCount: () => this.getGroupCount(),
      getCellHeight: () => this.getCellHeight(),
      getCellWidth: () => this.getCellWidth(),
      getTimePanelWidth: () => this.getTimePanelWidth(),
      getGroupTableWidth: () => this.getGroupTableWidth(),
      getAllDayHeight: () => this.getAllDayHeight(),
      getWorkSpaceWidth: () => this.getWorkSpaceWidth(),
      getWorkSpaceLeftOffset: () => this.getWorkSpaceLeftOffset(),
      getIndicatorOffset: () => this.getIndicatorOffset(),
      getIndicationHeight: () => this.getIndicationHeight(),
      getIndicationWidth: () => this.getIndicationWidth(),
      getScrollableScrollTop: () => this.getScrollable().scrollTop(),
      getScrollableContentElement: () => this.getScrollable().$content().get(0),
      getElement: () => this.$element().get(0),
      getHeaderPanelContainerElement: () => this.$headerPanelContainer.get(0),
      getCellIndexByCoordinates: (coordinates) => this.getCellIndexByCoordinates(coordinates),
      supportAllDayRow: () => this.supportAllDayRow(),
      isGroupedByDate: () => this.isGroupedByDate(),
      showAllDayPanel: () => this.option().showAllDayPanel,
      startDayHour: () => this.option().startDayHour,
      endDayHour: () => this.option().endDayHour,
      hoursInterval: () => this.option().hoursInterval,
      crossScrollingEnabled: () => this.option().crossScrollingEnabled,
      rtlEnabled: () => this.option().rtlEnabled,
      getHeaderHeight: () => this.option().getHeaderHeight?.() ?? 0,
    };
  }

  protected getDefaultGroupStrategy(): GroupOrientation {
    return 'horizontal';
  }

  protected toggleHorizontalScrollClass(): void {
    this.$element().toggleClass(
      WORKSPACE_WITH_BOTH_SCROLLS_CLASS,
      this.option().crossScrollingEnabled,
    );
  }

  private toggleGroupByDateClass(): void {
    this.$element().toggleClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS, this.isGroupedByDate());
  }

  private toggleWorkSpaceCountClass(): void {
    this.$element().toggleClass(WORKSPACE_WITH_COUNT_CLASS, this.isWorkSpaceWithCount());
  }

  protected toggleWorkSpaceWithOddCells(): void {
    this.$element().toggleClass(WORKSPACE_WITH_ODD_CELLS_CLASS, this.isWorkspaceWithOddCells());
  }

  protected toggleGroupingDirectionClass(): void {
    this.$element().toggleClass(
      VERTICAL_GROUPED_WORKSPACE_CLASS,
      this.isVerticalGroupedWorkSpace(),
    );
  }

  protected getDateTableCellClass(rowIndex?: number, columnIndex?: number): string {
    const cellClass = `${DATE_TABLE_CELL_CLASS} ${HORIZONTAL_SIZES_CLASS} ${VERTICAL_SIZES_CLASS}`;

    if (rowIndex === undefined && columnIndex === undefined) {
      return cellClass;
    }

    return this.groupedStrategy
      .addAdditionalGroupCellClasses(
        cellClass,
        (columnIndex ?? 0) + 1,
        rowIndex ?? 0,
        columnIndex ?? 0,
      );
  }

  protected getGroupHeaderClass(i?: number): string {
    const cellClass = GROUP_HEADER_CLASS;

    if (i === undefined) {
      return cellClass;
    }

    return this.groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1, 0, 0);
  }

  protected initWorkSpaceUnits(): void {
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

  private initAllDayPanelElements(): void {
    this.allDayTables = [];
  }

  private initDateTableScrollable(): void {
    const $dateTableScrollable = $('<div>').addClass(SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS);

    this.$dateTableScrollable = this._createComponent(
      $dateTableScrollable,
      Scrollable,
      this.dateTableScrollableConfig(),
    );
    this.scrollSync.dateTable = getMemoizeScrollTo(() => this.$dateTableScrollable);
  }

  protected createWorkSpaceElements(): void {
    if (this.option().crossScrollingEnabled) {
      this.createWorkSpaceScrollableElements();
    } else {
      this.createWorkSpaceStaticElements();
    }
  }

  protected createWorkSpaceStaticElements(): void {
    this.$dateTableContainer.append(this.$dateTable);

    if (this.isVerticalGroupedWorkSpace()) {
      this.$dateTableContainer.append(this.$allDayContainer);
      this.$dateTableScrollableContent.append(
        [this.$groupTable,
          this.$timePanel,
          this.$dateTableContainer].filter(Boolean) as dxElementWrapper[],
      );
      this.$dateTableScrollable.$content().append(
        this.$dateTableScrollableContent,
      );

      this.$headerTablesContainer.append(this.$headerPanel);
    } else {
      this.$dateTableScrollableContent.append(
        [this.$timePanel, this.$dateTableContainer],
      );
      this.$dateTableScrollable.$content().append(this.$dateTableScrollableContent);

      this.$headerTablesContainer.append([this.$headerPanel, this.$allDayPanel]);
      this.$allDayPanel.append(
        [this.$allDayContainer, this.$allDayTable].filter(Boolean) as dxElementWrapper[],
      );
    }

    this.appendHeaderPanelEmptyCellIfNecessary();
    this.$headerPanelContainer.append(this.$headerTablesContainer);

    this.$element()
      .append(this.$fixedContainer)
      .append(this.$headerPanelContainer)
      .append(this.$dateTableScrollable.$element());
  }

  protected createWorkSpaceScrollableElements(): void {
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
      this.$sidebarScrollableContent.append(
        [this.$groupTable, this.$timePanel].filter(Boolean) as dxElementWrapper[],
      );
    } else {
      this.headerScrollable.$content().append(this.$allDayPanel);
      this.$allDayPanel.append(
        [this.$allDayContainer, this.$allDayTable].filter(Boolean) as dxElementWrapper[],
      );
      this.$sidebarScrollableContent.append(this.$timePanel);
    }

    this.$sidebarScrollable.$content().append(this.$sidebarScrollableContent);
  }

  private appendHeaderPanelEmptyCellIfNecessary(): void {
    if (this.isRenderHeaderPanelEmptyCell()) {
      this.$headerPanelContainer.append(this.$headerPanelEmptyCell);
    }
  }

  private createHeaderScrollable(): void {
    const $headerScrollable = $('<div>')
      .addClass(SCHEDULER_HEADER_SCROLLABLE_CLASS)
      .appendTo(this.$headerTablesContainer);

    this.headerScrollable = this._createComponent(
      $headerScrollable,
      Scrollable,
      this.headerScrollableConfig(),
    );
    this.scrollSync.header = getMemoizeScrollTo(() => this.headerScrollable);
  }

  private createSidebarScrollable(): void {
    const $timePanelScrollable = $('<div>')
      .addClass(SCHEDULER_SIDEBAR_SCROLLABLE_CLASS)
      .appendTo(this.$flexContainer);

    this.$sidebarScrollable = this._createComponent($timePanelScrollable, Scrollable, {
      useKeyboard: false,
      showScrollbar: 'never',
      direction: 'vertical',
      useNative: false,
      updateManually: true,
      bounceEnabled: false,
      onScroll: (event) => {
        this.scrollSync.dateTable?.({ top: event.scrollOffset.top });
      },
    });
    this.scrollSync.sidebar = getMemoizeScrollTo(() => this.$sidebarScrollable);
  }

  private attachTableClasses(): void {
    this.addTableClass(this.$dateTable, DATE_TABLE_CLASS);

    if (this.isVerticalGroupedWorkSpace()) {
      const groupCount = this.getGroupCount();

      for (let i = 0; i < groupCount; i += 1) {
        this.addTableClass(this.allDayTables[i], ALL_DAY_TABLE_CLASS);
      }
    }
  }

  private attachHeaderTableClasses(): void {
    this.addTableClass(this.$headerPanel, HEADER_PANEL_CLASS);
  }

  private addTableClass($el: dxElementWrapper | undefined, className: string): void {
    if ($el && !$el.hasClass(className)) {
      $el.addClass(className);
    }
  }

  _initMarkup(): void {
    this.cache.clear();

    this.initWorkSpaceUnits();

    this.initVirtualScrolling();

    this.initDateTableScrollable();

    this.createWorkSpaceElements();

    super._initMarkup();

    if (!this.option().crossScrollingEnabled) {
      this.attachTableClasses();
      this.attachHeaderTableClasses();
    }

    this.toggleGroupedClass();

    this.renderView();
    this.attachEvents();
  }

  _render(): void {
    super._render();
    this.renderDateTimeIndication();
    this.setIndicationUpdateInterval();
  }

  private toggleGroupedClass(): void {
    this.$element().toggleClass(GROUPED_WORKSPACE_CLASS, this.getGroupCount() > 0);
  }

  protected renderView(): void {
    if (this.isVerticalGroupedWorkSpace()) {
      this.renderRGroupPanel();
    }

    this.renderWorkSpace();
    this.virtualScrollingDispatcher.updateDimensions();

    this.updateGroupTableHeight();
    this.updateHeaderEmptyCellWidth();

    this.shader = new VerticalShader(this);
  }

  updateCellsSelection(): void {
    const renderOptions = this.generateRenderOptions();
    this.viewDataProvider.updateViewData(renderOptions);
    this.renderRWorkSpace({
      timePanel: true,
      dateTable: true,
      allDayPanel: true,
    });
  }

  protected renderDateTimeIndication(): void { return noop(); }

  protected renderCurrentDateTimeLineAndShader(): void { return noop(); }

  protected renderCurrentDateTimeIndication(): void { return noop(); }

  protected setIndicationUpdateInterval(): void { return noop(); }

  protected detachGroupCountClass(): void {
    VERTICAL_GROUP_COUNT_CLASSES.forEach((className) => {
      this.$element().removeClass(className);
    });
  }

  protected attachGroupCountClass(): void {
    const className = this.groupedStrategy.getGroupCountClass(this.option().groups);

    if (className) {
      this.$element().addClass(className);
    }
  }

  protected getDateHeaderTemplate(): TemplateBase | null | undefined {
    return this.option().dateCellTemplate;
  }

  protected updateAllDayVisibility(): void {
    this.$element().toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, this.isShowAllDayPanel());
    this.updateAllDayExpansion();
  }

  private updateAllDayExpansion(): void {
    const isExpanded = !this.option().allDayExpanded && this.isShowAllDayPanel();

    this.cache.clear();
    this.$element().toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, isExpanded);
  }

  private getDateTables(): dxElementWrapper {
    return this.$allDayTable
      ? this.$dateTable.add(this.$allDayTable)
      : this.$dateTable;
  }

  private getDateTable(): dxElementWrapper {
    return this.$dateTable;
  }

  private removeAllDayElements(): void {
    this.$allDayTable?.remove();
    this.$allDayTitle?.remove();
  }

  protected cleanView(): void {
    this.cache.clear();
    this.cleanTableWidths();
    this.cellsSelectionState.clearSelectedAndFocusedCells();

    this.isCellClick = false;
    this.showPopup = false;
    this.interval = undefined;
    this.isSelectionStartedOnCell = false;

    this.shader?.clean();
  }

  _clean(): void {
    eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
    this.disposeRenovatedComponents();

    super._clean();
  }

  private cleanTableWidths(): void {
    this.$headerPanel.css('width', '');
    this.$dateTable.css('width', '');
    this.$allDayTable?.css('width', '');
  }

  private disposeRenovatedComponents(): void {
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

  getGroupedStrategy(): HorizontalGroupedStrategy | VerticalGroupedStrategy {
    return this.groupedStrategy;
  }

  getFixedContainer(): dxElementWrapper {
    return this.$fixedContainer;
  }

  getAllDayContainer(): dxElementWrapper | null {
    return this.$allDayContainer;
  }

  updateRender(): void {
    this.renderer.updateRender();
  }

  updateGrid(): void {
    this.renderer._renderGrid();
  }

  renderAppointments(): void {
    (this.option().renderAppointments)();
    this.dragBehavior?.updateDragSource(undefined, undefined);
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

  protected renderGroupHeader(): (() => dxElementWrapper)[] {
    const $container = this.getGroupHeaderContainer();
    const groupCount = this.getGroupCount();
    let cellTemplates: (() => dxElementWrapper)[] = [];
    if (groupCount && $container) {
      const groupRows = this.makeGroupRows(this.option().groups, this.option().groupByDate);
      this.attachGroupCountClass();
      const { elements } = groupRows;
      $container.append(Array.isArray(elements) ? elements : elements.toArray());
      cellTemplates = groupRows.cellTemplates;
    } else {
      this.detachGroupCountClass();
    }

    return cellTemplates;
  }

  protected applyCellTemplates(templates: (() => void)[] | undefined): void {
    templates?.forEach((template) => {
      template();
    });
  }

  protected makeGroupRows(groups: ResourceLoader[], groupByDate: boolean): GroupRows {
    const tableCreatorStrategy = this.isVerticalGroupedWorkSpace()
      ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

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
      this.option().resourceCellTemplate,
      this.getGroupCount(),
      groupByDate,
    );
  }

  protected getGroupsForDateHeaderTemplate(templateIndex: number, indexMultiplier = 1): {
    groups?: RawGroupValues | GroupValues;
    groupIndex?: number;
  } {
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

    return this.groupedStrategy.addAdditionalGroupCellClasses(
      cellClass,
      i + 1,
      0,
      0,
      this.isGroupedByDate(),
    );
  }

  protected insertAllDayRowsIntoDateTable(): boolean {
    return this.groupedStrategy.insertAllDayRowsIntoDateTable();
  }
}

type DomAdapterWithElementsFromPoint = typeof domAdapter & {
  elementsFromPoint: (x: number, y: number, element?: Element) => Element[];
};

const domAdapterExt = domAdapter as DomAdapterWithElementsFromPoint;

interface AppointmentsList {
  option: (name: string) => { length: number };
  _renderItem: (index: number, data: Record<string, unknown>) => dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _getItemData: (element: Element | dxElementWrapper) => unknown;
}

interface DragBehaviorOptions {
  getItemData: (itemElement: Element | dxElementWrapper, appointments: AppointmentsList) => unknown;
  getItemSettings: (
    $itemElement: dxElementWrapper,
    e?: Record<string, unknown>,
  ) => AppointmentViewModelPlain;
  initialPosition?: Coordinates;
  isSetCursorOffset?: boolean;
  filter?: string;
}

// TODO<Appointments>: remove dragBehavior when old impl is removed
const createDragBehaviorConfig = (
  container: dxElementWrapper,
  rootElement: dxElementWrapper,
  isDefaultDraggingMode: boolean,
  dragBehavior: AppointmentDragBehavior,
  enableDefaultDragging: () => void,
  disableDefaultDragging: () => void,
  getDroppableCell: () => dxElementWrapper,
  getDateTables: () => dxElementWrapper,
  removeDroppableCellClass: () => void,
  getCellWidthCallback: () => number,
  options: DragBehaviorOptions,
): {
  container: dxElementWrapper;
  dragTemplate: () => dxElementWrapper | undefined;
  onDragStart: (e: AppointmentDraggingStartEvent) => void;
  onDragMove: () => void;
  onDragEnd: (e: AppointmentDraggingEndEvent) => void;
  onDragCancel: (e: AppointmentDraggingRemoveEvent) => void;
  cursorOffset: (() => TranslateVector) | undefined;
  filter: string | undefined;
} => {
  const state: {
    dragElement: dxElementWrapper | undefined;
    itemData: unknown;
  } = {
    dragElement: undefined,
    itemData: undefined,
  };

  const isItemDisabled = (): boolean => {
    const { itemData } = state;

    if (itemData) {
      const getter = compileGetter('disabled') as (obj: unknown) => boolean;
      return getter(itemData);
    }

    return true;
  };

  const createDragAppointment = (
    itemData: unknown,
    settings: AppointmentViewModelPlain,
    appointments: AppointmentsList,
  ): dxElementWrapper => {
    const appointmentIndex = appointments.option('items').length;
    const $item = appointments._renderItem(appointmentIndex, {
      ...settings,
      itemData,
      isCompact: false,
      virtual: false,
      sortedIndex: -1,
    });

    return $item;
  };

  const onDragStart = (e: AppointmentDraggingStartEvent): void => {
    if (!isDefaultDraggingMode) {
      disableDefaultDragging();
    }

    if (!e.event) {
      return;
    }

    const canceled = e.cancel;
    const $itemElement = $(e.itemElement as Element | null);
    // @ts-expect-error
    const appointments = (e.component)._appointments as AppointmentsList;

    state.itemData = options.getItemData(e.itemElement as Element, appointments);
    const settings = options.getItemSettings($itemElement, e);
    const { initialPosition } = options;

    if (!isItemDisabled()) {
      e.event.data = e.event.data ?? {};
      if (!canceled) {
        if (!('isCompact' in settings && settings.isCompact)) {
          dragBehavior.updateDragSource(state.itemData, settings);
        }

        state.dragElement = createDragAppointment(state.itemData, settings, appointments);

        e.event.data.itemElement = state.dragElement;
        e.event.data.initialPosition = initialPosition
          ?? locate($(state.dragElement));
        e.event.data.itemData = state.itemData;
        e.event.data.itemSettings = settings;

        dragBehavior.onDragStart(e.event.data);

        resetPosition($(state.dragElement));
      }
    }
  };

  const getElementsFromPoint = (): Element[] => {
    const appointmentWidth = getWidth(state.dragElement);
    const cellWidth = getCellWidthCallback();
    const isWideAppointment = appointmentWidth > cellWidth;
    const isNarrowAppointment = appointmentWidth <= DRAGGING_MOUSE_FAULT;
    const dragElementContainer = $(state.dragElement).parent().get(0);
    const boundingRect = getBoundingRect(dragElementContainer);
    const newX = boundingRect.left;
    const newY = boundingRect.top;

    if (isWideAppointment) {
      return domAdapterExt.elementsFromPoint(
        newX + DRAGGING_MOUSE_FAULT,
        newY + DRAGGING_MOUSE_FAULT,
        dragElementContainer,
      );
    } if (isNarrowAppointment) {
      return domAdapterExt.elementsFromPoint(newX, newY, dragElementContainer);
    }
    return domAdapterExt.elementsFromPoint(
      newX + appointmentWidth / 2,
      newY + DRAGGING_MOUSE_FAULT,
      dragElementContainer,
    );
  };

  const onDragMove = (): void => {
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
      if (!getDroppableCell().is(droppableCell as unknown as dxElementWrapper)) {
        removeDroppableCellClass();
      }

      $(droppableCell).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
    } else if (!isMoveUnderControl) {
      removeDroppableCellClass();
    }
  };

  const onDragEnd = (e: AppointmentDraggingEndEvent): void => {
    if (!isDefaultDraggingMode) {
      enableDefaultDragging();
    }

    if (!isItemDisabled()) {
      dragBehavior.onDragEnd(e);
    }

    state.dragElement?.remove();
    removeDroppableCellClass();
  };

  const onDragCancel = (e: AppointmentDraggingRemoveEvent): void => {
    if (!isDefaultDraggingMode) {
      enableDefaultDragging();
    }

    removeDroppableCellClass();
    $(e.itemElement as Element).removeClass(APPOINTMENT_DRAG_SOURCE_CLASS);
  };

  const cursorOffset = options.isSetCursorOffset
    ? (): TranslateVector => {
      const $dragElement = $(state.dragElement);
      return {
        x: getWidth($dragElement) / 2,
        y: getHeight($dragElement) / 2,
      };
    }
    : undefined;

  return {
    container,
    dragTemplate: (): dxElementWrapper | undefined => state.dragElement,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
    cursorOffset,
    filter: options.filter,
  };
};

export default SchedulerWorkSpace;
