"use strict";

var Shader = require("./ui.scheduler.currentTimeShader");

var HorizontalCurrentTimeShader = Shader.inherit({
    _renderShader: function() {
        var shaderWidth = this._workspace.getIndicationWidth(),
            maxWidth = this._$container.outerWidth();

        if(shaderWidth > maxWidth) {
            shaderWidth = maxWidth;
        }

        if(shaderWidth > 0) {
            this._$shader.width(shaderWidth);
        }
    },
});

module.exports = HorizontalCurrentTimeShader;
