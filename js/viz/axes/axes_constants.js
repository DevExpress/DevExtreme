"use strict";

var $ = require("jquery"),
    _map = require("../core/utils").map,
    _format = require("../core/format");

function getFormatObject(value, options, axisMinMax, point) {
    var formatObject = {
        value: value,
        valueText: _format(value, options) || ""
    };
    //B252346
    if(axisMinMax) {
        formatObject.min = axisMinMax.min;
        formatObject.max = axisMinMax.max;
    }

    //for crosshair's customizeText
    if(point) {
        formatObject.point = point;
    }

    return formatObject;
}

module.exports = {
    logarithmic: "logarithmic",
    discrete: "discrete",
    numeric: "numeric",

    left: "left",
    right: "right",
    top: "top",
    bottom: "bottom",
    center: "center",

    canvasPositionPrefix: "canvas_position_",
    canvasPositionTop: "canvas_position_top",
    canvasPositionBottom: "canvas_position_bottom",
    canvasPositionLeft: "canvas_position_left",
    canvasPositionRight: "canvas_position_right",
    canvasPositionStart: "canvas_position_start",
    canvasPositionEnd: "canvas_position_end",

    horizontal: "horizontal",
    vertical: "vertical",

    convertTicksToValues: function(ticks) {
        return _map(ticks || [], function(item) {
            return item.value;
        });
    },

    convertValuesToTicks: function(values) {
        return _map(values || [], function(item) {
            return { value: item };
        });
    },

    validateOverlappingMode: function(mode) {
        return mode !== "ignore" ? "enlargeTickInterval" : "ignore";
    },

    formatLabel: function(value, options, axisMinMax, point) {
        var formatObject = getFormatObject(value, options, axisMinMax, point);
        return $.isFunction(options.customizeText) ? options.customizeText.call(formatObject, formatObject) : formatObject.valueText;
    },

    formatHint: function(value, options, axisMinMax) {
        var formatObject = getFormatObject(value, options, axisMinMax);
        return $.isFunction(options.customizeHint) ? options.customizeHint.call(formatObject, formatObject) : undefined;
    }
};
