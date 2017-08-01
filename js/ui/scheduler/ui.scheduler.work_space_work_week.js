"use strict";

var registerComponent = require("../../core/component_registrator"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds,
    SchedulerWorkSpaceWeek = require("./ui.scheduler.work_space_week"),
    dateUtils = require("../../core/utils/date"),
    dateLocalization = require("../../localization/date");

var WORK_WEEK_CLASS = "dx-scheduler-work-space-work-week";

var weekendCounter = 0,
    weekCounter = 0;

var SchedulerWorkSpaceWorkWeek = SchedulerWorkSpaceWeek.inherit({

    _getElementClass: function() {
        return WORK_WEEK_CLASS;
    },

    _getCellCount: function() {
        return 5 * this.option("intervalCount");
    },

    _firstDayOfWeek: function() {
        return this.option("firstDayOfWeek") || 1;
    },

    _getDateByIndex: function(headerIndex) {
        var resultDate = new Date(this._firstViewDate);

        resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekendCounter);
        var nextDay = resultDate.getDay() + 1;

        if(nextDay % 6 === 0) {
            weekendCounter = 2;

            if(nextDay === 6) {
                weekCounter++;
                weekendCounter *= weekCounter;
            }
        }
        return resultDate;
    },

    _renderView: function() {
        weekendCounter = 0;
        weekCounter = 0;
        this.callBase();
    },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this._getViewStartByOptions(), this._firstDayOfWeek() || dateLocalization.firstDayOfWeekIndex());

        this._firstViewDate = dateUtils.normalizeDateByWeek(this._firstViewDate, this._getViewStartByOptions());

        this._setStartDayHour(this._firstViewDate);
    },

    _getOffsetByCount: function(cellIndex) {
        var weekendCount = Math.floor(cellIndex / 5);
        if(weekendCount > 0) {
            return toMs("day") * weekendCount * 2;
        } else {
            return 0;
        }
    },
});

registerComponent("dxSchedulerWorkSpaceWorkWeek", SchedulerWorkSpaceWorkWeek);

module.exports = SchedulerWorkSpaceWorkWeek;
