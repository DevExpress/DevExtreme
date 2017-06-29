"use strict";

var noop = require("../../core/utils/common").noop,
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds,
    registerComponent = require("../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space");

var DAY_CLASS = "dx-scheduler-work-space-day";

var SchedulerWorkSpaceDay = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return DAY_CLASS;
    },

    _getRowCount: function() {
        return this._getCellCountInDay();
    },

    _getCellCount: function() {
        return 1;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this.option("currentDate");
        this._setStartDayHour(this._firstViewDate);
    },

    _getDateByIndex: function() {
        return this._firstViewDate;
    },

    _getFormat: function() {
        return "longdate";
    },

    _renderDateHeader: noop,

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
    },

    _getOffsetByCount: function() {
        return toMs("day");
    },

});

registerComponent("dxSchedulerWorkSpaceDay", SchedulerWorkSpaceDay);

module.exports = SchedulerWorkSpaceDay;
