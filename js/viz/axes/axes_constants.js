"use strict";

var isFunction = require("../../core/utils/type").isFunction,
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
        return mode === "ignore" || mode === "none" ? mode : "hide";
    },

    formatLabel: function(value, options, axisMinMax, point) {
        var formatObject = getFormatObject(value, options, axisMinMax, point);
        return isFunction(options.customizeText) ? options.customizeText.call(formatObject, formatObject) : formatObject.valueText;
    },

    formatHint: function(value, options, axisMinMax) {
        var formatObject = getFormatObject(value, options, axisMinMax);
        return isFunction(options.customizeHint) ? options.customizeHint.call(formatObject, formatObject) : undefined;
    },

    getTicksCountInRange: function(ticks, valueKey, range) {
        var i = 1;

        if(ticks.length > 1) {
            for(; i < ticks.length; i++) {
                if(Math.abs(ticks[i][valueKey] - ticks[0][valueKey]) >= range) {
                    break;
                }
            }
        }
        return i;
    },

    areLabelsOverlap: function(bBox1, bBox2, spacing) {
        var horizontalInverted = bBox1.x > bBox2.x,
            verticalInverted = bBox1.y > bBox2.y,
            hasHorizontalOverlapping = horizontalInverted ? (bBox2.x + bBox2.width + spacing) > bBox1.x : (bBox1.x + bBox1.width + spacing) > bBox2.x,
            hasVerticalOverlapping = verticalInverted ? (bBox2.y + bBox2.height) > bBox1.y : (bBox1.y + bBox1.height) > bBox2.y;

        return hasHorizontalOverlapping && hasVerticalOverlapping;
    }
};
