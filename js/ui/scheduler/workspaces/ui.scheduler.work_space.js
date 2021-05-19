import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import dateUtils from '../../../core/utils/date';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { getPublicElement } from '../../../core/element';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
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
import { APPOINTMENT_SETTINGS_KEY, FIXED_CONTAINER_CLASS, VIRTUAL_CELL_CLASS } from '../constants';
import timeZoneUtils from '../utils.timeZone';
import WidgetObserver from '../base/widgetObserver';
import { resetPosition, locate } from '../../../animation/translator';

import VirtualScrollingDispatcher from './ui.scheduler.virtual_scrolling';
import ViewDataProvider from './view_data_provider';

import dxrDateTableLayout from '../../../renovation/ui/scheduler/workspaces/base/date_table/layout.j';
import dxrAllDayPanelLayout from '../../../renovation/ui/scheduler/workspaces/base/date_table/all_day_panel/layout.j';
import dxrAllDayPanelTitle from '../../../renovation/ui/scheduler/workspaces/base/date_table/all_day_panel/title.j';
import dxrTimePanelTableLayout from '../../../renovation/ui/scheduler/workspaces/base/time_panel/layout.j';
import dxrGroupPanel from '../../../renovation/ui/scheduler/workspaces/base/group_panel/group_panel.j';
import dxrDateHeader from '../../../renovation/ui/scheduler/workspaces/base/header_panel/layout.j';
import VirtualSelectionState from './virtual_selection_state';

import { cache } from './cache';

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

const TIME_PANEL_CLASS = 'dx-scheduler-time-panel';
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
const GROUP_ROW_CLASS = 'dx-scheduler-group-row';
const GROUP_HEADER_CLASS = 'dx-scheduler-group-header';
const GROUP_HEADER_CONTENT_CLASS = 'dx-scheduler-group-header-content';

const DATE_TABLE_CLASS = 'dx-scheduler-date-table';
const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const DATE_TABLE_ROW_CLASS = 'dx-scheduler-date-table-row';
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

