const $ = require('../../core/renderer');
const noop = require('../../core/utils/common').noop;
const BaseView = require('./ui.calendar.base_view');
const dateUtils = require('../../core/utils/date');
const extend = require('../../core/utils/extend').extend;
const dateLocalization = require('../../localization/date');
const dateSerialization = require('../../core/utils/date_serialization');
const typeUtils = require('../../core/utils/type');

const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';

const Views = {

    'month': BaseView.inherit({

        _getViewName: function() {
            return 'month';
        },

        _getDefaultOptions: function() {
            return extend(this.callBase(), {
                firstDayOfWeek: undefined,
                rowCount: 6,
                colCount: 7
            });
        },

        _renderImpl: function() {
            this.callBase();
            this._renderHeader();
        },

        _renderBody: function() {
            this.callBase();

            this._$table.find('.' + CALENDAR_OTHER_VIEW_CLASS).addClass(CALENDAR_OTHER_MONTH_CLASS);
        },

        _renderFocusTarget: noop,

        getCellAriaLabel: function(date) {
            return dateLocalization.format(date, 'longdate');
        },

        _renderHeader: function() {
            const that = this;

            const $header = $('<thead>');
            this._$table.prepend($header);

            const $headerRow = $('<tr>');
            $header.append($headerRow);

            const appendCell = this.option('rtl')
                ? function(row, cell) {
                    row.prepend(cell);
                }
                : function(row, cell) {
                    row.append(cell);
                };

            this._iterateCells(this.option('colCount'), function(i) {
                const $cell = $('<th>')
                    .text(that._getDayCaption(that._getFirstDayOfWeek() + i));

                appendCell($headerRow, $cell);
            });
        },

        getNavigatorCaption: function() {
            return dateLocalization.format(this.option('date'), 'monthandyear');
        },

        _isTodayCell: function(cellDate) {
            const today = new Date();

            return dateUtils.sameDate(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const minDate = this.option('min');
            const maxDate = this.option('max');

            return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
        },

        _isOtherView: function(cellDate) {
            return cellDate.getMonth() !== this.option('date').getMonth();
        },

        _getCellText: function(cellDate) {
            return dateLocalization.format(cellDate, 'd');
        },

        _getDayCaption: function(day) {
            const daysInWeek = this.option('colCount');

            return dateLocalization.getDayNames('abbreviated')[day % daysInWeek];
        },

        _getFirstCellData: function() {
            const firstDay = dateUtils.getFirstMonthDate(this.option('date'));
            let firstMonthDayOffset = this._getFirstDayOfWeek() - firstDay.getDay();
            const daysInWeek = this.option('colCount');

            if(firstMonthDayOffset >= 0) {
                firstMonthDayOffset -= daysInWeek;
            }

            firstDay.setDate(firstDay.getDate() + firstMonthDayOffset);
            return firstDay;
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setDate(date.getDate() + 1);
            return date;
        },

        _getFirstDayOfWeek: function() {
            return typeUtils.isDefined(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : dateLocalization.firstDayOfWeekIndex();
        },

        _getCellByDate: function(date) {
            return this._$table.find('td[data-value=\'' + dateSerialization.serializeDate(date, dateUtils.getShortDateFormat()) + '\']');
        },

        isBoundary: function(date) {
            return dateUtils.sameMonthAndYear(date, this.option('min')) || dateUtils.sameMonthAndYear(date, this.option('max'));
        },

        _getDefaultDisabledDatesHandler: function(disabledDates) {
            return function(args) {
                const isDisabledDate = disabledDates.some(function(item) {
                    return dateUtils.sameDate(item, args.date);
                });

                if(isDisabledDate) {
                    return true;
                }
            };
        }
    }),

    'year': BaseView.inherit({

        _getViewName: function() {
            return 'year';
        },

        _isTodayCell: function(cellDate) {
            return dateUtils.sameMonthAndYear(cellDate, new Date());
        },

        _isDateOutOfRange: function(cellDate) {
            return !dateUtils.dateInRange(cellDate, dateUtils.getFirstMonthDate(this.option('min')), dateUtils.getLastMonthDate(this.option('max')));
        },

        _isOtherView: function() {
            return false;
        },

        _getCellText: function(cellDate) {
            return dateLocalization.getMonthNames('abbreviated')[cellDate.getMonth()];
        },

        _getFirstCellData: function() {
            const data = new Date(this.option('date'));

            data.setDate(1);
            data.setMonth(0);

            return data;
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setMonth(date.getMonth() + 1);
            return date;
        },

        _getCellByDate: function(date) {
            const foundDate = new Date(date);
            foundDate.setDate(1);

            return this._$table.find('td[data-value=\'' + dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat()) + '\']');
        },

        getCellAriaLabel: function(date) {
            return dateLocalization.format(date, 'monthandyear');
        },

        getNavigatorCaption: function() {
            return dateLocalization.format(this.option('date'), 'yyyy');
        },

        isBoundary: function(date) {
            return dateUtils.sameYear(date, this.option('min')) || dateUtils.sameYear(date, this.option('max'));
        }
    }),

    'decade': BaseView.inherit({

        _getViewName: function() {
            return 'decade';
        },

        _isTodayCell: function(cellDate) {
            return dateUtils.sameYear(cellDate, new Date());
        },

        _isDateOutOfRange: function(cellDate) {
            const min = this.option('min');
            const max = this.option('max');

            return !dateUtils.dateInRange(cellDate.getFullYear(), min && min.getFullYear(), max && max.getFullYear());
        },

        _isOtherView: function(cellDate) {
            const date = new Date(cellDate);
            date.setMonth(1);

            return !dateUtils.sameDecade(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            return dateLocalization.format(cellDate, 'yyyy');
        },

        _getFirstCellData: function() {
            const year = dateUtils.getFirstYearInDecade(this.option('date')) - 1;
            return new Date(year, 0, 1);
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setFullYear(date.getFullYear() + 1);
            return date;
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            const firstYearInDecade = dateUtils.getFirstYearInDecade(currentDate);
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);

            startDate.setFullYear(firstYearInDecade);
            endDate.setFullYear(firstYearInDecade + 9);

            return dateLocalization.format(startDate, 'yyyy') + '-' + dateLocalization.format(endDate, 'yyyy');
        },

        _isValueOnCurrentView: function(currentDate, value) {
            return dateUtils.sameDecade(currentDate, value);
        },

        _getCellByDate: function(date) {
            const foundDate = new Date(date);
            foundDate.setDate(1);
            foundDate.setMonth(0);

            return this._$table.find('td[data-value=\'' + dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat()) + '\']');
        },

        isBoundary: function(date) {
            return dateUtils.sameDecade(date, this.option('min')) || dateUtils.sameDecade(date, this.option('max'));
        }
    }),

    'century': BaseView.inherit({

        _getViewName: function() {
            return 'century';
        },

        _isTodayCell: function(cellDate) {
            return dateUtils.sameDecade(cellDate, new Date());
        },

        _isDateOutOfRange: function(cellDate) {
            const decade = dateUtils.getFirstYearInDecade(cellDate);
            const minDecade = dateUtils.getFirstYearInDecade(this.option('min'));
            const maxDecade = dateUtils.getFirstYearInDecade(this.option('max'));

            return !dateUtils.dateInRange(decade, minDecade, maxDecade);
        },

        _isOtherView: function(cellDate) {
            const date = new Date(cellDate);
            date.setMonth(1);

            return !dateUtils.sameCentury(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            const startDate = dateLocalization.format(cellDate, 'yyyy');
            const endDate = new Date(cellDate);

            endDate.setFullYear(endDate.getFullYear() + 9);

            return startDate + ' - ' + dateLocalization.format(endDate, 'yyyy');
        },

        _getFirstCellData: function() {
            const decade = dateUtils.getFirstDecadeInCentury(this.option('date')) - 10;
            return new Date(decade, 0, 1);
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setFullYear(date.getFullYear() + 10);
            return date;
        },

        _getCellByDate: function(date) {
            const foundDate = new Date(date);
            foundDate.setDate(1);
            foundDate.setMonth(0);
            foundDate.setFullYear(dateUtils.getFirstYearInDecade(foundDate));

            return this._$table.find('td[data-value=\'' + dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat()) + '\']');
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            const firstDecadeInCentury = dateUtils.getFirstDecadeInCentury(currentDate);
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);

            startDate.setFullYear(firstDecadeInCentury);
            endDate.setFullYear(firstDecadeInCentury + 99);

            return dateLocalization.format(startDate, 'yyyy') + '-' + dateLocalization.format(endDate, 'yyyy');
        },

        isBoundary: function(date) {
            return dateUtils.sameCentury(date, this.option('min')) || dateUtils.sameCentury(date, this.option('max'));
        }
    })
};

module.exports = Views;
