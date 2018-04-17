"use strict";

var Shader = require("./ui.scheduler.currentTimeShader");

var HorizontalCurrentTimeShader = Shader.inherit({
    _renderShader: function() {
        var groupCount = this._workspace.option("groupOrientation") === "horizontal" ? this._workspace._getGroupCount() : 1;

        this._customizeShader(this._$shader, 0);

        if(groupCount > 1) {
            for(var i = 1; i < groupCount; i++) {
                var $shader = this._createShader();
                this._customizeShader($shader, 1);
                this._shader.push($shader);
            }
        }
    },

    _customizeShader: function($shader, groupIndex) {
        var shaderWidth = this._workspace.getIndicationWidth(),
            maxWidth = this._$container.outerWidth();

        if(shaderWidth > maxWidth) {
            shaderWidth = maxWidth;
        }

        if(shaderWidth > 0) {
            $shader.width(shaderWidth);
        }

        $shader.css("left", this._workspace._getCellCount() * this._workspace.getCellWidth() * groupIndex);
    },
});

module.exports = HorizontalCurrentTimeShader;
