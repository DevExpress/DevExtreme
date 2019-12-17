var $ = require('../../core/renderer'),
    noop = require('../../core/utils/common').noop,
    BaseView = require('./ui.calendar.base_view'),
    dateUtils = require('../../core/utils/date'),
    extend = require('../../core/utils/extend').extend,
    dateLocalization = require('../../localization/date'),
    dateSerialization = require('../../core/utils/date_serialization'),
    typeUtils = require('../../core/utils/type');

var CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month',
    CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';

var Views = {

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
            var that = this;

            var $header = $('<thead>');
            this._$table.prepend($header);

            var $headerRow = $('<tr>');
            $header.append($headerRow);

            var appendCell = this.option('rtl')
                ? function(row, cell) {
                    row.prepend(cell);
                }
                : function(row, cell) {
                    row.append(cell);
                };

            this._iterateCells(this.option('colCount'), function(i) {
                var $cell = $('<th>')
                    .text(that._getDayCaption(that._getFirstDayOfWeek() + i));

                appendCell($headerRow, $cell);
            });
        },

        getNavigatorCaption: function() {
            return dateLocalization.format(this.option('date'), 'monthandyear');
        },

        _isTodayCell: function(cellDate) {
            var today = new Date();

            return dateUtils.sameDate(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            var minDate = this.option('min'),
                maxDate = this.option('max');

            return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
        },

        _isOtherView: function(cellDate) {
            return cellDate.getMonth() !== this.option('date').getMonth();
        },

        _getCellText: function(cellDate) {
            return dateLocalization.format(cellDate, 'd');
        },

        _getDayCaption: function(day) {
            var daysInWeek = this.option('colCount');

            return dateLocalization.getDayNames('abbreviated')[day % daysInWeek];
        },

        _getFirstCellData: function() {
            var firstDay = dateUtils.getFirstMonthDate(this.option('date')),
                firstMonthDayOffset = this._getFirstDayOfWeek() - firstDay.getDay(),
                daysInWeek = this.option('colCount');

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
                var isDisabledDate = disabledDates.some(function(item) {
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
            var data = new Date(this.option('date'));

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
            var foundDate = new Date(date);
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
            var min = this.option('min'),
                max = this.option('max');

            return !dateUtils.dateInRange(cellDate.getFullYear(), min && min.getFullYear(), max && max.getFullYear());
        },

        _isOtherView: function(cellDate) {
            var date = new Date(cellDate);
            date.setMonth(1);

            return !dateUtils.sameDecade(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            return dateLocalization.format(cellDate, 'yyyy');
        },

        _getFirstCellData: function() {
            var year = dateUtils.getFirstYearInDecade(this.option('date')) - 1;
            return new Date(year, 0, 1);
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setFullYear(date.getFullYear() + 1);
            return date;
        },

        getNavigatorCaption: function() {
            var currentDate = this.option('date'),
                firstYearInDecade = dateUtils.getFirstYearInDecade(currentDate),
                startDate = new Date(currentDate),
                endDate = new Date(currentDate);

            startDate.setFullYear(firstYearInDecade);
            endDate.setFullYear(firstYearInDecade + 9);

            return dateLocalization.format(startDate, 'yyyy') + '-' + dateLocalization.format(endDate, 'yyyy');
        },

        _isValueOnCurrentView: function(currentDate, value) {
            return dateUtils.sameDecade(currentDate, value);
        },

        _getCellByDate: function(date) {
            var foundDate = new Date(date);
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
            var decade = dateUtils.getFirstYearInDecade(cellDate),
                minDecade = dateUtils.getFirstYearInDecade(this.option('min')),
                maxDecade = dateUtils.getFirstYearInDecade(this.option('max'));

            return !dateUtils.dateInRange(decade, minDecade, maxDecade);
        },

        _isOtherView: function(cellDate) {
            var date = new Date(cellDate);
            date.setMonth(1);

            return !dateUtils.sameCentury(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            var startDate = dateLocalization.format(cellDate, 'yyyy'),
                endDate = new Date(cellDate);

            endDate.setFullYear(endDate.getFullYear() + 9);

            return startDate + ' - ' + dateLocalization.format(endDate, 'yyyy');
        },

        _getFirstCellData: function() {
            var decade = dateUtils.getFirstDecadeInCentury(this.option('date')) - 10;
            return new Date(decade, 0, 1);
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            date.setFullYear(date.getFullYear() + 10);
            return date;
        },

        _getCellByDate: function(date) {
            var foundDate = new Date(date);
            foundDate.setDate(1);
            foundDate.setMonth(0);
            foundDate.setFullYear(dateUtils.getFirstYearInDecade(foundDate));

            return this._$table.find('td[data-value=\'' + dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat()) + '\']');
        },

        getNavigatorCaption: function() {
            var currentDate = this.option('date'),
                firstDecadeInCentury = dateUtils.getFirstDecadeInCentury(currentDate),
                startDate = new Date(currentDate),
                endDate = new Date(currentDate);

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
