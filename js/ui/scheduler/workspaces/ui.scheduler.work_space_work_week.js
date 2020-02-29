const registerComponent = require('../../../core/component_registrator');
const dateUtils = require('../../../core/utils/date');
const workWeekUtils = require('./utils.work_week');
const toMs = dateUtils.dateToMilliseconds;
const SchedulerWorkSpaceWeek = require('./ui.scheduler.work_space_week');

const WORK_WEEK_CLASS = 'dx-scheduler-work-space-work-week';

const dayIndexes = [1, 2, 3, 4, 5];

let weekCounter = 0;

const SchedulerWorkSpaceWorkWeek = SchedulerWorkSpaceWeek.inherit({

    _getElementClass: function() {
        return WORK_WEEK_CLASS;
    },

    _getCellCount: function() {
        return 5 * this.option('intervalCount');
    },

    _firstDayOfWeek: function() {
        return workWeekUtils.getFirstDayOfWeek(this.option('firstDayOfWeek'));
    },

    _isSkippedData: workWeekUtils.isDataOnWeekend,

    _getDateByIndex: function(headerIndex) {
        const resultDate = new Date(this._firstViewDate);

        if(headerIndex % this._getCellCount() === 0) {
            weekCounter = 0;
        }

        resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekCounter);
        let index = resultDate.getDay();

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

    _getWeekendsCount: workWeekUtils.getWeekendsCount,

    _setFirstViewDate: function() {
        this._firstViewDate = workWeekUtils.getFirstViewDate(this._getViewStartByOptions(), this._firstDayOfWeek());
        this._setStartDayHour(this._firstViewDate);
    },

    _getOffsetByCount: function(cellIndex) {
        const cellsInGroup = this._getCellCount();
        const inGroup = Math.floor(cellIndex / cellsInGroup);

        cellIndex = cellIndex - cellsInGroup * inGroup;

        const weekendCount = Math.floor(cellIndex / 5);

        return toMs('day') * weekendCount * 2;
    },
});

registerComponent('dxSchedulerWorkSpaceWorkWeek', SchedulerWorkSpaceWorkWeek);

module.exports = SchedulerWorkSpaceWorkWeek;
