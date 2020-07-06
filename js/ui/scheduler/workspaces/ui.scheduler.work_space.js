import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import dataUtils from '../../../core/element_data';
import dateUtils from '../../../core/utils/date';
import typeUtils from '../../../core/utils/type';
import windowUtils from '../../../core/utils/window';
import { getPublicElement } from '../../../core/element';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { getBoundingRect } from '../../../core/utils/position';
import messageLocalization from '../../../localization/message';
import dateLocalization from '../../../localization/date';
import { noop } from '../../../core/utils/common';
import { isDefined } from '../../../core/utils/type';
import { addNamespace, isMouseEvent } from '../../../events/utils';
import pointerEvents from '../../../events/pointer';
import errors from '../../widget/ui.errors';
import clickEvent from '../../../events/click';
import contextMenuEvent from '../../../events/contextmenu';
import dragEvents from '../../../events/drag';
import Scrollable from '../../scroll_view/ui.scrollable';
import HorizontalGroupedStrategy from './ui.scheduler.work_space.grouped.strategy.horizontal';
import VerticalGroupedStrategy from './ui.scheduler.work_space.grouped.strategy.vertical';
import { tableCreator } from '../ui.scheduler.table_creator';
import VerticalShader from '../shaders/ui.scheduler.current_time_shader.vertical';
import AppointmentDragBehavior from '../appointmentDragBehavior';
import { FIXED_CONTAINER_CLASS } from '../constants';
import timeZoneUtils from '../utils.timeZone';
import WidgetObserver from '../base/widgetObserver';

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

const DATE_TABLE_DROPPABLE_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';

const SCHEDULER_HEADER_SCROLLABLE_CLASS = 'dx-scheduler-header-scrollable';
const SCHEDULER_SIDEBAR_SCROLLABLE_CLASS = 'dx-scheduler-sidebar-scrollable';
const SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS = 'dx-scheduler-date-table-scrollable';

const SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME = addNamespace(pointerEvents.down, 'dxSchedulerWorkSpace');

const SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME = addNamespace(dragEvents.enter, 'dxSchedulerDateTable');
const SCHEDULER_CELL_DXDROP_EVENT_NAME = addNamespace(dragEvents.drop, 'dxSchedulerDateTable');
const SCHEDULER_CELL_DXDRAGLEAVE_EVENT_NAME = addNamespace(dragEvents.leave, 'dxSchedulerDateTable');
const SCHEDULER_CELL_DXCLICK_EVENT_NAME = addNamespace(clickEvent.name, 'dxSchedulerDateTable');

const SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME = addNamespace(pointerEvents.down, 'dxSchedulerDateTable');
const SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME = addNamespace(pointerEvents.up, 'dxSchedulerDateTable');

const SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME = addNamespace(pointerEvents.move, 'dxSchedulerDateTable');

const CELL_DATA = 'dxCellData';

const DATE_TABLE_CELL_BORDER = 1;

const DATE_TABLE_MIN_CELL_WIDTH = 75;

const DAY_MS = toMs('day');
const HOUR_MS = toMs('hour');

