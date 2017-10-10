"use strict";

var $ = require("../../core/renderer"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space"),
    registerComponent = require("../../core/component_registrator"),
    dateUtils = require("../../core/utils/date"),
    extend = require("../../core/utils/extend").extend,
    toMs = dateUtils.dateToMilliseconds;

var SCHEDULER_DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    TIME_PANEL_CURRENT_TIME_CELL_CLASS = "dx-scheduler-time-panel-current-time-cell";

var SchedulerWorkSpaceIndicator = SchedulerWorkSpace.inherit({
    _getToday: function() {
        return this.option("indicatorTime") || new Date();
    },

    _needRenderDateTimeIndicator: function() {
        var today = this._getToday(),
            endViewDate = dateUtils.trimTime(this.getEndViewDate());

        return dateUtils.dateInRange(today, this._firstViewDate, new Date(endViewDate.getTime() + toMs("day")));
    },

    needRenderDateTimeIndication: function() {
        var today = this._getToday();

        return today >= dateUtils.trimTime(new Date(this.getStartViewDate()));
    },

    _renderDateTimeIndication: function() {
        if(this.needRenderDateTimeIndication()) {
            var isVertical = this._isVerticalShader();

            if(this.option("shadeUntilCurrentTime")) {
                this._shader.render(this);
            }

            if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
                var groupCount = isVertical && this._getGroupCount() || 1,
                    $container = this._dateTableScrollable.$content(),
                    height = this.getIndicationHeight(),
                    rtlOffset = this._getRtlOffset(this.getCellWidth());

                if(height > 0) {
                    this._renderIndicator(height, rtlOffset, $container, groupCount);
                }
            }
        }
    },

    _renderIndicator: function(height, rtlOffset, $container, groupCount) {
        for(var i = 0; i < groupCount; i++) {
            var width = this.getIndicationWidth(i);
            var $indicator = this._createIndicator($container);
            var offset = this._getCellCount() * this._getRoundedCellWidth(i) * i + (width - this.getCellWidth());

            $indicator.width(this.getCellWidth());
            $indicator.css("left", rtlOffset ? rtlOffset - offset : offset);
            $indicator.css("top", height);
        }
    },

    _createIndicator: function($container) {
        var $indicator = $("<div>").addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        $container.append($indicator);

        return $indicator;
    },

    _getRtlOffset: function(width) {
        return this.option("rtlEnabled") ? this._dateTableScrollable.$content().outerWidth() - this.getTimePanelWidth() - width : 0;
    },

    _setIndicationUpdateInterval: function() {
        if(!this.option("showCurrentTimeIndicator") || this.option("indicatorUpdateInterval") === 0) {
            return;
        }

        this._clearIndicatorUpdateInterval();

        this._indicatorInterval = setInterval(function() {
            this._refreshDateTimeIndication();
        }.bind(this), this.option("indicatorUpdateInterval"));
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

    getIndicationWidth: function(groupIndex) {
        var today = this._getToday(),
            firstViewDate = new Date(this._firstViewDate),
            maxWidth = this.getCellWidth() * this._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this._getRoundedCellWidth(groupIndex, difference);

        return maxWidth < width ? maxWidth : width;
    },

    _getRoundedCellWidth: function(groupIndex, cellCount) {
        if(groupIndex < 0) {
            return 0;
        }

        var $row = this.$element().find("." + this._getDateTableRowClass()).eq(0),
            width = 0,
            $cells = $row.find("." + this._getDateTableCellClass()),
            totalCellCount = this._getCellCount() * groupIndex;

        cellCount = cellCount || this._getCellCount();

        for(var i = totalCellCount; i < totalCellCount + cellCount; i++) {
            width = width + $($cells).eq(i).outerWidth();
        }

        return width / cellCount;
    },

    getIndicationHeight: function() {
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
            var today = this._getToday(),
                result = false;
            date = new Date(date);

            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());

            var startCellDate = new Date(date),
                endCellDate = new Date(date);

            if(dateUtils.sameDate(today, date)) {
                startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration());
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(today, startCellDate, endCellDate);
            }
            return result;
        }
    },

    _getTimeCellClass: function(i) {
        var startViewDate = this._getTimeCellDate(i),
            cellClass = this.callBase(i);

        if(this._isCurrentTime(startViewDate)) {
            return cellClass + " " + TIME_PANEL_CURRENT_TIME_CELL_CLASS;
        }

        return cellClass;
    },

    _cleanView: function() {
        this.callBase();

        this._cleanDateTimeIndicator();
    },

    _dimensionChanged: function() {
        this.callBase();

        this._refreshDateTimeIndication();
    },

    _cleanDateTimeIndicator: function() {
        this.$element().find("." + SCHEDULER_DATE_TIME_INDICATOR_CLASS).remove();
    },

    _optionChanged: function(args) {

        switch(args.name) {
            case "showCurrentTimeIndicator":
            case "indicatorTime":
                this._cleanWorkSpace();
                break;
            case "indicatorUpdateInterval":
                this._setIndicationUpdateInterval();
                break;
            case "showAllDayPanel":
                this.callBase(args);
                this._refreshDateTimeIndication();
                break;
            case "allDayExpanded":
                this.callBase(args);
                this._refreshDateTimeIndication();
                break;
            case "crossScrollingEnabled":
                this.callBase(args);
                this._refreshDateTimeIndication();
                break;
            case "shadeUntilCurrentTime":
                this._refreshDateTimeIndication();
                break;
            default:
                this.callBase(args);
        }
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            showCurrentTimeIndicator: true,
            indicatorTime: new Date(),
            indicatorUpdateInterval: 5 * toMs("minute"),
            shadeUntilCurrentTime: true
        });
    }
});

registerComponent("dxSchedulerWorkSpace", SchedulerWorkSpaceIndicator);
module.exports = SchedulerWorkSpaceIndicator;
