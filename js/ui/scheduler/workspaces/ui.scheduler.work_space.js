import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import dateUtils from '../../../core/utils/date';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { getPublicElement } from '../../../core/element';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect, getElementsFromPoint } from '../../../core/utils/position';
import messageLocalization from '../../../localization/message';
import dateLocalization from '../../../localization/date';
import { noop } from '../../../core/utils/common';
import { isDefined } from '../../../core/utils/type';
import { addNamespace, isMouseEvent } from '../../../events/utils/index';
import pointerEvents from '../../../events/pointer';
import errors from '../../widget/ui.errors';
import { name as clickEventName } from '../../../events/click';
import { name as contextMenuEventName } from '../../../events/contextmenu';
import {
    enter as dragEventEnter,
    leave as dragEventLeave,
    drop as dragEventDrop
} from '../../../events/drag';
import Scrollable from '../../scroll_view/ui.scrollable';
import HorizontalGroupedStrategy from './ui.scheduler.work_space.grouped.strategy.horizontal';
import VerticalGroupedStrategy from './ui.scheduler.work_space.grouped.strategy.vertical';
import tableCreatorModule from '../table_creator';
const { tableCreator } = tableCreatorModule;
import VerticalShader from '../shaders/ui.scheduler.current_time_shader.vertical';
import AppointmentDragBehavior from '../appointmentDragBehavior';
import { APPOINTMENT_SETTINGS_KEY } from '../constants';
import {
    FIXED_CONTAINER_CLASS,
    VIRTUAL_CELL_CLASS,
    TIME_PANEL_CLASS,
    DATE_TABLE_CLASS,
    DATE_TABLE_ROW_CLASS,
    GROUP_ROW_CLASS,
    GROUP_HEADER_CONTENT_CLASS,
} from '../classes';
import timeZoneUtils from '../utils.timeZone';
import WidgetObserver from '../base/widgetObserver';
import { resetPosition, locate } from '../../../animation/translator';

import VirtualScrollingDispatcher from './ui.scheduler.virtual_scrolling';
import ViewDataProvider from './view_model/view_data_provider';

import dxrDateTableLayout from '../../../renovation/ui/scheduler/workspaces/base/date_table/layout.j';
import dxrAllDayPanelLayout from '../../../renovation/ui/scheduler/workspaces/base/date_table/all_day_panel/layout.j';
import dxrAllDayPanelTitle from '../../../renovation/ui/scheduler/workspaces/base/date_table/all_day_panel/title.j';
import dxrTimePanelTableLayout from '../../../renovation/ui/scheduler/workspaces/base/time_panel/layout.j';
import dxrGroupPanel from '../../../renovation/ui/scheduler/workspaces/base/group_panel/group_panel.j';
import dxrDateHeader from '../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j';

import CellsSelectionState from './cells_selection_state';

import { cache } from './cache';
import { CellsSelectionController } from './cells_selection_controller';
import { isDateInRange } from './utils/base';
import { getTimeZoneCalculator } from '../instanceFactory';

const abstract = WidgetObserver.abstract;
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
const ALL_DAY_TITLE_HIDDEN_CLASS = 'dx-scheduler-all-day-title-hidden';
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
    LEAVE: addNamespace(dragEventLeave, 'dxSchedulerDateTable')
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

class ScrollSemaphore {
    constructor() {
        this.counter = 0;
    }

    isFree() {
        return this.counter === 0;
    }

    take() {
        this.counter++;
    }

    release() {
        this.counter--;
        if(this.counter < 0) {
            this.counter = 0;
        }
    }
}

