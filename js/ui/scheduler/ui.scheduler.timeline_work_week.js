"use strict";

var registerComponent = require("../../core/component_registrator"),
    SchedulerTimelineWeek = require("./ui.scheduler.timeline_week"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds;

var TIMELINE_CLASS = "dx-scheduler-timeline-work-week",
    MONDAY_INDEX = 1;

// var weekendCounter = 0,
//     weekCounter = 0;

var SchedulerTimelineWorkWeek = SchedulerTimelineWeek.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getWeekDuration: function() {
        return 5;
    },

    _firstDayOfWeek: function() {
        return this.option("firstDayOfWeek") || MONDAY_INDEX;
    },

    _getOffsetByCount: function(cellIndex, rowIndex) {
        var weekendCount = Math.floor(cellIndex / (5 * this._getCellCountInDay()));
        if(weekendCount > 0) {
            return toMs("day") * weekendCount * 2;
        } else {
            return 0;
        }
    },

    // _getDateByIndex: function(headerIndex) {
    //     var resultDate = new Date(this._firstViewDate);

    //     resultDate.setDate(this._firstViewDate.getDate() + headerIndex + weekendCounter);
    //     var nextDay = resultDate.getDay() + 1;

    //     if(nextDay % 6 === 0) {
    //         weekendCounter = 2;

    //         if(nextDay === 6) {
    //             weekCounter++;
    //             weekendCounter *= weekCounter;
    //         }
    //     }
    //     return resultDate;
    // },

    _setFirstViewDate: function() {
        this._firstViewDate = dateUtils.getFirstWeekDate(this.option("currentDate"), this._firstDayOfWeek());

        this._firstViewDate = dateUtils.normalizeDateByWeek(this._firstViewDate, this.option("currentDate"));

        this._setStartDayHour(this._firstViewDate);
    }
});

registerComponent("dxSchedulerTimelineWorkWeek", SchedulerTimelineWorkWeek);

module.exports = SchedulerTimelineWorkWeek;
