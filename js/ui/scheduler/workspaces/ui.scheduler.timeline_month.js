const registerComponent = require('../../../core/component_registrator');
const SchedulerTimeline = require('./ui.scheduler.timeline');
const dateUtils = require('../../../core/utils/date');

const TIMELINE_CLASS = 'dx-scheduler-timeline-month';
const DAY_IN_MILLISECONDS = 86400000;

const toMs = dateUtils.dateToMilliseconds;

const SchedulerTimelineMonth = SchedulerTimeline.inherit({

    _renderView: function() {
        this.callBase();

        this._updateScrollable();
    },

    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getDateHeaderTemplate: function() {
        return this.option('dateCellTemplate');
    },

    _getHiddenInterval: function() {
        return 0;
    },

    _getIndicationFirstViewDate: function() {
        return dateUtils.trimTime(new Date(this._firstViewDate));
    },

    getCellDuration: function() {
        return toMs('day');
    },

    calculateEndViewDate: function(dateOfLastViewCell) {
        return new Date(dateOfLastViewCell.getTime() + this._calculateDayDuration() * toMs('hour'));
    },

    _getCellCount: function() {
        const currentDate = this.option('currentDate');
        let cellCount = 0;
        if(this._isWorkSpaceWithCount()) {
            const intervalCount = this.option('intervalCount');

            for(let i = 1; i <= intervalCount; i++) {
                cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
            }
        } else {
            cellCount = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        }

        return cellCount;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstMonthDate(this.option('currentDate'));
        this._setStartDayHour(this._firstViewDate);
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _getDateByIndex: function(headerIndex) {
        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);

        return resultDate;
    },

    _getInterval: function() {
        return DAY_IN_MILLISECONDS;
    },

    _getIntervalBetween: function(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);

        return currentDate.getTime() - (firstViewDate.getTime() - this.option('startDayHour') * 3600000) - timeZoneOffset;
    },

    calculateEndDate: function(startDate) {
        const startDateCopy = new Date(startDate);
        return new Date(startDateCopy.setHours(this.option('endDayHour')));
    },

    _calculateHiddenInterval: function() {
        return 0;
    },

    _getDateByCellIndexes: function(rowIndex, cellIndex) {
        const date = this.callBase(rowIndex, cellIndex);

        this._setStartDayHour(date);

        return date;
    },

    needUpdateScrollPosition: function(hours, minutes, bounds, date) {
        return this._dateWithinBounds(bounds, date);
    },

    getPositionShift: function() {
        return {
            top: 0,
            left: 0,
            cellPosition: 0
        };
    }

});

registerComponent('dxSchedulerTimelineMonth', SchedulerTimelineMonth);

module.exports = SchedulerTimelineMonth;
