import $ from '../../core/renderer';
import BaseView from './ui.calendar.base_view';
import { noop } from '../../core/utils/common';
import {
    sameDate,
    dateInRange,
    getFirstMonthDate,
    getShortDateFormat,
    sameMonthAndYear,
    getLastMonthDate,
    getFirstYearInDecade,
    getFirstDecadeInCentury,
    sameYear,
    sameDecade,
    sameCentury,
    createDate,
    createDateWithFullYear
} from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import {
    format as formatMessage,
    getDayNames,
    firstDayOfWeekIndex,
    getMonthNames
} from '../../localization/date';
import { serializeDate } from '../../core/utils/date_serialization';
import { isDefined } from '../../core/utils/type';

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

            this._$table.find(`.${CALENDAR_OTHER_VIEW_CLASS}`).addClass(CALENDAR_OTHER_MONTH_CLASS);
        },

        _renderFocusTarget: noop,

        getCellAriaLabel: function(date) {
            return formatMessage(date, 'longdate');
        },

        _renderHeader: function() {
            const $headerRow = $('<tr>');
            const $header = $('<thead>').append($headerRow);

            this._$table.prepend($header);

            for(let colIndex = 0, colCount = this.option('colCount'); colIndex < colCount; colIndex++) {
                this._renderHeaderCell(colIndex, $headerRow);
            }
        },

        _renderHeaderCell: function(cellIndex, $headerRow) {
            const {
                full: fullCaption,
                abbreviated: abbrCaption
            } = this._getDayCaption(this._getFirstDayOfWeek() + cellIndex);
            const $cell = $('<th>')
                .attr({
                    scope: 'col',
                    abbr: fullCaption
                })
                .text(abbrCaption);

            this._appendCell($headerRow, $cell);
        },

        getNavigatorCaption: function() {
            return formatMessage(this.option('date'), 'monthandyear');
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();

            return sameDate(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const minDate = this.option('min');
            const maxDate = this.option('max');

            return !dateInRange(cellDate, minDate, maxDate, 'date');
        },

        _isOtherView: function(cellDate) {
            return cellDate.getMonth() !== this.option('date').getMonth();
        },

        _getCellText: function(cellDate) {
            return formatMessage(cellDate, 'd');
        },

        _getDayCaption: function(day) {
            const daysInWeek = this.option('colCount');
            const dayIndex = day % daysInWeek;

            return {
                full: getDayNames()[dayIndex],
                abbreviated: getDayNames('abbreviated')[dayIndex]
            };
        },

        _getFirstCellData: function() {
            const firstDay = getFirstMonthDate(this.option('date'));
            let firstMonthDayOffset = this._getFirstDayOfWeek() - firstDay.getDay();
            const daysInWeek = this.option('colCount');

            if(firstMonthDayOffset >= 0) {
                firstMonthDayOffset -= daysInWeek;
            }

            firstDay.setDate(firstDay.getDate() + firstMonthDayOffset);
            return firstDay;
        },

        _getNextCellData: function(date) {
            date = createDate(date);
            date.setDate(date.getDate() + 1);
            return date;
        },

        _getFirstDayOfWeek: function() {
            return isDefined(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : firstDayOfWeekIndex();
        },

        _getCellByDate: function(date) {
            return this._$table.find(`td[data-value='${serializeDate(date, getShortDateFormat())}']`);
        },

        isBoundary: function(date) {
            return sameMonthAndYear(date, this.option('min')) || sameMonthAndYear(date, this.option('max'));
        },

        _getDefaultDisabledDatesHandler: function(disabledDates) {
            return function(args) {
                const isDisabledDate = disabledDates.some(function(item) {
                    return sameDate(item, args.date);
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
            const today = this.option('_todayDate')();

            return sameMonthAndYear(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            return !dateInRange(cellDate, getFirstMonthDate(this.option('min')), getLastMonthDate(this.option('max')));
        },

        _isOtherView: function() {
            return false;
        },

        _getCellText: function(cellDate) {
            return getMonthNames('abbreviated')[cellDate.getMonth()];
        },

        _getFirstCellData: function() {
            const currentDate = this.option('date');
            const data = createDate(currentDate);

            data.setDate(1);
            data.setMonth(0);

            return data;
        },

        _getNextCellData: function(date) {
            date = createDate(date);
            date.setMonth(date.getMonth() + 1);
            return date;
        },

        _getCellByDate: function(date) {
            const foundDate = createDate(date);
            foundDate.setDate(1);

            return this._$table.find(`td[data-value='${serializeDate(foundDate, getShortDateFormat())}']`);
        },

        getCellAriaLabel: function(date) {
            return formatMessage(date, 'monthandyear');
        },

        getNavigatorCaption: function() {
            return formatMessage(this.option('date'), 'yyyy');
        },

        isBoundary: function(date) {
            return sameYear(date, this.option('min')) || sameYear(date, this.option('max'));
        }
    }),

    'decade': BaseView.inherit({

        _getViewName: function() {
            return 'decade';
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();

            return sameYear(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const min = this.option('min');
            const max = this.option('max');

            return !dateInRange(cellDate.getFullYear(), min && min.getFullYear(), max && max.getFullYear());
        },

        _isOtherView: function(cellDate) {
            const date = createDate(cellDate);
            date.setMonth(1);

            return !sameDecade(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            return formatMessage(cellDate, 'yyyy');
        },

        _getFirstCellData: function() {
            const year = getFirstYearInDecade(this.option('date')) - 1;
            return createDateWithFullYear(year, 0, 1);
        },

        _getNextCellData: function(date) {
            date = createDate(date);
            date.setFullYear(date.getFullYear() + 1);
            return date;
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            const firstYearInDecade = getFirstYearInDecade(currentDate);
            const startDate = createDate(currentDate);
            const endDate = createDate(currentDate);

            startDate.setFullYear(firstYearInDecade);
            endDate.setFullYear(firstYearInDecade + 9);

            return formatMessage(startDate, 'yyyy') + '-' + formatMessage(endDate, 'yyyy');
        },

        _isValueOnCurrentView: function(currentDate, value) {
            return sameDecade(currentDate, value);
        },

        _getCellByDate: function(date) {
            const foundDate = createDate(date);
            foundDate.setDate(1);
            foundDate.setMonth(0);

            return this._$table.find(`td[data-value='${serializeDate(foundDate, getShortDateFormat())}']`);
        },

        isBoundary: function(date) {
            return sameDecade(date, this.option('min')) || sameDecade(date, this.option('max'));
        }
    }),

    'century': BaseView.inherit({

        _getViewName: function() {
            return 'century';
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();

            return sameDecade(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const decade = getFirstYearInDecade(cellDate);
            const minDecade = getFirstYearInDecade(this.option('min'));
            const maxDecade = getFirstYearInDecade(this.option('max'));

            return !dateInRange(decade, minDecade, maxDecade);
        },

        _isOtherView: function(cellDate) {
            const date = createDate(cellDate);
            date.setMonth(1);

            return !sameCentury(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            const startDate = formatMessage(cellDate, 'yyyy');
            const endDate = createDate(cellDate);

            endDate.setFullYear(endDate.getFullYear() + 9);

            return startDate + ' - ' + formatMessage(endDate, 'yyyy');
        },

        _getFirstCellData: function() {
            const decade = getFirstDecadeInCentury(this.option('date')) - 10;
            return createDateWithFullYear(decade, 0, 1);
        },

        _getNextCellData: function(date) {
            date = createDate(date);
            date.setFullYear(date.getFullYear() + 10);
            return date;
        },

        _getCellByDate: function(date) {
            const foundDate = createDate(date);
            foundDate.setDate(1);
            foundDate.setMonth(0);
            foundDate.setFullYear(getFirstYearInDecade(foundDate));

            return this._$table.find(`td[data-value='${serializeDate(foundDate, getShortDateFormat())}']`);
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            const firstDecadeInCentury = getFirstDecadeInCentury(currentDate);
            const startDate = createDate(currentDate);
            const endDate = createDate(currentDate);

            startDate.setFullYear(firstDecadeInCentury);
            endDate.setFullYear(firstDecadeInCentury + 99);

            return formatMessage(startDate, 'yyyy') + '-' + formatMessage(endDate, 'yyyy');
        },

        isBoundary: function(date) {
            return sameCentury(date, this.option('min')) || sameCentury(date, this.option('max'));
        }
    })
};

module.exports = Views;
