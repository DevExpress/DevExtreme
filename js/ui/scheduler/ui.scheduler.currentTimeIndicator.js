"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds;

var DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    DATE_TIME_INDICATOR_ALL_DAY_CLASS = "dx-scheduler-date-time-indicator-all-day",
    DATE_TIME_INDICATOR_CONTENT_CLASS = "dx-scheduler-date-time-indicator-content",
    DATE_TIME_INDICATOR_TOP_CLASS = "dx-scheduler-date-time-indicator-top",
    DATE_TIME_INDICATOR_BOTTOM_CLASS = "dx-scheduler-date-time-indicator-bottom";

var currentTimeIndicator = Class.inherit({
    render: function(isVertical, workspace) {
        this.workspace = workspace;
        this.$container = workspace._dateTableScrollable.content();

        if(isVertical) {
            this._renderVerticalIndicator();
        } else {
            this._renderHorizontalIndicator();
        }

    },

    _renderVerticalIndicator: function() {
        var indicatorHeight = this._getDateTimeIndicatorHeight(),
            maxHeight = this.$container.outerHeight(),
            renderIndicatorContent = true;

        if(indicatorHeight > maxHeight) {
            indicatorHeight = maxHeight + 1;
            renderIndicatorContent = false;
        }

        if(indicatorHeight > 0) {
            this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
            this._$indicator.height(indicatorHeight);

            var indicatorWidth = this._getVerticalIndicatorWidth();
            var groupCount = this.workspace._getGroupCount() || 1;
            for(var i = 0; i < groupCount; i++) {
                this._renderTopCurrentTimeIndicator(this._$indicator, indicatorHeight, indicatorWidth, i);

                this._renderBottomCurrentTimeIndicator(this._$indicator, maxHeight - indicatorHeight, indicatorWidth, i);

                this._renderAllDayIndicator(indicatorWidth, i);
            }
            if(renderIndicatorContent) {
                var $content = $("<div>").addClass(DATE_TIME_INDICATOR_CONTENT_CLASS).addClass("dx-icon-spinright");
                $content.css("top", indicatorHeight - 10);
                this._$indicator.append($content);
            }
            this.$container.append(this._$indicator);
        }
    },

    _renderHorizontalIndicator: function() {
        var indicatorWidth = this._getHorizontalIndicatorWidth(),
            maxWidth = this.$container.outerWidth(),
            renderIndicatorContent = true;

        if(indicatorWidth > maxWidth) {
            indicatorWidth = maxWidth;
            renderIndicatorContent = false;
        }

        if(indicatorWidth > 0) {
            this._$indicator = $("<div>").addClass(DATE_TIME_INDICATOR_CLASS);
            this._$indicator.width(indicatorWidth);

            if(renderIndicatorContent) {
                var $content = $("<div>").addClass(DATE_TIME_INDICATOR_CONTENT_CLASS).addClass("dx-icon-spindown");
                $content.css("left", indicatorWidth - 16);
                this._$indicator.append($content);
            }
            this.$container.append(this._$indicator);
        }
    },

    _getHorizontalIndicatorWidth: function() {
        var today = this.workspace._getToday(),
            cellWidth = this.workspace.getCellWidth(),
            date = this.workspace._getDateForIndicator(),
            hiddenInterval = this.workspace._getHiddenInterval(),
            timeDiff = today.getTime() - date.getTime();

        var differenceInDays = Math.ceil(timeDiff / toMs("day")) - 1,
            duration = timeDiff - differenceInDays * hiddenInterval,
            cellCount = duration / this.workspace.getCellDuration();

        return cellCount * cellWidth;
    },

    _getVerticalIndicatorWidth: function() {
        var today = this.workspace._getToday(),
            firstViewDate = new Date(this.workspace._firstViewDate),
            maxWidth = this.workspace.getCellWidth() * this.workspace._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this.workspace.getCellWidth();

        return maxWidth < width ? maxWidth : width;
    },

    _getDateTimeIndicatorHeight: function() {
        var today = this.workspace._getToday(),
            cellHeight = this.workspace.getCellHeight(),
            date = new Date(this.workspace._firstViewDate);

        if(this.workspace._needRenderDateTimeIndicatorCells()) {
            date.setDate(today.getDate());
        }

        var duration = today.getTime() - date.getTime(),
            cellCount = duration / this.workspace.getCellDuration();

        return cellCount * cellHeight;
    },

    _getDateTimeIndicatorWidth: function() {
        var today = this.workspace._getToday(),
            firstViewDate = new Date(this.workspace._firstViewDate),
            maxWidth = this.workspace.getCellWidth() * this.workspace._getCellCount();

        var timeDiff = today.getTime() - firstViewDate.getTime(),
            difference = Math.ceil(timeDiff / toMs("day")),
            width = difference * this.workspace.getCellWidth();

        return maxWidth < width ? maxWidth : width;
    },

    _renderTopCurrentTimeIndicator: function($indicator, height, width, i) {
        this._$topIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_TOP_CLASS);
        width && this._$topIndicator.width(width) && this._$topIndicator.height(height);

        this._$topIndicator.css("marginTop", -this.$container.outerHeight() * i);
        this._$topIndicator.css("left", this.workspace._getCellCount() * this.workspace.getCellWidth() * i);

        $indicator.append(this._$topIndicator);
    },

    _renderBottomCurrentTimeIndicator: function($indicator, height, width, i) {
        this._$bottomIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_BOTTOM_CLASS);
        this._$bottomIndicator.width(width - this.workspace.getCellWidth()) && this._$bottomIndicator.height(height);

        this._$bottomIndicator.css("left", this.workspace._getCellCount() * this.workspace.getCellWidth() * i);

        $indicator.append(this._$bottomIndicator);
    },

    _renderAllDayIndicator: function(indicatorWidth, i) {
        if(this.workspace.option("showAllDayPanel")) {
            this._$allDayIndicator = $("<div>").addClass(DATE_TIME_INDICATOR_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this.workspace.getAllDayHeight());
            this._$allDayIndicator.width(indicatorWidth);
            this._$allDayIndicator.css("left", this.workspace._getCellCount() * this.workspace.getCellWidth() * i);

            this.workspace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    clean: function() {
        this._$indicator && this._$indicator.remove();
        this.workspace && this.workspace._$allDayPanel && this.workspace._$allDayPanel.find("." + DATE_TIME_INDICATOR_ALL_DAY_CLASS).remove();
    }
});

module.exports = currentTimeIndicator;