const formatWeekday = function(date) {
    return dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

class SchedulerWorkSpace extends WidgetObserver {
    get viewDataProvider() {
        if(!this._viewDataProvider) {
            this._viewDataProvider = new ViewDataProvider(this);
        }
        return this._viewDataProvider;
    }

    get cache() { return cache; }

    get cellsSelectionState() {
        if(!this._cellsSelectionState) {
            this._cellsSelectionState = new CellsSelectionState(this.viewDataProvider);
        }

        return this._cellsSelectionState;
    }

    get cellsSelectionController() {
        if(!this._cellsSelectionController) {
            this._cellsSelectionController = new CellsSelectionController();
        }

        return this._cellsSelectionController;
    }

    get isAllDayPanelVisible() {
        return this._isShowAllDayPanel() && this.supportAllDayRow();
    }

    get isDateAndTimeView() {
        return true;
    }

    get verticalGroupTableClass() { return WORKSPACE_VERTICAL_GROUP_TABLE_CLASS; }

    get viewDirection() { return 'vertical'; }

    get renovatedHeaderPanelComponent() { return dxrDateHeader; }

    _supportedKeys() {
        const clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();

            const selectedCells = this.cellsSelectionState.getSelectedCells();

            if(selectedCells?.length) {
                const selectedCellsElement = selectedCells.map((cellData) => {
                    return this._getCellByData(cellData);
                }).filter(cell => !!cell);

                e.target = selectedCellsElement;
                this._showPopup = true;

                this._cellClickAction({ event: e, cellElement: $(selectedCellsElement), cellData: selectedCells[0] });
            }
        };
        const onArrowPressed = (e, key) => {
            e.preventDefault();
            e.stopPropagation();

            const focusedCellData = this.cellsSelectionState.focusedCell?.cellData;

            if(focusedCellData) {
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
                    isDateAndTimeView: this.isDateAndTimeView,
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
            }
        });
    }

    _dispose() {
        super._dispose();

        this.virtualScrollingDispatcher.dispose();
    }

    _isRTL() {
        return this.option('rtlEnabled');
    }

    _moveToCell($cell, isMultiSelection) {
        if(!isDefined($cell) || !$cell.length) {
            return undefined;
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

        if(!this.viewDataProvider.isSameCell(focusedCellData, nextCellData)) {
            this._releaseFocusedCell();
            this._releaseSelectedCells();

            const $cell = nextCellData.allDay && !this._isVerticalGroupedWorkSpace()
                ? this._dom_getAllDayPanelCell(nextCellPosition.columnIndex)
                : this._dom_getDateCell(nextCellPosition);
            const isNextCellAllDay = nextCellData.allDay;

            this._setSelectedCellsStateAndUpdateSelection(
                isNextCellAllDay, nextCellPosition, isMultiSelection, $cell,
            );

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

        if(isMultiSelection) {
            this.cellsSelectionState.setSelectedCells(nextCellCoordinates);
        } else {
            this.cellsSelectionState.setSelectedCells(nextCellCoordinates, nextCellCoordinates);
        }

        this.updateCellsSelection();
        this._updateSelectedCellDataOption(this.cellsSelectionState.getSelectedCells(), $nextFocusedCell);
    }

    _setFocusedCell() {
        const focusedCell = this.cellsSelectionState.focusedCell;

        const { cellData, coordinates } = focusedCell;
        const { allDay } = cellData;

        const $correctedCell = allDay && !this._isVerticalGroupedWorkSpace()
            ? this._dom_getAllDayPanelCell(coordinates.columnIndex)
            : this._dom_getDateCell(coordinates);

        this._toggleFocusedCellClass(true, $correctedCell);
    }

    _hasAllDayClass($cell) {
        return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
    }

    _toggleFocusedCellClass(isFocused, $element) {
        const $focusTarget = $element && $element.length ? $element : this._focusTarget();
        $focusTarget.toggleClass(DATE_TABLE_FOCUSED_CELL_CLASS, isFocused);
    }

    _releaseSelectedAndFocusedCells() {
        this._releaseFocusedCell();
        this._releaseSelectedCells();

        this.option('selectedCellData', []);
    }

    _releaseFocusedCell() {
        const focusedCellData = this.cellsSelectionState.focusedCell?.cellData;
        if(focusedCellData) {
            const $cell = this._getCellByData(focusedCellData);

            if(isDefined($cell) && $cell.length) {
                this._toggleFocusedCellClass(false, $cell);
                this.setAria('label', undefined, $cell);
            }
        }
    }

    _releaseSelectedCells() {
        const selectedCells = this.cellsSelectionState.getSelectedCells();

        const $cells = $(selectedCells?.map((cellData) => {
            return this._getCellByData(cellData)?.get(0);
        }).filter(cell => !!cell));

        if(isDefined($cells) && $cells.length) {
            this._toggleFocusClass(false, $cells);
            this.setAria('label', undefined, $cells);
        }
    }

    _focusInHandler(e) {
        if($(e.target).is(this._focusTarget()) && this._isCellClick !== false) {
            delete this._isCellClick;
            delete this._contextMenuHandled;
            super._focusInHandler.apply(this, arguments);

            if(!this.cellsSelectionState.focusedCell) {
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
        super._focusOutHandler.apply(this, arguments);

        if(!this._contextMenuHandled) {
            this._releaseSelectedAndFocusedCells();
            this.cellsSelectionState.releaseSelectedAndFocusedCells();
        }
    }

    _focusTarget() {
        return this.$element();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            currentDate: new Date(),
            intervalCount: 1,
            startDate: null,
            firstDayOfWeek: undefined,
            startDayHour: 0,
            endDayHour: 24,
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
            renovateRender: true,
            height: undefined,
            draggingMode: 'outlook'
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'startDayHour':
            case 'endDayHour':
                this.invoke('validateDayHours');
                this._cleanWorkSpace();
                break;
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
                if(this._isVerticalGroupedWorkSpace()) {
                    this._cleanView();
                    this._removeAllDayElements();
                    this._initGrouping();
                    this.repaint();
                } else {
                    if(!this.isRenovatedRender()) {
                        this._toggleAllDayVisibility(true);
                    } else {
                        this.renderWorkSpace();
                    }
                }
                break;
            case 'allDayExpanded':
                this._changeAllDayVisibility();
                this._attachTablesEvents();
                this.headerPanelOffsetRecalculate();
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
                this._toggleFixedScrollableClass();
                break;
            case 'groupByDate':
                this._cleanWorkSpace();
                this._toggleGroupByDateClass();
                break;
            case 'crossScrollingEnabled':
                this._toggleHorizontalScrollClass();
                this._dateTableScrollable.option(this._dateTableScrollableConfig());
                break;
            case 'width':
                super._optionChanged(args);
                this._dimensionChanged();
                break;
            case 'allowMultipleCellSelection':
                break;
            case 'selectedCellData':
                break;
            case 'scrolling':
                if(this._isVirtualModeOn()) {
                    if(!this.option('renovateRender')) {
                        this.option('renovateRender', true);
                    } else {
                        this.repaint();
                    }
                } else {
                    this.option('renovateRender', false);
                }

                break;
            case 'renovateRender':
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
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
        this._headerSemaphore = new ScrollSemaphore();
        this._sideBarSemaphore = new ScrollSemaphore();
        this._dataTableSemaphore = new ScrollSemaphore();
        this._viewDataProvider = null;
        this._cellsSelectionState = null;
        this._activeStateUnit = CELL_SELECTOR;
        this._maxAllowedVerticalPosition = [];
        this._maxAllowedPosition = [];

        super._init();

        this._initGrouping();

        this._toggleHorizontalScrollClass();
        this._toggleWorkSpaceCountClass();
        this._toggleGroupByDateClass();
        this._toggleWorkSpaceWithOddCells();

        this.$element()
            .addClass(COMPONENT_CLASS)
            .addClass(this._getElementClass());
    }

    _initGrouping() {
        this._initGroupedStrategy();
        this._toggleGroupingDirectionClass();
        this._toggleGroupByDateClass();
    }

    _initGroupedStrategy() {
        const strategyName = this.option('groups').length ? this.option('groupOrientation') : this._getDefaultGroupStrategy();

        const Strategy = strategyName === 'vertical' ? VerticalGroupedStrategy : HorizontalGroupedStrategy;

        this._groupedStrategy = new Strategy(this);
    }

    _getDefaultGroupStrategy() {
        return 'horizontal';
    }

    _isVerticalGroupedWorkSpace() {
        return !!this.option('groups').length && this.option('groupOrientation') === 'vertical';
    }

    _isHorizontalGroupedWorkSpace() {
        return !!this.option('groups').length && this.option('groupOrientation') === 'horizontal';
    }

    _toggleHorizontalScrollClass() {
        this.$element().toggleClass(WORKSPACE_WITH_BOTH_SCROLLS_CLASS, this.option('crossScrollingEnabled'));
    }

    _toggleGroupByDateClass() {
        this.$element().toggleClass(WORKSPACE_WITH_GROUP_BY_DATE_CLASS, this.isGroupedByDate());
    }

    _toggleWorkSpaceCountClass() {
        this.$element().toggleClass(WORKSPACE_WITH_COUNT_CLASS, this._isWorkSpaceWithCount());
    }

    _isWorkSpaceWithCount() {
        return this.option('intervalCount') > 1;
    }

    _toggleWorkSpaceWithOddCells() {
        this.$element().toggleClass(WORKSPACE_WITH_ODD_CELLS_CLASS, this._isWorkspaceWithOddCells());
    }

    _isWorkspaceWithOddCells() {
        return this.option('hoursInterval') === 0.5 && !this.isVirtualScrolling();
    }

    _toggleGroupingDirectionClass() {
        this.$element().toggleClass(VERTICAL_GROUPED_WORKSPACE_CLASS, this._isVerticalGroupedWorkSpace());
    }

    _getRealGroupOrientation() {
        return this._isVerticalGroupedWorkSpace() ? 'vertical' : 'horizontal';
    }

    _getDateTableCellClass(rowIndex, columnIndex) {
        const cellClass = DATE_TABLE_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS + ' ' + VERTICAL_SIZES_CLASS;

        return this._groupedStrategy
            .addAdditionalGroupCellClasses(cellClass, columnIndex + 1, rowIndex, columnIndex);
    }

    _getGroupHeaderClass(i) {
        const cellClass = GROUP_HEADER_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1);
    }

    _initWorkSpaceUnits() {

        this._$headerPanel = $('<table>');

        this._$thead = $('<thead>').appendTo(this._$headerPanel);

        this._$fixedContainer = $('<div>').addClass(FIXED_CONTAINER_CLASS);
        this._$allDayContainer = $('<div>').addClass(ALL_DAY_CONTAINER_CLASS);

        this._initAllDayPanelElements();

        if(this.isRenovatedRender()) {
            this.createRAllDayPanelElements();
        } else {
            this._createAllDayPanelElements();
        }

        this._$timePanel = $('<table>').addClass(TIME_PANEL_CLASS);

        this._$dateTable = $('<table>');

        this._$groupTable = $('<div>').addClass(WORKSPACE_VERTICAL_GROUP_TABLE_CLASS);
    }

    _initAllDayPanelElements() {
        this._allDayTitles = [];
        this._allDayTables = [];
        this._allDayPanels = [];
    }

    createRAllDayPanelElements() {
        this._$allDayPanel = $('<div>');
        this._$allDayTitle = $('<div>').appendTo(this.$element());
    }

    _createAllDayPanelElements() {
        const groupCount = this._getGroupCount();

        if(this._isVerticalGroupedWorkSpace() && groupCount !== 0) {
            for(let i = 0; i < groupCount; i++) {
                const $allDayTitle = $('<div>')
                    .addClass(ALL_DAY_TITLE_CLASS)
                    .text(messageLocalization.format('dxScheduler-allDay'));

                this._allDayTitles.push($allDayTitle);

                this._$allDayTable = $('<table>');
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

            this._$allDayTable = $('<table>');

            this._$allDayPanel = $('<div>')
                .addClass(ALL_DAY_PANEL_CLASS)
                .append(this._$allDayTable);
        }
    }

    _initDateTableScrollable() {
        const $dateTableScrollable = $('<div>').addClass(SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS);

        this._dateTableScrollable = this._createComponent($dateTableScrollable, Scrollable, this._dateTableScrollableConfig());
    }

    _dateTableScrollableConfig() {
        let config = {
            useKeyboard: false,
            bounceEnabled: false,
            updateManually: true,
        };
        if(this._needCreateCrossScrolling()) {
            config = extend(config, this._createCrossScrollingConfig());
        }

        return config;
    }

    _createCrossScrollingConfig() {
        const config = {};
        config.direction = 'both';

        config.onScroll = e => {
            this._dataTableSemaphore.take();

            this._sideBarSemaphore.isFree() && this._sidebarScrollable && this._sidebarScrollable.scrollTo({
                top: e.scrollOffset.top
            });

            this._headerSemaphore.isFree() && this._headerScrollable && this._headerScrollable.scrollTo({
                left: e.scrollOffset.left
            });

            this._dataTableSemaphore.release();
        };

        config.onEnd = () => {
            this.notifyObserver('updateResizableArea', {});
        };

        return config;
    }

    _createWorkSpaceElements() {
        if(this.option('crossScrollingEnabled')) {
            this._createWorkSpaceScrollableElements();
        } else {
            this._createWorkSpaceStaticElements();
        }
    }

    _createWorkSpaceStaticElements() {
        if(this._isVerticalGroupedWorkSpace()) {
            this._dateTableScrollable.$content().append(this._$allDayContainer, this._$groupTable, this._$timePanel, this._$dateTable);
            this.$element().append(this._$fixedContainer, this._$headerPanel, this._dateTableScrollable.$element());
        } else {
            this._dateTableScrollable.$content().append(this._$timePanel, this._$dateTable);
            this.$element().append(this._$fixedContainer, this._$headerPanel, this._$allDayContainer, this._$allDayPanel, this._dateTableScrollable.$element());
        }
    }

    _createWorkSpaceScrollableElements() {
        this.$element().append(this._$fixedContainer);
        this._createHeaderScrollable();
        this._createSidebarScrollable();
        this.$element().append(this._dateTableScrollable.$element());

        this._headerScrollable.$content().append(this._$headerPanel);
        this._dateTableScrollable.$content().append(this._$dateTable);

        if(this._isVerticalGroupedWorkSpace()) {
            this._dateTableScrollable.$content().prepend(this._$allDayContainer);
            this._sidebarScrollable.$content().append(this._$groupTable, this._$timePanel);
        } else {
            this._headerScrollable.$content().append(this._$allDayContainer, this._$allDayPanel);
        }

        this._sidebarScrollable.$content().append(this._$timePanel);
    }

    _createHeaderScrollable() {
        const $headerScrollable = $('<div>')
            .addClass(SCHEDULER_HEADER_SCROLLABLE_CLASS)
            .appendTo(this.$element());

        this._headerScrollable = this._createComponent($headerScrollable, Scrollable, this._headerScrollableConfig());
    }

    _headerScrollableConfig() {
        const config = {
            useKeyboard: false,
            showScrollbar: false,
            direction: 'horizontal',
            useNative: false,
            updateManually: true,
            bounceEnabled: false,
            onScroll: e => {
                this._headerSemaphore.take();
                this._dataTableSemaphore.isFree() && this._dateTableScrollable.scrollTo({ left: e.scrollOffset.left });
                this._headerSemaphore.release();
            }
        };

        return config;
    }

    _createSidebarScrollable() {
        const $timePanelScrollable = $('<div>')
            .addClass(SCHEDULER_SIDEBAR_SCROLLABLE_CLASS)
            .appendTo(this.$element());

        this._sidebarScrollable = this._createComponent($timePanelScrollable, Scrollable, {
            useKeyboard: false,
            showScrollbar: false,
            direction: 'vertical',
            useNative: false,
            updateManually: true,
            bounceEnabled: false,
            onScroll: e => {
                this._sideBarSemaphore.take();
                this._dataTableSemaphore.isFree() && this._dateTableScrollable.scrollTo({ top: e.scrollOffset.top });
                this._sideBarSemaphore.release();
            }
        });
    }

    _visibilityChanged(visible) {
        this.cache.clear();

        if(visible) {
            this._updateGroupTableHeight();
        }

        if(visible && this._needCreateCrossScrolling()) {
            this._setTableSizes();
        }
    }

    _attachTableClasses() {
        this._addTableClass(this._$dateTable, DATE_TABLE_CLASS);

        if(this._isVerticalGroupedWorkSpace()) {
            const groupCount = this._getGroupCount();

            for(let i = 0; i < groupCount; i++) {
                this._addTableClass(this._allDayTables[i], ALL_DAY_TABLE_CLASS);
            }
        } else {
            this._addTableClass(this._$allDayTable, ALL_DAY_TABLE_CLASS);
        }
    }

    _attachHeaderTableClasses() {
        this._addTableClass(this._$headerPanel, HEADER_PANEL_CLASS);
    }

    _addTableClass($el, className) {
        ($el && !$el.hasClass(className)) && $el.addClass(className);
    }

    _setTableSizes() {
        this.cache.clear();
        this._attachTableClasses();

        let cellWidth = this.getCellWidth();

        if(cellWidth < this.getCellMinWidth()) {
            cellWidth = this.getCellMinWidth();
        }

        const minWidth = this.getWorkSpaceMinWidth();

        const groupCount = this._getGroupCount();
        const totalCellCount = this._getTotalCellCount(groupCount);

        let width = cellWidth * totalCellCount;

        if(width < minWidth) {
            width = minWidth;
        }

        this._$headerPanel.width(width);
        this._$dateTable.width(width);
        this._$allDayTable && this._$allDayTable.width(width);

        this._attachHeaderTableClasses();

        this._updateGroupTableHeight();
    }

    getWorkSpaceMinWidth() {
        return this._groupedStrategy.getWorkSpaceMinWidth();
    }

    _dimensionChanged() {
        if(this.option('crossScrollingEnabled')) {
            this._setTableSizes();
        }

        this.headerPanelOffsetRecalculate();

        this.cache.clear();
        this._cleanAllowedPositions();
    }

    _needCreateCrossScrolling() {
        return this.option('crossScrollingEnabled');
    }

    _getElementClass() { return noop(); }

    _getRowCount() { return noop(); }

    _getRowCountWithAllDayRows() {
        const allDayRowCount = this._isShowAllDayPanel() ? 1 : 0;

        return this._getRowCount() + allDayRowCount;
    }

    _getCellCount() { return noop(); }

    _initMarkup() {
        this.cache.clear();

        this._initWorkSpaceUnits();

        this._initDateTableScrollable();

        this._createWorkSpaceElements();

        this._initVirtualScrolling();

        super._initMarkup();

        if(!this.option('crossScrollingEnabled')) {
            this._attachTableClasses();
            this._attachHeaderTableClasses();
        }

        this._toggleGroupedClass();
        this._toggleFixedScrollableClass();

        this._renderView();
        this._attachEvents();
        this._setFocusOnCellByOption(this.option('selectedCellData'));
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
        if(this.virtualScrollingDispatcher) {
            this.virtualScrollingDispatcher.dispose();
            this.virtualScrollingDispatcher = null;
        }

        this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this);
    }

    _render() {
        super._render();
        this._renderDateTimeIndication();
        this._setIndicationUpdateInterval();
    }

    _toggleGroupedClass() {
        this.$element().toggleClass(GROUPED_WORKSPACE_CLASS, this._getGroupCount() > 0);
    }

    _toggleFixedScrollableClass() { return noop(); }

    _renderView() {
        this._setFirstViewDate();

        if(this.isRenovatedRender()) {
            if(this._isVerticalGroupedWorkSpace()) {
                this.renderRGroupPanel();
            }
        } else {
            this._applyCellTemplates(
                this._renderGroupHeader()
            );
        }

        this.renderWorkSpace();

        this._updateGroupTableHeight();

        this._shader = new VerticalShader(this);
    }

    onDataSourceChanged() {
    }

    preRenderAppointments(options) {
        this.option('allDayExpanded', options.allDayExpanded);
    }

    isGroupedAllDayPanel() {
        return this._isShowAllDayPanel() && this._isVerticalGroupedWorkSpace();
    }

    generateRenderOptions(isProvideVirtualCellsWidth) {
        const isVerticalGrouping = this._isVerticalGroupedWorkSpace();
        const groupCount = this._getGroupCount();
        const horizontalGroupCount = isVerticalGrouping ? 1 : groupCount;
        const rowCountInGroup = this._getRowCount();

        const cellCount = this._getTotalCellCount(groupCount);
        const rowCount = this._getTotalRowCount(groupCount, isVerticalGrouping);
        const groupOrientation = groupCount > 0
            ? this.option('groupOrientation')
            : this._getDefaultGroupStrategy();

        const options = {
            horizontalGroupCount,
            rowCountInGroup,
            cellCount,
            cellCountInGroupRow: this._getCellCount(),
            cellDataGetters: [this._getCellData.bind(this)],
            startRowIndex: 0,
            startCellIndex: 0,
            groupOrientation,
            rowCount,
            totalRowCount: rowCount,
            totalCellCount: cellCount,
            groupCount,
            getDateHeaderText: this._getHeaderText.bind(this),
            getDateHeaderDate: this._getDateByIndex.bind(this),
            getTimeCellDate: this._getTimeCellDate.bind(this),
            today: this._getToday?.(),
            groupByDate: this.isGroupedByDate(),
            groupsList: this._getAllGroups(),
            isHorizontalGrouping: this._isHorizontalGroupedWorkSpace(),
            isVerticalGrouping,
            isProvideVirtualCellsWidth,
            isStandaloneAllDayPanel: !isVerticalGrouping && this.isAllDayPanelVisible,
            isGroupedAllDayPanel: this.isGroupedAllDayPanel(),
            isAllDayPanelVisible: this.isAllDayPanelVisible,
            getAllDayCellData: this._getAllDayCellData.bind(this),
            isDateAndTimeView: this.isDateAndTimeView,
            ...this.virtualScrollingDispatcher.getRenderState(),
        };

        return options;
    }

    renovatedRenderSupported() { return true; }

    renderWorkSpace(isGenerateNewViewData = true) {
        this._cleanAllowedPositions();
        this.cache.clear();

        this.viewDataProvider.update(isGenerateNewViewData);

        if(this.isRenovatedRender()) {
            this.renderRHeaderPanel();
            this.renderRTimeTable();
            this.renderRDateTable();
            this.renderRAllDayPanel();

            this.updateCellsSelection();

            this.virtualScrollingDispatcher.updateDimensions();
        } else {
            this._renderDateHeader();
            this._renderTimePanel();
            this._renderGroupAllDayPanel();
            this._renderDateTable();
            this._renderAllDayPanel();
        }
    }

    renderRDateTable() {
        this.renderRComponent(
            this._$dateTable,
            dxrDateTableLayout,
            'renovatedDateTable',
            this._getRDateTableProps(),
        );
    }

    renderRGroupPanel() {
        const options = {
            groups: this.option('groups'),
            groupOrientation: this.option('groupOrientation'),
            groupByDate: this.isGroupedByDate(),
            resourceCellTemplate: this.option('resourceCellTemplate'),
            className: this.verticalGroupTableClass,
            baseColSpan: this.isGroupedByDate()
                ? 1
                : this._getCellCount(),
            columnCountPerGroup: this._getCellCount(),
        };

        if(this.option('groups').length) {
            this._attachGroupCountAttr();
            this.renderRComponent(
                this._getGroupHeaderContainer(),
                dxrGroupPanel,
                'renovatedGroupPanel',
                options,
            );
        } else {
            this._detachGroupCountAttr();
        }
    }

    renderRAllDayPanel() {
        const visible = this._isShowAllDayPanel() && !this.isGroupedAllDayPanel();

        if(this.supportAllDayRow() && !this._isVerticalGroupedWorkSpace()) {
            this._toggleAllDayVisibility(false);

            const options = {
                viewData: this.viewDataProvider.viewData,
                visible,
                dataCellTemplate: this.option('dataCellTemplate'),
                startCellIndex: 0,
                ...(this.virtualScrollingDispatcher.horizontalVirtualScrolling?.getRenderState() || {}),
            };

            this.renderRComponent(this._$allDayPanel, dxrAllDayPanelLayout, 'renovatedAllDayPanel', options);
            this.renderRComponent(this._$allDayTitle, dxrAllDayPanelTitle, 'renovatedAllDayPanelTitle', { visible });

            this._$allDayTable = this.renovatedAllDayPanel.$element().find(`.${ALL_DAY_TABLE_CLASS}`);
        }
        this._toggleAllDayVisibility(true);
    }

    renderRTimeTable() {
        this.renderRComponent(
            this._$timePanel,
            dxrTimePanelTableLayout,
            'renovatedTimePanel',
            {
                timePanelData: this.viewDataProvider.timePanelData,
                timeCellTemplate: this.option('timeCellTemplate'),
                groupOrientation: this.option('groupOrientation'),
            }
        );
    }

    renderRHeaderPanel(isRenderDateHeader = true) {
        if(this.option('groups').length) {
            this._attachGroupCountAttr();
        } else {
            this._detachGroupCountAttr();
        }

        this.renderRComponent(
            this._$thead,
            this.renovatedHeaderPanelComponent,
            'renovatedHeaderPanel',
            {
                dateHeaderData: this.viewDataProvider.dateHeaderData,
                dateCellTemplate: this.option('dateCellTemplate'),
                timeCellTemplate: this.option('timeCellTemplate'),
                groups: this.option('groups'),
                groupByDate: this.isGroupedByDate(),
                groupOrientation: this.option('groupOrientation'),
                resourceCellTemplate: this.option('resourceCellTemplate'),
                groupPanelCellBaseColSpan: this.isGroupedByDate()
                    ? 1
                    : this._getCellCount(),
                columnCountPerGroup: this._getCellCount(),
                isRenderDateHeader,
            }
        );
    }

    renderRComponent(parentElement, componentClass, componentName, viewModel) {
        let component = this[componentName];
        if(!component) {
            const container = getPublicElement(parentElement);
            component = this._createComponent(container, componentClass, viewModel);
            this[componentName] = component;
        } else {
            // TODO: this is a workaround for setTablesSizes. Remove after CSS refactoring
            const $element = component.$element();
            const elementStyle = $element.get(0).style;
            const height = elementStyle.height;
            const width = elementStyle.width;

            component.option(viewModel);

            height && $element.height(height);
            width && $element.width(width);
        }
    }

    updateCellsSelection() {
        const isVerticalGrouping = this._isVerticalGroupedWorkSpace();
        const focusedCell = this.cellsSelectionState.focusedCell;
        const selectedCells = this.cellsSelectionState.getSelectedCells();

        if(focusedCell?.coordinates) {
            const { coordinates, cellData } = focusedCell;
            const $cell = !isVerticalGrouping && cellData.allDay
                ? this._dom_getAllDayPanelCell(coordinates.columnIndex)
                : this._dom_getDateCell(coordinates);
            $cell && this._setFocusedCell($cell);
        }

        selectedCells && this._setSelectedCellsByCellData(selectedCells);
    }

    _updateGroupTableHeight() {
        if(this._isVerticalGroupedWorkSpace() && hasWindow()) {
            this._setHorizontalGroupHeaderCellsHeight();
        }
    }

    _renderDateTimeIndication() { return noop(); }
    _setIndicationUpdateInterval() { return noop(); }
    _refreshDateTimeIndication() { return noop(); }

    _setFocusOnCellByOption(data) {
        this._releaseSelectedAndFocusedCells();
        if(data?.length) {
            this._setSelectedCellsByCellData(data);

            const isGroupsSpecified = this._isGroupsSpecified(data[0].groups);
            const correctedData = data.map(({
                groups,
                ...restProps
            }) => ({
                ...restProps,
                groups,
                groupIndex: isGroupsSpecified ? this._getGroupIndexByResourceId(groups) : 0,
            }));

            this.cellsSelectionState.setSelectedCellsByData(correctedData);
        }
    }

    _setSelectedCellsByCellData(data) {
        const $cells = this._getAllCells(data?.[0]?.allDay);
        const cellsInRow = this.viewDataProvider.getColumnsCount();

        data.forEach((cellData) => {
            const { groups, startDate, allDay, index } = cellData;
            let { groupIndex } = cellData;

            if(!groupIndex) {
                groupIndex = this._isGroupsSpecified(groups)
                    ? this._getGroupIndexByResourceId(groups)
                    : 0;
            }

            const coordinates = this.viewDataProvider.findCellPositionInMap(
                { groupIndex, startDate, isAllDay: allDay, index }
            );

            if(coordinates) {
                const { rowIndex, columnIndex } = coordinates;
                const index = rowIndex * cellsInRow + columnIndex;
                const $cell = $cells[index];

                if(isDefined($cell)) {
                    this._toggleFocusClass(true, $($cell));
                    this.setAria('label', 'Add appointment', $($cell));
                }
            }
        });
    }

    _isGroupsSpecified(resources) {
        return this.option('groups').length && resources;
    }

    _getGroupIndexByResourceId(id) {
        const groups = this.option('groups');
        const resourceManager = this.invoke('getResourceManager');
        const resourceTree = resourceManager.createResourcesTree(groups);

        if(!resourceTree.length) return 0;

        return this._getGroupIndexRecursively(resourceTree, id);
    }

    _getGroupIndexRecursively(resourceTree, id) {
        const currentKey = resourceTree[0].name;
        const currentValue = id[currentKey];

        return resourceTree.reduce((prevIndex, { leafIndex, value, children }) => {
            const areValuesEqual = currentValue === value;
            if(areValuesEqual && leafIndex !== undefined) {
                return leafIndex;
            }
            if(areValuesEqual) {
                return this._getGroupIndexRecursively(children, id);
            }

            return prevIndex;
        }, 0);
    }

    _getCalculatedFirstDayOfWeek() {
        const firstDayOfWeekOption = this._firstDayOfWeek();

        const firstDayOfWeek = isDefined(firstDayOfWeekOption)
            ? firstDayOfWeekOption
            : dateLocalization.firstDayOfWeekIndex();

        return firstDayOfWeek;
    }

    _setFirstViewDate() {
        const firstDayOfWeek = this._getCalculatedFirstDayOfWeek();

        this._firstViewDate = dateUtils.getFirstWeekDate(this._getViewStartByOptions(), firstDayOfWeek);
        this._setStartDayHour(this._firstViewDate);
    }

    _getViewStartByOptions() {
        if(!this.option('startDate')) {
            return this.option('currentDate');
        } else {
            let startDate = dateUtils.trimTime(this._getStartViewDate());
            const currentDate = this.option('currentDate');
            const diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1;
            let endDate = new Date(startDate.getTime() + this._getIntervalDuration() * diff);

            while(!isDateInRange(currentDate, startDate, endDate, diff)) {
                startDate = endDate;
                endDate = new Date(startDate.getTime() + this._getIntervalDuration() * diff);
            }

            return diff > 0 ? startDate : endDate;
        }
    }

    _getHeaderDate() {
        return this.getStartViewDate();
    }

    _getStartViewDate() {
        return this.option('startDate');
    }

    _getIntervalDuration() {
        return toMs('day') * this.option('intervalCount');
    }

    _setStartDayHour(date) {
        const startDayHour = this.option('startDayHour');
        if(isDefined(startDayHour)) {
            date.setHours(startDayHour, startDayHour % 1 * 60, 0, 0);
        }
    }

    _firstDayOfWeek() {
        return this.option('firstDayOfWeek');
    }

    _attachEvents() {
        this._createSelectionChangedAction();
        this._attachClickEvent();
        this._attachContextMenuEvent();
    }

    _attachClickEvent() {
        const that = this;
        const pointerDownAction = this._createAction(function(e) {
            that._pointerDownHandler(e.event);
        });

        this._createCellClickAction();

        const cellSelector = '.' + DATE_TABLE_CELL_CLASS + ',.' + ALL_DAY_TABLE_CELL_CLASS;
        const $element = this.$element();

        eventsEngine.off($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME);
        eventsEngine.on($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME, function(e) {
            if(isMouseEvent(e) && e.which > 1) {
                e.preventDefault();
                return;
            }
            pointerDownAction({ event: e });
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME, cellSelector, function(e) {
            const $cell = $(e.target);
            that._cellClickAction({ event: e, cellElement: getPublicElement($cell), cellData: that.getCellData($cell) });
        });
    }

    _createCellClickAction() {
        this._cellClickAction = this._createActionByOption('onCellClick', {
            afterExecute: (e) => this._cellClickHandler(e.args[0].event)
        });
    }

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
    }

    _cellClickHandler() {
        if(this._showPopup) {
            delete this._showPopup;
            this._showAddAppointmentPopup();
        }
    }

    _pointerDownHandler(e) {
        const $target = $(e.target);

        if(!$target.hasClass(DATE_TABLE_CELL_CLASS) && !$target.hasClass(ALL_DAY_TABLE_CELL_CLASS)) {
            this._isCellClick = false;
            return;
        }

        this._isCellClick = true;
        if($target.hasClass(DATE_TABLE_FOCUSED_CELL_CLASS)) {
            this._showPopup = true;
        } else {
            this._releaseFocusedCell();
            this._releaseSelectedCells();

            const cellCoordinates = this._getCoordinatesByCell($target);
            const isAllDayCell = this._hasAllDayClass($target);

            this._setSelectedCellsStateAndUpdateSelection(
                isAllDayCell, cellCoordinates, false, $target,
            );
        }
    }

    _showAddAppointmentPopup() {
        const selectedCells = this.cellsSelectionState.getSelectedCells();

        const firstCellData = selectedCells[0];
        const lastCellData = selectedCells[selectedCells.length - 1];

        const result = {
            startDate: firstCellData.startDate,
            endDate: lastCellData.endDate
        };

        if(lastCellData.allDay !== undefined) {
            result.allDay = lastCellData.allDay;
        }

        this.invoke('showAddAppointmentPopup', result, lastCellData.groups);
    }

    _attachContextMenuEvent() {
        this._createContextMenuAction();

        const cellSelector = '.' + DATE_TABLE_CELL_CLASS + ',.' + ALL_DAY_TABLE_CELL_CLASS;
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
        if(this._isVerticalGroupedWorkSpace()) {
            return this._$groupTable;
        }

        return this._$thead;
    }

    _getDateHeaderContainer() {
        return this._$thead;
    }

    _renderGroupHeader() {
        const $container = this._getGroupHeaderContainer();
        const groupCount = this._getGroupCount();
        let cellTemplates = [];
        if(groupCount) {
            const groupRows = this._makeGroupRows(this.option('groups'), this.option('groupByDate'));
            this._attachGroupCountAttr();
            $container.append(groupRows.elements);
            cellTemplates = groupRows.cellTemplates;
        } else {
            this._detachGroupCountAttr();
        }

        return cellTemplates;
    }

    _applyCellTemplates(templates) {
        templates?.forEach(function(template) {
            template();
        });
    }

    _detachGroupCountAttr() {
        const groupedAttr = this._groupedStrategy.getGroupCountAttr();

        this.$element().removeAttr(groupedAttr.attr);
    }

    _attachGroupCountAttr() {
        const groupedAttr = this._groupedStrategy.getGroupCountAttr(this.option('groups'));

        this.$element().attr(groupedAttr.attr, groupedAttr.count);
    }

    headerPanelOffsetRecalculate() {
        if(!this.option('resourceCellTemplate') &&
            !this.option('dateCellTemplate')) {
            return;
        }

        const headerPanelHeight = this.getHeaderPanelHeight();
        const headerHeight = this.invoke('getHeaderHeight');
        const allDayPanelHeight = this.isAllDayPanelVisible
            ? this._groupedStrategy.getAllDayTableHeight()
            : 0;

        headerPanelHeight && this._headerScrollable && this._headerScrollable.$element().height(headerPanelHeight + allDayPanelHeight);

        headerPanelHeight && this._dateTableScrollable.$element().css({
            'paddingBottom': allDayPanelHeight + headerPanelHeight + 'px',
            'marginBottom': -1 * ((parseInt(headerPanelHeight, 10)) + allDayPanelHeight) + 'px'
        });
        headerPanelHeight && this._sidebarScrollable && this._sidebarScrollable.$element().css({
            'paddingBottom': allDayPanelHeight + headerPanelHeight + 'px',
            'marginBottom': -1 * ((parseInt(headerPanelHeight, 10)) + allDayPanelHeight) + 'px'
        });

        this._$allDayTitle && this._$allDayTitle.css('top', headerHeight + headerPanelHeight + 'px');
    }

    _makeGroupRows(groups, groupByDate) {
        const tableCreatorStrategy = this._isVerticalGroupedWorkSpace() ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;

        return tableCreator.makeGroupedTable(tableCreatorStrategy,
            groups, {
                groupHeaderRowClass: GROUP_ROW_CLASS,
                groupRowClass: GROUP_ROW_CLASS,
                groupHeaderClass: this._getGroupHeaderClass.bind(this),
                groupHeaderContentClass: GROUP_HEADER_CONTENT_CLASS,
            },
            this._getCellCount() || 1,
            this.option('resourceCellTemplate'),
            this._getGroupCount(),
            groupByDate
        );
    }

    _getDateHeaderTemplate() {
        return this.option('dateCellTemplate');
    }

    _renderDateHeader() {
        const container = this._getDateHeaderContainer();
        const $headerRow = $('<tr>').addClass(HEADER_ROW_CLASS);
        const count = this._getCellCount();
        const cellTemplate = this._getDateHeaderTemplate();
        const repeatCount = this._getCalculateHeaderCellRepeatCount();
        const templateCallbacks = [];
        const groupByDate = this.isGroupedByDate();

        if(!groupByDate) {
            for(let rowIndex = 0; rowIndex < repeatCount; rowIndex++) {
                for(let columnIndex = 0; columnIndex < count; columnIndex++) {
                    const templateIndex = rowIndex * count + columnIndex;
                    this._renderDateHeaderTemplate($headerRow, columnIndex, templateIndex, cellTemplate, templateCallbacks);
                }
            }

            container.append($headerRow);
        } else {
            const colSpan = groupByDate ? this._getGroupCount() : 1;

            for(let columnIndex = 0; columnIndex < count; columnIndex++) {
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
        const text = this._getHeaderText(panelCellIndex);
        const $cell = $('<th>')
            .addClass(this._getHeaderPanelCellClass(panelCellIndex))
            .attr('title', text);

        if(cellTemplate?.render) {
            templateCallbacks.push(cellTemplate.render.bind(cellTemplate, {
                model: {
                    text: text,
                    date: this._getDateByIndex(panelCellIndex),
                    ...this._getGroupsForDateHeaderTemplate(templateIndex),
                },
                index: templateIndex,
                container: getPublicElement($cell)
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

        if(this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate()) {
            groupIndex = this._getGroupIndex(0, templateIndex * indexMultiplier);
            const resourceManager = this.invoke('getResourceManager');
            const groupsArray = resourceManager.getCellGroups(
                groupIndex,
                this.option('groups')
            );

            groups = this._getGroupsObjectFromGroupsArray(groupsArray);
        }

        return { groups, groupIndex };
    }

    _getHeaderPanelCellClass(i) {
        const cellClass = HEADER_PANEL_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(
            cellClass, i + 1, undefined, undefined, this.isGroupedByDate(),
        );
    }

    _getCalculateHeaderCellRepeatCount() {
        return this._groupedStrategy.calculateHeaderCellRepeatCount();
    }

    _renderAllDayPanel(index) {
        let cellCount = this._getCellCount();

        if(!this._isVerticalGroupedWorkSpace()) {
            cellCount *= (this._getGroupCount() || 1);
        }

        const cellTemplates = this._renderTableBody({
            container: this._allDayPanels.length ? getPublicElement(this._allDayTables[index]) : getPublicElement(this._$allDayTable),
            rowCount: 1,
            cellCount: cellCount,
            cellClass: this._getAllDayPanelCellClass.bind(this),
            rowClass: ALL_DAY_TABLE_ROW_CLASS,
            cellTemplate: this.option('dataCellTemplate'),
            getCellData: this._getAllDayCellData.bind(this),
            groupIndex: index
        }, true);

        this._toggleAllDayVisibility(true);
        this._applyCellTemplates(cellTemplates);
    }

    _renderGroupAllDayPanel() {
        if(this._isVerticalGroupedWorkSpace()) {
            const groupCount = this._getGroupCount();

            for(let i = 0; i < groupCount; i++) {
                this._renderAllDayPanel(i);
            }
        }
    }

    _getAllDayPanelCellClass(i, j) {
        const cellClass = ALL_DAY_TABLE_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, j + 1);
    }

    _getAllDayCellData(cell, rowIndex, columnIndex, groupIndex) {
        let startDate = this._getDateByCellIndexes(rowIndex, columnIndex);
        const cellGroupIndex = groupIndex || this._getGroupIndex(rowIndex, columnIndex);

        startDate = dateUtils.trimTime(startDate);

        const data = {
            startDate: startDate,
            endDate: startDate,
            allDay: true,
            groupIndex: cellGroupIndex,
        };

        const resourceManager = this.invoke('getResourceManager');
        const groupsArray = resourceManager.getCellGroups(
            cellGroupIndex,
            this.option('groups')
        );

        if(groupsArray.length) {
            data.groups = this._getGroupsObjectFromGroupsArray(groupsArray);
        }

        return {
            key: CELL_DATA,
            value: data
        };
    }

    _toggleAllDayVisibility(isUpdateScrollable) {
        const showAllDayPanel = this._isShowAllDayPanel();
        this._$allDayPanel.toggle(showAllDayPanel);
        this._$allDayTitle && this._$allDayTitle.toggleClass(ALL_DAY_TITLE_HIDDEN_CLASS, !showAllDayPanel);
        this.$element().toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, showAllDayPanel);

        this._changeAllDayVisibility();
        isUpdateScrollable && this._updateScrollable();
    }

    _changeAllDayVisibility() {
        this.$element().toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, !this.option('allDayExpanded') && this._isShowAllDayPanel());
    }

    _updateScrollable() {
        this._dateTableScrollable.update();

        this._headerScrollable && this._headerScrollable.update();
        this._sidebarScrollable && this._sidebarScrollable.update();
    }

    _renderTimePanel() {
        const repeatCount = this._groupedStrategy.calculateTimeCellRepeatCount();
        const startViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this.getStartViewDate());

        const _getTimeText = (i) => {
            // T410490: incorrectly displaying time slots on Linux
            const index = i % this._getRowCount();
            if(index % 2 === 0) {
                return dateLocalization.format(this._getTimeCellDateCore(startViewDate, i), 'shorttime');
            }
            return '';
        };

        const getTimeCellGroups = (rowIndex) => {
            if(!this._isVerticalGroupedWorkSpace()) {
                return {};
            }

            const groupIndex = this._getGroupIndex(rowIndex, 0);

            const resourceManager = this.invoke('getResourceManager');
            const groupsArray = resourceManager.getCellGroups(
                groupIndex,
                this.option('groups')
            );

            const groups = this._getGroupsObjectFromGroupsArray(groupsArray);

            return { groupIndex, groups };
        };

        this._renderTableBody({
            container: getPublicElement(this._$timePanel),
            rowCount: this._getTimePanelRowCount() * repeatCount,
            cellCount: 1,
            cellClass: this._getTimeCellClass.bind(this),
            rowClass: TIME_PANEL_ROW_CLASS,
            cellTemplate: this.option('timeCellTemplate'),
            getCellText: _getTimeText.bind(this),
            getCellDate: this._getTimeCellDate.bind(this),
            groupCount: this._getGroupCount(),
            allDayElements: this._insertAllDayRowsIntoDateTable() ? this._allDayTitles : undefined,
            getTemplateData: getTimeCellGroups.bind(this),
        });
    }

    _getTimePanelRowCount() {
        return this._getCellCountInDay();
    }

    _getCellCountInDay(skipRound) {
        const result = this._calculateDayDuration() / this.option('hoursInterval');
        return skipRound ? result : Math.ceil(result);
    }

    _calculateDayDuration() {
        return this.option('endDayHour') - this.option('startDayHour');
    }

    _getTimeCellClass(i) {
        const cellClass = TIME_PANEL_CELL_CLASS + ' ' + VERTICAL_SIZES_CLASS;

        return this._isVerticalGroupedWorkSpace()
            ? this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i, i)
            : cellClass;
    }

    _getTimeCellDate(i) {
        return this._getTimeCellDateCore(this.getStartViewDate(), i);
    }

    _getTimeCellDateCore(startViewDate, i) {
        const result = new Date(startViewDate);
        const timeCellDuration = Math.round(this.getCellDuration());
        const cellCountInDay = this._getCellCountInDay(true);

        result.setMilliseconds(result.getMilliseconds() + timeCellDuration * (i % cellCountInDay) - this._getTimeOffsetForStartViewDate());

        return result;
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
            getCellData: this._getCellData.bind(this),
            allDayElements: this._insertAllDayRowsIntoDateTable() ? this._allDayPanels : undefined,
            groupCount: groupCount,
            groupByDate: this.option('groupByDate')
        });
    }

    _insertAllDayRowsIntoDateTable() {
        return this._groupedStrategy.insertAllDayRowsIntoDateTable();
    }

    _getTotalCellCount(groupCount) {
        return this._groupedStrategy.getTotalCellCount(groupCount);
    }

    _getTotalRowCount(groupCount, includeAllDayPanelRows) {
        let result = this._groupedStrategy.getTotalRowCount(groupCount);

        if(includeAllDayPanelRows && groupCount > 1 && this.isAllDayPanelVisible) {
            result += groupCount;
        }

        return result;
    }

    _getCellData(cell, rowIndex, columnIndex) {
        const data = this._prepareCellData(rowIndex, columnIndex, cell);

        return {
            key: CELL_DATA,
            value: data
        };
    }

    _prepareCellData(rowIndex, columnIndex) {
        const startDate = this._getDateByCellIndexes(rowIndex, columnIndex);
        const endDate = this.calculateEndDate(startDate);
        const groupIndex = this._getGroupIndex(rowIndex, columnIndex);
        const data = {
            startDate: startDate,
            endDate: endDate,
            allDay: this._getTableAllDay(),
            groupIndex,
        };

        const resourceManager = this.invoke('getResourceManager');
        const groupsArray = resourceManager.getCellGroups(
            groupIndex,
            this.option('groups')
        );

        if(groupsArray.length) {
            data.groups = this._getGroupsObjectFromGroupsArray(groupsArray);
        }

        return data;
    }

    _getGroupIndex(rowIndex, columnIndex) {
        return this._groupedStrategy.getGroupIndex(rowIndex, columnIndex);
    }

    _getTableAllDay() {
        return false;
    }

    calculateEndDate(startDate) {
        const result = new Date(startDate);
        result.setMilliseconds(result.getMilliseconds() + Math.round(this._getInterval()));
        return result;
    }

    _getGroupCount() {
        const groups = this.option('groups');
        let result = 0;

        for(let i = 0, len = groups.length; i < len; i++) {
            if(!i) {
                result = groups[i].items.length;
            } else {
                result *= groups[i].items.length;
            }
        }

        return result;
    }

    _getAllGroups() {
        const groupCount = this._getGroupCount();
        const resourceManager = this.invoke('getResourceManager');

        return [...(new Array(groupCount))].map((_, groupIndex) => {
            const groupsArray = resourceManager.getCellGroups(
                groupIndex,
                this.option('groups')
            );

            return this._getGroupsObjectFromGroupsArray(groupsArray);
        });
    }

    _getGroupsObjectFromGroupsArray(groupsArray) {
        return groupsArray.reduce((currentGroups, { name, id }) => ({
            ...currentGroups,
            [name]: id,
        }), {});
    }

    _attachTablesEvents() {
        const element = this.$element();

        this._attachDragEvents(element);
        this._attachPointerEvents(element);
    }

    _detachDragEvents(element) {
        eventsEngine.off(element, DragEventNames.ENTER);
        eventsEngine.off(element, DragEventNames.LEAVE);
        eventsEngine.off(element, DragEventNames.DROP);
    }

    _attachDragEvents(element) {
        this._detachDragEvents(element);

        const onDragEnter = e => {
            this.removeDroppableCellClass();
            $(e.target).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
        };

        const onCheckDropTarget = (target, event) => {
            return !this._isOutsideScrollable(target, event);
        };

        eventsEngine.on(element, DragEventNames.ENTER, DRAG_AND_DROP_SELECTOR, { checkDropTarget: onCheckDropTarget }, onDragEnter);
        eventsEngine.on(element, DragEventNames.LEAVE, () => this.removeDroppableCellClass());
        eventsEngine.on(element, DragEventNames.DROP, DRAG_AND_DROP_SELECTOR, () => this.removeDroppableCellClass());
    }

    _attachPointerEvents(element) {
        let isPointerDown = false;

        eventsEngine.off(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
        eventsEngine.off(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);

        eventsEngine.on(element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME, DRAG_AND_DROP_SELECTOR, e => {
            if(isMouseEvent(e) && e.which === 1) {
                isPointerDown = true;
                this.$element().addClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
                eventsEngine.on(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME, () => {
                    isPointerDown = false;
                    this.$element().removeClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                });
            }
        });

        eventsEngine.on(element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME, DRAG_AND_DROP_SELECTOR, e => {
            if(isPointerDown && this._dateTableScrollable && !this._dateTableScrollable.option('scrollByContent')) {
                e.preventDefault();
                e.stopPropagation();
                this._moveToCell($(e.target), true);
            }
        });
    }

    _getDateTables() {
        return this._$dateTable.add(this._$allDayTable);
    }

    _getDateTable() {
        return this._$dateTable;
    }

    _getInterval() {
        if(this._interval === undefined) {
            this._interval = this.option('hoursInterval') * HOUR_MS;
        }
        return this._interval;
    }

    _getHeaderText(headerIndex) {
        return dateLocalization.format(this._getDateForHeaderText(headerIndex), this._getFormat());
    }

    _getDateForHeaderText(index) {
        return this._getDateByIndex(index);
    }

    _getDateByIndex() { return abstract(); }
    _getFormat() { return abstract(); }

    _calculateCellIndex(rowIndex, columnIndex) {
        return this._groupedStrategy.calculateCellIndex(rowIndex, columnIndex);
    }

    _renderTableBody(options, delayCellTemplateRendering) {
        let result = [];
        if(!delayCellTemplateRendering) {
            this._applyCellTemplates(
                tableCreator.makeTable(options)
            );
        } else {
            result = tableCreator.makeTable(options);
        }

        return result;
    }

    _removeAllDayElements() {
        this._$allDayTable && this._$allDayTable.remove();
        this._$allDayTitle && this._$allDayTitle.remove();
    }

    _cleanView() {
        this.cache.clear();
        this._cleanTableWidths();
        this._cleanAllowedPositions();
        this.cellsSelectionState.clearSelectedAndFocusedCells();
        if(!this.isRenovatedRender()) {
            this._$thead.empty();
            this._$dateTable.empty();
            this._$timePanel.empty();
            this._$groupTable.empty();

            this._$allDayTable?.empty();
            this._$sidebarTable?.empty();
        }

        this._shader?.clean();

        delete this._hiddenInterval;
        delete this._interval;
    }

    _clean() {
        eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
        this._disposeRenovatedComponents();

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

    getWorkArea() {
        return this._dateTableScrollable.$content();
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
        return this._dateTableScrollable._container();
    }

    getHeaderPanelHeight() {
        return this._$headerPanel && this._$headerPanel.outerHeight(true);
    }

    getTimePanelWidth() {
        return this._$timePanel && getBoundingRect(this._$timePanel.get(0)).width;
    }

    getGroupTableWidth() {
        return this._$groupTable ? this._$groupTable.outerWidth() : 0;
    }

    getWorkSpaceLeftOffset() {
        return this._groupedStrategy.getLeftOffset();
    }

    getGroupedStrategy() {
        return this._groupedStrategy;
    }

    _getCellCoordinatesByIndex(index) {
        const columnIndex = Math.floor(index / this._getRowCount());
        const rowIndex = index - this._getRowCount() * columnIndex;

        return {
            columnIndex,
            rowIndex
        };
    }

    _getDateByCellIndexes(rowIndex, columnIndex, patchedIndexes) {
        columnIndex = !patchedIndexes ? this._patchColumnIndex(columnIndex) : columnIndex;

        let firstViewDate = this.getStartViewDate();

        const isFirstViewDateDuringDST = firstViewDate.getHours() !== Math.floor(this.option('startDayHour'));

        if(isFirstViewDateDuringDST) {
            const dateWithCorrectHours = this._getFirstViewDateWithoutDST();

            firstViewDate = new Date(dateWithCorrectHours - toMs('day'));
        }

        const firstViewDateTime = firstViewDate.getTime();
        const millisecondsOffset = this._getMillisecondsOffset(rowIndex, columnIndex);
        const offsetByCount = this._getOffsetByCount(columnIndex);

        const currentDate = new Date(firstViewDateTime + millisecondsOffset + offsetByCount);

        let timeZoneDifference = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
        if(isFirstViewDateDuringDST) {
            timeZoneDifference = 0;
        }

        currentDate.setTime(currentDate.getTime() + timeZoneDifference);

        return currentDate;
    }

    _patchColumnIndex(columnIndex) {
        if(this.isGroupedByDate()) {
            columnIndex = Math.floor(columnIndex / this._getGroupCount());
        }

        return columnIndex;
    }

    _getOffsetByCount() {
        return 0;
    }

    _getMillisecondsOffset(rowIndex, columnIndex) {
        return this._getInterval() * this._calculateCellIndex(rowIndex, columnIndex) + this._calculateHiddenInterval(rowIndex, columnIndex);
    }

    _calculateHiddenInterval(rowIndex, columnIndex) {
        const dayCount = columnIndex % this._getCellCount();
        return dayCount * this._getHiddenInterval();
    }

    _getHiddenInterval() {
        if(this._hiddenInterval === undefined) {
            this._hiddenInterval = DAY_MS - this.getVisibleDayDuration();
        }
        return this._hiddenInterval;
    }

    _getIntervalBetween(currentDate, allDay) {
        const firstViewDate = this.getStartViewDate();

        const startDayTime = this.option('startDayHour') * HOUR_MS;
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
        const fullInterval = currentDate.getTime() - firstViewDate.getTime() - timeZoneOffset;
        const days = this._getDaysOfInterval(fullInterval, startDayTime);
        const weekendsCount = this._getWeekendsCount(days);
        let result = (days - weekendsCount) * DAY_MS;

        if(!allDay) {
            result = fullInterval - days * this._getHiddenInterval() - weekendsCount * this.getVisibleDayDuration();
        }

        return result;
    }


    _getWeekendsCount() {
        return 0;
    }

    _getDaysOfInterval(fullInterval, startDayTime) {
        return Math.floor((fullInterval + startDayTime) / DAY_MS);
    }

    _getGroupIndexes(appointmentResources) {
        let result = [];
        if(this._isGroupsSpecified(appointmentResources)) {
            const resourceManager = this.invoke('getResourceManager');
            const tree = resourceManager.createResourcesTree(this.option('groups'));

            result = resourceManager.getResourceTreeLeaves(tree, appointmentResources);
        }

        return result;
    }

    _updateIndex(index) {
        return index * this._getRowCount();
    }

    _getDroppableCell() {
        return this._getDateTables().find('.' + DATE_TABLE_DROPPABLE_CELL_CLASS);
    }

    _getWorkSpaceWidth() {
        return this.cache.get('workspaceWidth', () => {
            if(this._needCreateCrossScrolling()) {
                return getBoundingRect(this._$dateTable.get(0)).width;
            }

            return getBoundingRect(this.$element().get(0)).width - this.getTimePanelWidth();
        });
    }

    _getCellPositionByIndex(index, groupIndex, inAllDayRow) {
        const cellCoordinates = this._getCellCoordinatesByIndex(index);
        const $cell = this._getCellByCoordinates(cellCoordinates, groupIndex, inAllDayRow);

        return this._getCellPositionWithCache(
            $cell,
            cellCoordinates,
            groupIndex,
            inAllDayRow && !this._isVerticalGroupedWorkSpace(),
        );
    }

    _getCellPositionWithCache($cell, cellCoordinates, groupIndex, inAllDayPanel) {
        const result = this._getCellPosition(cellCoordinates, inAllDayPanel);

        this.setCellDataCache(cellCoordinates, groupIndex, $cell);

        if(result) {
            result.rowIndex = cellCoordinates.rowIndex;
            result.columnIndex = cellCoordinates.columnIndex;
        }

        return result;
    }

    _getCellPosition(cellCoordinates, isAllDayPanel) {
        const {
            dateTableCellsMeta,
            allDayPanelCellsMeta,
        } = this.getDOMElementsMetaData();
        const {
            columnIndex,
            rowIndex,
        } = cellCoordinates;

        const position = isAllDayPanel
            ? allDayPanelCellsMeta[columnIndex]
            : dateTableCellsMeta[rowIndex][columnIndex];

        const validPosition = { ...position };

        if(this.option('rtlEnabled')) {
            validPosition.left += position.width;
        }

        return validPosition;
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

    _getCells(allDay, direction) {
        const cellClass = allDay ? ALL_DAY_TABLE_CELL_CLASS : DATE_TABLE_CELL_CLASS;
        if(direction === 'vertical') {
            let result = [];
            for(let i = 1; ; i++) {
                const cells = this.$element().find(`tr .${cellClass}:nth-child(${i})`);
                if(!cells.length) break;
                result = result.concat(cells.toArray());
            }
            return $(result);
        } else {
            return this.$element().find('.' + cellClass);
        }
    }

    _getAllCells(allDay) {
        if(this._isVerticalGroupedWorkSpace()) {
            return this._$dateTable.find(`td:not(.${VIRTUAL_CELL_CLASS})`);
        }

        const cellClass = allDay && this.supportAllDayRow()
            ? ALL_DAY_TABLE_CELL_CLASS
            : DATE_TABLE_CELL_CLASS;

        return this.$element().find('.' + cellClass);
    }

    _setHorizontalGroupHeaderCellsHeight() {
        const height = getBoundingRect(this._$dateTable.get(0)).height;
        this._$groupTable.outerHeight(height);
    }

    _getGroupHeaderCells() {
        return this.$element().find('.' + GROUP_HEADER_CLASS);
    }

    _getScrollCoordinates(hours, minutes, date, groupIndex, allDay) {
        const currentDate = date || new Date(this.option('currentDate'));
        const startDayHour = this.option('startDayHour');
        const endDayHour = this.option('endDayHour');

        if(hours < startDayHour) {
            hours = startDayHour;
        }

        if(hours >= endDayHour) {
            hours = endDayHour - 1;
        }

        currentDate.setHours(hours, minutes, 0, 0);

        if(!this.isVirtualScrolling()) {
            return this.getCoordinatesByDate(currentDate, groupIndex, allDay);
        }

        const cell = this.viewDataProvider.findGlobalCellPosition(
            currentDate, groupIndex, allDay,
        );
        const { position, cellData } = cell;

        return this.virtualScrollingDispatcher.calculateCoordinatesByDataAndPosition(
            cellData,
            position,
            currentDate,
            this.isDateAndTimeView,
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

        if(isTargetInAllDayPanel && !isOutsideHorizontalScrollable) {
            return false;
        }

        return isOutsideVerticalScrollable || isOutsideHorizontalScrollable;
    }

    setCellDataCache(cellCoordinates, groupIndex, $cell) {
        const key = JSON.stringify({
            rowIndex: cellCoordinates.rowIndex,
            columnIndex: cellCoordinates.columnIndex,
            groupIndex: groupIndex
        });

        this.cache.set(
            key,
            this.getCellData($cell)
        );
    }

    setCellDataCacheAlias(appointment, geometry) {
        const key = JSON.stringify({
            rowIndex: appointment.rowIndex,
            columnIndex: appointment.columnIndex,
            groupIndex: appointment.groupIndex
        });

        const aliasKey = JSON.stringify({
            top: geometry.top,
            left: geometry.left
        });

        this.cache.set(
            aliasKey,
            this.cache.get(key)
        );
    }

    _cleanAllowedPositions() {
        this._maxAllowedVerticalPosition = [];
        this._maxAllowedPosition = [];
    }

    supportAllDayRow() {
        return true;
    }

    keepOriginalHours() {
        return false;
    }

    getSelectedCellData() {
        return this.cellsSelectionState.getSelectedCells();
    }

    getCellData($cell) {
        const cellData = this._getFullCellData($cell) || {};

        return extend(true, {}, {
            startDate: cellData.startDate,
            endDate: cellData.endDate,
            groups: cellData.groups,
            groupIndex: cellData.groupIndex,
            allDay: cellData.allDay,
        });
    }

    _getFullCellData($cell) {
        const currentCell = $cell[0];
        if(currentCell) {
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

        return cellData ? cellData : undefined;
    }

    _getHorizontalMax(groupIndex) {
        if(this.isVirtualScrolling()) {
            return this.getMaxAllowedPosition(groupIndex);
        }

        const correctedGroupIndex = this.isGroupedByDate()
            ? this._getGroupCount() - 1
            : groupIndex;

        return this.getMaxAllowedPosition(correctedGroupIndex);
    }

    getCoordinatesByDate(date, groupIndex, inAllDayRow) {
        const validGroupIndex = groupIndex || 0;

        const cellInfo = { groupIndex: validGroupIndex, startDate: date, isAllDay: inAllDayRow };
        const positionByMap = this.viewDataProvider.findCellPositionInMap(cellInfo);
        if(!positionByMap) {
            return undefined;
        }

        const $cell = this._dom_getDateCell(positionByMap);
        const position = this._getCellPositionWithCache(
            $cell,
            positionByMap,
            validGroupIndex,
            inAllDayRow && !this._isVerticalGroupedWorkSpace(),
        );

        const shift = this.getPositionShift(inAllDayRow ? 0 : this.getTimeShift(date), inAllDayRow);
        const horizontalHMax = this._getHorizontalMax(validGroupIndex, date);

        return {
            cellPosition: position.left + shift.cellPosition,
            top: position.top + shift.top,
            left: position.left + shift.left,
            rowIndex: position.rowIndex,
            columnIndex: position.columnIndex,
            hMax: horizontalHMax,
            vMax: this.getVerticalMax(validGroupIndex),
            groupIndex: validGroupIndex
        };
    }

    getVerticalMax(groupIndex) {
        return this._groupedStrategy.getVerticalMax(groupIndex);
    }

    _getOffsetByAllDayPanel(groupIndex) {
        return this._groupedStrategy._getOffsetByAllDayPanel(groupIndex);
    }

    _getGroupTop(groupIndex) {
        return this._groupedStrategy._getGroupTop(groupIndex);
    }

    isGroupedByDate() {
        return this.option('groupByDate')
            && this._isHorizontalGroupedWorkSpace()
            && this._getGroupCount() > 0;
    }

    getCellIndexByDate(date, inAllDayRow) {
        const timeInterval = inAllDayRow ? 24 * 60 * 60 * 1000 : this._getInterval();
        const dateTimeStamp = this._getIntervalBetween(date, inAllDayRow) + this._getTimeOffsetForStartViewDate();

        let index = Math.floor(dateTimeStamp / timeInterval);

        if(inAllDayRow) {
            index = this._updateIndex(index);
        }

        if(index < 0) {
            index = 0;
        }

        return index;
    }

    getPositionShift(timeShift, isAllDay) {
        return {
            top: timeShift * this.getCellHeight(),
            left: 0,
            cellPosition: 0
        };
    }

    getTimeShift(date) {
        const currentDayStart = new Date(date);

        const cellDuration = this.getCellDuration();
        const currentDayEndHour = new Date(new Date(date).setHours(this.option('endDayHour'), 0, 0));

        if(date.getTime() <= currentDayEndHour.getTime()) {
            currentDayStart.setHours(this.option('startDayHour'), 0, 0, 0);
        }

        const timeZoneDifference = dateUtils.getTimezonesDifference(date, currentDayStart);
        const currentDateTime = date.getTime();
        const currentDayStartTime = currentDayStart.getTime();
        const minTime = this._firstViewDate.getTime();

        return (currentDateTime > minTime)
            ? ((currentDateTime - currentDayStartTime + timeZoneDifference) % cellDuration) / cellDuration
            : 0;
    }

    _isSkippedData() { return false; }

    getCoordinatesByDateInGroup(startDate, appointmentResources, inAllDayRow, groupIndex) {
        const result = [];

        if(this._isSkippedData(startDate)) {
            return result;
        }

        let groupIndices = [groupIndex];

        if(!isDefined(groupIndex)) {
            groupIndices = this._getGroupCount()
                ? this._getGroupIndexes(appointmentResources)
                : [0];
        }

        groupIndices.forEach(groupIndex => {
            const coordinates = this.getCoordinatesByDate(startDate, groupIndex, inAllDayRow);
            coordinates && result.push(coordinates);
        });

        return result;
    }

    getDroppableCellIndex() {
        const $droppableCell = this._getDroppableCell();
        const $row = $droppableCell.parent();
        const rowIndex = $row.index();

        return rowIndex * $row.find('td').length + $droppableCell.index();
    }

    getDataByDroppableCell() {
        const cellData = this.getCellData($(this._getDroppableCell()));
        const allDay = cellData.allDay;
        const startDate = cellData.startDate;
        const endDate = cellData.endDate;

        return {
            startDate,
            endDate,
            allDay,
            groups: cellData.groups
        };
    }

    getDateRange() {
        return [
            this.getStartViewDate(),
            this.getEndViewDateByEndDayHour()
        ];
    }

    getCellWidth() {
        return this.cache.get('cellWidth', () => {
            const cell = this._getCells().first().get(0);
            return cell && getBoundingRect(cell).width;
        });
    }

    getCellMinWidth() {
        return DATE_TABLE_MIN_CELL_WIDTH;
    }

    getRoundedCellWidth(groupIndex, startIndex, cellCount) {
        if(groupIndex < 0) {
            return 0;
        }

        const $row = this.$element().find(`.${DATE_TABLE_ROW_CLASS}`).eq(0);
        let width = 0;
        const $cells = $row.find('.' + DATE_TABLE_CELL_CLASS);
        const totalCellCount = this._getCellCount() * groupIndex;

        cellCount = cellCount || this._getCellCount();

        if(!isDefined(startIndex)) {
            startIndex = totalCellCount;
        }

        for(let i = startIndex; i < totalCellCount + cellCount; i++) {
            width = width + getBoundingRect($($cells).eq(i).get(0)).width;
        }

        return width / (totalCellCount + cellCount - startIndex);
    }

    getCellHeight(useCache = true) {
        const callbackResult = () => {
            const cell = this._getCells().first().get(0);
            return cell && getBoundingRect(cell).height;
        };

        return useCache
            ? this.cache.get('cellHeight', callbackResult)
            : callbackResult();
    }

    getAllDayHeight() {
        const cell = this._getCells(true).first().get(0);

        return this._isShowAllDayPanel() ? cell && getBoundingRect(cell).height || 0 : 0;
    }

    getAllDayOffset() {
        return this._groupedStrategy.getAllDayOffset();
    }

    getMaxAllowedPosition(groupIndex) {
        const validGroupIndex = groupIndex || 0;

        return this.getMaxAllowedHorizontalPosition(validGroupIndex);
    }

    getMaxAllowedHorizontalPosition(groupIndex) {
        const getMaxPosition = columnIndex => {
            const cell = this._$dateTable
                .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
                .first()
                .find(`td:not(.${VIRTUAL_CELL_CLASS})`)
                .get(columnIndex);

            let maxPosition = $(cell).position().left;
            if(!this.option('rtlEnabled')) {
                maxPosition += getBoundingRect(cell).width;
            }

            this._maxAllowedPosition[groupIndex] = Math.round(maxPosition);
        };

        if(!this._maxAllowedPosition[groupIndex]) {
            const { columnIndex } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
            getMaxPosition(columnIndex);
        }

        return this._maxAllowedPosition[groupIndex];
    }

    getMaxAllowedVerticalPosition(groupIndex) {
        const getMaxPosition = rowIndex => {
            const row = this._$dateTable
                .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
                .get(rowIndex);

            let maxPosition = $(row).position().top + getBoundingRect(row).height;

            // TODO remove while refactoring dual calculcations.
            // Should decrease allDayPanel amount due to the dual calculation corrections.
            if(this.isGroupedAllDayPanel()) {
                maxPosition -= (groupIndex + 1) * this.getAllDayHeight();
            }

            this._maxAllowedVerticalPosition[groupIndex] = Math.round(maxPosition);
        };

        if(!this._maxAllowedVerticalPosition[groupIndex]) {
            const { rowIndex } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
            getMaxPosition(rowIndex);
        }

        return this._maxAllowedVerticalPosition[groupIndex];
    }

    getFixedContainer() {
        return this._$fixedContainer;
    }

    getAllDayContainer() {
        return this._$allDayContainer;
    }

    // NOTE: refactor leftIndex calculation
    getCellIndexByCoordinates(coordinates, allDay) {
        const cellCount = this._getTotalCellCount(this._getGroupCount());
        const cellWidth = Math.floor(this._getWorkSpaceWidth() / cellCount);
        const cellHeight = allDay ? this.getAllDayHeight() : this.getCellHeight();
        const leftOffset = this._isRTL() || this.option('crossScrollingEnabled') ? 0 : this.getWorkSpaceLeftOffset();
        const topIndex = Math.floor(Math.floor(coordinates.top) / Math.floor(cellHeight));
        let leftIndex = Math.floor((coordinates.left + 5 - leftOffset) / cellWidth);

        if(this._isRTL()) {
            leftIndex = cellCount - leftIndex - 1;
        }

        return cellCount * topIndex + leftIndex;
    }

    getStartViewDate() {
        return this._firstViewDate;
    }

    getEndViewDate() {
        const dateOfLastViewCell = this.getDateOfLastViewCell();
        const endDateOfLastViewCell = this.calculateEndViewDate(dateOfLastViewCell);

        return this._adjustEndViewDateByDaylightDiff(dateOfLastViewCell, endDateOfLastViewCell);
    }

    getEndViewDateByEndDayHour() {
        const dateOfLastViewCell = this.getDateOfLastViewCell();
        const endTime = dateUtils.dateTimeFromDecimal(this.option('endDayHour'));

        const endDateOfLastViewCell = new Date(dateOfLastViewCell.setHours(endTime.hours, endTime.minutes));

        return this._adjustEndViewDateByDaylightDiff(dateOfLastViewCell, endDateOfLastViewCell);

    }

    calculateEndViewDate(dateOfLastViewCell) {
        return new Date(dateOfLastViewCell.getTime() + this.getCellDuration());
    }

    _adjustEndViewDateByDaylightDiff(startDate, endDate) {
        const daylightDiff = timeZoneUtils.getDaylightOffsetInMs(startDate, endDate);

        const endDateOfLastViewCell = new Date(endDate.getTime() - daylightDiff);

        return new Date(endDateOfLastViewCell.getTime() - this._getEndViewDateTimeDiff());
    }

    _getEndViewDateTimeDiff() {
        return toMs('minute');
    }

    getDateOfLastViewCell() {
        const rowIndex = this._getRowCount() - 1;
        let columnIndex = this._getCellCount();

        if(this.isGroupedByDate()) {
            columnIndex = columnIndex * this._getGroupCount() - 1;
        } else {
            columnIndex = columnIndex - 1;
        }

        return this._getDateByCellIndexes(rowIndex, columnIndex, true);
    }

    getCellDuration() {
        return 3600000 * this.option('hoursInterval');
    }

    getIntervalDuration(allDay) {
        return allDay ? toMs('day') : this.getCellDuration();
    }

    getVisibleDayDuration() {
        return this.option('hoursInterval') * this._getCellCountInDay() * HOUR_MS;
    }

    getGroupBounds(coordinates) {
        const cellCount = this._getCellCount();
        const $cells = this._getCells();
        const cellWidth = this.getCellWidth();

        const groupedDataMap = this.viewDataProvider.groupedDataMap;
        const result = this._groupedStrategy
            .getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates, groupedDataMap);

        if(this._isRTL()) {
            const startOffset = result.left;

            result.left = result.right - cellWidth * 2;
            result.right = startOffset + cellWidth * 2;
        }

        return result;
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

    getVisibleBounds() {
        const result = {};
        const $scrollable = this.getScrollable().$element();
        const cellHeight = this.getCellHeight();
        const scrolledCellCount = this.getScrollableScrollTop() / cellHeight;
        const totalCellCount = scrolledCellCount + $scrollable.height() / cellHeight;

        result.top = {
            hours: Math.floor(scrolledCellCount * this.option('hoursInterval')) + this.option('startDayHour'),
            minutes: scrolledCellCount % 2 ? 30 : 0
        };

        result.bottom = {
            hours: Math.floor(totalCellCount * this.option('hoursInterval')) + this.option('startDayHour'),
            minutes: Math.floor(totalCellCount) % 2 ? 30 : 0
        };

        return result;
    }

    updateScrollPosition(date, groups, allDay = false) {
        const timeZoneCalculator = getTimeZoneCalculator(this.option('key'));
        const newDate = timeZoneCalculator.createDate(date, { path: 'toGrid' });
        const inAllDayRow = allDay && this.isAllDayPanelVisible;

        if(this.needUpdateScrollPosition(newDate, groups, inAllDayRow)) {
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

            if(((!inAllDayRow && cellStartTime <= time
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
        if(scrollableScrollTop % cellHeight !== 0) {
            scrolledRowCount += 1;
        }

        // TODO horizontal v-scrolling
        const fullScrolledColumnCount = scrollableScrollLeft / cellWidth;
        let scrolledColumnCount = Math.floor(fullScrolledColumnCount);
        if(scrollableScrollLeft % cellWidth !== 0) {
            scrolledColumnCount += 1;
        }

        const rowCount = Math.floor(fullScrolledRowCount + $scrollable.height() / cellHeight);
        const columnCount = Math.floor(fullScrolledColumnCount + $scrollable.width() / cellWidth);

        const $cells = this._getAllCells(inAllDayRow);
        const result = [];

        $cells.each(function(index) {
            const $cell = $(this);
            const columnIndex = index % totalColumnCount;
            const rowIndex = index / totalColumnCount;

            if(scrolledColumnCount <= columnIndex
                && columnIndex < columnCount
                && scrolledRowCount <= rowIndex
                && rowIndex < rowCount) {
                result.push($cell);
            }
        });

        return result;
    }

    getGroupWidth(groupIndex) {
        let result = this._getCellCount() * this.getCellWidth();
        // TODO: refactor after deleting old render
        if(this.isVirtualScrolling()) {
            const groupedData = this.viewDataProvider.groupedDataMap.dateTableGroupedMap;
            const groupLength = groupedData[groupIndex][0].length;

            result = groupLength * this.getCellWidth();
        }

        const position = this.getMaxAllowedPosition(groupIndex);
        const currentPosition = position[groupIndex];

        if(currentPosition) {
            if(this._isRTL()) {
                result = currentPosition - position[groupIndex + 1];
            } else {
                if(groupIndex === 0) {
                    result = currentPosition;
                } else {
                    result = currentPosition - position[groupIndex - 1];
                }
            }
        }

        return result;
    }

    scrollToTime(hours, minutes, date) {
        if(!this._isValidScrollDate(date)) {
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
        if(!this._isValidScrollDate(date, throwWarning)) {
            return;
        }

        const groupIndex = this._getGroupCount() && groups
            ? this._getGroupIndexByResourceId(groups)
            : 0;
        const isScrollToAllDay = allDay && this.isAllDayPanelVisible;

        const coordinates = this._getScrollCoordinates(
            date.getHours(), date.getMinutes(), date, groupIndex, isScrollToAllDay,
        );

        const scrollable = this.getScrollable();
        const $scrollable = scrollable.$element();

        const offset = this.option('rtlEnabled')
            ? this.getCellWidth()
            : 0;
        const scrollableHeight = $scrollable.height();
        const scrollableWidth = $scrollable.width();
        const cellWidth = this.getCellWidth();
        const cellHeight = this.getCellHeight();

        const xShift = (scrollableWidth - cellWidth) / 2;
        const yShift = (scrollableHeight - cellHeight) / 2;

        const left = coordinates.left - scrollable.scrollLeft() - xShift - offset;
        let top = coordinates.top - scrollable.scrollTop() - yShift;
        if(isScrollToAllDay && !this._isVerticalGroupedWorkSpace()) {
            top = 0;
        }

        if(this.option('templatesRenderAsynchronously')) {
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

        if(date < min || date > max) {
            throwWarning && errors.log('W1008', date);
            return false;
        }

        return true;
    }

    needApplyCollectorOffset() {
        return false;
    }

    initDragBehavior(scheduler) {
        if(!this.dragBehavior && scheduler) {
            this.dragBehavior = new AppointmentDragBehavior(scheduler);

            this._createDragBehavior(this.getWorkArea());
            this._createDragBehavior(this.getAllDayContainer());
            this._createDragBehavior(this._$allDayPanel);
        }
    }

    _createDragBehavior($element) {
        const getItemData = (itemElement, appointments) => appointments._getItemData(itemElement);
        const getItemSettings = ($itemElement) => $itemElement.data(APPOINTMENT_SETTINGS_KEY);

        const options = {
            getItemData,
            getItemSettings,
        };

        this._createDragBehaviorBase($element, options);
    }

    _createDragBehaviorBase($element, options) {
        const container = this.$element().find(`.${FIXED_CONTAINER_CLASS}`);

        const element = this.$element();

        const attachGeneralEvents = () => this._attachDragEvents(element);
        const detachGeneralEvents = () => this._detachDragEvents(element);

        const isDefaultDraggingMode = this.option('draggingMode') === 'default';

        this.dragBehavior.addTo($element, createDragBehaviorConfig(
            container,
            isDefaultDraggingMode,
            this.dragBehavior,
            attachGeneralEvents,
            detachGeneralEvents,
            () => this._getDroppableCell(),
            () => this.removeDroppableCellClass(),
            () => this.getCellWidth(),
            options)
        );
    }

    _isApplyCompactAppointmentOffset() {
        return this._supportCompactDropDownAppointments();
    }

    _supportCompactDropDownAppointments() {
        return true;
    }

    _formatWeekday(date) {
        return formatWeekday(date);
    }

    _formatWeekdayAndDay(date) {
        return formatWeekday(date) + ' ' + dateLocalization.format(date, 'day');
    }

    removeDroppableCellClass($cellElement) {
        ($cellElement || this._getDroppableCell()).removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
    }

    _getCoordinatesByCell($cell) {
        const columnIndex = $cell.index() - this.virtualScrollingDispatcher.leftVirtualCellsCount;
        let rowIndex = $cell.parent().index();
        const isAllDayCell = this._hasAllDayClass($cell);
        const isVerticalGrouping = this._isVerticalGroupedWorkSpace();

        if(!(isAllDayCell && !isVerticalGrouping)) {
            rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
        }

        return { rowIndex, columnIndex };
    }

    _isShowAllDayPanel() {
        return this.option('showAllDayPanel');
    }

    updateAppointments() {
        this.invoke('renderAppointments');
        this.dragBehavior?.updateDragSource();
    }

    _getTimePanelCells() {
        return this.$element().find(`.${TIME_PANEL_CELL_CLASS}`);
    }

    _getRDateTableProps() {
        return ({
            viewData: this.viewDataProvider.viewData,
            dataCellTemplate: this.option('dataCellTemplate'),
            addDateTableClass: !this.option('crossScrollingEnabled') || this.isVirtualScrolling(),
            groupOrientation: this.option('groupOrientation'),
        });
    }

    _getTimeOffsetForStartViewDate() {
        const startViewDate = this.getStartViewDate();
        const startDayHour = Math.floor(this.option('startDayHour'));
        const isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);

        if(isDSTChange && startDayHour !== startViewDate.getHours()) {
            return toMs('hour');
        }

        return 0;
    }

    _getFirstViewDateWithoutDST() {
        const newFirstViewDate = timeZoneUtils.getDateWithoutTimezoneChange(this._firstViewDate);
        newFirstViewDate.setHours(this.option('startDayHour'));

        return newFirstViewDate;
    }

    _updateSelectedCellDataOption(selectedCellData) {
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

        if(!position) {
            return undefined;
        }

        return allDay && !this._isVerticalGroupedWorkSpace()
            ? this._dom_getAllDayPanelCell(position.columnIndex)
            : this._dom_getDateCell(position);
    }

    // Must replace all DOM manipulations
    getDOMElementsMetaData() {
        return this.cache.get('cellElementsMeta', () => {
            const dateTableCells = this._getAllCells(false);
            const columnsCount = this.viewDataProvider.getColumnsCount();

            const dateTable = this._getDateTable();

            // We should use getBoundingClientRect in renovation
            const dateTableRect = getBoundingRect(dateTable.get(0));

            const dateTableCellsMeta = [];
            const allDayPanelCellsMeta = [];

            dateTableCells.each((index, cell) => {
                const rowIndex = Math.floor(index / columnsCount);

                if(dateTableCellsMeta.length === rowIndex) {
                    dateTableCellsMeta.push([]);
                }

                this._addCellMetaData(dateTableCellsMeta[rowIndex], cell, dateTableRect);
            });

            if(this.isAllDayPanelVisible && !this._isVerticalGroupedWorkSpace()) {
                const allDayCells = this._getAllCells(true);

                const allDayAppointmentContainer = this.getAllDayContainer();
                const allDayPanelRect = getBoundingRect(allDayAppointmentContainer.get(0));

                allDayCells.each((_, cell) => {
                    this._addCellMetaData(allDayPanelCellsMeta, cell, allDayPanelRect);
                });
            }

            return {
                dateTableCellsMeta,
                allDayPanelCellsMeta,
            };
        });
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
}

const createDragBehaviorConfig = (
    container,
    isDefaultDraggingMode,
    dragBehavior,
    attachGeneralEvents,
    detachGeneralEvents,
    getDroppableCell,
    removeDroppableCellClass,
    getCellWidth,
    options) => {

    const state = {
        dragElement: undefined,
        itemData: undefined,
    };

    const createDragAppointment = (itemData, settings, appointments) => {
        const appointmentIndex = appointments.option('items').length;

        settings.isCompact = false;
        settings.virtual = false;

        const items = appointments._renderItem(appointmentIndex, {
            itemData,
            settings: [settings]
        });

        return items[0];
    };

    const onDragStart = e => {
        if(!isDefaultDraggingMode) {
            detachGeneralEvents();
        }

        const canceled = e.cancel;
        const event = e.event;
        const $itemElement = $(e.itemElement);
        const appointments = e.component._appointments;

        state.itemData = options.getItemData(e.itemElement, appointments);
        const settings = options.getItemSettings($itemElement, e);
        const initialPosition = options.initialPosition;

        if(state.itemData && !state.itemData.disabled) {
            event.data = event.data || {};
            if(!canceled) {
                if(!settings.isCompact) {
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

    const onDragMove = () => {
        if(isDefaultDraggingMode) {
            return;
        }

        const MOUSE_IDENT = 10;

        const appointmentWidth = $(state.dragElement).width();
        const isWideAppointment = appointmentWidth > getCellWidth();

        const dragElementContainer = $(state.dragElement).parent();
        const boundingRect = getBoundingRect(dragElementContainer.get(0));

        const newX = boundingRect.left + MOUSE_IDENT;
        const newY = boundingRect.top + MOUSE_IDENT;

        const elements = isWideAppointment ?
            getElementsFromPoint(newX, newY) :
            getElementsFromPoint(newX + appointmentWidth / 2, newY);

        const droppableCell = elements.filter(el => el.className.indexOf(DATE_TABLE_CELL_CLASS) > -1 || el.className.indexOf(ALL_DAY_TABLE_CELL_CLASS) > -1)[0];

        if(droppableCell) {
            const oldDroppableCell = getDroppableCell();

            if(!oldDroppableCell.is(droppableCell)) {
                removeDroppableCellClass();
            }

            $(droppableCell).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
        }
    };

    const onDragEnd = e => {
        if(!isDefaultDraggingMode) {
            attachGeneralEvents();
        }

        if(state.itemData && !state.itemData.disabled) {
            dragBehavior.onDragEnd(e);
        }

        state.dragElement?.remove();
        removeDroppableCellClass();
    };

    const cursorOffset = options.isSetCursorOffset
        ? () => {
            const $dragElement = $(state.dragElement);
            return {
                x: $dragElement.width() / 2,
                y: $dragElement.height() / 2
            };
        }
        : undefined;

    return {
        container,
        dragTemplate: () => state.dragElement,
        onDragStart,
        onDragMove,
        onDragEnd,
        cursorOffset,
        filter: options.filter
    };
};

export default SchedulerWorkSpace;
