var registerComponent = require('../../../core/component_registrator'),
    dateUtils = require('../../../core/utils/date'),
    toMs = dateUtils.dateToMilliseconds,
    SchedulerWorkSpaceWeek = require('./ui.scheduler.work_space_week'),
    dateLocalization = require('../../../localization/date');

var WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';

var dayIndexes = [1, 2, 3, 4, 5];

var weekCounter = 0;

var SchedulerWorkSpaceWorkWeek = SchedulerWorkSpaceWeek.inherit({

    _getElementClass: function() {
        return WORK_WEEK_CLASS;
    },

    _getCellCount: function() {
        return 5 * this.option('intervalCount');
    },

    _firstDayOfWeek: function() {
        return this.option('firstDayOfWeek') || 1;
    },

    _getDateByIndex: function(headerIndex) {
        var resultDate = new Date(this._firstViewDate);

        if(headerIndex % this._getCellCount() === 0) {
            weekCounter = 0;
        }

        resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekCounter);
        var index = resultDate.getDay();

        while(dayIndexes.indexOf(index) === -1) {
            resultDate.setDate(resultDate.getDate() + 1);
            index = resultDate.getDay();
            weekCounter++;
        }

        return resultDate;
    },

    _renderView: function() {
        weekCounter = 0;
        this.callBase();
    },

    _getWeekendsCount: function(days) {
        return 2 * Math.floor(days / 7);
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this._getViewStartByOptions(), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());

        this._firstViewDate = dateUtils.normalizeDateByWeek(this._firstViewDate, this._getViewStartByOptions());

        this._setStartDayHour(this._firstViewDate);
    },

    _getOffsetByCount: function(cellIndex) {
        var cellsInGroup = this._getCellCount(),
            inGroup = Math.floor(cellIndex / cellsInGroup);

        cellIndex = cellIndex - cellsInGroup * inGroup;

        var weekendCount = Math.floor(cellIndex / 5);

        return toMs('day') * weekendCount * 2;
    },
});

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

module.exports = SchedulerWorkSpaceWorkWeek;
