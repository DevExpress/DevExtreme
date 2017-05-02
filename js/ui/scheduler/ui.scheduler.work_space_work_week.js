"use strict";

var registerComponent = require("../../core/component_registrator"),
    SchedulerWorkSpaceWeek = require("./ui.scheduler.work_space_week"),
    dateUtils = require("../../core/utils/date"),
    dateLocalization = require("../../localization/date");

var WORK_WEEK_CLASS = "dx-scheduler-work-space-work-week";

var weekendCounter = 0;

var SchedulerWorkSpaceWorkWeek = SchedulerWorkSpaceWeek.inherit({

    _getElementClass: function() {
        return WORK_WEEK_CLASS;
    },

    _getCellCount: function() {
        return 5;
    },

    _firstDayOfWeek: function() {
        return this.option("firstDayOfWeek") || 1;
    },

    _getDateByIndex: function(headerIndex) {
        var resultDate = new Date(this._firstViewDate);

        resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekendCounter);

        var day = resultDate.getDay();
        if(day % 6 === 0) {
            weekendCounter = Math.floor(day / 6 + 1);
            resultDate.setDate(resultDate.getDate() + weekendCounter);
        }

        return resultDate;
    },

    _renderView: function() {
        weekendCounter = 0;
        this.callBase();
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this.option("currentDate"), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());

        this._firstViewDate = dateUtils.normalizeDateByWeek(this._firstViewDate, this.option("currentDate"));

        this._setStartDayHour(this._firstViewDate);
    }
});

registerComponent("dxSchedulerWorkSpaceWorkWeek", SchedulerWorkSpaceWorkWeek);

module.exports = SchedulerWorkSpaceWorkWeek;
