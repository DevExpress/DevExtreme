import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import { data as elementData } from '../../core/element_data';
import { getPublicElement } from '../../core/element';
import Widget from '../widget/ui.widget';
import coreDateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { noop } from '../../core/utils/common';
import dateSerialization from '../../core/utils/date_serialization';
import messageLocalization from '../../localization/message';
import { addNamespace } from '../../events/utils/index';
import { name as clickEventName } from '../../events/click';
import { start as hoverStartEventName } from '../../events/hover';

const { abstract } = Widget;

const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_CELL_START_CLASS = 'dx-calendar-cell-start';
const CALENDAR_CELL_END_CLASS = 'dx-calendar-cell-end';
const CALENDAR_CELL_START_IN_ROW_CLASS = 'dx-calendar-cell-start-in-row';
const CALENDAR_CELL_END_IN_ROW_CLASS = 'dx-calendar-cell-end-in-row';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CELL_IN_RANGE_CLASS = 'dx-calendar-cell-in-range';
const CALENDAR_CELL_RANGE_HOVER_CLASS = 'dx-calendar-cell-range-hover';
const CALENDAR_CELL_RANGE_HOVER_START_CLASS = 'dx-calendar-cell-range-hover-start';
const CALENDAR_CELL_RANGE_HOVER_END_CLASS = 'dx-calendar-cell-range-hover-end';
const CALENDAR_RANGE_START_DATE_CLASS = 'dx-calendar-range-start-date';
const CALENDAR_RANGE_END_DATE_CLASS = 'dx-calendar-range-end-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';
const NOT_WEEK_CELL_SELECTOR = `td:not(.${CALENDAR_WEEK_NUMBER_CELL_CLASS})`;

const CALENDAR_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxCalendar');
const CALENDAR_DXHOVERSTART_EVENT_NAME = addNamespace(hoverStartEventName, 'dxCalendar');

const CALENDAR_DATE_VALUE_KEY = 'dxDateValueKey';

