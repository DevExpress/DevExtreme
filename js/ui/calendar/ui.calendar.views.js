/* eslint-disable spellcheck/spell-checker */
import persianDate from 'persian-date';
import domAdapter from '../../core/dom_adapter';
import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import dateUtils from '../../core/utils/date';
import dateSerialization from '../../core/utils/date_serialization';
import { extend } from '../../core/utils/extend';
import dateLocalization from '../../localization/date';
import persianUtils from '../../localization/persian';
import BaseView from './ui.calendar.base_view';

const CALENDAR_OTHER_MONTH_CLASS = 'dx-calendar-other-month';
const CALENDAR_OTHER_VIEW_CLASS = 'dx-calendar-other-view';
const CALENDAR_WEEK_NUMBER_CELL_CLASS = 'dx-calendar-week-number-cell';

const Views = {

    'month': BaseView.inherit({

        _getViewName: function() {
            return 'month';
        },

        _getDefaultOptions: function() {
            return extend(this.callBase(), {
                firstDayOfWeek: 0,
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
            return dateLocalization.format(date, 'longdate');
        },

        _renderHeader: function() {
            const $headerRow = $('<tr>');
            const $header = $('<thead>').append($headerRow);

            this._$table.prepend($header);

            for(let colIndex = 0, colCount = this.option('colCount'); colIndex < colCount; colIndex++) {
                this._renderHeaderCell(colIndex, $headerRow);
            }

            if(this.option('showWeekNumbers')) {
                this._renderWeekHeaderCell($headerRow);
            }
        },

        _renderHeaderCell: function(cellIndex, $headerRow) {
            const { firstDayOfWeek } = this.option();

            const {
                full: fullCaption,
                abbreviated: abbrCaption
            } = this._getDayCaption(firstDayOfWeek + cellIndex);
            const $cell = $('<th>')
                .attr({
                    scope: 'col',
                    abbr: fullCaption
                })
                .text(abbrCaption);

            this._appendCell($headerRow, $cell);
        },

        _renderWeekHeaderCell: function($headerRow) {
            const $weekNumberHeaderCell = $('<th>')
                .attr({
                    scope: 'col',
                    abbr: 'WeekNumber',
                    class: 'dx-week-number-header'
                })
                .text('#');

            const rtlEnabled = this.option('rtlEnabled');

            if(rtlEnabled) {
                $headerRow.append($weekNumberHeaderCell);
            } else {
                $headerRow.prepend($weekNumberHeaderCell);
            }
        },

        _renderWeekNumberCell: function(rowData) {
            const { showWeekNumbers, rtlEnabled, cellTemplate } = this.option();

            if(!showWeekNumbers) {
                return;
            }

            const weekNumber = this._getWeekNumber(rowData.prevCellDate);

            const cell = domAdapter.createElement('td');
            const $cell = $(cell);

            cell.className = CALENDAR_WEEK_NUMBER_CELL_CLASS;

            if(cellTemplate) {
                cellTemplate.render(this._prepareCellTemplateData(weekNumber, -1, $cell));
            } else {
                cell.innerHTML = weekNumber;
            }

            if(rtlEnabled) {
                rowData.row.append(cell);
            } else {
                rowData.row.prepend(cell);
            }
            this.setAria({
                'role': 'gridcell',
                'label': `Week ${weekNumber}`,
            }, $cell);
        },

        _getWeekNumber: function(date) {
            const { weekNumberRule, firstDayOfWeek } = this.option();

            if(weekNumberRule === 'auto') {
                return dateUtils.getWeekNumber(date, firstDayOfWeek, firstDayOfWeek === 1 ? 'firstFourDays' : 'firstDay');
            }

            return dateUtils.getWeekNumber(date, firstDayOfWeek, weekNumberRule);
        },

        getNavigatorCaption: function() {
            return dateLocalization.format(this.option('date'), 'monthandyear');
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();

            return dateUtils.sameDate(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const minDate = this.option('min');
            const maxDate = this.option('max');

            return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
        },

        _isOtherView: function(cellDate) {
            if(persianUtils.isPersianLocale()) {
                const cellPDate = new persianDate(cellDate);
                const currentPDate = new persianDate(this.option('date'));
                return !cellPDate.isSameMonth(currentPDate);
            }

            return cellDate.getMonth() !== this.option('date').getMonth();
        },

        _getCellText: function(cellDate) {
            if(persianUtils.isPersianLocale()) {
                return new persianDate(cellDate).date();
            }

            return dateLocalization.format(cellDate, 'd');
        },

        _getDayCaption: function(day) {
            const daysInWeek = this.option('colCount');
            const dayIndex = day % daysInWeek;

            return {
                full: dateLocalization.getDayNames()[dayIndex],
                abbreviated: dateLocalization.getDayNames('abbreviated')[dayIndex]
            };
        },

        _getFirstCellData: function() {
            const date = this.option('date');
            let firstDay = dateUtils.getFirstMonthDate(date);
            if(persianUtils.isPersianLocale()) {
                firstDay = new persianDate(date).startOf('month').toDate();
            }
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

        _getCellByDate: function(date) {
            return this._$table.find(`td[data-value='${dateSerialization.serializeDate(date, dateUtils.getShortDateFormat())}']`);
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
            const today = this.option('_todayDate')();

            return dateUtils.sameMonthAndYear(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            return !dateUtils.dateInRange(cellDate, dateUtils.getFirstMonthDate(this.option('min')), dateUtils.getLastMonthDate(this.option('max')));
        },

        _isOtherView: function() {
            return false;
        },

        _getCellText: function(cellDate) {
            const month = cellDate.getMonth();
            if(persianUtils.isPersianLocale()) {
                const monthNames = ['بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی'];
                return monthNames[month];
            }

            return dateLocalization.getMonthNames('abbreviated')[month];
        },

        _getFirstCellData: function() {
            const currentDate = this.option('date');
            const data = new Date(currentDate);
            if(persianUtils.isPersianLocale()) {
                const d = new persianDate(data).startOf('year').toDate();
                return d;
            }
            data.setDate(1);
            data.setMonth(0);

            return data;
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            if(persianUtils.isPersianLocale()) {
                return new persianDate(date).add('M', 1).toDate();
            }
            date.setMonth(date.getMonth() + 1);
            return date;
        },

        _getCellByDate: function(date) {
            const foundDate = new Date(date);
            foundDate.setDate(1);

            return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
        },

        getCellAriaLabel: function(date) {
            return dateLocalization.format(date, 'monthandyear');
        },

        getNavigatorCaption: function() {
            if(persianUtils.isPersianLocale()) {
                return new persianDate(this.option('date')).year();
            }

            return dateLocalization.format(this.option('date'), 'yyyy');
        },

        isBoundary: function(date) {
            return dateUtils.sameYear(date, this.option('min')) || dateUtils.sameYear(date, this.option('max'));
        },

        _renderWeekNumberCell: noop,
    }),

    'decade': BaseView.inherit({

        _getViewName: function() {
            return 'decade';
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();
            if(persianUtils.isPersianLocale()) {
                const cellPDate = new persianDate(cellDate);
                const todayPDate = new persianDate(today);
                return cellPDate.isSameMonth(todayPDate) && cellPDate.year() === todayPDate.year();
            }
            return dateUtils.sameYear(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const min = this.option('min');
            const max = this.option('max');

            return !dateUtils.dateInRange(cellDate.getFullYear(), min && min.getFullYear(), max && max.getFullYear());
        },

        _isOtherView: function(cellDate) {
            const date = new Date(cellDate);
            if(persianUtils.isPersianLocale()) {
                return !persianUtils.sameDecade(date, this.option('date'));
            }
            date.setMonth(1);

            return !dateUtils.sameDecade(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            if(persianUtils.isPersianLocale()) {
                return new persianDate(cellDate).year();
            }
            return dateLocalization.format(cellDate, 'yyyy');
        },

        _getFirstCellData: function() {
            if(persianUtils.isPersianLocale()) {
                const pYear = persianUtils.firstYearInDecade(this.option('date'));
                const d = new persianDate([pYear, 1, 1]).toDate();
                return d;
            }
            const year = dateUtils.getFirstYearInDecade(this.option('date')) - 1;
            return dateUtils.createDateWithFullYear(year, 0, 1);
        },

        _getNextCellData: function(date) {
            date = new Date(date);
            if(persianUtils.isPersianLocale()) {
                return new persianDate(date).add('y', 1).toDate();
            }
            date.setFullYear(date.getFullYear() + 1);
            return date;
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            if(persianUtils.isPersianLocale()) {
                const pYear = persianUtils.firstYearInDecade(currentDate);
                const startPDate = new persianDate(currentDate);
                const endPDate = new persianDate(currentDate);
                startPDate.year(pYear);
                endPDate.year(pYear + 9);
                return startPDate.year() + '-' + endPDate.year();
            }
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

            return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
        },

        isBoundary: function(date) {
            return dateUtils.sameDecade(date, this.option('min')) || dateUtils.sameDecade(date, this.option('max'));
        },

        _renderWeekNumberCell: noop,
    }),

    'century': BaseView.inherit({

        _getViewName: function() {
            return 'century';
        },

        _isTodayCell: function(cellDate) {
            const today = this.option('_todayDate')();

            return dateUtils.sameDecade(cellDate, today);
        },

        _isDateOutOfRange: function(cellDate) {
            const decade = dateUtils.getFirstYearInDecade(cellDate);
            const minDecade = dateUtils.getFirstYearInDecade(this.option('min'));
            const maxDecade = dateUtils.getFirstYearInDecade(this.option('max'));

            return !dateUtils.dateInRange(decade, minDecade, maxDecade);
        },

        _isOtherView: function(cellDate) {
            const date = new Date(cellDate);
            if(persianUtils.isPersianLocale()) {
                return !persianUtils.sameCentury(date, this.option('date'));
            }
            date.setMonth(1);

            return !dateUtils.sameCentury(date, this.option('date'));
        },

        _getCellText: function(cellDate) {
            if(persianUtils.isPersianLocale()) {
                const startPDate = new persianDate(cellDate);
                const endPDate = new persianDate(cellDate);
                endPDate.year(startPDate.year() + 9);
                return startPDate.year() + '-' + endPDate.year();
            }
            const startDate = dateLocalization.format(cellDate, 'yyyy');
            const endDate = new Date(cellDate);

            endDate.setFullYear(endDate.getFullYear() + 9);

            return startDate + ' - ' + dateLocalization.format(endDate, 'yyyy');
        },

        _getFirstCellData: function() {
            if(persianUtils.isPersianLocale()) {
                const pYear = persianUtils.firstDecadeInCentury(this.option('date'));
                const d = new persianDate([pYear, 1, 1]).toDate();
                return d;
            }
            const decade = dateUtils.getFirstDecadeInCentury(this.option('date')) - 10;
            return dateUtils.createDateWithFullYear(decade, 0, 1);
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

            return this._$table.find(`td[data-value='${dateSerialization.serializeDate(foundDate, dateUtils.getShortDateFormat())}']`);
        },

        getNavigatorCaption: function() {
            const currentDate = this.option('date');
            if(persianUtils.isPersianLocale()) {
                const pYear = persianUtils.firstDecadeInCentury(currentDate);
                const startPDate = new persianDate(currentDate);
                const endPDate = new persianDate(currentDate);
                startPDate.year(pYear);
                endPDate.year(pYear + 99);
                return startPDate.year() + '-' + endPDate.year();
            }
            const firstDecadeInCentury = dateUtils.getFirstDecadeInCentury(currentDate);
            const startDate = new Date(currentDate);
            const endDate = new Date(currentDate);

            startDate.setFullYear(firstDecadeInCentury);
            endDate.setFullYear(firstDecadeInCentury + 99);

            return dateLocalization.format(startDate, 'yyyy') + '-' + dateLocalization.format(endDate, 'yyyy');
        },

        isBoundary: function(date) {
            return dateUtils.sameCentury(date, this.option('min')) || dateUtils.sameCentury(date, this.option('max'));
        },

        _renderWeekNumberCell: noop,
    })
};

export default Views;
