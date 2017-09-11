"use strict";

var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    dataUtils = require("../../core/element_data"),
    dateUtils = require("../../core/utils/date"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    messageLocalization = require("../../localization/message"),
    dateLocalization = require("../../localization/date"),
    toMs = dateUtils.dateToMilliseconds,
    Widget = require("../widget/ui.widget"),
    abstract = Widget.abstract,
    noop = require("../../core/utils/common").noop,
    isDefined = require("../../core/utils/type").isDefined,
    registerComponent = require("../../core/component_registrator"),
    publisherMixin = require("./ui.scheduler.publisher_mixin"),
    eventUtils = require("../../events/utils"),
    pointerEvents = require("../../events/pointer"),
    errors = require("../widget/ui.errors"),
    clickEvent = require("../../events/click"),
    dragEvents = require("../../events/drag"),
    Scrollable = require("../scroll_view/ui.scrollable"),
    tableCreator = require("./ui.scheduler.table_creator");

var COMPONENT_CLASS = "dx-scheduler-work-space",
    GROUPED_WORKSPACE_CLASS = "dx-scheduler-work-space-grouped",

    WORKSPACE_WITH_BOTH_SCROLLS_CLASS = "dx-scheduler-work-space-both-scrollbar",
    WORKSPACE_WITH_COUNT_CLASS = "dx-scheduler-work-space-count",
    WORKSPACE_WITH_ODD_CELLS_CLASS = "dx-scheduler-work-space-odd-cells",
    WORKSPACE_WITH_OVERLAPPING_CLASS = "dx-scheduler-work-space-overlapping",

    WORKSPACE_GROUPED_ATTR = "dx-group-row-count",

    TIME_PANEL_CLASS = "dx-scheduler-time-panel",
    TIME_PANEL_CELL_CLASS = "dx-scheduler-time-panel-cell",
    TIME_PANEL_ROW_CLASS = "dx-scheduler-time-panel-row",
    TIME_PANEL_ODD_ROW_COUNT_CLASS = "dx-scheduler-time-panel-odd-row-count",

    ALL_DAY_PANEL_CLASS = "dx-scheduler-all-day-panel",
    ALL_DAY_TABLE_CLASS = "dx-scheduler-all-day-table",
    FIXED_CONTAINER_CLASS = "dx-scheduler-fixed-appointments",
    ALL_DAY_CONTAINER_CLASS = "dx-scheduler-all-day-appointments",
    ALL_DAY_TITLE_CLASS = "dx-scheduler-all-day-title",
    ALL_DAY_TITLE_HIDDEN_CLASS = "dx-scheduler-all-day-title-hidden",
    ALL_DAY_TABLE_CELL_CLASS = "dx-scheduler-all-day-table-cell",
    ALL_DAY_TABLE_ROW_CLASS = "dx-scheduler-all-day-table-row",
    WORKSPACE_WITH_ALL_DAY_CLASS = "dx-scheduler-work-space-all-day",
    WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS = "dx-scheduler-work-space-all-day-collapsed",

    WORKSPACE_WITH_MOUSE_SELECTION_CLASS = "dx-scheduler-work-space-mouse-selection",

    HEADER_PANEL_CLASS = "dx-scheduler-header-panel",
    HEADER_PANEL_CELL_CLASS = "dx-scheduler-header-panel-cell",
    HEADER_ROW_CLASS = "dx-scheduler-header-row",
    HEADER_CURRENT_TIME_CELL_CLASS = "dx-scheduler-header-panel-current-time-cell",
    GROUP_ROW_CLASS = "dx-scheduler-group-row",
    GROUP_HEADER_CLASS = "dx-scheduler-group-header",
    GROUP_HEADER_CONTENT_CLASS = "dx-scheduler-group-header-content",

    DATE_TABLE_CLASS = "dx-scheduler-date-table",
    DATE_TABLE_CELL_CLASS = "dx-scheduler-date-table-cell",
    DATE_TABLE_ROW_CLASS = "dx-scheduler-date-table-row",
    DATE_TABLE_FOCUSED_CELL_CLASS = "dx-scheduler-focused-cell",

    DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    DATE_TIME_INDICATOR_ALL_DAY_CLASS = "dx-scheduler-date-time-indicator-all-day",
    DATE_TIME_INDICATOR_CONTENT_CLASS = "dx-scheduler-date-time-indicator-content",
    TIME_PANEL_CURRENT_TIME_CELL_CLASS = "dx-scheduler-time-panel-current-time-cell",

    DATE_TABLE_DROPPABLE_CELL_CLASS = "dx-scheduler-date-table-droppable-cell",

    SCHEDULER_HEADER_SCROLLABLE_CLASS = "dx-scheduler-header-scrollable",
    SCHEDULER_SIDEBAR_SCROLLABLE_CLASS = "dx-scheduler-sidebar-scrollable",
    SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS = "dx-scheduler-date-table-scrollable",

    SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, "dxSchedulerWorkSpace"),

    SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME = eventUtils.addNamespace(dragEvents.enter, "dxSchedulerDateTable"),
    SCHEDULER_CELL_DXDROP_EVENT_NAME = eventUtils.addNamespace(dragEvents.drop, "dxSchedulerDateTable"),
    SCHEDULER_CELL_DXCLICK_EVENT_NAME = eventUtils.addNamespace(clickEvent.name, "dxSchedulerDateTable"),

    SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME = eventUtils.addNamespace(pointerEvents.down, "dxSchedulerDateTable"),
    SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME = eventUtils.addNamespace(pointerEvents.up, "dxSchedulerDateTable"),

    SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME = eventUtils.addNamespace(pointerEvents.move, "dxSchedulerDateTable"),

    CELL_DATA = "dxCellData",

    DATE_TABLE_CELL_WIDTH = 75,

    DAY_MS = toMs("day"),
    HOUR_MS = toMs("hour");

var formatWeekday = function(date) {
    return dateLocalization.getDayNames("abbreviated")[date.getDay()];
};