const DATE_TABLE_CELL_BORDER = 1;

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
    get virtualSelectionState() {
        if(!this._virtualSelectionState) {
            this._virtualSelectionState = new VirtualSelectionState(this.viewDataProvider);
        }

        return this._virtualSelectionState;
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

            if(this._selectedCells && this._selectedCells.length) {
                const $itemElement = $(this.option('focusedElement'));
                const $cellElement = $($itemElement.length ? $itemElement : this._selectedCells);

                e.target = this._selectedCells;
                this._showPopup = true;
                this._cellClickAction({ event: e, cellElement: $(this._selectedCells), cellData: this.getCellData($cellElement) });
            }
        };
        const arrowPressHandler = function(e, cell) {
            e.preventDefault();
            e.stopPropagation();
            this._moveToCell(cell, e.shiftKey);
        };

        return extend(super._supportedKeys(), {
            enter: clickHandler,
            space: clickHandler,
            downArrow: function(e) {
                const $cell = this._getCellFromNextRow('next', e.shiftKey);

                arrowPressHandler.call(this, e, $cell);
            },

            upArrow: function(e) {
                const $cell = this._getCellFromNextRow('prev', e.shiftKey);

                arrowPressHandler.call(this, e, $cell);
            },

            rightArrow: function(e) {
                const $rightCell = this._getCellFromNextColumn('next', e.shiftKey);

                arrowPressHandler.call(this, e, $rightCell);
            },

            leftArrow: function(e) {
                const $leftCell = this._getCellFromNextColumn('prev', e.shiftKey);

                arrowPressHandler.call(this, e, $leftCell);
            }
        });
    }

    _dispose() {
        super._dispose();

        this.virtualScrollingDispatcher?.dispose();
    }

    _isRTL() {
        return this.option('rtlEnabled');
    }

    _getFocusedCell() {
        return this._$focusedCell ||
            this._$dateTable.find('.' + DATE_TABLE_CELL_CLASS).eq(0);
    }

    _getAllFocusedCells() {
        return this._selectedCells ||
            this._$dateTable.find('.' + DATE_TABLE_CELL_CLASS).eq(0);
    }

    _getCellFromNextRow(direction) {
        const $currentCell = this._$focusedCell;

        if(isDefined($currentCell)) {
            const cellIndex = $currentCell.index();
            const $row = $currentCell.parent();
            let $cell = $row[direction]().children().eq(cellIndex);

            $cell = this._checkForViewBounds($cell);
            return $cell;
        }
    }

    _checkForViewBounds($item) {
        if(!$item.length) {
            $item = this._$focusedCell;
        }
        return $item;
    }

    _getCellFromNextColumn(direction, isMultiSelection) {
        const $focusedCell = this._$focusedCell;
        if(!isDefined($focusedCell)) {
            return;
        }

        let $nextCell;
        const $row = $focusedCell.parent();
        const nextColumnDirection = direction;
        const isDirectionNext = direction === 'next';
        const previousColumnDirection = isDirectionNext ? 'prev' : 'next';
        const isRTL = this._isRTL();

        const groupCount = this._getGroupCount();
        const isHorizontalGrouping = this._isHorizontalGroupedWorkSpace();
        const isGroupedByDate = this.isGroupedByDate();

        const totalCellCount = this._getTotalCellCount(groupCount);
        const rowCellCount = isMultiSelection && (!isGroupedByDate)
            ? this._getCellCount() : totalCellCount;

        const lastIndexInRow = rowCellCount - 1;
        const currentIndex = $focusedCell.index();

        const step = isGroupedByDate && isMultiSelection ? groupCount : 1;
        const isEdgeCell = this._isEdgeCell(
            isHorizontalGrouping ? totalCellCount - 1 : lastIndexInRow, currentIndex, step, direction,
        );

        const sign = isRTL ? 1 : -1;
        const directionSign = isDirectionNext ? 1 : -1;
        const resultingSign = sign * directionSign;

        if(isEdgeCell || (isMultiSelection && this._isGroupEndCell($focusedCell, direction))) {
            const nextIndex = currentIndex - resultingSign * step + resultingSign * rowCellCount;
            const rowDirection = isRTL ? previousColumnDirection : nextColumnDirection;

            $nextCell = $row[rowDirection]().children().eq(nextIndex);
            $nextCell = this._checkForViewBounds($nextCell);
        } else {
            $nextCell = $row.children().eq(currentIndex - resultingSign * step);
        }

        return $nextCell;
    }

    _isEdgeCell(lastIndexInRow, cellIndex, step, direction) {
        const isRTL = this._isRTL();
        const isDirectionNext = direction === 'next';

        const rightEdgeCellIndex = isRTL ? 0 : lastIndexInRow;
        const leftEdgeCellIndex = isRTL ? lastIndexInRow : 0;
        const edgeCellIndex = isDirectionNext ? rightEdgeCellIndex : leftEdgeCellIndex;

        const isNextCellGreaterThanEdge = (cellIndex + step) > edgeCellIndex;
        const isNextCellLessThanEdge = (cellIndex - step) < edgeCellIndex;

        const isRightEdgeCell = isRTL ? isNextCellLessThanEdge : isNextCellGreaterThanEdge;
        const isLeftEdgeCell = isRTL ? isNextCellGreaterThanEdge : isNextCellLessThanEdge;

        return isDirectionNext ? isRightEdgeCell : isLeftEdgeCell;
    }

    _isGroupEndCell($cell, direction) {
        if(this.isGroupedByDate()) {
            return false;
        }

        const isDirectionNext = direction === 'next';
        const cellsInRow = this._getCellCount();
        const currentCellIndex = $cell.index();
        const result = currentCellIndex % cellsInRow;
        const endCell = isDirectionNext ? cellsInRow - 1 : 0;
        const startCell = isDirectionNext ? 0 : cellsInRow - 1;

        return this._isRTL() ? result === startCell : result === endCell;
    }

    _moveToCell($cell, isMultiSelection) {
        isMultiSelection = isMultiSelection && this.option('allowMultipleCellSelection');

        this._setSelectedAndFocusedCells($cell, isMultiSelection);
        this._dateTableScrollable.scrollToElement($cell);
    }

    _setSelectedAndFocusedCells($cell, isMultiSelection) {
        if(!isDefined($cell) || !$cell.length) {
            return;
        }

        const updateViewData = this.isVirtualScrolling();

        let $correctedCell = $cell;
        if(isMultiSelection) {
            $correctedCell = this._correctCellForGroup($cell);
        }
        if($correctedCell.hasClass(DATE_TABLE_FOCUSED_CELL_CLASS)) {
            return;
        }

        this._setSelectedCells($correctedCell, isMultiSelection);
        this._setFocusedCell($correctedCell, updateViewData);
    }

    _setFocusedCell($cell, updateViewData = false) {
        this._releaseFocusedCell();
        let $correctedCell = $cell;

        if(updateViewData) {
            const { rowIndex, columnIndex } = this._getCoordinatesByCell($cell);
            const isAllDayCell = this._hasAllDayClass($cell);
            this.virtualSelectionState.setFocusedCell(rowIndex, columnIndex, isAllDayCell);
            const focusedCell = this.virtualSelectionState.getFocusedCell();
            const { cellData, coordinates } = focusedCell;
            const { allDay } = cellData;

            $correctedCell = allDay && !this._isVerticalGroupedWorkSpace()
                ? this._dom_getAllDayPanelCell(coordinates.cellIndex)
                : this._dom_getDateCell(coordinates);
        }

        this._toggleFocusedCellClass(true, $correctedCell);
        this._$focusedCell = $correctedCell;
    }

    _setSelectedCells($firstCell, isMultiSelection) {
        this._releaseSelectedCells();
        this._selectedCells = [];

        if(this.isVirtualScrolling()) {
            this._setSelectedCellsInVirtualMode($firstCell, isMultiSelection);
        } else {
            this._setSelectedCellsInStandardMode($firstCell, isMultiSelection);
        }

        const $selectedCells = $(this._selectedCells);

        this._toggleFocusClass(true, $selectedCells);
        this.setAria('label', 'Add appointment', $selectedCells);

        const selectedCellData = this.getSelectedCellData().map(({
            startDate, endDate, allDay, groups, groupIndex,
        }) => ({
            startDate,
            endDate,
            allDay,
            groups,
            groupIndex: groupIndex || 0,
        }));

        this.option('selectedCellData', selectedCellData);
        this._selectionChangedAction({ selectedCellData });
    }

    _setSelectedCellsInStandardMode($firstCell, isMultiSelection) {
        if(isMultiSelection) {
            const $previousCell = this._$prevCell;
            const orientation = this.option('type') === 'day'
                    && (!this.option('groups').length
                    || this.option('groupOrientation') === 'vertical')
                ? 'vertical'
                : 'horizontal';
            const $targetCells = this._getCellsBetween($firstCell, $previousCell, orientation);
            this._selectedCells = $targetCells.toArray();
        } else {
            this._selectedCells = [$firstCell.get(0)];
            this._$prevCell = $firstCell;
        }
    }

    _setSelectedCellsInVirtualMode($firstCell, isMultiSelection) {
        if(isMultiSelection) {
            const { rowIndex: firstRow, columnIndex: firstColumn } = this._getCoordinatesByCell($firstCell);
            const isFirstAllDay = this._hasAllDayClass($firstCell);
            const firstCell = {
                rowIndex: firstRow,
                columnIndex: firstColumn,
                allDay: isFirstAllDay,
            };

            this.virtualSelectionState.setSelectedCells(firstCell);
        } else {
            this._selectedCells = [$firstCell.get(0)];
            this._$prevCell = $firstCell;

            const { rowIndex, columnIndex } = this._getCoordinatesByCell($firstCell);
            const isAllDayCell = this._hasAllDayClass($firstCell);
            const firstCell = {
                rowIndex,
                columnIndex,
                allDay: isAllDayCell,
            };

            this.virtualSelectionState.setSelectedCells(firstCell, firstCell);
        }
        this._setSelectedCellsByCellData(
            this.virtualSelectionState.getSelectedCells(),
        );
    }

    _correctCellForGroup($cell) {
        if(this.isVirtualScrolling()) {
            const isVirtualCell = $cell.hasClass(VIRTUAL_CELL_CLASS);
            if(isVirtualCell) {
                return this._$focusedCell;
            }

            const cellData = this.getCellData($cell);
            const isValidFocusedCell = this.virtualSelectionState.isValidFocusedCell(cellData);

            return isValidFocusedCell ? $cell : this._$focusedCell;
        }

        const $focusedCell = this._$focusedCell;
        const cellGroupIndex = this._getGroupIndexByCell($cell);
        const focusedCellGroupIndex = this._getGroupIndexByCell($focusedCell);
        const isDifferentTables = this._hasAllDayClass($cell) !== this._hasAllDayClass($focusedCell);

        return focusedCellGroupIndex !== cellGroupIndex || isDifferentTables ? $focusedCell : $cell;
    }

    _getCellsBetween($first, $last, direction) {
        const isAllDayTable = this._hasAllDayClass($last);
        let $cells = this._getCells(isAllDayTable, direction);
        let firstIndex = $cells.index($first);
        let lastIndex = $cells.index($last);

        if(firstIndex > lastIndex) {
            const buffer = firstIndex;
            firstIndex = lastIndex;
            lastIndex = buffer;
        }

        $cells = $cells.slice(firstIndex, lastIndex + 1);

        if(this._getGroupCount() > 1) {
            const result = [];
            const focusedGroupIndex = this._getGroupIndexByCell($first);
            each($cells, (function(_, cell) {
                const groupIndex = this._getGroupIndexByCell($(cell));
                if(focusedGroupIndex === groupIndex) {
                    result.push(cell);
                }
            }).bind(this));

            $cells = $(result);
        }
        return $cells;
    }

    _hasAllDayClass($cell) {
        return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
    }

    _getGroupIndexByCell($cell) {
        const {
            rowIndex,
            columnIndex,
        } = this._getCoordinatesByCell($cell);
        const isAllDayCell = $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);

        return this.viewDataProvider.getCellData(
            rowIndex, columnIndex, isAllDayCell,
        ).groupIndex;
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
        const $cell = this._$focusedCell;

        if(isDefined($cell) && $cell.length) {
            this._toggleFocusedCellClass(false, $cell);
            this.setAria('label', undefined, $cell);
        }
    }

    _releaseSelectedCells() {
        const $cells = $(this._selectedCells);

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
            const $cell = this._getFocusedCell();
            this._setSelectedAndFocusedCells($cell);
        }
    }

    _focusOutHandler() {
        super._focusOutHandler.apply(this, arguments);

        if(!this._contextMenuHandled) {
            this._releaseSelectedAndFocusedCells();
            this.virtualSelectionState?.releaseSelectedAndFocusedCells();
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
        this._renderView();
        this.option('crossScrollingEnabled') && this._setTableSizes();
        this.cache.clear();
    }

    _init() {
        this._headerSemaphore = new ScrollSemaphore();
        this._sideBarSemaphore = new ScrollSemaphore();
        this._dataTableSemaphore = new ScrollSemaphore();
        this._viewDataProvider = null;
        this._virtualSelectionState = null;
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

    _getTimePanelClass() {
        return TIME_PANEL_CLASS;
    }

    _getDateTableClass() {
        return DATE_TABLE_CLASS;
    }

    _getDateTableRowClass() {
        return DATE_TABLE_ROW_CLASS;
    }

    _getDateTableCellClass(i, j) {
        const cellClass = DATE_TABLE_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS + ' ' + VERTICAL_SIZES_CLASS;

        return this._needApplyLastGroupCellClass() ? this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, j + 1, i, j) : cellClass;
    }

    _needApplyLastGroupCellClass() {
        return true;
    }

    _getGroupRowClass() {
        return GROUP_ROW_CLASS;
    }

    _getGroupHeaderClass(i) {
        const cellClass = GROUP_HEADER_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1);
    }

    _getGroupHeaderContentClass() {
        return GROUP_HEADER_CONTENT_CLASS;
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

        this._$timePanel = $('<table>').addClass(this._getTimePanelClass());

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
        this._addTableClass(this._$dateTable, this._getDateTableClass());

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

        if(this.isVirtualScrolling()) {
            this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this);
        }
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
        const groupCount = this._getGroupCount();
        const verticalGroupCount = !this._isVerticalGroupedWorkSpace() ? 1 : groupCount;
        const horizontalGroupCount = this._isVerticalGroupedWorkSpace() ? 1 : groupCount;
        const allDayElements = this._insertAllDayRowsIntoDateTable() ? this._allDayTitles : undefined;
        const rowCountInGroup = this._getRowCount();

        const cellCount = this._getTotalCellCount(groupCount);
        const rowCount = this._getTotalRowCount(groupCount, this._isVerticalGroupedWorkSpace());
        const groupOrientation = groupCount > 0
            ? this.option('groupOrientation')
            : this._getDefaultGroupStrategy();

        const options = {
            horizontalGroupCount,
            verticalGroupCount,
            rowCountInGroup,
            cellCount,
            cellCountInGroupRow: this._getCellCount(),
            cellDataGetters: [this._getCellData.bind(this)],
            allDayElements,
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
            isVerticalGrouping: this._isVerticalGroupedWorkSpace(),
            isProvideVirtualCellsWidth,
        };

        if(this.isVirtualScrolling()) {
            extend(
                options,
                this.virtualScrollingDispatcher.getRenderState()
            );
        }

        return options;
    }

    renovatedRenderSupported() { return true; }

    renderWorkSpace(isGenerateNewViewData = true) {
        this._cleanAllowedPositions();
        this.viewDataProvider.update(isGenerateNewViewData);

        if(this.isRenovatedRender()) {
            this.renderRHeaderPanel();
            this.renderRTimeTable();
            this.renderRDateTable();
            this.renderRAllDayPanel();

            this.updateRSelection();

            this.virtualScrollingDispatcher?.updateDimensions();
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

            const groupCount = this._getGroupCount();
            const cellCount = this._getTotalCellCount(groupCount);

            const options = {
                viewData: this.viewDataProvider.viewData,
                visible,
                dataCellTemplate: this.option('dataCellTemplate'),
                startCellIndex: 0,
                cellCount
            };

            if(this.isVirtualScrolling()) {
                const { horizontalVirtualScrolling } = this.virtualScrollingDispatcher;
                const renderState = horizontalVirtualScrolling?.getRenderState();
                extend(
                    options,
                    { ...renderState }
                );
            }

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
                className: this.verticalGroupTableClass,
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
            component = this._createComponent(container, componentClass, {
                ...viewModel,
                groupOrientation: this.option('groupOrientation'),
            });
            this[componentName] = component;
        } else {
            component.option(viewModel);
        }
    }

    updateRSelection() {
        const isVerticalGrouping = this._isVerticalGroupedWorkSpace();
        const focusedCell = this.virtualSelectionState.getFocusedCell();
        const selectedCells = this.virtualSelectionState.getSelectedCells();

        if(focusedCell?.coordinates) {
            const { coordinates, cellData } = focusedCell;
            const $cell = !isVerticalGrouping && cellData.allDay
                ? this._dom_getAllDayPanelCell(coordinates.cellIndex)
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
        this._setSelectedCellsByCellData(data);
    }

    _setSelectedCellsByCellData(data) {
        const cells = [];
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

            const coordinates = this.isVirtualScrolling()
                ? this.viewDataProvider.findCellPositionInMap(
                    { groupIndex, startDate, isAllDay: allDay, index }
                )
                : this.getCoordinatesByDate(startDate, groupIndex, allDay);

            if(coordinates) {
                const { rowIndex, cellIndex } = coordinates;
                const index = rowIndex * cellsInRow + cellIndex;
                const $cell = $cells[index];

                if(isDefined($cell)) {
                    this._toggleFocusClass(true, $($cell));
                    cells.push($cell);
                }
            }
        });

        this._selectedCells = cells;
    }

    _isGroupsSpecified(resources) {
        return this.option('groups').length && resources;
    }

    _getGroupIndexByResourceId(id) {
        const groups = this.option('groups');
        const resourceTree = this.invoke('createResourcesTree', groups);

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

            while(!this._dateInRange(currentDate, startDate, endDate, diff)) {
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

    _dateInRange(date, startDate, endDate, diff) {
        return diff > 0 ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : dateUtils.dateInRange(date, endDate, startDate, 'date');
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

    _cellClickHandler(e) {
        const $target = $(e.target);

        if(this._showPopup && this._hasFocusClass($target)) {
            delete this._showPopup;
            this._showAddAppointmentPopup($target);
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
            this._setSelectedAndFocusedCells($target);
        }
    }

    _showAddAppointmentPopup($cell) {
        let firstCellData = this.getCellData($cell.first());
        let lastCellData = this.getCellData($cell.last());

        if(this.isVirtualScrolling()) {
            const selectedCells = this.virtualSelectionState.getSelectedCells();

            firstCellData = selectedCells[0];
            lastCellData = selectedCells[selectedCells.length - 1];
        }

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
                groupHeaderRowClass: this._getGroupRowClass(),
                groupRowClass: this._getGroupRowClass(),
                groupHeaderClass: this._getGroupHeaderClass.bind(this),
                groupHeaderContentClass: this._getGroupHeaderContentClass()
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
                for(let cellIndex = 0; cellIndex < count; cellIndex++) {
                    const templateIndex = rowIndex * count + cellIndex;
                    this._renderDateHeaderTemplate($headerRow, cellIndex, templateIndex, cellTemplate, templateCallbacks);
                }
            }

            container.append($headerRow);
        } else {
            const colSpan = groupByDate ? this._getGroupCount() : 1;

            for(let cellIndex = 0; cellIndex < count; cellIndex++) {
                const templateIndex = cellIndex * repeatCount;
                const cellElement = this._renderDateHeaderTemplate($headerRow, cellIndex, templateIndex, cellTemplate, templateCallbacks);
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
            const groupsArray = this._getCellGroups(groupIndex);

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

    _getAllDayCellData(cell, rowIndex, cellIndex, groupIndex) {
        let startDate = this._getDateByCellIndexes(rowIndex, cellIndex);
        const cellGroupIndex = groupIndex || this._getGroupIndex(rowIndex, cellIndex);

        startDate = dateUtils.trimTime(startDate);

        const data = {
            startDate: startDate,
            endDate: startDate,
            allDay: true,
            groupIndex: cellGroupIndex,
        };

        const groupsArray = this._getCellGroups(cellGroupIndex);

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
            const groupsArray = this._getCellGroups(groupIndex);

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
            rowClass: this._getDateTableRowClass(),
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

    _getCellData(cell, rowIndex, cellIndex) {
        const data = this._prepareCellData(rowIndex, cellIndex, cell);

        return {
            key: CELL_DATA,
            value: data
        };
    }

    _prepareCellData(rowIndex, cellIndex) {
        const startDate = this._getDateByCellIndexes(rowIndex, cellIndex);
        const endDate = this.calculateEndDate(startDate);
        const groupIndex = this._getGroupIndex(rowIndex, cellIndex);
        const data = {
            startDate: startDate,
            endDate: endDate,
            allDay: this._getTableAllDay(),
            groupIndex,
        };

        const groupsArray = this._getCellGroups(groupIndex);

        if(groupsArray.length) {
            data.groups = this._getGroupsObjectFromGroupsArray(groupsArray);
        }

        return data;
    }

    _getGroupIndex(rowIndex, cellIndex) {
        return this._groupedStrategy.getGroupIndex(rowIndex, cellIndex);
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

    // move to resource manager
    _getPathToLeaf(leafIndex) {
        const tree = this.invoke('createResourcesTree', this.option('groups'));

        function findLeafByIndex(data, index) {
            for(let i = 0; i < data.length; i++) {
                if(data[i].leafIndex === index) {
                    return data[i];
                } else {
                    const leaf = findLeafByIndex(data[i].children, index);
                    if(leaf) {
                        return leaf;
                    }
                }
            }

        }

        function makeBranch(leaf, result) {
            result = result || [];
            result.push(leaf.value);

            if(leaf.parent) {
                makeBranch(leaf.parent, result);
            }

            return result;
        }

        const leaf = findLeafByIndex(tree, leafIndex);
        return makeBranch(leaf).reverse();
    }

    _getAllGroups() {
        const groupCount = this._getGroupCount();

        return [...(new Array(groupCount))].map((_, groupIndex) => {
            const groupsArray = this._getCellGroups(groupIndex);

            return this._getGroupsObjectFromGroupsArray(groupsArray);
        });
    }

    _getCellGroups(groupIndex) {
        const result = [];

        if(this._getGroupCount()) {
            const groups = this.option('groups');

            if(groupIndex < 0) {
                return;
            }

            const path = this._getPathToLeaf(groupIndex);

            for(let i = 0; i < groups.length; i++) {
                result.push({
                    name: groups[i].name,
                    id: path[i]
                });
            }

        }

        return result;
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

    _getAllDayTable() {
        return this._$allDayTable;
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

    _calculateCellIndex(rowIndex, cellIndex) {
        return this._groupedStrategy.calculateCellIndex(rowIndex, cellIndex);
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
        this._cleanAllowedPositions();
        this.virtualSelectionState?.releaseSelectedAndFocusedCells();
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
        const cellIndex = Math.floor(index / this._getRowCount());
        const rowIndex = index - this._getRowCount() * cellIndex;

        return {
            cellIndex: cellIndex,
            rowIndex: rowIndex
        };
    }

    _getDateByCellIndexes(rowIndex, cellIndex, patchedIndexes) {
        cellIndex = !patchedIndexes ? this._patchCellIndex(cellIndex) : cellIndex;

        const firstViewDate = this.getStartViewDate();

        const firstViewDateTime = firstViewDate.getTime();
        const millisecondsOffset = this._getMillisecondsOffset(rowIndex, cellIndex);
        const offsetByCount = this._getOffsetByCount(cellIndex);
        const startViewDateOffset = this._getTimeOffsetForStartViewDate();

        const currentDate = new Date(firstViewDateTime + millisecondsOffset + offsetByCount - startViewDateOffset);

        currentDate.setTime(currentDate.getTime() + dateUtils.getTimezonesDifference(firstViewDate, currentDate));
        return currentDate;
    }

    _patchCellIndex(cellIndex) {
        if(this.isGroupedByDate()) {
            cellIndex = Math.floor(cellIndex / this._getGroupCount());
        }

        return cellIndex;
    }

    _getOffsetByCount() {
        return 0;
    }

    _getMillisecondsOffset(rowIndex, cellIndex) {
        return this._getInterval() * this._calculateCellIndex(rowIndex, cellIndex) + this._calculateHiddenInterval(rowIndex, cellIndex);
    }

    _calculateHiddenInterval(rowIndex, cellIndex) {
        const dayCount = cellIndex % this._getCellCount();
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
            const tree = this.invoke('createResourcesTree', this.option('groups'));
            result = this.invoke('getResourceTreeLeaves', tree, appointmentResources);
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
            groupIndex
        );
    }

    _getCellPositionWithCache($cell, cellCoordinates, groupIndex) {
        const result = this._getCellPosition($cell);

        this.setCellDataCache(cellCoordinates, groupIndex, $cell);

        if(result) {
            result.rowIndex = cellCoordinates.rowIndex;
            result.cellIndex = cellCoordinates.cellIndex;
        }

        return result;
    }

    _getCellPosition($cell) {
        const position = $cell.position();
        if(this.option('rtlEnabled')) {
            position.left += getBoundingRect($cell.get(0)).width;
        }
        return position;
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
            .eq(position.cellIndex);
    }

    _dom_getAllDayPanelCell(cellIndex) {
        return this._$allDayPanel
            .find('tr').eq(0)
            .find('td').eq(cellIndex);
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

    _getDateTableBorder() {
        return DATE_TABLE_CELL_BORDER;
    }

    _getDateTableBorderOffset() {
        return this._getDateTableBorder() * 2;
    }

    _getGroupHeaderCellsContent() {
        return this.$element().find('.' + GROUP_HEADER_CONTENT_CLASS);
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
            cellIndex: cellCoordinates.cellIndex,
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
            cellIndex: appointment.cellIndex,
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
        if(this.isVirtualScrolling()) {
            return this.virtualSelectionState.getSelectedCells();
        }

        const $focusedCells = this._getAllFocusedCells();
        let result = [];

        if($focusedCells.length > 1) {
            result = this._getMultipleCellsData($focusedCells);
        } else {
            const data = this.getCellData($($focusedCells[0]));
            data && result.push(data);
        }

        return result;
    }

    _getMultipleCellsData($cells) {
        const data = [];

        for(let i = 0; i < $cells.length; i++) {
            data.push(this.getCellData($($cells[i])));
        }

        return data;
    }

    getCellData($cell) {
        let data;
        const currentCell = $cell[0];

        if(currentCell) {
            data = this._getDataByCell($cell);
        }

        return extend(true, {}, data);
    }

    _getVirtualRowOffset() {
        return this.virtualScrollingDispatcher?.virtualRowOffset || 0;
    }

    _getVirtualCellOffset() {
        return this.virtualScrollingDispatcher?.virtualCellOffset || 0;
    }

    _getDataByCell($cell) {
        let rowIndex = $cell.parent().index();
        if(this.isVirtualScrolling()) {
            rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
        }

        let columnIndex = $cell.index();
        if(this.isVirtualScrolling()) {
            columnIndex -= this.virtualScrollingDispatcher.leftVirtualCellsCount;
        }

        const { viewDataProvider } = this;
        const isAllDayCell = this._hasAllDayClass($cell);

        const cellData = viewDataProvider.getCellData(rowIndex, columnIndex, isAllDayCell);

        return cellData ? {
            startDate: cellData.startDate,
            endDate: cellData.endDate,
            groups: cellData.groups,
            groupIndex: cellData.groupIndex,
            allDay: cellData.allDay,
        } : undefined;
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
        const position = this._getCellPositionWithCache($cell, positionByMap, validGroupIndex);

        const shift = this.getPositionShift(inAllDayRow ? 0 : this.getTimeShift(date), inAllDayRow);
        const horizontalHMax = this._getHorizontalMax(validGroupIndex, date);

        return {
            cellPosition: position.left + shift.cellPosition,
            top: position.top + shift.top,
            left: position.left + shift.left,
            rowIndex: position.rowIndex,
            cellIndex: position.cellIndex,
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
        const endDate = startDate && this.invoke('calculateAppointmentEndDate', allDay, startDate);

        return {
            startDate: startDate,
            endDate: endDate,
            allDay: allDay,
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

        const $row = this.$element().find('.' + this._getDateTableRowClass()).eq(0);
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

        return this.getRMaxAllowedHorizontalPosition(validGroupIndex);
    }

    getRMaxAllowedHorizontalPosition(groupIndex) {
        const getMaxPosition = cellIndex => {
            const cell = this._$dateTable
                .find(`tr:not(.${VIRTUAL_ROW_CLASS})`)
                .first()
                .find(`td:not(.${VIRTUAL_CELL_CLASS})`)
                .get(cellIndex);

            let maxPosition = $(cell).position().left;
            if(!this.option('rtlEnabled')) {
                maxPosition += getBoundingRect(cell).width;
            }

            this._maxAllowedPosition[groupIndex] = Math.round(maxPosition);
        };

        if(!this._maxAllowedPosition[groupIndex]) {
            const { cellIndex } = this.viewDataProvider.getLastGroupCellPosition(groupIndex);
            getMaxPosition(cellIndex);
        }

        return this._maxAllowedPosition[groupIndex];
    }

    getMaxAllowedVerticalPosition(groupIndex) {
        return this.getRMaxAllowedVerticalPosition(groupIndex);
    }

    getRMaxAllowedVerticalPosition(groupIndex) {
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
        let cellIndex = this._getCellCount();

        if(this.isGroupedByDate()) {
            cellIndex = cellIndex * this._getGroupCount() - 1;
        } else {
            cellIndex = cellIndex - 1;
        }

        return this._getDateByCellIndexes(rowIndex, cellIndex, true);
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
        const scheduler = this.option('observer');
        const newDate = scheduler.timeZoneCalculator.createDate(date, { path: 'toGrid' });
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

        let fullScrolledRowCount = scrollableScrollTop / cellHeight;
        if(this.isVirtualScrolling()) {
            fullScrolledRowCount -= this.virtualScrollingDispatcher.topVirtualRowsCount;
        }

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

    getDistanceBetweenCells(startIndex, endIndex) {
        let result = 0;

        this.$element()
            .find('.' + this._getDateTableRowClass())
            .first()
            .find('.' + DATE_TABLE_CELL_CLASS).each(function(index) {
                if(index < startIndex || index > endIndex) {
                    return true;
                }

                result += getBoundingRect(this).width;
            });

        return result;
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

        this._createDragBehaviorBase($element, getItemData, getItemSettings);
    }

    _createDragBehaviorBase($element, getItemData, getItemSettings, options = {}) {
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
            getItemData,
            getItemSettings,
            options)
        );
    }

    _createDragAppointment(itemData, settings, appointments) {
        const appointmentIndex = appointments.option('items').length;

        settings.isCompact = false;
        settings.virtual = false;

        const items = appointments._renderItem(appointmentIndex, {
            itemData,
            settings: [settings]
        });

        return items[0];
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
        let columnIndex = $cell.index();
        let rowIndex = $cell.parent().index();
        const isAllDayCell = this._hasAllDayClass($cell);
        const isVerticalGrouping = this._isVerticalGroupedWorkSpace();

        if(this.isVirtualScrolling() && !(isAllDayCell && !isVerticalGrouping)) {
            rowIndex -= this.virtualScrollingDispatcher.topVirtualRowsCount;
        }
        if(this.isVirtualScrolling()) {
            columnIndex -= this.virtualScrollingDispatcher.leftVirtualCellsCount;
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
    getItemData,
    getItemSettings,
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

        state.itemData = getItemData(e.itemElement, appointments);
        const settings = getItemSettings($itemElement, e);

        if(state.itemData && !state.itemData.disabled) {
            event.data = event.data || {};
            if(!canceled) {
                if(!settings.isCompact) {
                    dragBehavior.updateDragSource(state.itemData, settings);
                }

                state.dragElement = createDragAppointment(state.itemData, settings, appointments);

                event.data.itemElement = state.dragElement;
                event.data.initialPosition = locate($(state.dragElement));
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

        const mouseIndent = 10;

        const appointmentWidth = $(state.dragElement).width();
        const isWideAppointment = appointmentWidth > getCellWidth();

        const draggableElement = locate($(state.dragElement).parent());

        const newX = draggableElement.left + mouseIndent;
        const newY = draggableElement.top + mouseIndent;

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
