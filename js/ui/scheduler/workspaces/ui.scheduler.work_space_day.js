const registerComponent = require('../../../core/component_registrator');
const SchedulerWorkSpace = require('./ui.scheduler.work_space.indicator');

const DAY_CLASS = 'dx-scheduler-work-space-day';

const SchedulerWorkSpaceDay = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return DAY_CLASS;
    },

    _getRowCount: function() {
        return this._getCellCountInDay();
    },

    _getCellCount: function() {
        return this.option('intervalCount');
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate);
    },

    _getDateByIndex: function(headerIndex) {
        if(this.option('intervalCount') === 1) {
            return this._firstViewDate;
        }

        const resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _renderDateHeader: function() {
        if(this.option('intervalCount') === 1) {
            return;
        }

        return this.callBase();
    },

    _getRightCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }

        return this._$focusedCell;
    },

    _getLeftCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }

        return this._$focusedCell;
    }
});

registerComponent('dxSchedulerWorkSpaceDay', SchedulerWorkSpaceDay);

module.exports = SchedulerWorkSpaceDay;