var SchedulerWorkSpace = Widget.inherit({
    _supportedKeys: function() {

        var clickHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();

                if(this._focusedCells && this._focusedCells.length) {
                    this._showAddAppointmentPopup($(this._focusedCells));
                }
            },
            arrowPressHandler = function(e, cell) {
                e.preventDefault();
                e.stopPropagation();
                this._moveToCell(cell, e.shiftKey);
            };

        return extend(this.callBase(), {
            enter: clickHandler,
            space: clickHandler,
            downArrow: function(e) {
                var $cell = this._getCellFromNextRow("next", e.shiftKey);

                arrowPressHandler.call(this, e, $cell);
            },

            upArrow: function(e) {
                var $cell = this._getCellFromNextRow("prev", e.shiftKey);

                arrowPressHandler.call(this, e, $cell);
            },

            rightArrow: function(e) {
                var $rightCell = this._getRightCell(e.shiftKey);

                arrowPressHandler.call(this, e, $rightCell);
            },

            leftArrow: function(e) {
                var $leftCell = this._getLeftCell(e.shiftKey);

                arrowPressHandler.call(this, e, $leftCell);
            }
        });
    },

    _isRTL: function() {
        return this.option("rtlEnabled");
    },

    _getFocusedCell: function() {
        return this._$focusedCell ||
            this._$dateTable.find("." + this._getDateTableCellClass()).eq(0);
    },

    _getCellFromNextRow: function(direction) {
        var $currentCell = this._$focusedCell,
            cellIndex = $currentCell.index(),
            $row = $currentCell.parent(),
            $cell = $row[direction]().children().eq(cellIndex);

        $cell = this._checkForViewBounds($cell);
        return $cell;
    },

    _checkForViewBounds: function($item) {
        if(!$item.length) {
            $item = this._$focusedCell;
        }
        return $item;
    },

    _getRightCell: function(isMultiSelection) {
        var $rightCell,
            $focusedCell = this._$focusedCell,
            groupCount = this._getGroupCount(),
            rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount),
            lastIndexInRow = rowCellCount - 1,
            edgeCellIndex = this._isRTL() ? 0 : lastIndexInRow,
            currentIndex = $focusedCell.index(),
            direction = this._isRTL() ? "prev" : "next";

        if(currentIndex === edgeCellIndex || (isMultiSelection && this._isGroupEndCell($focusedCell))) {
            var $row = $focusedCell.parent(),
                sign = this._isRTL() ? 1 : -1;

            $rightCell = $row[direction]().children().eq(currentIndex + sign * lastIndexInRow);
            $rightCell = this._checkForViewBounds($rightCell);
        } else {
            $rightCell = $focusedCell[direction]();
        }

        return $rightCell;
    },

    _isGroupEndCell: function($cell) {
        var cellsInRow = this._getCellCount(),
            currentCellIndex = $cell.index(),
            result = currentCellIndex % cellsInRow;

        return this._isRTL() ? result === 0 : result === cellsInRow - 1;
    },

    _getLeftCell: function(isMultiSelection) {
        var $leftCell,
            $focusedCell = this._$focusedCell,
            groupCount = this._getGroupCount(),
            rowCellCount = isMultiSelection ? this._getCellCount() : this._getTotalCellCount(groupCount),
            lastIndexInRow = rowCellCount - 1,
            edgeCellIndex = this._isRTL() ? lastIndexInRow : 0,
            currentIndex = $focusedCell.index(),
            direction = this._isRTL() ? "next" : "prev";

        if(currentIndex === edgeCellIndex || (isMultiSelection && this._isGroupStartCell($focusedCell))) {
            var $row = $focusedCell.parent(),
                sign = this._isRTL() ? -1 : 1;

            $leftCell = $row[direction]().children().eq(currentIndex + sign * lastIndexInRow);
            $leftCell = this._checkForViewBounds($leftCell);
        } else {
            $leftCell = $focusedCell[direction]();
        }

        return $leftCell;
    },

    _isGroupStartCell: function($cell) {
        var cellsInRow = this._getCellCount(),
            currentCellIndex = $cell.index(),
            result = currentCellIndex % cellsInRow;

        return this._isRTL() ? result === cellsInRow - 1 : result === 0;
    },

    _moveToCell: function($cell, isMultiSelection) {
        isMultiSelection = isMultiSelection && this.option("allowMultipleCellSelection");

        this._setFocusedCell($cell, isMultiSelection);
        this._dateTableScrollable.scrollToElement($cell);
    },

    _setFocusedCell: function($cell, isMultiSelection) {
        if(!$cell.length) {
            return;
        }

        this._releaseFocusedCell();
        this._focusedCells = [];

        if(isMultiSelection) {
            $cell = this._correctCellForGroup($cell);
            var $targetCells = this._getCellsBetween($cell, this._$prevCell);
            this._focusedCells = $targetCells.toArray();
        } else {
            this._focusedCells = [$cell.get(0)];
            this._$prevCell = $cell;
        }

        var $focusedCells = $(this._focusedCells);

        this._toggleFocusClass(true, $focusedCells);
        this.setAria("label", "Add appointment", $focusedCells);

        this._toggleFocusedCellClass(true, $cell);
        this._$focusedCell = $cell;
    },

    _correctCellForGroup: function($cell) {
        var $focusedCell = this._$focusedCell,
            cellGroupIndex = this._getGroupIndexByCell($cell),
            focusedCellGroupIndex = this._getGroupIndexByCell($focusedCell),
            isDifferentTables = this._hasAllDayClass($cell) !== this._hasAllDayClass($focusedCell);

        return focusedCellGroupIndex !== cellGroupIndex || isDifferentTables ? $focusedCell : $cell;
    },

    _getCellsBetween: function($first, $last) {
        var isAllDayTable = this._hasAllDayClass($last),
            $cells = this._getCells(isAllDayTable),
            firstIndex = $cells.index($first),
            lastIndex = $cells.index($last);

        if(firstIndex > lastIndex) {
            var buffer = firstIndex;
            firstIndex = lastIndex;
            lastIndex = buffer;
        }

        $cells = $cells.slice(firstIndex, lastIndex + 1);

        if(this._getGroupCount() > 1) {
            var result = [],
                focusedGroupIndex = this._getGroupIndexByCell($first);
            each($cells, (function(_, cell) {
                var groupIndex = this._getGroupIndexByCell($(cell));
                if(focusedGroupIndex === groupIndex) {
                    result.push(cell);
                }
            }).bind(this));

            $cells = $(result);
        }
        return $cells;
    },

    _hasAllDayClass: function($cell) {
        return $cell.hasClass(ALL_DAY_TABLE_CELL_CLASS);
    },

    _getGroupIndexByCell: function($cell) {
        var cellsInRow = this._getCellCount(),
            currentCellIndex = $cell.index() + 1,
            groupIndex = Math.ceil(currentCellIndex / cellsInRow);

        return groupIndex;
    },

    _toggleFocusedCellClass: function(isFocused, $element) {
        var $focusTarget = $element && $element.length ? $element : this._focusTarget();
        $focusTarget.toggleClass(DATE_TABLE_FOCUSED_CELL_CLASS, isFocused);
    },

    _releaseFocusedCell: function($cell) {
        $cell = $cell || $(this._focusedCells);
        if(isDefined($cell)) {
            this._toggleFocusClass(false, $cell);
            this._toggleFocusedCellClass(false, $cell);
            this.setAria("label", undefined, $cell);
        }
    },

    _focusInHandler: function(e) {
        if($(e.target).is(this._focusTarget()) && this._isCellClick !== false) {
            delete this._isCellClick;
            this.callBase.apply(this, arguments);
            var $cell = this._getFocusedCell();
            this._setFocusedCell($cell);
        }
    },

    _focusOutHandler: function() {
        this.callBase.apply(this, arguments);
        this._releaseFocusedCell();
    },

    _focusTarget: function() {
        return this.element();
    },

    _activeStateUnit: "." + DATE_TABLE_CELL_CLASS + ", ." + ALL_DAY_TABLE_CELL_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
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
            _currentDateTime: new Date()
        });
    },

    _optionChanged: function(args) {

        switch(args.name) {
            case "dateCellTemplate":
            case "resourceCellTemplate":
            case "dataCellTemplate":
            case "timeCellTemplate":
            case "startDayHour":
            case "endDayHour":
            case "hoursInterval":
            case "firstDayOfWeek":
            case "currentDate":
            case "groups":
            case "startDate":
            case "showDateTimeIndicator":
            case "_currentDateTime":
                this._cleanWorkSpace();
                break;
            case "showAllDayPanel":
                this._toggleAllDayVisibility();
                this._refreshDateTimeIndicator();
                break;
            case "allDayExpanded":
                this._changeAllDayVisibility();
                this.notifyObserver("allDayPanelToggled");
                this._attachTablesEvents();
                this.headerPanelOffsetRecalculate();
                this._refreshDateTimeIndicator();
                break;
            case "onCellClick":
                this._createCellClickAction();
                break;
            case "intervalCount":
                this._cleanWorkSpace();
                this._toggleWorkSpaceCountClass();
                break;
            case "crossScrollingEnabled":
                this._toggleHorizontalScrollClass();
                this._dateTableScrollable.option(this._dateTableScrollableConfig());
                break;
            case "width":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "allowMultipleCellSelection":
                break;
            default:
                this.callBase(args);
        }
    },

    _cleanWorkSpace: function() {
        this._cleanView();
        this._toggleGroupedClass();
        this._toggleWorkSpaceWithOddCells();
        this._renderView();
    },

    _init: function() {
        this.callBase();

        this._toggleHorizontalScrollClass();
        this._toggleWorkSpaceCountClass();
        this._toggleWorkSpaceWithOddCells();
        this._toggleWorkSpaceOverlappingClass();

        this.element()
            .addClass(COMPONENT_CLASS)
            .addClass(this._getElementClass());

        this._initWorkSpaceUnits();

        this._initDateTableScrollable();

        this._createWorkSpaceElements();
    },

    _toggleHorizontalScrollClass: function() {
        this.element().toggleClass(WORKSPACE_WITH_BOTH_SCROLLS_CLASS, this.option("crossScrollingEnabled"));
    },

    _toggleWorkSpaceCountClass: function() {
        this.element().toggleClass(WORKSPACE_WITH_COUNT_CLASS, this._isWorkSpaceWithCount());
    },

    _isWorkSpaceWithCount: function() {
        return this.option("intervalCount") > 1;
    },

    _toggleWorkSpaceWithOddCells: function() {
        this.element().toggleClass(WORKSPACE_WITH_ODD_CELLS_CLASS, this._isWorkspaceWithOddCells());
    },

    _isWorkspaceWithOddCells: function() {
        return this.option("hoursInterval") === 0.5;
    },

    _toggleWorkSpaceOverlappingClass: function() {
        this.element().toggleClass(WORKSPACE_WITH_OVERLAPPING_CLASS, this._isWorkSpaceWithOverlapping());
    },

    _isWorkSpaceWithOverlapping: function() {
        return this.invoke("getMaxAppointmentsPerCell") !== undefined;
    },

    _getTimePanelClass: function() {
        return TIME_PANEL_CLASS;
    },

    _getDateTableClass: function() {
        return DATE_TABLE_CLASS;
    },

    _getDateTableRowClass: function() {
        return DATE_TABLE_ROW_CLASS;
    },

    _getDateTableCellClass: function() {
        return DATE_TABLE_CELL_CLASS;
    },

    _getGroupRowClass: function() {
        return GROUP_ROW_CLASS;
    },

    _getGroupHeaderClass: function() {
        return GROUP_HEADER_CLASS;
    },

    _getGroupHeaderContentClass: function() {
        return GROUP_HEADER_CONTENT_CLASS;
    },

    _initWorkSpaceUnits: function() {

        this._$headerPanel = $("<table>");

        this._$thead = $("<thead>").appendTo(this._$headerPanel);

        this._$fixedContainer = $("<div>").addClass(FIXED_CONTAINER_CLASS);
        this._$allDayContainer = $("<div>").addClass(ALL_DAY_CONTAINER_CLASS);

        this._$allDayTitle = $("<div>")
            .addClass(ALL_DAY_TITLE_CLASS)
            .text(messageLocalization.format("dxScheduler-allDay"))
            .appendTo(this.element());

        this._$allDayTable = $("<table>");

        this._$allDayPanel = $("<div>")
            .addClass(ALL_DAY_PANEL_CLASS)
            .append(this._$allDayTable);

        this._$timePanel = $("<table>").addClass(this._getTimePanelClass());

        this._$dateTable = $("<table>");
    },

    _initDateTableScrollable: function() {
        var $dateTableScrollable = $("<div>").addClass(SCHEDULER_DATE_TABLE_SCROLLABLE_CLASS);

        this._dateTableScrollable = this._createComponent($dateTableScrollable, Scrollable, this._dateTableScrollableConfig());
    },

    _dateTableScrollableConfig: function() {
        var config = {
            useKeyboard: false,
            useNative: false,
            bounceEnabled: false,
            updateManually: true,
            pushBackValue: 0
        };
        if(this.option("crossScrollingEnabled")) {
            config = extend(config, this._createCrossScrollingConfig());
        }

        return config;
    },

    _createCrossScrollingConfig: function() {
        var config = {};

        config.direction = "both";
        config.onScroll = (function(e) {
            if(!this._dateTableScrollWasHandled) {
                this._headerScrollWasHandled = true;
                this._sideBarScrollWasHandled = true;

                this._sidebarScrollable.scrollTo({
                    top: e.scrollOffset.top
                });
                this._headerScrollable.scrollTo({
                    left: e.scrollOffset.left
                });
            } else {
                this._dateTableScrollWasHandled = false;
            }
        }).bind(this);
        config.onEnd = (function() {
            this.notifyObserver("updateResizableArea", {});
        }).bind(this);

        return config;
    },

    _createWorkSpaceElements: function() {
        if(this.option("crossScrollingEnabled")) {
            this._createWorkSpaceScrollableElements();
        } else {
            this._createWorkSpaceStaticElements();
        }
    },

    _createWorkSpaceStaticElements: function() {
        this._dateTableScrollable.content().append(this._$timePanel, this._$dateTable);
        this.element().append(this._$fixedContainer, this._$headerPanel, this._$allDayContainer, this._$allDayPanel, this._dateTableScrollable.element());
    },

    _createWorkSpaceScrollableElements: function() {
        this.element().append(this._$fixedContainer);
        this._createHeaderScrollable();
        this._createSidebarScrollable();
        this.element().append(this._dateTableScrollable.element());

        this._headerScrollable.content().append(this._$headerPanel, this._$allDayContainer, this._$allDayPanel);
        this._dateTableScrollable.content().append(this._$dateTable);
        this._sidebarScrollable.content().append(this._$timePanel);
    },

    _createHeaderScrollable: function() {
        var $headerScrollable = $("<div>")
            .addClass(SCHEDULER_HEADER_SCROLLABLE_CLASS)
            .appendTo(this.element());

        this._headerScrollable = this._createComponent($headerScrollable, Scrollable, {
            useKeyboard: false,
            showScrollbar: false,
            direction: "horizontal",
            useNative: false,
            updateManually: true,
            bounceEnabled: false,
            pushBackValue: 0,
            onScroll: (function(e) {
                if(!this._headerScrollWasHandled) {
                    this._dateTableScrollWasHandled = true;
                    this._dateTableScrollable.scrollTo({
                        left: e.scrollOffset.left
                    });
                } else {
                    this._headerScrollWasHandled = false;
                }
            }).bind(this)
        });
    },

    _createSidebarScrollable: function() {
        var $timePanelScrollable = $("<div>")
            .addClass(SCHEDULER_SIDEBAR_SCROLLABLE_CLASS)
            .appendTo(this.element());

        this._sidebarScrollable = this._createComponent($timePanelScrollable, Scrollable, {
            useKeyboard: false,
            showScrollbar: false,
            direction: "vertical",
            useNative: false,
            updateManually: true,
            bounceEnabled: false,
            pushBackValue: 0,
            onScroll: (function(e) {
                if(!this._sideBarScrollWasHandled) {
                    this._dateTableScrollWasHandled = true;
                    this._dateTableScrollable.scrollTo({
                        top: e.scrollOffset.top
                    });
                } else {
                    this._sideBarScrollWasHandled = false;
                }
            }).bind(this)
        });
    },

    _visibilityChanged: function(visible) {
        if(visible && this.option("crossScrollingEnabled")) {
            this._setTableSizes();
        }
    },

    _attachTableClasses: function() {
        function addClass($el, className) {
            ($el && !$el.hasClass(className)) && $el.addClass(className);
        }
        addClass(this._$headerPanel, HEADER_PANEL_CLASS);
        addClass(this._$dateTable, this._getDateTableClass());
        addClass(this._$allDayTable, ALL_DAY_TABLE_CLASS);
    },

    _setTableSizes: function() {
        var cellWidth = DATE_TABLE_CELL_WIDTH,
            minWidth = this._getWorkSpaceMinWidth(),
            $headerCells = this._$headerPanel
                .find("tr")
                .last()
                .find("th");

        var width = cellWidth * $headerCells.length;

        if(width < minWidth) {
            width = minWidth;
        }

        this._$headerPanel.width(width);
        this._$dateTable.width(width);
        this._$allDayTable.width(width);

        if(this.option("crossScrollingEnabled")) {
            this._attachTableClasses();
        }
    },

    _getWorkSpaceMinWidth: function() {
        var minWidth = this._getWorkSpaceWidth(),
            workspaceContainerWidth = this.element().outerWidth() - this.getTimePanelWidth();

        if(minWidth < workspaceContainerWidth) {
            minWidth = workspaceContainerWidth;
        }

        return minWidth;
    },

    _dimensionChanged: function() {
        if(this.option("crossScrollingEnabled")) {
            this._setTableSizes();
        }

        this.headerPanelOffsetRecalculate();
        this._cleanCellDataCache();
        this._cleanAllowedPositions();
    },

    _getElementClass: noop,

    _getRowCount: noop,

    _getCellCount: noop,

    _render: function() {
        this.callBase();

        if(!this.option("crossScrollingEnabled")) {
            this._attachTableClasses();
        }

        this._toggleGroupedClass();

        this._renderView();
        this._attachEvents();
    },

    _toggleGroupedClass: function() {
        this.element().toggleClass(GROUPED_WORKSPACE_CLASS, this._getGroupCount() > 0);
    },

    _renderView: function() {
        this._setFirstViewDate();

        this._applyCellTemplates(
            this._renderGroupHeader()
        );

        this._renderDateHeader();

        this._renderTimePanel();
        this._renderAllDayPanel();

        this._renderDateTable();

        this._renderDateTimeIndicator();
    },

    _renderDateTimeIndicator: function() {
        if(this.option("showDateTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var $container = this._dateTableScrollable.content(),
                indicatorHeight = this._getDateTimeIndicatorHeight(),
                maxHeight = $container.outerHeight(),
                renderIndicatorContent = true;

            if(indicatorHeight > maxHeight) {
                indicatorHeight = maxHeight;
                renderIndicatorContent = false;
            }

            if(indicatorHeight > 0) {
                this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
                this._$indicator.height(indicatorHeight);

                this._renderAllDayIndicator();

                if(renderIndicatorContent) {
                    var $content = $("<div>").addClass(DATE_TIME_INDICATOR_CONTENT_CLASS).addClass("dx-icon-spinright");
                    $content.css("top", indicatorHeight - 10);
                    this._$indicator.append($content);
                }
                $container.append(this._$indicator);
            }
        }
    },

    _renderAllDayIndicator: function() {
        if(this.option("showAllDayPanel")) {
            this._$allDayIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this.getAllDayHeight());

            this._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    _getDateTimeIndicatorWidth: noop,

    _needRenderDateTimeIndicator: function() {
        var now = this.option("_currentDateTime") || new Date();

        return dateUtils.sameDate(now, this._firstViewDate);
    },

    _getDateTimeIndicatorHeight: function() {
        var today = this.option("_currentDateTime") || new Date(),
            cellHeight = this.getCellHeight(),
            duration = today.getTime() - this._firstViewDate.getTime(),
            cellCount = duration / this.getCellDuration();

        return cellCount * cellHeight;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this._getViewStartByOptions(), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());
        this._setStartDayHour(this._firstViewDate);
    },

    _getViewStartByOptions: function() {
        if(!this.option("startDate")) {
            return this.option("currentDate");
        } else {
            var startDate = dateUtils.trimTime(this._getStartViewDate()),
                currentDate = this.option("currentDate"),
                diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1,
                endDate = new Date(startDate.getTime() + this._getIntervalDuration() * diff);

            while(!this._dateInRange(currentDate, startDate, endDate, diff)) {
                startDate = endDate;
                endDate = new Date(startDate.getTime() + this._getIntervalDuration() * diff);
            }

            return diff > 0 ? startDate : endDate;
        }
    },

    _getStartViewDate: function() {
        return this.option("startDate");
    },

    _dateInRange: function(date, startDate, endDate, diff) {
        return diff > 0 ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : dateUtils.dateInRange(date, endDate, startDate, "date");
    },

    _getIntervalDuration: function() {
        return toMs("day") * this.option("intervalCount");
    },

    _setStartDayHour: function(date) {
        var startDayHour = this.option("startDayHour");
        if(isDefined(startDayHour)) {
            date.setHours(startDayHour, startDayHour % 1 * 60, 0, 0);
        }
    },

    _firstDayOfWeek: function() {
        return this.option("firstDayOfWeek");
    },

    _attachEvents: function() {
        var that = this;
        var pointerDownAction = this._createAction(function(e) {
            that._pointerDownHandler(e.jQueryEvent);
        });

        this._createCellClickAction();

        var cellSelector = "." + this._getDateTableCellClass() + ",." + ALL_DAY_TABLE_CELL_CLASS;
        var $element = this.element();

        eventsEngine.off($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME);
        eventsEngine.off($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME);
        eventsEngine.on($element, SCHEDULER_WORKSPACE_DXPOINTERDOWN_EVENT_NAME, function(e) {
            if(eventUtils.isMouseEvent(e) && e.which > 1) {
                e.preventDefault();
                return;
            }
            pointerDownAction({ jQueryEvent: e });
        });
        eventsEngine.on($element, SCHEDULER_CELL_DXCLICK_EVENT_NAME, cellSelector, function(e) {
            var $cell = $(e.target);
            that._cellClickAction({ jQueryEvent: e, cellElement: $cell, cellData: that.getCellData($cell) });
        });
    },

    _createCellClickAction: function() {
        var that = this;
        this._cellClickAction = this._createActionByOption("onCellClick", {
            afterExecute: function(e) {
                that._clickHandler(e.args[0].jQueryEvent);
            }
        });
    },

    _clickHandler: function(e) {
        var $target = $(e.target);

        if(this._showPopup && this._hasFocusClass($target)) {
            delete this._showPopup;
            this._showAddAppointmentPopup($target);
        }
    },

    _pointerDownHandler: function(e) {
        var $target = $(e.target);

        if(!$target.hasClass(this._getDateTableCellClass()) && !$target.hasClass(ALL_DAY_TABLE_CELL_CLASS)) {
            this._isCellClick = false;
            return;
        }

        this._isCellClick = true;
        if($target.hasClass(DATE_TABLE_FOCUSED_CELL_CLASS)) {
            this._showPopup = true;
        } else {
            this._setFocusedCell($target);
        }
    },

    _showAddAppointmentPopup: function($cell) {
        var firstCellData = this.getCellData($cell.first()),
            lastCellData = this.getCellData($cell.last());

        var args = {
            startDate: firstCellData.startDate,
            endDate: lastCellData.endDate
        };

        if(isDefined(lastCellData.allDay)) {
            args.allDay = lastCellData.allDay;
        }

        extend(args, lastCellData.groups);

        this.notifyObserver("showAddAppointmentPopup", args);
    },

    _getGroupHeaderContainer: function() {
        return this._$thead;
    },

    _getDateHeaderContainer: function() {
        return this._$thead;
    },

    _renderGroupHeader: function() {
        var $container = this._getGroupHeaderContainer(),
            groupCount = this._getGroupCount(),
            cellTemplates = [];

        if(groupCount) {
            var groupRows = this._makeGroupRows(this.option("groups"));
            this._attachGroupCountAttr(groupRows.elements.length);
            $container.append(groupRows.elements);
            cellTemplates = groupRows.cellTemplates;
        } else {
            this._detachGroupCountAttr();
        }

        return cellTemplates;
    },

    _applyCellTemplates: function(templates) {
        templates.forEach(function(template) {
            template();
        });
    },

    _detachGroupCountAttr: function() {
        this.element().removeAttr(WORKSPACE_GROUPED_ATTR);
    },

    _attachGroupCountAttr: function(groupRowCount) {
        this.element().attr(WORKSPACE_GROUPED_ATTR, groupRowCount);
    },

    headerPanelOffsetRecalculate: function() {
        if(!this.option("resourceCellTemplate") &&
           !this.option("dateCellTemplate")) {
            return;
        }

        var headerPanelHeight = this.getHeaderPanelHeight(),
            headerHeight = this.invoke("getHeaderHeight"),
            allDayPanelHeight = this.supportAllDayRow() && this.option("showAllDayPanel") ? this.getAllDayHeight() : 0;

        headerPanelHeight && this._dateTableScrollable.element().css({
            "padding-bottom": allDayPanelHeight + headerPanelHeight + "px",
            "marginBottom": -1 * ((parseInt(headerPanelHeight, 10)) + allDayPanelHeight) + "px"
        });

        this._$allDayTitle && this._$allDayTitle.css("top", headerHeight + headerPanelHeight + "px");
    },

    _makeGroupRows: function(groups) {
        return tableCreator.makeGroupedTable(tableCreator.HORIZONTAL,
            groups, {
                groupRowClass: this._getGroupRowClass(),
                groupHeaderClass: this._getGroupHeaderClass(),
                groupHeaderContentClass: this._getGroupHeaderContentClass()
            },
            this._getCellCount() || 1,
            this.option("resourceCellTemplate")
        );
    },

    _getDateHeaderTemplate: function() {
        return this.option("dateCellTemplate");
    },

    _renderDateHeader: function() {
        var $container = this._getDateHeaderContainer(),
            $headerRow = $("<tr>").addClass(HEADER_ROW_CLASS),
            count = this._getCellCount(),
            cellTemplate = this._getDateHeaderTemplate(),
            repeatCount = this._calculateHeaderCellRepeatCount(),
            templateCallbacks = [];

        for(var j = 0; j < repeatCount; j++) {
            for(var i = 0; i < count; i++) {
                var text = this._getHeaderText(i),
                    $cell = $("<th>")
                            .addClass(HEADER_PANEL_CELL_CLASS)
                            .attr("title", text);

                if(cellTemplate && cellTemplate.render) {
                    templateCallbacks.push(cellTemplate.render.bind(cellTemplate, {
                        model: {
                            text: text,
                            date: this._getDateByIndex(i)
                        },
                        index: j * repeatCount + i,
                        container: $cell
                    }));
                } else {
                    $cell.text(text);
                }

                if(this._isCurrentTimeHeaderCell(i)) {
                    $($cell).addClass(HEADER_CURRENT_TIME_CELL_CLASS);
                }

                $headerRow.append($cell);
            }
        }

        $container.append($headerRow);

        this._applyCellTemplates(templateCallbacks);

        return $headerRow;
    },

    _calculateHeaderCellRepeatCount: function() {
        return this._getGroupCount() || 1;
    },

    _renderAllDayPanel: function() {
        var cellCount = this._getCellCount() * (this._getGroupCount() || 1);

        var cellTemplates = this._renderTableBody({
            container: this._$allDayTable,
            rowCount: 1,
            cellCount: cellCount,
            cellClass: ALL_DAY_TABLE_CELL_CLASS,
            rowClass: ALL_DAY_TABLE_ROW_CLASS,
            cellTemplate: this.option("dataCellTemplate"),
            getCellData: this._getAllDayCellData.bind(this)
        }, true);

        this._toggleAllDayVisibility();
        this._applyCellTemplates(cellTemplates);
    },

    _getAllDayCellData: function(cell, rowIndex, cellIndex) {
        var startDate = this._getDateByCellIndexes(rowIndex, cellIndex);

        startDate = dateUtils.trimTime(startDate);

        var data = {
            startDate: startDate,
            endDate: new Date(startDate.getTime() + DAY_MS),
            allDay: true
        };

        var groups = this._getCellGroups(this._getGroupIndex(rowIndex, cellIndex));

        if(groups.length) {
            data.groups = {};
        }

        for(var i = 0; i < groups.length; i++) {
            data.groups[groups[i].name] = groups[i].id;
        }

        return {
            key: CELL_DATA,
            value: data
        };
    },

    _toggleAllDayVisibility: function() {
        var showAllDayPanel = this.option("showAllDayPanel");
        this._$allDayPanel.toggle(showAllDayPanel);
        this._$allDayTitle.toggleClass(ALL_DAY_TITLE_HIDDEN_CLASS, !showAllDayPanel);
        this.element().toggleClass(WORKSPACE_WITH_ALL_DAY_CLASS, showAllDayPanel);

        this._changeAllDayVisibility();
    },

    _changeAllDayVisibility: function() {
        this.element().toggleClass(WORKSPACE_WITH_COLLAPSED_ALL_DAY_CLASS, !this.option("allDayExpanded") && this.option("showAllDayPanel"));
    },

    _renderTimePanel: function() {
        var rowCount = this._getTimePanelRowCount();
        this._$timePanel.toggleClass(TIME_PANEL_ODD_ROW_COUNT_CLASS, rowCount % 1 > 0);
        this._renderTableBody({
            container: this._$timePanel,
            rowCount: rowCount,
            cellCount: 1,
            cellClass: TIME_PANEL_CELL_CLASS,
            rowClass: TIME_PANEL_ROW_CLASS,
            cellTemplate: this.option("timeCellTemplate"),
            getCellText: this._getTimeText.bind(this)
        });
    },

    _getTimePanelRowCount: function() {
        return 0.5 * this._getCellCountInDay();
    },

    _getCellCountInDay: function() {
        return Math.floor(this._calculateDayDuration() / this.option("hoursInterval"));
    },

    _calculateDayDuration: function() {
        return this.option("endDayHour") - this.option("startDayHour");
    },

    _getTimeText: function(i, j, td) {
        // T410490: incorrectly displaying time slots on Linux
        var startViewDate = new Date(this.getStartViewDate()),
            timeCellDuration = this.getCellDuration() * 2;

        startViewDate.setMilliseconds(startViewDate.getMilliseconds() + timeCellDuration * i);

        if(this._isCurrentTime(startViewDate)) {
            $(td).addClass(TIME_PANEL_CURRENT_TIME_CELL_CLASS);
        }
        return dateLocalization.format(startViewDate, "shorttime");
    },

    _isCurrentTime: function(date) {
        var now = this.option("_currentDateTime") || new Date(),
            result = false,
            startCellDate = new Date(date),
            endCellDate = new Date(date);

        if(dateUtils.sameDate(now, date)) {
            startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration());
            endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

            result = dateUtils.dateInRange(now, startCellDate, endCellDate);
        }
        return result;
    },

    _isCurrentTimeHeaderCell: function(headerIndex) {
        var result = false;

        if(this.option("showDateTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var date = this._getDateByIndex(headerIndex),
                now = this.option("_currentDateTime") || new Date();

            result = dateUtils.sameDate(date, now);
        }

        return result;
    },

    _renderDateTable: function() {
        var groupCount = this._getGroupCount();
        this._renderTableBody({
            container: this._$dateTable,
            rowCount: this._getTotalRowCount(groupCount),
            cellCount: this._getTotalCellCount(groupCount),
            cellClass: this._getDateTableCellClass(),
            rowClass: this._getDateTableRowClass(),
            cellTemplate: this.option("dataCellTemplate"),
            getCellData: this._getCellData.bind(this)
        });

        this._attachTablesEvents();
    },

    _getTotalCellCount: function(groupCount) {
        groupCount = groupCount || 1;
        return this._getCellCount() * groupCount;
    },

    _getTotalRowCount: function() {
        return this._getRowCount();
    },

    _getCellData: function(cell, rowIndex, cellIndex) {
        var data = this._prepareCellData(rowIndex, cellIndex, cell);

        return {
            key: CELL_DATA,
            value: data
        };
    },

    _prepareCellData: function(rowIndex, cellIndex) {
        var startDate = this._getDateByCellIndexes(rowIndex, cellIndex),
            endDate = this.calculateEndDate(startDate),
            data = {
                startDate: startDate,
                endDate: endDate,
                allDay: this._getTableAllDay()
            },
            groups = this._getCellGroups(this._getGroupIndex(rowIndex, cellIndex));

        if(groups.length) {
            data.groups = {};
        }

        for(var i = 0; i < groups.length; i++) {
            data.groups[groups[i].name] = groups[i].id;
        }

        return data;
    },

    _getGroupIndex: function(rowIndex, cellIndex) {
        return Math.floor(cellIndex / this._getCellCount());
    },

    _getTableAllDay: function() {
        return false;
    },

    calculateEndDate: function(startDate) {
        var result = new Date(startDate);
        result.setMilliseconds(result.getMilliseconds() + this._getInterval());
        return result;
    },

    _getGroupCount: function() {
        var groups = this.option("groups"),
            result = 0;

        for(var i = 0, len = groups.length; i < len; i++) {
            if(!i) {
                result = groups[i].items.length;
            } else {
                result *= groups[i].items.length;
            }
        }

        return result;
    },

    // move to resource manager
    _getPathToLeaf: function(leafIndex) {
        var tree = this.invoke("createResourcesTree", this.option("groups"));

        function findLeafByIndex(data, index) {
            for(var i = 0; i < data.length; i++) {
                if(data[i].leafIndex === index) {
                    return data[i];
                } else {
                    var leaf = findLeafByIndex(data[i].children, index);
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

        var leaf = findLeafByIndex(tree, leafIndex);
        return makeBranch(leaf).reverse();
    },

    _getCellGroups: function(groupIndex) {
        var result = [];

        if(this._getGroupCount()) {
            var groups = this.option("groups");

            if(groupIndex < 0) {
                return;
            }

            var path = this._getPathToLeaf(groupIndex);

            for(var i = 0; i < groups.length; i++) {
                result.push({
                    name: groups[i].name,
                    id: path[i]
                });
            }

        }

        return result;
    },

    _attachTablesEvents: function() {
        this._attachTableEvents(this._getDateTable());
        this._attachTableEvents(this._getAllDayTable());
    },

    _attachTableEvents: function($table) {
        var that = this,
            isPointerDown = false,
            cellHeight,
            cellWidth;

        eventsEngine.off($table, SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME);
        eventsEngine.off($table, SCHEDULER_CELL_DXDROP_EVENT_NAME);
        eventsEngine.off($table, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME);
        eventsEngine.off($table, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME);
        eventsEngine.on($table, SCHEDULER_CELL_DXDRAGENTER_EVENT_NAME, "td", {
            itemSizeFunc: function($element) {
                if(!cellHeight) {
                    cellHeight = $element.height();
                }
                if(!cellWidth) {
                    cellWidth = $element.width();
                }
                return {
                    width: cellWidth,
                    height: cellHeight
                };
            }
        }, function(e) {
            if(that._$currentTableTarget) {
                that._$currentTableTarget.removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
            }
            that._$currentTableTarget = $(e.target);
            that._$currentTableTarget.addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
        });
        eventsEngine.on($table, SCHEDULER_CELL_DXDROP_EVENT_NAME, "td", function(e) {
            $(e.target).removeClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
            cellHeight = 0;
            cellWidth = 0;
        });
        eventsEngine.on($table, SCHEDULER_CELL_DXPOINTERDOWN_EVENT_NAME, "td", function(e) {
            if(eventUtils.isMouseEvent(e) && e.which === 1) {
                isPointerDown = true;
                that.element().addClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                eventsEngine.off(document, SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME);
                eventsEngine.on(document, SCHEDULER_CELL_DXPOINTERUP_EVENT_NAME, function() {
                    isPointerDown = false;
                    that.element().removeClass(WORKSPACE_WITH_MOUSE_SELECTION_CLASS);
                });
            }
        });
        eventsEngine.on($table, SCHEDULER_CELL_DXPOINTERMOVE_EVENT_NAME, "td", function(e) {
            if(isPointerDown) {
                e.preventDefault();
                e.stopPropagation();
                that._moveToCell($(e.target), true);
            }
        });
    },

    _getDateTables: function() {
        return this._$dateTable.add(this._$allDayTable);
    },

    _getDateTable: function() {
        return this._$dateTable;
    },

    _getAllDayTable: function() {
        return this._$allDayTable;
    },

    _getInterval: function() {
        if(this._interval === undefined) {
            this._interval = this.option("hoursInterval") * HOUR_MS;
        }
        return this._interval;
    },

    _getHeaderText: function(headerIndex) {
        return dateLocalization.format(this._getDateByIndex(headerIndex), this._getFormat());
    },

    _getDateByIndex: abstract,
    _getFormat: abstract,

    _calculateCellIndex: function(rowIndex, cellIndex) {
        cellIndex = cellIndex % this._getCellCount();
        return this._getRowCount() * cellIndex + rowIndex;
    },

    _renderTableBody: function(options, delayCellTemplateRendering) {
        var result = [];
        if(!delayCellTemplateRendering) {
            this._applyCellTemplates(
                tableCreator.makeTable(options)
            );
        } else {
            result = tableCreator.makeTable(options);
        }

        return result;
    },

    _cleanView: function() {
        this._cleanCellDataCache();
        this._cleanAllowedPositions();
        this._$thead.empty();
        this._$dateTable.empty();
        this._cleanDateTimeIndicator();
        this._$timePanel.empty();
        this._$allDayTable.empty();
        delete this._hiddenInterval;
        delete this._interval;
    },

    _cleanDateTimeIndicator: function() {
        this._$indicator && this._$indicator.remove();
        this._$allDayIndicator && this._$allDayIndicator.remove();
    },

    _refreshDateTimeIndicator: function() {
        this._cleanDateTimeIndicator();
        this._renderDateTimeIndicator();
    },

    getWorkArea: function() {
        return this._dateTableScrollable.content();
    },

    getScrollable: function() {
        return this._dateTableScrollable;
    },

    getScrollableScrollTop: function() {
        return this._dateTableScrollable.scrollTop();
    },

    getScrollableScrollLeft: function() {
        return this._dateTableScrollable.scrollLeft();
    },

    getScrollableOuterWidth: function() {
        return this._dateTableScrollable.scrollWidth();
    },

    getScrollableContainer: function() {
        return this._dateTableScrollable._container();
    },

    getHeaderPanelHeight: function() {
        return this._$headerPanel && this._$headerPanel.outerHeight(true);
    },

    getTimePanelWidth: function() {
        return this._$timePanel.outerWidth();
    },

    _getCellCoordinatesByIndex: function(index) {
        var cellIndex = Math.floor(index / this._getRowCount()),
            rowIndex = index - this._getRowCount() * cellIndex;

        return {
            cellIndex: cellIndex,
            rowIndex: rowIndex
        };
    },

    _getDateByCellIndexes: function(rowIndex, cellIndex) {
        var firstViewDate = this.getStartViewDate(),
            currentDate = new Date(firstViewDate.getTime() + this._getMillisecondsOffset(rowIndex, cellIndex) + this._getOffsetByCount(cellIndex));

        currentDate.setTime(currentDate.getTime() + dateUtils.getTimezonesDifference(firstViewDate, currentDate));
        return currentDate;
    },

    _getOffsetByCount: function() {
        return 0;
    },

    _getMillisecondsOffset: function(rowIndex, cellIndex) {
        return this._getInterval() * this._calculateCellIndex(rowIndex, cellIndex) + this._calculateHiddenInterval(rowIndex, cellIndex);
    },

    _calculateHiddenInterval: function(rowIndex, cellIndex) {
        var dayCount = cellIndex % this._getCellCount();
        return dayCount * this._getHiddenInterval();
    },

    _getHiddenInterval: function() {
        if(this._hiddenInterval === undefined) {
            this._hiddenInterval = DAY_MS - this.option("hoursInterval") * this._getCellCountInDay() * HOUR_MS;
        }
        return this._hiddenInterval;
    },

    _getIntervalBetween: function(currentDate, allDay) {
        var startDayTime = this.option("startDayHour") * HOUR_MS,
            firstViewDate = this.getStartViewDate(),
            timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate),
            fullInterval = currentDate.getTime() - firstViewDate.getTime() - timeZoneOffset,
            days = this._getDaysOfInterval(fullInterval, startDayTime),
            result = (days - this._getWeekendsCount(days)) * DAY_MS;

        if(!allDay) {
            result = fullInterval - (days + this._getWeekendsCount(days)) * this._getHiddenInterval();
        }

        return result;
    },

    _getWeekendsCount: function() {
        return 0;
    },

    _getDaysOfInterval: function(fullInterval, startDayTime) {
        return Math.floor((fullInterval + startDayTime) / DAY_MS);
    },

    _getGroupIndexes: function(appointmentResources) {
        var result = [];
        if(appointmentResources && this.option("groups").length) {
            var tree = this.invoke("createResourcesTree", this.option("groups"));
            result = this.invoke("getResourceTreeLeaves", tree, appointmentResources);
        }

        return result;
    },

    _updateIndex: function(index) {
        return index * this._getRowCount();
    },

    _getDroppableCell: function() {
        return this._getDateTables().find("." + DATE_TABLE_DROPPABLE_CELL_CLASS);
    },

    _getWorkSpaceWidth: function() {
        if(this.option("crossScrollingEnabled")) {
            return this._$dateTable.outerWidth();
        }

        return this.element().outerWidth() - this.getTimePanelWidth();
    },

    _getCellPositionByIndex: function(index, groupIndex) {
        var cellCoordinates = this._getCellCoordinatesByIndex(index),
            $cell = this._getCellByCoordinates(cellCoordinates, groupIndex),
            result = this._getCellPosition($cell);

        this.setCellDataCache(cellCoordinates, groupIndex, $cell);

        if(result) {
            result.rowIndex = cellCoordinates.rowIndex;
            result.cellIndex = cellCoordinates.cellIndex;
        }

        return result;
    },

    _getCellPosition: function($cell) {
        var isRtl = this.option("rtlEnabled"),
            position = $cell.position();

        if(isRtl) {
            position.left += $cell.outerWidth();
        }
        return position;
    },

    _getCellByCoordinates: function(cellCoordinates, groupIndex) {
        return this._$dateTable
            .find("tr")
            .eq(cellCoordinates.rowIndex)
            .find("td")
            .eq(cellCoordinates.cellIndex + groupIndex * this._getCellCount());
    },

    _getCells: function(allDay) {
        var cellClass = allDay ? ALL_DAY_TABLE_CELL_CLASS : this._getDateTableCellClass();
        return this.element().find("." + cellClass);
    },

    _getGroupHeaderCellsContent: function() {
        return this.element().find("." + GROUP_HEADER_CONTENT_CLASS);
    },

    _getGroupHeaderCells: function() {
        return this.element().find("." + GROUP_HEADER_CLASS);
    },

    _getScrollCoordinates: function(hours, minutes, date) {
        var currentDate = date || new Date(this.option("currentDate")),
            startDayHour = this.option("startDayHour"),
            endDayHour = this.option("endDayHour");

        if(hours < startDayHour) {
            hours = startDayHour;
        }

        if(hours >= endDayHour) {
            hours = endDayHour - 1;
        }

        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);

        return this.getCoordinatesByDate(currentDate);
    },


    setCellDataCache: function(cellCoordinates, groupIndex, $cell) {
        var cache = this.getCellDataCache(),
            data = this.getCellData($cell);

        var key = JSON.stringify({
            rowIndex: cellCoordinates.rowIndex,
            cellIndex: cellCoordinates.cellIndex,
            groupIndex: groupIndex
        });

        cache[key] = data;
    },

    setCellDataCacheAlias: function(appointment, geometry) {
        var key = JSON.stringify({
                rowIndex: appointment.rowIndex,
                cellIndex: appointment.cellIndex,
                groupIndex: appointment.groupIndex
            }),
            aliasKey = JSON.stringify({
                top: geometry.top,
                left: geometry.left
            }),
            cache = this.getCellDataCache();

        if(cache[key]) {
            cache[aliasKey] = cache[key];
        }
    },

    getCellDataCache: function(key) {
        if(!this._cache) {
            this._cache = {};
        }

        return key ? this._cache[key] : this._cache;
    },

    _cleanCellDataCache: function() {
        delete this._cache;
    },

    _cleanAllowedPositions: function() {
        delete this._maxAllowedVerticalPosition;
        delete this._maxAllowedPosition;
    },

    supportAllDayRow: function() {
        return true;
    },

    keepOriginalHours: function() {
        return false;
    },

    getCellData: function($cell) {
        var data = $cell[0] ? dataUtils.data($cell[0], CELL_DATA) : undefined;
        return extend(true, {}, data);
    },

    getCoordinatesByDate: function(date, groupIndex, inAllDayRow) {
        groupIndex = groupIndex || 0;

        var index = this.getCellIndexByDate(date, inAllDayRow),
            position = this._getCellPositionByIndex(index, groupIndex),
            shift = this.getPositionShift(inAllDayRow ? 0 : this.getTimeShift(date));

        if(!position) {
            throw errors.Error("E1039");
        }

        return {
            top: position.top + shift.top,
            left: position.left + shift.left,
            rowIndex: position.rowIndex,
            cellIndex: position.cellIndex,
            hMax: this.getMaxAllowedPosition()[groupIndex],
            vMax: this.getMaxAllowedVerticalPosition(),
            groupIndex: groupIndex
        };
    },

    getCellIndexByDate: function(date, inAllDayRow) {
        var timeInterval = inAllDayRow ? 24 * 60 * 60 * 1000 : this._getInterval(),
            dateTimeStamp = this._getIntervalBetween(date, inAllDayRow);

        var index = Math.floor(dateTimeStamp / timeInterval);

        if(inAllDayRow) {
            index = this._updateIndex(index);
        }

        if(index < 0) {
            index = 0;
        }

        return index;
    },

    getPositionShift: function(timeShift) {
        return {
            top: timeShift * this.getCellHeight(),
            left: 0
        };
    },

    getTimeShift: function(date) {
        var cellDuration = this.getCellDuration(),
            currentDayStart = new Date(date);

        currentDayStart.setMinutes(0, 0, 0);
        currentDayStart.setHours(this.option("startDayHour"));

        return ((date.getTime() - currentDayStart.getTime()) % cellDuration) / cellDuration;
    },

    getCoordinatesByDateInGroup: function(date, appointmentResources, inAllDayRow) {
        var indexes = this._getGroupIndexes(appointmentResources),
            result = [];

        if(indexes.length) {
            for(var i = 0; i < indexes.length; i++) {
                result.push(this.getCoordinatesByDate(date, indexes[i], inAllDayRow));
            }
        } else {
            result.push(this.getCoordinatesByDate(date, 0, inAllDayRow));
        }

        return result;
    },

    getDroppableCellIndex: function() {
        var $droppableCell = this._getDroppableCell(),
            $row = $droppableCell.parent(),
            rowIndex = $row.index();

        return rowIndex * $row.find("td").length + $droppableCell.index();
    },

    getDataByDroppableCell: function() {
        var cellData = this.getCellData(this._getDroppableCell());

        return {
            date: cellData.startDate,
            allDay: cellData.allDay,
            groups: cellData.groups
        };
    },

    getDateRange: function() {
        return [
            this.getStartViewDate(),
            this.getEndViewDate()
        ];
    },

    getCellWidth: function() {
        return this._getCells().first().outerWidth();
    },

    getCellHeight: function() {
        return this._getCells().first().outerHeight();
    },

    getAllDayHeight: function() {
        return this.option("showAllDayPanel") ? this._getCells(true).first().outerHeight() || 0 : 0;
    },

    getMaxAllowedPosition: function() {
        if(!this._maxAllowedPosition) {
            var isRtl = this.option("rtlEnabled"),
                that = this;

            this._maxAllowedPosition = [];

            this._$dateTable
                .find("tr")
                .first()
                .find("td:nth-child(" + this._getCellCount() + "n)")
                .each(function(_, cell) {

                    var maxPosition = $(cell).position().left;

                    if(!isRtl) {
                        maxPosition += $(cell).outerWidth();
                    }

                    that._maxAllowedPosition.push(Math.round(maxPosition));
                });
        }

        return this._maxAllowedPosition;
    },

    getMaxAllowedVerticalPosition: function() {
        if(!this._maxAllowedVerticalPosition) {
            var rows = this._getRowCount(),
                row = this._$dateTable.find("tr:nth-child(" + rows + "n)"),
                maxPosition = $(row).position().top + $(row).outerHeight();

            this._maxAllowedVerticalPosition = Math.round(maxPosition);
        }

        return this._maxAllowedVerticalPosition;
    },

    getFixedContainer: function() {
        return this._$fixedContainer;
    },

    getAllDayContainer: function() {
        return this._$allDayContainer;
    },

    //NOTE: refactor leftIndex calculation
    getCellIndexByCoordinates: function(coordinates, allDay) {
        var cellCount = this._getTotalCellCount(this._getGroupCount()),
            timePanelWidth = this.getTimePanelWidth(),
            cellWidth = Math.floor(this._getWorkSpaceWidth() / cellCount),
            leftOffset = this._isRTL() || this.option("crossScrollingEnabled") ? 0 : timePanelWidth,
            topIndex = Math.floor(coordinates.top / (allDay ? this.getAllDayHeight() : this.getCellHeight())),
            leftIndex = Math.floor((coordinates.left + 5 - leftOffset) / cellWidth);

        if(this._isRTL()) {
            leftIndex = cellCount - leftIndex - 1;
        }

        return cellCount * topIndex + leftIndex;
    },

    getStartViewDate: function() {
        return this._firstViewDate;
    },

    getEndViewDate: function() {
        var dateOfLastViewCell = this._getDateByCellIndexes(this._getRowCount() - 1, this._getCellCount() - 1);
        return new Date(dateOfLastViewCell.getTime() + this.getCellDuration() - 60000);
    },

    getCellDuration: function() {
        return 3600000 * this.option("hoursInterval");
    },

    getGroupBounds: function(coordinates) {
        var cellIndex = this.getCellIndexByCoordinates(coordinates),
            cellCount = this._getCellCount(),
            groupIndex = Math.floor(cellIndex / cellCount),
            $cells = this._getCells(),
            cellWidth = this.getCellWidth(),
            startCellIndex = groupIndex * cellCount,

            startOffset = $cells.eq(startCellIndex).offset().left - cellWidth / 2,
            endOffset = $cells.eq(startCellIndex + cellCount - 1).offset().left + cellWidth + cellWidth / 2;

        var result = {
            left: startOffset,
            right: endOffset
        };

        if(this._isRTL()) {
            result.left = endOffset - cellWidth * 2;
            result.right = startOffset + cellWidth * 2;
        }

        return result;
    },

    getCellDataByCoordinates: function(coordinates, allDay) {
        var key = JSON.stringify({ top: coordinates.top, left: coordinates.left }),
            data = this.getCellDataCache(key);

        if(data) {
            return data;
        }

        var $cells = this._getCells(allDay),
            cellIndex = this.getCellIndexByCoordinates(coordinates, allDay),
            $cell = $cells.eq(cellIndex);

        return this.getCellData($cell);
    },

    getVisibleBounds: function() {
        var result = {},
            $scrollable = this.getScrollable().element(),
            cellHeight = this.getCellHeight(),
            scrolledCellCount = this.getScrollableScrollTop() / cellHeight,
            totalCellCount = scrolledCellCount + $scrollable.height() / cellHeight;

        result.top = {
            hours: Math.floor(scrolledCellCount * this.option("hoursInterval")) + this.option("startDayHour"),
            minutes: scrolledCellCount % 2 ? 30 : 0
        };

        result.bottom = {
            hours: Math.floor(totalCellCount * this.option("hoursInterval")) + this.option("startDayHour"),
            minutes: Math.floor(totalCellCount) % 2 ? 30 : 0
        };

        return result;
    },

    updateScrollPosition: function(date) {
        date = this.invoke("convertDateByTimezone", date);

        var bounds = this.getVisibleBounds(),
            startDateHour = date.getHours(),
            startDateMinutes = date.getMinutes();

        if(this.needUpdateScrollPosition(startDateHour, startDateMinutes, bounds, date)) {
            this.scrollToTime(startDateHour, startDateMinutes, date);
        }
    },

    needUpdateScrollPosition: function(hours, minutes, bounds) {
        var isUpdateNeeded = false;

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
    },

    getGroupWidth: function(groupIndex) {
        var result = this._getCellCount() * this.getCellWidth(),
            position = this.getMaxAllowedPosition(),
            currentPosition = position[groupIndex];

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
    },

    //NOTE: T312051, remove after fix scrollable bug T324196
    restoreScrollTop: function() {
        this.element().scrollTop(0);
    },

    scrollToTime: function(hours, minutes, date) {
        var min = this.getStartViewDate(),
            max = this.getEndViewDate();

        if(date < min || date > max) {
            errors.log("W1008", date);
            return;
        }

        var coordinates = this._getScrollCoordinates(hours, minutes, date),
            scrollable = this.getScrollable();

        scrollable.scrollBy(coordinates.top - scrollable.scrollTop());
    },

    getDistanceBetweenCells: function(startIndex, endIndex) {
        var result = 0;

        this.element()
            .find("." + this._getDateTableRowClass())
            .first()
            .find("." + this._getDateTableCellClass()).each(function(index) {
                if(index < startIndex || index > endIndex) {
                    return true;
                }

                result += $(this).outerWidth();
            });

        return result;
    },

    _formatWeekday: function(date) {
        return formatWeekday(date);
    },

    _formatWeekdayAndDay: function(date) {
        return formatWeekday(date) + " " + dateLocalization.format(date, "day");
    }

}).include(publisherMixin);

registerComponent("dxSchedulerWorkSpace", SchedulerWorkSpace);

module.exports = SchedulerWorkSpace;
