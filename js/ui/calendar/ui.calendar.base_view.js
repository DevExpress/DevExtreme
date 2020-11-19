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

const { abstract } = Widget;

const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const CALENDAR_DXCLICK_EVENT_NAME = addNamespace(clickEventName, 'dxCalendar');

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
            rowCount: 3,
            colCount: 4,
            allowValueSelection: true,
            _todayDate: () => new Date()
        });
    },

    _init: function() {
        this.callBase();

        const value = this.option('value');

        // TODO: what is this for?
        this.option('value', new Date(value));

        if(!this.option('value').valueOf()) {
            this.option('value', new Date(0, 0, 0, 0, 0, 0));
        }
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
        this._renderEvents();
    },

    _createTable: function() {
        this._$table = $('<table>');

        this.setAria({
            label: messageLocalization.format('dxCalendar-ariaWidgetName'),
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
        }
    },

    _createRow: function() {
        const row = domAdapter.createElement('tr');

        this.setAria('role', 'row', $(row));
        this.$body.get(0).appendChild(row);

        return row;
    },

    _appendCell: function(row, cell) {
        if(!this._appendMethodName) {
            this._cacheAppendMethodName();
        }

        $(row)[this._appendMethodName](cell);
    },

    _cacheAppendMethodName: function(rtlEnabled) {
        this._appendMethodName = rtlEnabled ?? this.option('rtlEnabled') ?
            'prepend' :
            'append';
    },

    _createCell: function(cellDate) {
        const cell = domAdapter.createElement('td');
        const $cell = $(cell);

        cell.className = this._getClassNameByDate(cellDate);

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

        const { cell, $cell } = this._createCell(cellDate);
        const cellTemplate = this.option('cellTemplate');

        this._appendCell(row, cell);

        if(cellTemplate) {
            cellTemplate.render(this._prepareCellTemplateData(cellDate, cellIndex, $cell));
        } else {
            cell.innerHTML = this._getCellText(cellDate);
        }

        params.cellDate = this._getNextCellData(cellDate);
    },

    _getClassNameByDate: function(cellDate) {
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

        return className;
    },

    _prepareCellTemplateData: function(cellDate, cellIndex, $cell) {
        return {
            model: {
                text: this._getCellText(cellDate),
                date: cellDate,
                view: this._getViewName()
            },
            container: getPublicElement($cell),
            index: cellIndex
        };
    },

    _renderEvents: function() {
        this._createCellClickAction();

        eventsEngine.off(this._$table, CALENDAR_DXCLICK_EVENT_NAME);
        eventsEngine.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, 'td', ((e) => {
            if(!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
                this._cellClickAction({
                    event: e,
                    value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
                });
            }
        }));
    },

    _createCellClickAction: function() {
        this._cellClickAction = this._createActionByOption('onCellClick');
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

    _getCellText: abstract,

    _getFirstCellData: abstract,

    _getNextCellData: abstract,

    _renderContouredDate: function(contouredDate) {
        if(!this.option('focusStateEnabled')) {
            return;
        }

        contouredDate = contouredDate || this.option('contouredDate');

        const $oldContouredCell = this._$table.find(`.${CALENDAR_CONTOURED_DATE_CLASS}`);
        const $newContouredCell = this._getCellByDate(contouredDate);

        $oldContouredCell.removeClass(CALENDAR_CONTOURED_DATE_CLASS);
        $newContouredCell.addClass(CALENDAR_CONTOURED_DATE_CLASS);
    },

    _changeValue: function(cellDate) {
        if(cellDate) {
            const value = this.option('value');
            const newValue = value ? new Date(value) : new Date();

            newValue.setDate(cellDate.getDate());
            newValue.setMonth(cellDate.getMonth());
            newValue.setFullYear(cellDate.getFullYear());
            newValue.setDate(cellDate.getDate());

            this.option('value', newValue);
        } else {
            this.option('value', null);
        }
    },

    _renderValue: function() {
        if(!this.option('allowValueSelection')) {
            return;
        }

        const value = this.option('value');
        const selectedCell = this._getCellByDate(value);

        if(this._selectedCell) {
            this._selectedCell.removeClass(CALENDAR_SELECTED_DATE_CLASS);
        }

        selectedCell.addClass(CALENDAR_SELECTED_DATE_CLASS);
        this._selectedCell = selectedCell;
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
            case 'contouredDate':
                this._renderContouredDate(value);
                break;
            case 'onCellClick':
                this._createCellClickAction();
                break;
            case 'disabledDates':
            case 'cellTemplate':
                this._invalidate();
                break;
            case 'rtlEnabled':
                this._cacheAppendMethodName(value);
                this.callBase(args);
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