const BaseView = Widget.inherit({

    _getViewName: function() {
        return 'base';
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            date: new Date(),
            focusStateEnabled: false,
            cellTemplate: null,
            disabledDates: null,
            onCellClick: null,
            onCellHover: null,
            rowCount: 3,
            colCount: 4,
            allowValueSelection: true,
            _todayDate: () => new Date()
        });
    },

    _initMarkup: function() {
        this.callBase();

        this._renderImpl();
    },

    _renderImpl: function() {
        this.$element().append(this._createTable());

        this._createDisabledDatesHandler();
        this._renderBody();
        this._renderContouredDate();
        this._renderValue();
        this._renderRange();
        this._renderEvents();
    },

    _createTable: function() {
        this._$table = $('<table>');

        const localizedWidgetName = messageLocalization.format('dxCalendar-ariaWidgetName');
        const localizedHotKeysInfo = messageLocalization.format('dxCalendar-ariaHotKeysInfo');

        this.setAria({
            label: `${localizedWidgetName}. ${localizedHotKeysInfo}`,
            role: 'grid'
        }, this._$table);

        return this._$table;
    },

    _renderBody: function() {
        this.$body = $('<tbody>').appendTo(this._$table);

        const rowData = {
            cellDate: this._getFirstCellData(),
            prevCellDate: null
        };

        for(let rowIndex = 0, rowCount = this.option('rowCount'); rowIndex < rowCount; rowIndex++) {
            rowData.row = this._createRow();
            for(let colIndex = 0, colCount = this.option('colCount'); colIndex < colCount; colIndex++) {
                this._renderCell(rowData, colIndex);
            }

            this._renderWeekNumberCell(rowData);
        }
    },

    _createRow: function() {
        const row = domAdapter.createElement('tr');

        this.setAria('role', 'row', $(row));
        this.$body.get(0).appendChild(row);

        return row;
    },

    _createCell: function(cellDate, cellIndex) {
        const cell = domAdapter.createElement('td');
        const $cell = $(cell);

        cell.className = this._getClassNameByDate(cellDate, cellIndex);

        cell.setAttribute('data-value', dateSerialization.serializeDate(cellDate, coreDateUtils.getShortDateFormat()));
        elementData(cell, CALENDAR_DATE_VALUE_KEY, cellDate);

        this.setAria({
            'role': 'gridcell',
            'label': this.getCellAriaLabel(cellDate)
        }, $cell);

        return { cell, $cell };
    },

    _renderCell: function(params, cellIndex) {
        const { cellDate, prevCellDate, row } = params;

        // T425127
        if(prevCellDate) {
            coreDateUtils.fixTimezoneGap(prevCellDate, cellDate);
        }

        params.prevCellDate = cellDate;

        const { cell, $cell } = this._createCell(cellDate, cellIndex);

        const cellTemplate = this.option('cellTemplate');

        $(row).append(cell);

        if(cellTemplate) {
            cellTemplate.render(this._prepareCellTemplateData(cellDate, cellIndex, $cell));
        } else {
            cell.innerHTML = this._getCellText(cellDate);
        }

        params.cellDate = this._getNextCellData(cellDate);
    },

    _getClassNameByDate: function(cellDate, cellIndex) {
        let className = CALENDAR_CELL_CLASS;

        if(this._isTodayCell(cellDate)) {
            className += ` ${CALENDAR_TODAY_CLASS}`;
        }

        if(this._isDateOutOfRange(cellDate) || this.isDateDisabled(cellDate)) {
            className += ` ${CALENDAR_EMPTY_CELL_CLASS}`;
        }

        if(this._isOtherView(cellDate)) {
            className += ` ${CALENDAR_OTHER_VIEW_CLASS}`;
        }

        if(this.option('selectionMode') === 'range') {
            if(cellIndex === 0) {
                className += ` ${CALENDAR_CELL_START_IN_ROW_CLASS}`;
            }

            if(cellIndex === this.option('colCount') - 1) {
                className += ` ${CALENDAR_CELL_END_IN_ROW_CLASS}`;
            }


            if(this._isStartDayOfMonth(cellDate)) {
                className += ` ${CALENDAR_CELL_START_CLASS}`;
            }

            if(this._isEndDayOfMonth(cellDate)) {
                className += ` ${CALENDAR_CELL_END_CLASS}`;
            }
        }

        return className;

    },

    _prepareCellTemplateData: function(cellDate, cellIndex, $cell) {
        const isDateCell = cellDate instanceof Date;
        const text = isDateCell ? this._getCellText(cellDate) : cellDate;
        const date = isDateCell ? cellDate : undefined;
        const view = this._getViewName();

        return {
            model: { text, date, view },
            container: getPublicElement($cell),
            index: cellIndex
        };
    },

    _renderEvents: function() {
        this._createCellClickAction();

        eventsEngine.off(this._$table, CALENDAR_DXCLICK_EVENT_NAME);
        eventsEngine.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, NOT_WEEK_CELL_SELECTOR, ((e) => {
            if(!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
                this._cellClickAction({
                    event: e,
                    value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
                });
            }
        }));

        eventsEngine.off(this._$table, CALENDAR_DXHOVERSTART_EVENT_NAME);
        if(this.option('selectionMode') === 'range') {
            this._createCellHoverAction();

            eventsEngine.on(this._$table, CALENDAR_DXHOVERSTART_EVENT_NAME, NOT_WEEK_CELL_SELECTOR, ((e) => {
                if(!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
                    this._cellHoverAction({
                        event: e,
                        value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
                    });
                }
            }));
        }
    },

    _createCellClickAction: function() {
        this._cellClickAction = this._createActionByOption('onCellClick');
    },

    _createCellHoverAction: function() {
        this._cellHoverAction = this._createActionByOption('onCellHover');
    },

    _createDisabledDatesHandler: function() {
        const disabledDates = this.option('disabledDates');

        this._disabledDatesHandler = Array.isArray(disabledDates) ? this._getDefaultDisabledDatesHandler(disabledDates) : disabledDates || noop;
    },

    _getDefaultDisabledDatesHandler: function(disabledDates) {
        return noop;
    },

    _isTodayCell: abstract,

    _isDateOutOfRange: abstract,

    isDateDisabled: function(cellDate) {
        const dateParts = {
            date: cellDate,
            view: this._getViewName()
        };

        return this._disabledDatesHandler(dateParts);
    },

    _isOtherView: abstract,

    _isStartDayOfMonth: abstract,

    _isEndDayOfMonth: abstract,

    _getCellText: abstract,

    _getFirstCellData: abstract,

    _getNextCellData: abstract,

    _renderContouredDate: function(contouredDate) {
        if(!this.option('focusStateEnabled')) {
            return;
        }

        contouredDate = contouredDate || this.option('contouredDate');

        const $oldContouredCell = this._getContouredCell();
        const $newContouredCell = this._getCellByDate(contouredDate);

        $oldContouredCell.removeClass(CALENDAR_CONTOURED_DATE_CLASS);
        $newContouredCell.addClass(CALENDAR_CONTOURED_DATE_CLASS);
    },

    _getContouredCell: function() {
        return this._$table.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
    },

    _renderValue: function() {
        if(!this.option('allowValueSelection')) {
            return;
        }

        let value = this.option('value');
        if(!Array.isArray(value)) {
            value = [value];
        }

        this._updateSelectedClass(value);
    },

    _updateSelectedClass: function(value) {
        this._$selectedCells?.forEach(($cell) => { $cell.removeClass(CALENDAR_SELECTED_DATE_CLASS); });
        this._$selectedCells = value.map((value) => this._getCellByDate(value));
        this._$selectedCells.forEach(($cell) => { $cell.addClass(CALENDAR_SELECTED_DATE_CLASS); });
    },

    _renderRange: function() {
        const { allowValueSelection, selectionMode, value, range } = this.option();

        if(!allowValueSelection || selectionMode !== 'range') {
            return;
        }

        this._$rangeCells?.forEach(($cell) => { $cell.removeClass(CALENDAR_CELL_IN_RANGE_CLASS); });

        this._$hoveredRangeCells?.forEach(($cell) => { $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS); });
        this._$rangeStartHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
        this._$rangeEndHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);

        this._$rangeStartDateCell?.removeClass(CALENDAR_RANGE_START_DATE_CLASS);
        this._$rangeEndDateCell?.removeClass(CALENDAR_RANGE_END_DATE_CLASS);

        this._$rangeCells = range.map((value) => this._getCellByDate(value));

        this._$rangeStartDateCell = this._getCellByDate(value[0]);
        this._$rangeEndDateCell = this._getCellByDate(value[1]);

        this._$rangeCells.forEach(($cell) => { $cell.addClass(CALENDAR_CELL_IN_RANGE_CLASS); });

        this._$rangeStartDateCell?.addClass(CALENDAR_RANGE_START_DATE_CLASS);
        this._$rangeEndDateCell?.addClass(CALENDAR_RANGE_END_DATE_CLASS);
    },

    _renderHoveredRange() {
        const { allowValueSelection, selectionMode, hoveredRange } = this.option();

        if(!allowValueSelection || selectionMode !== 'range') {
            return;
        }

        this._$hoveredRangeCells?.forEach(($cell) => { $cell.removeClass(CALENDAR_CELL_RANGE_HOVER_CLASS); });

        this._$rangeStartHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
        this._$rangeEndHoverCell?.removeClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);

        this._$hoveredRangeCells = hoveredRange
            .map((value) => this._getCellByDate(value));

        this._$rangeStartHoverCell = this._getCellByDate(hoveredRange[0]);
        this._$rangeEndHoverCell = this._getCellByDate(hoveredRange[hoveredRange.length - 1]);

        this._$hoveredRangeCells.forEach(($cell) => { $cell.addClass(CALENDAR_CELL_RANGE_HOVER_CLASS); });

        this._$rangeStartHoverCell?.addClass(CALENDAR_CELL_RANGE_HOVER_START_CLASS);
        this._$rangeEndHoverCell?.addClass(CALENDAR_CELL_RANGE_HOVER_END_CLASS);
    },

    getCellAriaLabel: function(date) {
        return this._getCellText(date);
    },

    _getFirstAvailableDate: function() {
        let date = this.option('date');
        const min = this.option('min');

        date = coreDateUtils.getFirstDateView(this._getViewName(), date);
        return new Date(min && date < min ? min : date);
    },

    _getCellByDate: abstract,

    isBoundary: abstract,

    _optionChanged: function(args) {
        const { name, value } = args;
        switch(name) {
            case 'value':
                this._renderValue();
                break;
            case 'range':
                this._renderRange();
                break;
            case 'hoveredRange':
                this._renderHoveredRange();
                break;
            case 'contouredDate':
                this._renderContouredDate(value);
                break;
            case 'onCellClick':
                this._createCellClickAction();
                break;
            case 'onCellHover':
                this._createCellHoverAction();
                break;
            case 'min':
            case 'max':
            case 'disabledDates':
            case 'cellTemplate':
            case 'selectionMode':
                this._invalidate();
                break;
            case '_todayDate':
                this._renderBody();
                break;
            default:
                this.callBase(args);
        }
    }
});

export default BaseView;
