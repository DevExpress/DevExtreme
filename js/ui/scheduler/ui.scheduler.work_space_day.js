"use strict";

var registerComponent = require("../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space.indicator");

var DAY_CLASS = "dx-scheduler-work-space-day",
    LAST_GROUP_CELL_CLASS = "dx-scheduler-last-group-cell";

var SchedulerWorkSpaceDay = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return DAY_CLASS;
    },

    _getRowCount: function() {
        return this._getCellCountInDay();
    },

    _getCellCount: function() {
        return this.option("intervalCount");
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate);
    },

    _getDateByIndex: function(headerIndex) {
        if(this.option("intervalCount") === 1) {
            return this._firstViewDate;
        }

        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _renderDateHeader: function() {
        if(this.option("intervalCount") === 1) {
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
    },

    _getDateTableCellClass: function(i, j) {
        var cellClass = this.callBase(i);

        return this._addLastGroupCellClass(cellClass, j + 1);
    },

    _getAllDayPanelCellClass: function(i, j) {
        var cellClass = this.callBase(i);

        return this._addLastGroupCellClass(cellClass, j + 1);
    },

    _getHeaderPanelCellClass: function(i) {
        var cellClass = this.callBase(i);

        return this._addLastGroupCellClass(cellClass, i + 1);
    },

    _addLastGroupCellClass: function(cellClass, index) {
        if(this._isWorkSpaceWithCount() && (index % this.option("intervalCount")) === 0) {
            return cellClass + " " + LAST_GROUP_CELL_CLASS;
        }

        return cellClass;
    }
});

registerComponent("dxSchedulerWorkSpaceDay", SchedulerWorkSpaceDay);

module.exports = SchedulerWorkSpaceDay;
