"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    dateUtils = require("../../core/utils/date"),
    toMs = dateUtils.dateToMilliseconds;

var DATE_TIME_SHADER_CLASS = "dx-scheduler-date-time-shader",
    DATE_TIME_SHADER_ALL_DAY_CLASS = "dx-scheduler-date-time-shader-all-day",
    DATE_TIME_SHADER_TOP_CLASS = "dx-scheduler-date-time-shader-top",
    DATE_TIME_SHADER_BOTTOM_CLASS = "dx-scheduler-date-time-shader-bottom";


var currentTimeShader = Class.inherit({
    render: function(workspace, isVertical) {
        this._workspace = workspace;
        this._$container = workspace._dateTableScrollable.content();

        if(isVertical) {
            this._renderVerticalShader();
        } else {
            this._renderHorizontalShader();
        }
        if(this._$shader && this._workspace.option("crossScrollingEnabled")) {
            this._$shader.css("marginTop", -this._$container.outerHeight());
            this._$shader.css("height", this._$container.outerHeight());
        }
        this._$container.append(this._$shader);
    },

    _renderVerticalShader: function() {
        var shaderHeight = this._workspace._getShaderHeight(),
            maxHeight = this._$container.outerHeight();
            //renderIndicatorLine = true;

        if(shaderHeight > maxHeight) {
            shaderHeight = maxHeight;
            //renderIndicatorLine = false;
        }

        if(shaderHeight > 0) {
            this._$shader = $("<div>").addClass(DATE_TIME_SHADER_CLASS);
            this._$shader.height(shaderHeight);

            var shaderWidth = this._workspace._getShaderWidth();
            var groupCount = this._workspace._getGroupCount() || 1;
            for(var i = 0; i < groupCount; i++) {
                // if(renderIndicatorLine) {
                //     this._renderIndicatorLine(this._$indicator, indicatorHeight, indicatorWidth, i, true);
                // }
                this._renderTopShader(this._$shader, shaderHeight, shaderWidth, i);

                this._renderBottomShader(this._$shader, maxHeight - shaderHeight, shaderWidth, i);

                this._renderAllDayShader(shaderWidth, i);
            }
        }
    },

    _renderTopShader: function($shader, height, width, i) {
        this._$topShader = $("<div>").addClass(DATE_TIME_SHADER_TOP_CLASS);
        width && this._$topShader.width(width) && this._$topShader.height(height);

        this._$topShader.css("marginTop", -this._$container.outerHeight() * i);
        this._$topShader.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

        $shader.append(this._$topShader);
    },

    _renderBottomShader: function($shader, height, width, i) {
        this._$bottomShader = $("<div>").addClass(DATE_TIME_SHADER_BOTTOM_CLASS);
        this._$bottomShader.width(width - this._workspace.getCellWidth()) && this._$bottomShader.height(height);

        this._$bottomShader.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

        $shader.append(this._$bottomShader);
    },

    _renderAllDayShader: function(shaderWidth, i) {
        if(this._workspace.option("showAllDayPanel")) {
            this._$allDayIndicator = $("<div>").addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this._workspace.getAllDayHeight());
            this._$allDayIndicator.width(shaderWidth);
            this._$allDayIndicator.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * i);

            this._workspace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    _renderHorizontalShader: function() {
        var shaderWidth = this._workspace._getShaderWidth(),
            maxWidth = this._$container.outerWidth();
            //renderIndicatorLine = true;

        if(shaderWidth > maxWidth) {
            shaderWidth = maxWidth;
            //renderIndicatorLine = false;
        }

        if(shaderWidth > 0) {
            this._$shader = $("<div>").addClass(DATE_TIME_SHADER_CLASS);
            this._$shader.width(shaderWidth);

            // if(renderIndicatorLine) {
            //     this._renderIndicatorLine(this._$indicator, this._$container.outerHeight(), indicatorWidth, 0);
            // }
        }
    },

    _getHorizontalShaderWidth: function() {
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

    clean: function() {
        this._$shader && this._$shader.remove();
        this._workspace && this._workspace._$allDayPanel && this._workspace._$allDayPanel.find("." + DATE_TIME_SHADER_ALL_DAY_CLASS).remove();
    }
});

module.exports = currentTimeShader;