const SCHEDULER_DRAG_AND_DROP_SELECTOR = `.${DATE_TABLE_CLASS} td, .${ALL_DAY_TABLE_CLASS} td`;

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
    constructor(...args) {
        super(...args);
        this._activeStateUnit = `.${DATE_TABLE_CELL_CLASS}, .${ALL_DAY_TABLE_CELL_CLASS}`;
    }

    _supportedKeys() {
        const clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();

            if(this._focusedCells && this._focusedCells.length) {
                const $itemElement = $(this.option('focusedElement'));
                const $cellElement = $itemElement.length ? $itemElement : this._focusedCells;

                e.target = this._focusedCells;
                this._showPopup = true;
                this._cellClickAction({ event: e, cellElement: $(this._focusedCells), cellData: this.getCellData($cellElement) });
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

    _isRTL() {
        return this.option('rtlEnabled');
    }

    _getFocusedCell() {
        return this._$focusedCell ||
            this._$dateTable.find('.' + DATE_TABLE_CELL_CLASS).eq(0);
    }

    _getAllFocusedCells() {
        return this._focusedCells ||
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

        this._setFocusedCell($cell, isMultiSelection);
        this._dateTableScrollable.scrollToElement($cell);
    }

    _setFocusedCell($cell, isMultiSelection) {
        if(!isDefined($cell) || !$cell.length) {
            return;
        }

        this._releaseFocusedCell();
        this._focusedCells = [];

        if(isMultiSelection) {
            $cell = this._correctCellForGroup($cell);
            const orientation = this.option('type') === 'day' && (!this.option('groups').length || this.option('groupOrientation') === 'vertical')
                ? 'vertical'
                : 'horizontal';
            const $targetCells = this._getCellsBetween($cell, this._$prevCell, orientation);
            this._focusedCells = $targetCells.toArray();
        } else {
            this._focusedCells = [$cell.get(0)];
            this._$prevCell = $cell;
        }

        const $focusedCells = $(this._focusedCells);

        this._toggleFocusClass(true, $focusedCells);
        this.setAria('label', 'Add appointment', $focusedCells);

        this._toggleFocusedCellClass(true, $cell);
        this._$focusedCell = $cell;

        const selectedCellData = this.getFocusedCellData();
        this.option('selectedCellData', selectedCellData);
        this._selectionChangedAction({ selectedCellData });
    }

    _correctCellForGroup($cell) {
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
        return this._groupedStrategy.getGroupIndexByCell($cell);
    }

    _toggleFocusedCellClass(isFocused, $element) {
        const $focusTarget = $element && $element.length ? $element : this._focusTarget();
        $focusTarget.toggleClass(DATE_TABLE_FOCUSED_CELL_CLASS, isFocused);
    }

    _releaseFocusedCell($cell) {
        $cell = $cell || $(this._focusedCells);

        if(isDefined($cell) && $cell.length) {
            this._toggleFocusClass(false, $cell);
            this._toggleFocusedCellClass(false, $cell);
            this.setAria('label', undefined, $cell);
        }

        this.option('selectedCellData', []);
    }

    _focusInHandler(e) {
        if($(e.target).is(this._focusTarget()) && this._isCellClick !== false) {
            delete this._isCellClick;
            delete this._contextMenuHandled;
            super._focusInHandler.apply(this, arguments);
            const $cell = this._getFocusedCell();
            this._setFocusedCell($cell);
        }
    }

    _focusOutHandler() {
        super._focusOutHandler.apply(this, arguments);

        if(!this._contextMenuHandled) {
            this._releaseFocusedCell();
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
            groupByDate: false
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
                    this._toggleAllDayVisibility();
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
            default:
                super._optionChanged(args);
        }
    }

    _cleanWorkSpace() {
        this._cleanView();
        this._toggleGroupedClass();
        this._toggleWorkSpaceWithOddCells();
        this._renderView();
    }

    _init() {
        this._headerSemaphore = new ScrollSemaphore();
        this._sideBarSemaphore = new ScrollSemaphore();
        this._dataTableSemaphore = new ScrollSemaphore();

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
        return this.option('hoursInterval') === 0.5;
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
        this._createAllDayPanelElements();

        this._$timePanel = $('<table>').addClass(this._getTimePanelClass());

        this._$dateTable = $('<table>');

        this._$groupTable = $('<div>').addClass(WORKSPACE_VERTICAL_GROUP_TABLE_CLASS);
    }

    _initAllDayPanelElements() {
        this._allDayTitles = [];
        this._allDayTables = [];
        this._allDayPanels = [];
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
            pushBackValue: 0
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
            pushBackValue: 0,
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
            pushBackValue: 0,
            onScroll: e => {
                this._sideBarSemaphore.take();
                this._dataTableSemaphore.isFree() && this._dateTableScrollable.scrollTo({ top: e.scrollOffset.top });
                this._sideBarSemaphore.release();
            }
        });
    }

    _visibilityChanged(visible) {
        if(visible && this._isVerticalGroupedWorkSpace()) {
            this._setHorizontalGroupHeaderCellsHeight();
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
        const $headerCells = this._$headerPanel
            .find('tr')
            .last()
            .find('th');

        let width = cellWidth * $headerCells.length;

        if(width < minWidth) {
            width = minWidth;
        }

        this._$headerPanel.width(width);
        this._$dateTable.width(width);
        this._$allDayTable && this._$allDayTable.width(width);

        this._attachHeaderTableClasses();

        if(this._isVerticalGroupedWorkSpace()) {
            this._setHorizontalGroupHeaderCellsHeight();
        }
    }

    getWorkSpaceMinWidth() {
        return this._groupedStrategy.getWorkSpaceMinWidth();
    }

    _dimensionChanged() {
        if(this.option('crossScrollingEnabled')) {
            this._setTableSizes();
        }

        this.headerPanelOffsetRecalculate();
        this._cleanCellDataCache();
        this._cleanAllowedPositions();
    }

    _needCreateCrossScrolling() {
        return this.option('crossScrollingEnabled');
    }

    _getElementClass() { return noop(); }

    _getRowCount() { return noop(); }

    _getRowCountWithAllDayRows() {
        const allDayRowsCount = this.option('showAllDayPanel')
            ? this._getGroupCount() : 0;

        return this._getRowCount() + allDayRowsCount;
    }

    _getCellCount() { return noop(); }

    _initMarkup() {
        this._initWorkSpaceUnits();

        this._initDateTableScrollable();

        this._createWorkSpaceElements();

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

        this._applyCellTemplates(
            this._renderGroupHeader()
        );

        this._renderDateHeader();

        this._renderTimePanel();

        if(this._isVerticalGroupedWorkSpace()) {
            const groupCount = this._getGroupCount();

            for(let i = 0; i < groupCount; i++) {
                this._renderAllDayPanel(i);
            }
        }

        this._renderDateTable();

        this._renderAllDayPanel();

        this._updateGroupTableHeight();

        this._shader = new VerticalShader(this);
    }

    _updateGroupTableHeight() {
        if(this._isVerticalGroupedWorkSpace() && windowUtils.hasWindow()) {
            this._setHorizontalGroupHeaderCellsHeight();
        }
    }

    _renderDateTimeIndication() { return noop(); }
    _setIndicationUpdateInterval() { return noop(); }
    _refreshDateTimeIndication() { return noop(); }

    _setFocusOnCellByOption(data) {
        const cells = [];

        this._releaseFocusedCell();

        for(let i = 0; i < data.length; i++) {
            const groups = data[i].groups;
            const groupIndex = this.option('groups').length && groups ? this._getGroupIndexByResourceId(groups) : 0;
            const allDay = !!(data[i].allDay);
            const coordinates = this.getCoordinatesByDate(data[i].startDate, groupIndex, allDay);
            const $cell = this._getCellByCoordinates(coordinates, groupIndex);

            if(isDefined($cell)) {
                this._toggleFocusClass(true, $cell);
                cells.push($cell.get(0));
            }
        }
        this._focusedCells = cells;
    }

    _getGroupIndexByResourceId(id) {
        const groups = this.option('groups');
        const groupKey = Object.keys(id)[0];
        const groupValue = id[groupKey];
        const tree = this.invoke('createResourcesTree', groups);
        let index = 0;

        for(let i = 0; i < tree.length; i++) {

            if(tree[i].name === groupKey && tree[i].value === groupValue) {
                index = tree[i].leafIndex;
            }
        }

        return index;
    }

    _setFirstViewDate() {
        const firstDayOfWeek = isDefined(this._firstDayOfWeek()) ? this._firstDayOfWeek() : dateLocalization.firstDayOfWeekIndex();

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
        const that = this;
        this._cellClickAction = this._createActionByOption('onCellClick', {
            afterExecute(e) {
                that._moveToClosestNonStub(e.args[0].event);
            }
        });
    }

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
    }

    _moveToClosestNonStub(e) {
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
            this._setFocusedCell($target);
        }
    }

    _showAddAppointmentPopup($cell) {
        const firstCellData = this.getCellData($cell.first());
        const lastCellData = this.getCellData($cell.last());

        const args = {
            startDate: this.invoke('convertDateByTimezoneBack', firstCellData.startDate) || firstCellData.startDate,
            endDate: this.invoke('convertDateByTimezoneBack', lastCellData.endDate) || lastCellData.endDate
        };

        if(isDefined(lastCellData.allDay)) {
            args.allDay = lastCellData.allDay;
        }

        extend(args, lastCellData.groups);

        this.notifyObserver('showAddAppointmentPopup', args);
    }

    _attachContextMenuEvent() {
        this._createContextMenuAction();

        const cellSelector = '.' + DATE_TABLE_CELL_CLASS + ',.' + ALL_DAY_TABLE_CELL_CLASS;
        const $element = this.$element();
        const eventName = addNamespace(contextMenuEvent.name, this.NAME);

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
            this._attachGroupCountAttr(groupCount, groupRows);
            $container.append(groupRows.elements);
            cellTemplates = groupRows.cellTemplates;
        } else {
            this._detachGroupCountAttr();
        }

        return cellTemplates;
    }

    _applyCellTemplates(templates) {
        templates.forEach(function(template) {
            template();
        });
    }

    _detachGroupCountAttr() {
        const groupedAttr = this._groupedStrategy.getGroupCountAttr();

        this.$element().removeAttr(groupedAttr.attr);
    }

    _attachGroupCountAttr(groupRowCount, groupRows) {
        const groupedAttr = this._groupedStrategy.getGroupCountAttr(groupRowCount, groupRows);

        this.$element().attr(groupedAttr.attr, groupedAttr.count);
    }

    headerPanelOffsetRecalculate() {
        if(!this.option('resourceCellTemplate') &&
           !this.option('dateCellTemplate')) {
            return;
        }

        const headerPanelHeight = this.getHeaderPanelHeight();
        const headerHeight = this.invoke('getHeaderHeight');
        const allDayPanelHeight = this.supportAllDayRow() && this.option('showAllDayPanel') ? this._groupedStrategy.getAllDayTableHeight() : 0;

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
        const $container = this._getDateHeaderContainer();
        const $headerRow = $('<tr>').addClass(HEADER_ROW_CLASS);
        const count = this._getCellCount();
        const cellTemplate = this._getDateHeaderTemplate();
        const repeatCount = this._calculateHeaderCellRepeatCount();
        const templateCallbacks = [];
        const groupByDate = this.isGroupedByDate();
        const colspan = groupByDate ? this._getGroupCount() : 1;

        let i;
        let j;

        if(!groupByDate) {
            for(j = 0; j < repeatCount; j++) {
                for(i = 0; i < count; i++) {

                    this._renderDateHeaderTemplate($headerRow, i, j * repeatCount + i, cellTemplate, templateCallbacks);
                }
            }

            $container.append($headerRow);
        } else {
            for(i = 0; i < count; i++) {
                const $cell = this._renderDateHeaderTemplate($headerRow, i, i * repeatCount, cellTemplate, templateCallbacks);

                $cell.attr('colSpan', colspan);
            }

            $container.prepend($headerRow);

        }

        this._applyCellTemplates(templateCallbacks);

        return $headerRow;
    }

    _renderDateHeaderTemplate($container, i, calculatedIndex, cellTemplate, templateCallbacks) {
        const text = this._getHeaderText(i);
        const $cell = $('<th>')
            .addClass(this._getHeaderPanelCellClass(i))
            .attr('title', text);

        if(cellTemplate && cellTemplate.render) {
            templateCallbacks.push(cellTemplate.render.bind(cellTemplate, {
                model: {
                    text: text,
                    date: this._getDateByIndex(i)
                },
                index: calculatedIndex,
                container: getPublicElement($cell)
            }));
        } else {
            $cell.text(text);
        }

        $container.append($cell);
        return $cell;
    }

    _getHeaderPanelCellClass(i) {
        const cellClass = HEADER_PANEL_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i + 1);
    }

    _calculateHeaderCellRepeatCount() {
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

        this._toggleAllDayVisibility();
        this._applyCellTemplates(cellTemplates);
    }

    _getAllDayPanelCellClass(i, j) {
        const cellClass = ALL_DAY_TABLE_CELL_CLASS + ' ' + HORIZONTAL_SIZES_CLASS;

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, j + 1);
    }

    _getAllDayCellData(cell, rowIndex, cellIndex, groupIndex) {
        let startDate = this._getDateByCellIndexes(rowIndex, cellIndex);

        startDate = dateUtils.trimTime(startDate);

        const data = {
            startDate: startDate,
            endDate: new Date(startDate.getTime() + DAY_MS),
            allDay: true
        };

        const groups = this._getCellGroups(groupIndex || this._getGroupIndex(rowIndex, cellIndex));

        if(groups.length) {
            data.groups = {};
        }

        for(let i = 0; i < groups.length; i++) {
            data.groups[groups[i].name] = groups[i].id;
        }

        return {
            key: CELL_DATA,
            value: data
        };
    }

    _toggleAllDayVisibility() {
        const showAllDayPanel = this.option('showAllDayPanel');
        this._$allDayPanel.toggle(showAllDayPanel);
        this._$allDayTitle && this._$allDayTitle.toggleClass(ALL_DAY_TITLE_HIDDEN_CLASS, !showAllDayPanel);
        this.$element().toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, showAllDayPanel);

        this._changeAllDayVisibility();
        this._updateScrollable();
    }

    _changeAllDayVisibility() {
        this.$element().toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, !this.option('allDayExpanded') && this.option('showAllDayPanel'));
    }

    _updateScrollable() {
        this._dateTableScrollable.update();

        this._headerScrollable && this._headerScrollable.update();
        this._sidebarScrollable && this._sidebarScrollable.update();
    }

    _renderTimePanel() {
        const repeatCount = this._groupedStrategy.calculateTimeCellRepeatCount();
        const startViewDate = this._getDateWithSkippedDST();

        const _getTimeText = (i) => {
            // T410490: incorrectly displaying time slots on Linux
            const index = i % this._getRowCount();
            if(index % 2 === 0) {
                return dateLocalization.format(this._getTimeCellDateCore(startViewDate, i), 'shorttime');
            }
            return '';
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
            allDayElements: this._insertAllDayRowsIntoDateTable() ? this._allDayTitles : undefined
        });
    }

    _getDateWithSkippedDST() {
        let result = new Date(this.getStartViewDate());
        if(timeZoneUtils.isTimezoneChangeInDate(result)) {
            result = new Date(result.setDate(result.getDate() + 1));
        }
        return result;
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

        return this._groupedStrategy.addAdditionalGroupCellClasses(cellClass, i, i);
    }

    _getTimeCellDateAdjustedDST(i) {
        let startViewDate = new Date(this.getStartViewDate());
        if(timeZoneUtils.isTimezoneChangeInDate(startViewDate)) {
            startViewDate = new Date(startViewDate.setDate(startViewDate.getDate() + 1));
        }

        return this._getTimeCellDateCore(startViewDate, i);
    }

    _getTimeCellDate(i) {
        return this._getTimeCellDateCore(this.getStartViewDate(), i);
    }

    _getTimeCellDateCore(startViewDate, i) {
        const result = new Date(startViewDate);
        const timeCellDuration = Math.round(this.getCellDuration());
        const cellCountInDay = this._getCellCountInDay(true);

        result.setMilliseconds(result.getMilliseconds() + timeCellDuration * (i % cellCountInDay));

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

    _getTotalRowCount() {
        return this._groupedStrategy.getTotalRowCount();
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
        const data = {
            startDate: startDate,
            endDate: endDate,
            allDay: this._getTableAllDay()
        };
        const groups = this._getCellGroups(this._getGroupIndex(rowIndex, cellIndex));

        if(groups.length) {
            data.groups = {};
        }

        for(let i = 0; i < groups.length; i++) {
            data.groups[groups[i].name] = groups[i].id;
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

    _attachTablesEvents() {
        const that = this;
        let isPointerDown = false;
        let cellHeight;
        let cellWidth;
        const $element = this.$element();

        eventsEngine.off($element, SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXDRAGLEAVE_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXDROP_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);
        eventsEngine.on($element, SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME, SCHEDULER_DRAG_AND_DROP_SELECTOR, {
            itemSizeFunc($element) {
                if(!cellHeight) {
                    cellHeight = getBoundingRect($element.get(0)).height;
                }
                if(!cellWidth) {
                    cellWidth = getBoundingRect($element.get(0)).width;
                }
                return {
                    width: cellWidth,
                    height: cellHeight
                };
            },
            checkDropTarget: (target, event) => !this._isOutsideScrollable(target, event)
        }, function(e) {
            if(that._$currentTableTarget) {
                that.removeDroppableCellClass(that._$currentTableTarget);
            }
            that._$currentTableTarget = $(e.target);
            that._$currentTableTarget.addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXDRAGLEAVE_EVENT_NAME, function(e) {
            if(!$element.find($(e.draggingElement)).length) {
                that.removeDroppableCellClass();
            }
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXDROP_EVENT_NAME, SCHEDULER_DRAG_AND_DROP_SELECTOR, function(e) {
            that.removeDroppableCellClass($(e.target));
            cellHeight = 0;
            cellWidth = 0;
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME, SCHEDULER_DRAG_AND_DROP_SELECTOR, function(e) {
            if(isMouseEvent(e) && e.which === 1) {
                isPointerDown = true;
                that.$element().addClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
                eventsEngine.on(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME, function() {
                    isPointerDown = false;
                    that.$element().removeClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                });
            }
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME, SCHEDULER_DRAG_AND_DROP_SELECTOR, function(e) {
            if(isPointerDown && that._dateTableScrollable && !that._dateTableScrollable.option('scrollByContent')) {
                e.preventDefault();
                e.stopPropagation();
                that._moveToCell($(e.target), true);
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
        return dateLocalization.format(this._getDateByIndex(headerIndex), this._getFormat());
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
        this._cleanCellDataCache();
        this._cleanAllowedPositions();
        this._$thead.empty();
        this._$dateTable.empty();
        this._shader && this._shader.clean();
        this._$timePanel.empty();
        this._$allDayTable && this._$allDayTable.empty();
        this._$groupTable.empty();
        delete this._hiddenInterval;
        delete this._interval;
    }

    _clean() {
        eventsEngine.off(domAdapter.getDocument(), SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);

        super._clean();
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
        const currentDate = new Date(firstViewDate.getTime() + this._getMillisecondsOffset(rowIndex, cellIndex) + this._getOffsetByCount(cellIndex));

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
        if(appointmentResources && this.option('groups').length) {
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
        if(this._needCreateCrossScrolling()) {
            return getBoundingRect(this._$dateTable.get(0)).width;
        }

        return getBoundingRect(this.$element().get(0)).width - this.getTimePanelWidth();
    }

    _getCellPositionByIndex(index, groupIndex, inAllDayRow) {
        const cellCoordinates = this._getCellCoordinatesByIndex(index);
        const $cell = this._getCellByCoordinates(cellCoordinates, groupIndex, inAllDayRow);
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

        return this._$dateTable
            .find('tr')
            .eq(indexes.rowIndex)
            .find('td')
            .eq(indexes.cellIndex);
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

    _getScrollCoordinates(hours, minutes, date) {
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

        return this.getCoordinatesByDate(currentDate);
    }

    _isOutsideScrollable(target, event) {
        const $dateTableScrollableElement = this._dateTableScrollable.$element();
        const scrollableSize = getBoundingRect($dateTableScrollableElement.get(0));
        const window = windowUtils.getWindow();
        const isTargetInAllDayPanel = !$(target).closest($dateTableScrollableElement).length;
        const isOutsideHorizontalScrollable = event.pageX < scrollableSize.left || event.pageX > (scrollableSize.left + scrollableSize.width + (window.scrollX || 0));
        const isOutsideVerticalScrollable = event.pageY < scrollableSize.top || event.pageY > (scrollableSize.top + scrollableSize.height + (window.scrollY || 0));

        if(isTargetInAllDayPanel && !isOutsideHorizontalScrollable) {
            return false;
        }

        return isOutsideVerticalScrollable || isOutsideHorizontalScrollable;
    }

    setCellDataCache(cellCoordinates, groupIndex, $cell) {
        const cache = this.getCellDataCache();
        const data = this.getCellData($cell);

        const key = JSON.stringify({
            rowIndex: cellCoordinates.rowIndex,
            cellIndex: cellCoordinates.cellIndex,
            groupIndex: groupIndex
        });

        cache[key] = data;
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
        const cache = this.getCellDataCache();

        if(cache[key]) {
            cache[aliasKey] = cache[key];
        }
    }

    getCellDataCache(key) {
        if(!this._cache) {
            this._cache = {};
        }

        return key ? this._cache[key] : this._cache;
    }

    _cleanCellDataCache() {
        delete this._cache;
    }

    _cleanAllowedPositions() {
        delete this._maxAllowedVerticalPosition;
        delete this._maxAllowedPosition;
    }

    supportAllDayRow() {
        return true;
    }

    keepOriginalHours() {
        return false;
    }

    getFocusedCellData() {
        const $focusedCells = this._getAllFocusedCells();
        let result = [];

        if($focusedCells.length > 1) {
            result = this._getMultipleCellsData($focusedCells);
        } else {
            const data = this.getCellData($focusedCells);
            data && result.push(data);
        }

        return result;
    }

    _getMultipleCellsData($cells) {
        const data = [];

        for(let i = 0; i < $cells.length; i++) {
            data.push(dataUtils.data($cells[i], CELL_DATA));
        }

        return data;
    }

    getCellData($cell) {
        const data = $cell[0] ? dataUtils.data($cell[0], CELL_DATA) : undefined;
        return extend(true, {}, data);
    }

    _getHorizontalMax(groupIndex) {
        groupIndex = this.isGroupedByDate() ? this._getGroupCount() - 1 : groupIndex;

        return this._groupedStrategy.getHorizontalMax(groupIndex);
    }

    getCoordinatesByDate(date, groupIndex, inAllDayRow) {
        groupIndex = groupIndex || 0;

        const index = this.getCellIndexByDate(date, inAllDayRow);
        const position = this._getCellPositionByIndex(index, groupIndex, inAllDayRow);
        const shift = this.getPositionShift(inAllDayRow ? 0 : this.getTimeShift(date), inAllDayRow);
        const horizontalHMax = this._getHorizontalMax(groupIndex, date);

        if(!position) {
            throw errors.Error('E1039');
        }

        const coordinates = {
            cellPosition: position.left + shift.cellPosition,
            top: position.top + shift.top,
            left: position.left + shift.left,
            rowIndex: position.rowIndex,
            cellIndex: position.cellIndex,
            hMax: horizontalHMax,
            vMax: this.getVerticalMax(groupIndex),
            groupIndex: groupIndex
        };

        return coordinates;
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
        return this.option('groupByDate') && this._isHorizontalGroupedWorkSpace() && this._getGroupCount() > 0;
    }

    getCellIndexByDate(date, inAllDayRow) {
        const timeInterval = inAllDayRow ? 24 * 60 * 60 * 1000 : this._getInterval();
        const dateTimeStamp = this._getIntervalBetween(date, inAllDayRow);

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

        const currentDateTime = date.getTime();
        const currentDayStartTime = currentDayStart.getTime();
        const minTime = this._firstViewDate.getTime();

        return (currentDateTime > minTime)
            ? ((currentDateTime - currentDayStartTime) % cellDuration) / cellDuration
            : 0;
    }

    _isSkippedData() { return false; }

    getCoordinatesByDateInGroup(date, appointmentResources, inAllDayRow) {
        const indexes = this._getGroupIndexes(appointmentResources);
        const result = [];

        if(this._isSkippedData(date)) {
            return result;
        }

        if(indexes.length) {
            for(let i = 0; i < indexes.length; i++) {
                result.push(this.getCoordinatesByDate(date, indexes[i], inAllDayRow));
            }
        } else {
            result.push(this.getCoordinatesByDate(date, 0, inAllDayRow));
        }

        return result;
    }

    getDroppableCellIndex() {
        const $droppableCell = this._getDroppableCell();
        const $row = $droppableCell.parent();
        const rowIndex = $row.index();

        return rowIndex * $row.find('td').length + $droppableCell.index();
    }

    getDataByDroppableCell() {
        const cellData = this.getCellData(this._getDroppableCell());

        return {
            date: cellData.startDate,
            allDay: cellData.allDay,
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
        const cell = this._getCells().first().get(0);
        return cell && getBoundingRect(cell).width;
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

        if(!typeUtils.isDefined(startIndex)) {
            startIndex = totalCellCount;
        }

        for(let i = startIndex; i < totalCellCount + cellCount; i++) {
            width = width + getBoundingRect($($cells).eq(i).get(0)).width;
        }

        return width / (totalCellCount + cellCount - startIndex);
    }

    getCellHeight() {
        const cell = this._getCells().first().get(0);

        return cell && getBoundingRect(cell).height;
    }

    getAllDayHeight() {
        const cell = this._getCells(true).first().get(0);

        return this.option('showAllDayPanel') ? cell && getBoundingRect(cell).height || 0 : 0;
    }

    getAllDayOffset() {
        return this._groupedStrategy.getAllDayOffset();
    }

    getMaxAllowedPosition() {
        if(!this._maxAllowedPosition) {
            const isRtl = this.option('rtlEnabled');

            this._maxAllowedPosition = [];

            this._$dateTable
                .find('tr')
                .first()
                .find('td:nth-child(' + this._getCellCount() + 'n)')
                .each((function(_, cell) {

                    let maxPosition = $(cell).position().left;

                    if(!isRtl) {
                        maxPosition += getBoundingRect(cell).width;
                    }

                    this._maxAllowedPosition.push(Math.round(maxPosition));
                }).bind(this));
        }

        return this._maxAllowedPosition;
    }

    getMaxAllowedVerticalPosition() {
        if(!this._maxAllowedVerticalPosition) {
            const that = this;
            this._maxAllowedVerticalPosition = [];

            const rows = this._getRowCount();
            this._$dateTable
                .find('tr:nth-child(' + rows + 'n)')
                .each(function(_, row) {

                    const maxPosition = $(row).position().top + getBoundingRect(row).height;

                    that._maxAllowedVerticalPosition.push(Math.round(maxPosition));
                });
        }

        return this._maxAllowedVerticalPosition;
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

        return new Date(endDateOfLastViewCell.getTime() - toMs('minute'));
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
        const result = this._groupedStrategy.getGroupBoundsOffset(cellCount, $cells, cellWidth, coordinates);

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
        const data = this.getCellDataCache(key);

        if(data) {
            return data;
        }

        const $cells = this._getCells(allDay);
        const cellIndex = this.getCellIndexByCoordinates(coordinates, allDay);
        const $cell = $cells.eq(cellIndex);

        return this.getCellData($cell);
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

    updateScrollPosition(date) {
        date = this.invoke('convertDateByTimezone', date);

        const bounds = this.getVisibleBounds();
        const startDateHour = date.getHours();
        const startDateMinutes = date.getMinutes();

        if(this.needUpdateScrollPosition(startDateHour, startDateMinutes, bounds, date)) {
            this.scrollToTime(startDateHour, startDateMinutes, date);
        }
    }

    needUpdateScrollPosition(hours, minutes, bounds) {
        let isUpdateNeeded = false;

        if(hours < bounds.top.hours || hours > bounds.bottom.hours) {
            isUpdateNeeded = true;
        }

        if(hours === bounds.top.hours && minutes < bounds.top.minutes) {
            isUpdateNeeded = true;
        }

        if(hours === bounds.bottom.hours && minutes > bounds.top.minutes) {
            isUpdateNeeded = true;
        }

        return isUpdateNeeded;
    }

    getGroupWidth(groupIndex) {
        let result = this._getCellCount() * this.getCellWidth();
        const position = this.getMaxAllowedPosition();
        const currentPosition = position[groupIndex];

        if(position.length && currentPosition) {
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
        const min = this.getStartViewDate();
        const max = this.getEndViewDate();

        if(date < min || date > max) {
            errors.log('W1008', date);
            return;
        }

        const coordinates = this._getScrollCoordinates(hours, minutes, date);
        const scrollable = this.getScrollable();

        scrollable.scrollBy({ top: coordinates.top - scrollable.scrollTop(), left: 0 });
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

            this.dragBehavior.addTo(this.getWorkArea());
            this.dragBehavior.addTo(this.getAllDayContainer());
            this.dragBehavior.addTo(this._$allDayPanel);
        }
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
}

module.exports = SchedulerWorkSpace;
