"use strict";

var $ = require("../../core/renderer"),
    Shader = require("./ui.scheduler.currentTimeShader");

var DATE_TIME_SHADER_ALL_DAY_CLASS = "dx-scheduler-date-time-shader-all-day",
    DATE_TIME_SHADER_TOP_CLASS = "dx-scheduler-date-time-shader-top",
    DATE_TIME_SHADER_BOTTOM_CLASS = "dx-scheduler-date-time-shader-bottom";

var VerticalCurrentTimeShader = Shader.inherit({
    _renderShader: function() {
        var shaderHeight = this._workspace.getIndicationHeight(),
            maxHeight = this._$container.outerHeight();

        if(shaderHeight > maxHeight) {
            shaderHeight = maxHeight;
        }

        if(shaderHeight >= 0) {
            this._$shader.height(shaderHeight);

            var groupCount = this._workspace._getGroupCount() || 1;
            for(var i = 0; i < groupCount; i++) {
                var shaderWidth = this._workspace.getIndicationWidth(i);
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
        this._$topShader.css("left", this._getShaderOffset(i, width));

        $shader.append(this._$topShader);
    },

    _renderBottomShader: function($shader, height, width, i) {
        this._$bottomShader = $("<div>").addClass(DATE_TIME_SHADER_BOTTOM_CLASS);
        this._$bottomShader.width(width - this._workspace.getCellWidth()) && this._$bottomShader.height(height);

        this._$bottomShader.css("left", this._getShaderOffset(i, width - this._workspace.getCellWidth()));

        $shader.append(this._$bottomShader);
    },

    _renderAllDayShader: function(shaderWidth, i) {
        if(this._workspace.option("showAllDayPanel")) {
            this._$allDayIndicator = $("<div>").addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this._workspace.getAllDayHeight());
            this._$allDayIndicator.width(shaderWidth);
            this._$allDayIndicator.css("left", this._getShaderOffset(i, shaderWidth));

            this._workspace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    _getShaderOffset: function(i, width) {
        var offset = this._workspace._getCellCount() * this._workspace._getRoundedCellWidth(i - 1) * i;
        return this._workspace.option("rtlEnabled") ? this._$container.outerWidth() - offset - this._workspace.getTimePanelWidth() - width : offset;
    },

    clean: function() {
        this.callBase();

        this._workspace && this._workspace._$allDayPanel && this._workspace._$allDayPanel.find("." + DATE_TIME_SHADER_ALL_DAY_CLASS).remove();
    }
});

module.exports = VerticalCurrentTimeShader;
