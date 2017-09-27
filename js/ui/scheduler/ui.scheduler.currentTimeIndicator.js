"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds;

var DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    DATE_TIME_INDICATOR_LINE_CLASS = "dx-scheduler-date-time-indicator-line",
    DATE_TIME_INDICATOR_ALL_DAY_CLASS = "dx-scheduler-date-time-indicator-all-day",
    DATE_TIME_INDICATOR_TOP_CLASS = "dx-scheduler-date-time-indicator-top",
    DATE_TIME_INDICATOR_BOTTOM_CLASS = "dx-scheduler-date-time-indicator-bottom";


var currentTimeIndicator = Class.inherit({
    render: function(workspace, isVertical) {
        this._workspace = workspace;
        this._$container = workspace._dateTableScrollable.content();

        if(isVertical) {
            this._renderVerticalIndicator();
        } else {
            this._renderHorizontalIndicator();
        }
        if(this._$indicator && this._workspace.option("crossScrollingEnabled")) {
            this._$indicator.css("marginTop", -this._$container.outerHeight());
            this._$indicator.css("height", this._$container.outerHeight());
        }
        this._$container.append(this._$indicator);
    },

    _renderVerticalIndicator: function() {
        var indicatorHeight = this._getDateTimeIndicatorHeight(),
            maxHeight = this._$container.outerHeight(),
            renderIndicatorLine = true;

        if(indicatorHeight > maxHeight) {
            indicatorHeight = maxHeight + 1;
            renderIndicatorLine = false;
        }

        if(indicatorHeight > 0) {
            this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
            this._$indicator.height(indicatorHeight);

            var indicatorWidth = this._getVerticalIndicatorWidth();
            var groupCount = this._workspace._getGroupCount() || 1;
            for(var i = 0; i < groupCount; i++) {
                if(renderIndicatorLine) {
                    this._renderIndicatorLine(this._$indicator, indicatorHeight, indicatorWidth, i, true);
                }
                this._renderTopCurrentTimeIndicator(this._$indicator, indicatorHeight, indicatorWidth, i);

                this._renderBottomCurrentTimeIndicator(this._$indicator, maxHeight - indicatorHeight, indicatorWidth, i);

                this._renderAllDayIndicator(indicatorWidth, i);
            }
        }
    },

    _renderHorizontalIndicator: function() {
        var indicatorWidth = this._getHorizontalIndicatorWidth(),
            maxWidth = this._$container.outerWidth(),
            renderIndicatorLine = true;

        if(indicatorWidth > maxWidth) {
            indicatorWidth = maxWidth;
            renderIndicatorLine = false;
        }

        if(indicatorWidth > 0) {
            this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
            this._$indicator.width(indicatorWidth);

            if(renderIndicatorLine) {
                this._renderIndicatorLine(this._$indicator, this._$container.outerHeight(), indicatorWidth, 0);
            }
        }
    },

    _getHorizontalIndicatorWidth: function() {
        var today = this._workspace._getToday(),
            cellWidth = this._workspace.getCellWidth(),
            date = this._workspace._getDateForIndicator(),
            hiddenInterval = this._workspace._getHiddenInterval(),
            timeDiff = today.getTime() - date.getTime();

        var differenceInDays = Math.ceil(timeDiff / toMs("day")) - 1,
            duration = timeDiff - differenceInDays * hiddenInterval,
            cellCount = duration / this._workspace.getCellDuration();

        return cellCount * cellWidth;
    },

    _getVerticalIndicatorWidth: function() {
        var today = this._workspace._getToday(),
            firstViewDate = new Date(this._workspace._firstViewDate),
            maxWidth = this._workspace.getCellWidth() * this._workspace._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this._workspace.getCellWidth();

        return maxWidth < width ? maxWidth : width;
    },

    _getDateTimeIndicatorHeight: function() {
        var today = this._workspace._getToday(),
            cellHeight = this._workspace.getCellHeight(),
            date = new Date(this._workspace._firstViewDate);

        if(this._workspace._needRenderDateTimeIndicatorCells()) {
            date.setDate(today.getDate());
        }

        var duration = today.getTime() - date.getTime(),
            cellCount = duration / this._workspace.getCellDuration();

        return cellCount * cellHeight;
    },

    _getDateTimeIndicatorWidth: function() {
        var today = this._workspace._getToday(),
            firstViewDate = new Date(this._workspace._firstViewDate),
            maxWidth = this._workspace.getCellWidth() * this._workspace._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this._workspace.getCellWidth();

        return maxWidth < width ? maxWidth : width;
    },

    _renderIndicatorLine: function($indicator, height, width, i, isVertical) {
        this._$lineIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_LINE_CLASS);

        if(isVertical) {
            width && this._$lineIndicator.width(this._workspace.getCellWidth());

            this._$lineIndicator.css("marginTop", -this._$container.outerHeight() * i + height);
            this._$lineIndicator.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i + (width - this._workspace.getCellWidth()));
        } else {
            height && this._$lineIndicator.height(height);
            this._$lineIndicator.css("left", width);
        }


        $indicator.append(this._$lineIndicator);
    },

    _renderTopCurrentTimeIndicator: function($indicator, height, width, i) {
        this._$topIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_TOP_CLASS);
        width && this._$topIndicator.width(width) && this._$topIndicator.height(height);

        this._$topIndicator.css("marginTop", -this._$container.outerHeight() * i);
        this._$topIndicator.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

        $indicator.append(this._$topIndicator);
    },

    _renderBottomCurrentTimeIndicator: function($indicator, height, width, i) {
        this._$bottomIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_BOTTOM_CLASS);
        this._$bottomIndicator.width(width - this._workspace.getCellWidth()) && this._$bottomIndicator.height(height);

        this._$bottomIndicator.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

        $indicator.append(this._$bottomIndicator);
    },

    _renderAllDayIndicator: function(indicatorWidth, i) {
        if(this._workspace.option("showAllDayPanel")) {
            this._$allDayIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this._workspace.getAllDayHeight());
            this._$allDayIndicator.width(indicatorWidth);
            this._$allDayIndicator.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

            this._workspace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    clean: function() {
        this._$indicator && this._$indicator.remove();
        this._workspace && this._workspace._$allDayPanel && this._workspace._$allDayPanel.find("." + DATE_TIME_INDICATOR_ALL_DAY_CLASS).remove();
    }
});

module.exports = currentTimeIndicator;
