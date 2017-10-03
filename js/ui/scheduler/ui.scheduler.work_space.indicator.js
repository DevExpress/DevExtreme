"use strict";

var $ = require("../../core/renderer"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space"),
    registerComponent = require("../../core/component_registrator"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds;

var SCHEDULER_DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    TIME_PANEL_CURRENT_TIME_CELL_CLASS = "dx-scheduler-time-panel-current-time-cell";

var SchedulerWorkSpaceIndicator = SchedulerWorkSpace.inherit({
    _getToday: function() {
        return this.option("indicatorTime") || new Date();
    },

    _needRenderDateTimeIndicator: function() {
        var now = this._getToday(),
            endViewDate = dateUtils.trimTime(this.getEndViewDate());

        return dateUtils.dateInRange(now, this._firstViewDate, new Date(endViewDate.getTime() + toMs("day")));
    },

    needRenderDateTimeIndication: function() {
        var now = this._getToday();

        return now >= dateUtils.trimTime(new Date(this.getStartViewDate()));
    },

    _renderDateTimeIndication: function() {
        if(this.needRenderDateTimeIndication()) {
            var isVertical = this._isVerticalShader();

            if(this.option("shadeUntilNow")) {
                this._shader.render(this);
            }

            if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
                var groupCount = isVertical && this._getGroupCount() || 1,
                    $container = this._dateTableScrollable.content(),
                    width = this._getIndicationWidth(),
                    height = this._getIndicationHeight();

                if(height > 0) {
                    for(var i = 0; i < groupCount; i++) {
                        var $indicator = $("<div>").addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);

                        if(isVertical) {
                            $indicator.width(this.getCellWidth());
                            $indicator.css("left", this._getCellCount() * this._getRoundedCellWidth() * i + (width - this._getRoundedCellWidth()));
                        } else {
                            $indicator.height($container.outerHeight());
                            $indicator.css("left", width);
                        }

                        $container.append($indicator);
                    }
                }
            }
        }
    },

    _setIndicationUpdateInterval: function() {
        if(!this.option("showCurrentTimeIndicator") || this.option("indicatorUpdateInterval") === 0) {
            return;
        }
        var that = this;
        this._clearIndicatorUpdateInterval();

        this._indicatorInterval = setInterval(function() {
            that._refreshDateTimeIndication();
        }, this.option("indicatorUpdateInterval"));
    },

    _clearIndicatorUpdateInterval: function() {
        if(this._indicatorInterval) {
            clearInterval(this._indicatorInterval);
            delete this._indicatorInterval;
        }
    },

    _isVerticalShader: function() {
        return true;
    },

    _getIndicationWidth: function() {
        var today = this._getToday(),
            firstViewDate = new Date(this._firstViewDate),
            maxWidth = this.getCellWidth() * this._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this.getCellWidth();

        return maxWidth < width ? maxWidth : width;
    },

    _getRoundedCellWidth: function() {
        var $row = this.$element().find("." + this._getDateTableRowClass()).eq(0),
            width = 0,
            $cells = $row.find("." + this._getDateTableCellClass()),
            cellsCount = $cells.length;

        $cells.each(function(_, cell) {

            width = width + $(cell).outerWidth();
        });

        return width / cellsCount;
    },

    _getIndicationHeight: function() {
        var today = this._getToday(),
            cellHeight = this.getCellHeight(),
            date = new Date(this._firstViewDate);

        if(this._needRenderDateTimeIndicator()) {
            date.setDate(today.getDate());
        }

        var duration = today.getTime() - date.getTime(),
            cellCount = duration / this.getCellDuration();

        return cellCount * cellHeight;
    },

    _dispose: function() {
        this._clearIndicatorUpdateInterval();
        this.callBase.apply(this, arguments);
    },

    _refreshDateTimeIndication: function() {
        this._cleanDateTimeIndicator();
        this._shader && this._shader.clean();
        this._renderDateTimeIndication();
    },

    _isCurrentTime: function(date) {
        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var now = this._getToday(),
                result = false;
            date = new Date(date);

            date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

            var startCellDate = new Date(date),
                endCellDate = new Date(date);

            if(dateUtils.sameDate(now, date)) {
                startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration());
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(now, startCellDate, endCellDate);
            }
            return result;
        }
    },

    _getTimeCellClass: function(i) {
        var startViewDate = this._getTimeCellDate(i),
            cellClass = this.callBase(i);

        if(this._isCurrentTime(startViewDate)) {
            return cellClass + " " + TIME_PANEL_CURRENT_TIME_CELL_CLASS;
        } else {
            return cellClass;
        }
    },
});

registerComponent("dxSchedulerWorkSpace", SchedulerWorkSpaceIndicator);
module.exports = SchedulerWorkSpaceIndicator;
