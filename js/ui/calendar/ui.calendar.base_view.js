const $ = require('../../core/renderer');
const domAdapter = require('../../core/dom_adapter');
const eventsEngine = require('../../events/core/events_engine');
const dataUtils = require('../../core/element_data');
const domUtils = require('../../core/utils/dom');
const Widget = require('../widget/ui.widget');
const dateUtils = require('../../core/utils/date');
const extend = require('../../core/utils/extend').extend;
const noop = require('../../core/utils/common').noop;
const dateSerialization = require('../../core/utils/date_serialization');
const eventUtils = require('../../events/utils');
const clickEvent = require('../../events/click');

const abstract = Widget.abstract;

const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_CELL_CLASS = 'dx-calendar-cell';
const CALENDAR_EMPTY_CELL_CLASS = 'dx-calendar-empty-cell';
const CALENDAR_TODAY_CLASS = 'dx-calendar-today';
const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const CALENDAR_DXCLICK_EVENT_NAME = eventUtils.addNamespace(clickEvent.name, 'dxCalendar');

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
            allowValueSelection: true
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
        this._$table = $('<table>');
        this.$element().append(this._$table);

        this._createDisabledDatesHandler();
        this._renderBody();
        this._renderContouredDate();
        this._renderValue();
        this._renderEvents();
    },

    _renderBody: function() {
        this.$body = $('<tbody>').appendTo(this._$table);

        const that = this;
        const cellTemplate = this.option('cellTemplate');

        const appendChild = this.option('rtl')
            ? function(row, cell) {
                row.insertBefore(cell, row.firstChild);
            } : function(row, cell) {
                row.appendChild(cell);
            };

        function renderCell(cellIndex) {
            // T425127
            if(prevCellDate) {
                dateUtils.fixTimezoneGap(prevCellDate, cellDate);
            }

            prevCellDate = cellDate;

            const cell = domAdapter.createElement('td');
            const $cell = $(cell);
            let className = CALENDAR_CELL_CLASS;

            if(that._isTodayCell(cellDate)) {
                className = className + ' ' + CALENDAR_TODAY_CLASS;
            }

            if(that._isDateOutOfRange(cellDate) || that.isDateDisabled(cellDate)) {
                className = className + ' ' + CALENDAR_EMPTY_CELL_CLASS;
            }

            if(that._isOtherView(cellDate)) {
                className = className + ' ' + CALENDAR_OTHER_VIEW_CLASS;
            }

            cell.className = className;

            cell.setAttribute('data-value', dateSerialization.serializeDate(cellDate, dateUtils.getShortDateFormat()));
            dataUtils.data(cell, CALENDAR_DATE_VALUE_KEY, cellDate);

            that.setAria({
                'role': 'option',
                'label': that.getCellAriaLabel(cellDate)
            }, $cell);

            appendChild(row, cell);

            if(cellTemplate) {
                cellTemplate.render({
                    model: {
                        text: that._getCellText(cellDate),
                        date: cellDate,
                        view: that._getViewName()
                    },
                    container: domUtils.getPublicElement($cell),
                    index: cellIndex
                });
            } else {
                cell.innerHTML = that._getCellText(cellDate);
            }

            cellDate = that._getNextCellData(cellDate);
        }

        var cellDate = this._getFirstCellData();
        const colCount = this.option('colCount');
        let prevCellDate;

        for(let indexRow = 0, len = this.option('rowCount'); indexRow < len; indexRow++) {
            var row = domAdapter.createElement('tr');
            this.$body.get(0).appendChild(row);
            this._iterateCells(colCount, renderCell);
        }
    },

    _iterateCells: function(colCount, delegate) {
        let i = 0;

        while(i < colCount) {
            delegate(i);
            ++i;
        }
    },

    _renderEvents: function() {
        this._createCellClickAction();

        eventsEngine.off(this._$table, CALENDAR_DXCLICK_EVENT_NAME);
        eventsEngine.on(this._$table, CALENDAR_DXCLICK_EVENT_NAME, 'td', (function(e) {
            if(!$(e.currentTarget).hasClass(CALENDAR_EMPTY_CELL_CLASS)) {
                this._cellClickAction({
                    event: e,
                    value: $(e.currentTarget).data(CALENDAR_DATE_VALUE_KEY)
                });
            }
        }).bind(this));
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

        const $oldContouredCell = this._$table.find('.' + CALENDAR_CONTOURED_DATE_CLASS);
        const $newContouredCell = this._getCellByDate(contouredDate);

        $oldContouredCell.removeClass(CALENDAR_CONTOURED_DATE_CLASS);
        $newContouredCell.addClass(CALENDAR_CONTOURED_DATE_CLASS);
    },

    _dispose: function() {
        this._keyboardProcessor = undefined;
        this.callBase();
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

        date = dateUtils.getFirstDateView(this._getViewName(), date);
        return new Date(min && date < min ? min : date);
    },

    _getCellByDate: abstract,

    isBoundary: abstract,

    _optionChanged: function(args) {
        const name = args.name;
        switch(name) {
            case 'value':
                this._renderValue();
                break;
            case 'contouredDate':
                this._renderContouredDate(args.value);
                break;
            case 'onCellClick':
                this._createCellClickAction();
                break;
            case 'disabledDates':
            case 'cellTemplate':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = BaseView;
