"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class");

var DATE_TIME_SHADER_CLASS = "dx-scheduler-date-time-shader";

var currentTimeShader = Class.inherit({
    render: function(workspace) {
        this._workspace = workspace;
        this._$container = workspace._dateTableScrollable.$content();

        this._$shader = $("<div>").addClass(DATE_TIME_SHADER_CLASS);
        this._$container.append(this._$shader);
        this._renderShader();

        if(this._$shader && this._workspace.option("crossScrollingEnabled")) {
            this._$shader.css("marginTop", -this._$container.outerHeight());
            this._$shader.css("height", this._$container.outerHeight());
        }
    },

    clean: function() {
        this._$container && this._$container.find("." + DATE_TIME_SHADER_CLASS).remove();
    }
});

module.exports = currentTimeShader;
