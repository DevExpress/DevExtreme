import $ from "../../../core/renderer";
import SchedulerWorkSpace from "./ui.scheduler.work_space";
import registerComponent from "../../../core/component_registrator";
import dateUtils from "../../../core/utils/date";
import { extend } from "../../../core/utils/extend";
import windowUtils from "../../../core/utils/window";

const toMs = dateUtils.dateToMilliseconds;

const SCHEDULER_DATE_TIME_INDICATOR_CLASS = "dx-scheduler-date-time-indicator",
    TIME_PANEL_CURRENT_TIME_CELL_CLASS = "dx-scheduler-time-panel-current-time-cell",
    HEADER_CURRENT_TIME_CELL_CLASS = "dx-scheduler-header-panel-current-time-cell";

var SchedulerWorkSpaceIndicator = SchedulerWorkSpace.inherit({
    _getToday: function() {
        var date = this.option("indicatorTime") || new Date();

        return this.invoke("convertDateByTimezone", date) || date;
    },

    _needRenderDateTimeIndicator: function() {
        var today = this._getToday(),
            endViewDate = dateUtils.trimTime(this.getEndViewDate());

        return dateUtils.dateInRange(today, this._firstViewDate, new Date(endViewDate.getTime() + toMs("day")));
    },

    needRenderDateTimeIndication: function() {
        if(!windowUtils.hasWindow()) {
            return false;
        }

        var today = this._getToday();

        return today >= dateUtils.trimTime(new Date(this.getStartViewDate()));
    },

    _renderDateTimeIndication: function() {
        if(this.needRenderDateTimeIndication()) {
            if(this.option("shadeUntilCurrentTime")) {
                this._shader.render(this);
            }

            if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
                var groupCount = this._getGroupCount() || 1,
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
            var $indicator = this._createIndicator($container);

            $indicator.width(this.getCellWidth());
            this._groupedStrategy.shiftIndicator($indicator, height, rtlOffset, i);
        }
    },

    _createIndicator: function($container) {
        var $indicator = $("<div>").addClass(SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        $container.append($indicator);

        return $indicator;
    },

    _getRtlOffset: function(width) {
        return this.option("rtlEnabled") ? this._dateTableScrollable.$content().get(0).getBoundingClientRect().width - this.getTimePanelWidth() - width : 0;
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
        var maxWidth = this.getCellWidth() * this._getCellCount();

        var difference = this._getIndicatorDuration();
        if(difference > this._getCellCount()) {
            difference = this._getCellCount();
        }
        var width = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);

        return maxWidth < width ? maxWidth : width;
    },

    getIndicatorOffset: function(groupIndex) {
        var difference = this._getIndicatorDuration() - 1,
            offset = difference * this.getRoundedCellWidth(groupIndex, groupIndex * this._getCellCount(), difference);

        return offset;
    },

    _getIndicatorDuration: function() {
        let today = this._getToday(),
            firstViewDate = new Date(this._firstViewDate);
        let timeDiff = today.getTime() - firstViewDate.getTime();
        if(this.option('type') === 'workWeek') {
            timeDiff = timeDiff - (this._getWeekendsCount(Math.round(timeDiff / toMs("day"))) * toMs("day"));
        }

        return Math.ceil((timeDiff + 1) / toMs("day"));
    },

    getIndicationHeight: function() {
        var today = this._getToday(),
            cellHeight = this.getCellHeight(),
            date = new Date(this._firstViewDate);

        if(this._needRenderDateTimeIndicator()) {
            date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
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
                startCellDate = startCellDate.setMilliseconds(date.getMilliseconds() - this.getCellDuration() + 1);
                endCellDate = endCellDate.setMilliseconds(date.getMilliseconds() + this.getCellDuration());

                result = dateUtils.dateInRange(today, startCellDate, endCellDate);
            }
            return result;
        }
    },

    _isCurrentTimeHeaderCell: function(headerIndex) {
        var result = false;

        if(this.option("showCurrentTimeIndicator") && this._needRenderDateTimeIndicator()) {
            var date = this._getDateByIndex(headerIndex),
                now = this.option("indicatorTime") || new Date();

            result = dateUtils.sameDate(date, now);
        }

        return result;
    },

    _getTimeCellClass: function(i) {
        var startViewDate = this._getTimeCellDate(i),
            cellClass = this.callBase(i);

        if(this._isCurrentTime(startViewDate)) {
            return cellClass + " " + TIME_PANEL_CURRENT_TIME_CELL_CLASS;
        }

        return cellClass;
    },

    _getHeaderPanelCellClass: function(i) {
        var cellClass = this.callBase(i);

        if(this._isCurrentTimeHeaderCell(i)) {
            return cellClass + " " + HEADER_CURRENT_TIME_CELL_CLASS;
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

    _cleanWorkSpace: function() {
        this.callBase();

        this._renderDateTimeIndication();
        this._setIndicationUpdateInterval();
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
